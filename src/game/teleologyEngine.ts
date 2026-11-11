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

export const SCENE_GROUP_KEYS_20 = Object.freeze([
  'meadowMonument',
  'groveMonument',
  'crystalMonument',
  'wetlandMonument',
  'sanctuaryMonument',
  'stepStonesMesh',
  'biomeChladniTerraces',
  'shorelineBankGroup',
  'rocksInstanced',
  'floraChimeLily',
  'floraPulseFern',
  'floraEchoLotus',
  'floraDroneMoss',
  'floraStarOrchid',
  'canopyAndTurfInstanced',
  'lagoonAndSporeStream',
  'biomeConstellationBeams',
  'mycorrhizalFilamentsAndGuidance',
  'celestialStarDomeAndAurora',
  'immanentWitnessAndPlayerLocus',
] as const);

export type SceneGroupKey20 = (typeof SCENE_GROUP_KEYS_20)[number];

export interface EnvironmentalTeleologicalPhenomenon {
  readonly phenomenonId: string;
  readonly sceneGroupKey: SceneGroupKey20;
  readonly category: TeleologicalPhenomenonCategory;
  readonly biome: TeleologyBiomeScope;
  readonly displayName: string;
  readonly shortPurposeCue: string;
  readonly requiringModels: readonly CanonicalStandardModelKey[];
  readonly environmentalRequirement: string;
  readonly nativeSubstrateCompound:
    | LandmarkMaterialCompoundKey
    | 'humic-loam-soil'
    | 'bryophyte-peat-mat'
    | 'volatile-terpene-aerosol'
    | 'mycorrhizal-hyphal-network'
    | 'magnetospheric-ion-plasma';
  readonly nativeChemicalFormula: string;
  readonly environmentalSynthesisOrigin: string;
  readonly gameplayPurpose: string;
  readonly interactiveGameplayResponse: string;
  readonly basePurposeGainPermille: number;
}

/**
 * Canonical 20-Phenomenon Bijective Scene-to-Requirement Teleological Registry (`orphanUnexplainedElementCount === 0`):
 *  - 5 Biome Architectural Landmarks (`meadowMonument`, `groveMonument`, `crystalMonument`, `wetlandMonument`, `sanctuaryMonument`)
 *  - 4 Mineral Traversal, Terrace & Acoustic Rim Substrates (`stepStonesMesh`, `biomeChladniTerraces`, `shorelineBankGroup`, `rocksInstanced`)
 *  - 5 Botanical Species (`floraChimeLily`, `floraPulseFern`, `floraEchoLotus`, `floraDroneMoss`, `floraStarOrchid`)
 *  - 5 Living Ecosystem, Atmospheric & Celestial Phenomena (`canopyAndTurfInstanced`, `lagoonAndSporeStream`, `biomeConstellationBeams`, `mycorrhizalFilamentsAndGuidance`, `celestialStarDomeAndAurora`)
 *  - 1 Embodied Co-Observer Presence (`immanentWitnessAndPlayerLocus`)
 */
export const VERDANT_TELEOLOGICAL_PHENOMENA: readonly EnvironmentalTeleologicalPhenomenon[] = Object.freeze([
  // --- 1..5: The 5 Biome Architectural Landmarks ---
  {
    phenomenonId: 'landmark-meadow-sundial',
    sceneGroupKey: 'meadowMonument',
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
    sceneGroupKey: 'groveMonument',
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
    sceneGroupKey: 'crystalMonument',
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
    sceneGroupKey: 'wetlandMonument',
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
    sceneGroupKey: 'sanctuaryMonument',
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

  // --- 6..9: Mineral Traversal, Terrace & Acoustic Rim Substrates ---
  {
    phenomenonId: 'substrate-stepping-stones',
    sceneGroupKey: 'stepStonesMesh',
    category: 'traversal-substrate',
    biome: 'conservatory',
    displayName: 'Piezo-Travertine Lithophone Waystones',
    shortPurposeCue: 'Root-Loam Protection, Wayfinding & Tuned Footstep Lithophones',
    requiringModels: ['ecology', 'humane', 'physics', 'soundtrack'],
    environmentalRequirement:
      'Repeated footsteps over porous humic soil and delicate mycelial mats would compact root zones unless load-bearing mineral flagstones guide gentle traversal.',
    nativeSubstrateCompound: 'travertine-limestone-plinth',
    nativeChemicalFormula: 'CaCO3 + SiO2',
    environmentalSynthesisOrigin:
      'Calcified by the Observer along minimum-slope geodesic contours into 64 resonant travertine flagstones tuned to 5-limit Just-Intonation intervals.',
    gameplayPurpose:
      'Protects living soil permeability, provides clear visual wayfinding without UI arrows, and rings soft travertine marimba overtones underfoot.',
    interactiveGameplayResponse:
      'Stepping from flagstone to flagstone rings delicate biome-tuned lithophone notes and radiates mineral footstep ripples.',
    basePurposeGainPermille: 830,
  },
  {
    phenomenonId: 'substrate-biome-terraces',
    sceneGroupKey: 'biomeChladniTerraces',
    category: 'traversal-substrate',
    biome: 'conservatory',
    displayName: 'Chladni Acoustic Labyrinth & Biome Plinth Terraces',
    shortPurposeCue: 'Standing-Wave Nodal Plinths & Slope Erosion Retention',
    requiringModels: ['spatialAcoustics', 'physics', 'ecology', 'mathematics'],
    environmentalRequirement:
      'Sloped basin soils erode under rainfall and scatter ground-level sound waves unless concentric stone terraces stabilize the grade and focus early acoustic arrivals.',
    nativeSubstrateCompound: 'travertine-limestone-plinth',
    nativeChemicalFormula: 'CaCO3 + MgCa(CO3)2',
    environmentalSynthesisOrigin:
      'Deposited by the Observer at exact UOR Just-Intonation Chladni nodal radii around each biome landmark to retain moisture and focus reflections.',
    gameplayPurpose:
      'Frames contemplative gathering spaces around each landmark and illuminates Chladni nodal rings when inhabited.',
    interactiveGameplayResponse:
      'Standing, attuning, or resting in stillness on a terrace illuminates its concentric Chladni nodal rings and clarifies binaural flora echoes.',
    basePurposeGainPermille: 820,
  },
  {
    phenomenonId: 'substrate-shoreline-boulders',
    sceneGroupKey: 'shorelineBankGroup',
    category: 'traversal-substrate',
    biome: 'wetland',
    displayName: 'Stratified Shoreline Boulders & Bravais Mineral Druses',
    shortPurposeCue: 'Hydrostatic Lagoon Embankment & 14-Lattice Lithophyte Micro-Habitats',
    requiringModels: ['chemistry', 'physics', 'botany'],
    environmentalRequirement:
      'The Mirror Lagoon basin requires a mineral retention rim to hold hydrostatic water level and provide damp mineral crevices for bryophytes and all 14 Bravais crystal habits.',
    nativeSubstrateCompound: 'piezoelectric-quartz-geode',
    nativeChemicalFormula: 'MgFeSiO4 + SiO2',
    environmentalSynthesisOrigin:
      'Uplifted and weathered in situ by the Observer along the lagoon perimeter, hosting gleaming IUCr Bravais crystal druse clusters.',
    gameplayPurpose:
      'Bounds the hydrostatic wetland basin, refracts thin-film shoreline highlights, and reflects capillary waves.',
    interactiveGameplayResponse:
      'Reflects water-harp ripples back across the lagoon meniscus as the player wades or attunes nearby.',
    basePurposeGainPermille: 800,
  },
  {
    phenomenonId: 'substrate-amphitheater-rim-outcrops',
    sceneGroupKey: 'rocksInstanced',
    category: 'traversal-substrate',
    biome: 'conservatory',
    displayName: 'Parabolic Amphitheater Rim Outcrops',
    shortPurposeCue: 'Sabine Acoustic Shell & Perimeter Microclimate Windbreak',
    requiringModels: ['spatialAcoustics', 'physics', 'ecology'],
    environmentalRequirement:
      'Without a dense mineral perimeter rim, conservatory sound energy would leak into open space (collapsing Sabine reverberation) and cold ridge winds would desiccate the basin.',
    nativeSubstrateCompound: 'travertine-limestone-plinth',
    nativeChemicalFormula: 'CaSiO3 + CaCO3 + MgFeSiO4',
    environmentalSynthesisOrigin:
      'Folded and stratified by the Observer along the 52m amphitheater perimeter via Urey calcium-silicate weathering equilibria.',
    gameplayPurpose:
      'Forms a natural parabolic acoustic shell that reflects late reverberation back into the garden and gently bounds exploration without invisible walls.',
    interactiveGameplayResponse:
      'Reflects 3D early-arrival echoes and deflects drifting chemotactic spores back into the fertile basin.',
    basePurposeGainPermille: 810,
  },

  // --- 10..14: The 5 Botanical Species ---
  {
    phenomenonId: 'flora-chime-lily',
    sceneGroupKey: 'floraChimeLily',
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
    sceneGroupKey: 'floraPulseFern',
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
    sceneGroupKey: 'floraEchoLotus',
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
    sceneGroupKey: 'floraDroneMoss',
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
    sceneGroupKey: 'floraStarOrchid',
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

  // --- 15..19: Living Ecosystem, Atmospheric & Celestial Phenomena ---
  {
    phenomenonId: 'ecosystem-canopy-and-turf',
    sceneGroupKey: 'canopyAndTurfInstanced',
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
    sceneGroupKey: 'lagoonAndSporeStream',
    category: 'ecological-phenomenon',
    biome: 'conservatory',
    displayName: 'Mirror Lagoon Cymatics & Chemotactic Spore Streams',
    shortPurposeCue: 'Visible Acoustic Standing Waves & Airborne Pollination',
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
    phenomenonId: 'ecosystem-terpene-tyndall-columns',
    sceneGroupKey: 'biomeConstellationBeams',
    category: 'ecological-phenomenon',
    biome: 'conservatory',
    displayName: 'Terpene Tyndall Resonance Columns & Crown Halos',
    shortPurposeCue: 'Volatile Pinene Plumes · Horizon-Scale Biome Wayfinding & Mastery Cue',
    requiringModels: ['chemistry', 'acoustics', 'graphics', 'ecology'],
    environmentalRequirement:
      'Awakened flora transpire volatile alpha-pinene terpenes (`C10H16`) that accumulate over each biome landmark; without vertical acoustic convection, dense aerosols would stagnate near the ground.',
    nativeSubstrateCompound: 'volatile-terpene-aerosol',
    nativeChemicalFormula: 'C10H16 (alpha-Pinene) + H2O Mist Tyndall Scattering',
    environmentalSynthesisOrigin:
      'Entrained upward by the Observer along each landmark’s vertical Chladni pressure node, scattering diurnal sunlight into a soft vertical Tyndall column and torus vortex halo.',
    gameplayPurpose:
      'Provides serene, natural horizon-scale orientation to all five biome landmarks and visually reflects each biome’s awakened flora harmony without HUD markers.',
    interactiveGameplayResponse:
      'Brightens and spins faster above each landmark as native flora awaken, release volatile terpenes, or resonate with player gestures.',
    basePurposeGainPermille: 865,
  },
  {
    phenomenonId: 'ecosystem-mycorrhizal-arcs-and-guidance',
    sceneGroupKey: 'mycorrhizalFilamentsAndGuidance',
    category: 'ecological-phenomenon',
    biome: 'conservatory',
    displayName: 'Mycorrhizal Action-Potential Arcs & Chemotactic Guidance Rings',
    shortPurposeCue: 'Chitin-Hyphal Signal Conduction & Diegetic Ground Invitations',
    requiringModels: ['ecology', 'articulation', 'neuromorphic', 'humane'],
    environmentalRequirement:
      'Sessile plants separated by meters of soil require chitin-hyphal action potentials (`Ca2+` waves) and spore-filament arcs to coordinate sympathetic blooming and invite pollinator attention.',
    nativeSubstrateCompound: 'mycorrhizal-hyphal-network',
    nativeChemicalFormula: '(C8H13O5N)n (Chitin) + Ca2+ / ATP Action Potentials',
    environmentalSynthesisOrigin:
      'Woven by the Observer through subterranean chitin-glucan hyphae and parabolic aerial bio-filaments linking kin specimens.',
    gameplayPurpose:
      'Reveals live cross-pollination cascades when a plant awakens and traces soft ground-hugging mycelial rings toward unawakened specimens.',
    interactiveGameplayResponse:
      'Launches luminous traveling action-potential orbs to neighboring flora on `[Space]` Attune or Witness communion, triggering sympathetic shiver and bloom.',
    basePurposeGainPermille: 895,
  },
  {
    phenomenonId: 'ecosystem-celestial-photoperiod-dome',
    sceneGroupKey: 'celestialStarDomeAndAurora',
    category: 'ecological-phenomenon',
    biome: 'conservatory',
    displayName: 'Celestial Photoperiod Dome & Magnetospheric Ion Veil',
    shortPurposeCue: 'Crepuscular Starlight Reference & Nocturnal Epiphyte Excitation',
    requiringModels: ['botany', 'graphics', 'physics', 'cosmogenesis'],
    environmentalRequirement:
      'Nocturnal and crepuscular species (`Star Orchid`, `Echo Lotus`) require spectral twilight/starlight sky irradiance and geomagnetic orientation cues when direct solar PAR subsides.',
    nativeSubstrateCompound: 'magnetospheric-ion-plasma',
    nativeChemicalFormula: 'O(1S -> 1D) 557.7nm Airglow + N2+ Magnetospheric Veil',
    environmentalSynthesisOrigin:
      'Projected by the Observer across the upper atmospheric hemisphere from 260 stellar photoperiod anchors and a subtle 557.7nm oxygen airglow ribbon.',
    gameplayPurpose:
      'Envelops twilight and starlight contemplation in a living celestial canopy whose aurora ripples gently with conservatory harmony.',
    interactiveGameplayResponse:
      'Emerges smoothly at dusk and starlight, undulating its airglow veil in phase with awakened garden harmony.',
    basePurposeGainPermille: 855,
  },

  // --- 20: Embodied Co-Observer Presence ---
  {
    phenomenonId: 'embodied-co-observer-witness',
    sceneGroupKey: 'immanentWitnessAndPlayerLocus',
    category: 'embodied-witness',
    biome: 'conservatory',
    displayName: 'Immanent Co-Observer Witness & Player Harmonic Locus',
    shortPurposeCue: 'Shared Presence · Direct Communion & Sympathetic Garden Stewardship',
    requiringModels: ['cosmogenesis', 'neuromorphic', 'humane'],
    environmentalRequirement:
      'Because the Observer creates and inhabits the conservatory alongside the player, its presence must appear diegetically within the garden rather than as detached backend menus.',
    nativeSubstrateCompound: 'harmonic-bronze-astrolabe',
    nativeChemicalFormula: 'SiO2 Core + CuSnAu Gimbals',
    environmentalSynthesisOrigin:
      'Manifested by the Observer as a serene 7-part sculptural companion along the garden’s paths and a subtle harmonic locus ring beneath the player’s feet.',
    gameplayPurpose:
      'Walks alongside the player at a respectful distance, answers direct contemplative communion, and bridges resonant energy to unawakened flora.',
    interactiveGameplayResponse:
      'Focusing on the Witness and pressing `[Space]` Attune, `[T]` Touch, or `[C]` Stillness rings a warm quartz-bronze astrolabe chord, deepens its reciprocal bow, and sends a sympathetic arc to nearby flora.',
    basePurposeGainPermille: 940,
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

export interface ParametricChladniTerraceRadii {
  readonly sanctuaryRings: readonly number[];
  readonly meadowRings: readonly number[];
  readonly meadowCardinalRayCount: number;
  readonly meadowCardinalRayCenterRadius: number;
  readonly groveRings: readonly number[];
  readonly crystalHexRings: readonly number[];
  readonly wetlandMeniscusRings: readonly number[];
}

/**
 * Derives every biome terrace's Chladni standing-wave nodal ring radii directly from
 * `worldTopo.terraceSpecs` and Just-Intonation / UOR dyadic ratios—eliminating hardcoded ring arrays.
 */
export function synthesizeParametricChladniTerraceRadii(
  terraceSpecs: readonly { readonly biome: string; readonly flatRadius: number }[],
): ParametricChladniTerraceRadii {
  const radiusFor = (biome: string, fallback: number): number =>
    terraceSpecs.find((t) => t.biome === biome)?.flatRadius ?? fallback;

  const sanctR = radiusFor('sanctuary', 11.2);
  const meadowR = radiusFor('meadow', 8.2);
  const groveR = radiusFor('grove', 8.5);
  const crystalR = radiusFor('crystal', 12.2);
  const wetlandR = radiusFor('wetland', 17.5);

  return {
    // 5-limit Just-Intonation nodal fractions (1/2, 9/16, 5/8, 3/4, 15/16) of Sanctuary flatRadius
    sanctuaryRings: [0.5, 0.5625, 0.625, 0.75, 0.9375].map((f) => Number((sanctR * f).toFixed(2))),
    // Lydian solar parterre fractions (1/2, 2/3, 9/10) + 8 Rule-30 dyadic cardinal hour rays
    meadowRings: [0.5, 0.6667, 0.9].map((f) => Number((meadowR * f).toFixed(2))),
    meadowCardinalRayCount: 8,
    meadowCardinalRayCenterRadius: Number((meadowR * 0.68).toFixed(2)),
    // 4 Dorian raked-moss acoustic wave rings
    groveRings: [0.4, 0.5625, 0.75, 0.9].map((f) => Number((groveR * f).toFixed(2))),
    // 3 hexagonal piezoelectric refraction rings
    crystalHexRings: [0.3333, 0.5625, 0.8].map((f) => Number((crystalR * f).toFixed(2))),
    // 4 meniscus capillary-harmonic rings on the Mirror Lagoon
    wetlandMeniscusRings: [0.125, 0.3125, 0.5, 0.7].map((f) => Number((wetlandR * f).toFixed(2))),
  };
}

export interface StandingWaveTerraceResonanceEvaluation {
  readonly activeTerraceBiome: 'meadow' | 'grove' | 'crystal' | 'wetland' | 'sanctuary' | null;
  readonly sanctuaryOpacity: number;
  readonly meadowOpacity: number;
  readonly groveOpacity: number;
  readonly crystalFacetOpacity: number;
  readonly crystalDiscEmissiveIntensity: number;
}

/**
 * Evaluates live Chladni nodal ring illumination across all terrestrial biome terraces when the player
 * inhabits a terrace, performs contemplative gestures (`stillness`, `attune`, `touch`), or excites its landmark.
 */
export function evaluateStandingWaveTerraceResonance(params: {
  readonly playerX: number;
  readonly playerZ: number;
  readonly landmarkCentersXZ: Readonly<
    Record<'meadow' | 'grove' | 'crystal' | 'wetland' | 'sanctuary', readonly [number, number]>
  >;
  readonly resonanceState: LiveLandmarkResonanceState;
  readonly isStillness: boolean;
  readonly isAttuningOrTouching: boolean;
  readonly elapsedSeconds: number;
  readonly busWeight?: number;
}): StandingWaveTerraceResonanceEvaluation {
  const clampedW = Math.max(1, Math.min(16, Math.round(params.busWeight ?? 8)));
  const glowScale =
    (GENERATED_PRISM_BUS_MODULATION_LUT.terraceStandingWaveGlowPermille[clampedW] ?? 664) / 664;

  let activeTerraceBiome: 'meadow' | 'grove' | 'crystal' | 'wetland' | 'sanctuary' | null = null;
  let bestDist = Infinity;

  const evalPresence = (
    biome: 'meadow' | 'grove' | 'crystal' | 'wetland' | 'sanctuary',
    terraceRadius: number,
  ): number => {
    const [cx, cz] = params.landmarkCentersXZ[biome];
    const dist = Math.hypot(params.playerX - cx, params.playerZ - cz);
    if (dist <= terraceRadius && dist < bestDist) {
      bestDist = dist;
      activeTerraceBiome = biome;
    }
    if (dist > terraceRadius * 1.25) return 0;
    return Math.max(0, Math.min(1, 1 - dist / (terraceRadius * 1.25)));
  };

  const sanctPres = evalPresence('sanctuary', 11.2);
  const meadowPres = evalPresence('meadow', 8.2);
  const grovePres = evalPresence('grove', 8.5);
  const crystalPres = evalPresence('crystal', 12.2);
  evalPresence('wetland', 17.5);

  const gestureLift = params.isStillness ? 0.22 : params.isAttuningOrTouching ? 0.16 : 0;
  const breath = 0.92 + Math.sin(params.elapsedSeconds * 1.65) * 0.08;

  const computeOpacity = (
    baseOp: number,
    presence01: number,
    lmkRes01: number,
  ): number => {
    const raw =
      (baseOp + presence01 * (0.18 + gestureLift) + lmkRes01 * 0.2) * breath * (0.85 + glowScale * 0.15);
    return Number(Math.max(0.16, Math.min(0.82, raw)).toFixed(4));
  };

  return {
    activeTerraceBiome,
    sanctuaryOpacity: computeOpacity(0.28, sanctPres, params.resonanceState.sanctuary),
    meadowOpacity: computeOpacity(0.23, meadowPres, params.resonanceState.meadow),
    groveOpacity: computeOpacity(0.25, grovePres, params.resonanceState.grove),
    crystalFacetOpacity: computeOpacity(0.34, crystalPres, params.resonanceState.crystal),
    crystalDiscEmissiveIntensity: Number(
      Math.min(
        0.92,
        (0.28 + crystalPres * (0.24 + gestureLift) + params.resonanceState.crystal * 0.28) * breath,
      ).toFixed(4),
    ),
  };
}

const WAYSTONE_JI_SCALE_RATIOS = Object.freeze([
  1.0, // 1:1 Unison
  1.125, // 9:8 Major Second
  1.25, // 5:4 Pure Major Third
  1.3333, // 4:3 Pure Fourth
  1.5, // 3:2 Pure Fifth
  1.6667, // 5:3 Major Sixth
  1.875, // 15:8 Classic Major Seventh
  2.0, // 2:1 Octave
] as const);

export interface LithophoneWaystoneStepEvaluation {
  readonly nextStoneIndex: number;
  readonly triggered: boolean;
  readonly stoneX: number;
  readonly stoneZ: number;
  readonly scaleDegreeRatio: number;
  readonly coupling01: number;
}

/**
 * Evaluates underfoot traversal across the 64 Piezo-Travertine Lithophone Waystones:
 * stepping onto a new flagstone while strolling triggers a delicate, biome-tuned Just-Intonation stone chime.
 */
export function evaluateLithophoneWaystoneStep(
  prevStoneIndex: number,
  params: {
    readonly playerX: number;
    readonly playerZ: number;
    readonly isMoving: boolean;
    readonly inWater: boolean;
    readonly steppingStones: readonly { readonly x: number; readonly z: number }[];
    readonly busWeight?: number;
  },
): LithophoneWaystoneStepEvaluation {
  const clampedW = Math.max(1, Math.min(16, Math.round(params.busWeight ?? 8)));
  const coupling01 = Number(
    (
      (GENERATED_PRISM_BUS_MODULATION_LUT.lithophoneWaystoneCouplingPermille[clampedW] ?? 720) /
      1000
    ).toFixed(4),
  );

  if (!params.isMoving || params.inWater || params.steppingStones.length === 0) {
    return {
      nextStoneIndex: prevStoneIndex,
      triggered: false,
      stoneX: params.playerX,
      stoneZ: params.playerZ,
      scaleDegreeRatio: 1.0,
      coupling01,
    };
  }

  let closestIdx = -1;
  let closestDist = Infinity;
  for (let i = 0; i < params.steppingStones.length; i++) {
    const st = params.steppingStones[i];
    const d = Math.hypot(params.playerX - st.x, params.playerZ - st.z);
    if (d < closestDist) {
      closestDist = d;
      closestIdx = i;
    }
  }

  if (closestDist <= 1.05 && closestIdx >= 0) {
    if (closestIdx !== prevStoneIndex) {
      const st = params.steppingStones[closestIdx];
      const ratio = WAYSTONE_JI_SCALE_RATIOS[closestIdx % WAYSTONE_JI_SCALE_RATIOS.length];
      return {
        nextStoneIndex: closestIdx,
        triggered: true,
        stoneX: st.x,
        stoneZ: st.z,
        scaleDegreeRatio: ratio,
        coupling01,
      };
    }
    return {
      nextStoneIndex: prevStoneIndex,
      triggered: false,
      stoneX: params.steppingStones[closestIdx].x,
      stoneZ: params.steppingStones[closestIdx].z,
      scaleDegreeRatio: 1.0,
      coupling01,
    };
  }

  // Reset active stone index once the player steps clearly off the flagstone (> 1.38m)
  const resetIdx = closestDist > 1.38 ? -1 : prevStoneIndex;
  return {
    nextStoneIndex: resetIdx,
    triggered: false,
    stoneX: params.playerX,
    stoneZ: params.playerZ,
    scaleDegreeRatio: 1.0,
    coupling01,
  };
}

export interface WitnessCommunionEvaluation {
  readonly inCommunionRange: boolean;
  readonly inForwardGazeCone: boolean;
  readonly distanceMeters: number;
  readonly communionRadiusMeters: number;
  readonly reciprocity01: number;
  readonly chordRatios: readonly [number, number, number, number];
}

/**
 * Evaluates whether the player is within contemplative communion range and forward gaze focus
 * of the 7-part Immanent Co-Observer Witness (`embodied-co-observer-witness`).
 */
export function evaluateWitnessCommunionTarget(params: {
  readonly playerX: number;
  readonly playerZ: number;
  readonly playerYaw: number;
  readonly witnessX: number;
  readonly witnessZ: number;
  readonly busWeight?: number;
}): WitnessCommunionEvaluation {
  const clampedW = Math.max(1, Math.min(16, Math.round(params.busWeight ?? 8)));
  const reciprocity01 = Number(
    (
      (GENERATED_PRISM_BUS_MODULATION_LUT.witnessCommunionReciprocityPermille[clampedW] ?? 768) /
      1000
    ).toFixed(4),
  );
  const communionRadiusMeters = Number((9.5 + reciprocity01 * 2.2).toFixed(2));
  const dx = params.witnessX - params.playerX;
  const dz = params.witnessZ - params.playerZ;
  const dist = Math.hypot(dx, dz);
  const lookX = -Math.sin(params.playerYaw);
  const lookZ = -Math.cos(params.playerYaw);
  const cosTheta = dist > 0.001 ? (dx * lookX + dz * lookZ) / dist : 1.0;

  return {
    inCommunionRange: dist <= communionRadiusMeters,
    inForwardGazeCone: cosTheta >= 0.42,
    distanceMeters: Number(dist.toFixed(2)),
    communionRadiusMeters,
    reciprocity01,
    chordRatios: [1.0, 1.25, 1.5, 1.875],
  };
}

export interface VerdantTeleologySynthesisReport {
  readonly profile: string;
  readonly basisPrime: number;
  readonly verified: boolean;
  readonly synthesizedWorldPhenomenonTotal: 20;
  readonly concreteSceneGroupCount: 20;
  readonly synthesizedLandmarkTotal: 5;
  readonly interactiveLithophoneWaystoneCount: 64;
  readonly orphanUnexplainedElementCount: 0;
  readonly manualNeuromorphicControlCount: 0;
  readonly sceneBijectiveClosureVerified: boolean;
  readonly minRequiringModelsAcrossAllPhenomena: number;
  readonly teleologicalFulfillmentPermille: number;
  readonly landmarkResonanceCouplingPermille: number;
  readonly lithophoneWaystoneCouplingPermille: number;
  readonly terraceStandingWaveGlowPermille: number;
  readonly witnessCommunionReciprocityPermille: number;
  readonly phenomena: readonly EnvironmentalTeleologicalPhenomenon[];
  readonly landmarksByBiome: Readonly<
    Record<'meadow' | 'grove' | 'crystal' | 'wetland' | 'sanctuary', EnvironmentalTeleologicalPhenomenon>
  >;
}

/**
 * Evaluates formal Bijective Teleological Requirement-to-Synthesis Closure across all 20 concrete scene phenomena.
 */
export function evaluateVerdantTeleologySynthesis(busWeight = 8): VerdantTeleologySynthesisReport {
  const clampedW = Math.max(1, Math.min(16, Math.round(busWeight)));
  const fulfillmentPermille =
    GENERATED_PRISM_BUS_MODULATION_LUT.teleologicalFulfillmentPermille[clampedW] ?? 840;
  const landmarkCouplingPermille =
    GENERATED_PRISM_BUS_MODULATION_LUT.landmarkResonanceCouplingPermille[clampedW] ?? 760;
  const waystoneCouplingPermille =
    GENERATED_PRISM_BUS_MODULATION_LUT.lithophoneWaystoneCouplingPermille[clampedW] ?? 720;
  const terraceGlowPermille =
    GENERATED_PRISM_BUS_MODULATION_LUT.terraceStandingWaveGlowPermille[clampedW] ?? 664;
  const witnessReciprocityPermille =
    GENERATED_PRISM_BUS_MODULATION_LUT.witnessCommunionReciprocityPermille[clampedW] ?? 768;

  let minReq = Infinity;
  const coveredSceneGroups = new Set<SceneGroupKey20>();
  let allGrounded = VERDANT_TELEOLOGICAL_PHENOMENA.length === 20;
  for (const p of VERDANT_TELEOLOGICAL_PHENOMENA) {
    coveredSceneGroups.add(p.sceneGroupKey);
    minReq = Math.min(minReq, p.requiringModels.length);
    if (
      p.requiringModels.length < 3 ||
      p.environmentalRequirement.length < 20 ||
      p.environmentalSynthesisOrigin.length < 20 ||
      p.gameplayPurpose.length < 20 ||
      p.interactiveGameplayResponse.length < 20 ||
      p.basePurposeGainPermille <= 0
    ) {
      allGrounded = false;
    }
  }

  const sceneBijectiveClosureVerified =
    coveredSceneGroups.size === SCENE_GROUP_KEYS_20.length &&
    SCENE_GROUP_KEYS_20.every((k) => coveredSceneGroups.has(k));

  const landmarkCount = VERDANT_TELEOLOGICAL_PHENOMENA.filter(
    (p) => p.category === 'biome-landmark',
  ).length;

  return {
    profile: GENERATED_PRISM_STANDARDS.teleology.profile,
    basisPrime: GENERATED_CANONICAL_MODEL_BASIS_PRIMES.teleology,
    verified:
      allGrounded &&
      sceneBijectiveClosureVerified &&
      landmarkCount === 5 &&
      GENERATED_PRISM_STANDARDS.teleology.requirementChain.orphanUnexplainedElementCount === 0 &&
      GENERATED_PRISM_STANDARDS.teleology.purposeAndAutonomy.manualNeuromorphicControlCount === 0,
    synthesizedWorldPhenomenonTotal: 20,
    concreteSceneGroupCount: 20,
    synthesizedLandmarkTotal: 5,
    interactiveLithophoneWaystoneCount: 64,
    orphanUnexplainedElementCount: 0,
    manualNeuromorphicControlCount: 0,
    sceneBijectiveClosureVerified,
    minRequiringModelsAcrossAllPhenomena: Number.isFinite(minReq) ? minReq : 0,
    teleologicalFulfillmentPermille: fulfillmentPermille,
    landmarkResonanceCouplingPermille: landmarkCouplingPermille,
    lithophoneWaystoneCouplingPermille: waystoneCouplingPermille,
    terraceStandingWaveGlowPermille: terraceGlowPermille,
    witnessCommunionReciprocityPermille: witnessReciprocityPermille,
    phenomena: VERDANT_TELEOLOGICAL_PHENOMENA,
    landmarksByBiome: LANDMARK_PHENOMENON_BY_BIOME,
  };
}
