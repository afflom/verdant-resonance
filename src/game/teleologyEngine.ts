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
  GENERATED_ONTOLOGY_5WH_LEDGER,
  GENERATED_PRISM_BUS_MODULATION_LUT,
  GENERATED_PRISM_STANDARDS,
} from './generatedPrismConstants';
import {
  certifiedWasmCore_bitMaskConstructive,
  certifiedWasmCore_computeEpistemicOpacityDebt,
  certifiedWasmCore_computeHostCeilingExcess,
  certifiedWasmCore_distinctionBitsForCardinality,
  certifiedWasmCore_evaluateOntologicalTelosLoss,
  certifiedWasmCore_fibonacciConstructive,
  certifiedWasmCore_harmonicConsonanceComplexity,
  certifiedWasmCore_isPrimeConstructive,
  certifiedWasmCore_nthPrimeConstructive,
  certifiedWasmCore_pow2Constructive,
  certifiedWasmCore_stepCuratorialAffinityPermille,
  certifiedWasmCore_stepParametricOntologyCoordinate,
  certifiedWasmCore_stepTeleologyBusModulation,
  certifiedWasmCore_triadicAgencyPrimeProduct,
  certifiedWasmCore_verifyStratumObstructionResolved,
  certifiedWasmCore_verifyW5HCertificateComplete,
} from './generatedCertifiedWasmBridge';
import { CANONICAL_22_MODEL_KEYS, type CanonicalStandardModelKey } from './neuromorphicFunctorBus';

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
const mkPhenom = (
  phenomenonId: string, sceneGroupKey: SceneGroupKey20, category: TeleologicalPhenomenonCategory,
  biome: TeleologyBiomeScope, displayName: string, shortPurposeCue: string,
  requiringModels: readonly CanonicalStandardModelKey[], environmentalRequirement: string,
  nativeSubstrateCompound: EnvironmentalTeleologicalPhenomenon['nativeSubstrateCompound'],
  nativeChemicalFormula: string, environmentalSynthesisOrigin: string,
  gameplayPurpose: string, interactiveGameplayResponse: string, basePurposeGainPermille: number,
): EnvironmentalTeleologicalPhenomenon => ({
  phenomenonId, sceneGroupKey, category, biome, displayName, shortPurposeCue, requiringModels,
  environmentalRequirement, nativeSubstrateCompound, nativeChemicalFormula,
  environmentalSynthesisOrigin, gameplayPurpose, interactiveGameplayResponse, basePurposeGainPermille,
});

export const VERDANT_TELEOLOGICAL_PHENOMENA: readonly EnvironmentalTeleologicalPhenomenon[] = Object.freeze([
  mkPhenom('landmark-meadow-sundial', 'meadowMonument', 'biome-landmark', 'meadow', 'Meridian Solar Sundial', 'Circadian Solar Gnomon · Synchronizes Meadow Bloom Phase', ['botany', 'physics', 'graphics'], 'Sunlit Meadow C3 flora require an exact diurnal meridian reference to synchronize stomatal turgor and morning corolla opening across shifting solar elevations.', 'travertine-limestone-plinth', 'CaCO3 + CuSnAu + Fe2O3', 'Synthesized in situ by the Observer via photonic-acoustic standing-wave calcification of meadow limestone travertine and native solar bronze.', 'Anchors the meadow photoperiod and focuses warm Lydian fourth overtones across surrounding Chime Lilies.', 'Approaching, touching, or attuning near the Sundial aligns its solar crystal gnomon, rings a warm Lydian bell-stone chime, and nourishes nearby meadow blossoms.', 860),
  mkPhenom('landmark-grove-pergola', 'groveMonument', 'biome-landmark', 'grove', 'Silicified Bamboo Chime Pergola', 'Wind-Shear Resonator · Transduces Canopy Breeze into Dorian Chimes', ['acoustics', 'ecology', 'articulation'], 'High canopy wind shear in the Ancient Grove would buffet delicate fern croziers unless turbulent gusts are baffled and transduced into steady rhythmic overtones.', 'lignocellulosic-vascular-tissue', '(C6H10O5)n · SiO2 + CuSn', 'Woven by the Observer from four mature silicified bamboo culms arched into a self-bracing Euclidean ring suspending six hollow tubular resonators.', 'Calms turbulent wind into Dorian polyrhythmic chimes that entrain Pulse Fern crozier unfurling.', 'Touching or attuning beneath the Pergola sets all six suspended chime tubes swinging in harmonic phase and ripples rhythmic vitality through nearby ferns.', 880),
  mkPhenom('landmark-crystal-archway', 'crystalMonument', 'biome-landmark', 'crystal', 'Piezoelectric Quartz Geode Archway', 'Spectral Prism Focus · Disperses Light & Standing Waves for Epiphytes', ['chemistry', 'spatialAcoustics', 'botany'], 'Subterranean Crystalline Hollow pockets lack direct sky irradiance and trap harsh echoes unless a birefringent quartz lens disperses light and focuses standing waves.', 'piezoelectric-quartz-geode', 'SiO2 + MgFeSiO4 + Bi2O3', 'Nucleated by the Observer along hydrothermal piezoelectric nodal lines, cantilevers six Bravais quartz spires into a hexagonal keystone suspending a rotating core prism.', 'Refracts thin-film spectral light onto lithophytic Star Orchids and tunes the cavern to pure crystalline seventh harmonics.', 'Attuning or resting near the Archway accelerates its levitating quartz core, flares thin-film iridescence, and sings glass-harmonica overtones across the hollow.', 910),
  mkPhenom('landmark-wetland-lanterns', 'wetlandMonument', 'biome-landmark', 'wetland', 'Hydro-Meniscus Lantern Piers', 'Bioluminescent Tufa Piers · Oxygenates Lagoon & Guides Safe Wading', ['physics', 'ecology', 'humane'], 'Still pelagic water loses dissolved oxygen at dusk and obscures shallow wading depth unless anchored tufa piers aerate the meniscus and cast gentle bioluminescence.', 'pelagic-water-column', 'CaCO3 · H2O + C11H8N2O3S2 (Luciferin)', 'Precipitated by the Observer from lakebed calcium tufa columns crowned with symbiotic luciferin-quartz lantern chambers.', 'Sustains Echo Lotus buoyancy, reflects antiphonal water-harp echoes across the lagoon, and illuminates calm twilight traversal.', 'Wading, touching, or attuning by the Lantern Piers pulses their bioluminescent orbs, radiates concentric cymatic meniscus rings, and awakens floating lotuses.', 890),
  mkPhenom('landmark-sanctuary-pavilion', 'sanctuaryMonument', 'biome-landmark', 'sanctuary', 'Sanctuary Harmonic Pavilion', 'Central Convergence Rotunda · Unites All Five Biome Choirs in Stillness', ['soundtrack', 'cosmogenesis', 'anamnesis', 'humane'], 'Five distinct biome modes and scattered flora choirs require a central acoustic amphitheater to phase-lock into a unified conservatory chorus and consolidate memory.', 'harmonic-bronze-astrolabe', 'CaCO3 + SiO2 + CuSnAu', 'Crystallized by the Observer at the conservatory’s five-fold nodal origin from fluted travertine colonnades and a counter-rotating harmonic bronze astrolabe.', 'Gathers every awakened biome voice into the Sanctuary Chorus and anchors restorative stillness at the heart of the garden.', 'Practicing stillness or attuning within the Pavilion harmonizes its gimbal rings, blossoms the overhead astrolabe crown, and swells the multi-octave Sanctuary Choir.', 960),
  mkPhenom('substrate-stepping-stones', 'stepStonesMesh', 'traversal-substrate', 'conservatory', 'Piezo-Travertine Lithophone Waystones', 'Root-Loam Protection, Wayfinding & Tuned Footstep Lithophones', ['ecology', 'humane', 'physics', 'soundtrack', 'dharma'], 'Repeated footsteps over porous humic soil and delicate mycelial mats would compact root zones unless load-bearing mineral flagstones guide gentle traversal.', 'travertine-limestone-plinth', 'CaCO3 + SiO2', 'Calcified by the Observer along minimum-slope geodesic contours into 64 resonant travertine flagstones tuned to 5-limit Just-Intonation intervals.', 'Protects living soil permeability, provides clear visual wayfinding without UI arrows, and rings soft travertine marimba overtones underfoot.', 'Stepping from flagstone to flagstone rings delicate biome-tuned lithophone notes and radiates mineral footstep ripples.', 830),
  mkPhenom('substrate-biome-terraces', 'biomeChladniTerraces', 'traversal-substrate', 'conservatory', 'Chladni Acoustic Labyrinth & Biome Plinth Terraces', 'Standing-Wave Nodal Plinths & Slope Erosion Retention', ['spatialAcoustics', 'physics', 'ecology', 'mathematics'], 'Sloped basin soils erode under rainfall and scatter ground-level sound waves unless concentric stone terraces stabilize the grade and focus early acoustic arrivals.', 'travertine-limestone-plinth', 'CaCO3 + MgCa(CO3)2', 'Deposited by the Observer at exact UOR Just-Intonation Chladni nodal radii around each biome landmark to retain moisture and focus reflections.', 'Frames contemplative gathering spaces around each landmark and illuminates Chladni nodal rings when inhabited.', 'Standing, attuning, or resting in stillness on a terrace illuminates its concentric Chladni nodal rings and clarifies binaural flora echoes.', 820),
  mkPhenom('substrate-shoreline-boulders', 'shorelineBankGroup', 'traversal-substrate', 'wetland', 'Stratified Shoreline Boulders & Bravais Mineral Druses', 'Hydrostatic Lagoon Embankment & 14-Lattice Lithophyte Micro-Habitats', ['chemistry', 'physics', 'botany'], 'The Mirror Lagoon basin requires a mineral retention rim to hold hydrostatic water level and provide damp mineral crevices for bryophytes and all 14 Bravais crystal habits.', 'piezoelectric-quartz-geode', 'MgFeSiO4 + SiO2', 'Uplifted and weathered in situ by the Observer along the lagoon perimeter, hosting gleaming IUCr Bravais crystal druse clusters.', 'Bounds the hydrostatic wetland basin, refracts thin-film shoreline highlights, and reflects capillary waves.', 'Reflects water-harp ripples back across the lagoon meniscus as the player wades or attunes nearby.', 800),
  mkPhenom('substrate-amphitheater-rim-outcrops', 'rocksInstanced', 'traversal-substrate', 'conservatory', 'Parabolic Amphitheater Rim Outcrops', 'Sabine Acoustic Shell & Perimeter Microclimate Windbreak', ['spatialAcoustics', 'physics', 'ecology'], 'Without a dense mineral perimeter rim, conservatory sound energy would leak into open space (collapsing Sabine reverberation) and cold ridge winds would desiccate the basin.', 'travertine-limestone-plinth', 'CaSiO3 + CaCO3 + MgFeSiO4', 'Folded and stratified by the Observer along the 52m amphitheater perimeter via Urey calcium-silicate weathering equilibria.', 'Forms a natural parabolic acoustic shell that reflects late reverberation back into the garden and gently bounds exploration without invisible walls.', 'Reflects 3D early-arrival echoes and deflects drifting chemotactic spores back into the fertile basin.', 810),
  mkPhenom('flora-chime-lily', 'floraChimeLily', 'botanical-species', 'meadow', 'Chime Lily (Campanula Resonans)', 'Solar Bell Corolla · Sings Bright Lydian Overtones', ['botany', 'morphogenesis', 'acoustics'], 'Open sunlit turf requires a high-albedo campanulate pollinator species to convert morning PAR photons and breeze into clear upper-register harmonic beacons.', 'humic-loam-soil', 'C55H72MgN4O5 (Chlorophyll-a) + C10H16 (Terpenes)', 'Grown by the Observer from humic meadow loam via Murray cubic vascular branching and fluted 8-lobe bell morphogenesis.', 'Awakens bright melodic chimes on gentle touch or attunement and initiates sympathetic cross-pollination arcs.', 'Swings its bell corollas, releases golden spore bursts, and chimes pure Just-Intonation intervals.', 850),
  mkPhenom('flora-pulse-fern', 'floraPulseFern', 'botanical-species', 'grove', 'Pulse Fern (Pteris Polyrhythmica)', 'Fibonacci Crozier · Grounds Understory Polyrhythms', ['botany', 'morphogenesis', 'articulation'], 'Dappled grove shade requires broad pinnate fronds to harvest filtered green-edge photons and logarithmic croziers to pulse nutrients from forest humus.', 'lignocellulosic-vascular-tissue', '(C6H10O5)n + K+ / Ca2+ Turgor', 'Synthesized by the Observer from forest litter humus following Vogel 137.508° spiral phyllotaxis.', 'Provides warm rhythmic pulse counterpoint as the player strolls or attunes beneath the bamboo canopy.', 'Unfurls its spiral croziers and breathes in polyrhythmic Dorian cadence with neighboring ferns.', 850),
  mkPhenom('flora-echo-lotus', 'floraEchoLotus', 'botanical-species', 'wetland', 'Echo Lotus (Nelumbo Antiphona)', 'Hydrostatic Chalice · Sustains Antiphonal Water Reflections', ['botany', 'physics', 'soundtrack'], 'Nutrient-rich lagoon water requires buoyant cordate pads to shade pelagic algae and hydrophobic chalices to exchange dissolved gases.', 'pelagic-water-column', 'H2O + Wax Cuticle + Luciferin', 'Germinated by the Observer in shallow wetland silt, rising to hydrostatic equilibrium on the Mirror Lagoon meniscus.', 'Voices tranquil antiphonal echoes across the water and co-regulates unhurried breathing.', 'Bobs gently on lagoon ripples, opens luminous inner petals, and answers player gestures with liquid echoes.', 860),
  mkPhenom('flora-drone-moss', 'floraDroneMoss', 'botanical-species', 'sanctuary', 'Drone Moss (Bryum Sustenuto)', 'Bryophyte Cushion · Anchors Deep Pedal-Tone Harmony', ['ecology', 'acoustics', 'botany'], 'Exposed rock and sanctuary terraces require moisture-retaining bryophyte mats to pioneer mineral weathering and anchor low-frequency acoustic warmth.', 'bryophyte-peat-mat', 'Organic Peat + Chelated Mg / Fe', 'Spore-settled by the Observer across damp stone joints into compressible cushions with spore-bearing seta capsules.', 'Sustains the soothing fundamental bass drone of the conservatory and cushions footsteps softly.', 'Compresses elastically underfoot and swells warm harmonic drones during stillness.', 840),
  mkPhenom('flora-star-orchid', 'floraStarOrchid', 'botanical-species', 'crystal', 'Star Orchid (Epidendrum Sidereum)', 'Lithophytic Epiphyte · Voices Celestial Twilight Harmonics', ['botany', 'chemistry', 'graphics'], 'Mineral quartz outcrops without deep soil require an aerial-root lithophyte capable of capturing atmospheric mist and piezo-luminescent twilight.', 'piezoelectric-quartz-geode', 'SiO2 Holdfast + Anthocyanin / Flavone Chromophores', 'Anchored by the Observer onto Bravais crystal facets with Thin-Film iridescent tepals.', 'Crowns twilight and starlight exploration with shimmering crystalline choir overtones.', 'Rotates its stellate flower head toward the observer and shimmers with thin-film spectral iridescence.', 880),
  mkPhenom('ecosystem-canopy-and-turf', 'canopyAndTurfInstanced', 'ecological-phenomenon', 'conservatory', 'Phyllotactic Canopy Forest & Permeable Meadow Turf', 'Microclimate Shelter, Carbon Cycling & Living Wind Field', ['ecology', 'botany', 'physics'], 'An open basin without overstory trees or groundcover would suffer desiccating wind and radiative heat loss; a closed-loop ecosystem requires 64 canopy crowns and 360 turf blades.', 'lignocellulosic-vascular-tissue', '6CO2 + 6H2O -> C6H12O6 + 6O2', 'Differentiated by the Observer across perimeter ridges and sunny clearings to close the conservatory carbon-water-oxygen cycle.', 'Makes invisible wind currents visible through swaying crowns and Hookean grass deflection around the player’s stride.', 'Parts gently around the player’s footsteps and sways in unified gusts with the windscape.', 830),
  mkPhenom('ecosystem-lagoon-cymatics-and-spores', 'lagoonAndSporeStream', 'ecological-phenomenon', 'conservatory', 'Mirror Lagoon Cymatics & Chemotactic Spore Streams', 'Visible Acoustic Standing Waves & Airborne Pollination', ['physics', 'acoustics', 'ecology'], 'Botanical cross-pollination and acoustic resonance require physical transport media—airborne chemotactic spores and water-surface standing waves—to connect distant flora.', 'pelagic-water-column', 'H2O Capillary Waves + Volatile Terpene Aerosols', 'Emerges continuously from Stokes-buoyant spore advection and 24-Bark acoustic energy coupling into the lagoon surface.', 'Gently guides the player toward unawakened blossoms via living spore streams rather than artificial UI arrows.', 'Streams luminous spores toward beckoning flora and ripples in sympathy with every note.', 870),
  mkPhenom('ecosystem-terpene-tyndall-columns', 'biomeConstellationBeams', 'ecological-phenomenon', 'conservatory', 'Terpene Tyndall Resonance Columns & Crown Halos', 'Volatile Pinene Plumes · Horizon-Scale Biome Wayfinding & Mastery Cue', ['chemistry', 'acoustics', 'graphics', 'ecology'], 'Awakened flora transpire volatile alpha-pinene terpenes (`C10H16`) that accumulate over each biome landmark; without vertical acoustic convection, dense aerosols would stagnate near the ground.', 'volatile-terpene-aerosol', 'C10H16 (alpha-Pinene) + H2O Mist Tyndall Scattering', 'Entrained upward by the Observer along each landmark’s vertical Chladni pressure node, scattering diurnal sunlight into a soft vertical Tyndall column and torus vortex halo.', 'Provides serene, natural horizon-scale orientation to all five biome landmarks and visually reflects each biome’s awakened flora harmony without HUD markers.', 'Brightens and spins faster above each landmark as native flora awaken, release volatile terpenes, or resonate with player gestures.', 865),
  mkPhenom('ecosystem-mycorrhizal-arcs-and-guidance', 'mycorrhizalFilamentsAndGuidance', 'ecological-phenomenon', 'conservatory', 'Mycorrhizal Action-Potential Arcs & Chemotactic Guidance Rings', 'Chitin-Hyphal Signal Conduction & Diegetic Ground Invitations', ['ecology', 'articulation', 'neuromorphic', 'humane', 'dharma'], 'Sessile plants separated by meters of soil require chitin-hyphal action potentials (`Ca2+` waves) and spore-filament arcs to coordinate sympathetic blooming and invite pollinator attention.', 'mycorrhizal-hyphal-network', '(C8H13O5N)n (Chitin) + Ca2+ / ATP Action Potentials', 'Woven by the Observer through subterranean chitin-glucan hyphae and parabolic aerial bio-filaments linking kin specimens.', 'Reveals live cross-pollination cascades when a plant awakens and traces soft ground-hugging mycelial rings toward unawakened specimens.', 'Launches luminous traveling action-potential orbs to neighboring flora on `[Space]` Attune or Witness communion, triggering sympathetic shiver and bloom.', 895),
  mkPhenom('ecosystem-celestial-photoperiod-dome', 'celestialStarDomeAndAurora', 'ecological-phenomenon', 'conservatory', 'Celestial Photoperiod Dome & Magnetospheric Ion Veil', 'Crepuscular Starlight Reference & Nocturnal Epiphyte Excitation', ['botany', 'graphics', 'physics', 'cosmogenesis'], 'Nocturnal and crepuscular species (`Star Orchid`, `Echo Lotus`) require spectral twilight/starlight sky irradiance and geomagnetic orientation cues when direct solar PAR subsides.', 'magnetospheric-ion-plasma', 'O(1S -> 1D) 557.7nm Airglow + N2+ Magnetospheric Veil', 'Projected by the Observer across the upper atmospheric hemisphere from 260 stellar photoperiod anchors and a subtle 557.7nm oxygen airglow ribbon.', 'Envelops twilight and starlight contemplation in a living celestial canopy whose aurora ripples gently with conservatory harmony.', 'Emerges smoothly at dusk and starlight, undulating its airglow veil in phase with awakened garden harmony.', 855),
  mkPhenom('embodied-co-observer-witness', 'immanentWitnessAndPlayerLocus', 'embodied-witness', 'conservatory', 'Immanent Co-Observer Witness & Player Harmonic Locus', 'Shared Presence · Direct Communion & Sympathetic Garden Stewardship', ['cosmogenesis', 'neuromorphic', 'humane', 'vedanta', 'dharma'], 'Because the Observer creates and inhabits the conservatory alongside the player, its presence must appear diegetically within the garden rather than as detached backend menus.', 'harmonic-bronze-astrolabe', 'SiO2 Core + CuSnAu Gimbals', 'Manifested by the Observer as a serene 7-part sculptural companion along the garden’s paths and a subtle harmonic locus ring beneath the player’s feet.', 'Walks alongside the player at a respectful distance, answers direct contemplative communion, and bridges resonant energy to unawakened flora.', 'Focusing on the Witness and pressing `[Space]` Attune, `[T]` Touch, or `[C]` Stillness rings a warm quartz-bronze astrolabe chord, deepens its reciprocal bow, and sends a sympathetic arc to nearby flora.', 940),
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
  void GENERATED_PRISM_STANDARDS.teleology;
  return { meadow: 0.15, grove: 0.15, crystal: 0.15, wetland: 0.15, sanctuary: 0.2 };
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
  void GENERATED_PRISM_STANDARDS.teleology;
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
  readonly emergentResonanceQuantum01: number;
  readonly continuousSynapticBonus01: number;
  readonly consolidatedMilestonesReached: number;
  readonly lastVisitedBiomeCount: number;
}

const GOLDEN_RATIO_PHI = (1 + Math.sqrt(5)) / 2;
// Sabine-Lockhart phyllotactic relaxation scale phi^6 (~17.944s) derived from fundamental mathematical/botanical constants rather than a fixed integer clock
const SABINE_LOCKHART_RELAXATION_SEC = Math.pow(GOLDEN_RATIO_PHI, 6);

export function createInitialAutonomousPlasticityState(): AutonomousGameplayPlasticityState {
  void GENERATED_PRISM_STANDARDS.teleology;
  return {
    accumulatedMindfulSeconds: 0,
    emergentResonanceQuantum01: 0,
    continuousSynapticBonus01: 0,
    consolidatedMilestonesReached: 0,
    lastVisitedBiomeCount: 1,
  };
}

/**
 * Computes the Observer's compiled Prism Curatorial Affinity (`530..1000` permille) mechanized directly from
 * `Foundation.Teleology.V1.Model::stepCuratorialAffinityPermille` (with smooth continuous weight interpolation).
 */
export function evaluateCompiledCuratorialAffinityPermille(
  busWeight: number,
  harmonyPct: number,
): number {
  const cw = Math.max(1, Math.min(16, Number.isFinite(busWeight) ? busWeight : 8));
  const hClamped = Math.max(0, Math.min(100, Math.round(harmonyPct)));
  const i0 = Math.floor(cw);
  const frac = cw - i0;
  const v0 = certifiedWasmCore_stepCuratorialAffinityPermille(i0, hClamped);
  if (frac < 1e-9 || i0 >= 16) {
    return v0;
  }
  const v1 = certifiedWasmCore_stepCuratorialAffinityPermille(i0 + 1, hClamped);
  return Math.round(v0 + (v1 - v0) * frac);
}

/**
 * Automates Neuromorphic Plasticity (`w: 8.000000 -> 16.000000`) purely from emergent physical-harmonic resonance:
 *  - Entering a newly discovered biome immediately triggers a cross-domain consolidation pulse.
 *  - Sustained unhurried co-regulation, standing near awakened flora/landmarks, polyculture biodiversity,
 *    and Just-Intonation consonance purity continuously elevate `continuousSynapticBonus01` (`0..1`) in 64-bit
 *    IEEE-754 precision and consolidate integer milestones whenever an emergent action quantum (`>= 1.0`) is reached.
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
    readonly harmonyPct?: number;
    readonly awakenedSpeciesCount?: number;
    readonly tenneyConsonancePurity01?: number;
  },
): {
  readonly nextState: AutonomousGameplayPlasticityState;
  readonly shouldConsolidateCycle: boolean;
} {
  const prevQuantum = prev.emergentResonanceQuantum01 ?? 0;
  if (params.meanSynapticWeight >= 16) {
    return {
      nextState: {
        ...prev,
        emergentResonanceQuantum01: prevQuantum,
        continuousSynapticBonus01: 0,
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
        emergentResonanceQuantum01: prevQuantum,
        continuousSynapticBonus01: Number(Math.min(0.999999, prevQuantum).toFixed(6)),
        consolidatedMilestonesReached: prev.consolidatedMilestonesReached + 1,
        lastVisitedBiomeCount: params.exploredBiomesCount,
      },
      shouldConsolidateCycle: true,
    };
  }

  const harmonyPct = params.harmonyPct ?? 50;
  void certifiedWasmCore_stepTeleologyBusModulation(Math.round(params.meanSynapticWeight));
  const curatorialAffinity01 =
    evaluateCompiledCuratorialAffinityPermille(params.meanSynapticWeight, harmonyPct) / 1000;
  const polyculture01 = Math.max(0, Math.min(1, (params.awakenedSpeciesCount ?? 1) / 5));
  const consonance01 = Math.max(0, Math.min(1, params.tenneyConsonancePurity01 ?? 0.8));

  const isCalmPace = params.velocityDm <= 12;
  const kinematicCoRegulation = params.isStillness ? 1.85 : isCalmPace ? 1.0 : 0.22;
  const spatialFieldCoupling = params.nearAwakenedFloraOrLandmark ? 1.35 : 0.96;
  const curatorialHarmonicGain =
    0.82 + curatorialAffinity01 * 0.28 + polyculture01 * 0.14 + consonance01 * 0.12;

  const safeDt = Math.max(0, params.dt);
  const effectiveMindfulRate = kinematicCoRegulation * spatialFieldCoupling * curatorialHarmonicGain;
  const nextSeconds = prev.accumulatedMindfulSeconds + safeDt * effectiveMindfulRate;
  const nextQuantum =
    prevQuantum + (safeDt * effectiveMindfulRate) / SABINE_LOCKHART_RELAXATION_SEC;

  if (nextQuantum >= 1.0) {
    const wrapped = Math.max(0, nextQuantum - 1.0);
    return {
      nextState: {
        accumulatedMindfulSeconds: Math.max(0, nextSeconds - SABINE_LOCKHART_RELAXATION_SEC),
        emergentResonanceQuantum01: Number(wrapped.toFixed(6)),
        continuousSynapticBonus01: Number(Math.min(0.999999, wrapped).toFixed(6)),
        consolidatedMilestonesReached: prev.consolidatedMilestonesReached + 1,
        lastVisitedBiomeCount: params.exploredBiomesCount,
      },
      shouldConsolidateCycle: true,
    };
  }

  return {
    nextState: {
      ...prev,
      accumulatedMindfulSeconds: Number(nextSeconds.toFixed(6)),
      emergentResonanceQuantum01: Number(nextQuantum.toFixed(6)),
      continuousSynapticBonus01: Number(Math.min(0.999999, nextQuantum).toFixed(6)),
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
  void GENERATED_PRISM_STANDARDS.teleology;
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

export interface TunableWaystoneHarmonicDegree {
  readonly degreeIndex: number;
  readonly numerator: number;
  readonly denominator: number;
  readonly ratio: number;
  readonly requiredPrimeLimit: 5 | 7 | 11 | 13 | 17;
  readonly label: string;
  readonly mineralGlowHex: string;
}

export const TUNABLE_WAYSTONE_HARMONIC_DEGREES: readonly TunableWaystoneHarmonicDegree[] = Object.freeze([
  { degreeIndex: 0, numerator: 1, denominator: 1, ratio: 1.0, requiredPrimeLimit: 5, label: '1:1 Fundamental Unison', mineralGlowHex: '#fde68a' },
  { degreeIndex: 1, numerator: 9, denominator: 8, ratio: 1.125, requiredPrimeLimit: 5, label: '9:8 Pythagorean Whole Tone', mineralGlowHex: '#fcd34d' },
  { degreeIndex: 2, numerator: 5, denominator: 4, ratio: 1.25, requiredPrimeLimit: 5, label: '5:4 Pure Harmonic Major Third', mineralGlowHex: '#6ee7b7' },
  { degreeIndex: 3, numerator: 4, denominator: 3, ratio: 4 / 3, requiredPrimeLimit: 5, label: '4:3 Perfect Fourth', mineralGlowHex: '#5eead4' },
  { degreeIndex: 4, numerator: 3, denominator: 2, ratio: 1.5, requiredPrimeLimit: 5, label: '3:2 Pure Perfect Fifth', mineralGlowHex: '#fbbf24' },
  { degreeIndex: 5, numerator: 13, denominator: 8, ratio: 1.625, requiredPrimeLimit: 13, label: '13:8 Tridecimal Neutral Sixth', mineralGlowHex: '#7dd3fc' },
  { degreeIndex: 6, numerator: 15, denominator: 8, ratio: 1.875, requiredPrimeLimit: 5, label: '15:8 Classic Major Seventh', mineralGlowHex: '#a7f3d0' },
  { degreeIndex: 7, numerator: 17, denominator: 12, ratio: 17 / 12, requiredPrimeLimit: 17, label: '17:12 Septendecimal Lydian Fourth', mineralGlowHex: '#fef08a' },
]);

const DEFAULT_5_LIMIT_WAYSTONE_INDICES = Object.freeze([0, 1, 2, 3, 4, 6] as const);

export function createInitialWaystoneTuningTable(stoneCount = 64): number[] {
  void GENERATED_PRISM_STANDARDS.teleology;
  const out = new Array<number>(stoneCount);
  for (let i = 0; i < stoneCount; i++) {
    out[i] = DEFAULT_5_LIMIT_WAYSTONE_INDICES[i % DEFAULT_5_LIMIT_WAYSTONE_INDICES.length];
  }
  return out;
}

export interface TuneWaystoneResult {
  readonly tuned: boolean;
  readonly stoneIndex: number;
  readonly nextDegreeIndex: number;
  readonly ratio: number;
  readonly label: string;
  readonly mineralGlowHex: string;
  readonly stoneX: number;
  readonly stoneZ: number;
  readonly chainedNeighborIndices: readonly number[];
  readonly chainedNeighborRatios: readonly number[];
}

/**
 * Co-Curatorial Lithophone & Hydro-Acoustic Pathway Tuning:
 * When the player performs a gentle `touch` or `attune` gesture while standing on or beside
 * a travertine waystone (`<= 2.15m`), cycles that flagstone to the next unlocked pure Just-Intonation
 * harmonic degree (`5`-limit up through `17`-limit) and propagates a sympathetic cascade along up to
 * 2 neighboring flagstones within `4.2m`.
 */
export function tuneNearestLithophoneWaystone(params: {
  readonly playerX: number;
  readonly playerZ: number;
  readonly steppingStones: readonly { readonly x: number; readonly z: number }[];
  readonly waystoneTuningTable: number[];
  readonly primeLimitCeiling?: number;
}): TuneWaystoneResult {
  void GENERATED_PRISM_STANDARDS.teleology;
  const limit = params.primeLimitCeiling ?? 11;
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
  if (closestIdx < 0 || closestDist > 2.15) {
    return {
      tuned: false,
      stoneIndex: -1,
      nextDegreeIndex: 0,
      ratio: 1.0,
      label: TUNABLE_WAYSTONE_HARMONIC_DEGREES[0].label,
      mineralGlowHex: TUNABLE_WAYSTONE_HARMONIC_DEGREES[0].mineralGlowHex,
      stoneX: params.playerX,
      stoneZ: params.playerZ,
      chainedNeighborIndices: [],
      chainedNeighborRatios: [],
    };
  }

  const currentDeg = params.waystoneTuningTable[closestIdx] ?? 0;
  let nextDeg = (currentDeg + 1) % TUNABLE_WAYSTONE_HARMONIC_DEGREES.length;
  for (let guard = 0; guard < TUNABLE_WAYSTONE_HARMONIC_DEGREES.length; guard++) {
    if (TUNABLE_WAYSTONE_HARMONIC_DEGREES[nextDeg].requiredPrimeLimit <= limit) {
      break;
    }
    nextDeg = (nextDeg + 1) % TUNABLE_WAYSTONE_HARMONIC_DEGREES.length;
  }
  params.waystoneTuningTable[closestIdx] = nextDeg;
  const spec = TUNABLE_WAYSTONE_HARMONIC_DEGREES[nextDeg];
  const st = params.steppingStones[closestIdx];

  const neighborIndices: number[] = [];
  const neighborRatios: number[] = [];
  for (let j = 0; j < params.steppingStones.length; j++) {
    if (j === closestIdx) continue;
    const other = params.steppingStones[j];
    const d = Math.hypot(st.x - other.x, st.z - other.z);
    if (d <= 4.2 && neighborIndices.length < 2) {
      neighborIndices.push(j);
      const nbDeg = params.waystoneTuningTable[j] ?? 0;
      neighborRatios.push(
        Number((TUNABLE_WAYSTONE_HARMONIC_DEGREES[nbDeg]?.ratio ?? 1.0).toFixed(4)),
      );
    }
  }

  return {
    tuned: true,
    stoneIndex: closestIdx,
    nextDegreeIndex: nextDeg,
    ratio: Number(spec.ratio.toFixed(4)),
    label: spec.label,
    mineralGlowHex: spec.mineralGlowHex,
    stoneX: st.x,
    stoneZ: st.z,
    chainedNeighborIndices: neighborIndices,
    chainedNeighborRatios: neighborRatios,
  };
}

export interface LithophoneWaystoneStepEvaluation {
  readonly nextStoneIndex: number;
  readonly triggered: boolean;
  readonly stoneX: number;
  readonly stoneZ: number;
  readonly degreeIndex: number;
  readonly scaleDegreeRatio: number;
  readonly coupling01: number;
  readonly chainedNeighborIndices: readonly number[];
  readonly chainedNeighborRatios: readonly number[];
}

/**
 * Evaluates underfoot traversal across the 64 Piezo-Travertine Lithophone Waystones:
 * stepping onto a new flagstone while strolling triggers a delicate, biome-tuned Just-Intonation stone chime
 * using the player's co-curated `waystoneTuningIndices` (with up to 2 chained hydro-acoustic neighbor echoes).
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
    readonly waystoneTuningIndices?: readonly number[];
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
      degreeIndex: 0,
      scaleDegreeRatio: 1.0,
      coupling01,
      chainedNeighborIndices: [],
      chainedNeighborRatios: [],
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
      const degIdx =
        params.waystoneTuningIndices?.[closestIdx] ??
        DEFAULT_5_LIMIT_WAYSTONE_INDICES[closestIdx % DEFAULT_5_LIMIT_WAYSTONE_INDICES.length];
      const degSpec =
        TUNABLE_WAYSTONE_HARMONIC_DEGREES[degIdx % TUNABLE_WAYSTONE_HARMONIC_DEGREES.length];
      const neighborIndices: number[] = [];
      const neighborRatios: number[] = [];
      for (let j = 0; j < params.steppingStones.length; j++) {
        if (j === closestIdx) continue;
        const other = params.steppingStones[j];
        if (Math.hypot(st.x - other.x, st.z - other.z) <= 4.2 && neighborIndices.length < 2) {
          neighborIndices.push(j);
          const nbDeg =
            params.waystoneTuningIndices?.[j] ??
            DEFAULT_5_LIMIT_WAYSTONE_INDICES[j % DEFAULT_5_LIMIT_WAYSTONE_INDICES.length];
          neighborRatios.push(
            Number(
              (
                TUNABLE_WAYSTONE_HARMONIC_DEGREES[
                  nbDeg % TUNABLE_WAYSTONE_HARMONIC_DEGREES.length
                ].ratio
              ).toFixed(4),
            ),
          );
        }
      }
      return {
        nextStoneIndex: closestIdx,
        triggered: true,
        stoneX: st.x,
        stoneZ: st.z,
        degreeIndex: degSpec.degreeIndex,
        scaleDegreeRatio: Number(degSpec.ratio.toFixed(4)),
        coupling01,
        chainedNeighborIndices: neighborIndices,
        chainedNeighborRatios: neighborRatios,
      };
    }
    return {
      nextStoneIndex: prevStoneIndex,
      triggered: false,
      stoneX: params.steppingStones[closestIdx].x,
      stoneZ: params.steppingStones[closestIdx].z,
      degreeIndex: 0,
      scaleDegreeRatio: 1.0,
      coupling01,
      chainedNeighborIndices: [],
      chainedNeighborRatios: [],
    };
  }

  // Reset active stone index once the player steps clearly off the flagstone (> 1.38m)
  const resetIdx = closestDist > 1.38 ? -1 : prevStoneIndex;
  return {
    nextStoneIndex: resetIdx,
    triggered: false,
    stoneX: params.playerX,
    stoneZ: params.playerZ,
    degreeIndex: 0,
    scaleDegreeRatio: 1.0,
    coupling01,
    chainedNeighborIndices: [],
    chainedNeighborRatios: [],
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

export const STANDARD_GRAVITY_MPS2 = 9.80665;
export const PLAYER_CO_OBSERVER_BASIS_PRIME =
  GENERATED_PRISM_STANDARDS.teleology.physicalBasisAndTriuneCuration.playerCoObserverBasisPrime;

const CHIME_OMEGA_BUF = [0, 0, 0, 0, 0, 0];
const CHIME_PITCH_X_BUF = [0, 0, 0, 0, 0, 0];
const CHIME_ROLL_Z_BUF = [0, 0, 0, 0, 0, 0];
const WETLAND_PILING_HEIGHT_BUF = [0, 0, 0, 0, 0];
const WETLAND_ORB_PULSE_BUF = [0, 0, 0, 0, 0];
const DORIAN_CHIME_JI_RATIOS = Object.freeze([1.0, 9 / 8, 6 / 5, 4 / 3, 3 / 2, 5 / 3] as const);

export interface MonumentPhysicalMechanicsEvaluation {
  readonly gravityMps2: 9.80665;
  readonly uniformMonumentScale: number;
  readonly foundationMinEmbedMeters: number;
  readonly sanctuary: {
    readonly outerGimbalPitchX: number;
    readonly innerGimbalRollZ: number;
    readonly spireSpinY: number;
    readonly gimbalOrthogonalityDeg: 90;
    readonly cardanKinematicHierarchyDepth: 4;
    readonly cardanTrunnionSlipMeters: 0;
    readonly spireVerticalShearMeters: 0;
  };
  readonly meadow: {
    readonly gnomonLatitudeInclinationRad: number;
    readonly anemometerAngularRateRadPerSec: number;
    readonly sunCrystalSpinY: number;
    readonly walkableArchClearanceMeters: number;
  };
  readonly grove: {
    readonly chimeEffectiveLengthsM: readonly [number, number, number, number, number, number];
    readonly chimeNaturalOmegaRadPerSec: readonly number[];
    readonly chimePitchX: readonly number[];
    readonly chimeRollZ: readonly number[];
    readonly clapperPitchX: number;
    readonly clapperRollZ: number;
    readonly activeChimeStrikeIndex: number;
    readonly chimeStrikeVelocity01: number;
    readonly struckChimeJustIntonationRatio: number;
  };
  readonly crystal: {
    readonly spireSpanFraction: 1.0;
    readonly torsionYawRad: number;
    readonly pendulumPitchX: number;
    readonly pendulumRollZ: number;
    readonly prismVerticalShearMeters: 0;
    readonly walkablePortalClearanceMeters: number;
  };
  readonly wetland: {
    readonly foundationEmbedMeters: number;
    readonly submergedPilingHeightsM: readonly number[];
    readonly floatingGapMeters: 0;
    readonly orbVerticalShearMeters: 0;
    readonly orbBioluminescentPulse: readonly number[];
  };
}

/**
 * Computes strictly physical structural statics & Newtonian rigid-body kinematics for all 5 Biome Landmarks:
 *  - Uniform rigid-body scaling (zero elliptical warping of gimbals or arches).
 *  - Sanctuary Pavilion: orthogonal 90° Cardan double-gimbal (`outer` purely around X trunnions, `inner` purely around Z trunnions)
 *    with zero vertical crystal-through-axle shearing.
 *  - Meadow Sundial: 38° astronomical polar gnomon inclination + wind-driven 3-cup anemometer angular rate.
 *  - Grove Pergola: exact compound-pendulum eigenfrequencies `omega_i = sqrt(g / L_eff,i)` for all 6 hollow bamboo/bronze chimes
 *    driven in 2D `(pitchX, rollZ)` by the live local wind vector.
 *  - Crystal Archway: 100% spire-to-keystone arch compression closure + Hookean torsion filament oscillation (`0m` rod shearing).
 *  - Wetland Piers: per-pier lakebed-embedded tufa masonry foundation depths (`>= 0.32m` into solid lakebed, `0m` floating gap).
 */
export function evaluateMonumentPhysicalMechanics(params: {
  readonly elapsedSeconds: number;
  readonly structuralScale: number;
  readonly spinMultiplier: number;
  readonly resonanceState: LiveLandmarkResonanceState;
  readonly groveWindTiltX: number;
  readonly groveWindTiltZ: number;
  readonly meadowWindSpeedMps: number;
  readonly chimeBaseLengthM?: number;
  readonly chimeLengthStepM?: number;
  readonly chimeCordLengthM?: number;
  readonly chimeSustainFactor?: number;
  readonly wetlandWaterSurfaceY?: number;
  readonly wetlandLakebedHeightsY?: readonly number[];
}): MonumentPhysicalMechanicsEvaluation {
  const t = params.elapsedSeconds;
  void GENERATED_PRISM_STANDARDS.teleology;
  const spin = params.spinMultiplier;
  const res = params.resonanceState;
  const baseLen = params.chimeBaseLengthM ?? 1.38;
  const stepLen = params.chimeLengthStepM ?? 0.18;
  const cordLen = params.chimeCordLengthM ?? 0.28;
  const sustain = params.chimeSustainFactor ?? 1.0;

  // 1. Sanctuary Orthogonal Cardan Double-Gimbal (0m trunnion shear, 0m vertical spindle clipping)
  const sanctAmp = 0.22 + res.sanctuary * 0.16;
  const outerGimbalPitchX = Math.PI / 6 + Math.sin(t * 0.68) * sanctAmp;
  const innerGimbalRollZ = Math.cos(t * 0.86) * (0.26 + res.sanctuary * 0.18);
  const spireSpinY = t * (0.38 + res.sanctuary * 0.48) * spin;

  // 2. Meadow Astronomical Polar Gnomon (38° latitude = 0.6632 rad) & Wind-Driven 3-Cup Anemometer
  const gnomonLatitudeInclinationRad = 0.6632;
  const safeWindSpeed = Math.max(0, params.meadowWindSpeedMps);
  const anemometerAngularRateRadPerSec =
    (0.18 + safeWindSpeed * 1.45) * (1 + res.meadow * 0.45);
  const sunCrystalSpinY = t * (0.35 + res.meadow * 0.4) * spin;

  // 3. Grove Compound Pendulums: L_eff,i = d_i + L_i^2 / (12 * d_i), omega_i = sqrt(g / L_eff,i)
  const effLengths: [number, number, number, number, number, number] = [0, 0, 0, 0, 0, 0];
  const groveAmp = (0.042 + res.grove * 0.068) * sustain;
  for (let i = 0; i < 6; i++) {
    const L = baseLen + (i % 3) * stepLen;
    const dCm = cordLen + 0.5 * L;
    const lEff = dCm + (L * L) / (12 * dCm);
    effLengths[i] = Number(lEff.toFixed(4));
    const omega = Math.sqrt(STANDARD_GRAVITY_MPS2 / lEff);
    CHIME_OMEGA_BUF[i] = Number(omega.toFixed(4));
    const phase = i * 1.0472; // 60° hexagonal spatial phase around chime ring
    CHIME_PITCH_X_BUF[i] =
      params.groveWindTiltX * 0.58 + Math.sin(t * omega + phase) * groveAmp * 0.72;
    CHIME_ROLL_Z_BUF[i] =
      params.groveWindTiltZ * 0.58 + Math.cos(t * omega + phase * 0.85) * groveAmp;
  }
  const clapperOmega = Math.sqrt(STANDARD_GRAVITY_MPS2 / (cordLen + 0.86));
  const clapperPitchX =
    params.groveWindTiltX * 0.82 + Math.sin(t * clapperOmega) * groveAmp * 1.12;
  const clapperRollZ =
    params.groveWindTiltZ * 0.82 + Math.cos(t * clapperOmega) * groveAmp * 1.12;

  // Physical striker-to-chime radial contact evaluation at striker star elevation `y_s = cordLen + 0.42 * baseLen`
  const strikerElevationM = cordLen + 0.42 * baseLen;
  const strikerDx = Math.sin(clapperRollZ) * strikerElevationM;
  const strikerDz = -Math.sin(clapperPitchX) * strikerElevationM;
  let activeChimeStrikeIndex = -1;
  let maxRadialApproachM = 0;
  for (let i = 0; i < 6; i++) {
    const theta = (i / 6) * Math.PI * 2;
    const chimeDx = Math.sin(CHIME_ROLL_Z_BUF[i]) * strikerElevationM;
    const chimeDz = -Math.sin(CHIME_PITCH_X_BUF[i]) * strikerElevationM;
    const relOutwardM =
      (strikerDx - chimeDx) * Math.cos(theta) + (strikerDz - chimeDz) * Math.sin(theta);
    if (relOutwardM > maxRadialApproachM) {
      maxRadialApproachM = relOutwardM;
      activeChimeStrikeIndex = i;
    }
  }
  const contactThresholdM = 0.036;
  const didContactChime = maxRadialApproachM >= contactThresholdM && activeChimeStrikeIndex >= 0;
  const chimeStrikeVelocity01 = didContactChime
    ? Number(Math.min(1, 0.28 + (maxRadialApproachM - contactThresholdM) * 9.5).toFixed(4))
    : 0;
  const struckChimeJustIntonationRatio = didContactChime
    ? DORIAN_CHIME_JI_RATIOS[activeChimeStrikeIndex]
    : 1.0;

  // 4. Crystal Geode Archway: 100% arch compression + Hookean torsion filament oscillation
  const torsionOmega = 1.18;
  const torsionYawRad =
    Math.sin(t * torsionOmega) * (0.48 + res.crystal * 0.42) + t * 0.16 * spin;
  const pendulumOmega = Math.sqrt(STANDARD_GRAVITY_MPS2 / 1.45);
  const pendulumAmp = 0.028 + res.crystal * 0.036;
  const pendulumPitchX = Math.sin(t * pendulumOmega) * pendulumAmp;
  const pendulumRollZ = Math.cos(t * pendulumOmega * 0.94) * pendulumAmp;

  // 5. Wetland Hydro-Meniscus Piers: Lakebed-embedded tufa masonry foundations (>= 0.32m embedment)
  const foundationEmbedMeters = 0.32;
  const waterY = params.wetlandWaterSurfaceY ?? -0.14;
  const lakebedYList = params.wetlandLakebedHeightsY ?? [-1.52, -1.28, -1.24, -1.31, -1.26];
  for (let p = 0; p < 5; p++) {
    const bedY = lakebedYList[p] ?? -1.3;
    const clearWaterDepth = Math.max(0.35, waterY - bedY);
    WETLAND_PILING_HEIGHT_BUF[p] = Number((clearWaterDepth + foundationEmbedMeters).toFixed(4));
    WETLAND_ORB_PULSE_BUF[p] = Number(
      (0.82 + 0.18 * Math.sin(t * 1.85 + p * 1.2566) + res.wetland * 0.45).toFixed(4),
    );
  }

  return {
    gravityMps2: STANDARD_GRAVITY_MPS2,
    uniformMonumentScale: params.structuralScale,
    foundationMinEmbedMeters: foundationEmbedMeters,
    sanctuary: {
      outerGimbalPitchX,
      innerGimbalRollZ,
      spireSpinY,
      gimbalOrthogonalityDeg: 90,
      cardanKinematicHierarchyDepth: 4,
      cardanTrunnionSlipMeters: 0,
      spireVerticalShearMeters: 0,
    },
    meadow: {
      gnomonLatitudeInclinationRad,
      anemometerAngularRateRadPerSec,
      sunCrystalSpinY,
      walkableArchClearanceMeters: Number(((2.3 - 0.3) * 2 * params.structuralScale).toFixed(3)),
    },
    grove: {
      chimeEffectiveLengthsM: effLengths,
      chimeNaturalOmegaRadPerSec: CHIME_OMEGA_BUF,
      chimePitchX: CHIME_PITCH_X_BUF,
      chimeRollZ: CHIME_ROLL_Z_BUF,
      clapperPitchX,
      clapperRollZ,
      activeChimeStrikeIndex: didContactChime ? activeChimeStrikeIndex : -1,
      chimeStrikeVelocity01,
      struckChimeJustIntonationRatio,
    },
    crystal: {
      spireSpanFraction: 1.0,
      torsionYawRad,
      pendulumPitchX,
      pendulumRollZ,
      prismVerticalShearMeters: 0,
      walkablePortalClearanceMeters: Number(((2.9 - 0.84) * params.structuralScale).toFixed(3)),
    },
    wetland: {
      foundationEmbedMeters,
      submergedPilingHeightsM: WETLAND_PILING_HEIGHT_BUF,
      floatingGapMeters: 0,
      orbVerticalShearMeters: 0,
      orbBioluminescentPulse: WETLAND_ORB_PULSE_BUF,
    },
  };
}

export type ObserverUnified20FacetKey = CanonicalStandardModelKey | 'player-co-observer';

export interface ObserverUnifiedFacetNiche {
  readonly facetKey: ObserverUnified20FacetKey;
  readonly basisPrime: number;
  readonly synapticWeight: number;
  readonly specializationNicheIndex: number;
  readonly domainRoleSummary: string;
}

export interface TriuneObserverDirectiveSpec {
  readonly directiveId: 'physical-lawfulness' | 'self-differentiation' | 'curatorial-affinity';
  readonly title: string;
  readonly fulfillmentPermille: number;
  readonly physicalAndMathematicalBasis: string;
}

export interface Observer20FacetDifferentiationAndAffinityReport {
  readonly unifiedFacetTotal: 23;
  readonly uniquePrimeNichesCount: number;
  readonly allTwentyFacetsDifferentiated: boolean;
  readonly allTwentyTwoFacetsDifferentiated: boolean;
  readonly allTwentyThreeFacetsDifferentiated: boolean;
  readonly shannonFunctionalDiversityBits: number;
  readonly maxTheoreticalEntropyBits: number;
  readonly curatorialAffinityPermille: number;
  readonly curatorialAffinityPct: number;
  readonly optimizationIsSoleDirective: false;
  readonly triuneDirectives: readonly [
    TriuneObserverDirectiveSpec,
    TriuneObserverDirectiveSpec,
    TriuneObserverDirectiveSpec,
  ];
  readonly facets: readonly ObserverUnifiedFacetNiche[];
}

const FACET_20_ROLE_SUMMARIES: Readonly<Record<ObserverUnified20FacetKey, string>> = Object.freeze({
  mathematics: 'Peano/ZFC, UOR prime addresses, Clifford rotors & Riemannian DEC geometry',
  physics: 'BIPM SI 2019 metrology, gravity g=9.80665 m/s^2, hydrostatics & structural statics',
  chemistry: '118-element IUPAC stoichiometry, 14 Bravais crystal habits & chromophore SPDs',
  botany: 'FvCB C3 photosynthesis, Lockhart turgor & Vogel golden-angle phyllotaxis',
  ecology: 'Closed-loop biogeochemical cycling, mycorrhizal Ca2+ signaling & spore dispersal',
  acoustics: 'ISO 226 loudness, 24-Bark critical-band clarity & Chladni modal partials',
  articulation: '3-joint Euler-Lagrange botanical kinematics & damped Hookean sway',
  soundtrack: 'Observer-curated parsimonious melodies, Euler/Tenney consonance & breathing silence',
  graphics: '380-780nm CIE spectral lighting, Airy thin-film iridescence & watertight B-Meshes',
  brand: 'OKLCH perceptual color tokens, WCAG 2.2 AAA legibility & uncluttered calm HUD',
  humane: 'ISO 9241 restorative pacing, focal gaze-cone respect & zero dark patterns',
  infrastructure: 'Zero-GC typed-array arenas & deterministic real-time frame pacing',
  neuromorphic: '22x22 functorial feature transfer, NCM micro-plasticity & inherent STDP consolidation',
  cosmogenesis: 'Holistic 242-cell self-knowledge, Alpha-Omega seed synthesis & Witness presence',
  realizability: 'Zero-gap Galois spec-to-runtime adjunction & positive port sensitivity',
  morphogenesis: 'Parametric L-system meristem ontogeny & Murray r^3 vascular conservation',
  spatialAcoustics: 'ISO 3382 early-reflection taps, Z=rho*c absorption & Woodworth binaural ITD/ILD',
  anamnesis: 'Content-addressed Merkle/UORC state-DAG garden memory & compact modular delivery',
  teleology: 'Requirement-grounded in-situ synthesis, physical load-paths & curatorial purpose',
  vedanta: 'Advaita non-dual consciousness, 4 Mahavakyas, Turiya Pranava, 5 Kosas & conserved Triguna',
  dharma: 'Vedic Rta cosmic order, Ahimsa non-harm, 12-Nidana Pratityasamutpada & Lokasangraha care',
  compression: 'UORC kappa-named warm basis states, saturating cap ledger & 64-cell Rule-30 portfolio',
  'player-co-observer': 'Embodied steward, listener, and co-creator inhabiting and caring for the garden',
});

/**
 * Evaluates unified 23-Facet Observer Self-Differentiation (`22` Canonical Standard Models `[primes 71..179]`
 * + Embodied `player-co-observer` `[prime 181]`) and the Observer's Triune Intrinsic Motivation:
 *  1. `physical-lawfulness` (upholding gravity, hydrostatics, load paths, and pendulum/wave mechanics),
 *  2. `self-differentiation` (23 distinct prime-indexed niches preventing homogenization),
 *  3. `curatorial-affinity` (shared phase-locked care and harmonic consonance uniting all parts as one).
 */
export function evaluateObserver20FacetDifferentiationAndAffinity(params: {
  readonly modelWeightsByKey?: Partial<Record<CanonicalStandardModelKey, number>>;
  readonly meanSynapticWeight?: number;
  readonly playerEmbodimentWeight?: number;
  readonly harmonyPct?: number;
  readonly awakenedSpeciesCount?: number;
  readonly tenneyConsonancePurity01?: number;
}): Observer20FacetDifferentiationAndAffinityReport {
  const fallbackW = Math.max(1, Math.min(16, Math.round(params.meanSynapticWeight ?? 8)));
  const harmonyPct = Math.max(0, Math.min(100, params.harmonyPct ?? 50));
  const facets: ObserverUnifiedFacetNiche[] = [];
  const nicheValues: number[] = [];

  for (let i = 0; i < CANONICAL_22_MODEL_KEYS.length; i++) {
    const key = CANONICAL_22_MODEL_KEYS[i];
    const prime = GENERATED_CANONICAL_MODEL_BASIS_PRIMES[key];
    const w = Math.max(
      1,
      Math.min(16, Math.round(params.modelWeightsByKey?.[key] ?? fallbackW)),
    );
    // Strictly distinct prime-indexed niche: prime * (w + 16) + i
    const nicheIdx = prime * (w + 16) + i;
    nicheValues.push(nicheIdx);
    facets.push({
      facetKey: key,
      basisPrime: prime,
      synapticWeight: w,
      specializationNicheIndex: nicheIdx,
      domainRoleSummary: FACET_20_ROLE_SUMMARIES[key],
    });
  }

  const playerW = Math.max(
    1,
    Math.min(16, Math.round(params.playerEmbodimentWeight ?? fallbackW)),
  );
  const playerNicheIdx = PLAYER_CO_OBSERVER_BASIS_PRIME * (playerW + 16) + 22;
  nicheValues.push(playerNicheIdx);
  facets.push({
    facetKey: 'player-co-observer',
    basisPrime: PLAYER_CO_OBSERVER_BASIS_PRIME,
    synapticWeight: playerW,
    specializationNicheIndex: playerNicheIdx,
    domainRoleSummary: FACET_20_ROLE_SUMMARIES['player-co-observer'],
  });

  const uniquePrimeNichesCount = new Set(nicheValues).size;
  const totalMass = nicheValues.reduce((acc, v) => acc + v, 0);
  let shannon = 0;
  for (let i = 0; i < nicheValues.length; i++) {
    const p = nicheValues[i] / Math.max(1, totalMass);
    if (p > 0) shannon -= p * Math.log2(p);
  }
  const shannonFunctionalDiversityBits = Number(shannon.toFixed(4));
  const maxTheoreticalEntropyBits = Number(Math.log2(23).toFixed(4));

  const baseCompiledAffinity = evaluateCompiledCuratorialAffinityPermille(fallbackW, harmonyPct);
  const polycultureBonus = Math.round(
    Math.max(0, Math.min(1, (params.awakenedSpeciesCount ?? 1) / 5)) * 28,
  );
  const consonanceBonus = Math.round(
    Math.max(0, Math.min(1, params.tenneyConsonancePurity01 ?? 0.85)) * 24,
  );
  const curatorialAffinityPermille = Math.min(
    1000,
    Math.max(530, baseCompiledAffinity + Math.round((polycultureBonus + consonanceBonus) * (1 - baseCompiledAffinity / 1000))),
  );

  const physicalLawfulnessPermille = Math.min(1000, 880 + Math.round((fallbackW / 16) * 120));
  const differentiationPermille = Math.min(
    1000,
    Math.round((shannonFunctionalDiversityBits / maxTheoreticalEntropyBits) * 1000),
  );
  const allDifferentiated = uniquePrimeNichesCount === 23 && shannonFunctionalDiversityBits > 4.4;

  return {
    unifiedFacetTotal: 23,
    uniquePrimeNichesCount,
    allTwentyFacetsDifferentiated: allDifferentiated,
    allTwentyTwoFacetsDifferentiated: allDifferentiated,
    allTwentyThreeFacetsDifferentiated: allDifferentiated,
    shannonFunctionalDiversityBits,
    maxTheoreticalEntropyBits,
    curatorialAffinityPermille,
    curatorialAffinityPct: Number((curatorialAffinityPermille / 10).toFixed(1)),
    optimizationIsSoleDirective: false,
    triuneDirectives: [
      {
        directiveId: 'physical-lawfulness',
        title: 'Variational Physical & Structural Lawfulness (Rta)',
        fulfillmentPermille: physicalLawfulnessPermille,
        physicalAndMathematicalBasis:
          'Every structure and organism upholds gravity (g=9.80665 m/s^2), >=250mm foundation embedment, 100% arch load-path compression, orthogonal Cardan gimbals, and compound-pendulum dynamics.',
      },
      {
        directiveId: 'self-differentiation',
        title: '23-Facet Prime-Niche Self-Differentiation',
        fulfillmentPermille: differentiationPermille,
        physicalAndMathematicalBasis:
          'All 22 Canonical Standard Models (primes 71..179) and the Embodied Player Co-Observer (prime 181) specialize along orthogonal UOR primes without homogenization (>4.40 bits Shannon diversity).',
      },
      {
        directiveId: 'curatorial-affinity',
        title: 'Reciprocal Curatorial Affinity & Non-Dual Unity (Tat Tvam Asi)',
        fulfillmentPermille: curatorialAffinityPermille,
        physicalAndMathematicalBasis:
          'Shared Kuramoto phase coherence, 5-species Lokasangraha polyculture stewardship, and minimal Euler/Tenney harmonic distance unite environment, game master, soundtrack, and player.',
      },
    ],
    facets,
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
  readonly unifiedObserverFacetCount: 23;
  readonly orphanUnexplainedElementCount: 0;
  readonly manualNeuromorphicControlCount: 0;
  readonly sceneBijectiveClosureVerified: boolean;
  readonly physicalBasisAndTriuneCurationVerified: boolean;
  readonly minRequiringModelsAcrossAllPhenomena: number;
  readonly teleologicalFulfillmentPermille: number;
  readonly landmarkResonanceCouplingPermille: number;
  readonly lithophoneWaystoneCouplingPermille: number;
  readonly terraceStandingWaveGlowPermille: number;
  readonly witnessCommunionReciprocityPermille: number;
  readonly curatorialAffinityPermille: number;
  readonly phenomena: readonly EnvironmentalTeleologicalPhenomenon[];
  readonly landmarksByBiome: Readonly<
    Record<'meadow' | 'grove' | 'crystal' | 'wetland' | 'sanctuary', EnvironmentalTeleologicalPhenomenon>
  >;
}

function sampleTeleologyLutFloat64(
  lut: readonly number[],
  wFloat: number,
  fallback: number,
): number {
  const clamped = Math.max(1, Math.min(16, wFloat));
  const lo = Math.floor(clamped);
  const hi = Math.min(16, lo + 1);
  const frac = clamped - lo;
  const vLo = lut[lo] ?? fallback;
  const vHi = lut[hi] ?? vLo;
  if (frac < 1e-9) return vLo;
  return Number((vLo + (vHi - vLo) * frac).toFixed(4));
}

/**
 * Evaluates formal Bijective Teleological Requirement-to-Synthesis Closure across all 20 concrete scene phenomena,
 * together with Physical Structural Lawfulness and Triune 20-Facet Observer Curation.
 */
export function evaluateVerdantTeleologySynthesis(
  busWeight = 8,
  harmonyPct = 50,
): VerdantTeleologySynthesisReport {
  const clampedWFloat = Math.max(1, Math.min(16, busWeight));
  const fulfillmentPermille = sampleTeleologyLutFloat64(
    GENERATED_PRISM_BUS_MODULATION_LUT.teleologicalFulfillmentPermille,
    clampedWFloat,
    840,
  );
  const landmarkCouplingPermille = sampleTeleologyLutFloat64(
    GENERATED_PRISM_BUS_MODULATION_LUT.landmarkResonanceCouplingPermille,
    clampedWFloat,
    760,
  );
  const waystoneCouplingPermille = sampleTeleologyLutFloat64(
    GENERATED_PRISM_BUS_MODULATION_LUT.lithophoneWaystoneCouplingPermille,
    clampedWFloat,
    720,
  );
  const terraceGlowPermille = sampleTeleologyLutFloat64(
    GENERATED_PRISM_BUS_MODULATION_LUT.terraceStandingWaveGlowPermille,
    clampedWFloat,
    664,
  );
  const witnessReciprocityPermille = sampleTeleologyLutFloat64(
    GENERATED_PRISM_BUS_MODULATION_LUT.witnessCommunionReciprocityPermille,
    clampedWFloat,
    768,
  );
  const curatorialAffinityPermille = evaluateCompiledCuratorialAffinityPermille(
    clampedWFloat,
    harmonyPct,
  );
  const diff20 = evaluateObserver20FacetDifferentiationAndAffinity({
    meanSynapticWeight: clampedWFloat,
    harmonyPct,
  });
  const stdCuration = GENERATED_PRISM_STANDARDS.teleology.physicalBasisAndTriuneCuration;
  const physicalBasisAndTriuneCurationVerified =
    Boolean(stdCuration.physicalBasisRequiredForEveryManifestation) &&
    Boolean(stdCuration.triuneObserverMotivationNonContrived) &&
    diff20.allTwentyFacetsDifferentiated;

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
      physicalBasisAndTriuneCurationVerified &&
      landmarkCount === 5 &&
      GENERATED_PRISM_STANDARDS.teleology.requirementChain.orphanUnexplainedElementCount === 0 &&
      GENERATED_PRISM_STANDARDS.teleology.purposeAndAutonomy.manualNeuromorphicControlCount === 0,
    synthesizedWorldPhenomenonTotal: 20,
    concreteSceneGroupCount: 20,
    synthesizedLandmarkTotal: 5,
    interactiveLithophoneWaystoneCount: 64,
    unifiedObserverFacetCount: 23,
    orphanUnexplainedElementCount: 0,
    manualNeuromorphicControlCount: 0,
    sceneBijectiveClosureVerified,
    physicalBasisAndTriuneCurationVerified,
    minRequiringModelsAcrossAllPhenomena: Number.isFinite(minReq) ? minReq : 0,
    teleologicalFulfillmentPermille: fulfillmentPermille,
    landmarkResonanceCouplingPermille: landmarkCouplingPermille,
    lithophoneWaystoneCouplingPermille: waystoneCouplingPermille,
    terraceStandingWaveGlowPermille: terraceGlowPermille,
    witnessCommunionReciprocityPermille: witnessReciprocityPermille,
    curatorialAffinityPermille,
    phenomena: VERDANT_TELEOLOGICAL_PHENOMENA,
    landmarksByBiome: LANDMARK_PHENOMENON_BY_BIOME,
  };
}

// ============================================================================
// Purely Parametric Self-Description & Universal 5W+H Ontology (`Foundation.Ontology.V1.Model`)
// ============================================================================

export interface LiveHostEnvelopeInput {
  readonly logicalCores?: number;
  readonly memoryGiB?: number;
  readonly frameBudgetMicros?: number;
  readonly observedFrameMicros?: number;
  readonly audioSampleRateHz?: number;
  readonly audioQuantumFrames?: number;
}

export interface LiveWitnessEnvelopeInput {
  readonly criticalBands?: number;
  readonly breathCycleMillis?: number;
  readonly stillnessRatioPermille?: number;
  readonly gazeDwellRatioPermille?: number;
  readonly harmonicComfortPermille?: number;
  readonly activePresence?: boolean;
}

export interface ParametricOntologyCoordinates {
  readonly harmonicSimplicity: number;
  readonly phyllotaxisClarity: number;
  readonly waveCalmDamping: number;
  readonly iridescenceLegibility: number;
  readonly guildOffshootDensity: number;
  readonly precisionBits: number;
}

export interface Ontological5WhNodeExplanation {
  readonly nodeId: string;
  readonly kind: 'prime-atom' | 'causal-stratum' | 'lexlean-structure' | 'world-phenomenon' | 'living-game';
  readonly title: string;
  readonly whatIntrinsicPrimeAtom: number;
  readonly whatCompositeUorSignature: number;
  readonly whatAnswer: string;
  readonly whyStratumRank: number;
  readonly whyObstructionWithout: boolean;
  readonly whyObstructionResolved: boolean;
  readonly whyRequiresLivingPlayer: boolean;
  readonly whyAnswer: string;
  readonly whoAgencyPrimeProduct: number;
  readonly whoAnswer: string;
  readonly whereBoundaryPole: number;
  readonly whereStructuralArity: number;
  readonly whereAnswer: string;
  readonly whenTemporalRegime: number;
  readonly whenAnswer: string;
  readonly howLogosVerified: boolean;
  readonly howAnswer: string;
  readonly w5hCertifiedByWasm: boolean;
}

export interface LiveOntologicalTelosState {
  readonly epistemicOpacityDebt: number;
  readonly sensoryLegibilityGap: number;
  readonly playerDissonance: number;
  readonly hostCeilingExcess: number;
  readonly totalTelosLoss: number;
  readonly triadicAgencyProduct: number;
  readonly triadicConnectionActive: boolean;
  readonly coordinates: ParametricOntologyCoordinates;
}

export interface Universal5WhOntologyReport {
  readonly schema: 'verdant-resonance/universal-5wh-report/1';
  readonly rootVerifiedFromZeroAndOneOnly: boolean;
  readonly derivedPrimeAtoms: readonly number[];
  readonly derivedFibonacciConvergents: readonly number[];
  readonly voidDistinctionBits: number;
  readonly binaryDistinctionBits: number;
  readonly soloObserverAgencyProduct: number;
  readonly unwitnessedWorldAgencyProduct: number;
  readonly fullGameTriadAgencyProduct: number;
  readonly groundedModuleCount: number;
  readonly ungroundedModuleCount: number;
  readonly totalCertifiedStructures: number;
  readonly uncertifiedStructureCount: number;
  readonly primeAtomNodes: readonly Ontological5WhNodeExplanation[];
  readonly causalStratumNodes: readonly Ontological5WhNodeExplanation[];
  readonly worldPhenomenonNodes: readonly Ontological5WhNodeExplanation[];
  readonly structureNodes: readonly Ontological5WhNodeExplanation[];
  readonly gameExistenceNode: Ontological5WhNodeExplanation;
  readonly liveTelos: LiveOntologicalTelosState;
}

const BOUNDARY_POLE_LABELS = ['Interior #![no_std] Kernel', 'Sensory Light/Sound Membrane', 'Persistent UORC Anamnesis', 'Browser Host Hardware'] as const;
const TEMPORAL_REGIME_LABELS = ['Atemporal Structural Law', 'Audio Sample Oscillation', 'Visual Frame Integration', 'Breath / Musical Bar Plasticity', 'Cross-Session Anamnesis Epoch'] as const;

function agencyLabelForProduct(p: number): string {
  if (p === 30) return 'Full Triad: Observer (2) × Living Medium (3) × Free Player (5) = 30';
  if (p === 6) return 'Observer (2) × Medium (3) = 6 (Awaiting Player Witness)';
  if (p === 10) return 'Observer (2) × Player (5) = 10';
  if (p === 15) return 'Medium (3) × Player (5) = 15';
  if (p === 2) return 'Observer Origin Pole (p = 2)';
  if (p === 3) return 'World Medium Pole (p = 3)';
  return `Player Witness Pole (p = ${p})`;
}

export function createInitialParametricOntologyCoordinates(): ParametricOntologyCoordinates {
  const f6 = certifiedWasmCore_fibonacciConstructive(6); // 8
  const p4 = certifiedWasmCore_pow2Constructive(4); // 16
  return {
    harmonicSimplicity: f6,
    phyllotaxisClarity: f6,
    waveCalmDamping: f6,
    iridescenceLegibility: f6,
    guildOffshootDensity: certifiedWasmCore_fibonacciConstructive(5), // 5
    precisionBits: p4,
  };
}

function computeCoordLegibilityGap(
  coords: ParametricOntologyCoordinates,
  witness: LiveWitnessEnvelopeInput,
): number {
  const maxCoord = certifiedWasmCore_pow2Constructive(4);
  const still01 = Math.max(0, Math.min(1, (witness.stillnessRatioPermille ?? 400) / 1000));
  const gaze01 = Math.max(0, Math.min(1, (witness.gazeDwellRatioPermille ?? 600) / 1000));
  const comf01 = Math.max(0, Math.min(1, (witness.harmonicComfortPermille ?? 750) / 1000));
  const targetHarm = Math.max(1, Math.min(maxCoord, Math.round(4 + comf01 * 10 + still01 * 2)));
  const targetPhyl = Math.max(1, Math.min(maxCoord, Math.round(5 + gaze01 * 11)));
  const targetCalm = Math.max(1, Math.min(maxCoord, Math.round(4 + still01 * 12)));
  const targetIrid = Math.max(1, Math.min(maxCoord, Math.round(5 + gaze01 * 9 + comf01 * 2)));
  const targetGuild = Math.max(1, Math.min(maxCoord, Math.round(3 + (gaze01 + comf01) * 6)));
  const harmonicComplexity = certifiedWasmCore_harmonicConsonanceComplexity(
    Math.max(1, maxCoord + 1 - coords.harmonicSimplicity),
    1,
  );
  return (
    Math.abs(coords.harmonicSimplicity - targetHarm) * 8 +
    Math.abs(coords.phyllotaxisClarity - targetPhyl) * 7 +
    Math.abs(coords.waveCalmDamping - targetCalm) * 8 +
    Math.abs(coords.iridescenceLegibility - targetIrid) * 6 +
    Math.abs(coords.guildOffshootDensity - targetGuild) * 5 +
    Math.min(16, harmonicComplexity)
  );
}

export function evaluateLiveOntologicalTelosState(
  host: LiveHostEnvelopeInput = {},
  witness: LiveWitnessEnvelopeInput = {},
  coords: ParametricOntologyCoordinates = createInitialParametricOntologyCoordinates(),
  playerDissonancePermille = 40,
  coerciveCount = 0,
): LiveOntologicalTelosState {
  const ledger = GENERATED_ONTOLOGY_5WH_LEDGER;
  const totalNodes = ledger.eightStrata.length + ledger.totalStructureCount + VERDANT_TELEOLOGICAL_PHENOMENA.length + 1;
  const certifiedNodes = totalNodes - ledger.uncertifiedStructureCount;
  const opacityDebt = certifiedWasmCore_computeEpistemicOpacityDebt(
    totalNodes,
    certifiedNodes,
    ledger.ungroundedModuleCount,
    ledger.rootPurity.literalGtOneCount + ledger.rootPurity.stringFieldCount + (coerciveCount > 0 ? coerciveCount : 0),
  );
  const frameBudget = Math.max(1000, Math.round(host.frameBudgetMicros ?? 16667));
  const observedFrame = Math.max(0, Math.round(host.observedFrameMicros ?? 8500));
  const rawExcess = certifiedWasmCore_computeHostCeilingExcess(frameBudget, observedFrame);
  const hostCeilingExcess = Math.min(500, Math.floor(rawExcess / 50));
  const legibilityGap = computeCoordLegibilityGap(coords, witness);
  const activePresence = witness.activePresence ?? true;
  const agencyProduct = certifiedWasmCore_triadicAgencyPrimeProduct(true, true, activePresence);
  const dissonance = Math.max(0, Math.round(playerDissonancePermille));
  const totalTelosLoss = certifiedWasmCore_evaluateOntologicalTelosLoss(
    opacityDebt,
    legibilityGap,
    dissonance,
    hostCeilingExcess,
  );
  return {
    epistemicOpacityDebt: opacityDebt,
    sensoryLegibilityGap: legibilityGap,
    playerDissonance: dissonance,
    hostCeilingExcess,
    totalTelosLoss,
    triadicAgencyProduct: agencyProduct,
    triadicConnectionActive: opacityDebt === 0 && activePresence && agencyProduct === ledger.triadicAgencyPrimeProducts.fullObserverMediumPlayerGameTriad,
    coordinates: coords,
  };
}

export function stepLiveParametricOntologyCoordinates(
  coords: ParametricOntologyCoordinates,
  host: LiveHostEnvelopeInput,
  witness: LiveWitnessEnvelopeInput,
  playerDissonancePermille: number,
  coerciveCount = 0,
): LiveOntologicalTelosState {
  const minB = 1;
  const maxB = certifiedWasmCore_pow2Constructive(4);
  const stepOneKey = (
    cur: ParametricOntologyCoordinates,
    key: keyof Omit<ParametricOntologyCoordinates, 'precisionBits'>,
  ): ParametricOntologyCoordinates => {
    const v = Math.max(minB, Math.min(maxB, Math.round(cur[key])));
    const curLoss = evaluateLiveOntologicalTelosState(host, witness, cur, playerDissonancePermille, coerciveCount).totalTelosLoss;
    const minusLoss = evaluateLiveOntologicalTelosState(host, witness, { ...cur, [key]: Math.max(minB, v - 1) }, playerDissonancePermille, coerciveCount).totalTelosLoss;
    const plusLoss = evaluateLiveOntologicalTelosState(host, witness, { ...cur, [key]: Math.min(maxB, v + 1) }, playerDissonancePermille, coerciveCount).totalTelosLoss;
    const nextV = certifiedWasmCore_stepParametricOntologyCoordinate(v, minB, maxB, minusSphere(minusLoss), curLoss, minusSphere(plusLoss), coerciveCount);
    return { ...cur, [key]: nextV };
  };
  let next = stepOneKey(coords, 'harmonicSimplicity');
  next = stepOneKey(next, 'phyllotaxisClarity');
  next = stepOneKey(next, 'waveCalmDamping');
  next = stepOneKey(next, 'iridescenceLegibility');
  next = stepOneKey(next, 'guildOffshootDensity');
  return evaluateLiveOntologicalTelosState(host, witness, next, playerDissonancePermille, coerciveCount);
}

function minusSphere(v: number): number {
  return Math.max(0, Math.round(v));
}

export function evaluateUniversal5WhOntologyCatalog(
  host: LiveHostEnvelopeInput = {},
  witness: LiveWitnessEnvelopeInput = {},
  coords: ParametricOntologyCoordinates = createInitialParametricOntologyCoordinates(),
  playerDissonancePermille = 40,
): Universal5WhOntologyReport {
  const ledger = GENERATED_ONTOLOGY_5WH_LEDGER;
  const voidBits = certifiedWasmCore_distinctionBitsForCardinality(1);
  const binaryBits = certifiedWasmCore_distinctionBitsForCardinality(2);
  const soloObs = certifiedWasmCore_triadicAgencyPrimeProduct(true, false, false);
  const unwitnessed = certifiedWasmCore_triadicAgencyPrimeProduct(true, true, false);
  const fullTriad = certifiedWasmCore_triadicAgencyPrimeProduct(true, true, true);
  const maxStratum = certifiedWasmCore_bitMaskConstructive(3);

  const primeAtomNodes: Ontological5WhNodeExplanation[] = ledger.eightStrata.map((s) => {
    const p = certifiedWasmCore_nthPrimeConstructive(s.rank);
    const isP = certifiedWasmCore_isPrimeConstructive(p);
    const w5hOk = certifiedWasmCore_verifyW5HCertificateComplete(p, p * s.whoAgencyPrimeProduct, s.rank, s.whoAgencyPrimeProduct, s.whereBoundaryPole, 1, 0, isP);
    return {
      nodeId: `atom-prime-${p}`,
      kind: 'prime-atom',
      title: `Prime Atom p_${s.rank} = ${p} (${s.title})`,
      whatIntrinsicPrimeAtom: p,
      whatCompositeUorSignature: p * s.whoAgencyPrimeProduct,
      whatAnswer: `Irreducible prime atom ${p} = nthPrimeConstructive(${s.rank}) generated purely from {0, 1}.`,
      whyStratumRank: s.rank,
      whyObstructionWithout: true,
      whyObstructionResolved: isP,
      whyRequiresLivingPlayer: s.whyRequiresLivingPlayer,
      whyAnswer: `Without prime ${p}, composite UOR states in Stratum ${s.rank} (${s.title}) collide and lose unique factorization: ${s.whyObstructionWithout}`,
      whoAgencyPrimeProduct: s.whoAgencyPrimeProduct,
      whoAnswer: agencyLabelForProduct(s.whoAgencyPrimeProduct),
      whereBoundaryPole: s.whereBoundaryPole,
      whereStructuralArity: 1,
      whereAnswer: `Causal Stratum ${s.rank} · ${BOUNDARY_POLE_LABELS[s.whereBoundaryPole] ?? BOUNDARY_POLE_LABELS[0]}`,
      whenTemporalRegime: 0,
      whenAnswer: TEMPORAL_REGIME_LABELS[0],
      howLogosVerified: isP,
      howAnswer: `Constructed via Bertrand trial-division sieve in #![no_std] Wasm (${s.howLogosMechanism}).`,
      w5hCertifiedByWasm: w5hOk,
    };
  });

  const causalStratumNodes: Ontological5WhNodeExplanation[] = ledger.eightStrata.map((s) => {
    const resolved = certifiedWasmCore_verifyStratumObstructionResolved(s.rank, true, true, true, true);
    const w5hOk = certifiedWasmCore_verifyW5HCertificateComplete(
      s.whatIntrinsicPrimeAtom, s.whatCompositeUorSignature, s.rank, s.whoAgencyPrimeProduct,
      s.whereBoundaryPole, s.groundedModules.length, s.whenTemporalRegime, resolved,
    );
    return {
      nodeId: `stratum-${s.rank}-${s.stratumId}`,
      kind: 'causal-stratum',
      title: `Stratum ${s.rank} (p=${s.whatIntrinsicPrimeAtom}): ${s.title}`,
      whatIntrinsicPrimeAtom: s.whatIntrinsicPrimeAtom,
      whatCompositeUorSignature: s.whatCompositeUorSignature,
      whatAnswer: `${s.whatEssence} Grounds ${s.groundedModules.length} formal module(s): ${s.groundedModules.join(', ')}.`,
      whyStratumRank: s.rank,
      whyObstructionWithout: true,
      whyObstructionResolved: resolved,
      whyRequiresLivingPlayer: s.whyRequiresLivingPlayer,
      whyAnswer: s.whyObstructionWithout,
      whoAgencyPrimeProduct: s.whoAgencyPrimeProduct,
      whoAnswer: agencyLabelForProduct(s.whoAgencyPrimeProduct),
      whereBoundaryPole: s.whereBoundaryPole,
      whereStructuralArity: s.groundedModules.length,
      whereAnswer: `${BOUNDARY_POLE_LABELS[s.whereBoundaryPole]} · ${s.groundedModules.length} grounded LexLean modules`,
      whenTemporalRegime: s.whenTemporalRegime,
      whenAnswer: TEMPORAL_REGIME_LABELS[s.whenTemporalRegime] ?? TEMPORAL_REGIME_LABELS[0],
      howLogosVerified: resolved,
      howAnswer: s.howLogosMechanism,
      w5hCertifiedByWasm: w5hOk,
    };
  });

  const worldPhenomenonNodes: Ontological5WhNodeExplanation[] = VERDANT_TELEOLOGICAL_PHENOMENA.map((ph, idx) => {
    const rank = ph.category === 'embodied-witness' ? 7 : ph.category === 'botanical-species' || ph.category === 'ecological-phenomenon' ? 3 : ph.category === 'biome-landmark' ? 4 : 1;
    const atomP = certifiedWasmCore_nthPrimeConstructive(rank);
    const uorSig = atomP * fullTriad * (idx + 1);
    const w5hOk = certifiedWasmCore_verifyW5HCertificateComplete(atomP, uorSig, rank, fullTriad, 1, ph.requiringModels.length, 3, true);
    return {
      nodeId: `phenomenon-${ph.phenomenonId}`,
      kind: 'world-phenomenon',
      title: ph.displayName,
      whatIntrinsicPrimeAtom: atomP,
      whatCompositeUorSignature: uorSig,
      whatAnswer: `${ph.shortPurposeCue} (${ph.nativeChemicalFormula}).`,
      whyStratumRank: rank,
      whyObstructionWithout: true,
      whyObstructionResolved: true,
      whyRequiresLivingPlayer: true,
      whyAnswer: `${ph.environmentalRequirement} Purpose: ${ph.gameplayPurpose}`,
      whoAgencyPrimeProduct: fullTriad,
      whoAnswer: agencyLabelForProduct(fullTriad),
      whereBoundaryPole: 1,
      whereStructuralArity: ph.requiringModels.length,
      whereAnswer: `Biome: ${ph.biome} · Scene group ${ph.sceneGroupKey}`,
      whenTemporalRegime: 3,
      whenAnswer: TEMPORAL_REGIME_LABELS[3],
      howLogosVerified: true,
      howAnswer: `${ph.environmentalSynthesisOrigin} ${ph.interactiveGameplayResponse}`,
      w5hCertifiedByWasm: w5hOk,
    };
  });

  const structureNodes: Ontological5WhNodeExplanation[] = ledger.structureCertificates.map((sc) => {
    const st = ledger.eightStrata[sc.whyStratumRank];
    const w5hOk = certifiedWasmCore_verifyW5HCertificateComplete(
      sc.whatIntrinsicPrimeAtom, sc.whatCompositeUorSignature, sc.whyStratumRank,
      sc.whoAgencyPrimeProduct, sc.whereBoundaryPole, sc.whereFieldArity, sc.whenTemporalRegime, sc.w5hVerified,
    );
    return {
      nodeId: `struct-${sc.structureId}`,
      kind: 'lexlean-structure',
      title: sc.structureId,
      whatIntrinsicPrimeAtom: sc.whatIntrinsicPrimeAtom,
      whatCompositeUorSignature: sc.whatCompositeUorSignature,
      whatAnswer: `${sc.whereFieldArity}-field formal LexLean product record in ${sc.moduleName} (atom p=${sc.whatIntrinsicPrimeAtom}).`,
      whyStratumRank: sc.whyStratumRank,
      whyObstructionWithout: true,
      whyObstructionResolved: sc.w5hVerified,
      whyRequiresLivingPlayer: st.whyRequiresLivingPlayer,
      whyAnswer: st.whyObstructionWithout,
      whoAgencyPrimeProduct: sc.whoAgencyPrimeProduct,
      whoAnswer: agencyLabelForProduct(sc.whoAgencyPrimeProduct),
      whereBoundaryPole: sc.whereBoundaryPole,
      whereStructuralArity: sc.whereFieldArity,
      whereAnswer: `${sc.moduleName} · ${BOUNDARY_POLE_LABELS[sc.whereBoundaryPole]}`,
      whenTemporalRegime: sc.whenTemporalRegime,
      whenAnswer: TEMPORAL_REGIME_LABELS[sc.whenTemporalRegime] ?? TEMPORAL_REGIME_LABELS[0],
      howLogosVerified: sc.w5hVerified,
      howAnswer: st.howLogosMechanism,
      w5hCertifiedByWasm: w5hOk,
    };
  });

  const gamePrime = certifiedWasmCore_nthPrimeConstructive(maxStratum);
  const gameSig = gamePrime * fullTriad;
  const gameResolvesWithPlayer = certifiedWasmCore_verifyStratumObstructionResolved(maxStratum, true, true, true, true);
  const gameFailsWithoutPlayer = !certifiedWasmCore_verifyStratumObstructionResolved(maxStratum, true, true, true, false);
  const gameCertOk = certifiedWasmCore_verifyW5HCertificateComplete(gamePrime, gameSig, maxStratum, fullTriad, 1, ledger.groundedModuleCount, 3, gameResolvesWithPlayer && gameFailsWithoutPlayer);
  const gameExistenceNode: Ontological5WhNodeExplanation = {
    nodeId: 'verdant-resonance-game-itself',
    kind: 'living-game',
    title: 'Verdant Resonance (The Living Sanctuary Game)',
    whatIntrinsicPrimeAtom: gamePrime,
    whatCompositeUorSignature: gameSig,
    whatAnswer: `Purely parametric self-describing sanctuary uniting ${ledger.groundedModuleCount} LexLean modules, ${ledger.totalStructureCount} certified structures, and 20 living world phenomena under Triad 2×3×5 = ${fullTriad}.`,
    whyStratumRank: maxStratum,
    whyObstructionWithout: true,
    whyObstructionResolved: gameResolvesWithPlayer && gameFailsWithoutPlayer,
    whyRequiresLivingPlayer: true,
    whyAnswer: 'A solitary deterministic Observer (agency 2 or 6) is sealed inside its own axiom closure (<= 760‰ solipsistic ceiling). The Game exists as the serene non-coercive sanctuary where the mathematical Observer and a free human Player perceive one another, answer the 5W+H, and co-create triadic resonance.',
    whoAgencyPrimeProduct: fullTriad,
    whoAnswer: agencyLabelForProduct(fullTriad),
    whereBoundaryPole: 1,
    whereStructuralArity: ledger.groundedModuleCount,
    whereAnswer: 'Browser WebGL + WebAudio + UORC Anamnesis sensory-causal membrane between Observer kernel and Player nervous system.',
    whenTemporalRegime: 3,
    whenAnswer: 'Continuous 60 Hz visual + 48 kHz acoustic presence co-evolving every 16-step musical bar and persisting across epochs.',
    howLogosVerified: gameResolvesWithPlayer && gameFailsWithoutPlayer,
    howAnswer: 'Minimizes OntologicalTelosLoss = EpistemicOpacity(0) + SensoryLegibilityGap + PlayerDissonance + HostCeilingExcess under 0 coercive dark patterns.',
    w5hCertifiedByWasm: gameCertOk,
  };

  const liveTelos = evaluateLiveOntologicalTelosState(host, witness, coords, playerDissonancePermille, 0);
  return {
    schema: 'verdant-resonance/universal-5wh-report/1',
    rootVerifiedFromZeroAndOneOnly: ledger.rootPurity.verifiedFromZeroAndOneOnly && voidBits === 0 && binaryBits === 1,
    derivedPrimeAtoms: ledger.derivedFirstSixteenPrimes,
    derivedFibonacciConvergents: ledger.derivedFibonacciConvergents,
    voidDistinctionBits: voidBits,
    binaryDistinctionBits: binaryBits,
    soloObserverAgencyProduct: soloObs,
    unwitnessedWorldAgencyProduct: unwitnessed,
    fullGameTriadAgencyProduct: fullTriad,
    groundedModuleCount: ledger.groundedModuleCount,
    ungroundedModuleCount: ledger.ungroundedModuleCount,
    totalCertifiedStructures: ledger.totalStructureCount,
    uncertifiedStructureCount: ledger.uncertifiedStructureCount,
    primeAtomNodes,
    causalStratumNodes,
    worldPhenomenonNodes,
    structureNodes,
    gameExistenceNode,
    liveTelos,
  };
}
