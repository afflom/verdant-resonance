import * as THREE from 'three';
import {
  AtmosphereId,
  BOTANICAL_LIFECYCLE_STAGES,
  type BotanicalLifecycleStageId,
  GardenPlantInstance,
  PLANT_SPECIES_CONFIGS,
  evaluateHighDefinitionVisualSynthesis,
  getPlantLifecycleStage,
  synthesizeBotanicalOrganogenesis,
} from '../game/prismModel';
import type { SpectralDiurnalPalette } from '../game/spectralColorEngine';
import {
  type BotanicalShaderUniforms,
  type HighDefinitionPbrTextureSuite,
  createCordateLotusPadGeometry,
  createFlutedBellCorollaGeometry,
  createLogarithmicCrozierGeometry,
  createPinnateFrondGeometry,
  createSculptedPetalGeometry,
  enhanceMaterialWithBotanicalShader,
  synthesizeLSystemBotanicalMorphogenesis,
} from '../game/proceduralMeshEngine';

// Golden angle in radians (137.50776 degrees) for Fibonacci phyllotaxis
export const GOLDEN_ANGLE_RAD = 2.399963229728653;

const LOTUS_CUP_POINTS = [
  new THREE.Vector2(0.04, 0.0),
  new THREE.Vector2(0.32, 0.08),
  new THREE.Vector2(0.52, 0.26),
  new THREE.Vector2(0.58, 0.48),
];

export interface BotanicalBMeshSuite {
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

export type BotanicalOrganSlot = Exclude<keyof BotanicalBMeshSuite, 'subdivisions'>;

export interface AnimatedPlantRecord {
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
  singingVoiceGlow: number;
  singingCorollaImpulse: number;
}

/**
 * Deterministic coordinate-seeded oscillator phase in `[0, 2π)` so identical `#uorc=` shared gardens
 * initialize with identical Kuramoto phase alignment across sessions (`0` `Math.random`).
 */
export function computeDeterministicPlantPulsePhase(x: number, z: number): number {
  const s = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453;
  const frac = s - Math.floor(s);
  return frac * Math.PI * 2;
}

export function buildBotanicalBMeshSuite(
  bMeshSubdiv: number,
  specPalette: SpectralDiurnalPalette,
  isSoftwareGl: boolean,
): BotanicalBMeshSuite {
  const subdiv = isSoftwareGl ? 24 : Math.max(28, Math.min(64, Math.round(bMeshSubdiv)));
  const radPetal = Math.max(10, Math.round(subdiv * 0.36));
  const longPetal = Math.max(14, Math.round(subdiv * 0.52));
  return {
    subdivisions: subdiv,
    rosetteLeaf: createSculptedPetalGeometry({
      length: 0.92,
      maxWidth: 0.3,
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
      height: 0.6,
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
      scaleRadius: 0.3,
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
      ruffleAmplitude: 0.01,
      baseColorHex: '#fef08a',
      tipColorHex: '#ffffff',
      radialSegments: radPetal,
      longitudinalSegments: longPetal,
    }),
    orchidSepal: createSculptedPetalGeometry({
      length: 0.78,
      maxWidth: 0.24,
      curvature: 0.28,
      tipRecurve: -0.1,
      midribDepth: 0.02,
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
    lotusCupLathe: new THREE.LatheGeometry(LOTUS_CUP_POINTS, Math.max(20, subdiv)),
  };
}

export function registerSuiteGeometries(
  suite: BotanicalBMeshSuite,
  set: Set<THREE.BufferGeometry>,
): void {
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
}

export function disposeSuiteGeometries(
  suite: BotanicalBMeshSuite,
  set: Set<THREE.BufferGeometry>,
): void {
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
}

export function disposePlantGroup(
  group: THREE.Group,
  sharedGeometries: ReadonlySet<THREE.BufferGeometry>,
  sharedMaterials: ReadonlySet<THREE.Material>,
): void {
  const seenGeos = new Set<THREE.BufferGeometry>();
  group.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      if (
        mesh.geometry &&
        !sharedGeometries.has(mesh.geometry) &&
        !seenGeos.has(mesh.geometry)
      ) {
        seenGeos.add(mesh.geometry);
        mesh.geometry.dispose();
      }
      if (Array.isArray(mesh.material)) {
        for (const m of mesh.material) {
          if (m && !sharedMaterials.has(m)) m.dispose();
        }
      } else if (mesh.material && !sharedMaterials.has(mesh.material)) {
        mesh.material.dispose();
      }
    }
  });
}

export interface BuildConservatoryPlantParams {
  readonly plant: GardenPlantInstance;
  readonly atmosphere: AtmosphereId;
  readonly synapticWeight: number;
  readonly airyThinFilmSpanNm: number;
  readonly meanSynapticWeight: number;
  readonly isSoftwareGl: boolean;
  readonly activeBMeshSuite: BotanicalBMeshSuite;
  readonly cachedSpectralDiurnal: SpectralDiurnalPalette;
  readonly pbrSuite: HighDefinitionPbrTextureSuite;
  readonly shadowDiscGeo: THREE.BufferGeometry;
  readonly shadowDiscMat: THREE.Material;
  readonly holdfastCrystalGeos: readonly THREE.BufferGeometry[];
  readonly crystalQuartzMat: THREE.Material;
  readonly plantsRoot: THREE.Group;
}

/**
 * Synthesizes a 3-Joint Articulated Botanical Specimen (`basalJoint -> medialJoint -> apicalJoint`)
 * with L-System + Murray r³ vascular proportions, cuticular Airy thin-film iridescence, and shape-key morphs.
 */
export function buildConservatoryPlantGroup(
  params: BuildConservatoryPlantParams,
): AnimatedPlantRecord {
  const {
    plant,
    atmosphere,
    synapticWeight,
    airyThinFilmSpanNm,
    meanSynapticWeight,
    isSoftwareGl,
    activeBMeshSuite,
    cachedSpectralDiurnal,
    pbrSuite,
    shadowDiscGeo,
    shadowDiscMat,
    holdfastCrystalGeos,
    crystalQuartzMat,
    plantsRoot,
  } = params;

  const cfg = PLANT_SPECIES_CONFIGS[plant.species];
  const group = new THREE.Group();
  group.position.set(plant.x, plant.y, plant.z);
  group.rotation.y = plant.rotationY;
  group.scale.setScalar(plant.scale);

  const shadowDisc = new THREE.Mesh(shadowDiscGeo, shadowDiscMat);
  shadowDisc.position.y = 0.015;
  group.add(shadowDisc);

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

  const substrate = plant.substrate ?? 'terrestrial-loam';
  const initStage = getPlantLifecycleStage(plant);
  const organogenesis = synthesizeBotanicalOrganogenesis({
    biome: plant.biome,
    species: plant.species,
    substrate,
    atmosphere,
    attuned: plant.attuned,
  });
  const hdSynthesis = evaluateHighDefinitionVisualSynthesis({
    biome: plant.biome,
    species: plant.species,
    substrate,
    atmosphere,
    attuned: plant.attuned,
    lifecycleStage: initStage,
    neuromorphicWeight: synapticWeight,
  });

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
      hdSynthesis.iridescenceThinFilmMinNm + airyThinFilmSpanNm * 0.65,
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
    humusMound.scale.set(1.15, 0.3, 1.15);
    humusMound.position.y = 0.02;
    holdfastGroup.add(humusMound);

    const rootTendrilGeo = new THREE.CylinderGeometry(0.018, 0.036, 0.4, 8);
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
        const cMesh = new THREE.Mesh(cGeo, crystalQuartzMat);
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
      hdSynthesis.iridescenceThinFilmMinNm + airyThinFilmSpanNm * 0.65,
    ),
    side: THREE.DoubleSide,
  });

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
  let localApicalCrownY = 0.08;
  const morph = synthesizeLSystemBotanicalMorphogenesis({
    species: plant.species,
    lifecycleStage: initStage,
    busWeight: Math.round(meanSynapticWeight),
  });

  if (plant.species === 'chime-lily') {
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
    const pedicelTilt = 0.82;
    const tipX = pedicelLen * Math.sin(pedicelTilt);
    const tipY = pedicelLen * Math.cos(pedicelTilt);

    for (let b = 0; b < morph.primaryBranchCount; b++) {
      const branchAngle = (b / morph.primaryBranchCount) * Math.PI * 2 + 0.3;
      const attachY = 0.2 + (b / Math.max(1, morph.primaryBranchCount - 1)) * 0.72;

      const branchGroup = new THREE.Group();
      branchGroup.position.set(0, attachY, 0);
      branchGroup.rotation.y = -branchAngle;

      const nodeBract = new THREE.Mesh(new THREE.SphereGeometry(0.068, 10, 8), stemMat);
      branchGroup.add(nodeBract);

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
    localApicalCrownY = 0.06;
  } else if (plant.species === 'pulse-fern') {
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
      frond.position.set(0, 0, 0.03);
      frond.rotation.x = 0.36 + (i % 3) * 0.08;
      frondSocket.add(frond);
      medialJoint.add(frondSocket);
      fronds.push(frond);
    }

    apicalJoint.position.y = 1.32;
    const apicalNode = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 10), stemMat);
    apicalJoint.add(apicalNode);

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
    localApicalCrownY = 0.04;
  } else if (plant.species === 'echo-lotus') {
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
    localApicalCrownY = 0.26;
  } else if (plant.species === 'drone-moss') {
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

      const stalkLocalY = cushionY + 0.02 - 0.12;
      const stalk = new THREE.Mesh(setaGeo, stemMat);
      stalk.position.set(cx, stalkLocalY, cz);
      medialJoint.add(stalk);
      stalks.push(stalk);

      const capsule = createOrganMesh('bellCorolla', accentMat);
      capsule.scale.setScalar(0.28);
      capsule.position.set(cx, stalkLocalY + 0.54, cz);
      const operculumCap = new THREE.Mesh(new THREE.ConeGeometry(0.45, 0.36, 16), stemMat);
      operculumCap.position.y = 0.72;
      capsule.add(operculumCap);
      medialJoint.add(capsule);
      capsules.push(capsule);
    }
    localApicalCrownY = 0.14;
  } else {
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

    medialJoint.position.y = 0.9;
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

    apicalJoint.position.y = 0.9;
    const starHead = new THREE.Group();

    const receptacleHub = new THREE.Mesh(new THREE.SphereGeometry(0.095, 14, 12), stemMat);
    receptacleHub.scale.set(1.0, 1.0, 1.25);
    receptacleHub.position.set(0, 0, 0.02);
    starHead.add(receptacleHub);

    for (let i = 0; i < morph.primaryBranchCount; i++) {
      const a = (i / morph.primaryBranchCount) * Math.PI * 2;
      const petal = createOrganMesh('orchidSepal', bloomMat);
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

    const labellum = createOrganMesh('bellCorolla', accentMat);
    labellum.scale.setScalar(0.52);
    labellum.rotation.x = Math.PI / 2;
    labellum.position.set(0, 0, 0.02);
    starHead.add(labellum);

    const gynostemiumColumn = new THREE.Mesh(
      new THREE.CylinderGeometry(0.026, 0.038, 0.24, 10),
      stemMat,
    );
    gynostemiumColumn.rotation.x = Math.PI / 2;
    gynostemiumColumn.position.set(0, 0, 0.12);
    starHead.add(gynostemiumColumn);

    const polliniaCap = new THREE.Mesh(new THREE.SphereGeometry(0.052, 12, 10), accentMat);
    polliniaCap.position.set(0, 0, 0.24);
    starHead.add(polliniaCap);

    apicalJoint.add(starHead);
    starHeadRef = starHead;
    localApicalCrownY = 0.06;
  }

  const fruitingCrown = new THREE.Group();
  fruitingCrown.position.y = localApicalCrownY;
  const crownPearlMat = new THREE.MeshStandardMaterial({
    color: 0xfef08a,
    emissive: 0xf59e0b,
    emissiveIntensity: 1.35,
    roughness: 0.15,
    metalness: 0.55,
  });
  const crownReceptacle = new THREE.Mesh(new THREE.SphereGeometry(0.048, 10, 8), stemMat);
  fruitingCrown.add(crownReceptacle);

  const crownStem = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.032, 0.16, 8), stemMat);
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
    pulsePhase: computeDeterministicPlantPulsePhase(plant.x, plant.z),
    tactileShiverImpulse: 0,
    singingVoiceGlow: 0,
    singingCorollaImpulse: 0,
  };
}
