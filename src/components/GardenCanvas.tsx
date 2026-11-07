import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  ATMOSPHERE_CONFIGS,
  AtmosphereId,
  BIOME_CONFIGS,
  BiomeId,
  ChorusStateId,
  GardenPlantInstance,
  PLANT_SPECIES_CONFIGS,
  PlayerActionId,
  SANCTUARY_TRAIL_WAYPOINTS,
  SoundscapeOutcome,
  biomeAt,
  computeEcologicalAffinity,
  computePlantMorphology,
  evaluateDiurnalProfile,
  evaluatePrismRequest,
  findNearestPlant,
  formatPrismRequest,
  groundHeightAt,
} from '../game/prismModel';
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
  totalPlants: number;
  exploredBiomes: BiomeId[];
  guidedStroll: boolean;
}

export interface GardenImperativeHandle {
  triggerAction: (action: PlayerActionId) => void;
  teleportToBiome: (biome: BiomeId) => void;
  toggleGuidedStroll: () => void;
  resetExploration: () => void;
}

interface GardenCanvasProps {
  gameState: GameState;
  atmosphere: AtmosphereId;
  plants: GardenPlantInstance[];
  soundEngine: BotanicalSoundscapeEngine;
  onTelemetryUpdate: (telemetry: LiveTelemetryState) => void;
  onPlantAttuned: (plantId: string, biome: BiomeId, outcome: SoundscapeOutcome) => void;
  handleRef: React.MutableRefObject<GardenImperativeHandle | null>;
}

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

export const GardenCanvas: React.FC<GardenCanvasProps> = ({
  gameState,
  atmosphere,
  plants,
  soundEngine,
  onTelemetryUpdate,
  onPlantAttuned,
  handleRef,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const gameStateRef = useRef<GameState>(gameState);
  const atmosphereRef = useRef<AtmosphereId>(atmosphere);
  const plantsRef = useRef<GardenPlantInstance[]>(plants);
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

    // 1. Software-WebGL Guard per Three.js skill
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(container.clientWidth || window.innerWidth, container.clientHeight || window.innerHeight);

    container.innerHTML = '';
    renderer.domElement.setAttribute('data-testid', 'garden-webgl-canvas');
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#162d24');
    scene.fog = new THREE.FogExp2('#1a362b', 0.016);

    const camera = new THREE.PerspectiveCamera(
      65,
      (container.clientWidth || window.innerWidth) / (container.clientHeight || window.innerHeight),
      0.15,
      160,
    );

    // 2. Mandatory Studio Environment Reflection (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 3. Balanced Warm/Cool Studio Rig
    const hemiLight = new THREE.HemisphereLight(0x9be7d8, 0x1b3326, 1.15);
    hemiLight.position.set(0, 40, 0);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfff1d0, 2.1);
    sunLight.position.set(28, 42, 18);
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

    const sanctuaryPointLight = new THREE.PointLight(0xfbbf24, 3.2, 28);
    sanctuaryPointLight.position.set(0, groundHeightAt(0, -34) + 5.2, -34);
    scene.add(sanctuaryPointLight);

    // 4. Procedural CanvasTexture for Ground Moss & Stone Micro-Relief
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    const createMossCanvasTexture = () => {
      const c = document.createElement('canvas');
      c.width = 256;
      c.height = 256;
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = '#1f3d2d';
      ctx.fillRect(0, 0, 256, 256);
      let seed = 90210;
      const nextRand = () => {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        return seed / 4294967296;
      };
      for (let i = 0; i < 420; i++) {
        const x = nextRand() * 256;
        const y = nextRand() * 256;
        const r = 4 + nextRand() * 14;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
        const shade = i % 3 === 0 ? 'rgba(46, 89, 65, 0.35)' : i % 3 === 1 ? 'rgba(26, 54, 40, 0.35)' : 'rgba(56, 107, 78, 0.28)';
        grad.addColorStop(0, shade);
        grad.addColorStop(1, 'rgba(31, 61, 45, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(16, 16);
      tex.anisotropy = maxAnisotropy;
      return tex;
    };

    const groundTex = createMossCanvasTexture();
    const terrainGeo = new THREE.PlaneGeometry(180, 180, 64, 64);
    terrainGeo.rotateX(-Math.PI / 2);
    const posAttr = terrainGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const vx = posAttr.getX(i);
      const vz = posAttr.getZ(i);
      posAttr.setY(i, groundHeightAt(vx, vz));
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: groundTex,
      roughness: 0.88,
      metalness: 0.06,
    });
    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.receiveShadow = !isSoftwareGl;
    scene.add(terrainMesh);

    // Wetland Mirror Lagoon Water Plane (disjoint depth +0.04m)
    const lagoonGeo = new THREE.CircleGeometry(15.5, 32);
    lagoonGeo.rotateX(-Math.PI / 2);
    const lagoonMat = new THREE.MeshPhysicalMaterial({
      color: 0x14b8a6,
      roughness: 0.12,
      metalness: 0.2,
      clearcoat: 0.9,
      transparent: true,
      opacity: 0.78,
    });
    const lagoonMesh = new THREE.Mesh(lagoonGeo, lagoonMat);
    lagoonMesh.position.set(-28, groundHeightAt(-28, 30) + 0.18, 30);
    scene.add(lagoonMesh);

    // 5. Central Resonance Sanctuary Obelisk & Pavilion (8-part composite THREE.Group)
    const buildSanctuaryPavilion = () => {
      const group = new THREE.Group();
      const sy = groundHeightAt(0, -34);
      group.position.set(0, sy, -34);

      const stoneMat = new THREE.MeshStandardMaterial({
        color: 0xd6d3d1,
        roughness: 0.72,
        metalness: 0.12,
      });
      const goldTrimMat = new THREE.MeshStandardMaterial({
        color: 0xfbbf24,
        emissive: 0xd97706,
        emissiveIntensity: 0.35,
        roughness: 0.22,
        metalness: 0.85,
      });
      const crystalMat = new THREE.MeshPhysicalMaterial({
        color: 0xfde047,
        emissive: 0xf59e0b,
        emissiveIntensity: 0.55,
        roughness: 0.1,
        metalness: 0.15,
        clearcoat: 1.0,
      });

      // Part 1 & 2: Two-tier circular plinth
      const plinthLower = new THREE.Mesh(new THREE.CylinderGeometry(5.8, 6.4, 0.45, 24), stoneMat);
      plinthLower.position.y = 0.225;
      group.add(plinthLower);

      const plinthUpper = new THREE.Mesh(new THREE.CylinderGeometry(4.4, 4.8, 0.4, 24), stoneMat);
      plinthUpper.position.y = 0.65;
      group.add(plinthUpper);

      // Part 3: Glowing harmonic resonance pool ring
      const poolRing = new THREE.Mesh(new THREE.RingGeometry(1.6, 3.6, 32), goldTrimMat);
      poolRing.rotation.x = -Math.PI / 2;
      poolRing.position.y = 0.87;
      group.add(poolRing);

      // Part 4..7: Four fluted acoustic stone pillars around the perimeter
      const pillarGeo = new THREE.CylinderGeometry(0.28, 0.36, 5.4, 12);
      for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
        const pillar = new THREE.Mesh(pillarGeo, stoneMat);
        pillar.position.set(Math.cos(angle) * 3.7, 3.5, Math.sin(angle) * 3.7);
        group.add(pillar);
      }

      // Part 8: Crown Halo Ring
      const haloRing = new THREE.Mesh(new THREE.TorusGeometry(3.7, 0.22, 12, 32), goldTrimMat);
      haloRing.rotation.x = Math.PI / 2;
      haloRing.position.y = 6.2;
      group.add(haloRing);

      // Part 9: Central Levitating Tuning-Fork Obelisk Spire
      const spire = new THREE.Mesh(new THREE.OctahedronGeometry(1.35, 0), crystalMat);
      spire.scale.set(0.75, 2.4, 0.75);
      spire.position.y = 3.8;
      spire.name = 'sanctuary-spire';
      group.add(spire);

      // Part 10: Orbiting Harmonic Ring around Spire
      const orbitRing = new THREE.Mesh(new THREE.TorusGeometry(1.65, 0.06, 10, 32), goldTrimMat);
      orbitRing.position.y = 3.8;
      orbitRing.name = 'sanctuary-ring';
      group.add(orbitRing);

      return { group, spire, orbitRing };
    };

    const sanctuaryMonument = buildSanctuaryPavilion();
    scene.add(sanctuaryMonument.group);

    // 6. Stepping Stones along the central vista & biome trails (InstancedMesh, 44 stones)
    const stoneCount = 44;
    const stepStoneGeo = new THREE.CylinderGeometry(0.85, 0.95, 0.14, 8);
    const stepStoneMat = new THREE.MeshStandardMaterial({
      color: 0xa8a29e,
      roughness: 0.82,
      metalness: 0.08,
    });
    const stepStonesMesh = new THREE.InstancedMesh(stepStoneGeo, stepStoneMat, stoneCount);
    for (let i = 0; i < stoneCount; i++) {
      let sx = 0;
      let sz = 0;
      if (i < 16) {
        // Spawn vista path (0, 2) -> (0, -28)
        sx = Math.sin(i * 0.5) * 0.35;
        sz = 2 - i * 1.9;
      } else if (i < 26) {
        // Path toward Bamboo Grove (-36, -24)
        const t = (i - 16) / 10;
        sx = -4 - t * 30;
        sz = -10 - t * 13;
      } else if (i < 36) {
        // Path toward Crystal Basin (36, -24)
        const t = (i - 26) / 10;
        sx = 4 + t * 30;
        sz = -10 - t * 13;
      } else {
        // Path toward Wetland (-28, 30)
        const t = (i - 36) / 8;
        sx = -3 - t * 22;
        sz = 4 + t * 23;
      }
      const sy = groundHeightAt(sx, sz) + 0.03;
      _dummyPos.set(sx, sy, sz);
      _dummyEuler.set(0, i * 0.7, 0);
      _dummyQuat.setFromEuler(_dummyEuler);
      _dummyScale.set(1 + (i % 3) * 0.12, 1, 0.85 + (i % 2) * 0.15);
      _dummyMatrix.compose(_dummyPos, _dummyQuat, _dummyScale);
      stepStonesMesh.setMatrixAt(i, _dummyMatrix);
    }
    stepStonesMesh.instanceMatrix.needsUpdate = true;
    stepStonesMesh.computeBoundingSphere();
    scene.add(stepStonesMesh);

    // 7. Natural Perimeter Rock Outcrops & Bamboo/Tree Groves (InstancedMesh)
    const rockCount = 40;
    const rockGeo = new THREE.DodecahedronGeometry(2.6, 1);
    const rockMat = new THREE.MeshStandardMaterial({
      color: 0x3f4f47,
      roughness: 0.9,
      metalness: 0.08,
    });
    const rocksInstanced = new THREE.InstancedMesh(rockGeo, rockMat, rockCount);
    for (let i = 0; i < rockCount; i++) {
      const angle = (i / rockCount) * Math.PI * 2;
      const rad = 56 + (i % 4) * 4.5;
      const rx = Math.cos(angle) * rad;
      const rz = Math.sin(angle) * rad;
      const ry = groundHeightAt(rx, rz) + 1.1;
      _dummyPos.set(rx, ry, rz);
      _dummyEuler.set(i * 0.3, i * 0.8, 0);
      _dummyQuat.setFromEuler(_dummyEuler);
      _dummyScale.set(1.2 + (i % 3) * 0.45, 0.9 + (i % 4) * 0.5, 1.1 + (i % 2) * 0.4);
      _dummyMatrix.compose(_dummyPos, _dummyQuat, _dummyScale);
      rocksInstanced.setMatrixAt(i, _dummyMatrix);
      _tempColor.setHSL(0.42 + (i % 5) * 0.02, 0.18, 0.24 + (i % 3) * 0.04);
      rocksInstanced.setColorAt(i, _tempColor);
    }
    rocksInstanced.instanceMatrix.needsUpdate = true;
    if (rocksInstanced.instanceColor) rocksInstanced.instanceColor.needsUpdate = true;
    rocksInstanced.computeBoundingSphere();
    scene.add(rocksInstanced);

    // Tall Harmonic Bamboo / Crystal Pillars in Groves
    const stalkCount = 48;
    const stalkGeo = new THREE.CylinderGeometry(0.18, 0.24, 7.5, 8);
    const stalkMat = new THREE.MeshStandardMaterial({
      color: 0x5eead4,
      roughness: 0.42,
      metalness: 0.22,
    });
    const stalksInstanced = new THREE.InstancedMesh(stalkGeo, stalkMat, stalkCount);
    for (let i = 0; i < stalkCount; i++) {
      const isCrystalSide = i >= 24;
      const cx = isCrystalSide ? 36 : -36;
      const cz = -24;
      const angle = ((i % 24) / 24) * Math.PI * 2 + (i % 3) * 0.2;
      const r = 7 + (i % 5) * 3.1;
      const bx = cx + Math.cos(angle) * r;
      const bz = cz + Math.sin(angle) * r;
      const by = groundHeightAt(bx, bz) + 3.5;
      _dummyPos.set(bx, by, bz);
      _dummyEuler.set((Math.sin(i) * 0.06), i * 0.4, (Math.cos(i) * 0.06));
      _dummyQuat.setFromEuler(_dummyEuler);
      const s = 0.85 + (i % 4) * 0.18;
      _dummyScale.set(s, 0.8 + (i % 3) * 0.25, s);
      _dummyMatrix.compose(_dummyPos, _dummyQuat, _dummyScale);
      stalksInstanced.setMatrixAt(i, _dummyMatrix);
      _tempColor.set(isCrystalSide ? '#38bdf8' : '#34d399');
      stalksInstanced.setColorAt(i, _tempColor);
    }
    stalksInstanced.instanceMatrix.needsUpdate = true;
    if (stalksInstanced.instanceColor) stalksInstanced.instanceColor.needsUpdate = true;
    stalksInstanced.computeBoundingSphere();
    scene.add(stalksInstanced);

    // 8. Composite 3-12 Part Procedural Plant Species Builder
    const shadowDiscGeo = new THREE.CircleGeometry(1.15, 16);
    shadowDiscGeo.rotateX(-Math.PI / 2);
    const shadowDiscMat = new THREE.MeshBasicMaterial({
      color: 0x040d09,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
    });

    // Shared LatheGeometry for Chime Lily bell corollas
    const bellPoints = [
      new THREE.Vector2(0.02, 0.0),
      new THREE.Vector2(0.14, 0.12),
      new THREE.Vector2(0.24, 0.32),
      new THREE.Vector2(0.42, 0.55),
    ];
    const bellLatheGeo = new THREE.LatheGeometry(bellPoints, 12);

    interface AnimatedPlantRecord {
      instance: GardenPlantInstance;
      group: THREE.Group;
      emissiveMaterials: THREE.MeshStandardMaterial[];
      haloRing: THREE.Mesh;
      baseY: number;
      pulsePhase: number;
    }

    const plantMeshes: AnimatedPlantRecord[] = [];
    const plantsRoot = new THREE.Group();
    scene.add(plantsRoot);

    const buildPlantGroup = (plant: GardenPlantInstance): AnimatedPlantRecord => {
      const cfg = PLANT_SPECIES_CONFIGS[plant.species];
      const group = new THREE.Group();
      group.position.set(plant.x, plant.y, plant.z);
      group.rotation.y = plant.rotationY;
      group.scale.setScalar(plant.scale);

      // Soft contact shadow disc at y = +0.015
      const shadowDisc = new THREE.Mesh(shadowDiscGeo, shadowDiscMat);
      shadowDisc.position.y = 0.015;
      group.add(shadowDisc);

      // Interactive Resonance Halo Ring on ground
      const haloMat = new THREE.MeshBasicMaterial({
        color: cfg.emissiveHue,
        transparent: true,
        opacity: plant.attuned ? 0.65 : 0.22,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const haloRing = new THREE.Mesh(new THREE.RingGeometry(0.85, 1.02, 24), haloMat);
      haloRing.rotation.x = -Math.PI / 2;
      haloRing.position.y = 0.025;
      group.add(haloRing);

      const stemMat = new THREE.MeshStandardMaterial({
        color: 0x15803d,
        roughness: 0.76,
        metalness: 0.08,
      });

      const bloomMat = new THREE.MeshStandardMaterial({
        color: cfg.primaryHue,
        emissive: cfg.emissiveHue,
        emissiveIntensity: plant.attuned ? 0.95 : 0.38,
        roughness: 0.24,
        metalness: 0.18,
      });

      const accentMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: cfg.emissiveHue,
        emissiveIntensity: plant.attuned ? 1.2 : 0.55,
        roughness: 0.15,
        metalness: 0.45,
      });

      const emissiveMaterials = [bloomMat, accentMat];

      if (plant.species === 'chime-lily') {
        // 4 Basal rosette leaves + main arching stem + 3 hanging bell corollas + 3 stamen clappers (9 parts)
        const leafGeo = new THREE.ConeGeometry(0.28, 0.9, 6);
        for (let i = 0; i < 4; i++) {
          const leaf = new THREE.Mesh(leafGeo, stemMat);
          const a = (i / 4) * Math.PI * 2;
          leaf.position.set(Math.cos(a) * 0.3, 0.25, Math.sin(a) * 0.3);
          leaf.rotation.z = -Math.cos(a) * 0.6;
          leaf.rotation.x = Math.sin(a) * 0.6;
          group.add(leaf);
        }
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.11, 2.2, 8), stemMat);
        stem.position.y = 1.1;
        group.add(stem);

        for (let b = 0; b < 3; b++) {
          const branchAngle = (b / 3) * Math.PI * 2;
          const bx = Math.cos(branchAngle) * 0.42;
          const bz = Math.sin(branchAngle) * 0.42;
          const by = 1.45 + b * 0.32;

          const bell = new THREE.Mesh(bellLatheGeo, bloomMat);
          bell.rotation.x = Math.PI;
          bell.position.set(bx, by, bz);
          group.add(bell);

          const stamen = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), accentMat);
          stamen.position.set(bx, by - 0.38, bz);
          group.add(stamen);
        }
      } else if (plant.species === 'pulse-fern') {
        // Mossy root mound + 5 tiered arching fronds + central glowing crozier spiral + 3 spore orbs (9 parts)
        const mound = new THREE.Mesh(new THREE.SphereGeometry(0.45, 10, 8), stemMat);
        mound.scale.set(1, 0.5, 1);
        mound.position.y = 0.15;
        group.add(mound);

        const frondGeo = new THREE.BoxGeometry(0.22, 1.55, 0.06);
        for (let i = 0; i < 5; i++) {
          const a = (i / 5) * Math.PI * 2;
          const frond = new THREE.Mesh(frondGeo, bloomMat);
          frond.position.set(Math.cos(a) * 0.42, 0.78, Math.sin(a) * 0.42);
          frond.rotation.y = -a;
          frond.rotation.z = 0.48;
          group.add(frond);
        }

        const crozier = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.07, 8, 16, Math.PI * 1.65), accentMat);
        crozier.position.y = 1.25;
        group.add(crozier);
      } else if (plant.species === 'echo-lotus') {
        // Floating pad + 6 outer petals + 6 inner petals + central acoustic seed crown (8+ parts)
        const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.9, 0.08, 16), stemMat);
        pad.position.y = 0.08;
        group.add(pad);

        const petalGeo = new THREE.ConeGeometry(0.22, 0.72, 5);
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * Math.PI * 2;
          const petal = new THREE.Mesh(petalGeo, bloomMat);
          petal.position.set(Math.cos(a) * 0.42, 0.38, Math.sin(a) * 0.42);
          petal.rotation.y = -a;
          petal.rotation.z = 0.55;
          group.add(petal);
        }

        const seedCrown = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.12, 0.38, 12), accentMat);
        seedCrown.position.y = 0.45;
        group.add(seedCrown);
      } else if (plant.species === 'drone-moss') {
        // 3 terraced basalt stones + 3 glowing moss cushions + 3 ascending spore stalks (9 parts)
        const rockSubMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.85, metalness: 0.1 });
        for (let i = 0; i < 3; i++) {
          const a = (i / 3) * Math.PI * 2;
          const stone = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.48, 0.35 + i * 0.15, 6), rockSubMat);
          stone.position.set(Math.cos(a) * 0.32, 0.18 + i * 0.07, Math.sin(a) * 0.32);
          group.add(stone);

          const cushion = new THREE.Mesh(new THREE.SphereGeometry(0.36, 10, 8), bloomMat);
          cushion.scale.set(1, 0.55, 1);
          cushion.position.set(Math.cos(a) * 0.32, 0.38 + i * 0.14, Math.sin(a) * 0.32);
          group.add(cushion);

          const capsule = new THREE.Mesh(new THREE.OctahedronGeometry(0.11, 0), accentMat);
          capsule.position.set(Math.cos(a) * 0.32, 0.95 + i * 0.22, Math.sin(a) * 0.32);
          group.add(capsule);
        }
      } else {
        // star-orchid: Fluted stem + 5 star perianth petals + central trumpet labellum + crown orb (8 parts)
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.12, 1.75, 8), stemMat);
        stem.position.y = 0.88;
        group.add(stem);

        const starHead = new THREE.Group();
        starHead.position.y = 1.75;
        const starPetalGeo = new THREE.ConeGeometry(0.18, 0.72, 4);
        for (let i = 0; i < 5; i++) {
          const a = (i / 5) * Math.PI * 2;
          const petal = new THREE.Mesh(starPetalGeo, bloomMat);
          petal.position.set(Math.cos(a) * 0.32, Math.sin(a) * 0.32, 0.08);
          petal.rotation.z = a - Math.PI / 2;
          starHead.add(petal);
        }
        const labellum = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.08, 0.38, 10), accentMat);
        labellum.rotation.x = Math.PI / 2;
        labellum.position.z = 0.22;
        starHead.add(labellum);
        group.add(starHead);
      }

      plantsRoot.add(group);
      return {
        instance: plant,
        group,
        emissiveMaterials,
        haloRing,
        baseY: plant.y,
        pulsePhase: Math.random() * Math.PI * 2,
      };
    };

    for (const p of plantsRef.current) {
      plantMeshes.push(buildPlantGroup(p));
    }

    // 9. Zero-GC Pooled Particle Ring Buffer (180 Bioluminescent Acoustic Spores)
    const PARTICLE_COUNT = 180;
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
      const a = (i / PARTICLE_COUNT) * Math.PI * 2 * 5;
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

    // Diurnal Celestial Star Dome (fades in smoothly during Twilight Glow & Starlight Sanctuary)
    const STAR_COUNT = 260;
    const starPositions = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i++) {
      const theta = (i * 2.39996) % (Math.PI * 2);
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
      size: 0.65,
      transparent: true,
      opacity: 0.15,
      fog: false,
      depthWrite: false,
    });
    const starDome = new THREE.Points(starGeo, starMat);
    scene.add(starDome);

    let particleCursor = 0;
    const spawnBurstAt = (bx: number, by: number, bz: number, hexColor: string, count = 20) => {
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
        pScale[idx] = 0.85;
        particleMesh.setColorAt(idx, _tempColor);
      }
      if (particleMesh.instanceColor) particleMesh.instanceColor.needsUpdate = true;
      particleCursor = (particleCursor + count) % PARTICLE_COUNT;
    };

    // Pooled Concentric Acoustic Ground Wave Rings (expand outward when flora is attuned/touched)
    const WAVE_RING_COUNT = 3;
    const waveRingGeo = new THREE.RingGeometry(0.95, 1.12, 32);
    const waveRings: { mesh: THREE.Mesh; mat: THREE.MeshBasicMaterial; age: number; active: boolean }[] = [];
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
      waveRings.push({ mesh, mat, age: 0, active: false });
    }

    const spawnSoundWaveRings = (wx: number, wy: number, wz: number, hexColor: string) => {
      for (let i = 0; i < WAVE_RING_COUNT; i++) {
        const ring = waveRings[i];
        ring.mesh.position.set(wx, wy + 0.04 + i * 0.005, wz);
        ring.mesh.scale.setScalar(0.8);
        ring.mat.color.set(hexColor);
        ring.mat.opacity = 0.75;
        ring.age = -i * 0.22;
        ring.active = true;
        ring.mesh.visible = true;
      }
    };

    // Pre-compile shaders on hardware GPUs
    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // 10. Player First-Person Controller State (Spawns on open stone road facing Sanctuary Vista)
    const player = {
      x: 0,
      z: 0,
      yaw: 0, // 0 faces -Z directly toward the Resonance Sanctuary Obelisk & Chime Lily
      pitch: 0.04,
      guidedStroll: false,
      trailIndex: 0,
      velocityDm: 0,
      walkDist: 0,
      action: 'observe' as PlayerActionId,
      actionHoldTimer: 0,
      harmony: 15,
      exploredBiomes: new Set<BiomeId>(['meadow']),
      lastOutcome: 'ambient-drone' as SoundscapeOutcome,
      lastRule: 'REQ-020' as string | null,
      lastRuleDesc: 'A slow, unhurried walk through the garden sustains a warm botanical pad foundation.',
      lastRequest: 'meadow chime-lily observe dawn dormant 20 0',
      cameraShake: 0,
    };

    const keysPressed = new Set<string>();
    let isPointerDragging = false;
    let lastMouseX = 0;
    let lastMouseY = 0;

    const performAction = (act: PlayerActionId) => {
      soundEngine.init();
      player.action = act;
      player.actionHoldTimer = 1.8;
      if (act === 'stillness') {
        player.velocityDm = 0;
        player.guidedStroll = false;
      }

      const nearest = findNearestPlant(player.x, player.z, plantsRef.current);
      const currentBiome = biomeAt(player.x, player.z);

      // Step to a comfortable 3.6m viewing distance when attuning or touching a nearby plant
      if ((act === 'attune' || act === 'touch') && nearest.distanceMeters < 12.0) {
        const dx = nearest.plant.x - player.x;
        const dz = nearest.plant.z - player.z;
        const len = Math.hypot(dx, dz) || 1;
        player.x = nearest.plant.x - (dx / len) * 3.6;
        player.z = nearest.plant.z - (dz / len) * 3.6;
        player.yaw = Math.atan2(-dx, -dz);
      }

      const updatedNearest = findNearestPlant(player.x, player.z, plantsRef.current);
      const meshRecord = plantMeshes.find((m) => m.instance.id === updatedNearest.plant.id);
      if (meshRecord) {
        meshRecord.instance.attuned = true;
        for (const mat of meshRecord.emissiveMaterials) {
          mat.emissiveIntensity = 1.35;
        }
        (meshRecord.haloRing.material as THREE.MeshBasicMaterial).opacity = 0.85;
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

      const speciesCfg = PLANT_SPECIES_CONFIGS[updatedNearest.plant.species];
      spawnBurstAt(
        updatedNearest.plant.x,
        updatedNearest.plant.y,
        updatedNearest.plant.z,
        speciesCfg.emissiveHue,
        18,
      );
      spawnSoundWaveRings(
        updatedNearest.plant.x,
        updatedNearest.plant.y,
        updatedNearest.plant.z,
        speciesCfg.emissiveHue,
      );

      const affinity = computeEcologicalAffinity(
        currentBiome,
        updatedNearest.plant.species,
        atmosphereRef.current,
      );
      player.harmony = Math.min(
        100,
        player.harmony + (act === 'attune' ? 12 : 8) + affinity.harmonyBonus,
      );
      soundEngine.playOutcomeMotif(outcome, currentBiome, 1.0, atmosphereRef.current);
      onPlantAttunedRef.current(updatedNearest.plant.id, currentBiome, outcome);
      emitTelemetry(true);
    };

    const teleportToBiome = (biome: BiomeId) => {
      soundEngine.init();
      player.guidedStroll = false;
      const cfg = BIOME_CONFIGS[biome];
      // Place player in front of the biome center facing the biome focal flora & obelisk
      player.x = cfg.center[0];
      player.z = biome === 'sanctuary' ? cfg.center[1] + 7.2 : cfg.center[1] + 5.2;
      player.yaw = 0;
      player.pitch = 0.04;
      player.exploredBiomes.add(biome);

      if (biome === 'sanctuary') {
        player.action = 'stillness';
        player.velocityDm = 0;
        player.actionHoldTimer = 2.5;
      } else {
        player.action = 'observe';
        player.actionHoldTimer = 1.2;
      }

      const nearest = findNearestPlant(player.x, player.z, plantsRef.current);
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
      player.harmony = Math.min(100, player.harmony + 6);

      soundEngine.playOutcomeMotif(outcome, biome, 0.9, atmosphereRef.current);
      emitTelemetry(true);
    };

    const toggleGuidedStroll = () => {
      soundEngine.init();
      player.guidedStroll = !player.guidedStroll;
      emitTelemetry(true);
    };

    const resetExploration = () => {
      player.x = 0;
      player.z = 0;
      player.yaw = 0;
      player.pitch = 0.04;
      player.guidedStroll = false;
      player.trailIndex = 0;
      player.velocityDm = 0;
      player.walkDist = 0;
      player.action = 'observe';
      player.harmony = 15;
      player.exploredBiomes = new Set<BiomeId>(['meadow']);
      for (const m of plantMeshes) {
        m.instance.attuned = false;
        for (const mat of m.emissiveMaterials) {
          mat.emissiveIntensity = 0.38;
        }
        (m.haloRing.material as THREE.MeshBasicMaterial).opacity = 0.22;
      }
      emitTelemetry(true);
    };

    handleRef.current = {
      triggerAction: performAction,
      teleportToBiome,
      toggleGuidedStroll,
      resetExploration,
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (gameStateRef.current !== 'playing') return;
      keysPressed.add(e.code);

      if (e.code === 'Space' || e.code === 'KeyF') {
        e.preventDefault();
        performAction('attune');
      } else if (e.code === 'KeyT') {
        e.preventDefault();
        performAction('touch');
      } else if (e.code === 'KeyC') {
        e.preventDefault();
        performAction('stillness');
      } else if (e.code === 'KeyG') {
        e.preventDefault();
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

    const onMouseDown = (e: MouseEvent) => {
      if (gameStateRef.current !== 'playing') return;
      if (e.target !== renderer.domElement) return;
      soundEngine.init();
      isPointerDragging = true;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isPointerDragging || gameStateRef.current !== 'playing') return;
      const dx = e.clientX - lastMouseX;
      const dy = e.clientY - lastMouseY;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      player.yaw -= dx * 0.0045;
      player.pitch = Math.max(-0.55, Math.min(0.65, player.pitch - dy * 0.0035));
    };

    const onMouseUp = () => {
      isPointerDragging = false;
    };

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

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
      const nearest = findNearestPlant(player.x, player.z, plantsRef.current);
      const attunedCount = plantMeshes.filter((m) => m.instance.attuned).length;
      const chorusState: ChorusStateId = nearest.plant.attuned || attunedCount >= 5 ? 'awakened' : 'dormant';
      const affinity = computeEcologicalAffinity(
        currentBiome,
        nearest.plant.species,
        atmosphereRef.current,
      );

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
        totalPlants: plantMeshes.length,
        exploredBiomes: Array.from(player.exploredBiomes),
        guidedStroll: player.guidedStroll,
      });
    };

    // Emit initial telemetry snapshot immediately
    emitTelemetry(true);

    // 11. Animation Loop with Software-WebGL Pacing (`afterDraw`)
    const clock = new THREE.Clock();
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
      const rawDt = clock.getDelta();
      const dt = Math.min(rawDt, 0.05);
      const elapsed = clock.getElapsedTime();
      const currentState = gameStateRef.current;

      // Animate Sanctuary Levitating Spire
      sanctuaryMonument.spire.position.y = 3.8 + Math.sin(elapsed * 1.6) * 0.28;
      sanctuaryMonument.spire.rotation.y = elapsed * 0.45;
      sanctuaryMonument.orbitRing.rotation.x = Math.PI / 3 + Math.sin(elapsed * 0.9) * 0.35;
      sanctuaryMonument.orbitRing.rotation.y = elapsed * 0.7;

      // Animate Expanding Acoustic Ground Wave Rings
      for (let i = 0; i < WAVE_RING_COUNT; i++) {
        const ring = waveRings[i];
        if (!ring.active) continue;
        ring.age += dt;
        if (ring.age < 0) continue;
        if (ring.age > 1.6) {
          ring.active = false;
          ring.mesh.visible = false;
          continue;
        }
        const progress = ring.age / 1.6;
        ring.mesh.scale.setScalar(0.9 + progress * 3.4);
        ring.mat.opacity = (1 - progress) * 0.65;
      }

      // Animate Plant Clusters via `computePlantMorphology`
      for (let i = 0; i < plantMeshes.length; i++) {
        const pm = plantMeshes[i];
        const dMeters = Math.hypot(player.x - pm.instance.x, player.z - pm.instance.z);
        const proxDm = Math.min(100, Math.round(dMeters * 3.5));
        const morph = computePlantMorphology({
          baseScale: pm.instance.scale,
          attuned: pm.instance.attuned,
          proximityDm: proxDm,
          atmosphere: atmosphereRef.current,
          elapsedSeconds: elapsed,
          pulsePhase: pm.pulsePhase,
        });
        pm.group.rotation.z = morph.swayAngleRad;
        pm.group.scale.setScalar(morph.scaleFactor);
        for (const mat of pm.emissiveMaterials) {
          mat.emissiveIntensity = morph.emissiveIntensity;
        }
        (pm.haloRing.material as THREE.MeshBasicMaterial).opacity = morph.haloOpacity;
      }

      // Update Pooled Bioluminescent Particles
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        pX[i] += pVX[i] * dt;
        pY[i] += pVY[i] * dt;
        pZ[i] += pVZ[i] * dt;
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
        // Stage Approach 1: Live World Camera Tour / Parallax Pan over the Garden & Sanctuary Vista
        const tourAngle = elapsed * 0.14;
        const camX = Math.sin(tourAngle) * 7.5;
        const camZ = -4.0 - Math.cos(tourAngle * 0.5) * 6.0;
        const camY = groundHeightAt(camX, camZ) + 2.6;
        camera.position.set(camX, camY, camZ);
        camera.lookAt(0, groundHeightAt(0, -28) + 2.2, -28);
      } else if (currentState === 'playing') {
        // First-Person Exploration Controls
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

        if (player.guidedStroll) {
          const wp = SANCTUARY_TRAIL_WAYPOINTS[player.trailIndex % SANCTUARY_TRAIL_WAYPOINTS.length];
          const dx = wp.x - player.x;
          const dz = wp.z - player.z;
          const distToWp = Math.hypot(dx, dz);
          if (distToWp < 2.2) {
            player.trailIndex = (player.trailIndex + 1) % SANCTUARY_TRAIL_WAYPOINTS.length;
          } else {
            const desiredYaw = Math.atan2(-dx, -dz);
            const yawDiff = Math.atan2(Math.sin(desiredYaw - player.yaw), Math.cos(desiredYaw - player.yaw));
            player.yaw += yawDiff * Math.min(1, dt * 2.8);
            speedMetersPerSec = 4.2;
            player.x += (dx / distToWp) * speedMetersPerSec * dt;
            player.z += (dz / distToWp) * speedMetersPerSec * dt;
            isMoving = true;
          }
        } else {
          _forward.set(-Math.sin(player.yaw), 0, -Math.cos(player.yaw)).normalize();
          _right.set(Math.cos(player.yaw), 0, -Math.sin(player.yaw)).normalize();

          _moveVec.set(0, 0, 0);
          _moveVec.addScaledVector(_forward, moveForward);
          _moveVec.addScaledVector(_right, moveStrafe);

          isMoving = _moveVec.lengthSq() > 0.01;
          speedMetersPerSec = isMoving ? 6.4 : 0;

          if (isMoving) {
            _moveVec.normalize();
            const nextX = player.x + _moveVec.x * speedMetersPerSec * dt;
            const nextZ = player.z + _moveVec.z * speedMetersPerSec * dt;
            if (Math.hypot(nextX, nextZ) < 52) {
              player.x = nextX;
              player.z = nextZ;
            }
          }
        }

        if (isMoving) {
          const stepDist = speedMetersPerSec * dt;
          player.walkDist += stepDist;
          player.velocityDm = Math.min(30, Math.round(speedMetersPerSec * 2.2));
          if (player.actionHoldTimer <= 0) {
            player.action = 'stroll';
          }
          player.harmony = Math.min(100, player.harmony + dt * 0.85);
        } else {
          player.velocityDm = Math.max(0, Math.round(player.velocityDm * Math.exp(-8 * dt)));
          if (player.actionHoldTimer <= 0) {
            const b = biomeAt(player.x, player.z);
            player.action = b === 'sanctuary' && player.velocityDm === 0 ? 'stillness' : 'observe';
          }
        }

        if (player.actionHoldTimer > 0) {
          player.actionHoldTimer = Math.max(0, player.actionHoldTimer - dt);
        }

        // Evaluate 7-field Botanical Soundscape model continuously on live player state
        const currentBiome = biomeAt(player.x, player.z);
        const nearest = findNearestPlant(player.x, player.z, plantsRef.current);
        const attunedCount = plantMeshes.filter((m) => m.instance.attuned).length;
        const chorusState: ChorusStateId = nearest.plant.attuned || attunedCount >= 5 ? 'awakened' : 'dormant';
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

        // Update Web Audio Soundscape Engine with diurnal & harmony state
        soundEngine.updateMovement({
          biome: currentBiome,
          atmosphere: atmosphereRef.current,
          harmony: player.harmony,
          velocityDm: player.velocityDm,
          proximityDm: nearest.proximityDm,
          totalDistanceMeters: player.walkDist,
          outcome: player.lastOutcome,
          elapsedSeconds: elapsed,
        });

        // Smoothly interpolate biome + diurnal atmosphere sky, fog, star dome, and light intensities
        const biomeCfg = BIOME_CONFIGS[currentBiome];
        const atmosCfg = ATMOSPHERE_CONFIGS[atmosphereRef.current];
        const diurnalEval = evaluateDiurnalProfile(atmosphereRef.current, currentBiome, player.harmony);
        _targetSkyColor.set(biomeCfg.skyColor).lerp(_tempColor.set(atmosCfg.skyColor), 0.55);
        _targetFogColor.set(biomeCfg.fogColor).lerp(_tempColor.set(atmosCfg.fogColor), 0.55);
        (scene.background as THREE.Color).lerp(_targetSkyColor, 1 - Math.exp(-2.5 * dt));
        (scene.fog as THREE.FogExp2).color.lerp(_targetFogColor, 1 - Math.exp(-2.5 * dt));
        (scene.fog as THREE.FogExp2).density = THREE.MathUtils.damp(
          (scene.fog as THREE.FogExp2).density,
          diurnalEval.effectiveFogDensity,
          3.0,
          dt,
        );
        sunLight.intensity = THREE.MathUtils.damp(
          sunLight.intensity,
          diurnalEval.effectiveSunIntensity,
          3.0,
          dt,
        );
        hemiLight.intensity = THREE.MathUtils.damp(
          hemiLight.intensity,
          diurnalEval.effectiveHemiIntensity,
          3.0,
          dt,
        );
        starMat.opacity = THREE.MathUtils.damp(starMat.opacity, diurnalEval.starOpacity, 2.5, dt);
        starDome.position.set(player.x, 0, player.z);
        starDome.rotation.y = elapsed * 0.012;

        // Distance-synced head-bob gait
        const eyeHeight = 1.72;
        const bobOffset = isMoving ? Math.sin(player.walkDist * 2.6) * 0.055 : Math.sin(elapsed * 1.4) * 0.015;
        const groundY = groundHeightAt(player.x, player.z);

        camera.position.set(player.x, groundY + eyeHeight + bobOffset, player.z);
        camera.rotation.order = 'YXZ';
        camera.rotation.y = player.yaw;
        camera.rotation.x = player.pitch;
        camera.rotation.z = 0;

        emitTelemetry(false);
      }

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    // Start render loop
    frameId = requestAnimationFrame(tick);

    return () => {
      unmounted = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onWindowBlur);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', onResize);
      groundTex.dispose();
      terrainGeo.dispose();
      terrainMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 w-full h-full overflow-hidden bg-[#0b1612]"
      aria-label="3D Procedural Botanical Garden Viewport"
    />
  );
};
