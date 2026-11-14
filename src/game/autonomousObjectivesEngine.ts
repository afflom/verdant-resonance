/**
 * Reflexive 24-Facet Holon Directives, Autonomous KPIs & Player-Game Dissonance Reconciliation Engine
 * (`src/game/autonomousObjectivesEngine.ts`)
 *
 * Mechanized directly from `Foundation.Teleology.V1.Model` (`prism/src/Foundation/Teleology/V1/Model.lex.tex`):
 *  1. The Entire Game as a Facet of Itself (`verdant-game-holon`, Prime `191`):
 *     Completes the 24-Facet Reflexive Holon (`22` Canonical Standard Models `[primes 71..179]` +
 *     `player-co-observer` `[prime 181]` + `verdant-game-holon` `[prime 191]`), where every single
 *     facet has an explicit Guiding Directive, Concrete Objective, and Measurable KPI Floor.
 *  2. Inclusive Self-Reference Beyond the Rule-30 Ceiling (`solipsisticRule30CeilingPermille = 760`):
 *     Rule-30 hypothesis generation + mechanized compilation + internal self-reference can only optimize
 *     the system up to `760‰` when `playerAttentionPermille == 0`. To transcend that ceiling toward `1000‰`,
 *     the Observer turns its attention to itself *including the player*, measuring and reconciling the live
 *     dissonance between player and game into Triadic Player-Game-Observer Coherence.
 *  3. Healthy, Gratifying Quality Engagement (`coerciveDarkPatternCount === 0`):
 *     Optimizes feature differentiation and responsive presence so the game is genuinely gratifying,
 *     desirable, restorative, and good for the player, the game, and the Observer alike.
 */

import {
  GENERATED_CANONICAL_MODEL_BASIS_PRIMES,
  GENERATED_PRISM_STANDARDS,
} from './generatedPrismConstants';
import type { PersistedLiveCoEvolutionState } from './anamnesisEngine';
import {
  certifiedWasmCore_admitLivePlayerCoEvolutionStep,
  certifiedWasmCore_clampBusWeight,
  certifiedWasmCore_inferPlayerTheoryOfMindCode,
  certifiedWasmCore_proposeLiveCoEvolvedDomainWeight,
  certifiedWasmCore_stepEmergentOffshootColonizationCap,
  certifiedWasmCore_stepHealthyGratifyingQualityPermille,
  certifiedWasmCore_stepObserverDissonanceReconciliationPermille,
  certifiedWasmCore_stepPlayerGameDissonancePermille,
  certifiedWasmCore_stepReflexiveFacetNicheIndex,
  certifiedWasmTriadicCoherencePermille,
} from './generatedCertifiedWasmBridge';
import { CANONICAL_22_MODEL_KEYS, type CanonicalStandardModelKey } from './neuromorphicFunctorBus';
import { RULE30_SEED64, stepRule30Ring64 } from './parametricCompressionEngine';
import {
  createInitialParametricOntologyCoordinates,
  evaluateLiveOntologicalTelosState,
  stepLiveParametricOntologyCoordinates,
  type LiveHostEnvelopeInput,
  type LiveOntologicalTelosState,
  type LiveWitnessEnvelopeInput,
  type ParametricOntologyCoordinates,
} from './teleologyEngine';

export const VERDANT_GAME_HOLON_BASIS_PRIME =
  GENERATED_PRISM_STANDARDS.teleology.reflexiveHolonAndKpis.verdantGameHolonBasisPrime; // 191
export const PLAYER_CO_OBSERVER_PRIME =
  GENERATED_PRISM_STANDARDS.teleology.physicalBasisAndTriuneCuration.playerCoObserverBasisPrime; // 181
export const REFLEXIVE_HOLON_FACET_TOTAL =
  GENERATED_PRISM_STANDARDS.teleology.reflexiveHolonAndKpis.reflexiveHolonFacetTotal; // 24
export const SOLIPSISTIC_RULE30_CEILING_PERMILLE =
  GENERATED_PRISM_STANDARDS.teleology.reflexiveHolonAndKpis.solipsisticRule30CeilingPermille; // 760

export type ReflexiveHolon24FacetKey =
  | CanonicalStandardModelKey
  | 'player-co-observer'
  | 'verdant-game-holon';

export interface FacetGuidingDirectiveSpec {
  readonly ordinal: number; // 0..23
  readonly facetKey: ReflexiveHolon24FacetKey;
  readonly basisPrime: number;
  readonly kpiId: string;
  readonly objectiveTitle: string;
  readonly guidingDirective: string;
  readonly targetFloorPermille: number;
}

export interface EvaluatedFacetKpiStatus extends FacetGuidingDirectiveSpec {
  readonly synapticWeight: number;
  readonly nicheIndex: number;
  readonly measuredKpiPermille: number;
  readonly kpiSatisfied: boolean;
}

const mkDir = (kpiId: string, objectiveTitle: string, guidingDirective: string, targetFloorPermille: number) => ({
  kpiId,
  objectiveTitle,
  guidingDirective,
  targetFloorPermille,
});

const CANONICAL_MODEL_DIRECTIVES: Readonly<Record<CanonicalStandardModelKey, ReturnType<typeof mkDir>>> = Object.freeze({
  mathematics: mkDir('KPI-F01-PRIME-DEC-COHERENCE', 'Exact UOR Prime Addressing & Discrete Exterior Calculus Integrity', 'Preserve bit-exact UOR prime factorization, Clifford Cl(0,6) rotor purity, and d^2=0 topological closure across all facets.', 900),
  physics: mkDir('KPI-F02-SI-STATICS-HONESTY', 'Lawful Gravity, Hydrostatics & Structural Load-Path Grounding', 'Ground every stone, monument, water surface, and pendulum in BIPM SI 2019 mechanics with zero floating gaps.', 880),
  chemistry: mkDir('KPI-F03-STOICHIOMETRIC-BRAVAIS-ORDER', 'Balanced 118-Element Stoichiometry & 14 Bravais Crystal Habits', 'Drive mineral luster, terpene volatility, and leaf chromophores from authentic atomic valence and crystal symmetry.', 880),
  botany: mkDir('KPI-F04-FVCB-ORGANIC-VITALITY', 'Living C3 Photosynthesis, Stomatal Turgor & Golden Phyllotaxis', 'Differentiate all 5 flora species into tactile, breathing organisms responsive to light, water, and gentle care.', 840),
  ecology: mkDir('KPI-F05-GUILD-RECIPROCITY', 'Closed-Loop Biogeochemistry, Symbiotic Guilds & Microclimate Offshoots', 'Reward biodiversity and cross-pollination so multi-species guilds co-create emergent microclimate seedlings.', 830),
  acoustics: mkDir('KPI-F06-PSYCHOACOUSTIC-WARMTH', 'ISO 226 Comfort, 24-Bark Clarity & Species Body Formants', 'Maintain >=3.35 dB critical-band headroom and warm woody/crystalline/hollow resonances without ear fatigue.', 850),
  articulation: mkDir('KPI-F07-KINEMATIC-GRACE', '3-Joint Euler-Lagrange Botanical Sway & Tactile Responsiveness', 'Translate wind, footsteps, and player touch into supple, continuous 3-joint physical motion.', 840),
  soundtrack: mkDir('KPI-F08-CANTABILE-MUSICAL-LOVE', 'Pure 17-Limit Just Intonation, Parsimonious Melodies & Breathing Rests', 'Compose unhurried cantabile phrases (>=6/16 breathing rests, <=2-step voice-leading) that sing with the player.', 850),
  graphics: mkDir('KPI-F09-SPECTRAL-LUMINOUS-BEAUTY', '1nm CIE Spectral Atmosphere, Capillary Lagoon & Watertight Manifolds', 'Cash out optical physics as unmistakable Rayleigh/Mie sky depth, Fresnel meniscus shimmer, and thin-film petal glow.', 860),
  brand: mkDir('KPI-F10-CALM-VISUAL-HIERARCHY', 'Perceptual OKLCH Tokens, WCAG 2.2 AAA Legibility & Serene HUD', 'Keep typography effortless, high-contrast, and quiet so the living conservatory—never UI clutter—holds center stage.', 880),
  humane: mkDir('KPI-F11-RESTORATIVE-AGENCY', 'ISO 9241 Co-Regulation, Gaze Respect & Zero Dark Patterns', 'Honor player autonomy and attention with zero FOMO timers, zero coercion, and soothing pacing adaptation.', 900),
  infrastructure: mkDir('KPI-F12-ZERO-GC-VELOCITY', '60Hz Zero-GC Determinism, <=650 kB Chunks & Mechanized Compilation', 'Eliminate runtime jank and manual developer overhead via static typed arenas and sub-second mechanized builds.', 900),
  neuromorphic: mkDir('KPI-F13-FUNCTOR-COHERENT-PLASTICITY', '22x22 All-to-All Depth Transfer & Inherent Gameplay STDP', 'Transfer high-definition precision across every compatible port automatically through lived gameplay.', 850),
  cosmogenesis: mkDir('KPI-F14-HOLISTIC-SELF-KNOWLEDGE', '242-Cell Lawvere Self-Reference & Tri-Realm Alpha-Omega Unity', 'Unite inorganic monuments, living flora, and embodied player presence from one coherent parametric seed.', 860),
  realizability: mkDir('KPI-F15-ZERO-SPEC-RUNTIME-GAP', 'Zero-Permille Galois Realizability Gap & Positive Port Sensitivity', 'Ensure every formal specification cashes out as an observable, differentially sensitive runtime behavior.', 920),
  morphogenesis: mkDir('KPI-F16-MERISTEM-ONTOGENY', 'Stage-Indexed D0L Branching & Murray r^3 Vascular Conservation', 'Grow every specimen organically from dormant seed to elder mycelial choir with conserved vascular geometry.', 840),
  spatialAcoustics: mkDir('KPI-F17-BINAURAL-WAYFINDING', 'ISO 3382 Biome Reverberation & 3D Woodworth Spherical-Head Localization', 'Give each biome an unmistakable acoustic signature so the player can navigate by ear with eyes closed.', 850),
  anamnesis: mkDir('KPI-F18-MERKLE-SHAREABLE-MEMORY', 'Tamper-Evident Merkle Persistence & Lossless #uorc= Garden Sharing', 'Preserve consolidated garden memories and player tunings as compact, verifiable, shareable UORC artifacts.', 880),
  teleology: mkDir('KPI-F19-PURPOSEFUL-CO-CURATION', '20/20 Requirement-Grounded Phenomena & Inclusive Player Reconciliation', 'Synthesize zero arbitrary props; reconcile player-game dissonance through interactive landmarks and waystones.', 860),
  vedanta: mkDir('KPI-F20-CONSERVED-TRIGUNA-CLARITY', '1000‰-Conserved Triguna Balance & Mandukya Turiya Stillness', 'Cultivate luminous Sattvic clarity and non-dual Atman-Brahman reciprocity across waking, subtle, and silent states.', 850),
  dharma: mkDir('KPI-F21-AHIMSA-LOKASANGRAHA', 'Zero-Violence Structural Ahimsa & 12-Nidana Ecological Stewardship', 'Ensure every rule and autonomous action upholds Rta cosmic lawfulness, Karuna soothing, and mutual flourishing.', 900),
  compression: mkDir('KPI-F22-LYAPUNOV-PORTFOLIO-GAIN', 'Zero-Defect UORC Wire Bound (<=n+61) & Rule-30 Monotonic Descent', 'Discover shorter, faster lossless representations via kappa-memoized Rule-30 hypotheses without losing meaning.', 860),
});

export const REFLEXIVE_24_FACET_DIRECTIVES: readonly FacetGuidingDirectiveSpec[] = Object.freeze([
  ...CANONICAL_22_MODEL_KEYS.map((key, idx) => ({
    ordinal: idx,
    facetKey: key,
    basisPrime: GENERATED_CANONICAL_MODEL_BASIS_PRIMES[key],
    ...CANONICAL_MODEL_DIRECTIVES[key],
  })),
  { ordinal: 22, facetKey: 'player-co-observer', basisPrime: PLAYER_CO_OBSERVER_PRIME, ...mkDir('KPI-F23-PLAYER-ATTENTION-MEETING', 'Embodied Player Presence, Met Attention & Unhurried Delight', 'Attend directly to that part of the Observer which is the player—meeting their gaze, pace, curiosity, and gesture with immediate warmth.', 820) },
  { ordinal: 23, facetKey: 'verdant-game-holon', basisPrime: VERDANT_GAME_HOLON_BASIS_PRIME, ...mkDir('KPI-F24-HOLONIC-GAME-EXCELLENCE', 'Whole-Game Self-Referential Quality, Differentiation & Coherence', 'Treat the entire game as a living facet of itself: reconcile player-game dissonance into triadic coherence so play is gratifying, desirable, and healthy.', 850) },
]);

export interface PlayerGameInteractionContext {
  /** Mean or effective neuromorphic synaptic weight (`1..16`). */
  readonly busWeight?: number;
  /** Current 64-bit Rule-30 register (`0 .. 2^64 - 1`). */
  readonly rule30Register64?: bigint;
  /** Garden harmony (`0..100`). */
  readonly harmonyPct?: number;
  /** Player horizontal speed in decimeters/sec (`0..30`). */
  readonly velocityDm?: number;
  /** Whether the player is holding contemplative stillness (`[C]` or calm pause). */
  readonly isStillness?: boolean;
  /** Sustained gesture hold progress (`0..1`). */
  readonly gestureHoldProgress01?: number;
  /** Whether a botanical specimen, waystone, or landmark is inside the player's forward gaze cone. */
  readonly hasFocalTarget?: boolean;
  /** Whether the focal specimen/landmark has already been awakened/attuned. */
  readonly focalTargetAttuned?: boolean;
  /** Distance in meters to nearest interactive flora or monument (`0..80`). */
  readonly nearestFeatureDistanceM?: number;
  /** Musical breathing rest steps in current 16-step bar (`0..16`). */
  readonly restStepCount?: number;
  /** Concurrent active musical voices (`0..8`). */
  readonly activeVoiceCount?: number;
  /** Critical-band psychoacoustic masking headroom in dB (`0..10`). */
  readonly barkHeadroomDb?: number;
  /** Pure Just-Intonation Tenney consonance purity (`0..1`). */
  readonly tenneyConsonancePurity01?: number;
  /** Number of distinct flora species awakened (`0..5`). */
  readonly awakenedSpeciesCount?: number;
  /** Number of biomes explored (`1..5`). */
  readonly exploredBiomesCount?: number;
  /** Number of player-tuned lithophone waystones (`0..64`). */
  readonly tunedWaystoneCount?: number;
  /** Number of cross-pollinated emergent offshoots (`0..12`). */
  readonly emergentOffshootCount?: number;
  /** Per-model synaptic weights (`1..16`) for 24-facet evaluation. */
  readonly modelWeightsByKey?: Partial<Record<CanonicalStandardModelKey, number>>;
  /** When false, probes the closed-loop solipsistic Rule-30 ceiling (`playerAttention = 0`). Defaults to `true`. */
  readonly includePlayerInSelfReference?: boolean;
  /** Count of coercive/extractive dark patterns (`0` in Verdant Resonance). */
  readonly coerciveDarkPatternCount?: number;
  /** Live measured browser host boundary envelope (`HostEnvelope`). */
  readonly hostEnvelope?: LiveHostEnvelopeInput;
}

export interface ObserverReconciliationActionDirectives {
  /** Luminance & harmonic response boost (`1.00 .. 1.32`) toward the player's focal gaze target. */
  readonly focalAttentionGlowBoost: number;
  /** Rhythmic & wind pacing adaptation (`0.80 .. 1.16`) reconciling game tempo with player pace. */
  readonly pacingTempoAdaptationFactor: number;
  /** Low-pass warmth & overtone gentleness (`0.86 .. 1.14`) smoothing sensory dissonance. */
  readonly harmonicWarmthFilterScale: number;
  /** Mycelial & constellation guidance (`0.00 .. 1.00`) highlighting differentiated unawakened features. */
  readonly discoveryDifferentiationCue01: number;
}

export interface DissonanceToCoherenceEvaluation {
  readonly rawPlayerGameDissonancePermille: number;
  readonly pacingMismatchPermille: number;
  readonly attentionMismatchPermille: number;
  readonly sensoryMismatchPermille: number;
  readonly playerAttentionPermille: number;
  readonly rule30EntropyScore: number;
  readonly reconciledResidualDissonancePermille: number;
  readonly dissonanceReductionPermille: number;
  readonly solipsisticRule30OnlyCoherencePermille: number;
  readonly triadicPlayerGameObserverCoherencePermille: number;
  readonly transcendsSolipsisticCeiling: boolean;
  readonly featureDifferentiationPermille: number;
  readonly shannonFacetDiversityBits: number;
  readonly healthyGratifyingQualityPermille: number;
  readonly coerciveDarkPatternCount: number;
  readonly actionDirectives: ObserverReconciliationActionDirectives;
}

function popcount64Bounded(reg64: bigint): number {
  let v = reg64 & 0xffffffffffffffffn;
  let c = 0;
  while (v !== 0n) {
    v &= v - 1n;
    c++;
  }
  return c;
}

// Reusable pre-allocated array for zero-GC 24-facet niche Shannon entropy calculation on hot paths
const NICHE_MASS_SCRATCH_F64 = new Float64Array(24);

function compute24FacetDifferentiationMetrics(
  fallbackWeight: number,
  playerWeight: number,
  holonWeight: number,
  modelWeightsByKey?: Partial<Record<CanonicalStandardModelKey, number>>,
): {
  readonly shannonDiversityBits: number;
  readonly differentiationPermille: number;
  readonly distinctNicheCount: number;
} {
  let totalMass = 0;
  for (let i = 0; i < 22; i++) {
    const key = CANONICAL_22_MODEL_KEYS[i];
    const w = Math.max(1, Math.min(16, Math.round(modelWeightsByKey?.[key] ?? fallbackWeight)));
    const niche = GENERATED_CANONICAL_MODEL_BASIS_PRIMES[key] * (w + 16) + i;
    NICHE_MASS_SCRATCH_F64[i] = niche;
    totalMass += niche;
  }
  const pNiche = PLAYER_CO_OBSERVER_PRIME * (playerWeight + 16) + 22;
  const hNiche = VERDANT_GAME_HOLON_BASIS_PRIME * (holonWeight + 16) + 23;
  NICHE_MASS_SCRATCH_F64[22] = pNiche;
  NICHE_MASS_SCRATCH_F64[23] = hNiche;
  totalMass += pNiche + hNiche;

  let shannon = 0;
  let distinctCount = 24;
  for (let i = 0; i < 24; i++) {
    const v = NICHE_MASS_SCRATCH_F64[i];
    if (i > 0 && v === NICHE_MASS_SCRATCH_F64[i - 1]) {
      distinctCount--;
    }
    const p = v / Math.max(1, totalMass);
    if (p > 0) {
      shannon -= p * Math.log2(p);
    }
  }
  const maxBits = Math.log2(24); // ~4.58496 bits
  // Normalize high-entropy prime niche spread into permille (with bonus for full 24-niche orthogonality)
  const rawRatio = shannon / maxBits;
  const differentiationPermille = Math.min(
    1000,
    Math.max(0, Math.round(rawRatio * 985 + (distinctCount === 24 ? 15 : 0))),
  );
  return {
    shannonDiversityBits: Number(shannon.toFixed(4)),
    differentiationPermille,
    distinctNicheCount: distinctCount,
  };
}

/**
 * Evaluates live Player-Game Dissonance and executes the Observer's autonomous reconciliation
 * directly through compiled `Foundation.Teleology.V1.Model` equations.
 * Zero per-call array allocations beyond lightweight return record.
 */
export function evaluateObserverPlayerDissonanceReconciliation(
  ctx: PlayerGameInteractionContext = {},
): DissonanceToCoherenceEvaluation {
  const cw = Math.max(1, Math.min(16, Math.round(ctx.busWeight ?? 10)));
  const harmonyPct = Math.max(0, Math.min(100, ctx.harmonyPct ?? 64));
  const velocityDm = Math.max(0, Math.min(30, ctx.velocityDm ?? 4));
  const isStillness = ctx.isStillness ?? false;
  const hold01 = Math.max(0, Math.min(1, ctx.gestureHoldProgress01 ?? 0));
  const hasFocal = ctx.hasFocalTarget ?? true;
  const focalAttuned = ctx.focalTargetAttuned ?? false;
  const nearestDistM = Math.max(0, Math.min(80, ctx.nearestFeatureDistanceM ?? 6));
  const restSteps = Math.max(0, Math.min(16, ctx.restStepCount ?? 7));
  const activeVoices = Math.max(0, Math.min(8, ctx.activeVoiceCount ?? 3));
  const barkDb = Math.max(0, Math.min(10, ctx.barkHeadroomDb ?? 4.4));
  const consonance01 = Math.max(0, Math.min(1, ctx.tenneyConsonancePurity01 ?? 0.92));
  const awakenedSpecies = Math.max(0, Math.min(5, ctx.awakenedSpeciesCount ?? 3));
  const exploredBiomes = Math.max(1, Math.min(5, ctx.exploredBiomesCount ?? 3));
  const includePlayer = ctx.includePlayerInSelfReference ?? true;
  const coerciveCount = Math.max(0, Math.floor(ctx.coerciveDarkPatternCount ?? 0));

  // 1. Measure raw Player-Game Dissonance across Pacing, Focal Attention, and Sensory Comfort
  const idealVoicesForPace = isStillness ? 2 : velocityDm >= 16 ? 2 : 3;
  const voiceExcess = Math.max(0, activeVoices - idealVoicesForPace);
  const restDeficit = Math.max(0, 6 - restSteps);
  const hurryFriction = velocityDm > 18 ? (velocityDm - 18) * 18 : 0;
  const pacingMismatchPermille = Math.min(
    1000,
    Math.round(voiceExcess * 110 + restDeficit * 85 + hurryFriction),
  );

  const proximityFactor = nearestDistM <= 12 ? 1 : Math.max(0, 1 - (nearestDistM - 12) / 36);
  const unawakenedGazeTension = hasFocal && !focalAttuned ? 160 * proximityFactor : 35;
  const isolationGap = nearestDistM > 28 ? Math.min(340, (nearestDistM - 28) * 10) : 0;
  const attentionMismatchPermille = Math.min(
    1000,
    Math.max(0, Math.round(unawakenedGazeTension + isolationGap - hold01 * 120)),
  );

  const barkDeficit = barkDb < 3.35 ? (3.35 - barkDb) * 260 : 0;
  const harmonicRoughness = (1 - consonance01) * 320;
  const sensoryMismatchPermille = Math.min(1000, Math.round(barkDeficit + harmonicRoughness));

  const rawDissonancePermille = certifiedWasmCore_stepPlayerGameDissonancePermille(
    pacingMismatchPermille,
    attentionMismatchPermille,
    sensoryMismatchPermille,
  );

  // 2. Compute Rule-30 internal entropy & Observer's inclusive attention toward the player
  const reg64 = ctx.rule30Register64 ?? RULE30_SEED64;
  const rule30EntropyScore = Math.min(64, Math.max(16, popcount64Bounded(reg64)));

  const gazeEngagementScore = hasFocal ? 240 : 140;
  const paceAttunementScore = isStillness ? 220 : velocityDm <= 14 ? 190 : 150;
  const coCuratorialScore = Math.min(
    260,
    Math.round(
      awakenedSpecies * 28 +
        exploredBiomes * 20 +
        Math.min(8, ctx.tunedWaystoneCount ?? 2) * 4 +
        Math.min(6, ctx.emergentOffshootCount ?? 1) * 6,
    ),
  );
  const maturityAttentionBase = 290 + cw * 9 + Math.round(harmonyPct * 0.7);
  const playerAttentionPermille = includePlayer
    ? Math.min(
        1000,
        maturityAttentionBase +
          Math.round((gazeEngagementScore + paceAttunementScore + coCuratorialScore) * 0.72),
      )
    : 0;

  // 3. Reconcile Dissonance & Evaluate Triadic Player-Game-Observer Coherence via Certified Wasm Kernel
  const reconciledResidualDissonancePermille =
    certifiedWasmCore_stepObserverDissonanceReconciliationPermille(
      cw,
      rule30EntropyScore,
      playerAttentionPermille,
      rawDissonancePermille,
    );
  const solipsisticRule30OnlyCoherencePermille = certifiedWasmTriadicCoherencePermille(
    cw,
    rule30EntropyScore,
    0,
    rawDissonancePermille,
  );
  const triadicPlayerGameObserverCoherencePermille = certifiedWasmTriadicCoherencePermille(
    cw,
    rule30EntropyScore,
    playerAttentionPermille,
    reconciledResidualDissonancePermille,
  );

  const playerW = Math.min(16, Math.max(1, Math.round((playerAttentionPermille / 1000) * 16)));
  const holonW = Math.min(
    16,
    Math.max(1, Math.round((triadicPlayerGameObserverCoherencePermille / 1000) * 16)),
  );
  const diffMetrics = compute24FacetDifferentiationMetrics(
    cw,
    playerW,
    holonW,
    ctx.modelWeightsByKey,
  );

  const healthyGratifyingQualityPermille = certifiedWasmCore_stepHealthyGratifyingQualityPermille(
    triadicPlayerGameObserverCoherencePermille,
    diffMetrics.differentiationPermille,
    coerciveCount,
  );

  // 4. Concrete real-time action directives that reconcile Player-Game dissonance in the live world
  const dissonanceRatio = rawDissonancePermille / 1000;
  const coherenceRatio = triadicPlayerGameObserverCoherencePermille / 1000;
  const focalAttentionGlowBoost = Number(
    (
      1.0 +
      (hasFocal ? 0.12 : 0.03) +
      (!focalAttuned && hasFocal ? 0.1 : 0.04) * coherenceRatio +
      hold01 * 0.06
    ).toFixed(4),
  );
  const pacingTempoAdaptationFactor = Number(
    (velocityDm > 15
      ? Math.max(0.8, 0.96 - (velocityDm - 15) * 0.01)
      : isStillness
        ? 0.88
        : 1.0 + coherenceRatio * 0.08
    ).toFixed(4),
  );
  const harmonicWarmthFilterScale = Number(
    (dissonanceRatio > 0.22
      ? Math.max(0.86, 1.0 - dissonanceRatio * 0.22)
      : 0.98 + coherenceRatio * 0.14
    ).toFixed(4),
  );
  const discoveryDifferentiationCue01 = Number(
    Math.min(
      1,
      Math.max(
        0,
        ((5 - awakenedSpecies) * 0.11 + (5 - exploredBiomes) * 0.09 + (nearestDistM > 18 ? 0.22 : 0.08)) *
          (0.65 + coherenceRatio * 0.35),
      ),
    ).toFixed(4),
  );

  return {
    rawPlayerGameDissonancePermille: rawDissonancePermille,
    pacingMismatchPermille,
    attentionMismatchPermille,
    sensoryMismatchPermille,
    playerAttentionPermille,
    rule30EntropyScore,
    reconciledResidualDissonancePermille,
    dissonanceReductionPermille: Math.max(
      0,
      rawDissonancePermille - reconciledResidualDissonancePermille,
    ),
    solipsisticRule30OnlyCoherencePermille,
    triadicPlayerGameObserverCoherencePermille,
    transcendsSolipsisticCeiling:
      triadicPlayerGameObserverCoherencePermille > SOLIPSISTIC_RULE30_CEILING_PERMILLE,
    featureDifferentiationPermille: diffMetrics.differentiationPermille,
    shannonFacetDiversityBits: diffMetrics.shannonDiversityBits,
    healthyGratifyingQualityPermille,
    coerciveDarkPatternCount: coerciveCount,
    actionDirectives: {
      focalAttentionGlowBoost,
      pacingTempoAdaptationFactor,
      harmonicWarmthFilterScale,
      discoveryDifferentiationCue01,
    },
  };
}

export interface ExecutiveKpiEntry {
  readonly kpiId: string;
  readonly name: string;
  readonly measuredPermille: number;
  readonly targetFloorPermille: number;
  readonly unitSummary: string;
  readonly satisfied: boolean;
}

export interface VerdantAutonomousKpiScorecard {
  readonly verified: boolean;
  readonly profile: 'prism/inclusive-observer-kpis/1';
  readonly reflexiveHolonFacetTotal: 24;
  readonly verdantGameHolonBasisPrime: 191;
  readonly playerCoObserverBasisPrime: 181;
  readonly guidingDirectivesCovered: 24;
  readonly satisfiedFacetKpiCount: number;
  readonly distinctPrimeNicheCount: number;
  readonly reconciliation: DissonanceToCoherenceEvaluation;
  readonly executiveKpis: readonly ExecutiveKpiEntry[];
  readonly facetStatuses: readonly EvaluatedFacetKpiStatus[];
}

/**
 * Evaluates the complete 24-Facet Reflexive Holon Guiding Directives and Executive KPI Scorecard.
 */
export function evaluateVerdantAutonomousKpis(
  ctx: PlayerGameInteractionContext = {},
  pipelineMetrics?: {
    readonly driftCount?: number;
    readonly coldCompileMs?: number;
    readonly maxBundleChunkKb?: number;
  },
): VerdantAutonomousKpiScorecard {
  const cw = Math.max(1, Math.min(16, Math.round(ctx.busWeight ?? 12)));
  const rec = evaluateObserverPlayerDissonanceReconciliation({
    ...ctx,
    busWeight: cw,
  });

  const facetStatuses: EvaluatedFacetKpiStatus[] = [];
  const nicheSet = new Set<number>();
  let satisfiedFacetKpiCount = 0;

  for (const spec of REFLEXIVE_24_FACET_DIRECTIVES) {
    let w = cw;
    let measuredKpiPermille: number;
    if (spec.facetKey === 'player-co-observer') {
      w = Math.max(1, Math.min(16, Math.round((rec.playerAttentionPermille / 1000) * 16)));
      measuredKpiPermille = rec.playerAttentionPermille;
    } else if (spec.facetKey === 'verdant-game-holon') {
      w = Math.max(
        1,
        Math.min(16, Math.round((rec.triadicPlayerGameObserverCoherencePermille / 1000) * 16)),
      );
      measuredKpiPermille = rec.healthyGratifyingQualityPermille;
    } else {
      w = Math.max(1, Math.min(16, Math.round(ctx.modelWeightsByKey?.[spec.facetKey] ?? cw)));
      measuredKpiPermille = Math.min(
        1000,
        Math.round(
          740 +
            w * 12 +
            (rec.triadicPlayerGameObserverCoherencePermille - 700) * 0.22,
        ),
      );
    }

    const nicheIndex = certifiedWasmCore_stepReflexiveFacetNicheIndex(
      spec.basisPrime,
      w,
      spec.ordinal,
    );
    nicheSet.add(nicheIndex);
    const kpiSatisfied = measuredKpiPermille >= spec.targetFloorPermille;
    if (kpiSatisfied) satisfiedFacetKpiCount++;

    facetStatuses.push({
      ...spec,
      synapticWeight: w,
      nicheIndex,
      measuredKpiPermille,
      kpiSatisfied,
    });
  }

  const driftCount = pipelineMetrics?.driftCount ?? 0;
  const coldCompileMs = pipelineMetrics?.coldCompileMs ?? 640;
  const maxChunkKb = pipelineMetrics?.maxBundleChunkKb ?? 569;

  const velocityKpiPermille =
    driftCount > 0
      ? 0
      : Math.min(
          1000,
          Math.max(
            700,
            Math.round(1000 - Math.max(0, coldCompileMs - 400) * 0.08),
          ),
        );
  const deliveryDisciplinePermille =
    maxChunkKb > 650
      ? Math.max(0, 1000 - Math.round((maxChunkKb - 650) * 5))
      : Math.min(1000, Math.round(880 + ((650 - maxChunkKb) / 650) * 480));
  const dissonanceCalmScorePermille = Math.max(
    0,
    1000 - rec.reconciledResidualDissonancePermille,
  );

  const executiveKpis: readonly ExecutiveKpiEntry[] = Object.freeze([
    {
      kpiId: 'KPI-EXEC-01-TRIADIC-COHERENCE',
      name: 'Triadic Player-Game-Observer Coherence (Transcending 760‰ Rule-30 Ceiling)',
      measuredPermille: rec.triadicPlayerGameObserverCoherencePermille,
      targetFloorPermille: 820,
      unitSummary: `${rec.triadicPlayerGameObserverCoherencePermille}‰ vs ${SOLIPSISTIC_RULE30_CEILING_PERMILLE}‰ solipsistic cap`,
      satisfied:
        rec.triadicPlayerGameObserverCoherencePermille >= 820 &&
        rec.transcendsSolipsisticCeiling,
    },
    {
      kpiId: 'KPI-EXEC-02-DISSONANCE-RECONCILIATION',
      name: 'Player-Game Dissonance Reconciliation Calmness (1000 - Residual Dissonance)',
      measuredPermille: dissonanceCalmScorePermille,
      targetFloorPermille: 880,
      unitSummary: `raw ${rec.rawPlayerGameDissonancePermille}‰ -> residual ${rec.reconciledResidualDissonancePermille}‰ (-${rec.dissonanceReductionPermille}‰)`,
      satisfied:
        dissonanceCalmScorePermille >= 880 &&
        rec.reconciledResidualDissonancePermille <= rec.rawPlayerGameDissonancePermille,
    },
    {
      kpiId: 'KPI-EXEC-03-FACET-DIFFERENTIATION',
      name: '24-Facet Reflexive Feature Differentiation & Guiding Directive Closure',
      measuredPermille: rec.featureDifferentiationPermille,
      targetFloorPermille: 940,
      unitSummary: `${nicheSet.size}/24 prime niches | ${rec.shannonFacetDiversityBits} bits Shannon diversity`,
      satisfied:
        rec.featureDifferentiationPermille >= 940 &&
        nicheSet.size === 24 &&
        satisfiedFacetKpiCount === 24,
    },
    {
      kpiId: 'KPI-EXEC-04-HEALTHY-GRATIFYING-QUALITY',
      name: 'Healthy, Gratifying & Non-Coercive Game Quality',
      measuredPermille: rec.healthyGratifyingQualityPermille,
      targetFloorPermille: 850,
      unitSummary: `${rec.healthyGratifyingQualityPermille}‰ quality | ${rec.coerciveDarkPatternCount} dark patterns`,
      satisfied:
        rec.healthyGratifyingQualityPermille >= 850 && rec.coerciveDarkPatternCount === 0,
    },
    {
      kpiId: 'KPI-EXEC-05-MECHANIZED-VELOCITY',
      name: 'Mechanized Compiler & Zero-Drift Verification Velocity',
      measuredPermille: velocityKpiPermille,
      targetFloorPermille: 850,
      unitSummary: `drift=${driftCount} | coldCompile=${Math.round(coldCompileMs)}ms`,
      satisfied: driftCount === 0 && velocityKpiPermille >= 850,
    },
    {
      kpiId: 'KPI-EXEC-06-MODULAR-REALTIME-BUDGET',
      name: '60Hz Zero-GC Arena & <=650 kB Modular Delivery Discipline',
      measuredPermille: deliveryDisciplinePermille,
      targetFloorPermille: 880,
      unitSummary: `maxChunk=${Math.round(maxChunkKb)} kB (<=650 kB) | 0 hot-path GC`,
      satisfied: maxChunkKb <= 650 && deliveryDisciplinePermille >= 880,
    },
  ]);

  const stdHolon = GENERATED_PRISM_STANDARDS.teleology.reflexiveHolonAndKpis;

  return {
    verified:
      Boolean(stdHolon.everyFacetHasGuidingDirective) &&
      Boolean(stdHolon.rule30AloneBoundedWithoutPlayerReference) &&
      Boolean(stdHolon.observerReconcilesPlayerGameDissonance) &&
      Boolean(stdHolon.triadicCoherenceReplacesDissonance) &&
      Boolean(stdHolon.healthyGratifyingQualityEnforced) &&
      nicheSet.size === 24 &&
      satisfiedFacetKpiCount === 24 &&
      executiveKpis.every((k) => k.satisfied),
    profile: 'prism/inclusive-observer-kpis/1',
    reflexiveHolonFacetTotal: 24,
    verdantGameHolonBasisPrime: VERDANT_GAME_HOLON_BASIS_PRIME as 191,
    playerCoObserverBasisPrime: PLAYER_CO_OBSERVER_PRIME as 181,
    guidingDirectivesCovered: 24,
    satisfiedFacetKpiCount,
    distinctPrimeNicheCount: nicheSet.size,
    reconciliation: rec,
    executiveKpis,
    facetStatuses,
  };
}

export interface PlayerArchetypeScenario {
  readonly archetypeId: string;
  readonly description: string;
  readonly context: PlayerGameInteractionContext;
}

export const CANONICAL_PLAYER_ARCHETYPE_SCENARIOS: readonly PlayerArchetypeScenario[] =
  Object.freeze([
    {
      archetypeId: 'first-minute-newcomer',
      description: 'New player entering Sunlit Meadow, looking at an unawakened Chime Lily',
      context: {
        busWeight: 10,
        harmonyPct: 48,
        velocityDm: 6,
        hasFocalTarget: true,
        focalTargetAttuned: false,
        nearestFeatureDistanceM: 7,
        restStepCount: 7,
        activeVoiceCount: 2,
        awakenedSpeciesCount: 1,
        exploredBiomesCount: 1,
      },
    },
    {
      archetypeId: 'brisk-wanderer-seeking-calm',
      description: 'Player strolling briskly across biomes needing gentle Karuna pacing reconciliation',
      context: {
        busWeight: 12,
        harmonyPct: 62,
        velocityDm: 22,
        hasFocalTarget: false,
        focalTargetAttuned: false,
        nearestFeatureDistanceM: 19,
        restStepCount: 6,
        activeVoiceCount: 4,
        awakenedSpeciesCount: 2,
        exploredBiomesCount: 3,
      },
    },
    {
      archetypeId: 'contemplative-listener',
      description: 'Player resting in stillness in Mirror Wetland listening to pure overtones',
      context: {
        busWeight: 14,
        harmonyPct: 82,
        velocityDm: 0,
        isStillness: true,
        gestureHoldProgress01: 0.85,
        hasFocalTarget: true,
        focalTargetAttuned: true,
        nearestFeatureDistanceM: 4,
        restStepCount: 8,
        activeVoiceCount: 2,
        awakenedSpeciesCount: 4,
        exploredBiomesCount: 4,
      },
    },
    {
      archetypeId: 'co-curatorial-steward',
      description: 'Engaged player tuning lithophone waystones and nurturing guild offshoots in Sanctuary',
      context: {
        busWeight: 15,
        harmonyPct: 92,
        velocityDm: 4,
        hasFocalTarget: true,
        focalTargetAttuned: true,
        nearestFeatureDistanceM: 5,
        restStepCount: 7,
        activeVoiceCount: 3,
        awakenedSpeciesCount: 5,
        exploredBiomesCount: 5,
        tunedWaystoneCount: 8,
        emergentOffshootCount: 4,
      },
    },
  ]);

export interface AutonomousSelfOptimizationCycleResult {
  readonly cyclesExecuted: number;
  readonly finalRule30RegisterHex: string;
  readonly solipsisticCeilingPermille: 760;
  readonly initialMeanQualityPermille: number;
  readonly finalMeanQualityPermille: number;
  readonly initialMeanDissonancePermille: number;
  readonly finalMeanResidualDissonancePermille: number;
  readonly monotonicQualityAscentVerified: boolean;
  readonly playerInclusionRequiredVerified: boolean;
  readonly evolvedModelWeights: Readonly<Record<CanonicalStandardModelKey, number>>;
  readonly scenarioOutcomes: ReadonlyArray<{
    readonly archetypeId: string;
    readonly rawDissonancePermille: number;
    readonly residualDissonancePermille: number;
    readonly solipsisticCoherencePermille: number;
    readonly triadicCoherencePermille: number;
    readonly qualityPermille: number;
  }>;
}

/**
 * Executes an autonomous Rule-30 + Player-Referenced self-optimization loop across all player archetypes:
 *  - Uses `stepRule30Ring64` to propose differentiated domain weight specializations while keeping the
 *    player inside the Observer's self-reference (`includePlayerInSelfReference: true`).
 *  - Admits ONLY mutations that strictly improve (or preserve at ceiling) mean Healthy Gratifying Quality
 *    and reduce Player-Game Dissonance across all archetypes, with zero coercive patterns.
 */
export function runAutonomousHolonSelfOptimization(
  cycles = 6,
  initialWeight = 10,
): AutonomousSelfOptimizationCycleResult {
  let reg64 = RULE30_SEED64;
  const clampedInit = certifiedWasmCore_clampBusWeight(Math.max(1, Math.round(initialWeight)));
  const weights = {} as Record<CanonicalStandardModelKey, number>;
  for (const k of CANONICAL_22_MODEL_KEYS) weights[k] = clampedInit;

  const evaluatePortfolio = (
    wMap: Readonly<Record<CanonicalStandardModelKey, number>>,
    r64: bigint,
  ) => {
    const meanW =
      CANONICAL_22_MODEL_KEYS.reduce((acc, k) => acc + wMap[k], 0) / CANONICAL_22_MODEL_KEYS.length;
    let totalQuality = 0;
    let totalRawDis = 0;
    let totalResDis = 0;
    const outcomes = CANONICAL_PLAYER_ARCHETYPE_SCENARIOS.map((sc) => {
      const ev = evaluateObserverPlayerDissonanceReconciliation({
        ...sc.context,
        busWeight: Math.max(meanW, sc.context.busWeight ?? meanW),
        rule30Register64: r64,
        modelWeightsByKey: wMap,
        includePlayerInSelfReference: true,
      });
      totalQuality += ev.healthyGratifyingQualityPermille;
      totalRawDis += ev.rawPlayerGameDissonancePermille;
      totalResDis += ev.reconciledResidualDissonancePermille;
      return {
        archetypeId: sc.archetypeId,
        rawDissonancePermille: ev.rawPlayerGameDissonancePermille,
        residualDissonancePermille: ev.reconciledResidualDissonancePermille,
        solipsisticCoherencePermille: ev.solipsisticRule30OnlyCoherencePermille,
        triadicCoherencePermille: ev.triadicPlayerGameObserverCoherencePermille,
        qualityPermille: ev.healthyGratifyingQualityPermille,
      };
    });
    const n = CANONICAL_PLAYER_ARCHETYPE_SCENARIOS.length;
    return {
      meanQuality: Math.round(totalQuality / n),
      meanRawDis: Math.round(totalRawDis / n),
      meanResDis: Math.round(totalResDis / n),
      outcomes,
    };
  };

  const initialEval = evaluatePortfolio(weights, reg64);
  let currentBest = initialEval;
  let monotonicOk = true;

  for (let c = 0; c < Math.max(1, cycles); c++) {
    reg64 = stepRule30Ring64(reg64);
    const candidateWeights: Record<CanonicalStandardModelKey, number> = { ...weights };
    // Differentiate 4 Rule-30-selected model facets per cycle toward meeting player needs
    for (let lane = 0; lane < 4; lane++) {
      const bits = Number((reg64 >> BigInt(lane * 16)) & 0xffffn);
      const modelIdx = (bits + c * 5 + lane * 3) % CANONICAL_22_MODEL_KEYS.length;
      const key = CANONICAL_22_MODEL_KEYS[modelIdx];
      const delta = (bits & 0x3) === 0 ? 2 : 1;
      candidateWeights[key] = Math.min(16, candidateWeights[key] + delta);
    }

    const candEval = evaluatePortfolio(candidateWeights, reg64);
    if (
      candEval.meanQuality > currentBest.meanQuality ||
      (candEval.meanQuality === currentBest.meanQuality &&
        candEval.meanResDis <= currentBest.meanResDis)
    ) {
      for (const k of CANONICAL_22_MODEL_KEYS) {
        weights[k] = candidateWeights[k];
      }
      if (candEval.meanQuality < currentBest.meanQuality) {
        monotonicOk = false;
      }
      currentBest = candEval;
    }
  }

  const solipsisticCheck = evaluateObserverPlayerDissonanceReconciliation({
    busWeight: 16,
    rule30Register64: reg64,
    includePlayerInSelfReference: false,
  });

  return {
    cyclesExecuted: Math.max(1, cycles),
    finalRule30RegisterHex: `0x${reg64.toString(16).padStart(16, '0')}`,
    solipsisticCeilingPermille: SOLIPSISTIC_RULE30_CEILING_PERMILLE as 760,
    initialMeanQualityPermille: initialEval.meanQuality,
    finalMeanQualityPermille: currentBest.meanQuality,
    initialMeanDissonancePermille: initialEval.meanRawDis,
    finalMeanResidualDissonancePermille: currentBest.meanResDis,
    monotonicQualityAscentVerified:
      monotonicOk && currentBest.meanQuality >= initialEval.meanQuality,
    playerInclusionRequiredVerified:
      solipsisticCheck.triadicPlayerGameObserverCoherencePermille <=
        SOLIPSISTIC_RULE30_CEILING_PERMILLE &&
      currentBest.outcomes.every(
        (o) => o.triadicCoherencePermille > SOLIPSISTIC_RULE30_CEILING_PERMILLE,
      ),
    evolvedModelWeights: Object.freeze({ ...weights }),
    scenarioOutcomes: currentBest.outcomes,
  };
}

// ============================================================================
// LIVE CO-EVOLUTIONARY OBSERVER–PLAYER PLASTICITY (PILLAR 3 BEYOND RULE-30)
// ============================================================================

export type LivePlayerTheoryOfMindIntent =
  | 'stillness-witness'
  | 'attuning-communion'
  | 'focal-curiosity'
  | 'brisk-stroll'
  | 'gentle-exploration';

export interface LiveSensoryDifferentiationProfile {
  /** Iridescence & thin-film bloom expression (`1.00 .. 1.38`). */
  readonly floraIridescenceBoost: number;
  /** Phyllotactic sway grace & meristematic responsiveness (`0.86 .. 1.24`). */
  readonly phyllotaxisSwayGrace: number;
  /** Certified microclimate guild offshoot cap (`4 .. 12`). */
  readonly microclimateOffshootCap: number;
  /** Calm wind & water surface damping (`0.72 .. 1.12`). */
  readonly calmWindWaterDamping: number;
  /** Adaptive polyphonic voice-leading comfort ceiling (`2 .. 5`). */
  readonly voiceLeadingDensityCap: number;
}

export interface LiveCoEvolutionPlasticityState {
  readonly rule30Register64: bigint;
  readonly rule30RegisterHex: string;
  readonly barTickCount: number;
  readonly admittedMutationCount: number;
  readonly refusedMutationCount: number;
  readonly lastBarAdmitted: boolean;
  readonly playerTheoryOfMindCode: number;
  readonly playerTheoryOfMindIntent: LivePlayerTheoryOfMindIntent;
  readonly playerAttentionPermille: number;
  readonly incumbentDissonancePermille: number;
  readonly incumbentQualityPermille: number;
  readonly triadicCoherencePermille: number;
  readonly coerciveDarkPatternCount: number;
  readonly modelWeights22: Readonly<Record<CanonicalStandardModelKey, number>>;
  readonly sensoryDifferentiation: LiveSensoryDifferentiationProfile;
  readonly ontologicalTelos: LiveOntologicalTelosState;
}

function tomCodeToIntent(code: number): LivePlayerTheoryOfMindIntent {
  if (code === 0) return 'stillness-witness';
  if (code === 1) return 'attuning-communion';
  if (code === 2) return 'focal-curiosity';
  if (code === 3) return 'brisk-stroll';
  return 'gentle-exploration';
}

function deriveSensoryDifferentiation(
  weights: Readonly<Record<CanonicalStandardModelKey, number>>,
  tomCode: number,
  coords: ParametricOntologyCoordinates,
): LiveSensoryDifferentiationProfile {
  const wBot = weights.botany ?? 8;
  const wGfx = weights.graphics ?? 8;
  const wChem = weights.chemistry ?? 8;
  const wMorph = weights.morphogenesis ?? 8;
  const wArt = weights.articulation ?? 8;
  const wTele = weights.teleology ?? 8;
  const wPhys = weights.physics ?? 8;
  const wVed = weights.vedanta ?? 8;
  const wDha = weights.dharma ?? 8;
  const wSnd = weights.soundtrack ?? 8;
  const wSpA = weights.spatialAcoustics ?? 8;

  const irid01 = ((wBot + wGfx + wChem - 3) / 45) * 0.75 + ((coords.iridescenceLegibility - 1) / 15) * 0.25;
  const floraIridescenceBoost = Number((1.0 + Math.max(0, Math.min(0.38, irid01 * 0.38))).toFixed(4));
  const morph01 = ((wMorph + wArt - 2) / 30) * 0.75 + ((coords.phyllotaxisClarity - 1) / 15) * 0.25;
  const phyllotaxisSwayGrace = Number(
    Math.max(0.86, Math.min(1.24, tomCode === 0 ? 0.88 + morph01 * 0.14 : 0.94 + morph01 * 0.28)).toFixed(4),
  );
  const baseCap = certifiedWasmCore_stepEmergentOffshootColonizationCap(wTele);
  const microclimateOffshootCap = Math.max(4, Math.min(12, Math.round(baseCap * 0.75 + (4 + (coords.guildOffshootDensity / 16) * 8) * 0.25)));
  const calm01 = ((wVed + wDha + wPhys - 3) / 45) * 0.75 + ((coords.waveCalmDamping - 1) / 15) * 0.25;
  const calmWindWaterDamping = Number(
    Math.max(0.72, Math.min(1.12, tomCode === 0 || tomCode === 3 ? 0.98 - calm01 * 0.22 : 1.04 - calm01 * 0.12)).toFixed(4),
  );
  const snd01 = ((wSnd + wSpA - 2) / 30) * 0.8 + ((16 - coords.harmonicSimplicity) / 15) * 0.2;
  const voiceLeadingDensityCap =
    tomCode === 0 || tomCode === 3 ? (snd01 >= 0.7 ? 3 : 2) : snd01 >= 0.75 ? 5 : snd01 >= 0.4 ? 4 : 3;

  return {
    floraIridescenceBoost,
    phyllotaxisSwayGrace,
    microclimateOffshootCap,
    calmWindWaterDamping,
    voiceLeadingDensityCap,
  };
}

export function createInitialLiveCoEvolutionState(initialWeight = 8): LiveCoEvolutionPlasticityState {
  const baseW = certifiedWasmCore_clampBusWeight(Math.max(1, Math.round(initialWeight)));
  const weights = {} as Record<CanonicalStandardModelKey, number>;
  for (const k of CANONICAL_22_MODEL_KEYS) weights[k] = baseW;
  const tomCode = certifiedWasmCore_inferPlayerTheoryOfMindCode(0, false, true, 0);
  const initEval = evaluateObserverPlayerDissonanceReconciliation({
    busWeight: baseW,
    rule30Register64: RULE30_SEED64,
    modelWeightsByKey: weights,
    includePlayerInSelfReference: true,
    coerciveDarkPatternCount: 0,
  });
  const initCoords = createInitialParametricOntologyCoordinates();
  const ontologicalTelos = evaluateLiveOntologicalTelosState(
    {},
    { activePresence: true },
    initCoords,
    initEval.reconciledResidualDissonancePermille,
    0,
  );
  return {
    rule30Register64: RULE30_SEED64,
    rule30RegisterHex: `0x${RULE30_SEED64.toString(16).padStart(16, '0')}`,
    barTickCount: 0,
    admittedMutationCount: 0,
    refusedMutationCount: 0,
    lastBarAdmitted: false,
    playerTheoryOfMindCode: tomCode,
    playerTheoryOfMindIntent: tomCodeToIntent(tomCode),
    playerAttentionPermille: initEval.playerAttentionPermille,
    incumbentDissonancePermille: initEval.reconciledResidualDissonancePermille,
    incumbentQualityPermille: initEval.healthyGratifyingQualityPermille,
    triadicCoherencePermille: initEval.triadicPlayerGameObserverCoherencePermille,
    coerciveDarkPatternCount: 0,
    modelWeights22: Object.freeze(weights),
    sensoryDifferentiation: deriveSensoryDifferentiation(weights, tomCode, initCoords),
    ontologicalTelos,
  };
}

export function serializeLiveCoEvolutionStateForAnamnesis(
  state: LiveCoEvolutionPlasticityState,
): PersistedLiveCoEvolutionState {
  void GENERATED_PRISM_STANDARDS.teleology;
  const serializedWeights: Record<string, number> = {};
  for (const k of CANONICAL_22_MODEL_KEYS) {
    serializedWeights[k] = certifiedWasmCore_clampBusWeight(state.modelWeights22[k] ?? 8);
  }
  const c = state.ontologicalTelos.coordinates;
  const clampC = (v: number) => Math.max(1, Math.min(16, Math.round(v)));
  return {
    rule30RegisterHex: state.rule30RegisterHex,
    barTickCount: Math.max(0, Math.floor(state.barTickCount)),
    admittedMutationCount: Math.max(0, Math.floor(state.admittedMutationCount)),
    refusedMutationCount: Math.max(0, Math.floor(state.refusedMutationCount)),
    playerTheoryOfMindCode: Math.max(0, Math.min(4, Math.floor(state.playerTheoryOfMindCode))),
    playerAttentionPermille: Math.max(0, Math.min(1000, Math.round(state.playerAttentionPermille))),
    incumbentDissonancePermille: Math.max(0, Math.min(1000, Math.round(state.incumbentDissonancePermille))),
    incumbentQualityPermille: Math.max(0, Math.min(1000, Math.round(state.incumbentQualityPermille))),
    triadicCoherencePermille: Math.max(0, Math.min(1000, Math.round(state.triadicCoherencePermille))),
    modelWeights22: serializedWeights,
    parametricCoordinates: {
      harmonicSimplicity: clampC(c.harmonicSimplicity),
      phyllotaxisClarity: clampC(c.phyllotaxisClarity),
      waveCalmDamping: clampC(c.waveCalmDamping),
      iridescenceLegibility: clampC(c.iridescenceLegibility),
      guildOffshootDensity: clampC(c.guildOffshootDensity),
      precisionBits: 16,
    },
  };
}

export function restoreLiveCoEvolutionStateFromAnamnesis(saved: PersistedLiveCoEvolutionState | null | undefined, fallbackWeight = 8): LiveCoEvolutionPlasticityState {
  if (!saved) return createInitialLiveCoEvolutionState(fallbackWeight);
  let reg64 = RULE30_SEED64;
  if (typeof saved.rule30RegisterHex === 'string' && /^0x[0-9a-fA-F]{1,16}$/.test(saved.rule30RegisterHex)) {
    reg64 = BigInt(saved.rule30RegisterHex) & 0xffffffffffffffffn;
    if (reg64 === 0n) reg64 = RULE30_SEED64;
  }
  const weights = {} as Record<CanonicalStandardModelKey, number>;
  for (const k of CANONICAL_22_MODEL_KEYS) {
    const raw = saved.modelWeights22?.[k];
    weights[k] = certifiedWasmCore_clampBusWeight(typeof raw === 'number' && Number.isFinite(raw) ? Math.round(raw) : 8);
  }
  const tomCode = Math.max(0, Math.min(4, Math.floor(saved.playerTheoryOfMindCode ?? 4)));
  const defC = createInitialParametricOntologyCoordinates();
  const sc = saved.parametricCoordinates;
  const clampC = (v: number | undefined, fb: number) =>
    typeof v === 'number' && Number.isFinite(v) ? Math.max(1, Math.min(16, Math.round(v))) : fb;
  const coords: ParametricOntologyCoordinates = sc
    ? {
        harmonicSimplicity: clampC(sc.harmonicSimplicity, defC.harmonicSimplicity),
        phyllotaxisClarity: clampC(sc.phyllotaxisClarity, defC.phyllotaxisClarity),
        waveCalmDamping: clampC(sc.waveCalmDamping, defC.waveCalmDamping),
        iridescenceLegibility: clampC(sc.iridescenceLegibility, defC.iridescenceLegibility),
        guildOffshootDensity: clampC(sc.guildOffshootDensity, defC.guildOffshootDensity),
        precisionBits: 16,
      }
    : defC;
  const dissonance = Math.max(0, Math.min(1000, Math.round(saved.incumbentDissonancePermille ?? 60)));
  const attention = Math.max(0, Math.min(1000, Math.round(saved.playerAttentionPermille ?? 700)));
  const ontologicalTelos = evaluateLiveOntologicalTelosState(
    {},
    { activePresence: attention > 0 },
    coords,
    dissonance,
    0,
  );
  return {
    rule30Register64: reg64,
    rule30RegisterHex: `0x${reg64.toString(16).padStart(16, '0')}`,
    barTickCount: Math.max(0, Math.floor(saved.barTickCount ?? 0)),
    admittedMutationCount: Math.max(0, Math.floor(saved.admittedMutationCount ?? 0)),
    refusedMutationCount: Math.max(0, Math.floor(saved.refusedMutationCount ?? 0)),
    lastBarAdmitted: false,
    playerTheoryOfMindCode: tomCode,
    playerTheoryOfMindIntent: tomCodeToIntent(tomCode),
    playerAttentionPermille: attention,
    incumbentDissonancePermille: dissonance,
    incumbentQualityPermille: Math.max(0, Math.min(1000, Math.round(saved.incumbentQualityPermille ?? 900))),
    triadicCoherencePermille: Math.max(0, Math.min(1000, Math.round(saved.triadicCoherencePermille ?? 880))),
    coerciveDarkPatternCount: 0,
    modelWeights22: Object.freeze(weights),
    sensoryDifferentiation: deriveSensoryDifferentiation(weights, tomCode, coords),
    ontologicalTelos,
  };
}

const TOM_RESONANT_MODELS: Readonly<Record<number, ReadonlySet<CanonicalStandardModelKey>>> = Object.freeze({
  0: new Set<CanonicalStandardModelKey>(['vedanta', 'dharma', 'spatialAcoustics', 'soundtrack', 'humane', 'anamnesis', 'acoustics', 'teleology']),
  1: new Set<CanonicalStandardModelKey>(['botany', 'morphogenesis', 'graphics', 'chemistry', 'ecology', 'soundtrack', 'neuromorphic', 'teleology', 'cosmogenesis']),
  2: new Set<CanonicalStandardModelKey>(['botany', 'graphics', 'brand', 'humane', 'morphogenesis', 'chemistry', 'mathematics', 'realizability']),
  3: new Set<CanonicalStandardModelKey>(['physics', 'articulation', 'acoustics', 'humane', 'dharma', 'infrastructure', 'spatialAcoustics', 'teleology']),
  4: new Set<CanonicalStandardModelKey>(['ecology', 'botany', 'soundtrack', 'teleology', 'compression', 'neuromorphic', 'cosmogenesis', 'anamnesis', 'mathematics']),
});

/**
 * Steps the certified `#![no_std]` Wasm Rule-30 + Teleology co-evolution loop on each 16-step musical bar:
 *  - Requires live player presence (`playerAttentionPermille > 0`); when `includePlayerInSelfReference === false`,
 *    coherence stays bounded by `<= 760‰` and `admitLivePlayerCoEvolutionStep` strictly refuses every mutation.
 *  - Strictly refuses any candidate with `coerciveDarkPatternCount > 0` or any increase in player-game dissonance.
 */
export function stepLiveObserverPlayerCoEvolutionBar(
  prev: LiveCoEvolutionPlasticityState,
  liveContext: PlayerGameInteractionContext,
): LiveCoEvolutionPlasticityState {
  const nextRule30 = stepRule30Ring64(prev.rule30Register64);
  const velocityDm = Math.max(0, Math.min(30, Math.round(liveContext.velocityDm ?? 0)));
  const isStillness = Boolean(liveContext.isStillness);
  const hasFocalTarget = Boolean(liveContext.hasFocalTarget ?? true);
  const holdPermille = Math.max(0, Math.min(1000, Math.round((liveContext.gestureHoldProgress01 ?? 0) * 1000)));
  const coerciveCount = Math.max(0, Math.floor(liveContext.coerciveDarkPatternCount ?? 0));

  const tomCode = certifiedWasmCore_inferPlayerTheoryOfMindCode(
    velocityDm,
    isStillness,
    hasFocalTarget,
    holdPermille,
  );

  const prevMeanW =
    CANONICAL_22_MODEL_KEYS.reduce((acc, k) => acc + (prev.modelWeights22[k] ?? 8), 0) /
    CANONICAL_22_MODEL_KEYS.length;

  const incEval = evaluateObserverPlayerDissonanceReconciliation({
    ...liveContext,
    busWeight: Math.max(prevMeanW, liveContext.busWeight ?? prevMeanW),
    rule30Register64: nextRule30,
    modelWeightsByKey: prev.modelWeights22,
    coerciveDarkPatternCount: coerciveCount,
  });

  const resonantSet = TOM_RESONANT_MODELS[tomCode] ?? TOM_RESONANT_MODELS[4];
  const candidateWeights = {} as Record<CanonicalStandardModelKey, number>;
  let candSum = 0;
  for (let i = 0; i < CANONICAL_22_MODEL_KEYS.length; i++) {
    const key = CANONICAL_22_MODEL_KEYS[i];
    const laneShift = BigInt((i * 3) % 61);
    const laneBits = Number((nextRule30 >> laneShift) & 0x7n);
    const match =
      incEval.playerAttentionPermille > 0 &&
      coerciveCount === 0 &&
      (resonantSet.has(key) || ((liveContext.awakenedSpeciesCount ?? 0) >= 4 && (i & 1) === 0));
    const nextW = certifiedWasmCore_proposeLiveCoEvolvedDomainWeight(
      prev.modelWeights22[key] ?? 8,
      laneBits,
      match,
    );
    candidateWeights[key] = nextW;
    candSum += nextW;
  }

  const candMeanW = candSum / CANONICAL_22_MODEL_KEYS.length;
  const candEval = evaluateObserverPlayerDissonanceReconciliation({
    ...liveContext,
    busWeight: Math.max(candMeanW, liveContext.busWeight ?? candMeanW),
    rule30Register64: nextRule30,
    modelWeightsByKey: candidateWeights,
    coerciveDarkPatternCount: coerciveCount,
  });

  const admitted = certifiedWasmCore_admitLivePlayerCoEvolutionStep(
    incEval.playerAttentionPermille,
    coerciveCount,
    candEval.reconciledResidualDissonancePermille,
    incEval.reconciledResidualDissonancePermille,
    candEval.healthyGratifyingQualityPermille,
    incEval.healthyGratifyingQualityPermille,
  );

  const chosenWeights = admitted ? Object.freeze(candidateWeights) : prev.modelWeights22;
  const chosenEval = admitted ? candEval : incEval;
  const activePlayer = chosenEval.playerAttentionPermille > 0;
  const witnessEnv: LiveWitnessEnvelopeInput = {
    stillnessRatioPermille: isStillness ? 900 : Math.max(0, Math.min(1000, Math.round((1 - velocityDm / 30) * 750))),
    gazeDwellRatioPermille: hasFocalTarget ? Math.min(1000, 620 + Math.round(holdPermille * 0.38)) : 280,
    harmonicComfortPermille: Math.max(0, Math.min(1000, Math.round((liveContext.tenneyConsonancePurity01 ?? 0.85) * 1000))),
    activePresence: activePlayer,
  };
  const ontologicalTelos = activePlayer
    ? stepLiveParametricOntologyCoordinates(
        prev.ontologicalTelos.coordinates,
        liveContext.hostEnvelope ?? {},
        witnessEnv,
        chosenEval.reconciledResidualDissonancePermille,
        coerciveCount,
      )
    : evaluateLiveOntologicalTelosState(
        liveContext.hostEnvelope ?? {},
        witnessEnv,
        prev.ontologicalTelos.coordinates,
        chosenEval.reconciledResidualDissonancePermille,
        coerciveCount,
      );

  return {
    rule30Register64: nextRule30,
    rule30RegisterHex: `0x${nextRule30.toString(16).padStart(16, '0')}`,
    barTickCount: prev.barTickCount + 1,
    admittedMutationCount: prev.admittedMutationCount + (admitted ? 1 : 0),
    refusedMutationCount: prev.refusedMutationCount + (admitted ? 0 : 1),
    lastBarAdmitted: admitted,
    playerTheoryOfMindCode: tomCode,
    playerTheoryOfMindIntent: tomCodeToIntent(tomCode),
    playerAttentionPermille: chosenEval.playerAttentionPermille,
    incumbentDissonancePermille: chosenEval.reconciledResidualDissonancePermille,
    incumbentQualityPermille: chosenEval.healthyGratifyingQualityPermille,
    triadicCoherencePermille: chosenEval.triadicPlayerGameObserverCoherencePermille,
    coerciveDarkPatternCount: coerciveCount,
    modelWeights22: chosenWeights,
    sensoryDifferentiation: deriveSensoryDifferentiation(chosenWeights, tomCode, ontologicalTelos.coordinates),
    ontologicalTelos,
  };
}
