import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ATMOSPHERE_CONFIGS,
  SANCTUARY_TRAIL_WAYPOINTS,
  VERDANT_BRAND_STANDARD,
  VERDANT_INFRASTRUCTURE_STANDARD,
  VERDANT_RESONANCE_SPEC,
  computeBinauralPan,
  computeEcologicalAffinity,
  computePlantMorphology,
  computeSynthesisEnvelope,
  evaluateDiurnalProfile,
  evaluateHumaneErgonomics,
  evaluatePrismRequest,
  formatPrismRequest,
  runAcceptanceVectors,
  verifyPrismProperties,
  groundHeightAt,
  biomeAt,
  generateGardenPlants,
  findNearestPlant,
} from './prismModel';

test('Botanical soundscape specification validates all 7 fields, 10 outcomes, 24 rules, and 25 examples', () => {
  assert.equal(VERDANT_RESONANCE_SPEC.schema, 'prism/spec/1');
  assert.equal(VERDANT_RESONANCE_SPEC.name, 'verdant-resonance');
  assert.equal(VERDANT_RESONANCE_SPEC.fields.length, 7);
  assert.equal(VERDANT_RESONANCE_SPEC.outcomes.length, 10);
  assert.equal(VERDANT_RESONANCE_SPEC.rules.length, 24);
  assert.equal(VERDANT_RESONANCE_SPEC.properties.length, 10);
  assert.equal(VERDANT_RESONANCE_SPEC.examples.length, 25);
  assert.equal(SANCTUARY_TRAIL_WAYPOINTS.length, 5);

  for (const ex of VERDANT_RESONANCE_SPEC.examples) {
    const res = evaluatePrismRequest(ex.request);
    assert.equal(res.valid, true, `Expected valid request: ${ex.request}`);
    assert.equal(res.outcome, ex.response, `Mismatch for example: ${ex.request}`);
  }
});

test('Formal botanical invariants (INV-001 to INV-010) hold universally across all sampled states', () => {
  const verification = verifyPrismProperties(VERDANT_RESONANCE_SPEC);
  assert.equal(verification.allHold, true);
  assert.equal(verification.results.length, 10);
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
  assert.ok(report.total >= 35);

  assert.equal(evaluatePrismRequest('').outcome, 'invalid');
  assert.equal(evaluatePrismRequest('meadow chime-lily attune dawn dormant 08 4').outcome, 'invalid');
  assert.equal(evaluatePrismRequest('meadow chime-lily attune dawn dormant 105 4').outcome, 'invalid');
});

test('Diurnal sky, ecological affinity, 4-partial synthesis, and binaural panning models evaluate deterministically', () => {
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
  assert.equal(synth.centsDeviation, 0.0);
  assert.ok(synth.reverbSendGain > 0.4);

  // Binaural pan: plant to the right (+X) when facing -Z (yaw = 0) pans positive (right)
  const panRight = computeBinauralPan(0, 0, 0, 5, -5);
  const panLeft = computeBinauralPan(0, 0, 0, -5, -5);
  assert.ok(panRight > 0.4);
  assert.ok(panLeft < -0.4);
});

test('Brand identity, humane-centered design, and zero-allocation infrastructure models satisfy formal invariants', () => {
  assert.equal(VERDANT_BRAND_STANDARD.profile, 'prism/brand-standard/1');
  assert.equal(VERDANT_BRAND_STANDARD.chromaticPalette.length, 4);
  assert.ok(VERDANT_BRAND_STANDARD.chromaticPalette[1].contrastRatio >= 12.0);

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
  assert.equal(VERDANT_INFRASTRUCTURE_STANDARD.partialsPerVoice, 4);
  assert.equal(VERDANT_INFRASTRUCTURE_STANDARD.sporeRingBufferCapacity, 180);
});

test('Procedural garden generation and spatial topography maintain invariants', () => {
  const plants = generateGardenPlants(42026);
  assert.ok(plants.length >= 35, `Expected at least 35 plants, got ${plants.length}`);
  assert.equal(Object.keys(ATMOSPHERE_CONFIGS).length, 4);

  for (const p of plants) {
    const distFromOrigin = Math.hypot(p.x, p.z);
    assert.ok(distFromOrigin >= 4.5, `Plant ${p.id} is too close to spawn at (${p.x}, ${p.z})`);
    assert.equal(p.y, groundHeightAt(p.x, p.z), `Plant ${p.id} must sit flush on groundHeightAt`);
  }

  const nearestAtSpawn = findNearestPlant(0, -3, plants);
  assert.equal(nearestAtSpawn.plant.species, 'chime-lily');
  assert.ok(nearestAtSpawn.distanceMeters < 4.0);

  assert.equal(biomeAt(0, 0), 'meadow');
  assert.equal(biomeAt(0, -34), 'sanctuary');
  assert.equal(biomeAt(-36, -24), 'grove');
  assert.equal(biomeAt(36, -24), 'crystal');
  assert.equal(biomeAt(-28, 30), 'wetland');
});
