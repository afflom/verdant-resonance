import { spawnSync } from 'node:child_process';
import path from 'node:path';
import {
  ensurePrismMechanizedArtifacts,
  inspectLeanAttestationStatus,
  loadFullPrismModuleGraph,
  type MechanizedPredicateDescriptor,
} from './prismMechanizer';

/**
 * Unified Prism Developer Automation CLI (`scripts/prismCli.ts`).
 *
 * Commands:
 *  - `sync` (`npm run prism:mechanize`): Incrementally synchronizes `prism/spec.json` -> `SPEC.md` & `.lex.tex`
 *    and compiles all 27 `.lex.tex` modules into `generatedPrismConstants.ts` + `generatedPrismRuntime.ts`.
 *  - `check` (`npm run prism:drift`): Zero-write CI/pre-commit drift gate + universal mechanized contract sweep.
 *  - `status` (`npm run prism:status`): Prints the 27-module mechanized compilation & Lean 4.32 attestation table.
 *  - `eval <Module::fn> [args...]` (`npm run prism:eval -- ...`): Executes any compiled `.lex.tex` definition or
 *    `dispatch "<request>"` directly from the CLI in milliseconds.
 *  - `gate [--formal]` (`npm run prism:gate`): Runs the complete developer verification pipeline.
 */

export interface ContractSweepSummary {
  modulesVerified: number;
  acceptanceVectorsVerified: number;
  counterexamplePredicatesChecked: number;
  counterexampleEvaluations: number;
  verificationPredicatesChecked: number;
  durationMs: number;
}

function buildSampleValuesForLexType(lexType: string, runtimeMod: any): any[] {
  if (lexType === 'Nat' || lexType.startsWith('UInt')) {
    return [0n, 1n, 8n, 12n, 16n, 20n];
  }
  if (lexType === 'Bool') {
    return [false, true];
  }
  if (lexType === 'String') {
    return ['verdant'];
  }
  if (lexType === 'Bytes') {
    return [runtimeMod.encodeUtf8ToPrismBytes('meadow chime-lily observe dawn dormant 15 5')];
  }
  if (lexType === 'Request' || lexType === 'VerdantResonance::Request') {
    return [
      { biome: 0n, plant: 0n, action: 0n, atmosphere: 0n, chorus: 0n, proximity: 15n, velocity: 5n },
      { biome: 4n, plant: 4n, action: 2n, atmosphere: 3n, chorus: 1n, proximity: 10n, velocity: 4n },
      { biome: 1n, plant: 1n, action: 1n, atmosphere: 1n, chorus: 1n, proximity: 18n, velocity: 8n },
      { biome: 3n, plant: 2n, action: 4n, atmosphere: 2n, chorus: 0n, proximity: 55n, velocity: 25n },
    ];
  }
  if (
    lexType === 'BusManifoldState' ||
    lexType === 'Foundation.Neuromorphic.V1.Model::BusManifoldState'
  ) {
    const Neuro = runtimeMod.PRISM_COMPILED_MODULES['Foundation.Neuromorphic.V1.Model'];
    return [
      Neuro.stepUniversalBusBroadcast(Neuro.uniformBusManifold(Neuro.weightInitial()), true),
    ];
  }
  return [];
}

function buildArgTuples(
  params: MechanizedPredicateDescriptor['parameters'],
  runtimeMod: any,
): any[][] | null {
  if (params.length === 0) return [[]];
  const pools = params.map((p) => buildSampleValuesForLexType(p.lexType, runtimeMod));
  if (pools.some((p) => p.length === 0)) return null;

  // Cap Cartesian product size so multi-parameter Nat predicates stay sub-5ms
  if (params.length === 1) {
    return pools[0].map((v) => [v]);
  }
  if (params.length === 2) {
    const out: any[][] = [];
    for (const a of pools[0].slice(0, 5)) {
      for (const b of pools[1].slice(0, 5)) {
        out.push([a, b]);
      }
    }
    return out;
  }
  // Diagonal + boundary tuples for 3+ parameter predicates
  const maxLen = Math.max(...pools.map((p) => p.length));
  const out: any[][] = [];
  for (let i = 0; i < maxLen; i++) {
    out.push(pools.map((p) => p[i % p.length]));
  }
  return out;
}

export async function runMechanizedContractSweep(): Promise<ContractSweepSummary> {
  const t0 = performance.now();
  const runtimeMod: any = await import('../src/game/generatedPrismRuntime');
  const manifest = runtimeMod.GENERATED_PRISM_MECHANIZED_MANIFEST;
  const compiledModules = runtimeMod.PRISM_COMPILED_MODULES;

  // 1. Replay all 65 formal acceptance vectors (valid + adversarial byte boundaries) through compiled `dispatch`
  const app = compiledModules['VerdantResonance'].application();
  let acceptanceVectorsVerified = 0;
  for (const vec of app.acceptanceVectors) {
    const actualBytes: Uint8Array = compiledModules['VerdantResonance'].dispatch(vec.request);
    const actualHex = Buffer.from(actualBytes).toString('hex');
    const expectedHex = Buffer.from(vec.response).toString('hex');
    if (actualHex !== expectedHex) {
      throw new Error(
        `AcceptanceVector mismatch on 0x${Buffer.from(vec.request).toString('hex')}: expected 0x${expectedHex}, got 0x${actualHex}`,
      );
    }
    acceptanceVectorsVerified++;
  }

  // 2. Sweep every auto-discovered `breaks*` counterexample refuter across all 27 modules
  let counterexamplePredicatesChecked = 0;
  let counterexampleEvaluations = 0;
  for (const pred of manifest.counterexamplePredicates as MechanizedPredicateDescriptor[]) {
    const fn = compiledModules[pred.moduleName]?.[pred.name];
    if (typeof fn !== 'function') {
      throw new Error(`Missing compiled counterexample refuter ${pred.moduleName}::${pred.name}`);
    }
    const argTuples = buildArgTuples(pred.parameters, runtimeMod);
    if (!argTuples) continue;
    counterexamplePredicatesChecked++;
    for (const args of argTuples) {
      const broken = fn(...args);
      counterexampleEvaluations++;
      if (broken !== false) {
        const prettyArgs = args.map((a: unknown) => (typeof a === 'bigint' ? `${a}n` : a));
        throw new Error(
          `Counterexample refuter ${pred.moduleName}::${pred.name}(${JSON.stringify(prettyArgs)}) returned true!`,
        );
      }
    }
  }

  // 3. Sweep zero-arg and single-weight `verify*` constructive gates across all 27 modules
  let verificationPredicatesChecked = 0;
  for (const pred of manifest.verificationPredicates as MechanizedPredicateDescriptor[]) {
    const fn = compiledModules[pred.moduleName]?.[pred.name];
    if (typeof fn !== 'function') {
      throw new Error(`Missing compiled verification gate ${pred.moduleName}::${pred.name}`);
    }
    if (pred.parameters.length === 0) {
      verificationPredicatesChecked++;
      if (fn() !== true) {
        throw new Error(`Zero-arg verification gate ${pred.moduleName}::${pred.name}() returned false!`);
      }
    } else if (
      pred.parameters.length === 1 &&
      pred.parameters[0].lexType === 'Nat' &&
      (pred.parameters[0].name === 'w' ||
        pred.parameters[0].name === 'wBus' ||
        pred.parameters[0].name === 'busWeight')
    ) {
      // Evaluate bus-weight constructive gates across canonical weights [8, 12, 15]
      verificationPredicatesChecked++;
      for (const w of [8n, 12n, 15n]) {
        if (fn(w) !== true) {
          throw new Error(
            `Constructive gate ${pred.moduleName}::${pred.name}(${w}) returned false!`,
          );
        }
      }
    }
  }

  return {
    modulesVerified: Object.keys(compiledModules).length,
    acceptanceVectorsVerified,
    counterexamplePredicatesChecked,
    counterexampleEvaluations,
    verificationPredicatesChecked,
    durationMs: Number((performance.now() - t0).toFixed(2)),
  };
}

function runSubcommand(label: string, cmd: string, args: string[], cwd: string) {
  console.log(`\n▶ ${label}: ${cmd} ${args.join(' ')}`);
  const res = spawnSync(cmd, args, { cwd, stdio: 'inherit' });
  if (res.status !== 0) {
    process.exit(res.status ?? 1);
  }
}

async function main() {
  const projectRoot = process.cwd();
  const argv = process.argv.slice(2);
  const cmd = argv[0] ?? 'status';
  const flags = new Set(argv.filter((a) => a.startsWith('--')));
  const positional = argv.slice(1).filter((a) => !a.startsWith('--'));

  if (cmd === 'sync') {
    const res = ensurePrismMechanizedArtifacts(projectRoot, {
      force: flags.has('--force'),
      checkOnly: false,
    });
    console.log(
      `[prism:mechanize] ${res.fromCache ? 'cache-hit' : 'compiled'} in ${res.durationMs}ms | digest=${res.inputDigestSha256.slice(0, 16)}… | constants=${res.constantsChanged ? 'updated' : 'unchanged'} | runtime=${res.runtimeChanged ? 'updated' : 'unchanged'} | SPEC.md=${res.specReport.specMdUpdated ? 'updated' : 'in-sync'}`,
    );
    return;
  }

  if (cmd === 'check' || cmd === 'drift') {
    const res = ensurePrismMechanizedArtifacts(projectRoot, { checkOnly: true });
    if (res.specReport.driftDetails.length > 0) {
      console.error('[prism:drift] DRIFT DETECTED:');
      for (const d of res.specReport.driftDetails) {
        console.error(`  - ${d}`);
      }
      console.error('Run `npm run prism:mechanize` to synchronize mechanized artifacts.');
      process.exit(1);
    }
    const sweep = await runMechanizedContractSweep();
    console.log(
      `[prism:drift] ZERO DRIFT (${res.durationMs}ms compile-check + ${sweep.durationMs}ms contract-sweep) | modules=${sweep.modulesVerified} | vectors=${sweep.acceptanceVectorsVerified} | refuters=${sweep.counterexamplePredicatesChecked} (${sweep.counterexampleEvaluations} checks) | gates=${sweep.verificationPredicatesChecked}`,
    );
    return;
  }

  if (cmd === 'status') {
    const res = ensurePrismMechanizedArtifacts(projectRoot, { force: false });
    const runtimeMod: any = await import('../src/game/generatedPrismRuntime');
    const manifest = runtimeMod.GENERATED_PRISM_MECHANIZED_MANIFEST;
    const sweep = await runMechanizedContractSweep();
    const lean = inspectLeanAttestationStatus(projectRoot);

    console.log('=== Verdant Resonance — Mechanized Prism Pipeline Status ===');
    console.log(`Source Tree SHA-256 : ${manifest.sourceTreeDigestSha256}`);
    console.log(
      `Compiled LexLean IR : ${manifest.moduleCount} modules | ${manifest.inductiveCount} inductives | ${manifest.structureCount} structures | ${manifest.definitionCount} definitions | ${manifest.theoremCount} theorems`,
    );
    console.log(
      `Incremental Cache   : ${res.fromCache ? 'HIT' : 'REBUILT'} (${res.durationMs}ms)`,
    );
    console.log(
      `Contract Auto-Sweep : ${sweep.acceptanceVectorsVerified} byte vectors | ${sweep.counterexamplePredicatesChecked} breaks* refuters (${sweep.counterexampleEvaluations} evals) | ${sweep.verificationPredicatesChecked} verify* gates (${sweep.durationMs}ms)`,
    );
    if (lean.available) {
      console.log(
        `Lean 4.32 Attested  : ${lean.attestationId?.slice(0, 16)}… | ${lean.declarationCount} verified declarations | allOk=${lean.allOk} | sorry=${lean.sorryDetected} | axioms=[${lean.observedAxioms.join(', ')}]`,
      );
    } else {
      console.log('Lean 4.32 Attested  : (local .lexlean cache not present; run `npm run prism:verify`)');
    }
    return;
  }

  if (cmd === 'eval') {
    ensurePrismMechanizedArtifacts(projectRoot, { force: false });
    const runtimeMod: any = await import('../src/game/generatedPrismRuntime');
    const target = positional[0];
    if (!target) {
      console.error(
        'Usage: npm run prism:eval -- <dispatch "<request>" | Module.Name::definition [args...]>',
      );
      process.exit(1);
    }
    if (target === 'dispatch') {
      const reqText = positional.slice(1).join(' ');
      const out = runtimeMod.dispatchPrismTextRequest(reqText);
      console.log(JSON.stringify({ request: reqText, response: out }, null, 2));
      return;
    }
    const [modName, defName] = target.includes('::')
      ? target.split('::')
      : ['VerdantResonance', target];
    const fn = runtimeMod.PRISM_COMPILED_MODULES[modName]?.[defName];
    if (typeof fn !== 'function') {
      console.error(`Unknown compiled definition: ${modName}::${defName}`);
      process.exit(1);
    }
    const parsedArgs = positional.slice(1).map((raw) => {
      if (raw === 'true') return true;
      if (raw === 'false') return false;
      if (/^\d+$/.test(raw)) return BigInt(raw);
      try {
        return JSON.parse(raw);
      } catch {
        return raw;
      }
    });
    const result = fn(...parsedArgs);
    console.log(
      JSON.stringify(
        result,
        (_k, v) => {
          if (v instanceof Uint8Array) return `0x${Buffer.from(v).toString('hex')}`;
          if (typeof v === 'bigint') {
            return v <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(v) : v.toString();
          }
          return v;
        },
        2,
      ),
    );
    return;
  }

  if (cmd === 'inspect' || cmd === 'module') {
    const modules = loadFullPrismModuleGraph(path.join(projectRoot, 'prism', 'src'));
    const query = positional[0]?.toLowerCase();
    if (!query) {
      console.log('=== 27 Prism LexLean Semantic Modules ===');
      for (const m of modules) {
        const rel = path.relative(projectRoot, m.filePath);
        console.log(
          `  ${m.moduleName.padEnd(36)} | structs=${String(m.structures.length).padStart(2)} | defs=${String(m.definitions.size).padStart(3)} | theorems=${String(m.theorems.length).padStart(2)} | ${rel}`,
        );
      }
      return;
    }
    const matched = modules.filter((m) => m.moduleName.toLowerCase().includes(query));
    if (matched.length === 0) {
      console.error(`No Prism module matching '${positional[0]}'.`);
      process.exit(1);
    }
    for (const m of matched) {
      const rel = path.relative(projectRoot, m.filePath);
      const defs = [...m.definitions.values()];
      console.log(`\n=== ${m.moduleName} (${rel}) ===`);
      if (m.imports.length > 0) console.log(`Imports    : ${m.imports.join(', ')}`);
      if (m.structures.length > 0) {
        console.log(`Structures : ${m.structures.map((s) => s.name).join(', ')}`);
      }
      const refuters = defs.filter((d) => d.name.startsWith('breaks')).map((d) => d.name);
      const gates = defs.filter((d) => d.name.startsWith('verify')).map((d) => d.name);
      console.log(`Definitions (${defs.length}):`);
      for (const d of defs) {
        const sig = d.parameters.map((p) => `${p.name}: ${p.type}`).join(', ');
        console.log(`  - ${d.name}(${sig}) -> ${d.resultType}`);
      }
      if (refuters.length > 0) console.log(`Refuters   : ${refuters.join(', ')}`);
      if (gates.length > 0) console.log(`Gates      : ${gates.join(', ')}`);
      if (m.theorems.length > 0) {
        console.log(`Theorems   : ${m.theorems.map((t) => t.name).join(', ')}`);
      }
    }
    return;
  }

  if (cmd === 'gate') {
    const checkRes = ensurePrismMechanizedArtifacts(projectRoot, { checkOnly: true });
    if (checkRes.specReport.driftDetails.length > 0) {
      console.error('[prism:gate] Mechanized artifacts out of sync:', checkRes.specReport.driftDetails);
      process.exit(1);
    }
    const sweep = await runMechanizedContractSweep();
    console.log(
      `✓ Mechanized Prism drift & contract sweep passed (${sweep.modulesVerified} modules, ${sweep.counterexampleEvaluations} refuter checks in ${sweep.durationMs}ms)`,
    );
    if (flags.has('--formal')) {
      runSubcommand(
        'Prism semantic check',
        path.join(projectRoot, 'node_modules', '.bin', 'prism-code'),
        ['build', '--check', '--local'],
        path.join(projectRoot, 'prism'),
      );
      runSubcommand(
        'Prism Lean 4.32 formal verification',
        path.join(projectRoot, 'node_modules', '.bin', 'prism-code'),
        ['verify', '--lean', '--local', '--all'],
        path.join(projectRoot, 'prism'),
      );
    }
    runSubcommand('TypeScript strict typecheck', 'npm', ['run', 'lint'], projectRoot);
    runSubcommand('Unit & mechanized test suite', 'npm', ['test'], projectRoot);
    runSubcommand('Production bundle build', 'npm', ['run', 'build'], projectRoot);
    console.log('\n✓ All Verdant Resonance mechanized gates passed.');
    return;
  }

  console.error(
    `Unknown prismCli command '${cmd}'. Expected: sync | check | status | inspect | eval | gate`,
  );
  process.exit(1);
}

const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname);

if (isMain) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
