import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ATMOSPHERE_CONFIGS,
  BIOME_CONSTELLATIONS,
  BIOME_LANDSCAPE_TERRACES,
  BIOME_MONUMENTS,
  BOTANICAL_LIFECYCLE_STAGES,
  DIURNAL_CELESTIAL_VECTORS,
  GROWTH_SUBSTRATE_SPECS,
  MIRROR_LAGOON_CENTER,
  MIRROR_LAGOON_WATER_SURFACE_Y,
  PRISM_DOMAIN_BASIS_PRIMES,
  PRISM_DOMAIN_BRIDGES,
  PRISM_DOMAIN_ORDER,
  SANCTUARY_TRAIL_WAYPOINTS,
  SPECIES_ARTICULATION_PROFILES,
  SYMBIOTIC_GUILDS,
  VERDANT_ACOUSTIC_STANDARD,
  VERDANT_ARTICULATION_STANDARD,
  VERDANT_BOTANICAL_STANDARD,
  VERDANT_BRAND_STANDARD,
  VERDANT_ECOLOGY_STANDARD,
  VERDANT_HUMANE_STANDARD,
  VERDANT_INFRASTRUCTURE_STANDARD,
  VERDANT_NEUROMORPHIC_STANDARD,
  VERDANT_PHYSICS_STANDARD,
  VERDANT_RESONANCE_SPEC,
  VERDANT_SOUNDTRACK_STANDARD,
  advancePlantLifecycle,
  buildGardenColliders,
  classifyPlantGrowthSubstrate,
  classifySurfaceMaterial,
  composeLiveSoundtrackScore,
  computeAcousticOcclusion,
  computeBinauralPan,
  computeCameraKinematics,
  computeCardinalWayfinder,
  computeCliffordBasinState,
  computeCrossDomainRefinementDirectives,
  computeEcologicalAffinity,
  computeFoliageDeflection,
  computeGardenHarmonyPct,
  computeNeuromorphicCymatics,
  computePlantMorphology,
  computePointKey28,
  computePrimeAddress,
  computeSoftInteractionGaze,
  computeSpeciesArticulation,
  computeSympatheticParabolicArc,
  computeSynthesisEnvelope,
  computeSlopeEmbeddedGroundAnchor,
  computeTerrainNormalTilt,
  createInitialGestureHoldState,
  createInitialHebbianTable,
  createInitialNeuromorphicState,
  createInitialUniversalManifold,
  evaluateBiogeochemistry,
  evaluateBiomeMasteryAndGuilds,
  evaluateCanopyWindShear,
  evaluateCircadianPlantPhysiology,
  evaluateDiurnalProfile,
  evaluateEnvironmentalLifecycle,
  evaluateGroundWavePropagation,
  evaluateHumaneErgonomics,
  evaluateHydrodynamics,
  evaluatePrismRequest,
  evaluateSpatialSurfaceLaw,
  evaluateSpatialWaveAcoustics,
  executeNeuromorphicSynthesisTick,
  findSympatheticNeighbors,
  formatPrismRequest,
  gcdExact,
  generateConservatoryTrees,
  getPlantLifecycleStage,
  hasShortCycleRepetition,
  learnAllHebbian,
  learnHebbianWeight,
  propagateCrossDomainEnhancement,
  refineDomainWeightAutopoietic,
  refinePrismModel,
  registerEmergentSeedlingCollider,
  resolveBiomeWaypointLanding,
  resolvePlayerPhysicsStep,
  rule30CellStep,
  runAcceptanceVectors,
  scheduleNeuromorphicStrategies,
  stepGestureHoldEnvelope,
  stepKuramotoPhaseEntrainment,
  stepSporeFluidDynamics,
  transferWeightCrossDomain,
  verifyHolisticSystemCoupling,
  verifyPointKeyResonanceGate,
  verifyPrismProperties,
  verifySpatialGroundingAndSubstrateCoherence,
  groundHeightAt,
  biomeAt,
  generateGardenPlants,
  findNearestPlant,
} from './prismModel';

test('Botanical soundscape specification validates all 7 fields, 10 outcomes, 35 rules, 15 invariants, and 36 examples', () => {
  assert.equal(VERDANT_RESONANCE_SPEC.schema, 'prism/spec/1');
  assert.equal(VERDANT_RESONANCE_SPEC.name, 'verdant-resonance');
  assert.equal(VERDANT_RESONANCE_SPEC.fields.length, 7);
  assert.equal(VERDANT_RESONANCE_SPEC.outcomes.length, 10);
  assert.equal(VERDANT_RESONANCE_SPEC.rules.length, 35);
  assert.equal(VERDANT_RESONANCE_SPEC.properties.length, 15);
  assert.equal(VERDANT_RESONANCE_SPEC.examples.length, 36);
  assert.equal(SANCTUARY_TRAIL_WAYPOINTS.length, 5);
  assert.equal(Object.keys(BIOME_MONUMENTS).length, 5);
  assert.equal(Object.keys(BIOME_CONSTELLATIONS).length, 5);
  assert.equal(Object.keys(BIOME_LANDSCAPE_TERRACES).length, 5);
  assert.equal(Object.keys(SPECIES_ARTICULATION_PROFILES).length, 5);
  assert.equal(SYMBIOTIC_GUILDS.length, 3);

  for (const ex of VERDANT_RESONANCE_SPEC.examples) {
    const res = evaluatePrismRequest(ex.request);
    assert.equal(res.valid, true, `Expected valid request: ${ex.request}`);
    assert.equal(res.outcome, ex.response, `Mismatch for example: ${ex.request}`);
  }
});

test('Formal botanical invariants (INV-001 to INV-015) hold universally across all sampled states', () => {
  const verification = verifyPrismProperties(VERDANT_RESONANCE_SPEC);
  assert.equal(verification.allHold, true);
  assert.equal(verification.results.length, 15);
  for (const r of verification.results) {
    assert.equal(r.holds, true, `Property ${r.id} (${r.theoremName}) failed`);
    assert.ok(r.checked > 10000, `Expected >10000 combinations checked for ${r.id}`);
  }
  const morph = computePlantMorphology({
    baseScale: 1.0,
    attuned: true,
    proximityDm: 10,
    atmosphere: 'starlight',
    elapsedSeconds: 2.0,
    pulsePhase: 0.5,
  });
  assert.ok(morph.emissiveIntensity > 1.5);
  assert.ok(morph.haloOpacity > 0.7);
});

test('Acceptance vectors pass both valid 7-field botanical interactions and malformed input rejection', () => {
  const report = runAcceptanceVectors(VERDANT_RESONANCE_SPEC);
  assert.equal(report.passed, report.total);
  assert.ok(report.total >= 46);

  assert.equal(evaluatePrismRequest('').outcome, 'invalid');
  assert.equal(evaluatePrismRequest('meadow chime-lily attune dawn dormant 08 4').outcome, 'invalid');
  assert.equal(evaluatePrismRequest('meadow chime-lily attune dawn dormant 105 4').outcome, 'invalid');
});

test('Diurnal sky, ecological affinity, 5-partial modal synthesis, and binaural panning models evaluate deterministically', () => {
  const chorusReq = formatPrismRequest({
    biome: 'sanctuary',
    plant: 'star-orchid',
    action: 'attune',
    atmosphere: 'starlight',
    chorus: 'awakened',
    proximity: 10,
    velocity: 4,
  });
  assert.equal(evaluatePrismRequest(chorusReq).outcome, 'sanctuary-chorus');

  const dawnReq = formatPrismRequest({
    biome: 'meadow',
    plant: 'chime-lily',
    action: 'observe',
    atmosphere: 'dawn',
    chorus: 'dormant',
    proximity: 15,
    velocity: 5,
  });
  assert.equal(evaluatePrismRequest(dawnReq).outcome, 'dawn-arpeggio');

  const nocturneReq = formatPrismRequest({
    biome: 'wetland',
    plant: 'echo-lotus',
    action: 'observe',
    atmosphere: 'twilight',
    chorus: 'dormant',
    proximity: 15,
    velocity: 5,
  });
  assert.equal(evaluatePrismRequest(nocturneReq).outcome, 'nocturnal-symphony');

  const diurnal = evaluateDiurnalProfile('starlight', 'sanctuary', 80);
  assert.equal(diurnal.starOpacity, 1);
  assert.ok(diurnal.floraEmissiveMultiplier > 1.8);

  const affinity = computeEcologicalAffinity('meadow', 'chime-lily', 'dawn');
  assert.equal(affinity.affinityTier, 'sanctuary-peak');
  assert.equal(affinity.harmonyBonus, 4);

  const synth = computeSynthesisEnvelope('sanctuary-chorus', 'sanctuary', 'starlight');
  assert.equal(synth.frequenciesHz.length, 6);
  assert.equal(synth.overtoneFrequenciesHz.length, 6);
  assert.equal(synth.subFrequenciesHz.length, 6);
  assert.equal(synth.bellTransientFrequenciesHz.length, 6);
  assert.equal(synth.stereoEchoDelaySec, 0.375);
  assert.equal(synth.centsDeviation, 0.0);
  assert.ok(synth.reverbSendGain > 0.4);

  // Binaural pan: plant to the right (+X) when facing -Z (yaw = 0) pans positive (right)
  const panRight = computeBinauralPan(0, 0, 0, 5, -5);
  const panLeft = computeBinauralPan(0, 0, 0, -5, -5);
  assert.ok(panRight > 0.4);
  assert.ok(panLeft < -0.4);
});

test('Brand identity, humane-centered design, botanical morphology, ecology constellations, species articulation, and zero-allocation infrastructure models satisfy formal invariants', () => {
  assert.equal(VERDANT_BRAND_STANDARD.profile, 'prism/brand-standard/1');
  assert.equal(VERDANT_BRAND_STANDARD.chromaticPalette.length, 4);
  assert.ok(VERDANT_BRAND_STANDARD.chromaticPalette[1].contrastRatio >= 12.0);

  assert.equal(VERDANT_BOTANICAL_STANDARD.profile, 'prism/botanical-standard/1');
  assert.equal(VERDANT_BOTANICAL_STANDARD.goldenAngleDeg, 137.5);
  assert.ok(VERDANT_BOTANICAL_STANDARD.minPartsPerSpecimen >= 14);
  assert.ok(
    VERDANT_BOTANICAL_STANDARD.matteStemRoughness > VERDANT_BOTANICAL_STANDARD.glossyPetalRoughness
  );
  assert.equal(VERDANT_BOTANICAL_STANDARD.monumentCount, 5);

  assert.equal(VERDANT_ECOLOGY_STANDARD.profile, 'prism/ecology-standard/1');
  assert.equal(VERDANT_ECOLOGY_STANDARD.constellationCount, 5);
  assert.equal(VERDANT_ECOLOGY_STANDARD.beamHeightMeters, 22);
  assert.equal(VERDANT_ECOLOGY_STANDARD.guildCount, 3);

  assert.equal(VERDANT_ARTICULATION_STANDARD.profile, 'prism/articulation-standard/2');
  assert.equal(VERDANT_ARTICULATION_STANDARD.speciesCount, 5);
  assert.equal(VERDANT_ARTICULATION_STANDARD.terraceCount, 5);
  assert.equal(VERDANT_ARTICULATION_STANDARD.constellationVoices, 6);
  assert.equal(VERDANT_ARTICULATION_STANDARD.partialsPerSpecies, 5);
  assert.equal(VERDANT_ARTICULATION_STANDARD.parabolicArcSegments, 9);
  assert.equal(VERDANT_ARTICULATION_STANDARD.gestureContrast.touchAttackMs, 3);
  assert.equal(VERDANT_ARTICULATION_STANDARD.gestureContrast.attuneAttackMs, 220);
  assert.equal(VERDANT_ARTICULATION_STANDARD.gestureContrast.stillnessAttackMs, 650);
  assert.ok(
    VERDANT_ARTICULATION_STANDARD.gestureContrast.attuneAttackMs >
      VERDANT_ARTICULATION_STANDARD.gestureContrast.touchAttackMs * 50,
  );
  assert.ok(
    VERDANT_ARTICULATION_STANDARD.gestureContrast.attuneVoices >
      VERDANT_ARTICULATION_STANDARD.gestureContrast.touchVoices,
  );

  const art = computeSpeciesArticulation({
    species: 'star-orchid',
    attuned: true,
    proximityDm: 12,
    elapsedSeconds: 2.5,
    pulsePhase: 0.3,
  });
  assert.ok(art.crozierSpinRad > 2.5);
  assert.ok(art.petalOpenRad > 0.12);

  const artShiver = computeSpeciesArticulation({
    species: 'star-orchid',
    attuned: true,
    proximityDm: 12,
    elapsedSeconds: 2.5,
    pulsePhase: 0.3,
    tactileShiverImpulse: 1.0,
  });
  assert.ok(
    Math.abs(artShiver.petalOpenRad - art.petalOpenRad) > 0.05,
    'Expected tactileShiverImpulse to produce elastic petal shiver displacement',
  );

  const humane = evaluateHumaneErgonomics({
    velocityDm: 0,
    dockCollapsed: false,
    guidedStroll: false,
    harmonyPct: 75,
  });
  assert.equal(humane.pacingState, 'Meditative Stillness');
  assert.ok(humane.openViewportPct >= 88);
  assert.equal(humane.zeroConflictVerified, true);
  assert.equal(humane.zeroDarkPatternsVerified, true);
  assert.ok(humane.restorativeScore >= 95);

  assert.equal(VERDANT_INFRASTRUCTURE_STANDARD.perFrameHeapAllocations, 0);
  assert.equal(VERDANT_INFRASTRUCTURE_STANDARD.partialsPerVoice, 5);
  assert.equal(VERDANT_INFRASTRUCTURE_STANDARD.sporeRingBufferCapacity, 220);
  assert.equal(VERDANT_INFRASTRUCTURE_STANDARD.instancedMeshTotal, 540);
  assert.equal(VERDANT_INFRASTRUCTURE_STANDARD.continuousDroneGainMilli, 0);
});

test('Procedural garden generation, sympathetic cross-pollination, biome mastery, and cardinal wayfinder maintain invariants', () => {
  const plants = generateGardenPlants(42026);
  assert.ok(plants.length >= 35, `Expected at least 35 plants, got ${plants.length}`);
  assert.equal(Object.keys(ATMOSPHERE_CONFIGS).length, 4);

  for (const p of plants) {
    const distFromOrigin = Math.hypot(p.x, p.z);
    assert.ok(distFromOrigin >= 4.5, `Plant ${p.id} is too close to spawn at (${p.x}, ${p.z})`);
    const isLagoonLotus =
      p.species === 'echo-lotus' &&
      Math.hypot(p.x - MIRROR_LAGOON_CENTER[0], p.z - MIRROR_LAGOON_CENTER[1]) < 14.8;
    const expectedY = isLagoonLotus
      ? MIRROR_LAGOON_WATER_SURFACE_Y
      : computeSlopeEmbeddedGroundAnchor(p.x, p.z, 0.42, 0.02).minPerimeterGroundY;
    assert.equal(p.y, expectedY, `Plant ${p.id} must sit flush on expected terrain/water surface`);
  }

  const nearestAtSpawn = findNearestPlant(0, -3, plants);
  assert.equal(nearestAtSpawn.plant.species, 'chime-lily');
  assert.ok(nearestAtSpawn.distanceMeters < 5.0);

  const neighbors = findSympatheticNeighbors(nearestAtSpawn.plant, plants, 3, 14.0);
  assert.ok(neighbors.length >= 1, 'Expected at least 1 sympathetic neighbor near spawn blossom');

  const wayfinder = computeCardinalWayfinder(0, 0, 0);
  assert.equal(wayfinder.compassCardinal, 'N');
  assert.equal(wayfinder.headingDeg, 0);
  assert.equal(wayfinder.focalMonument, 'Sunlit Sundial Compass Rotunda');

  const initialMastery = evaluateBiomeMasteryAndGuilds('meadow', plants);
  assert.equal(initialMastery.attunedInBiome, 0);
  assert.ok(initialMastery.totalInBiome >= 8);

  assert.equal(biomeAt(0, 0), 'meadow');
  assert.equal(biomeAt(0, -34), 'sanctuary');
  assert.equal(biomeAt(-36, -24), 'grove');
  assert.equal(biomeAt(36, -24), 'crystal');
  assert.equal(biomeAt(-28, 30), 'wetland');
});

test('Environmental physics distinguishes solid obstructions from permeable grass, moss, lotus pads, and shallow water', () => {
  assert.equal(VERDANT_PHYSICS_STANDARD.profile, 'prism/physics-standard/1');
  assert.equal(VERDANT_PHYSICS_STANDARD.solidColliderClasses, 6);
  assert.equal(VERDANT_PHYSICS_STANDARD.permeableMediumClasses, 5);
  assert.equal(VERDANT_PHYSICS_STANDARD.wadingSpeedPct, 76);

  const plants = generateGardenPlants(42026);
  const colliders = buildGardenColliders(plants);
  assert.ok(colliders.length >= 150, `Expected >= 150 solid colliders, got ${colliders.length}`);

  // Permeable Drone Moss and Echo Lotus must never be registered as solid obstructions
  const mossOrLotusColliders = colliders.filter(
    (c) => c.label.includes('Drone Moss') || c.label.includes('Echo Lotus'),
  );
  assert.equal(mossOrLotusColliders.length, 0);

  // Walking into the Sanctuary Obelisk core (0, -34, r=1.48) smoothly deflects the player outside playerRadius + 1.48
  const stepIntoObelisk = resolvePlayerPhysicsStep({
    currentX: 0,
    currentZ: -32.0,
    moveDirX: 0,
    moveDirZ: -1,
    baseSpeedMps: 6.4,
    dt: 0.2,
    colliders,
  });
  const distFromObelisk = Math.hypot(stepIntoObelisk.x, stepIntoObelisk.z + 34);
  assert.ok(
    distFromObelisk >= VERDANT_PHYSICS_STANDARD.playerBodyRadiusMeters + 1.48 - 0.01,
    `Expected solid obelisk core to prevent penetration, got dist=${distFromObelisk}`,
  );
  assert.equal(stepIntoObelisk.obstructedBy, 'Sanctuary Obelisk Core Plinth');

  // Walking in shallow water inside the Wetland Mirror Lagoon (e.g. [-26, 30]) is permeable (never blocks, 76%..100% wading drag)
  const hydroWading = evaluateHydrodynamics(-26, 30);
  assert.equal(hydroWading.inWater, true);
  assert.equal(hydroWading.onFloatingStonePad, false);
  assert.ok(hydroWading.waterDepthMeters > 0.2);
  assert.ok(hydroWading.wadingDragMultiplier >= 0.76 && hydroWading.wadingDragMultiplier < 1.0);
  assert.equal(classifySurfaceMaterial(-26, 30), 'shallow-water');

  // Standing on the central Floating Stone Lantern Pad ([-28, 30]) is dry travertine stone
  const hydroCenterPad = evaluateHydrodynamics(-28, 30);
  assert.equal(hydroCenterPad.onFloatingStonePad, true);
  assert.equal(hydroCenterPad.inWater, false);
  assert.equal(classifySurfaceMaterial(-28, 30), 'travertine-stone');

  // Permeable grass blades within 1.85m of the player deflect radially away without obstructing movement
  const deflectedBlade = computeFoliageDeflection({
    bladeX: 0.6,
    bladeZ: 0.0,
    playerX: 0.0,
    playerZ: 0.0,
    elapsedSeconds: 1.0,
  });
  assert.equal(deflectedBlade.isDeflectedByPlayer, true);
  assert.ok(Math.abs(deflectedBlade.tiltZRad) > 0.15);

  // Acoustic occlusion increases when the Sanctuary Obelisk core stands between the listener and a blossom
  const occluded = computeAcousticOcclusion(0, -31.5, 0, -36.5, colliders);
  const unobstructed = computeAcousticOcclusion(0, 0, 2.2, -5.5, colliders);
  assert.ok(occluded >= 0.35);
  assert.equal(unobstructed, 0);
});

test('Neuromorphic synthesis engine verifies Rule-30 cellular steps, bounded Hebbian plasticity, UORLUT01 PrimeAddress GCD sieve, and live seedling morphogenesis', () => {
  assert.equal(VERDANT_NEUROMORPHIC_STANDARD.profile, 'prism/neuromorphic-standard/1');
  assert.equal(VERDANT_NEUROMORPHIC_STANDARD.lutStack.headerMagic, 'UORLUT01');
  assert.equal(VERDANT_NEUROMORPHIC_STANDARD.plasticity.weightMin, 1);
  assert.equal(VERDANT_NEUROMORPHIC_STANDARD.plasticity.weightMax, 16);
  assert.equal(VERDANT_NEUROMORPHIC_STANDARD.plasticity.weightInitial, 8);

  // Exact Elementary Cellular Automaton Rule 30 truth table: 111->0, 110->0, 101->0, 100->1, 011->1, 010->1, 001->1, 000->0
  assert.equal(rule30CellStep(true, true, true), false);
  assert.equal(rule30CellStep(true, true, false), false);
  assert.equal(rule30CellStep(true, false, true), false);
  assert.equal(rule30CellStep(true, false, false), true);
  assert.equal(rule30CellStep(false, true, true), true);
  assert.equal(rule30CellStep(false, true, false), true);
  assert.equal(rule30CellStep(false, false, true), true);
  assert.equal(rule30CellStep(false, false, false), false);

  // Bounded Hebbian learning rule `learn(w, success)` stays strictly within [1, 16]
  for (let w = 1; w <= 16; w++) {
    const up = learnHebbianWeight(w, true);
    const down = learnHebbianWeight(w, false);
    assert.ok(up >= 1 && up <= 16);
    assert.ok(down >= 1 && down <= 16);
  }
  assert.equal(learnHebbianWeight(8, true), 10);
  assert.equal(learnHebbianWeight(15, true), 16);
  assert.equal(learnHebbianWeight(16, true), 16);
  assert.equal(learnHebbianWeight(8, false), 7);
  assert.equal(learnHebbianWeight(1, false), 1);

  // Priority-ordered stable strategy scheduler preserves portfolio order on ties and sorts descending by weight
  let table = createInitialHebbianTable();
  table = learnAllHebbian(table, [
    { strategy: 'mycelial-seedling-germination', family: 'meadow-lydian', success: true },
    { strategy: 'mycelial-seedling-germination', family: 'meadow-lydian', success: true },
  ]);
  const scheduled = scheduleNeuromorphicStrategies('meadow-lydian', table);
  assert.equal(scheduled[0].id, 'mycelial-seedling-germination');
  assert.equal(scheduled[0].weight, 12);

  // UORLUT01 `/5` Clifford Cl(0,6) Basin, `/7` PrimeAddress GCD Sieve, Short-Cycle Guard, & `/8` 28-bit PointKey
  const basin = computeCliffordBasinState(10, -12, 0.2);
  assert.ok(basin >= 0 && basin < 64);

  const addrA = computePrimeAddress('meadow', 'chime-lily', 'dawn', 'attune');
  const addrB = computePrimeAddress('meadow', 'star-orchid', 'dawn', 'touch');
  // Both share meadow (2) and dawn (31), so GCD is at least 62
  assert.equal(gcdExact(addrA, addrB), 2 * 31);

  // Short-cycle guard detects period-1 and period-2 repetitions
  assert.equal(hasShortCycleRepetition([4, 7, 4], 7), true);
  assert.equal(hasShortCycleRepetition([4, 7, 11], 3), false);

  const pk = computePointKey28({
    basinState: basin,
    icosianRoot: 5,
    primeAddress: addrA,
    rule30Byte: 142,
  });
  assert.ok(pk >= 0 && pk <= 0x0fffffff);
  assert.equal(verifyPointKeyResonanceGate(12, 0, 0, 14), true);
  assert.equal(verifyPointKeyResonanceGate(12, 0, 1, 14), false); // Rejected when shortCycleCount > 0

  // Full 6-stage Neuromorphic Synthesis Tick potentiates Hebbian weights and germinates an emergent seedling when consolidated
  const plants = generateGardenPlants(42026);
  const colliders = buildGardenColliders(plants);
  let neuroState = createInitialNeuromorphicState();
  let mintedSeedling = null;

  for (let i = 0; i < 3; i++) {
    const tick = executeNeuromorphicSynthesisTick(neuroState, {
      biome: 'meadow',
      species: 'chime-lily',
      atmosphere: 'dawn',
      action: 'attune',
      outcome: 'harmonic-bloom',
      playerX: i * 3.5,
      playerZ: -6.0 - i * 2.5,
      playerYaw: 0.25 * i,
      existingPlants: plants,
      colliders,
    });
    neuroState = tick.nextState;
    if (tick.emergentSeedling) {
      mintedSeedling = tick.emergentSeedling;
    }
  }

  assert.ok(neuroState.lastActiveSynapticWeight >= 12);
  assert.equal(neuroState.pointKeyGateAdmitted, true);
  assert.ok(mintedSeedling !== null, 'Expected consolidated PointKey gate to germinate an emergent seedling');
});

test('Subsystem 14: 5-Stage Botanical Lifecycle, 4-Phase Environmental Lifecycle, and Live 4-Stem Generative Soundtrack Score satisfy monotonic progression and breathing silence guarantees', () => {
  const plants = generateGardenPlants(42026);
  const neuro = createInitialNeuromorphicState();

  // 1. Fresh garden starts at Stage 0 (`dormant-seed`) with 0 active soundtrack stems and 16 rest steps
  const specimen = plants[0];
  assert.equal(getPlantLifecycleStage(specimen), 'dormant-seed');

  const initialEnv = evaluateEnvironmentalLifecycle({
    harmonyPct: 15,
    plants,
    atmosphere: 'dawn',
  });
  assert.equal(initialEnv.phase, 'dew-awakening');
  assert.equal(initialEnv.activeStemsCount, 0);

  const quietScore = composeLiveSoundtrackScore({
    biome: 'meadow',
    atmosphere: 'dawn',
    harmonyPct: 15,
    plants,
    neuromorphic: neuro,
  });
  assert.equal(quietScore.activeStems.length, 0);
  assert.equal(quietScore.restStepCount, 16);

  // 2. Monotonic 5-Stage Botanical Lifecycle progression:
  // Touch (`[T]`) -> Stage 1 (`sprouting-bud`)
  const step1 = advancePlantLifecycle(getPlantLifecycleStage(specimen), 'touch');
  specimen.lifecycleStage = step1;
  assert.equal(step1, 'sprouting-bud');
  assert.equal(BOTANICAL_LIFECYCLE_STAGES[step1].soundtrackStemContribution, 'polyrhythmic-ostinato');

  // Attune (`[Space]`) -> Stage 2 (`resonant-bloom`)
  const step2 = advancePlantLifecycle(getPlantLifecycleStage(specimen), 'attune');
  specimen.lifecycleStage = step2;
  specimen.attuned = true;
  assert.equal(step2, 'resonant-bloom');
  assert.equal(BOTANICAL_LIFECYCLE_STAGES[step2].soundtrackStemContribution, 'melodic-flora-lead');

  // Second Attune / Sympathetic Pollination -> Stage 3 (`harmonic-fruiting`)
  const step3 = advancePlantLifecycle(getPlantLifecycleStage(specimen), 'attune', true);
  specimen.lifecycleStage = step3;
  assert.equal(step3, 'harmonic-fruiting');
  assert.equal(BOTANICAL_LIFECYCLE_STAGES[step3].soundtrackStemContribution, 'harmonic-bass-anchor');

  // Stillness (`[C]`) -> Stage 4 (`mycelial-memory`)
  const step4 = advancePlantLifecycle(getPlantLifecycleStage(specimen), 'stillness');
  specimen.lifecycleStage = step4;
  assert.equal(step4, 'mycelial-memory');
  assert.equal(BOTANICAL_LIFECYCLE_STAGES[step4].soundtrackStemContribution, 'canonic-counterpoint-echo');

  // Advance additional plants so all 4 stems are woven into the score
  plants[1].lifecycleStage = advancePlantLifecycle('dormant-seed', 'touch'); // Stage 1 (`polyrhythmic-ostinato`)
  plants[2].lifecycleStage = advancePlantLifecycle('dormant-seed', 'attune'); // Stage 2 (`melodic-flora-lead`)
  plants[3].lifecycleStage = advancePlantLifecycle('resonant-bloom', 'attune', true); // Stage 3 (`harmonic-bass-anchor`)

  const fullScore = composeLiveSoundtrackScore({
    biome: 'sanctuary',
    atmosphere: 'starlight',
    harmonyPct: 88,
    plants,
    neuromorphic: neuro,
  });
  assert.equal(fullScore.environmentalPhase, 'bioluminescent-slumber');
  assert.equal(fullScore.activeStems.length, 4);
  assert.equal(fullScore.steps.length, 16);
  // Formal Breathing Silence Guarantee (`soundtrackBreathingSilenceGuaranteeHolds`): >= 6 rests per 16-step bar
  assert.ok(
    fullScore.restStepCount >= 6,
    `Expected at least 6 breathing rest steps per 16-step bar, got ${fullScore.restStepCount}`,
  );
});

test('Critically-damped camera kinematics, sustained gesture hold state machine, and authentic garden harmony prevent camera jumping, key-repeat chaos, and premature game-end', () => {
  assert.equal(VERDANT_HUMANE_STANDARD.zeroPositionTeleportOnInteract, true);
  assert.equal(VERDANT_HUMANE_STANDARD.zeroHardYawSnapOnInteract, true);
  assert.equal(VERDANT_HUMANE_STANDARD.suppressOsKeyRepeat, true);
  assert.equal(VERDANT_HUMANE_STANDARD.mindfulExplorationNeverForceEnds, true);

  // 1. Soft interaction gaze never alters player [x, z] and clamps yaw nudge to <= 0.065 rad (~3.7 deg)
  const softGaze = computeSoftInteractionGaze({
    playerX: 0,
    playerZ: 0,
    currentYaw: 0,
    plantX: 3.0,
    plantZ: -5.0,
    distanceMeters: Math.hypot(3.0, -5.0),
  });
  assert.ok(Math.abs(softGaze.nextTargetYaw) <= VERDANT_HUMANE_STANDARD.softGazeAssistMaxRad + 1e-6);

  // Plant behind the player (> 75 deg off-axis) produces 0.0 yaw nudge (no sudden camera spin!)
  const behindGaze = computeSoftInteractionGaze({
    playerX: 0,
    playerZ: 0,
    currentYaw: 0,
    plantX: 0,
    plantZ: 6.0, // Behind player (since yaw=0 faces -Z)
    distanceMeters: 6.0,
  });
  assert.equal(behindGaze.nextTargetYaw, 0);

  // 2. Critically-damped camera kinematics smoothly interpolates position, rotation, and FOV without jumps
  let camState = {
    camX: 0,
    camY: 1.72,
    camZ: 0,
    camYaw: 0,
    camPitch: 0.04,
    camFov: 58,
    bobPhase: 0,
    bobAmplitude: 0.012,
    interactionPitchNod: -0.016,
  };
  camState = computeCameraKinematics({
    prev: camState,
    playerX: 1.0,
    playerY: 0,
    playerZ: -1.0,
    targetYaw: 0.05,
    targetPitch: 0.04,
    isMoving: true,
    inWater: false,
    speedMps: 4.5,
    stillnessBreathPhase: 'inhale',
    stillnessBreathProgress: 0.25,
    dt: 0.016,
  });
  assert.ok(camState.camX > 0 && camState.camX < 1.0, 'Camera X must damp smoothly rather than jump');
  assert.ok(camState.camYaw > 0 && camState.camYaw < 0.05, 'Camera Yaw must damp smoothly rather than snap');
  assert.ok(camState.camFov > 58.0, 'Stillness inhale gently widens FOV');

  // 3. Holding [C] Stillness for 2.0 seconds advances inhale -> crest -> exhale with 0 chaotic repeat pulses,
  // and emits exactly 1 sustained breath pulse after a full 4.2s breath cycle
  let holdState = createInitialGestureHoldState();
  let pulseCount = 0;
  for (let frame = 0; frame < 120; frame++) {
    // 120 frames * 0.016s = 1.92 seconds of holding [C]
    const step = stepGestureHoldEnvelope(holdState, 'stillness', 0.016);
    holdState = step.nextState;
    if (step.sustainedPulseGesture) pulseCount++;
  }
  assert.equal(pulseCount, 0, 'Holding [C] for 1.92s must not emit chaotic repeat triggers');
  assert.equal(holdState.stillnessBreathPhase, 'crest');

  // Continue holding to complete the 4.2s restorative breath cycle
  for (let frame = 0; frame < 150; frame++) {
    const step = stepGestureHoldEnvelope(holdState, 'stillness', 0.016);
    holdState = step.nextState;
    if (step.sustainedPulseGesture) pulseCount++;
  }
  assert.equal(pulseCount, 1, 'Holding [C] across 4.3s emits exactly 1 calm breath cycle pulse');

  // 4. Authentic Conservatory Harmony: repeatedly interacting with 1 plant cannot inflate harmony to 100%
  const plants = generateGardenPlants(42026);
  plants[0].lifecycleStage = 'mycelial-memory';
  plants[0].attuned = true;
  const singlePlantHarmony = computeGardenHarmonyPct({
    plants,
    exploredBiomesCount: 1,
  });
  assert.ok(
    singlePlantHarmony < 25,
    `Single plant mastery must not inflate global harmony to 100% (got ${singlePlantHarmony}%)`,
  );
});

test('Hydrostatic basin containment guarantees zero floating water edges around 360 degrees of the Mirror Lagoon and couples neuromorphic cymatics', () => {
  assert.equal(VERDANT_PHYSICS_STANDARD.waterSurfaceSubmergedBelowRim, true);
  assert.equal(VERDANT_PHYSICS_STANDARD.floatingWaterEdgeCount, 0);
  assert.equal(VERDANT_PHYSICS_STANDARD.neuromorphicCymaticCouplingEnabled, true);
  assert.equal(VERDANT_PHYSICS_STANDARD.terraceBasinLevellingCount, 5);

  const [wx, wz] = MIRROR_LAGOON_CENTER;

  // 1. At the center of the Mirror Lagoon (-28, 30), the lakebed is recessed below the water surface (-0.14m)
  const centerBedY = groundHeightAt(wx, wz);
  assert.ok(
    centerBedY < MIRROR_LAGOON_WATER_SURFACE_Y - 0.35,
    `Expected recessed lakebed center below ${MIRROR_LAGOON_WATER_SURFACE_Y}m, got ${centerBedY}m`,
  );

  // 2. Around all 360 degrees of the shoreline bank (r = 15.3m .. 16.8m), the terrain rim is strictly higher than the water plane
  for (let deg = 0; deg < 360; deg += 5) {
    const rad = (deg * Math.PI) / 180;
    for (const rimRadius of [15.4, 16.0, 16.6]) {
      const rx = wx + Math.cos(rad) * rimRadius;
      const rz = wz + Math.sin(rad) * rimRadius;
      const rimGroundY = groundHeightAt(rx, rz);
      assert.ok(
        rimGroundY > MIRROR_LAGOON_WATER_SURFACE_Y,
        `Floating water detected at angle=${deg}deg r=${rimRadius}m: groundY=${rimGroundY} <= waterY=${MIRROR_LAGOON_WATER_SURFACE_Y}`,
      );
      const hydroRim = evaluateHydrodynamics(rx, rz);
      assert.equal(hydroRim.inWater, false);
      assert.equal(hydroRim.waterDepthMeters, 0);
    }
  }

  // 3. Dry architectural terraces sit flush on level plateaus (minimal variance across their radius)
  for (const [tx, tz, tr] of [
    [0, -34, 8.5],
    [0, -14, 6.0],
    [-36, -24, 6.5],
    [36, -24, 9.0],
  ] as const) {
    const centerY = groundHeightAt(tx, tz);
    for (let deg = 0; deg < 360; deg += 45) {
      const a = (deg * Math.PI) / 180;
      const edgeY = groundHeightAt(tx + Math.cos(a) * tr, tz + Math.sin(a) * tr);
      assert.ok(
        Math.abs(edgeY - centerY) < 0.08,
        `Expected level terrace at (${tx},${tz}), got edgeY=${edgeY} vs centerY=${centerY}`,
      );
    }
  }

  // 4. Echo-lotus plants spawned inside the lagoon float at MIRROR_LAGOON_WATER_SURFACE_Y
  const plants = generateGardenPlants(42026);
  const lagoonLotuses = plants.filter(
    (p) => p.species === 'echo-lotus' && Math.hypot(p.x - wx, p.z - wz) < 14.8,
  );
  assert.ok(lagoonLotuses.length > 0);
  for (const lotus of lagoonLotuses) {
    assert.equal(lotus.y, MIRROR_LAGOON_WATER_SURFACE_Y);
  }

  // 5. Neuromorphic cymatics couples Rule-30 cellular density, Icosian root index, and Hebbian weight into standing waves
  const cymaticCenter = computeNeuromorphicCymatics({
    localX: 3.0,
    localZ: 0,
    elapsedSeconds: 2.5,
    rule30Byte: 255,
    icosianRootIndex: 7,
    synapticWeight: 16,
  });
  assert.ok(cymaticCenter.meniscusPulseFactor >= 0.5 && cymaticCenter.meniscusPulseFactor <= 1.0);
  assert.ok(Math.abs(cymaticCenter.waveDisplacementY) <= 0.035);
  assert.ok(cymaticCenter.cymaticNodeCount >= 2 && cymaticCenter.cymaticNodeCount <= 6);

  const cymaticShore = computeNeuromorphicCymatics({
    localX: 15.5,
    localZ: 0,
    elapsedSeconds: 2.5,
    rule30Byte: 255,
    icosianRootIndex: 7,
    synapticWeight: 16,
  });
  assert.equal(cymaticShore.waveDisplacementY, 0);
});

test('5-Substrate Biological Soil/Water Taxonomy, Gravitropic Stem Orientation, and Biogeochemical Equilibrium satisfy mathematical, physical, chemical, and biological invariants', () => {
  assert.equal(VERDANT_BOTANICAL_STANDARD.substrateClassCount, 5);
  assert.equal(VERDANT_BOTANICAL_STANDARD.gravitropicStemAlignment, true);
  assert.equal(VERDANT_BOTANICAL_STANDARD.zeroHardSurfaceOrRockPlantGrowth, true);
  assert.equal(VERDANT_BOTANICAL_STANDARD.zeroFloatingTreeTrunks, true);
  assert.equal(VERDANT_BOTANICAL_STANDARD.zeroDetachedCanopyCrowns, true);
  assert.equal(Object.keys(GROWTH_SUBSTRATE_SPECS).length, 5);
  assert.equal(VERDANT_ECOLOGY_STANDARD.minSoilWaterPh, 5.6);
  assert.equal(VERDANT_ECOLOGY_STANDARD.maxSoilWaterPh, 8.1);
  assert.equal(VERDANT_ECOLOGY_STANDARD.silicaPiezoelectricCoupling, true);
  assert.equal(VERDANT_ECOLOGY_STANDARD.mycorrhizalCnpExchangeEnabled, true);
  assert.equal(VERDANT_ECOLOGY_STANDARD.luciferinEnzymaticKineticsEnabled, true);
  assert.equal(VERDANT_ECOLOGY_STANDARD.volatileTerpeneSignalingEnabled, true);

  // 1. All 5 fertile biological soil/water growth substrates are actively populated across the generated conservatory flora
  const plants = generateGardenPlants(42026);
  const substratesFound = new Set(plants.map((p) => p.substrate));
  assert.equal(substratesFound.has('terrestrial-loam'), true);
  assert.equal(substratesFound.has('pelagic-water'), true);
  assert.equal(substratesFound.has('lithophytic-rock'), true);
  assert.equal(substratesFound.has('architectural-foundation'), true);
  assert.equal(substratesFound.has('crystalline-epiphyte'), true);

  // 2. Substrate classification accurately identifies pelagic lagoon water, perimeter humus borders, silicate forest duff, and mineral-rich soil
  assert.equal(classifyPlantGrowthSubstrate('echo-lotus', -25, 27), 'pelagic-water'); // Submerged Mirror Lagoon water
  assert.equal(classifyPlantGrowthSubstrate('drone-moss', 5.4, -13.2), 'architectural-foundation'); // Meadow perimeter humus border outside stone plinth
  assert.equal(classifyPlantGrowthSubstrate('drone-moss', -30, -18), 'lithophytic-rock'); // Montane bryophyte humus bed
  assert.equal(classifyPlantGrowthSubstrate('star-orchid', 24.5, -18.5), 'crystalline-epiphyte'); // Crystal outer silicate loam ring

  // 3. Physical surface normal alignment & biological gravitropism counter-tilt
  const slopeTilt = computeTerrainNormalTilt(15, 18);
  assert.ok(Math.abs(slopeTilt.surfaceTiltX) <= 0.36);
  assert.ok(Math.abs(slopeTilt.surfaceTiltZ) <= 0.36);
  const morphTilted = computePlantMorphology({
    baseScale: 1.0,
    attuned: true,
    proximityDm: 12,
    atmosphere: 'golden',
    elapsedSeconds: 2.0,
    pulsePhase: 0.5,
    surfaceTiltX: 0.25,
    surfaceTiltZ: -0.2,
    biogeochemicalGlowBoost: 0.4,
  });
  // Stem curves 72% back against the substrate tilt (gravitropism)
  assert.equal(morphTilted.gravitropicCounterTiltX, -0.18);
  assert.equal(morphTilted.gravitropicCounterTiltZ, 0.144);

  // 4. Biogeochemical Equilibrium balances pH, piezoelectric silica, mycorrhizal C:N:P flux, luciferin oxidation, and terpene plumes
  const wetlandBio = evaluateBiogeochemistry({
    biome: 'wetland',
    species: 'echo-lotus',
    substrate: 'pelagic-water',
    atmosphere: 'starlight',
    attuned: true,
    lifecycleStage: 'resonant-bloom',
    sympatheticNeighborCount: 2,
    neuromorphicWeight: 14,
    volatileTerpeneImpulse: 0.8,
  });
  const crystalBio = evaluateBiogeochemistry({
    biome: 'crystal',
    species: 'star-orchid',
    substrate: 'crystalline-epiphyte',
    atmosphere: 'golden',
    attuned: true,
    lifecycleStage: 'harmonic-fruiting',
    sympatheticNeighborCount: 3,
    neuromorphicWeight: 16,
    volatileTerpeneImpulse: 1.0,
  });
  assert.ok(wetlandBio.pH >= 5.6 && wetlandBio.pH <= 6.4, `Expected acidic wetland pH, got ${wetlandBio.pH}`);
  assert.ok(crystalBio.pH >= 7.4 && crystalBio.pH <= 8.1, `Expected alkaline crystal pH, got ${crystalBio.pH}`);
  assert.ok(crystalBio.silicaMineralIndex > wetlandBio.silicaMineralIndex);
  assert.ok(crystalBio.acousticSustainMultiplier > wetlandBio.acousticSustainMultiplier);
  assert.ok(wetlandBio.luciferinOxidationRate > 0.8);
  assert.ok(crystalBio.volatileTerpenePlume > 0.8);
});

test('Spatial Wave Propagation Acoustics, Circadian Stomatal Turgor, Kuramoto Phase Entrainment, 9-Segment Parabolic Action-Potential Arcs, Canopy Wind-Shear, and Chemotactic Spore Fluid Dynamics satisfy formal Prism invariants', () => {
  assert.equal(VERDANT_PHYSICS_STANDARD.canopyWindShearEnabled, true);
  assert.equal(VERDANT_PHYSICS_STANDARD.slipstreamVortexWakeEnabled, true);
  assert.equal(VERDANT_PHYSICS_STANDARD.chemotacticSporeBuoyancyEnabled, true);
  assert.equal(VERDANT_BOTANICAL_STANDARD.kuramotoPhaseLockingEnabled, true);
  assert.equal(VERDANT_BOTANICAL_STANDARD.circadianStomatalTurgorEnabled, true);
  assert.equal(VERDANT_ECOLOGY_STANDARD.actionPotentialWaveSpeedMps, 6.5);

  const plants = generateGardenPlants(42026);
  const colliders = buildGardenColliders(plants);

  // 1. Spatial Wave Propagation & Obstacle Diffraction Acoustics (`evaluateSpatialWaveAcoustics`)
  const nearUnobstructed = evaluateSpatialWaveAcoustics({
    distanceMeters: Math.hypot(2.0, -3.0),
    acousticOcclusion: computeAcousticOcclusion(0, 0, 2.0, -3.0, colliders),
    atmosphere: 'dawn',
  });
  const farOccluded = evaluateSpatialWaveAcoustics({
    distanceMeters: 18.0,
    acousticOcclusion: computeAcousticOcclusion(0, -31.0, 0, -38.0, colliders), // Behind Sanctuary Obelisk Core Plinth at (0, -34)
    atmosphere: 'dawn',
  });
  assert.ok(
    nearUnobstructed.distanceGainMultiplier >= 0.18 &&
      nearUnobstructed.distanceGainMultiplier <= 1.0,
  );
  assert.ok(farOccluded.distanceGainMultiplier < nearUnobstructed.distanceGainMultiplier);
  assert.ok(
    farOccluded.effectiveLowpassHz < nearUnobstructed.effectiveLowpassHz,
    'Expected Stokes-Kirchhoff air absorption + stone diffraction to lower cutoff frequency',
  );
  assert.ok(
    farOccluded.waveArrivalDelaySec > nearUnobstructed.waveArrivalDelaySec,
    'Expected speed-of-sound propagation delay (343 m/s) to scale with distance',
  );
  assert.ok(farOccluded.reverbSendBoost > nearUnobstructed.reverbSendBoost);

  // 2. Circadian Stomatal Conductance & Hydraulic Turgor Pressure (`evaluateCircadianPlantPhysiology`)
  const lilyAtDawn = evaluateCircadianPlantPhysiology({
    species: 'chime-lily', // diurnalAffinity === 'dawn'
    atmosphere: 'dawn',
    substrate: 'terrestrial-loam',
    attuned: true,
    lifecycleStage: 'resonant-bloom',
  });
  const lilyAtStarlight = evaluateCircadianPlantPhysiology({
    species: 'chime-lily',
    atmosphere: 'starlight',
    substrate: 'terrestrial-loam',
    attuned: false,
    lifecycleStage: 'dormant-seed',
  });
  assert.ok(lilyAtDawn.stomatalConductance > lilyAtStarlight.stomatalConductance);
  assert.ok(lilyAtDawn.corollaApertureBoost > lilyAtStarlight.corollaApertureBoost);
  assert.ok(
    lilyAtDawn.hydraulicTurgorPressure >= 0.72 && lilyAtDawn.hydraulicTurgorPressure <= 1.18,
  );
  assert.ok(
    lilyAtStarlight.hydraulicTurgorPressure >= 0.72 &&
      lilyAtStarlight.hydraulicTurgorPressure <= 1.18,
  );

  // 3. Kuramoto Coupled Oscillator Phase Entrainment (`stepKuramotoPhaseEntrainment`)
  const phaseA = 0.2;
  const phaseB = 2.4;
  const initialPhaseGap = Math.abs(phaseB - phaseA);
  const stepA = stepKuramotoPhaseEntrainment({
    currentPhase: phaseA,
    neighborPhases: [phaseB],
    dt: 0.1,
  });
  const stepB = stepKuramotoPhaseEntrainment({
    currentPhase: phaseB,
    neighborPhases: [phaseA],
    dt: 0.1,
  });
  assert.ok(
    Math.abs(stepB.nextPhase - stepA.nextPhase) < initialPhaseGap,
    'Expected Kuramoto phase-locking to reduce phase difference between attuned neighbors',
  );

  // 4. 9-Segment Parabolic Cross-Pollination Arcs & Mycorrhizal Action-Potential Wavefront (`computeSympatheticParabolicArc`)
  const arc = computeSympatheticParabolicArc({
    x1: 0,
    y1: 0,
    z1: -6,
    x2: 8,
    y2: 0.5,
    z2: -12,
    elapsedSinceTriggerSec: 0.5,
  });
  assert.equal(arc.points.length - 1, VERDANT_ARTICULATION_STANDARD.parabolicArcSegments);
  assert.ok(arc.apexHeightMeters > 1.2, 'Expected parabolic arc apex to clear terrain elevation');
  assert.ok(arc.wavefrontNormalizedU > 0 && arc.wavefrontNormalizedU < 1);
  assert.ok(
    arc.wavefrontPosition[1] > 0.5,
    'Expected traveling action-potential orb to ride along the elevated parabolic arc',
  );

  // 5. Canopy Wind-Shear & Aerodynamic Slipstream Wake (`evaluateCanopyWindShear`, `computeFoliageDeflection`)
  const canopySway = evaluateCanopyWindShear({
    x: -32,
    z: -20,
    heightMeters: 6.2,
    tier: 1,
    elapsedSeconds: 3.2,
    rule30Byte: 198,
    synapticWeight: 12,
  });
  assert.ok(Math.abs(canopySway.pitchRad) > 0 || Math.abs(canopySway.rollRad) > 0);
  assert.ok(Math.abs(canopySway.yawFlutterRad) <= 0.05);

  const wakeBlade = computeFoliageDeflection({
    bladeX: 0.5,
    bladeZ: 0.5,
    playerX: 0,
    playerZ: 0,
    playerVX: 4.5,
    playerVZ: -3.2,
    rule30Byte: 210,
    elapsedSeconds: 1.5,
  });
  assert.equal(wakeBlade.isDeflectedByPlayer, true);

  // 6. Chemotactic Spore Fluid Dynamics (`stepSporeFluidDynamics`)
  plants[0].attuned = true;
  plants[0].volatileTerpeneCharge = 1.0;
  const sporeStep = stepSporeFluidDynamics({
    x: plants[0].x + 3.0,
    y: 1.2,
    z: plants[0].z - 2.0,
    vx: 0,
    vy: 0,
    vz: 0,
    playerX: plants[0].x + 10.0,
    playerZ: plants[0].z + 10.0,
    playerVX: 0.0,
    playerVZ: 0.0,
    attractorX: plants[0].x,
    attractorY: plants[0].y,
    attractorZ: plants[0].z,
    attractorTerpeneStrength: 1.0,
    atmosphere: 'golden',
    elapsedSeconds: 2.0,
    rule30Byte: 170,
    synapticWeight: 12,
    dt: 0.1,
  });
  const prevDistToPlant = Math.hypot(3.0, -2.0);
  const nextDistToPlant = Math.hypot(sporeStep.x - plants[0].x, sporeStep.z - plants[0].z);
  assert.ok(
    nextDistToPlant < prevDistToPlant,
    'Expected chemotactic gradient to attract bioluminescent spores toward terpene-emitting attuned flora',
  );
  assert.ok(sporeStep.y > 1.2, 'Expected diurnal thermal buoyancy to lift bioluminescent spores');
});

test('Holistic Cross-Domain Mutual Constraint Law: all 10 physical, chemical, biological, celestial, acoustic, infrastructure, and spatial grounding invariants hold universally', () => {
  assert.equal(VERDANT_PHYSICS_STANDARD.coupledDomainCount, 10);
  assert.equal(VERDANT_PHYSICS_STANDARD.universalNeuromorphicBusEnabled, true);
  assert.equal(VERDANT_PHYSICS_STANDARD.crossDomainTransferLatencyTicks, 0);
  assert.equal(VERDANT_PHYSICS_STANDARD.sporeSolidObstacleDeflectionEnabled, true);
  assert.equal(VERDANT_PHYSICS_STANDARD.sporeTerrainMeniscusFloorEnabled, true);
  assert.equal(VERDANT_PHYSICS_STANDARD.emergentSeedlingColliderRegistrationEnabled, true);
  assert.equal(VERDANT_PHYSICS_STANDARD.waveRingSurfaceNormalAlignmentEnabled, true);
  assert.equal(VERDANT_PHYSICS_STANDARD.heliocentricPhototropicShadowLockEnabled, true);
  assert.equal(VERDANT_PHYSICS_STANDARD.causalWavefrontEchoTimingEnabled, true);
  assert.equal(VERDANT_PHYSICS_STANDARD.universalAcousticSpatialBiochemConstraintEnabled, true);
  assert.equal(VERDANT_PHYSICS_STANDARD.spatialGroundingAndSubstrateCoherenceEnabled, true);
  assert.equal(VERDANT_PHYSICS_STANDARD.floatingTreeOrRockEdgeCount, 0);
  assert.equal(VERDANT_PHYSICS_STANDARD.hardSurfaceOrRockFloraGrowthCount, 0);

  // 1. Run full holistic cross-domain verification across all 10 mutual constraint & universal bus laws
  const report = verifyHolisticSystemCoupling();
  assert.equal(report.allConstrained, true);
  assert.equal(report.coupledDomainCount, 10);
  assert.equal(report.solidExclusionVerified, true);
  assert.equal(report.sporeFloorAndObstacleVerified, true);
  assert.equal(report.emergentSeedlingColliderVerified, true);
  assert.equal(report.waveRingNormalAlignmentVerified, true);
  assert.equal(report.heliocentricPhototropicLockVerified, true);
  assert.equal(report.causalWavefrontTimingVerified, true);
  assert.equal(report.universalSoundtrackSpatialBindingVerified, true);
  assert.equal(report.spatialGroundingAndSubstrateCoherenceVerified, true);
  assert.equal(report.universalNeuromorphicBusVerified, true);
  assert.equal(report.infrastructureNeuromorphicCouplingVerified, true);

  const plants = generateGardenPlants(42026);
  const colliders = buildGardenColliders(plants);

  // 2. Spores obey solid-obstacle exclusion (potential-flow deflection) and terrain/water meniscus floor reflection
  const obeliskStep = stepSporeFluidDynamics({
    x: 0.2,
    y: groundHeightAt(0, -34) - 1.2,
    z: -34.0,
    vx: -2.0,
    vy: -3.5,
    vz: 0,
    playerX: 0,
    playerZ: 0,
    playerVX: 0,
    playerVZ: 0,
    attractorX: 0,
    attractorY: 0,
    attractorZ: -34,
    attractorTerpeneStrength: 1.0,
    atmosphere: 'dawn',
    elapsedSeconds: 1.0,
    rule30Byte: 105,
    synapticWeight: 10,
    colliders,
    dt: 0.05,
  });
  assert.ok(
    Math.hypot(obeliskStep.x, obeliskStep.z + 34) >= 1.48 + 0.14,
    'Spore must not penetrate Sanctuary Obelisk Core Plinth solid collider',
  );
  assert.ok(
    obeliskStep.y >= groundHeightAt(obeliskStep.x, obeliskStep.z) + 0.13,
    'Spore must not penetrate below terrain surface floor',
  );

  // 3. Emergent neuromorphic seedlings dynamically register solid colliders in `gardenColliders`
  const prevCount = colliders.length;
  const regCol = registerEmergentSeedlingCollider(colliders, {
    id: 'plant-neuro-holistic-test',
    species: 'star-orchid',
    biome: 'crystal',
    substrate: 'crystalline-epiphyte',
    x: 24.0,
    y: groundHeightAt(24.0, -18.0),
    z: -18.0,
    scale: 1.0,
    rotationY: 0,
    attuned: true,
    pitchMultiplier: 1.25,
    lifecycleStage: 'sprouting-bud',
  });
  assert.ok(regCol !== null);
  assert.equal(colliders.length, prevCount + 1);

  // 4. Biome waypoint landings pass through `resolvePlayerPhysicsStep` to respect raised monument plazas and floating pads
  for (const b of ['meadow', 'grove', 'crystal', 'wetland', 'sanctuary'] as const) {
    const landing = resolveBiomeWaypointLanding(b, colliders);
    assert.equal(landing.obstructedBy, null);
    for (const c of colliders) {
      const dist = Math.hypot(landing.x - c.x, landing.z - c.z);
      assert.ok(
        dist >= c.radiusMeters + VERDANT_PHYSICS_STANDARD.playerBodyRadiusMeters - 0.02,
        `Teleport landing in ${b} must not overlap collider ${c.id}`,
      );
    }
  }

  // 5. Ground/water wave rings conform to terrain normals, scale wave speed by medium elasticity, and attenuate across solid colliders
  const crystalWave = evaluateGroundWavePropagation({
    x: 36,
    z: -19,
    ageSec: 0.8,
    colliders,
  });
  const waterWave = evaluateGroundWavePropagation({
    x: -26,
    z: 30,
    ageSec: 0.8,
    colliders,
  });
  assert.ok(crystalWave.waveSpeedMps > waterWave.waveSpeedMps);
  assert.equal(waterWave.surfaceTiltX, 0);
  assert.equal(waterWave.surfaceTiltZ, 0);

  // 6. Heliocentric-Phototropic-Shadow Lock: `evaluateDiurnalProfile` and `computePlantMorphology` share `DIURNAL_CELESTIAL_VECTORS`
  for (const atm of ['dawn', 'golden', 'twilight', 'starlight'] as const) {
    const diurnal = evaluateDiurnalProfile(atm, 'meadow', 60);
    assert.deepEqual(diurnal.sunPosition, DIURNAL_CELESTIAL_VECTORS[atm]);
  }
});

test('Spatial Grounding & Hard-Surface/Rock Exclusion Coherence API guarantees zero floating trees, canopies, rocks, or stones and zero plants/trees on hard platforms or rocks', () => {
  const coherence = verifySpatialGroundingAndSubstrateCoherence();
  assert.equal(coherence.allGroundedAndValid, true);
  assert.equal(coherence.floatingTreeCount, 0);
  assert.equal(coherence.detachedCanopyCount, 0);
  assert.equal(coherence.floatingRockOrStoneCount, 0);
  assert.equal(coherence.treesOnHardSurfaceOrRockCount, 0);
  assert.equal(coherence.plantsOnHardSurfaceOrRockCount, 0);
  assert.equal(coherence.grassOnHardSurfaceOrRockCount, 0);

  // Verify hard structure platforms and solid rocks are strictly rejected by `evaluateSpatialSurfaceLaw`
  const sanctuaryPlatformLaw = evaluateSpatialSurfaceLaw(0, -34, 0.5);
  assert.equal(sanctuaryPlatformLaw.isHardStructurePlatform, true);
  assert.equal(sanctuaryPlatformLaw.canSupportPlant, false);
  assert.equal(sanctuaryPlatformLaw.canSupportTree, false);

  const crystalMirrorPlatformLaw = evaluateSpatialSurfaceLaw(36, -24, 0.5);
  assert.equal(crystalMirrorPlatformLaw.isHardStructurePlatform, true);
  assert.equal(crystalMirrorPlatformLaw.canSupportPlant, false);
  assert.equal(crystalMirrorPlatformLaw.canSupportTree, false);

  const grovePergolaPlatformLaw = evaluateSpatialSurfaceLaw(-36, -24, 0.5);
  assert.equal(grovePergolaPlatformLaw.isHardStructurePlatform, true);
  assert.equal(grovePergolaPlatformLaw.canSupportPlant, false);
  assert.equal(grovePergolaPlatformLaw.canSupportTree, false);

  const shorelineBoulderLaw = evaluateSpatialSurfaceLaw(-28 + 15.2, 30, 0.5);
  assert.equal(shorelineBoulderLaw.isRockOutcrop, true);
  assert.equal(shorelineBoulderLaw.canSupportPlant, false);
  assert.equal(shorelineBoulderLaw.canSupportTree, false);

  // Verify slope-embedded ground anchor places base below the lowest 360-degree perimeter point on sloped terrain
  const anchor = computeSlopeEmbeddedGroundAnchor(-22, -16, 1.5, 0.2);
  assert.ok(
    anchor.embeddedBaseY < anchor.minPerimeterGroundY,
    `Expected embeddedBaseY (${anchor.embeddedBaseY}) < minPerimeterGroundY (${anchor.minPerimeterGroundY})`,
  );

  // Verify all 64 trees have subterranean bases and attached canopy tiers outside the Grove Pergola and Crystal Geode Mirror platforms
  const trees = generateConservatoryTrees();
  assert.equal(trees.length, 64);
  for (const t of trees) {
    assert.ok(t.baseY < t.minPerimeterGroundY);
    const distGrove = Math.hypot(t.x - -36, t.z - -24);
    const distCrystal = Math.hypot(t.x - 36, t.z - -24);
    assert.ok(distGrove > 4.2, `Tree ${t.index} must not grow inside Grove Pergola platform`);
    assert.ok(distCrystal > 11.8, `Tree ${t.index} must not grow inside Crystal Geode Mirror platform`);
  }
});

test('Universal 10-Domain Neuromorphic Bus transfers enhancements across all Prism domains (including Infrastructure) automatically without manual per-domain iteration', () => {
  assert.equal(VERDANT_NEUROMORPHIC_STANDARD.universalBus.coupledModuleCount, 10);
  assert.equal(VERDANT_NEUROMORPHIC_STANDARD.universalBus.domainBasisPrimeCount, 10);
  assert.equal(VERDANT_NEUROMORPHIC_STANDARD.universalBus.crossDomainTransferEnabled, true);
  assert.equal(VERDANT_NEUROMORPHIC_STANDARD.universalBus.autopoieticSelfRefinementEnabled, true);
  assert.equal(VERDANT_NEUROMORPHIC_STANDARD.universalBus.infrastructureCoupled, true);
  assert.equal(VERDANT_NEUROMORPHIC_STANDARD.universalBus.zeroManualIterationOverhead, true);

  assert.equal(VERDANT_INFRASTRUCTURE_STANDARD.neuromorphicBridge.neuromorphicBusCoupled, true);
  assert.equal(VERDANT_INFRASTRUCTURE_STANDARD.neuromorphicBridge.domainBasisPrime, 71);
  assert.equal(VERDANT_INFRASTRUCTURE_STANDARD.neuromorphicBridge.selfRefiningRenderContract, true);

  // 1. Verify all 10 domains are equipped with identical UORLUT01 + Rule-30 + bounded Hebbian nodes
  const initialManifold = createInitialUniversalManifold();
  assert.equal(PRISM_DOMAIN_ORDER.length, 10);
  for (const dom of PRISM_DOMAIN_ORDER) {
    const node = initialManifold.domains[dom];
    assert.ok(node, `Missing neuromorphic node for domain ${dom}`);
    assert.equal(node.basisPrime, PRISM_DOMAIN_BASIS_PRIMES[dom]);
    assert.equal(node.synapticWeight, 8);
    assert.equal(node.fidelityMultiplier, 1.0);
    assert.ok(node.pointKey28 >= 0 && node.pointKey28 <= 0x0fffffff);
  }

  // 2. Verify `transferWeightCrossDomain` is bounded in [1, 16] and monotonically non-decreasing (`crossDomainTransferBoundedAndMonotonicHolds`)
  for (let w = 1; w <= 16; w++) {
    const transferred = transferWeightCrossDomain(w, true);
    assert.ok(transferred >= 1 && transferred <= 16);
    assert.ok(transferred >= w);
    const unchanged = transferWeightCrossDomain(w, false);
    assert.equal(unchanged, w);
  }

  // 3. When a single domain (`botany`) improves, `propagateCrossDomainEnhancement` transfers enhancements to all 9 other domains (including `infrastructure`, `physics`, `acoustics`, etc.)
  const afterBotanyImprovement = propagateCrossDomainEnhancement(initialManifold, {
    sourceDomain: 'botany',
    resonantSuccess: true,
  });
  assert.equal(afterBotanyImprovement.domains.botany.synapticWeight, 10);
  for (const dom of PRISM_DOMAIN_ORDER) {
    if (dom !== 'botany') {
      assert.equal(
        afterBotanyImprovement.domains[dom].synapticWeight,
        9,
        `Expected ${dom} to receive +1 cross-domain synaptic transfer from botany improvement`,
      );
      assert.equal(afterBotanyImprovement.domains[dom].receivedCrossDomainTransfers, 1);
    }
    assert.ok(afterBotanyImprovement.domains[dom].fidelityMultiplier > 1.0);
  }
  assert.equal(afterBotanyImprovement.totalCrossDomainTransfers, 9);
  assert.ok(afterBotanyImprovement.globalFidelityIndex > initialManifold.globalFidelityIndex);

  // 4. Verify `computeCrossDomainRefinementDirectives` automatically refines Infrastructure, Physics, Botany, Ecology, Acoustics, Articulation, Soundtrack, Humane, and Brand
  const baseDirectives = computeCrossDomainRefinementDirectives(initialManifold);
  const refinedDirectives = computeCrossDomainRefinementDirectives(afterBotanyImprovement);
  assert.ok(
    refinedDirectives.infrastructure.toneMappingExposure >
      baseDirectives.infrastructure.toneMappingExposure,
  );
  assert.ok(
    refinedDirectives.infrastructure.microReliefBumpScale >
      baseDirectives.infrastructure.microReliefBumpScale,
  );
  assert.ok(
    refinedDirectives.infrastructure.activeSporePoolRatio >
      baseDirectives.infrastructure.activeSporePoolRatio,
  );
  assert.ok(
    refinedDirectives.infrastructure.constellationHaloOpacity >
      baseDirectives.infrastructure.constellationHaloOpacity,
  );
  assert.ok(refinedDirectives.physics.cymaticWaveCoherence > baseDirectives.physics.cymaticWaveCoherence);
  assert.ok(
    refinedDirectives.botany.kuramotoCouplingMultiplier >
      baseDirectives.botany.kuramotoCouplingMultiplier,
  );
  assert.ok(
    refinedDirectives.acoustics.modalFilterQMultiplier >
      baseDirectives.acoustics.modalFilterQMultiplier,
  );

  // 5. Verify `executeNeuromorphicSynthesisTick` propagates cross-domain enhancements during live gameplay
  const plants = generateGardenPlants(42026);
  const colliders = buildGardenColliders(plants);
  let neuroState = createInitialNeuromorphicState();
  const tickRes = executeNeuromorphicSynthesisTick(neuroState, {
    biome: 'meadow',
    species: 'chime-lily',
    atmosphere: 'dawn',
    action: 'attune',
    outcome: 'harmonic-bloom',
    playerX: 0,
    playerZ: -5,
    playerYaw: 0,
    existingPlants: plants,
    colliders,
  });
  neuroState = tickRes.nextState;
  assert.ok(neuroState.universalManifold.globalFidelityIndex > 1.0);
  assert.equal(neuroState.universalManifold.totalCrossDomainTransfers, 9);
  assert.ok(neuroState.universalManifold.domains.infrastructure.synapticWeight > 8);

  // 6. Verify all 10 domain standards expose their formal `neuromorphicBridge` contract (`PRISM_DOMAIN_BRIDGES`)
  assert.equal(VERDANT_INFRASTRUCTURE_STANDARD.neuromorphicBridge.domainBasisPrime, 71);
  assert.equal(VERDANT_PHYSICS_STANDARD.neuromorphicBridge.domainBasisPrime, 73);
  assert.equal(VERDANT_BOTANICAL_STANDARD.neuromorphicBridge.domainBasisPrime, 79);
  assert.equal(VERDANT_ECOLOGY_STANDARD.neuromorphicBridge.domainBasisPrime, 83);
  assert.equal(VERDANT_ACOUSTIC_STANDARD.neuromorphicBridge.domainBasisPrime, 89);
  assert.equal(VERDANT_ARTICULATION_STANDARD.neuromorphicBridge.domainBasisPrime, 97);
  assert.equal(VERDANT_SOUNDTRACK_STANDARD.neuromorphicBridge.domainBasisPrime, 101);
  assert.equal(VERDANT_HUMANE_STANDARD.neuromorphicBridge.domainBasisPrime, 103);
  assert.equal(VERDANT_BRAND_STANDARD.neuromorphicBridge.domainBasisPrime, 107);
  assert.equal(VERDANT_NEUROMORPHIC_STANDARD.neuromorphicBridge.domainBasisPrime, 109);

  for (const dom of PRISM_DOMAIN_ORDER) {
    const bridge = PRISM_DOMAIN_BRIDGES[dom];
    assert.equal(bridge.neuromorphicBusCoupled, true);
    assert.equal(bridge.domainBasisPrime, PRISM_DOMAIN_BASIS_PRIMES[dom]);
    assert.equal(bridge.rule30RegisterBits, 64);
    assert.equal(bridge.pointKeyBits, 28);
    assert.equal(bridge.crossDomainTransferEnabled, true);
    assert.equal(bridge.autopoieticSelfRefinementEnabled, true);
  }

  // 7. Verify `refineDomainWeightAutopoietic` and `refinePrismModel` converge monotonically toward the fixed point `w* = 16`
  for (let w = 1; w <= 16; w++) {
    for (let leader = 1; leader <= 16; leader++) {
      const nextW = refineDomainWeightAutopoietic(w, leader);
      assert.ok(nextW >= 1 && nextW <= 16);
      assert.ok(nextW >= w);
    }
  }
  assert.equal(refineDomainWeightAutopoietic(16, 16), 16);

  const refineReport = refinePrismModel(neuroState, { cycles: 8 });
  assert.equal(refineReport.allDomainsBridgeVerified, true);
  assert.ok(refineReport.fidelityAfter > refineReport.fidelityBefore);
  assert.equal(refineReport.varianceAfter, 0);
  assert.equal(refineReport.convergedDomains, 10);
  for (const dom of PRISM_DOMAIN_ORDER) {
    assert.equal(refineReport.nextState.universalManifold.domains[dom].synapticWeight, 16);
    assert.equal(refineReport.nextState.universalManifold.domains[dom].consolidated, true);
  }
});



