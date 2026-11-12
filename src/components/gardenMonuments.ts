import * as THREE from 'three';
import {
  MIRROR_LAGOON_WATER_SURFACE_Y,
  groundHeightAt,
  type ObserverInorganicRealmModel,
} from '../game/prismModel';
import {
  ALL_14_BRAVAIS_CRYSTAL_HABITS,
  createBravaisCrystalHabitGeometry,
  createFlutedEntasisPillarGeometry,
  createHexagonalQuartzCrystalGeometry,
  createObserverAstrolabeCrownGeometry,
  createSegmentedBambooStalkGeometry,
} from '../game/proceduralMeshEngine';

export interface SanctuaryMonumentRig {
  readonly group: THREE.Group;
  readonly spire: THREE.Mesh;
  readonly orbitRing: THREE.Group;
  readonly innerGimbalRing: THREE.Group;
  readonly observerCrown: THREE.Mesh;
  readonly crownMat: THREE.MeshPhysicalMaterial;
}

export interface MeadowMonumentRig {
  readonly group: THREE.Group;
  readonly sunOrb: THREE.Mesh;
  readonly sunOrbPivot: THREE.Group;
}

export interface GroveMonumentRig {
  readonly group: THREE.Group;
  readonly chimeTubes: THREE.Object3D[];
  readonly clapperPivot: THREE.Group;
  readonly jadeWoodMat: THREE.MeshStandardMaterial;
}

export interface CrystalMonumentRig {
  readonly group: THREE.Group;
  readonly torsionPendulumGroup: THREE.Group;
  readonly corePrism: THREE.Mesh;
  readonly quartzMat: THREE.MeshPhysicalMaterial;
}

export interface WetlandMonumentRig {
  readonly group: THREE.Group;
  readonly lanternOrbs: THREE.Mesh[];
  readonly lanternMat: THREE.MeshStandardMaterial;
  readonly pierLakebedHeightsY: number[];
}

export interface SharedMonumentMaterials {
  readonly sharedStoneMat: THREE.MeshStandardMaterial;
  readonly sharedGoldTrimMat: THREE.MeshStandardMaterial;
  readonly sharedCrystalMat: THREE.MeshPhysicalMaterial;
}

/**
 * Monument 1 (Sanctuary): Classical Harmonic Rotunda & Orthogonal Cardan Double-Gimbal (`weldGapMeters === 0`).
 */
export function buildSanctuaryPavilion(
  sanctSpec: NonNullable<ObserverInorganicRealmModel['monuments']['sanctuary']['sanctuary']>,
  materials: SharedMonumentMaterials,
): SanctuaryMonumentRig {
  const { sharedStoneMat, sharedGoldTrimMat, sharedCrystalMat } = materials;
  const group = new THREE.Group();
  const [sx, sz] = sanctSpec.centerXZ;
  const sy = groundHeightAt(sx, sz);
  group.position.set(sx, sy, sz);

  const skirtDepth = 0.48;
  const step1H = skirtDepth + sanctSpec.plinthTopY * 0.34;
  const step2H = sanctSpec.plinthTopY * 0.34;
  const step3H = sanctSpec.plinthTopY * 0.32;

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

    const pillar = new THREE.Mesh(pillarGeo, sharedStoneMat);
    pillar.position.set(px, pillarMidY, pz);
    group.add(pillar);

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

    const strut = new THREE.Mesh(radialStrutGeo, sharedStoneMat);
    strut.position.set(
      Math.cos(angle) * sanctSpec.radialStrutMidRadius,
      sanctSpec.haloElevationY,
      Math.sin(angle) * sanctSpec.radialStrutMidRadius,
    );
    strut.rotation.y = -angle;
    group.add(strut);
  }

  const haloRing = new THREE.Mesh(
    new THREE.TorusGeometry(sanctSpec.colonnadeRadius, sanctSpec.haloTubeRadius * 1.05, 18, 56),
    sharedGoldTrimMat,
  );
  haloRing.rotation.x = Math.PI / 2;
  haloRing.position.y = sanctSpec.haloElevationY;
  group.add(haloRing);

  const innerCupolaRing = new THREE.Mesh(
    new THREE.TorusGeometry(sanctSpec.innerCupolaRadius, 0.14, 16, 40),
    sharedGoldTrimMat,
  );
  innerCupolaRing.rotation.x = Math.PI / 2;
  innerCupolaRing.position.y = sanctSpec.haloElevationY;
  group.add(innerCupolaRing);

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
      new THREE.CylinderGeometry(0.1, 0.14, forkArmH, 16),
      sharedGoldTrimMat,
    );
    forkArm.position.set(
      side * (yokeSpan * 0.5),
      (sanctSpec.yokeElevationY + sanctSpec.gimbalCenterY) * 0.5,
      0,
    );
    group.add(forkArm);

    const trunnionBearing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.15, 0.28, 16),
      sharedGoldTrimMat,
    );
    trunnionBearing.rotation.z = Math.PI / 2;
    trunnionBearing.position.set(side * (orbitRadius + 0.03), sanctSpec.gimbalCenterY, 0);
    group.add(trunnionBearing);
  }

  // True 4-Level Hierarchical Cardan Double-Gimbal Assembly (`group -> orbitRing -> innerGimbalRing -> spireCradle -> spire`)
  const orbitRing = new THREE.Group();
  orbitRing.position.y = sanctSpec.gimbalCenterY;
  const orbitTorus = new THREE.Mesh(
    new THREE.TorusGeometry(orbitRadius, 0.08, 16, 56),
    sharedGoldTrimMat,
  );
  orbitTorus.rotation.x = Math.PI / 2;
  orbitRing.add(orbitTorus);

  for (const side of [-1, 1] as const) {
    const gimbalAxle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.048, 0.048, 0.28, 12),
      sharedGoldTrimMat,
    );
    gimbalAxle.rotation.z = Math.PI / 2;
    gimbalAxle.position.set(side * (orbitRadius + 0.03), 0, 0);
    orbitRing.add(gimbalAxle);
  }

  const innerGimbalRadius = sanctSpec.innerCupolaRadius * 1.174;
  const zBridgeSpan = orbitRadius - innerGimbalRadius + 0.09;
  const zBridgeMid = (orbitRadius + innerGimbalRadius) * 0.5;
  for (const side of [-1, 1] as const) {
    const zJournalHousing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.075, 0.075, 0.22, 14),
      sharedGoldTrimMat,
    );
    zJournalHousing.rotation.x = Math.PI / 2;
    zJournalHousing.position.set(0, 0, side * orbitRadius);
    orbitRing.add(zJournalHousing);

    const zTrunnionPin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.042, 0.042, zBridgeSpan, 12),
      sharedGoldTrimMat,
    );
    zTrunnionPin.rotation.x = Math.PI / 2;
    zTrunnionPin.position.set(0, 0, side * zBridgeMid);
    orbitRing.add(zTrunnionPin);
  }

  const innerGimbalRing = new THREE.Group();
  const innerTorus = new THREE.Mesh(
    new THREE.TorusGeometry(innerGimbalRadius, 0.065, 14, 48),
    sharedGoldTrimMat,
  );
  innerTorus.rotation.x = Math.PI / 2;
  innerGimbalRing.add(innerTorus);

  const spireCradle = new THREE.Group();
  const cradleCollarRadius = 0.68;
  const xArmSpan = innerGimbalRadius - cradleCollarRadius + 0.08;
  const xArmMid = (innerGimbalRadius + cradleCollarRadius) * 0.5;
  for (const side of [-1, 1] as const) {
    const xBridgeArm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.038, 0.044, xArmSpan, 12),
      sharedGoldTrimMat,
    );
    xBridgeArm.rotation.z = Math.PI / 2;
    xBridgeArm.position.set(side * xArmMid, 0, 0);
    innerGimbalRing.add(xBridgeArm);
  }

  const cradleCollar = new THREE.Mesh(
    new THREE.CylinderGeometry(cradleCollarRadius, cradleCollarRadius * 0.95, 0.28, 24),
    sharedGoldTrimMat,
  );
  spireCradle.add(cradleCollar);
  for (let p = 0; p < 6; p++) {
    const pa = (p / 6) * Math.PI * 2;
    const prong = new THREE.Mesh(
      new THREE.CylinderGeometry(0.028, 0.048, 0.56, 10),
      sharedGoldTrimMat,
    );
    prong.position.set(Math.cos(pa) * 0.64, 0.22, Math.sin(pa) * 0.64);
    prong.rotation.z = -Math.cos(pa) * 0.16;
    prong.rotation.x = Math.sin(pa) * 0.16;
    spireCradle.add(prong);
  }
  innerGimbalRing.add(spireCradle);

  const spireGeo = createHexagonalQuartzCrystalGeometry({
    radius: 0.62,
    height: 2.72,
    doubleTerminated: true,
  });
  const spire = new THREE.Mesh(spireGeo, sharedCrystalMat);
  spireCradle.add(spire);
  orbitRing.add(innerGimbalRing);
  group.add(orbitRing);

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
}

/**
 * Monument 2 (Sunlit Meadow): Astronomical Solar Meridian Sundial & Wind Radiometer (`weldGapMeters === 0`).
 */
export function buildMeadowSundial(
  meadowSpec: NonNullable<ObserverInorganicRealmModel['monuments']['meadow']['meadow']>,
  materials: SharedMonumentMaterials,
): MeadowMonumentRig {
  const { sharedStoneMat, sharedGoldTrimMat, sharedCrystalMat } = materials;
  const group = new THREE.Group();
  const [mx, mz] = meadowSpec.centerXZ;
  const my = groundHeightAt(mx, mz);
  group.position.set(mx, my, mz);

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

  const compassRing = new THREE.Mesh(
    new THREE.RingGeometry(meadowSpec.dialRadius * 0.6, meadowSpec.dialRadius * 0.82, 40),
    sharedGoldTrimMat,
  );
  compassRing.rotation.x = -Math.PI / 2;
  compassRing.position.y = dialFaceY;
  group.add(compassRing);

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
    voluteCap.rotation.x = Math.PI / 2;
    voluteCap.position.set(side * meadowSpec.buttressOffsetX, meadowSpec.dialTopY + 0.32, 0);
    group.add(voluteCap);
  }

  const gnomonArch = new THREE.Mesh(
    new THREE.TorusGeometry(meadowSpec.archRadius, meadowSpec.archTubeRadius * 1.08, 16, 48, Math.PI),
    sharedGoldTrimMat,
  );
  gnomonArch.position.y = meadowSpec.dialTopY;
  group.add(gnomonArch);

  const meridianArch = new THREE.Mesh(
    new THREE.TorusGeometry(meadowSpec.archRadius, meadowSpec.archTubeRadius * 0.92, 14, 48, Math.PI),
    sharedGoldTrimMat,
  );
  meridianArch.rotation.y = Math.PI / 2;
  meridianArch.position.y = meadowSpec.dialTopY;
  group.add(meridianArch);

  for (const zSide of [-1, 1] as const) {
    const meridianFoot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.24, 0.28, 14),
      sharedGoldTrimMat,
    );
    meridianFoot.position.set(0, meadowSpec.dialTopY + 0.08, zSide * meadowSpec.archRadius);
    group.add(meridianFoot);
  }

  const archCrownY = meadowSpec.dialTopY + meadowSpec.archRadius;
  const zenithBoss = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.22, 0.18, 18),
    sharedGoldTrimMat,
  );
  zenithBoss.position.set(0, archCrownY, 0);
  group.add(zenithBoss);

  const zenithSpindleH = Math.max(0.14, meadowSpec.sunOrbPivotY - archCrownY + 0.06);
  const zenithSpindle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.036, 0.048, zenithSpindleH, 12),
    sharedGoldTrimMat,
  );
  zenithSpindle.position.set(0, (archCrownY + meadowSpec.sunOrbPivotY) * 0.5, 0);
  group.add(zenithSpindle);

  const gnomonFootZ = -meadowSpec.archRadius * 0.92;
  const gnomonTopZ = -meadowSpec.archRadius * 0.34;
  const gnomonTopY =
    meadowSpec.dialTopY +
    Math.sqrt(Math.max(0.1, meadowSpec.archRadius * meadowSpec.archRadius - gnomonTopZ * gnomonTopZ));
  const gnomonDz = gnomonTopZ - gnomonFootZ;
  const gnomonDy = gnomonTopY - meadowSpec.dialTopY;
  const gnomonStyleLen = Math.hypot(gnomonDz, gnomonDy) + 0.08;
  const gnomonBlade = new THREE.Mesh(
    new THREE.CylinderGeometry(0.036, 0.062, gnomonStyleLen, 14),
    sharedGoldTrimMat,
  );
  gnomonBlade.rotation.x = Math.atan2(gnomonDz, gnomonDy);
  gnomonBlade.position.set(0, meadowSpec.dialTopY + gnomonDy * 0.5, gnomonFootZ + gnomonDz * 0.5);
  group.add(gnomonBlade);

  const sunOrbPivot = new THREE.Group();
  sunOrbPivot.position.set(0, meadowSpec.sunOrbPivotY, 0);

  const collar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.12, 0.16, 16),
    sharedGoldTrimMat,
  );
  sunOrbPivot.add(collar);

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

    const cup = new THREE.Mesh(
      new THREE.SphereGeometry(0.075, 12, 10, 0, Math.PI),
      sharedGoldTrimMat,
    );
    cup.position.set(Math.cos(ca) * 0.38, 0, Math.sin(ca) * 0.38);
    cup.rotation.y = ca + Math.PI / 2;
    sunOrbPivot.add(cup);
  }

  const sunOrb = new THREE.Mesh(
    createBravaisCrystalHabitGeometry({ habit: 'cP-pyrite', radius: 0.28 }),
    sharedCrystalMat,
  );
  sunOrb.position.set(0, 0.16, 0);
  sunOrbPivot.add(sunOrb);
  group.add(sunOrbPivot);

  return { group, sunOrb, sunOrbPivot };
}

/**
 * Monument 3 (Bamboo Chime Grove): Wind-Carved Bamboo Pergola & Compound Chimes (`weldGapMeters === 0`).
 */
export function buildGrovePergola(
  groveSpec: NonNullable<ObserverInorganicRealmModel['monuments']['grove']['grove']>,
  materials: SharedMonumentMaterials,
): GroveMonumentRig {
  const { sharedStoneMat, sharedGoldTrimMat } = materials;
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

  for (const [ox, oz] of offsets) {
    const footing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.38, 0.48, 0.56, 18),
      sharedStoneMat,
    );
    footing.position.set(ox, -0.16, oz);
    group.add(footing);

    const shoe = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.32, 0.18, 16),
      sharedGoldTrimMat,
    );
    shoe.position.set(ox, 0.16, oz);
    group.add(shoe);

    const post = new THREE.Mesh(postGeo, jadeWoodMat);
    post.position.set(ox, groveSpec.roofElevationY - groveSpec.postHeight + 0.08, oz);
    group.add(post);

    const capital = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.26, 0.36, 16),
      sharedGoldTrimMat,
    );
    capital.position.set(ox, groveSpec.roofElevationY, oz);
    group.add(capital);
  }

  const roofRing = new THREE.Mesh(
    new THREE.TorusGeometry(groveSpec.outerRoofRingRadius, 0.18, 14, 48),
    jadeWoodMat,
  );
  roofRing.rotation.x = Math.PI / 2;
  roofRing.position.y = groveSpec.roofElevationY;
  group.add(roofRing);

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

  const diagBeamGeo = new THREE.CylinderGeometry(0.1, 0.1, groveSpec.diagonalTieLength, 12);
  diagBeamGeo.rotateZ(Math.PI / 2);
  for (const diagAngle of [Math.PI / 4, -Math.PI / 4]) {
    const dBeam = new THREE.Mesh(diagBeamGeo, jadeWoodMat);
    dBeam.position.set(0, groveSpec.roofElevationY, 0);
    dBeam.rotation.y = diagAngle;
    group.add(dBeam);
  }

  const chimeSuspensionRing = new THREE.Mesh(
    new THREE.TorusGeometry(groveSpec.chimeRingRadius, 0.1, 12, 36),
    sharedGoldTrimMat,
  );
  chimeSuspensionRing.rotation.x = Math.PI / 2;
  chimeSuspensionRing.position.y = groveSpec.roofElevationY;
  group.add(chimeSuspensionRing);

  const centerBoss = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.2, 0.26, 16),
    sharedGoldTrimMat,
  );
  centerBoss.position.y = groveSpec.roofElevationY;
  group.add(centerBoss);

  const clapperPivot = new THREE.Group();
  clapperPivot.position.set(0, groveSpec.roofElevationY, 0);
  const strikerY = -(0.28 + groveSpec.chimeBaseLength * 0.42);
  const strikerRadius = Math.max(0.45, groveSpec.chimeRingRadius - 0.16);

  const clapperCord = new THREE.Mesh(
    new THREE.CylinderGeometry(0.014, 0.014, Math.abs(strikerY), 8),
    sharedGoldTrimMat,
  );
  clapperCord.position.y = strikerY * 0.5;
  clapperPivot.add(clapperCord);

  const strikerRing = new THREE.Mesh(
    new THREE.TorusGeometry(strikerRadius, 0.026, 10, 36),
    sharedGoldTrimMat,
  );
  strikerRing.rotation.x = Math.PI / 2;
  strikerRing.position.y = strikerY;
  clapperPivot.add(strikerRing);

  for (let sp = 0; sp < groveSpec.chimeCount; sp++) {
    const spa = (sp / groveSpec.chimeCount) * Math.PI * 2;
    const spoke = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.016, strikerRadius, 8),
      sharedGoldTrimMat,
    );
    spoke.rotation.z = Math.PI / 2;
    spoke.rotation.y = -spa;
    spoke.position.set(
      Math.cos(spa) * strikerRadius * 0.5,
      strikerY,
      Math.sin(spa) * strikerRadius * 0.5,
    );
    clapperPivot.add(spoke);

    const strikerBead = new THREE.Mesh(
      new THREE.SphereGeometry(0.048, 12, 10),
      sharedGoldTrimMat,
    );
    strikerBead.position.set(
      Math.cos(spa) * strikerRadius,
      strikerY,
      Math.sin(spa) * strikerRadius,
    );
    clapperPivot.add(strikerBead);
  }

  const vaneCord = new THREE.Mesh(
    new THREE.CylinderGeometry(0.01, 0.01, 0.58, 8),
    sharedGoldTrimMat,
  );
  vaneCord.position.y = strikerY - 0.29;
  clapperPivot.add(vaneCord);

  const windSailVane = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.52, 0.028), jadeWoodMat);
  windSailVane.position.y = strikerY - 0.62;
  windSailVane.rotation.y = Math.PI / 6;
  clapperPivot.add(windSailVane);
  group.add(clapperPivot);

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

  return { group, chimeTubes, clapperPivot, jadeWoodMat };
}

/**
 * Monument 4 (Crystal Cavern Basin): Prismatic Geode Archway with 100% Spire Closure (`weldGapMeters === 0`).
 */
export function buildCrystalArchway(
  crystalSpec: NonNullable<ObserverInorganicRealmModel['monuments']['crystal']['crystal']>,
  airyThinFilmSpanNm: number,
  materials: SharedMonumentMaterials,
): CrystalMonumentRig {
  const { sharedStoneMat, sharedGoldTrimMat } = materials;
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
    iridescenceThicknessMaximum: 240 + airyThinFilmSpanNm,
  });

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

  const ribDx = crystalSpec.keystoneRingRadius - crystalSpec.baseRingRadius;
  const ribDy = crystalSpec.keystoneElevationY + 0.1;
  const ribChordLen = Math.hypot(ribDx, ribDy);
  const ribTiltZ = Math.atan2(-ribDx, ribDy);

  for (let i = 0; i < crystalSpec.spireCount; i++) {
    const a = (i / crystalSpec.spireCount) * Math.PI * 2;
    const spireHabitGeo = createHexagonalQuartzCrystalGeometry({
      radius: 0.28,
      height: ribChordLen + 0.18,
      doubleTerminated: false,
    });
    const spireSocket = new THREE.Group();
    spireSocket.position.set(
      Math.cos(a) * crystalSpec.baseRingRadius,
      0,
      Math.sin(a) * crystalSpec.baseRingRadius,
    );
    spireSocket.rotation.y = -a;

    const basePlinthSocket = new THREE.Mesh(
      new THREE.CylinderGeometry(0.36, 0.44, 0.38, 6),
      sharedStoneMat,
    );
    basePlinthSocket.position.set(0, 0.12, 0);
    spireSocket.add(basePlinthSocket);

    const spire = new THREE.Mesh(spireHabitGeo, quartzMat);
    spire.position.set(0, -0.1, 0);
    spire.rotation.z = ribTiltZ;
    spire.scale.setScalar(1.0);
    spireSocket.add(spire);

    const keystoneSocketCuff = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.28, 0.22, 6),
      sharedGoldTrimMat,
    );
    keystoneSocketCuff.position.set(ribDx, crystalSpec.keystoneElevationY, 0);
    keystoneSocketCuff.rotation.z = ribTiltZ;
    spireSocket.add(keystoneSocketCuff);

    group.add(spireSocket);
  }

  const keystoneRing = new THREE.Mesh(
    new THREE.TorusGeometry(crystalSpec.keystoneRingRadius, 0.18, 12, crystalSpec.spireCount * 3),
    quartzMat,
  );
  keystoneRing.rotation.x = Math.PI / 2;
  keystoneRing.position.y = crystalSpec.keystoneElevationY;
  group.add(keystoneRing);

  for (let k = 0; k < crystalSpec.spireCount; k++) {
    const ka = (k / crystalSpec.spireCount) * Math.PI * 2;
    const spiderSpoke = new THREE.Mesh(
      new THREE.CylinderGeometry(0.032, 0.042, crystalSpec.keystoneRingRadius, 8),
      sharedGoldTrimMat,
    );
    spiderSpoke.rotation.z = Math.PI / 2;
    spiderSpoke.rotation.y = -ka;
    spiderSpoke.position.set(
      Math.cos(ka) * crystalSpec.keystoneRingRadius * 0.5,
      crystalSpec.keystoneElevationY,
      Math.sin(ka) * crystalSpec.keystoneRingRadius * 0.5,
    );
    group.add(spiderSpoke);
  }

  const keystoneSpiderBoss = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.18, 0.24, 12),
    sharedGoldTrimMat,
  );
  keystoneSpiderBoss.position.set(0, crystalSpec.keystoneElevationY, 0);
  group.add(keystoneSpiderBoss);

  const basalCluster = new THREE.Mesh(
    createBravaisCrystalHabitGeometry({
      habit: 'cI-garnet',
      radius: 0.62,
      height: 0.85,
    }),
    sharedStoneMat,
  );
  basalCluster.position.y = 0.38;
  group.add(basalCluster);

  const torsionPendulumGroup = new THREE.Group();
  torsionPendulumGroup.position.set(0, crystalSpec.keystoneElevationY, 0);

  const suspensionCordLen = Math.max(
    0.75,
    crystalSpec.keystoneElevationY - crystalSpec.corePrismElevationY - 0.72,
  );
  const suspensionCord = new THREE.Mesh(
    new THREE.CylinderGeometry(0.016, 0.016, suspensionCordLen, 8),
    sharedGoldTrimMat,
  );
  suspensionCord.position.y = -suspensionCordLen * 0.5;
  torsionPendulumGroup.add(suspensionCord);

  const upperPrismBezel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.22, 0.18, 6),
    sharedGoldTrimMat,
  );
  upperPrismBezel.position.y = -suspensionCordLen - 0.06;
  torsionPendulumGroup.add(upperPrismBezel);

  const corePrismGeo = createHexagonalQuartzCrystalGeometry({
    radius: 0.42,
    height: 1.56,
    doubleTerminated: true,
  });
  const corePrism = new THREE.Mesh(corePrismGeo, quartzMat);
  corePrism.position.y = -suspensionCordLen - 0.78;
  torsionPendulumGroup.add(corePrism);
  group.add(torsionPendulumGroup);

  return { group, torsionPendulumGroup, corePrism, quartzMat };
}

/**
 * Monument 5 (Bioluminescent Wetland): Lakebed-Embedded Tōrō Lantern Piers (`0m` mid-water floating gap).
 */
export function buildWetlandLanterns(
  wetlandSpec: NonNullable<ObserverInorganicRealmModel['monuments']['wetland']['wetland']>,
  materials: SharedMonumentMaterials,
): WetlandMonumentRig {
  const { sharedStoneMat, sharedGoldTrimMat } = materials;
  const group = new THREE.Group();
  group.position.set(
    wetlandSpec.centerXZ[0],
    MIRROR_LAGOON_WATER_SURFACE_Y,
    wetlandSpec.centerXZ[1],
  );
  const lanternOrbs: THREE.Mesh[] = [];
  const pierLakebedHeightsY: number[] = [];
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

    const lakebedY = groundHeightAt(wetlandSpec.centerXZ[0] + lx, wetlandSpec.centerXZ[1] + lz);
    pierLakebedHeightsY.push(lakebedY);
    const embedMeters = 0.32;
    const pilingTotalH = Math.max(
      0.65,
      MIRROR_LAGOON_WATER_SURFACE_Y - lakebedY + embedMeters + 0.12,
    );
    const pierPiling = new THREE.Mesh(
      new THREE.CylinderGeometry(
        wetlandSpec.padRadius * 0.88,
        wetlandSpec.padRadius * 1.15,
        pilingTotalH,
        16,
      ),
      sharedStoneMat,
    );
    pierPiling.position.y =
      lakebedY - embedMeters + pilingTotalH * 0.5 - MIRROR_LAGOON_WATER_SURFACE_Y;
    lanternUnit.add(pierPiling);

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

    const saoShaftH = Math.max(0.4, wetlandSpec.chamberDeckY - 0.2);
    const saoShaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.23, saoShaftH, 12),
      sharedStoneMat,
    );
    saoShaft.position.y = 0.2 + saoShaftH * 0.5;
    lanternUnit.add(saoShaft);

    const saoMidBand = new THREE.Mesh(
      new THREE.TorusGeometry(0.215, 0.032, 10, 20),
      sharedGoldTrimMat,
    );
    saoMidBand.rotation.x = Math.PI / 2;
    saoMidBand.position.y = 0.2 + saoShaftH * 0.5;
    lanternUnit.add(saoMidBand);

    const chudaiLotusBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.48, 0.24, 0.14, 6),
      sharedStoneMat,
    );
    chudaiLotusBase.position.y = wetlandSpec.chamberDeckY - 0.06;
    lanternUnit.add(chudaiLotusBase);

    const chamberDeck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.44, 0.36, 0.08, 6),
      sharedGoldTrimMat,
    );
    chamberDeck.position.y = wetlandSpec.chamberDeckY + 0.02;
    lanternUnit.add(chamberDeck);

    const strutMidY = (wetlandSpec.chamberDeckY + wetlandSpec.pagodaRoofY) * 0.5 - 0.04;
    for (let s = 0; s < 6; s++) {
      const sa = (s / 6) * Math.PI * 2;
      const strut = new THREE.Mesh(
        new THREE.CylinderGeometry(0.024, 0.024, wetlandSpec.frameStrutHeight, 8),
        sharedGoldTrimMat,
      );
      strut.position.set(Math.cos(sa) * 0.3, strutMidY, Math.sin(sa) * 0.3);
      lanternUnit.add(strut);
    }

    const lotusCup = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.15, 0.11, 12),
      sharedGoldTrimMat,
    );
    lotusCup.position.y = wetlandSpec.orbCenterY - wetlandSpec.orbRadius - 0.04;
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

    const pagodaRoofLower = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.64, 0.16, 6),
      sharedStoneMat,
    );
    pagodaRoofLower.position.y = wetlandSpec.pagodaRoofY;
    lanternUnit.add(pagodaRoofLower);

    const pagodaRoofUpper = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.4, 0.14, 6),
      sharedStoneMat,
    );
    pagodaRoofUpper.position.y = wetlandSpec.pagodaRoofY + 0.15;
    lanternUnit.add(pagodaRoofUpper);

    const finial = new THREE.Mesh(new THREE.SphereGeometry(0.085, 12, 10), sharedGoldTrimMat);
    finial.position.y = wetlandSpec.pagodaRoofY + 0.28;
    lanternUnit.add(finial);

    group.add(lanternUnit);
  }
  return { group, lanternOrbs, lanternMat, pierLakebedHeightsY };
}

/**
 * Enables crisp grounded architectural shadow casting & reception across opaque monument meshes.
 */
export function enableMonumentShadows(groups: readonly THREE.Group[]): void {
  for (let m = 0; m < groups.length; m++) {
    groups[m].traverse((obj) => {
      if (obj instanceof THREE.Mesh && obj.material && !(obj.material as THREE.Material).transparent) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
  }
}

/**
 * Disposes all unique geometries owned by a monument group while skipping shared materials.
 */
export function disposeMonumentGroup(
  group: THREE.Group,
  preservedMaterials: ReadonlySet<THREE.Material>,
): void {
  const seenGeos = new Set<THREE.BufferGeometry>();
  group.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      if (child.geometry && !seenGeos.has(child.geometry)) {
        seenGeos.add(child.geometry);
        child.geometry.dispose();
      }
      if (Array.isArray(child.material)) {
        for (const m of child.material) {
          if (m && !preservedMaterials.has(m)) m.dispose();
        }
      } else if (child.material && !preservedMaterials.has(child.material)) {
        child.material.dispose();
      }
    }
  });
}
