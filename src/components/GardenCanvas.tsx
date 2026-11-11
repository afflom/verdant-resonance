import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  ATMOSPHERE_CONFIGS,
  AtmosphereId,
  BIOME_CONFIGS,
  BIOME_CONSTELLATIONS,
  BOTANICAL_LIFECYCLE_STAGES,
  BiomeId,
  CameraKinematicsState,
  ChorusStateId,
  DEFAULT_PARAMETRIC_WORLD_TOPOLOGY,
  EnvironmentalLifecycleState,
  GardenPlantInstance,
  GestureHoldEnvelopeState,
  HoldableGestureId,
  LiveSoundtrackScore,
  MIRROR_LAGOON_WATER_SURFACE_Y,
  NeuromorphicEngineState,
  PLANT_SPECIES_CONFIGS,
  ParametricWorldTopologyModel,
  PlayerActionId,
  SANCTUARY_TRAIL_WAYPOINTS,
  SolidCollider,
  SoundscapeOutcome,
  SurfaceMaterialId,
  VERDANT_BOTANICAL_STANDARD,
  VERDANT_HUMANE_STANDARD,
  clampAlphaSeed,
  advancePlantLifecycle,
  biomeAt,
  buildGardenColliders,
  classifySurfaceMaterial,
  composeLiveSoundtrackScore,
  computeAcousticOcclusion,
  computeBinauralPan,
  computeCameraKinematics,
  computeCliffordBasinState,
  computeCrossDomainRefinementDirectives,
  computeEcologicalAffinity,
  computeFoliageDeflection,
  computeGardenHarmonyPct,
  computeNeuromorphicCymatics,
  computePlantMorphology,
  computeSoftInteractionGaze,
  computeSpeciesArticulation,
  computeSympatheticParabolicArc,
  createInitialAutonomousPlasticityState,
  createInitialEnvironmentalAgencyState,
  createInitialGestureHoldState,
  createInitialLandmarkResonanceState,
  createInitialNeuromorphicState,
  evaluateBiogeochemistry,
  evaluateCanopyWindShear,
  evaluateCircadianPlantPhysiology,
  evaluateDiurnalProfile,
  evaluateEnvironmentalLifecycle,
  evaluateGroundWavePropagation,
  evaluateHolisticObserverState,
  evaluateHydrodynamics,
  evaluateLithophoneWaystoneStep,
  evaluateMonumentPhysicalMechanics,
  evaluateNearestSynthesizedLandmark,
  evaluatePrismRequest,
  evaluateStandingWaveTerraceResonance,
  evaluateWindField,
  evaluateWitnessCommunionTarget,
  exciteLandmarkResonance,
  executeNeuromorphicSynthesisTick,
  findNearestPlant,
  findSympatheticNeighbors,
  formatPrismRequest,
  generateConservatoryGrassBlades,
  generateConservatoryRocks,
  generateConservatoryShorelineBoulders,
  generateConservatorySteppingStones,
  generateConservatoryTrees,
  getPlantLifecycleStage,
  groundHeightAt,
  propagateCrossDomainEnhancement,
  refinePrismModel,
  registerEmergentSeedlingCollider,
  resolveBiomeWaypointLanding,
  resolvePlayerPhysicsStep,
  stepAutonomousGameplayPlasticity,
  stepGestureHoldEnvelope,
  stepKuramotoPhaseEntrainment,
  stepLandmarkResonanceField,
  stepSporeFluidDynamics,
  stepSymbioticEnvironmentalAgency,
  syncImmanentWitnessCollider,
  synthesizeBotanicalOrganogenesis,
  synthesizeCompoundSurfaceProfile,
  synthesizeObserverInorganicMonuments,
  synthesizeParametricBiomeConfigs,
  synthesizeParametricChladniTerraceRadii,
  synthesizeParametricPlantSpeciesConfigs,
  synthesizeParametricWorldTopology,
  UniversalNeuromorphicManifold,
  evaluateHighDefinitionVisualSynthesis,
  evaluateImmanentObserverPresence,
  evaluateKinematicRigPose,
  extrapolatePrismToHighestResolution,
  restoreNeuromorphicStateFromAnamnesis,
  type BotanicalLifecycleStageId,
  type NearestLandmarkEvaluation,
  type VerdantAnamnesisPayload,
  type WitnessCommunionEvaluation,
} from '../game/prismModel';
import {
  synthesizeSpectralDiurnalPalette,
  type SpectralDiurnalPalette,
} from '../game/spectralColorEngine';
import {
  ALL_14_BRAVAIS_CRYSTAL_HABITS,
  BotanicalShaderUniforms,
  buildImmanentObserverWitnessGroup,
  createBravaisCrystalHabitGeometry,
  createCordateLotusPadGeometry,
  createFlutedBellCorollaGeometry,
  createFlutedEntasisPillarGeometry,
  createHexagonalQuartzCrystalGeometry,
  createHighDefinitionPbrTextureSuite,
  createLogarithmicCrozierGeometry,
  createObserverAstrolabeCrownGeometry,
  createPinnateFrondGeometry,
  createPlayerCoObserverLocusGeometry,
  createSculptedCanopyCrownGeometry,
  createSculptedGrassBladeGeometry,
  createSculptedPetalGeometry,
  createSegmentedBambooStalkGeometry,
  createStratifiedBoulderGeometry,
  enhanceMaterialWithBotanicalShader,
  synthesizeLSystemBotanicalMorphogenesis,
} from '../game/proceduralMeshEngine';
import { BotanicalSoundscapeEngine } from '../game/soundscapeEngine';

export type GameState = 'title' | 'playing' | 'paused' | 'gameover';

export interface LiveTelemetryState {
  playerX: number;
  playerZ: number;
  playerYaw: number;
  biome: BiomeId;
  atmosphere: AtmosphereId;
  chorus: ChorusStateId;
  affinityTier: 'sanctuary-peak' | 'native-harmony' | 'symbiotic-adaptation';
  nearestPlant: GardenPlantInstance;
  distanceMeters: number;
  proximityDm: number;
  velocityDm: number;
  action: PlayerActionId;
  prismRequest: string;
  prismOutcome: SoundscapeOutcome;
  prismRule: string | null;
  prismRuleDesc: string;
  harmony: number;
  attunedCount: number;
  sympatheticCount: number;
  totalPlants: number;
  exploredBiomes: BiomeId[];
  guidedStroll: boolean;
  surfaceMaterial: SurfaceMaterialId;
  inWater: boolean;
  waterDepthMeters: number;
  slopeGradePct: number;
  obstructedBy: string | null;
  acousticOcclusion: number;
  neuromorphic: NeuromorphicEngineState;
  environmentalLifecycle: EnvironmentalLifecycleState;
  soundtrackScore: LiveSoundtrackScore;
  currentSoundtrackStep: number;
  gestureHold: GestureHoldEnvelopeState;
  nearestLandmark: NearestLandmarkEvaluation;
  witnessCommunion: WitnessCommunionEvaluation;
}

export interface GardenImperativeHandle {
  triggerAction: (action: PlayerActionId) => void;
  setHeldAction: (action: HoldableGestureId | null) => void;
  teleportToBiome: (biome: BiomeId) => void;
  toggleGuidedStroll: () => void;
  resetExploration: () => void;
  refineParametricCosmos: (cycles?: number) => void;
  extrapolateToHighestResolution: () => void;
  setAlphaSeed: (alphaSeed: number, nextPlants: GardenPlantInstance[]) => void;
}

interface GardenCanvasProps {
  gameState: GameState;
  atmosphere: AtmosphereId;
  plants: GardenPlantInstance[];
  initialAnamnesisPayload?: VerdantAnamnesisPayload | null;
  soundEngine: BotanicalSoundscapeEngine;
  onTelemetryUpdate: (telemetry: LiveTelemetryState) => void;
  onPlantAttuned: (plantId: string, biome: BiomeId, outcome: SoundscapeOutcome) => void;
  handleRef: React.MutableRefObject<GardenImperativeHandle | null>;
}

// Golden angle in radians (137.50776 degrees) for Fibonacci phyllotaxis
const GOLDEN_ANGLE_RAD = 2.399963229728653;

// Pre-allocated module-scope scratch objects for zero-GC in the render loop
const _forward = new THREE.Vector3();
const _right = new THREE.Vector3();
const _moveVec = new THREE.Vector3();
const _targetSkyColor = new THREE.Color();
const _targetFogColor = new THREE.Color();
const _dummyMatrix = new THREE.Matrix4();
const _dummyPos = new THREE.Vector3();
const _dummyQuat = new THREE.Quaternion();
const _dummyScale = new THREE.Vector3();
const _dummyEuler = new THREE.Euler();
const _tempColor = new THREE.Color();
const _filamentStart = new THREE.Vector3();
const _filamentEnd = new THREE.Vector3();
const _filamentDir = new THREE.Vector3();
const _upVec = new THREE.Vector3(0, 1, 0);

export const GardenCanvas: React.FC<GardenCanvasProps> = ({
  gameState,
  atmosphere,
  plants,
  initialAnamnesisPayload,
  soundEngine,
  onTelemetryUpdate,
  onPlantAttuned,
  handleRef,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const gameStateRef = useRef<GameState>(gameState);
  const atmosphereRef = useRef<AtmosphereId>(atmosphere);
  const plantsRef = useRef<GardenPlantInstance[]>(plants);
  const initialAnamnesisRef = useRef<VerdantAnamnesisPayload | null | undefined>(
    initialAnamnesisPayload,
  );
  const onTelemetryRef = useRef(onTelemetryUpdate);
  const onPlantAttunedRef = useRef(onPlantAttuned);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    atmosphereRef.current = atmosphere;
  }, [atmosphere]);

  useEffect(() => {
    plantsRef.current = plants;
  }, [plants]);

  useEffect(() => {
    onTelemetryRef.current = onTelemetryUpdate;
  }, [onTelemetryUpdate]);

  useEffect(() => {
    onPlantAttunedRef.current = onPlantAttuned;
  }, [onPlantAttuned]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Software-WebGL Guard & Resilient WebGL Context Initialization per Three.js skill
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
    } catch {
      try {
        renderer = new THREE.WebGLRenderer({ antialias: false });
      } catch {
        return;
      }
    }

    const initialW = Math.max(1, container.clientWidth || window.innerWidth || 1280);
    const initialH = Math.max(1, container.clientHeight || window.innerHeight || 720);

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.14;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.setSize(initialW, initialH);

    container.innerHTML = '';
    renderer.domElement.setAttribute('data-testid', 'garden-webgl-canvas');
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    let contextLost = false;
    const onContextLost = (e: Event) => {
      e.preventDefault();
      contextLost = true;
    };
    const onContextRestored = () => {
      contextLost = false;
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost, false);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored, false);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#162d24');
    scene.fog = new THREE.FogExp2('#1a362b', 0.0155);

    const camera = new THREE.PerspectiveCamera(65, initialW / initialH, 0.15, 165);

    // 2. Mandatory Studio Environment Reflection (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 3. Balanced Warm/Cool Studio Rig + Biome Accent PointLights (within <= 4 PointLight budget)
    const hemiLight = new THREE.HemisphereLight(0x9be7d8, 0x1b3326, 1.18);
    hemiLight.position.set(0, 42, 0);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfff1d0, 2.15);
    sunLight.position.set(28, 44, 18);
    if (!isSoftwareGl) {
      sunLight.castShadow = true;
      sunLight.shadow.mapSize.set(1024, 1024);
      sunLight.shadow.camera.near = 1;
      sunLight.shadow.camera.far = 120;
      const d = 55;
      sunLight.shadow.camera.left = -d;
      sunLight.shadow.camera.right = d;
      sunLight.shadow.camera.top = d;
      sunLight.shadow.camera.bottom = -d;
      sunLight.shadow.bias = -0.0005;
      sunLight.shadow.normalBias = 0.02;
    }
    scene.add(sunLight);

    const [sanctLightX, sanctLightZ] = DEFAULT_PARAMETRIC_WORLD_TOPOLOGY.biomeCenters.sanctuary;
    const sanctuaryPointLight = new THREE.PointLight(0xfbbf24, 3.4, 30);
    sanctuaryPointLight.position.set(
      sanctLightX,
      groundHeightAt(sanctLightX, sanctLightZ) + 5.4,
      sanctLightZ,
    );
    scene.add(sanctuaryPointLight);

    const [crystalLightX, crystalLightZ] = DEFAULT_PARAMETRIC_WORLD_TOPOLOGY.biomeCenters.crystal;
    const crystalPointLight = new THREE.PointLight(0x38bdf8, 2.4, 24);
    crystalPointLight.position.set(
      crystalLightX,
      groundHeightAt(crystalLightX, crystalLightZ) + 4.2,
      crystalLightZ,
    );
    scene.add(crystalPointLight);

    const [wetlandLightX, wetlandLightZ] = DEFAULT_PARAMETRIC_WORLD_TOPOLOGY.biomeCenters.wetland;
    const wetlandPointLight = new THREE.PointLight(0x2dd4bf, 2.2, 24);
    wetlandPointLight.position.set(
      wetlandLightX,
      groundHeightAt(wetlandLightX, wetlandLightZ) + 3.2,
      wetlandLightZ,
    );
    scene.add(wetlandPointLight);

    // 4. High-Resolution 512x512 Procedural Macromolecular & Compound Surface Albedo + Micro-Relief BumpMap
    // Synthesizes 3 macromolecular/compound structural layers:
    //  (a) Organic Bryophyte Cushions (`bioluminescent-mycelial-humus`)
    //  (b) Chitin-Glucan Mycorrhizal Hyphal Mesh (`chitin-glucan-hyphal-network`)
    //  (c) Calcite-Aragonite & Tectosilicate Quartz Micro-Facets (`calcite-aragonite-spar-lattice` + `tectosilicate-quartz-lattice`)
    // Live Neuromorphic Synthesis Engine initialized up-front so every 3D geometry, PBR map,
    // Bravais crystal habit, and spectral palette projects at live Multi-Modal Fidelity from frame 0
    let neuromorphicState = initialAnamnesisRef.current
      ? restoreNeuromorphicStateFromAnamnesis(initialAnamnesisRef.current)
      : createInitialNeuromorphicState();
    soundEngine.syncWithNeuromorphicBus(neuromorphicState);
    const initialFidelity =
      neuromorphicState.observer.canonicalStandardModelsContext.multiModalFidelity;
    let cachedSpectralAtm: AtmosphereId = atmosphereRef.current;
    let cachedSpectralBands = initialFidelity.spectralBandCount;
    let cachedSpectralDiurnal: SpectralDiurnalPalette = synthesizeSpectralDiurnalPalette(
      cachedSpectralAtm,
      cachedSpectralBands,
      initialFidelity.airyThinFilmSpanNm,
    );

    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    const turfCompoundProfile = synthesizeCompoundSurfaceProfile('meadow-turf');
    const stoneCompoundProfile = synthesizeCompoundSurfaceProfile('travertine-stone');
    const quartzCompoundProfile = synthesizeCompoundSurfaceProfile('quartz-crystalline');

    const createMossAndBumpTextures = (requestedTexelRes: number) => {
      const texDim = isSoftwareGl
        ? 384
        : Math.max(512, Math.min(1024, Math.round(requestedTexelRes * 1.5)));
      const scaleFactor = texDim / 512;

      const cColor = document.createElement('canvas');
      cColor.width = texDim;
      cColor.height = texDim;
      const ctx = cColor.getContext('2d')!;
      ctx.fillStyle = '#1d3b2b';
      ctx.fillRect(0, 0, texDim, texDim);

      const cBump = document.createElement('canvas');
      cBump.width = texDim;
      cBump.height = texDim;
      const bCtx = cBump.getContext('2d')!;
      bCtx.fillStyle = '#808080';
      bCtx.fillRect(0, 0, texDim, texDim);

      let seed = 90210;
      const nextRand = () => {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        return seed / 4294967296;
      };

      // Layer A: Organic Bryophyte Cushions & Humus Colloids
      const cushionCount = Math.round(680 * scaleFactor);
      for (let i = 0; i < cushionCount; i++) {
        const x = nextRand() * texDim;
        const y = nextRand() * texDim;
        const r = (5 + nextRand() * 22) * scaleFactor;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
        const shade =
          i % 4 === 0
            ? 'rgba(46, 94, 68, 0.36)'
            : i % 4 === 1
              ? 'rgba(22, 48, 35, 0.36)'
              : i % 4 === 2
                ? 'rgba(62, 118, 84, 0.28)'
                : 'rgba(110, 231, 183, 0.12)';
        grad.addColorStop(0, shade);
        grad.addColorStop(1, 'rgba(29, 59, 43, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();

        const bGrad = bCtx.createRadialGradient(x, y, 0, x, y, r * 0.8);
        bGrad.addColorStop(0, i % 2 === 0 ? 'rgba(225,225,225,0.38)' : 'rgba(56,56,56,0.38)');
        bGrad.addColorStop(1, 'rgba(128,128,128,0)');
        bCtx.fillStyle = bGrad;
        bCtx.beginPath();
        bCtx.arc(x, y, r * 0.8, 0, Math.PI * 2);
        bCtx.fill();
      }

      // Layer B: Chitin-Beta-Glucan Mycorrhizal Hyphal Micro-Filaments (`chitin-glucan-hyphal-network`)
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.10)';
      ctx.lineWidth = 1.1 * scaleFactor;
      bCtx.strokeStyle = 'rgba(198, 198, 198, 0.25)';
      bCtx.lineWidth = 1.2 * scaleFactor;
      const hyphaCount = Math.round(130 * scaleFactor);
      for (let h = 0; h < hyphaCount; h++) {
        const hx = nextRand() * texDim;
        const hy = nextRand() * texDim;
        const angle = nextRand() * Math.PI * 2;
        const len = (14 + nextRand() * 28) * scaleFactor;
        const mx = hx + Math.cos(angle + 0.35) * (len * 0.5);
        const my = hy + Math.sin(angle + 0.35) * (len * 0.5);
        const ex = hx + Math.cos(angle) * len;
        const ey = hy + Math.sin(angle) * len;
        ctx.beginPath();
        ctx.moveTo(hx, hy);
        ctx.quadraticCurveTo(mx, my, ex, ey);
        ctx.stroke();

        bCtx.beginPath();
        bCtx.moveTo(hx, hy);
        bCtx.quadraticCurveTo(mx, my, ex, ey);
        bCtx.stroke();
      }

      // Layer C: 14-Bravais Mineral Crystal Micro-Facets (`calcite-aragonite-spar` + `tectosilicate-quartz`)
      const facetCount = Math.round(120 * scaleFactor);
      for (let f = 0; f < facetCount; f++) {
        const fx = nextRand() * texDim;
        const fy = nextRand() * texDim;
        const fr = (2.2 + nextRand() * 4.5) * scaleFactor;
        const rot = nextRand() * Math.PI * 2;
        const polySides = 3 + (f % 6); // 3..8-fold crystallographic symmetry facets
        bCtx.fillStyle = f % 2 === 0 ? 'rgba(244, 244, 244, 0.30)' : 'rgba(78, 78, 78, 0.30)';
        bCtx.beginPath();
        for (let v = 0; v < polySides; v++) {
          const a = rot + (v / polySides) * Math.PI * 2;
          const vx = fx + Math.cos(a) * fr;
          const vy = fy + Math.sin(a) * fr;
          if (v === 0) bCtx.moveTo(vx, vy);
          else bCtx.lineTo(vx, vy);
        }
        bCtx.closePath();
        bCtx.fill();
      }

      const colorTex = new THREE.CanvasTexture(cColor);
      colorTex.colorSpace = THREE.SRGBColorSpace;
      colorTex.wrapS = THREE.RepeatWrapping;
      colorTex.wrapT = THREE.RepeatWrapping;
      colorTex.repeat.set(18, 18);
      colorTex.anisotropy = maxAnisotropy;

      const bumpTex = new THREE.CanvasTexture(cBump);
      bumpTex.wrapS = THREE.RepeatWrapping;
      bumpTex.wrapT = THREE.RepeatWrapping;
      bumpTex.repeat.set(18, 18);
      bumpTex.anisotropy = maxAnisotropy;

      return { colorTex, bumpTex, texDim };
    };

    let activeTexelResolution = initialFidelity.proceduralTexelResolution;
    let { colorTex: groundTex, bumpTex: groundBumpTex } = createMossAndBumpTextures(
      activeTexelResolution,
    );
    let pbrSuite = createHighDefinitionPbrTextureSuite(
      maxAnisotropy,
      isSoftwareGl,
      activeTexelResolution,
    );

    const _terrainVertColor = new THREE.Color();
    const _foliageCanopyCol = new THREE.Color();
    const _foliageRedEdgeCol = new THREE.Color();
    const _lagoonAbsCol = new THREE.Color();
    const _crystalThinCol = new THREE.Color();
    const _travertineWarmCol = new THREE.Color('#d6d0c4');

    const populateTerrainHeightsAndSpectralColors = (
      geo: THREE.PlaneGeometry,
      topo: ParametricWorldTopologyModel,
      specPalette: SpectralDiurnalPalette,
    ) => {
      const pAttr = geo.attributes.position;
      let cAttr = geo.getAttribute('color') as THREE.BufferAttribute | undefined;
      if (!cAttr || cAttr.count !== pAttr.count) {
        cAttr = new THREE.BufferAttribute(new Float32Array(pAttr.count * 3), 3);
        geo.setAttribute('color', cAttr);
      }
      _foliageCanopyCol.set(specPalette.foliageCanopy.hex);
      _foliageRedEdgeCol.set(specPalette.foliageRedEdgeSheen.hex);
      _lagoonAbsCol.set(specPalette.lagoonWaterAbsorption.hex);
      _crystalThinCol.set(specPalette.crystalThinFilm.hex);

      const [sanctCx, sanctCz] = topo.biomeCenters.sanctuary;
      const [crysCx, crysCz] = topo.biomeCenters.crystal;
      const [lagCx, lagCz] = topo.lagoonCenterXZ;

      for (let i = 0; i < pAttr.count; i++) {
        const vx = pAttr.getX(i);
        const vz = pAttr.getZ(i);
        const vy = groundHeightAt(vx, vz, topo);
        pAttr.setY(i, vy);

        // Blend CIE 1931 PROSPECT chlorophyll, Beer-Lambert lagoon sediment, Bravais crystal basin, & travertine spar
        _terrainVertColor.setRGB(0.88, 0.94, 0.90).lerp(_foliageCanopyCol, 0.22);
        const dLag = Math.hypot(vx - lagCx, vz - lagCz);
        if (dLag < 22) {
          _terrainVertColor.lerp(_lagoonAbsCol, Math.max(0, (1 - dLag / 22) * 0.42));
        }
        const dCrys = Math.hypot(vx - crysCx, vz - crysCz);
        if (dCrys < 24) {
          _terrainVertColor.lerp(_crystalThinCol, Math.max(0, (1 - dCrys / 24) * 0.34));
        }
        const dSanct = Math.hypot(vx - sanctCx, vz - sanctCz);
        if (dSanct < 18) {
          _terrainVertColor.lerp(_travertineWarmCol, Math.max(0, (1 - dSanct / 18) * 0.28));
        }
        if (vy > 1.2) {
          _terrainVertColor.lerp(_foliageRedEdgeCol, Math.min(0.18, (vy - 1.2) * 0.06));
        }
        cAttr.setXYZ(i, _terrainVertColor.r, _terrainVertColor.g, _terrainVertColor.b);
      }
      pAttr.needsUpdate = true;
      cAttr.needsUpdate = true;
      geo.computeVertexNormals();
    };

    const buildAdaptiveSpectralTerrainGeometry = (
      segments: number,
      topo: ParametricWorldTopologyModel,
      specPalette: SpectralDiurnalPalette,
    ): THREE.PlaneGeometry => {
      const clampedSegs = isSoftwareGl
        ? Math.min(112, segments)
        : Math.max(96, Math.min(192, Math.round(segments)));
      const geo = new THREE.PlaneGeometry(180, 180, clampedSegs, clampedSegs);
      geo.rotateX(-Math.PI / 2);
      populateTerrainHeightsAndSpectralColors(geo, topo, specPalette);
      return geo;
    };

    let activeTerrainSegments = initialFidelity.adaptiveTerrainSegments;
    let terrainGeo = buildAdaptiveSpectralTerrainGeometry(
      activeTerrainSegments,
      DEFAULT_PARAMETRIC_WORLD_TOPOLOGY,
      cachedSpectralDiurnal,
    );

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      vertexColors: true,
      map: groundTex,
      normalMap: pbrSuite.mossNormalTex,
      normalScale: new THREE.Vector2(0.55, 0.55),
      roughnessMap: pbrSuite.mossRoughnessTex,
      bumpMap: groundBumpTex,
      bumpScale: turfCompoundProfile.microReliefBumpScale,
      roughness: turfCompoundProfile.surfaceRoughnessPbr,
      metalness: turfCompoundProfile.surfaceMetalnessPbr,
    });
    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.receiveShadow = !isSoftwareGl;
    scene.add(terrainMesh);

    // 5. Five Distinct Biome Architectural Monuments (`Foundation.Botany.V1.Model` + High-Definition Parametric B-Mesh)
    const sharedStoneMat = new THREE.MeshStandardMaterial({
      color: 0xd6d3d1,
      map: pbrSuite.stoneColorTex,
      normalMap: pbrSuite.stoneNormalTex,
      normalScale: new THREE.Vector2(0.48, 0.48),
      bumpMap: groundBumpTex,
      bumpScale: stoneCompoundProfile.microReliefBumpScale,
      roughness: stoneCompoundProfile.surfaceRoughnessPbr,
      metalness: stoneCompoundProfile.surfaceMetalnessPbr,
    });
    const sharedGoldTrimMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      emissive: 0xd97706,
      emissiveIntensity: 0.38,
      roughness: 0.22,
      metalness: 0.85,
    });
    const sharedCrystalMat = new THREE.MeshPhysicalMaterial({
      color: 0xfde047,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.58,
      roughness: quartzCompoundProfile.surfaceRoughnessPbr * 0.6,
      metalness: quartzCompoundProfile.surfaceMetalnessPbr,
      clearcoat: quartzCompoundProfile.clearcoatStrength,
      iridescence: 0.62,
      iridescenceIOR: 1.54,
      iridescenceThicknessMinimum: 220,
      iridescenceThicknessMaximum: 540,
    });

    // Observer Demiurgic Parametric Monument Blueprint (`Foundation.Cosmogenesis.V1.Model::synthesizeObserverInorganicMonuments`)
    const parametricInorganic = synthesizeObserverInorganicMonuments();
    const sanctSpec = parametricInorganic.monuments.sanctuary.sanctuary!;
    const meadowSpec = parametricInorganic.monuments.meadow.meadow!;
    const groveSpec = parametricInorganic.monuments.grove.grove!;
    const crystalSpec = parametricInorganic.monuments.crystal.crystal!;
    const wetlandSpec = parametricInorganic.monuments.wetland.wetland!;

    // Monument 1 (Sanctuary): Classical Harmonic Rotunda & Orthogonal Cardan Double-Gimbal (`weldGapMeters === 0`)
    const buildSanctuaryPavilion = () => {
      const group = new THREE.Group();
      const [sx, sz] = sanctSpec.centerXZ;
      const sy = groundHeightAt(sx, sz);
      group.position.set(sx, sy, sz);

      // Deeply skirted 3-tier travertine crepidoma (-0.48m embedded foundation into bedrock)
      const skirtDepth = 0.48;
      const step1H = skirtDepth + sanctSpec.plinthTopY * 0.34;
      const step2H = sanctSpec.plinthTopY * 0.34;
      const step3H = sanctSpec.plinthTopY * 0.32;

      // Tier 1: Submerged stereobate plinth footing (prevents any slope seam)
      const plinthStep1 = new THREE.Mesh(
        new THREE.CylinderGeometry(
          sanctSpec.outerPlinthRadius * 1.08,
          sanctSpec.outerPlinthRadius * 1.12,
          step1H,
          36,
        ),
        sharedStoneMat,
      );
      plinthStep1.position.y = -skirtDepth + step1H * 0.5;
      group.add(plinthStep1);

      // Tier 2: Middle crepidoma terrace
      const plinthStep2 = new THREE.Mesh(
        new THREE.CylinderGeometry(
          sanctSpec.outerPlinthRadius * 0.98,
          sanctSpec.outerPlinthRadius * 1.02,
          step2H,
          36,
        ),
        sharedStoneMat,
      );
      plinthStep2.position.y = plinthStep1.position.y + step1H * 0.5 + step2H * 0.5;
      group.add(plinthStep2);

      // Tier 3: Upper stylobate floor
      const plinthStep3 = new THREE.Mesh(
        new THREE.CylinderGeometry(
          sanctSpec.innerPlinthRadius * 0.96,
          sanctSpec.innerPlinthRadius,
          step3H,
          36,
        ),
        sharedStoneMat,
      );
      plinthStep3.position.y = plinthStep2.position.y + step2H * 0.5 + step3H * 0.5;
      group.add(plinthStep3);

      // Inlaid bronze stylobate perimeter rings
      const poolRingOuter = new THREE.Mesh(
        new THREE.RingGeometry(
          sanctSpec.colonnadeRadius * 0.94,
          sanctSpec.colonnadeRadius * 1.06,
          48,
        ),
        sharedGoldTrimMat,
      );
      poolRingOuter.rotation.x = -Math.PI / 2;
      poolRingOuter.position.y = sanctSpec.plinthTopY + 0.02;
      group.add(poolRingOuter);

      const poolRingInner = new THREE.Mesh(
        new THREE.RingGeometry(
          sanctSpec.innerCupolaRadius * 1.25,
          sanctSpec.innerCupolaRadius * 1.48,
          36,
        ),
        sharedGoldTrimMat,
      );
      poolRingInner.rotation.x = -Math.PI / 2;
      poolRingInner.position.y = sanctSpec.plinthTopY + 0.02;
      group.add(poolRingInner);

      // 24-Flute classical entasis columns with moulded Attic bases & Doric capitals
      const pillarGeo = createFlutedEntasisPillarGeometry({
        radiusBase: sanctSpec.pillarRadiusBottom,
        radiusTop: sanctSpec.pillarRadiusTop,
        height: sanctSpec.pillarHeight,
        fluteCount: 24,
      });
      const radialStrutGeo = new THREE.CylinderGeometry(0.09, 0.12, sanctSpec.radialStrutLength, 12);
      radialStrutGeo.rotateZ(Math.PI / 2);
      const pillarMidY = (sanctSpec.plinthTopY + sanctSpec.haloElevationY) * 0.5;

      for (let i = 0; i < sanctSpec.colonnadeCount; i++) {
        const angle = (i / sanctSpec.colonnadeCount) * Math.PI * 2;
        const px = Math.cos(angle) * sanctSpec.colonnadeRadius;
        const pz = Math.sin(angle) * sanctSpec.colonnadeRadius;

        // Attic base plinth block (torus-scotia-torus profile)
        const baseBlock = new THREE.Mesh(
          new THREE.CylinderGeometry(
            sanctSpec.pillarRadiusBottom * 1.35,
            sanctSpec.pillarRadiusBottom * 1.45,
            0.24,
            16,
          ),
          sharedGoldTrimMat,
        );
        baseBlock.position.set(px, sanctSpec.plinthTopY + 0.12, pz);
        group.add(baseBlock);

        // Fluted column shaft
        const pillar = new THREE.Mesh(pillarGeo, sharedStoneMat);
        pillar.position.set(px, pillarMidY, pz);
        group.add(pillar);

        // Flared Echinus + Abacus capital collar
        const capitalCollar = new THREE.Mesh(
          new THREE.CylinderGeometry(
            sanctSpec.pillarRadiusBottom * 1.38,
            sanctSpec.pillarRadiusTop * 1.12,
            0.28,
            16,
          ),
          sharedGoldTrimMat,
        );
        capitalCollar.position.set(px, sanctSpec.haloElevationY - 0.04, pz);
        group.add(capitalCollar);

        // Radial architrave rib strut connecting each outer column to the central cupola ring
        const strut = new THREE.Mesh(radialStrutGeo, sharedStoneMat);
        strut.position.set(
          Math.cos(angle) * sanctSpec.radialStrutMidRadius,
          sanctSpec.haloElevationY,
          Math.sin(angle) * sanctSpec.radialStrutMidRadius,
        );
        strut.rotation.y = -angle;
        group.add(strut);
      }

      // Outer entablature cornice torus ring
      const haloRing = new THREE.Mesh(
        new THREE.TorusGeometry(sanctSpec.colonnadeRadius, sanctSpec.haloTubeRadius * 1.05, 18, 56),
        sharedGoldTrimMat,
      );
      haloRing.rotation.x = Math.PI / 2;
      haloRing.position.y = sanctSpec.haloElevationY;
      group.add(haloRing);

      // Central cupola oculus ring
      const innerCupolaRing = new THREE.Mesh(
        new THREE.TorusGeometry(sanctSpec.innerCupolaRadius, 0.14, 16, 40),
        sharedGoldTrimMat,
      );
      innerCupolaRing.rotation.x = Math.PI / 2;
      innerCupolaRing.position.y = sanctSpec.haloElevationY;
      group.add(innerCupolaRing);

      // Central fluted altar pedestal & tuning-fork gimbal cradle yoke
      const altarH = sanctSpec.yokeElevationY - sanctSpec.plinthTopY + 0.05;
      const altarPedestal = new THREE.Mesh(
        new THREE.CylinderGeometry(1.05, 1.55, altarH, 32),
        sharedStoneMat,
      );
      altarPedestal.position.y = sanctSpec.plinthTopY + altarH * 0.5 - 0.025;
      group.add(altarPedestal);

      const altarTrim = new THREE.Mesh(
        new THREE.TorusGeometry(1.12, 0.075, 12, 36),
        sharedGoldTrimMat,
      );
      altarTrim.rotation.x = Math.PI / 2;
      altarTrim.position.y = sanctSpec.yokeElevationY - 0.02;
      group.add(altarTrim);

      const orbitRadius = sanctSpec.innerCupolaRadius * 1.61;
      const yokeSpan = orbitRadius * 2.075;
      const yokeBaseBeam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.14, 0.14, yokeSpan, 16),
        sharedGoldTrimMat,
      );
      yokeBaseBeam.rotation.z = Math.PI / 2;
      yokeBaseBeam.position.y = sanctSpec.yokeElevationY;
      group.add(yokeBaseBeam);

      const forkArmH = sanctSpec.gimbalCenterY - sanctSpec.yokeElevationY + 0.07;
      for (const side of [-1, 1] as const) {
        const forkArm = new THREE.Mesh(
          new THREE.CylinderGeometry(0.10, 0.14, forkArmH, 16),
          sharedGoldTrimMat,
        );
        forkArm.position.set(
          side * (yokeSpan * 0.5),
          (sanctSpec.yokeElevationY + sanctSpec.gimbalCenterY) * 0.5,
          0,
        );
        group.add(forkArm);

        // Fixed X-axis trunnion bearing housing
        const trunnionBearing = new THREE.Mesh(
          new THREE.CylinderGeometry(0.15, 0.15, 0.28, 16),
          sharedGoldTrimMat,
        );
        trunnionBearing.rotation.z = Math.PI / 2;
        trunnionBearing.position.set(side * (orbitRadius + 0.03), sanctSpec.gimbalCenterY, 0);
        group.add(trunnionBearing);
      }

      // Hierarchical Cardan Double-Gimbal assembly (strictly orthogonal trunnions, zero rod-shearing)
      // Outer gimbal rotates purely around X-axis trunnions
      const orbitRing = new THREE.Mesh(
        new THREE.TorusGeometry(orbitRadius, 0.08, 14, 48),
        sharedGoldTrimMat,
      );
      orbitRing.position.y = sanctSpec.gimbalCenterY;

      // Outer gimbal X-axis pivot pins seating into the fork trunnions
      const gimbalAxleLeft = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.045, 0.24, 12),
        sharedGoldTrimMat,
      );
      gimbalAxleLeft.rotation.z = Math.PI / 2;
      gimbalAxleLeft.position.x = -orbitRadius;
      orbitRing.add(gimbalAxleLeft);

      const gimbalAxleRight = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.045, 0.24, 12),
        sharedGoldTrimMat,
      );
      gimbalAxleRight.rotation.z = Math.PI / 2;
      gimbalAxleRight.position.x = orbitRadius;
      orbitRing.add(gimbalAxleRight);

      // Inner gimbal rotates purely around orthogonal Z-axis trunnions mounted on orbitRing
      const innerGimbalRadius = sanctSpec.innerCupolaRadius * 1.174;
      const innerGimbalRing = new THREE.Mesh(
        new THREE.TorusGeometry(innerGimbalRadius, 0.065, 12, 40),
        sharedGoldTrimMat,
      );
      innerGimbalRing.position.y = sanctSpec.gimbalCenterY;

      // Z-axis trunnion pins for inner gimbal
      for (const side of [-1, 1] as const) {
        const zTrunnion = new THREE.Mesh(
          new THREE.CylinderGeometry(0.042, 0.042, 0.22, 12),
          sharedGoldTrimMat,
        );
        zTrunnion.rotation.x = Math.PI / 2;
        zTrunnion.position.set(0, 0, side * (innerGimbalRadius + 0.02));
        innerGimbalRing.add(zTrunnion);
      }

      // Sculpted 6-prong bronze bezel collar cradling the crystal spire
      const spireCradle = new THREE.Group();
      const cradleCollar = new THREE.Mesh(
        new THREE.CylinderGeometry(1.02, 0.98, 0.32, 24),
        sharedGoldTrimMat,
      );
      spireCradle.add(cradleCollar);
      for (let p = 0; p < 6; p++) {
        const pa = (p / 6) * Math.PI * 2;
        const prong = new THREE.Mesh(
          new THREE.CylinderGeometry(0.035, 0.055, 0.65, 10),
          sharedGoldTrimMat,
        );
        prong.position.set(Math.cos(pa) * 0.96, 0.25, Math.sin(pa) * 0.96);
        prong.rotation.z = -Math.cos(pa) * 0.18;
        prong.rotation.x = Math.sin(pa) * 0.18;
        spireCradle.add(prong);
      }
      spireCradle.position.y = sanctSpec.gimbalCenterY;
      group.add(spireCradle);

      // Double-terminated quartz crystal spire (cradled in inner gimbal, spins axially with zero vertical rod-shearing)
      const spireGeo = createHexagonalQuartzCrystalGeometry({
        radius: 0.95,
        height: 3.4,
        doubleTerminated: true,
      });
      const spire = new THREE.Mesh(spireGeo, sharedCrystalMat);
      spire.position.y = sanctSpec.gimbalCenterY;
      group.add(spire);

      group.add(orbitRing);
      group.add(innerGimbalRing);

      // Supra-Directive Observer Light-Cone Astrolabe Crown seated flush onto innerCupolaRing
      const crownMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        vertexColors: true,
        emissive: 0x34d399,
        emissiveIntensity: 0.24,
        metalness: 0.72,
        roughness: 0.22,
        clearcoat: 0.85,
        clearcoatRoughness: 0.14,
      });
      const initialCrownGeo = createObserverAstrolabeCrownGeometry();
      const observerCrown = new THREE.Mesh(initialCrownGeo, crownMat);
      observerCrown.position.y = sanctSpec.haloElevationY;
      group.add(observerCrown);

      return { group, spire, orbitRing, innerGimbalRing, observerCrown, crownMat };
    };

    const sanctuaryMonument = buildSanctuaryPavilion();
    let activeCrownModelId = '';
    scene.add(sanctuaryMonument.group);

    // Monument 2 (Sunlit Meadow): Astronomical Solar Meridian Sundial & Wind Radiometer (`weldGapMeters === 0`)
    const buildMeadowSundial = () => {
      const group = new THREE.Group();
      const [mx, mz] = meadowSpec.centerXZ;
      const my = groundHeightAt(mx, mz);
      group.position.set(mx, my, mz);

      // Deeply skirted 2-tier travertine rotunda plinth (-0.45m embedded skirt into meadow slope)
      const skirtDepth = 0.45;
      const step1H = skirtDepth + meadowSpec.dialTopY * 0.48;
      const step2H = meadowSpec.dialTopY * 0.52;

      const plinthStep1 = new THREE.Mesh(
        new THREE.CylinderGeometry(
          meadowSpec.dialRadius * 1.08,
          meadowSpec.dialRadius * 1.14,
          step1H,
          32,
        ),
        sharedStoneMat,
      );
      plinthStep1.position.y = -skirtDepth + step1H * 0.5;
      group.add(plinthStep1);

      const dialBase = new THREE.Mesh(
        new THREE.CylinderGeometry(
          meadowSpec.innerRingRadius,
          meadowSpec.dialRadius,
          step2H,
          32,
        ),
        sharedStoneMat,
      );
      dialBase.position.y = plinthStep1.position.y + step1H * 0.5 + step2H * 0.5;
      group.add(dialBase);

      // 12 Engraved bronze radial hour markers on dial face
      const dialFaceY = meadowSpec.dialTopY + 0.012;
      for (let h = 0; h < 12; h++) {
        const ha = (h / 12) * Math.PI * 2;
        const lineLen = h % 3 === 0 ? meadowSpec.dialRadius * 0.28 : meadowSpec.dialRadius * 0.18;
        const lineR = meadowSpec.dialRadius * 0.68;
        const hourLine = new THREE.Mesh(
          new THREE.CylinderGeometry(0.018, 0.018, lineLen, 6),
          sharedGoldTrimMat,
        );
        hourLine.rotation.z = Math.PI / 2;
        hourLine.rotation.y = ha;
        hourLine.position.set(Math.cos(ha) * lineR, dialFaceY, Math.sin(ha) * lineR);
        group.add(hourLine);
      }

      // Inlaid bronze celestial meridian and equator rings
      const compassRing = new THREE.Mesh(
        new THREE.RingGeometry(meadowSpec.dialRadius * 0.60, meadowSpec.dialRadius * 0.82, 40),
        sharedGoldTrimMat,
      );
      compassRing.rotation.x = -Math.PI / 2;
      compassRing.position.y = dialFaceY;
      group.add(compassRing);

      // Lateral stone buttresses clasping the base of the meridian arch
      for (const side of [-1, 1] as const) {
        const buttress = new THREE.Mesh(
          new THREE.CylinderGeometry(0.26, 0.34, 0.48, 18),
          sharedStoneMat,
        );
        buttress.position.set(side * meadowSpec.buttressOffsetX, meadowSpec.dialTopY + 0.12, 0);
        group.add(buttress);

        const voluteCap = new THREE.Mesh(
          new THREE.TorusGeometry(0.24, 0.065, 10, 24),
          sharedGoldTrimMat,
        );
        voluteCap.position.set(side * meadowSpec.buttressOffsetX, meadowSpec.dialTopY + 0.28, 0);
        group.add(voluteCap);
      }

      // Semicircular bronze meridian arch
      const gnomonArch = new THREE.Mesh(
        new THREE.TorusGeometry(meadowSpec.archRadius, meadowSpec.archTubeRadius * 1.08, 14, 40, Math.PI),
        sharedGoldTrimMat,
      );
      gnomonArch.position.y = meadowSpec.dialTopY;
      group.add(gnomonArch);

      // Inclined astronomical polar gnomon blade/style (38° inclination = 0.6632 rad)
      const gnomonBlade = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.075, meadowSpec.gnomonHeight * 1.05, 16),
        sharedGoldTrimMat,
      );
      gnomonBlade.rotation.x = 0.6632;
      gnomonBlade.position.set(0, meadowSpec.gnomonCenterY, 0.15);
      group.add(gnomonBlade);

      // Vertical central shaft supporting apex anemometer
      const gnomonShaft = new THREE.Mesh(
        new THREE.CylinderGeometry(0.055, 0.085, meadowSpec.gnomonHeight, 16),
        sharedGoldTrimMat,
      );
      gnomonShaft.position.y = meadowSpec.gnomonCenterY;
      group.add(gnomonShaft);

      // Jewel-pivoted 3-cup wind anemometer / solar radiometer at the apex
      const sunOrbPivot = new THREE.Group();
      sunOrbPivot.position.set(0, meadowSpec.sunOrbPivotY, 0);

      const collar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.12, 0.16, 16),
        sharedGoldTrimMat,
      );
      sunOrbPivot.add(collar);

      // 3 radial arms with curved anemometer cups
      for (let c = 0; c < 3; c++) {
        const ca = (c / 3) * Math.PI * 2;
        const armRod = new THREE.Mesh(
          new THREE.CylinderGeometry(0.024, 0.024, 0.38, 10),
          sharedGoldTrimMat,
        );
        armRod.rotation.z = Math.PI / 2;
        armRod.position.set(Math.cos(ca) * 0.19, 0, Math.sin(ca) * 0.19);
        armRod.rotation.y = ca;
        sunOrbPivot.add(armRod);

        // Hemispherical anemometer cup catching local wind
        const cup = new THREE.Mesh(
          new THREE.SphereGeometry(0.075, 12, 10, 0, Math.PI),
          sharedGoldTrimMat,
        );
        cup.position.set(Math.cos(ca) * 0.38, 0, Math.sin(ca) * 0.38);
        cup.rotation.y = ca + Math.PI / 2;
        sunOrbPivot.add(cup);
      }

      // Pyrite solar crystal jewel at the rotor tip
      const sunOrb = new THREE.Mesh(
        createBravaisCrystalHabitGeometry({ habit: 'cP-pyrite', radius: 0.28 }),
        sharedCrystalMat,
      );
      sunOrb.position.set(0, 0.16, 0);
      sunOrbPivot.add(sunOrb);
      group.add(sunOrbPivot);

      return { group, sunOrb, sunOrbPivot };
    };
    const meadowMonument = buildMeadowSundial();
    scene.add(meadowMonument.group);

    // Monument 3 (Bamboo Chime Grove): Wind-Carved Bamboo Pergola & Compound Chimes (`weldGapMeters === 0`)
    const buildGrovePergola = () => {
      const group = new THREE.Group();
      const [gx, gz] = groveSpec.centerXZ;
      const gy = groundHeightAt(gx, gz);
      group.position.set(gx, gy, gz);

      const jadeWoodMat = new THREE.MeshStandardMaterial({
        color: 0x0f766e,
        roughness: 0.55,
        metalness: 0.18,
      });

      const postGeo = createSegmentedBambooStalkGeometry({
        radiusBase: 0.24,
        radiusTop: 0.19,
        height: groveSpec.postHeight,
        nodeCount: 4,
      });
      const hs = groveSpec.postHalfSpan;
      const offsets = [
        [-hs, -hs],
        [hs, -hs],
        [-hs, hs],
        [hs, hs],
      ];

      // Deeply skirted river-stone footings (-0.38m embedded skirt into grove soil)
      for (const [ox, oz] of offsets) {
        const footing = new THREE.Mesh(
          new THREE.CylinderGeometry(0.38, 0.48, 0.56, 18),
          sharedStoneMat,
        );
        footing.position.set(ox, -0.16, oz);
        group.add(footing);

        // Cast bronze basal shoe collar
        const shoe = new THREE.Mesh(
          new THREE.CylinderGeometry(0.28, 0.32, 0.18, 16),
          sharedGoldTrimMat,
        );
        shoe.position.set(ox, 0.16, oz);
        group.add(shoe);

        const post = new THREE.Mesh(postGeo, jadeWoodMat);
        post.position.set(ox, 0.08, oz);
        group.add(post);

        const capital = new THREE.Mesh(
          new THREE.CylinderGeometry(0.30, 0.26, 0.36, 16),
          sharedGoldTrimMat,
        );
        capital.position.set(ox, groveSpec.roofElevationY, oz);
        group.add(capital);
      }

      // Outer torii/pergola roof ring
      const roofRing = new THREE.Mesh(
        new THREE.TorusGeometry(groveSpec.outerRoofRingRadius, 0.18, 14, 48),
        jadeWoodMat,
      );
      roofRing.rotation.x = Math.PI / 2;
      roofRing.position.y = groveSpec.roofElevationY;
      group.add(roofRing);

      // Double-beam mortise-and-tenon lintels with lashed bronze collars
      const lintelGeo = new THREE.CylinderGeometry(0.12, 0.12, groveSpec.lintelSpanLength, 14);
      for (const oz of [-hs, hs]) {
        const beamX = new THREE.Mesh(lintelGeo, jadeWoodMat);
        beamX.rotation.z = Math.PI / 2;
        beamX.position.set(0, groveSpec.roofElevationY, oz);
        group.add(beamX);
      }
      for (const ox of [-hs, hs]) {
        const beamZ = new THREE.Mesh(lintelGeo, jadeWoodMat);
        beamZ.rotation.x = Math.PI / 2;
        beamZ.position.set(ox, groveSpec.roofElevationY, 0);
        group.add(beamZ);
      }

      const diagBeamGeo = new THREE.CylinderGeometry(0.10, 0.10, groveSpec.diagonalTieLength, 12);
      diagBeamGeo.rotateZ(Math.PI / 2);
      for (const diagAngle of [Math.PI / 4, -Math.PI / 4]) {
        const dBeam = new THREE.Mesh(diagBeamGeo, jadeWoodMat);
        dBeam.position.set(0, groveSpec.roofElevationY, 0);
        dBeam.rotation.y = diagAngle;
        group.add(dBeam);
      }

      // Chime suspension ring
      const chimeSuspensionRing = new THREE.Mesh(
        new THREE.TorusGeometry(groveSpec.chimeRingRadius, 0.10, 12, 36),
        sharedGoldTrimMat,
      );
      chimeSuspensionRing.rotation.x = Math.PI / 2;
      chimeSuspensionRing.position.y = groveSpec.roofElevationY;
      group.add(chimeSuspensionRing);

      const centerBoss = new THREE.Mesh(
        new THREE.CylinderGeometry(0.24, 0.20, 0.26, 16),
        sharedGoldTrimMat,
      );
      centerBoss.position.y = groveSpec.roofElevationY;
      group.add(centerBoss);

      // Central wind-catcher clapper disc suspended inside the chime cluster
      const clapperPivot = new THREE.Group();
      clapperPivot.position.set(0, groveSpec.roofElevationY, 0);

      const clapperCord = new THREE.Mesh(
        new THREE.CylinderGeometry(0.014, 0.014, 0.95, 8),
        sharedGoldTrimMat,
      );
      clapperCord.position.y = -0.48;
      clapperPivot.add(clapperCord);

      const clapperDisc = new THREE.Mesh(
        new THREE.CylinderGeometry(0.38, 0.38, 0.06, 24),
        sharedGoldTrimMat,
      );
      clapperDisc.position.y = -0.95;
      clapperPivot.add(clapperDisc);
      group.add(clapperPivot);

      // 6 Compound pendulum chime tubes of staggered lengths
      const chimeTubes: THREE.Object3D[] = [];
      for (let i = 0; i < groveSpec.chimeCount; i++) {
        const a = (i / groveSpec.chimeCount) * Math.PI * 2;
        const tubeLen = groveSpec.chimeBaseLength + (i % 3) * groveSpec.chimeLengthStep;
        const cordLen = 0.28;

        const chimePivot = new THREE.Group();
        chimePivot.position.set(
          Math.cos(a) * groveSpec.chimeRingRadius,
          groveSpec.roofElevationY,
          Math.sin(a) * groveSpec.chimeRingRadius,
        );

        const hangerClamp = new THREE.Mesh(
          new THREE.TorusGeometry(0.11, 0.028, 8, 16),
          sharedGoldTrimMat,
        );
        chimePivot.add(hangerClamp);

        const suspensionRod = new THREE.Mesh(
          new THREE.CylinderGeometry(0.016, 0.016, cordLen, 8),
          sharedGoldTrimMat,
        );
        suspensionRod.position.y = -cordLen * 0.5;
        chimePivot.add(suspensionRod);

        const tubeCap = new THREE.Mesh(
          new THREE.CylinderGeometry(0.082, 0.082, 0.07, 14),
          jadeWoodMat,
        );
        tubeCap.position.y = -cordLen;
        chimePivot.add(tubeCap);

        const tubeBody = new THREE.Mesh(
          new THREE.CylinderGeometry(0.065, 0.065, tubeLen, 16),
          sharedGoldTrimMat,
        );
        tubeBody.position.y = -cordLen - tubeLen * 0.5;
        chimePivot.add(tubeBody);

        group.add(chimePivot);
        chimeTubes.push(chimePivot);
      }

      return { group, chimeTubes, clapperPivot };
    };
    const groveMonument = buildGrovePergola();
    scene.add(groveMonument.group);

    // Monument 4 (Crystal Cavern Basin): Prismatic Geode Archway with 100% Spire Closure (`weldGapMeters === 0`)
    const buildCrystalArchway = () => {
      const group = new THREE.Group();
      const [cx, cz] = crystalSpec.centerXZ;
      const cy = groundHeightAt(cx, cz);
      group.position.set(cx, cy, cz);

      const quartzMat = new THREE.MeshPhysicalMaterial({
        color: 0xbae6fd,
        vertexColors: true,
        emissive: 0x0284c7,
        emissiveIntensity: 0.62,
        roughness: 0.12,
        metalness: 0.2,
        clearcoat: 1.0,
        iridescence: 0.82,
        iridescenceIOR: 1.544,
        iridescenceThicknessMinimum: 240,
        iridescenceThicknessMaximum: 240 + initialFidelity.airyThinFilmSpanNm,
      });

      // Deeply skirted obsidian-basalt foundation ring (-0.45m embedded skirt into cavern rock)
      const skirtDepth = 0.45;
      const baseH = skirtDepth + 0.32;
      const geodeBaseRing = new THREE.Mesh(
        new THREE.CylinderGeometry(
          crystalSpec.baseRingRadius * 1.08,
          crystalSpec.baseRingRadius * 1.14,
          baseH,
          36,
        ),
        sharedStoneMat,
      );
      geodeBaseRing.position.y = -skirtDepth + baseH * 0.5;
      group.add(geodeBaseRing);

      // 12 Secondary clustered Bravais basal druse buttress crystals around the foundation feet
      for (let b = 0; b < 12; b++) {
        const ba = (b / 12) * Math.PI * 2;
        const br = crystalSpec.baseRingRadius * (0.92 + (b % 3) * 0.12);
        const druseHabit = ALL_14_BRAVAIS_CRYSTAL_HABITS[(b * 3) % ALL_14_BRAVAIS_CRYSTAL_HABITS.length];
        const druseGeo = createBravaisCrystalHabitGeometry({
          habit: druseHabit,
          radius: 0.32 + (b % 2) * 0.12,
          height: 0.85 + (b % 3) * 0.25,
        });
        const druseMesh = new THREE.Mesh(druseGeo, quartzMat);
        druseMesh.position.set(Math.cos(ba) * br, 0.28, Math.sin(ba) * br);
        druseMesh.rotation.set((b % 4) * 0.15, ba, (b % 3) * -0.12);
        group.add(druseMesh);
      }

      // ALL 6 Primary Hexagonal Bravais Arch Spires at full 100% length (sockets-to-keystone compression closure)
      for (let i = 0; i < crystalSpec.spireCount; i++) {
        const a = (i / crystalSpec.spireCount) * Math.PI * 2;
        const habitId = ALL_14_BRAVAIS_CRYSTAL_HABITS[i % ALL_14_BRAVAIS_CRYSTAL_HABITS.length];
        const spireHabitGeo = createBravaisCrystalHabitGeometry({
          habit: habitId,
          radius: 0.65,
          height: crystalSpec.spireHeight,
        });
        const spireSocket = new THREE.Group();
        spireSocket.position.set(
          Math.cos(a) * crystalSpec.baseRingRadius,
          0,
          Math.sin(a) * crystalSpec.baseRingRadius,
        );
        spireSocket.rotation.y = -a;
        const spire = new THREE.Mesh(spireHabitGeo, quartzMat);
        spire.position.set(
          -Math.sin(crystalSpec.spireLeanRad) * (crystalSpec.spireHeight * 0.42),
          crystalSpec.spireHeight * 0.45,
          0,
        );
        spire.rotation.z = crystalSpec.spireLeanRad;
        // Strictly 1.0 full span - eliminates floating arch gaps!
        spire.scale.setScalar(1.0);
        spireSocket.add(spire);
        group.add(spireSocket);
      }

      // Sculpted hexagonal keystone compression collar
      const keystoneRing = new THREE.Mesh(
        new THREE.TorusGeometry(crystalSpec.keystoneRingRadius, 0.22, 12, crystalSpec.spireCount * 2),
        quartzMat,
      );
      keystoneRing.rotation.x = Math.PI / 2;
      keystoneRing.position.y = crystalSpec.keystoneElevationY;
      group.add(keystoneRing);

      const basalCluster = new THREE.Mesh(
        createBravaisCrystalHabitGeometry({
          habit: 'cI-garnet',
          radius: 0.76,
          height: 2.45,
        }),
        sharedStoneMat,
      );
      basalCluster.position.y = 0.95;
      group.add(basalCluster);

      // Tensioned torsion-pendulum suspension cord (zero rod-skewering through the core prism)
      const suspensionCordLen = crystalSpec.keystoneElevationY - crystalSpec.corePrismElevationY - 0.45;
      const suspensionCord = new THREE.Mesh(
        new THREE.CylinderGeometry(0.018, 0.018, suspensionCordLen, 8),
        sharedGoldTrimMat,
      );
      suspensionCord.position.y = crystalSpec.keystoneElevationY - suspensionCordLen * 0.5;
      group.add(suspensionCord);

      const corePrismGeo = createBravaisCrystalHabitGeometry({
        habit: 'hP-quartz',
        radius: 0.76,
        height: 2.15,
      });
      const corePrism = new THREE.Mesh(corePrismGeo, quartzMat);
      corePrism.position.y = crystalSpec.corePrismElevationY;
      group.add(corePrism);

      return { group, corePrism, quartzMat };
    };
    const crystalMonument = buildCrystalArchway();
    scene.add(crystalMonument.group);

    // Monument 5 (Bioluminescent Wetland): Hydrostatic Lagoon & Lakebed-Embedded Lantern Piers
    const lagoonGeo = new THREE.CircleGeometry(15.2, 72);
    lagoonGeo.rotateX(-Math.PI / 2);
    const lagoonMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(cachedSpectralDiurnal.lagoonWaterAbsorption.hex).lerp(
        new THREE.Color(0x14b8a6),
        0.45,
      ),
      emissive: 0x0f766e,
      emissiveIntensity: 0.28,
      roughness: 0.07,
      metalness: 0.22,
      clearcoat: 0.96,
      iridescence: 0.52,
      iridescenceIOR: 1.333,
      iridescenceThicknessMinimum: 180,
      iridescenceThicknessMaximum: 180 + initialFidelity.airyThinFilmSpanNm * 0.65,
      transparent: true,
      opacity: 0.85,
    });
    const lagoonMesh = new THREE.Mesh(lagoonGeo, lagoonMat);
    lagoonMesh.position.set(
      wetlandSpec.centerXZ[0],
      MIRROR_LAGOON_WATER_SURFACE_Y,
      wetlandSpec.centerXZ[1],
    );
    scene.add(lagoonMesh);

    const shorelineBankGroup = new THREE.Group();
    const shorelineStoneGeo = createStratifiedBoulderGeometry({
      radius: 0.62,
      detailRings: 14,
      radialSegments: 20,
      seed: 404,
    });
    const shorelineMossStoneMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      map: pbrSuite.stoneColorTex,
      normalMap: pbrSuite.stoneNormalTex,
      normalScale: new THREE.Vector2(0.42, 0.42),
      bumpMap: groundBumpTex,
      bumpScale: 0.05,
      roughness: 0.84,
      metalness: 0.08,
    });
    const shorelineCrystalGeos = ALL_14_BRAVAIS_CRYSTAL_HABITS.map((habit) =>
      createBravaisCrystalHabitGeometry({ habit, radius: 0.22, height: 0.52 }),
    );
    const shorelineBoulders = generateConservatoryShorelineBoulders();
    for (let i = 0; i < shorelineBoulders.length; i++) {
      const sb = shorelineBoulders[i];
      const boulder = new THREE.Mesh(shorelineStoneGeo, shorelineMossStoneMat);
      boulder.position.set(sb.x, sb.centerY, sb.z);
      boulder.scale.set(sb.scaleX, sb.scaleY, sb.scaleZ);
      boulder.rotation.y = sb.rotY;
      shorelineBankGroup.add(boulder);

      // Every third shoreline outcrop hosts a gleaming IUCr Bravais mineral druse crystal
      if (i % 3 === 0) {
        const druse = new THREE.Mesh(
          shorelineCrystalGeos[(i / 3) % shorelineCrystalGeos.length],
          crystalMonument.quartzMat,
        );
        druse.position.set(sb.x, sb.centerY + 0.34 * sb.scaleY, sb.z);
        druse.rotation.set(0.18, sb.rotY + 0.6, -0.14);
        shorelineBankGroup.add(druse);
      }
    }
    scene.add(shorelineBankGroup);

    const buildWetlandLanterns = () => {
      const group = new THREE.Group();
      group.position.set(
        wetlandSpec.centerXZ[0],
        MIRROR_LAGOON_WATER_SURFACE_Y,
        wetlandSpec.centerXZ[1],
      );
      const lanternOrbs: THREE.Mesh[] = [];
      const lanternMat = new THREE.MeshStandardMaterial({
        color: 0x5eead4,
        emissive: 0x2dd4bf,
        emissiveIntensity: 0.95,
        roughness: 0.18,
      });

      for (let i = 0; i < wetlandSpec.pierCount; i++) {
        const a = (i / wetlandSpec.pierCount) * Math.PI * 2;
        const r = i === 0 ? 0 : wetlandSpec.outerPierRingRadius;
        const lx = Math.cos(a) * r;
        const lz = Math.sin(a) * r;

        const lanternUnit = new THREE.Group();
        lanternUnit.position.set(lx, 0, lz);

        // Grounded stepped tufa foundation piling embedded >= 0.28m into lakebed floor (zero mid-water floating gap)
        const lakebedY = groundHeightAt(wetlandSpec.centerXZ[0] + lx, wetlandSpec.centerXZ[1] + lz);
        const embedMeters = 0.28;
        const pilingTotalH = Math.max(0.65, (MIRROR_LAGOON_WATER_SURFACE_Y - lakebedY) + embedMeters + 0.12);
        const pierPiling = new THREE.Mesh(
          new THREE.CylinderGeometry(
            wetlandSpec.padRadius * 0.88,
            wetlandSpec.padRadius * 1.15,
            pilingTotalH,
            16,
          ),
          sharedStoneMat,
        );
        pierPiling.position.y = (lakebedY - embedMeters) + pilingTotalH * 0.5 - MIRROR_LAGOON_WATER_SURFACE_Y;
        lanternUnit.add(pierPiling);

        // Carved lotus-petal stone capital plinth emerging cleanly through the water meniscus
        const capitalPad = new THREE.Mesh(
          new THREE.CylinderGeometry(
            wetlandSpec.padRadius * 0.95,
            wetlandSpec.padRadius * 0.82,
            0.24,
            16,
          ),
          sharedStoneMat,
        );
        capitalPad.position.y = 0.12;
        lanternUnit.add(capitalPad);

        const chamberDeck = new THREE.Mesh(
          new THREE.CylinderGeometry(0.44, 0.32, 0.09, 8),
          sharedGoldTrimMat,
        );
        chamberDeck.position.y = wetlandSpec.chamberDeckY;
        lanternUnit.add(chamberDeck);

        // Open 6-strut bronze lantern cage cradling the glowing crystal (no skewering central rod)
        const strutMidY = (wetlandSpec.chamberDeckY + wetlandSpec.pagodaRoofY) * 0.5 - 0.04;
        for (let s = 0; s < 6; s++) {
          const sa = (s / 6) * Math.PI * 2;
          const strut = new THREE.Mesh(
            new THREE.CylinderGeometry(0.024, 0.024, wetlandSpec.frameStrutHeight, 8),
            sharedGoldTrimMat,
          );
          strut.position.set(Math.cos(sa) * 0.30, strutMidY, Math.sin(sa) * 0.30);
          lanternUnit.add(strut);
        }

        // Lower sculpted lotus pedestal holding the glowing calcite crystal
        const lotusCup = new THREE.Mesh(
          new THREE.CylinderGeometry(0.24, 0.16, 0.12, 12),
          sharedGoldTrimMat,
        );
        lotusCup.position.y = wetlandSpec.orbCenterY - 0.22;
        lanternUnit.add(lotusCup);

        const orb = new THREE.Mesh(
          createBravaisCrystalHabitGeometry({
            habit: 'hR-calcite',
            radius: wetlandSpec.orbRadius,
          }),
          lanternMat,
        );
        orb.position.y = wetlandSpec.orbCenterY;
        lanternUnit.add(orb);
        lanternOrbs.push(orb);

        // 2-Tiered hexagonal pagoda roof
        const pagodaRoofLower = new THREE.Mesh(
          new THREE.CylinderGeometry(0.18, 0.62, 0.16, 6),
          sharedStoneMat,
        );
        pagodaRoofLower.position.y = wetlandSpec.pagodaRoofY;
        lanternUnit.add(pagodaRoofLower);

        const pagodaRoofUpper = new THREE.Mesh(
          new THREE.CylinderGeometry(0.08, 0.38, 0.14, 6),
          sharedStoneMat,
        );
        pagodaRoofUpper.position.y = wetlandSpec.pagodaRoofY + 0.15;
        lanternUnit.add(pagodaRoofUpper);

        const finial = new THREE.Mesh(
          new THREE.SphereGeometry(0.085, 12, 10),
          sharedGoldTrimMat,
        );
        finial.position.y = wetlandSpec.pagodaRoofY + 0.28;
        lanternUnit.add(finial);

        group.add(lanternUnit);
      }
      return { group, lanternOrbs, lanternMat };
    };
    const wetlandMonument = buildWetlandLanterns();
    scene.add(wetlandMonument.group);

    // 5e. Intentional Biome Landscape Terraces & Chladni Standing-Wave Plinths (`Foundation.Teleology.V1.Model` + `Foundation.Articulation.V1.Model`)
    const worldTopo = DEFAULT_PARAMETRIC_WORLD_TOPOLOGY;
    const chladniTerraces = synthesizeParametricChladniTerraceRadii(worldTopo.terraceSpecs);
    const [sanctTx, sanctTz] = worldTopo.biomeCenters.sanctuary;
    const [sundialTx, sundialTz] = worldTopo.meadowSundialCenterXZ;
    const [groveTx, groveTz] = worldTopo.biomeCenters.grove;
    const [crystalTx, crystalTz] = worldTopo.biomeCenters.crystal;
    const [lagoonTx, lagoonTz] = worldTopo.lagoonCenterXZ;

    // Terrace 1: Sanctuary 5-Ring Golden-Ratio Harmonic Labyrinth (derived from worldTopo.terraceSpecs)
    const labyrinthGroup = new THREE.Group();
    labyrinthGroup.position.set(sanctTx, groundHeightAt(sanctTx, sanctTz) + 0.03, sanctTz);
    const labyrinthMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.34,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    for (let rIdx = 0; rIdx < chladniTerraces.sanctuaryRings.length; rIdx++) {
      const r = chladniTerraces.sanctuaryRings[rIdx];
      const ring = new THREE.Mesh(new THREE.RingGeometry(r, r + 0.14, 48), labyrinthMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = rIdx * 0.003;
      labyrinthGroup.add(ring);
    }
    scene.add(labyrinthGroup);

    // Terrace 2: Meadow Sunlit Travertine Parterre Rings & 8 Cardinal Sundial Rays
    const meadowTerraceGroup = new THREE.Group();
    meadowTerraceGroup.position.set(
      sundialTx,
      groundHeightAt(sundialTx, sundialTz) + 0.025,
      sundialTz,
    );
    const meadowParterreMat = new THREE.MeshBasicMaterial({
      color: 0xfde047,
      transparent: true,
      opacity: 0.28,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    for (const r of chladniTerraces.meadowRings) {
      const ring = new THREE.Mesh(new THREE.RingGeometry(r, r + 0.12, 40), meadowParterreMat);
      ring.rotation.x = -Math.PI / 2;
      meadowTerraceGroup.add(ring);
    }
    const rayGeo = new THREE.PlaneGeometry(0.14, 4.2);
    rayGeo.rotateX(-Math.PI / 2);
    for (let h = 0; h < chladniTerraces.meadowCardinalRayCount; h++) {
      const angle = (h / chladniTerraces.meadowCardinalRayCount) * Math.PI * 2;
      const ray = new THREE.Mesh(rayGeo, meadowParterreMat);
      ray.position.set(
        Math.cos(angle) * chladniTerraces.meadowCardinalRayCenterRadius,
        0.004,
        Math.sin(angle) * chladniTerraces.meadowCardinalRayCenterRadius,
      );
      ray.rotation.y = -angle;
      meadowTerraceGroup.add(ray);
    }
    scene.add(meadowTerraceGroup);

    // Terrace 3: Bamboo Grove Raked Zen Moss & Jade Gravel Acoustic Ring Terrace
    const groveTerraceGroup = new THREE.Group();
    groveTerraceGroup.position.set(groveTx, groundHeightAt(groveTx, groveTz) + 0.028, groveTz);
    const zenRingMat = new THREE.MeshBasicMaterial({
      color: 0x34d399,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    for (const r of chladniTerraces.groveRings) {
      const ring = new THREE.Mesh(new THREE.RingGeometry(r, r + 0.14, 36), zenRingMat);
      ring.rotation.x = -Math.PI / 2;
      groveTerraceGroup.add(ring);
    }
    scene.add(groveTerraceGroup);

    // Terrace 4: Crystal Obsidian-Sapphire Geode Mirror Basin & Hexagonal Prismatic Rings
    const crystalBasinGroup = new THREE.Group();
    crystalBasinGroup.position.set(
      crystalTx,
      groundHeightAt(crystalTx, crystalTz) + 0.03,
      crystalTz,
    );
    const crystalDiscMat = new THREE.MeshPhysicalMaterial({
      color: 0x0c4a6e,
      emissive: 0x0369a1,
      emissiveIntensity: 0.32,
      roughness: 0.14,
      metalness: 0.35,
      clearcoat: 0.95,
    });
    const crystalDisc = new THREE.Mesh(
      new THREE.CircleGeometry(worldTopo.plinthSpecs.crystal.materialRadiusMeters, 6),
      crystalDiscMat,
    );
    crystalDisc.rotation.x = -Math.PI / 2;
    crystalBasinGroup.add(crystalDisc);
    const hexFacetMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.42,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    for (const r of chladniTerraces.crystalHexRings) {
      const hexRing = new THREE.Mesh(new THREE.RingGeometry(r, r + 0.16, 6), hexFacetMat);
      hexRing.rotation.x = -Math.PI / 2;
      hexRing.position.y = 0.015;
      crystalBasinGroup.add(hexRing);
    }
    scene.add(crystalBasinGroup);

    // Terrace 5: Wetland Concentric Meniscus Water-Harp Rings on Mirror Lagoon (coupled to Neuromorphic Cymatics)
    const wetlandMeniscusRings: { mesh: THREE.Mesh; mat: THREE.MeshBasicMaterial; radius: number }[] = [];
    for (const r of chladniTerraces.wetlandMeniscusRings) {
      const mat = new THREE.MeshBasicMaterial({
        color: 0x5eead4,
        transparent: true,
        opacity: 0.32,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const mRing = new THREE.Mesh(new THREE.RingGeometry(r, r + 0.12, 48), mat);
      mRing.rotation.x = -Math.PI / 2;
      mRing.position.set(lagoonTx, MIRROR_LAGOON_WATER_SURFACE_Y + 0.012, lagoonTz);
      scene.add(mRing);
      wetlandMeniscusRings.push({ mesh: mRing, mat, radius: r });
    }

    // 5f. Terpene Tyndall Resonance Columns & Crown Halos (`ecosystem-terpene-tyndall-columns`)
    // Anchored directly onto each synthesized Landmark's exact centerXZ and parametric crown elevation
    const constellationBeamGeo = new THREE.CylinderGeometry(0.18, 0.55, 22, 16, 1, true);
    constellationBeamGeo.translate(0, 11, 0);
    const constellationCrownGeo = new THREE.TorusGeometry(2.1, 0.045, 10, 40);
    constellationCrownGeo.rotateX(Math.PI / 2);

    const landmarkAnchorByBiome: Record<BiomeId, readonly [number, number]> = {
      sanctuary: sanctSpec.centerXZ,
      meadow: meadowSpec.centerXZ,
      grove: groveSpec.centerXZ,
      crystal: crystalSpec.centerXZ,
      wetland: wetlandSpec.centerXZ,
    };
    const crownHeightsByBiome: Record<BiomeId, number> = {
      sanctuary: sanctSpec.haloElevationY + 0.55,
      meadow: meadowSpec.sunOrbPivotY + 0.62,
      grove: groveSpec.roofElevationY + 0.45,
      crystal: crystalSpec.keystoneElevationY + 0.52,
      wetland: wetlandSpec.pagodaRoofY + 0.45,
    };

    const biomeConstellationBeams: {
      biome: BiomeId;
      beamMesh: THREE.Mesh;
      beamMat: THREE.MeshBasicMaterial;
      crownMesh: THREE.Mesh;
      crownMat: THREE.MeshBasicMaterial;
      crownOffsetY: number;
    }[] = [];

    (Object.keys(BIOME_CONFIGS) as BiomeId[]).forEach((bId) => {
      const cCfg = BIOME_CONSTELLATIONS[bId];
      const [bx, bz] = landmarkAnchorByBiome[bId];
      const baseElev = bId === 'wetland' ? MIRROR_LAGOON_WATER_SURFACE_Y : groundHeightAt(bx, bz);

      const beamMat = new THREE.MeshBasicMaterial({
        color: cCfg.beamColorHex,
        transparent: true,
        opacity: 0.06,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const beamMesh = new THREE.Mesh(constellationBeamGeo, beamMat);
      // Elevate plume start above monument crown so Tyndall column projects into upper atmosphere without skewering architecture
      beamMesh.position.set(bx, baseElev + crownHeightsByBiome[bId] + 0.35, bz);
      scene.add(beamMesh);

      const crownMat = new THREE.MeshBasicMaterial({
        color: cCfg.beamColorHex,
        transparent: true,
        opacity: 0.16,
        depthWrite: false,
      });
      const crownMesh = new THREE.Mesh(constellationCrownGeo, crownMat);
      crownMesh.position.set(bx, baseElev + crownHeightsByBiome[bId], bz);
      scene.add(crownMesh);

      biomeConstellationBeams.push({
        biome: bId,
        beamMesh,
        beamMat,
        crownMesh,
        crownMat,
        crownOffsetY: crownHeightsByBiome[bId],
      });
    });

    // 6. Stepping Stones along the central vista & biome trails (`generateConservatorySteppingStones`, slope-embedded)
    const steppingStones = generateConservatorySteppingStones();
    const stoneCount = steppingStones.length;
    const stepStoneGeo = new THREE.CylinderGeometry(0.85, 0.95, 0.28, 16);
    const stepStoneMat = new THREE.MeshStandardMaterial({
      color: 0xa8a29e,
      map: pbrSuite.stoneColorTex,
      normalMap: pbrSuite.stoneNormalTex,
      normalScale: new THREE.Vector2(0.45, 0.45),
      bumpMap: groundBumpTex,
      bumpScale: 0.04,
      roughness: 0.8,
      metalness: 0.08,
    });
    const stepStonesMesh = new THREE.InstancedMesh(stepStoneGeo, stepStoneMat, stoneCount);
    for (let i = 0; i < stoneCount; i++) {
      const st = steppingStones[i];
      _dummyPos.set(st.x, st.centerY, st.z);
      _dummyEuler.set(0, st.rotY, 0);
      _dummyQuat.setFromEuler(_dummyEuler);
      _dummyScale.set(st.scaleX, st.scaleY, st.scaleZ);
      _dummyMatrix.compose(_dummyPos, _dummyQuat, _dummyScale);
      stepStonesMesh.setMatrixAt(i, _dummyMatrix);
    }
    stepStonesMesh.instanceMatrix.needsUpdate = true;
    stepStonesMesh.computeBoundingSphere();
    scene.add(stepStonesMesh);

    // 7. Natural Perimeter Rock Outcrops (`generateConservatoryRocks`, Stratified B-Mesh) & Segmented Nodal Bamboo/Crystal Stalks (`generateConservatoryTrees`, bottom-pivoted)
    const conservatoryRocks = generateConservatoryRocks();
    const rockCount = conservatoryRocks.length;
    let rockGeo = createStratifiedBoulderGeometry({
      radius: 2.6,
      detailRings: Math.max(14, Math.round(initialFidelity.bMeshRadialSubdivisions * 0.42)),
      radialSegments: Math.max(18, Math.round(initialFidelity.bMeshRadialSubdivisions * 0.56)),
      seed: 707,
    });
    const rockMat = new THREE.MeshStandardMaterial({
      color: 0x3f4f47,
      normalMap: pbrSuite.stoneNormalTex,
      normalScale: new THREE.Vector2(0.52, 0.52),
      roughness: 0.88,
      metalness: 0.08,
    });
    const rocksInstanced = new THREE.InstancedMesh(rockGeo, rockMat, rockCount);
    for (let i = 0; i < rockCount; i++) {
      const rk = conservatoryRocks[i];
      _dummyPos.set(rk.x, rk.centerY, rk.z);
      _dummyEuler.set(rk.rotX, rk.rotY, rk.rotZ);
      _dummyQuat.setFromEuler(_dummyEuler);
      _dummyScale.set(rk.scaleX, rk.scaleY, rk.scaleZ);
      _dummyMatrix.compose(_dummyPos, _dummyQuat, _dummyScale);
      rocksInstanced.setMatrixAt(i, _dummyMatrix);
      _tempColor.setHSL(0.42 + (i % 5) * 0.02, 0.18, 0.24 + (i % 3) * 0.04);
      rocksInstanced.setColorAt(i, _tempColor);
    }
    rocksInstanced.instanceMatrix.needsUpdate = true;
    if (rocksInstanced.instanceColor) rocksInstanced.instanceColor.needsUpdate = true;
    rocksInstanced.computeBoundingSphere();
    scene.add(rocksInstanced);

    const conservatoryTrees = generateConservatoryTrees();
    const stalkCount = conservatoryTrees.length;
    // High-definition 5-internode bamboo/crystal culm with nodal diaphragm rings, entasis taper, and bottom-pivot at y = 0
    const stalkGeo = createSegmentedBambooStalkGeometry({
      radiusBase: 0.24,
      radiusTop: 0.17,
      height: 7.6,
      nodeCount: 5,
    });
    const stalkMat = new THREE.MeshStandardMaterial({
      color: 0x5eead4,
      normalMap: pbrSuite.petalVeinNormalTex,
      normalScale: new THREE.Vector2(0.28, 0.28),
      roughness: 0.34,
      metalness: 0.24,
    });
    const stalksInstanced = new THREE.InstancedMesh(stalkGeo, stalkMat, stalkCount);
    for (let i = 0; i < stalkCount; i++) {
      const tr = conservatoryTrees[i];
      _dummyPos.set(tr.x, tr.baseY, tr.z);
      // Zero yaw inside Euler(tiltX, 0, tiltZ) so the 3D tilted trunk centerline passes through the exact center of both canopy tiers
      _dummyEuler.set(tr.tiltX, 0, tr.tiltZ);
      _dummyQuat.setFromEuler(_dummyEuler);
      _dummyScale.set(tr.scaleXZ, tr.scaleY, tr.scaleXZ);
      _dummyMatrix.compose(_dummyPos, _dummyQuat, _dummyScale);
      stalksInstanced.setMatrixAt(i, _dummyMatrix);
      _tempColor.set(tr.isCrystalSide ? '#38bdf8' : '#34d399');
      stalksInstanced.setColorAt(i, _tempColor);
    }
    stalksInstanced.instanceMatrix.needsUpdate = true;
    if (stalksInstanced.instanceColor) stalksInstanced.instanceColor.needsUpdate = true;
    stalksInstanced.computeBoundingSphere();
    scene.add(stalksInstanced);

    // 7a-2. Bamboo & Crystal Canopy Foliage Crowns (128 sculpted multi-lobe botanical crowns with underside collar attached to 3D tilted trunk axes)
    const canopyCount = stalkCount * 2;
    let canopyGeo = createSculptedCanopyCrownGeometry({
      radius: 1.05,
      height: 1.45,
      lobeCount: Math.max(9, Math.round(initialFidelity.bMeshRadialSubdivisions * 0.26)),
    });
    const canopyMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      normalMap: pbrSuite.petalVeinNormalTex,
      normalScale: new THREE.Vector2(0.32, 0.32),
      roughness: 0.46,
      metalness: 0.12,
      side: THREE.DoubleSide,
    });
    const canopyInstanced = new THREE.InstancedMesh(canopyGeo, canopyMat, canopyCount);
    const canopyX = new Float32Array(canopyCount);
    const canopyY = new Float32Array(canopyCount);
    const canopyZ = new Float32Array(canopyCount);
    const canopyScale = new Float32Array(canopyCount);
    const canopyTier = new Uint8Array(canopyCount);
    const canopyBaseTiltX = new Float32Array(canopyCount);
    const canopyBaseTiltZ = new Float32Array(canopyCount);

    for (let i = 0; i < canopyCount; i++) {
      const stalkIdx = i % stalkCount;
      const tier = Math.floor(i / stalkCount) as 0 | 1;
      const tr = conservatoryTrees[stalkIdx];
      const tierSpec = tr.canopyTiers[tier];
      canopyX[i] = tierSpec.x;
      canopyY[i] = tierSpec.y;
      canopyZ[i] = tierSpec.z;
      canopyScale[i] = tierSpec.scale;
      canopyTier[i] = tier;
      canopyBaseTiltX[i] = tr.tiltX;
      canopyBaseTiltZ[i] = tr.tiltZ;

      _dummyPos.set(tierSpec.x, tierSpec.y, tierSpec.z);
      _dummyEuler.set(tr.tiltX, i * 1.1, tr.tiltZ);
      _dummyQuat.setFromEuler(_dummyEuler);
      _dummyScale.set(tierSpec.scale, 0.75, tierSpec.scale);
      _dummyMatrix.compose(_dummyPos, _dummyQuat, _dummyScale);
      canopyInstanced.setMatrixAt(i, _dummyMatrix);
      _tempColor.set(tr.isCrystalSide ? '#7dd3fc' : '#10b981');
      canopyInstanced.setColorAt(i, _tempColor);
    }
    canopyInstanced.instanceMatrix.needsUpdate = true;
    if (canopyInstanced.instanceColor) canopyInstanced.instanceColor.needsUpdate = true;
    canopyInstanced.computeBoundingSphere();
    scene.add(canopyInstanced);

    // 7b. Instanced Meadow Grass & Bioluminescent Reed Blades (`generateConservatoryGrassBlades`, curved carinate V-blade B-Mesh)
    const grassBlades = generateConservatoryGrassBlades();
    const GRASS_COUNT = grassBlades.length;
    const grassGeo = createSculptedGrassBladeGeometry({
      width: 0.12,
      height: 0.88,
      archCurve: 0.18,
    });
    const grassMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.58,
      metalness: 0.08,
      side: THREE.DoubleSide,
    });
    const grassInstanced = new THREE.InstancedMesh(grassGeo, grassMat, GRASS_COUNT);
    const grassX = new Float32Array(GRASS_COUNT);
    const grassY = new Float32Array(GRASS_COUNT);
    const grassZ = new Float32Array(GRASS_COUNT);
    const grassHScale = new Float32Array(GRASS_COUNT);
    const grassYaw = new Float32Array(GRASS_COUNT);
    const grassValid = new Uint8Array(GRASS_COUNT);

    for (let i = 0; i < GRASS_COUNT; i++) {
      const gb = grassBlades[i];
      grassX[i] = gb.x;
      grassY[i] = gb.y;
      grassZ[i] = gb.z;
      grassHScale[i] = gb.hScale;
      grassYaw[i] = gb.yaw;
      grassValid[i] = gb.valid ? 1 : 0;

      _dummyPos.set(gb.x, gb.y, gb.z);
      _dummyEuler.set((i % 5) * 0.05 - 0.1, gb.yaw, ((i + 2) % 5) * 0.05 - 0.1);
      _dummyQuat.setFromEuler(_dummyEuler);
      _dummyScale.set(1, gb.hScale, 1);
      _dummyMatrix.compose(_dummyPos, _dummyQuat, _dummyScale);
      grassInstanced.setMatrixAt(i, _dummyMatrix);

      const b = gb.biome;
      _tempColor.set(
        b === 'meadow'
          ? '#4ade80'
          : b === 'grove'
            ? '#34d399'
            : b === 'wetland'
              ? '#2dd4bf'
              : b === 'crystal'
                ? '#38bdf8'
                : '#fbbf24',
      );
      grassInstanced.setColorAt(i, _tempColor);
    }
    grassInstanced.instanceMatrix.needsUpdate = true;
    if (grassInstanced.instanceColor) grassInstanced.instanceColor.needsUpdate = true;
    grassInstanced.computeBoundingSphere();
    scene.add(grassInstanced);

    // 8. High-Definition Parametric B-Mesh, Shape-Key & 3-Joint Kinematic Plant Species Builder (`Foundation.Botany.V1.Model`)
    const shadowDiscGeo = new THREE.CircleGeometry(1.2, 24);
    shadowDiscGeo.rotateX(-Math.PI / 2);
    const shadowDiscMat = new THREE.MeshBasicMaterial({
      color: 0x040d09,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
    });

    // Shared High-Definition Parametric B-Mesh & Morph-Target Botanical Geometries
    // Scaled dynamically by `multiModalFidelity.bMeshRadialSubdivisions` (`28..56`) and CIE 1931 PROSPECT chlorophyll spectra
    const lotusCupPoints = [
      new THREE.Vector2(0.04, 0.0),
      new THREE.Vector2(0.32, 0.08),
      new THREE.Vector2(0.52, 0.26),
      new THREE.Vector2(0.58, 0.48),
    ];

    interface BotanicalBMeshSuite {
      subdivisions: number;
      rosetteLeaf: THREE.BufferGeometry;
      bellCorolla: THREE.BufferGeometry;
      pinnateFrond: THREE.BufferGeometry;
      crozierA: THREE.BufferGeometry;
      crozierB: THREE.BufferGeometry;
      lotusPad: THREE.BufferGeometry;
      lotusOuterPetal: THREE.BufferGeometry;
      lotusInnerPetal: THREE.BufferGeometry;
      orchidSepal: THREE.BufferGeometry;
      orchidTepal: THREE.BufferGeometry;
      lotusCupLathe: THREE.BufferGeometry;
    }
    type BotanicalOrganSlot = Exclude<keyof BotanicalBMeshSuite, 'subdivisions'>;

    const buildBotanicalBMeshSuite = (
      bMeshSubdiv: number,
      specPalette: SpectralDiurnalPalette,
    ): BotanicalBMeshSuite => {
      const subdiv = isSoftwareGl ? 24 : Math.max(28, Math.min(64, Math.round(bMeshSubdiv)));
      const radPetal = Math.max(10, Math.round(subdiv * 0.36));
      const longPetal = Math.max(14, Math.round(subdiv * 0.52));
      return {
        subdivisions: subdiv,
        rosetteLeaf: createSculptedPetalGeometry({
          length: 0.92,
          maxWidth: 0.30,
          curvature: 0.32,
          tipRecurve: -0.14,
          midribDepth: 0.025,
          ruffleAmplitude: 0.012,
          baseColorHex: specPalette.foliageCanopy.hex,
          tipColorHex: specPalette.foliageRedEdgeSheen.hex,
          radialSegments: radPetal,
          longitudinalSegments: longPetal,
        }),
        bellCorolla: createFlutedBellCorollaGeometry({
          radiusTop: 0.44,
          height: 0.60,
          lobeCount: 8,
          radialSegments: subdiv,
          heightSegments: Math.max(14, Math.round(subdiv * 0.5)),
        }),
        pinnateFrond: createPinnateFrondGeometry({
          length: 1.56,
          maxWidth: 0.46,
          pinnaePairs: Math.max(9, Math.round(subdiv * 0.28)),
        }),
        crozierA: createLogarithmicCrozierGeometry({
          scaleRadius: 0.30,
          tubeRadius: 0.048,
          turns: 1.85,
          tubularSegments: subdiv,
          radialSegments: Math.max(10, Math.round(subdiv * 0.32)),
        }),
        crozierB: createLogarithmicCrozierGeometry({
          scaleRadius: 0.21,
          tubeRadius: 0.036,
          turns: 1.65,
          tubularSegments: Math.max(24, Math.round(subdiv * 0.85)),
          radialSegments: Math.max(8, Math.round(subdiv * 0.26)),
        }),
        lotusPad: createCordateLotusPadGeometry({
          radius: 0.98,
          rimHeight: 0.052,
          sinusDepth: 0.58,
          veinCount: Math.max(14, Math.round(subdiv * 0.45)),
          radialSegments: Math.max(32, Math.round(subdiv * 1.15)),
          ringSegments: Math.max(12, Math.round(subdiv * 0.4)),
        }),
        lotusOuterPetal: createSculptedPetalGeometry({
          length: 0.74,
          maxWidth: 0.28,
          curvature: 0.38,
          tipRecurve: 0.08,
          midribDepth: 0.022,
          ruffleAmplitude: 0.014,
          baseColorHex: '#2dd4bf',
          tipColorHex: '#99f6e4',
          radialSegments: Math.max(12, Math.round(subdiv * 0.4)),
          longitudinalSegments: Math.max(16, Math.round(subdiv * 0.56)),
        }),
        lotusInnerPetal: createSculptedPetalGeometry({
          length: 0.56,
          maxWidth: 0.22,
          curvature: 0.44,
          tipRecurve: 0.12,
          midribDepth: 0.018,
          ruffleAmplitude: 0.010,
          baseColorHex: '#fef08a',
          tipColorHex: '#ffffff',
          radialSegments: radPetal,
          longitudinalSegments: longPetal,
        }),
        orchidSepal: createSculptedPetalGeometry({
          length: 0.78,
          maxWidth: 0.24,
          curvature: 0.28,
          tipRecurve: -0.10,
          midribDepth: 0.020,
          ruffleAmplitude: 0.018,
          baseColorHex: '#38bdf8',
          tipColorHex: '#e0f2fe',
          radialSegments: Math.max(12, Math.round(subdiv * 0.4)),
          longitudinalSegments: Math.max(16, Math.round(subdiv * 0.56)),
        }),
        orchidTepal: createSculptedPetalGeometry({
          length: 0.54,
          maxWidth: 0.19,
          curvature: 0.34,
          tipRecurve: 0.14,
          midribDepth: 0.016,
          ruffleAmplitude: 0.022,
          baseColorHex: '#fef08a',
          tipColorHex: '#ffffff',
          radialSegments: radPetal,
          longitudinalSegments: longPetal,
        }),
        lotusCupLathe: new THREE.LatheGeometry(lotusCupPoints, Math.max(20, subdiv)),
      };
    };

    const registerSuiteGeometries = (
      suite: BotanicalBMeshSuite,
      set: Set<THREE.BufferGeometry>,
    ) => {
      set.add(suite.rosetteLeaf);
      set.add(suite.bellCorolla);
      set.add(suite.pinnateFrond);
      set.add(suite.crozierA);
      set.add(suite.crozierB);
      set.add(suite.lotusPad);
      set.add(suite.lotusOuterPetal);
      set.add(suite.lotusInnerPetal);
      set.add(suite.orchidSepal);
      set.add(suite.orchidTepal);
      set.add(suite.lotusCupLathe);
    };

    const disposeSuiteGeometries = (
      suite: BotanicalBMeshSuite,
      set: Set<THREE.BufferGeometry>,
    ) => {
      const all: THREE.BufferGeometry[] = [
        suite.rosetteLeaf,
        suite.bellCorolla,
        suite.pinnateFrond,
        suite.crozierA,
        suite.crozierB,
        suite.lotusPad,
        suite.lotusOuterPetal,
        suite.lotusInnerPetal,
        suite.orchidSepal,
        suite.orchidTepal,
        suite.lotusCupLathe,
      ];
      for (const g of all) {
        set.delete(g);
        g.dispose();
      }
    };

    let activeBMeshSuite = buildBotanicalBMeshSuite(
      initialFidelity.bMeshRadialSubdivisions,
      cachedSpectralDiurnal,
    );
    const holdfastCrystalGeos = ALL_14_BRAVAIS_CRYSTAL_HABITS.map((habit) =>
      createBravaisCrystalHabitGeometry({ habit, radius: 0.085, height: 0.24 }),
    );
    const sharedPlantGeometries = new Set<THREE.BufferGeometry>([
      shadowDiscGeo,
      ...holdfastCrystalGeos,
    ]);
    registerSuiteGeometries(activeBMeshSuite, sharedPlantGeometries);
    const sharedPlantMaterials = new Set<THREE.Material>([
      shadowDiscMat,
      crystalMonument.quartzMat,
    ]);

    interface AnimatedPlantRecord {
      instance: GardenPlantInstance;
      group: THREE.Group;
      basalJoint: THREE.Group;
      medialJoint: THREE.Group;
      apicalJoint: THREE.Group;
      morphMeshes: THREE.Mesh[];
      organBindings: Array<{ mesh: THREE.Mesh; slot: BotanicalOrganSlot }>;
      stemMat: THREE.MeshStandardMaterial;
      bloomMat: THREE.MeshPhysicalMaterial;
      accentMat: THREE.MeshPhysicalMaterial;
      shaderUniforms: BotanicalShaderUniforms | null;
      emissiveMaterials: THREE.MeshStandardMaterial[];
      haloRing: THREE.Mesh;
      fruitingCrown: THREE.Group;
      elderHaloRing: THREE.Mesh;
      bellMeshes: THREE.Mesh[];
      croziers: THREE.Mesh[];
      fronds: THREE.Mesh[];
      outerPetals: THREE.Mesh[];
      cushions: THREE.Mesh[];
      stalks: THREE.Mesh[];
      capsules: THREE.Mesh[];
      starHead: THREE.Group | null;
      baseY: number;
      stemApexY: number;
      morphogenesisStage: BotanicalLifecycleStageId;
      morphogenesisDepth: number;
      pulsePhase: number;
      tactileShiverImpulse: number;
    }

    const plantMeshes: AnimatedPlantRecord[] = [];
    const plantsRoot = new THREE.Group();
    scene.add(plantsRoot);

    const disposePlantGroup = (group: THREE.Group) => {
      group.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.geometry && !sharedPlantGeometries.has(mesh.geometry)) {
            mesh.geometry.dispose();
          }
          if (Array.isArray(mesh.material)) {
            for (const m of mesh.material) {
              if (m && !sharedPlantMaterials.has(m)) m.dispose();
            }
          } else if (mesh.material && !sharedPlantMaterials.has(mesh.material)) {
            mesh.material.dispose();
          }
        }
      });
    };

    const buildPlantGroup = (plant: GardenPlantInstance): AnimatedPlantRecord => {
      const cfg = PLANT_SPECIES_CONFIGS[plant.species];
      const group = new THREE.Group();
      group.position.set(plant.x, plant.y, plant.z);
      group.rotation.y = plant.rotationY;
      group.scale.setScalar(plant.scale);

      // Part 1: Soft contact shadow disc at y = +0.015
      const shadowDisc = new THREE.Mesh(shadowDiscGeo, shadowDiscMat);
      shadowDisc.position.y = 0.015;
      group.add(shadowDisc);

      // Part 2 & 3: Dual Concentric Resonance Halo Rings on ground
      const haloMat = new THREE.MeshBasicMaterial({
        color: cfg.emissiveHue,
        transparent: true,
        opacity: plant.attuned ? 0.72 : 0.24,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const haloRing = new THREE.Mesh(new THREE.RingGeometry(0.88, 1.06, 32), haloMat);
      haloRing.rotation.x = -Math.PI / 2;
      haloRing.position.y = 0.025;
      group.add(haloRing);

      const innerHaloRing = new THREE.Mesh(new THREE.RingGeometry(0.48, 0.56, 28), haloMat);
      innerHaloRing.rotation.x = -Math.PI / 2;
      innerHaloRing.position.y = 0.028;
      group.add(innerHaloRing);

      // Synthesize stem, corolla PBR, thin-film iridescence, and B-Mesh parameters from the 6-Stage Granular Organogenesis Profile
      const substrate = plant.substrate ?? 'terrestrial-loam';
      const initStage = getPlantLifecycleStage(plant);
      const organogenesis = synthesizeBotanicalOrganogenesis({
        biome: plant.biome,
        species: plant.species,
        substrate,
        atmosphere: atmosphereRef.current,
        attuned: plant.attuned,
      });
      const curFidelity =
        neuromorphicState.observer.canonicalStandardModelsContext.multiModalFidelity;
      const hdSynthesis = evaluateHighDefinitionVisualSynthesis({
        biome: plant.biome,
        species: plant.species,
        substrate,
        atmosphere: atmosphereRef.current,
        attuned: plant.attuned,
        lifecycleStage: initStage,
        neuromorphicWeight: neuromorphicState.lastActiveSynapticWeight,
      });

      // Matte lignocellulosic stem material tinted by CIE 1931 PROSPECT chlorophyll reflectance (`foliageCanopy`)
      const stemColor = new THREE.Color(0x15803d).lerp(
        new THREE.Color(cachedSpectralDiurnal.foliageCanopy.hex),
        0.52,
      );
      const stemMat = new THREE.MeshStandardMaterial({
        color: stemColor,
        normalMap: pbrSuite.petalVeinNormalTex,
        normalScale: new THREE.Vector2(
          hdSynthesis.normalMapScale * 0.65,
          hdSynthesis.normalMapScale * 0.65,
        ),
        roughness: organogenesis.stemMatteRoughness,
        metalness: 0.08,
        side: THREE.DoubleSide,
      });

      // Glossy cuticular clearcoat & Airy thin-film iridescent petal material (`airyThinFilmSpanNm`)
      const bloomMat = new THREE.MeshPhysicalMaterial({
        color: cfg.primaryHue,
        emissive: cfg.emissiveHue,
        emissiveIntensity: plant.attuned ? 0.98 : 0.4,
        normalMap: pbrSuite.petalVeinNormalTex,
        normalScale: new THREE.Vector2(hdSynthesis.normalMapScale, hdSynthesis.normalMapScale),
        roughness: organogenesis.petalClearcoatRoughness,
        metalness: 0.16,
        clearcoat: 0.92,
        clearcoatRoughness: 0.12,
        iridescence: hdSynthesis.iridescenceStrength,
        iridescenceIOR: hdSynthesis.iridescenceIor,
        iridescenceThicknessMinimum: hdSynthesis.iridescenceThinFilmMinNm,
        iridescenceThicknessMaximum: Math.max(
          hdSynthesis.iridescenceThinFilmMaxNm,
          hdSynthesis.iridescenceThinFilmMinNm + curFidelity.airyThinFilmSpanNm * 0.65,
        ),
        sheen: hdSynthesis.cuticularSheenStrength,
        sheenColor: new THREE.Color(cfg.emissiveHue).lerp(
          new THREE.Color(cachedSpectralDiurnal.foliageRedEdgeSheen.hex),
          0.25,
        ),
        sheenRoughness: hdSynthesis.cuticularSheenRoughness,
        side: THREE.DoubleSide,
      });

      const shaderUniforms = !isSoftwareGl
        ? enhanceMaterialWithBotanicalShader(bloomMat, {
            waveFrequencyHz: hdSynthesis.vertexWaveFrequencyHz,
            waveAmplitudeMeters: hdSynthesis.vertexWaveAmplitudeMeters,
            veinPulseSpeed: hdSynthesis.bioluminescentVeinPulseSpeed,
          })
        : null;

      // Part 3b: Organic Biological Soil, Pelagic Rhizome, & Lithophytic Bravais Mineral Holdfast Architecture
      const holdfastGroup = new THREE.Group();
      holdfastGroup.rotation.set(plant.surfaceTiltX ?? 0, 0, plant.surfaceTiltZ ?? 0);
      holdfastGroup.scale.setScalar(plant.rootHoldfastScale ?? 1.0);

      if (substrate === 'pelagic-water') {
        const rhizomeTether = new THREE.Mesh(
          new THREE.CylinderGeometry(0.045, 0.068, 0.46, 10),
          stemMat,
        );
        rhizomeTether.position.y = -0.21;
        holdfastGroup.add(rhizomeTether);
      } else {
        const humusMat = new THREE.MeshStandardMaterial({
          color: 0x14532d,
          normalMap: pbrSuite.mossNormalTex,
          normalScale: new THREE.Vector2(0.45, 0.45),
          roughness: 0.9,
          metalness: 0.04,
        });
        const humusMound = new THREE.Mesh(new THREE.SphereGeometry(0.36, 14, 10), humusMat);
        humusMound.scale.set(1.15, 0.30, 1.15);
        humusMound.position.y = 0.02;
        holdfastGroup.add(humusMound);

        const rootTendrilGeo = new THREE.CylinderGeometry(0.018, 0.036, 0.40, 8);
        for (let rIdx = 0; rIdx < 4; rIdx++) {
          const ra = (rIdx / 4) * Math.PI * 2 + 0.35;
          const tendrilSocket = new THREE.Group();
          tendrilSocket.rotation.y = -ra;
          const tendril = new THREE.Mesh(rootTendrilGeo, stemMat);
          tendril.position.set(0.18, 0.02, 0);
          tendril.rotation.z = 1.15;
          tendrilSocket.add(tendril);
          holdfastGroup.add(tendrilSocket);
        }

        if (substrate === 'crystalline-epiphyte' || plant.biome === 'crystal') {
          const seedHash = Math.abs(Math.round(plant.x * 7 + plant.z * 13));
          for (let cIdx = 0; cIdx < 3; cIdx++) {
            const ca = (cIdx / 3) * Math.PI * 2 + 0.72;
            const cGeo = holdfastCrystalGeos[(seedHash + cIdx * 3) % holdfastCrystalGeos.length];
            const cMesh = new THREE.Mesh(cGeo, crystalMonument.quartzMat);
            cMesh.position.set(Math.cos(ca) * 0.24, 0.08, Math.sin(ca) * 0.24);
            cMesh.rotation.set(0.28, -ca, -0.22);
            holdfastGroup.add(cMesh);
          }
        }
      }
      group.add(holdfastGroup);

      const accentMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        emissive: cfg.emissiveHue,
        emissiveIntensity: plant.attuned ? 1.28 : 0.6,
        normalMap: pbrSuite.petalVeinNormalTex,
        normalScale: new THREE.Vector2(
          hdSynthesis.normalMapScale * 0.8,
          hdSynthesis.normalMapScale * 0.8,
        ),
        roughness: 0.14,
        metalness: 0.42,
        clearcoat: 0.9,
        iridescence: hdSynthesis.iridescenceStrength * 0.85,
        iridescenceIOR: hdSynthesis.iridescenceIor,
        iridescenceThicknessMinimum: hdSynthesis.iridescenceThinFilmMinNm,
        iridescenceThicknessMaximum: Math.max(
          hdSynthesis.iridescenceThinFilmMaxNm,
          hdSynthesis.iridescenceThinFilmMinNm + curFidelity.airyThinFilmSpanNm * 0.65,
        ),
        side: THREE.DoubleSide,
      });

      // 3-Joint Articulated Kinematic Hierarchy (`basalJoint` -> `medialJoint` -> `apicalJoint`)
      const basalJoint = new THREE.Group();
      const medialJoint = new THREE.Group();
      const apicalJoint = new THREE.Group();
      group.add(basalJoint);
      basalJoint.add(medialJoint);
      medialJoint.add(apicalJoint);

      const morphMeshes: THREE.Mesh[] = [];
      const organBindings: Array<{ mesh: THREE.Mesh; slot: BotanicalOrganSlot }> = [];
      const createOrganMesh = (
        slot: BotanicalOrganSlot,
        mat: THREE.Material,
        withMorph = true,
      ): THREE.Mesh => {
        const mesh = new THREE.Mesh(activeBMeshSuite[slot], mat);
        organBindings.push({ mesh, slot });
        if (withMorph && mesh.morphTargetInfluences && mesh.morphTargetInfluences.length >= 2) {
          mesh.morphTargetInfluences[0] = hdSynthesis.morphBloomBaseline;
          mesh.morphTargetInfluences[1] = 0;
          morphMeshes.push(mesh);
        }
        return mesh;
      };

      const emissiveMaterials = [bloomMat, accentMat];
      const bellMeshes: THREE.Object3D[] = [];
      const croziers: THREE.Mesh[] = [];
      const fronds: THREE.Mesh[] = [];
      const outerPetals: THREE.Mesh[] = [];
      const cushions: THREE.Mesh[] = [];
      const stalks: THREE.Mesh[] = [];
      const capsules: THREE.Mesh[] = [];
      let starHeadRef: THREE.Group | null = null;
      let stemApexY = 1.85;
      let localApicalCrownY = 0.08;
      const morph = synthesizeLSystemBotanicalMorphogenesis({
        species: plant.species,
        lifecycleStage: initStage,
        busWeight: Math.round(curFidelity.meanSynapticWeight),
      });

      if (plant.species === 'chime-lily') {
        // Parametric D0L L-System + Murray r^3 vascular radii + Vogel 137.508 deg phyllotaxis (`Foundation.Morphogenesis.V1.Model`)
        for (let i = 0; i < morph.basalFoliageCount; i++) {
          const a = i * GOLDEN_ANGLE_RAD;
          const leafSocket = new THREE.Group();
          leafSocket.position.y = 0.06;
          leafSocket.rotation.y = -a + Math.PI / 2;
          const leaf = createOrganMesh('rosetteLeaf', stemMat);
          leaf.position.set(0, 0, 0.04);
          leaf.rotation.x = 0.44;
          leafSocket.add(leaf);
          basalJoint.add(leafSocket);
        }
        const lowerStem = new THREE.Mesh(
          new THREE.CylinderGeometry(
            morph.medialStemRadiusMeters,
            morph.basalStemRadiusMeters,
            1.16,
            14,
          ),
          stemMat,
        );
        lowerStem.position.y = 0.56;
        basalJoint.add(lowerStem);

        medialJoint.position.y = 1.12;
        const medialNode = new THREE.Mesh(
          new THREE.SphereGeometry(morph.medialStemRadiusMeters * 1.08, 12, 10),
          stemMat,
        );
        medialJoint.add(medialNode);

        const upperStem = new THREE.Mesh(
          new THREE.CylinderGeometry(
            morph.medialStemRadiusMeters * 0.72,
            morph.medialStemRadiusMeters,
            1.18,
            14,
          ),
          stemMat,
        );
        upperStem.position.y = 0.58;
        medialJoint.add(upperStem);

        apicalJoint.position.y = 1.16;

        const pedicelLen = 0.48;
        const pedicelTilt = 0.82; // ~47 deg outward arch from stem
        const tipX = pedicelLen * Math.sin(pedicelTilt);
        const tipY = pedicelLen * Math.cos(pedicelTilt);

        for (let b = 0; b < morph.primaryBranchCount; b++) {
          const branchAngle = (b / morph.primaryBranchCount) * Math.PI * 2 + 0.3;
          const attachY =
            0.20 + (b / Math.max(1, morph.primaryBranchCount - 1)) * 0.72;

          const branchGroup = new THREE.Group();
          branchGroup.position.set(0, attachY, 0);
          branchGroup.rotation.y = -branchAngle;

          // Nodal bract collar where pedicel joins the main stem at (0,0,0)
          const nodeBract = new THREE.Mesh(new THREE.SphereGeometry(0.068, 10, 8), stemMat);
          branchGroup.add(nodeBract);

          // Pedicel cylinder governed by Murray's cubic vascular pipe law (r_child^3)
          const pedicel = new THREE.Mesh(
            new THREE.CylinderGeometry(
              morph.childBranchRadiusMeters * 0.68,
              morph.childBranchRadiusMeters,
              pedicelLen,
              10,
            ),
            stemMat,
          );
          pedicel.position.set(tipX * 0.5, tipY * 0.5, 0);
          pedicel.rotation.z = -pedicelTilt;
          branchGroup.add(pedicel);

          // Hinged Bell + Stamen Pendulum Group anchored at exact pedicel tip (tipX, tipY, 0)
          const bellPendulum = new THREE.Group();
          bellPendulum.position.set(tipX, tipY, 0);

          const calyxCup = new THREE.Mesh(
            new THREE.CylinderGeometry(0.028, 0.065, 0.09, 10),
            stemMat,
          );
          calyxCup.position.y = -0.02;
          bellPendulum.add(calyxCup);

          const bell = createOrganMesh('bellCorolla', bloomMat);
          bell.rotation.x = Math.PI;
          bell.position.set(0, 0, 0);
          bellPendulum.add(bell);

          // Internal stamen filament rod extending from bell receptacle (0, 0, 0) down to clapper anther (0, -0.44, 0)
          const stamenFilament = new THREE.Mesh(
            new THREE.CylinderGeometry(0.012, 0.016, 0.44, 8),
            stemMat,
          );
          stamenFilament.position.y = -0.22;
          bellPendulum.add(stamenFilament);

          const stamenAnther = new THREE.Mesh(new THREE.SphereGeometry(0.078, 14, 12), accentMat);
          stamenAnther.position.y = -0.44;
          bellPendulum.add(stamenAnther);

          branchGroup.add(bellPendulum);
          medialJoint.add(branchGroup);
          bellMeshes.push(bellPendulum as unknown as THREE.Mesh);
        }

        const crownBud = new THREE.Mesh(new THREE.OctahedronGeometry(0.13, 2), accentMat);
        crownBud.position.y = 0.04;
        apicalJoint.add(crownBud);
        stemApexY = 2.28;
        localApicalCrownY = 0.06;
      } else if (plant.species === 'pulse-fern') {
        // Organic caudex mound + Murray vascular rachis + L-system pinnate fronds + Croziers + Sporangiophores
        const mound = new THREE.Mesh(new THREE.SphereGeometry(0.46, 16, 12), stemMat);
        mound.scale.set(1, 0.55, 1);
        mound.position.y = 0.15;
        basalJoint.add(mound);

        medialJoint.position.y = 0.22;
        const centralRachis = new THREE.Mesh(
          new THREE.CylinderGeometry(
            morph.medialStemRadiusMeters * 0.78,
            morph.basalStemRadiusMeters,
            1.36,
            12,
          ),
          stemMat,
        );
        centralRachis.position.y = 0.66;
        medialJoint.add(centralRachis);

        for (let i = 0; i < morph.primaryBranchCount; i++) {
          const a = i * GOLDEN_ANGLE_RAD;
          const frondSocket = new THREE.Group();
          frondSocket.position.set(0, 0.08 + (i % 5) * 0.065, 0);
          frondSocket.rotation.y = -a + Math.PI / 2;

          const frond = createOrganMesh('pinnateFrond', i % 2 === 0 ? bloomMat : stemMat);
          // Anchored directly inside the central rachis (z = 0.03m) so zero fronds float outside the stem
          frond.position.set(0, 0, 0.03);
          frond.rotation.x = 0.36 + (i % 3) * 0.08;
          frondSocket.add(frond);
          medialJoint.add(frondSocket);
          fronds.push(frond);
        }

        apicalJoint.position.y = 1.32;
        const apicalNode = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 10), stemMat);
        apicalJoint.add(apicalNode);

        // Both crozier spirals have their basal stipe (t = 0) at (0, 0, 0) inside apicalJoint!
        const crozierA = createOrganMesh('crozierA', accentMat);
        crozierA.position.set(0, 0, 0);
        apicalJoint.add(crozierA);
        croziers.push(crozierA);

        const crozierB = createOrganMesh('crozierB', bloomMat);
        crozierB.rotation.y = Math.PI * 0.5;
        crozierB.position.set(0, 0.02, 0);
        apicalJoint.add(crozierB);
        croziers.push(crozierB);

        const sporangioLen = 0.36;
        const sporangioTilt = 0.58;
        const spTipX = sporangioLen * Math.sin(sporangioTilt);
        const spTipY = sporangioLen * Math.cos(sporangioTilt);

        for (let s = 0; s < morph.secondaryWhorlCount; s++) {
          const sa = (s / morph.secondaryWhorlCount) * Math.PI * 2;
          const sporeBranch = new THREE.Group();
          sporeBranch.position.set(0, 0.02, 0);
          sporeBranch.rotation.y = -sa;

          const sporangiophore = new THREE.Mesh(
            new THREE.CylinderGeometry(
              morph.childBranchRadiusMeters * 0.52,
              morph.childBranchRadiusMeters * 0.82,
              sporangioLen,
              8,
            ),
            stemMat,
          );
          sporangiophore.position.set(spTipX * 0.5, spTipY * 0.5, 0);
          sporangiophore.rotation.z = -sporangioTilt;
          sporeBranch.add(sporangiophore);

          const spore = new THREE.Mesh(new THREE.OctahedronGeometry(0.082, 1), accentMat);
          spore.position.set(spTipX, spTipY, 0);
          sporeBranch.add(spore);
          apicalJoint.add(sporeBranch);
        }
        stemApexY = 1.54;
        localApicalCrownY = 0.04;
      } else if (plant.species === 'echo-lotus') {
        // Cordate heart-notched floating lily pad + Murray receptacle stalk + L-system outer & inner petal whorls
        const pad = createOrganMesh('lotusPad', stemMat, false);
        pad.position.y = 0.015;
        basalJoint.add(pad);

        medialJoint.position.y = 0.02;
        const receptacleStalk = new THREE.Mesh(
          new THREE.CylinderGeometry(
            morph.medialStemRadiusMeters * 1.15,
            morph.basalStemRadiusMeters,
            0.24,
            14,
          ),
          stemMat,
        );
        receptacleStalk.position.y = 0.11;
        medialJoint.add(receptacleStalk);

        const lotusCup = createOrganMesh('lotusCupLathe', bloomMat, false);
        lotusCup.position.y = 0.02;
        medialJoint.add(lotusCup);

        apicalJoint.position.y = 0.18;

        // Receptacle torus collar binding all outer & inner petals to the seed crown base
        const receptacleCollar = new THREE.Mesh(
          new THREE.TorusGeometry(0.11, 0.045, 10, 20),
          stemMat,
        );
        receptacleCollar.rotation.x = Math.PI / 2;
        receptacleCollar.position.y = 0.02;
        apicalJoint.add(receptacleCollar);

        for (let i = 0; i < morph.primaryBranchCount; i++) {
          const a = (i / morph.primaryBranchCount) * Math.PI * 2;
          const petalSocket = new THREE.Group();
          petalSocket.position.y = 0.02;
          petalSocket.rotation.y = -a + Math.PI / 2;

          const petal = createOrganMesh('lotusOuterPetal', bloomMat);
          // Anchored inside the 0.11m receptacle collar (z = 0.08m) so zero petals float detached
          petal.position.set(0, 0, 0.08);
          petal.rotation.x = 0.52;
          petalSocket.add(petal);
          apicalJoint.add(petalSocket);
          outerPetals.push(petal);
        }

        for (let i = 0; i < morph.secondaryWhorlCount; i++) {
          const a = (i / morph.secondaryWhorlCount) * Math.PI * 2 + 0.3;
          const innerSocket = new THREE.Group();
          innerSocket.position.y = 0.05;
          innerSocket.rotation.y = -a + Math.PI / 2;

          const innerPetal = createOrganMesh('lotusInnerPetal', accentMat);
          innerPetal.position.set(0, 0, 0.06);
          innerPetal.rotation.x = 0.32;
          innerSocket.add(innerPetal);
          apicalJoint.add(innerSocket);
        }

        const seedCrown = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.11, 0.28, 18), accentMat);
        seedCrown.position.y = 0.12;
        apicalJoint.add(seedCrown);
        stemApexY = 0.46;
        localApicalCrownY = 0.26;
      } else if (plant.species === 'drone-moss') {
        // Unified basal bryophyte colony mat + L-system moss cushions + Murray seta stalks & operculum capsules
        const basalColonyMat = new THREE.Mesh(new THREE.SphereGeometry(0.58, 18, 12), stemMat);
        basalColonyMat.scale.set(1.12, 0.26, 1.12);
        basalColonyMat.position.y = 0.06;
        basalJoint.add(basalColonyMat);

        medialJoint.position.y = 0.12;
        apicalJoint.position.y = 0.56;

        const setaGeo = new THREE.CylinderGeometry(
          morph.childBranchRadiusMeters * 0.68,
          morph.childBranchRadiusMeters,
          0.56,
          10,
        );
        setaGeo.translate(0, 0.28, 0);
        for (let i = 0; i < morph.primaryBranchCount; i++) {
          const a = i * GOLDEN_ANGLE_RAD;
          const rad = i === 0 ? 0.04 : 0.27 + (i % 2) * 0.05;
          const cushionY = 0.11 + (i % 4) * 0.032;
          const cx = Math.cos(a) * rad;
          const cz = Math.sin(a) * rad;

          const cushion = new THREE.Mesh(new THREE.SphereGeometry(0.35, 18, 14), bloomMat);
          cushion.scale.set(1.08, 0.52, 1.08);
          cushion.position.set(cx, cushionY, cz);
          basalJoint.add(cushion);
          cushions.push(cushion);

          // Seta stalk rooted inside the top of its cushion (medialJoint y = 0.12)
          const stalkLocalY = cushionY + 0.02 - 0.12;
          const stalk = new THREE.Mesh(setaGeo, stemMat);
          stalk.position.set(cx, stalkLocalY, cz);
          medialJoint.add(stalk);
          stalks.push(stalk);

          // Operculum spore capsule + calyptra cap parented inside medialJoint at the exact top of the stalk
          const capsule = createOrganMesh('bellCorolla', accentMat);
          capsule.scale.setScalar(0.28);
          capsule.position.set(cx, stalkLocalY + 0.54, cz);
          // Conical operculum cap closing the top of the moss sporangium capsule
          const operculumCap = new THREE.Mesh(
            new THREE.ConeGeometry(0.45, 0.36, 16),
            stemMat,
          );
          operculumCap.position.y = 0.72;
          capsule.add(operculumCap);
          medialJoint.add(capsule);
          capsules.push(capsule);
        }
        stemApexY = 0.86;
        localApicalCrownY = 0.14;
      } else {
        // star-orchid: L-system basal leaves + Murray segmented stem + ovary receptacle collar + sepals + tepals + labellum + gynostemium
        for (let i = 0; i < morph.basalFoliageCount; i++) {
          const a = (i / morph.basalFoliageCount) * Math.PI * 2;
          const leafSocket = new THREE.Group();
          leafSocket.position.y = 0.06;
          leafSocket.rotation.y = -a + Math.PI / 2;
          const leaf = createOrganMesh('rosetteLeaf', stemMat);
          leaf.scale.setScalar(0.84);
          leaf.position.set(0, 0, 0.04);
          leaf.rotation.x = 0.46;
          leafSocket.add(leaf);
          basalJoint.add(leafSocket);
        }

        const lowerStem = new THREE.Mesh(
          new THREE.CylinderGeometry(
            morph.medialStemRadiusMeters,
            morph.basalStemRadiusMeters,
            0.94,
            14,
          ),
          stemMat,
        );
        lowerStem.position.y = 0.46;
        basalJoint.add(lowerStem);

        medialJoint.position.y = 0.90;
        const medialNode = new THREE.Mesh(
          new THREE.SphereGeometry(morph.medialStemRadiusMeters * 1.08, 12, 10),
          stemMat,
        );
        medialJoint.add(medialNode);

        const upperStem = new THREE.Mesh(
          new THREE.CylinderGeometry(
            morph.medialStemRadiusMeters * 0.75,
            morph.medialStemRadiusMeters,
            0.94,
            14,
          ),
          stemMat,
        );
        upperStem.position.y = 0.46;
        medialJoint.add(upperStem);

        apicalJoint.position.y = 0.90;
        const starHead = new THREE.Group();

        // Sculpted ovary receptacle collar & curved pedicel neck uniting upperStem (0,0,0) with all sepals, tepals, and labellum
        const receptacleHub = new THREE.Mesh(
          new THREE.SphereGeometry(0.095, 14, 12),
          stemMat,
        );
        receptacleHub.scale.set(1.0, 1.0, 1.25);
        receptacleHub.position.set(0, 0, 0.02);
        starHead.add(receptacleHub);

        for (let i = 0; i < morph.primaryBranchCount; i++) {
          const a = (i / morph.primaryBranchCount) * Math.PI * 2;
          const petal = createOrganMesh('orchidSepal', bloomMat);
          // Zero radial offset so all sepal claws grow directly out of receptacleHub at (0, 0, 0.01)
          petal.position.set(0, 0, 0.01);
          petal.rotation.z = a - Math.PI / 2;
          starHead.add(petal);
        }
        for (let i = 0; i < morph.secondaryWhorlCount; i++) {
          const a = (i / morph.secondaryWhorlCount) * Math.PI * 2 + Math.PI / 6;
          const tepal = createOrganMesh('orchidTepal', accentMat);
          tepal.position.set(0, 0, 0.03);
          tepal.rotation.z = a - Math.PI / 2;
          starHead.add(tepal);
        }

        // Forward-flaring labellum trumpet (+Math.PI / 2 rotates +Y bell axis forward along +Z!)
        const labellum = createOrganMesh('bellCorolla', accentMat);
        labellum.scale.setScalar(0.52);
        labellum.rotation.x = Math.PI / 2;
        labellum.position.set(0, 0, 0.02);
        starHead.add(labellum);

        // Central orchid gynostemium column & glowing pollinia anther cap inside the labellum throat
        const gynostemiumColumn = new THREE.Mesh(
          new THREE.CylinderGeometry(0.026, 0.038, 0.24, 10),
          stemMat,
        );
        gynostemiumColumn.rotation.x = Math.PI / 2;
        gynostemiumColumn.position.set(0, 0, 0.12);
        starHead.add(gynostemiumColumn);

        const polliniaCap = new THREE.Mesh(
          new THREE.SphereGeometry(0.052, 12, 10),
          accentMat,
        );
        polliniaCap.position.set(0, 0, 0.24);
        starHead.add(polliniaCap);

        apicalJoint.add(starHead);
        starHeadRef = starHead;
        stemApexY = 1.84;
        localApicalCrownY = 0.06;
      }

      // Stage 3 Harmonic Fruiting Crown parented directly to `apicalJoint` so it moves 100% locked to the bending stem apex!
      const fruitingCrown = new THREE.Group();
      fruitingCrown.position.y = localApicalCrownY;
      const crownPearlMat = new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        emissive: 0xf59e0b,
        emissiveIntensity: 1.35,
        roughness: 0.15,
        metalness: 0.55,
      });
      const crownReceptacle = new THREE.Mesh(
        new THREE.SphereGeometry(0.048, 10, 8),
        stemMat,
      );
      fruitingCrown.add(crownReceptacle);

      const crownStem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.022, 0.032, 0.16, 8),
        stemMat,
      );
      crownStem.position.y = -0.06;
      fruitingCrown.add(crownStem);

      const crownPearlGeo = new THREE.OctahedronGeometry(0.082, 2);
      const cPedLen = 0.24;
      const cPedTilt = 0.85;
      const cTipX = cPedLen * Math.sin(cPedTilt);
      const cTipY = cPedLen * Math.cos(cPedTilt);

      for (let cp = 0; cp < morph.fruitingPearlCount; cp++) {
        const cAngle = (cp / morph.fruitingPearlCount) * Math.PI * 2;
        const cBranch = new THREE.Group();
        cBranch.rotation.y = -cAngle;

        const crownPedicel = new THREE.Mesh(
          new THREE.CylinderGeometry(0.014, 0.022, cPedLen, 8),
          stemMat,
        );
        crownPedicel.position.set(cTipX * 0.5, cTipY * 0.5, 0);
        crownPedicel.rotation.z = -cPedTilt;
        cBranch.add(crownPedicel);

        const pearl = new THREE.Mesh(crownPearlGeo, crownPearlMat);
        pearl.position.set(cTipX, cTipY, 0);
        cBranch.add(pearl);
        fruitingCrown.add(cBranch);
      }
      fruitingCrown.visible = BOTANICAL_LIFECYCLE_STAGES[initStage].hasFruitingCrown;
      apicalJoint.add(fruitingCrown);

      // Stage 4 Mycelial Elder Spore Halo Ring
      const elderHaloMat = new THREE.MeshBasicMaterial({
        color: 0xfde047,
        transparent: true,
        opacity: 0.68,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const elderHaloRing = new THREE.Mesh(new THREE.RingGeometry(1.18, 1.32, 36), elderHaloMat);
      elderHaloRing.rotation.x = -Math.PI / 2;
      elderHaloRing.position.y = 0.032;
      elderHaloRing.visible = BOTANICAL_LIFECYCLE_STAGES[initStage].hasMycelialSporeHalo;
      group.add(elderHaloRing);

      plantsRoot.add(group);
      return {
        instance: plant,
        group,
        basalJoint,
        medialJoint,
        apicalJoint,
        morphMeshes,
        organBindings,
        stemMat,
        bloomMat,
        accentMat,
        shaderUniforms,
        emissiveMaterials,
        haloRing,
        fruitingCrown,
        elderHaloRing,
        bellMeshes: bellMeshes as THREE.Mesh[],
        croziers,
        fronds,
        outerPetals,
        cushions,
        stalks,
        capsules,
        starHead: starHeadRef,
        baseY: plant.y,
        stemApexY: localApicalCrownY,
        morphogenesisStage: initStage,
        morphogenesisDepth: morph.derivationDepth,
        pulsePhase: Math.random() * Math.PI * 2,
        tactileShiverImpulse: 0,
      };
    };

    for (const p of plantsRef.current) {
      plantMeshes.push(buildPlantGroup(p));
    }

    // 9. Zero-GC Pooled Particle Ring Buffer (220 Bioluminescent Acoustic Spores)
    const PARTICLE_COUNT = 220;
    const particleGeo = new THREE.OctahedronGeometry(0.055, 0);
    const particleMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
    });
    const particleMesh = new THREE.InstancedMesh(particleGeo, particleMat, PARTICLE_COUNT);
    particleMesh.frustumCulled = false;

    const pX = new Float32Array(PARTICLE_COUNT);
    const pY = new Float32Array(PARTICLE_COUNT);
    const pZ = new Float32Array(PARTICLE_COUNT);
    const pVX = new Float32Array(PARTICLE_COUNT);
    const pVY = new Float32Array(PARTICLE_COUNT);
    const pVZ = new Float32Array(PARTICLE_COUNT);
    const pScale = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const a = i * GOLDEN_ANGLE_RAD;
      const r = 3 + (i % 45);
      pX[i] = Math.cos(a) * r;
      pZ[i] = Math.sin(a) * r - 10;
      pY[i] = groundHeightAt(pX[i], pZ[i]) + 0.5 + (i % 7) * 0.6;
      pVX[i] = (Math.random() - 0.5) * 0.25;
      pVY[i] = 0.18 + (i % 5) * 0.08;
      pVZ[i] = (Math.random() - 0.5) * 0.25;
      pScale[i] = 0.5 + (i % 4) * 0.25;
    }
    scene.add(particleMesh);

    // Diurnal Celestial Star Dome (260 stars) + Nocturnal Canopy Aurora Veil
    const STAR_COUNT = 260;
    const starPositions = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i++) {
      const theta = (i * GOLDEN_ANGLE_RAD) % (Math.PI * 2);
      const phi = Math.acos(0.18 + ((i % 37) / 37) * 0.8);
      const rad = 95;
      starPositions[i * 3] = rad * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = rad * Math.cos(phi);
      starPositions[i * 3 + 2] = rad * Math.sin(phi) * Math.sin(theta);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xe0f2fe,
      size: 0.68,
      transparent: true,
      opacity: 0.15,
      fog: false,
      depthWrite: false,
    });
    const starDome = new THREE.Points(starGeo, starMat);
    scene.add(starDome);

    const auroraGeo = new THREE.TorusGeometry(48, 1.35, 8, 64);
    const auroraMat = new THREE.MeshBasicMaterial({
      color: 0x2dd4bf,
      transparent: true,
      opacity: 0.08,
      side: THREE.DoubleSide,
      depthWrite: false,
      fog: false,
    });
    const auroraRibbon = new THREE.Mesh(auroraGeo, auroraMat);
    auroraRibbon.rotation.x = Math.PI / 2.2;
    auroraRibbon.position.set(0, 44, -22);
    scene.add(auroraRibbon);

    let particleCursor = 0;
    const spawnBurstAt = (bx: number, by: number, bz: number, hexColor: string, count = 24) => {
      _tempColor.set(hexColor);
      for (let i = 0; i < count; i++) {
        const idx = (particleCursor + i) % PARTICLE_COUNT;
        const angle = (i / count) * Math.PI * 2;
        const speed = 1.15 + (i % 4) * 0.45;
        pX[idx] = bx + Math.cos(angle) * 0.35;
        pY[idx] = by + 0.75 + (i % 3) * 0.22;
        pZ[idx] = bz + Math.sin(angle) * 0.35;
        pVX[idx] = Math.cos(angle) * speed;
        pVY[idx] = 0.95 + (i % 3) * 0.45;
        pVZ[idx] = Math.sin(angle) * speed;
        pScale[idx] = 0.88;
        particleMesh.setColorAt(idx, _tempColor);
      }
      if (particleMesh.instanceColor) particleMesh.instanceColor.needsUpdate = true;
      particleCursor = (particleCursor + count) % PARTICLE_COUNT;
    };

    // Pooled Concentric Acoustic Ground Wave Rings (5 rings) constrained by local terrain normals & medium dispersion (`evaluateGroundWavePropagation`)
    const WAVE_RING_COUNT = 5;
    const waveRingGeo = new THREE.RingGeometry(0.95, 1.12, 32);
    const waveRings: {
      mesh: THREE.Mesh;
      mat: THREE.MeshBasicMaterial;
      originX: number;
      originZ: number;
      age: number;
      active: boolean;
    }[] = [];
    for (let i = 0; i < WAVE_RING_COUNT; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: 0xfde047,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(waveRingGeo, mat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.visible = false;
      scene.add(mesh);
      waveRings.push({ mesh, mat, originX: 0, originZ: 0, age: 0, active: false });
    }

    const spawnSoundWaveRings = (wx: number, wy: number, wz: number, hexColor: string) => {
      for (let i = 0; i < WAVE_RING_COUNT; i++) {
        const ring = waveRings[i];
        ring.originX = wx;
        ring.originZ = wz;
        ring.mesh.position.set(wx, wy + 0.04 + i * 0.005, wz);
        ring.mesh.scale.setScalar(0.8);
        ring.mat.color.set(hexColor);
        ring.mat.opacity = 0.78;
        ring.age = -i * 0.18;
        ring.active = true;
        ring.mesh.visible = true;
      }
    };

    let footstepRingCursor = 0;
    const spawnFootstepRipple = (wx: number, wy: number, wz: number, hexColor: string) => {
      const ring = waveRings[footstepRingCursor % WAVE_RING_COUNT];
      footstepRingCursor = (footstepRingCursor + 1) % WAVE_RING_COUNT;
      if (ring.active && ring.age < 0.8) return;
      ring.originX = wx;
      ring.originZ = wz;
      ring.mesh.position.set(wx, wy + 0.035, wz);
      ring.mesh.scale.setScalar(0.35);
      ring.mat.color.set(hexColor);
      ring.mat.opacity = 0.42;
      ring.age = 0.55;
      ring.active = true;
      ring.mesh.visible = true;
    };

    // Pooled 9-Segment Parabolic Sympathetic Cross-Pollination Filaments (`Foundation.Articulation.V1.Model` `parabolicArcSegments = 9`)
    // + Traveling Mycorrhizal Action-Potential Wavefront Orbs (`Foundation.Ecology.V1.Model` `actionPotentialWaveSpeedDmps = 65`)
    const FILAMENT_COUNT = 6;
    const PARABOLIC_SEGMENTS = 9;
    const filamentGeo = new THREE.CylinderGeometry(0.028, 0.028, 1.0, 6);
    const wavefrontOrbGeo = createBravaisCrystalHabitGeometry({
      habit: 'hP-quartz',
      radius: 0.095,
      height: 0.21,
    });

    interface PooledParabolicFilament {
      group: THREE.Group;
      segmentMeshes: THREE.Mesh[];
      wavefrontOrb: THREE.Mesh;
      mat: THREE.MeshBasicMaterial;
      x1: number;
      y1: number;
      z1: number;
      x2: number;
      y2: number;
      z2: number;
      age: number;
      active: boolean;
      targetPlantId: string | null;
      arrivalTriggered: boolean;
    }

    const filaments: PooledParabolicFilament[] = [];
    for (let i = 0; i < FILAMENT_COUNT; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: 0xfef08a,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      });
      const group = new THREE.Group();
      group.visible = false;
      const segmentMeshes: THREE.Mesh[] = [];
      for (let s = 0; s < PARABOLIC_SEGMENTS; s++) {
        const segMesh = new THREE.Mesh(filamentGeo, mat);
        group.add(segMesh);
        segmentMeshes.push(segMesh);
      }
      const wavefrontOrb = new THREE.Mesh(wavefrontOrbGeo, mat);
      group.add(wavefrontOrb);
      scene.add(group);
      filaments.push({
        group,
        segmentMeshes,
        wavefrontOrb,
        mat,
        x1: 0,
        y1: 0,
        z1: 0,
        x2: 0,
        y2: 0,
        z2: 0,
        age: 0,
        active: false,
        targetPlantId: null,
        arrivalTriggered: false,
      });
    }

    let filamentCursor = 0;
    const spawnSympatheticFilament = (
      x1: number,
      y1: number,
      z1: number,
      x2: number,
      y2: number,
      z2: number,
      hexColor: string,
      targetPlantId: string | null = null,
      colliders?: readonly SolidCollider[],
      topology?: ParametricWorldTopologyModel,
    ) => {
      const f = filaments[filamentCursor % FILAMENT_COUNT];
      filamentCursor = (filamentCursor + 1) % FILAMENT_COUNT;
      const arc = computeSympatheticParabolicArc({
        x1,
        y1,
        z1,
        x2,
        y2,
        z2,
        elapsedSinceTriggerSec: 0,
        segments: PARABOLIC_SEGMENTS,
        colliders,
        topology,
      });
      if (arc.arcLengthMeters < 0.1) return;

      for (let s = 0; s < PARABOLIC_SEGMENTS; s++) {
        const ptA = arc.points[s];
        const ptB = arc.points[s + 1];
        _filamentStart.set(ptA.x, ptA.y, ptA.z);
        _filamentEnd.set(ptB.x, ptB.y, ptB.z);
        _filamentDir.subVectors(_filamentEnd, _filamentStart);
        const segLen = _filamentDir.length() || 0.01;
        const segMesh = f.segmentMeshes[s];
        segMesh.position.copy(_filamentStart).addScaledVector(_filamentDir, 0.5);
        _filamentDir.normalize();
        segMesh.quaternion.setFromUnitVectors(_upVec, _filamentDir);
        segMesh.scale.set(1, segLen, 1);
      }

      f.x1 = x1;
      f.y1 = y1;
      f.z1 = z1;
      f.x2 = x2;
      f.y2 = y2;
      f.z2 = z2;
      f.wavefrontOrb.position.set(
        arc.wavefrontPosition[0],
        arc.wavefrontPosition[1],
        arc.wavefrontPosition[2],
      );
      f.mat.color.set(hexColor);
      f.mat.opacity = 0.86;
      f.age = 0;
      f.active = true;
      f.targetPlantId = targetPlantId;
      f.arrivalTriggered = false;
      f.group.visible = true;
    };

    // 7-Node Ground-Hugging Bioluminescent Mycelial Guidance Rings (`Foundation.Neuromorphic.V1.Model::EmergentEntityStakeholderSpec`):
    // Expresses the emergent entity's synthesized wisdom (Intelligence + Memory + Observation + Feedback)
    // as a living golden-ratio trail of terrain-hugging mycelial rings along the ground contour toward the next kinship specimen.
    const GUIDANCE_WAYPOINT_COUNT = 7;
    const guidanceNodeGeo = new THREE.RingGeometry(0.14, 0.24, 24);
    guidanceNodeGeo.rotateX(-Math.PI / 2);
    const guidanceNodeMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 0.52,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const guidanceFilamentMesh = new THREE.InstancedMesh(
      guidanceNodeGeo,
      guidanceNodeMat,
      GUIDANCE_WAYPOINT_COUNT,
    );
    guidanceFilamentMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    for (let wIdx = 0; wIdx < GUIDANCE_WAYPOINT_COUNT; wIdx++) {
      _dummyPos.set(0, -50, 0);
      _dummyQuat.identity();
      _dummyScale.setScalar(0.001);
      _dummyMatrix.compose(_dummyPos, _dummyQuat, _dummyScale);
      guidanceFilamentMesh.setMatrixAt(wIdx, _dummyMatrix);
    }
    guidanceFilamentMesh.instanceMatrix.needsUpdate = true;
    scene.add(guidanceFilamentMesh);

    // Pre-compile shaders on hardware GPUs
    if (!isSoftwareGl) {
      try {
        renderer.compile(scene, camera);
      } catch {
        // Ignore driver-specific precompile warnings; Three.js compiles lazily on render
      }
    }

    // Build deterministic solid collider registry (`Foundation.Physics.V1.Model`)
    const gardenColliders = buildGardenColliders(plantsRef.current);

    // Sync Immanent Environmental Witness Collider & Player Embodiment Locus with Neuromorphic State
    syncImmanentWitnessCollider(gardenColliders, neuromorphicState.observer.immanentPresence);
    let prevWitnessX = neuromorphicState.observer.immanentPresence.x;
    let prevWitnessZ = neuromorphicState.observer.immanentPresence.z;
    const initialPlayerModel = neuromorphicState.observer.cosmogenesis.playerRealm;

    // Grounded Parametric Player/User Co-Observer Harmonic Locus Ring (`createPlayerCoObserverLocusGeometry`)
    let activePlayerLocusNodes = initialPlayerModel.coObserverLocusHarmonicNodes;
    const playerLocusMat = new THREE.MeshBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: initialPlayerModel.coObserverLocusLuminance,
      side: THREE.DoubleSide,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    const playerLocusMesh = new THREE.Mesh(
      createPlayerCoObserverLocusGeometry({
        innerRadius: initialPlayerModel.coObserverLocusInnerRadiusMeters,
        outerRadius: initialPlayerModel.coObserverLocusOuterRadiusMeters,
        harmonicNodeCount: activePlayerLocusNodes,
      }),
      playerLocusMat,
    );
    playerLocusMesh.position.set(0, groundHeightAt(0, 0) + 0.024, 0);
    scene.add(playerLocusMesh);

    // Grounded 7-Part Sculptural Immanent Environmental Observer Presence ("The Observer is among us in its environment")
    const initialDisplayPalette = neuromorphicState.observer.parametricDisplayDesign.palette;
    const immanentWitness = buildImmanentObserverWitnessGroup({
      radialSegments:
        neuromorphicState.observer.differentiationAndExtrapolation.highestResolution
          .currentResolutionSubdiv,
      primaryAccentHex: initialDisplayPalette.primaryAccentHex,
      secondaryAccentHex: initialDisplayPalette.secondaryAccentHex,
    });
    const initialPresence = neuromorphicState.observer.immanentPresence;
    immanentWitness.group.position.set(initialPresence.x, initialPresence.y, initialPresence.z);
    scene.add(immanentWitness.group);

    // Grounded soft contact shadow under the Immanent Witness foot-ring so it visibly anchors to terrain
    const witnessShadowGeo = new THREE.CircleGeometry(0.86, 24);
    witnessShadowGeo.rotateX(-Math.PI / 2);
    const witnessShadowMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#040c09'),
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    const witnessContactShadow = new THREE.Mesh(witnessShadowGeo, witnessShadowMat);
    witnessContactShadow.position.set(
      initialPresence.x,
      initialPresence.groundY + 0.018,
      initialPresence.z,
    );
    scene.add(witnessContactShadow);

    let gestureHoldState = createInitialGestureHoldState();
    let environmentalAgencyState = createInitialEnvironmentalAgencyState();
    let landmarkResonance = createInitialLandmarkResonanceState();
    let autonomousPlasticity = createInitialAutonomousPlasticityState();
    let activeWaystoneIndex = -1;
    let activeSteppingStones = steppingStones;
    let witnessCommunionGlowImpulse = 0;
    const getLandmarkCentersXZ = (): Readonly<
      Record<'meadow' | 'grove' | 'crystal' | 'wetland' | 'sanctuary', readonly [number, number]>
    > => ({
      meadow: [meadowMonument.group.position.x, meadowMonument.group.position.z],
      grove: [groveMonument.group.position.x, groveMonument.group.position.z],
      crystal: [crystalMonument.group.position.x, crystalMonument.group.position.z],
      wetland: [wetlandMonument.group.position.x, wetlandMonument.group.position.z],
      sanctuary: [sanctuaryMonument.group.position.x, sanctuaryMonument.group.position.z],
    });
    let playerInteractedThisFrame = false;
    let uiHeldGesture: HoldableGestureId | null = null;
    let currentSoundtrackStep = 0;
    let soundtrackStepTimer = 0;
    let currentSoundtrackScore = composeLiveSoundtrackScore({
      biome: 'meadow',
      atmosphere: atmosphereRef.current,
      harmonyPct: 15,
      plants: plantsRef.current,
      neuromorphic: neuromorphicState,
      playerX: 0,
      playerZ: 0,
      playerYaw: 0,
      colliders: gardenColliders,
    });

    // 10. Player First-Person Controller State (Spawns on open stone road facing Sanctuary Vista)
    const initialGroundY = groundHeightAt(0, 0);
    const initialExploredBiomes = new Set<BiomeId>(
      initialAnamnesisRef.current?.exploredBiomes?.length
        ? initialAnamnesisRef.current.exploredBiomes
        : ['meadow'],
    );
    const initialHarmonyPct = computeGardenHarmonyPct({
      plants: plantsRef.current,
      exploredBiomesCount: initialExploredBiomes.size,
    });
    const player = {
      x: 0,
      y: initialGroundY,
      z: 0,
      yaw: 0, // 0 faces -Z directly toward the Meadow Sundial & Resonance Sanctuary Obelisk
      pitch: 0.04,
      guidedStroll: false,
      trailIndex: 0,
      velocityDm: 0,
      walkDist: 0,
      action: 'observe' as PlayerActionId,
      actionHoldTimer: 0,
      harmony: initialHarmonyPct,
      sympatheticCount: 0,
      exploredBiomes: initialExploredBiomes,
      lastOutcome: 'ambient-drone' as SoundscapeOutcome,
      lastRule: 'REQ-028' as string | null,
      lastRuleDesc: 'A slow, unhurried walk through the garden sustains a warm botanical pad foundation.',
      lastRequest: 'meadow chime-lily observe dawn dormant 20 0',
      surfaceMaterial: 'travertine-stone' as SurfaceMaterialId,
      inWater: false,
      waterDepthMeters: 0,
      slopeGradePct: 0,
      obstructedBy: null as string | null,
    };

    let cameraKinematics: CameraKinematicsState = {
      camX: 0,
      camY: initialGroundY + initialPlayerModel.eyeStatureMeters,
      camZ: 0,
      camYaw: 0,
      camPitch: 0.04,
      camFov: initialPlayerModel.baseCameraFovDeg,
      bobPhase: 0,
      bobAmplitude: 0.012,
      interactionPitchNod: 0,
    };

    const keysPressed = new Set<string>();
    let isPointerDragging = false;
    let lastMouseX = 0;
    let lastMouseY = 0;

    const syncMultiModalFidelityVisuals = (nextTopo?: ParametricWorldTopologyModel) => {
      const fidelity =
        neuromorphicState.observer.canonicalStandardModelsContext.multiModalFidelity;
      const specPalette = synthesizeSpectralDiurnalPalette(
        atmosphereRef.current,
        fidelity.spectralBandCount,
        fidelity.airyThinFilmSpanNm,
      );
      const spectralChanged =
        cachedSpectralAtm !== atmosphereRef.current ||
        cachedSpectralBands !== fidelity.spectralBandCount;
      cachedSpectralAtm = atmosphereRef.current;
      cachedSpectralBands = fidelity.spectralBandCount;
      cachedSpectralDiurnal = specPalette;

      const activeTopo = nextTopo ?? neuromorphicState.observer.cosmogenesis.worldTopology;
      if (!isSoftwareGl && fidelity.adaptiveTerrainSegments !== activeTerrainSegments) {
        activeTerrainSegments = fidelity.adaptiveTerrainSegments;
        const prevTerrainGeo = terrainGeo;
        terrainGeo = buildAdaptiveSpectralTerrainGeometry(
          activeTerrainSegments,
          activeTopo,
          specPalette,
        );
        terrainMesh.geometry = terrainGeo;
        prevTerrainGeo.dispose();
      } else if (nextTopo || spectralChanged) {
        populateTerrainHeightsAndSpectralColors(terrainGeo, activeTopo, specPalette);
      }

      if (!isSoftwareGl && fidelity.proceduralTexelResolution !== activeTexelResolution) {
        activeTexelResolution = fidelity.proceduralTexelResolution;
        const prevGroundTex = groundTex;
        const prevGroundBumpTex = groundBumpTex;
        const prevPbr = pbrSuite;

        const nextMoss = createMossAndBumpTextures(activeTexelResolution);
        groundTex = nextMoss.colorTex;
        groundBumpTex = nextMoss.bumpTex;
        pbrSuite = createHighDefinitionPbrTextureSuite(
          maxAnisotropy,
          isSoftwareGl,
          activeTexelResolution,
        );

        terrainMat.map = groundTex;
        terrainMat.normalMap = pbrSuite.mossNormalTex;
        terrainMat.roughnessMap = pbrSuite.mossRoughnessTex;
        terrainMat.bumpMap = groundBumpTex;

        sharedStoneMat.map = pbrSuite.stoneColorTex;
        sharedStoneMat.normalMap = pbrSuite.stoneNormalTex;

        shorelineMossStoneMat.map = pbrSuite.stoneColorTex;
        shorelineMossStoneMat.normalMap = pbrSuite.stoneNormalTex;
        shorelineMossStoneMat.bumpMap = groundBumpTex;

        stepStoneMat.map = pbrSuite.stoneColorTex;
        stepStoneMat.normalMap = pbrSuite.stoneNormalTex;
        stepStoneMat.bumpMap = groundBumpTex;

        rockMat.normalMap = pbrSuite.stoneNormalTex;
        stalkMat.normalMap = pbrSuite.petalVeinNormalTex;
        canopyMat.normalMap = pbrSuite.petalVeinNormalTex;

        for (let i = 0; i < plantMeshes.length; i++) {
          const pm = plantMeshes[i];
          pm.stemMat.normalMap = pbrSuite.petalVeinNormalTex;
          pm.bloomMat.normalMap = pbrSuite.petalVeinNormalTex;
          pm.accentMat.normalMap = pbrSuite.petalVeinNormalTex;
        }

        prevGroundTex.dispose();
        prevGroundBumpTex.dispose();
        prevPbr.mossColorTex.dispose();
        prevPbr.mossNormalTex.dispose();
        prevPbr.mossRoughnessTex.dispose();
        prevPbr.stoneColorTex.dispose();
        prevPbr.stoneNormalTex.dispose();
        prevPbr.petalVeinNormalTex.dispose();
      }

      const targetSubdiv = isSoftwareGl
        ? 24
        : Math.max(28, Math.min(64, Math.round(fidelity.bMeshRadialSubdivisions)));
      if (!isSoftwareGl && targetSubdiv !== activeBMeshSuite.subdivisions) {
        const prevSuite = activeBMeshSuite;
        const nextSuite = buildBotanicalBMeshSuite(targetSubdiv, specPalette);
        registerSuiteGeometries(nextSuite, sharedPlantGeometries);
        for (let i = 0; i < plantMeshes.length; i++) {
          const bindings = plantMeshes[i].organBindings;
          for (let b = 0; b < bindings.length; b++) {
            const { mesh, slot } = bindings[b];
            const inf0 = mesh.morphTargetInfluences?.[0] ?? 0;
            const inf1 = mesh.morphTargetInfluences?.[1] ?? 0;
            mesh.geometry = nextSuite[slot];
            mesh.updateMorphTargets();
            if (mesh.morphTargetInfluences && mesh.morphTargetInfluences.length >= 2) {
              mesh.morphTargetInfluences[0] = inf0;
              mesh.morphTargetInfluences[1] = inf1;
            }
          }
        }
        activeBMeshSuite = nextSuite;
        disposeSuiteGeometries(prevSuite, sharedPlantGeometries);

        const prevRockGeo = rockGeo;
        rockGeo = createStratifiedBoulderGeometry({
          radius: 2.6,
          detailRings: Math.max(14, Math.round(targetSubdiv * 0.42)),
          radialSegments: Math.max(18, Math.round(targetSubdiv * 0.56)),
          seed: 707,
        });
        rocksInstanced.geometry = rockGeo;
        prevRockGeo.dispose();

        const prevCanopyGeo = canopyGeo;
        canopyGeo = createSculptedCanopyCrownGeometry({
          radius: 1.05,
          height: 1.45,
          lobeCount: Math.max(9, Math.round(targetSubdiv * 0.26)),
        });
        canopyInstanced.geometry = canopyGeo;
        prevCanopyGeo.dispose();
      }

      sharedCrystalMat.iridescenceThicknessMaximum = 220 + fidelity.airyThinFilmSpanNm;
      crystalMonument.quartzMat.iridescenceThicknessMaximum = 240 + fidelity.airyThinFilmSpanNm;
      _tempColor.set(specPalette.crystalThinFilm.hex);
      crystalMonument.quartzMat.color.lerp(_tempColor, 0.35);
      lagoonMat.iridescenceThicknessMaximum = 220 + fidelity.airyThinFilmSpanNm * 0.65;
      _tempColor
        .set('#0f766e')
        .lerp(_lagoonAbsCol.set(specPalette.lagoonWaterAbsorption.hex), 0.42);
      lagoonMat.color.copy(_tempColor);

      _foliageCanopyCol.set(specPalette.foliageCanopy.hex);
      const busWeightRounded = Math.round(fidelity.meanSynapticWeight);
      for (let i = 0; i < plantMeshes.length; i++) {
        let pm = plantMeshes[i];
        const targetStage = getPlantLifecycleStage(pm.instance);
        const targetMorph = synthesizeLSystemBotanicalMorphogenesis({
          species: pm.instance.species,
          lifecycleStage: targetStage,
          busWeight: busWeightRounded,
        });
        if (
          pm.morphogenesisStage !== targetStage ||
          pm.morphogenesisDepth !== targetMorph.derivationDepth
        ) {
          const prevShiver = pm.tactileShiverImpulse;
          const prevPhase = pm.pulsePhase;
          plantsRoot.remove(pm.group);
          disposePlantGroup(pm.group);
          const rebuilt = buildPlantGroup(pm.instance);
          rebuilt.tactileShiverImpulse = prevShiver;
          rebuilt.pulsePhase = prevPhase;
          plantMeshes[i] = rebuilt;
          pm = rebuilt;
        }
        pm.bloomMat.iridescenceThicknessMaximum = 180 + fidelity.airyThinFilmSpanNm * 0.72;
        pm.accentMat.iridescenceThicknessMaximum = 160 + fidelity.airyThinFilmSpanNm * 0.65;
        _tempColor.set('#22543d').lerp(_foliageCanopyCol, 0.52);
        pm.stemMat.color.copy(_tempColor);
      }
    };

    const performAction = (act: PlayerActionId, isSustainedHoldPulse = false) => {
      soundEngine.init();

      const nearest = findNearestPlant(
        player.x,
        player.z,
        plantsRef.current,
        player.yaw,
        player.pitch,
      );
      const nearestLandmark = evaluateNearestSynthesizedLandmark({
        playerX: player.x,
        playerZ: player.z,
        playerYaw: player.yaw,
        landmarkCentersXZ: getLandmarkCentersXZ(),
        resonanceState: landmarkResonance,
        busWeight: neuromorphicState.lastActiveSynapticWeight,
      });
      const landmarkTargeted =
        nearestLandmark.inResonanceRange &&
        (act === 'stillness' || nearestLandmark.inForwardGazeCone);
      const witnessTarget = evaluateWitnessCommunionTarget({
        playerX: player.x,
        playerZ: player.z,
        playerYaw: player.yaw,
        witnessX: immanentWitness.group.position.x,
        witnessZ: immanentWitness.group.position.z,
        busWeight: neuromorphicState.lastActiveSynapticWeight,
      });
      const witnessTargeted =
        witnessTarget.inCommunionRange &&
        (act === 'stillness' || witnessTarget.inForwardGazeCone);
      const currentBiome = biomeAt(player.x, player.z);

      // Focal Gaze-Cone Selection Law (`Foundation.Humane.V1.Model::FocalGazeSelectionPolicy`):
      // Action keys (`attune`, `touch`) only activate specimens, synthesized landmarks, or the Co-Observer Witness
      // within the player's forward observation cone and never activate elements behind the player.
      if (
        (act === 'attune' || act === 'touch') &&
        !nearest.inForwardGazeCone &&
        !landmarkTargeted &&
        !witnessTargeted
      ) {
        return;
      }

      // Refractory Cooldown & Mindful Pacing Guard (`Foundation.Humane.V1.Model::GestureHoldAndCooldownPolicy`)
      if (!isSustainedHoldPulse) {
        if (act === 'touch' && gestureHoldState.touchCooldownSec > 0) {
          gestureHoldState = {
            ...gestureHoldState,
            agitationPct: Math.min(100, Number((gestureHoldState.agitationPct + 8).toFixed(1))),
          };
          emitTelemetry(true);
          return;
        }
        if (act === 'attune' && gestureHoldState.attuneCooldownSec > 0) {
          gestureHoldState = {
            ...gestureHoldState,
            agitationPct: Math.min(100, Number((gestureHoldState.agitationPct + 8).toFixed(1))),
          };
          emitTelemetry(true);
          return;
        }
        if (act === 'stillness' && gestureHoldState.stillnessCooldownSec > 0) {
          return;
        }
      }

      if (act === 'touch') {
        gestureHoldState = {
          ...gestureHoldState,
          touchCooldownSec: VERDANT_HUMANE_STANDARD.touchRefractorySec,
        };
      } else if (act === 'attune') {
        gestureHoldState = {
          ...gestureHoldState,
          attuneCooldownSec: VERDANT_HUMANE_STANDARD.attuneRefractorySec,
        };
      } else if (act === 'stillness') {
        gestureHoldState = {
          ...gestureHoldState,
          stillnessCooldownSec: 0.85,
          agitationPct: Math.max(0, Number((gestureHoldState.agitationPct - 18).toFixed(1))),
        };
      }

      player.action = act;
      player.actionHoldTimer = 1.8;
      if (act === 'stillness') {
        player.velocityDm = 0;
        player.guidedStroll = false;
      }

      // Non-disruptive Soft Gaze Assist (`Foundation.Humane.V1.Model::CameraKinematicsPolicy`):
      // Never teleports player [x,z] and never snaps yaw; only applies a subtle damped <= 3.7° nod if in front of the player
      if (act === 'attune' || act === 'touch') {
        const focusX = nearest.inForwardGazeCone
          ? nearest.plant.x
          : witnessTargeted
            ? immanentWitness.group.position.x
            : nearestLandmark.centerX;
        const focusZ = nearest.inForwardGazeCone
          ? nearest.plant.z
          : witnessTargeted
            ? immanentWitness.group.position.z
            : nearestLandmark.centerZ;
        const focusDist = nearest.inForwardGazeCone
          ? nearest.distanceMeters
          : witnessTargeted
            ? witnessTarget.distanceMeters
            : nearestLandmark.distanceMeters;
        const softGaze = computeSoftInteractionGaze({
          playerX: player.x,
          playerZ: player.z,
          currentYaw: player.yaw,
          plantX: focusX,
          plantZ: focusZ,
          distanceMeters: focusDist,
        });
        player.yaw = softGaze.nextTargetYaw;
        cameraKinematics.interactionPitchNod = softGaze.pitchNodImpulse;
      } else if (act === 'stillness') {
        cameraKinematics.interactionPitchNod = 0.014;
      }

      const updatedNearest = nearest;
      const meshRecord = nearest.inForwardGazeCone
        ? plantMeshes.find((m) => m.instance.id === updatedNearest.plant.id)
        : undefined;
      const liveInteractionCosmo = neuromorphicState.observer.cosmogenesis;
      const liveInteractionSpeciesCfgs = synthesizeParametricPlantSpeciesConfigs({
        alphaSeed: liveInteractionCosmo.alphaSeed,
        manifold: neuromorphicState.universalManifold,
      });
      const liveInteractionBiomeCfgs = synthesizeParametricBiomeConfigs({
        alphaSeed: liveInteractionCosmo.alphaSeed,
        manifold: neuromorphicState.universalManifold,
      });
      const speciesCfg = liveInteractionSpeciesCfgs[updatedNearest.plant.species];
      const targetPan = computeBinauralPan(
        player.x,
        player.z,
        player.yaw,
        updatedNearest.plant.x,
        updatedNearest.plant.z,
      );

      // Synthesized Biome Landmark Resonance (`Foundation.Teleology.V1.Model`):
      // When the player performs a contemplative gesture near an Observer-synthesized Landmark,
      // the structure rings its physical-material Chladni overtones and nourishes surrounding flora.
      if (
        landmarkTargeted &&
        (act === 'attune' || act === 'touch' || act === 'stillness')
      ) {
        landmarkResonance = exciteLandmarkResonance(
          landmarkResonance,
          nearestLandmark.biome,
          act,
          neuromorphicState.lastActiveSynapticWeight,
        );
        const lmkGroundY = groundHeightAt(nearestLandmark.centerX, nearestLandmark.centerZ);
        soundEngine.playLandmarkResonatorVoice({
          biome: nearestLandmark.biome,
          gesture: act,
          atmosphere: atmosphereRef.current,
          fundamentalHz: nearestLandmark.fundamentalHz,
          mineralModalRatios: nearestLandmark.mineralModalRatios,
          listenerX: player.x,
          listenerY: player.y + initialPlayerModel.eyeStatureMeters,
          listenerZ: player.z,
          listenerYaw: player.yaw,
          listenerPitch: player.pitch,
          landmarkX: nearestLandmark.centerX,
          landmarkY: lmkGroundY + 2.2,
          landmarkZ: nearestLandmark.centerZ,
        });
        spawnSoundWaveRings(
          nearestLandmark.centerX,
          lmkGroundY + 0.05,
          nearestLandmark.centerZ,
          liveInteractionBiomeCfgs[nearestLandmark.biome].accentColor,
        );
        // Sympathetic ecological purpose: the resonating landmark gently nourishes nearby native flora
        let nourishedByLandmark = 0;
        for (let pIdx = 0; pIdx < plantMeshes.length; pIdx++) {
          const pm = plantMeshes[pIdx];
          const dLmk = Math.hypot(
            pm.instance.x - nearestLandmark.centerX,
            pm.instance.z - nearestLandmark.centerZ,
          );
          if (dLmk <= 14.5) {
            pm.instance.volatileTerpeneCharge = Math.max(
              pm.instance.volatileTerpeneCharge ?? 0,
              0.85,
            );
            if ((act === 'attune' || act === 'stillness') && nourishedByLandmark < 2) {
              const nextSt = advancePlantLifecycle(getPlantLifecycleStage(pm.instance), act, true);
              pm.instance.lifecycleStage = nextSt;
              if (!pm.instance.attuned) {
                pm.instance.attuned = true;
                player.sympatheticCount += 1;
              }
              pm.fruitingCrown.visible = BOTANICAL_LIFECYCLE_STAGES[nextSt].hasFruitingCrown;
              pm.elderHaloRing.visible = BOTANICAL_LIFECYCLE_STAGES[nextSt].hasMycelialSporeHalo;
              nourishedByLandmark += 1;
            }
          }
        }
      }

      // Immanent Co-Observer Witness Communion (`Foundation.Teleology.V1.Model::witnessCommunionInteractive`):
      // When the player communes with the Witness, it voices its harmonic-bronze + quartz astrolabe chord,
      // deepens its reciprocal bow, and bridges a sympathetic pollination arc to nearby flora.
      if (
        witnessTargeted &&
        (act === 'attune' || act === 'touch' || act === 'stillness')
      ) {
        witnessCommunionGlowImpulse = 1.0;
        const wx = immanentWitness.group.position.x;
        const wy = immanentWitness.group.position.y;
        const wz = immanentWitness.group.position.z;
        const wGroundY = groundHeightAt(wx, wz);
        soundEngine.playWitnessCommunionResonance({
          gesture: act,
          chordRatios: witnessTarget.chordRatios,
          reciprocity01: witnessTarget.reciprocity01,
          listenerX: player.x,
          listenerY: player.y + initialPlayerModel.eyeStatureMeters,
          listenerZ: player.z,
          listenerYaw: player.yaw,
          listenerPitch: player.pitch,
          witnessX: wx,
          witnessY: wy + 0.85,
          witnessZ: wz,
        });
        spawnSoundWaveRings(
          wx,
          wGroundY + 0.04,
          wz,
          neuromorphicState.observer.affectAndPreferences.liveSteering.witnessAuraColorHex,
        );
        // Find the closest unawakened (or maturing) specimen within 22m of the Witness to receive a sympathetic arc
        let bestBridgeRec: (typeof plantMeshes)[number] | null = null;
        let bestBridgeDist = 22.0;
        for (let pIdx = 0; pIdx < plantMeshes.length; pIdx++) {
          const cand = plantMeshes[pIdx];
          const dW = Math.hypot(cand.instance.x - wx, cand.instance.z - wz);
          const preferBoost = cand.instance.attuned ? 4.0 : 0.0;
          if (dW <= 22.0 && dW + preferBoost < bestBridgeDist) {
            bestBridgeDist = dW + preferBoost;
            bestBridgeRec = cand;
          }
        }
        if (bestBridgeRec && (act === 'attune' || act === 'stillness')) {
          if (!bestBridgeRec.instance.attuned) {
            bestBridgeRec.instance.attuned = true;
            player.sympatheticCount += 1;
          }
          bestBridgeRec.instance.volatileTerpeneCharge = 0.9;
          const bridgedStage = advancePlantLifecycle(
            getPlantLifecycleStage(bestBridgeRec.instance),
            act,
            true,
          );
          bestBridgeRec.instance.lifecycleStage = bridgedStage;
          bestBridgeRec.fruitingCrown.visible =
            BOTANICAL_LIFECYCLE_STAGES[bridgedStage].hasFruitingCrown;
          bestBridgeRec.elderHaloRing.visible =
            BOTANICAL_LIFECYCLE_STAGES[bridgedStage].hasMycelialSporeHalo;
          spawnSympatheticFilament(
            wx,
            wy + 0.9,
            wz,
            bestBridgeRec.instance.x,
            bestBridgeRec.instance.y,
            bestBridgeRec.instance.z,
            liveInteractionSpeciesCfgs[bestBridgeRec.instance.species].emissiveHue,
            bestBridgeRec.instance.id,
            gardenColliders,
            liveInteractionCosmo.worldTopology,
          );
        }
      }

      let newSympatheticLinks = 0;

      if (act === 'touch') {
        // [T] Touch Petal: Intimate solo tactile pluck + 9.5Hz elastic petal shiver + volatile terpene release + lifecycle advance
        if (meshRecord) {
          const nextStage = advancePlantLifecycle(getPlantLifecycleStage(meshRecord.instance), 'touch');
          meshRecord.instance.lifecycleStage = nextStage;
          meshRecord.instance.volatileTerpeneCharge = 1.0;
          if (BOTANICAL_LIFECYCLE_STAGES[nextStage].stageIndex >= 2) {
            meshRecord.instance.attuned = true;
          }
          meshRecord.fruitingCrown.visible = BOTANICAL_LIFECYCLE_STAGES[nextStage].hasFruitingCrown;
          meshRecord.elderHaloRing.visible = BOTANICAL_LIFECYCLE_STAGES[nextStage].hasMycelialSporeHalo;
          meshRecord.tactileShiverImpulse = 1.0;
          for (const mat of meshRecord.emissiveMaterials) {
            mat.emissiveIntensity = 1.45;
          }
        }
      } else if (act === 'attune') {
        // [Space] Attune Flora: Deep polyphonic awakening + 14m Sympathetic Cross-Pollination & Terpene Signaling + lifecycle advance
        if (meshRecord) {
          const nextStage = advancePlantLifecycle(getPlantLifecycleStage(meshRecord.instance), 'attune');
          meshRecord.instance.lifecycleStage = nextStage;
          meshRecord.instance.attuned = true;
          meshRecord.instance.volatileTerpeneCharge = 1.0;
          meshRecord.fruitingCrown.visible = BOTANICAL_LIFECYCLE_STAGES[nextStage].hasFruitingCrown;
          meshRecord.elderHaloRing.visible = BOTANICAL_LIFECYCLE_STAGES[nextStage].hasMycelialSporeHalo;
          for (const mat of meshRecord.emissiveMaterials) {
            mat.emissiveIntensity = 1.38;
          }
          (meshRecord.haloRing.material as THREE.MeshBasicMaterial).opacity = 0.88;

          const neighbors = findSympatheticNeighbors(updatedNearest.plant, plantsRef.current, 3);
          for (let nbIdx = 0; nbIdx < neighbors.length; nbIdx++) {
            const nb = neighbors[nbIdx];
            const nbRecord = plantMeshes.find((m) => m.instance.id === nb.id);
            if (nbRecord) {
              if (!nbRecord.instance.attuned) {
                nbRecord.instance.attuned = true;
                player.sympatheticCount += 1;
              }
              nbRecord.instance.volatileTerpeneCharge = 0.75;
              const nbNextStage = advancePlantLifecycle(
                getPlantLifecycleStage(nbRecord.instance),
                'attune',
                true,
              );
              nbRecord.instance.lifecycleStage = nbNextStage;
              nbRecord.fruitingCrown.visible = BOTANICAL_LIFECYCLE_STAGES[nbNextStage].hasFruitingCrown;
              nbRecord.elderHaloRing.visible =
                BOTANICAL_LIFECYCLE_STAGES[nbNextStage].hasMycelialSporeHalo;
              newSympatheticLinks += 1;
              for (const mat of nbRecord.emissiveMaterials) {
                mat.emissiveIntensity = 1.25;
              }
              (nbRecord.haloRing.material as THREE.MeshBasicMaterial).opacity = 0.82;
              spawnSympatheticFilament(
                updatedNearest.plant.x,
                updatedNearest.plant.y,
                updatedNearest.plant.z,
                nb.x,
                nb.y,
                nb.z,
                speciesCfg.emissiveHue,
                nb.id,
                gardenColliders,
                liveInteractionCosmo.worldTopology,
              );
              // Causal Finite-Velocity Wavefront Arrival (`Foundation.Ecology.V1.Model` `actionPotentialWaveSpeedMps = 6.5`):
              // The sympathetic acoustic echo triggers at the exact parabolic arc travel time `arc.travelTimeSec`,
              // attenuated and filtered by the neighbor's 3D distance, obstacle occlusion, and substrate biogeochemistry.
              const nbArc = computeSympatheticParabolicArc({
                x1: updatedNearest.plant.x,
                y1: updatedNearest.plant.y,
                z1: updatedNearest.plant.z,
                x2: nb.x,
                y2: nb.y,
                z2: nb.z,
                elapsedSinceTriggerSec: 0,
                segments: PARABOLIC_SEGMENTS,
                colliders: gardenColliders,
                topology: liveInteractionCosmo.worldTopology,
              });
              const nbPan = computeBinauralPan(player.x, player.z, player.yaw, nb.x, nb.z);
              const nbDist = Math.hypot(nb.x - player.x, nb.z - player.z);
              const nbOcc = computeAcousticOcclusion(
                player.x,
                player.z,
                nb.x,
                nb.z,
                gardenColliders,
              );
              soundEngine.playSympatheticPollinationEcho(
                nb.species,
                currentBiome,
                nbArc.travelTimeSec,
                nbPan,
                atmosphereRef.current,
                nbDist,
                nbOcc,
                nb.substrate ?? 'terrestrial-loam',
              );
            }
          }
        }
      } else if (act === 'stillness') {
        // [C] Meditative Stillness consolidates nearby awakened flora into Stage 4 Mycelial Elders
        for (let pIdx = 0; pIdx < plantMeshes.length; pIdx++) {
          const pm = plantMeshes[pIdx];
          const d = Math.hypot(player.x - pm.instance.x, player.z - pm.instance.z);
          if (d <= 14.0 && getPlantLifecycleStage(pm.instance) !== 'dormant-seed') {
            const nextSt = advancePlantLifecycle(getPlantLifecycleStage(pm.instance), 'stillness');
            pm.instance.lifecycleStage = nextSt;
            pm.instance.attuned = true;
            pm.fruitingCrown.visible = BOTANICAL_LIFECYCLE_STAGES[nextSt].hasFruitingCrown;
            pm.elderHaloRing.visible = BOTANICAL_LIFECYCLE_STAGES[nextSt].hasMycelialSporeHalo;
          }
        }
      }

      const chorusState: ChorusStateId = updatedNearest.plant.attuned ? 'awakened' : 'dormant';
      const reqStr = formatPrismRequest({
        biome: currentBiome,
        plant: updatedNearest.plant.species,
        action: act,
        atmosphere: atmosphereRef.current,
        chorus: chorusState,
        proximity: updatedNearest.proximityDm,
        velocity: act === 'stillness' ? 0 : Math.min(8, player.velocityDm),
      });
      const decision = evaluatePrismRequest(reqStr);
      const outcome = (decision.valid ? decision.outcome : 'wind-whisper') as SoundscapeOutcome;

      player.lastRequest = reqStr;
      player.lastOutcome = outcome;
      player.lastRule = decision.rule;
      player.lastRuleDesc = decision.ruleDescription;

      if (act === 'touch') {
        if (meshRecord) {
          // Tight 12-droplet tactile dewdrop burst + crisp 3ms plucked upper-harmonic transient
          spawnBurstAt(
            updatedNearest.plant.x,
            updatedNearest.plant.y,
            updatedNearest.plant.z,
            speciesCfg.primaryHue,
            12,
          );
          soundEngine.playTactilePetalTouch(
            updatedNearest.plant.species,
            currentBiome,
            updatedNearest.plant.pitchMultiplier,
            atmosphereRef.current,
            targetPan,
            updatedNearest.plant.substrate ?? 'terrestrial-loam',
          );
        }
      } else if (act === 'stillness') {
        // Self-decaying 650ms inhale / 3.2s exhale warm pastoral ninth breathing pad
        spawnSoundWaveRings(
          player.x,
          player.y,
          player.z,
          liveInteractionBiomeCfgs[currentBiome].accentColor,
        );
        soundEngine.playStillnessMeditationSwell(currentBiome, atmosphereRef.current);
      } else if (meshRecord) {
        // [Space] Attune Flora: 24-spore burst + 5 expanding ground wave rings + 220ms 6-voice polyphonic choir
        spawnBurstAt(
          updatedNearest.plant.x,
          updatedNearest.plant.y,
          updatedNearest.plant.z,
          speciesCfg.emissiveHue,
          24,
        );
        spawnSoundWaveRings(
          updatedNearest.plant.x,
          updatedNearest.plant.y,
          updatedNearest.plant.z,
          speciesCfg.emissiveHue,
        );
        soundEngine.playAttuneResonanceChoir(
          outcome,
          currentBiome,
          updatedNearest.plant.species,
          atmosphereRef.current,
          targetPan,
          updatedNearest.plant.substrate ?? 'terrestrial-loam',
        );
      }

      player.harmony = computeGardenHarmonyPct({
        plants: plantsRef.current,
        exploredBiomesCount: player.exploredBiomes.size,
      });

      // Execute 6-Stage Neuromorphic Synthesis Tick (`afflom/rule30` + `casey-allard/lexlean-r4`)
      const neuroTick = executeNeuromorphicSynthesisTick(neuromorphicState, {
        biome: currentBiome,
        species: updatedNearest.plant.species,
        atmosphere: atmosphereRef.current,
        action: act,
        outcome,
        playerX: player.x,
        playerZ: player.z,
        playerYaw: player.yaw,
        existingPlants: plantsRef.current,
        colliders: gardenColliders,
        velocityDm: player.velocityDm,
        agitationPct: Math.round(gestureHoldState.agitationPct),
      });
      neuromorphicState =
        act === 'stillness' || outcome === 'sanctuary-chorus' || outcome === 'serene-rest'
          ? refinePrismModel(neuroTick.nextState, { cycles: 1 }).nextState
          : neuroTick.nextState;
      playerInteractedThisFrame = true;

      if (neuroTick.emergentSeedling) {
        plantsRef.current.push(neuroTick.emergentSeedling);
        registerEmergentSeedlingCollider(gardenColliders, neuroTick.emergentSeedling, {
          alphaSeed: liveInteractionCosmo.alphaSeed,
          manifold: neuromorphicState.universalManifold,
        });
        const newMeshRecord = buildPlantGroup(neuroTick.emergentSeedling);
        plantMeshes.push(newMeshRecord);
        spawnBurstAt(
          neuroTick.emergentSeedling.x,
          neuroTick.emergentSeedling.y,
          neuroTick.emergentSeedling.z,
          '#fde047',
          20,
        );
        spawnSympatheticFilament(
          updatedNearest.plant.x,
          updatedNearest.plant.y,
          updatedNearest.plant.z,
          neuroTick.emergentSeedling.x,
          neuroTick.emergentSeedling.y,
          neuroTick.emergentSeedling.z,
          '#fde047',
          neuroTick.emergentSeedling.id,
          gardenColliders,
          liveInteractionCosmo.worldTopology,
        );
      }

      soundEngine.syncWithNeuromorphicBus(neuromorphicState);
      syncMultiModalFidelityVisuals();

      soundEngine.playNeuromorphicCounterpoint({
        biome: currentBiome,
        kinshipSpecies: neuroTick.kinshipSpecies,
        counterpointRatios: neuroTick.counterpointRatios,
        synapticWeight: neuroTick.nextState.lastActiveSynapticWeight,
        strategy: neuroTick.nextState.lastScheduledStrategy,
        atmosphere: atmosphereRef.current,
        stereoPan: targetPan,
        delayOffsetSec: act === 'touch' ? 0.24 : 0.52,
        isSeedlingGermination: Boolean(neuroTick.emergentSeedling),
        substrate: updatedNearest.plant.substrate ?? 'terrestrial-loam',
      });

      // Re-synthesize the live 16-step generative soundtrack score immediately upon player interaction
      currentSoundtrackScore = composeLiveSoundtrackScore({
        biome: currentBiome,
        atmosphere: atmosphereRef.current,
        harmonyPct: player.harmony,
        plants: plantsRef.current,
        neuromorphic: neuromorphicState,
        playerX: player.x,
        playerZ: player.z,
        playerYaw: player.yaw,
        colliders: gardenColliders,
      });

      onPlantAttunedRef.current(updatedNearest.plant.id, currentBiome, outcome);
      emitTelemetry(true);
    };

    const teleportToBiome = (biome: BiomeId) => {
      soundEngine.init();
      player.guidedStroll = false;
      const landing = resolveBiomeWaypointLanding(biome, gardenColliders);
      player.x = landing.x;
      player.z = landing.z;
      player.y = landing.y;
      player.surfaceMaterial = landing.surfaceMaterial;
      player.inWater = landing.inWater;
      player.waterDepthMeters = landing.waterDepthMeters;
      player.slopeGradePct = landing.slopeGradePct;
      player.obstructedBy = landing.obstructedBy;
      player.yaw = 0;
      player.pitch = 0.04;
      player.exploredBiomes.add(biome);
      cameraKinematics = {
        ...cameraKinematics,
        camX: player.x,
        camY: player.y + 1.68,
        camZ: player.z,
        camYaw: player.yaw,
        camPitch: player.pitch,
      };

      if (biome === 'sanctuary') {
        player.action = 'stillness';
        player.velocityDm = 0;
        player.actionHoldTimer = 2.5;
      } else {
        player.action = 'observe';
        player.actionHoldTimer = 1.2;
      }

      const nearest = findNearestPlant(
        player.x,
        player.z,
        plantsRef.current,
        player.yaw,
        player.pitch,
      );
      const chorusState: ChorusStateId = nearest.plant.attuned ? 'awakened' : 'dormant';
      const reqStr = formatPrismRequest({
        biome,
        plant: nearest.plant.species,
        action: player.action,
        atmosphere: atmosphereRef.current,
        chorus: chorusState,
        proximity: nearest.proximityDm,
        velocity: player.velocityDm,
      });
      const decision = evaluatePrismRequest(reqStr);
      const outcome = (decision.valid ? decision.outcome : 'ambient-drone') as SoundscapeOutcome;

      player.lastRequest = reqStr;
      player.lastOutcome = outcome;
      player.lastRule = decision.rule;
      player.lastRuleDesc = decision.ruleDescription;
      player.harmony = computeGardenHarmonyPct({
        plants: plantsRef.current,
        exploredBiomesCount: player.exploredBiomes.size,
      });

      soundEngine.playOutcomeMotif(
        outcome,
        biome,
        0.9,
        atmosphereRef.current,
        computeBinauralPan(player.x, player.z, player.yaw, nearest.plant.x, nearest.plant.z),
        nearest.plant.species,
        nearest.plant.substrate ?? 'terrestrial-loam',
      );
      emitTelemetry(true);
    };

    const toggleGuidedStroll = () => {
      soundEngine.init();
      player.guidedStroll = !player.guidedStroll;
      emitTelemetry(true);
    };

    const resetExploration = () => {
      player.x = 0;
      player.y = groundHeightAt(0, 0);
      player.z = 0;
      player.yaw = 0;
      player.pitch = 0.04;
      cameraKinematics = {
        ...cameraKinematics,
        camX: player.x,
        camY: player.y + 1.68,
        camZ: player.z,
        camYaw: player.yaw,
        camPitch: player.pitch,
      };
      player.guidedStroll = false;
      player.trailIndex = 0;
      player.velocityDm = 0;
      player.walkDist = 0;
      player.action = 'observe';
      player.harmony = 15;
      player.sympatheticCount = 0;
      player.exploredBiomes = new Set<BiomeId>(['meadow']);
      cameraKinematics = {
        camX: 0,
        camY: player.y + 1.72,
        camZ: 0,
        camYaw: 0,
        camPitch: 0.04,
        camFov: 58,
        bobPhase: 0,
        bobAmplitude: 0.012,
        interactionPitchNod: 0,
      };
      gestureHoldState = createInitialGestureHoldState();
      landmarkResonance = createInitialLandmarkResonanceState();
      autonomousPlasticity = createInitialAutonomousPlasticityState();
      activeWaystoneIndex = -1;
      witnessCommunionGlowImpulse = 0;
      uiHeldGesture = null;
      for (const m of plantMeshes) {
        m.instance.attuned = false;
        m.instance.lifecycleStage = 'dormant-seed';
        m.fruitingCrown.visible = false;
        m.elderHaloRing.visible = false;
        for (const mat of m.emissiveMaterials) {
          mat.emissiveIntensity = 0.4;
        }
        (m.haloRing.material as THREE.MeshBasicMaterial).opacity = 0.24;
      }
      const activeAlpha = neuromorphicState.observer.cosmogenesis.alphaSeed;
      neuromorphicState = createInitialNeuromorphicState(activeAlpha);
      soundEngine.syncWithNeuromorphicBus(neuromorphicState);
      syncMultiModalFidelityVisuals();
      activeCrownModelId = '';
      currentSoundtrackStep = 0;
      soundtrackStepTimer = 0;
      currentSoundtrackScore = composeLiveSoundtrackScore({
        biome: 'meadow',
        atmosphere: atmosphereRef.current,
        harmonyPct: 15,
        plants: plantsRef.current,
        neuromorphic: neuromorphicState,
        playerX: player.x,
        playerZ: player.z,
        playerYaw: player.yaw,
        colliders: gardenColliders,
      });
      emitTelemetry(true);
    };

    const setHeldAction = (act: HoldableGestureId | null) => {
      uiHeldGesture = act;
      if (act) {
        performAction(act, false);
      } else {
        emitTelemetry(true);
      }
    };

    const reprojectWorldGeometry = (
      targetAlphaSeed: number,
      targetManifold: UniversalNeuromorphicManifold,
    ) => {
      const cosmoParams = { alphaSeed: targetAlphaSeed, manifold: targetManifold };
      const nextTopo = synthesizeParametricWorldTopology(cosmoParams);
      const nextMonuments = synthesizeObserverInorganicMonuments(cosmoParams);

      syncMultiModalFidelityVisuals(nextTopo);

      const [nextSanctX, nextSanctZ] = nextMonuments.monuments.sanctuary.sanctuary!.centerXZ;
      const [nextMeadowX, nextMeadowZ] = nextMonuments.monuments.meadow.meadow!.centerXZ;
      const [nextGroveX, nextGroveZ] = nextMonuments.monuments.grove.grove!.centerXZ;
      const [nextCrystalX, nextCrystalZ] = nextMonuments.monuments.crystal.crystal!.centerXZ;

      sanctuaryMonument.group.position.set(
        nextSanctX,
        groundHeightAt(nextSanctX, nextSanctZ, nextTopo),
        nextSanctZ,
      );
      meadowMonument.group.position.set(
        nextMeadowX,
        groundHeightAt(nextMeadowX, nextMeadowZ, nextTopo),
        nextMeadowZ,
      );
      groveMonument.group.position.set(
        nextGroveX,
        groundHeightAt(nextGroveX, nextGroveZ, nextTopo),
        nextGroveZ,
      );
      crystalMonument.group.position.set(
        nextCrystalX,
        groundHeightAt(nextCrystalX, nextCrystalZ, nextTopo),
        nextCrystalZ,
      );

      labyrinthGroup.position.set(
        nextSanctX,
        groundHeightAt(nextSanctX, nextSanctZ, nextTopo) + 0.03,
        nextSanctZ,
      );
      meadowTerraceGroup.position.set(
        nextMeadowX,
        groundHeightAt(nextMeadowX, nextMeadowZ, nextTopo) + 0.025,
        nextMeadowZ,
      );
      groveTerraceGroup.position.set(
        nextGroveX,
        groundHeightAt(nextGroveX, nextGroveZ, nextTopo) + 0.028,
        nextGroveZ,
      );
      crystalBasinGroup.position.set(
        nextCrystalX,
        groundHeightAt(nextCrystalX, nextCrystalZ, nextTopo) + 0.03,
        nextCrystalZ,
      );

      const nextLagoonXZ = nextMonuments.monuments.wetland.wetland!.centerXZ;
      const nextAnchorsByBiome: Record<BiomeId, readonly [number, number]> = {
        sanctuary: [nextSanctX, nextSanctZ],
        meadow: [nextMeadowX, nextMeadowZ],
        grove: [nextGroveX, nextGroveZ],
        crystal: [nextCrystalX, nextCrystalZ],
        wetland: nextLagoonXZ,
      };
      for (let bIdx = 0; bIdx < biomeConstellationBeams.length; bIdx++) {
        const bc = biomeConstellationBeams[bIdx];
        const [bx, bz] = nextAnchorsByBiome[bc.biome];
        const baseY =
          bc.biome === 'wetland'
            ? nextTopo.lagoonWaterSurfaceY
            : groundHeightAt(bx, bz, nextTopo);
        bc.beamMesh.position.set(bx, baseY + bc.crownOffsetY + 0.35, bz);
        bc.crownMesh.position.set(bx, baseY + bc.crownOffsetY, bz);
      }

      const nextStones = generateConservatorySteppingStones(cosmoParams);
      activeSteppingStones = nextStones;
      const activeStoneLen = Math.min(stoneCount, nextStones.length);
      for (let i = 0; i < activeStoneLen; i++) {
        const st = nextStones[i];
        _dummyPos.set(st.x, st.centerY, st.z);
        _dummyEuler.set(0, st.rotY, 0);
        _dummyQuat.setFromEuler(_dummyEuler);
        _dummyScale.set(st.scaleX, st.scaleY, st.scaleZ);
        _dummyMatrix.compose(_dummyPos, _dummyQuat, _dummyScale);
        stepStonesMesh.setMatrixAt(i, _dummyMatrix);
      }
      stepStonesMesh.instanceMatrix.needsUpdate = true;

      const nextRocks = generateConservatoryRocks(cosmoParams);
      const activeRockLen = Math.min(rockCount, nextRocks.length);
      for (let i = 0; i < activeRockLen; i++) {
        const rk = nextRocks[i];
        _dummyPos.set(rk.x, rk.centerY, rk.z);
        _dummyEuler.set(rk.rotX, rk.rotY, rk.rotZ);
        _dummyQuat.setFromEuler(_dummyEuler);
        _dummyScale.set(rk.scaleX, rk.scaleY, rk.scaleZ);
        _dummyMatrix.compose(_dummyPos, _dummyQuat, _dummyScale);
        rocksInstanced.setMatrixAt(i, _dummyMatrix);
      }
      rocksInstanced.instanceMatrix.needsUpdate = true;

      const nextTrees = generateConservatoryTrees(cosmoParams);
      const activeStalkLen = Math.min(stalkCount, nextTrees.length);
      for (let i = 0; i < activeStalkLen; i++) {
        const tr = nextTrees[i];
        _dummyPos.set(tr.x, tr.baseY, tr.z);
        _dummyEuler.set(tr.tiltX, 0, tr.tiltZ);
        _dummyQuat.setFromEuler(_dummyEuler);
        _dummyScale.set(tr.scaleXZ, tr.scaleY, tr.scaleXZ);
        _dummyMatrix.compose(_dummyPos, _dummyQuat, _dummyScale);
        stalksInstanced.setMatrixAt(i, _dummyMatrix);
      }
      stalksInstanced.instanceMatrix.needsUpdate = true;

      for (let i = 0; i < canopyCount; i++) {
        const stalkIdx = i % activeStalkLen;
        const tier = Math.floor(i / stalkCount) as 0 | 1;
        const tr = nextTrees[stalkIdx];
        if (!tr) continue;
        const tierSpec = tr.canopyTiers[tier];
        canopyX[i] = tierSpec.x;
        canopyY[i] = tierSpec.y;
        canopyZ[i] = tierSpec.z;
        canopyScale[i] = tierSpec.scale;
        canopyBaseTiltX[i] = tr.tiltX;
        canopyBaseTiltZ[i] = tr.tiltZ;
        _dummyPos.set(tierSpec.x, tierSpec.y, tierSpec.z);
        _dummyEuler.set(tr.tiltX, i * 1.1, tr.tiltZ);
        _dummyQuat.setFromEuler(_dummyEuler);
        _dummyScale.set(tierSpec.scale, 0.75, tierSpec.scale);
        _dummyMatrix.compose(_dummyPos, _dummyQuat, _dummyScale);
        canopyInstanced.setMatrixAt(i, _dummyMatrix);
      }
      canopyInstanced.instanceMatrix.needsUpdate = true;

      const nextGrass = generateConservatoryGrassBlades(cosmoParams);
      const activeGrassLen = Math.min(GRASS_COUNT, nextGrass.length);
      for (let i = 0; i < activeGrassLen; i++) {
        const gb = nextGrass[i];
        grassX[i] = gb.x;
        grassY[i] = gb.y;
        grassZ[i] = gb.z;
        grassHScale[i] = gb.hScale;
        grassYaw[i] = gb.yaw;
        grassValid[i] = gb.valid ? 1 : 0;
        _dummyPos.set(gb.x, gb.y, gb.z);
        _dummyEuler.set((i % 5) * 0.05 - 0.1, gb.yaw, ((i + 2) % 5) * 0.05 - 0.1);
        _dummyQuat.setFromEuler(_dummyEuler);
        _dummyScale.set(1, gb.hScale, 1);
        _dummyMatrix.compose(_dummyPos, _dummyQuat, _dummyScale);
        grassInstanced.setMatrixAt(i, _dummyMatrix);
      }
      grassInstanced.instanceMatrix.needsUpdate = true;
    };

    const refineParametricCosmos = (cycles = 1) => {
      const refined = refinePrismModel(neuromorphicState, {
        cycles: Math.max(1, Math.min(8, cycles)),
        leadDomain: 'neuromorphic',
      });
      neuromorphicState = refined.nextState;
      reprojectWorldGeometry(
        neuromorphicState.observer.cosmogenesis.alphaSeed,
        neuromorphicState.universalManifold,
      );
      soundEngine.syncWithNeuromorphicBus(neuromorphicState);
      soundEngine.setPaused(false);
      soundEngine.playSynthesizedObserverModelAudition(
        neuromorphicState.observer.supraDirective.activeModel,
        atmosphereRef.current,
      );
      emitTelemetry(true);
    };

    const setAlphaSeed = (nextAlphaSeed: number, nextPlants: GardenPlantInstance[]) => {
      const clampedSeed = clampAlphaSeed(nextAlphaSeed);
      for (const rec of plantMeshes) {
        plantsRoot.remove(rec.group);
        disposePlantGroup(rec.group);
      }
      plantMeshes.length = 0;
      plantsRef.current = nextPlants;
      for (const p of nextPlants) {
        plantMeshes.push(buildPlantGroup(p));
      }

      gardenColliders.length = 0;
      gardenColliders.push(
        ...buildGardenColliders(nextPlants, {
          alphaSeed: clampedSeed,
          manifold: neuromorphicState.universalManifold,
        }),
      );
      syncImmanentWitnessCollider(gardenColliders, neuromorphicState.observer.immanentPresence);

      const nearestNow = findNearestPlant(player.x, player.z, nextPlants, player.yaw);
      player.harmony = computeGardenHarmonyPct({
        plants: nextPlants,
        exploredBiomesCount: player.exploredBiomes.size,
      });
      neuromorphicState = {
        ...neuromorphicState,
        observer: evaluateHolisticObserverState({
          manifold: neuromorphicState.universalManifold,
          tickCount: neuromorphicState.tickCount,
          rule30History: neuromorphicState.rule30History,
          prevObserver: neuromorphicState.observer,
          biome: biomeAt(player.x, player.z),
          species: nearestNow.plant.species,
          atmosphere: atmosphereRef.current,
          action: player.action,
          velocityDm: player.velocityDm,
          harmonyPct: Math.round(player.harmony),
          playerX: player.x,
          playerZ: player.z,
          playerYaw: player.yaw,
          alphaSeed: clampedSeed,
        }),
      };
      reprojectWorldGeometry(clampedSeed, neuromorphicState.universalManifold);

      soundEngine.syncWithNeuromorphicBus(neuromorphicState);
      soundEngine.setPaused(false);
      soundEngine.playSynthesizedObserverModelAudition(
        neuromorphicState.observer.supraDirective.activeModel,
        atmosphereRef.current,
      );
      emitTelemetry(true);
    };

    const extrapolateToHighestResolution = () => {
      const nearestNow = findNearestPlant(player.x, player.z, plantsRef.current, player.yaw);
      const extrapolated = extrapolatePrismToHighestResolution(neuromorphicState, {
        alphaSeed: neuromorphicState.observer.cosmogenesis.alphaSeed,
        biome: biomeAt(player.x, player.z),
        species: nearestNow.plant.species,
        atmosphere: atmosphereRef.current,
        harmonyPct: Math.round(player.harmony),
        playerX: player.x,
        playerZ: player.z,
        playerYaw: player.yaw,
      });
      neuromorphicState = extrapolated.nextState;
      reprojectWorldGeometry(
        neuromorphicState.observer.cosmogenesis.alphaSeed,
        neuromorphicState.universalManifold,
      );
      soundEngine.syncWithNeuromorphicBus(neuromorphicState);
      soundEngine.setPaused(false);
      soundEngine.playSynthesizedObserverModelAudition(
        extrapolated.extrapolatedModel,
        atmosphereRef.current,
      );
      emitTelemetry(true);
    };

    handleRef.current = {
      triggerAction: (act) => performAction(act, false),
      setHeldAction,
      teleportToBiome,
      toggleGuidedStroll,
      resetExploration,
      refineParametricCosmos,
      extrapolateToHighestResolution,
      setAlphaSeed,
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (gameStateRef.current !== 'playing') return;
      if (
        e.code === 'Space' ||
        e.code === 'KeyF' ||
        e.code === 'KeyT' ||
        e.code === 'KeyC' ||
        e.code === 'KeyG'
      ) {
        e.preventDefault();
      }
      keysPressed.add(e.code);

      // Strictly suppress OS key-repeat events (`e.repeat`): sustained holding is governed by `stepGestureHoldEnvelope` in `tick()`
      if (e.repeat) return;

      if (e.code === 'Space' || e.code === 'KeyF') {
        performAction('attune', false);
      } else if (e.code === 'KeyT') {
        performAction('touch', false);
      } else if (e.code === 'KeyC') {
        performAction('stillness', false);
      } else if (e.code === 'KeyG') {
        toggleGuidedStroll();
      } else if (e.code === 'Digit1') {
        teleportToBiome('meadow');
      } else if (e.code === 'Digit2') {
        teleportToBiome('grove');
      } else if (e.code === 'Digit3') {
        teleportToBiome('crystal');
      } else if (e.code === 'Digit4') {
        teleportToBiome('wetland');
      } else if (e.code === 'Digit5') {
        teleportToBiome('sanctuary');
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keysPressed.delete(e.code);
    };

    const onWindowBlur = () => {
      keysPressed.clear();
      isPointerDragging = false;
    };

    let pointerDragDist = 0;
    let lastWaveFootstepDist = 0;

    const onMouseDown = (e: MouseEvent) => {
      if (gameStateRef.current !== 'playing') return;
      if (e.target !== renderer.domElement) return;
      soundEngine.init();
      isPointerDragging = true;
      pointerDragDist = 0;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isPointerDragging || gameStateRef.current !== 'playing') return;
      const dx = e.clientX - lastMouseX;
      const dy = e.clientY - lastMouseY;
      pointerDragDist += Math.hypot(dx, dy);
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      player.yaw -= dx * 0.0045;
      player.pitch = Math.max(-0.55, Math.min(0.65, player.pitch - dy * 0.0035));
    };

    const onMouseUp = (e: MouseEvent) => {
      if (
        isPointerDragging &&
        pointerDragDist < 6 &&
        gameStateRef.current === 'playing' &&
        e.target === renderer.domElement
      ) {
        const nearest = findNearestPlant(
          player.x,
          player.z,
          plantsRef.current,
          player.yaw,
          player.pitch,
        );
        const nearestLmk = evaluateNearestSynthesizedLandmark({
          playerX: player.x,
          playerZ: player.z,
          playerYaw: player.yaw,
          landmarkCentersXZ: getLandmarkCentersXZ(),
          resonanceState: landmarkResonance,
          busWeight: neuromorphicState.lastActiveSynapticWeight,
        });
        const witnessClick = evaluateWitnessCommunionTarget({
          playerX: player.x,
          playerZ: player.z,
          playerYaw: player.yaw,
          witnessX: immanentWitness.group.position.x,
          witnessZ: immanentWitness.group.position.z,
          busWeight: neuromorphicState.lastActiveSynapticWeight,
        });
        if (
          (nearest.inForwardGazeCone && nearest.distanceMeters <= 22.0) ||
          (nearestLmk.inForwardGazeCone && nearestLmk.inResonanceRange) ||
          (witnessClick.inForwardGazeCone && witnessClick.inCommunionRange)
        ) {
          performAction('attune');
        }
      }
      isPointerDragging = false;
    };

    const onResize = () => {
      if (!container) return;
      const rawW = container.clientWidth || window.innerWidth;
      const rawH = container.clientHeight || window.innerHeight;
      if (rawW <= 0 || rawH <= 0) return;
      camera.aspect = rawW / rawH;
      camera.updateProjectionMatrix();
      renderer.setSize(rawW, rawH);
    };

    const resizeObserver =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => onResize()) : null;
    resizeObserver?.observe(container);

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onWindowBlur);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('resize', onResize);

    let lastTelemetryTime = 0;
    const emitTelemetry = (force = false) => {
      const now = performance.now();
      if (!force && now - lastTelemetryTime < 140) return;
      lastTelemetryTime = now;

      const currentBiome = biomeAt(player.x, player.z);
      player.exploredBiomes.add(currentBiome);
      const nearest = findNearestPlant(
        player.x,
        player.z,
        plantsRef.current,
        player.yaw,
        player.pitch,
      );
      const attunedCount = plantMeshes.filter((m) => m.instance.attuned).length;
      const chorusState: ChorusStateId = nearest.plant.attuned || attunedCount >= 5 ? 'awakened' : 'dormant';
      const affinity = computeEcologicalAffinity(
        currentBiome,
        nearest.plant.species,
        atmosphereRef.current,
      );

      const hydro = evaluateHydrodynamics(player.x, player.z);
      const surfaceMaterial = classifySurfaceMaterial(player.x, player.z);
      const acousticOcclusion = computeAcousticOcclusion(
        player.x,
        player.z,
        nearest.plant.x,
        nearest.plant.z,
        gardenColliders,
      );

      player.harmony = computeGardenHarmonyPct({
        plants: plantsRef.current,
        exploredBiomesCount: player.exploredBiomes.size,
      });

      const envLifecycle = evaluateEnvironmentalLifecycle({
        harmonyPct: Math.round(player.harmony),
        plants: plantsRef.current,
        atmosphere: atmosphereRef.current,
      });
      currentSoundtrackScore = composeLiveSoundtrackScore({
        biome: currentBiome,
        atmosphere: atmosphereRef.current,
        harmonyPct: Math.round(player.harmony),
        plants: plantsRef.current,
        neuromorphic: neuromorphicState,
        playerX: player.x,
        playerZ: player.z,
        playerYaw: player.yaw,
        colliders: gardenColliders,
      });

      const nearestLandmark = evaluateNearestSynthesizedLandmark({
        playerX: player.x,
        playerZ: player.z,
        playerYaw: player.yaw,
        landmarkCentersXZ: getLandmarkCentersXZ(),
        resonanceState: landmarkResonance,
        busWeight: neuromorphicState.lastActiveSynapticWeight,
      });
      const witnessCommunion = evaluateWitnessCommunionTarget({
        playerX: player.x,
        playerZ: player.z,
        playerYaw: player.yaw,
        witnessX: immanentWitness.group.position.x,
        witnessZ: immanentWitness.group.position.z,
        busWeight: neuromorphicState.lastActiveSynapticWeight,
      });

      onTelemetryRef.current({
        playerX: player.x,
        playerZ: player.z,
        playerYaw: player.yaw,
        biome: currentBiome,
        atmosphere: atmosphereRef.current,
        chorus: chorusState,
        affinityTier: affinity.affinityTier,
        nearestPlant: nearest.plant,
        distanceMeters: nearest.distanceMeters,
        proximityDm: nearest.proximityDm,
        velocityDm: player.velocityDm,
        action: player.action,
        prismRequest: player.lastRequest,
        prismOutcome: player.lastOutcome,
        prismRule: player.lastRule,
        prismRuleDesc: player.lastRuleDesc,
        harmony: Math.round(player.harmony),
        attunedCount,
        sympatheticCount: player.sympatheticCount,
        totalPlants: plantMeshes.length,
        exploredBiomes: Array.from(player.exploredBiomes),
        guidedStroll: player.guidedStroll,
        surfaceMaterial,
        inWater: hydro.inWater,
        waterDepthMeters: hydro.waterDepthMeters,
        slopeGradePct: player.slopeGradePct,
        obstructedBy: player.obstructedBy,
        acousticOcclusion,
        neuromorphic: neuromorphicState,
        environmentalLifecycle: envLifecycle,
        soundtrackScore: currentSoundtrackScore,
        currentSoundtrackStep,
        gestureHold: gestureHoldState,
        nearestLandmark,
        witnessCommunion,
      });
    };

    emitTelemetry(true);

    // 11. Animation Loop with Software-WebGL Pacing (`afterDraw`) & Zero-Allocation High-Resolution Timer
    let lastFrameTimeMs = performance.now();
    let elapsedSecAccumulator = 0;
    let frameId = 0;
    let unmounted = false;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync ? gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0) : null;
      gl.flush();
      const poll = () => {
        if (unmounted) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (unmounted) return;
      const nowMs = performance.now();
      const rawDt = Math.max(0, (nowMs - lastFrameTimeMs) * 0.001);
      lastFrameTimeMs = nowMs;
      const dt = Math.min(rawDt, 0.05);
      elapsedSecAccumulator += dt;
      const elapsed = elapsedSecAccumulator;
      const currentState = gameStateRef.current;

      const frameEnvLifecycle = evaluateEnvironmentalLifecycle({
        harmonyPct: Math.round(player.harmony),
        plants: plantsRef.current,
        atmosphere: atmosphereRef.current,
      });
      const spinMult = frameEnvLifecycle.monumentSpinMultiplier;

      const liveCosmo = neuromorphicState.observer.cosmogenesis;
      const inorgGlow = liveCosmo.inorganicRealm.harmonicResonanceGlow;
      const targetMonumentScale = liveCosmo.worldTopology.structuralScale;
      const dampedScale = THREE.MathUtils.damp(
        sanctuaryMonument.group.scale.x,
        targetMonumentScale,
        4.5,
        dt,
      );
      sanctuaryMonument.group.scale.setScalar(dampedScale);
      meadowMonument.group.scale.setScalar(dampedScale);
      groveMonument.group.scale.setScalar(dampedScale);
      crystalMonument.group.scale.setScalar(dampedScale);
      wetlandMonument.group.scale.setScalar(dampedScale);
      wetlandMonument.lanternMat.emissiveIntensity = 1.15 + inorgGlow * 0.65;

      const activeRule30Byte =
        neuromorphicState.rule30History[neuromorphicState.rule30History.length - 1] ?? 30;
      const activeIcosianRoot = neuromorphicState.lastIcosianRoot;

      const groveWind = evaluateWindField(
        groveSpec.centerXZ[0],
        groveSpec.centerXZ[1],
        elapsed,
        activeRule30Byte,
        activeIcosianRoot,
      );
      const meadowWind = evaluateWindField(
        meadowSpec.centerXZ[0],
        meadowSpec.centerXZ[1],
        elapsed,
        activeRule30Byte,
        activeIcosianRoot,
      );

      const monumentMechanics = evaluateMonumentPhysicalMechanics({
        elapsedSeconds: elapsed,
        structuralScale: dampedScale,
        spinMultiplier: spinMult,
        resonanceState: landmarkResonance,
        groveWindTiltX: groveWind.windTiltX,
        groveWindTiltZ: groveWind.windTiltZ,
        meadowWindSpeedMps: meadowWind.gustStrength * 2.8 + Math.hypot(meadowWind.windTiltX, meadowWind.windTiltZ) * 12.0,
        chimeBaseLengthM: groveSpec.chimeBaseLength,
        chimeLengthStepM: groveSpec.chimeLengthStep,
        chimeSustainFactor: liveCosmo.inorganicRealm.chimeSustainFactor,
        wetlandWaterSurfaceY: liveCosmo.worldTopology.lagoonWaterSurfaceY,
      });

      // Animate all 5 Biome Architectural Monuments governed by MonumentPhysicalMechanics & Landmark Resonance
      const sanctRes = landmarkResonance.sanctuary;
      const sanctSpin = spinMult * (1 + sanctRes * 0.85);

      // Sanctuary: Orthogonal Cardan Gimbal & Spire Axial Spin (zero vertical shearing)
      sanctuaryMonument.spire.position.y = sanctSpec.gimbalCenterY;
      sanctuaryMonument.spire.rotation.y = monumentMechanics.sanctuary.spireSpinY;
      sanctuaryMonument.orbitRing.rotation.x = monumentMechanics.sanctuary.outerGimbalPitchX;
      sanctuaryMonument.innerGimbalRing.rotation.z = monumentMechanics.sanctuary.innerGimbalRollZ;
      sharedGoldTrimMat.emissiveIntensity = 0.28 + inorgGlow * 0.35 + sanctRes * 0.22;

      // Live Runtime Procedural Model Synthesis on Sanctuary Supra-Directive Astrolabe Crown
      const activeObserverModel = neuromorphicState.observer.supraDirective.activeModel;
      if (activeObserverModel.modelId !== activeCrownModelId) {
        activeCrownModelId = activeObserverModel.modelId;
        const prevCrownGeo = sanctuaryMonument.observerCrown.geometry;
        sanctuaryMonument.observerCrown.geometry =
          createObserverAstrolabeCrownGeometry(activeObserverModel);
        prevCrownGeo.dispose();
      }
      sanctuaryMonument.observerCrown.rotation.y = elapsed * 0.32 * sanctSpin;
      if (sanctuaryMonument.observerCrown.morphTargetInfluences) {
        const supraNorm = neuromorphicState.observer.supraDirective.tier / 4;
        const aperiodicNorm = Math.min(
          1,
          neuromorphicState.observer.rule30Horizon.aperiodicCompensationIndex / 255,
        );
        sanctuaryMonument.observerCrown.morphTargetInfluences[0] = supraNorm;
        sanctuaryMonument.observerCrown.morphTargetInfluences[1] =
          aperiodicNorm * (0.5 + 0.5 * Math.sin(elapsed * 2.2));
      }
      sanctuaryMonument.crownMat.emissiveIntensity =
        0.2 +
        neuromorphicState.observer.supraDirective.tier * 0.09 +
        inorgGlow * 0.12 +
        sanctRes * 0.45;

      // Live Parametric Display Tone-Mapping, Mathematical Affect & Immanent 7-Part Environmental Observer Presence
      const liveDisplay = neuromorphicState.observer.parametricDisplayDesign;
      const liveSteering = neuromorphicState.observer.affectAndPreferences.liveSteering;
      renderer.toneMappingExposure = THREE.MathUtils.damp(
        renderer.toneMappingExposure,
        liveDisplay.hudAndWebglDisplay.toneMappingExposure + liveSteering.exposureWarmthDelta,
        4.0,
        dt,
      );

      const liveWitness = evaluateImmanentObserverPresence({
        elapsedSeconds: elapsed,
        alphaSeed: liveCosmo.alphaSeed,
        manifold: neuromorphicState.universalManifold,
        cosmogenesis: liveCosmo,
        displayDesign: liveDisplay,
        playerX: player.x,
        playerZ: player.z,
        playerYaw: player.yaw,
        action: player.action,
        harmonyPct: Math.round(player.harmony),
        plants: plantsRef.current,
        colliders: gardenColliders,
      });
      const safeDt = Math.max(0.008, dt);
      const witnessVX = (liveWitness.x - prevWitnessX) / safeDt;
      const witnessVZ = (liveWitness.z - prevWitnessZ) / safeDt;
      prevWitnessX = liveWitness.x;
      prevWitnessZ = liveWitness.z;
      syncImmanentWitnessCollider(gardenColliders, liveWitness);
      neuromorphicState.observer.immanentPresence = liveWitness;
      if (witnessCommunionGlowImpulse > 0.002) {
        witnessCommunionGlowImpulse = Math.max(
          0,
          witnessCommunionGlowImpulse * Math.exp(-1.6 * dt),
        );
      } else {
        witnessCommunionGlowImpulse = 0;
      }
      immanentWitness.group.position.set(liveWitness.x, liveWitness.y, liveWitness.z);
      immanentWitness.group.rotation.set(
        liveWitness.reciprocalBowRad + witnessCommunionGlowImpulse * 0.16,
        liveWitness.headingYawRad,
        0,
      );
      immanentWitness.group.scale.setScalar(liveWitness.scaleMultiplier);
      immanentWitness.outerGimbalGroup.rotation.y =
        liveWitness.gimbalOuterSpinRad *
        liveSteering.witnessGimbalCadenceScale *
        (1 + witnessCommunionGlowImpulse * 0.65);
      immanentWitness.innerGimbalGroup.rotation.x = liveWitness.gimbalInnerTiltRad;
      immanentWitness.quartzCoreMesh.rotation.y =
        -elapsed * 0.9 * liveSteering.witnessGimbalCadenceScale;
      immanentWitness.primeSpokeArmsGroup.rotation.y =
        elapsed * 0.36 * spinMult * liveSteering.witnessGimbalCadenceScale;
      immanentWitness.apicalStarFinialMesh.rotation.y = -elapsed * 0.72 * spinMult;
      _tempColor.set(liveSteering.witnessAuraColorHex);
      immanentWitness.coreMaterial.emissive.lerp(_tempColor, Math.min(1, dt * 4.5));
      immanentWitness.coreMaterial.emissiveIntensity =
        liveWitness.coreLuminance + witnessCommunionGlowImpulse * 0.85;
      witnessContactShadow.position.set(liveWitness.x, liveWitness.groundY + 0.018, liveWitness.z);

      // Synchronize Web Audio Soundscape Engine with Universal Neuromorphic Bus
      soundEngine.syncWithNeuromorphicBus(neuromorphicState);

      const frameDiurnal = evaluateDiurnalProfile(
        atmosphereRef.current,
        biomeAt(player.x, player.z, liveCosmo.worldTopology),
        player.harmony,
      );
      const meadowSpin = spinMult * (1 + landmarkResonance.meadow * 0.95);
      // Meadow Sundial: Wind-driven 3-cup anemometer and spinning pyrite crystal
      meadowMonument.sunOrbPivot.rotation.y =
        frameDiurnal.sunAzimuthRad +
        elapsed * 0.25 * meadowSpin +
        monumentMechanics.meadow.anemometerAngularRateRadPerSec * 0.35;
      meadowMonument.sunOrb.rotation.y = monumentMechanics.meadow.sunCrystalSpinY;

      // Grove Pergola: Compound pendulums obeying Galileo/Newton law omega_i = sqrt(g / L_eff,i) + central clapper
      for (let c = 0; c < groveMonument.chimeTubes.length; c++) {
        groveMonument.chimeTubes[c].rotation.x = monumentMechanics.grove.chimePitchX[c];
        groveMonument.chimeTubes[c].rotation.z = monumentMechanics.grove.chimeRollZ[c];
      }
      groveMonument.clapperPivot.rotation.x = monumentMechanics.grove.clapperPitchX;
      groveMonument.clapperPivot.rotation.z = monumentMechanics.grove.clapperRollZ;

      // Crystal Archway: Hookean torsion pendulum filament + 2D pendulum sway (zero gap, zero skewering)
      const crystalRes = landmarkResonance.crystal;
      crystalMonument.corePrism.position.y = crystalSpec.corePrismElevationY;
      crystalMonument.corePrism.rotation.y = monumentMechanics.crystal.torsionYawRad;
      crystalMonument.corePrism.rotation.x = monumentMechanics.crystal.pendulumPitchX;
      crystalMonument.corePrism.rotation.z = monumentMechanics.crystal.pendulumRollZ;
      crystalMonument.quartzMat.emissiveIntensity = 0.5 + inorgGlow * 0.38 + crystalRes * 0.65;
      const liveFidelity =
        neuromorphicState.observer.canonicalStandardModelsContext.multiModalFidelity;
      sharedCrystalMat.iridescenceThicknessMaximum = 220 + liveFidelity.airyThinFilmSpanNm;
      crystalMonument.quartzMat.iridescenceThicknessMaximum =
        240 + liveFidelity.airyThinFilmSpanNm;

      const activeSynapticWeight = neuromorphicState.lastActiveSynapticWeight;
      const directives = neuromorphicState.refinementDirectives;

      // Universal Neuromorphic Infrastructure Self-Refinement + Granular Crystal-Lattice Optical Modality
      const granularModals = environmentalAgencyState.granularSynthesis.modalSyntheses;
      renderer.toneMappingExposure = THREE.MathUtils.damp(
        renderer.toneMappingExposure,
        directives.infrastructure.toneMappingExposure,
        2.5,
        dt,
      );
      terrainMat.bumpScale = THREE.MathUtils.damp(
        terrainMat.bumpScale,
        directives.infrastructure.microReliefBumpScale *
          (granularModals.opticalModality.crystalLatticeMicroReliefBumpScale / 0.048),
        2.5,
        dt,
      );
      const activeSporeLimit = Math.max(
        120,
        Math.min(
          PARTICLE_COUNT,
          Math.round(PARTICLE_COUNT * directives.infrastructure.activeSporePoolRatio),
        ),
      );
      if (particleMesh.count !== activeSporeLimit) {
        particleMesh.count = activeSporeLimit;
      }

      // Coupled Neuromorphic Cymatics on the Wetland Mirror Lagoon & Meniscus Rings (`Foundation.Physics.V1.Model`)
      const centerCymatics = computeNeuromorphicCymatics({
        localX: 0,
        localZ: 0,
        elapsedSeconds: elapsed,
        rule30Byte: activeRule30Byte,
        icosianRootIndex: activeIcosianRoot,
        synapticWeight: activeSynapticWeight,
      });
      lagoonMesh.position.y =
        liveCosmo.worldTopology.lagoonWaterSurfaceY +
        centerCymatics.waveDisplacementY * 0.45 * directives.physics.cymaticWaveCoherence;
      lagoonMat.emissiveIntensity = 0.18 + centerCymatics.meniscusPulseFactor * 0.16;

      for (let mIdx = 0; mIdx < wetlandMeniscusRings.length; mIdx++) {
        const mr = wetlandMeniscusRings[mIdx];
        const ringCymatics = computeNeuromorphicCymatics({
          localX: mr.radius,
          localZ: 0,
          elapsedSeconds: elapsed + mIdx * 0.4,
          rule30Byte: activeRule30Byte,
          icosianRootIndex: activeIcosianRoot,
          synapticWeight: activeSynapticWeight,
        });
        const barkBandEnergy = soundEngine.spectrumBands[(mIdx * 3) % 16] ?? 0.16;
        mr.mesh.position.y =
          liveCosmo.worldTopology.lagoonWaterSurfaceY +
          0.012 +
          ringCymatics.waveDisplacementY +
          barkBandEnergy * 0.014;
        mr.mesh.scale.setScalar(1 + ringCymatics.waveDisplacementY * 1.4 + barkBandEnergy * 0.08);
        mr.mat.opacity = Math.min(
          0.68,
          0.22 + ringCymatics.meniscusPulseFactor * 0.22 + barkBandEnergy * 0.18,
        );
      }

      const wetlandRes = landmarkResonance.wetland;
      for (let l = 0; l < wetlandMonument.lanternOrbs.length; l++) {
        const pulse = monumentMechanics.wetland.orbBioluminescentPulse[l] ?? 1.0;
        wetlandMonument.lanternOrbs[l].position.y = wetlandSpec.orbCenterY;
        wetlandMonument.lanternOrbs[l].rotation.y = elapsed * (0.8 + wetlandRes * 0.6) + l;
        wetlandMonument.lanternOrbs[l].scale.setScalar(0.92 + 0.16 * pulse);
      }
      wetlandMonument.lanternMat.emissiveIntensity = 0.78 + inorgGlow * 0.42 + wetlandRes * 0.75;

      // Dynamically couple Biome Landmark PointLights to live monument positions, diurnal dusk glow & Landmark Resonance
      const duskGlowFactor =
        atmosphereRef.current === 'starlight'
          ? 1.28
          : atmosphereRef.current === 'twilight'
            ? 1.15
            : 0.92;
      sanctuaryPointLight.position.set(
        sanctuaryMonument.group.position.x,
        sanctuaryMonument.group.position.y + 5.4 * dampedScale,
        sanctuaryMonument.group.position.z,
      );
      sanctuaryPointLight.intensity = (2.8 + sanctRes * 1.9 + inorgGlow * 0.6) * duskGlowFactor;
      crystalPointLight.position.set(
        crystalMonument.group.position.x,
        crystalMonument.group.position.y + 4.2 * dampedScale,
        crystalMonument.group.position.z,
      );
      crystalPointLight.intensity = (2.1 + crystalRes * 1.8 + inorgGlow * 0.5) * duskGlowFactor;
      wetlandPointLight.position.set(
        wetlandMonument.group.position.x,
        MIRROR_LAGOON_WATER_SURFACE_Y + 3.1 * dampedScale,
        wetlandMonument.group.position.z,
      );
      wetlandPointLight.intensity = (1.9 + wetlandRes * 1.7 + inorgGlow * 0.5) * duskGlowFactor;

      // Dynamically illuminate Chladni Standing-Wave Terraces when inhabited or resonated (`evaluateStandingWaveTerraceResonance`)
      const terraceEval = evaluateStandingWaveTerraceResonance({
        playerX: player.x,
        playerZ: player.z,
        landmarkCentersXZ: getLandmarkCentersXZ(),
        resonanceState: landmarkResonance,
        isStillness: player.action === 'stillness',
        isAttuningOrTouching: player.action === 'attune' || player.action === 'touch',
        elapsedSeconds: elapsed,
        busWeight: activeSynapticWeight,
      });
      labyrinthMat.opacity = terraceEval.sanctuaryOpacity;
      meadowParterreMat.opacity = terraceEval.meadowOpacity;
      zenRingMat.opacity = terraceEval.groveOpacity;
      hexFacetMat.opacity = terraceEval.crystalFacetOpacity;
      crystalDiscMat.emissiveIntensity = terraceEval.crystalDiscEmissiveIntensity;

      // Animate 5 Terpene Tyndall Resonance Columns & Crown Halos anchored on each Biome Landmark
      const haloRefinementRatio = directives.infrastructure.constellationHaloOpacity / 0.28;
      for (let bIdx = 0; bIdx < biomeConstellationBeams.length; bIdx++) {
        const bc = biomeConstellationBeams[bIdx];
        let totalInB = 0;
        let attunedInB = 0;
        let terpeneSumInB = 0;
        for (let pIdx = 0; pIdx < plantMeshes.length; pIdx++) {
          const inst = plantMeshes[pIdx].instance;
          if (inst.biome === bc.biome) {
            totalInB++;
            if (inst.attuned) attunedInB++;
            terpeneSumInB += inst.volatileTerpeneCharge ?? 0;
          }
        }
        const ratio = totalInB > 0 ? attunedInB / totalInB : 0;
        const meanTerpene = totalInB > 0 ? terpeneSumInB / totalInB : 0;
        const lmkCharge = landmarkResonance[bc.biome];
        const pulse = 0.85 + Math.sin(elapsed * 2.0 + bIdx) * 0.15;
        bc.beamMat.opacity = Math.min(
          0.52,
          (0.04 + ratio * 0.18 + meanTerpene * 0.12 + lmkCharge * 0.14) * pulse * haloRefinementRatio,
        );
        bc.crownMat.opacity = Math.min(
          0.92,
          (0.14 + ratio * 0.52 + meanTerpene * 0.16 + lmkCharge * 0.24) * pulse * haloRefinementRatio,
        );
        bc.crownMesh.rotation.y = elapsed * (0.35 + ratio * 0.7 + lmkCharge * 0.55);
      }

      // Animate Expanding Acoustic Ground Wave Rings constrained by local terrain normals & medium dispersion (`evaluateGroundWavePropagation`)
      for (let i = 0; i < WAVE_RING_COUNT; i++) {
        const ring = waveRings[i];
        if (!ring.active) continue;
        ring.age += dt;
        if (ring.age < 0) continue;
        if (ring.age > 1.7) {
          ring.active = false;
          ring.mesh.visible = false;
          continue;
        }
        const waveProp = evaluateGroundWavePropagation({
          x: ring.originX,
          z: ring.originZ,
          ageSec: ring.age,
          maxAgeSec: 1.7,
          colliders: gardenColliders,
        });
        ring.mesh.position.set(
          ring.originX,
          waveProp.elevationY + (i % 3) * 0.004,
          ring.originZ,
        );
        ring.mesh.rotation.set(
          -Math.PI / 2 + waveProp.surfaceTiltX,
          0,
          waveProp.surfaceTiltZ,
        );
        ring.mesh.scale.setScalar(waveProp.scaleMultiplier);
        ring.mat.opacity = waveProp.opacity;
      }

      // Animate 9-Segment Parabolic Sympathetic Cross-Pollination Filaments & Traveling Action-Potential Wavefront
      for (let i = 0; i < FILAMENT_COUNT; i++) {
        const f = filaments[i];
        if (!f.active) continue;
        f.age += dt;
        if (f.age > 2.2) {
          f.active = false;
          f.group.visible = false;
          continue;
        }
        const arc = computeSympatheticParabolicArc({
          x1: f.x1,
          y1: f.y1,
          z1: f.z1,
          x2: f.x2,
          y2: f.y2,
          z2: f.z2,
          elapsedSinceTriggerSec: f.age,
          segments: PARABOLIC_SEGMENTS,
          colliders: gardenColliders,
          topology: liveCosmo.worldTopology,
        });
        f.wavefrontOrb.position.set(
          arc.wavefrontPosition[0],
          arc.wavefrontPosition[1],
          arc.wavefrontPosition[2],
        );
        f.wavefrontOrb.rotation.y = elapsed * 4.5;
        if (arc.hasArrivedAtTarget && !f.arrivalTriggered && f.targetPlantId) {
          f.arrivalTriggered = true;
          const targetRec = plantMeshes.find((m) => m.instance.id === f.targetPlantId);
          if (targetRec) {
            targetRec.instance.volatileTerpeneCharge = 1.0;
            targetRec.tactileShiverImpulse = Math.max(targetRec.tactileShiverImpulse, 0.55);
          }
        }
        const progress = f.age / 2.2;
        f.mat.opacity = Math.sin((1 - progress) * Math.PI * 0.5) * 0.84;
      }

      // Animate 128 Bamboo & Crystal Canopy Foliage Crowns (`evaluateCanopyWindShear`, attached to 3D trunk axes)
      for (let i = 0; i < canopyCount; i++) {
        const shear = evaluateCanopyWindShear({
          x: canopyX[i],
          z: canopyZ[i],
          heightMeters: canopyY[i],
          tier: canopyTier[i],
          elapsedSeconds: elapsed,
          rule30Byte: activeRule30Byte,
          synapticWeight: activeSynapticWeight,
        });
        _dummyPos.set(canopyX[i], canopyY[i], canopyZ[i]);
        _dummyEuler.set(
          canopyBaseTiltX[i] + shear.pitchRad,
          i * 1.1 + shear.yawFlutterRad,
          canopyBaseTiltZ[i] + shear.rollRad,
        );
        _dummyQuat.setFromEuler(_dummyEuler);
        const s = canopyScale[i];
        _dummyScale.set(s, 0.75, s);
        _dummyMatrix.compose(_dummyPos, _dummyQuat, _dummyScale);
        canopyInstanced.setMatrixAt(i, _dummyMatrix);
      }
      canopyInstanced.instanceMatrix.needsUpdate = true;

      // Evaluate the player's current 3D gaze-cone focal specimen (`Foundation.Humane.V1.Model::FocalGazeSelectionPolicy`)
      const nearestForSpores = findNearestPlant(
        player.x,
        player.z,
        plantsRef.current,
        player.yaw,
        player.pitch,
      );

      // Animate Plant Clusters via `computePlantMorphology`, `evaluateBiogeochemistry`,
      // `evaluateCircadianPlantPhysiology`, `stepKuramotoPhaseEntrainment` & `computeSpeciesArticulation`
      for (let i = 0; i < plantMeshes.length; i++) {
        const pm = plantMeshes[i];
        const dMeters = Math.hypot(player.x - pm.instance.x, player.z - pm.instance.z);
        const proxDm = Math.min(100, Math.round(dMeters * 3.5));

        if ((pm.instance.volatileTerpeneCharge ?? 0) > 0.002) {
          pm.instance.volatileTerpeneCharge = Math.max(
            0,
            (pm.instance.volatileTerpeneCharge ?? 0) * Math.exp(-0.42 * dt),
          );
        } else {
          pm.instance.volatileTerpeneCharge = 0;
        }

        // Kuramoto Coupled Oscillator Phase Entrainment among attuned neighboring flora within 14m
        if (pm.instance.attuned) {
          const nbPhases: number[] = [];
          for (let j = 0; j < plantMeshes.length; j++) {
            if (j === i) continue;
            const other = plantMeshes[j];
            if (
              other.instance.attuned &&
              Math.hypot(other.instance.x - pm.instance.x, other.instance.z - pm.instance.z) <= 14.0
            ) {
              nbPhases.push(other.pulsePhase);
            }
          }
          if (nbPhases.length > 0) {
            const kuramoto = stepKuramotoPhaseEntrainment({
              currentPhase: pm.pulsePhase,
              neighborPhases: nbPhases,
              couplingStrengthPerSec: 0.85 * directives.botany.kuramotoCouplingMultiplier,
              dt,
            });
            pm.pulsePhase = kuramoto.nextPhase;
          }
        }

        const plantStage = getPlantLifecycleStage(pm.instance);
        const biochem = evaluateBiogeochemistry({
          biome: pm.instance.biome,
          species: pm.instance.species,
          substrate: pm.instance.substrate ?? 'terrestrial-loam',
          atmosphere: atmosphereRef.current,
          attuned: pm.instance.attuned,
          lifecycleStage: plantStage,
          neuromorphicWeight: activeSynapticWeight,
          volatileTerpeneImpulse: pm.instance.volatileTerpeneCharge ?? 0,
        });
        const circadian = evaluateCircadianPlantPhysiology({
          species: pm.instance.species,
          atmosphere: atmosphereRef.current,
          substrate: pm.instance.substrate ?? 'terrestrial-loam',
          attuned: pm.instance.attuned,
          lifecycleStage: plantStage,
        });

        const isBeckoningSpecimen =
          pm.instance.id === environmentalAgencyState.beckoningPlantId;
        const morph = computePlantMorphology({
          baseScale: pm.instance.scale,
          attuned: pm.instance.attuned,
          proximityDm: proxDm,
          atmosphere: atmosphereRef.current,
          elapsedSeconds: elapsed,
          pulsePhase: pm.pulsePhase,
          surfaceTiltX: pm.instance.surfaceTiltX ?? 0,
          surfaceTiltZ: pm.instance.surfaceTiltZ ?? 0,
          biogeochemicalGlowBoost:
            biochem.luciferinOxidationRate * 0.42 + biochem.volatileTerpenePlume * 0.35,
          plantX: pm.instance.x,
          plantZ: pm.instance.z,
          playerX: player.x,
          playerZ: player.z,
          isBeckoningSpecimen,
        });
        if (pm.tactileShiverImpulse > 0.001) {
          pm.tactileShiverImpulse = Math.max(0, pm.tactileShiverImpulse * Math.exp(-4.5 * dt));
        } else {
          pm.tactileShiverImpulse = 0;
        }
        const art = computeSpeciesArticulation({
          species: pm.instance.species,
          attuned: pm.instance.attuned,
          proximityDm: proxDm,
          elapsedSeconds: elapsed,
          pulsePhase: pm.pulsePhase,
          tactileShiverImpulse: pm.tactileShiverImpulse,
          neuromorphicSynapticWeight: activeSynapticWeight,
        });

        // Advected wind + physical player-brush deflection + gravitropic, phototropic & reciprocal greeting orientation
        const windAtPlant = evaluateWindField(
          pm.instance.x,
          pm.instance.z,
          elapsed,
          activeRule30Byte,
          activeIcosianRoot,
        );
        const brushDeflect =
          dMeters < 1.35 && dMeters > 0.01 ? ((1.35 - dMeters) / 1.35) * 0.22 : 0;
        pm.group.rotation.z =
          morph.swayAngleRad +
          windAtPlant.windTiltZ * 0.4 +
          brushDeflect +
          morph.gravitropicCounterTiltZ +
          morph.phototropicLeanZ +
          morph.reciprocalGreetingLeanZ;
        pm.group.rotation.x =
          windAtPlant.windTiltX * 0.4 +
          morph.gravitropicCounterTiltX +
          morph.phototropicLeanX +
          morph.reciprocalGreetingLeanX;
        const lifecycleSpec = BOTANICAL_LIFECYCLE_STAGES[plantStage];
        const liveOrganicMult =
          1 + Math.max(-0.08, (liveCosmo.organicRealm.organogenesisScaleMultiplier - 1) * 0.45);
        const fvcbVigorMult =
          0.96 + (liveFidelity.fvcbRubiscoAssimilationMultiplier - 1.0) * 0.22;
        pm.group.scale.setScalar(
          morph.scaleFactor *
            (0.85 + lifecycleSpec.morphologicalScaleMultiplier * 0.15) *
            liveOrganicMult *
            fvcbVigorMult,
        );
        const isFocalObservedSpecimen =
          nearestForSpores.inForwardGazeCone && pm.instance.id === nearestForSpores.plant.id;
        for (const mat of pm.emissiveMaterials) {
          mat.emissiveIntensity =
            (morph.emissiveIntensity +
              directives.botany.emissiveBloomBoost +
              (isFocalObservedSpecimen ? 0.22 : 0)) *
            lifecycleSpec.emissiveMultiplier;
        }
        (pm.haloRing.material as THREE.MeshBasicMaterial).opacity = Math.min(
          0.95,
          morph.haloOpacity + (isFocalObservedSpecimen ? 0.26 : 0),
        );

        // Animate Stage 3 Fruiting Crown & Stage 4 Mycelial Elder Halo (`Foundation.Soundtrack.V1.Model`)
        if (pm.fruitingCrown.visible) {
          pm.fruitingCrown.rotation.y = elapsed * 0.95 + i * 0.5;
          pm.fruitingCrown.position.y = pm.stemApexY + Math.sin(elapsed * 2.2 + i) * 0.015;
        }
        if (pm.elderHaloRing.visible) {
          pm.elderHaloRing.rotation.z = -elapsed * 0.45 + i;
        }

        // Evaluate 3-Joint Articulated Kinematic Rig & Blender-Style Shape-Key Morph Target Weights (`evaluateKinematicRigPose`)
        const rigPose = evaluateKinematicRigPose({
          species: pm.instance.species,
          attuned: pm.instance.attuned,
          lifecycleStage: plantStage,
          elapsedSeconds: elapsed,
          pulsePhase: pm.pulsePhase,
          proximityDm: proxDm,
          tactileShiverImpulse: pm.tactileShiverImpulse,
          windTiltX: windAtPlant.windTiltX,
          windTiltZ: windAtPlant.windTiltZ,
          neuromorphicSynapticWeight: activeSynapticWeight,
          circadianApertureBoost: circadian.corollaApertureBoost,
        });

        pm.basalJoint.rotation.x = rigPose.basalJointPitchRad * 0.45;
        pm.basalJoint.rotation.z = rigPose.basalJointRollRad * 0.45;
        pm.medialJoint.rotation.x = rigPose.medialJointPitchRad * 0.55;
        pm.medialJoint.rotation.z = rigPose.medialJointRollRad * 0.55;
        pm.apicalJoint.rotation.x = rigPose.apicalJointPitchRad * 0.65;
        pm.apicalJoint.rotation.z = rigPose.apicalJointRollRad * 0.65;
        pm.apicalJoint.rotation.y = rigPose.apicalTorsionYawRad;

        for (let mIdx = 0; mIdx < pm.morphMeshes.length; mIdx++) {
          const mMesh = pm.morphMeshes[mIdx];
          if (mMesh.morphTargetInfluences) {
            mMesh.morphTargetInfluences[0] = rigPose.morphBloomOpenWeight;
            mMesh.morphTargetInfluences[1] = rigPose.morphAcousticRippleWeight;
          }
        }

        if (pm.shaderUniforms) {
          pm.shaderUniforms.uTime.value = elapsed + pm.pulsePhase;
          pm.shaderUniforms.uResonancePulse.value = rigPose.morphAcousticRippleWeight;
          pm.shaderUniforms.uSupraDefinition.value =
            neuromorphicState.observer.supraDirective.tier / 4;
          pm.shaderUniforms.uAperiodicShimmer.value = Math.min(
            1,
            neuromorphicState.observer.rule30Horizon.aperiodicCompensationIndex / 255,
          );
        }

        // Species-specific anatomical articulation (`Foundation.Articulation.V1.Model` + Lifecycle + Circadian Turgor)
        const corollaOpen = Math.max(
          0,
          Math.min(1.15, lifecycleSpec.corollaOpenFactor + circadian.corollaApertureBoost),
        );
        if (pm.bellMeshes.length > 0) {
          for (let b = 0; b < pm.bellMeshes.length; b++) {
            pm.bellMeshes[b].rotation.z =
              (art.bellSwingRad + rigPose.stamenPendulumSwingRad * 0.35) *
              (0.65 + corollaOpen * 0.5) *
              (b % 2 === 0 ? 1 : -1);
          }
        }
        if (pm.croziers.length > 0) {
          pm.croziers[0].rotation.z = art.crozierSpinRad;
          if (pm.croziers[1]) pm.croziers[1].rotation.z = -art.crozierSpinRad * 1.25;
          for (let f = 0; f < pm.fronds.length; f++) {
            pm.fronds[f].rotation.x =
              0.32 + corollaOpen * 0.18 + (f % 3) * 0.08 + art.frondBreathRad + brushDeflect * 0.6;
          }
        }
        if (pm.outerPetals.length > 0) {
          // Keep floating echo-lotus lily pad hydrostatic with the lagoon water surface
          pm.group.position.y =
            pm.baseY + Math.max(-0.008, Math.min(0.008, art.buoyancyOffsetM * 0.22));
          for (let p = 0; p < pm.outerPetals.length; p++) {
            pm.outerPetals[p].rotation.x =
              0.42 + rigPose.petalUnfurlAngleRad * 0.5 + art.petalOpenRad + brushDeflect * 0.5;
          }
        }
        if (pm.cushions.length > 0) {
          // Permeable moss cushions gently compress when stepped over; capsules remain physically attached to seta stalk tips
          const stepCompression = dMeters < 0.95 ? 1 - (1 - dMeters / 0.95) * 0.22 : 1;
          const setaStretch =
            1 + Math.max(-0.08, Math.min(0.12, art.capsuleHoverOffsetM * 0.75));
          for (let c = 0; c < pm.cushions.length; c++) {
            pm.cushions[c].scale.set(
              art.cushionPulseScale,
              0.52 * stepCompression,
              art.cushionPulseScale,
            );
          }
          for (let cap = 0; cap < pm.capsules.length; cap++) {
            const cushionY = 0.11 + cap * 0.035;
            const stalkLocalY = cushionY + 0.02 - 0.12;
            const stretchedLen = 0.54 * setaStretch;
            if (pm.stalks[cap]) {
              pm.stalks[cap].scale.set(1, setaStretch, 1);
            }
            pm.capsules[cap].position.y = stalkLocalY + stretchedLen;
          }
        }
        if (pm.starHead) {
          pm.starHead.rotation.z = art.starHeadRollRad;
        }
      }

      const playerSpeedMps = player.velocityDm / 2.2;
      const playerVX = -Math.sin(player.yaw) * playerSpeedMps;
      const playerVZ = -Math.cos(player.yaw) * playerSpeedMps;
      const attractorTerpene =
        (nearestForSpores.plant.volatileTerpeneCharge ?? 0) +
        (nearestForSpores.plant.attuned ? 0.55 : 0.08);

      // Animate 360 Permeable Meadow Grass & Reed Blades (`computeFoliageDeflection` Hooke's law + slipstream wake + wind)
      for (let i = 0; i < GRASS_COUNT; i++) {
        if (grassValid[i] === 0) continue;
        const gx = grassX[i];
        const gz = grassZ[i];
        const deflect = computeFoliageDeflection({
          bladeX: gx,
          bladeZ: gz,
          playerX: player.x,
          playerZ: player.z,
          elapsedSeconds: elapsed,
          playerVX,
          playerVZ,
          witnessX: liveWitness.x,
          witnessZ: liveWitness.z,
          witnessVX,
          witnessVZ,
          rule30Byte: activeRule30Byte,
          synapticWeight: activeSynapticWeight,
        });
        _dummyPos.set(gx, grassY[i], gz);
        _dummyEuler.set(deflect.tiltXRad, grassYaw[i], deflect.tiltZRad);
        _dummyQuat.setFromEuler(_dummyEuler);
        _dummyScale.set(
          1,
          grassHScale[i] * liveCosmo.organicRealm.turfBladeHeightMultiplier,
          1,
        );
        _dummyMatrix.compose(_dummyPos, _dummyQuat, _dummyScale);
        grassInstanced.setMatrixAt(i, _dummyMatrix);
      }
      grassInstanced.instanceMatrix.needsUpdate = true;

      // Update Pooled Bioluminescent Spores (`stepSporeFluidDynamics` + Symbiotic Environmental Invitation Stream)
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        // When `sporeInvitationToPlayer` is active, every 3rd spore streams from the beckoning blossom toward the player
        const streamToPlayer =
          environmentalAgencyState.sporeInvitationToPlayer && i % 3 === 0;
        const attrX = streamToPlayer
          ? environmentalAgencyState.sporeStreamTargetPosition[0]
          : nearestForSpores.plant.x;
        const attrY = streamToPlayer
          ? environmentalAgencyState.sporeStreamTargetPosition[1]
          : nearestForSpores.plant.y;
        const attrZ = streamToPlayer
          ? environmentalAgencyState.sporeStreamTargetPosition[2]
          : nearestForSpores.plant.z;
        const fluidStep = stepSporeFluidDynamics({
          x: pX[i],
          y: pY[i],
          z: pZ[i],
          vx: pVX[i],
          vy: pVY[i],
          vz: pVZ[i],
          playerX: player.x,
          playerZ: player.z,
          playerVX,
          playerVZ,
          attractorX: attrX,
          attractorY: attrY,
          attractorZ: attrZ,
          attractorTerpeneStrength: Math.min(
            1,
            (streamToPlayer ? 0.65 : attractorTerpene) *
              directives.physics.chemotacticSporeAttractionMultiplier *
              granularModals.physicalModality.sporeStokesBuoyancyLiftMultiplier,
          ),
          atmosphere: atmosphereRef.current,
          elapsedSeconds: elapsed,
          rule30Byte: activeRule30Byte,
          synapticWeight: activeSynapticWeight,
          colliders: gardenColliders,
          dt,
        });
        pX[i] = fluidStep.x;
        pY[i] = fluidStep.y;
        pZ[i] = fluidStep.z;
        pVX[i] = fluidStep.vx;
        pVY[i] = fluidStep.vy;
        pVZ[i] = fluidStep.vz;
        pScale[i] = Math.max(0.45, pScale[i] - dt * 0.32);

        const floorY = groundHeightAt(pX[i], pZ[i]);
        if (pY[i] > floorY + 7.5 || Math.hypot(pX[i] - player.x, pZ[i] - player.z) > 48) {
          const angle = (i / PARTICLE_COUNT) * Math.PI * 2 + elapsed * 0.2;
          const rad = 3.5 + (i % 28);
          pX[i] = player.x + Math.cos(angle) * rad;
          pZ[i] = player.z + Math.sin(angle) * rad;
          pY[i] = groundHeightAt(pX[i], pZ[i]) + 0.3;
          pVX[i] = Math.sin(i + elapsed) * 0.22;
          pVY[i] = 0.24 + (i % 4) * 0.08;
          pVZ[i] = Math.cos(i + elapsed) * 0.22;
          pScale[i] = 0.65;
        }

        _dummyPos.set(pX[i], pY[i], pZ[i]);
        _dummyEuler.set(elapsed + i, elapsed * 0.5, 0);
        _dummyQuat.setFromEuler(_dummyEuler);
        _dummyScale.setScalar(pScale[i]);
        _dummyMatrix.compose(_dummyPos, _dummyQuat, _dummyScale);
        particleMesh.setMatrixAt(i, _dummyMatrix);
      }
      particleMesh.instanceMatrix.needsUpdate = true;

      if (currentState === 'title') {
        const tourAngle = elapsed * 0.14;
        const camX = Math.sin(tourAngle) * 7.5;
        const camZ = -4.0 - Math.cos(tourAngle * 0.5) * 6.0;
        const camY = groundHeightAt(camX, camZ) + 2.6;
        camera.position.set(camX, camY, camZ);
        camera.lookAt(0, groundHeightAt(0, -28) + 2.2, -28);
      } else if (currentState === 'playing') {
        let moveForward = 0;
        let moveStrafe = 0;
        let turnYaw = 0;

        if (keysPressed.has('KeyW') || keysPressed.has('ArrowUp')) moveForward += 1;
        if (keysPressed.has('KeyS') || keysPressed.has('ArrowDown')) moveForward -= 1;
        if (keysPressed.has('KeyA')) moveStrafe -= 1;
        if (keysPressed.has('KeyD')) moveStrafe += 1;
        if (keysPressed.has('KeyQ') || keysPressed.has('ArrowLeft')) turnYaw += 1;
        if (keysPressed.has('KeyE') || keysPressed.has('ArrowRight')) turnYaw -= 1;

        if (moveForward !== 0 || moveStrafe !== 0) {
          player.guidedStroll = false;
        }

        if (turnYaw !== 0) {
          player.yaw += turnYaw * 1.65 * dt;
        }

        let isMoving = false;
        let speedMetersPerSec = 0;

        const activePlayerModel = neuromorphicState.observer.cosmogenesis.playerRealm;

        if (player.guidedStroll) {
          const wp = SANCTUARY_TRAIL_WAYPOINTS[player.trailIndex % SANCTUARY_TRAIL_WAYPOINTS.length];
          const dx = wp.x - player.x;
          const dz = wp.z - player.z;
          const distToWp = Math.hypot(dx, dz);
          if (distToWp < 2.2) {
            player.trailIndex = (player.trailIndex + 1) % SANCTUARY_TRAIL_WAYPOINTS.length;
          } else {
            const desiredYaw = Math.atan2(-dx, -dz);
            const yawDiff = Math.atan2(
              Math.sin(desiredYaw - player.yaw),
              Math.cos(desiredYaw - player.yaw),
            );
            player.yaw += yawDiff * Math.min(1, dt * 2.8);
            const stepRes = resolvePlayerPhysicsStep({
              currentX: player.x,
              currentZ: player.z,
              moveDirX: dx / distToWp,
              moveDirZ: dz / distToWp,
              baseSpeedMps: activePlayerModel.guidedStrollSpeedMps,
              dt,
              colliders: gardenColliders,
              playerModel: activePlayerModel,
            });
            player.x = stepRes.x;
            player.z = stepRes.z;
            player.y = stepRes.y;
            player.surfaceMaterial = stepRes.surfaceMaterial;
            player.inWater = stepRes.inWater;
            player.waterDepthMeters = stepRes.waterDepthMeters;
            player.slopeGradePct = stepRes.slopeGradePct;
            player.obstructedBy = stepRes.obstructedBy;
            speedMetersPerSec = stepRes.effectiveSpeedMps;
            isMoving = true;
          }
        } else {
          _forward.set(-Math.sin(player.yaw), 0, -Math.cos(player.yaw)).normalize();
          _right.set(Math.cos(player.yaw), 0, -Math.sin(player.yaw)).normalize();

          _moveVec.set(0, 0, 0);
          _moveVec.addScaledVector(_forward, moveForward);
          _moveVec.addScaledVector(_right, moveStrafe);

          isMoving = _moveVec.lengthSq() > 0.01;
          // Symbiotic Zephyr Wayfinding Current + Granular Terpene Chemotactic Conductivity
          const zephyrCond = granularModals.kinestheticModality.chemotacticZephyrConductivity;
          const dirX = isMoving
            ? _moveVec.x + environmentalAgencyState.playerZephyrAccelX * 0.12 * zephyrCond
            : 0;
          const dirZ = isMoving
            ? _moveVec.z + environmentalAgencyState.playerZephyrAccelZ * 0.12 * zephyrCond
            : 0;
          const stepRes = resolvePlayerPhysicsStep({
            currentX: player.x,
            currentZ: player.z,
            moveDirX: dirX,
            moveDirZ: dirZ,
            baseSpeedMps: isMoving ? activePlayerModel.baseWalkSpeedMps : 0,
            dt,
            colliders: gardenColliders,
            playerModel: activePlayerModel,
          });
          player.x = stepRes.x;
          player.z = stepRes.z;
          player.y = stepRes.y;
          player.surfaceMaterial = stepRes.surfaceMaterial;
          player.inWater = stepRes.inWater;
          player.waterDepthMeters = stepRes.waterDepthMeters;
          player.slopeGradePct = stepRes.slopeGradePct;
          player.obstructedBy = stepRes.obstructedBy;
          speedMetersPerSec = stepRes.effectiveSpeedMps;
          if (isMoving && turnYaw === 0 && !isPointerDragging) {
            player.yaw += environmentalAgencyState.cameraHorizonWhisperYawRad * dt;
          }
        }

        // Update Grounded Parametric Player/User Co-Observer Harmonic Locus Ring beneath player's feet
        if (activePlayerModel.coObserverLocusHarmonicNodes !== activePlayerLocusNodes) {
          activePlayerLocusNodes = activePlayerModel.coObserverLocusHarmonicNodes;
          const prevLocusGeo = playerLocusMesh.geometry;
          playerLocusMesh.geometry = createPlayerCoObserverLocusGeometry({
            innerRadius: activePlayerModel.coObserverLocusInnerRadiusMeters,
            outerRadius: activePlayerModel.coObserverLocusOuterRadiusMeters,
            harmonicNodeCount: activePlayerLocusNodes,
          });
          prevLocusGeo.dispose();
        }
        const locusGroundY = player.inWater
          ? liveCosmo.worldTopology.lagoonWaterSurfaceY + 0.02
          : groundHeightAt(player.x, player.z, liveCosmo.worldTopology) + 0.024;
        playerLocusMesh.position.set(player.x, locusGroundY, player.z);
        playerLocusMesh.rotation.y = elapsed * 0.28 + player.yaw * 0.35;
        playerLocusMesh.scale.setScalar(
          activePlayerModel.embodimentScaleMultiplier * (0.96 + Math.sin(elapsed * 1.9) * 0.04),
        );
        playerLocusMat.opacity = activePlayerModel.coObserverLocusLuminance;

        if (isMoving) {
          const stepDist = speedMetersPerSec * dt;
          player.walkDist += stepDist;
          player.velocityDm = Math.min(30, Math.round(speedMetersPerSec * 2.2));
          if (player.actionHoldTimer <= 0) {
            player.action = 'stroll';
          }
          // Interactive Piezo-Travertine Lithophone Waystones (`substrate-stepping-stones`):
          // Stepping onto a travertine flagstone along the trails rings a soft biome-tuned Just-Intonation chime
          const waystoneStep = evaluateLithophoneWaystoneStep(activeWaystoneIndex, {
            playerX: player.x,
            playerZ: player.z,
            isMoving: true,
            inWater: player.inWater,
            steppingStones: activeSteppingStones,
            busWeight: activeSynapticWeight,
          });
          activeWaystoneIndex = waystoneStep.nextStoneIndex;
          if (waystoneStep.triggered) {
            const waystoneBiome = biomeAt(
              waystoneStep.stoneX,
              waystoneStep.stoneZ,
              liveCosmo.worldTopology,
            );
            const stY = groundHeightAt(
              waystoneStep.stoneX,
              waystoneStep.stoneZ,
              liveCosmo.worldTopology,
            );
            soundEngine.playLithophoneWaystoneNote({
              biome: waystoneBiome,
              scaleDegreeRatio: waystoneStep.scaleDegreeRatio,
              coupling01: waystoneStep.coupling01,
              listenerX: player.x,
              listenerY: player.y + initialPlayerModel.eyeStatureMeters,
              listenerZ: player.z,
              listenerYaw: player.yaw,
              listenerPitch: player.pitch,
              stoneX: waystoneStep.stoneX,
              stoneY: stY,
              stoneZ: waystoneStep.stoneZ,
            });
            spawnFootstepRipple(waystoneStep.stoneX, stY + 0.02, waystoneStep.stoneZ, '#fde68a');
          }
          // Spawn tighter meniscus wake ripples when wading in permeable lagoon water (1.45m vs 2.8m)
          const rippleSpacing = player.inWater ? 1.45 : 2.8;
          if (player.walkDist - lastWaveFootstepDist >= rippleSpacing) {
            lastWaveFootstepDist = player.walkDist;
            const b = biomeAt(player.x, player.z, liveCosmo.worldTopology);
            const liveStepBiomeCfgs = synthesizeParametricBiomeConfigs({
              alphaSeed: liveCosmo.alphaSeed,
              manifold: neuromorphicState.universalManifold,
            });
            player.exploredBiomes.add(b);
            player.harmony = computeGardenHarmonyPct({
              plants: plantsRef.current,
              exploredBiomesCount: player.exploredBiomes.size,
            });
            spawnFootstepRipple(
              player.x,
              player.inWater
                ? liveCosmo.worldTopology.lagoonWaterSurfaceY + 0.015
                : groundHeightAt(player.x, player.z, liveCosmo.worldTopology),
              player.z,
              player.inWater ? '#5eead4' : liveStepBiomeCfgs[b].accentColor,
            );
            // Step neuromorphic `/5` Clifford Cl(0,6) basin memory when crossing a new spatial basin while strolling
            const currentBasin = computeCliffordBasinState(player.x, player.z, player.yaw);
            if (currentBasin !== neuromorphicState.lastBasinState) {
              const nearestWalk = findNearestPlant(
                player.x,
                player.z,
                plantsRef.current,
                player.yaw,
                player.pitch,
              );
              const walkTick = executeNeuromorphicSynthesisTick(neuromorphicState, {
                biome: b,
                species: nearestWalk.plant.species,
                atmosphere: atmosphereRef.current,
                action: 'stroll',
                outcome: player.lastOutcome,
                playerX: player.x,
                playerZ: player.z,
                playerYaw: player.yaw,
                existingPlants: plantsRef.current,
                colliders: gardenColliders,
                velocityDm: player.velocityDm,
                agitationPct: Math.round(gestureHoldState.agitationPct),
              });
              neuromorphicState = walkTick.nextState;
            }
          }
        } else {
          player.velocityDm = Math.max(0, Math.round(player.velocityDm * Math.exp(-8 * dt)));
          if (player.actionHoldTimer <= 0) {
            const b = biomeAt(player.x, player.z);
            player.action = b === 'sanctuary' && player.velocityDm === 0 ? 'stillness' : 'observe';
          }
        }

        // Step Sustained Gesture Hold & Refractory Cooldown State Machine (`Foundation.Humane.V1.Model`)
        const activeHeldGesture: HoldableGestureId | null =
          keysPressed.has('KeyC') || uiHeldGesture === 'stillness'
            ? 'stillness'
            : keysPressed.has('Space') || keysPressed.has('KeyF') || uiHeldGesture === 'attune'
              ? 'attune'
              : keysPressed.has('KeyT') || uiHeldGesture === 'touch'
                ? 'touch'
                : null;

        const holdStep = stepGestureHoldEnvelope(gestureHoldState, activeHeldGesture, dt);
        gestureHoldState = holdStep.nextState;
        if (activeHeldGesture === 'stillness') {
          player.action = 'stillness';
          player.actionHoldTimer = Math.max(player.actionHoldTimer, 0.5);
        }
        if (holdStep.sustainedPulseGesture) {
          performAction(holdStep.sustainedPulseGesture, true);
        }

        if (player.actionHoldTimer > 0) {
          player.actionHoldTimer = Math.max(0, player.actionHoldTimer - dt);
        }

        const currentBiome = biomeAt(player.x, player.z);
        player.exploredBiomes.add(currentBiome);
        const nearest = findNearestPlant(
          player.x,
          player.z,
          plantsRef.current,
          player.yaw,
          player.pitch,
        );
        const frameNearestLandmark = evaluateNearestSynthesizedLandmark({
          playerX: player.x,
          playerZ: player.z,
          playerYaw: player.yaw,
          landmarkCentersXZ: getLandmarkCentersXZ(),
          resonanceState: landmarkResonance,
          busWeight: neuromorphicState.lastActiveSynapticWeight,
        });
        landmarkResonance = stepLandmarkResonanceField(landmarkResonance, {
          nearestBiome: frameNearestLandmark.biome,
          inResonanceRange: frameNearestLandmark.inResonanceRange,
          isStillness: player.action === 'stillness',
          harmonyPct: player.harmony,
          dt,
        });

        // Inherent Gameplay Plasticity (`Foundation.Teleology.V1.Model`):
        // Neuromorphic synaptic consolidation (`w: 8 -> 16`) emerges automatically from discovering biomes,
        // unhurried strolling, stillness, and lingering near awakened flora or landmarks—zero manual controls.
        const autoPlasticityStep = stepAutonomousGameplayPlasticity(autonomousPlasticity, {
          exploredBiomesCount: player.exploredBiomes.size,
          velocityDm: player.velocityDm,
          isStillness: player.action === 'stillness',
          nearAwakenedFloraOrLandmark:
            (nearest.plant.attuned && nearest.distanceMeters <= 12) ||
            frameNearestLandmark.inResonanceRange,
          meanSynapticWeight:
            neuromorphicState.observer.canonicalStandardModelsContext.multiModalFidelity
              .meanSynapticWeight,
          dt,
        });
        autonomousPlasticity = autoPlasticityStep.nextState;
        if (autoPlasticityStep.shouldConsolidateCycle) {
          neuromorphicState = refinePrismModel(neuromorphicState, { cycles: 1 }).nextState;
          soundEngine.syncWithNeuromorphicBus(neuromorphicState);
          syncMultiModalFidelityVisuals();
        }
        const attunedCount = plantMeshes.filter((m) => m.instance.attuned).length;
        const chorusState: ChorusStateId =
          nearest.plant.attuned || attunedCount >= 5 ? 'awakened' : 'dormant';
        const reqStr = formatPrismRequest({
          biome: currentBiome,
          plant: nearest.plant.species,
          action: player.action,
          atmosphere: atmosphereRef.current,
          chorus: chorusState,
          proximity: nearest.proximityDm,
          velocity: player.velocityDm,
        });
        const decision = evaluatePrismRequest(reqStr);
        if (decision.valid) {
          player.lastRequest = reqStr;
          player.lastOutcome = decision.outcome as SoundscapeOutcome;
          player.lastRule = decision.rule;
          player.lastRuleDesc = decision.ruleDescription;
        }

        const acousticOcclusion = computeAcousticOcclusion(
          player.x,
          player.z,
          nearest.plant.x,
          nearest.plant.z,
          gardenColliders,
        );

        soundEngine.updateMovement({
          biome: currentBiome,
          atmosphere: atmosphereRef.current,
          harmony: player.harmony,
          velocityDm: player.velocityDm,
          proximityDm: nearest.proximityDm,
          totalDistanceMeters: player.walkDist,
          outcome: player.lastOutcome,
          elapsedSeconds: elapsed,
          playerX: player.x,
          playerY: player.y + initialPlayerModel.eyeStatureMeters,
          playerZ: player.z,
          playerYaw: player.yaw,
          playerPitch: player.pitch,
          nearestPlantX: nearest.plant.x,
          nearestPlantY: nearest.plant.y + 0.95,
          nearestPlantZ: nearest.plant.z,
          surfaceMaterial: player.surfaceMaterial,
          acousticOcclusion,
          reverbSendRefinement: directives.acoustics.reverbSendRefinement,
          modalFilterQMultiplier: directives.acoustics.modalFilterQMultiplier,
        });

        // Advance Live 4-Stem 16-Step Generative Soundtrack Sequencer (`Foundation.Soundtrack.V1.Model`)
        if (currentSoundtrackScore.activeStems.length > 0) {
          soundtrackStepTimer += dt;
          if (soundtrackStepTimer >= currentSoundtrackScore.stepDurationSec) {
            soundtrackStepTimer -= currentSoundtrackScore.stepDurationSec;
            currentSoundtrackStep = (currentSoundtrackStep + 1) % 16;
            const stepSpec = currentSoundtrackScore.steps[currentSoundtrackStep];
            if (stepSpec && !stepSpec.isRest) {
              soundEngine.playSoundtrackStep(stepSpec, atmosphereRef.current);
            }
          }
        }

        // Step Symbiotic Environmental Agency (`stepSymbioticEnvironmentalAgency`):
        // The environment observes both itself and the player, and acts on both across all 6 modalities
        environmentalAgencyState = stepSymbioticEnvironmentalAgency(environmentalAgencyState, {
          playerX: player.x,
          playerY: player.y,
          playerZ: player.z,
          playerYaw: player.yaw,
          isMoving,
          velocityDm: player.velocityDm,
          agitationPct: gestureHoldState.agitationPct,
          stillnessBreathPhase: gestureHoldState.stillnessBreathPhase,
          playerInteractedThisFrame,
          currentBiome,
          atmosphere: atmosphereRef.current,
          harmonyPct: player.harmony,
          plants: plantsRef.current,
          neuromorphic: neuromorphicState,
          dt,
        });
        playerInteractedThisFrame = false;

        if (
          environmentalAgencyState.shouldEmitBeckoningCall &&
          environmentalAgencyState.beckoningSpecies
        ) {
          soundEngine.playEnvironmentalBeckoningCall({
            frequencyHz: environmentalAgencyState.beckoningFrequencyHz,
            stereoPan: environmentalAgencyState.beckoningStereoPan,
            distanceMeters: environmentalAgencyState.beckoningDistanceMeters,
            species: environmentalAgencyState.beckoningSpecies,
            atmosphere: atmosphereRef.current,
            isSoothingMode: environmentalAgencyState.mode === 'soothing-co-regulation',
          });
          if (environmentalAgencyState.stakeholderEntity.shouldVoiceAnamnesisEcho) {
            soundEngine.playEnvironmentalWisdomEcho({
              frequencyHz: environmentalAgencyState.stakeholderEntity.anamnesisEchoFrequencyHz,
              intervalRatio: environmentalAgencyState.stakeholderEntity.anamnesisEchoIntervalRatio,
              stereoPan: environmentalAgencyState.stakeholderEntity.anamnesisEchoStereoPan,
              distanceMeters:
                environmentalAgencyState.stakeholderEntity.anamnesisEchoDistanceMeters,
              species: environmentalAgencyState.stakeholderEntity.anamnesisEchoSpecies,
              atmosphere: atmosphereRef.current,
            });
          }
          if (environmentalAgencyState.shouldSpawnCymaticInvitationWave) {
            const [bx, by, bz] = environmentalAgencyState.beckoningPlantPosition;
            spawnFootstepRipple(
              bx,
              Math.max(groundHeightAt(bx, bz), by - 0.8),
              bz,
              PLANT_SPECIES_CONFIGS[environmentalAgencyState.beckoningSpecies].emissiveHue,
            );
          }
          // Autopoietic cross-domain transfer + Theory-of-Mind Why packet & Supra-Directive Observer update
          const agencyNextTick = neuromorphicState.tickCount + 1;
          const agencyNextManifold = propagateCrossDomainEnhancement(
            neuromorphicState.universalManifold,
            {
              sourceDomain: environmentalAgencyState.activeRefinementDomain,
              rule30Row: neuromorphicState.rule30Row,
              basinState: neuromorphicState.lastBasinState,
              icosianRootIndex: neuromorphicState.lastIcosianRoot,
              contextPrimeAddress: neuromorphicState.lastPrimeAddress,
              resonantSuccess: true,
              tickId: agencyNextTick,
            },
          );
          neuromorphicState = {
            ...neuromorphicState,
            tickCount: agencyNextTick,
            universalManifold: agencyNextManifold,
            refinementDirectives: computeCrossDomainRefinementDirectives(agencyNextManifold),
            observer: evaluateHolisticObserverState({
              manifold: agencyNextManifold,
              tickCount: agencyNextTick,
              rule30History: neuromorphicState.rule30History,
              prevObserver: neuromorphicState.observer,
              biome: biomeAt(player.x, player.z),
              species: environmentalAgencyState.beckoningSpecies,
              action: player.action,
              velocityDm: player.velocityDm,
              harmonyPct: Math.round(player.harmony),
              playerX: player.x,
              playerZ: player.z,
              playerYaw: player.yaw,
              alphaSeed: neuromorphicState.observer.cosmogenesis.alphaSeed,
            }),
          };
        }

        // Update 7-Node Ground-Hugging Mycelial Guidance Rings (`stakeholderEntity.guidanceFilamentWaypoints`)
        const guidanceWaypoints =
          environmentalAgencyState.stakeholderEntity.guidanceFilamentWaypoints;
        const guidanceLum = environmentalAgencyState.stakeholderEntity.guidanceFilamentLuminance;
        guidanceNodeMat.opacity = Math.min(0.68, 0.22 + guidanceLum * 0.42);
        for (let wIdx = 0; wIdx < GUIDANCE_WAYPOINT_COUNT; wIdx++) {
          const wp = guidanceWaypoints[wIdx];
          if (wp) {
            const pulseWave = Math.sin(elapsed * 2.8 - wIdx * 0.65) * 0.5 + 0.5;
            const groundY = groundHeightAt(wp[0], wp[2]) + 0.03;
            _dummyPos.set(wp[0], groundY, wp[2]);
            _dummyEuler.set(0, elapsed * 0.6 + wIdx, 0);
            _dummyQuat.setFromEuler(_dummyEuler);
            _dummyScale.setScalar(0.75 + pulseWave * 0.35);
          } else {
            _dummyPos.set(0, -50, 0);
            _dummyQuat.identity();
            _dummyScale.setScalar(0.001);
          }
          _dummyMatrix.compose(_dummyPos, _dummyQuat, _dummyScale);
          guidanceFilamentMesh.setMatrixAt(wIdx, _dummyMatrix);
        }
        guidanceFilamentMesh.instanceMatrix.needsUpdate = true;

        const biomeCfg = BIOME_CONFIGS[currentBiome];
        const atmosCfg = ATMOSPHERE_CONFIGS[atmosphereRef.current];
        const diurnalEval = evaluateDiurnalProfile(
          atmosphereRef.current,
          currentBiome,
          player.harmony,
        );
        const liveFidelity =
          neuromorphicState.observer.canonicalStandardModelsContext.multiModalFidelity;
        if (
          cachedSpectralAtm !== atmosphereRef.current ||
          cachedSpectralBands !== liveFidelity.spectralBandCount
        ) {
          syncMultiModalFidelityVisuals();
        }
        _targetSkyColor
          .set(biomeCfg.skyColor)
          .lerp(_tempColor.set(atmosCfg.skyColor), 0.46)
          .lerp(_tempColor.set(cachedSpectralDiurnal.skyZenith.hex), 0.36);
        _targetFogColor
          .set(biomeCfg.fogColor)
          .lerp(_tempColor.set(atmosCfg.fogColor), 0.46)
          .lerp(_tempColor.set(cachedSpectralDiurnal.fogAtmosphere.hex), 0.36);
        (scene.background as THREE.Color).lerp(_targetSkyColor, 1 - Math.exp(-2.5 * dt));
        (scene.fog as THREE.FogExp2).color.lerp(_targetFogColor, 1 - Math.exp(-2.5 * dt));
        _tempColor.set(cachedSpectralDiurnal.sunDirectional.hex);
        sunLight.color.lerp(_tempColor, 1 - Math.exp(-2.0 * dt));
        (scene.fog as THREE.FogExp2).density = THREE.MathUtils.damp(
          (scene.fog as THREE.FogExp2).density,
          diurnalEval.effectiveFogDensity *
            environmentalAgencyState.mistClearanceCorridorFactor *
            granularModals.opticalModality.terpeneAerosolTyndallTransmittance,
          3.0,
          dt,
        );
        sunLight.intensity = THREE.MathUtils.damp(
          sunLight.intensity,
          diurnalEval.effectiveSunIntensity,
          3.0,
          dt,
        );
        sunLight.position.set(
          THREE.MathUtils.damp(sunLight.position.x, diurnalEval.sunPosition[0], 2.5, dt),
          THREE.MathUtils.damp(sunLight.position.y, diurnalEval.sunPosition[1], 2.5, dt),
          THREE.MathUtils.damp(sunLight.position.z, diurnalEval.sunPosition[2], 2.5, dt),
        );
        hemiLight.intensity = THREE.MathUtils.damp(
          hemiLight.intensity,
          diurnalEval.effectiveHemiIntensity,
          3.0,
          dt,
        );
        starMat.opacity = THREE.MathUtils.damp(starMat.opacity, diurnalEval.starOpacity, 2.5, dt);
        auroraMat.opacity = THREE.MathUtils.damp(
          auroraMat.opacity,
          diurnalEval.starOpacity *
            0.24 *
            (0.85 + environmentalAgencyState.stakeholderEntity.cathedralCrownLuminance * 0.45),
          2.5,
          dt,
        );
        starDome.position.set(player.x, 0, player.z);
        starDome.rotation.y = elapsed * 0.012;
        auroraRibbon.rotation.z = elapsed * 0.05;

        // Critically-damped Camera Response (`Foundation.Humane.V1.Model::computeCameraKinematics`)
        cameraKinematics = computeCameraKinematics({
          prev: cameraKinematics,
          playerX: player.x,
          playerY: player.y,
          playerZ: player.z,
          targetYaw: player.yaw,
          targetPitch: player.pitch,
          isMoving,
          inWater: player.inWater,
          speedMps: speedMetersPerSec,
          stillnessBreathPhase: gestureHoldState.stillnessBreathPhase,
          stillnessBreathProgress: gestureHoldState.stillnessBreathProgress,
          dt,
          playerModel: neuromorphicState.observer.cosmogenesis.playerRealm,
        });

        camera.position.set(cameraKinematics.camX, cameraKinematics.camY, cameraKinematics.camZ);
        camera.rotation.order = 'YXZ';
        camera.rotation.y = cameraKinematics.camYaw;
        camera.rotation.x = cameraKinematics.camPitch;
        camera.rotation.z = 0;
        const targetCameraFov =
          cameraKinematics.camFov + environmentalAgencyState.cameraFovHarmonyDelta;
        if (Math.abs(camera.fov - targetCameraFov) > 0.02) {
          camera.fov = targetCameraFov;
          camera.updateProjectionMatrix();
        }

        emitTelemetry(false);
      }

      if (!contextLost) {
        renderer.render(scene, camera);
      }

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    frameId = requestAnimationFrame(tick);

    return () => {
      unmounted = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver?.disconnect();
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost, false);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored, false);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onWindowBlur);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', onResize);
      groundTex.dispose();
      groundBumpTex.dispose();
      pbrSuite.mossColorTex.dispose();
      pbrSuite.mossNormalTex.dispose();
      pbrSuite.mossRoughnessTex.dispose();
      pbrSuite.stoneColorTex.dispose();
      pbrSuite.stoneNormalTex.dispose();
      pbrSuite.petalVeinNormalTex.dispose();
      disposeSuiteGeometries(activeBMeshSuite, sharedPlantGeometries);
      for (const g of shorelineCrystalGeos) g.dispose();
      for (const g of holdfastCrystalGeos) g.dispose();
      shorelineStoneGeo.dispose();
      rockGeo.dispose();
      stalkGeo.dispose();
      canopyGeo.dispose();
      grassGeo.dispose();
      terrainGeo.dispose();
      terrainMat.dispose();
      filamentGeo.dispose();
      wavefrontOrbGeo.dispose();
      guidanceNodeGeo.dispose();
      guidanceNodeMat.dispose();
      sanctuaryMonument.observerCrown.geometry.dispose();
      sanctuaryMonument.crownMat.dispose();
      playerLocusMesh.geometry.dispose();
      playerLocusMat.dispose();
      immanentWitness.dispose();
      witnessShadowGeo.dispose();
      witnessShadowMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 w-full h-full overflow-hidden"
      style={{ backgroundColor: 'var(--prism-bg-canvas, #0b1612)' }}
      aria-label="3D Procedural Botanical Garden Viewport"
    />
  );
};
