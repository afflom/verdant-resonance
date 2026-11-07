import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ATMOSPHERE_CONFIGS,
  SANCTUARY_TRAIL_WAYPOINTS,
  VERDANT_RESONANCE_SPEC,
  computeEcologicalAffinity,
  computePlantMorphology,
  computeSynthesisEnvelope,
  evaluateDiurnalProfile,
  evaluatePrismRequest,
  formatPrismRequest,
  runAcceptanceVectors,
  verifyPrismProperties,
  groundHeightAt,
  biomeAt,
  generateGardenPlants,
  findNearestPlant,
} from './prismModel';

test('Botanical soundscape specification validates all 7 fields, 10 outcomes, 20 rules, and 21 examples', () => {
  assert.equal(VERDANT_RESONANCE_SPEC.schema, 'prism/spec/1');
  assert.equal(VERDANT_RESONANCE_SPEC.name, 'verdant-resonance');
  assert.equal(VERDANT_RESONANCE_SPEC.fields.length, 7);
  assert.equal(VERDANT_RESONANCE_SPEC.outcomes.length, 10);
  assert.equal(VERDANT_RESONANCE_SPEC.rules.length, 20);
  assert.equal(VERDANT_RESONANCE_SPEC.properties.length, 8);
  assert.equal(SANCTUARY_TRAIL_WAYPOINTS.length, 5);

  for (const ex of VERDANT_RESONANCE_SPEC.examples) {
    const res = evaluatePrismRequest(ex.request);
    assert.equal(res.valid, true, `Expected valid request: ${ex.request}`);
    assert.equal(res.outcome, ex.response, `Mismatch for example: ${ex.request}`);
  }
});

test('Formal botanical invariants (INV-001 to INV-008) hold universally across all sampled states', () => {
  const verification = verifyPrismProperties(VERDANT_RESONANCE_SPEC);
  assert.equal(verification.allHold, true);
  assert.equal(verification.results.length, 8);
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
  assert.ok(report.total >= 25);

  assert.equal(evaluatePrismRequest('').outcome, 'invalid');
  assert.equal(evaluatePrismRequest('meadow chime-lily attune dawn dormant 08 4').outcome, 'invalid');
  assert.equal(evaluatePrismRequest('meadow chime-lily attune dawn dormant 105 4').outcome, 'invalid');
});

test('Diurnal sky, ecological affinity, and synthesis voice-leading models evaluate deterministically', () => {
  // Sanctuary Chorus when attuning an awakened plant in Sanctuary
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

  // Dawn Arpeggio when observing Chime Lily at Dawn
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

  // Nocturnal Symphony when observing Echo Lotus at Twilight
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

  // Diurnal profile & synthesis envelope
  const diurnal = evaluateDiurnalProfile('starlight', 'sanctuary', 80);
  assert.equal(diurnal.starOpacity, 1);
  assert.ok(diurnal.floraEmissiveMultiplier > 1.8);

  const affinity = computeEcologicalAffinity('meadow', 'chime-lily', 'dawn');
  assert.equal(affinity.affinityTier, 'sanctuary-peak');
  assert.equal(affinity.harmonyBonus, 4);

  const synth = computeSynthesisEnvelope('sanctuary-chorus', 'sanctuary', 'starlight');
  assert.equal(synth.frequenciesHz.length, 6);
  assert.ok(synth.frequenciesHz[0] > 100);
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
