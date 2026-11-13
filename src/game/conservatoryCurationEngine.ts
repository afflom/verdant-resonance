/**
 * Autonomous UORC-Style Conservatory Parametric Curation Engine
 * (`src/game/conservatoryCurationEngine.ts`)
 *
 * Implements `uorc/conservatory-curation/1` from `Foundation.Neuromorphic.V1.Model`
 * (Model #10, Basis Prime `109`) coupled with `Foundation.Compression.V1.Model` (Model #22, Prime `179`),
 * `Foundation.Soundtrack.V1.Model`, `Foundation.Vedanta.V1.Model`, and `Foundation.Dharma.V1.Model`:
 *
 *  1. Content-Addressed κ Curation Space (`SHA-256`):
 *     Every live garden curation state (`ConservatoryCurationPoint`) and every consolidated
 *     garden memory (`ConsolidatedGardenMemory`) is named by its cryptographic `SHA-256` digest `κ`.
 *  2. Real-Time Physical, Botanical & Musical Evaluation (`defect === 0` Hard Gate):
 *     Evaluates monument/ground/PBR/Bark physical lawfulness, Kuramoto/Murray/FvCB/Guild
 *     botanical vitality, and Euler/Tenney/parsimonious cantabile musical love in real time.
 *     Any candidate with `defect > 0` (`floatingGapCount > 0`, `staticOverlapCount > 0`,
 *     `ahimsaViolationCount > 0`, `restStepCount < 6`, or `maxMelodicLeap > 2`) is constructively refused.
 *  3. 64-Cell Rule-30 Hypothesis Generation & Strict Multi-Objective Dominance:
 *     Generates candidate curations from the exact 64-bit `stepRule30Ring64` register, memoizes
 *     evaluated claims by `κ`, enforces strict Pareto dominance (`conservatoryCurationDominates`)
 *     with provable monotonic Lyapunov descent (`4*phys + 3*bot + 3*mus`), and pins a non-regressing
 *     baseline floor.
 *  4. Consolidated κ-Memories & Shared Resonance:
 *     Consolidates warm `κ`-addressed memories as the garden matures (Symbiotic Guilds, Biome Sanctuaries,
 *     Witness Communion, Turīya Stillness, Mycelial Choir), persists them losslessly inside `UORC\x01`
 *     Anamnesis archives, and shares their pure Just-Intonation resonance back with the player.
 */

import { GENERATED_PRISM_STANDARDS } from './generatedPrismConstants';
import {
  certifiedWasmCore_conservatoryCurationDefect,
  certifiedWasmCore_conservatoryCurationDominates,
  certifiedWasmCore_conservatoryCurationLyapunovCost,
} from './generatedCertifiedWasmBridge';
import {
  RULE30_SEED64,
  excessOverThreshold as computeExcessOver,
  lackUnderThreshold as computeLackUnder,
  sha256Hex,
  stepRule30Ring64,
  type ClaimHonestyLevel as HonestyStanding,
} from './parametricCompressionEngine';

export type CurationBiomeId = 'meadow' | 'grove' | 'crystal' | 'wetland' | 'sanctuary';

export type SymbioticGuildId = 'dewdrop-bell' | 'polyrhythmic-canopy' | 'celestial-overtone';

export type CantabileHyperbarPhraseMode =
  | 'pastoral-antecedent'
  | 'guild-antiphony'
  | 'golden-overtone-ascent'
  | 'turiya-tonic-resolution';

export type CurationGeneratorKind =
  | 'refine-physical-equilibrium'
  | 'entrain-botanical-guilds'
  | 'purify-cantabile-voicing'
  | 'share-warm-memory-harmony';

export type ConsolidatedMemoryKind =
  | 'symbiotic-guild'
  | 'biome-resonance'
  | 'witness-communion'
  | 'turiya-stillness'
  | 'mycelial-elder-choir';

export interface AuthoritativeStandardProvenance {
  readonly standardId: string;
  readonly organization: string;
  readonly specificationTitle: string;
  readonly pinnedReference: string;
  readonly governedDomain: 'physics-chemistry-graphics' | 'botany-ecology' | 'acoustics-music' | 'cognition-compression-ethics';
  readonly runtimeInvariantSummary: string;
}

/**
 * Authoritative external standards registry anchoring the conservatory's physical,
 * chemical, botanical, psychoacoustic, musical, Vedāntic/Dharmic, and UORC cognition models.
 */
export const AUTHORITATIVE_CONSERVATORY_STANDARDS_REGISTRY: readonly AuthoritativeStandardProvenance[] =
  Object.freeze([
    {
      standardId: 'UORC-ENGINE-V1',
      organization: 'UOR Foundation',
      specificationTitle: 'UOR Parametric Compression, NCM Micro-Plasticity & Autonomous Engine',
      pinnedReference: 'github.com/UOR-Foundation/compression@b29ae741630af4d90f53375e128c1a48fbd831c5',
      governedDomain: 'cognition-compression-ethics',
      runtimeInvariantSummary:
        'SHA-256 κ content addressing, defect === 0 admission, strict dominance, 64-cell Rule-30 generator, non-regressing floor',
    },
    {
      standardId: 'BIPM-SI-2019',
      organization: 'BIPM',
      specificationTitle: 'The International System of Units (SI), 9th Edition',
      pinnedReference: 'BIPM SI Brochure 9th Ed. (2019)',
      governedDomain: 'physics-chemistry-graphics',
      runtimeInvariantSummary:
        'Exact defining constants (h, e, k_B, N_A, c, Δν_Cs, K_cd) & 7-exponent dimensional port matching',
    },
    {
      standardId: 'IUPAC-GOLD-BOOK',
      organization: 'IUPAC',
      specificationTitle: 'Compendium of Chemical Terminology & Monoterpene Volatility',
      pinnedReference: 'IUPAC Gold Book (2019) / Clausius-Clapeyron Vapor Pressure',
      governedDomain: 'physics-chemistry-graphics',
      runtimeInvariantSummary:
        'Balanced photosynthesis stoichiometry (6 CO2 + 6 H2O -> C6H12O6 + 6 O2) & terpene Tyndall scattering',
    },
    {
      standardId: 'IUCR-ITA-BRAVAIS',
      organization: 'International Union of Crystallography (IUCr)',
      specificationTitle: 'International Tables for Crystallography, Volume A: Space-Group Symmetry',
      pinnedReference: 'IUCr ITA 6th Ed. (14 Bravais Lattices, 7 Crystal Systems)',
      governedDomain: 'physics-chemistry-graphics',
      runtimeInvariantSummary:
        'Exact point-group crystal habits (hP-quartz, hR-calcite, cP-pyrite, cI-garnet) with 0m weld gaps',
    },
    {
      standardId: 'CIE-015-2018-PROSPECT',
      organization: 'Commission Internationale de l’Éclairage (CIE)',
      specificationTitle: 'CIE 1931 2° Colorimetry + Jacquemoud & Baret PROSPECT Leaf Optics',
      pinnedReference: 'CIE 015:2018 / Jacquemoud & Baret (1990) Remote Sens. Environ. 34',
      governedDomain: 'physics-chemistry-graphics',
      runtimeInvariantSummary:
        '16-band visible spectrum (380..780nm), Airy thin-film petal iridescence, energy-conserving PBR (diffuse + specular <= 1)',
    },
    {
      standardId: 'MURRAY-1926-LSYSTEM',
      organization: 'PNAS / J. Theor. Biol.',
      specificationTitle: 'Murray’s Physiological Principle of Minimum Work + Lindenmayer D0L Morphogenesis',
      pinnedReference: 'Murray (1926) PNAS 12(3):207-214 / Lindenmayer (1968) JTB 18:280-315',
      governedDomain: 'botany-ecology',
      runtimeInvariantSummary:
        'Exact r_parent^3 = sum(r_child^3) xylem pipe conservation & Fibonacci phyllotaxis across all 5 flora species',
    },
    {
      standardId: 'FVCB-1980-KURAMOTO-1975',
      organization: 'Planta / Springer Lecture Notes in Physics',
      specificationTitle: 'Farquhar-von Caemmerer-Berry C3 Photosynthesis + Kuramoto Coupled Oscillators',
      pinnedReference: 'Farquhar et al. (1980) Planta 149:78-90 / Kuramoto (1975) LNP 39:420-422',
      governedDomain: 'botany-ecology',
      runtimeInvariantSummary:
        'RuBisCO/RuBP assimilation kinetics & distance-weighted phase-locking dθ_i/dt = ω_i + (K/N)Σ w_ij sin(θ_j - θ_i)',
    },
    {
      standardId: 'ISO-226-2023-ZWICKER',
      organization: 'ISO / Zwicker Psychoacoustics',
      specificationTitle: 'Acoustics — Normal Equal-Loudness-Level Contours & 24-Bark Masking',
      pinnedReference: 'ISO 226:2023 / Zwicker (1961) JASA 33(2):248',
      governedDomain: 'acoustics-music',
      runtimeInvariantSummary:
        'Equal-loudness contour compensation & >= 3.35 dB simultaneous critical-band masking headroom',
    },
    {
      standardId: 'ISO-3382-1-WOODWORTH',
      organization: 'ISO / Woodworth Binaural Acoustics',
      specificationTitle: 'Measurement of Room Acoustic Parameters + Spherical-Head Diffraction ITD/ILD',
      pinnedReference: 'ISO 3382-1:2009 / Woodworth (1938) Experimental Psychology',
      governedDomain: 'acoustics-music',
      runtimeInvariantSummary:
        '5 distinct biome Sabine/Eyring RT60 envelopes & 3D Woodworth ITD = (a/c)(θ + sin θ) + pinna elevation notch',
    },
    {
      standardId: 'EULER-1739-TENNEY-1984',
      organization: 'Euler / Tenney Harmonic Theory',
      specificationTitle: 'Tentamen Novae Theoriae Musicae (Gradus Suavitatis) + Harmonic Space Distance',
      pinnedReference: 'Euler (1739) Cap. IV / Tenney (1984) John Cage @ 70',
      governedDomain: 'acoustics-music',
      runtimeInvariantSummary:
        'Pure 0.0¢ 5/7/11-limit Just Intonation, stepwise voice-leading <= 2 steps, and >= 6 breathing rests/bar',
    },
    {
      standardId: 'W3C-OKLCH-WCAG22-ISO9241',
      organization: 'W3C / ISO',
      specificationTitle: 'CSS Color Module Level 4 (OKLCH), WCAG 2.2 AAA & ISO 9241-110 Calm Ergonomics',
      pinnedReference: 'W3C TR css-color-4 / W3C WCAG 2.2 / ISO 9241-110:2020',
      governedDomain: 'cognition-compression-ethics',
      runtimeInvariantSummary:
        'Perceptually uniform OKLCH UI tokens, AAA luminance contrast, and serene HUD with 0 debug/manual clutter',
    },
    {
      standardId: 'VEDANTA-MANDUKYA-DHARMA',
      organization: 'Advaita Vedānta & Dharmic Śāstra',
      specificationTitle: 'Māṇḍūkya Upaniṣad Catuṣpāt, Pañcīkaraṇa, Ahiṃsā & Lokasaṅgraha',
      pinnedReference: 'Māṇḍūkya Upaniṣad 1-12 / Yogasūtra II.30 / Bhagavad-Gītā III.20',
      governedDomain: 'cognition-compression-ethics',
      runtimeInvariantSummary:
        'Non-dual Observer-Garden-Player unity, 5x5 bistochastic Pañcīkaraṇa elements, and 0-punishment Ahiṃsā',
    },
  ]);

export interface CuratedPhysicalProfile {
  readonly windHarmonyGainPermille: number; // 850..1250
  readonly cymaticMeniscusGainPermille: number; // 850..1350
  readonly thinFilmIridescencePermille: number; // 850..1300
  readonly acousticHeadroomTargetDbTenths: number; // 34..68 (3.4 dB .. 6.8 dB)
}

export interface CuratedBotanicalProfile {
  readonly kuramotoCouplingGainPermille: number; // 850..1450
  readonly mycorrhizalGuildArcPermille: number; // 800..1400
  readonly corollaBloomGracePermille: number; // 900..1300
  readonly vascularTurgorPermille: number; // 900..1250
}

export interface CuratedMusicalProfile {
  readonly phraseHyperbarMode: CantabileHyperbarPhraseMode;
  readonly consonanceGravityPermille: number; // 800..1400
  readonly canonCounterpointPermille: number; // 750..1350
  readonly spatialAntiphonyPermille: number; // 850..1350
  readonly breathReleasePermille: number; // 900..1350
}

export interface ConservatoryCurationPoint {
  readonly pointKappa: string;
  readonly physicalProfile: CuratedPhysicalProfile;
  readonly botanicalProfile: CuratedBotanicalProfile;
  readonly musicalProfile: CuratedMusicalProfile;
  readonly warmMemoryRootKappa: string;
}

export interface ConsolidatedGardenMemory {
  readonly memoryId: string;
  readonly memoryKappa: string;
  readonly kind: ConsolidatedMemoryKind;
  readonly title: string;
  readonly biome: CurationBiomeId;
  readonly signatureRatios: readonly [number, number, number];
  readonly consolidatedAtTick: number;
  readonly lyapunovCostAtConsolidation: number;
}

export interface ConservatoryCurationEvaluation {
  readonly pointKappa: string;
  readonly defect: number;
  readonly admissible: boolean;
  readonly physicalSurprisalPermille: number;
  readonly botanicalDeficitPermille: number;
  readonly musicalTensionPermille: number;
  readonly lyapunovCost: number;
  readonly excessOverDefectZero: number;
  readonly lackUnderPinnedFloor: number;
}

export interface MintedCurationClaim {
  readonly claimKappa: string;
  readonly pointKappa: string;
  readonly generatorKind: CurationGeneratorKind;
  readonly evaluation: ConservatoryCurationEvaluation;
  readonly standing: HonestyStanding;
  readonly tickIndex: number;
}

export interface LiveGardenCurationTelemetry {
  readonly tickIndex: number;
  readonly barIndex?: number;
  readonly biome: CurationBiomeId;
  readonly harmonyPct: number;
  readonly kuramotoOrderR: number; // 0..1
  readonly awakenedPlantCount: number;
  readonly fruitingPlantCount: number;
  readonly elderPlantCount: number;
  readonly totalPlantCount: number;
  readonly activeGuildIds: readonly SymbioticGuildId[];
  readonly exploredBiomes: readonly CurationBiomeId[];
  readonly barkHeadroomDb: number;
  readonly restStepCount: number;
  readonly maxMelodicStepLeap: number;
  readonly meanEulerGradus: number;
  readonly floatingGapCount?: number;
  readonly staticOverlapCount?: number;
  readonly ahimsaViolationCount?: number;
  readonly witnessCommunion01?: number;
  readonly isStillness?: boolean;
}

export interface ConservatoryCurationState {
  readonly profile: string;
  readonly verified: boolean;
  readonly rule30Register64: string; // Decimal representation of 64-bit register for lossless JSON/state serialization
  readonly curationTickCount: number;
  readonly activePhraseBarIndex: number;
  readonly activePhraseMode: CantabileHyperbarPhraseMode;
  readonly baselineFloorPoint: ConservatoryCurationPoint;
  readonly baselineFloorLyapunovCost: number;
  readonly incumbentPoint: ConservatoryCurationPoint;
  readonly incumbentEvaluation: ConservatoryCurationEvaluation;
  readonly consolidatedMemories: readonly ConsolidatedGardenMemory[];
  readonly latestConsolidatedMemory: ConsolidatedGardenMemory | null;
  readonly knownClaimKappas: readonly string[];
  readonly recentMintedClaims: readonly MintedCurationClaim[];
  readonly provenanceStandardCount: number;
  readonly curationCoherencePermille: number;
}

const HYPERBAR_MODES: readonly CantabileHyperbarPhraseMode[] = Object.freeze([
  'pastoral-antecedent',
  'guild-antiphony',
  'golden-overtone-ascent',
  'turiya-tonic-resolution',
]);

const GENERATOR_KINDS: readonly CurationGeneratorKind[] = Object.freeze([
  'refine-physical-equilibrium',
  'entrain-botanical-guilds',
  'purify-cantabile-voicing',
  'share-warm-memory-harmony',
]);

const EMPTY_MEMORY_ROOT_KAPPA = sha256Hex('UORC-CONSERVATORY-MEMORIES-EMPTY-v1');

function clampInt(value: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, Math.round(value)));
}

/**
 * Computes the canonical `SHA-256` root `κ` over an ordered list of consolidated garden memories.
 */
export function computeConsolidatedMemoryRootKappa(
  memories: readonly ConsolidatedGardenMemory[],
): string {
  const slotCap = GENERATED_PRISM_STANDARDS.autonomousConservatoryCuration.consolidatedMemorySlotCap;
  if (memories.length === 0 || slotCap <= 0) return EMPTY_MEMORY_ROOT_KAPPA;
  const canonical = memories
    .slice()
    .sort((a, b) => a.memoryId.localeCompare(b.memoryId))
    .map((m) => `${m.memoryId}:${m.memoryKappa}`)
    .join('|');
  return sha256Hex(`UORC-CONSERVATORY-MEMORY-ROOT-v1:${canonical}`);
}

/**
 * Constructs a `κ`-addressed `ConservatoryCurationPoint` whose `pointKappa` is the exact
 * `SHA-256` digest of its physical, botanical, musical, and warm-memory parameters.
 */
export function createConservatoryCurationPoint(params: {
  readonly physicalProfile: CuratedPhysicalProfile;
  readonly botanicalProfile: CuratedBotanicalProfile;
  readonly musicalProfile: CuratedMusicalProfile;
  readonly warmMemoryRootKappa?: string;
}): ConservatoryCurationPoint {
  const minHeadroomTenths = Math.max(34, GENERATED_PRISM_STANDARDS.psychoacousticIso226.zwickerBarkCriticalBandCount + 10);
  const physicalProfile: CuratedPhysicalProfile = {
    windHarmonyGainPermille: clampInt(params.physicalProfile.windHarmonyGainPermille, 850, 1250),
    cymaticMeniscusGainPermille: clampInt(params.physicalProfile.cymaticMeniscusGainPermille, 850, 1350),
    thinFilmIridescencePermille: clampInt(params.physicalProfile.thinFilmIridescencePermille, 850, 1300),
    acousticHeadroomTargetDbTenths: clampInt(params.physicalProfile.acousticHeadroomTargetDbTenths, minHeadroomTenths, 68),
  };
  const botanicalProfile: CuratedBotanicalProfile = {
    kuramotoCouplingGainPermille: clampInt(params.botanicalProfile.kuramotoCouplingGainPermille, 850, 1450),
    mycorrhizalGuildArcPermille: clampInt(params.botanicalProfile.mycorrhizalGuildArcPermille, 800, 1400),
    corollaBloomGracePermille: clampInt(params.botanicalProfile.corollaBloomGracePermille, 900, 1300),
    vascularTurgorPermille: clampInt(params.botanicalProfile.vascularTurgorPermille, 900, 1250),
  };
  const musicalProfile: CuratedMusicalProfile = {
    phraseHyperbarMode: params.musicalProfile.phraseHyperbarMode,
    consonanceGravityPermille: clampInt(params.musicalProfile.consonanceGravityPermille, 800, 1400),
    canonCounterpointPermille: clampInt(params.musicalProfile.canonCounterpointPermille, 750, 1350),
    spatialAntiphonyPermille: clampInt(params.musicalProfile.spatialAntiphonyPermille, 850, 1350),
    breathReleasePermille: clampInt(params.musicalProfile.breathReleasePermille, 900, 1350),
  };
  const warmMemoryRootKappa = params.warmMemoryRootKappa ?? EMPTY_MEMORY_ROOT_KAPPA;
  const canonical =
    `UORC-CONSERVATORY-POINT-v1|` +
    `phys:${physicalProfile.windHarmonyGainPermille},${physicalProfile.cymaticMeniscusGainPermille},${physicalProfile.thinFilmIridescencePermille},${physicalProfile.acousticHeadroomTargetDbTenths}|` +
    `bot:${botanicalProfile.kuramotoCouplingGainPermille},${botanicalProfile.mycorrhizalGuildArcPermille},${botanicalProfile.corollaBloomGracePermille},${botanicalProfile.vascularTurgorPermille}|` +
    `mus:${musicalProfile.phraseHyperbarMode},${musicalProfile.consonanceGravityPermille},${musicalProfile.canonCounterpointPermille},${musicalProfile.spatialAntiphonyPermille},${musicalProfile.breathReleasePermille}|` +
    `mem:${warmMemoryRootKappa}`;

  return { pointKappa: sha256Hex(canonical), physicalProfile, botanicalProfile, musicalProfile, warmMemoryRootKappa };
}

/**
 * Exact runtime mirror of `Foundation.Neuromorphic.V1.Model::conservatoryCurationDefect`:
 * Returns `0` iff all physical grounding, static collision, Dharmic Ahiṃsā, breathing rest (`>= 6`),
 * and stepwise melodic parsimony (`<= 2`) laws hold simultaneously.
 */
export function computeConservatoryCurationDefect(params: {
  readonly floatingGapCount: number;
  readonly staticOverlapCount: number;
  readonly ahimsaViolationCount: number;
  readonly restStepCount: number;
  readonly maxMelodicLeap: number;
}): number {
  const { floatingGapCount: f, staticOverlapCount: o, ahimsaViolationCount: a, restStepCount: r, maxMelodicLeap: m } = params;
  return certifiedWasmCore_conservatoryCurationDefect(Math.floor(f), Math.floor(o), Math.floor(a), Math.floor(r), Math.floor(m));
}

/** Exact runtime mirror of `Foundation.Neuromorphic.V1.Model::conservatoryCurationLyapunovCost`. */
export function computeConservatoryCurationLyapunovCost(
  physicalSurprisalPermille: number,
  botanicalDeficitPermille: number,
  musicalTensionPermille: number,
): number {
  return certifiedWasmCore_conservatoryCurationLyapunovCost(
    Math.round(physicalSurprisalPermille),
    Math.round(botanicalDeficitPermille),
    Math.round(musicalTensionPermille),
  );
}

/** Exact runtime mirror of `Foundation.Neuromorphic.V1.Model::conservatoryCurationDominates`. */
export function conservatoryCurationDominates(
  cand: ConservatoryCurationEvaluation,
  inc: ConservatoryCurationEvaluation,
): boolean {
  return certifiedWasmCore_conservatoryCurationDominates(
    cand.defect,
    cand.physicalSurprisalPermille,
    cand.botanicalDeficitPermille,
    cand.musicalTensionPermille,
    inc.defect,
    inc.physicalSurprisalPermille,
    inc.botanicalDeficitPermille,
    inc.musicalTensionPermille,
  );
}

/**
 * Evaluates a candidate `ConservatoryCurationPoint` against live physical, botanical, and musical
 * garden telemetry, producing constructive defect and 3-axis Lyapunov cost metrics.
 */
export function evaluateGardenCurationCandidate(
  point: ConservatoryCurationPoint,
  telemetry: LiveGardenCurationTelemetry,
  consolidatedMemoryCount = 0,
  baselineFloorLyapunovCost = 6200,
): ConservatoryCurationEvaluation {
  const defect = certifiedWasmCore_conservatoryCurationDefect(
    Math.floor(telemetry.floatingGapCount ?? 0),
    Math.floor(telemetry.staticOverlapCount ?? 0),
    Math.floor(telemetry.ahimsaViolationCount ?? 0),
    Math.floor(telemetry.restStepCount),
    Math.floor(telemetry.maxMelodicStepLeap),
  );

  // 1. Physical Surprisal (0..1000 permille):
  // Measures psychoacoustic 24-Bark headroom margin, wind-monument equilibrium, and thin-film spectral match.
  const targetBarkDb = point.physicalProfile.acousticHeadroomTargetDbTenths / 10;
  const barkShortfallDb = Math.max(0, targetBarkDb - Math.max(3.35, telemetry.barkHeadroomDb));
  const targetWindGain = 960 + Math.round((telemetry.harmonyPct / 100) * 200);
  const windMismatch = Math.abs(point.physicalProfile.windHarmonyGainPermille - targetWindGain);
  const targetCymaticGain =
    950 +
    Math.round((telemetry.harmonyPct / 100) * 260) +
    (telemetry.biome === 'wetland' || telemetry.biome === 'crystal' ? 70 : 0);
  const cymaticMismatch = Math.abs(
    point.physicalProfile.cymaticMeniscusGainPermille - targetCymaticGain,
  );
  const targetIridescence = 960 + Math.round((telemetry.harmonyPct / 100) * 240);
  const iridescenceMismatch = Math.abs(
    point.physicalProfile.thinFilmIridescencePermille - targetIridescence,
  );

  const unawakenedPhysicalPotential = Math.round((1 - Math.max(0, Math.min(1, telemetry.harmonyPct / 100))) * 120);
  const physicalSurprisalPermille = clampInt(
    110 +
      unawakenedPhysicalPotential +
      barkShortfallDb * 38 +
      windMismatch * 0.34 +
      cymaticMismatch * 0.28 +
      iridescenceMismatch * 0.24 -
      Math.min(75, consolidatedMemoryCount * 8),
    20,
    1000,
  );

  // 2. Botanical Vitality Deficit (0..1000 permille):
  // Measures Kuramoto phase coherence R, Symbiotic Guild resonance, Murray vascular turgor, and biome breadth.
  const totalPlants = Math.max(1, telemetry.totalPlantCount);
  const awakenedRatio = Math.min(1, telemetry.awakenedPlantCount / totalPlants);
  const guildRatio = Math.min(1, telemetry.activeGuildIds.length / 3);
  const biomeRatio = Math.min(1, telemetry.exploredBiomes.length / 5);

  const idealKuramotoGain =
    980 + Math.round(awakenedRatio * 240 + guildRatio * 150 + telemetry.kuramotoOrderR * 60);
  const kuramotoMismatch = Math.abs(
    point.botanicalProfile.kuramotoCouplingGainPermille - idealKuramotoGain,
  );
  const idealGuildArcGain = 920 + Math.round(guildRatio * 340 + awakenedRatio * 100);
  const guildArcMismatch = Math.abs(
    point.botanicalProfile.mycorrhizalGuildArcPermille - idealGuildArcGain,
  );
  const idealCorollaGrace = 980 + Math.round(awakenedRatio * 220);
  const corollaMismatch = Math.abs(
    point.botanicalProfile.corollaBloomGracePermille - idealCorollaGrace,
  );

  const ecologicalUnawakenedPenalty = Math.round(
    (1 - awakenedRatio) * 190 +
      (1 - telemetry.kuramotoOrderR) * 140 +
      (1 - guildRatio) * 90 +
      (1 - biomeRatio) * 60,
  );

  const botanicalDeficitPermille = clampInt(
    75 +
      ecologicalUnawakenedPenalty * 0.55 +
      kuramotoMismatch * 0.32 +
      guildArcMismatch * 0.26 +
      corollaMismatch * 0.22 -
      Math.min(85, consolidatedMemoryCount * 9),
    20,
    1000,
  );

  // 3. Musical Tension (0..1000 permille):
  // Measures Euler gradus suavitatis, cantabile phrase-mode alignment, canon balance, and breathing release.
  const unity01 = Math.max(0, Math.min(1, telemetry.harmonyPct / 100));
  const idealConsonanceGravity =
    940 + Math.round(unity01 * 340 + (telemetry.isStillness ? 80 : 0));
  const consonanceMismatch = Math.abs(
    point.musicalProfile.consonanceGravityPermille - idealConsonanceGravity,
  );
  const idealCanonGain =
    860 +
    Math.round(
      guildRatio * 260 + Math.min(1, telemetry.elderPlantCount / 4) * 180,
    );
  const canonMismatch = Math.abs(
    point.musicalProfile.canonCounterpointPermille - idealCanonGain,
  );
  const idealAntiphonyGain = 960 + Math.round(biomeRatio * 220 + guildRatio * 120);
  const antiphonyMismatch = Math.abs(
    point.musicalProfile.spatialAntiphonyPermille - idealAntiphonyGain,
  );

  const eulerGradusPenalty = Math.max(0, (telemetry.meanEulerGradus - 1) * 22);
  const unawakenedMusicalSilenceDeficit = Math.round((1 - unity01) * 165);
  const musicalTensionPermille = clampInt(
    80 +
      unawakenedMusicalSilenceDeficit +
      eulerGradusPenalty * 0.5 +
      consonanceMismatch * 0.34 +
      canonMismatch * 0.28 +
      antiphonyMismatch * 0.24 -
      Math.min(90, consolidatedMemoryCount * 10),
    20,
    1000,
  );

  const lyapunovCost = computeConservatoryCurationLyapunovCost(
    physicalSurprisalPermille,
    botanicalDeficitPermille,
    musicalTensionPermille,
  );

  return {
    pointKappa: point.pointKappa,
    defect,
    admissible: defect === 0,
    physicalSurprisalPermille,
    botanicalDeficitPermille,
    musicalTensionPermille,
    lyapunovCost,
    excessOverDefectZero: computeExcessOver(0, defect),
    lackUnderPinnedFloor: computeLackUnder(baselineFloorLyapunovCost, lyapunovCost),
  };
}

/**
 * Creates a deterministic, content-addressed `ConsolidatedGardenMemory` (`κ` = `SHA-256`).
 */
export function mintConsolidatedGardenMemory(params: {
  readonly memoryId: string;
  readonly kind: ConsolidatedMemoryKind;
  readonly title: string;
  readonly biome: CurationBiomeId;
  readonly signatureRatios: readonly [number, number, number];
  readonly consolidatedAtTick: number;
  readonly lyapunovCostAtConsolidation: number;
}): ConsolidatedGardenMemory {
  const hashBits = GENERATED_PRISM_STANDARDS.autonomousConservatoryCuration.contentHashBits;
  const r0 = Number(params.signatureRatios[0].toFixed(6));
  const r1 = Number(params.signatureRatios[1].toFixed(6));
  const r2 = Number(params.signatureRatios[2].toFixed(6));
  const canonical = `UORC-GARDEN-MEMORY-v1|${params.memoryId}|${params.kind}|${params.biome}|${r0},${r1},${r2}`;
  return {
    memoryId: params.memoryId,
    memoryKappa: sha256Hex(canonical).slice(0, hashBits >>> 2),
    kind: params.kind,
    title: params.title,
    biome: params.biome,
    signatureRatios: [r0, r1, r2],
    consolidatedAtTick: Math.max(0, Math.floor(params.consolidatedAtTick)),
    lyapunovCostAtConsolidation: Math.max(0, Math.round(params.lyapunovCostAtConsolidation)),
  };
}

const GUILD_MEMORY_TEMPLATES: Readonly<
  Record<
    SymbioticGuildId,
    {
      readonly title: string;
      readonly biome: CurationBiomeId;
      readonly signatureRatios: readonly [number, number, number];
    }
  >
> = {
  'dewdrop-bell': {
    title: 'Dewdrop Bell Guild (Chime Lily × Echo Lotus)',
    biome: 'wetland',
    signatureRatios: [1.0, 1.25, 1.5], // Pure 4:5:6 Major Triad
  },
  'polyrhythmic-canopy': {
    title: 'Polyrhythmic Canopy Guild (Pulse Fern × Drone Moss)',
    biome: 'grove',
    signatureRatios: [1.0, 1.2, 1.5], // Pure 10:12:15 Minor/Dorian Triad
  },
  'celestial-overtone': {
    title: 'Celestial Overtone Guild (Star Orchid × Chime Lily)',
    biome: 'crystal',
    signatureRatios: [1.0, 7 / 6, 1.5], // Pure 6:7:9 Septimal Overtone Triad
  },
};

const BIOME_MEMORY_TEMPLATES: Readonly<
  Record<
    CurationBiomeId,
    {
      readonly title: string;
      readonly signatureRatios: readonly [number, number, number];
    }
  >
> = {
  meadow: {
    title: 'Sunlit Meadow Meridian Resonance',
    biome: 'meadow',
    signatureRatios: [1.0, 9 / 8, 1.5],
  } as unknown as { title: string; signatureRatios: readonly [number, number, number] },
  grove: {
    title: 'Bamboo Chime Pergola Wind Choir',
    signatureRatios: [1.0, 4 / 3, 1.5],
  },
  crystal: {
    title: 'Crystal Geode Torsion Harmonic Lock',
    signatureRatios: [1.0, 5 / 4, 15 / 8],
  },
  wetland: {
    title: 'Mirror Lagoon Cymatic Meniscus Ring',
    signatureRatios: [1.0, 6 / 5, 8 / 5],
  },
  sanctuary: {
    title: 'Sanctuary Rotunda Cardan Unity',
    signatureRatios: [1.0, 5 / 4, 2.0],
  },
};

/**
 * Discovers at most one newly matured `ConsolidatedGardenMemory` per curation step when genuine
 * ecological, contemplative, or symbiotic milestones are achieved in the live conservatory.
 */
function discoverNextConsolidatedMemory(
  existing: readonly ConsolidatedGardenMemory[],
  telemetry: LiveGardenCurationTelemetry,
  lyapunovCost: number,
): ConsolidatedGardenMemory | null {
  const cap = GENERATED_PRISM_STANDARDS.autonomousConservatoryCuration?.consolidatedMemorySlotCap ?? 16;
  if (existing.length >= cap) return null;
  const knownIds = new Set(existing.map((m) => m.memoryId));

  // 1. Symbiotic Guild consolidation (highest priority: companion flora attuned together)
  for (const guildId of telemetry.activeGuildIds) {
    const memoryId = `guild:${guildId}`;
    if (!knownIds.has(memoryId)) {
      const tpl = GUILD_MEMORY_TEMPLATES[guildId];
      return mintConsolidatedGardenMemory({
        memoryId,
        kind: 'symbiotic-guild',
        title: tpl.title,
        biome: tpl.biome,
        signatureRatios: tpl.signatureRatios,
        consolidatedAtTick: telemetry.tickIndex,
        lyapunovCostAtConsolidation: lyapunovCost,
      });
    }
  }

  // 2. Contemplative Turīya Stillness consolidation
  if (telemetry.isStillness && telemetry.awakenedPlantCount >= 1 && !knownIds.has('turiya:silent-stillness')) {
    return mintConsolidatedGardenMemory({
      memoryId: 'turiya:silent-stillness',
      kind: 'turiya-stillness',
      title: 'Māṇḍūkya Turīya Silent Witness Stillness',
      biome: telemetry.biome,
      signatureRatios: [1.0, 4 / 3, 1.5],
      consolidatedAtTick: telemetry.tickIndex,
      lyapunovCostAtConsolidation: lyapunovCost,
    });
  }

  // 3. Immanent Witness Communion consolidation
  if (
    (telemetry.witnessCommunion01 ?? 0) >= 0.72 &&
    telemetry.awakenedPlantCount >= 2 &&
    !knownIds.has('communion:immanent-witness')
  ) {
    return mintConsolidatedGardenMemory({
      memoryId: 'communion:immanent-witness',
      kind: 'witness-communion',
      title: 'Immanent Witness Reciprocal Communion',
      biome: telemetry.biome,
      signatureRatios: [1.0, 5 / 4, 3 / 2],
      consolidatedAtTick: telemetry.tickIndex,
      lyapunovCostAtConsolidation: lyapunovCost,
    });
  }

  // 4. Mycelial Elder Choir consolidation
  if (telemetry.elderPlantCount >= 3 && !knownIds.has('elder:mycelial-choir')) {
    return mintConsolidatedGardenMemory({
      memoryId: 'elder:mycelial-choir',
      kind: 'mycelial-elder-choir',
      title: 'Consolidated Mycelial Elder Canonic Choir',
      biome: telemetry.biome,
      signatureRatios: [1.0, 11 / 8, 3 / 2],
      consolidatedAtTick: telemetry.tickIndex,
      lyapunovCostAtConsolidation: lyapunovCost,
    });
  }

  // 5. Explored Biome Sanctuary Resonance consolidation (requires active harmony >= 35%)
  if (telemetry.harmonyPct >= 35 && telemetry.awakenedPlantCount >= 3) {
    for (const biomeId of telemetry.exploredBiomes) {
      const memoryId = `biome:${biomeId}`;
      if (!knownIds.has(memoryId)) {
        const tpl = BIOME_MEMORY_TEMPLATES[biomeId];
        return mintConsolidatedGardenMemory({
          memoryId,
          kind: 'biome-resonance',
          title: tpl.title,
          biome: biomeId,
          signatureRatios: tpl.signatureRatios,
          consolidatedAtTick: telemetry.tickIndex,
          lyapunovCostAtConsolidation: lyapunovCost,
        });
      }
    }
  }

  return null;
}

/**
 * Generates a deterministic candidate `ConservatoryCurationPoint` from the current incumbent,
 * a 64-bit Rule-30 hypothesis lane, and live garden telemetry.
 */
function proposeCandidateCurationPoint(params: {
  readonly incumbent: ConservatoryCurationPoint;
  readonly generatorKind: CurationGeneratorKind;
  readonly rule30LaneByte: number;
  readonly telemetry: LiveGardenCurationTelemetry;
  readonly warmMemoryRootKappa: string;
  readonly phraseMode: CantabileHyperbarPhraseMode;
}): ConservatoryCurationPoint {
  const { incumbent, generatorKind, rule30LaneByte, telemetry, warmMemoryRootKappa, phraseMode } =
    params;
  const jitterStep = ((rule30LaneByte & 0x07) - 3) * 8; // Small deterministic Rule-30 exploration step (-24..+32)
  const totalPlants = Math.max(1, telemetry.totalPlantCount);
  const awakenedRatio = Math.min(1, telemetry.awakenedPlantCount / totalPlants);
  const guildRatio = Math.min(1, telemetry.activeGuildIds.length / 3);
  const biomeRatio = Math.min(1, telemetry.exploredBiomes.length / 5);
  const unity01 = Math.max(0, Math.min(1, telemetry.harmonyPct / 100));

  let phys = incumbent.physicalProfile;
  let bot = incumbent.botanicalProfile;
  let mus: CuratedMusicalProfile = {
    ...incumbent.musicalProfile,
    phraseHyperbarMode: phraseMode,
  };

  if (generatorKind === 'refine-physical-equilibrium') {
    const targetWind = 960 + Math.round(unity01 * 200);
    const targetCymatic =
      950 +
      Math.round(unity01 * 260) +
      (telemetry.biome === 'wetland' || telemetry.biome === 'crystal' ? 70 : 0);
    const targetIrid = 960 + Math.round(unity01 * 240);
    phys = {
      windHarmonyGainPermille: Math.round(
        phys.windHarmonyGainPermille * 0.45 + targetWind * 0.55 + jitterStep * 0.25,
      ),
      cymaticMeniscusGainPermille: Math.round(
        phys.cymaticMeniscusGainPermille * 0.45 + targetCymatic * 0.55,
      ),
      thinFilmIridescencePermille: Math.round(
        phys.thinFilmIridescencePermille * 0.45 + targetIrid * 0.55,
      ),
      acousticHeadroomTargetDbTenths: clampInt(
        Math.min(Math.floor(Math.max(3.4, telemetry.barkHeadroomDb) * 10), 42 + Math.round(unity01 * 16)),
        34,
        68,
      ),
    };
  } else if (generatorKind === 'entrain-botanical-guilds') {
    const targetKuramoto =
      980 + Math.round(awakenedRatio * 240 + guildRatio * 150 + telemetry.kuramotoOrderR * 60);
    const targetGuildArc = 920 + Math.round(guildRatio * 340 + awakenedRatio * 100);
    const targetCorolla = 980 + Math.round(awakenedRatio * 220);
    bot = {
      kuramotoCouplingGainPermille: Math.round(
        bot.kuramotoCouplingGainPermille * 0.4 + targetKuramoto * 0.6 + jitterStep * 0.25,
      ),
      mycorrhizalGuildArcPermille: Math.round(
        bot.mycorrhizalGuildArcPermille * 0.4 + targetGuildArc * 0.6,
      ),
      corollaBloomGracePermille: Math.round(
        bot.corollaBloomGracePermille * 0.4 + targetCorolla * 0.6,
      ),
      vascularTurgorPermille: clampInt(960 + Math.round(awakenedRatio * 220), 900, 1250),
    };
  } else if (generatorKind === 'purify-cantabile-voicing') {
    const targetConsonance = 940 + Math.round(unity01 * 340 + (telemetry.isStillness ? 80 : 0));
    const targetCanon =
      860 + Math.round(guildRatio * 260 + Math.min(1, telemetry.elderPlantCount / 4) * 180);
    const targetAntiphony = 960 + Math.round(biomeRatio * 220 + guildRatio * 120);
    mus = {
      phraseHyperbarMode: phraseMode,
      consonanceGravityPermille: Math.round(
        mus.consonanceGravityPermille * 0.4 + targetConsonance * 0.6 + jitterStep * 0.25,
      ),
      canonCounterpointPermille: Math.round(
        mus.canonCounterpointPermille * 0.4 + targetCanon * 0.6,
      ),
      spatialAntiphonyPermille: Math.round(
        mus.spatialAntiphonyPermille * 0.4 + targetAntiphony * 0.6,
      ),
      breathReleasePermille: clampInt(
        980 + Math.round(unity01 * 240 + (telemetry.isStillness ? 90 : 0)),
        900,
        1350,
      ),
    };
  } else {
    // Joint holistic harmonization guided by consolidated warm memories
    const targetWind = 960 + Math.round(unity01 * 200);
    const targetCymatic =
      950 +
      Math.round(unity01 * 260) +
      (telemetry.biome === 'wetland' || telemetry.biome === 'crystal' ? 70 : 0);
    const targetIrid = 960 + Math.round(unity01 * 240);
    const targetKuramoto =
      980 + Math.round(awakenedRatio * 240 + guildRatio * 150 + telemetry.kuramotoOrderR * 60);
    const targetGuildArc = 920 + Math.round(guildRatio * 340 + awakenedRatio * 100);
    const targetCorolla = 980 + Math.round(awakenedRatio * 220);
    const targetConsonance = 940 + Math.round(unity01 * 340 + (telemetry.isStillness ? 80 : 0));
    const targetCanon =
      860 + Math.round(guildRatio * 260 + Math.min(1, telemetry.elderPlantCount / 4) * 180);
    const targetAntiphony = 960 + Math.round(biomeRatio * 220 + guildRatio * 120);

    phys = {
      windHarmonyGainPermille: targetWind,
      cymaticMeniscusGainPermille: targetCymatic,
      thinFilmIridescencePermille: targetIrid,
      acousticHeadroomTargetDbTenths: clampInt(
        Math.min(Math.floor(Math.max(3.4, telemetry.barkHeadroomDb) * 10), 44 + Math.round(unity01 * 14)),
        34,
        68,
      ),
    };
    bot = {
      kuramotoCouplingGainPermille: targetKuramoto,
      mycorrhizalGuildArcPermille: targetGuildArc,
      corollaBloomGracePermille: targetCorolla,
      vascularTurgorPermille: clampInt(980 + Math.round(awakenedRatio * 210), 900, 1250),
    };
    mus = {
      phraseHyperbarMode: phraseMode,
      consonanceGravityPermille: targetConsonance,
      canonCounterpointPermille: targetCanon,
      spatialAntiphonyPermille: targetAntiphony,
      breathReleasePermille: clampInt(
        1000 + Math.round(unity01 * 240 + (telemetry.isStillness ? 80 : 0)),
        900,
        1350,
      ),
    };
  }

  return createConservatoryCurationPoint({
    physicalProfile: phys,
    botanicalProfile: bot,
    musicalProfile: mus,
    warmMemoryRootKappa,
  });
}

/**
 * Creates the initial baseline-pinned `ConservatoryCurationState` (optionally hydrated with
 * persisted `ConsolidatedGardenMemory` records from the `uorc1:` Anamnesis archive).
 */
export function createInitialConservatoryCurationState(
  persistedMemories: readonly ConsolidatedGardenMemory[] = [],
): ConservatoryCurationState {
  const cap = GENERATED_PRISM_STANDARDS.autonomousConservatoryCuration?.consolidatedMemorySlotCap ?? 16;
  const sanitizedMemories = persistedMemories.slice(0, cap);
  const warmRootKappa = computeConsolidatedMemoryRootKappa(sanitizedMemories);

  const baselineFloorPoint = createConservatoryCurationPoint({
    physicalProfile: {
      windHarmonyGainPermille: 920,
      cymaticMeniscusGainPermille: 910,
      thinFilmIridescencePermille: 920,
      acousticHeadroomTargetDbTenths: 36,
    },
    botanicalProfile: {
      kuramotoCouplingGainPermille: 920,
      mycorrhizalGuildArcPermille: 880,
      corollaBloomGracePermille: 940,
      vascularTurgorPermille: 940,
    },
    musicalProfile: {
      phraseHyperbarMode: 'pastoral-antecedent',
      consonanceGravityPermille: 900,
      canonCounterpointPermille: 820,
      spatialAntiphonyPermille: 910,
      breathReleasePermille: 950,
    },
    warmMemoryRootKappa: warmRootKappa,
  });

  const initialTelemetry: LiveGardenCurationTelemetry = {
    tickIndex: 0,
    barIndex: 0,
    biome: 'meadow',
    harmonyPct: 15,
    kuramotoOrderR: 0.35,
    awakenedPlantCount: 0,
    fruitingPlantCount: 0,
    elderPlantCount: 0,
    totalPlantCount: 25,
    activeGuildIds: [],
    exploredBiomes: ['meadow'],
    barkHeadroomDb: 5.2,
    restStepCount: 16,
    maxMelodicStepLeap: 0,
    meanEulerGradus: 1.0,
    floatingGapCount: 0,
    staticOverlapCount: 0,
    ahimsaViolationCount: 0,
    witnessCommunion01: 0,
    isStillness: false,
  };

  const baselineEval = evaluateGardenCurationCandidate(
    baselineFloorPoint,
    initialTelemetry,
    sanitizedMemories.length,
    6200,
  );
  const baselineFloorLyapunovCost = Math.max(baselineEval.lyapunovCost, 2800);
  const coherencePermille = clampInt(1000 - baselineEval.lyapunovCost / 10, 500, 995);

  return {
    profile:
      GENERATED_PRISM_STANDARDS.autonomousConservatoryCuration?.profile ??
      'uorc/conservatory-curation/1',
    verified: baselineEval.admissible,
    rule30Register64: RULE30_SEED64.toString(10),
    curationTickCount: 0,
    activePhraseBarIndex: 0,
    activePhraseMode: 'pastoral-antecedent',
    baselineFloorPoint,
    baselineFloorLyapunovCost,
    incumbentPoint: baselineFloorPoint,
    incumbentEvaluation: baselineEval,
    consolidatedMemories: sanitizedMemories,
    latestConsolidatedMemory: null,
    knownClaimKappas: [],
    recentMintedClaims: [],
    provenanceStandardCount: AUTHORITATIVE_CONSERVATORY_STANDARDS_REGISTRY.length,
    curationCoherencePermille: coherencePermille,
  };
}

/**
 * Steps the Observer's autonomous UORC-style parametric curation loop:
 *  1. Advances the 64-cell cyclic Rule-30 hypothesis register (`stepRule30Ring64`).
 *  2. Evaluates consolidated `κ`-named garden memories earned from live ecological/contemplative harmony.
 *  3. Evaluates the current incumbent + 4 Rule-30 hypothesis candidates against the hard `defect === 0`
 *     physical/dharmic gate, memoizing claim digests (`claimKappa`) and admitting a new incumbent ONLY
 *     under strict multi-objective dominance (`conservatoryCurationDominates`), while enforcing the
 *     non-regressing baseline floor (`baselineFloorPoint`).
 */
export function stepAutonomousConservatoryCuration(
  prevState: ConservatoryCurationState,
  telemetry: LiveGardenCurationTelemetry,
): ConservatoryCurationState {
  const prevReg = BigInt(prevState.rule30Register64 || RULE30_SEED64.toString(10));
  const nextReg = stepRule30Ring64(prevReg);

  // Select cantabile hyperbar phrase mode across the 4-bar cycle, prioritizing Guild Antiphony
  // when guilds awaken and Turīya Tonic Resolution during stillness or cadential bars.
  const barIndex = Math.max(0, Math.floor(telemetry.barIndex ?? prevState.activePhraseBarIndex));
  const cycleBars =
    GENERATED_PRISM_STANDARDS.autonomousConservatoryCuration?.curationPhraseCycleBars ?? 4;
  const barSlot = barIndex % cycleBars;
  let phraseMode: CantabileHyperbarPhraseMode = HYPERBAR_MODES[barSlot] ?? 'pastoral-antecedent';
  if (telemetry.isStillness) {
    phraseMode = 'turiya-tonic-resolution';
  } else if (barSlot === 1 && telemetry.activeGuildIds.length === 0) {
    phraseMode = 'pastoral-antecedent';
  }

  // Re-evaluate baseline floor and current incumbent under live telemetry
  const floorEval = evaluateGardenCurationCandidate(
    prevState.baselineFloorPoint,
    telemetry,
    prevState.consolidatedMemories.length,
    prevState.baselineFloorLyapunovCost,
  );

  // Check if a new consolidated κ-memory has matured in the garden
  const preIncumbentEval = evaluateGardenCurationCandidate(
    prevState.incumbentPoint,
    telemetry,
    prevState.consolidatedMemories.length,
    floorEval.lyapunovCost,
  );
  const newlyConsolidated = preIncumbentEval.admissible
    ? discoverNextConsolidatedMemory(
        prevState.consolidatedMemories,
        telemetry,
        preIncumbentEval.lyapunovCost,
      )
    : null;

  const updatedMemories = newlyConsolidated
    ? [...prevState.consolidatedMemories, newlyConsolidated]
    : prevState.consolidatedMemories;
  const warmMemoryRootKappa = computeConsolidatedMemoryRootKappa(updatedMemories);

  // Refresh incumbent with active warm-memory root & hyperbar phrase mode, pinned against floor regression
  let bestPoint = createConservatoryCurationPoint({
    physicalProfile: prevState.incumbentPoint.physicalProfile,
    botanicalProfile: prevState.incumbentPoint.botanicalProfile,
    musicalProfile: {
      ...prevState.incumbentPoint.musicalProfile,
      phraseHyperbarMode: phraseMode,
    },
    warmMemoryRootKappa,
  });
  let bestEval = evaluateGardenCurationCandidate(
    bestPoint,
    telemetry,
    updatedMemories.length,
    floorEval.lyapunovCost,
  );

  // Non-regressing baseline floor guarantee: if floor strictly dominates drifted incumbent, restore floor
  const refreshedFloorPoint = createConservatoryCurationPoint({
    physicalProfile: prevState.baselineFloorPoint.physicalProfile,
    botanicalProfile: prevState.baselineFloorPoint.botanicalProfile,
    musicalProfile: {
      ...prevState.baselineFloorPoint.musicalProfile,
      phraseHyperbarMode: phraseMode,
    },
    warmMemoryRootKappa,
  });
  const refreshedFloorEval = evaluateGardenCurationCandidate(
    refreshedFloorPoint,
    telemetry,
    updatedMemories.length,
    floorEval.lyapunovCost,
  );
  if (conservatoryCurationDominates(refreshedFloorEval, bestEval)) {
    bestPoint = refreshedFloorPoint;
    bestEval = refreshedFloorEval;
  }

  // Evaluate all 4 Rule-30 hypothesis generators and admit strictly dominating zero-defect improvements
  const knownSet = new Set(prevState.knownClaimKappas);
  const newlyMintedClaims: MintedCurationClaim[] = [];

  for (let g = 0; g < GENERATOR_KINDS.length; g++) {
    const genKind = GENERATOR_KINDS[g];
    const laneByte = Number((nextReg >> BigInt(g * 16)) & 0xffn);
    const candPoint = proposeCandidateCurationPoint({
      incumbent: bestPoint,
      generatorKind: genKind,
      rule30LaneByte: laneByte,
      telemetry,
      warmMemoryRootKappa,
      phraseMode,
    });
    const candEval = evaluateGardenCurationCandidate(
      candPoint,
      telemetry,
      updatedMemories.length,
      refreshedFloorEval.lyapunovCost,
    );

    if (!candEval.admissible) {
      continue; // Hard constructive physical/dharmic refusal (`defect > 0`)
    }

    const claimKappa = sha256Hex(
      `UORC-CURATION-CLAIM-v1|${candPoint.pointKappa}|${genKind}|${candEval.lyapunovCost}`,
    );

    if (conservatoryCurationDominates(candEval, bestEval)) {
      bestPoint = candPoint;
      bestEval = candEval;
      if (!knownSet.has(claimKappa)) {
        knownSet.add(claimKappa);
        newlyMintedClaims.push({
          claimKappa,
          pointKappa: candPoint.pointKappa,
          generatorKind: genKind,
          evaluation: candEval,
          standing: 'some-true', // Constructive witness strictly dominating prior incumbent with defect === 0
          tickIndex: telemetry.tickIndex,
        });
      }
    }
  }

  const boundedKnownKappas = Array.from(knownSet).slice(-64);
  const boundedRecentClaims = [...prevState.recentMintedClaims, ...newlyMintedClaims].slice(-12);
  const coherencePermille = clampInt(
    1000 - bestEval.lyapunovCost / 10 + updatedMemories.length * 6,
    500,
    999,
  );

  return {
    profile: prevState.profile,
    verified: bestEval.admissible && bestEval.lyapunovCost <= refreshedFloorEval.lyapunovCost,
    rule30Register64: nextReg.toString(10),
    curationTickCount: prevState.curationTickCount + 1,
    activePhraseBarIndex: barIndex,
    activePhraseMode: phraseMode,
    baselineFloorPoint: prevState.baselineFloorPoint,
    baselineFloorLyapunovCost: refreshedFloorEval.lyapunovCost,
    incumbentPoint: bestPoint,
    incumbentEvaluation: bestEval,
    consolidatedMemories: updatedMemories,
    latestConsolidatedMemory: newlyConsolidated,
    knownClaimKappas: boundedKnownKappas,
    recentMintedClaims: boundedRecentClaims,
    provenanceStandardCount: AUTHORITATIVE_CONSERVATORY_STANDARDS_REGISTRY.length,
    curationCoherencePermille: coherencePermille,
  };
}
