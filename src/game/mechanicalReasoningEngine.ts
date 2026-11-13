/**
 * Unified Mechanical Reasoning Engine (`src/game/mechanicalReasoningEngine.ts`)
 *
 * Extracts and unifies the shared mechanical reasoning model across:
 *   - `afflom/UORust` (`ingest -> route -> admit -> lift/register -> emit`, `UE-16` monotonic `κ` ratchet,
 *     `uor/template-contract/1` `R1–R6` & `CM-01..CM-03`, and ISO/IEC 25010 derived-threshold quality)
 *   - `UORC` (zero-defect admission `defect = 0`, lexicographic `(bytes, steps)` Pareto/Lyapunov dominance,
 *     `SaturatingCapLedger`, `settleBytes` baseline floor, and homeostasis gate reservation)
 *   - `afflom/rule30` (`Discovery.lex.tex` F2 window induction, `Hypotheses.lex.tex` canonical `κ`-clause
 *     abduction, `Engine.lex.tex` `[1..16]` `+2/-1` `scheduleSound` bandit deduction, and `Observer.lex.tex`
 *     Harman Object-Oriented Ontology Quadruple with sensual gauge invariance)
 *
 * All core predicates, bounds, routing classifications, lift-ratchet transitions, epistemic claim rules,
 * Peirce phase transitions, Hebbian weight updates, and OOO gauge transforms delegate directly to the
 * Lean 4.32-verified `Foundation.Mechanization.V1.Model` compiled in `generatedPrismRuntime.ts`.
 */

import { PRISM_COMPILED_MODULES, toPrismNat } from './generatedPrismRuntime';
import {
  certifiedWasmAdmitLift,
  certifiedWasmDecideMint,
  certifiedWasmFoundryRoute,
  certifiedWasmRule30Step,
  certifiedWasmSchedule,
} from './generatedCertifiedWasmBridge';
import { sha256Hex } from './parametricCompressionEngine';

const CompiledMechanization = PRISM_COMPILED_MODULES['Foundation.Mechanization.V1.Model'];
const CompiledCompression = PRISM_COMPILED_MODULES['Foundation.Compression.V1.Model'];

export const MECHANIZATION_MODEL_PROFILE = 'prism/mechanization-uorust-uorc-rule30/1' as const;
export const VERDANT_MECHANIZATION_BASIS_PRIME = Number(
  CompiledMechanization.verdantMechanizationBasisPrime(),
); // 193
export const COHERENT_CLASSICAL_MODEL_COUNT = Number(
  CompiledMechanization.coherentClassicalModelTotal(),
); // 6
export const DERIVED_FOUNDRY_ROUTE_MASK_LIMIT = Number(
  CompiledMechanization.derivedRouteMaskSum(),
); // 1023
export const DERIVED_FOUNDRY_REQUEST_LIMIT_BYTES = Number(
  CompiledMechanization.derivedFoundryRequestLimitBytes(),
); // 1663
export const RULE30_HYPOTHESIS_BUDGET_MAX = Number(
  CompiledMechanization.rule30HypothesisBudgetMax(),
); // 16
export const ENGINE_WEIGHT_MIN = Number(CompiledMechanization.engineWeightMinVal()); // 1
export const ENGINE_WEIGHT_MAX = Number(CompiledMechanization.engineWeightMaxVal()); // 16
export const ENGINE_WEIGHT_INITIAL = Number(CompiledMechanization.engineWeightInitialVal()); // 8
export const WITHDRAWN_APERIODIC_COMPENSATION_ID = Number(
  CompiledMechanization.withdrawnAperiodicCompensationId(),
); // 30

// ============================================================================
// Pure FIPS 180-4 SHA-256 (`κ` Content-Addressing across Browser & Node)
// ============================================================================

/**
 * Computes exact lowercase 64-hex FIPS 180-4 SHA-256 digest in both browser and Node runtimes.
 */
export function sha256KappaHex(input: string): string {
  return sha256Hex(input);
}

export const FUNCTION_KAPPA_DOMAIN = 'verdant-resonance/function/1' as const;
export const CLAUSE_KAPPA_DOMAIN = 'verdant-resonance/clause/1' as const;

/**
 * Mirrors `UORust` `register::kappa(path, tokens)`:
 * SHA-256 over `DOMAIN\npath\nnormalizedTokens\n`.
 */
export function computeFunctionKappa(modulePath: string, normalizedTokens: string): string {
  return sha256KappaHex(`${FUNCTION_KAPPA_DOMAIN}\n${modulePath}\n${normalizedTokens}\n`);
}

// ============================================================================
// 1. Explicit Coherent Catalog of the 6 Classical Reasoning Models
// ============================================================================

export type ClassicalReasoningModelId =
  | 'foundry-galois-lift-ratchet'
  | 'epistemic-modal-honesty-triangulation'
  | 'peirce-abduction-deduction-induction'
  | 'pareto-lyapunov-mdl-hebbian-portfolio'
  | 'harman-ooo-quadruple-gauge-observer'
  | 'iso25010-derived-threshold-quality';

export interface ClassicalReasoningModelDescriptor {
  readonly id: ClassicalReasoningModelId;
  readonly ordinal: number;
  readonly classicalLineage: string;
  readonly sourceRepositories: readonly ('afflom/UORust' | 'UORC' | 'afflom/rule30')[];
  readonly canonicalMechanism: string;
  readonly formalPredicates: readonly string[];
  readonly coherenceRoleInVerdant: string;
}

export const COHERENT_CLASSICAL_REASONING_MODELS: readonly ClassicalReasoningModelDescriptor[] = [
  {
    id: 'foundry-galois-lift-ratchet',
    ordinal: 1,
    classicalLineage: 'Galois Abstract Interpretation (Cousot & Cousot 1977) & CEGAR Foundry',
    sourceRepositories: ['afflom/UORust'],
    canonicalMechanism:
      'Total pipeline `ingest -> route -> admit -> lift/register -> emit` with derived `requestLimit`, typed `Unknown`/`Ambiguous` refusals, 4-way `κ` partition (`lifted | residue | foreign | effect`), and monotonic `UE-16` ratchet (`lifted` never regresses).',
    formalPredicates: [
      'classifyFoundryTagMask',
      'admitLiftKappaTransition',
      'unliftedExcessOverFloor',
    ],
    coherenceRoleInVerdant:
      'Governs every TypeScript function in `src/` by its SHA-256 `κ`, guaranteeing lifted LexLean projections never regress while reporting unlifted code honestly as an open distance to 0.',
  },
  {
    id: 'epistemic-modal-honesty-triangulation',
    ordinal: 2,
    classicalLineage: 'Three-Valued Epistemic Modal Logic (Kleene / Hintikka) & Bijective Traceability',
    sourceRepositories: ['afflom/UORust', 'UORC'],
    canonicalMechanism:
      '`uor/template-contract/1` (`R1–R6`, `CM-01..CM-03`): strict separation of `some-true` (external authority), `build` (executable scenario + test), and `open` (measured distance forbidding assertive proof vocabulary), with 3-way bijection `Register <-> Scenarios <-> Tests`.',
    formalPredicates: ['admitEpistemicClaim', 'verifyBijectiveConformanceTriangulation'],
    coherenceRoleInVerdant:
      'Generates `CONFORMANCE.md` from a single source and blocks orphan test claims, drifted projections, or assertive over-claiming on open empirical metrics.',
  },
  {
    id: 'peirce-abduction-deduction-induction',
    ordinal: 3,
    classicalLineage: "C.S. Peirce's Triadic Logic of Inquiry (Abduction -> Deduction -> Induction)",
    sourceRepositories: ['afflom/rule30', 'UORC'],
    canonicalMechanism:
      '`Discovery.lex.tex` F2 window induction (`observed`, never conflated with `proved`) -> `Hypotheses.lex.tex` canonical `κ`-clause abduction (`budget = 16`, contradictory rejection, idempotent saturation) -> `Engine.lex.tex` sound strategy deduction.',
    formalPredicates: ['validPeircePhaseStep', 'decideHypothesisMint', 'remainingBudgetAfterMint'],
    coherenceRoleInVerdant:
      'Drives Rule-30 pattern discovery, canonical hypothesis minting, and deductive invariant verification without ever mistaking finite window observation for formal proof.',
  },
  {
    id: 'pareto-lyapunov-mdl-hebbian-portfolio',
    ordinal: 4,
    classicalLineage:
      'Pareto/Lyapunov Multi-Objective Dominance, Rissanen MDL & Hebbian Contextual Bandits',
    sourceRepositories: ['UORC', 'afflom/rule30'],
    canonicalMechanism:
      'Zero-defect admission (`defect = 0`), lexicographic `(bytes, steps)` strict dominance, `known` `κ` memoization before strategy execution, bounded `[1..16]` plasticity (`+2/-1`), `scheduleSound` (`isPermutation && byWeight`), and reserved homeostasis gate share.',
    formalPredicates: [
      'engineLearnWeight',
      'schedulePairFirstWeight',
      'reserveHomeostasisGateShare',
    ],
    coherenceRoleInVerdant:
      'Schedules deductive/compression strategies by learned weight, skips already-known `κ` work in O(1), and reserves verification gate homeostasis before search runs.',
  },
  {
    id: 'harman-ooo-quadruple-gauge-observer',
    ordinal: 5,
    classicalLineage:
      "Graham Harman's Object-Oriented Ontology (The Quadruple Object) & Weyl Gauge Invariance",
    sourceRepositories: ['afflom/rule30'],
    canonicalMechanism:
      '`Observer.lex.tex` models encounters across 3 poles (`sensual-quality`, `withdrawn`, `real-quality`) and 3 vantages (`regular-side`, `chaotic-side`, `kernel`), proving sensual renamings are gauge transforms preserving `RealQualities` (`proved`) and `WithdrawnCore` (`aperiodic-compensation`).',
    formalPredicates: [
      'gaugeTransformRealQualityMask',
      'gaugeTransformWithdrawnCoreId',
      'gaugeTransformSensualQualityId',
    ],
    coherenceRoleInVerdant:
      'Unites the formal conservatory holon (`RealQualities`), the Rule-30 inexhaustible novelty horizon (`WithdrawnCore`), and the player/UI encounter (`SensualQualities`) without conflating presentation with invariant structure.',
  },
  {
    id: 'iso25010-derived-threshold-quality',
    ordinal: 6,
    classicalLineage: 'ISO/IEC 25010:2023 Product Quality Measurement & Constructive Monus Accounting',
    sourceRepositories: ['afflom/UORust', 'UORC'],
    canonicalMechanism:
      '`Quality.lex.tex` derives every quality threshold from the model itself (`0` for defects, route count for coverage, sum of route slots for `requestLimit`) and reports constructive `excessOver` / `lackUnder` distances.',
    formalPredicates: ['qualityGateSatisfied', 'unliftedExcessOverFloor'],
    coherenceRoleInVerdant:
      'Eliminates arbitrary magic-number ceilings across verification gates—defects have threshold 0 and open distances are measured constructively.',
  },
] as const;

// ============================================================================
// 2. Foundry Route Table & Monotonic `κ` Lift Register (`afflom/UORust`)
// ============================================================================

export type FoundryRouteId =
  | 'VR-R01'
  | 'VR-R02'
  | 'VR-R03'
  | 'VR-R04'
  | 'VR-R05'
  | 'VR-R06'
  | 'VR-R07'
  | 'VR-R08'
  | 'VR-R09'
  | 'VR-R10';

export type FoundryFactTag =
  | 'lex-module'
  | 'lex-definition'
  | 'lex-theorem'
  | 'pure-domain-fn'
  | 'scene-builder-fn'
  | 'react-ui-component'
  | 'webgl-effect-fn'
  | 'webaudio-effect-fn'
  | 'test-scenario'
  | 'acceptance-vector';

export interface FoundryRouteEntry {
  readonly id: FoundryRouteId;
  readonly slot: number;
  readonly tag: FoundryFactTag;
  readonly bitMask: number;
  readonly projectionTarget: string;
}

export const FOUNDRY_ROUTES: readonly FoundryRouteEntry[] = [
  {
    id: 'VR-R01',
    slot: 0,
    tag: 'lex-module',
    bitMask: 1,
    projectionTarget: 'PRISM_COMPILED_MODULES namespace',
  },
  {
    id: 'VR-R02',
    slot: 1,
    tag: 'lex-definition',
    bitMask: 2,
    projectionTarget: 'generatedPrismRuntime.ts pure function',
  },
  {
    id: 'VR-R03',
    slot: 2,
    tag: 'lex-theorem',
    bitMask: 4,
    projectionTarget: 'Lean 4.32 attestation + GENERATED_PRISM_THEOREMS_BY_MODULE',
  },
  {
    id: 'VR-R04',
    slot: 3,
    tag: 'pure-domain-fn',
    bitMask: 8,
    projectionTarget: 'src/game/*Engine.ts domain projection',
  },
  {
    id: 'VR-R05',
    slot: 4,
    tag: 'scene-builder-fn',
    bitMask: 16,
    projectionTarget: 'src/components/garden*.ts Three.js geometry adapter',
  },
  {
    id: 'VR-R06',
    slot: 5,
    tag: 'react-ui-component',
    bitMask: 32,
    projectionTarget: 'src/*.tsx React declarative view',
  },
  {
    id: 'VR-R07',
    slot: 6,
    tag: 'webgl-effect-fn',
    bitMask: 64,
    projectionTarget: 'WebGLRenderer / GPU effect boundary',
  },
  {
    id: 'VR-R08',
    slot: 7,
    tag: 'webaudio-effect-fn',
    bitMask: 128,
    projectionTarget: 'AudioContext / WebAudio effect boundary',
  },
  {
    id: 'VR-R09',
    slot: 8,
    tag: 'test-scenario',
    bitMask: 256,
    projectionTarget: 'CONFORMANCE.md VR-* bijective scenario',
  },
  {
    id: 'VR-R10',
    slot: 9,
    tag: 'acceptance-vector',
    bitMask: 512,
    projectionTarget: 'VerdantResonance::application.acceptanceVectors',
  },
] as const;

const ROUTE_BY_TAG = new Map<string, FoundryRouteEntry>(FOUNDRY_ROUTES.map((r) => [r.tag, r]));

export type FoundryRoutingOutcome =
  | { readonly kind: 'admitted'; readonly route: FoundryRouteEntry }
  | { readonly kind: 'refused-unknown'; readonly unknownTag: string; readonly code: 'unknown-fact-tag' }
  | {
      readonly kind: 'refused-ambiguous';
      readonly conflictingTags: readonly [string, string];
      readonly code: 'ambiguous-fact-tags';
    };

/**
 * Total deterministic Foundry router (`UORust` `route.rs` + `Foundation.Mechanization.V1.Model`).
 * Never defaults silently: unknown or multi-route facts produce typed refusals.
 */
export function routeCodebaseFact(tags: readonly string[]): FoundryRoutingOutcome {
  if (tags.length === 0) {
    return { kind: 'refused-unknown', unknownTag: '<empty>', code: 'unknown-fact-tag' };
  }
  let mask = 0;
  let firstRoute: FoundryRouteEntry | null = null;
  let firstTag = '';
  for (const rawTag of tags) {
    const found = ROUTE_BY_TAG.get(rawTag);
    if (!found) {
      return { kind: 'refused-unknown', unknownTag: rawTag, code: 'unknown-fact-tag' };
    }
    mask |= found.bitMask;
    if (!firstRoute) {
      firstRoute = found;
      firstTag = rawTag;
    } else if (firstRoute.id !== found.id) {
      const cls = certifiedWasmFoundryRoute(mask);
      if (cls === Number(CompiledMechanization.routingRefusedAmbiguous())) {
        return {
          kind: 'refused-ambiguous',
          conflictingTags: [firstTag, rawTag],
          code: 'ambiguous-fact-tags',
        };
      }
    }
  }

  const cls = certifiedWasmFoundryRoute(mask);
  if (cls !== Number(CompiledMechanization.routingAdmitted()) || !firstRoute) {
    return { kind: 'refused-unknown', unknownTag: tags[0] ?? '<invalid>', code: 'unknown-fact-tag' };
  }
  const slot = Number(CompiledMechanization.resolveRouteSlotFromBit(toPrismNat(mask)));
  return { kind: 'admitted', route: FOUNDRY_ROUTES[slot] ?? firstRoute };
}

export type LiftStatusKind = 'lifted' | 'residue' | 'foreign' | 'effect';

export interface LiftRegisterRow {
  readonly kappa: string;
  readonly functionPath: string;
  readonly routeId: FoundryRouteId;
  readonly status: LiftStatusKind;
  /** LexLean definition(s) when `status === 'lifted'`. */
  readonly definition?: string;
  /** Typed residue reason code when `status === 'residue'`. */
  readonly reason?: string;
  /** Crate/package or residue explanation when `status === 'residue' | 'foreign'`. */
  readonly detail?: string;
  /** Boundary effect kind when `status === 'effect'`. */
  readonly effect?: string;
  /** Explicit host divergence note permitted ONLY when `status === 'lifted'`. */
  readonly divergence?: string;
}

export interface LiftRegisterDocument {
  readonly schema: 'verdant-resonance/lift-register/1';
  readonly domain: typeof FUNCTION_KAPPA_DOMAIN;
  readonly summary: {
    readonly totalFunctions: number;
    readonly liftedCount: number;
    readonly residueCount: number;
    readonly foreignCount: number;
    readonly effectCount: number;
    readonly unliftedOpenDistance: number;
  };
  readonly rows: readonly LiftRegisterRow[];
}

export type LiftAdmissionError =
  | {
      readonly kind: 'Malformed';
      readonly reason: string;
    }
  | {
      readonly kind: 'Regressed';
      readonly kappa: string;
      readonly functionPath: string;
      readonly previousDefinition: string;
      readonly candidateStatus: LiftStatusKind;
    };

function liftStatusToClassCode(status: LiftStatusKind): bigint {
  switch (status) {
    case 'lifted':
      return CompiledMechanization.liftClassLifted();
    case 'residue':
      return CompiledMechanization.liftClassResidue();
    case 'foreign':
      return CompiledMechanization.liftClassForeign();
    case 'effect':
      return CompiledMechanization.liftClassEffect();
  }
}

/**
 * Enforces `UORust` Gate `UE-16` (`register::admit`):
 *  1. Every row has a unique 64-hex SHA-256 `κ` and unique `functionPath`.
 *  2. Every non-lifted row is typed (`residue` -> reason+detail, `foreign` -> package detail, `effect` -> effect kind).
 *  3. Monotonic ratchet: no `κ` recorded as `lifted` in `incumbent` can ever regress to `residue`, `foreign`, or `effect`.
 */
export type LiftAdmissionResult =
  | { readonly ok: true; readonly unliftedExcess: number }
  | { readonly ok: false; readonly error: LiftAdmissionError };

export function admitLiftRegisterCandidate(
  incumbent: LiftRegisterDocument | null,
  candidate: LiftRegisterDocument,
): LiftAdmissionResult {
  const seenKappas = new Set<string>();
  const seenFunctions = new Set<string>();
  let residueCount = 0;
  let foreignCount = 0;
  let effectCount = 0;

  for (const row of candidate.rows) {
    if (!/^[0-9a-f]{64}$/.test(row.kappa)) {
      return {
        ok: false,
        error: { kind: 'Malformed', reason: `${row.functionPath}: κ '${row.kappa}' is not 64-hex SHA-256` },
      };
    }
    if (seenKappas.has(row.kappa)) {
      return {
        ok: false,
        error: { kind: 'Malformed', reason: `Duplicate κ ${row.kappa} in lift register` },
      };
    }
    seenKappas.add(row.kappa);

    if (seenFunctions.has(row.functionPath)) {
      return {
        ok: false,
        error: { kind: 'Malformed', reason: `Duplicate function ${row.functionPath} in lift register` },
      };
    }
    seenFunctions.add(row.functionPath);

    if (row.divergence !== undefined && row.status !== 'lifted') {
      return {
        ok: false,
        error: {
          kind: 'Malformed',
          reason: `${row.functionPath}: non-lifted '${row.status}' row cannot carry divergence`,
        },
      };
    }

    if (row.status === 'lifted') {
      if (!row.definition || row.definition.trim().length === 0) {
        return {
          ok: false,
          error: { kind: 'Malformed', reason: `${row.functionPath}: lifted row missing LexLean definition` },
        };
      }
    } else if (row.status === 'residue') {
      residueCount++;
      if (!row.reason || !row.detail) {
        return {
          ok: false,
          error: { kind: 'Malformed', reason: `${row.functionPath}: residue row missing reason or detail` },
        };
      }
    } else if (row.status === 'foreign') {
      foreignCount++;
      if (!row.detail || !row.detail.includes('package with no LexLean model')) {
        return {
          ok: false,
          error: {
            kind: 'Malformed',
            reason: `${row.functionPath}: foreign row must name external package with no LexLean model`,
          },
        };
      }
    } else if (row.status === 'effect') {
      effectCount++;
      if (!row.effect) {
        return {
          ok: false,
          error: { kind: 'Malformed', reason: `${row.functionPath}: effect row missing effect kind` },
        };
      }
    }
  }

  if (incumbent) {
    const candidateByKappa = new Map<string, LiftRegisterRow>(
      candidate.rows.map((r) => [r.kappa, r]),
    );
    for (const oldRow of incumbent.rows) {
      const nextRow = candidateByKappa.get(oldRow.kappa);
      if (!nextRow) continue; // Source changed -> new κ question, or function removed
      const oldClass = liftStatusToClassCode(oldRow.status);
      const nextClass = liftStatusToClassCode(nextRow.status);
      const allowed = certifiedWasmAdmitLift(true, oldClass, nextClass);
      if (!allowed) {
        return {
          ok: false,
          error: {
            kind: 'Regressed',
            kappa: oldRow.kappa,
            functionPath: nextRow.functionPath,
            previousDefinition: oldRow.definition ?? '<lifted>',
            candidateStatus: nextRow.status,
          },
        };
      }
    }
  }

  const unliftedExcess = Number(
    CompiledMechanization.unliftedExcessOverFloor(
      toPrismNat(residueCount),
      toPrismNat(foreignCount),
      toPrismNat(effectCount),
    ),
  );
  return { ok: true, unliftedExcess };
}

// ============================================================================
// 3. Epistemic Three-Level Honesty (`R2`) & Assertive Vocabulary Meta-Gate
// ============================================================================

export type EpistemicClaimLevel = 'some-true' | 'build' | 'open';

/**
 * Exact 9 assertive proof phrases forbidden on `open` and `some-true` claims
 * (`UORust` `crates/conformance/src/meta.rs` + `UORC` `R2`).
 */
export const FORBIDDEN_ASSERTIVE_VOCABULARY: readonly string[] = [
  'proves',
  'proven',
  'proof that',
  'guarantees',
  'establishes',
  'demonstrates that',
  'shows that',
  'confirms',
  'certifies',
] as const;

export function findAssertiveVocabularyMatches(statement: string): string[] {
  const lower = statement.toLowerCase();
  const hits: string[] = [];
  for (const phrase of FORBIDDEN_ASSERTIVE_VOCABULARY) {
    const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(lower)) {
      hits.push(phrase);
    }
  }
  return hits;
}

export interface EpistemicClaimInput {
  readonly id: string;
  readonly level: EpistemicClaimLevel;
  readonly statement: string;
  readonly authorityId?: string;
  readonly scenarioTitle?: string;
  readonly executedTestName?: string;
}

export interface EpistemicClaimValidation {
  readonly id: string;
  readonly admitted: boolean;
  readonly assertiveMatches: readonly string[];
  readonly refusalReason?: string;
}

function epistemicLevelToCode(level: EpistemicClaimLevel): bigint {
  switch (level) {
    case 'some-true':
      return CompiledMechanization.epistemicSomeTrue();
    case 'build':
      return CompiledMechanization.epistemicBuild();
    case 'open':
      return CompiledMechanization.epistemicOpen();
  }
}

export function validateEpistemicClaimRecord(claim: EpistemicClaimInput): EpistemicClaimValidation {
  const assertiveMatches =
    claim.level === 'build' ? [] : findAssertiveVocabularyMatches(claim.statement);
  const hasAuthority = Boolean(claim.authorityId && claim.authorityId.trim().length > 0);
  const hasScenario = Boolean(claim.scenarioTitle && claim.scenarioTitle.trim().length > 0);
  const hasExecutedTest = Boolean(
    claim.executedTestName && claim.executedTestName.trim().length > 0,
  );

  const admitted = CompiledMechanization.admitEpistemicClaim(
    epistemicLevelToCode(claim.level),
    hasAuthority,
    hasScenario,
    hasExecutedTest,
    toPrismNat(assertiveMatches.length),
  );

  if (admitted) {
    return { id: claim.id, admitted: true, assertiveMatches };
  }

  let refusalReason = 'Epistemic contract violation';
  if (assertiveMatches.length > 0) {
    refusalReason = `Level '${claim.level}' forbids assertive vocabulary: [${assertiveMatches.join(', ')}]`;
  } else if (claim.level === 'some-true' && !hasAuthority) {
    refusalReason = "Level 'some-true' requires a cited external authority";
  } else if (claim.level === 'build' && hasAuthority) {
    refusalReason = "Level 'build' cannot delegate local construction to external authority";
  } else if (claim.level === 'build' && (!hasScenario || !hasExecutedTest)) {
    refusalReason = "Level 'build' requires both a scenario and an executed test";
  } else if (claim.level === 'open' && hasAuthority) {
    refusalReason = "Level 'open' represents an unclosed measurement and cannot cite authority as proof";
  }

  return {
    id: claim.id,
    admitted: false,
    assertiveMatches,
    refusalReason,
  };
}

// ============================================================================
// 4. Peirce Triadic Cycle (`afflom/rule30` Discovery + Hypotheses + Engine + `UORC`)
// ============================================================================

export type PeirceEpistemicPhase = 'observed' | 'hypothesized' | 'proved' | 'refuted';

export interface DiscoveredF2Relation {
  readonly kappa: string;
  readonly phase: 'observed';
  readonly stepOffset: number;
  readonly cellIndex: number;
  readonly windowSize: number;
  readonly xorEquation: string;
  readonly certifiedAcrossWindow: boolean;
}

/**
 * Inductive step (`Discovery.lex.tex`):
 * Evaluates Rule-30 finite 64-cell ring orbits over F2 (`r_next = left XOR (center OR right)`),
 * certifying local algebraic identities across `windowSize` states and tagging them strictly
 * as `'observed'` (never `'proved'`).
 */
export function discoverRule30F2Relations(
  seedState64: bigint = CompiledCompression.rule30Seed64(),
  windowSize: number = 12,
): readonly DiscoveredF2Relation[] {
  const count = Math.max(2, Math.min(32, Math.floor(windowSize)));
  const orbit: bigint[] = [seedState64];
  for (let t = 0; t < count; t++) {
    const prev = orbit[orbit.length - 1];
    orbit.push(certifiedWasmRule30Step(prev));
  }

  const relations: DiscoveredF2Relation[] = [];
  const probedCells = [0, 1, 15, 30, 31, 63];
  for (const cell of probedCells) {
    const leftIdx = (cell + 1) % 64;
    const rightIdx = (cell + 63) % 64;
    let holdsAll = true;
    for (let t = 0; t < count; t++) {
      const cur = orbit[t];
      const nxt = orbit[t + 1];
      const lBit = Number((cur >> BigInt(leftIdx)) & 1n);
      const cBit = Number((cur >> BigInt(cell)) & 1n);
      const rBit = Number((cur >> BigInt(rightIdx)) & 1n);
      const nextBit = Number((nxt >> BigInt(cell)) & 1n);
      // Over GF(2): l XOR (c OR r) === l ^ (c ^ r ^ (c & r))
      const gf2Poly = lBit ^ cBit ^ rBit ^ (cBit & rBit);
      if (gf2Poly !== nextBit) {
        holdsAll = false;
        break;
      }
    }
    const xorEquation = `cell[${cell}](t+1) = cell[${leftIdx}](t) XOR cell[${cell}](t) XOR cell[${rightIdx}](t) XOR (cell[${cell}](t)*cell[${rightIdx}](t)) mod 2`;
    const kappa = sha256KappaHex(`rule30/f2-discovery/1\ncell=${cell}\n${xorEquation}\n`);
    relations.push({
      kappa,
      phase: 'observed',
      stepOffset: 1,
      cellIndex: cell,
      windowSize: count,
      xorEquation,
      certifiedAcrossWindow: holdsAll,
    });
  }
  return relations;
}

export interface ClauseLiteral {
  readonly atom: string;
  readonly positive: boolean;
}

export interface MintedHypothesisRecord {
  readonly kappa: string;
  readonly canonicalClause: string;
  readonly originKind: 'exclusion' | 'audit-obligation' | 'f2-induction-lift';
  readonly phase: 'hypothesized';
}

export interface HypothesisMintBatchResult {
  readonly admitted: readonly MintedHypothesisRecord[];
  readonly rejectedContradictoryCount: number;
  readonly skippedKnownKappaCount: number;
  readonly stoppedBudgetExhaustedCount: number;
  readonly remainingBudget: number;
}

/**
 * Abductive step (`Hypotheses.lex.tex`):
 *  - Canonicalizes each clause by sorting deduplicated literals (`!atom` < `atom`),
 *  - Rejects contradictory clauses (`atom` and `!atom` both present),
 *  - Computes raw SHA-256 `κ` over canonical clause representation,
 *  - Skips any `κ` already in `knownKappas` without consuming budget (idempotent saturation!),
 *  - Enforces `rule30HypothesisBudgetMax = 16`.
 */
export function mintCanonicalHypotheses(
  candidates: ReadonlyArray<{
    readonly originKind: 'exclusion' | 'audit-obligation' | 'f2-induction-lift';
    readonly literals: readonly ClauseLiteral[];
  }>,
  knownKappas: ReadonlySet<string>,
  budget: number = RULE30_HYPOTHESIS_BUDGET_MAX,
): HypothesisMintBatchResult {
  let remaining = Math.max(0, Math.min(RULE30_HYPOTHESIS_BUDGET_MAX, Math.floor(budget)));
  const sessionKnown = new Set<string>(knownKappas);
  const admitted: MintedHypothesisRecord[] = [];
  let rejectedContradictoryCount = 0;
  let skippedKnownKappaCount = 0;
  let stoppedBudgetExhaustedCount = 0;

  for (const cand of candidates) {
    const posAtoms = new Set<string>();
    const negAtoms = new Set<string>();
    for (const lit of cand.literals) {
      const clean = lit.atom.trim();
      if (!clean) continue;
      if (lit.positive) posAtoms.add(clean);
      else negAtoms.add(clean);
    }

    let contradictory = false;
    for (const a of posAtoms) {
      if (negAtoms.has(a)) {
        contradictory = true;
        break;
      }
    }

    const sortedTokens = [
      ...[...negAtoms].sort().map((a) => `!${a}`),
      ...[...posAtoms].sort().map((a) => `+${a}`),
    ];
    const canonicalClause = sortedTokens.join(' | ');
    const kappa = sha256KappaHex(`${CLAUSE_KAPPA_DOMAIN}\n${canonicalClause}\n`);
    const alreadyKnown = sessionKnown.has(kappa);

    const decision = certifiedWasmDecideMint(contradictory, alreadyKnown, remaining);
    remaining = Number(
      CompiledMechanization.remainingBudgetAfterMint(
        contradictory,
        alreadyKnown,
        toPrismNat(remaining),
      ),
    );

    if (decision === Number(CompiledMechanization.mintOutcomeRejectedContradictory())) {
      rejectedContradictoryCount++;
    } else if (decision === Number(CompiledMechanization.mintOutcomeSkippedKnownKappa())) {
      skippedKnownKappaCount++;
    } else if (decision === Number(CompiledMechanization.mintOutcomeBudgetExhausted())) {
      stoppedBudgetExhaustedCount++;
    } else {
      sessionKnown.add(kappa);
      admitted.push({
        kappa,
        canonicalClause,
        originKind: cand.originKind,
        phase: 'hypothesized',
      });
    }
  }

  return {
    admitted,
    rejectedContradictoryCount,
    skippedKnownKappaCount,
    stoppedBudgetExhaustedCount,
    remainingBudget: remaining,
  };
}

export type ReasoningStrategyId =
  | 'library-rewrite'
  | 'step-induction'
  | 'period-reduction'
  | 'counterexample';

export interface StrategyWeightEntry {
  readonly strategyId: ReasoningStrategyId;
  readonly templateDigestSha256: string;
  readonly weight: number;
}

/**
 * Sound permutation scheduler (`Engine.lex.tex` `schedule` + `scheduleSound`):
 * Returns a strict permutation of `entries` ordered descending by `weight` (stable tie-break by `strategyId`).
 */
export function scheduleStrategiesByWeight(
  entries: readonly StrategyWeightEntry[],
): readonly StrategyWeightEntry[] {
  const byId = new Map<string, StrategyWeightEntry>(entries.map((e) => [e.strategyId, e]));
  const applicable = [...entries].map((e) => e.strategyId).sort((a, b) => a.localeCompare(b));
  const family = 'portfolio';
  const orderedIds = certifiedWasmSchedule(
    entries.map((e) => ({ strategy: e.strategyId, family, value: e.weight })),
    family,
    applicable,
  );
  return orderedIds.map((id) => byId.get(id)!).filter(Boolean);
}

export function learnEngineStrategyWeight(currentWeight: number, succeeded: boolean): number {
  return Number(CompiledMechanization.engineLearnWeight(toPrismNat(currentWeight), succeeded));
}

export interface PeircePortfolioClaimAttempt {
  readonly claimKappa: string;
  readonly winningStrategy: ReasoningStrategyId | null;
  readonly defectCount: number;
  readonly encodedBytes: number;
  readonly decodeSteps: number;
  readonly rawFallbackBytes: number;
}

export interface PeircePortfolioTickSummary {
  readonly totalTickBudget: number;
  readonly reservedGateShare: number;
  readonly deductiveSearchShare: number;
  readonly skippedKnownClaims: number;
  readonly memoizedLedgerSkips: number;
  readonly newlyProvedKappas: readonly string[];
  readonly updatedPortfolio: readonly StrategyWeightEntry[];
  readonly settledBytesTotal: number;
  readonly scheduleIsSoundPermutation: boolean;
}

/**
 * Deductive + MDL portfolio tick (`afflom/rule30` `Engine.lex.tex` + `UORC`):
 *  1. Reserves verification gate homeostasis share (`reserveHomeostasisGateShare`) before search.
 *  2. Schedules strategies by descending `[1..16]` weight (`scheduleSound`).
 *  3. Checks `knownProvedKappas` *before* attempting any strategy (`known` dedup).
 *  4. Checks `(claimKappa, strategyId, templateDigest)` in `attemptLedger` so no tuple runs twice.
 *  5. Enforces zero-defect admission (`admitZeroDefectBytes`) and updates weights via `+2 / -1`.
 */
export interface PeircePortfolioTickRunResult {
  readonly summary: PeircePortfolioTickSummary;
  readonly nextKnownProvedKappas: Set<string>;
  readonly nextAttemptLedger: Set<string>;
}

export function runMemoizedPeircePortfolioTick(
  portfolio: readonly StrategyWeightEntry[],
  claims: readonly PeircePortfolioClaimAttempt[],
  knownProvedKappas: ReadonlySet<string>,
  attemptLedger: ReadonlySet<string>,
  totalTickBudget: number = 24,
  gateMinimum: number = 6,
): PeircePortfolioTickRunResult {
  const reservedGateShare = Number(
    CompiledMechanization.reserveHomeostasisGateShare(
      toPrismNat(totalTickBudget),
      toPrismNat(gateMinimum),
    ),
  );
  const deductiveSearchShare = Number(
    CompiledMechanization.deductiveSearchShareAfterGate(
      toPrismNat(totalTickBudget),
      toPrismNat(gateMinimum),
    ),
  );

  const nextKnown = new Set<string>(knownProvedKappas);
  const nextLedger = new Set<string>(attemptLedger);
  const weightMap = new Map<ReasoningStrategyId, StrategyWeightEntry>(
    portfolio.map((e) => [e.strategyId, { ...e }]),
  );

  let skippedKnownClaims = 0;
  let memoizedLedgerSkips = 0;
  let settledBytesTotal = 0;
  let budgetLeft = deductiveSearchShare;
  const newlyProvedKappas: string[] = [];

  for (const claim of claims) {
    if (budgetLeft <= 0) break;
    if (nextKnown.has(claim.claimKappa)) {
      skippedKnownClaims++;
      continue;
    }

    const scheduled = scheduleStrategiesByWeight([...weightMap.values()]);
    for (const strat of scheduled) {
      if (budgetLeft <= 0) break;
      const ledgerKey = `${claim.claimKappa}::${strat.strategyId}::${strat.templateDigestSha256}`;
      if (nextLedger.has(ledgerKey)) {
        memoizedLedgerSkips++;
        continue;
      }
      nextLedger.add(ledgerKey);
      budgetLeft--;

      const won =
        claim.winningStrategy === strat.strategyId &&
        claim.defectCount === 0 &&
        CompiledMechanization.validPeircePhaseStep(
          CompiledMechanization.peircePhaseHypothesized(),
          CompiledMechanization.peircePhaseProved(),
        );

      const updatedWeight = learnEngineStrategyWeight(strat.weight, won);
      weightMap.set(strat.strategyId, { ...strat, weight: updatedWeight });

      if (won) {
        nextKnown.add(claim.claimKappa);
        newlyProvedKappas.push(claim.claimKappa);
        const settled = Number(
          CompiledCompression.admitZeroDefectBytes(
            toPrismNat(claim.encodedBytes),
            toPrismNat(claim.defectCount),
            toPrismNat(claim.rawFallbackBytes),
          ),
        );
        settledBytesTotal += settled;
        break;
      }
    }
  }

  const updatedPortfolio = scheduleStrategiesByWeight([...weightMap.values()]);
  const byWeight = updatedPortfolio.every(
    (item, idx) => idx === 0 || updatedPortfolio[idx - 1].weight >= item.weight,
  );
  const sameLength = updatedPortfolio.length === portfolio.length;

  return {
    summary: {
      totalTickBudget,
      reservedGateShare,
      deductiveSearchShare,
      skippedKnownClaims,
      memoizedLedgerSkips,
      newlyProvedKappas,
      updatedPortfolio,
      settledBytesTotal,
      scheduleIsSoundPermutation: byWeight && sameLength,
    },
    nextKnownProvedKappas: nextKnown,
    nextAttemptLedger: nextLedger,
  };
}

// ============================================================================
// 5. Harman's Object-Oriented Ontology (OOO) Quadruple & Gauge Invariance
// ============================================================================

export type OooVantageId = 'regular-side' | 'chaotic-side' | 'kernel';

export interface HarmanOooQuadrupleEncounter {
  readonly vantage: OooVantageId;
  readonly realObject: 'verdant-conservatory-holon';
  readonly sensualObject: string;
  readonly realQualitiesMask: number;
  readonly realQualities: readonly string[];
  readonly withdrawnCore: 'aperiodic-compensation';
  readonly withdrawnCoreId: number;
  readonly sensualQualityIds: readonly number[];
  readonly sensualQualities: readonly string[];
  readonly overlapRealAndWithdrawn: 0;
  readonly gaugeDeltaApplied: number;
  readonly realQualitiesGaugeInvariant: boolean;
  readonly withdrawnCoreGaugeInvariant: boolean;
}

const BASE_REAL_QUALITIES: readonly string[] = [
  'judge-total-deterministic',
  'monotonic-kappa-lift-ratchet',
  'peirce-observed-distinct-from-proved',
  'triadic-player-observer-coherence',
] as const;

const VANTAGE_SENSUAL_LABELS: Record<
  OooVantageId,
  { readonly sensualObject: string; readonly qualities: readonly string[]; readonly baseIds: readonly number[] }
> = {
  'regular-side': {
    sensualObject: 'player-garden-encounter',
    qualities: ['petal-bloom-silhouette', 'binaural-harmonic-chime', 'calm-breath-hud'],
    baseIds: [101, 102, 103],
  },
  'chaotic-side': {
    sensualObject: 'rule30-novelty-horizon',
    qualities: ['pollen-drift-shimmer', 'cross-pollinated-offshoot', 'microclimate-ripple'],
    baseIds: [201, 202, 203],
  },
  kernel: {
    sensualObject: 'auditor-conformance-ledger',
    qualities: ['lean-attestation-table', 'kappa-lift-frontier-row', 'kpi-scorecard-panel'],
    baseIds: [301, 302, 303],
  },
};

/**
 * Evaluates Harman's Quadruple Object (`rule30-api/src/Observer.lex.tex`) at `vantage`
 * under a sensual presentation gauge shift `gaugeDelta`:
 *  - `RealQualities` (`proved` Lean invariants) remain strictly invariant.
 *  - `WithdrawnCore` (`"aperiodic-compensation"`, `open` Rule-30 center-column horizon) remains strictly invariant
 *    and disjoint from `RealQualities` (`overlapRealAndWithdrawn === 0`).
 *  - `SensualQualities` transform covariantly with `gaugeDelta`.
 */
export function evaluateHarmanOooQuadruple(
  vantage: OooVantageId,
  gaugeDelta: number = 0,
): HarmanOooQuadrupleEncounter {
  const baseMask = 0b1111; // 4 core proved invariants
  const deltaNat = toPrismNat(Math.max(0, Math.floor(gaugeDelta)));
  const transformedRealMask = Number(
    CompiledMechanization.gaugeTransformRealQualityMask(toPrismNat(baseMask), deltaNat),
  );
  const transformedWithdrawnId = Number(
    CompiledMechanization.gaugeTransformWithdrawnCoreId(
      toPrismNat(WITHDRAWN_APERIODIC_COMPENSATION_ID),
      deltaNat,
    ),
  );
  const spec = VANTAGE_SENSUAL_LABELS[vantage];
  const sensualQualityIds = spec.baseIds.map((id) =>
    Number(CompiledMechanization.gaugeTransformSensualQualityId(toPrismNat(id), deltaNat)),
  );

  return {
    vantage,
    realObject: 'verdant-conservatory-holon',
    sensualObject:
      gaugeDelta > 0 ? `${spec.sensualObject}@gauge+${Math.floor(gaugeDelta)}` : spec.sensualObject,
    realQualitiesMask: transformedRealMask,
    realQualities: BASE_REAL_QUALITIES,
    withdrawnCore: 'aperiodic-compensation',
    withdrawnCoreId: transformedWithdrawnId,
    sensualQualityIds,
    sensualQualities: spec.qualities,
    overlapRealAndWithdrawn: 0,
    gaugeDeltaApplied: Math.max(0, Math.floor(gaugeDelta)),
    realQualitiesGaugeInvariant: transformedRealMask === baseMask,
    withdrawnCoreGaugeInvariant: transformedWithdrawnId === WITHDRAWN_APERIODIC_COMPENSATION_ID,
  };
}

export function getCompiledMechanizationStandardModel() {
  return CompiledMechanization.mechanizationStandardModel();
}
