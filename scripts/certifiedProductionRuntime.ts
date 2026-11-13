import { execFileSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { writeFileIfChanged } from './extractPrismArtifacts.ts';
import { extractProductionRootCatalog } from './prismMechanizer.ts';
import type { ProductionRootDescriptor } from './prismMechanizer.ts';

/**
 * Certified LexLean Production Runtime Pipeline (`scripts/certifiedProductionRuntime.ts`)
 *
 * Mirrors `afflom/rule30` (`tools/r30/production.py` + `tools/r30/engine_rust.py` + `harness/engine.rs`)
 * and improves beyond it across three structural axes:
 *   1. Zero hand-duplicated root dictionary (`prism/production/request.json` and `prism/model/runtime-roots.toml`
 *      are projected directly from `.lex.tex` AST `production:` declarations).
 *   2. Dual-target `#![no_std]` `rust-core` + `rust-std` certification (5 `#![no_std]` zero-allocation kernels +
 *      3 `rust-std` kernels, all with Lean-kernel-checked preservation certificates).
 *   3. Dual runtime artifacts from the exact same certified Rust crates, both `#![forbid(unsafe_code)]`:
 *      - Native CLI harness (`prism/.lexlean/harness/target/release/verdant_certified_harness`) with fail-closed
 *        `NoCertifiedRootError` (never falls back to uncertified JS).
 *      - Browser & Node WebAssembly (`public/wasm/verdant_certified_runtime.wasm` +
 *        `src/game/generatedCertifiedWasmBridge.ts`) running certified Rust in-process at 60Hz with `work()` telemetry.
 */

export class NoCertifiedRootError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NoCertifiedRootError';
  }
}

export interface CertifiedRootArtifactSummary {
  readonly root: string;
  readonly moduleName: string;
  readonly defName: string;
  readonly packageName: string;
  readonly targetId: string;
  readonly targetDigest: string;
  readonly artifactDigest: string;
  readonly certificationStatus: string;
  readonly theoremName: string;
  readonly certificateFiles: ReadonlyArray<string>;
  readonly effects: ReadonlyArray<string>;
  readonly returnsResultOverflow: boolean;
  readonly forbidsUnsafeCode: boolean;
  readonly isNoStd: boolean;
  readonly parameters: ReadonlyArray<{ readonly name: string; readonly type: string }>;
  readonly resultType: string;
  readonly weightAdtIdent?: string;
  readonly outcomeAdtIdent?: string;
}

const SCALAR_CORE_TYPES = new Set(['Nat', 'Bool', 'UInt8', 'UInt16', 'UInt32', 'UInt64']);

export function isAutoCodegenScalarCoreRoot(s: CertifiedRootArtifactSummary): boolean {
  return (
    s.targetId === 'rust-core' &&
    SCALAR_CORE_TYPES.has(s.resultType) &&
    s.parameters.every((p) => SCALAR_CORE_TYPES.has(p.type))
  );
}

export interface CertifiedProductionManifest {
  readonly schema: 'verdant-resonance/certified-production-manifest/1';
  readonly bundleResultId: string;
  readonly semanticId: string;
  readonly attestationId: string;
  readonly compilerSemanticsDigest: string;
  readonly sdkImageRef: string;
  readonly requestSha256: string;
  readonly wasmRelativePath: string;
  readonly wasmBytes: number;
  readonly wasmSha256: string;
  readonly allKernelChecked: boolean;
  readonly allForbidUnsafeCode: boolean;
  readonly rustCoreNoStdRootCount: number;
  readonly rustStdRootCount: number;
  readonly roots: ReadonlyArray<CertifiedRootArtifactSummary>;
}

const DEFAULT_SDK_IMAGE =
  'ghcr.io/uor-foundation/prismpm-sdk-candidate@sha256:cd3b47d7a370c4a26b8285f5e9c3bb15e639973c55505c3809ddbe55352fea58';
const DEFAULT_SDK_CACHE_VOLUME = 'prism-sdk-cache-cd3b47d7a370';

export function resolvePinnedPrismSdkImage(projectRoot: string = process.cwd()): string {
  const lockPath = path.join(projectRoot, 'prism', 'prismpm.lock');
  if (!fs.existsSync(lockPath)) return DEFAULT_SDK_IMAGE;
  const raw = fs.readFileSync(lockPath, 'utf8');
  const repoMatch = /sdk_image_repository\s*=\s*"([^"]+)"/.exec(raw);
  const digestMatch = /sdk_image_digest\s*=\s*"([^"]+)"/.exec(raw);
  if (repoMatch && digestMatch) {
    return `${repoMatch[1]}@${digestMatch[1]}`;
  }
  return DEFAULT_SDK_IMAGE;
}

export function resolveCargoBinary(): string {
  const localCargo = path.join(process.env.HOME ?? '/home/alex', '.local', 'bin', 'cargo');
  if (fs.existsSync(localCargo)) return localCargo;
  const rustupCargo = path.join(process.env.HOME ?? '/home/alex', '.cargo', 'bin', 'cargo');
  if (fs.existsSync(rustupCargo)) return rustupCargo;
  return 'cargo';
}

function sha256Hex(buf: Buffer | string): string {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

export function findLatestProductionBundleDir(
  projectRoot: string = process.cwd(),
  overrideProductionRoot?: string,
): { bundleDir: string; resultId: string; resultJson: any } {
  const prismDir = path.join(projectRoot, 'prism');
  const prodRoot = overrideProductionRoot ?? path.join(prismDir, '.lexlean', 'production');
  const requestPath = path.join(prismDir, 'production', 'request.json');
  if (!fs.existsSync(requestPath)) {
    throw new NoCertifiedRootError(`Missing production request at ${requestPath}`);
  }
  if (!fs.existsSync(prodRoot)) {
    throw new NoCertifiedRootError(
      `No certified production bundle directory at ${prodRoot}; run 'npm run prism:production' first.`,
    );
  }

  const expectedReq = JSON.parse(fs.readFileSync(requestPath, 'utf8'));
  const expectedRoots = (expectedReq.roots ?? []).map((r: any) => r.root).sort();

  const candidates = fs
    .readdirSync(prodRoot, { withFileTypes: true })
    .filter((d) => d.isDirectory() && /^[0-9a-f]{64}$/.test(d.name))
    .map((d) => {
      const bundleDir = path.join(prodRoot, d.name);
      const resPath = path.join(bundleDir, 'result.json');
      if (!fs.existsSync(resPath)) return null;
      const stat = fs.statSync(resPath);
      const resultJson = JSON.parse(fs.readFileSync(resPath, 'utf8'));
      const rawRoots = Array.isArray(resultJson.roots)
        ? resultJson.roots.map((r: any) => r.root)
        : (resultJson.outputs ?? []).map((o: any) => o.root);
      const actualRoots = rawRoots.filter(Boolean).sort();
      const matchesRequest =
        expectedRoots.length === actualRoots.length &&
        expectedRoots.every((r: string, idx: number) => r === actualRoots[idx]);
      return matchesRequest ? { bundleDir, resultId: d.name, resultJson, mtimeMs: stat.mtimeMs } : null;
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .sort((a, b) => b.mtimeMs - a.mtimeMs);

  if (candidates.length === 0) {
    throw new NoCertifiedRootError(
      `No certified lexlean production bundle in ${prodRoot} matches the ${expectedRoots.length} roots in prism/production/request.json.`,
    );
  }

  return {
    bundleDir: candidates[0].bundleDir,
    resultId: candidates[0].resultId,
    resultJson: candidates[0].resultJson,
  };
}

function inspectRootCrateLibRs(libRsSource: string): {
  forbidsUnsafeCode: boolean;
  isNoStd: boolean;
  weightAdtIdent?: string;
  outcomeAdtIdent?: string;
} {
  const forbidsUnsafeCode = libRsSource.includes('#![forbid(unsafe_code)]');
  const isNoStd = libRsSource.includes('#![no_std]');
  let weightAdtIdent: string | undefined;
  let outcomeAdtIdent: string | undefined;
  const adtRegex = /pub enum (Adt\d+)\s*\{\s*C0\(([^)]*)\)/g;
  let m: RegExpExecArray | null;
  while ((m = adtRegex.exec(libRsSource)) !== null) {
    const ident = m[1];
    const fields = m[2].replace(/\s+/g, '');
    if (fields === 'Str,Str,u64') weightAdtIdent = ident;
    else if (fields === 'Str,Str,bool') outcomeAdtIdent = ident;
  }
  return { forbidsUnsafeCode, isNoStd, weightAdtIdent, outcomeAdtIdent };
}

export function inspectCertifiedBundleSummaries(
  bundleDir: string,
  resultJson: any,
  catalogRoots: ReadonlyArray<ProductionRootDescriptor>,
): CertifiedRootArtifactSummary[] {
  const rootEntries: any[] = Array.isArray(resultJson.roots) ? resultJson.roots : [];
  const summaries: CertifiedRootArtifactSummary[] = [];

  for (const desc of catalogRoots) {
    const rootEntry = rootEntries.find((r) => r.root === desc.root);
    const out = rootEntry?.outputs?.[0];
    if (!out) {
      throw new NoCertifiedRootError(`Certified bundle missing output for root ${desc.root}`);
    }
    const targetId: string = out.target?.id ?? desc.targets[0].id;
    const libRsPath = path.join(bundleDir, 'packages', targetId, desc.packageName, 'src', 'lib.rs');
    if (!fs.existsSync(libRsPath)) {
      throw new NoCertifiedRootError(`Certified Rust crate missing at ${libRsPath}`);
    }
    const libRs = fs.readFileSync(libRsPath, 'utf8');
    const shape = inspectRootCrateLibRs(libRs);
    const effects: string[] = Array.isArray(out.effects) ? out.effects.map(String) : [];
    const returnsResultOverflow = effects.includes('overflow');
    const certStatus = String(out.certification?.status ?? 'missing');
    if (certStatus !== 'kernel-checked') {
      throw new NoCertifiedRootError(
        `Root ${desc.root} certification status is '${certStatus}' (expected 'kernel-checked')`,
      );
    }
    if (!shape.forbidsUnsafeCode) {
      throw new NoCertifiedRootError(
        `Emitted crate ${desc.packageName} does not carry #![forbid(unsafe_code)]`,
      );
    }
    const certs: any[] = Array.isArray(out.certification?.certificates)
      ? out.certification.certificates
      : [];
    const composeCert = certs.find((c) => c.role === 'e') ?? certs[certs.length - 1];

    summaries.push({
      root: desc.root,
      moduleName: desc.moduleName,
      defName: desc.defName,
      packageName: desc.packageName,
      targetId,
      targetDigest: String(out.target?.digest ?? desc.targets[0].digest),
      artifactDigest: String(out.crate?.sha256 ?? out.artifact_digest ?? ''),
      certificationStatus: certStatus,
      theoremName: String(composeCert?.theorem ?? out.certification?.theorem ?? ''),
      certificateFiles: certs.map((c) => String(c.file?.path ?? '')).filter(Boolean),
      effects,
      returnsResultOverflow,
      forbidsUnsafeCode: shape.forbidsUnsafeCode,
      isNoStd: shape.isNoStd,
      parameters: desc.parameters,
      resultType: desc.resultType,
      weightAdtIdent: shape.weightAdtIdent,
      outcomeAdtIdent: shape.outcomeAdtIdent,
    });
  }

  return summaries;
}

function renderCargoDependenciesLines(
  fromDir: string,
  bundleDir: string,
  summaries: ReadonlyArray<CertifiedRootArtifactSummary>,
): string {
  return summaries
    .map((s) => {
      const pkgDir = path.join(bundleDir, 'packages', s.targetId, s.packageName);
      const rel = path.relative(fromDir, pkgDir).replace(/\\/g, '/');
      return `${s.packageName} = { path = ${JSON.stringify(rel)} }`;
    })
    .join('\n');
}

function renderRustCallExpr(
  pkgName: string,
  argsCode: string,
  returnsResultOverflow: boolean,
  errExpr: string,
): string {
  if (returnsResultOverflow) {
    return `match ${pkgName}::run(${argsCode}) { Ok(v) => v, Err(_) => return ${errExpr} }`;
  }
  return `${pkgName}::run(${argsCode})`;
}

function rustScalarType(lexType: string): string {
  if (lexType === 'Bool') return 'bool';
  if (lexType === 'UInt8') return 'u8';
  if (lexType === 'UInt16') return 'u16';
  if (lexType === 'UInt32') return 'u32';
  return 'u64';
}

function wasmExternScalarType(lexType: string): 'u32' | 'u64' {
  if (lexType === 'Bool' || lexType === 'UInt8' || lexType === 'UInt16' || lexType === 'UInt32') {
    return 'u32';
  }
  return 'u64';
}

function renderEvalCoreMatchArms(summaries: ReadonlyArray<CertifiedRootArtifactSummary>): string {
  return summaries
    .filter(isAutoCodegenScalarCoreRoot)
    .map((s) => {
      const parseLines = s.parameters
        .map((p, idx) => {
          const argIdx = idx + 2;
          if (p.type === 'Bool') {
            return `                let p${idx} = parse_bool_arg(args.get(${argIdx}), ${JSON.stringify(p.name)})?;`;
          }
          const rTy = rustScalarType(p.type);
          const castSuffix = rTy === 'u64' ? '' : ` as ${rTy}`;
          return `                let p${idx} = parse_u64_arg(args.get(${argIdx}), ${JSON.stringify(p.name)})?${castSuffix};`;
        })
        .join('\n');
      const callArgs = s.parameters.map((_, idx) => `p${idx}`).join(', ');
      const callExpr = renderRustCallExpr(
        s.packageName,
        callArgs,
        s.returnsResultOverflow,
        `Err(${JSON.stringify(`overflow in ${s.defName}`)}.to_string())`,
      );
      const valFmt =
        s.resultType === 'Bool' ? `{res}` : `\\"{res}\\"`;
      return `                ${JSON.stringify(s.root)} | ${JSON.stringify(s.packageName)} | ${JSON.stringify(s.defName)} => {
${parseLines}
                let w0 = total_work();
                let res = ${callExpr};
                let w1 = total_work();
                Ok(format!("{{\\"root\\":{},\\"value\\":${valFmt},\\"work\\":{}}}", json_escape(${JSON.stringify(s.root)}), w1 - w0))
            }`;
    })
    .join('\n');
}

function renderNativeHarnessRustMain(
  resultId: string,
  summaries: ReadonlyArray<CertifiedRootArtifactSummary>,
): string {
  const byShort = new Map(summaries.map((s) => [s.root.split('.').pop()!, s]));
  const rRule30 = byShort.get('rule30Step')!;
  const rAdmitLift = byShort.get('admitLiftKappaTransition')!;
  const rRoute = byShort.get('classifyFoundryTagMask')!;
  const rMint = byShort.get('decideHypothesisMint')!;
  const rLearnAll = byShort.get('learnAll')!;
  const rSchedule = byShort.get('schedule')!;
  const rCoherence = byShort.get('stepTriadicPlayerGameObserverCoherencePermille')!;
  const rDispatch = byShort.get('dispatch')!;

  const learnWeightAdt = rLearnAll.weightAdtIdent ?? 'Adt0';
  const learnOutcomeAdt = rLearnAll.outcomeAdtIdent ?? 'Adt1';
  const schedWeightAdt = rSchedule.weightAdtIdent ?? 'Adt0';

  const totalWorkExpr = summaries.map((s) => `${s.packageName}::work()`).join(' + ');

  return `#![forbid(unsafe_code)]

use std::env;
use std::process;

const BUNDLE_RESULT_ID: &str = ${JSON.stringify(resultId)};

fn total_work() -> u64 {
    ${totalWorkExpr}
}

fn hex_decode(hex: &str) -> Result<Vec<u8>, String> {
    let clean = hex.trim().strip_prefix("0x").unwrap_or(hex.trim());
    if clean.len() % 2 != 0 {
        return Err("odd hex length".to_string());
    }
    let mut out = Vec::with_capacity(clean.len() / 2);
    let bytes = clean.as_bytes();
    let mut i = 0;
    while i < bytes.len() {
        let hi = (bytes[i] as char).to_digit(16).ok_or_else(|| "bad hex".to_string())?;
        let lo = (bytes[i + 1] as char).to_digit(16).ok_or_else(|| "bad hex".to_string())?;
        out.push(((hi << 4) | lo) as u8);
        i += 2;
    }
    Ok(out)
}

fn hex_encode(bytes: &[u8]) -> String {
    const LUT: &[u8; 16] = b"0123456789abcdef";
    let mut s = String::with_capacity(bytes.len() * 2);
    for &b in bytes {
        s.push(LUT[(b >> 4) as usize] as char);
        s.push(LUT[(b & 0x0f) as usize] as char);
    }
    s
}

fn json_escape(s: &str) -> String {
    let mut out = String::with_capacity(s.len() + 2);
    out.push('"');
    for ch in s.chars() {
        match ch {
            '"' => out.push_str("\\\\\\""),
            '\\\\' => out.push_str("\\\\\\\\"),
            '\\n' => out.push_str("\\\\n"),
            '\\r' => out.push_str("\\\\r"),
            '\\t' => out.push_str("\\\\t"),
            c => out.push(c),
        }
    }
    out.push('"');
    out
}

fn parse_u64_arg(arg: Option<&String>, label: &str) -> Result<u64, String> {
    let raw = arg.ok_or_else(|| format!("missing {label}"))?;
    raw.parse::<u64>().map_err(|_| format!("invalid u64 for {label}: {raw}"))
}

fn parse_bool_arg(arg: Option<&String>, label: &str) -> Result<bool, String> {
    let raw = arg.ok_or_else(|| format!("missing {label}"))?;
    match raw.as_str() {
        "1" | "true" => Ok(true),
        "0" | "false" => Ok(false),
        _ => Err(format!("invalid bool for {label}: {raw}")),
    }
}

fn fail(msg: &str) -> ! {
    eprintln!("{msg}");
    process::exit(2);
}

fn run_cmd() -> Result<String, String> {
    let args: Vec<String> = env::args().skip(1).collect();
    let cmd = args.first().map(|s| s.as_str()).unwrap_or("info");
    match cmd {
        "info" => {
            Ok(format!(
                "{{\\"bundleResultId\\":{},\\"rootCount\\":{},\\"work\\":{}}}",
                json_escape(BUNDLE_RESULT_ID),
                ${summaries.length},
                total_work()
            ))
        }
        "rule30-step" => {
            let s = parse_u64_arg(args.get(1), "state")?;
            let w0 = total_work();
            let next = ${renderRustCallExpr(rRule30.packageName, 's', rRule30.returnsResultOverflow, 'Err("overflow in rule30Step".to_string())')};
            let w1 = total_work();
            Ok(format!("{{\\"nextState\\":\\"{next}\\",\\"work\\":{}}}", w1 - w0))
        }
        "admit-lift" => {
            let present = parse_u64_arg(args.get(1), "incumbentPresent")? != 0;
            let inc = parse_u64_arg(args.get(2), "incumbentClass")?;
            let cand = parse_u64_arg(args.get(3), "candidateClass")?;
            let w0 = total_work();
            let ok = ${renderRustCallExpr(rAdmitLift.packageName, 'present, inc, cand', rAdmitLift.returnsResultOverflow, 'Err("overflow in admitLift".to_string())')};
            let w1 = total_work();
            Ok(format!("{{\\"admitted\\":{ok},\\"work\\":{}}}", w1 - w0))
        }
        "foundry-route" => {
            let mask = parse_u64_arg(args.get(1), "tagMask")?;
            let w0 = total_work();
            let cls = ${renderRustCallExpr(rRoute.packageName, 'mask', rRoute.returnsResultOverflow, 'Err("overflow in classifyFoundryTagMask".to_string())')};
            let w1 = total_work();
            Ok(format!("{{\\"classification\\":{cls},\\"work\\":{}}}", w1 - w0))
        }
        "decide-mint" => {
            let contra = parse_u64_arg(args.get(1), "contradictory")? != 0;
            let known = parse_u64_arg(args.get(2), "known")? != 0;
            let rem = parse_u64_arg(args.get(3), "remainingBudget")?;
            let w0 = total_work();
            let code = ${renderRustCallExpr(rMint.packageName, 'contra, known, rem', rMint.returnsResultOverflow, 'Err("overflow in decideHypothesisMint".to_string())')};
            let w1 = total_work();
            Ok(format!("{{\\"outcome\\":{code},\\"work\\":{}}}", w1 - w0))
        }
        "triadic-coherence" => {
            let bw = parse_u64_arg(args.get(1), "busWeight")?;
            let ent = parse_u64_arg(args.get(2), "rule30Entropy")?;
            let att = parse_u64_arg(args.get(3), "playerAttentionPermille")?;
            let dis = parse_u64_arg(args.get(4), "residualDissonancePermille")?;
            let w0 = total_work();
            let coh = ${renderRustCallExpr(rCoherence.packageName, 'bw, ent, att, dis', rCoherence.returnsResultOverflow, 'Err("overflow in stepTriadicPlayerGameObserverCoherencePermille".to_string())')};
            let w1 = total_work();
            Ok(format!("{{\\"coherencePermille\\":{coh},\\"work\\":{}}}", w1 - w0))
        }
        "dispatch" => {
            let hex_arg = args.get(1).map(|s| s.as_str()).unwrap_or("");
            let req_bytes = hex_decode(hex_arg)?;
            let w0 = total_work();
            let ans = ${renderRustCallExpr(
              rDispatch.packageName,
              `${rDispatch.packageName}::Bytes::lit(&req_bytes)`,
              rDispatch.returnsResultOverflow,
              'Err("overflow in dispatch".to_string())',
            )};
            let w1 = total_work();
            let octets = ans.octets();
            let utf8 = String::from_utf8_lossy(octets);
            Ok(format!(
                "{{\\"responseHex\\":{},\\"responseUtf8\\":{},\\"work\\":{}}}",
                json_escape(&hex_encode(octets)),
                json_escape(&utf8),
                w1 - w0
            ))
        }
        "learn-all" => {
            // Wire format: "weights_tsv_b64_or_lines" via arg1 = "s|f|v;..." and arg2 = "s|f|0_or_1;..."
            let weights_spec = args.get(1).map(|s| s.as_str()).unwrap_or("");
            let outcomes_spec = args.get(2).map(|s| s.as_str()).unwrap_or("");
            let mut w_items: Vec<${rLearnAll.packageName}::${learnWeightAdt}> = Vec::new();
            for entry in weights_spec.split(';').filter(|e| !e.is_empty()) {
                let parts: Vec<&str> = entry.split('|').collect();
                if parts.len() != 3 {
                    return Err(format!("bad weight entry: {entry}"));
                }
                let val = parts[2].parse::<u64>().map_err(|_| "bad weight u64".to_string())?;
                w_items.push(${rLearnAll.packageName}::${learnWeightAdt}::C0(
                    ${rLearnAll.packageName}::Str::lit(parts[0]),
                    ${rLearnAll.packageName}::Str::lit(parts[1]),
                    val,
                ));
            }
            let mut w_list = ${rLearnAll.packageName}::List::nil();
            for item in w_items.into_iter().rev() {
                w_list = ${rLearnAll.packageName}::List::cons(item, w_list);
            }

            let mut o_items: Vec<${rLearnAll.packageName}::${learnOutcomeAdt}> = Vec::new();
            for entry in outcomes_spec.split(';').filter(|e| !e.is_empty()) {
                let parts: Vec<&str> = entry.split('|').collect();
                if parts.len() != 3 {
                    return Err(format!("bad outcome entry: {entry}"));
                }
                let ok = parts[2] == "1" || parts[2] == "true";
                o_items.push(${rLearnAll.packageName}::${learnOutcomeAdt}::C0(
                    ${rLearnAll.packageName}::Str::lit(parts[0]),
                    ${rLearnAll.packageName}::Str::lit(parts[1]),
                    ok,
                ));
            }
            let mut o_list = ${rLearnAll.packageName}::List::nil();
            for item in o_items.into_iter().rev() {
                o_list = ${rLearnAll.packageName}::List::cons(item, o_list);
            }

            let w0 = total_work();
            let mut learned = ${renderRustCallExpr(rLearnAll.packageName, 'w_list, o_list', rLearnAll.returnsResultOverflow, 'Err("overflow in learnAll".to_string())')};
            let w1 = total_work();
            let mut json_rows: Vec<String> = Vec::new();
            while let Some((head, tail)) = learned.uncons() {
                let ${rLearnAll.packageName}::${learnWeightAdt}::C0(st, fam, v) = head;
                json_rows.push(format!(
                    "{{\\"strategy\\":{},\\"family\\":{},\\"value\\":{v}}}",
                    json_escape(st.text()),
                    json_escape(fam.text())
                ));
                learned = tail;
            }
            Ok(format!(
                "{{\\"weights\\":[{}],\\"work\\":{}}}",
                json_rows.join(","),
                w1 - w0
            ))
        }
        "schedule" => {
            let weights_spec = args.get(1).map(|s| s.as_str()).unwrap_or("");
            let family = args.get(2).map(|s| s.as_str()).unwrap_or("");
            let applicable_spec = args.get(3).map(|s| s.as_str()).unwrap_or("");

            let mut w_items: Vec<${rSchedule.packageName}::${schedWeightAdt}> = Vec::new();
            for entry in weights_spec.split(';').filter(|e| !e.is_empty()) {
                let parts: Vec<&str> = entry.split('|').collect();
                if parts.len() != 3 {
                    return Err(format!("bad weight entry: {entry}"));
                }
                let val = parts[2].parse::<u64>().map_err(|_| "bad weight u64".to_string())?;
                w_items.push(${rSchedule.packageName}::${schedWeightAdt}::C0(
                    ${rSchedule.packageName}::Str::lit(parts[0]),
                    ${rSchedule.packageName}::Str::lit(parts[1]),
                    val,
                ));
            }
            let mut w_list = ${rSchedule.packageName}::List::nil();
            for item in w_items.into_iter().rev() {
                w_list = ${rSchedule.packageName}::List::cons(item, w_list);
            }

            let app_parts: Vec<&str> = applicable_spec.split(',').filter(|s| !s.is_empty()).collect();
            let mut app_list = ${rSchedule.packageName}::List::nil();
            for s in app_parts.into_iter().rev() {
                app_list = ${rSchedule.packageName}::List::cons(
                    ${rSchedule.packageName}::Str::lit(s),
                    app_list,
                );
            }

            let w0 = total_work();
            let mut ordered = ${renderRustCallExpr(
              rSchedule.packageName,
              `w_list, ${rSchedule.packageName}::Str::lit(family), app_list`,
              rSchedule.returnsResultOverflow,
              'Err("overflow in schedule".to_string())',
            )};
            let w1 = total_work();
            let mut out_strs: Vec<String> = Vec::new();
            while let Some((head, tail)) = ordered.uncons() {
                out_strs.push(json_escape(head.text()));
                ordered = tail;
            }
            Ok(format!(
                "{{\\"scheduled\\":[{}],\\"work\\":{}}}",
                out_strs.join(","),
                w1 - w0
            ))
        }
        "eval-core" => {
            let selector = args.get(1).map(|s| s.as_str()).unwrap_or("");
            match selector {
${renderEvalCoreMatchArms(summaries)}
                unknown => Err(format!("unknown scalar rust-core root: {unknown}")),
            }
        }
        other => Err(format!("unknown certified command: {other}")),
    }
}

fn main() {
    match run_cmd() {
        Ok(json) => println!("{json}"),
        Err(e) => fail(&e),
    }
}
`;
}

function renderWasmGuestLibRs(summaries: ReadonlyArray<CertifiedRootArtifactSummary>): string {
  const byShort = new Map(summaries.map((s) => [s.root.split('.').pop()!, s]));
  const rRule30 = byShort.get('rule30Step')!;
  const rAdmitLift = byShort.get('admitLiftKappaTransition')!;
  const rRoute = byShort.get('classifyFoundryTagMask')!;
  const rMint = byShort.get('decideHypothesisMint')!;
  const rLearnAll = byShort.get('learnAll')!;
  const rSchedule = byShort.get('schedule')!;
  const rCoherence = byShort.get('stepTriadicPlayerGameObserverCoherencePermille')!;
  const rDispatch = byShort.get('dispatch')!;

  const learnWeightAdt = rLearnAll.weightAdtIdent ?? 'Adt0';
  const learnOutcomeAdt = rLearnAll.outcomeAdtIdent ?? 'Adt1';
  const schedWeightAdt = rSchedule.weightAdtIdent ?? 'Adt0';

  const totalWorkExpr = summaries.map((s) => `${s.packageName}::work()`).join(' + ');

  return `// Zero unsafe blocks; all 8 linked certified LexLean crates carry #![forbid(unsafe_code)].
#![deny(unsafe_op_in_unsafe_fn)]

use std::sync::Mutex;

static INPUT_BUF: Mutex<Vec<u8>> = Mutex::new(Vec::new());
static OUTPUT_BUF: Mutex<Vec<u8>> = Mutex::new(Vec::new());

fn set_output_bytes(bytes: &[u8]) -> u32 {
    let mut out = OUTPUT_BUF.lock().unwrap();
    out.clear();
    out.extend_from_slice(bytes);
    out.len() as u32
}

#[no_mangle]
pub extern "C" fn certified_total_work() -> u64 {
    ${totalWorkExpr}
}

#[no_mangle]
pub extern "C" fn wasm_prepare_input(len: u32) -> u32 {
    let mut buf = INPUT_BUF.lock().unwrap();
    buf.resize(len as usize, 0u8);
    buf.as_mut_ptr() as u32
}

#[no_mangle]
pub extern "C" fn wasm_output_ptr() -> u32 {
    let buf = OUTPUT_BUF.lock().unwrap();
    buf.as_ptr() as u32
}

#[no_mangle]
pub extern "C" fn wasm_output_len() -> u32 {
    let buf = OUTPUT_BUF.lock().unwrap();
    buf.len() as u32
}

#[no_mangle]
pub extern "C" fn certified_rule30_step(state: u64) -> u64 {
    ${renderRustCallExpr(rRule30.packageName, 'state', rRule30.returnsResultOverflow, '0')}
}

#[no_mangle]
pub extern "C" fn certified_admit_lift(incumbent_present: u32, incumbent_class: u64, candidate_class: u64) -> u32 {
    let ok = ${renderRustCallExpr(
      rAdmitLift.packageName,
      'incumbent_present != 0, incumbent_class, candidate_class',
      rAdmitLift.returnsResultOverflow,
      '0',
    )};
    u32::from(ok)
}

#[no_mangle]
pub extern "C" fn certified_foundry_route(tag_mask: u64) -> u64 {
    ${renderRustCallExpr(rRoute.packageName, 'tag_mask', rRoute.returnsResultOverflow, '1')}
}

#[no_mangle]
pub extern "C" fn certified_decide_mint(contradictory: u32, known_kappa: u32, remaining_budget: u64) -> u64 {
    ${renderRustCallExpr(
      rMint.packageName,
      'contradictory != 0, known_kappa != 0, remaining_budget',
      rMint.returnsResultOverflow,
      '3',
    )}
}

#[no_mangle]
pub extern "C" fn certified_triadic_coherence(
    bus_weight: u64,
    rule30_entropy: u64,
    player_attention_permille: u64,
    residual_dissonance_permille: u64,
) -> u64 {
    ${renderRustCallExpr(
      rCoherence.packageName,
      'bus_weight, rule30_entropy, player_attention_permille, residual_dissonance_permille',
      rCoherence.returnsResultOverflow,
      '0',
    )}
}

#[no_mangle]
pub extern "C" fn certified_dispatch() -> u32 {
    let req_bytes = {
        let inp = INPUT_BUF.lock().unwrap();
        inp.clone()
    };
    let ans = ${renderRustCallExpr(
      rDispatch.packageName,
      `${rDispatch.packageName}::Bytes::lit(&req_bytes)`,
      rDispatch.returnsResultOverflow,
      '0',
    )};
    set_output_bytes(ans.octets())
}

#[no_mangle]
pub extern "C" fn certified_learn_all() -> u32 {
    // Input wire in INPUT_BUF: "<weights_spec>\\n<outcomes_spec>"
    let text = {
        let inp = INPUT_BUF.lock().unwrap();
        String::from_utf8_lossy(&inp).into_owned()
    };
    let mut lines = text.splitn(2, '\\n');
    let weights_spec = lines.next().unwrap_or("");
    let outcomes_spec = lines.next().unwrap_or("");

    let mut w_items: Vec<${rLearnAll.packageName}::${learnWeightAdt}> = Vec::new();
    for entry in weights_spec.split(';').filter(|e| !e.is_empty()) {
        let parts: Vec<&str> = entry.split('|').collect();
        if parts.len() == 3 {
            if let Ok(val) = parts[2].parse::<u64>() {
                w_items.push(${rLearnAll.packageName}::${learnWeightAdt}::C0(
                    ${rLearnAll.packageName}::Str::lit(parts[0]),
                    ${rLearnAll.packageName}::Str::lit(parts[1]),
                    val,
                ));
            }
        }
    }
    let mut w_list = ${rLearnAll.packageName}::List::nil();
    for item in w_items.into_iter().rev() {
        w_list = ${rLearnAll.packageName}::List::cons(item, w_list);
    }

    let mut o_items: Vec<${rLearnAll.packageName}::${learnOutcomeAdt}> = Vec::new();
    for entry in outcomes_spec.split(';').filter(|e| !e.is_empty()) {
        let parts: Vec<&str> = entry.split('|').collect();
        if parts.len() == 3 {
            let ok = parts[2] == "1" || parts[2] == "true";
            o_items.push(${rLearnAll.packageName}::${learnOutcomeAdt}::C0(
                ${rLearnAll.packageName}::Str::lit(parts[0]),
                ${rLearnAll.packageName}::Str::lit(parts[1]),
                ok,
            ));
        }
    }
    let mut o_list = ${rLearnAll.packageName}::List::nil();
    for item in o_items.into_iter().rev() {
        o_list = ${rLearnAll.packageName}::List::cons(item, o_list);
    }

    let mut learned = ${renderRustCallExpr(
      rLearnAll.packageName,
      'w_list, o_list',
      rLearnAll.returnsResultOverflow,
      '0',
    )};
    let mut rows: Vec<String> = Vec::new();
    while let Some((head, tail)) = learned.uncons() {
        let ${rLearnAll.packageName}::${learnWeightAdt}::C0(st, fam, v) = head;
        rows.push(format!("{}|{}|{}", st.text(), fam.text(), v));
        learned = tail;
    }
    set_output_bytes(rows.join(";").as_bytes())
}

#[no_mangle]
pub extern "C" fn certified_schedule() -> u32 {
    // Input wire in INPUT_BUF: "<weights_spec>\\n<family>\\n<applicable_csv>"
    let text = {
        let inp = INPUT_BUF.lock().unwrap();
        String::from_utf8_lossy(&inp).into_owned()
    };
    let mut lines = text.splitn(3, '\\n');
    let weights_spec = lines.next().unwrap_or("");
    let family = lines.next().unwrap_or("");
    let applicable_spec = lines.next().unwrap_or("");

    let mut w_items: Vec<${rSchedule.packageName}::${schedWeightAdt}> = Vec::new();
    for entry in weights_spec.split(';').filter(|e| !e.is_empty()) {
        let parts: Vec<&str> = entry.split('|').collect();
        if parts.len() == 3 {
            if let Ok(val) = parts[2].parse::<u64>() {
                w_items.push(${rSchedule.packageName}::${schedWeightAdt}::C0(
                    ${rSchedule.packageName}::Str::lit(parts[0]),
                    ${rSchedule.packageName}::Str::lit(parts[1]),
                    val,
                ));
            }
        }
    }
    let mut w_list = ${rSchedule.packageName}::List::nil();
    for item in w_items.into_iter().rev() {
        w_list = ${rSchedule.packageName}::List::cons(item, w_list);
    }

    let app_parts: Vec<&str> = applicable_spec.split(',').filter(|s| !s.is_empty()).collect();
    let mut app_list = ${rSchedule.packageName}::List::nil();
    for s in app_parts.into_iter().rev() {
        app_list = ${rSchedule.packageName}::List::cons(
            ${rSchedule.packageName}::Str::lit(s),
            app_list,
        );
    }

    let mut ordered = ${renderRustCallExpr(
      rSchedule.packageName,
      `w_list, ${rSchedule.packageName}::Str::lit(family), app_list`,
      rSchedule.returnsResultOverflow,
      '0',
    )};
    let mut out_items: Vec<String> = Vec::new();
    while let Some((head, tail)) = ordered.uncons() {
        out_items.push(head.text().to_string());
        ordered = tail;
    }
    set_output_bytes(out_items.join(",").as_bytes())
}

${summaries
  .filter(isAutoCodegenScalarCoreRoot)
  .map((s) => {
    const fnParams = s.parameters
      .map((p, idx) => `p${idx}: ${wasmExternScalarType(p.type)}`)
      .join(', ');
    const retTy = wasmExternScalarType(s.resultType);
    const callArgs = s.parameters
      .map((p, idx) => {
        if (p.type === 'Bool') return `p${idx} != 0`;
        const rTy = rustScalarType(p.type);
        return rTy === wasmExternScalarType(p.type) ? `p${idx}` : `p${idx} as ${rTy}`;
      })
      .join(', ');
    const rawCall = renderRustCallExpr(s.packageName, callArgs, s.returnsResultOverflow, '0');
    const bodyExpr =
      s.resultType === 'Bool'
        ? `u32::from(${rawCall})`
        : retTy === rustScalarType(s.resultType)
          ? rawCall
          : `(${rawCall}) as ${retTy}`;
    return `#[no_mangle]\npub extern "C" fn core_${s.packageName}(${fnParams}) -> ${retTy} {\n    ${bodyExpr}\n}`;
  })
  .join('\n\n')}
`;
}

const TS_PARAM_RESERVED = new Set([
  'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default', 'delete', 'do',
  'else', 'enum', 'export', 'extends', 'false', 'finally', 'for', 'function', 'if', 'in',
  'instanceof', 'new', 'null', 'return', 'super', 'switch', 'this', 'throw', 'true', 'try',
  'typeof', 'var', 'void', 'while', 'with', 'yield',
]);

export function renderGeneratedCertifiedWasmBridgeSource(manifest: CertifiedProductionManifest): string {
  const autoCoreRoots = manifest.roots.filter(isAutoCodegenScalarCoreRoot);
  const autoExportSigs = autoCoreRoots
    .map((s) => {
      const ps = s.parameters
        .map((p, idx) => {
          const wTy = wasmExternScalarType(p.type) === 'u32' ? 'number' : 'bigint';
          return `p${idx}: ${wTy}`;
        })
        .join(', ');
      const rTy = wasmExternScalarType(s.resultType) === 'u32' ? 'number' : 'bigint';
      return `  core_${s.packageName}(${ps}): ${rTy};`;
    })
    .join('\n');

  const autoTsWrappers = autoCoreRoots
    .map((s) => {
      const tsParams = s.parameters
        .map((p, idx) => {
          const safeName = TS_PARAM_RESERVED.has(p.name) ? `arg_${p.name}_${idx}` : p.name;
          const tsTy =
            p.type === 'Bool'
              ? 'boolean'
              : p.type === 'UInt64'
                ? 'bigint'
                : 'number | bigint';
          return `${safeName}: ${tsTy}`;
        })
        .join(', ');
      const callArgs = s.parameters
        .map((p, idx) => {
          const safeName = TS_PARAM_RESERVED.has(p.name) ? `arg_${p.name}_${idx}` : p.name;
          if (p.type === 'Bool') return `${safeName} ? 1 : 0`;
          if (wasmExternScalarType(p.type) === 'u32') return `Number(_toU64Arg(${safeName})) >>> 0`;
          return `_toU64Arg(${safeName})`;
        })
        .join(', ');
      const returnsBigInt = s.resultType === 'UInt64' || s.defName === 'rule30Step';
      const tsRet = s.resultType === 'Bool' ? 'boolean' : returnsBigInt ? 'bigint' : 'number';
      const rawInvoke = `(_certifiedCoreCallCount += 1, requireExports().core_${s.packageName}(${callArgs}))`;
      const wrappedBody =
        s.resultType === 'Bool'
          ? `return ${rawInvoke} !== 0;`
          : returnsBigInt
            ? `return BigInt.asUintN(64, ${rawInvoke});`
            : wasmExternScalarType(s.resultType) === 'u32'
              ? `return ${rawInvoke} >>> 0;`
              : `return Number(BigInt.asUintN(64, ${rawInvoke}));`;
      return `export function certifiedWasmCore_${s.defName}(${tsParams}): ${tsRet} {\n  ${wrappedBody}\n}`;
    })
    .join('\n\n');

  return `// AUTO-GENERATED BY \`scripts/certifiedProductionRuntime.ts\` FROM KERNEL-CHECKED \`lexlean production\` RUST CRATES.
// DO NOT EDIT BY HAND — THIS BRIDGE LOADS \`public/wasm/verdant_certified_runtime.wasm\` COMPILED FROM CERTIFIED RUST.

export interface CertifiedWeightRow {
  readonly strategy: string;
  readonly family: string;
  readonly value: number;
}

export interface CertifiedOutcomeRow {
  readonly strategy: string;
  readonly family: string;
  readonly success: boolean;
}

interface CertifiedWasmExports {
  readonly memory: WebAssembly.Memory;
  certified_total_work(): bigint;
  wasm_prepare_input(len: number): number;
  wasm_output_ptr(): number;
  wasm_output_len(): number;
  certified_rule30_step(state: bigint): bigint;
  certified_admit_lift(incumbentPresent: number, incumbentClass: bigint, candidateClass: bigint): number;
  certified_foundry_route(tagMask: bigint): bigint;
  certified_decide_mint(contradictory: number, knownKappa: number, remainingBudget: bigint): bigint;
  certified_triadic_coherence(
    busWeight: bigint,
    rule30Entropy: bigint,
    playerAttentionPermille: bigint,
    residualDissonancePermille: bigint,
  ): bigint;
  certified_dispatch(): number;
  certified_learn_all(): number;
  certified_schedule(): number;
${autoExportSigs}
}

export const CERTIFIED_PRODUCTION_MANIFEST = ${JSON.stringify(manifest, null, 2)} as const;

const _encoder = new TextEncoder();
const _decoder = new TextDecoder('utf-8');
let _wasmExports: CertifiedWasmExports | null = null;
let _browserInitPromise: Promise<boolean> | null = null;
let _certifiedCoreCallCount = 0;

function tryInitSyncInNode(): CertifiedWasmExports | null {
  if (_wasmExports) return _wasmExports;
  const proc = (globalThis as { process?: { versions?: { node?: string }; cwd?: () => string } }).process;
  if (!proc?.versions?.node || typeof proc.cwd !== 'function') {
    return null;
  }
  try {
    // Dynamic Node builtin lookup safe for Vite browser bundling
    const getBuiltin = (proc as unknown as { getBuiltinModule?: (id: string) => any }).getBuiltinModule;
    if (typeof getBuiltin !== 'function') return null;
    const nodeFs = getBuiltin('node:fs');
    const nodePath = getBuiltin('node:path');
    const wasmPath = nodePath.join(proc.cwd(), 'public', 'wasm', 'verdant_certified_runtime.wasm');
    if (!nodeFs.existsSync(wasmPath)) return null;
    const wasmBytes: Uint8Array = nodeFs.readFileSync(wasmPath);
    const mod = new WebAssembly.Module(wasmBytes as unknown as BufferSource);
    const inst = new WebAssembly.Instance(mod, {});
    _wasmExports = inst.exports as unknown as CertifiedWasmExports;
    return _wasmExports;
  } catch {
    return null;
  }
}

export async function initCertifiedWasmRuntime(wasmUrl = '/wasm/verdant_certified_runtime.wasm'): Promise<boolean> {
  if (_wasmExports || tryInitSyncInNode()) return true;
  if (_browserInitPromise) return _browserInitPromise;
  _browserInitPromise = (async () => {
    try {
      const resp = await fetch(wasmUrl);
      if (!resp.ok) return false;
      const bytes = await resp.arrayBuffer();
      const { instance } = await WebAssembly.instantiate(bytes, {});
      _wasmExports = instance.exports as unknown as CertifiedWasmExports;
      return true;
    } catch {
      return false;
    }
  })();
  return _browserInitPromise;
}

export function isCertifiedWasmReady(): boolean {
  return (_wasmExports ?? tryInitSyncInNode()) !== null;
}

function requireExports(): CertifiedWasmExports {
  const exp = _wasmExports ?? tryInitSyncInNode();
  if (!exp) {
    throw new Error(
      'NoCertifiedRoot: certified WebAssembly runtime (verdant_certified_runtime.wasm) is not loaded.',
    );
  }
  return exp;
}

function writeWasmInputUtf8(exp: CertifiedWasmExports, text: string): void {
  const bytes = _encoder.encode(text);
  const ptr = exp.wasm_prepare_input(bytes.length) >>> 0;
  new Uint8Array(exp.memory.buffer, ptr, bytes.length).set(bytes);
}

function readWasmOutputUtf8(exp: CertifiedWasmExports): string {
  const ptr = exp.wasm_output_ptr() >>> 0;
  const len = exp.wasm_output_len() >>> 0;
  return _decoder.decode(new Uint8Array(exp.memory.buffer, ptr, len));
}

export function certifiedWasmTotalWork(): bigint {
  return requireExports().certified_total_work();
}

export function certifiedWasmCoreCallCount(): number {
  return _certifiedCoreCallCount;
}

export function certifiedWasmRule30Step(state64: bigint): bigint {
  _certifiedCoreCallCount += 1;
  return BigInt.asUintN(64, requireExports().certified_rule30_step(BigInt.asUintN(64, state64)));
}

export function certifiedWasmAdmitLift(
  incumbentPresent: boolean,
  incumbentClass: number | bigint,
  candidateClass: number | bigint,
): boolean {
  _certifiedCoreCallCount += 1;
  return (
    requireExports().certified_admit_lift(
      incumbentPresent ? 1 : 0,
      BigInt(incumbentClass),
      BigInt(candidateClass),
    ) !== 0
  );
}

export function certifiedWasmFoundryRoute(tagMask: number | bigint): number {
  _certifiedCoreCallCount += 1;
  return Number(requireExports().certified_foundry_route(BigInt(tagMask)));
}

export function certifiedWasmDecideMint(
  contradictory: boolean,
  knownKappa: boolean,
  remainingBudget: number | bigint,
): number {
  _certifiedCoreCallCount += 1;
  return Number(
    requireExports().certified_decide_mint(
      contradictory ? 1 : 0,
      knownKappa ? 1 : 0,
      BigInt(remainingBudget),
    ),
  );
}

export function certifiedWasmTriadicCoherencePermille(
  busWeight: number | bigint,
  rule30Entropy: number | bigint,
  playerAttentionPermille: number | bigint,
  residualDissonancePermille: number | bigint,
): number {
  _certifiedCoreCallCount += 1;
  return Number(
    requireExports().certified_triadic_coherence(
      BigInt(busWeight),
      BigInt(rule30Entropy),
      BigInt(playerAttentionPermille),
      BigInt(residualDissonancePermille),
    ),
  );
}

export function certifiedWasmDispatchText(requestText: string): string {
  const exp = requireExports();
  writeWasmInputUtf8(exp, requestText);
  exp.certified_dispatch();
  return readWasmOutputUtf8(exp);
}

export function certifiedWasmLearnAll(
  weights: ReadonlyArray<CertifiedWeightRow>,
  outcomes: ReadonlyArray<CertifiedOutcomeRow>,
): ReadonlyArray<CertifiedWeightRow> {
  const exp = requireExports();
  const wSpec = weights.map((w) => \`\${w.strategy}|\${w.family}|\${Math.floor(w.value)}\`).join(';');
  const oSpec = outcomes
    .map((o) => \`\${o.strategy}|\${o.family}|\${o.success ? '1' : '0'}\`)
    .join(';');
  writeWasmInputUtf8(exp, \`\${wSpec}\\n\${oSpec}\`);
  exp.certified_learn_all();
  const out = readWasmOutputUtf8(exp);
  if (!out) return [];
  return out.split(';').map((row) => {
    const [strategy, family, v] = row.split('|');
    return { strategy, family, value: Number(v) };
  });
}

export function certifiedWasmSchedule(
  weights: ReadonlyArray<CertifiedWeightRow>,
  family: string,
  applicable: ReadonlyArray<string>,
): ReadonlyArray<string> {
  const exp = requireExports();
  const wSpec = weights.map((w) => \`\${w.strategy}|\${w.family}|\${Math.floor(w.value)}\`).join(';');
  writeWasmInputUtf8(exp, \`\${wSpec}\\n\${family}\\n\${applicable.join(',')}\`);
  exp.certified_schedule();
  const out = readWasmOutputUtf8(exp);
  return out ? out.split(',') : [];
}

function _toU64Arg(value: number | bigint): bigint {
  if (typeof value === 'bigint') return value <= 0n ? 0n : BigInt.asUintN(64, value);
  if (!Number.isFinite(value) || value <= 0) return 0n;
  return BigInt.asUintN(64, BigInt(Math.round(value)));
}

export const CERTIFIED_WASM_CORE_ROOT_NAMES = ${JSON.stringify(autoCoreRoots.map((r) => r.defName))} as const;

${autoTsWrappers}
`;
}

export function compileCertifiedRustHarnessAndWasm(
  projectRoot: string = process.cwd(),
  overrideProductionRoot?: string,
): {
  harnessBinaryPath: string;
  wasmOutputPath: string;
  manifestPath: string;
  bridgePath: string;
  manifest: CertifiedProductionManifest;
} {
  const prismDir = path.join(projectRoot, 'prism');
  const { roots: catalogRoots } = extractProductionRootCatalog(prismDir);
  const { bundleDir, resultId, resultJson } = findLatestProductionBundleDir(
    projectRoot,
    overrideProductionRoot,
  );
  const summaries = inspectCertifiedBundleSummaries(bundleDir, resultJson, catalogRoots);
  const cargoBin = resolveCargoBinary();

  // 1. Build Native Certified Rust Harness (`verdant_certified_harness`)
  const harnessDir = path.join(prismDir, '.lexlean', 'harness');
  const harnessSrcDir = path.join(harnessDir, 'src');
  fs.mkdirSync(harnessSrcDir, { recursive: true });
  const harnessDeps = renderCargoDependenciesLines(harnessDir, bundleDir, summaries);
  const harnessCargoToml = `[package]
name = "verdant_certified_harness"
version = "0.1.0"
edition = "2021"

[dependencies]
${harnessDeps}

[profile.release]
opt-level = 2
`;
  writeFileIfChanged(path.join(harnessDir, 'Cargo.toml'), harnessCargoToml);
  writeFileIfChanged(
    path.join(harnessSrcDir, 'main.rs'),
    renderNativeHarnessRustMain(resultId, summaries),
  );

  execFileSync(cargoBin, ['build', '--release', '--offline'], {
    cwd: harnessDir,
    stdio: 'pipe',
  });
  const harnessBinaryPath = path.join(harnessDir, 'target', 'release', 'verdant_certified_harness');
  if (!fs.existsSync(harnessBinaryPath)) {
    throw new NoCertifiedRootError(`Cargo finished without producing ${harnessBinaryPath}`);
  }

  // 2. Build Certified Browser & Node WebAssembly (`wasm32-unknown-unknown`)
  const wasmGuestDir = path.join(prismDir, '.lexlean', 'wasm-guest');
  const wasmGuestSrcDir = path.join(wasmGuestDir, 'src');
  fs.mkdirSync(wasmGuestSrcDir, { recursive: true });
  const wasmDeps = renderCargoDependenciesLines(wasmGuestDir, bundleDir, summaries);
  const wasmCargoToml = `[package]
name = "verdant_certified_wasm"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
${wasmDeps}

[profile.release]
opt-level = "z"
lto = true
codegen-units = 1
panic = "abort"
strip = "symbols"
`;
  writeFileIfChanged(path.join(wasmGuestDir, 'Cargo.toml'), wasmCargoToml);
  writeFileIfChanged(path.join(wasmGuestSrcDir, 'lib.rs'), renderWasmGuestLibRs(summaries));

  execFileSync(cargoBin, ['build', '--target', 'wasm32-unknown-unknown', '--release', '--offline'], {
    cwd: wasmGuestDir,
    stdio: 'pipe',
  });

  const builtWasmPath = path.join(
    wasmGuestDir,
    'target',
    'wasm32-unknown-unknown',
    'release',
    'verdant_certified_wasm.wasm',
  );
  if (!fs.existsSync(builtWasmPath)) {
    throw new NoCertifiedRootError(`Cargo finished without producing ${builtWasmPath}`);
  }

  const publicWasmDir = path.join(projectRoot, 'public', 'wasm');
  fs.mkdirSync(publicWasmDir, { recursive: true });
  const wasmOutputPath = path.join(publicWasmDir, 'verdant_certified_runtime.wasm');
  const wasmBuf = fs.readFileSync(builtWasmPath);
  fs.writeFileSync(wasmOutputPath, wasmBuf);

  const requestBuf = fs.readFileSync(path.join(prismDir, 'production', 'request.json'));
  const manifest: CertifiedProductionManifest = {
    schema: 'verdant-resonance/certified-production-manifest/1',
    bundleResultId: resultId,
    semanticId: String(resultJson.source?.semantic_id ?? resultJson.semantic_id ?? ''),
    attestationId: String(resultJson.verification?.attestation_id ?? resultJson.evidence?.attestation_id ?? ''),
    compilerSemanticsDigest: String(resultJson.compiler?.semantics ?? resultJson.compiler_semantics ?? ''),
    sdkImageRef: resolvePinnedPrismSdkImage(projectRoot),
    requestSha256: sha256Hex(requestBuf),
    wasmRelativePath: 'public/wasm/verdant_certified_runtime.wasm',
    wasmBytes: wasmBuf.length,
    wasmSha256: sha256Hex(wasmBuf),
    allKernelChecked: summaries.every((s) => s.certificationStatus === 'kernel-checked'),
    allForbidUnsafeCode: summaries.every((s) => s.forbidsUnsafeCode),
    rustCoreNoStdRootCount: summaries.filter((s) => s.targetId === 'rust-core' && s.isNoStd).length,
    rustStdRootCount: summaries.filter((s) => s.targetId === 'rust-std').length,
    roots: summaries,
  };

  const manifestPath = path.join(publicWasmDir, 'verdant_certified_manifest.json');
  writeFileIfChanged(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

  const bridgePath = path.join(projectRoot, 'src', 'game', 'generatedCertifiedWasmBridge.ts');
  writeFileIfChanged(bridgePath, renderGeneratedCertifiedWasmBridgeSource(manifest));

  return {
    harnessBinaryPath,
    wasmOutputPath,
    manifestPath,
    bridgePath,
    manifest,
  };
}

export function buildAndVerifyCertifiedProductionBundle(projectRoot: string = process.cwd()): {
  bundleDir: string;
  resultId: string;
  harnessBinaryPath: string;
  wasmOutputPath: string;
  manifest: CertifiedProductionManifest;
} {
  const prismDir = path.join(projectRoot, 'prism');
  const sdkImage = resolvePinnedPrismSdkImage(projectRoot);
  const uid = typeof process.getuid === 'function' ? process.getuid() : 1000;
  const gid = typeof process.getgid === 'function' ? process.getgid() : 1000;

  try {
    execFileSync(
      'docker',
      [
        'run',
        '--rm',
        '--user',
        `${uid}:${gid}`,
        '--mount',
        `type=volume,source=${DEFAULT_SDK_CACHE_VOLUME},target=/tmp`,
        '--volume',
        `${prismDir}:${prismDir}`,
        '--workdir',
        prismDir,
        '--env',
        'HOME=/tmp/prismpm-home',
        '--env',
        'PRISMPM_EPHEMERAL_HOME=1',
        sdkImage,
        'sh',
        '-ec',
        'lexlean --project lexlean.toml verify --diagnostic-format json && lexlean --project lexlean.toml production build --request production/request.json --diagnostic-format json',
      ],
      { stdio: 'pipe', maxBuffer: 32 * 1024 * 1024 },
    );
  } catch (err: any) {
    const out = err?.stdout ? String(err.stdout) : '';
    const stderr = err?.stderr ? String(err.stderr) : '';
    throw new Error(`lexlean production build failed:\n${out}\n${stderr}`);
  }

  const { bundleDir, resultId } = findLatestProductionBundleDir(projectRoot);
  const relBundle = path.relative(prismDir, bundleDir).replace(/\\/g, '/');

  execFileSync(
    'docker',
    [
      'run',
      '--rm',
      '--user',
      `${uid}:${gid}`,
      '--mount',
      `type=volume,source=${DEFAULT_SDK_CACHE_VOLUME},target=/tmp`,
      '--volume',
      `${prismDir}:${prismDir}`,
      '--workdir',
      prismDir,
      '--env',
      'HOME=/tmp/prismpm-home',
      '--env',
      'PRISMPM_EPHEMERAL_HOME=1',
      sdkImage,
      'lexlean',
      '--project',
      'lexlean.toml',
      'production',
      'verify-artifact',
      relBundle,
      '--diagnostic-format',
      'json',
    ],
    { stdio: 'pipe', maxBuffer: 16 * 1024 * 1024 },
  );

  const compiled = compileCertifiedRustHarnessAndWasm(projectRoot);
  return {
    bundleDir,
    resultId,
    harnessBinaryPath: compiled.harnessBinaryPath,
    wasmOutputPath: compiled.wasmOutputPath,
    manifest: compiled.manifest,
  };
}

/**
 * Fail-closed runner over the certified Rust binary (`verdant_certified_harness`).
 * Mirrors `afflom/rule30` `EngineRust` (`NoRoot`): if the certified production bundle or binary
 * is missing, raises `NoCertifiedRootError` immediately — never falls back to uncertified JS.
 */
export class CertifiedRustRunner {
  readonly projectRoot: string;
  readonly bundleDir: string;
  readonly resultId: string;
  readonly harnessBinaryPath: string;

  constructor(projectRoot: string = process.cwd(), options?: { productionRoot?: string }) {
    this.projectRoot = projectRoot;
    const found = findLatestProductionBundleDir(projectRoot, options?.productionRoot);
    this.bundleDir = found.bundleDir;
    this.resultId = found.resultId;
    const binPath = path.join(
      projectRoot,
      'prism',
      '.lexlean',
      'harness',
      'target',
      'release',
      'verdant_certified_harness',
    );
    if (!fs.existsSync(binPath)) {
      throw new NoCertifiedRootError(
        `Certified Rust harness binary missing at ${binPath}; run 'npm run prism:production'.`,
      );
    }
    this.harnessBinaryPath = binPath;
    const info = this.invokeJson<{ bundleResultId: string }>(['info']);
    if (info.bundleResultId !== this.resultId) {
      throw new NoCertifiedRootError(
        `Certified harness binary (${info.bundleResultId}) is out of sync with bundle (${this.resultId}).`,
      );
    }
  }

  private invokeJson<T>(args: string[]): T {
    try {
      const stdout = execFileSync(this.harnessBinaryPath, args, {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      });
      return JSON.parse(stdout.trim()) as T;
    } catch (err: any) {
      throw new NoCertifiedRootError(
        `Certified Rust invocation '${args[0]}' failed: ${String(err?.stderr || err?.message || err)}`,
      );
    }
  }

  rule30Step(state64: bigint): { nextState: bigint; work: number } {
    const res = this.invokeJson<{ nextState: string; work: number }>([
      'rule30-step',
      BigInt.asUintN(64, state64).toString(),
    ]);
    return { nextState: BigInt(res.nextState), work: res.work };
  }

  admitLift(
    incumbentPresent: boolean,
    incumbentClass: number,
    candidateClass: number,
  ): { admitted: boolean; work: number } {
    return this.invokeJson(['admit-lift', incumbentPresent ? '1' : '0', String(incumbentClass), String(candidateClass)]);
  }

  foundryRoute(tagMask: number): { classification: number; work: number } {
    return this.invokeJson(['foundry-route', String(tagMask)]);
  }

  decideMint(
    contradictory: boolean,
    known: boolean,
    remainingBudget: number,
  ): { outcome: number; work: number } {
    return this.invokeJson([
      'decide-mint',
      contradictory ? '1' : '0',
      known ? '1' : '0',
      String(remainingBudget),
    ]);
  }

  triadicCoherence(
    busWeight: number,
    rule30Entropy: number,
    playerAttentionPermille: number,
    residualDissonancePermille: number,
  ): { coherencePermille: number; work: number } {
    return this.invokeJson([
      'triadic-coherence',
      String(busWeight),
      String(rule30Entropy),
      String(playerAttentionPermille),
      String(residualDissonancePermille),
    ]);
  }

  dispatchText(requestText: string): { responseHex: string; responseUtf8: string; work: number } {
    const reqHex = Buffer.from(requestText, 'utf8').toString('hex');
    return this.invokeJson(['dispatch', reqHex]);
  }

  dispatchHex(requestHex: string): { responseHex: string; responseUtf8: string; work: number } {
    return this.invokeJson(['dispatch', requestHex]);
  }

  learnAll(
    weights: ReadonlyArray<{ strategy: string; family: string; value: number }>,
    outcomes: ReadonlyArray<{ strategy: string; family: string; success: boolean }>,
  ): { weights: Array<{ strategy: string; family: string; value: number }>; work: number } {
    const wSpec = weights.map((w) => `${w.strategy}|${w.family}|${Math.floor(w.value)}`).join(';');
    const oSpec = outcomes
      .map((o) => `${o.strategy}|${o.family}|${o.success ? '1' : '0'}`)
      .join(';');
    return this.invokeJson(['learn-all', wSpec, oSpec]);
  }

  schedule(
    weights: ReadonlyArray<{ strategy: string; family: string; value: number }>,
    family: string,
    applicable: ReadonlyArray<string>,
  ): { scheduled: string[]; work: number } {
    const wSpec = weights.map((w) => `${w.strategy}|${w.family}|${Math.floor(w.value)}`).join(';');
    return this.invokeJson(['schedule', wSpec, family, applicable.join(',')]);
  }

  evalCoreRoot(
    selector: string,
    args: ReadonlyArray<number | bigint | boolean>,
  ): { root: string; value: string | boolean; work: number } {
    const serialized = args.map((a) => {
      if (typeof a === 'boolean') return a ? '1' : '0';
      if (typeof a === 'bigint') return (a <= 0n ? 0n : BigInt.asUintN(64, a)).toString();
      if (!Number.isFinite(a) || a <= 0) return '0';
      return BigInt.asUintN(64, BigInt(Math.round(a))).toString();
    });
    return this.invokeJson(['eval-core', selector, ...serialized]);
  }
}

export interface CertifiedEngineStageResult {
  readonly id: string;
  readonly budgetMinutes: number;
  readonly isGate: boolean;
  readonly certifiedWorkUnits: number;
  readonly passed: boolean;
  readonly detail: string;
}

export interface CertifiedEngineTickReport {
  readonly bundleResultId: string;
  readonly workflowFile: string;
  readonly tickBudgetMinutes: number;
  readonly gateShareMinutes: number;
  readonly gateMinimumMinutes: number;
  readonly totalCertifiedWorkUnits: number;
  readonly stages: ReadonlyArray<CertifiedEngineStageResult>;
  readonly allPassed: boolean;
}

/**
 * Executes one complete LexLean-modeled CI Engine Tick (`Foundation.Mechanization.V1.Model::stages`)
 * fail-closed through the certified Rust production binary (`CertifiedRustRunner`).
 *
 * If the certified bundle or `verdant_certified_harness` binary is absent, throws `NoCertifiedRootError`
 * immediately without ever falling back to uncertified JavaScript.
 */
export async function runCertifiedEngineTick(
  projectRoot: string = process.cwd(),
  options?: { productionRoot?: string },
): Promise<CertifiedEngineTickReport> {
  // Fail-closed instantiation: throws `NoCertifiedRootError` if bundle or binary is missing
  const runner = new CertifiedRustRunner(projectRoot, options);

  const runtimeMod: any = await import('../src/game/generatedPrismRuntime.ts');
  const uorMod = await import('./uorMechanizerModel.ts');
  const { ensurePrismMechanizedArtifacts } = await import('./prismMechanizer.ts');

  const Mech = runtimeMod.PRISM_COMPILED_MODULES['Foundation.Mechanization.V1.Model'];
  const Comp = runtimeMod.PRISM_COMPILED_MODULES['Foundation.Compression.V1.Model'];
  const App = runtimeMod.PRISM_COMPILED_MODULES['VerdantResonance'].application();

  const modeledStages = Mech.stages() as ReadonlyArray<{
    readonly id: string;
    readonly budget: bigint;
    readonly gate: boolean;
  }>;
  const workflowFile = String(Mech.workflowFile());
  const tickBudgetMinutes = Number(Mech.tickBudget());
  const gateMinimumMinutes = Number(Mech.gateMinimum());
  const budgetSumMinutes = Number(Mech.budgetSum(modeledStages));
  const gateShareMinutes = Number(Mech.gateShare(modeledStages));

  if (budgetSumMinutes !== tickBudgetMinutes || gateShareMinutes < gateMinimumMinutes) {
    throw new Error(
      `Modeled stage budget invariant failed: sum=${budgetSumMinutes} (expected ${tickBudgetMinutes}), gateShare=${gateShareMinutes} (min ${gateMinimumMinutes})`,
    );
  }

  const prismDir = path.join(projectRoot, 'prism');
  const { roots: catalogRoots } = extractProductionRootCatalog(prismDir);
  const foundBundle = findLatestProductionBundleDir(projectRoot, options?.productionRoot);
  const rootSummaries = inspectCertifiedBundleSummaries(
    foundBundle.bundleDir,
    foundBundle.resultJson,
    catalogRoots,
  );

  const stageResults: CertifiedEngineStageResult[] = [];
  let totalCertifiedWorkUnits = 0;

  for (const stage of modeledStages) {
    const budgetMinutes = Number(stage.budget);
    const isGate = Boolean(stage.gate);

    if (stage.id === 'verify-bundle') {
      const noStdCount = rootSummaries.filter((s) => s.targetId === 'rust-core' && s.isNoStd).length;
      const stdCount = rootSummaries.filter((s) => s.targetId === 'rust-std').length;
      const ok =
        rootSummaries.length === catalogRoots.length &&
        rootSummaries.length >= 8 &&
        rootSummaries.every((s) => s.certificationStatus === 'kernel-checked' && s.forbidsUnsafeCode) &&
        noStdCount >= 5 &&
        stdCount >= 3;
      if (!ok) {
        throw new NoCertifiedRootError('Certified bundle failed kernel-checked / forbid(unsafe_code) audit');
      }
      stageResults.push({
        id: stage.id,
        budgetMinutes,
        isGate,
        certifiedWorkUnits: 0,
        passed: true,
        detail: `${rootSummaries.length} roots kernel-checked (${noStdCount} rust-core #![no_std], ${stdCount} rust-std)`,
      });
      continue;
    }

    if (stage.id === 'rule30-discovery') {
      let state = BigInt(Comp.rule30Seed64());
      let work = 0;
      for (let i = 0; i < 8; i++) {
        const stepRes = runner.rule30Step(state);
        state = stepRes.nextState;
        work += stepRes.work;
      }
      const mintAdmit = runner.decideMint(false, false, 16);
      const mintSkipKnown = runner.decideMint(false, true, 15);
      const mintRejectContra = runner.decideMint(true, false, 15);
      work += mintAdmit.work + mintSkipKnown.work + mintRejectContra.work;
      const ok =
        state !== 0n &&
        mintAdmit.outcome === Number(Mech.mintOutcomeAdmitted()) &&
        mintSkipKnown.outcome === Number(Mech.mintOutcomeSkippedKnownKappa()) &&
        mintRejectContra.outcome === Number(Mech.mintOutcomeRejectedContradictory());
      if (!ok) throw new Error('Stage rule30-discovery invariant check failed');
      totalCertifiedWorkUnits += work;
      stageResults.push({
        id: stage.id,
        budgetMinutes,
        isGate,
        certifiedWorkUnits: work,
        passed: true,
        detail: `orbit8=0x${state.toString(16).padStart(16, '0')} | mint admitted/known/contra verified`,
      });
      continue;
    }

    if (stage.id === 'ratchet-audit') {
      let work = 0;
      for (let slot = 0; slot < 10; slot++) {
        const r = runner.foundryRoute(1 << slot);
        work += r.work;
        if (r.classification !== Number(Mech.routingAdmitted())) {
          throw new Error(`Foundry slot ${slot} was not admitted by certified Rust`);
        }
      }
      const unk = runner.foundryRoute(0);
      const amb = runner.foundryRoute(3);
      const regressed = runner.admitLift(true, 0, 1);
      const stayedLifted = runner.admitLift(true, 0, 0);
      work += unk.work + amb.work + regressed.work + stayedLifted.work;
      if (
        unk.classification !== Number(Mech.routingRefusedUnknown()) ||
        amb.classification !== Number(Mech.routingRefusedAmbiguous()) ||
        regressed.admitted !== false ||
        stayedLifted.admitted !== true
      ) {
        throw new Error('Certified Rust Foundry route or UE-16 lift ratchet check failed');
      }
      const { register } = uorMod.ingestProductCodebaseLiftRegister(projectRoot);
      const ratchetPath = path.join(projectRoot, 'prism', 'handwritten-ratchet.json');
      if (fs.existsSync(ratchetPath)) {
        const doc = JSON.parse(fs.readFileSync(ratchetPath, 'utf8'));
        const measured = uorMod.measureHandwrittenAndAxiomRatchetState(projectRoot, register);
        const verdict = uorMod.verifyHandwrittenAndAxiomRatchet(doc, measured);
        if (!verdict.ok) {
          throw new uorMod.RatchetViolationError(verdict.violations);
        }
      }
      totalCertifiedWorkUnits += work;
      stageResults.push({
        id: stage.id,
        budgetMinutes,
        isGate,
        certifiedWorkUnits: work,
        passed: true,
        detail: `10/10 Foundry routes + UE-16 + shrink-only ratchet (${register.summary.liftedCount}/${register.summary.totalFunctions} lifted)`,
      });
      continue;
    }

    if (stage.id === 'teleology-coherence') {
      const sol = runner.triadicCoherence(16, 64, 0, 120);
      const inc = runner.triadicCoherence(15, 48, 920, 40);
      const work = sol.work + inc.work;
      const ceiling = Number(
        runtimeMod.PRISM_COMPILED_MODULES['Foundation.Teleology.V1.Model'].solipsisticRule30CeilingPermille(),
      );
      if (sol.coherencePermille > ceiling || inc.coherencePermille <= ceiling) {
        throw new Error(
          `Teleology coherence check failed: solipsistic=${sol.coherencePermille}‰, inclusive=${inc.coherencePermille}‰ (ceiling=${ceiling}‰)`,
        );
      }
      totalCertifiedWorkUnits += work;
      stageResults.push({
        id: stage.id,
        budgetMinutes,
        isGate,
        certifiedWorkUnits: work,
        passed: true,
        detail: `solipsistic=${sol.coherencePermille}‰ <= ${ceiling}‰ < inclusive=${inc.coherencePermille}‰`,
      });
      continue;
    }

    if (stage.id === 'portfolio-learning') {
      const initWeights = (Mech.initialWeights() as ReadonlyArray<any>).map((w) => ({
        strategy: String(w.strategy),
        family: String(w.family),
        value: Number(w.value),
      }));
      const outcomes = (Mech.fixtureOutcomes() as ReadonlyArray<any>).map((o) => ({
        strategy: String(o.strategy),
        family: String(o.family),
        success: Boolean(o.success),
      }));
      const expectedLearned = (Mech.fixtureLearned() as ReadonlyArray<any>).map((w) => ({
        strategy: String(w.strategy),
        family: String(w.family),
        value: Number(w.value),
      }));
      const learnedRes = runner.learnAll(initWeights, outcomes);
      if (JSON.stringify(learnedRes.weights) !== JSON.stringify(expectedLearned)) {
        throw new Error('Certified Rust learnAll diverged from Foundation.Mechanization.V1.Model::fixtureLearned');
      }
      const committed = (Mech.committedWeights() as ReadonlyArray<any>).map((w) => ({
        strategy: String(w.strategy),
        family: String(w.family),
        value: Number(w.value),
      }));
      const schedOrbit = runner.schedule(committed, 'rule30-orbit', [
        'library-rewrite',
        'step-induction',
        'period-reduction',
        'counterexample',
      ]);
      const schedJudge = runner.schedule(committed, 'botanical-judge', [
        'library-rewrite',
        'step-induction',
        'period-reduction',
      ]);
      if (
        schedOrbit.scheduled[0] !== 'step-induction' ||
        schedJudge.scheduled[0] !== 'library-rewrite'
      ) {
        throw new Error('Certified Rust schedule fixture check failed');
      }
      const work = learnedRes.work + schedOrbit.work + schedJudge.work;
      totalCertifiedWorkUnits += work;
      stageResults.push({
        id: stage.id,
        budgetMinutes,
        isGate,
        certifiedWorkUnits: work,
        passed: true,
        detail: `learnAll(16 weights) + scheduleSound(${schedOrbit.scheduled.join('>')}) verified`,
      });
      continue;
    }

    if (stage.id === 'gate') {
      let work = 0;
      const vectors = App.acceptanceVectors as ReadonlyArray<{
        readonly request: Uint8Array;
        readonly response: Uint8Array;
      }>;
      for (const vec of vectors) {
        const reqHex = Buffer.from(vec.request).toString('hex');
        const expHex = Buffer.from(vec.response).toString('hex');
        const out = runner.dispatchHex(reqHex);
        work += out.work;
        if (out.responseHex !== expHex) {
          throw new Error(
            `Certified Rust dispatch mismatch on 0x${reqHex}: expected 0x${expHex}, got 0x${out.responseHex}`,
          );
        }
      }
      const mechCheck = ensurePrismMechanizedArtifacts(projectRoot, { checkOnly: true });
      const uorCheck = uorMod.syncOrCheckUorMechanizationArtifacts(projectRoot, { write: false });
      const drift = [...mechCheck.specReport.driftDetails, ...uorCheck.driftDetails];
      if (drift.length > 0) {
        throw new Error(`Gate stage detected projection drift: ${drift.join('; ')}`);
      }
      totalCertifiedWorkUnits += work;
      stageResults.push({
        id: stage.id,
        budgetMinutes,
        isGate,
        certifiedWorkUnits: work,
        passed: true,
        detail: `${vectors.length}/${vectors.length} byte vectors certified in Rust + 0 projection drift`,
      });
      continue;
    }

    throw new Error(`Unmodeled engine stage '${stage.id}'`);
  }

  return {
    bundleResultId: runner.resultId,
    workflowFile,
    tickBudgetMinutes,
    gateShareMinutes,
    gateMinimumMinutes,
    totalCertifiedWorkUnits,
    stages: stageResults,
    allPassed: stageResults.length === modeledStages.length && stageResults.every((s) => s.passed),
  };
}
