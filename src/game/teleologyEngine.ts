/**
 * Requirement-Grounded Environmental Synthesis, Interactive Landmark Phenomena & Inherent Gameplay Plasticity
 * (`src/game/teleologyEngine.ts`)
 *
 * Implements `Foundation.Teleology.V1.Model` (Model #19, Basis Prime `163`):
 *  - Eliminates all unexplained structures and arbitrary props (`orphanUnexplainedElementCount === 0`):
 *    every building/landmark, pathway, terrace, botanical species, canopy forest, cymatic lagoon, and
 *    embodied witness in Verdant Resonance is formally derived from an explicit causal chain:
 *      Upstream Standard Model Requirements -> Environmental Deficit -> Observer In-Situ Synthesis from Local Matter -> Living Gameplay Purpose.
 *  - Makes all 5 Biome Architectural Landmarks (`Meadow Solar Sundial`, `Grove Bamboo Chime Pergola`,
 *    `Crystal Quartz Geode Archway`, `Wetland Hydro-Lantern Piers`, `Sanctuary Harmonic Pavilion`)
 *    interactive resonators that awaken acoustically, optically, and ecologically through the player's
 *    existing contemplative gestures (`[Space]` Attune, `[T]` Touch, `[C]` Stillness, and gentle proximity).
 *  - Automates Neuromorphic STDP / Supra-Directive plasticity as an inherent facet of gameplay
 *    (`manualNeuromorphicControlCount === 0`), keeping the player UI calm and uncluttered.
 */

import {
  GENERATED_ALPHA_OMEGA_COSMOGENESIS_ARTIFACTS,
  GENERATED_CANONICAL_MODEL_BASIS_PRIMES,
  GENERATED_PRISM_BUS_MODULATION_LUT,
  GENERATED_PRISM_STANDARDS,
} from './generatedPrismConstants';
import type { CanonicalStandardModelKey } from './neuromorphicFunctorBus';

export type TeleologicalPhenomenonCategory =
  | 'biome-landmark'
  | 'traversal-substrate'
  | 'botanical-species'
  | 'ecological-phenomenon'
  | 'embodied-witness';

export type TeleologyBiomeScope = 'meadow' | 'grove' | 'crystal' | 'wetland' | 'sanctuary' | 'conservatory';

export type LandmarkMaterialCompoundKey =
  | 'travertine-limestone-plinth'
  | 'lignocellulosic-vascular-tissue'
  | 'piezoelectric-quartz-geode'
  | 'pelagic-water-column'
  | 'harmonic-bronze-astrolabe';

export interface EnvironmentalTeleologicalPhenomenon {
  readonly phenomenonId: string;
  readonly category: TeleologicalPhenomenonCategory;
  readonly biome: TeleologyBiomeScope;
  readonly displayName: string;
  readonly shortPurposeCue: string;
  readonly requiringModels: readonly CanonicalStandardModelKey[];
  readonly environmentalRequirement: string;
  readonly nativeSubstrateCompound: LandmarkMaterialCompoundKey | 'humic-loam-soil' | 'bryophyte-peat-mat';
  readonly nativeChemicalFormula: string;
  readonly environmentalSynthesisOrigin: string;
  readonly gameplayPurpose: string;
  readonly interactiveGameplayResponse: string;
  readonly basePurposeGainPermille: number;
}

/**
 * Canonical 16-Phenomenon Teleological Requirement-to-Synthesis Registry (`orphanUnexplainedElementCount === 0`):
 *  - 5 Biome Architectural Landmarks (Monuments)
 *  - 3 Traversal & Substrate Protection Infrastructures (Stepping Stones, Biome Terraces, Shoreline Boulders)
 *  - 5 Botanical Species (`chime-lily`, `pulse-fern`, `echo-lotus`, `drone-moss`, `star-orchid`)
 *  - 2 Ecosystem Phenomena (`64 Canopy Trees & Turf`, `Mirror Lagoon Cymatic Basin & Spores`)
 *  - 1 Embodied Co-Observer Presence (`Immanent Co-Observer Witness & Player Harmonic Locus`)
 */
export const VERDANT_TELEOLOGICAL_PHENOMENA: readonly EnvironmentalTeleologicalPhenomenon[] = Object.freeze([
  // --- 1..5: The 5 Biome Architectural Landmarks ---
  {
    phenomenonId: 'landmark-meadow-sundial',
    category: 'biome-landmark',
    biome: 'meadow',
    displayName: 'Meridian Solar Sundial',
    shortPurposeCue: 'Circadian Solar Gnomon · Synchronizes Meadow Bloom Phase',
    requiringModels: ['botany', 'physics', 'graphics'],
    environmentalRequirement:
      'Sunlit Meadow C3 flora require an exact diurnal meridian reference to synchronize stomatal turgor and morning corolla opening across shifting solar elevations.',
    nativeSubstrateCompound: 'travertine-limestone-plinth',
    nativeChemicalFormula: 'CaCO3 + CuSnAu + Fe2O3',
    environmentalSynthesisOrigin:
      'Synthesized in situ by the Observer via photonic-acoustic standing-wave calcification of meadow limestone travertine and native solar bronze.',
    gameplayPurpose:
      'Anchors the meadow photoperiod and focuses warm Lydian fourth overtones across surrounding Chime Lilies.',
    interactiveGameplayResponse:
      'Approaching, touching, or attuning near the Sundial aligns its solar crystal gnomon, rings a warm Lydian bell-stone chime, and nourishes nearby meadow blossoms.',
    basePurposeGainPermille: 860,
  },
  {
    phenomenonId: 'landmark-grove-pergola',
    category: 'biome-landmark',
    biome: 'grove',
    displayName: 'Silicified Bamboo Chime Pergola',
    shortPurposeCue: 'Wind-Shear Resonator · Transduces Canopy Breeze into Dorian Chimes',
    requiringModels: ['acoustics', 'ecology', 'articulation'],
    environmentalRequirement:
      'High canopy wind shear in the Ancient Grove would buffet delicate fern croziers unless turbulent gusts are baffled and transduced into steady rhythmic overtones.',
    nativeSubstrateCompound: 'lignocellulosic-vascular-tissue',
    nativeChemicalFormula: '(C6H10O5)n · SiO2 + CuSn',
    environmentalSynthesisOrigin:
      'Woven by the Observer from four mature silicified bamboo culms arched into a self-bracing Euclidean ring suspending six hollow tubular resonators.',
    gameplayPurpose:
      'Calms turbulent wind into Dorian polyrhythmic chimes that entrain Pulse Fern crozier unfurling.',
    interactiveGameplayResponse:
      'Touching or attuning beneath the Pergola sets all six suspended chime tubes swinging in harmonic phase and ripples rhythmic vitality through nearby ferns.',
    basePurposeGainPermille: 880,
  },
  {
    phenomenonId: 'landmark-crystal-archway',
    category: 'biome-landmark',
    biome: 'crystal',
    displayName: 'Piezoelectric Quartz Geode Archway',
    shortPurposeCue: 'Spectral Prism Focus · Disperses Light & Standing Waves for Epiphytes',
    requiringModels: ['chemistry', 'spatialAcoustics', 'botany'],
    environmentalRequirement:
      'Subterranean Crystalline Hollow pockets lack direct sky irradiance and trap harsh echoes unless a birefringent quartz lens disperses light and focuses standing waves.',
    nativeSubstrateCompound: 'piezoelectric-quartz-geode',
    nativeChemicalFormula: 'SiO2 + MgFeSiO4 + Bi2O3',
    environmentalSynthesisOrigin:
      'Nucleated by the Observer along hydrothermal piezoelectric nodal lines, cantilevers six Bravais quartz spires into a hexagonal keystone suspending a rotating core prism.',
    gameplayPurpose:
      'Refracts thin-film spectral light onto lithophytic Star Orchids and tunes the cavern to pure crystalline seventh harmonics.',
    interactiveGameplayResponse:
      'Attuning or resting near the Archway accelerates its levitating quartz core, flares thin-film iridescence, and sings glass-harmonica overtones across the hollow.',
    basePurposeGainPermille: 910,
  },
  {
    phenomenonId: 'landmark-wetland-lanterns',
    category: 'biome-landmark',
    biome: 'wetland',
    displayName: 'Hydro-Meniscus Lantern Piers',
    shortPurposeCue: 'Bioluminescent Tufa Piers · Oxygenates Lagoon & Guides Safe Wading',
    requiringModels: ['physics', 'ecology', 'humane'],
    environmentalRequirement:
      'Still pelagic water loses dissolved oxygen at dusk and obscures shallow wading depth unless anchored tufa piers aerate the meniscus and cast gentle bioluminescence.',
    nativeSubstrateCompound: 'pelagic-water-column',
    nativeChemicalFormula: 'CaCO3 · H2O + C11H8N2O3S2 (Luciferin)',
    environmentalSynthesisOrigin:
      'Precipitated by the Observer from lakebed calcium tufa columns crowned with symbiotic luciferin-quartz lantern chambers.',
    gameplayPurpose:
      'Sustains Echo Lotus buoyancy, reflects antiphonal water-harp echoes across the lagoon, and illuminates calm twilight traversal.',
    interactiveGameplayResponse:
      'Wading, touching, or attuning by the Lantern Piers pulses their bioluminescent orbs, radiates concentric cymatic meniscus rings, and awakens floating lotuses.',
    basePurposeGainPermille: 890,
  },
  {
    phenomenonId: 'landmark-sanctuary-pavilion',
    category: 'biome-landmark',
    biome: 'sanctuary',
    displayName: 'Sanctuary Harmonic Pavilion',
    shortPurposeCue: 'Central Convergence Rotunda · Unites All Five Biome Choirs in Stillness',
    requiringModels: ['soundtrack', 'cosmogenesis', 'anamnesis', 'humane'],
    environmentalRequirement:
      'Five distinct biome modes and scattered flora choirs require a central acoustic amphitheater to phase-lock into a unified conservatory chorus and consolidate memory.',
    nativeSubstrateCompound: 'harmonic-bronze-astrolabe',
    nativeChemicalFormula: 'CaCO3 + SiO2 + CuSnAu',
    environmentalSynthesisOrigin:
      'Crystallized by the Observer at the conservatory’s five-fold nodal origin from fluted travertine colonnades and a counter-rotating harmonic bronze astrolabe.',
    gameplayPurpose:
      'Gathers every awakened biome voice into the Sanctuary Chorus and anchors restorative stillness at the heart of the garden.',
    interactiveGameplayResponse:
      'Practicing stillness or attuning within the Pavilion harmonizes its gimbal rings, blossoms the overhead astrolabe crown, and swells the multi-octave Sanctuary Choir.',
    basePurposeGainPermille: 960,
  },

  // --- 6..8: Traversal & Substrate Protection Infrastructures ---
  {
    phenomenonId: 'substrate-stepping-stones',
    category: 'traversal-substrate',
    biome: 'conservatory',
    displayName: 'Harmonic Travertine Stepping-Stone Trails',
    shortPurposeCue: 'Root-Loam Protection & Effortless Wayfinding',
    requiringModels: ['ecology', 'humane', 'physics'],
    environmentalRequirement:
      'Repeated footsteps over porous humic soil and delicate mycelial mats would compact root zones unless load-bearing mineral flagstones guide gentle traversal.',
    nativeSubstrateCompound: 'travertine-limestone-plinth',
    nativeChemicalFormula: 'CaCO3 + SiO2',
    environmentalSynthesisOrigin:
      'Calcified by the Observer along minimum-slope geodesic contours connecting all five biomes without severing subterranean root networks.',
    gameplayPurpose:
      'Protects living soil permeability, provides clear visual wayfinding without UI arrows, and rings subtle stone footstep acoustics.',
    interactiveGameplayResponse:
      'Walking along the flagstones preserves calm pacing and emits gentle mineral footstep ripples.',
    basePurposeGainPermille: 810,
  },
  {
    phenomenonId: 'substrate-biome-terraces',
    category: 'traversal-substrate',
    biome: 'conservatory',
    displayName: 'Acoustic Labyrinth & Biome Plinth Terraces',
    shortPurposeCue: 'Standing-Wave Plinths & Erosion Retention',
    requiringModels: ['spatialAcoustics', 'physics', 'ecology'],
    environmentalRequirement:
      'Sloped basin soils erode under rainfall and scatter ground-level sound waves unless concentric stone terraces stabilize the grade and reflect early acoustic arrivals.',
    nativeSubstrateCompound: 'travertine-limestone-plinth',
    nativeChemicalFormula: 'CaCO3 + MgCa(CO3)2',
    environmentalSynthesisOrigin:
      'Deposited by the Observer at Chladni nodal radii around each biome center to retain moisture and focus early acoustic reflections.',
    gameplayPurpose:
      'Frames contemplative gathering spaces around each landmark and enriches biome-specific reverberation warmth.',
    interactiveGameplayResponse:
      'Standing on a terrace ring clarifies binaural flora echoes and steadies meditative stillness.',
    basePurposeGainPermille: 800,
  },
  {
    phenomenonId: 'substrate-shoreline-boulders',
    category: 'traversal-substrate',
    biome: 'wetland',
    displayName: 'Stratified Shoreline Boulders & Mineral Druses',
    shortPurposeCue: 'Lagoon Embankment & Lithophyte Micro-Habitats',
    requiringModels: ['chemistry', 'physics', 'botany'],
    environmentalRequirement:
      'The Mirror Lagoon basin requires a mineral retention rim to hold hydrostatic water level and provide damp mineral crevices for bryophytes and crystal druses.',
    nativeSubstrateCompound: 'piezoelectric-quartz-geode',
    nativeChemicalFormula: 'MgFeSiO4 + SiO2',
    environmentalSynthesisOrigin:
      'Uplifted and weathered in situ by the Observer along the lagoon perimeter, hosting all 14 Bravais crystal druse habits.',
    gameplayPurpose:
      'Bounds the hydrostatic wetland basin and scatters sparkling littoral reflections.',
    interactiveGameplayResponse:
      'Reflects water-harp ripples back across the lagoon meniscus as the player wades nearby.',
    basePurposeGainPermille: 790,
  },

  // --- 9..13: The 5 Botanical Species ---
  {
    phenomenonId: 'flora-chime-lily',
    category: 'botanical-species',
    biome: 'meadow',
    displayName: 'Chime Lily (Campanula Resonans)',
    shortPurposeCue: 'Solar Bell Corolla · Sings Bright Lydian Overtones',
    requiringModels: ['botany', 'morphogenesis', 'acoustics'],
    environmentalRequirement:
      'Open sunlit turf requires a high-albedo campanulate pollinator species to convert morning PAR photons and breeze into clear upper-register harmonic beacons.',
    nativeSubstrateCompound: 'humic-loam-soil',
    nativeChemicalFormula: 'C55H72MgN4O5 (Chlorophyll-a) + C10H16 (Terpenes)',
    environmentalSynthesisOrigin:
      'Grown by the Observer from humic meadow loam via Murray cubic vascular branching and fluted 8-lobe bell morphogenesis.',
    gameplayPurpose:
      'Awakens bright melodic chimes on gentle touch or attunement and initiates sympathetic cross-pollination arcs.',
    interactiveGameplayResponse:
      'Swings its bell corollas, releases golden spore bursts, and chimes pure Just-Intonation intervals.',
    basePurposeGainPermille: 850,
  },
  {
    phenomenonId: 'flora-pulse-fern',
    category: 'botanical-species',
    biome: 'grove',
    displayName: 'Pulse Fern (Pteris Polyrhythmica)',
    shortPurposeCue: 'Fibonacci Crozier · Grounds Understory Polyrhythms',
    requiringModels: ['botany', 'morphogenesis', 'articulation'],
    environmentalRequirement:
      'Dappled grove shade requires broad pinnate fronds to harvest filtered green-edge photons and logarithmic croziers to pulse nutrients from forest humus.',
    nativeSubstrateCompound: 'lignocellulosic-vascular-tissue',
    nativeChemicalFormula: '(C6H10O5)n + K+ / Ca2+ Turgor',
    environmentalSynthesisOrigin:
      'Synthesized by the Observer from forest litter humus following Vogel 137.508° spiral phyllotaxis.',
    gameplayPurpose:
      'Provides warm rhythmic pulse counterpoint as the player strolls or attunes beneath the bamboo canopy.',
    interactiveGameplayResponse:
      'Unfurls its spiral croziers and breathes in polyrhythmic Dorian cadence with neighboring ferns.',
    basePurposeGainPermille: 850,
  },
  {
    phenomenonId: 'flora-echo-lotus',
    category: 'botanical-species',
    biome: 'wetland',
    displayName: 'Echo Lotus (Nelumbo Antiphona)',
    shortPurposeCue: 'Hydrostatic Chalice · Sustains Antiphonal Water Reflections',
    requiringModels: ['botany', 'physics', 'soundtrack'],
    environmentalRequirement:
      'Nutrient-rich lagoon water requires buoyant cordate pads to shade pelagic algae and hydrophobic chalices to exchange dissolved gases.',
    nativeSubstrateCompound: 'pelagic-water-column',
    nativeChemicalFormula: 'H2O + Wax Cuticle + Luciferin',
    environmentalSynthesisOrigin:
      'Germinated by the Observer in shallow wetland silt, rising to hydrostatic equilibrium on the Mirror Lagoon meniscus.',
    gameplayPurpose:
      'Voices tranquil antiphonal echoes across the water and co-regulates unhurried breathing.',
    interactiveGameplayResponse:
      'Bobs gently on lagoon ripples, opens luminous inner petals, and answers player gestures with liquid echoes.',
    basePurposeGainPermille: 860,
  },
  {
    phenomenonId: 'flora-drone-moss',
    category: 'botanical-species',
    biome: 'sanctuary',
    displayName: 'Drone Moss (Bryum Sustenuto)',
    shortPurposeCue: 'Bryophyte Cushion · Anchors Deep Pedal-Tone Harmony',
    requiringModels: ['ecology', 'acoustics', 'botany'],
    environmentalRequirement:
      'Exposed rock and sanctuary terraces require moisture-retaining bryophyte mats to pioneer mineral weathering and anchor low-frequency acoustic warmth.',
    nativeSubstrateCompound: 'bryophyte-peat-mat',
    nativeChemicalFormula: 'Organic Peat + Chelated Mg / Fe',
    environmentalSynthesisOrigin:
      'Spore-settled by the Observer across damp stone joints into compressible cushions with spore-bearing seta capsules.',
    gameplayPurpose:
      'Sustains the soothing fundamental bass drone of the conservatory and cushions footsteps softly.',
    interactiveGameplayResponse:
      'Compresses elastically underfoot and swells warm harmonic drones during stillness.',
    basePurposeGainPermille: 840,
  },
  {
    phenomenonId: 'flora-star-orchid',
    category: 'botanical-species',
    biome: 'crystal',
    displayName: 'Star Orchid (Epidendrum Sidereum)',
    shortPurposeCue: 'Lithophytic Epiphyte · Voices Celestial Twilight Harmonics',
    requiringModels: ['botany', 'chemistry', 'graphics'],
    environmentalRequirement:
      'Mineral quartz outcrops without deep soil require an aerial-root lithophyte capable of capturing atmospheric mist and piezo-luminescent twilight.',
    nativeSubstrateCompound: 'piezoelectric-quartz-geode',
    nativeChemicalFormula: 'SiO2 Holdfast + Anthocyanin / Flavone Chromophores',
    environmentalSynthesisOrigin:
      'Anchored by the Observer onto Bravais crystal facets with Thin-Film iridescent tepals.',
    gameplayPurpose:
      'Crowns twilight and starlight exploration with shimmering crystalline choir overtones.',
    interactiveGameplayResponse:
      'Rotates its stellate flower head toward the observer and shimmers with thin-film spectral iridescence.',
    basePurposeGainPermille: 880,
  },

  // --- 14..16: Ecosystem & Embodied Witness Phenomena ---
  {
    phenomenonId: 'ecosystem-canopy-and-turf',
    category: 'ecological-phenomenon',
    biome: 'conservatory',
    displayName: 'Phyllotactic Canopy Forest & Permeable Meadow Turf',
    shortPurposeCue: 'Microclimate Shelter, Carbon Cycling & Living Wind Field',
    requiringModels: ['ecology', 'botany', 'physics'],
    environmentalRequirement:
      'An open basin without overstory trees or groundcover would suffer desiccating wind and radiative heat loss; a closed-loop ecosystem requires 64 canopy crowns and 360 turf blades.',
    nativeSubstrateCompound: 'lignocellulosic-vascular-tissue',
    nativeChemicalFormula: '6CO2 + 6H2O -> C6H12O6 + 6O2',
    environmentalSynthesisOrigin:
      'Differentiated by the Observer across perimeter ridges and sunny clearings to close the conservatory carbon-water-oxygen cycle.',
    gameplayPurpose:
      'Makes invisible wind currents visible through swaying crowns and Hookean grass deflection around the player’s stride.',
    interactiveGameplayResponse:
      'Parts gently around the player’s footsteps and sways in unified gusts with the windscape.',
    basePurposeGainPermille: 830,
  },
  {
    phenomenonId: 'ecosystem-lagoon-cymatics-and-spores',
    category: 'ecological-phenomenon',
    biome: 'conservatory',
    displayName: 'Mirror Lagoon Cymatics & Chemotactic Spore Streams',
    shortPurposeCue: 'Visible Acoustic Standing Waves & Mycelial Pollination',
    requiringModels: ['physics', 'acoustics', 'ecology'],
    environmentalRequirement:
      'Botanical cross-pollination and acoustic resonance require physical transport media—airborne chemotactic spores and water-surface standing waves—to connect distant flora.',
    nativeSubstrateCompound: 'pelagic-water-column',
    nativeChemicalFormula: 'H2O Capillary Waves + Volatile Terpene Aerosols',
    environmentalSynthesisOrigin:
      'Emerges continuously from Stokes-buoyant spore advection and 24-Bark acoustic energy coupling into the lagoon surface.',
    gameplayPurpose:
      'Gently guides the player toward unawakened blossoms via living spore streams rather than artificial UI arrows.',
    interactiveGameplayResponse:
      'Streams luminous spores toward beckoning flora and ripples in sympathy with every note.',
    basePurposeGainPermille: 870,
  },
  {
    phenomenonId: 'embodied-co-observer-witness',
    category: 'embodied-witness',
    biome: 'conservatory',
    displayName: 'Immanent Co-Observer Witness & Player Harmonic Locus',
    shortPurposeCue: 'Shared Presence · Embodies the Reciprocal Bond Between Player & Garden',
    requiringModels: ['cosmogenesis', 'neuromorphic', 'humane'],
    environmentalRequirement:
      'Because the Observer creates and inhabits the conservatory alongside the player, its presence must appear diegetically within the garden rather than as detached backend menus.',
    nativeSubstrateCompound: 'harmonic-bronze-astrolabe',
    nativeChemicalFormula: 'SiO2 Core + CuSnAu Gimbals',
    environmentalSynthesisOrigin:
      'Manifested by the Observer as a serene sculptural companion along the garden’s paths and a subtle harmonic locus ring beneath the player’s feet.',
    gameplayPurpose:
      'Bows reciprocally during stillness and quietly reflects growing garden harmony in-world without cluttering the screen.',
    interactiveGameplayResponse:
      'Approaches at a respectful distance, bows gently when the player rests in stillness, and warms its aura as harmony deepens.',
    basePurposeGainPermille: 920,
  },
]);

export interface LiveLandmarkResonanceState {
  readonly meadow: number;
  readonly grove: number;
  readonly crystal: number;
  readonly wetland: number;
  readonly sanctuary: number;
}

export interface NearestLandmarkEvaluation {
  readonly biome: 'meadow' | 'grove' | 'crystal' | 'wetland' | 'sanctuary';
  readonly phenomenon: EnvironmentalTeleologicalPhenomenon;
  readonly centerX: number;
  readonly centerZ: number;
  readonly distanceMeters: number;
  readonly resonanceRadiusMeters: number;
  readonly inResonanceRange: boolean;
  readonly inForwardGazeCone: boolean;
  readonly resonanceCharge01: number;
  readonly fundamentalHz: number;
  readonly mineralModalRatios: readonly [number, number, number, number];
  readonly DemiurgicOriginSummary: string;
}

const LANDMARK_PHENOMENON_BY_BIOME: Readonly<
  Record<'meadow' | 'grove' | 'crystal' | 'wetland' | 'sanctuary', EnvironmentalTeleologicalPhenomenon>
> = Object.freeze({
  meadow: VERDANT_TELEOLOGICAL_PHENOMENA[0],
  grove: VERDANT_TELEOLOGICAL_PHENOMENA[1],
  crystal: VERDANT_TELEOLOGICAL_PHENOMENA[2],
  wetland: VERDANT_TELEOLOGICAL_PHENOMENA[3],
  sanctuary: VERDANT_TELEOLOGICAL_PHENOMENA[4],
});

const LANDMARK_BASE_FUNDAMENTAL_HZ: Readonly<
  Record<'meadow' | 'grove' | 'crystal' | 'wetland' | 'sanctuary', number>
> = Object.freeze({
  meadow: 293.66, // D4 solar bell-stone gnomon
  grove: 220.0, // A3/D4 hollow bamboo-bronze tubular chime
  crystal: 329.63, // E4 piezoelectric quartz glass-harmonica arch
  wetland: 246.94, // B3/E4 bioluminescent tufa water-harp lantern
  sanctuary: 196.0, // G3 central harmonic rotunda cupola choir
});

const LANDMARK_MINERAL_MODALS: Readonly<
  Record<'meadow' | 'grove' | 'crystal' | 'wetland' | 'sanctuary', readonly [number, number, number, number]>
> = Object.freeze({
  meadow: [1.0, 1.5, 2.25, 3.0], // Lydian solar bronze + travertine fifth/ninth
  grove: [1.0, 1.3333, 1.7778, 2.6667], // Hollow Euler-Bernoulli bamboo tubular fourths
  crystal: [1.0, 1.4063, 1.875, 2.756], // Piezoelectric quartz crystal seventh & Chladni mode
  wetland: [1.0, 1.25, 1.5, 2.0], // Calm meniscus water-harp major triad
  sanctuary: [1.0, 1.5, 2.0, 3.0], // Pure cathedral octave-fifth convergence
});

export function createInitialLandmarkResonanceState(): LiveLandmarkResonanceState {
  return {
    meadow: 0.15,
    grove: 0.15,
    crystal: 0.15,
    wetland: 0.15,
    sanctuary: 0.2,
  };
}

/**
 * Steps smooth exponential decay + passive proximity sympathetic resonance for all 5 Biome Landmarks.
 */
export function stepLandmarkResonanceField(
  prev: LiveLandmarkResonanceState,
  params: {
    readonly nearestBiome: 'meadow' | 'grove' | 'crystal' | 'wetland' | 'sanctuary';
    readonly inResonanceRange: boolean;
    readonly isStillness: boolean;
    readonly harmonyPct: number;
    readonly dt: number;
  },
): LiveLandmarkResonanceState {
  const decay = Math.exp(-0.38 * Math.max(0, params.dt));
  const baseFloor = 0.12 + (Math.max(0, Math.min(100, params.harmonyPct)) / 100) * 0.24;
  const stepOne = (b: keyof LiveLandmarkResonanceState): number => {
    let val = baseFloor + (prev[b] - baseFloor) * decay;
    if (b === params.nearestBiome && params.inResonanceRange) {
      const proxLift = params.isStillness ? 0.32 : 0.14;
      val = Math.min(1, val + proxLift * params.dt);
    }
    return Number(Math.max(0, Math.min(1, val)).toFixed(4));
  };
  return {
    meadow: stepOne('meadow'),
    grove: stepOne('grove'),
    crystal: stepOne('crystal'),
    wetland: stepOne('wetland'),
    sanctuary: stepOne('sanctuary'),
  };
}

/**
 * Excites a biome landmark when the player performs `[Space]` Attune, `[T]` Touch, or `[C]` Stillness
 * within its sanctuary resonance radius.
 */
export function exciteLandmarkResonance(
  prev: LiveLandmarkResonanceState,
  biome: 'meadow' | 'grove' | 'crystal' | 'wetland' | 'sanctuary',
  gesture: 'attune' | 'touch' | 'stillness',
  busWeight = 8,
): LiveLandmarkResonanceState {
  const clampedW = Math.max(1, Math.min(16, Math.round(busWeight)));
  const coupling =
    (GENERATED_PRISM_BUS_MODULATION_LUT.landmarkResonanceCouplingPermille[clampedW] ?? 760) / 1000;
  const impulse =
    (gesture === 'attune' ? 0.85 : gesture === 'stillness' ? 0.72 : 0.58) * (0.75 + coupling * 0.35);
  return {
    ...prev,
    [biome]: Number(Math.min(1, prev[biome] + impulse).toFixed(4)),
  };
}

/**
 * Evaluates the nearest Observer-synthesized Architectural Landmark relative to the player's pose.
 */
export function evaluateNearestSynthesizedLandmark(params: {
  readonly playerX: number;
  readonly playerZ: number;
  readonly playerYaw: number;
  readonly landmarkCentersXZ: Readonly<
    Record<'meadow' | 'grove' | 'crystal' | 'wetland' | 'sanctuary', readonly [number, number]>
  >;
  readonly resonanceState: LiveLandmarkResonanceState;
  readonly busWeight?: number;
}): NearestLandmarkEvaluation {
  const biomes = ['meadow', 'grove', 'crystal', 'wetland', 'sanctuary'] as const;
  let bestBiome: (typeof biomes)[number] = 'sanctuary';
  let bestDist = Infinity;
  let bestScore = Infinity;

  const lookX = -Math.sin(params.playerYaw);
  const lookZ = -Math.cos(params.playerYaw);

  for (const b of biomes) {
    const [cx, cz] = params.landmarkCentersXZ[b];
    const dx = cx - params.playerX;
    const dz = cz - params.playerZ;
    const dist = Math.hypot(dx, dz);
    const inv = dist > 0.001 ? 1 / dist : 1;
    const cosTheta = (dx * lookX + dz * lookZ) * inv;
    const gazeWeight = cosTheta > 0.35 ? 0.82 : 1.0;
    const score = dist * gazeWeight;
    if (score < bestScore) {
      bestScore = score;
      bestDist = dist;
      bestBiome = b;
    }
  }

  const [cx, cz] = params.landmarkCentersXZ[bestBiome];
  const dx = cx - params.playerX;
  const dz = cz - params.playerZ;
  const dist = Math.max(0.001, bestDist);
  const cosTheta = (dx * lookX + dz * lookZ) / dist;
  const clampedW = Math.max(1, Math.min(16, Math.round(params.busWeight ?? 8)));
  const coupling =
    (GENERATED_PRISM_BUS_MODULATION_LUT.landmarkResonanceCouplingPermille[clampedW] ?? 760) / 1000;
  const resonanceRadiusMeters = Number((10.5 + coupling * 2.5).toFixed(2));
  const archetype = GENERATED_ALPHA_OMEGA_COSMOGENESIS_ARTIFACTS.monumentDemiurgicArchetypes.find(
    (m) => m.biome === bestBiome,
  );

  return {
    biome: bestBiome,
    phenomenon: LANDMARK_PHENOMENON_BY_BIOME[bestBiome],
    centerX: cx,
    centerZ: cz,
    distanceMeters: Number(bestDist.toFixed(2)),
    resonanceRadiusMeters,
    inResonanceRange: bestDist <= resonanceRadiusMeters,
    inForwardGazeCone: cosTheta >= 0.42,
    resonanceCharge01: params.resonanceState[bestBiome],
    fundamentalHz: LANDMARK_BASE_FUNDAMENTAL_HZ[bestBiome],
    mineralModalRatios: LANDMARK_MINERAL_MODALS[bestBiome],
    DemiurgicOriginSummary:
      archetype?.whyObserverIntervened ??
      LANDMARK_PHENOMENON_BY_BIOME[bestBiome].environmentalSynthesisOrigin,
  };
}

export interface AutonomousGameplayPlasticityState {
  readonly accumulatedMindfulSeconds: number;
  readonly consolidatedMilestonesReached: number;
  readonly lastVisitedBiomeCount: number;
}

export function createInitialAutonomousPlasticityState(): AutonomousGameplayPlasticityState {
  return {
    accumulatedMindfulSeconds: 0,
    consolidatedMilestonesReached: 0,
    lastVisitedBiomeCount: 1,
  };
}

/**
 * Automates Neuromorphic Plasticity (`w: 8 -> 16`) purely from lived Verdant Resonance gameplay:
 *  - Entering a newly discovered biome immediately triggers a cross-domain consolidation pulse.
 *  - Sustained unhurried strolling, standing near awakened flora/landmarks, or practicing stillness
 *    smoothly accumulates mindful contemplation and triggers autonomous consolidation every 18 seconds
 *    without requiring any manual UI buttons or debug overrides.
 */
export function stepAutonomousGameplayPlasticity(
  prev: AutonomousGameplayPlasticityState,
  params: {
    readonly exploredBiomesCount: number;
    readonly velocityDm: number;
    readonly isStillness: boolean;
    readonly nearAwakenedFloraOrLandmark: boolean;
    readonly meanSynapticWeight: number;
    readonly dt: number;
  },
): {
  readonly nextState: AutonomousGameplayPlasticityState;
  readonly shouldConsolidateCycle: boolean;
} {
  if (params.meanSynapticWeight >= 16) {
    return {
      nextState: {
        ...prev,
        lastVisitedBiomeCount: Math.max(prev.lastVisitedBiomeCount, params.exploredBiomesCount),
      },
      shouldConsolidateCycle: false,
    };
  }

  // Discovering a new biome organically rewards exploration with immediate synaptic consolidation
  if (params.exploredBiomesCount > prev.lastVisitedBiomeCount) {
    return {
      nextState: {
        accumulatedMindfulSeconds: prev.accumulatedMindfulSeconds,
        consolidatedMilestonesReached: prev.consolidatedMilestonesReached + 1,
        lastVisitedBiomeCount: params.exploredBiomesCount,
      },
      shouldConsolidateCycle: true,
    };
  }

  // Calm gameplay (stillness, gentle strolling <= 12 dm/s, or lingering by resonant flora/landmarks)
  const isCalmPace = params.velocityDm <= 12;
  const rate =
    (params.isStillness ? 1.85 : isCalmPace ? 1.0 : 0.25) *
    (params.nearAwakenedFloraOrLandmark ? 1.35 : 1.0);
  const nextSeconds = prev.accumulatedMindfulSeconds + Math.max(0, params.dt) * rate;

  if (nextSeconds >= 18.0) {
    return {
      nextState: {
        accumulatedMindfulSeconds: nextSeconds - 18.0,
        consolidatedMilestonesReached: prev.consolidatedMilestonesReached + 1,
        lastVisitedBiomeCount: params.exploredBiomesCount,
      },
      shouldConsolidateCycle: true,
    };
  }

  return {
    nextState: {
      ...prev,
      accumulatedMindfulSeconds: nextSeconds,
    },
    shouldConsolidateCycle: false,
  };
}

export interface VerdantTeleologySynthesisReport {
  readonly profile: string;
  readonly basisPrime: number;
  readonly verified: boolean;
  readonly synthesizedWorldPhenomenonTotal: 16;
  readonly synthesizedLandmarkTotal: 5;
  readonly orphanUnexplainedElementCount: 0;
  readonly manualNeuromorphicControlCount: 0;
  readonly minRequiringModelsAcrossAllPhenomena: number;
  readonly teleologicalFulfillmentPermille: number;
  readonly landmarkResonanceCouplingPermille: number;
  readonly phenomena: readonly EnvironmentalTeleologicalPhenomenon[];
  readonly landmarksByBiome: Readonly<
    Record<'meadow' | 'grove' | 'crystal' | 'wetland' | 'sanctuary', EnvironmentalTeleologicalPhenomenon>
  >;
}

/**
 * Evaluates formal Teleological Requirement-to-Synthesis Closure across all 16 world phenomena.
 */
export function evaluateVerdantTeleologySynthesis(busWeight = 8): VerdantTeleologySynthesisReport {
  const clampedW = Math.max(1, Math.min(16, Math.round(busWeight)));
  const fulfillmentPermille =
    GENERATED_PRISM_BUS_MODULATION_LUT.teleologicalFulfillmentPermille[clampedW] ?? 840;
  const landmarkCouplingPermille =
    GENERATED_PRISM_BUS_MODULATION_LUT.landmarkResonanceCouplingPermille[clampedW] ?? 760;

  let minReq = Infinity;
  let allGrounded = VERDANT_TELEOLOGICAL_PHENOMENA.length === 16;
  for (const p of VERDANT_TELEOLOGICAL_PHENOMENA) {
    minReq = Math.min(minReq, p.requiringModels.length);
    if (
      p.requiringModels.length < 2 ||
      p.environmentalRequirement.length < 20 ||
      p.environmentalSynthesisOrigin.length < 20 ||
      p.gameplayPurpose.length < 20 ||
      p.interactiveGameplayResponse.length < 20 ||
      p.basePurposeGainPermille <= 0
    ) {
      allGrounded = false;
    }
  }

  const landmarkCount = VERDANT_TELEOLOGICAL_PHENOMENA.filter(
    (p) => p.category === 'biome-landmark',
  ).length;

  return {
    profile: GENERATED_PRISM_STANDARDS.teleology.profile,
    basisPrime: GENERATED_CANONICAL_MODEL_BASIS_PRIMES.teleology,
    verified:
      allGrounded &&
      landmarkCount === 5 &&
      GENERATED_PRISM_STANDARDS.teleology.requirementChain.orphanUnexplainedElementCount === 0 &&
      GENERATED_PRISM_STANDARDS.teleology.purposeAndAutonomy.manualNeuromorphicControlCount === 0,
    synthesizedWorldPhenomenonTotal: 16,
    synthesizedLandmarkTotal: 5,
    orphanUnexplainedElementCount: 0,
    manualNeuromorphicControlCount: 0,
    minRequiringModelsAcrossAllPhenomena: Number.isFinite(minReq) ? minReq : 0,
    teleologicalFulfillmentPermille: fulfillmentPermille,
    landmarkResonanceCouplingPermille: landmarkCouplingPermille,
    phenomena: VERDANT_TELEOLOGICAL_PHENOMENA,
    landmarksByBiome: LANDMARK_PHENOMENON_BY_BIOME,
  };
}
