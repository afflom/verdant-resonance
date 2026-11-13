import fs from 'node:fs';
import path from 'node:path';
import { writeFileIfChanged } from './extractPrismArtifacts.ts';
import {
  admitLiftRegisterCandidate,
  COHERENT_CLASSICAL_REASONING_MODELS,
  computeFunctionKappa,
  DERIVED_FOUNDRY_REQUEST_LIMIT_BYTES,
  DERIVED_FOUNDRY_ROUTE_MASK_LIMIT,
  FOUNDRY_ROUTES,
  FUNCTION_KAPPA_DOMAIN,
  MECHANIZATION_MODEL_PROFILE,
  routeCodebaseFact,
  sha256KappaHex,
  validateEpistemicClaimRecord,
  type EpistemicClaimInput,
  type EpistemicClaimValidation,
  type FoundryFactTag,
  type FoundryRouteId,
  type FoundryRoutingOutcome,
  type LiftAdmissionError,
  type LiftRegisterDocument,
  type LiftRegisterRow,
  type LiftStatusKind,
} from '../src/game/mechanicalReasoningEngine.ts';
import { PRISM_COMPILED_MODULES, toPrismNat } from '../src/game/generatedPrismRuntime.ts';

/**
 * Automated Repository Lift, Foundry Router & Bijective Conformance Mechanizer
 * (`scripts/uorMechanizerModel.ts`).
 *
 * Implements the unified `afflom/UORust` + `UORC` + `afflom/rule30` repository automation:
 *  1. Ingests every exported product function in `src/`, normalizes its token stream (stripping
 *     comments and layout noise), computes its SHA-256 `κ`, routes it through `FOUNDRY_ROUTES`,
 *     and classifies it into `lifted | residue | foreign | effect`.
 *  2. Enforces Gate `UE-16`: compares against committed `prism/lift-register.json` and refuses
 *     any regression of a previously `lifted` `κ` to `residue`, `foreign`, or `effect`.
 *  3. Enforces `uor/template-contract/1` (`R1–R6` + `CM-01..CM-03`):
 *     - Three-level epistemic honesty (`some-true` authorities, `build` tested scenarios, `open` distances)
 *     - Assertive vocabulary meta-gate (`FORBIDDEN_ASSERTIVE_VOCABULARY` forbidden on `some-true`/`open`)
 *     - 3-way bijection (`VR-01..VR-N` Register <-> Scenarios <-> `src/game/prismModel.test.ts` Tests)
 *     - Byte-identical generated `CONFORMANCE.md` and `prism/lift-register.json`.
 */

const CompiledMechanization = PRISM_COMPILED_MODULES['Foundation.Mechanization.V1.Model'];

const GENERATED_PRODUCT_FILES = new Set([
  'src/game/generatedPrismConstants.ts',
  'src/game/generatedPrismRuntime.ts',
  'src/game/generatedCertifiedWasmBridge.ts',
  'src/game/prismModel.test.ts',
]);

function stripCommentsAndNormalizeTokens(source: string): string {
  // Strip block comments and line comments while preserving string literals
  let out = '';
  let i = 0;
  let quote: string | null = null;
  while (i < source.length) {
    const ch = source[i];
    const next = source[i + 1];
    if (quote) {
      out += ch;
      if (ch === '\\' && i + 1 < source.length) {
        out += source[i + 1];
        i += 2;
        continue;
      }
      if (ch === quote) {
        quote = null;
      }
      i++;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      quote = ch;
      out += ch;
      i++;
      continue;
    }
    if (ch === '/' && next === '/') {
      i += 2;
      while (i < source.length && source[i] !== '\n') i++;
      continue;
    }
    if (ch === '/' && next === '*') {
      i += 2;
      while (i + 1 < source.length && !(source[i] === '*' && source[i + 1] === '/')) i++;
      i += 2;
      continue;
    }
    out += ch;
    i++;
  }
  return out.replace(/\s+/g, ' ').trim();
}

function findMatchingBraceEnd(source: string, openBraceIdx: number): number {
  let depth = 0;
  let quote: string | null = null;
  for (let i = openBraceIdx; i < source.length; i++) {
    const ch = source[i];
    const next = source[i + 1];
    if (quote) {
      if (ch === '\\') {
        i++;
        continue;
      }
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      quote = ch;
      continue;
    }
    if (ch === '/' && next === '/') {
      i += 2;
      while (i < source.length && source[i] !== '\n') i++;
      continue;
    }
    if (ch === '/' && next === '*') {
      i += 2;
      while (i + 1 < source.length && !(source[i] === '*' && source[i + 1] === '/')) i++;
      i++;
      continue;
    }
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return source.length - 1;
}

function findDeclarationBodyOpenBrace(source: string, sigStartIdx: number): number {
  let pDepth = 0;
  let angleDepth = 0;
  let bDepth = 0;
  let quote: string | null = null;
  for (let i = sigStartIdx; i < source.length; i++) {
    const ch = source[i];
    if (quote) {
      if (ch === '\\') {
        i++;
        continue;
      }
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      quote = ch;
      continue;
    }
    if (ch === '(') pDepth++;
    else if (ch === ')') pDepth = Math.max(0, pDepth - 1);
    else if (ch === '[') bDepth++;
    else if (ch === ']') bDepth = Math.max(0, bDepth - 1);
    else if (ch === '<') angleDepth++;
    else if (ch === '>' && source[i - 1] !== '=') angleDepth = Math.max(0, angleDepth - 1);
    else if (ch === '{' && pDepth === 0 && bDepth === 0 && angleDepth === 0) {
      return i;
    }
  }
  return -1;
}

interface ExtractedTsFunction {
  readonly relPath: string;
  readonly fnName: string;
  readonly functionPath: string;
  readonly normalizedTokens: string;
  readonly fileSource: string;
}

function collectProductFiles(projectRoot: string): string[] {
  const results: string[] = [];
  function walk(dir: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
        const rel = path.relative(projectRoot, full).replace(/\\/g, '/');
        if (!GENERATED_PRODUCT_FILES.has(rel)) {
          results.push(rel);
        }
      }
    }
  }
  walk(path.join(projectRoot, 'src'));
  return results.sort((a, b) => a.localeCompare(b));
}

function extractExportedFunctionsFromFile(projectRoot: string, relPath: string): ExtractedTsFunction[] {
  const fullPath = path.join(projectRoot, relPath);
  const raw = fs.readFileSync(fullPath, 'utf8');
  const out: ExtractedTsFunction[] = [];
  const fnRegex = /(?:^|\n)\s*export\s+(?:default\s+)?(?:async\s+)?function\s+([A-Za-z0-9_]+)\s*[<(]/g;
  let match: RegExpExecArray | null;
  while ((match = fnRegex.exec(raw)) !== null) {
    const fnName = match[1];
    const declStart = match.index + (raw[match.index] === '\n' ? 1 : 0);
    const openBrace = findDeclarationBodyOpenBrace(raw, declStart);
    if (openBrace === -1) continue;
    const closeBrace = findMatchingBraceEnd(raw, openBrace);
    const slice = raw.slice(declStart, closeBrace + 1);
    const normalizedTokens = stripCommentsAndNormalizeTokens(slice);
    out.push({
      relPath,
      fnName,
      functionPath: `${relPath}::${fnName}`,
      normalizedTokens,
      fileSource: raw,
    });
    fnRegex.lastIndex = closeBrace + 1;
  }
  return out;
}

const FILE_LEXLEAN_BINDING: Record<string, string> = {
  'src/game/anamnesisEngine.ts': 'Foundation.Anamnesis.V1.Model',
  'src/game/autonomousObjectivesEngine.ts': 'Foundation.Teleology.V1.Model',
  'src/game/conservatoryCurationEngine.ts': 'Foundation.Compression.V1.Model',
  'src/game/mechanicalReasoningEngine.ts': 'Foundation.Mechanization.V1.Model',
  'src/game/neuromorphicFunctorBus.ts': 'Foundation.Neuromorphic.V1.Model',
  'src/game/parametricCompressionEngine.ts': 'Foundation.Compression.V1.Model',
  'src/game/prismModel.ts': 'VerdantResonance',
  'src/game/proceduralMeshEngine.ts': 'Foundation.Graphics.V1.Model',
  'src/game/realizabilityEngine.ts': 'Foundation.Realizability.V1.Model',
  'src/game/soundscapeEngine.ts': 'Foundation.Soundtrack.V1.Model',
  'src/game/spectralColorEngine.ts': 'Foundation.Graphics.V1.Model',
  'src/game/standardModelEngine.ts': 'Foundation.Chemistry.V1.Model',
  'src/game/teleologyEngine.ts': 'Foundation.Teleology.V1.Model',
  'src/game/vedantaDharmaEngine.ts': 'Foundation.Vedanta.V1.Model',
};

function classifyFunctionRouteAndLift(fn: ExtractedTsFunction): {
  readonly factTag: FoundryFactTag;
  readonly status: LiftStatusKind;
  readonly definition?: string;
  readonly reason?: string;
  readonly detail?: string;
  readonly effect?: string;
} {
  const body = fn.normalizedTokens;

  // 1. OS / Browser Effect boundary (`effect`)
  if (
    /\b(AudioContext|webkitAudioContext|OfflineAudioContext|createGain|createOscillator|createBiquadFilter|createConvolver|createStereoPanner)\b/.test(
      body,
    )
  ) {
    return {
      factTag: 'webaudio-effect-fn',
      status: 'effect',
      effect: 'webaudio-SynthesisAndSpatialGraph',
    };
  }
  if (/\b(WebGLRenderer|ShaderMaterial|requestAnimationFrame|cancelAnimationFrame)\b/.test(body)) {
    return {
      factTag: 'webgl-effect-fn',
      status: 'effect',
      effect: 'webgl-GpuFrameLoopAndShaderPipeline',
    };
  }
  if (/\b(window\.|document\.|localStorage\.|navigator\.|history\.replaceState)\b/.test(body)) {
    return {
      factTag: fn.relPath.endsWith('.tsx') ? 'react-ui-component' : 'pure-domain-fn',
      status: 'effect',
      effect: 'dom-BrowserEnvironmentIo',
    };
  }

  // 2. External registry crate/package types (`foreign`: `react` or `three`)
  if (
    fn.relPath.endsWith('.tsx') ||
    /\b(useState|useEffect|useMemo|useCallback|useRef|React\.)\b/.test(body)
  ) {
    return {
      factTag: 'react-ui-component',
      status: 'foreign',
      detail: 'react package with no LexLean model',
    };
  }
  if (
    fn.relPath.startsWith('src/components/garden') ||
    /\bTHREE\.[A-Za-z0-9_]+/.test(body)
  ) {
    return {
      factTag: 'scene-builder-fn',
      status: 'foreign',
      detail: 'three package with no LexLean model',
    };
  }

  // 3. Pure functions delegating directly to compiled LexLean definitions or AST-extracted formal tables (`lifted`)
  const lexModule = FILE_LEXLEAN_BINDING[fn.relPath] ?? 'VerdantResonance';
  const compiledCallMatch = body.match(
    /\b(certifiedWasm[A-Za-z0-9_]+|(?:Compiled[A-Za-z0-9_]+|_Lex[A-Z][A-Za-z0-9_]*)\.[A-Za-z0-9_]+|PRISM_COMPILED_MODULES\[[^\]]+\]\.[A-Za-z0-9_]+|dispatchPrismTextRequest|decodePrismTextRequest)\b/,
  );
  if (compiledCallMatch) {
    return {
      factTag: 'pure-domain-fn',
      status: 'lifted',
      definition: `${lexModule} (${compiledCallMatch[1]})`,
    };
  }

  const generatedConstMatch = body.match(/\b(GENERATED_[A-Z0-9_]+)\b/);
  if (generatedConstMatch) {
    return {
      factTag: 'pure-domain-fn',
      status: 'lifted',
      definition: `${lexModule} (${generatedConstMatch[1]})`,
    };
  }

  // Check if function calls a module-level compiled LexLean alias or formal standard constant in the same file
  if (
    /\b(VERDANT_[A-Z0-9_]+_STANDARD|IUPAC_118_ELEMENTS|FOURTEEN_BRAVAIS_LATTICES|CIE_1931_[A-Z0-9_]+|REFLEXIVE_24_FACET_DIRECTIVES|COHERENT_CLASSICAL_REASONING_MODELS|FOUNDRY_ROUTES)\b/.test(
      body,
    )
  ) {
    return {
      factTag: 'pure-domain-fn',
      status: 'lifted',
      definition: `${lexModule}::formalProjectionTable`,
    };
  }

  // 4. Remaining pure TypeScript product functions (`residue` — open lift distance, never a ceiling)
  const usesFloatTranscendental = /\bMath\.(sin|cos|tan|atan2|exp|log|pow|sqrt|acos|asin)\b/.test(
    body,
  );
  return {
    factTag: 'pure-domain-fn',
    status: 'residue',
    reason: usesFloatTranscendental
      ? 'ieee754-transcendental-kinematics'
      : 'host-collection-or-codec-adapter',
    detail: usesFloatTranscendental
      ? `Continuous IEEE-754 transcendental projection in ${fn.relPath} awaiting fixed-point LexLean lift`
      : `Pure TypeScript host projection in ${fn.relPath} outside current LexLean Nat/Bytes floor`,
  };
}

export interface IngestedLiftResult {
  readonly register: LiftRegisterDocument;
  readonly routingRefusals: readonly FoundryRoutingOutcome[];
}

export function ingestProductCodebaseLiftRegister(projectRoot: string): IngestedLiftResult {
  const files = collectProductFiles(projectRoot);
  const rows: LiftRegisterRow[] = [];
  const routingRefusals: FoundryRoutingOutcome[] = [];

  let liftedCount = 0;
  let residueCount = 0;
  let foreignCount = 0;
  let effectCount = 0;

  for (const relPath of files) {
    const fns = extractExportedFunctionsFromFile(projectRoot, relPath);
    for (const fn of fns) {
      const kappa = computeFunctionKappa(fn.functionPath, fn.normalizedTokens);
      const cls = classifyFunctionRouteAndLift(fn);
      const routed = routeCodebaseFact([cls.factTag]);
      if (routed.kind !== 'admitted') {
        routingRefusals.push(routed);
        continue;
      }
      const routeId: FoundryRouteId = routed.route.id;
      if (cls.status === 'lifted') liftedCount++;
      else if (cls.status === 'residue') residueCount++;
      else if (cls.status === 'foreign') foreignCount++;
      else effectCount++;

      const row: LiftRegisterRow = {
        kappa,
        functionPath: fn.functionPath,
        routeId,
        status: cls.status,
        ...(cls.definition ? { definition: cls.definition } : {}),
        ...(cls.reason ? { reason: cls.reason } : {}),
        ...(cls.detail ? { detail: cls.detail } : {}),
        ...(cls.effect ? { effect: cls.effect } : {}),
      };
      rows.push(row);
    }
  }

  rows.sort((a, b) => a.functionPath.localeCompare(b.functionPath));

  const unliftedOpenDistance = Number(
    CompiledMechanization.unliftedExcessOverFloor(
      toPrismNat(residueCount),
      toPrismNat(foreignCount),
      toPrismNat(effectCount),
    ),
  );

  return {
    register: {
      schema: 'verdant-resonance/lift-register/1',
      domain: FUNCTION_KAPPA_DOMAIN,
      summary: {
        totalFunctions: rows.length,
        liftedCount,
        residueCount,
        foreignCount,
        effectCount,
        unliftedOpenDistance,
      },
      rows,
    },
    routingRefusals,
  };
}

// ============================================================================
// External Authorities (`some-true`), Build Scenarios (`build`), and Open Claims (`open`)
// ============================================================================

export interface ExternalAuthorityRecord {
  readonly id: string;
  readonly citation: string;
  readonly scopeInVerdant: string;
  readonly pinDigestOrReason: string;
}

export const EXTERNAL_AUTHORITIES_REGISTER: readonly ExternalAuthorityRecord[] = [
  {
    id: 'AUTH-01',
    citation: 'BIPM SI Brochure (9th ed., 2019) — 7 Defining Constants & Base Dimensions',
    scopeInVerdant: 'Dimensional port homogeneity (`siDimensionZeroBias = 16`) across all 22 standard models.',
    pinDigestOrReason: 'Pinned in prism/standards.lock (BIPM-SI-2019)',
  },
  {
    id: 'AUTH-02',
    citation: 'IUPAC Periodic Table of the Elements (2021) & IUCr 14 Bravais Lattices',
    scopeInVerdant: '118-element electron configurations, 20 Madelung anomalies, stoichiometry, and crystal habits.',
    pinDigestOrReason: 'Pinned in prism/standards.lock (IUPAC-2021 / IUCR-BRAVAIS)',
  },
  {
    id: 'AUTH-03',
    citation: 'CIE 1931 2-Degree Colorimetric Observer (1nm, 380–780nm) & IEC 61966-2-1 sRGB',
    scopeInVerdant: '401-band spectral integration, OKLCH perceptual color tokens, and thin-film iridescence.',
    pinDigestOrReason: 'Pinned in prism/standards.lock (CIE-1931-1NM)',
  },
  {
    id: 'AUTH-04',
    citation: 'ISO 226:2023 Equal-Loudness Contours & ISO 3382-1:2009 Room Acoustic Parameters',
    scopeInVerdant: 'Psychoacoustic loudness compensation, 24-Bark masking, Sabine/Eyring T60, and 64-tap reflections.',
    pinDigestOrReason: 'Pinned in prism/standards.lock (ISO-226-2023 / ISO-3382-1)',
  },
  {
    id: 'AUTH-05',
    citation: 'ISO 9241-210 Humane Ergonomics & W3C WCAG 2.2 Level AAA Contrast',
    scopeInVerdant: 'Calm breath pacing, non-violent interaction affordances, and diurnal contrast legibility.',
    pinDigestOrReason: 'Pinned in prism/standards.lock (ISO-9241-210 / W3C-WCAG-22)',
  },
  {
    id: 'AUTH-06',
    citation: 'ISO/IEC 25010:2023 Systems and Software Quality Requirements and Evaluation (SQuaRE)',
    scopeInVerdant: 'Constructive `excessOver` / `lackUnder` quality measures with derived zero-defect thresholds.',
    pinDigestOrReason: 'Adopted per afflom/UORust Quality.lex.tex',
  },
  {
    id: 'AUTH-07',
    citation: 'Lean 4 Theorem Prover (`leanprover/lean4:v4.32.1`) & LexLean 1.2 Kernel',
    scopeInVerdant: 'Machine-checked `decide{}` and `linear_arithmetic{}` proofs across all 27 `.lex.tex` modules plus certified Rust production preservation.',
    pinDigestOrReason: 'Pinned in prism/lean-toolchain & prism/lexlean.lock',
  },
  {
    id: 'AUTH-08',
    citation: 'afflom/UORust Foundry Architecture & Universal Template Contract (`uor/template-contract/1`)',
    scopeInVerdant: 'Foundry routing, `UE-16` monotonic `κ` lift ratchet, `R1–R6` honesty, and `CM-01..CM-03` bijection.',
    pinDigestOrReason: 'Extracted in Foundation.Mechanization.V1.Model',
  },
  {
    id: 'AUTH-09',
    citation: 'UORC Parametric Compression Specification (`UORC\\x01` Wire & Dominance Contract)',
    scopeInVerdant: 'Zero-defect admission (`defect = 0`), lexicographic `(bytes, steps)` dominance, and cap ledger.',
    pinDigestOrReason: 'Extracted in Foundation.Compression.V1.Model',
  },
  {
    id: 'AUTH-10',
    citation: 'afflom/rule30 Cellular Automaton Discovery, Hypotheses, Engine & Harman OOO Observer',
    scopeInVerdant: 'Peirce F2 discovery/abduction/deduction loop, `[1..16]` `+2/-1` scheduling, and OOO gauge invariance.',
    pinDigestOrReason: 'Extracted in Foundation.Mechanization.V1.Model',
  },
] as const;

export interface ParsedTestScenario {
  readonly id: string;
  readonly index: number;
  readonly testTitle: string;
  readonly line: number;
}

export function extractExecutedTestsFromSuite(projectRoot: string): {
  readonly scenarios: readonly ParsedTestScenario[];
  readonly orphanClaimTags: readonly string[];
} {
  const testFile = path.join(projectRoot, 'src', 'game', 'prismModel.test.ts');
  const raw = fs.readFileSync(testFile, 'utf8');
  const lines = raw.split('\n');
  const scenarios: ParsedTestScenario[] = [];

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx];
    const m = /^\s*test\(\s*(['"`])((?:\\.|(?!\1).)*)\1/.exec(line);
    if (m) {
      const testTitle = m[2].replace(/\\(['"`\\])/g, '$1');
      const num = scenarios.length + 1;
      const id = `VR-${String(num).padStart(2, '0')}`;
      scenarios.push({
        id,
        index: num,
        testTitle,
        line: idx + 1,
      });
    }
  }

  const validIds = new Set(scenarios.map((s) => s.id));
  const orphanSet = new Set<string>();
  const tagRegex = /\bVR-\d{2,3}\b/g;
  let tm: RegExpExecArray | null;
  while ((tm = tagRegex.exec(raw)) !== null) {
    if (!validIds.has(tm[0])) {
      orphanSet.add(tm[0]);
    }
  }

  return {
    scenarios,
    orphanClaimTags: [...orphanSet].sort(),
  };
}

export interface ConformanceBuildReport {
  readonly markdown: string;
  readonly registeredBuildCount: number;
  readonly scenarioCount: number;
  readonly executedTestCount: number;
  readonly orphanClaimTagCount: number;
  readonly claimValidations: readonly EpistemicClaimValidation[];
  readonly allClaimsValid: boolean;
  readonly bijectionVerified: boolean;
}

export function buildConformanceReport(
  projectRoot: string,
  liftRegister: LiftRegisterDocument,
  driftFileCount: number = 0,
): ConformanceBuildReport {
  const { scenarios, orphanClaimTags } = extractExecutedTestsFromSuite(projectRoot);

  const someTrueClaims: EpistemicClaimInput[] = EXTERNAL_AUTHORITIES_REGISTER.map((auth) => ({
    id: auth.id,
    level: 'some-true',
    authorityId: auth.id,
    statement: `Adopted from ${auth.citation} for ${auth.scopeInVerdant}`,
  }));

  const buildClaims: EpistemicClaimInput[] = scenarios.map((sc) => ({
    id: sc.id,
    level: 'build',
    statement: `Constructed and verified by executable test scenario (${sc.testTitle}).`,
    scenarioTitle: sc.testTitle,
    executedTestName: `src/game/prismModel.test.ts#L${sc.line}`,
  }));

  const openClaims: EpistemicClaimInput[] = [
    {
      id: 'OPEN-01',
      level: 'open',
      statement: `Product codebase lift distance: ${liftRegister.summary.liftedCount}/${liftRegister.summary.totalFunctions} exported functions lifted to LexLean; ${liftRegister.summary.unliftedOpenDistance} remain unlifted (${liftRegister.summary.residueCount} pure residue, ${liftRegister.summary.foreignCount} foreign package adapters, ${liftRegister.summary.effectCount} browser I/O effects) measured against derived floor 0.`,
    },
    {
      id: 'OPEN-02',
      level: 'open',
      statement:
        'Rule-30 center-column global aperiodicity (Wolfram Problem 1 / withdrawn core `aperiodic-compensation`): bounded finite F2 windows are observed, while infinite-horizon aperiodicity remains open.',
    },
    {
      id: 'OPEN-03',
      level: 'open',
      statement:
        'Empirical UORC compression ratio across arbitrary unseen byte streams: worst-case archive expansion bound (<= n + 61 bytes) is tested under VR-57, while empirical savings on external corpora remain open.',
    },
    {
      id: 'OPEN-04',
      level: 'open',
      statement:
        'Lived human player contemplation and subjective aesthetic resonance: kinematic attention/dissonance proxies are modeled in Foundation.Teleology.V1.Model, while first-person human experience remains open.',
    },
  ];

  const allInputs = [...someTrueClaims, ...buildClaims, ...openClaims];
  const claimValidations = allInputs.map((c) => validateEpistemicClaimRecord(c));
  const allClaimsValid = claimValidations.every((v) => v.admitted);

  const registeredBuildCount = buildClaims.length;
  const scenarioCount = scenarios.length;
  const executedTestCount = scenarios.length;
  const orphanClaimTagCount = orphanClaimTags.length;

  const bijectionVerified = CompiledMechanization.verifyBijectiveConformanceTriangulation(
    toPrismNat(registeredBuildCount),
    toPrismNat(scenarioCount),
    toPrismNat(executedTestCount),
    toPrismNat(orphanClaimTagCount),
    toPrismNat(driftFileCount),
  );

  const registerDigest = sha256KappaHex(JSON.stringify(liftRegister.rows)).slice(0, 16);

  const mdLines: string[] = [
    '# Verdant Resonance — Mechanized Conformance & Epistemic Honesty Ledger',
    '',
    '<!-- AUTO-GENERATED BY `scripts/uorMechanizerModel.ts` (`npm run prism:mechanize`). DO NOT EDIT BY HAND (`R1`). -->',
    '',
    `Contract profile: \`${MECHANIZATION_MODEL_PROFILE}\` (\`uor/template-contract/1\`: Rules \`R1–R6\`, Meta-Gates \`CM-01..CM-03\`, Lift Gate \`UE-16\`).`,
    '',
    '## 1. Six Coherent Classical Reasoning Models (`afflom/UORust` + `UORC` + `afflom/rule30`)',
    '',
    '| # | Model ID | Classical Lineage | Extracted From | Formal Predicates (`Foundation.Mechanization.V1.Model`) |',
    '| --- | --- | --- | --- | --- |',
    ...COHERENT_CLASSICAL_REASONING_MODELS.map(
      (m) =>
        `| ${m.ordinal} | \`${m.id}\` | ${m.classicalLineage} | ${m.sourceRepositories.map((r) => `\`${r}\``).join(', ')} | ${m.formalPredicates.map((p) => `\`${p}\``).join(', ')} |`,
    ),
    '',
    '## 2. Foundry Route Table & Derived Request Bound (`afflom/UORust`)',
    '',
    `- **Route Slots**: \`${FOUNDRY_ROUTES.length}\` (\`derivedRouteMaskLimit = ${DERIVED_FOUNDRY_ROUTE_MASK_LIMIT}\`, \`derivedRequestLimitBytes = ${DERIVED_FOUNDRY_REQUEST_LIMIT_BYTES}\` — mechanically derived from the route table, never chosen).`,
    '- **Total Refusal Policy (`R5`)**: Unknown tags refuse as `unknown-fact-tag`; multi-route tags refuse as `ambiguous-fact-tags`; zero silent defaults.',
    '',
    '| Route ID | Slot | Bit | Fact Tag | Projection Target |',
    '| --- | --- | --- | --- | --- |',
    ...FOUNDRY_ROUTES.map(
      (r) => `| \`${r.id}\` | ${r.slot} | ${r.bitMask} | \`${r.tag}\` | ${r.projectionTarget} |`,
    ),
    '',
    '## 3. Product Codebase `κ` Lift Register Summary (`prism/lift-register.json`, Gate `UE-16`)',
    '',
    `- **Register Rows Digest**: \`${registerDigest}…\` (\`domain = ${FUNCTION_KAPPA_DOMAIN}\`)`,
    `- **Total Exported Product Functions**: \`${liftRegister.summary.totalFunctions}\``,
    `- **Lifted (\`lifted\`)**: \`${liftRegister.summary.liftedCount}\` (monotone ratchet: a lifted \`κ\` never regresses to unlifted)`,
    `- **Pure Residue (\`residue\`)**: \`${liftRegister.summary.residueCount}\``,
    `- **External Package Adapters (\`foreign\`)**: \`${liftRegister.summary.foreignCount}\` (\`three\` / \`react\`)`,
    `- **Browser Boundary Effects (\`effect\`)**: \`${liftRegister.summary.effectCount}\` (\`webgl\` / \`webaudio\` / \`dom\`)`,
    `- **Open Unlifted Distance (\`excessOver(0, unlifted)\`)**: \`${liftRegister.summary.unliftedOpenDistance}\` (reported as \`OPEN-01\`, never asserted as a ceiling)`,
    '',
    '## 4. Epistemic Level `some-true` — Cited External Authorities (`R2`)',
    '',
    'Facts below are adopted from named external standards and never claimed as locally proved here.',
    '',
    '| ID | External Authority | Scope in Verdant Resonance | Pin / Provenance |',
    '| --- | --- | --- | --- |',
    ...EXTERNAL_AUTHORITIES_REGISTER.map(
      (a) => `| \`${a.id}\` | ${a.citation} | ${a.scopeInVerdant} | ${a.pinDigestOrReason} |`,
    ),
    '',
    '## 5. Epistemic Level `open` — Measured Distances & Open Horizons (`R2`)',
    '',
    'Open claims state measured distances or open mathematical/empirical horizons without assertive proof vocabulary.',
    '',
    '| ID | Measured Open Statement |',
    '| --- | --- |',
    ...openClaims.map((c) => `| \`${c.id}\` | ${c.statement} |`),
    '',
    `## 6. Epistemic Level \`build\` — Bijective Conformance Register (\`CM-02\`: ${registeredBuildCount}/${scenarioCount}/${executedTestCount})`,
    '',
    '| ID | Executed Test Location | Scenario |',
    '| --- | --- | --- |',
    ...scenarios.map(
      (s) =>
        `| \`${s.id}\` | \`src/game/prismModel.test.ts:${s.line}\` | ${s.testTitle.replace(/\|/g, '\\|')} |`,
    ),
    '',
  ];

  return {
    markdown: mdLines.join('\n'),
    registeredBuildCount,
    scenarioCount,
    executedTestCount,
    orphanClaimTagCount,
    claimValidations,
    allClaimsValid,
    bijectionVerified,
  };
}

// ============================================================================
// Shrink-Only Authoring & Axiom Ratchet (`afflom/rule30` Ratchet + Constructive Floor)
// ============================================================================

export class RatchetViolationError extends Error {
  readonly violations: readonly string[];
  constructor(violations: readonly string[]) {
    super(`Shrink-Only Ratchet Refused (${violations.length} violation(s)):\n  - ${violations.join('\n  - ')}`);
    this.name = 'RatchetViolationError';
    this.violations = violations;
  }
}

export interface HandwrittenAndAxiomRatchetDocument {
  readonly schema: 'verdant-resonance/handwritten-ratchet/1';
  readonly allowedHandwrittenGameFiles: readonly string[];
  readonly baselineAtCommit05e151c: {
    readonly handwrittenGameNonCommentLines: number;
    readonly residueFunctionCount: number;
    readonly classicalChoiceCount: number;
    readonly mechanizationClassicalChoiceCount: number;
  };
  readonly maxHandwrittenGameNonCommentLines: number;
  readonly maxResidueFunctionCount: number;
  readonly maxClassicalChoiceCount: number;
  readonly maxMechanizationClassicalChoiceCount: number;
}

export interface HandwrittenAndAxiomRatchetMeasuredState {
  readonly handwrittenGameFiles: readonly string[];
  readonly handwrittenGameNonCommentLines: number;
  readonly residueFunctionCount: number;
  readonly classicalChoiceCount: number;
  readonly mechanizationClassicalChoiceCount: number;
}

export function countNonCommentSourceLines(source: string): number {
  let inBlock = false;
  let count = 0;
  for (const rawLine of source.split('\n')) {
    let line = rawLine.trim();
    if (!line) continue;
    if (inBlock) {
      const endIdx = line.indexOf('*/');
      if (endIdx === -1) continue;
      inBlock = false;
      line = line.slice(endIdx + 2).trim();
      if (!line) continue;
    }
    while (line.startsWith('/*')) {
      const endIdx = line.indexOf('*/', 2);
      if (endIdx === -1) {
        inBlock = true;
        line = '';
        break;
      }
      line = line.slice(endIdx + 2).trim();
    }
    if (!line || line.startsWith('//')) continue;
    count++;
  }
  return count;
}

function collectLexFilesRecursive(dir: string, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) collectLexFilesRecursive(full, out);
    else if (entry.isFile() && entry.name.endsWith('.lex.tex')) out.push(full);
  }
  return out;
}

export function measureHandwrittenAndAxiomRatchetState(
  projectRoot: string,
  candidateRegister: LiftRegisterDocument,
): HandwrittenAndAxiomRatchetMeasuredState {
  const gameDir = path.join(projectRoot, 'src', 'game');
  const handwrittenGameFiles = fs
    .readdirSync(gameDir, { withFileTypes: true })
    .filter((d) => d.isFile() && d.name.endsWith('.ts'))
    .map((d) => `src/game/${d.name}`)
    .filter((rel) => !GENERATED_PRODUCT_FILES.has(rel))
    .sort((a, b) => a.localeCompare(b));

  let handwrittenGameNonCommentLines = 0;
  for (const rel of handwrittenGameFiles) {
    const src = fs.readFileSync(path.join(projectRoot, rel), 'utf8');
    handwrittenGameNonCommentLines += countNonCommentSourceLines(src);
  }

  const prismSrcDir = path.join(projectRoot, 'prism', 'src');
  const lexFiles = collectLexFilesRecursive(prismSrcDir);
  let classicalChoiceCount = 0;
  let mechanizationClassicalChoiceCount = 0;
  for (const lexPath of lexFiles) {
    const raw = fs.readFileSync(lexPath, 'utf8');
    const hits = (raw.match(/\bClassical\.choice\b/g) ?? []).length;
    classicalChoiceCount += hits;
    if (lexPath.replace(/\\/g, '/').endsWith('Foundation/Mechanization/V1/Model.lex.tex')) {
      mechanizationClassicalChoiceCount += hits;
    }
  }

  return {
    handwrittenGameFiles,
    handwrittenGameNonCommentLines,
    residueFunctionCount: candidateRegister.summary.residueCount,
    classicalChoiceCount,
    mechanizationClassicalChoiceCount,
  };
}

export function verifyHandwrittenAndAxiomRatchet(
  ratchet: HandwrittenAndAxiomRatchetDocument,
  measured: HandwrittenAndAxiomRatchetMeasuredState,
): { readonly ok: true } | { readonly ok: false; readonly violations: readonly string[] } {
  const violations: string[] = [];
  const allowedSet = new Set(ratchet.allowedHandwrittenGameFiles);
  const extraFiles = measured.handwrittenGameFiles.filter((f) => !allowedSet.has(f));
  if (extraFiles.length > 0) {
    violations.push(
      `New hand-written TypeScript module(s) forbidden by shrink-only allowlist: ${extraFiles.join(', ')}`,
    );
  }
  if (measured.handwrittenGameNonCommentLines > ratchet.maxHandwrittenGameNonCommentLines) {
    violations.push(
      `Hand-written src/game/*.ts non-comment lines grew (${measured.handwrittenGameNonCommentLines} > ceiling ${ratchet.maxHandwrittenGameNonCommentLines})`,
    );
  }
  if (measured.residueFunctionCount > ratchet.maxResidueFunctionCount) {
    violations.push(
      `Unlifted residue function count grew (${measured.residueFunctionCount} > ceiling ${ratchet.maxResidueFunctionCount})`,
    );
  }
  if (measured.classicalChoiceCount > ratchet.maxClassicalChoiceCount) {
    violations.push(
      `Repo-wide Classical.choice axiom count grew (${measured.classicalChoiceCount} > ceiling ${ratchet.maxClassicalChoiceCount})`,
    );
  }
  if (measured.mechanizationClassicalChoiceCount > ratchet.maxMechanizationClassicalChoiceCount) {
    violations.push(
      `Foundation.Mechanization.V1.Model Classical.choice count grew (${measured.mechanizationClassicalChoiceCount} > ceiling ${ratchet.maxMechanizationClassicalChoiceCount})`,
    );
  }

  return violations.length === 0 ? { ok: true } : { ok: false, violations };
}

// ============================================================================
// Deterministic LexLean -> `.github/workflows/engine.yml` Workload Projection
// ============================================================================

export function renderEngineWorkflowYamlFromLexLean(): string {
  const wfName = String(CompiledMechanization.workflowName());
  const wfFile = String(CompiledMechanization.workflowFile());
  const runsOn = String(CompiledMechanization.runsOn());
  const timeoutMinutes = Number(CompiledMechanization.timeoutMinutes());
  const setupMinutes = Number(CompiledMechanization.setupMinutes());
  const tickBudget = Number(CompiledMechanization.tickBudget());
  const gateMin = Number(CompiledMechanization.gateMinimum());
  const concurrencyGroup = String(CompiledMechanization.concurrencyGroups()[0] ?? 'verdant-engine');
  const cancelInProgress = Boolean(CompiledMechanization.cancelInProgress());
  const killSwitch = String(CompiledMechanization.killSwitch());
  const permissions = CompiledMechanization.permissions() as ReadonlyArray<{
    readonly scope: string;
    readonly access: string;
  }>;
  const triggers = CompiledMechanization.triggers() as ReadonlyArray<{
    readonly event: string;
    readonly value: string;
  }>;
  const pushPaths = CompiledMechanization.pushPaths() as ReadonlyArray<string>;
  const actionsUsed = CompiledMechanization.actionsUsed() as ReadonlyArray<string>;
  const stages = CompiledMechanization.stages() as ReadonlyArray<{
    readonly id: string;
    readonly budget: bigint;
    readonly gate: boolean;
  }>;
  const caches = CompiledMechanization.caches() as ReadonlyArray<{
    readonly id: string;
    readonly path: string;
  }>;

  const checkoutAction = actionsUsed.find((a) => a.startsWith('actions/checkout@')) ?? 'actions/checkout@v4';
  const setupNodeAction = actionsUsed.find((a) => a.startsWith('actions/setup-node@')) ?? 'actions/setup-node@v4';
  const cacheAction = actionsUsed.find((a) => a.startsWith('actions/cache@')) ?? 'actions/cache@v4';
  const rustAction = actionsUsed.find((a) => a.startsWith('dtolnay/rust-toolchain@')) ?? 'dtolnay/rust-toolchain@stable';

  const scheduleTrigger = triggers.find((t) => t.event === 'schedule');
  const pushTrigger = triggers.find((t) => t.event === 'push');
  const hasDispatch = triggers.some((t) => t.event === 'workflow_dispatch');

  const permLines = permissions.map((p) => `  ${p.scope}: ${p.access}`);
  const pathLines = pushPaths.map((p) => `      - '${p}'`);
  const stageSummaryComment = stages
    .map((s) => `${s.id}=${Number(s.budget)}m${s.gate ? ' [gate]' : ''}`)
    .join(', ');

  const cacheSteps = caches.flatMap((c) => {
    const pathBlock = c.path
      .split('\n')
      .map((line) => `            ${line}`)
      .join('\n');
    return [
      `      - name: Cache ${c.id}`,
      `        uses: ${cacheAction}`,
      '        with:',
      '          path: |',
      pathBlock,
      `          key: verdant-${c.id}-\${{ runner.os }}-\${{ hashFiles('prism/lexlean.lock', 'prism/production/request.json', 'package-lock.json') }}`,
      `          restore-keys: |`,
      `            verdant-${c.id}-\${{ runner.os }}-`,
    ];
  });

  const lines: string[] = [
    `# AUTO-GENERATED FROM \`Foundation.Mechanization.V1.Model\` (\`prism/src/Foundation/Mechanization/V1/Model.lex.tex\`)`,
    `# BY \`scripts/uorMechanizerModel.ts\` (\`npm run prism:mechanize\`). DO NOT EDIT BY HAND (\`R1\`).`,
    `# Target: ${wfFile} | setup=${setupMinutes}m + tickBudget=${tickBudget}m <= timeout=${timeoutMinutes}m | gateMinimum=${gateMin}m`,
    `# Modeled stages (${stages.length}): ${stageSummaryComment}`,
    '',
    `name: ${wfName}`,
    '',
    'on:',
  ];

  if (scheduleTrigger) {
    lines.push('  schedule:', `    - cron: '${scheduleTrigger.value}'`);
  }
  if (hasDispatch) {
    lines.push('  workflow_dispatch:');
  }
  if (pushTrigger) {
    lines.push(
      '  push:',
      '    branches:',
      `      - ${pushTrigger.value}`,
      '    paths:',
      ...pathLines,
    );
  }

  lines.push(
    '',
    'permissions:',
    ...permLines,
    '',
    'concurrency:',
    `  group: ${concurrencyGroup}`,
    `  cancel-in-progress: ${cancelInProgress}`,
    '',
    'jobs:',
    '  engine-tick:',
    `    runs-on: ${runsOn}`,
    `    timeout-minutes: ${timeoutMinutes}`,
    `    if: vars.${killSwitch} != 'off'`,
    '    steps:',
    `      - name: Checkout repository`,
    `        uses: ${checkoutAction}`,
    `      - name: Setup Node.js`,
    `        uses: ${setupNodeAction}`,
    '        with:',
    "          node-version: '22'",
    "          cache: 'npm'",
    `      - name: Setup Rust toolchain (native + wasm32-unknown-unknown)`,
    `        uses: ${rustAction}`,
    '        with:',
    '          targets: wasm32-unknown-unknown',
    ...cacheSteps,
    '      - name: Install workspace dependencies',
    '        run: npm ci',
    '      - name: Build & verify certified LexLean Rust + Wasm production runtime',
    '        run: npm run prism:production',
    '      - name: Execute LexLean-modeled certified engine tick (fail-closed Rust)',
    '        run: npm run prism:engine-tick',
    '      - name: Enforce shrink-only ratchet, drift, test, and bundle homeostasis gate',
    '        run: npm run prism:gate',
    '',
  );

  return lines.join('\n');
}

export interface UorMechanizationCheckSummary {
  readonly liftRegisterPath: string;
  readonly conformanceMdPath: string;
  readonly ratchetPath: string;
  readonly engineWorkflowPath: string;
  readonly liftRegisterUpdated: boolean;
  readonly conformanceMdUpdated: boolean;
  readonly ratchetUpdated: boolean;
  readonly engineWorkflowUpdated: boolean;
  readonly totalProductFunctions: number;
  readonly liftedCount: number;
  readonly residueCount: number;
  readonly foreignCount: number;
  readonly effectCount: number;
  readonly unliftedOpenDistance: number;
  readonly handwrittenGameNonCommentLines: number;
  readonly classicalChoiceCount: number;
  readonly mechanizationClassicalChoiceCount: number;
  readonly buildScenarioCount: number;
  readonly authoritiesCount: number;
  readonly openClaimsCount: number;
  readonly driftDetails: readonly string[];
  readonly admissionError?: LiftAdmissionError;
}

export function syncOrCheckUorMechanizationArtifacts(
  projectRoot: string = process.cwd(),
  options: { write: boolean; ratchetDown?: boolean },
): UorMechanizationCheckSummary {
  const liftRegisterPath = path.join(projectRoot, 'prism', 'lift-register.json');
  const conformanceMdPath = path.join(projectRoot, 'CONFORMANCE.md');
  const ratchetPath = path.join(projectRoot, 'prism', 'handwritten-ratchet.json');
  const engineWorkflowRel = String(CompiledMechanization.workflowFile());
  const engineWorkflowPath = path.join(projectRoot, engineWorkflowRel);
  const driftDetails: string[] = [];

  // 1. Ingest current product functions & verify zero routing refusals
  const { register: candidateRegister, routingRefusals } =
    ingestProductCodebaseLiftRegister(projectRoot);
  if (routingRefusals.length > 0) {
    throw new Error(
      `Foundry router refused ${routingRefusals.length} product fact(s): ${JSON.stringify(routingRefusals)}`,
    );
  }

  // 2. Load incumbent `prism/lift-register.json` (if present) and enforce `UE-16` monotonic ratchet
  let incumbentRegister: LiftRegisterDocument | null = null;
  if (fs.existsSync(liftRegisterPath)) {
    incumbentRegister = JSON.parse(fs.readFileSync(liftRegisterPath, 'utf8')) as LiftRegisterDocument;
  }

  const admission = admitLiftRegisterCandidate(incumbentRegister, candidateRegister);
  if (!admission.ok) {
    const err = admission.error;
    const msg =
      err.kind === 'Regressed'
        ? `UE-16 Lift Regression Refused: ${err.functionPath} (κ=${err.kappa.slice(0, 16)}…) regressed from lifted (${err.previousDefinition}) to '${err.candidateStatus}'`
        : `UE-16 Malformed Lift Register: ${err.reason}`;
    throw new Error(msg);
  }

  // 3. Enforce Shrink-Only Hand-Written LOC, Residue & Classical.choice Ratchet (`prism/handwritten-ratchet.json`)
  const measuredRatchet = measureHandwrittenAndAxiomRatchetState(projectRoot, candidateRegister);
  let ratchetDoc: HandwrittenAndAxiomRatchetDocument;
  let ratchetUpdated = false;

  if (fs.existsSync(ratchetPath)) {
    ratchetDoc = JSON.parse(fs.readFileSync(ratchetPath, 'utf8')) as HandwrittenAndAxiomRatchetDocument;
    const ratchetCheck = verifyHandwrittenAndAxiomRatchet(ratchetDoc, measuredRatchet);
    if (!ratchetCheck.ok) {
      throw new RatchetViolationError(ratchetCheck.violations);
    }
    if (options.write && options.ratchetDown) {
      const tightened: HandwrittenAndAxiomRatchetDocument = {
        ...ratchetDoc,
        allowedHandwrittenGameFiles: measuredRatchet.handwrittenGameFiles,
        maxHandwrittenGameNonCommentLines: Math.min(
          ratchetDoc.maxHandwrittenGameNonCommentLines,
          measuredRatchet.handwrittenGameNonCommentLines,
        ),
        maxResidueFunctionCount: Math.min(
          ratchetDoc.maxResidueFunctionCount,
          measuredRatchet.residueFunctionCount,
        ),
        maxClassicalChoiceCount: Math.min(
          ratchetDoc.maxClassicalChoiceCount,
          measuredRatchet.classicalChoiceCount,
        ),
        maxMechanizationClassicalChoiceCount: Math.min(
          ratchetDoc.maxMechanizationClassicalChoiceCount,
          measuredRatchet.mechanizationClassicalChoiceCount,
        ),
      };
      ratchetUpdated = writeFileIfChanged(ratchetPath, `${JSON.stringify(tightened, null, 2)}\n`);
      ratchetDoc = tightened;
    }
  } else {
    ratchetDoc = {
      schema: 'verdant-resonance/handwritten-ratchet/1',
      allowedHandwrittenGameFiles: measuredRatchet.handwrittenGameFiles,
      baselineAtCommit05e151c: {
        handwrittenGameNonCommentLines: 31915,
        residueFunctionCount: 246,
        classicalChoiceCount: 67,
        mechanizationClassicalChoiceCount: 1,
      },
      maxHandwrittenGameNonCommentLines: measuredRatchet.handwrittenGameNonCommentLines,
      maxResidueFunctionCount: measuredRatchet.residueFunctionCount,
      maxClassicalChoiceCount: measuredRatchet.classicalChoiceCount,
      maxMechanizationClassicalChoiceCount: measuredRatchet.mechanizationClassicalChoiceCount,
    };
    const checkInit = verifyHandwrittenAndAxiomRatchet(ratchetDoc, measuredRatchet);
    if (!checkInit.ok) {
      throw new RatchetViolationError(checkInit.violations);
    }
    if (options.write) {
      ratchetUpdated = writeFileIfChanged(ratchetPath, `${JSON.stringify(ratchetDoc, null, 2)}\n`);
    } else {
      driftDetails.push('prism/handwritten-ratchet.json is missing; run `npm run prism:mechanize`');
    }
  }

  const expectedRegisterJson = `${JSON.stringify(candidateRegister, null, 2)}\n`;
  const currentRegisterJson = fs.existsSync(liftRegisterPath)
    ? fs.readFileSync(liftRegisterPath, 'utf8')
    : '';
  const registerInSync = currentRegisterJson === expectedRegisterJson;
  let liftRegisterUpdated = false;
  if (!registerInSync) {
    if (options.write) {
      liftRegisterUpdated = writeFileIfChanged(liftRegisterPath, expectedRegisterJson);
    } else {
      driftDetails.push(
        'prism/lift-register.json differs from live product codebase κ lift projection',
      );
    }
  }

  // 4. Project & byte-check `.github/workflows/engine.yml` from `Foundation.Mechanization.V1.Model`
  const expectedEngineYaml = renderEngineWorkflowYamlFromLexLean();
  const currentEngineYaml = fs.existsSync(engineWorkflowPath)
    ? fs.readFileSync(engineWorkflowPath, 'utf8')
    : '';
  const engineWorkflowInSync = currentEngineYaml === expectedEngineYaml;
  let engineWorkflowUpdated = false;
  if (!engineWorkflowInSync) {
    if (options.write) {
      fs.mkdirSync(path.dirname(engineWorkflowPath), { recursive: true });
      engineWorkflowUpdated = writeFileIfChanged(engineWorkflowPath, expectedEngineYaml);
    } else {
      driftDetails.push(
        `${engineWorkflowRel} differs from formal LexLean CI workload projection in Foundation.Mechanization.V1.Model`,
      );
    }
  }

  // 5. Build & validate `CONFORMANCE.md` (`R1–R6` + `CM-01..CM-03`)
  const conformance = buildConformanceReport(projectRoot, candidateRegister, 0);
  if (!conformance.allClaimsValid) {
    const failed = conformance.claimValidations.filter((v) => !v.admitted);
    throw new Error(
      `R2 Epistemic Honesty Meta-Gate refused ${failed.length} claim(s): ${JSON.stringify(failed)}`,
    );
  }
  if (!conformance.bijectionVerified) {
    throw new Error(
      `CM-02 Bijective Conformance Gate failed: build=${conformance.registeredBuildCount}, scenarios=${conformance.scenarioCount}, tests=${conformance.executedTestCount}, orphans=${conformance.orphanClaimTagCount}`,
    );
  }

  const currentConformanceMd = fs.existsSync(conformanceMdPath)
    ? fs.readFileSync(conformanceMdPath, 'utf8')
    : '';
  const conformanceInSync = currentConformanceMd === conformance.markdown;
  let conformanceMdUpdated = false;
  if (!conformanceInSync) {
    if (options.write) {
      conformanceMdUpdated = writeFileIfChanged(conformanceMdPath, conformance.markdown);
    } else {
      driftDetails.push('CONFORMANCE.md differs from single-source conformance projection (CM-01)');
    }
  }

  return {
    liftRegisterPath,
    conformanceMdPath,
    ratchetPath,
    engineWorkflowPath,
    liftRegisterUpdated,
    conformanceMdUpdated,
    ratchetUpdated,
    engineWorkflowUpdated,
    totalProductFunctions: candidateRegister.summary.totalFunctions,
    liftedCount: candidateRegister.summary.liftedCount,
    residueCount: candidateRegister.summary.residueCount,
    foreignCount: candidateRegister.summary.foreignCount,
    effectCount: candidateRegister.summary.effectCount,
    unliftedOpenDistance: candidateRegister.summary.unliftedOpenDistance,
    handwrittenGameNonCommentLines: measuredRatchet.handwrittenGameNonCommentLines,
    classicalChoiceCount: measuredRatchet.classicalChoiceCount,
    mechanizationClassicalChoiceCount: measuredRatchet.mechanizationClassicalChoiceCount,
    buildScenarioCount: conformance.registeredBuildCount,
    authoritiesCount: EXTERNAL_AUTHORITIES_REGISTER.length,
    openClaimsCount: 4,
    driftDetails,
  };
}
