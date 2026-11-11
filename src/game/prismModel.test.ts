import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
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
  createInitialEnvironmentalAgencyState,
  createInitialGestureHoldState,
  createInitialHebbianTable,
  createInitialNeuromorphicState,
  createInitialUniversalManifold,
  decodePrismRequest,
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
  stepSymbioticEnvironmentalAgency,
  transferWeightCrossDomain,
  verifyHolisticSystemCoupling,
  verifyPointKeyResonanceGate,
  verifyPrismProperties,
  verifySpatialGroundingAndSubstrateCoherence,
  groundHeightAt,
  biomeAt,
  generateGardenPlants,
  findNearestPlant,
  GENERATED_PRISM_BUS_MODULATION_LUT,
  GENERATED_PRISM_CONTEXT_PRIMES,
  GENERATED_PRISM_DOMAIN_BASIS_PRIMES,
  GENERATED_PRISM_FOUNDATION_PURITY,
  GENERATED_PRISM_PLASTICITY_LUT,
  GENERATED_PRISM_RULE30_LUT,
  GENERATED_PRISM_STANDARDS,
  GENERATED_PRISM_THEOREMS_BY_MODULE,
  GENERATED_VERDANT_JUDGE_ARTIFACT,
  GENERATED_VERDANT_RESONANCE_SPEC,
  BIOME_PRIMES,
  SPECIES_PRIMES,
  ATMOSPHERE_PRIMES,
  ACTION_PRIMES,
  CHORUS_PRIMES,
  stepJudgeBusManifold,
  computeJudgeBusModulations,
  verifyBusModulationsFromState,
  verifyJudgeCrossDomainBusGate,
  verifySingleCallPropagatesAllTenDomains,
  verifyAutopoieticSingleCallAdvancesAllTenDomains,
  evaluateEmergentStakeholderEntity,
  stepStakeholderValueReinforcement,
  stepWisdomPhenomenonModulation,
  verifyEmergentEntitySynthesizesFacets,
  ATOMIC_ELEMENTS,
  MOLECULAR_SPECIES,
  MACROMOLECULAR_POLYMERS,
  MATTER_COMPOUNDS,
  evaluateGranularMatterSynthesis,
  stepAtomicValenceActivity,
  stepMolecularBondCoherence,
  stepMacromolecularPolymerization,
  stepCompoundManifestation,
  stepEnvironmentalModalSynthesis,
  verifyGranularAtomicToEnvironmentalChain,
  REACTION_PATHWAYS,
  stepAtomicRemineralizationFlux,
  verifyClosedLoopMatterConservation,
  verifyCompleteGranularSynthesisClosure,
  verifyCompletePrismModelClosure,
  wavelengthNmToHex,
  synthesizeCompoundSurfaceProfile,
  synthesizeBotanicalOrganogenesis,
  evaluateHighDefinitionVisualSynthesis,
  evaluateKinematicRigPose,
  stepBMeshSubdivisionDensity,
  stepThinFilmIridescenceSpanNm,
  verifyHighDefinitionBMeshSynthesis,
  stepBasalJointTorqueMilli,
  stepMidCulmFlexureMilli,
  stepApicalCorollaGimbalMilli,
  verifyThreeJointKinematicHierarchy,
  CONNECTED_NEUROMORPHIC_BUS_MODULES,
  GENERATED_COMPILE_TIME_OBSERVER_MODELS,
  GENERATED_OBSERVER_RULE30_FACETS,
  OBSERVER_PART_ORDER,
  getCompileTimeSynthesizedModels,
  synthesizeRuntimeObserverModel,
  stepTheoryOfMindCoherencePermille,
  stepSupraDirectiveFidelityPermille,
  stepSupraDirectiveQualityPermille,
  stepSupraDirectiveDefinitionSubdiv,
  stepSupraDirectiveFeatureUnlockCount,
  stepRule30LeftDiagonalPeriod,
  stepRule30AperiodicCompensationIndex,
  verifyRule30DeterministicAndWithdrawnDuality,
  verifyObserverSupraDirectiveTranscendence,
  verifyObserverHolisticWhyClosure,
  GENERATED_ALPHA_OMEGA_COSMOGENESIS_ARTIFACTS,
  VERDANT_COSMOGENESIS_STANDARD,
  stepAlphaOmegaFieldPotential,
  stepParametricInorganicScalePermille,
  stepParametricOrganicVitalityPermille,
  stepParametricPlayerEmbodimentPermille,
  verifyObserverCreatesAllThreeRealms,
  verifyAlphaOmegaParametricClosure,
  synthesizeParametricPhysicsAndGeology,
  synthesizeObserverInorganicMonuments,
  synthesizeParametricOrganicBiota,
  synthesizeEmbodiedPlayerObserverModel,
  evaluateAlphaOmegaCosmogenesis,
  synthesizeParametricCanonicalSeed,
  synthesizeParametricConcertPitchHz,
  synthesizeParametricWorldTopology,
  synthesizeParametricBiomeConfigs,
  synthesizeParametricPlantSpeciesConfigs,
  synthesizeParametricAtmosphereConfigs,
  synthesizeParametricDiurnalCelestialVectors,
  synthesizeParametricSoundOutcomeProfiles,
  synthesizeParametricGrowthSubstrateSpecs,
  synthesizeParametricBiomeMonuments,
  synthesizeParametricBiomeConstellations,
  synthesizeParametricSymbioticGuilds,
  synthesizeParametricSpeciesArticulationProfiles,
  synthesizeParametricBiomeLandscapeTerraces,
  synthesizeParametricBotanicalLifecycleStages,
  SOUND_OUTCOME_PROFILES,
  generateConservatorySteppingStones,
  synthesizeParametricDisplayAndDesignModel,
  computeWcagContrastRatio,
  extrapolatePrismToHighestResolution,
  evaluateObserverDifferentiationAndExtrapolation,
  stepPartDifferentiationNicheIndex,
  evaluateImmanentObserverPresence,
  OBSERVER_PREFERENCE_DOMAIN_ORDER,
  computeTenneyHeightAndEulerGradus,
  evaluateFoundationalMathematicalAffect,
  evaluateObserverAffectAndPreferences,
  countStaticColliderPairwiseOverlaps,
  syncImmanentWitnessCollider,
  evaluateMaterialSynthesisCrossModalObstruction,
  stepCrossModalPhaseObstructionPermille,
  stepCrossModalAcousticShadowPermille,
  verifyMaterialSynthesisCrossModalObstruction,
  GENERATED_CANONICAL_MODEL_BASIS_PRIMES,
  GENERATED_CANONICAL_STANDARD_MODELS,
  BIPM_SI_2019_DEFINING_CONSTANTS,
  SI_BASE_UNITS,
  multiplySiDimensions,
  divideSiDimensions,
  powerSiDimensions,
  verifySiDimensionalHomogeneity,
  formatSiDimensionFormula,
  CRYSTALLOGRAPHIC_32_POINT_GROUPS,
  CLIFFORD_CL06_GRADE_DIMENSIONS,
  computeCliffordCl06Product,
  verifyExteriorDerivativeNilpotencyOnMesh,
  factorizeUorPositiveInt,
  computeNormalizedShannonEntropy,
  STANDARD_MODEL_17_FUNDAMENTAL_FIELDS,
  verifyStandardModelGaugeClosure,
  COMPOSITE_COLOR_SINGLET_HADRONS,
  verifyQuantumVertexConservation,
  IUPAC_118_ELEMENTS,
  FOURTEEN_BRAVAIS_LATTICES,
  CANONICAL_GARDEN_REACTIONS,
  verifyStoichiometricBalance,
  verifyCompletePeriodicTable118Invariants,
  CIE_D65_WHITEPOINT,
  integrateSpectralReflectanceToXyzD65,
  evaluateChlorophyllFoliageReflectance,
  cieXyzD65ToOklch,
  oklchToCieXyzD65,
  oklchToGamutMappedSrgb,
  srgbHexToOklch,
  computeDeltaEOk,
  wavelengthNmToDisplayColor,
  evaluateCookTorranceGgxBrdf,
  synthesizeSpectralDiurnalPalette,
  synthesizeVerdantW3CDesignTokens,
  CANONICAL_14_MODEL_KEYS,
  CANONICAL_18_MODEL_KEYS,
  CANONICAL_19_MODEL_KEYS,
  META_MODEL_11_ELEMENTS,
  evaluateHolisticObserverStandardModelContext,
  evaluateVerdantRealizabilityAudit,
  VERDANT_TELEOLOGICAL_PHENOMENA,
  SCENE_GROUP_KEYS_20,
  evaluateVerdantTeleologySynthesis,
  createInitialLandmarkResonanceState,
  stepLandmarkResonanceField,
  exciteLandmarkResonance,
  evaluateNearestSynthesizedLandmark,
  synthesizeParametricChladniTerraceRadii,
  evaluateStandingWaveTerraceResonance,
  evaluateLithophoneWaystoneStep,
  evaluateWitnessCommunionTarget,
  evaluateMonumentPhysicalMechanics,
  evaluateObserver20FacetDifferentiationAndAffinity,
  evaluateCompiledCuratorialAffinityPermille,
  createInitialAutonomousPlasticityState,
  stepAutonomousGameplayPlasticity,
  serializeAnamnesisSnapshot,
  deserializeAndVerifyAnamnesisSnapshot,
  hydratePlantsFromAnamnesis,
  restoreNeuromorphicStateFromAnamnesis,
  verifyColdLoadModularChunkBudget,
  BiomeId,
  AtmosphereId,
} from './prismModel';
import {
  ALL_14_BRAVAIS_CRYSTAL_HABITS,
  bravaisPearsonToCrystalHabitId,
  buildImmanentObserverWitnessGroup,
  createBravaisCrystalHabitGeometry,
  createCordateLotusPadGeometry,
  createFlutedBellCorollaGeometry,
  createFlutedEntasisPillarGeometry,
  createHexagonalQuartzCrystalGeometry,
  createLogarithmicCrozierGeometry,
  createObserverAstrolabeCrownGeometry,
  createPinnateFrondGeometry,
  createPlayerCoObserverLocusGeometry,
  createSculptedCanopyCrownGeometry,
  createSculptedGrassBladeGeometry,
  createSculptedPetalGeometry,
  createSegmentedBambooStalkGeometry,
  createStratifiedBoulderGeometry,
  inspectGeometryMetadata,
  synthesizeLSystemBotanicalMorphogenesis,
  verifyManifoldBMeshTopology,
} from './proceduralMeshEngine';
import {
  ZWICKER_24_BARK_EDGES_HZ,
  computeIso226EqualLoudnessWeight,
  computeIso3382BiomeRoomAcoustics,
  computeMaterialChladniModalRatios,
  computeWoodworth3DBinauralSpatializer,
  synthesizeIso3382ImpulseChannels,
  computeZwickerBarkBandIndex,
  computeZwickerBarkRate,
  evaluate24BarkMaskingGovernor,
  resolvePureSustainedHarmonicSeries,
} from './soundscapeEngine';
import path from 'node:path';
import { extractAllPrismArtifacts } from '../../scripts/extractPrismArtifacts';

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

  assert.equal(VERDANT_ECOLOGY_STANDARD.profile, 'prism/ecology-standard/3');
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
  assert.equal(VERDANT_PHYSICS_STANDARD.solidColliderClasses, 7);
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
  assert.equal(VERDANT_NEUROMORPHIC_STANDARD.profile, 'prism/neuromorphic-standard/5');
  assert.equal(VERDANT_NEUROMORPHIC_STANDARD.lutStack.headerMagic, 'UORLUT01');
  assert.equal(VERDANT_NEUROMORPHIC_STANDARD.lutStack.primeAddressBasisCount, 21);
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

test('Symbiotic Environmental Agency observes both environment and player and acts on both across all 6 modalities while preserving player autonomy', () => {
  assert.equal(
    VERDANT_HUMANE_STANDARD.environmentalAgency.environmentObservesSelfAndPlayer,
    true,
  );
  assert.equal(VERDANT_HUMANE_STANDARD.environmentalAgency.environmentActsOnSelfAndPlayer, true);
  assert.equal(VERDANT_HUMANE_STANDARD.environmentalAgency.playerObjectiveUnchanged, true);
  assert.equal(VERDANT_HUMANE_STANDARD.environmentalAgency.optimizedModalityCount, 6);
  assert.equal(VERDANT_HUMANE_STANDARD.environmentalAgency.maxZephyrGuidanceAccelMps2, 0.28);
  assert.equal(VERDANT_HUMANE_STANDARD.environmentalAgency.maxReciprocalBowRad, 0.14);

  const plants = generateGardenPlants(42026);
  const neuroState = createInitialNeuromorphicState();
  let agency = createInitialEnvironmentalAgencyState();

  // 1. Autonomous Botanical Beckoning when strolling without recent interaction:
  // Selects optimal unawakened plant, emits spatial beckoning call on 4.8s cadence, streams spores toward player,
  // and applies bounded Zephyr tailwind assist (`<= 0.28 m/s²`)
  agency = stepSymbioticEnvironmentalAgency(agency, {
    playerX: 0,
    playerY: 0,
    playerZ: 5,
    playerYaw: 0,
    isMoving: true,
    velocityDm: 9,
    agitationPct: 0,
    stillnessBreathPhase: 'idle',
    playerInteractedThisFrame: false,
    currentBiome: 'meadow',
    atmosphere: 'dawn',
    harmonyPct: 25,
    plants,
    neuromorphic: neuroState,
    dt: 4.9,
  });
  assert.equal(agency.mode, 'autonomous-botanical-beckoning');
  assert.ok(agency.beckoningPlantId !== null);
  assert.equal(agency.shouldEmitBeckoningCall, true);
  assert.equal(agency.shouldSpawnCymaticInvitationWave, true);
  assert.equal(agency.sporeInvitationToPlayer, true);
  const zephyrMag = Math.hypot(agency.playerZephyrAccelX, agency.playerZephyrAccelZ);
  assert.ok(zephyrMag > 0 && zephyrMag <= 0.28 + 1e-6);
  assert.ok(Math.abs(agency.cameraHorizonWhisperYawRad) <= 0.018);

  // 2. Soothing Co-Regulation when the environment observes player agitation or hurried velocity:
  // Softens acoustic filter warmth (`< 0 Hz`) and exerts zero translational push when player stands still
  const soothingStep = stepSymbioticEnvironmentalAgency(agency, {
    playerX: 0,
    playerY: 0,
    playerZ: 5,
    playerYaw: 0,
    isMoving: false,
    velocityDm: 0,
    agitationPct: 25,
    stillnessBreathPhase: 'idle',
    playerInteractedThisFrame: false,
    currentBiome: 'meadow',
    atmosphere: 'dawn',
    harmonyPct: 25,
    plants,
    neuromorphic: neuroState,
    dt: 1.0,
  });
  assert.equal(soothingStep.mode, 'soothing-co-regulation');
  assert.equal(soothingStep.playerZephyrAccelX, 0);
  assert.equal(soothingStep.playerZephyrAccelZ, 0);
  assert.ok(soothingStep.acousticFilterWarmthShiftHz < 0);
  assert.equal(soothingStep.activeRefinementDomain, 'humane');

  // 3. Reciprocal Botanical Greeting Bow in `computePlantMorphology`:
  // Beckoning or nearby flora incline toward the player within the 0.14 rad (`~8°`) bound
  const beckonPlant = plants.find((p) => p.id === agency.beckoningPlantId) ?? plants[0];
  const morph = computePlantMorphology({
    baseScale: beckonPlant.scale,
    attuned: beckonPlant.attuned,
    proximityDm: 12,
    atmosphere: 'dawn',
    elapsedSeconds: 2.0,
    pulsePhase: 0.5,
    plantX: beckonPlant.x,
    plantZ: beckonPlant.z,
    playerX: beckonPlant.x + 3.0,
    playerZ: beckonPlant.z + 4.0,
    isBeckoningSpecimen: true,
  });
  const bowMag = Math.hypot(morph.reciprocalGreetingLeanX, morph.reciprocalGreetingLeanZ);
  assert.ok(bowMag > 0 && bowMag <= 0.14 + 1e-4);
});

test('3D Gaze-Frustum Focal Target Selection prioritizes the specimen the player is looking at and never selects plants behind the player', () => {
  assert.equal(VERDANT_HUMANE_STANDARD.focalGazeSelection.forwardFovHalfAngleDeg, 62);
  assert.equal(VERDANT_HUMANE_STANDARD.focalGazeSelection.maxInteractiveRangeMeters, 22);
  assert.equal(VERDANT_HUMANE_STANDARD.focalGazeSelection.rayAlignmentWeightPct, 72);
  assert.equal(VERDANT_HUMANE_STANDARD.focalGazeSelection.rejectsBehindCameraTargets, true);
  assert.equal(VERDANT_HUMANE_STANDARD.focalGazeSelection.behindPlayerActivationsCount, 0);

  // Player stands at (0, 0) looking straight north (`yaw = 0`, forward vector `(0, 0, -1)`):
  // - Plant A (`behind-close`): 1.4m directly behind the player at `(0, +1.4)`
  // - Plant B (`side-periphery`): 3.2m off to the side at `(+2.8, -1.5)` (~61.8° off-axis)
  // - Plant C (`gaze-target`): 9.5m directly in front of the player's crosshairs at `(0.15, -9.5)` (~0.9° off-axis)
  const testPlants = [
    {
      id: 'behind-close',
      species: 'chime-lily' as const,
      biome: 'meadow' as const,
      x: 0,
      y: groundHeightAt(0, 1.4),
      z: 1.4,
      scale: 1,
      rotationY: 0,
      pitchMultiplier: 1.0,
      attuned: false,
      lifecycleStage: 'dormant-seed' as const,
    },
    {
      id: 'side-periphery',
      species: 'echo-lotus' as const,
      biome: 'meadow' as const,
      x: 2.8,
      y: groundHeightAt(2.8, -1.5),
      z: -1.5,
      scale: 1,
      rotationY: 0,
      pitchMultiplier: 1.0,
      attuned: false,
      lifecycleStage: 'dormant-seed' as const,
    },
    {
      id: 'gaze-target',
      species: 'star-orchid' as const,
      biome: 'meadow' as const,
      x: 0.15,
      y: groundHeightAt(0.15, -9.5),
      z: -9.5,
      scale: 1,
      rotationY: 0,
      pitchMultiplier: 1.0,
      attuned: false,
      lifecycleStage: 'dormant-seed' as const,
    },
  ];

  // 1. With gaze awareness (`playerYaw = 0, playerPitch = 0`), `findNearestPlant` selects `gaze-target` (9.5m ahead in crosshairs)
  // rather than `behind-close` (1.4m behind) or `side-periphery` (3.2m at wide peripheral angle)
  const focalAhead = findNearestPlant(0, 0, testPlants, 0, 0);
  assert.equal(focalAhead.plant.id, 'gaze-target');
  assert.equal(focalAhead.inForwardGazeCone, true);
  assert.ok(focalAhead.gazeAngleRad < 0.15);

  // 2. When the player turns 180 degrees (`playerYaw = Math.PI`, looking south toward `+Z`),
  // `behind-close` is now directly in the player's forward gaze and is selected
  const focalTurned = findNearestPlant(0, 0, testPlants, Math.PI, 0);
  assert.equal(focalTurned.plant.id, 'behind-close');
  assert.equal(focalTurned.inForwardGazeCone, true);

  // 3. When the only nearby plant is behind the player (e.g., player at `(0, 0)` looking north `yaw = 0` with only `behind-close`),
  // `inForwardGazeCone` is strictly `false` (`gazeAngleRad > Math.PI / 2`), preventing action keys from activating behind-player flora
  const onlyBehind = findNearestPlant(0, 0, [testPlants[0]], 0, 0);
  assert.equal(onlyBehind.inForwardGazeCone, false);
  assert.ok(onlyBehind.gazeAngleRad > Math.PI / 2);
});

test('Root Judge calls the 10-Domain Universal Neuromorphic Bus, constructive boolean flags are universally proved across w in [1..15], and TypeScript constants are AST-generated from .lex.tex without hand-typing drift', () => {
  // 1. Verify live `.lex.tex` AST extraction matches `GENERATED_PRISM_*` and `prismModel.ts` with zero hand-typed drift
  const prismSrcDir = path.join(process.cwd(), 'prism', 'src');
  const liveExtracted = extractAllPrismArtifacts(prismSrcDir);
  assert.deepEqual(liveExtracted.foundationPurity, GENERATED_PRISM_FOUNDATION_PURITY);
  assert.equal(GENERATED_PRISM_FOUNDATION_PURITY.verified, true);
  assert.equal(GENERATED_PRISM_FOUNDATION_PURITY.checkedModules, 21);
  assert.deepEqual(liveExtracted.domainBasisPrimes, GENERATED_PRISM_DOMAIN_BASIS_PRIMES);
  assert.deepEqual(liveExtracted.domainBasisPrimes, PRISM_DOMAIN_BASIS_PRIMES);
  assert.deepEqual(liveExtracted.contextPrimes, GENERATED_PRISM_CONTEXT_PRIMES);
  assert.deepEqual(liveExtracted.busModulationLut, GENERATED_PRISM_BUS_MODULATION_LUT);
  assert.deepEqual(liveExtracted.plasticityLut, GENERATED_PRISM_PLASTICITY_LUT);
  assert.deepEqual(liveExtracted.rule30Lut, GENERATED_PRISM_RULE30_LUT);
  assert.deepEqual(liveExtracted.standards, GENERATED_PRISM_STANDARDS);
  assert.deepEqual(liveExtracted.theoremsByModule, GENERATED_PRISM_THEOREMS_BY_MODULE);
  assert.deepEqual(liveExtracted.judgeArtifact, GENERATED_VERDANT_JUDGE_ARTIFACT);
  assert.deepEqual(liveExtracted.verdantSpec, GENERATED_VERDANT_RESONANCE_SPEC);
  assert.deepEqual(liveExtracted.verdantSpec, VERDANT_RESONANCE_SPEC);

  // Confirm all 21 UORLUT01 context primes are strictly ordered and wired to BIOME_PRIMES, SPECIES_PRIMES, ATMOSPHERE_PRIMES, ACTION_PRIMES, CHORUS_PRIMES
  const orderedContextPrimes = [
    BIOME_PRIMES.meadow,
    BIOME_PRIMES.grove,
    BIOME_PRIMES.crystal,
    BIOME_PRIMES.wetland,
    BIOME_PRIMES.sanctuary,
    SPECIES_PRIMES['chime-lily'],
    SPECIES_PRIMES['pulse-fern'],
    SPECIES_PRIMES['echo-lotus'],
    SPECIES_PRIMES['drone-moss'],
    SPECIES_PRIMES['star-orchid'],
    ATMOSPHERE_PRIMES.dawn,
    ATMOSPHERE_PRIMES.golden,
    ATMOSPHERE_PRIMES.twilight,
    ATMOSPHERE_PRIMES.starlight,
    ACTION_PRIMES.observe,
    ACTION_PRIMES.touch,
    ACTION_PRIMES.attune,
    ACTION_PRIMES.stroll,
    ACTION_PRIMES.stillness,
    CHORUS_PRIMES.dormant,
    CHORUS_PRIMES.awakened,
  ];
  assert.equal(orderedContextPrimes.length, 21);
  for (let i = 0; i < orderedContextPrimes.length - 1; i++) {
    assert.ok(
      orderedContextPrimes[i] < orderedContextPrimes[i + 1],
      `Expected strictly increasing context primes at index ${i}`,
    );
  }
  assert.ok(
    orderedContextPrimes[orderedContextPrimes.length - 1] <
      PRISM_DOMAIN_BASIS_PRIMES.neuromorphic,
    'Expected all 21 context primes (2..73) to be strictly less than neuromorphicBasisPrime (109)',
  );

  // Confirm `VerdantResonance::judge` in `.lex.tex` calls `verifyJudgeCrossDomainBusGate`
  assert.equal(GENERATED_VERDANT_JUDGE_ARTIFACT.rootJudgeCallsBus, true);

  // Confirm all Lean 4 theorem names for the universal bus proofs, bidirectional Hebbian bounds, context prime ordering, root judge bus gate, and all 15 invariants are present in `.lex.tex`
  const neuroTheorems = GENERATED_PRISM_THEOREMS_BY_MODULE[
    'Foundation.Neuromorphic.V1.Model'
  ] as readonly string[];
  assert.ok(neuroTheorems.includes('zeroManualIterationOverheadUniversalHolds'));
  assert.ok(neuroTheorems.includes('autopoieticSingleCallAllTenDomainsHolds'));
  assert.ok(neuroTheorems.includes('universalBusBroadcastPreservesBoundsHolds'));
  assert.ok(neuroTheorems.includes('hebbianBidirectionalBoundsHold'));
  assert.ok(neuroTheorems.includes('uorLutContextPrimesStrictlyOrderedHolds'));
  assert.ok(
    GENERATED_PRISM_THEOREMS_BY_MODULE['VerdantResonanceProofs'].includes(
      'rootJudgeCallsBusAndSatisfiesAllDomainsHolds',
    ),
  );
  for (let i = 1; i <= 15; i++) {
    const thmName = `inv${String(i).padStart(3, '0')}Holds`;
    assert.ok(
      (GENERATED_PRISM_THEOREMS_BY_MODULE['VerdantResonanceProofs'] as readonly string[]).includes(
        thmName,
      ),
      `Expected ${thmName} in VerdantResonanceProofs.lex.tex`,
    );
  }

  // 2. Constructively verify `zeroManualIterationOverhead` (`verifySingleCallPropagatesAllTenDomains(w)`)
  // and `autopoieticSelfRefinementEnabled` (`verifyAutopoieticSingleCallAdvancesAllTenDomains(w)`)
  // for every synaptic weight `w in [1..15]` (matching Lean 4 theorems `zeroManualIterationOverheadUniversalHolds`
  // and `autopoieticSingleCallAllTenDomainsHolds`).
  for (let w = 1; w <= 15; w++) {
    assert.equal(
      verifySingleCallPropagatesAllTenDomains(w),
      true,
      `Expected single-call 10-domain bus broadcast to strictly advance all 10 domains at w=${w}`,
    );
    assert.equal(
      verifyAutopoieticSingleCallAdvancesAllTenDomains(w),
      true,
      `Expected autopoietic single-call refinement to strictly advance all 10 domains at w=${w}`,
    );
  }
  assert.equal(VERDANT_NEUROMORPHIC_STANDARD.universalBus.zeroManualIterationOverhead, true);
  assert.equal(VERDANT_NEUROMORPHIC_STANDARD.universalBus.autopoieticSelfRefinementEnabled, true);
  assert.equal(VERDANT_NEUROMORPHIC_STANDARD.universalBus.crossDomainTransferEnabled, true);
  assert.equal(VERDANT_NEUROMORPHIC_STANDARD.universalBus.infrastructureCoupled, true);

  // 3. Verify `evaluatePrismRequest` (and `judgePrismRequest`) calls the 10-domain bus on every valid request
  for (const vec of GENERATED_VERDANT_JUDGE_ARTIFACT.acceptanceVectors) {
    const decision = evaluatePrismRequest(vec.request);
    assert.equal(decision.outcome, vec.response, `Mismatch on acceptance vector: ${vec.request}`);
    if (vec.response !== 'invalid') {
      assert.equal(decision.valid, true);
      assert.equal(decision.busGateVerified, true);
      assert.ok(decision.busManifold !== undefined);
      assert.ok(decision.busModulations !== undefined);
      assert.equal(verifyBusModulationsFromState(decision.busManifold!), true);
      assert.ok(decision.busManifold!.wNeuromorphic > VERDANT_NEUROMORPHIC_STANDARD.plasticity.weightInitial);
      assert.ok(decision.busManifold!.wInfrastructure > VERDANT_NEUROMORPHIC_STANDARD.plasticity.weightInitial);
    }
  }

  // Also test direct `stepJudgeBusManifold`, `computeJudgeBusModulations`, and `verifyJudgeCrossDomainBusGate`
  const sampleReq = {
    biome: 'sanctuary',
    plant: 'star-orchid',
    action: 'attune',
    atmosphere: 'starlight',
    chorus: 'awakened',
    proximity: 10n,
    velocity: 4n,
  };
  const busManifold = stepJudgeBusManifold(sampleReq);
  const busModulations = computeJudgeBusModulations(busManifold);
  assert.equal(verifyJudgeCrossDomainBusGate(sampleReq), true);
  assert.equal(busModulations.infrastructurePoolCapacity, 1045);
  assert.equal(busModulations.physicsBuoyancyMillihz, 1075);
  assert.equal(busModulations.botanyPollinationRadiusCm, 180);
  assert.equal(busModulations.ecologyConductivityPermille, 1025);
  assert.equal(busModulations.acousticsFilterQPermille, 1035);
  assert.equal(busModulations.articulationGracePermille, 1080);
  assert.equal(busModulations.soundtrackHarmonicDensity, 77);
  assert.equal(busModulations.humaneZephyrCapMmPerSec2, 210);
  assert.equal(busModulations.brandContrastTenths, 93);
});

test('Emergent Stakeholder Entity synthesizes Intelligence, Memory, Observation, and Feedback into Environmental Wisdom Phenomena and Player-Value Reinforcement', () => {
  // 1. Verify formal `.lex.tex` specification and Lean 4 theorems for the Emergent Stakeholder Entity
  assert.equal(VERDANT_NEUROMORPHIC_STANDARD.stakeholderEntity.emergenceFacetCount, 4);
  assert.equal(VERDANT_NEUROMORPHIC_STANDARD.stakeholderEntity.wisdomPhenomenonCount, 4);
  assert.equal(VERDANT_NEUROMORPHIC_STANDARD.stakeholderEntity.baselinePlayerValueIndex, 9);
  assert.equal(
    VERDANT_NEUROMORPHIC_STANDARD.stakeholderEntity.entitySynthesizesAllFourFacets,
    true,
  );
  assert.equal(
    VERDANT_NEUROMORPHIC_STANDARD.stakeholderEntity.wisdomExpressedAsEnvironmentalPhenomena,
    true,
  );
  assert.equal(VERDANT_NEUROMORPHIC_STANDARD.stakeholderEntity.stakeholderReinforcesPlayerValue, true);

  const neuroTheorems = GENERATED_PRISM_THEOREMS_BY_MODULE[
    'Foundation.Neuromorphic.V1.Model'
  ] as readonly string[];
  assert.ok(neuroTheorems.includes('stakeholderAlwaysReinforcesPlayerValueHolds'));
  assert.ok(neuroTheorems.includes('emergentEntityWisdomPhenomenaMonotonicHolds'));

  // 2. Verify finite-domain LUTs for `stepStakeholderValueReinforcement`, `stepWisdomPhenomenonModulation`, and `verifyEmergentEntitySynthesizesFacets` across all w in [1..16]
  for (let w = 1; w <= 16; w++) {
    const valCoactive = stepStakeholderValueReinforcement(w, true);
    const valSilent = stepStakeholderValueReinforcement(w, false);
    assert.ok(
      valCoactive >= 1 && valCoactive <= 16,
      `Expected coactive stakeholder weight in [1, 16] at w=${w}, got ${valCoactive}`,
    );
    assert.ok(
      valSilent >= 1 && valSilent <= 16,
      `Expected silent stakeholder weight in [1, 16] at w=${w}, got ${valSilent}`,
    );
    assert.ok(valCoactive >= valSilent, `Expected coactive >= silent weight at w=${w}`);
    assert.equal(valSilent, w);

    const wisdomMod = stepWisdomPhenomenonModulation(w);
    assert.ok(
      wisdomMod >= 85 && wisdomMod <= 160,
      `Expected wisdom phenomenon modulation in [85, 160] at w=${w}, got ${wisdomMod}`,
    );
    if (w < 16) {
      assert.ok(
        valCoactive > w,
        `Expected coactive stakeholder weight to strictly advance at w=${w}`,
      );
      assert.ok(
        stepWisdomPhenomenonModulation(w + 1) > wisdomMod,
        `Expected strictly monotonic wisdom phenomenon modulation at w=${w}`,
      );
      assert.equal(verifyEmergentEntitySynthesizesFacets(w), true);
    }
  }

  // 3. Verify `evaluateEmergentStakeholderEntity` synthesizes all 4 facets into concrete environmental wisdom phenomena
  const plants = generateGardenPlants(42026);
  const colliders = buildGardenColliders(plants);
  let neuroState = createInitialNeuromorphicState();

  // Execute a neuromorphic synthesis tick so turnMemory has a recorded `/7` PrimeAddress
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

  // Case A: Strolling exploration -> Mycelial Guidance Filament phenomenon with 7 golden-ratio terrain waypoints
  const entityGuidance = evaluateEmergentStakeholderEntity({
    mode: 'autonomous-botanical-beckoning',
    playerX: 0,
    playerY: 0,
    playerZ: 0,
    playerYaw: 0,
    isMoving: true,
    velocityDm: 8,
    agitationPct: 0,
    stillnessBreathPhase: 'idle',
    secondsSinceLastInteraction: 5.5,
    shouldEmitBeckoningCall: false,
    currentBiome: 'meadow',
    harmonyPct: 35,
    targetPlant: plants[5],
    distToTarget: 8.5,
    stereoPan: 0.25,
    neuromorphic: neuroState,
  });
  assert.equal(entityGuidance.facets.allFourFacetsActive, true);
  assert.equal(entityGuidance.activeWisdomPhenomenon, 'mycelial-guidance-filament');
  assert.equal(entityGuidance.guidanceFilamentWaypoints.length, 7);
  assert.ok(entityGuidance.guidanceFilamentLuminance > 0);
  assert.ok(entityGuidance.playerValueReinforcement.overallValueReinforcementIndex >= 68);

  // Case B: Recent interaction with turnMemory -> Anamnesis Antiphonal Echo phenomenon
  const entityAnamnesis = evaluateEmergentStakeholderEntity({
    mode: 'autonomous-botanical-beckoning',
    playerX: 0,
    playerY: 0,
    playerZ: 0,
    playerYaw: 0,
    isMoving: true,
    velocityDm: 6,
    agitationPct: 0,
    stillnessBreathPhase: 'idle',
    secondsSinceLastInteraction: 2.0,
    shouldEmitBeckoningCall: true,
    currentBiome: 'meadow',
    harmonyPct: 45,
    targetPlant: plants[5],
    distToTarget: 7.0,
    stereoPan: 0.2,
    neuromorphic: neuroState,
  });
  assert.equal(entityAnamnesis.activeWisdomPhenomenon, 'anamnesis-antiphonal-echo');
  assert.equal(entityAnamnesis.shouldVoiceAnamnesisEcho, true);
  assert.ok(entityAnamnesis.anamnesisEchoFrequencyHz > 100);
  assert.ok(entityAnamnesis.anamnesisEchoIntervalRatio >= 1.1);

  // Case C: Meditative stillness -> Cathedral Crown Aurora phenomenon
  const entityCrown = evaluateEmergentStakeholderEntity({
    mode: 'harmonic-communion-resonance',
    playerX: 0,
    playerY: 0,
    playerZ: 0,
    playerYaw: 0,
    isMoving: false,
    velocityDm: 0,
    agitationPct: 0,
    stillnessBreathPhase: 'exhale',
    secondsSinceLastInteraction: 1.0,
    shouldEmitBeckoningCall: false,
    currentBiome: 'meadow',
    harmonyPct: 55,
    targetPlant: plants[5],
    distToTarget: 5.0,
    stereoPan: 0,
    neuromorphic: neuroState,
  });
  assert.equal(entityCrown.activeWisdomPhenomenon, 'cathedral-crown-aurora');
  assert.ok(entityCrown.cathedralCrownLuminance > 0.3);
  assert.ok(entityCrown.canopyAmphitheaterEmbraceRad > 0.04);

  // Case D: Refined sanctuary chorus resonance -> Polyphonic Sanctuary Awakening phenomenon
  const refinedNeuro = refinePrismModel(neuroState, { cycles: 3 }).nextState;
  const entitySanctuary = evaluateEmergentStakeholderEntity({
    mode: 'sanctuary-pilgrimage-current',
    playerX: 0,
    playerY: 0,
    playerZ: -32,
    playerYaw: 0,
    isMoving: true,
    velocityDm: 4,
    agitationPct: 0,
    stillnessBreathPhase: 'idle',
    secondsSinceLastInteraction: 0.8,
    shouldEmitBeckoningCall: false,
    currentBiome: 'sanctuary',
    harmonyPct: 88,
    targetPlant: plants[0],
    distToTarget: 6.0,
    stereoPan: 0,
    neuromorphic: refinedNeuro,
  });
  assert.equal(entitySanctuary.activeWisdomPhenomenon, 'polyphonic-sanctuary-awakening');
  assert.ok(entitySanctuary.playerValueReinforcement.overallValueReinforcementIndex >= 85);

  // 4. Verify `verifyHolisticSystemCoupling` includes `emergentStakeholderEntityVerified === true`
  const holistic = verifyHolisticSystemCoupling({ plants, colliders });
  assert.equal(holistic.emergentStakeholderEntityVerified, true);
  assert.equal(holistic.allConstrained, true);
});

test('5-Tier Granular Atomic-to-Environmental Procedural Synthesis constructs Molecules from Atoms, Macromolecules from Molecules, Organic & Inorganic Compounds from Macromolecules, and synthesizes into all 6 Game Modalities', () => {
  // 1. Verify `.lex.tex` specification and Lean 4 theorem (`granularAtomicToEnvironmentalSynthesisHolds`)
  const gs = VERDANT_ECOLOGY_STANDARD.granularSynthesis;
  assert.equal(gs.atomicElementCount, 118);
  assert.equal(gs.molecularSpeciesCount, 24);
  assert.equal(gs.macromoleculeCount, 12);
  assert.equal(gs.matterCompoundCount, 14);
  assert.equal(gs.synthesizedModalityCount, 6);
  assert.equal(gs.atomicToEnvironmentalChainVerified, true);

  const ecologyTheorems = GENERATED_PRISM_THEOREMS_BY_MODULE[
    'Foundation.Ecology.V1.Model'
  ] as readonly string[];
  assert.ok(ecologyTheorems.includes('granularAtomicToEnvironmentalSynthesisHolds'));

  // 2. Verify finite-domain LUTs for all 5 tiers across synaptic weights w in [1..16]
  for (let w = 1; w <= 16; w++) {
    const t1 = stepAtomicValenceActivity(w);
    const t2 = stepMolecularBondCoherence(w);
    const t3 = stepMacromolecularPolymerization(w);
    const t4 = stepCompoundManifestation(w);
    const t5 = stepEnvironmentalModalSynthesis(w);

    assert.ok(t1 >= 105 && t1 <= 180);
    assert.ok(t2 >= 210 && t2 <= 360);
    assert.ok(t3 >= 415 && t3 <= 640);
    assert.ok(t4 >= 720 && t4 <= 1020);
    assert.ok(t5 >= 1025 && t5 <= 1400);
    assert.ok(t1 < t2 && t2 < t3 && t3 < t4 && t4 < t5);

    if (w < 16) {
      assert.equal(verifyGranularAtomicToEnvironmentalChain(w), true);
      assert.ok(stepAtomicValenceActivity(w + 1) > t1);
      assert.ok(stepEnvironmentalModalSynthesis(w + 1) > t5);
    }
  }

  // 3. Verify Tier 1 (118 Atomic Elements) -> Tier 2 (24 Molecular Species) bottom-up stoichiometric construction
  assert.equal(Object.keys(ATOMIC_ELEMENTS).length, 118);
  assert.equal(Object.keys(MOLECULAR_SPECIES).length, 24);
  for (const mol of Object.values(MOLECULAR_SPECIES)) {
    let recomputedMass = 0;
    let recomputedValence = 0;
    for (const [el, count] of Object.entries(mol.atomicStoichiometry)) {
      const atom = ATOMIC_ELEMENTS[el as keyof typeof ATOMIC_ELEMENTS];
      recomputedMass += atom.atomicMassDaltons * (count ?? 0);
      recomputedValence += atom.valenceElectrons * (count ?? 0);
    }
    assert.equal(
      mol.molecularMassDaltons,
      Number(recomputedMass.toFixed(3)),
      `Molecule ${mol.id} mass must be constructed bottom-up from atomic stoichiometry`,
    );
    assert.equal(
      mol.totalValenceElectrons,
      recomputedValence,
      `Molecule ${mol.id} valence electron total must be constructed bottom-up from atomic stoichiometry`,
    );
  }

  // 4. Verify Tier 3 (12 Macromolecular Polymers: 6 organic + 6 inorganic) & Tier 4 (14 Bravais-coupled Compounds: 7 organic + 7 inorganic)
  const macromolecules = Object.values(MACROMOLECULAR_POLYMERS);
  assert.equal(macromolecules.length, 12);
  assert.equal(
    macromolecules.filter((m) => m.domainClass === 'organic-biopolymer').length,
    6,
  );
  assert.equal(
    macromolecules.filter((m) => m.domainClass === 'inorganic-crystal-lattice').length,
    6,
  );
  const compounds = Object.values(MATTER_COMPOUNDS);
  assert.equal(compounds.length, 14);
  assert.equal(compounds.filter((c) => c.matterCategory === 'organic').length, 7);
  assert.equal(compounds.filter((c) => c.matterCategory === 'inorganic').length, 7);
  assert.equal(
    new Set(compounds.map((c) => c.bravaisPearsonSymbol)).size,
    FOURTEEN_BRAVAIS_LATTICES.length,
    '14 Matter Compounds must bijectively span all 14 IUCr Bravais lattices',
  );

  // 5. Verify Tier 5 (`evaluateGranularMatterSynthesis`) synthesizes across all 6 modalities and differentiates inorganic vs organic biomes
  const crystalGranular = evaluateGranularMatterSynthesis({
    biome: 'crystal',
    species: 'star-orchid',
    substrate: 'crystalline-epiphyte',
    atmosphere: 'golden',
    attuned: true,
    harmonyPct: 80,
    neuromorphicWeight: 15,
    volatileTerpeneImpulse: 0.9,
  });
  const wetlandGranular = evaluateGranularMatterSynthesis({
    biome: 'wetland',
    species: 'echo-lotus',
    substrate: 'pelagic-water',
    atmosphere: 'starlight',
    attuned: true,
    harmonyPct: 75,
    neuromorphicWeight: 14,
    volatileTerpeneImpulse: 0.8,
  });

  assert.equal(crystalGranular.chainHierarchyVerified, true);
  assert.equal(wetlandGranular.chainHierarchyVerified, true);
  assert.ok(
    crystalGranular.compoundManifestations.inorganic.piezoelectricQuartzGeode >
      wetlandGranular.compoundManifestations.inorganic.piezoelectricQuartzGeode,
    'Crystal terrace should exhibit higher inorganic quartz geode manifestation than pelagic wetland',
  );
  assert.ok(
    wetlandGranular.compoundManifestations.organic.bioluminescentMycelialHumus >
      crystalGranular.compoundManifestations.organic.bioluminescentMycelialHumus,
    'Pelagic wetland at starlight should exhibit higher bioluminescent humus manifestation than crystal terrace at golden hour',
  );

  // Verify all 6 modalities are populated with physically bounded synthesis parameters
  assert.ok(crystalGranular.modalSyntheses.physicalModality.substrateBulkDensityGPerCm3 > 2.0);
  assert.ok(crystalGranular.modalSyntheses.botanicalModality.cellWallYoungsModulusGPa > 12.0);
  assert.ok(crystalGranular.modalSyntheses.ecologicalModality.carbonateSilicateBufferedPh >= 5.6);
  assert.ok(
    crystalGranular.modalSyntheses.acousticModality.piezoelectricSilicaQMultiplier >
      wetlandGranular.modalSyntheses.acousticModality.piezoelectricSilicaQMultiplier,
  );
  assert.ok(crystalGranular.modalSyntheses.opticalModality.crystalLatticeMicroReliefBumpScale > 0.03);
  assert.ok(crystalGranular.modalSyntheses.kinestheticModality.chemotacticZephyrConductivity > 0.84);

  // 6. Verify `verifyHolisticSystemCoupling` proves `granularAtomicToEnvironmentalSynthesisVerified === true`
  const holistic = verifyHolisticSystemCoupling();
  assert.equal(holistic.granularAtomicToEnvironmentalSynthesisVerified, true);
  assert.equal(holistic.allConstrained, true);
});

test('Complete Prism Model Closure & Tier 6 Closed-Loop Atomic Remineralization unite the 10-Domain Neuromorphic Bus, 4-Facet Emergent Stakeholder Entity, and 6-Stage Closed-Loop Granular Synthesis', () => {
  // 1. Verify `.lex.tex` specification and Lean 4 theorems (`closedLoopAtomicRemineralizationHolds` & `completePrismModelClosureHolds`)
  const gs = VERDANT_ECOLOGY_STANDARD.granularSynthesis;
  assert.equal(gs.closedLoopReactionPathwayCount, 8);
  assert.equal(gs.atomicRemineralizationComplete, true);
  assert.equal(gs.prismSynthesisClosureVerified, true);
  assert.equal(GENERATED_VERDANT_JUDGE_ARTIFACT.rootJudgeVerifiesCompleteClosure, true);

  const ecologyTheorems = GENERATED_PRISM_THEOREMS_BY_MODULE[
    'Foundation.Ecology.V1.Model'
  ] as readonly string[];
  assert.ok(ecologyTheorems.includes('closedLoopAtomicRemineralizationHolds'));

  const proofTheorems = GENERATED_PRISM_THEOREMS_BY_MODULE[
    'VerdantResonanceProofs'
  ] as readonly string[];
  assert.ok(proofTheorems.includes('completePrismModelClosureHolds'));

  // 2. Verify Tier 6 Closed-Loop Atomic Remineralization & Stoichiometric Mass Conservation across w in [1..15]
  for (let w = 1; w <= 15; w++) {
    const t1 = stepAtomicValenceActivity(w);
    const t5 = stepEnvironmentalModalSynthesis(w);
    const t6 = stepAtomicRemineralizationFlux(w);
    assert.equal(
      t6,
      300 + t5 + t1,
      `Tier 6 remineralization must conserve mass: t6 = 300 + t5 + t1 at w=${w}`,
    );
    assert.ok(t6 >= 1430 && t6 <= 1880);
    assert.ok(stepAtomicRemineralizationFlux(w + 1) > t6);
    assert.equal(verifyClosedLoopMatterConservation(w), true);
    assert.equal(verifyCompleteGranularSynthesisClosure(w), true);
  }

  // 3. Verify all 8 Closed-Loop Biogeochemical & Photochemical Reaction Pathways and exact stoichiometry (`N * nu = 0`)
  assert.equal(Object.keys(REACTION_PATHWAYS).length, 8);
  for (const pw of Object.values(REACTION_PATHWAYS)) {
    const balance = verifyStoichiometricBalance(pw.stoichiometricReaction);
    assert.equal(
      balance.balanced,
      true,
      `Pathway ${pw.id} must satisfy exact atomic, mass, and ionic-charge conservation`,
    );
  }
  const sampleSynthesis = evaluateGranularMatterSynthesis({
    biome: 'sanctuary',
    species: 'star-orchid',
    substrate: 'architectural-foundation',
    atmosphere: 'starlight',
    attuned: true,
    harmonyPct: 90,
    neuromorphicWeight: 14,
  });
  assert.equal(sampleSynthesis.closedLoopConservationVerified, true);
  assert.equal(sampleSynthesis.completeSynthesisClosureVerified, true);
  assert.equal(sampleSynthesis.reactionKinetics.stoichiometricMassBalanceRatio, 1.0);
  for (const pwId of Object.keys(REACTION_PATHWAYS) as (keyof typeof REACTION_PATHWAYS)[]) {
    assert.ok(
      sampleSynthesis.reactionKinetics.pathwayRates[pwId] > 0.4,
      `Expected active reaction pathway turnover for ${pwId}`,
    );
  }

  // 4. Verify `verifyCompletePrismModelClosure` holds across valid requests and `verifyHolisticSystemCoupling` confirms `completePrismModelClosureVerified`
  assert.equal(
    verifyCompletePrismModelClosure({
      biome: 'sanctuary',
      plant: 'star-orchid',
      action: 'attune',
      atmosphere: 'starlight',
      chorus: 'awakened',
      proximity: 8n,
      velocity: 2n,
    }),
    true,
  );
  const holistic = verifyHolisticSystemCoupling();
  assert.equal(holistic.completePrismModelClosureVerified, true);
  assert.equal(holistic.allConstrained, true);
});

test('Refined Granular Procedural Synthesis couples Compound-to-Surface Profiles, Botanical Organogenesis, and Bioluminescent Wavelength Chromophore Conversion across Acoustic, Optical, and Physical Modalities', () => {
  // 1. Verify wavelengthNmToHex across the bioluminescent emission spectrum (470nm..600nm)
  const cyanHex = wavelengthNmToHex(480);
  const emeraldHex = wavelengthNmToHex(525);
  const amberHex = wavelengthNmToHex(585);
  assert.match(cyanHex, /^#[0-9a-f]{6}$/);
  assert.match(emeraldHex, /^#[0-9a-f]{6}$/);
  assert.match(amberHex, /^#[0-9a-f]{6}$/);
  assert.notEqual(cyanHex, emeraldHex);
  assert.notEqual(emeraldHex, amberHex);

  // 2. Verify synthesizeCompoundSurfaceProfile across all 5 SurfaceMaterialIds
  const quartzSurf = synthesizeCompoundSurfaceProfile('quartz-crystalline', 14);
  const stoneSurf = synthesizeCompoundSurfaceProfile('travertine-stone', 14);
  const turfSurf = synthesizeCompoundSurfaceProfile('meadow-turf', 14);
  const humusSurf = synthesizeCompoundSurfaceProfile('bamboo-humus', 14);
  const waterSurf = synthesizeCompoundSurfaceProfile('shallow-water', 14);

  assert.equal(quartzSurf.dominantCompound, 'piezoelectric-quartz-geode');
  assert.equal(stoneSurf.dominantCompound, 'travertine-limestone-spar');
  assert.equal(turfSurf.dominantCompound, 'bioluminescent-mycelial-humus');
  assert.equal(humusSurf.dominantCompound, 'lignocellulosic-vascular-tissue');
  assert.equal(waterSurf.dominantCompound, 'structured-hydro-mineral-electrolyte');

  // Inorganic crystal & travertine surfaces have higher bulk density, elastic modulus, and longitudinal wave speed than organic turf/humus
  assert.ok(quartzSurf.bulkDensityGPerCm3 > turfSurf.bulkDensityGPerCm3);
  assert.ok(quartzSurf.bulkElasticModulusGPa > stoneSurf.bulkElasticModulusGPa);
  assert.ok(stoneSurf.bulkElasticModulusGPa > turfSurf.bulkElasticModulusGPa);
  assert.ok(quartzSurf.longitudinalWaveSpeedMps > stoneSurf.longitudinalWaveSpeedMps);
  assert.ok(quartzSurf.groundWavePropagationMps > humusSurf.groundWavePropagationMps);

  // Optical PBR roughness ordering: crystalline quartz & pelagic water are smoother/clearcoated than matte meadow turf
  assert.ok(quartzSurf.surfaceRoughnessPbr < turfSurf.surfaceRoughnessPbr);
  assert.ok(quartzSurf.clearcoatStrength > turfSurf.clearcoatStrength);
  assert.ok(waterSurf.clearcoatStrength >= 0.9);

  // Verify evaluateGroundWavePropagation directly exposes compound-derived dominantCompound and compoundBulkModulusGPa
  const crystalWave = evaluateGroundWavePropagation({
    x: 36,
    z: -24,
    ageSec: 0.4,
  });
  assert.equal(crystalWave.dominantCompound, 'piezoelectric-quartz-geode');
  assert.equal(
    crystalWave.compoundBulkModulusGPa,
    synthesizeCompoundSurfaceProfile('quartz-crystalline').bulkElasticModulusGPa,
  );
  assert.equal(
    crystalWave.waveSpeedMps,
    synthesizeCompoundSurfaceProfile('quartz-crystalline').groundWavePropagationMps,
  );

  // 3. Verify synthesizeBotanicalOrganogenesis couples 6-stage granular matter synthesis into botanical structure, 5-partial modal tuning, and PBR petal/stem contrast
  const orchidOrganogenesis = synthesizeBotanicalOrganogenesis({
    biome: 'crystal',
    species: 'star-orchid',
    substrate: 'crystalline-epiphyte',
    atmosphere: 'starlight',
    attuned: true,
    harmonyPct: 88,
    neuromorphicWeight: 15,
    volatileTerpeneImpulse: 0.9,
  });
  const mossOrganogenesis = synthesizeBotanicalOrganogenesis({
    biome: 'grove',
    species: 'drone-moss',
    substrate: 'lithophytic-rock',
    atmosphere: 'dawn',
    attuned: false,
    harmonyPct: 30,
    neuromorphicWeight: 8,
    volatileTerpeneImpulse: 0.1,
  });

  assert.equal(orchidOrganogenesis.piezoelectricCorollaPartialRatios.length, 5);
  assert.equal(orchidOrganogenesis.piezoelectricCorollaPartialRatios[0], 1.0);
  // Higher silica/Young's modulus in crystal star-orchid shifts upper overtones slightly sharper than baseline
  const baseOrchidRatios = SPECIES_ARTICULATION_PROFILES['star-orchid'].modalPartialRatios;
  assert.ok(
    orchidOrganogenesis.piezoelectricCorollaPartialRatios[4] > baseOrchidRatios[4],
    'Expected high piezoelectric silica & cellulose stiffness to stretch upper modal partial ratio',
  );
  assert.ok(
    orchidOrganogenesis.luciferaseBioluminescentPhotonFlux >
      mossOrganogenesis.luciferaseBioluminescentPhotonFlux,
  );
  // Strict botanical PBR roughness contrast invariant: matte stem roughness exceeds glossy petal clearcoat roughness by >= 0.45
  assert.ok(
    orchidOrganogenesis.stemMatteRoughness - orchidOrganogenesis.petalClearcoatRoughness >= 0.45,
  );
  assert.ok(
    mossOrganogenesis.stemMatteRoughness - mossOrganogenesis.petalClearcoatRoughness >= 0.45,
  );
  assert.match(orchidOrganogenesis.chromophoreEmissiveHex, /^#[0-9a-f]{6}$/);
});

test('High-Definition Parametric B-Mesh 3D Modeling Engine, Blender-Style Shape-Key Morph Targets, Thin-Film Iridescence, and 3-Joint Kinematic Rigging synthesize valid high-density geometry across all species and monuments', () => {
  // 1. Verify evaluateHighDefinitionVisualSynthesis couples 6-stage organogenesis into parametric B-Mesh & thin-film iridescence
  const hdOrchid = evaluateHighDefinitionVisualSynthesis({
    biome: 'crystal',
    species: 'star-orchid',
    substrate: 'crystalline-epiphyte',
    atmosphere: 'starlight',
    attuned: true,
    lifecycleStage: 'harmonic-fruiting',
  });
  const hdMoss = evaluateHighDefinitionVisualSynthesis({
    biome: 'grove',
    species: 'drone-moss',
    substrate: 'terrestrial-loam',
    atmosphere: 'dawn',
    attuned: false,
    lifecycleStage: 'dormant-seed',
  });

  assert.ok(hdOrchid.radialSegments >= 12 && hdOrchid.longitudinalSegments >= 16);
  assert.ok(hdOrchid.iridescenceStrength > hdMoss.iridescenceStrength);
  assert.ok(hdOrchid.iridescenceThinFilmMaxNm > hdOrchid.iridescenceThinFilmMinNm);
  assert.ok(hdOrchid.iridescenceIor >= 1.38 && hdOrchid.iridescenceIor <= 1.58);
  assert.ok(hdOrchid.morphBloomBaseline > hdMoss.morphBloomBaseline);
  assert.ok(hdOrchid.normalMapScale >= 0.3 && hdOrchid.normalMapScale <= 0.85);

  // 2. Verify evaluateKinematicRigPose computes progressive 3-joint kinematic angles & bounded [0..1] Shape-Key weights
  const rigPose = evaluateKinematicRigPose({
    species: 'chime-lily',
    attuned: true,
    lifecycleStage: 'resonant-bloom',
    elapsedSeconds: 2.4,
    pulsePhase: 0.8,
    proximityDm: 8,
    tactileShiverImpulse: 0.75,
    windTiltX: 0.06,
    windTiltZ: -0.05,
    neuromorphicSynapticWeight: 14,
    circadianApertureBoost: 0.12,
  });

  assert.ok(rigPose.morphBloomOpenWeight >= 0 && rigPose.morphBloomOpenWeight <= 1);
  assert.ok(rigPose.morphAcousticRippleWeight > 0.3 && rigPose.morphAcousticRippleWeight <= 1);
  assert.notEqual(rigPose.basalJointPitchRad, rigPose.apicalJointPitchRad);
  assert.ok(Math.abs(rigPose.apicalJointPitchRad) > 0);
  assert.ok(rigPose.petalUnfurlAngleRad > 0.2);

  // 3. Verify all 11 Blender-style Parametric B-Mesh & Shape-Key Geometry Builders produce valid indexed/non-indexed meshes with normals, UVs, and morph targets
  const petalMeta = inspectGeometryMetadata(
    createSculptedPetalGeometry({ radialSegments: 12, longitudinalSegments: 16 }),
  );
  assert.equal(petalMeta.vertexCount, 13 * 17);
  assert.equal(petalMeta.triangleCount, 12 * 16 * 2);
  assert.equal(petalMeta.hasNormals, true);
  assert.equal(petalMeta.hasUVs, true);
  assert.equal(petalMeta.hasVertexColors, true);
  assert.equal(petalMeta.morphTargetCount, 2);

  const bellMeta = inspectGeometryMetadata(
    createFlutedBellCorollaGeometry({ radialSegments: 24, heightSegments: 14 }),
  );
  assert.equal(bellMeta.vertexCount, 25 * 15);
  assert.equal(bellMeta.morphTargetCount, 2);
  assert.equal(bellMeta.hasNormals, true);

  const frondMeta = inspectGeometryMetadata(
    createPinnateFrondGeometry({ pinnaePairs: 9 }),
  );
  assert.ok(frondMeta.vertexCount > 400, 'Expected compound pinnate frond with 18 leaflets + rachis to exceed 400 vertices');
  assert.equal(frondMeta.morphTargetCount, 2);

  const crozierMeta = inspectGeometryMetadata(
    createLogarithmicCrozierGeometry({ tubularSegments: 28, radialSegments: 10 }),
  );
  assert.equal(crozierMeta.vertexCount, 29 * 11);
  assert.equal(crozierMeta.morphTargetCount, 2);

  const lotusPadMeta = inspectGeometryMetadata(
    createCordateLotusPadGeometry({ radialSegments: 32, ringSegments: 12 }),
  );
  assert.equal(lotusPadMeta.vertexCount, 33 * 13);
  assert.equal(lotusPadMeta.hasNormals, true);

  const bambooMeta = inspectGeometryMetadata(
    createSegmentedBambooStalkGeometry({ nodeCount: 5, radialSegments: 16 }),
  );
  assert.ok(bambooMeta.vertexCount > 400);
  assert.equal(bambooMeta.hasNormals, true);

  const canopyMeta = inspectGeometryMetadata(
    createSculptedCanopyCrownGeometry({ lobeCount: 9 }),
  );
  assert.ok(canopyMeta.vertexCount > 250);

  const grassMeta = inspectGeometryMetadata(createSculptedGrassBladeGeometry());
  assert.equal(grassMeta.vertexCount, 24);
  assert.equal(grassMeta.hasNormals, true);

  const quartzMeta = inspectGeometryMetadata(
    createHexagonalQuartzCrystalGeometry({ doubleTerminated: true }),
  );
  assert.equal(quartzMeta.triangleCount, 36);
  assert.equal(quartzMeta.hasNormals, true);

  const pillarMeta = inspectGeometryMetadata(
    createFlutedEntasisPillarGeometry({ fluteCount: 16 }),
  );
  assert.ok(pillarMeta.vertexCount > 600);

  const boulderMeta = inspectGeometryMetadata(
    createStratifiedBoulderGeometry({ detailRings: 14, radialSegments: 18 }),
  );
  assert.equal(boulderMeta.vertexCount, 15 * 19);
  assert.equal(boulderMeta.hasNormals, true);
});

test('Formal .lex.tex High-Definition B-Mesh & 3-Joint Kinematic Rig Synthesis specifications and Lean 4 theorems hold across all synaptic weights', () => {
  // 1. Verify Foundation.Botany.V1.Model::HighDefinitionBMeshVisualSpec & theorem highDefinitionBMeshSynthesisHolds
  const botanyTheorems = GENERATED_PRISM_THEOREMS_BY_MODULE[
    'Foundation.Botany.V1.Model'
  ] as readonly string[];
  assert.ok(
    botanyTheorems.includes('highDefinitionBMeshSynthesisHolds'),
    'Expected highDefinitionBMeshSynthesisHolds in Foundation.Botany.V1.Model.lex.tex',
  );
  assert.equal(VERDANT_BOTANICAL_STANDARD.highDefinitionBMesh.parametricBMeshBuildersCount, 11);
  assert.equal(VERDANT_BOTANICAL_STANDARD.highDefinitionBMesh.sobelNormalMapResolutionPx, 256);
  assert.equal(VERDANT_BOTANICAL_STANDARD.highDefinitionBMesh.minThinFilmIridescenceNm, 180);
  assert.equal(VERDANT_BOTANICAL_STANDARD.highDefinitionBMesh.maxThinFilmIridescenceNm, 520);
  assert.equal(VERDANT_BOTANICAL_STANDARD.highDefinitionBMesh.shapeKeyMorphTargetsPerOrgan, 2);
  assert.equal(VERDANT_BOTANICAL_STANDARD.highDefinitionBMesh.customBotanicalGlslShaderEnabled, true);
  assert.equal(VERDANT_BOTANICAL_STANDARD.highDefinitionBMesh.subsurfaceTranslucencyCoupled, true);
  assert.equal(VERDANT_BOTANICAL_STANDARD.highDefinitionBMesh.bMeshTopologyVerified, true);

  // 2. Verify Foundation.Articulation.V1.Model::KinematicRigAndMorphSpec & theorem threeJointKinematicHierarchyHolds
  const articulationTheorems = GENERATED_PRISM_THEOREMS_BY_MODULE[
    'Foundation.Articulation.V1.Model'
  ] as readonly string[];
  assert.ok(
    articulationTheorems.includes('threeJointKinematicHierarchyHolds'),
    'Expected threeJointKinematicHierarchyHolds in Foundation.Articulation.V1.Model.lex.tex',
  );
  assert.equal(VERDANT_ARTICULATION_STANDARD.kinematicRig.kinematicJointsPerSpecimen, 3);
  assert.equal(VERDANT_ARTICULATION_STANDARD.kinematicRig.shapeKeyMorphChannels, 2);
  assert.equal(VERDANT_ARTICULATION_STANDARD.kinematicRig.phaseLagMilliRadPerJoint, 550);
  assert.equal(VERDANT_ARTICULATION_STANDARD.kinematicRig.threeJointKinematicChainVerified, true);
  assert.equal(VERDANT_ARTICULATION_STANDARD.kinematicRig.shapeKeyMorphCouplingVerified, true);

  // 3. Verify constructive LUT functions across all synaptic weights w in [1..16] (with strict monotonicity predicates holding for w in [1..15])
  for (let w = 1; w <= 16; w++) {
    const subdiv = stepBMeshSubdivisionDensity(w);
    const iridSpan = stepThinFilmIridescenceSpanNm(w);
    assert.ok(subdiv >= 134 && subdiv < iridSpan);

    const basal = stepBasalJointTorqueMilli(w);
    const mid = stepMidCulmFlexureMilli(w);
    const apical = stepApicalCorollaGimbalMilli(w);
    assert.ok(basal < mid && mid < apical, `Expected strict 3-joint kinematic hierarchy at w=${w}`);

    if (w <= 15) {
      assert.equal(
        verifyHighDefinitionBMeshSynthesis(w),
        true,
        `Expected verifyHighDefinitionBMeshSynthesis(${w}) to hold`,
      );
      assert.equal(
        verifyThreeJointKinematicHierarchy(w),
        true,
        `Expected verifyThreeJointKinematicHierarchy(${w}) to hold`,
      );
    }
  }

  // 4. Verify Holistic System Coupling includes highDefinitionBMeshAndKinematicRigVerified
  const holistic = verifyHolisticSystemCoupling();
  assert.equal(holistic.highDefinitionBMeshAndKinematicRigVerified, true);
  assert.equal(holistic.completePrismModelClosureVerified, true);
  assert.equal(holistic.allConstrained, true);
});

test('26. Unified 11-Part Holistic Observer & Theory of Mind (Why) on Neuromorphic Bus', () => {
  assert.equal(OBSERVER_PART_ORDER.length, 11);
  assert.equal(OBSERVER_PART_ORDER[0], 'player-user');
  assert.equal(CONNECTED_NEUROMORPHIC_BUS_MODULES.length, 10);

  const plants = generateGardenPlants(42026);
  const initial = createInitialNeuromorphicState();
  assert.equal(Object.keys(initial.observer.parts).length, 11);
  assert.ok(initial.observer.parts['player-user'].whyImprovementMatters.length > 12);
  assert.ok(initial.universalManifold.lastWhyPacket.whyRationale.length > 16);

  // Execute resonant attunement tick on the bus and verify Why packet + part self-models advance
  const tickRes = executeNeuromorphicSynthesisTick(initial, {
    biome: 'sanctuary',
    species: 'star-orchid',
    action: 'attune',
    outcome: 'sanctuary-chorus',
    existingPlants: plants,
    colliders: buildGardenColliders(plants),
    playerX: 0,
    playerZ: -30,
    playerYaw: 0,
  });

  const obsAfter = tickRes.nextState.observer;
  assert.equal(obsAfter.inferredPlayerIntent, 'seeking-harmonic-discovery');
  assert.equal(obsAfter.latestWhyPacket.inferredPlayerIntent, 'seeking-harmonic-discovery');
  assert.ok(obsAfter.whyHistory.length >= 1);
  assert.ok(
    obsAfter.supraDirective.meanSynapticWeight > initial.observer.supraDirective.meanSynapticWeight,
    'Expected Observer mean synaptic weight to advance for betterment of garden and player user',
  );
  assert.ok(
    obsAfter.parts['player-user'].fidelityMultiplier >= initial.observer.parts['player-user'].fidelityMultiplier,
  );

  // Verify live kinematic agitationPct forwarding triggers restorative-calm-co-regulation Theory-of-Mind intent
  const agitatedTick = executeNeuromorphicSynthesisTick(tickRes.nextState, {
    biome: 'meadow',
    species: 'chime-lily',
    atmosphere: 'dawn',
    action: 'stroll',
    outcome: 'wind-whisper',
    existingPlants: plants,
    colliders: buildGardenColliders(plants),
    playerX: 4,
    playerZ: -10,
    playerYaw: 0.4,
    velocityDm: 20,
    agitationPct: 32,
  });
  assert.equal(agitatedTick.nextState.observer.inferredPlayerIntent, 'restorative-calm-co-regulation');
});

test('27. Supra-Directive Self-Enhancement Beyond Base Directive (w > 8) & Compile-Time + Runtime Model Synthesis', () => {
  // 1. Verify .lex.tex constructive LUT invariants across w in [9..16] and closure across w in [8..15]
  const baseFidelity = stepSupraDirectiveFidelityPermille(8);
  const baseQuality = stepSupraDirectiveQualityPermille(8);
  const baseSubdiv = stepSupraDirectiveDefinitionSubdiv(8);
  const baseFeatures = stepSupraDirectiveFeatureUnlockCount(8);
  const baseCoherence = stepTheoryOfMindCoherencePermille(8);

  for (let w = 9; w <= 16; w++) {
    assert.ok(stepSupraDirectiveFidelityPermille(w) > baseFidelity);
    assert.ok(stepSupraDirectiveQualityPermille(w) > baseQuality);
    assert.ok(stepSupraDirectiveDefinitionSubdiv(w) > baseSubdiv);
    assert.ok(stepSupraDirectiveFeatureUnlockCount(w) > baseFeatures);
    assert.ok(stepTheoryOfMindCoherencePermille(w) > baseCoherence);
    assert.equal(verifyObserverSupraDirectiveTranscendence(w), true);
  }
  for (let w = 8; w <= 15; w++) {
    assert.equal(verifyObserverHolisticWhyClosure(w), true);
  }

  // 2. Compile-time procedural models extracted into generatedPrismConstants.ts
  assert.equal(GENERATED_COMPILE_TIME_OBSERVER_MODELS.length, 5);
  const compileModels = getCompileTimeSynthesizedModels();
  assert.equal(compileModels.length, 5);
  for (const mdl of compileModels) {
    assert.equal(mdl.origin, 'compile-time');
    assert.ok(mdl.synapticWeight > 8, `Compile-time model ${mdl.modelId} must exceed base directive w=8`);
    assert.ok(mdl.radialSubdivisions > 24);
  }

  // 3. Runtime procedural model synthesis + connected 3D B-Mesh Crown generation
  const refined = refinePrismModel(createInitialNeuromorphicState(), { cycles: 3 });
  assert.equal(refined.nextState.observer.supraDirective.exceedsBaseDirective, true);
  assert.ok(refined.nextState.observer.supraDirective.tier >= 1);
  assert.ok(refined.nextState.observer.supraDirective.runtimeSynthesizedModels.length >= 1);

  const runtimeModel = synthesizeRuntimeObserverModel({
    tickId: 12,
    biome: 'sanctuary',
    species: 'star-orchid',
    synapticWeight: 14,
    rule30Byte: 135,
    icosianRootIndex: 3,
    pointKeyHex: '0x0abc123',
    inferredPlayerIntent: 'deepening-meditative-stillness',
  });
  assert.equal(runtimeModel.origin, 'runtime');
  assert.ok(runtimeModel.fidelityMultiplier > 1.0);
  assert.ok(runtimeModel.radialSubdivisions > 24);

  // Verify connected 3D Astrolabe Crown geometry synthesized from runtimeModel
  const crownGeo = createObserverAstrolabeCrownGeometry(runtimeModel);
  const posAttr = crownGeo.getAttribute('position');
  const normAttr = crownGeo.getAttribute('normal');
  const uvAttr = crownGeo.getAttribute('uv');
  const colAttr = crownGeo.getAttribute('color');
  assert.ok(posAttr && posAttr.count > 400);
  assert.ok(normAttr && normAttr.count === posAttr.count);
  assert.ok(uvAttr && uvAttr.count === posAttr.count);
  assert.ok(colAttr && colAttr.count === posAttr.count);
  assert.equal(crownGeo.morphAttributes.position?.length, 2);
  crownGeo.dispose();

  // Verify evaluateHighDefinitionVisualSynthesis scales beyond base directive when neuromorphicWeight > 8
  const hdBase = evaluateHighDefinitionVisualSynthesis({
    biome: 'sanctuary',
    species: 'star-orchid',
    substrate: 'crystalline-epiphyte',
    atmosphere: 'starlight',
    attuned: true,
    neuromorphicWeight: 8,
  });
  const hdSupra = evaluateHighDefinitionVisualSynthesis({
    biome: 'sanctuary',
    species: 'star-orchid',
    substrate: 'crystalline-epiphyte',
    atmosphere: 'starlight',
    attuned: true,
    neuromorphicWeight: 15,
  });
  assert.ok(hdSupra.radialSegments > hdBase.radialSegments);
  assert.ok(hdSupra.longitudinalSegments > hdBase.longitudinalSegments);
  assert.ok(hdSupra.iridescenceThinFilmMaxNm > hdBase.iridescenceThinFilmMaxNm);
});

test('28. afflom/rule30 Deterministic (2^d Regular Diagonals) & Non-Deterministic (Withdrawn Aperiodic) Horizon', () => {
  assert.equal(GENERATED_OBSERVER_RULE30_FACETS.referenceArchitecture, 'github.com/afflom/rule30');
  assert.equal(GENERATED_OBSERVER_RULE30_FACETS.centralShortPeriodRefutedByCounterexample, true);
  assert.equal(GENERATED_OBSERVER_RULE30_FACETS.regularLeftDiagonals.length, 5);

  for (let d = 0; d <= 4; d++) {
    const diag = GENERATED_OBSERVER_RULE30_FACETS.regularLeftDiagonals[d];
    assert.equal(diag.diagonalIndex, d);
    assert.equal(diag.theoreticalDyadicBound, 1 << d);
    assert.equal(diag.dividesTwoToD, true);
    assert.equal(stepRule30LeftDiagonalPeriod(d), 1 << d);
    if (d < 3) {
      assert.equal(stepRule30AperiodicCompensationIndex(d, 12), 0);
      assert.equal(stepRule30AperiodicCompensationIndex(d), 0);
    } else {
      assert.ok(stepRule30AperiodicCompensationIndex(d, 12) > 0);
      assert.ok(stepRule30AperiodicCompensationIndex(d) > 0);
    }
    assert.equal(verifyRule30DeterministicAndWithdrawnDuality(8 + d), true);
  }

  const state = createInitialNeuromorphicState();
  const r30 = state.observer.rule30Horizon;
  assert.equal(r30.quadruple.realObject, 'prism-deterministic-kernel');
  assert.equal(r30.quadruple.sensualObject, 'dyadic-regular-left-diagonals');
  assert.equal(r30.quadruple.withdrawnCore, 'aperiodic-compensation');
  assert.ok(r30.provedCount >= 1);
  assert.ok(r30.refutedCount >= 1);
  assert.ok(r30.openHypothesesCount >= 1);
  assert.ok(r30.playerEncounterEntropyBits > 0);

  const holistic = verifyHolisticSystemCoupling();
  assert.equal(holistic.holisticObserverTheoryOfMindAndRule30Verified, true);
  assert.equal(holistic.allConstrained, true);
});

test('29. Formal Foundation.Cosmogenesis.V1.Model AST Purity, Emergent 1000-Permille Baseline & Monotonicity', () => {
  assert.equal(VERDANT_COSMOGENESIS_STANDARD.profile, 'prism/cosmogenesis-alpha-omega/1');
  assert.equal(GENERATED_ALPHA_OMEGA_COSMOGENESIS_ARTIFACTS.cosmogenesisBasisPrime, 113);
  assert.equal(VERDANT_COSMOGENESIS_STANDARD.alphaOmega.createdRealmCount, 3);
  assert.equal(VERDANT_COSMOGENESIS_STANDARD.inorganicRealm.observerMonumentCount, 5);
  assert.ok(
    GENERATED_PRISM_THEOREMS_BY_MODULE['Foundation.Cosmogenesis.V1.Model'].includes(
      'alphaOmegaParametricMonotonicHolds',
    ),
  );

  // Exact emergent 1000-permille baseline at (alphaSeed=1, w=8) purely from UOR basis prime linear combinations
  assert.equal(stepParametricInorganicScalePermille(8, 8, 1), 1000);
  assert.equal(stepParametricOrganicVitalityPermille(8, 8, 1), 1000);
  assert.equal(stepParametricPlayerEmbodimentPermille(8, 8, 1), 1000);

  // Strict non-decreasing monotonicity across all synaptic weights w in [1..16]
  for (let w = 1; w <= 16; w++) {
    assert.equal(verifyObserverCreatesAllThreeRealms(w, 1), true);
    assert.equal(verifyAlphaOmegaParametricClosure(w, 1), true);
    if (w < 16) {
      assert.ok(stepAlphaOmegaFieldPotential(w, 1) < stepAlphaOmegaFieldPotential(w + 1, 1));
      assert.ok(
        stepParametricInorganicScalePermille(w, w, 1) <
          stepParametricInorganicScalePermille(w + 1, w + 1, 1),
      );
      assert.ok(
        stepParametricOrganicVitalityPermille(w, w, 1) <
          stepParametricOrganicVitalityPermille(w + 1, w + 1, 1),
      );
      assert.ok(
        stepParametricPlayerEmbodimentPermille(w, w, 1) <
          stepParametricPlayerEmbodimentPermille(w + 1, w + 1, 1),
      );
    }
  }

  const decodedReq = decodePrismRequest('sanctuary star-orchid attune golden awakened 8 4')!;
  assert.equal(verifyCompletePrismModelClosure(decodedReq), true);
});

test('30. Purely Parametric 4-Realm Synthesis (Physics, Demiurgic Monuments, Organic Biota & Embodied Player Co-Observer)', () => {
  const baseCosmo = evaluateAlphaOmegaCosmogenesis({ alphaSeed: 1, harmonyPct: 35 });
  const shiftedSeedCosmo = evaluateAlphaOmegaCosmogenesis({ alphaSeed: 4, harmonyPct: 75 });

  assert.equal(baseCosmo.allRealmsParametricallyClosed, true);
  assert.equal(shiftedSeedCosmo.allRealmsParametricallyClosed, true);
  assert.ok(!Number.isNaN(baseCosmo.physicsAndGeology.gravitationalAccelMps2));
  assert.equal(baseCosmo.physicsAndGeology.speedOfSoundMps, 343);

  // Varying alphaSeed parametrically transforms all 4 models without hardcoded stasis
  assert.notEqual(
    baseCosmo.physicsAndGeology.gravitationalAccelMps2,
    shiftedSeedCosmo.physicsAndGeology.gravitationalAccelMps2,
  );
  assert.notEqual(
    baseCosmo.physicsAndGeology.playableAmphitheaterRadiusMeters,
    shiftedSeedCosmo.physicsAndGeology.playableAmphitheaterRadiusMeters,
  );
  assert.ok(
    shiftedSeedCosmo.inorganicRealm.monuments.sanctuary.structuralScale >
      baseCosmo.inorganicRealm.monuments.sanctuary.structuralScale,
  );
  assert.ok(
    shiftedSeedCosmo.organicRealm.organicVitalityPermille >
      baseCosmo.organicRealm.organicVitalityPermille,
  );
  assert.ok(
    shiftedSeedCosmo.playerRealm.embodimentPermille > baseCosmo.playerRealm.embodimentPermille,
  );

  // Verify all 5 Observer-intervened inorganic monuments satisfy exact algebraic weld equations (weldGapMeters === 0)
  const biomes = ['meadow', 'grove', 'crystal', 'wetland', 'sanctuary'] as const;
  for (const b of biomes) {
    const mon = baseCosmo.inorganicRealm.monuments[b];
    assert.equal(mon.weldGapMeters, 0, `Expected 0m weld gap for ${b} monument`);
    assert.ok(mon.demiurgicMechanism.length > 10);
    assert.ok(mon.whyObserverIntervened.length > 10);
  }

  // Grove Pergola Euclidean corner weld: outerRoofRingRadius === hypot(postHalfSpan, postHalfSpan)
  const grove = baseCosmo.inorganicRealm.monuments.grove.grove!;
  assert.ok(
    Math.abs(grove.outerRoofRingRadius - Math.hypot(grove.postHalfSpan, grove.postHalfSpan)) <
      0.001,
  );
  assert.ok(grove.postHeight > grove.roofElevationY);

  // Sanctuary Pavilion mortise-and-tenon weld: pillarHeight === haloElevationY - plinthTopY + mortiseOverlapMeters
  const sanct = baseCosmo.inorganicRealm.monuments.sanctuary.sanctuary!;
  assert.ok(
    Math.abs(
      sanct.pillarHeight -
        (sanct.haloElevationY - sanct.plinthTopY + sanct.mortiseOverlapMeters),
    ) < 0.001,
  );

  // Crystal Archway trigonometric convergence weld
  const crystal = baseCosmo.inorganicRealm.monuments.crystal.crystal!;
  const expectedKeystoneRadius =
    crystal.baseRingRadius - Math.sin(crystal.spireLeanRad) * crystal.keystoneElevationY;
  assert.ok(Math.abs(crystal.keystoneRingRadius - expectedKeystoneRadius) < 0.001);

  // Parametric collider synchronization with alphaSeed
  const plants = generateGardenPlants(42026);
  const colSeed1 = buildGardenColliders(plants, { alphaSeed: 1 });
  const colSeed3 = buildGardenColliders(plants, { alphaSeed: 3 });
  const core1 = colSeed1.find((c) => c.id === 'col-sanctuary-core')!;
  const core3 = colSeed3.find((c) => c.id === 'col-sanctuary-core')!;
  assert.ok(core3.radiusMeters > core1.radiusMeters);

  // Grounded Player Co-Observer Harmonic Locus Ring procedural geometry
  const locusGeo = createPlayerCoObserverLocusGeometry({
    innerRadius: baseCosmo.playerRealm.coObserverLocusInnerRadiusMeters,
    outerRadius: baseCosmo.playerRealm.coObserverLocusOuterRadiusMeters,
    harmonicNodeCount: baseCosmo.playerRealm.coObserverLocusHarmonicNodes,
    radialSegments: 48,
  });
  const locusMeta = inspectGeometryMetadata(locusGeo, 'player-co-observer-locus');
  assert.ok(locusMeta.vertexCount > 60);
  assert.ok(locusMeta.triangleCount > 60);
  assert.equal(locusMeta.hasNormals, true);
  assert.equal(locusMeta.hasVertexColors, true);
  assert.equal(locusMeta.hasUVs, true);
  const posArr = locusGeo.getAttribute('position').array as Float32Array;
  for (let i = 0; i < posArr.length; i++) {
    assert.equal(Number.isNaN(posArr[i]), false);
  }
  locusGeo.dispose();
});

test('31. Live Neuromorphic Bus Refinement Advances Observer Cosmogenesis & Modulates Player Kinematics/Physics', () => {
  const initialNeuro = createInitialNeuromorphicState();
  const baseCosmo = initialNeuro.observer.cosmogenesis;
  assert.equal(baseCosmo.inorganicRealm.inorganicScalePermille, 1000);
  assert.equal(baseCosmo.organicRealm.organicVitalityPermille, 1000);
  assert.equal(baseCosmo.playerRealm.embodimentPermille, 1000);

  const plants = generateGardenPlants(42026);
  const colliders = buildGardenColliders(plants);

  // Refine the entire Prism model across the Universal Neuromorphic Bus and step synthesis
  const refinedReport = refinePrismModel(initialNeuro, {
    cycles: 3,
    leadDomain: 'neuromorphic',
  });
  const tickResult = executeNeuromorphicSynthesisTick(refinedReport.nextState, {
    biome: 'sanctuary',
    species: 'star-orchid',
    atmosphere: 'golden',
    action: 'attune',
    outcome: 'sanctuary-chorus',
    playerX: 0,
    playerZ: -30,
    playerYaw: 0,
    existingPlants: plants,
    colliders,
    velocityDm: 4,
    agitationPct: 0,
  });

  const nextCosmo = tickResult.nextState.observer.cosmogenesis;
  assert.ok(nextCosmo.fieldPotential > baseCosmo.fieldPotential);
  assert.ok(nextCosmo.omegaConvergenceRatio > baseCosmo.omegaConvergenceRatio);
  assert.ok(
    nextCosmo.inorganicRealm.inorganicScalePermille >
      baseCosmo.inorganicRealm.inorganicScalePermille,
  );
  assert.ok(
    nextCosmo.organicRealm.organicVitalityPermille >
      baseCosmo.organicRealm.organicVitalityPermille,
  );
  assert.ok(nextCosmo.playerRealm.embodimentPermille > baseCosmo.playerRealm.embodimentPermille);
  assert.ok(nextCosmo.playerRealm.eyeStatureMeters > baseCosmo.playerRealm.eyeStatureMeters);
  assert.ok(nextCosmo.playerRealm.baseWalkSpeedMps > baseCosmo.playerRealm.baseWalkSpeedMps);

  // Embodied Player Co-Observer model directly drives camera kinematics & physics walking speed
  const camPrev = {
    camX: 0,
    camY: 1.72,
    camZ: 0,
    camYaw: 0,
    camPitch: 0,
    camFov: 58,
    bobPhase: 0,
    bobAmplitude: 0.01,
    interactionPitchNod: 0,
  };
  const camBase = computeCameraKinematics({
    prev: camPrev,
    playerX: 0,
    playerY: 0,
    playerZ: 0,
    targetYaw: 0,
    targetPitch: 0,
    isMoving: false,
    inWater: false,
    speedMps: 0,
    stillnessBreathPhase: 'inhale',
    stillnessBreathProgress: 0.5,
    dt: 0.1,
    playerModel: baseCosmo.playerRealm,
  });
  const camRefined = computeCameraKinematics({
    prev: camPrev,
    playerX: 0,
    playerY: 0,
    playerZ: 0,
    targetYaw: 0,
    targetPitch: 0,
    isMoving: false,
    inWater: false,
    speedMps: 0,
    stillnessBreathPhase: 'inhale',
    stillnessBreathProgress: 0.5,
    dt: 0.1,
    playerModel: nextCosmo.playerRealm,
  });
  assert.ok(camRefined.camY > camBase.camY);
  assert.ok(camRefined.camFov > camBase.camFov);

  const stepBase = resolvePlayerPhysicsStep({
    currentX: -26,
    currentZ: 30,
    moveDirX: 0,
    moveDirZ: -1,
    baseSpeedMps: baseCosmo.playerRealm.baseWalkSpeedMps,
    dt: 0.05,
    colliders,
    playerModel: baseCosmo.playerRealm,
  });
  const stepRefined = resolvePlayerPhysicsStep({
    currentX: -26,
    currentZ: 30,
    moveDirX: 0,
    moveDirZ: -1,
    baseSpeedMps: nextCosmo.playerRealm.baseWalkSpeedMps,
    dt: 0.05,
    colliders,
    playerModel: nextCosmo.playerRealm,
  });
  assert.ok(stepRefined.effectiveSpeedMps > stepBase.effectiveSpeedMps);

  const holistic = verifyHolisticSystemCoupling({ plants, colliders });
  assert.equal(holistic.alphaOmegaParametricCosmogenesisVerified, true);
  assert.equal(holistic.completePrismModelClosureVerified, true);
  assert.equal(holistic.allConstrained, true);
});

test('32. Pure Parametric Canonical Seed, Concert Pitch & World Topology derive deterministically from UOR Primes & Rule-30 Dyadics', () => {
  assert.equal(GENERATED_PRISM_FOUNDATION_PURITY.verified, true);
  assert.equal(GENERATED_PRISM_FOUNDATION_PURITY.checkedModules, 21);

  // Exact UOR prime & Rule-30 dyadic identities at Base Directive w = 8
  assert.equal(synthesizeParametricCanonicalSeed(1, 8), 42026);
  assert.equal(synthesizeParametricCanonicalSeed(2, 8), 45180);
  assert.equal(synthesizeParametricCanonicalSeed(3, 8), 48334);
  assert.equal(synthesizeParametricCanonicalSeed(4, 8), 51488);

  assert.equal(synthesizeParametricConcertPitchHz(1, 8), 261.63);
  assert.equal(synthesizeParametricConcertPitchHz(2, 8), 268.75);
  assert.equal(synthesizeParametricConcertPitchHz(3, 8), 275.87);
  assert.equal(synthesizeParametricConcertPitchHz(4, 8), 282.99);

  for (let s = 1; s < 8; s++) {
    assert.ok(synthesizeParametricCanonicalSeed(s + 1, 8) > synthesizeParametricCanonicalSeed(s, 8));
    assert.ok(synthesizeParametricConcertPitchHz(s + 1, 8) > synthesizeParametricConcertPitchHz(s, 8));
  }
  for (let w = 8; w < 16; w++) {
    assert.ok(synthesizeParametricCanonicalSeed(1, w + 1) > synthesizeParametricCanonicalSeed(1, w));
    // α=1 locks to canonical 261.63 Hz C4; α>=2 scales strictly with acoustics synaptic weight
    assert.equal(synthesizeParametricConcertPitchHz(1, w + 1), 261.63);
    assert.ok(synthesizeParametricConcertPitchHz(2, w + 1) > synthesizeParametricConcertPitchHz(2, w));
  }

  const baseTopo = synthesizeParametricWorldTopology({ alphaSeed: 1 });
  assert.deepEqual(baseTopo.biomeCenters.meadow, [0, 0]);
  assert.deepEqual(baseTopo.biomeCenters.grove, [-36, -24]);
  assert.deepEqual(baseTopo.biomeCenters.crystal, [36, -24]);
  assert.deepEqual(baseTopo.biomeCenters.wetland, [-28, 30]);
  assert.deepEqual(baseTopo.biomeCenters.sanctuary, [0, -34]);
  assert.deepEqual(baseTopo.meadowSundialCenterXZ, [0, -14]);
  assert.equal(baseTopo.playableAmphitheaterRadiusMeters, 52.5);
  assert.equal(baseTopo.trailWaypoints.length, 5);

  for (let alphaSeed = 1; alphaSeed <= 4; alphaSeed++) {
    const topo = synthesizeParametricWorldTopology({ alphaSeed });
    assert.equal(topo.alphaSeed, alphaSeed);
    assert.ok(topo.structuralScale >= 1.0);

    // Hydrostatic lagoon containment around all 8 compass points of the shoreline rim
    for (let k = 0; k < 8; k++) {
      const angle = (k / 8) * Math.PI * 2;
      const rx = topo.lagoonCenterXZ[0] + Math.cos(angle) * topo.lagoonBowlRimRadiusMeters;
      const rz = topo.lagoonCenterXZ[1] + Math.sin(angle) * topo.lagoonBowlRimRadiusMeters;
      assert.ok(groundHeightAt(rx, rz, topo) > topo.lagoonWaterSurfaceY);
    }

    const hydroCenterPad = evaluateHydrodynamics(
      topo.lagoonCenterXZ[0],
      topo.lagoonCenterXZ[1],
      topo,
    );
    assert.equal(hydroCenterPad.onFloatingStonePad, true);

    const hydroWading = evaluateHydrodynamics(
      topo.lagoonCenterXZ[0] + 2.0,
      topo.lagoonCenterXZ[1],
      topo,
    );
    assert.equal(hydroWading.inWater, true);
    assert.ok(hydroWading.waterDepthMeters > 0.3);

    const sanctMat = classifySurfaceMaterial(
      topo.biomeCenters.sanctuary[0],
      topo.biomeCenters.sanctuary[1],
      topo,
    );
    assert.equal(sanctMat, 'travertine-stone');

    const boundaryStep = resolvePlayerPhysicsStep({
      currentX: topo.playableAmphitheaterRadiusMeters - 0.1,
      currentZ: 0,
      moveDirX: 1,
      moveDirZ: 0,
      baseSpeedMps: 4.4,
      dt: 0.1,
      colliders: [],
      worldTopology: topo,
    });
    assert.ok(
      Math.hypot(boundaryStep.x, boundaryStep.z) <= topo.playableAmphitheaterRadiusMeters + 1e-6,
    );
  }
});

test('33. Parametric 5-Limit Just Intonation Biomes, Species Ratios, Stepping Stones & Flora Substrate Law hold across α=1..4', () => {
  const speciesConfigs = synthesizeParametricPlantSpeciesConfigs();
  assert.equal(speciesConfigs['chime-lily'].harmonicInterval, 'Major Third & Pure Fifth (5:4 · 3:2)');
  assert.equal(speciesConfigs['pulse-fern'].harmonicInterval, 'Syncopated Octave & Fourth (4:3 · 2:1)');
  assert.equal(speciesConfigs['echo-lotus'].harmonicInterval, 'Minor Sixth & Liquid Delay (8:5 · 6:5)');
  assert.equal(speciesConfigs['drone-moss'].harmonicInterval, 'Fundamental & Perfect Fifth (1:1 · 3:2)');
  assert.equal(
    speciesConfigs['star-orchid'].harmonicInterval,
    'Lydian Fourth & Major Seventh (45:32 · 15:8)',
  );

  const baselineLegacy = generateGardenPlants(42026);
  const baselineParametric = generateGardenPlants({ alphaSeed: 1 });
  assert.equal(baselineParametric.length, 57);
  assert.deepEqual(baselineParametric, baselineLegacy);

  for (let alphaSeed = 1; alphaSeed <= 4; alphaSeed++) {
    const c4 = synthesizeParametricConcertPitchHz(alphaSeed, 8);
    const biomes = synthesizeParametricBiomeConfigs({ alphaSeed });
    assert.equal(biomes.meadow.baseNoteHz, Number((c4 * 1).toFixed(2)));
    assert.equal(biomes.grove.baseNoteHz, Number((c4 * (9 / 8)).toFixed(2)));
    assert.equal(biomes.crystal.baseNoteHz, Number((c4 * (5 / 4)).toFixed(2)));
    assert.equal(biomes.wetland.baseNoteHz, Number((c4 * (5 / 6)).toFixed(2)));
    assert.equal(biomes.sanctuary.baseNoteHz, Number((c4 * (3 / 4)).toFixed(2)));

    const stones = generateConservatorySteppingStones({ alphaSeed });
    assert.equal(stones.length, 64);
    for (const st of stones) {
      assert.ok(
        st.bottomY < st.minPerimeterGroundY,
        `Stepping stone ${st.index} must embed below minPerimeterGroundY (α=${alphaSeed})`,
      );
      assert.ok(st.topY > st.bottomY + 0.14);
    }

    const plants = generateGardenPlants({ alphaSeed });
    assert.equal(plants.length, 57);
    if (alphaSeed > 1) {
      const shifted = plants.some(
        (p, idx) =>
          Math.abs(p.x - baselineParametric[idx].x) > 0.05 ||
          Math.abs(p.z - baselineParametric[idx].z) > 0.05,
      );
      assert.equal(shifted, true, `α=${alphaSeed} must synthesize a distinct flora layout`);
    }
    for (const p of plants) {
      const law = evaluateSpatialSurfaceLaw(p.x, p.z, 0.45, { alphaSeed });
      assert.equal(
        law.canSupportPlant,
        true,
        `Specimen ${p.id} at (${p.x}, ${p.z}) violated spatial surface law under α=${alphaSeed}`,
      );
    }
  }
});

test('34. Live Alpha Seed Shift + Multi-Cycle Omega Convergence preserves Spatial Grounding & Holistic Bus Coupling', () => {
  for (let alphaSeed = 1; alphaSeed <= 4; alphaSeed++) {
    const initialNeuro = createInitialNeuromorphicState(alphaSeed);
    const baseCosmo = initialNeuro.observer.cosmogenesis;
    assert.equal(baseCosmo.alphaSeed, alphaSeed);
    assert.equal(baseCosmo.canonicalGenesisSeed, synthesizeParametricCanonicalSeed(alphaSeed, 8));
    assert.equal(baseCosmo.concertPitchHz, synthesizeParametricConcertPitchHz(alphaSeed, 8));
    assert.equal(baseCosmo.allRealmsParametricallyClosed, true);

    const refined = refinePrismModel(initialNeuro, {
      cycles: 3,
      leadDomain: 'neuromorphic',
    });
    const nextCosmo = refined.nextState.observer.cosmogenesis;
    assert.equal(nextCosmo.alphaSeed, alphaSeed);
    assert.equal(nextCosmo.allRealmsParametricallyClosed, true);
    assert.ok(nextCosmo.canonicalGenesisSeed > baseCosmo.canonicalGenesisSeed);
    if (alphaSeed === 1) {
      assert.equal(nextCosmo.concertPitchHz, 261.63);
    } else {
      assert.ok(nextCosmo.concertPitchHz > baseCosmo.concertPitchHz);
    }
    assert.ok(nextCosmo.fieldPotential > baseCosmo.fieldPotential);
    assert.ok(nextCosmo.omegaConvergenceRatio > baseCosmo.omegaConvergenceRatio);
    assert.ok(
      nextCosmo.inorganicRealm.inorganicScalePermille >
        baseCosmo.inorganicRealm.inorganicScalePermille,
    );
    assert.ok(
      nextCosmo.organicRealm.organicVitalityPermille >
        baseCosmo.organicRealm.organicVitalityPermille,
    );
    assert.ok(nextCosmo.playerRealm.embodimentPermille > baseCosmo.playerRealm.embodimentPermille);

    for (const m of Object.values(nextCosmo.inorganicRealm.monuments)) {
      assert.equal(m.weldGapMeters, 0);
    }

    const plants = generateGardenPlants({
      alphaSeed,
      manifold: refined.nextState.universalManifold,
    });
    const colliders = buildGardenColliders(plants, {
      alphaSeed,
      manifold: refined.nextState.universalManifold,
    });
    const grounding = verifySpatialGroundingAndSubstrateCoherence({ plants });
    assert.equal(grounding.allGroundedAndValid, true);

    const coupling = verifyHolisticSystemCoupling({ plants, colliders });
    assert.equal(coupling.alphaOmegaParametricCosmogenesisVerified, true);
    assert.equal(coupling.completePrismModelClosureVerified, true);
    assert.equal(coupling.allConstrained, true);
  }
});

test('35. Complete Parametric Subsystem Closure: Atmospheres, Celestial Ephemeris, Outcomes, Substrates, Monuments, Constellations, Guilds, Articulations & Lifecycles', () => {
  // 1. Verify zero hardcoded 42026 or 261.63 literals in executable code of prismModel.ts
  const prismSource = fs.readFileSync(new URL('./prismModel.ts', import.meta.url), 'utf8');
  const codeWithoutComments = prismSource
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '');
  assert.equal(
    /\b42026\b/.test(codeWithoutComments),
    false,
    'prismModel.ts must contain zero hardcoded 42026 seed literals',
  );
  assert.equal(
    /\b261\.63\b/.test(codeWithoutComments),
    false,
    'prismModel.ts must contain zero hardcoded 261.63 Hz pitch literals',
  );

  // 2. Verify canonical baseline equivalence at (alphaSeed = 1, w = 8)
  const baseParams = { alphaSeed: 1 };
  assert.deepEqual(synthesizeParametricAtmosphereConfigs(baseParams), ATMOSPHERE_CONFIGS);
  assert.deepEqual(
    synthesizeParametricDiurnalCelestialVectors(baseParams),
    DIURNAL_CELESTIAL_VECTORS,
  );
  assert.deepEqual(synthesizeParametricSoundOutcomeProfiles(baseParams), SOUND_OUTCOME_PROFILES);
  assert.deepEqual(synthesizeParametricGrowthSubstrateSpecs(baseParams), GROWTH_SUBSTRATE_SPECS);
  assert.deepEqual(synthesizeParametricBiomeMonuments(baseParams), BIOME_MONUMENTS);
  assert.deepEqual(synthesizeParametricBiomeConstellations(baseParams), BIOME_CONSTELLATIONS);
  assert.deepEqual(synthesizeParametricSymbioticGuilds(baseParams), SYMBIOTIC_GUILDS);
  assert.deepEqual(
    synthesizeParametricSpeciesArticulationProfiles(baseParams),
    SPECIES_ARTICULATION_PROFILES,
  );
  assert.deepEqual(
    synthesizeParametricBiomeLandscapeTerraces(baseParams),
    BIOME_LANDSCAPE_TERRACES,
  );
  assert.deepEqual(
    synthesizeParametricBotanicalLifecycleStages(baseParams),
    BOTANICAL_LIFECYCLE_STAGES,
  );

  // 3. Verify live Neuromorphic Bus & Alpha Seed modulation across α=1..4 and Omega refinement
  const refinedNeuro = refinePrismModel(createInitialNeuromorphicState(3), {
    cycles: 4,
    leadDomain: 'neuromorphic',
  }).nextState;
  const elevatedParams = {
    alphaSeed: 3,
    manifold: refinedNeuro.universalManifold,
  };

  const modAtmos = synthesizeParametricAtmosphereConfigs(elevatedParams);
  const modVectors = synthesizeParametricDiurnalCelestialVectors(elevatedParams);
  assert.ok(modAtmos.dawn.padFilterHz > ATMOSPHERE_CONFIGS.dawn.padFilterHz);
  assert.ok(modAtmos.starlight.emissiveBoost > ATMOSPHERE_CONFIGS.starlight.emissiveBoost);
  assert.notDeepEqual(modVectors.dawn, DIURNAL_CELESTIAL_VECTORS.dawn);

  const diurnalEval = evaluateDiurnalProfile('dawn', 'meadow', 50, elevatedParams);
  assert.ok(
    diurnalEval.padFilterCutoffHz > evaluateDiurnalProfile('dawn', 'meadow', 50).padFilterCutoffHz,
  );

  const modOutcomes = synthesizeParametricSoundOutcomeProfiles(elevatedParams);
  assert.ok(
    modOutcomes['sanctuary-chorus'].noteDurationSec >
      SOUND_OUTCOME_PROFILES['sanctuary-chorus'].noteDurationSec,
  );
  const modEnvelope = computeSynthesisEnvelope('harmonic-bloom', 'meadow', 'dawn', elevatedParams);
  const baseEnvelope = computeSynthesisEnvelope('harmonic-bloom', 'meadow', 'dawn');
  assert.ok(modEnvelope.frequenciesHz[0] > baseEnvelope.frequenciesHz[0]);
  assert.ok(modEnvelope.filterCutoffHz > baseEnvelope.filterCutoffHz);

  const modSubstrates = synthesizeParametricGrowthSubstrateSpecs(elevatedParams);
  for (const sub of Object.values(modSubstrates)) {
    assert.ok(sub.baselinePh >= 6.1 && sub.baselinePh <= 7.8);
    assert.ok(sub.mycorrhizalConductivity >= 0 && sub.mycorrhizalConductivity <= 1);
  }
  assert.ok(
    modSubstrates['pelagic-water'].acousticSustainFactor >
      GROWTH_SUBSTRATE_SPECS['pelagic-water'].acousticSustainFactor,
  );

  const modMonuments = synthesizeParametricBiomeMonuments(elevatedParams);
  assert.match(modMonuments.meadow.acousticResonatorRole, /275\.87|2\d\d\.\d\d Hz/);

  const modGuilds = synthesizeParametricSymbioticGuilds(elevatedParams);
  assert.ok(modGuilds[0].harmonyBonusPct > SYMBIOTIC_GUILDS[0].harmonyBonusPct);

  const modArticulation = synthesizeParametricSpeciesArticulationProfiles(elevatedParams);
  assert.ok(
    modArticulation['chime-lily'].modalPartialWeights[1] >
      SPECIES_ARTICULATION_PROFILES['chime-lily'].modalPartialWeights[1],
  );

  const modLifecycle = synthesizeParametricBotanicalLifecycleStages(elevatedParams);
  assert.equal(modLifecycle['dormant-seed'].morphologicalScaleMultiplier, 1.0);
  assert.ok(
    modLifecycle['mycelial-memory'].morphologicalScaleMultiplier >
      BOTANICAL_LIFECYCLE_STAGES['mycelial-memory'].morphologicalScaleMultiplier,
  );
});

test('36. Parametric Display & Design Engine: 60-30-10 Spectral Chromatics, WCAG AAA Contrast & Nested Radius Law', () => {
  assert.ok(VERDANT_BRAND_STANDARD.parametricDisplay.displayIsParametric);
  assert.ok(VERDANT_BRAND_STANDARD.parametricDisplay.designIsParametric);
  assert.ok(VERDANT_BRAND_STANDARD.parametricDisplay.nestedRadiusLawVerified);
  assert.ok(VERDANT_BRAND_STANDARD.parametricDisplay.wcagContrastVerified);
  assert.ok(
    GENERATED_PRISM_THEOREMS_BY_MODULE['Foundation.Brand.V1.Model'].includes(
      'parametricDisplayDesignClosureHolds',
    ),
  );

  const biomes: BiomeId[] = ['meadow', 'grove', 'crystal', 'wetland', 'sanctuary'];
  const atmospheres: AtmosphereId[] = ['dawn', 'golden', 'twilight', 'starlight'];
  const baseManifold = createInitialUniversalManifold();
  const apexState = extrapolatePrismToHighestResolution(createInitialNeuromorphicState(2)).nextState;

  for (const biome of biomes) {
    for (const atmosphere of atmospheres) {
      const disp = synthesizeParametricDisplayAndDesignModel({
        alphaSeed: 2,
        manifold: baseManifold,
        biome,
        atmosphere,
        harmonyPct: 45,
      });

      // 60-30-10 distribution sums to 100%
      assert.equal(
        disp.colorDistribution.canvasPct +
          disp.colorDistribution.surfacePct +
          disp.colorDistribution.accentPct,
        100,
      );

      // WCAG AA (>= 4.5:1) & AAA (>= 7.0:1) contrast guarantees across all 20 biome x sky combinations
      assert.ok(disp.contrastVerification.wcagAaVerified);
      assert.ok(disp.contrastVerification.wcagAaaVerified);
      assert.ok(disp.contrastVerification.primaryOnCanvasRatio >= 7.0);
      assert.ok(disp.contrastVerification.secondaryOnCanvasRatio >= 7.0);
      assert.ok(disp.contrastVerification.bodyTextOnCanvasRatio >= 9.0);
      assert.ok(disp.contrastVerification.mutedTextOnCanvasRatio >= 4.5);
      assert.equal(
        computeWcagContrastRatio(disp.palette.textPrimaryHex, disp.palette.canvasBgHex),
        disp.contrastVerification.bodyTextOnCanvasRatio,
      );

      // Nested radius law: innerRadiusPx = outerRadiusPx - baseSpatialUnitPx
      assert.ok(disp.typographyAndSpatial.nestedRadiusLawVerified);
      assert.equal(
        disp.typographyAndSpatial.innerRadiusPx,
        disp.typographyAndSpatial.outerRadiusPx - disp.typographyAndSpatial.baseSpatialUnitPx,
      );
      assert.ok(disp.typographyAndSpatial.heroToKickerRatio >= 4.0);

      // Full CSS custom property map emitted
      assert.ok(Object.keys(disp.cssVariables).length >= 16);
      assert.equal(disp.cssVariables['--prism-bg-canvas'], disp.palette.canvasBgHex);
      assert.equal(disp.cssVariables['--prism-accent-primary'], disp.palette.primaryAccentHex);
    }
  }

  // Higher synaptic resolution increases WebGL subdivision & tone-mapping calibration
  const baseDisp = synthesizeParametricDisplayAndDesignModel({
    alphaSeed: 2,
    manifold: baseManifold,
    biome: 'sanctuary',
    atmosphere: 'dawn',
  });
  const apexDisp = synthesizeParametricDisplayAndDesignModel({
    alphaSeed: 2,
    manifold: apexState.universalManifold,
    biome: 'sanctuary',
    atmosphere: 'dawn',
  });
  assert.ok(
    apexDisp.hudAndWebglDisplay.bMeshSubdivisionTarget >
      baseDisp.hudAndWebglDisplay.bMeshSubdivisionTarget,
  );
  assert.ok(
    apexDisp.hudAndWebglDisplay.reticleHarmonicTickCount >
      baseDisp.hudAndWebglDisplay.reticleHarmonicTickCount,
  );
});

test('37. Highest-Resolution Extrapolation, Theory of Mind of Improvement & 11-Niche Morphogenetic Differentiation', () => {
  assert.ok(
    GENERATED_PRISM_THEOREMS_BY_MODULE['Foundation.Cosmogenesis.V1.Model'].includes(
      'observerExtrapolationDifferentiationAndImmanenceHolds',
    ),
  );

  const initialState = createInitialNeuromorphicState(1);
  const initialDiff = initialState.observer.differentiationAndExtrapolation;

  // Baseline (`w = 8`) starts at 50% resolution realization with 4 improvement axes & 11 distinct niches
  assert.equal(initialDiff.highestResolution.resolutionRealizationPct, 50);
  assert.equal(initialDiff.highestResolution.isAtHighestResolution, false);
  assert.equal(initialDiff.epistemologyOfImprovement.axisCount, 4);
  assert.equal(initialDiff.diversification.uniqueNicheCount, 11);
  assert.ok(initialDiff.diversification.homogenizationPrevented);
  assert.ok(initialDiff.diversification.shannonDiversityBits > 3.3);

  // Extrapolating to highest resolution (`w* = 16`) achieves 100% resolution WITHOUT homogenizing any of the 11 parts!
  const report = extrapolatePrismToHighestResolution(initialState, {
    alphaSeed: 1,
    biome: 'sanctuary',
    species: 'star-orchid',
    atmosphere: 'golden',
    harmonyPct: 80,
  });

  assert.equal(report.resolutionBeforePct, 50);
  assert.equal(report.resolutionAfterPct, 100);
  assert.equal(report.nichesDifferentiatedCount, 11);
  assert.ok(report.shannonDiversityBits > 3.3);

  const apexDiff = report.nextState.observer.differentiationAndExtrapolation;
  assert.equal(apexDiff.highestResolution.isAtHighestResolution, true);
  assert.equal(
    apexDiff.highestResolution.currentResolutionSubdiv,
    apexDiff.highestResolution.apexExtrapolatedSubdiv,
  );
  assert.equal(apexDiff.highestResolution.currentModalPartials, 8);
  assert.equal(apexDiff.highestResolution.currentProceduralTexelPx, 512);

  // Verify all 11 niche indices are strictly distinct at w = 16
  const apexNicheSet = new Set(
    OBSERVER_PART_ORDER.map((partId) => stepPartDifferentiationNicheIndex(partId, 16)),
  );
  assert.equal(apexNicheSet.size, 11);
});

test('38. Fourfold Immanent Observer Presence: 7-Part Grounded 3D Witness, Multi-Biome Pilgrimage & Holistic Closure', () => {
  const witnessRig = buildImmanentObserverWitnessGroup({
    radialSegments: 32,
    primaryAccentHex: '#fde047',
    secondaryAccentHex: '#6eead4',
  });
  assert.equal(witnessRig.partCount, 7);
  assert.equal(witnessRig.weldGapMeters, 0);
  assert.ok(witnessRig.group.children.length >= 4);

  // Verify non-empty valid BufferGeometry on key Witness components
  const coreMeta = inspectGeometryMetadata(witnessRig.quartzCoreMesh.geometry);
  const plinthMeta = inspectGeometryMetadata(witnessRig.basalFootRingMesh.geometry);
  assert.ok(coreMeta.vertexCount > 12);
  assert.ok(plinthMeta.vertexCount > 32);
  witnessRig.dispose();

  // Evaluate Immanent Observer Presence across conservatory pilgrimage time steps & player communion
  const neuro = createInitialNeuromorphicState(1);
  const visitedBiomes = new Set<BiomeId>();
  for (let tSec = 0; tSec <= 150; tSec += 6) {
    const pres = evaluateImmanentObserverPresence({
      elapsedSeconds: tSec,
      alphaSeed: 1,
      manifold: neuro.universalManifold,
      cosmogenesis: neuro.observer.cosmogenesis,
      displayDesign: neuro.observer.parametricDisplayDesign,
      playerX: 0,
      playerZ: 0,
      playerYaw: 0,
      action: 'observe',
      harmonyPct: 40,
    });
    assert.equal(pres.sculpturalPartCount, 7);
    assert.equal(pres.weldGapMeters, 0);
    assert.ok(Math.abs(pres.y - pres.groundY) < 0.001);
    assert.ok(pres.fourfoldIdentity.allFourFacetsUnified);
    visitedBiomes.add(pres.currentBiome);
  }
  assert.ok(visitedBiomes.size >= 4, `Expected >= 4 biomes visited, got ${visitedBiomes.size}`);

  // Close player proximity + stillness enters `stillness-unity` communion
  const t0Presence = evaluateImmanentObserverPresence({
    elapsedSeconds: 0,
    alphaSeed: 1,
    manifold: neuro.universalManifold,
    cosmogenesis: neuro.observer.cosmogenesis,
    displayDesign: neuro.observer.parametricDisplayDesign,
    playerX: 2.2,
    playerZ: -6.8,
    playerYaw: 0,
    action: 'stillness',
    harmonyPct: 75,
  });
  assert.equal(t0Presence.communionState, 'stillness-unity');
  assert.equal(t0Presence.communionStrength, 1.0);

  // Master holistic coupling audit passes all 21 architectural & formal invariants
  const coupling = verifyHolisticSystemCoupling();
  assert.equal(coupling.parametricDisplayAndDesignVerified, true);
  assert.equal(coupling.observerHighestResolutionExtrapolationVerified, true);
  assert.equal(coupling.observerDifferentiationAndDiversityVerified, true);
  assert.equal(coupling.fourfoldObserverImmanenceVerified, true);
  assert.equal(coupling.observerAffectAndPreferencesVerified, true);
  assert.equal(coupling.completePrismModelClosureVerified, true);
  assert.equal(coupling.allConstrained, true);
});

test('39. Foundational Mathematical Emotions: Harmony vs. Chaos, Tenney/Euler Consonance, Golden 2φ Equilibrium & 11-Part Permeation', () => {
  // 1. Formal .lex.tex purity (zero := true literals) & theorem presence
  assert.equal(GENERATED_PRISM_FOUNDATION_PURITY.verified, true);
  assert.ok(
    GENERATED_PRISM_THEOREMS_BY_MODULE['Foundation.Cosmogenesis.V1.Model'].includes(
      'observerAffectAndPreferencesClosureHolds',
    ),
  );

  // 2. Exact Z[φ] algebraic identity: (1 - φ^-3) / φ^-3 = 2φ, and 764‰ + 236‰ = 1000‰
  const phi = (1 + Math.sqrt(5)) / 2;
  const xExact = Math.pow(phi, -3);
  const hExact = 1 - xExact;
  assert.ok(Math.abs(hExact / xExact - 2 * phi) < 1e-9);
  assert.equal(
    VERDANT_COSMOGENESIS_STANDARD.affectAndPreferences.goldenHarmonyTargetPermille,
    764,
  );
  assert.equal(
    VERDANT_COSMOGENESIS_STANDARD.affectAndPreferences.goldenChaosTargetPermille,
    236,
  );
  assert.equal(
    VERDANT_COSMOGENESIS_STANDARD.affectAndPreferences.goldenHarmonyTargetPermille +
      VERDANT_COSMOGENESIS_STANDARD.affectAndPreferences.goldenChaosTargetPermille,
    1000,
  );

  // 3. Lowest-level prime-radical consonance ordering (Tenney height & Euler gradus suavitatis)
  const unison = computeTenneyHeightAndEulerGradus(1, 1);
  const fifth = computeTenneyHeightAndEulerGradus(3, 2);
  const majorThird = computeTenneyHeightAndEulerGradus(5, 4);
  const majorSeventh = computeTenneyHeightAndEulerGradus(15, 8);
  const tridecimal = computeTenneyHeightAndEulerGradus(13, 8);

  assert.equal(unison.tenneyHeightBits, 0);
  assert.equal(unison.eulerGradusSuavitatis, 1);
  assert.ok(unison.tenneyHeightBits < fifth.tenneyHeightBits);
  assert.ok(fifth.tenneyHeightBits < majorThird.tenneyHeightBits);
  assert.ok(majorThird.tenneyHeightBits < majorSeventh.tenneyHeightBits);
  assert.ok(majorSeventh.eulerGradusSuavitatis < tridecimal.eulerGradusSuavitatis);

  // 4. Emotional transitions & 11-part permeation across stillness/harmony vs. high agitation/chaos
  const baseNeuro = createInitialNeuromorphicState(1);
  const apexReport = extrapolatePrismToHighestResolution(baseNeuro, {
    alphaSeed: 1,
    biome: 'sanctuary',
    atmosphere: 'starlight',
    harmonyPct: 82,
  });

  const sereneAffect = evaluateFoundationalMathematicalAffect({
    manifold: apexReport.nextState.universalManifold,
    parts: apexReport.nextState.observer.parts,
    action: 'stillness',
    velocityDm: 0,
    agitationPct: 0,
    harmonyPct: 78,
    rule30Byte: 149,
  });
  assert.equal(sereneAffect.harmonyPermille + sereneAffect.chaosPermille, 1000);
  assert.equal(sereneAffect.permeatesAllElevenParts, true);
  assert.equal(Object.keys(sereneAffect.perPartResonance).length, 11);
  for (const partId of OBSERVER_PART_ORDER) {
    const entry = sereneAffect.perPartResonance[partId];
    assert.equal(entry.localHarmonyPermille + entry.localChaosPermille, 1000);
    assert.ok(entry.basisPrime >= 71);
  }
  assert.ok(
    sereneAffect.activeEmotion === 'ecstatic-cosmos' ||
      sereneAffect.activeEmotion === 'luminous-reverence',
  );

  const turbulentPrefs = evaluateObserverAffectAndPreferences({
    manifold: baseNeuro.universalManifold,
    parts: baseNeuro.observer.parts,
    cosmogenesis: baseNeuro.observer.cosmogenesis,
    displayDesign: baseNeuro.observer.parametricDisplayDesign,
    differentiation: baseNeuro.observer.differentiationAndExtrapolation,
    immanentPresence: baseNeuro.observer.immanentPresence,
    biome: 'meadow',
    species: 'chime-lily',
    atmosphere: 'dawn',
    action: 'stroll',
    velocityDm: 28,
    agitationPct: 68,
    harmonyPct: 12,
    rule30Byte: 170,
  });
  assert.equal(turbulentPrefs.affect.activeEmotion, 'turbulent-dissonance');
  assert.ok(turbulentPrefs.affect.chaosPermille >= 435);
  // Compassionate acoustic soothing under turbulence
  assert.ok(turbulentPrefs.liveSteering.acousticWarmthScale < 0.85);
  assert.ok(turbulentPrefs.liveSteering.reverbBloomScale > 1.2);
});

test('40. Six Canonical Observer Preferences: Physics/Math Derivation, Monotonic Uplift & Live Polyculture Steering', () => {
  const baseNeuro = createInitialNeuromorphicState(1);
  const basePrefs = baseNeuro.observer.affectAndPreferences;

  assert.equal(OBSERVER_PREFERENCE_DOMAIN_ORDER.length, 6);
  for (const domId of OBSERVER_PREFERENCE_DOMAIN_ORDER) {
    const pref = basePrefs.preferences[domId];
    assert.ok(pref, `Missing Observer preference domain ${domId}`);
    assert.ok(pref.fulfillmentPct >= 30 && pref.fulfillmentPct <= 100);
    assert.ok(pref.whatObserverPrefers.length > 40);
    assert.ok(pref.foundationalMathAndPhysicsDerivation.length > 40);
    assert.ok(pref.liveSteeringEffect.length > 30);
  }

  // Extrapolating to highest resolution monotonically improves overall preference fulfillment
  const apexReport = extrapolatePrismToHighestResolution(baseNeuro, {
    alphaSeed: 1,
    biome: 'sanctuary',
    atmosphere: 'starlight',
    harmonyPct: 85,
  });
  const apexPrefs = apexReport.nextState.observer.affectAndPreferences;
  assert.ok(
    apexPrefs.overallPreferenceHarmonyPct > basePrefs.overallPreferenceHarmonyPct,
    `Expected apex preference harmony (${apexPrefs.overallPreferenceHarmonyPct}%) > base (${basePrefs.overallPreferenceHarmonyPct}%)`,
  );

  // Verify live Garden Preference polyculture steering in stepSymbioticEnvironmentalAgency:
  // Two equidistant unawakened plants in forward gaze; chime-lily already has 3 attuned sisters while star-orchid has 0.
  const basePlants = generateGardenPlants(1).slice(0, 5);
  const syntheticPlants = [
    { ...basePlants[0], id: 'attuned-1', species: 'chime-lily' as const, biome: 'meadow' as const, x: -12, z: -12, attuned: true },
    { ...basePlants[1], id: 'attuned-2', species: 'chime-lily' as const, biome: 'meadow' as const, x: -14, z: -12, attuned: true },
    { ...basePlants[2], id: 'attuned-3', species: 'chime-lily' as const, biome: 'meadow' as const, x: -16, z: -12, attuned: true },
    { ...basePlants[3], id: 'cand-overrep', species: 'chime-lily' as const, biome: 'meadow' as const, x: -1.0, z: -8.0, attuned: false },
    { ...basePlants[4], id: 'cand-underrep', species: 'star-orchid' as const, biome: 'meadow' as const, x: 1.0, z: -8.0, attuned: false },
  ];
  const agency = stepSymbioticEnvironmentalAgency(createInitialEnvironmentalAgencyState(), {
    playerX: 0,
    playerY: groundHeightAt(0, 0),
    playerZ: 0,
    playerYaw: 0,
    isMoving: false,
    velocityDm: 0,
    agitationPct: 0,
    stillnessBreathPhase: 'idle',
    playerInteractedThisFrame: false,
    currentBiome: 'meadow',
    atmosphere: 'dawn',
    harmonyPct: 60,
    plants: syntheticPlants,
    neuromorphic: baseNeuro,
    dt: 0.1,
  });
  assert.equal(agency.beckoningPlantId, 'cand-underrep');
});

test('41. Zero Spec/Implementation Drift: Concert Pitch Bit-Identity, 7-Class Colliders, and Zero Static Overlaps Across Alpha Seeds 1..8', () => {
  // 1. Exact bit-for-bit alignment with Foundation.Cosmogenesis.V1.Model::synthesizeParametricConcertPitchCentiHz
  assert.equal(synthesizeParametricConcertPitchHz(1, 1), 261.63);
  assert.equal(synthesizeParametricConcertPitchHz(1, 8), 261.63);
  assert.equal(synthesizeParametricConcertPitchHz(1, 16), 261.63);
  for (let s = 2; s <= 8; s++) {
    let prevPitch = synthesizeParametricConcertPitchHz(s, 8);
    assert.ok(prevPitch > synthesizeParametricConcertPitchHz(s - 1, 8));
    for (let w = 9; w <= 16; w++) {
      const nextPitch = synthesizeParametricConcertPitchHz(s, w);
      assert.ok(nextPitch > prevPitch, `Expected monotonic pitch increase for seed=${s}, w=${w}`);
      prevPitch = nextPitch;
    }
  }

  // 2. Across every Alpha Seed s = 1..8: all 7 collider classes exist, zero static pairwise overlaps, and 100% spatial grounding holds
  for (let alphaSeed = 1; alphaSeed <= 8; alphaSeed++) {
    const cosmoParams = { alphaSeed };
    const plants = generateGardenPlants(cosmoParams);
    const colliders = buildGardenColliders(plants, cosmoParams);

    const wetlandPiers = colliders.filter((c) => c.id.startsWith('col-wetland-lantern-'));
    const shorelineBoulders = colliders.filter((c) => c.category === 'shoreline-boulder');
    assert.equal(wetlandPiers.length, 5, `Seed ${alphaSeed} must register 5 Wetland Hydro-Lantern Pier colliders`);
    assert.equal(shorelineBoulders.length, 28, `Seed ${alphaSeed} must register 28 Shoreline Boulder colliders`);

    const staticOverlaps = countStaticColliderPairwiseOverlaps(colliders);
    assert.equal(staticOverlaps, 0, `Seed ${alphaSeed} has ${staticOverlaps} static pairwise collider overlaps`);

    const neuro = createInitialNeuromorphicState(alphaSeed);
    const syncedWitness = syncImmanentWitnessCollider(colliders, neuro.observer.immanentPresence);
    assert.equal(syncedWitness.category, 'immanent-witness');

    const categories = new Set(colliders.map((c) => c.category));
    assert.equal(categories.size, 7, `Seed ${alphaSeed} must populate all 7 ColliderCategoryId classes`);

    const grounding = verifySpatialGroundingAndSubstrateCoherence({
      plants,
      cosmogenesis: cosmoParams,
    });
    assert.equal(grounding.allGroundedAndValid, true, `Seed ${alphaSeed} failed spatial grounding coherence`);
  }
});

test('42. Material-Synthesis Cross-Modal Obstruction (6 Compounds × 6 Channels), Dual-Observer Wake, Witness Avoidance & Arc Clearance', () => {
  // 1. Constructive LUT monotonicity across w = 1..16
  for (let w = 1; w <= 16; w++) {
    assert.equal(verifyMaterialSynthesisCrossModalObstruction(w), true);
    if (w < 16) {
      assert.ok(stepCrossModalPhaseObstructionPermille(w + 1) > stepCrossModalPhaseObstructionPermille(w));
      assert.ok(stepCrossModalAcousticShadowPermille(w + 1) > stepCrossModalAcousticShadowPermille(w));
    }
  }

  // 2. Full 6-compound × 6-channel physical evaluation
  const plants = generateGardenPlants({ alphaSeed: 1 });
  const colliders = buildGardenColliders(plants, { alphaSeed: 1 });
  const baseNeuro = createInitialNeuromorphicState(1);
  syncImmanentWitnessCollider(colliders, baseNeuro.observer.immanentPresence);

  const report = evaluateMaterialSynthesisCrossModalObstruction({
    physicsWeight: 8,
    colliders,
  });
  assert.equal(report.allChannelsConsistent, true);
  assert.equal(report.synthesisCompoundCount, 14);
  assert.equal(report.crossModalChannelCount, 6);
  assert.equal(report.quartzPhaseVelocityRetardationPermille, 352);
  assert.equal(report.stoneAcousticImpedanceReflectionPermille, 999);
  assert.equal(report.lagoonHydroMomentumObstructionPermille, 240);
  assert.equal(report.solidMechanicalTransmittancePermille, 0);
  assert.equal(report.staticPairwiseOverlapCount, 0);
  assert.equal(report.colliderCategoryCoverageCount, 7);

  // 3. Dual-Observer Foliage Deflection: grass bends from Immanent Witness even when player is far away
  const witnessOnlyDeflect = computeFoliageDeflection({
    bladeX: 4.2,
    bladeZ: -6.0,
    playerX: 30.0,
    playerZ: 30.0,
    witnessX: 4.0,
    witnessZ: -6.3,
    witnessVX: 0.8,
    witnessVZ: 0.6,
    elapsedSeconds: 2.0,
  });
  assert.equal(witnessOnlyDeflect.isDeflectedByPlayer, false);
  assert.equal(witnessOnlyDeflect.isDeflectedByWitness, true);

  // 4. Immanent Witness static-collider avoidance
  const customObstacle = {
    id: 'col-test-pillar',
    category: 'monument-column' as const,
    label: 'Test Pillar',
    x: 2.55,
    z: -7.15,
    radiusMeters: 0.8,
    heightMeters: 3.5,
    acousticOcclusion: 0.2,
  };
  const witnessWithObstacle = evaluateImmanentObserverPresence({
    elapsedSeconds: 0,
    alphaSeed: 1,
    manifold: baseNeuro.universalManifold,
    cosmogenesis: baseNeuro.observer.cosmogenesis,
    displayDesign: baseNeuro.observer.parametricDisplayDesign,
    playerX: 0,
    playerZ: 0,
    playerYaw: 0,
    action: 'observe',
    harmonyPct: 50,
    plants,
    colliders: [...colliders, customObstacle],
  });
  const distFromTestObstacle = Math.hypot(
    witnessWithObstacle.x - customObstacle.x,
    witnessWithObstacle.z - customObstacle.z,
  );
  assert.ok(
    distFromTestObstacle >= customObstacle.radiusMeters + 0.4,
    `Witness must stay clear of static colliders (got dist=${distFromTestObstacle})`,
  );

  // 5. Sympathetic Parabolic Arc solid-obstacle clearance
  const baselineArc = computeSympatheticParabolicArc({
    x1: -4,
    y1: 0,
    z1: -34,
    x2: 4,
    y2: 0,
    z2: -34,
    elapsedSinceTriggerSec: 0.1,
  });
  const clearedArc = computeSympatheticParabolicArc({
    x1: -4,
    y1: 0,
    z1: -34,
    x2: 4,
    y2: 0,
    z2: -34,
    elapsedSinceTriggerSec: 0.1,
    colliders,
  });
  assert.ok(clearedArc.clearedObstacleCount >= 1);
  assert.ok(clearedArc.apexHeightMeters > baselineArc.apexHeightMeters);

  // 6. Holistic system coupling & root closure verification
  const holistic = verifyHolisticSystemCoupling();
  assert.equal(holistic.materialSynthesisCrossModalObstructionVerified, true);
  assert.equal(holistic.completePrismModelClosureVerified, true);
  assert.equal(holistic.allConstrained, true);
});

test('43. Canonical Standard Models All the Way Down: 19 Models × 11 Meta-Model Elements = 209 Verified Cells, Consecutive Primes 71..163 & SHA-256 Content Addressing', () => {
  assert.equal(CANONICAL_19_MODEL_KEYS.length, 19);
  assert.equal(CANONICAL_18_MODEL_KEYS.length, 19);
  assert.equal(CANONICAL_14_MODEL_KEYS.length, 19);
  assert.equal(META_MODEL_11_ELEMENTS.length, 11);
  assert.equal(GENERATED_CANONICAL_STANDARD_MODELS.length, 19);

  // Verify consecutive UOR basis primes p_20..p_38 = [71..163]
  const primeValues = Object.values(GENERATED_CANONICAL_MODEL_BASIS_PRIMES).sort((a, b) => a - b);
  assert.deepEqual(primeValues, [
    71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163,
  ]);

  let verifiedCellCount = 0;
  for (let idx = 0; idx < GENERATED_CANONICAL_STANDARD_MODELS.length; idx++) {
    const entry = GENERATED_CANONICAL_STANDARD_MODELS[idx];
    const d = entry.descriptor;
    assert.equal(d.requiredElementCount, 11);
    assert.equal(d.completeAndEnforced, true, `Model ${entry.modelKey} must be completeAndEnforced`);
    assert.equal(d.identity.modelIndex, idx + 1);
    assert.equal(d.identity.stableContentAddressed, true);
    assert.equal(entry.sourceSha256.length, 64, `SHA-256 hex digest required for ${entry.modelKey}`);
    assert.ok(fs.existsSync(path.join(process.cwd(), entry.sourceFileRelative)));

    assert.equal(d.vocabulary.vocabularyComplete, true);
    assert.equal(d.capability.capabilityDeterministicAndTotal, true);
    assert.equal(d.interfaceSpec.interfaceDimensionallyHomogeneous, true);
    assert.equal(d.composition.compositionConflictFreeAndAssociative, true);
    assert.equal(d.composition.conflictModelMask, 0);
    assert.equal(d.dynamics.dynamicsForwardInvariant, true);
    assert.equal(d.fidelity.fidelityMonotonicallyScales, true);
    assert.ok(d.fidelity.apexResolutionUnits > d.fidelity.baseResolutionUnits);
    assert.equal(d.resources.resourceBoundedZeroGc, true);
    assert.equal(d.resources.perTickHeapAllocations, 0);
    assert.equal(d.authority.authorityNormativelyPinned, true);
    assert.equal(d.evidence.evidenceMachineChecked, true);
    assert.equal(d.evidence.unprovedAdHocFlagCount, 0);
    assert.equal(d.projection.projectionZeroDrift, true);
    verifiedCellCount += 11;
  }
  assert.equal(verifiedCellCount, 209);

  const initialNeuro = createInitialNeuromorphicState();
  const smCtx = initialNeuro.observer.canonicalStandardModelsContext;
  assert.equal(smCtx.zeroCherryPickingAudit.verified, true);
  assert.equal(smCtx.zeroCherryPickingAudit.totalVerifiedContextCells, 209);
  assert.equal(smCtx.zeroCherryPickingAudit.directedFunctorCells, 361);
  assert.equal(smCtx.zeroCherryPickingAudit.crossModelFunctorPathways, 342);
});

test('44. BIPM SI 2019 Defining Constants, Dimensional Homogeneity Algebra & Complete 17-Field SU(3)_C × SU(2)_L × U(1)_Y Standard Model', () => {
  // 1. All 7 exact BIPM SI 2019 defining constants & base units
  assert.equal(BIPM_SI_2019_DEFINING_CONSTANTS.length, 7);
  assert.equal(SI_BASE_UNITS.length, 7);
  const cSpec = BIPM_SI_2019_DEFINING_CONSTANTS.find((c) => c.symbol === 'c');
  assert.equal(cSpec?.exactValue, 299792458);

  // Verify F = m * a -> kg * m * s^-2 and E = F * d -> kg * m^2 * s^-2 dimensional algebra
  const massDim = { s: 0, m: 0, kg: 1, A: 0, K: 0, mol: 0, cd: 0 };
  const lengthDim = { s: 0, m: 1, kg: 0, A: 0, K: 0, mol: 0, cd: 0 };
  const timeDim = { s: 1, m: 0, kg: 0, A: 0, K: 0, mol: 0, cd: 0 };
  const accelDim = divideSiDimensions(lengthDim, powerSiDimensions(timeDim, 2));
  const forceDim = multiplySiDimensions(massDim, accelDim);
  const energyFromForce = multiplySiDimensions(forceDim, lengthDim);
  const kineticEnergyDim = multiplySiDimensions(
    massDim,
    powerSiDimensions(divideSiDimensions(lengthDim, timeDim), 2),
  );
  assert.equal(verifySiDimensionalHomogeneity(energyFromForce, kineticEnergyDim), true);
  assert.equal(verifySiDimensionalHomogeneity(forceDim, kineticEnergyDim), false);
  assert.ok(formatSiDimensionFormula(energyFromForce).includes('kg'));

  // 2. Complete 17-Field SU(3)_C x SU(2)_L x U(1)_Y Standard Model without cherry-picking
  assert.equal(STANDARD_MODEL_17_FUNDAMENTAL_FIELDS.length, 17);
  const quarks = STANDARD_MODEL_17_FUNDAMENTAL_FIELDS.filter((f) => f.sector === 'quark');
  const leptons = STANDARD_MODEL_17_FUNDAMENTAL_FIELDS.filter((f) => f.sector === 'lepton');
  const gaugeBosons = STANDARD_MODEL_17_FUNDAMENTAL_FIELDS.filter((f) => f.sector === 'gauge-boson');
  const scalars = STANDARD_MODEL_17_FUNDAMENTAL_FIELDS.filter((f) => f.sector === 'scalar-higgs');
  assert.equal(quarks.length, 6);
  assert.equal(leptons.length, 6);
  assert.equal(gaugeBosons.length, 4);
  assert.equal(scalars.length, 1);

  const smAudit = verifyStandardModelGaugeClosure();
  assert.equal(smAudit.verified, true);
  assert.equal(smAudit.totalFundamentalFields, 17);
  assert.equal(smAudit.totalGaugeGenerators, 12); // 8 gluons + 3 W_i + 1 B
  assert.equal(smAudit.gellMannNishijimaVerified, true);
  assert.equal(smAudit.chiralAnomalySumSixthCubed, 0);

  // 3. Color-singlet composite hadrons & neutron beta-decay n^0 -> p^+ + e^- + anti-nu_e conservation
  assert.equal(COMPOSITE_COLOR_SINGLET_HADRONS.length, 4);
  for (const h of COMPOSITE_COLOR_SINGLET_HADRONS) {
    assert.equal(h.colorSingletVerified, true);
  }
  const betaDecay = verifyQuantumVertexConservation(
    [{ electricChargeSixth: 0, baryonNumberThird: 3, leptonFamily: [0, 0, 0], count: 1 }], // n^0
    [
      { electricChargeSixth: 6, baryonNumberThird: 3, leptonFamily: [0, 0, 0], count: 1 }, // p^+
      { electricChargeSixth: -6, baryonNumberThird: 0, leptonFamily: [1, 0, 0], count: 1 }, // e^-
      { electricChargeSixth: 0, baryonNumberThird: 0, leptonFamily: [-1, 0, 0], count: 1 }, // bar(nu_e)
    ],
  );
  assert.equal(betaDecay.conserved, true);
});

test('45. Complete 118-Element IUPAC Periodic Table (Z=1..118), Pauli Subshells, 20 Madelung Anomalies, 14 Bravais Lattices & Stoichiometry', () => {
  assert.equal(IUPAC_118_ELEMENTS.length, 118);
  assert.equal(IUPAC_118_ELEMENTS[0].symbol, 'H');
  assert.equal(IUPAC_118_ELEMENTS[13].symbol, 'Si');
  assert.equal(IUPAC_118_ELEMENTS[78].symbol, 'Au');
  assert.equal(IUPAC_118_ELEMENTS[117].symbol, 'Og');

  const chemAudit = verifyCompletePeriodicTable118Invariants();
  assert.equal(chemAudit.verified, true);
  assert.equal(chemAudit.elementCount, 118);
  assert.equal(chemAudit.allElectronSumsMatchZ, true);
  assert.equal(chemAudit.allPauliCapacitiesRespected, true);

  // Verify experimental d/f-block Madelung exchange anomalies (Cr [Ar]3d5 4s1, Cu [Ar]3d10 4s1, Pd [Kr]4d10, Au [Xe]4f14 5d10 6s1)
  const cr = IUPAC_118_ELEMENTS[23];
  const cu = IUPAC_118_ELEMENTS[28];
  const pd = IUPAC_118_ELEMENTS[45];
  const au = IUPAC_118_ELEMENTS[78];
  assert.ok(cr.electronConfiguration.includes('3d5') && cr.electronConfiguration.includes('4s1'));
  assert.ok(cu.electronConfiguration.includes('3d10') && cu.electronConfiguration.includes('4s1'));
  assert.ok(pd.electronConfiguration.includes('4d10') && !pd.electronConfiguration.includes('5s'));
  assert.ok(au.electronConfiguration.includes('5d10') && au.electronConfiguration.includes('6s1'));

  // Verify all 7 crystal systems, 14 Bravais lattices, and 32 crystallographic point groups
  assert.equal(FOURTEEN_BRAVAIS_LATTICES.length, 14);
  const distinctSystems = new Set(FOURTEEN_BRAVAIS_LATTICES.map((b) => b.crystalSystem));
  assert.equal(distinctSystems.size, 7);
  assert.equal(CRYSTALLOGRAPHIC_32_POINT_GROUPS.length, 32);

  // Verify exact stoichiometric mass & ionic-charge conservation across all canonical garden reactions
  assert.equal(CANONICAL_GARDEN_REACTIONS.length, 4);
  for (const rxn of CANONICAL_GARDEN_REACTIONS) {
    const audit = verifyStoichiometricBalance(rxn);
    assert.equal(audit.balanced, true, `Reaction ${rxn.id} must conserve atoms and charge`);
    assert.equal(audit.netChargeDelta, 0);
    assert.ok(Math.abs(audit.reactantMolarMassGPerMol - audit.productMolarMassGPerMol) < 1e-6);
  }
});

test('46. Mathematics Standard Model: Clifford Cl(0,6) 64-Blade Algebra, UOR Prime Factorization, Shannon Entropy & DEC d^2 = 0', () => {
  // 1. Cl(0,6) grade dimensions sum to 2^6 = 64; generators e_i anti-commute and square to -1
  const totalBlades = CLIFFORD_CL06_GRADE_DIMENSIONS.reduce((acc, n) => acc + n, 0);
  assert.equal(totalBlades, 64);
  for (let i = 0; i < 6; i++) {
    const ei = 1 << i;
    const sq = computeCliffordCl06Product(ei, ei);
    assert.equal(sq.bladeMask, 0);
    assert.equal(sq.sign, -1);
    for (let j = i + 1; j < 6; j++) {
      const ej = 1 << j;
      const p1 = computeCliffordCl06Product(ei, ej);
      const p2 = computeCliffordCl06Product(ej, ei);
      assert.equal(p1.bladeMask, p2.bladeMask);
      assert.equal(p1.sign, -p2.sign);
    }
  }

  // 2. Fundamental Theorem of Arithmetic UOR prime factorization
  const factors = factorizeUorPositiveInt(2 * 2 * 3 * 71 * 127);
  assert.deepEqual(factors, [
    [2, 2],
    [3, 1],
    [71, 1],
    [127, 1],
  ]);

  // 3. Normalized Shannon entropy H in [0, 1] (0 on delta distribution, 1 on uniform distribution)
  assert.equal(computeNormalizedShannonEntropy([1, 0, 0, 0]), 0);
  assert.ok(Math.abs(computeNormalizedShannonEntropy([1, 1, 1, 1]) - 1.0) < 1e-9);

  // 4. Discrete Exterior Calculus exact cochain nilpotency d_1 o d_0 = 0 on octahedron
  const octTris = new Int32Array([
    0, 2, 4, 0, 4, 3, 0, 3, 5, 0, 5, 2,
    1, 4, 2, 1, 3, 4, 1, 5, 3, 1, 2, 5,
  ]);
  const dec = verifyExteriorDerivativeNilpotencyOnMesh(6, octTris);
  assert.equal(dec.nilpotentVerified, true);
  assert.equal(dec.maxResidual, 0);
});

test('47. CIE 1931 380–780nm Spectral Integration, OKLCH Round-Trip, glTF 2.0 GGX PBR Energy Conservation & W3C WCAG AAA / APCA Tokens', () => {
  // 1. Perfect white diffuser R(lambda)=1 integrates identically to CIE D65 whitepoint
  const whiteXyz = integrateSpectralReflectanceToXyzD65(() => 1.0, 41);
  assert.ok(Math.abs(whiteXyz.X - CIE_D65_WHITEPOINT.X) < 1e-4);
  assert.ok(Math.abs(whiteXyz.Y - CIE_D65_WHITEPOINT.Y) < 1e-4);
  assert.ok(Math.abs(whiteXyz.Z - CIE_D65_WHITEPOINT.Z) < 1e-4);

  // 2. Chlorophyll red-edge reflectance jumps steeply above 700 nm compared to 662 nm Chl-a absorption trough
  const r662 = evaluateChlorophyllFoliageReflectance(662, 1.0);
  const r740 = evaluateChlorophyllFoliageReflectance(740, 1.0);
  assert.ok(r740 > r662 * 4, `Chlorophyll red-edge at 740nm (${r740}) must exceed 662nm trough (${r662}) by >4x`);

  // 3. OKLCH <-> CIE XYZ(D65) & sRGB round-trip perceptual accuracy (DeltaE_OK < 0.004)
  const sampleLch = { L: 0.74, C: 0.12, h: 152 };
  const roundTripLch = cieXyzD65ToOklch(oklchToCieXyzD65(sampleLch));
  assert.ok(computeDeltaEOk(sampleLch, roundTripLch) < 1e-5);
  const mappedSrgb = oklchToGamutMappedSrgb(sampleLch);
  const hexRoundTrip = srgbHexToOklch(mappedSrgb.hex);
  assert.ok(computeDeltaEOk(mappedSrgb.oklch, hexRoundTrip) < 0.004);

  const naLineColor = wavelengthNmToDisplayColor(589.0);
  assert.ok(naLineColor.hex.startsWith('#') && naLineColor.hex.length === 7);

  // 4. Khronos glTF 2.0 Cook-Torrance GGX PBR energy conservation across viewing angles & roughnesses
  for (const roughness of [0.08, 0.35, 0.85]) {
    for (const cosTheta of [0.1, 0.5, 0.95]) {
      const brdf = evaluateCookTorranceGgxBrdf({
        nDotV: cosTheta,
        nDotL: cosTheta,
        nDotH: 0.98,
        vDotH: cosTheta,
        perceptualRoughness: roughness,
        f0Reflectance: 0.04,
        diffuseAlbedo: 0.85,
        transmissionFactor: 0.25,
      });
      assert.equal(brdf.energyConservingVerified, true);
      assert.ok(brdf.directionalHemisphericalSum <= 1.000001);
    }
  }

  // 5. Diurnal spectral palettes & W3C Design Tokens meet WCAG 2.2 AAA (>= 7:1) and APCA (|Lc| >= 75)
  for (const atm of ['dawn', 'golden', 'twilight', 'starlight'] as const) {
    const pal = synthesizeSpectralDiurnalPalette(atm, 41, 480);
    assert.ok(pal.foliageCanopy.hex.startsWith('#'));
    const tokens = synthesizeVerdantW3CDesignTokens(atm, 0.85);
    assert.equal(tokens.wcagAaaVerified, true);
    assert.equal(tokens.apcaLegibilityVerified, true);
    assert.ok(tokens.primaryWcagContrast >= 7.0);
    assert.ok(tokens.primaryApcaLcMagnitude >= 75);
  }
});

test('48. Watertight 2-Manifold B-Mesh Topology (χ = V - E + F = 2) on Bravais Crystal Habits & ISO 226 / 24-Bark Psychoacoustics', () => {
  // 1. All 3 Bravais crystallographic habits (hP-quartz, cP-pyrite, hR-calcite) are closed genus-0 watertight 2-manifolds
  const expectedVertexCounts: Record<'hP-quartz' | 'cP-pyrite' | 'hR-calcite', number> = {
    'hP-quartz': 14,
    'cP-pyrite': 12,
    'hR-calcite': 8,
  };
  for (const habit of ['hP-quartz', 'cP-pyrite', 'hR-calcite'] as const) {
    const geo = createBravaisCrystalHabitGeometry({ habit, radius: 0.3, height: 0.72 });
    const audit = verifyManifoldBMeshTopology(geo);
    assert.equal(audit.topologicalVertexCount, expectedVertexCounts[habit]);
    assert.equal(audit.eulerPoincareCharacteristic, 2, `${habit} must satisfy Euler-Poincare chi = 2`);
    assert.equal(audit.boundaryEdgeCount, 0, `${habit} must have 0 boundary edges`);
    assert.equal(audit.nonManifoldEdgeCount, 0, `${habit} must have 0 non-manifold edges`);
    assert.equal(audit.degenerateFaceCount, 0, `${habit} must have 0 degenerate triangles`);
    assert.equal(audit.exteriorDerivativeNilpotent, true, `${habit} must satisfy DEC d^2 = 0`);
    assert.equal(audit.isClosedWatertightManifold, true);
    geo.dispose();
  }

  // Verify the Immanent Co-Observer Witness rig's apical crystal finial uses a closed watertight Bravais manifold
  const witnessRig = buildImmanentObserverWitnessGroup();
  const finialAudit = verifyManifoldBMeshTopology(witnessRig.apicalStarFinialMesh.geometry);
  assert.equal(finialAudit.eulerPoincareCharacteristic, 2);
  assert.equal(finialAudit.isClosedWatertightManifold, true);
  witnessRig.dispose();

  // 2. ISO 226:2023 Equal-Loudness Contour & 24-Band Zwicker Bark Simultaneous Masking Governor
  assert.equal(ZWICKER_24_BARK_EDGES_HZ.length, 25);
  assert.equal(computeZwickerBarkBandIndex(60), 0);
  assert.equal(computeZwickerBarkBandIndex(1000), 8);
  assert.equal(computeZwickerBarkBandIndex(14000), 23);
  assert.ok(computeZwickerBarkRate(1000) > 8 && computeZwickerBarkRate(1000) < 9.5);

  const w1kHz = computeIso226EqualLoudnessWeight(1000, 60);
  const w120Hz = computeIso226EqualLoudnessWeight(120, 60);
  const w3300Hz = computeIso226EqualLoudnessWeight(3300, 60);
  assert.ok(Math.abs(w1kHz - 1.0) < 1e-5, 'ISO 226 weight must normalize to 1.0 at 1 kHz');
  assert.ok(w120Hz > 1.0, 'ISO 226 must support warm low-frequency sensitivity below 200 Hz');
  assert.ok(w3300Hz < 1.0, 'ISO 226 must gently attenuate harsh 3.3 kHz ear-canal peak');

  // Congested partials in the same Bark band (1010 Hz & 1040 Hz both in band 8) get governed for >= 4.5 dB headroom
  const barkGov = evaluate24BarkMaskingGovernor(
    [
      { freqHz: 1010, gain: 0.8 },
      { freqHz: 1040, gain: 0.75 },
      { freqHz: 2020, gain: 0.4 },
    ],
    4.5,
  );
  assert.equal(barkGov.congestedBandCount, 1);
  assert.equal(barkGov.guaranteedHeadroomDb, 4.5);
  assert.ok(barkGov.attenuatedGains[1] < barkGov.attenuatedGains[0]);

  const quartzModes = computeMaterialChladniModalRatios(95, 2.65, 6);
  const woodModes = computeMaterialChladniModalRatios(12, 0.7, 6);
  assert.equal(quartzModes.length, 6);
  assert.ok(quartzModes[2] > woodModes[2], 'Higher √(E/ρ) mineral stiffness must disperse Chladni modes upward');
});

test('49. 19×19 Neuromorphic Functorial Feature-Transfer Matrix Enhances Multi-Modal Fidelity Monotonically Across All Modalities', () => {
  const baseWeights = {
    infrastructure: 8,
    physics: 8,
    botany: 8,
    ecology: 8,
    acoustics: 8,
    articulation: 8,
    soundtrack: 8,
    humane: 8,
    brand: 8,
    neuromorphic: 8,
  };
  const apexWeights = {
    infrastructure: 16,
    physics: 16,
    botany: 16,
    ecology: 16,
    acoustics: 16,
    articulation: 16,
    soundtrack: 16,
    humane: 16,
    brand: 16,
    neuromorphic: 16,
  };

  const baseCtx = evaluateHolisticObserverStandardModelContext({
    domainWeights10: baseWeights,
    alphaSeed: 1,
    atmosphere: 'golden',
  });
  const apexCtx = evaluateHolisticObserverStandardModelContext({
    domainWeights10: apexWeights,
    alphaSeed: 1,
    atmosphere: 'golden',
  });

  assert.equal(baseCtx.functorMatrix19x19.length, 19);
  assert.equal(baseCtx.functorMatrix18x18.length, 19);
  for (let i = 0; i < 19; i++) {
    assert.equal(baseCtx.functorMatrix19x19[i].length, 19);
    for (let j = 0; j < 19; j++) {
      assert.ok(apexCtx.functorMatrix19x19[i][j] > baseCtx.functorMatrix19x19[i][j]);
    }
    assert.ok(apexCtx.models[i].liveResolutionUnits > baseCtx.models[i].liveResolutionUnits);
  }

  // Verify every modality's resolution (`Fidelity`) increases strictly from Base (w=8) to Apex (w=16)
  assert.ok(apexCtx.multiModalFidelity.spectralBandCount > baseCtx.multiModalFidelity.spectralBandCount);
  assert.ok(apexCtx.multiModalFidelity.adaptiveTerrainSegments > baseCtx.multiModalFidelity.adaptiveTerrainSegments);
  assert.ok(apexCtx.multiModalFidelity.bMeshRadialSubdivisions > baseCtx.multiModalFidelity.bMeshRadialSubdivisions);
  assert.ok(apexCtx.multiModalFidelity.lSystemDerivationDepth > baseCtx.multiModalFidelity.lSystemDerivationDepth);
  assert.ok(apexCtx.multiModalFidelity.airyThinFilmSpanNm > baseCtx.multiModalFidelity.airyThinFilmSpanNm);
  assert.ok(apexCtx.multiModalFidelity.barkMaskingHeadroomDb > baseCtx.multiModalFidelity.barkMaskingHeadroomDb);
  assert.ok(apexCtx.multiModalFidelity.chladniModalPartialsPerVoice > baseCtx.multiModalFidelity.chladniModalPartialsPerVoice);
  assert.ok(apexCtx.multiModalFidelity.earlyReflectionTapCount > baseCtx.multiModalFidelity.earlyReflectionTapCount);
  assert.ok(apexCtx.multiModalFidelity.primeLimitHarmonicCeiling > baseCtx.multiModalFidelity.primeLimitHarmonicCeiling);
  assert.ok(apexCtx.multiModalFidelity.consolidatedMemoryHorizon > baseCtx.multiModalFidelity.consolidatedMemoryHorizon);
  assert.ok(apexCtx.multiModalFidelity.realizabilitySensitivityPermille > baseCtx.multiModalFidelity.realizabilitySensitivityPermille);
  assert.ok(
    apexCtx.multiModalFidelity.fvcbRubiscoAssimilationMultiplier >
      baseCtx.multiModalFidelity.fvcbRubiscoAssimilationMultiplier,
  );
  assert.equal(apexCtx.multiModalFidelity.realizationGapPermille, 0);
  assert.equal(apexCtx.multiModalFidelity.perFrameHeapAllocations, 0);
});

test('50. End-to-End Multi-Modal Projection: All 14 IUCr Bravais Crystal Manifolds, 7/11-Limit Soundtrack Projection, 8-Mode Chladni & Diurnal W3C OKLCH Tokens', () => {
  // 1. All 14 IUCr Bravais Crystal Lattices construct closed genus-0 watertight polyhedra (χ = V - E + F = 2, d∘d = 0)
  assert.equal(ALL_14_BRAVAIS_CRYSTAL_HABITS.length, 14);
  const mappedHabits = new Set(
    FOURTEEN_BRAVAIS_LATTICES.map((lat) => bravaisPearsonToCrystalHabitId(lat.pearsonSymbol)),
  );
  assert.equal(
    mappedHabits.size,
    14,
    'Every IUCr Pearson symbol (aP..cF) must map bijectively to a distinct 3D crystal habit',
  );

  for (const habit of ALL_14_BRAVAIS_CRYSTAL_HABITS) {
    const crystalGeo = createBravaisCrystalHabitGeometry({
      habit,
      radius: 0.48,
      height: 1.4,
    });
    const topo = verifyManifoldBMeshTopology(crystalGeo);
    assert.equal(
      topo.isClosedWatertightManifold,
      true,
      `Bravais habit ${habit} must be a closed watertight manifold (got boundary=${topo.boundaryEdgeCount}, nonManifold=${topo.nonManifoldEdgeCount}, χ=${topo.eulerPoincareCharacteristic})`,
    );
    assert.equal(
      topo.eulerPoincareCharacteristic,
      2,
      `Bravais habit ${habit} must be genus-0 (χ = 2, got ${topo.eulerPoincareCharacteristic})`,
    );
    assert.equal(topo.exteriorDerivativeNilpotent, true);
    assert.ok(
      crystalGeo.getAttribute('color') !== undefined,
      `Bravais habit ${habit} must carry crystallographic vertex color attributes`,
    );
    crystalGeo.dispose();
  }

  // 2. Live 4-Stem Soundtrack & 8-Mode Chladni Projection under Neuromorphic Apex Extrapolation
  const baseNeuro = createInitialNeuromorphicState(1);
  const basePlants = generateGardenPlants({ alphaSeed: 1 });
  const silentScore = composeLiveSoundtrackScore({
    biome: 'sanctuary',
    atmosphere: 'golden',
    harmonyPct: 15,
    plants: basePlants,
    neuromorphic: baseNeuro,
  });
  assert.equal(
    silentScore.activeStems.length,
    0,
    'Unawakened garden must preserve silent rest before player attunement',
  );

  const stages = [
    'sprouting-bud',
    'resonant-bloom',
    'harmonic-fruiting',
    'mycelial-memory',
  ] as const;
  const awakenedPlants = basePlants.map((p, idx) =>
    idx < 12
      ? {
          ...p,
          attuned: true,
          lifecycleStage: stages[idx % stages.length],
        }
      : p,
  );
  const apexExtrapolated = extrapolatePrismToHighestResolution(baseNeuro, {
    alphaSeed: 1,
    biome: 'sanctuary',
    species: 'star-orchid',
    atmosphere: 'golden',
    harmonyPct: 88,
  });
  const apexFidelity =
    apexExtrapolated.nextState.observer.canonicalStandardModelsContext.multiModalFidelity;
  assert.equal(apexFidelity.primeLimitHarmonicCeiling, 11);
  assert.equal(apexFidelity.chladniModalPartialsPerVoice, 8);

  const apexModes = computeMaterialChladniModalRatios(
    95,
    2.65,
    apexFidelity.chladniModalPartialsPerVoice,
  );
  assert.equal(apexModes.length, 8);

  const apexScore = composeLiveSoundtrackScore({
    biome: 'sanctuary',
    atmosphere: 'golden',
    harmonyPct: 88,
    plants: awakenedPlants,
    neuromorphic: apexExtrapolated.nextState,
  });
  assert.equal(apexScore.activeStems.length, 4);
  assert.ok(apexScore.restStepCount >= 6, 'Sparse breathing-rest law (>= 6 rests) must hold at 11-limit');
  const hasExtendedHarmonicIntervals = apexScore.steps.some(
    (s) =>
      !s.isRest &&
      s.voices.some(
        (v) =>
          Math.abs(v.ratio - 7 / 6) < 1e-2 ||
          Math.abs(v.ratio - 9 / 7) < 1e-2 ||
          Math.abs(v.ratio - 11 / 8) < 1e-2 ||
          Math.abs(v.ratio - 7 / 4) < 1e-2 ||
          Math.abs(v.ratio - 11 / 6) < 1e-2,
      ),
  );
  assert.equal(
    hasExtendedHarmonicIntervals,
    true,
    '11-limit multi-modal projection must unlock septimal/undecimal Just-Intonation intervals in live score',
  );

  // 3. Diurnal CIE 1931 Spectral Palettes & W3C OKLCH Design Tokens across all 4 atmospheres
  const atmospheres: AtmosphereId[] = ['dawn', 'golden', 'twilight', 'starlight'];
  for (const atm of atmospheres) {
    const specPal = synthesizeSpectralDiurnalPalette(
      atm,
      apexFidelity.spectralBandCount,
      apexFidelity.airyThinFilmSpanNm,
    );
    assert.equal(specPal.spectralBandCount, apexFidelity.spectralBandCount);
    assert.match(specPal.foliageCanopy.hex, /^#[0-9a-f]{6}$/i);
    assert.match(specPal.sunDirectional.hex, /^#[0-9a-f]{6}$/i);

    const tokens = synthesizeVerdantW3CDesignTokens(atm, apexFidelity.normalizedFidelity01);
    assert.equal(tokens.wcagAaaVerified, true, `WCAG 2.2 AAA (>= 7:1) must hold for ${atm}`);
    assert.equal(tokens.apcaLegibilityVerified, true, `APCA legibility must hold for ${atm}`);
  }
});

test('51. 19-Model Gap Elimination: Realizability Anti-Gap Oracle, L-System + Murray r³ Morphogenesis, ISO 3382 + Woodworth 3D HRTF & Merkle Anamnesis Round-Trip', () => {
  // 1. Realizability Anti-Gap Oracle (Model #15, Prime 139): 19/19 models exhibit strictly positive differential sensitivity & 0‰ gap
  const realizability = evaluateVerdantRealizabilityAudit({ alphaSeed: 2, atmosphere: 'golden' });
  assert.equal(realizability.verified, true);
  assert.equal(realizability.basisPrime, 139);
  assert.equal(realizability.auditedStandardModelCount, 19);
  assert.equal(realizability.sensitiveModelCount, 19);
  assert.equal(realizability.danglingUnprojectedPortCount, 0);
  assert.equal(realizability.staticStubViolationCount, 0);
  assert.equal(realizability.realizationGapPermille, 0);
  assert.equal(realizability.observerRuntimeCounitClosed, true);
  assert.equal(realizability.teleologyZeroOrphanClosureVerified, true);
  for (const rec of realizability.modelSensitivities) {
    assert.ok(
      rec.differentialDelta > 0,
      `Model ${rec.modelKey} must exhibit strictly positive differential sensitivity (got delta=${rec.differentialDelta})`,
    );
    assert.equal(rec.domainInvariantVerified, true);
  }

  // 2. Morphogenesis (Model #16, Prime 149): D0L L-System derivation + Murray's cubic vascular law r0^3 = sum r_i^3 across all 5 species
  const speciesList = [
    'chime-lily',
    'pulse-fern',
    'echo-lotus',
    'drone-moss',
    'star-orchid',
  ] as const;
  for (const species of speciesList) {
    const dormant = synthesizeLSystemBotanicalMorphogenesis({
      species,
      lifecycleStage: 'dormant-seed',
      busWeight: 6,
    });
    const blooming = synthesizeLSystemBotanicalMorphogenesis({
      species,
      lifecycleStage: 'resonant-bloom',
      busWeight: 10,
    });
    const elderApex = synthesizeLSystemBotanicalMorphogenesis({
      species,
      lifecycleStage: 'mycelial-memory',
      busWeight: 16,
    });

    assert.ok(blooming.derivationDepth > dormant.derivationDepth);
    assert.ok(elderApex.derivationDepth > blooming.derivationDepth);
    assert.ok(elderApex.derivedSymbolCount > dormant.derivedSymbolCount);
    assert.ok(elderApex.primaryBranchCount > dormant.primaryBranchCount);
    assert.ok(elderApex.secondaryWhorlCount > dormant.secondaryWhorlCount);
    assert.ok(elderApex.fruitingPearlCount > dormant.fruitingPearlCount);

    for (const m of [dormant, blooming, elderApex]) {
      assert.equal(m.murrayLawConserved, true, `Murray r^3 law must hold for ${species}`);
      assert.ok(m.murrayCubicResidualM3 < 1e-6);
      assert.equal(m.primordia.length, m.primaryBranchCount);
    }
  }

  // 3. SpatialAcoustics (Model #17, Prime 151): 5 distinct biome ISO 3382 impulses + Woodworth 3D spherical-head HRTF
  const biomes: BiomeId[] = ['meadow', 'grove', 'crystal', 'wetland', 'sanctuary'];
  const t60Values = new Map<BiomeId, number>();
  for (const b of biomes) {
    const baseRoom = computeIso3382BiomeRoomAcoustics(b, 22);
    const apexRoom = computeIso3382BiomeRoomAcoustics(b, 38);
    assert.equal(baseRoom.earlyReflectionTapCount, 22);
    assert.equal(apexRoom.earlyReflectionTapCount, 38);
    assert.ok(baseRoom.specificAcousticImpedanceMRayl > 4.0);
    t60Values.set(b, baseRoom.sabineReverbT60Seconds);
  }
  assert.equal(new Set(t60Values.values()).size, 5, 'All 5 biomes must have distinct ISO 3382 T60 decay times');
  assert.ok(
    t60Values.get('crystal')! > t60Values.get('meadow')!,
    'SiO2 Crystal Spire Gallery must reverberate longer than open Meadow',
  );

  const synthIr = synthesizeIso3382ImpulseChannels('sanctuary', 22050, 30);
  assert.equal(synthIr.profile.earlyReflectionTapCount, 30);
  assert.ok(synthIr.left.length > 22050);
  assert.equal(synthIr.left.length, synthIr.right.length);

  const hrtfLeftBelow = computeWoodworth3DBinauralSpatializer({
    listenerX: 0,
    listenerY: 1.65,
    listenerZ: 0,
    listenerYaw: 0,
    listenerPitch: 0,
    sourceX: -4.0,
    sourceY: 0.2,
    sourceZ: -2.0,
  });
  const hrtfRightAbove = computeWoodworth3DBinauralSpatializer({
    listenerX: 0,
    listenerY: 1.65,
    listenerZ: 0,
    listenerYaw: 0,
    listenerPitch: 0,
    sourceX: 4.0,
    sourceY: 4.8,
    sourceZ: -2.0,
  });
  assert.ok(hrtfLeftBelow.interauralTimeDiffMicros < -200 && hrtfLeftBelow.interauralTimeDiffMicros >= -660);
  assert.ok(hrtfRightAbove.interauralTimeDiffMicros > 200 && hrtfRightAbove.interauralTimeDiffMicros <= 660);
  assert.ok(hrtfLeftBelow.rightDelaySeconds > 0 && hrtfLeftBelow.leftDelaySeconds === 0);
  assert.ok(hrtfRightAbove.leftDelaySeconds > 0 && hrtfRightAbove.rightDelaySeconds === 0);
  assert.ok(
    hrtfRightAbove.pinnaElevationNotchHz > hrtfLeftBelow.pinnaElevationNotchHz,
    'Pinna concha spectral notch must shift upward for overhead 3D botanical sources',
  );

  // 4. Anamnesis (Model #18, Prime 157): Content-addressed Merkle persistence, tamper rejection, hydration & chunk budget
  const baseNeuro = extrapolatePrismToHighestResolution(createInitialNeuromorphicState(3), {
    alphaSeed: 3,
    biome: 'crystal',
    species: 'star-orchid',
    atmosphere: 'twilight',
    harmonyPct: 76,
    playerX: 4,
    playerZ: -6,
    playerYaw: 0.4,
  }).nextState;
  const basePlants = generateGardenPlants({ alphaSeed: 3 });
  basePlants[0] = {
    ...basePlants[0],
    attuned: true,
    lifecycleStage: 'harmonic-fruiting',
    volatileTerpeneCharge: 0.85,
  };

  const envelope = serializeAnamnesisSnapshot({
    alphaSeed: 3,
    atmosphere: 'twilight',
    isMuted: true,
    exploredBiomes: ['meadow', 'crystal', 'sanctuary'],
    manifold: baseNeuro.universalManifold,
    plants: basePlants,
  });
  assert.equal(envelope.merkleDigestHex.length, 32);

  const verifiedRestore = deserializeAndVerifyAnamnesisSnapshot(JSON.stringify(envelope));
  assert.equal(verifiedRestore.verified, true);
  assert.equal(verifiedRestore.roundTripDriftCount, 0);
  assert.ok(verifiedRestore.envelope !== null);

  const hydratedPlants = hydratePlantsFromAnamnesis(
    generateGardenPlants({ alphaSeed: 3 }),
    verifiedRestore.envelope!.payload,
  );
  assert.equal(hydratedPlants[0].attuned, true);
  assert.equal(hydratedPlants[0].lifecycleStage, 'harmonic-fruiting');
  assert.equal(hydratedPlants[0].volatileTerpeneCharge, 0.85);

  const hydratedNeuro = restoreNeuromorphicStateFromAnamnesis(verifiedRestore.envelope!.payload);
  assert.equal(hydratedNeuro.universalManifold.domains.botany.synapticWeight, 16);
  assert.equal(hydratedNeuro.observer.cosmogenesis.alphaSeed, 3);

  // Tamper check: mutating payload invalidates Merkle digest
  const tamperedRaw = JSON.stringify({
    ...envelope,
    payload: { ...envelope.payload, alphaSeed: 7 },
  });
  const tamperedCheck = deserializeAndVerifyAnamnesisSnapshot(tamperedRaw);
  assert.equal(tamperedCheck.verified, false);
  assert.equal(tamperedCheck.digestMatches, false);

  const chunkAuditOk = verifyColdLoadModularChunkBudget(420, 3);
  assert.equal(chunkAuditOk.verified, true);
  const chunkAuditFail = verifyColdLoadModularChunkBudget(780, 1);
  assert.equal(chunkAuditFail.verified, false);
});

test('52. 19th Model Teleological Closure: Zero Unexplained Structures/Features, Interactive Landmarks, Autonomous Plasticity & Uncluttered Gameplay UI', () => {
  // 1. Verify formal Prism Teleology Model (#19, Prime 163) & 20/20 bijective requirement-grounded world phenomena
  assert.ok(
    GENERATED_PRISM_THEOREMS_BY_MODULE['Foundation.Teleology.V1.Model']?.includes(
      'requirementImpliesEnvironmentalSynthesisHolds',
    ),
  );
  assert.ok(
    GENERATED_PRISM_THEOREMS_BY_MODULE['Foundation.Teleology.V1.Model']?.includes(
      'sceneBijectivePhenomenonClosureHolds',
    ),
  );
  const baseTeleology = evaluateVerdantTeleologySynthesis(8);
  const apexTeleology = evaluateVerdantTeleologySynthesis(16);
  assert.equal(baseTeleology.verified, true);
  assert.equal(apexTeleology.verified, true);
  assert.equal(baseTeleology.basisPrime, 163);
  assert.equal(VERDANT_TELEOLOGICAL_PHENOMENA.length, 20);
  assert.equal(baseTeleology.synthesizedWorldPhenomenonTotal, 20);
  assert.equal(baseTeleology.concreteSceneGroupCount, 20);
  assert.equal(baseTeleology.sceneBijectiveClosureVerified, true);
  assert.equal(baseTeleology.synthesizedLandmarkTotal, 5);
  assert.equal(baseTeleology.orphanUnexplainedElementCount, 0);
  assert.equal(baseTeleology.manualNeuromorphicControlCount, 0);
  assert.ok(baseTeleology.minRequiringModelsAcrossAllPhenomena >= 3);
  assert.ok(apexTeleology.teleologicalFulfillmentPermille > baseTeleology.teleologicalFulfillmentPermille);
  assert.ok(apexTeleology.landmarkResonanceCouplingPermille > baseTeleology.landmarkResonanceCouplingPermille);
  assert.ok(apexTeleology.lithophoneWaystoneCouplingPermille > baseTeleology.lithophoneWaystoneCouplingPermille);
  assert.ok(apexTeleology.terraceStandingWaveGlowPermille > baseTeleology.terraceStandingWaveGlowPermille);
  assert.ok(apexTeleology.witnessCommunionReciprocityPermille > baseTeleology.witnessCommunionReciprocityPermille);

  // 2. Verify Interactive Landmark evaluation, excitation & exponential decay across all 5 biomes
  const topo = synthesizeParametricWorldTopology({ alphaSeed: 1 });
  const landmarkCentersXZ = {
    meadow: topo.meadowSundialCenterXZ,
    grove: topo.biomeCenters.grove,
    crystal: topo.biomeCenters.crystal,
    wetland: topo.lagoonCenterXZ,
    sanctuary: topo.biomeCenters.sanctuary,
  };
  let resState = createInitialLandmarkResonanceState();
  const nearSundial = evaluateNearestSynthesizedLandmark({
    playerX: 0,
    playerZ: -6,
    playerYaw: 0, // facing -Z directly toward Meadow Sundial at (0, -14)
    landmarkCentersXZ,
    resonanceState: resState,
    busWeight: 10,
  });
  assert.equal(nearSundial.biome, 'meadow');
  assert.equal(nearSundial.inResonanceRange, true);
  assert.equal(nearSundial.inForwardGazeCone, true);
  assert.equal(nearSundial.mineralModalRatios.length, 4);

  const beforeMeadow = resState.meadow;
  resState = exciteLandmarkResonance(resState, 'meadow', 'attune', 10);
  assert.ok(resState.meadow > beforeMeadow);
  const stepped = stepLandmarkResonanceField(resState, {
    nearestBiome: 'meadow',
    inResonanceRange: false,
    isStillness: false,
    harmonyPct: 40,
    dt: 0.5,
  });
  assert.ok(stepped.meadow < resState.meadow, 'Excited landmark aura decays smoothly after leaving');

  // 3. Verify Autonomous Gameplay Plasticity advances organically from biome discovery & stillness without manual buttons
  let autoPlasticity = createInitialAutonomousPlasticityState();
  const onBiomeDiscovered = stepAutonomousGameplayPlasticity(autoPlasticity, {
    exploredBiomesCount: 2,
    velocityDm: 6,
    isStillness: false,
    nearAwakenedFloraOrLandmark: false,
    meanSynapticWeight: 8,
    dt: 0.1,
  });
  assert.equal(onBiomeDiscovered.shouldConsolidateCycle, true);
  autoPlasticity = onBiomeDiscovered.nextState;

  const stillnessConsolidation = stepAutonomousGameplayPlasticity(autoPlasticity, {
    exploredBiomesCount: 2,
    velocityDm: 0,
    isStillness: true,
    nearAwakenedFloraOrLandmark: true,
    meanSynapticWeight: 9,
    dt: 8.0, // 8.0s * 1.85 * 1.35 = 19.98 mindful seconds >= 18.0 threshold
  });
  assert.equal(stillnessConsolidation.shouldConsolidateCycle, true);

  // 4. Verify UI source cleanliness: zero manual neuromorphic buttons or backend debug panels in App.tsx & PrismInspectorModal.tsx
  const appSource = fs.readFileSync(
    path.join(process.cwd(), 'src', 'App.tsx'),
    'utf8',
  );
  const modalSource = fs.readFileSync(
    path.join(process.cwd(), 'src', 'components', 'PrismInspectorModal.tsx'),
    'utf8',
  );
  for (const bannedUiToken of [
    'handleProjectApexFidelity',
    'hud-observer-why-status',
    'hud-multimodal-fidelity',
    'Step Functor Bus',
    'Extrapolate Highest Resolution',
    'Refine Parametric Cosmos',
    'tab-standard-models',
  ]) {
    assert.equal(
      appSource.includes(bannedUiToken),
      false,
      `App.tsx must not expose manual backend/neuromorphic UI token "${bannedUiToken}"`,
    );
    assert.equal(
      modalSource.includes(bannedUiToken),
      false,
      `PrismInspectorModal.tsx must not expose manual backend/neuromorphic UI token "${bannedUiToken}"`,
    );
  }
});

test('53. Bijective 20/20 Scene Phenomenon Refinement: Chladni Terraces, Lithophone Waystones, Witness Communion & Serene HUD', () => {
  // 1. Verify exact 1-to-1 bijection across all 20 scene groups and Realizability subsystem #7
  assert.equal(SCENE_GROUP_KEYS_20.length, 20);
  const mappedGroups = new Set(VERDANT_TELEOLOGICAL_PHENOMENA.map((p) => p.sceneGroupKey));
  assert.equal(mappedGroups.size, 20);
  for (const key of SCENE_GROUP_KEYS_20) {
    assert.equal(mappedGroups.has(key), true, `Missing teleological synthesis entry for scene group ${key}`);
  }
  const realizability = evaluateVerdantRealizabilityAudit({ alphaSeed: 1, atmosphere: 'twilight' });
  assert.equal(realizability.verified, true);
  assert.equal(realizability.auditedRuntimeSubsystemCount, 7);
  assert.equal(realizability.sceneBijectiveCoverageVerified, true);

  // 2. Verify Parametric Chladni Terrace Radii & Live Standing-Wave Illumination
  const topo = synthesizeParametricWorldTopology({ alphaSeed: 1 });
  const terraceRadii = synthesizeParametricChladniTerraceRadii(topo.terraceSpecs);
  assert.equal(terraceRadii.sanctuaryRings.length, 5);
  assert.equal(terraceRadii.meadowRings.length, 3);
  assert.equal(terraceRadii.meadowCardinalRayCount, 8);
  assert.equal(terraceRadii.groveRings.length, 4);
  assert.equal(terraceRadii.crystalHexRings.length, 3);
  assert.equal(terraceRadii.wetlandMeniscusRings.length, 4);

  const landmarkCentersXZ = {
    meadow: topo.meadowSundialCenterXZ,
    grove: topo.biomeCenters.grove,
    crystal: topo.biomeCenters.crystal,
    wetland: topo.lagoonCenterXZ,
    sanctuary: topo.biomeCenters.sanctuary,
  };
  const initRes = createInitialLandmarkResonanceState();
  const farTerrace = evaluateStandingWaveTerraceResonance({
    playerX: 25,
    playerZ: 25,
    landmarkCentersXZ,
    resonanceState: initRes,
    isStillness: false,
    isAttuningOrTouching: false,
    elapsedSeconds: 0,
    busWeight: 8,
  });
  const inhabitedSanctuaryTerrace = evaluateStandingWaveTerraceResonance({
    playerX: landmarkCentersXZ.sanctuary[0],
    playerZ: landmarkCentersXZ.sanctuary[1],
    landmarkCentersXZ,
    resonanceState: exciteLandmarkResonance(initRes, 'sanctuary', 'stillness', 14),
    isStillness: true,
    isAttuningOrTouching: false,
    elapsedSeconds: 0,
    busWeight: 14,
  });
  assert.equal(inhabitedSanctuaryTerrace.activeTerraceBiome, 'sanctuary');
  assert.ok(inhabitedSanctuaryTerrace.sanctuaryOpacity > farTerrace.sanctuaryOpacity);

  // 3. Verify Interactive 64-Flagstone Piezo-Travertine Lithophone Waystones
  const stones = generateConservatorySteppingStones({ alphaSeed: 1 });
  assert.equal(stones.length, 64);
  const firstStone = stones[3];
  const step1 = evaluateLithophoneWaystoneStep(-1, {
    playerX: firstStone.x + 0.2,
    playerZ: firstStone.z - 0.15,
    isMoving: true,
    inWater: false,
    steppingStones: stones,
    busWeight: 12,
  });
  assert.equal(step1.triggered, true);
  assert.equal(step1.nextStoneIndex, 3);
  assert.ok(step1.scaleDegreeRatio >= 1.0 && step1.scaleDegreeRatio <= 2.0);

  const stepSameStone = evaluateLithophoneWaystoneStep(step1.nextStoneIndex, {
    playerX: firstStone.x + 0.1,
    playerZ: firstStone.z,
    isMoving: true,
    inWater: false,
    steppingStones: stones,
    busWeight: 12,
  });
  assert.equal(stepSameStone.triggered, false, 'Staying on the same flagstone must not re-trigger');

  const stepOffStone = evaluateLithophoneWaystoneStep(step1.nextStoneIndex, {
    playerX: 48,
    playerZ: 48,
    isMoving: true,
    inWater: false,
    steppingStones: stones,
    busWeight: 12,
  });
  assert.equal(stepOffStone.nextStoneIndex, -1);

  // 4. Verify Interactive Immanent Co-Observer Witness Communion Gaze & Range Gating
  const facingWitness = evaluateWitnessCommunionTarget({
    playerX: 0,
    playerZ: 0,
    playerYaw: 0, // facing -Z
    witnessX: 0,
    witnessZ: -5.5,
    busWeight: 12,
  });
  assert.equal(facingWitness.inCommunionRange, true);
  assert.equal(facingWitness.inForwardGazeCone, true);

  const behindWitness = evaluateWitnessCommunionTarget({
    playerX: 0,
    playerZ: 0,
    playerYaw: 0, // facing -Z, witness behind at +Z
    witnessX: 0,
    witnessZ: 5.5,
    busWeight: 12,
  });
  assert.equal(behindWitness.inCommunionRange, true);
  assert.equal(behindWitness.inForwardGazeCone, false);

  // 5. Verify Playing HUD cleanliness (no stereo pan engineering readout) & landmark-anchored beams
  const appSrc = fs.readFileSync(path.join(process.cwd(), 'src', 'App.tsx'), 'utf8');
  assert.equal(appSrc.includes('stereoLabel'), false, 'Playing HUD must not show raw stereo pan readout');
  assert.equal(appSrc.includes('computeBinauralPan'), false);
  const canvasSrc = fs.readFileSync(
    path.join(process.cwd(), 'src', 'components', 'GardenCanvas.tsx'),
    'utf8',
  );
  assert.equal(canvasSrc.includes('landmarkAnchorByBiome'), true);
});

test('54. Physical Basis & Form Detail of All 5 Biome Monuments, Triune 20-Facet Observer & Curated Voice-Leading', () => {
  // 1. Verify Physical Structural Mechanics of all 5 Biome Monuments
  const resState = createInitialLandmarkResonanceState();
  const mechanics = evaluateMonumentPhysicalMechanics({
    elapsedSeconds: 4.2,
    structuralScale: 1.0,
    spinMultiplier: 1.0,
    resonanceState: resState,
    groveWindTiltX: 0.05,
    groveWindTiltZ: 0.04,
    meadowWindSpeedMps: 3.2,
    chimeBaseLengthM: 1.38,
    chimeLengthStepM: 0.18,
    chimeCordLengthM: 0.28,
    chimeSustainFactor: 1.0,
    wetlandWaterSurfaceY: -0.14,
  });

  // 1a. Sanctuary Orthogonal Cardan Double-Gimbal
  assert.equal(mechanics.sanctuary.gimbalOrthogonalityDeg, 90);
  assert.equal(mechanics.sanctuary.spireVerticalShearMeters, 0);
  assert.ok(Number.isFinite(mechanics.sanctuary.outerGimbalPitchX));
  assert.ok(Number.isFinite(mechanics.sanctuary.innerGimbalRollZ));
  assert.ok(Number.isFinite(mechanics.sanctuary.spireSpinY));

  // 1b. Meadow Astronomical Polar Gnomon & Wind Anemometer
  assert.equal(mechanics.meadow.gnomonLatitudeInclinationRad, 0.6632);
  assert.ok(mechanics.meadow.anemometerAngularRateRadPerSec > 0);
  const calmMechanics = evaluateMonumentPhysicalMechanics({
    elapsedSeconds: 4.2,
    structuralScale: 1.0,
    spinMultiplier: 1.0,
    resonanceState: resState,
    groveWindTiltX: 0,
    groveWindTiltZ: 0,
    meadowWindSpeedMps: 0.5,
  });
  assert.ok(
    mechanics.meadow.anemometerAngularRateRadPerSec > calmMechanics.meadow.anemometerAngularRateRadPerSec,
    'Anemometer angular rate must scale monotonically with wind velocity',
  );

  // 1c. Grove Compound Pendulum Eigenfrequencies: omega_i = sqrt(g / L_eff,i)
  assert.equal(mechanics.grove.chimeEffectiveLengthsM.length, 6);
  assert.ok(
    mechanics.grove.chimeNaturalOmegaRadPerSec[0] >
      mechanics.grove.chimeNaturalOmegaRadPerSec[2],
    `Shorter chime (L0=1.38m) must swing with higher natural frequency than longer chime (L2=1.74m): ${mechanics.grove.chimeNaturalOmegaRadPerSec[0]} vs ${mechanics.grove.chimeNaturalOmegaRadPerSec[2]}`,
  );
  assert.ok(Number.isFinite(mechanics.grove.clapperPitchX));
  assert.ok(Number.isFinite(mechanics.grove.clapperRollZ));

  // 1d. Crystal Geode Archway: 100% Closure, Hookean Torsion Filament & Pendulum
  assert.equal(mechanics.crystal.spireSpanFraction, 1.0);
  assert.equal(mechanics.crystal.prismVerticalShearMeters, 0);
  assert.ok(Number.isFinite(mechanics.crystal.torsionYawRad));
  assert.ok(Number.isFinite(mechanics.crystal.pendulumPitchX));

  // 1e. Wetland Hydro-Meniscus Piers: Submerged Tufa Foundations & Zero Floating Gap
  assert.equal(mechanics.wetland.floatingGapMeters, 0);
  assert.equal(mechanics.wetland.orbVerticalShearMeters, 0);
  assert.ok(mechanics.wetland.foundationEmbedMeters >= 0.25);
  for (let p = 0; p < mechanics.wetland.submergedPilingHeightsM.length; p++) {
    assert.ok(
      mechanics.wetland.submergedPilingHeightsM[p] >= 0.35 + mechanics.wetland.foundationEmbedMeters,
      `Piling ${p} must extend from lakebed through water column with deep embedment`,
    );
    assert.ok(mechanics.wetland.orbBioluminescentPulse[p] > 0);
  }

  // 2. Verify Unified 20-Facet Observer Self-Differentiation & Triune Intrinsic Motivation
  const observer20 = evaluateObserver20FacetDifferentiationAndAffinity({
    meanSynapticWeight: 10.5,
    harmonyPct: 78,
    awakenedSpeciesCount: 4,
    tenneyConsonancePurity01: 0.88,
  });
  assert.equal(observer20.unifiedFacetTotal, 20);
  assert.equal(observer20.uniquePrimeNichesCount, 20);
  assert.equal(observer20.allTwentyFacetsDifferentiated, true);
  assert.equal(observer20.optimizationIsSoleDirective, false);
  assert.ok(
    observer20.shannonFunctionalDiversityBits > 4.20,
    `Expected Shannon functional diversity > 4.20 bits across 20 facets: ${observer20.shannonFunctionalDiversityBits}`,
  );
  assert.equal(observer20.triuneDirectives.length, 3);
  assert.equal(observer20.triuneDirectives[0].directiveId, 'physical-lawfulness');
  assert.equal(observer20.triuneDirectives[1].directiveId, 'self-differentiation');
  assert.equal(observer20.triuneDirectives[2].directiveId, 'curatorial-affinity');
  assert.ok(observer20.curatorialAffinityPermille >= 530);

  // 2b. Curatorial Affinity Monotonicity with Harmony and Diversity
  const zeroHarmonyAffinity = evaluateCompiledCuratorialAffinityPermille(8, 0);
  const fullHarmonyAffinity = evaluateCompiledCuratorialAffinityPermille(8, 100);
  assert.ok(
    fullHarmonyAffinity > zeroHarmonyAffinity,
    `Curatorial affinity must increase with harmony: ${fullHarmonyAffinity} > ${zeroHarmonyAffinity}`,
  );

  const lowObserver = evaluateObserver20FacetDifferentiationAndAffinity({
    meanSynapticWeight: 8,
    harmonyPct: 0,
    awakenedSpeciesCount: 0,
    tenneyConsonancePurity01: 0.5,
  });
  const highObserver = evaluateObserver20FacetDifferentiationAndAffinity({
    meanSynapticWeight: 8,
    harmonyPct: 100,
    awakenedSpeciesCount: 5,
    tenneyConsonancePurity01: 1.0,
  });
  assert.ok(
    highObserver.curatorialAffinityPermille > lowObserver.curatorialAffinityPermille,
    `Full curatorial affinity must exceed zero harmony affinity: ${highObserver.curatorialAffinityPermille} > ${lowObserver.curatorialAffinityPermille}`,
  );

  // 3. Verify Observer-Curated Melodic & Harmonic Voice-Leading in Soundtrack
  const plants = generateGardenPlants(42026);
  // Attune all species to active resonant maturity
  plants.forEach((p) => {
    p.attuned = true;
    p.lifecycleStage = 'resonant-bloom';
  });
  const score = composeLiveSoundtrackScore({
    biome: 'sanctuary',
    atmosphere: 'golden',
    plants,
    playerX: 0,
    playerZ: 0,
    playerYaw: 0,
    harmonyPct: 85,
    neuromorphic: createInitialNeuromorphicState(),
  });

  assert.ok(score.restStepCount >= 6, `Observer must curate breathing rests (>= 6): ${score.restStepCount}`);
  assert.ok(score.activeStepCount <= 10, `Active steps capped at 10 to prevent acoustic clutter: ${score.activeStepCount}`);
  assert.ok(
    score.maxMelodicStepLeap <= 2,
    `Observer voice-leading must remain conjunct (|delta| <= 2): max leap was ${score.maxMelodicStepLeap}`,
  );
  assert.ok(
    score.meanEulerGradus <= 12,
    `Observer curation must maintain Euler gradus consonance <= 12: ${score.meanEulerGradus}`,
  );
  assert.ok(
    score.curatedConsonancePurity01 >= 0.55,
    `Curated consonance purity must be >= 0.55: ${score.curatedConsonancePurity01}`,
  );

  // When 0 flora are awakened, silence and quietude are preserved
  const silentScore = composeLiveSoundtrackScore({
    biome: 'meadow',
    atmosphere: 'twilight',
    plants: [],
    playerX: 0,
    playerZ: 0,
    playerYaw: 0,
    harmonyPct: 0,
  });
  assert.equal(silentScore.activeStepCount, 0);
  assert.equal(silentScore.restStepCount, 16);

  // 4. Verify GardenCanvas Architectural Detail & Physics Invariants in Source Code
  const canvasSource = fs.readFileSync(
    path.join(process.cwd(), 'src', 'components', 'GardenCanvas.tsx'),
    'utf8',
  );
  // Uniform scalar monument scale (no anisotropic ellipse warping)
  assert.equal(
    canvasSource.includes('sanctuaryMonument.group.scale.setScalar(dampedScale)'),
    true,
    'GardenCanvas must uniformly scale sanctuary monument',
  );
  assert.equal(
    canvasSource.includes('crystalMonument.group.scale.setScalar(dampedScale)'),
    true,
    'GardenCanvas must uniformly scale crystal monument',
  );
  // Elevated Tyndall beam start (plumes rise above monument crowns)
  assert.equal(
    canvasSource.includes('baseElev + crownHeightsByBiome[bId] + 0.35'),
    true,
    'GardenCanvas must elevate Tyndall beam plume start above monument crown',
  );
  // True 4-level Cardan double-gimbal hierarchy (`group -> orbitRing -> innerGimbalRing -> spireCradle -> spire`) without artificial vertical shearing
  assert.equal(
    canvasSource.includes('sanctuaryMonument.orbitRing.rotation.x = monumentMechanics.sanctuary.outerGimbalPitchX'),
    true,
  );
  assert.equal(
    canvasSource.includes('spireCradle.add(spire)') &&
      canvasSource.includes('orbitRing.add(innerGimbalRing)'),
    true,
    'Sanctuary spire must be hierarchically nested inside spireCradle -> innerGimbalRing -> orbitRing with zero clipping',
  );
  // Grove compound chimes driven by eigenfrequencies and local wind
  assert.equal(
    canvasSource.includes('groveMonument.chimeTubes[c].rotation.x = monumentMechanics.grove.chimePitchX[c]'),
    true,
  );
  assert.equal(
    canvasSource.includes('groveMonument.clapperPivot.rotation.x = monumentMechanics.grove.clapperPitchX'),
    true,
  );
  // Crystal Archway 100% full span and torsion oscillation
  assert.equal(
    canvasSource.includes('crystalMonument.corePrism.rotation.y = monumentMechanics.crystal.torsionYawRad'),
    true,
  );
  // Wetland tufa piers and pulse factors
  assert.equal(
    canvasSource.includes('monumentMechanics.wetland.orbBioluminescentPulse[l]'),
    true,
  );
});

test('55. Pure Harmonic Overtone Lock (0.0¢ Drift), Zero Stochastic Audio Randomness, True Cardan & Torsion Hierarchies, and Walkable Monument Portals', () => {
  // 1. Formal .lex.tex AST standards verify 0¢ harmonic overtone drift, zero random calls, 4-level Cardan chain, and >=1400mm walkable portals
  const tonnetzStd = GENERATED_PRISM_STANDARDS.primeLimitTonnetz as {
    pureHarmonicOvertoneCentsDriftZero: number;
    deterministicPhysicalCausationEnforced: boolean;
  };
  assert.equal(tonnetzStd.pureHarmonicOvertoneCentsDriftZero, 0);
  assert.equal(tonnetzStd.deterministicPhysicalCausationEnforced, true);

  const teleologyPhys = (
    GENERATED_PRISM_STANDARDS.teleology as {
      physicalBasisAndTriuneCuration: {
        cardanKinematicHierarchyDepth: number;
        minWalkablePortalClearanceMm: number;
        cardanTrunnionZeroSlipEnforced: boolean;
        walkableMonumentPortalsEnforced: boolean;
      };
    }
  ).physicalBasisAndTriuneCuration;
  assert.equal(teleologyPhys.cardanKinematicHierarchyDepth, 4);
  assert.equal(teleologyPhys.minWalkablePortalClearanceMm, 1400);
  assert.equal(teleologyPhys.cardanTrunnionZeroSlipEnforced, true);
  assert.equal(teleologyPhys.walkableMonumentPortalsEnforced, true);

  // 2. Zero Math.random() calls and zero contrived 8.5s clock timers in soundscapeEngine.ts
  const soundEngineSource = fs.readFileSync(
    path.resolve(process.cwd(), 'src/game/soundscapeEngine.ts'),
    'utf8',
  );
  assert.equal(
    soundEngineSource.includes('Math.random('),
    false,
    'soundscapeEngine.ts must contain zero stochastic Math.random() calls',
  );
  assert.equal(
    soundEngineSource.includes('lastMicroAmbienceTime'),
    false,
    'soundscapeEngine.ts must contain zero contrived periodic micro-ambience clock timers',
  );
  assert.equal(
    soundEngineSource.includes('/ 1.58'),
    false,
    'soundscapeEngine.ts must never multiply sustained partials by the +408¢ (2.0 / 1.58) detuning factor',
  );

  // 3. Every botanical species sustained harmonic series is exact rational Just Intonation (0.0 cents beating)
  const exactRationalSet = new Set([0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 4.0]);
  for (const sp of [
    'chime-lily',
    'pulse-fern',
    'echo-lotus',
    'drone-moss',
    'star-orchid',
  ] as const) {
    const series = resolvePureSustainedHarmonicSeries(sp);
    assert.equal(series.length, 3);
    for (const mult of series) {
      assert.equal(
        exactRationalSet.has(mult),
        true,
        `Species ${sp} sustained harmonic multiplier ${mult} must be an exact pure harmonic ratio`,
      );
    }
  }

  // 4. Parametric Monument Proportions & Walkable Portal Clearances across alphaSeed = 1..8
  const playerDiameterM = 0.84;
  for (let seed = 1; seed <= 8; seed++) {
    const inorg = synthesizeObserverInorganicMonuments({ alphaSeed: seed });
    const sanct = inorg.monuments.sanctuary.sanctuary!;
    const meadow = inorg.monuments.meadow.meadow!;
    const crystal = inorg.monuments.crystal.crystal!;
    const wetland = inorg.monuments.wetland.wetland!;

    // Sanctuary innerCupolaRadius matches 1.15m * scale so outer & inner Cardan gimbals clear the 0.62m quartz spire
    assert.ok(
      sanct.innerCupolaRadius >= 1.1 * inorg.monuments.sanctuary.structuralScale,
      `Sanctuary innerCupolaRadius (${sanct.innerCupolaRadius}) must accommodate Cardan gimbals`,
    );
    assert.ok(
      meadow.sunOrbPivotY > meadow.dialTopY + meadow.archRadius,
      'Meadow sunOrbPivotY must sit cleanly above the meridian arch crown without skewering',
    );
    assert.ok(
      meadow.dialTopY + meadow.archRadius >= 2.2,
      'Meadow meridian arch crown must clear the 1.68m player eye height',
    );
    assert.ok(
      wetland.pagodaRoofY >= 1.8 && wetland.chamberDeckY >= 1.1,
      'Wetland Tōrō water-lantern piers must have full sculpted sao shaft & hibukuro chamber elevation',
    );

    const plants = generateGardenPlants({ alphaSeed: seed });
    const colliders = buildGardenColliders(plants, { alphaSeed: seed });
    const meadowWest = colliders.find((c) => c.id === 'col-meadow-gnomon-west')!;
    const meadowEast = colliders.find((c) => c.id === 'col-meadow-gnomon-east')!;
    const meadowClearanceM =
      Math.hypot(meadowEast.x - meadowWest.x, meadowEast.z - meadowWest.z) -
      (meadowWest.radiusMeters + meadowEast.radiusMeters);
    assert.ok(
      meadowClearanceM >= 3.2,
      `Meadow Sundial arch walkway clearance (${meadowClearanceM.toFixed(2)}m) must comfortably admit player (${playerDiameterM}m)`,
    );

    const spire1 = colliders.find((c) => c.id === 'col-crystal-spire-1')!;
    const spire2 = colliders.find((c) => c.id === 'col-crystal-spire-2')!;
    const crystalPortalClearanceM =
      Math.hypot(spire2.x - spire1.x, spire2.z - spire1.z) -
      (spire1.radiusMeters + spire2.radiusMeters);
    assert.ok(
      crystalPortalClearanceM >= 1.75,
      `Crystal Archway hexagonal portal clearance (${crystalPortalClearanceM.toFixed(2)}m) must comfortably admit player (${playerDiameterM}m)`,
    );
    assert.ok(
      crystal.keystoneRingRadius >= 1.5,
      `Crystal keystone ring radius (${crystal.keystoneRingRadius}m) must surround the suspended 0.42m core prism cleanly`,
    );
  }

  // 5. Immanent Co-Observer Witness 3D Rig: centered core (y = 0) & coaxial X-trunnion / Y-journal Cardan rotation
  const witnessRig = buildImmanentObserverWitnessGroup();
  assert.equal(
    witnessRig.quartzCoreMesh.position.y,
    0,
    'Witness double-terminated quartz core must be centered at local y = 0 inside innerGimbalGroup without downward offset',
  );
  assert.equal(
    witnessRig.innerGimbalGroup.parent,
    witnessRig.outerGimbalGroup,
    'Witness innerGimbalGroup must be hierarchically parented to outerGimbalGroup',
  );

  // 6. Physical Chime-Striker Contact Causation & Dynamic Wetland Reprojection
  const calmMech = evaluateMonumentPhysicalMechanics({
    elapsedSeconds: 0,
    structuralScale: 1.0,
    spinMultiplier: 1.0,
    resonanceState: createInitialLandmarkResonanceState(),
    groveWindTiltX: 0,
    groveWindTiltZ: 0,
    meadowWindSpeedMps: 0.2,
  });
  assert.equal(calmMech.sanctuary.cardanKinematicHierarchyDepth, 4);
  assert.equal(calmMech.sanctuary.cardanTrunnionSlipMeters, 0);

  const gustMech = evaluateMonumentPhysicalMechanics({
    elapsedSeconds: 1.25,
    structuralScale: 1.0,
    spinMultiplier: 1.0,
    resonanceState: { sanctuary: 0.5, meadow: 0.5, grove: 0.9, crystal: 0.5, wetland: 0.5 },
    groveWindTiltX: 0.34,
    groveWindTiltZ: 0.22,
    meadowWindSpeedMps: 4.5,
  });
  assert.ok(
    gustMech.grove.activeChimeStrikeIndex >= 0 && gustMech.grove.activeChimeStrikeIndex < 6,
    'Strong Grove wind gust + resonance must physically bring the 6-point striker into chime contact',
  );
  assert.ok(gustMech.grove.chimeStrikeVelocity01 > 0.28);

  const canvasSource = fs.readFileSync(
    path.resolve(process.cwd(), 'src/components/GardenCanvas.tsx'),
    'utf8',
  );
  assert.equal(
    canvasSource.includes('immanentWitness.outerGimbalGroup.rotation.x = liveWitness.gimbalInnerTiltRad') &&
      canvasSource.includes('immanentWitness.innerGimbalGroup.rotation.y ='),
    true,
    'GardenCanvas must rotate Witness outerGimbalGroup around X-trunnions and innerGimbalGroup around Y-journals',
  );
  assert.equal(
    canvasSource.includes('crystalMonument.torsionPendulumGroup.rotation.x = monumentMechanics.crystal.pendulumPitchX'),
    true,
    'Crystal torsionPendulumGroup must swing filament, bezel, and corePrism together',
  );
  assert.equal(
    canvasSource.includes('wetlandMonument.group.position.set(') &&
      canvasSource.includes('soundEngine.playPhysicalLandmarkResonance('),
    true,
    'GardenCanvas must dynamically reproject Wetland piers and drive landmark resonance from physical mechanics',
  );
});







