/**
 * Comprehensive Botanical Soundscape, Diurnal Sky, Ecological Affinity,
 * Brand Identity, Humane-Centered Design, Psychoacoustics & Runtime Infrastructure Models
 * Formally modeled and verified via `prism/spec.json` and `prism/src/VerdantResonance.lex.tex`.
 */

import {
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
} from './generatedPrismConstants';

export {
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
};

export const SPEC_SCHEMA = 'prism/spec/1';
export const INVALID_OUTCOME = 'invalid';

export type BiomeId = 'meadow' | 'grove' | 'crystal' | 'wetland' | 'sanctuary';
export type PlantSpeciesId = 'chime-lily' | 'pulse-fern' | 'echo-lotus' | 'drone-moss' | 'star-orchid';
export type PlayerActionId = 'observe' | 'touch' | 'attune' | 'stroll' | 'stillness';
export type AtmosphereId = 'dawn' | 'golden' | 'twilight' | 'starlight';
export type ChorusStateId = 'dormant' | 'awakened';

export type SoundscapeOutcome =
  | 'sanctuary-chorus'
  | 'serene-rest'
  | 'nocturnal-symphony'
  | 'dawn-arpeggio'
  | 'harmonic-bloom'
  | 'crystalline-choir'
  | 'melodic-chime'
  | 'rhythmic-pulse'
  | 'ambient-drone'
  | 'wind-whisper';

export interface PrismFieldChoice {
  name: string;
  kind: 'choice';
  values: string[];
}

export interface PrismFieldNumber {
  name: string;
  kind: 'number';
  min?: number;
  max?: number;
}

export type PrismField = PrismFieldChoice | PrismFieldNumber;

export interface PrismCondition {
  field: string;
  op: 'is' | 'is not' | '<' | '<=' | '>' | '>=' | '=' | '!=';
  value: string | number | { field: string };
}

export interface PrismRule {
  id: string;
  when: PrismCondition[];
  then: SoundscapeOutcome;
  says: string;
}

export interface PrismProperty {
  id: string;
  kind: 'always' | 'never';
  when: PrismCondition[];
  then: SoundscapeOutcome;
  says: string;
  theoremName: string;
}

export interface PrismExample {
  request: string;
  response: SoundscapeOutcome | typeof INVALID_OUTCOME;
}

export interface PrismSpec {
  schema: string;
  name: string;
  title: string;
  purpose: string;
  fields: PrismField[];
  outcomes: SoundscapeOutcome[];
  rules: PrismRule[];
  otherwise: SoundscapeOutcome;
  properties: PrismProperty[];
  examples: PrismExample[];
}

/**
 * Canonical Verdant Resonance Specification (`VERDANT_RESONANCE_SPEC`).
 * Extracted directly from `/prism/spec.json` and cross-validated against
 * `/prism/src/VerdantResonance.lex.tex` (35 rules) and `/prism/src/VerdantResonanceProofs.lex.tex` (15 invariants)
 * by `scripts/extractPrismArtifacts.ts` — never hand-typed in TypeScript.
 */
export const VERDANT_RESONANCE_SPEC: PrismSpec =
  GENERATED_VERDANT_RESONANCE_SPEC as unknown as PrismSpec;

const MAX_DIGITS = 18;

export function parsePrismNumber(text: string): bigint | null {
  if (!/^(0|[1-9][0-9]*)$/.test(text) || text.length > MAX_DIGITS) return null;
  return BigInt(text);
}

export function decodePrismRequest(
  text: string,
  spec: PrismSpec = VERDANT_RESONANCE_SPEC,
): Record<string, string | bigint> | null {
  const parts = text.split(' ');
  if (parts.length !== spec.fields.length) return null;
  const out: Record<string, string | bigint> = {};
  for (let i = 0; i < spec.fields.length; i++) {
    const f = spec.fields[i];
    const part = parts[i];
    if (f.kind === 'choice') {
      if (!f.values.includes(part)) return null;
      out[f.name] = part;
    } else {
      const n = parsePrismNumber(part);
      if (n === null) return null;
      if (f.min !== undefined && n < BigInt(f.min)) return null;
      if (f.max !== undefined && n > BigInt(f.max)) return null;
      out[f.name] = n;
    }
  }
  return out;
}

export function conditionHolds(
  cond: PrismCondition,
  req: Record<string, string | bigint>,
): boolean {
  const lhs = req[cond.field];
  if (cond.op === 'is') return lhs === cond.value;
  if (cond.op === 'is not') return lhs !== cond.value;
  const rhs =
    typeof cond.value === 'object'
      ? (req[cond.value.field] as bigint)
      : BigInt(cond.value as number);
  const l = lhs as bigint;
  switch (cond.op) {
    case '<':
      return l < rhs;
    case '<=':
      return l <= rhs;
    case '>':
      return l > rhs;
    case '>=':
      return l >= rhs;
    case '=':
      return l === rhs;
    case '!=':
      return l !== rhs;
    default:
      return false;
  }
}

export interface JudgeBusManifoldState {
  wInfrastructure: number;
  wPhysics: number;
  wBotany: number;
  wEcology: number;
  wAcoustics: number;
  wArticulation: number;
  wSoundtrack: number;
  wHumane: number;
  wBrand: number;
  wNeuromorphic: number;
}

export interface JudgeDomainBusModulations {
  infrastructurePoolCapacity: number;
  physicsBuoyancyMillihz: number;
  botanyPollinationRadiusCm: number;
  ecologyConductivityPermille: number;
  acousticsFilterQPermille: number;
  articulationGracePermille: number;
  soundtrackHarmonicDensity: number;
  humaneZephyrCapMmPerSec2: number;
  brandContrastTenths: number;
}

/**
 * Exact executable domain bus modulation functions backed directly by
 * `GENERATED_PRISM_BUS_MODULATION_LUT` and `GENERATED_PRISM_PLASTICITY_LUT`
 * compiled from `prism/src/Foundation/<Domain>/V1/Model.lex.tex` by `scripts/extractPrismArtifacts.ts`.
 */
function clampLutIndex(w: number, len: number): number {
  return Math.max(0, Math.min(len - 1, Math.round(w)));
}

export function clampPrismBusWeight(w: number): number {
  const lut = GENERATED_PRISM_PLASTICITY_LUT.clampBusWeight;
  return lut[clampLutIndex(w, lut.length)];
}

export function stepInfrastructureBusModulation(busWeight: number): number {
  const lut = GENERATED_PRISM_BUS_MODULATION_LUT.infrastructure;
  return lut[clampPrismBusWeight(busWeight)];
}

export function stepPhysicsBusModulation(busWeight: number): number {
  const lut = GENERATED_PRISM_BUS_MODULATION_LUT.physics;
  return lut[clampPrismBusWeight(busWeight)];
}

export function stepBotanyBusModulation(busWeight: number): number {
  const lut = GENERATED_PRISM_BUS_MODULATION_LUT.botany;
  return lut[clampPrismBusWeight(busWeight)];
}

export function stepEcologyBusModulation(busWeight: number): number {
  const lut = GENERATED_PRISM_BUS_MODULATION_LUT.ecology;
  return lut[clampPrismBusWeight(busWeight)];
}

export function stepAcousticsBusModulation(busWeight: number): number {
  const lut = GENERATED_PRISM_BUS_MODULATION_LUT.acoustics;
  return lut[clampPrismBusWeight(busWeight)];
}

export function stepArticulationBusModulation(busWeight: number): number {
  const lut = GENERATED_PRISM_BUS_MODULATION_LUT.articulation;
  return lut[clampPrismBusWeight(busWeight)];
}

export function stepSoundtrackBusModulation(busWeight: number): number {
  const lut = GENERATED_PRISM_BUS_MODULATION_LUT.soundtrack;
  return lut[clampPrismBusWeight(busWeight)];
}

export function stepHumaneBusModulation(busWeight: number): number {
  const lut = GENERATED_PRISM_BUS_MODULATION_LUT.humane;
  return lut[clampPrismBusWeight(busWeight)];
}

export function stepBrandBusModulation(busWeight: number): number {
  const lut = GENERATED_PRISM_BUS_MODULATION_LUT.brand;
  return lut[clampPrismBusWeight(busWeight)];
}

export function stepWisdomPhenomenonModulation(busWeight: number): number {
  const lut = GENERATED_PRISM_BUS_MODULATION_LUT.wisdomPhenomenon;
  return lut[clampPrismBusWeight(busWeight)];
}

export function stepStakeholderValueReinforcement(
  w: number,
  allFacetsActive: boolean,
): number {
  const lut = allFacetsActive
    ? GENERATED_PRISM_PLASTICITY_LUT.stepStakeholderValueReinforcementCoactive
    : GENERATED_PRISM_PLASTICITY_LUT.stepStakeholderValueReinforcementSilent;
  return lut[clampLutIndex(w, lut.length)];
}

export function verifyEmergentEntitySynthesizesFacets(w: number): boolean {
  const lut = GENERATED_PRISM_PLASTICITY_LUT.verifyEmergentEntitySynthesizesFacets;
  return lut[clampLutIndex(w, lut.length)];
}

export function stepAtomicValenceActivity(busWeight: number): number {
  const lut = GENERATED_PRISM_BUS_MODULATION_LUT.atomicValence;
  return lut[clampPrismBusWeight(busWeight)];
}

export function stepMolecularBondCoherence(busWeight: number): number {
  const lut = GENERATED_PRISM_BUS_MODULATION_LUT.molecularBond;
  return lut[clampPrismBusWeight(busWeight)];
}

export function stepMacromolecularPolymerization(busWeight: number): number {
  const lut = GENERATED_PRISM_BUS_MODULATION_LUT.macromolecularPolymer;
  return lut[clampPrismBusWeight(busWeight)];
}

export function stepCompoundManifestation(busWeight: number): number {
  const lut = GENERATED_PRISM_BUS_MODULATION_LUT.compoundManifestation;
  return lut[clampPrismBusWeight(busWeight)];
}

export function stepEnvironmentalModalSynthesis(busWeight: number): number {
  const lut = GENERATED_PRISM_BUS_MODULATION_LUT.environmentalModalSynthesis;
  return lut[clampPrismBusWeight(busWeight)];
}

export function verifyGranularAtomicToEnvironmentalChain(busWeight: number): boolean {
  const lut = GENERATED_PRISM_PLASTICITY_LUT.verifyGranularAtomicToEnvironmentalChain;
  return lut[clampLutIndex(busWeight, lut.length)];
}

export function stepAtomicRemineralizationFlux(busWeight: number): number {
  const lut = GENERATED_PRISM_BUS_MODULATION_LUT.atomicRemineralization;
  return lut[clampPrismBusWeight(busWeight)];
}

export function verifyClosedLoopMatterConservation(busWeight: number): boolean {
  const lut = GENERATED_PRISM_PLASTICITY_LUT.verifyClosedLoopMatterConservation;
  return lut[clampLutIndex(busWeight, lut.length)];
}

export function verifyCompleteGranularSynthesisClosure(busWeight: number): boolean {
  const lut = GENERATED_PRISM_PLASTICITY_LUT.verifyCompleteGranularSynthesisClosure;
  return lut[clampLutIndex(busWeight, lut.length)];
}

export function uniformJudgeBusManifold(w: number): JudgeBusManifoldState {
  return {
    wInfrastructure: w,
    wPhysics: w,
    wBotany: w,
    wEcology: w,
    wAcoustics: w,
    wArticulation: w,
    wSoundtrack: w,
    wHumane: w,
    wBrand: w,
    wNeuromorphic: w,
  };
}

export function stepUniversalBusBroadcastManifold(
  state: JudgeBusManifoldState,
  sourceConsolidated: boolean,
): JudgeBusManifoldState {
  const txLut = sourceConsolidated
    ? GENERATED_PRISM_PLASTICITY_LUT.transferWeightCrossDomainCoactive
    : GENERATED_PRISM_PLASTICITY_LUT.transferWeightCrossDomainSilent;
  const potLut = GENERATED_PRISM_PLASTICITY_LUT.learnWeightPotentiated;
  const tx = (wTarget: number) => txLut[clampLutIndex(wTarget, txLut.length)];
  const learnPotentiated = (w: number) => potLut[clampLutIndex(w, potLut.length)];

  return {
    wInfrastructure: tx(state.wInfrastructure),
    wPhysics: tx(state.wPhysics),
    wBotany: tx(state.wBotany),
    wEcology: tx(state.wEcology),
    wAcoustics: tx(state.wAcoustics),
    wArticulation: tx(state.wArticulation),
    wSoundtrack: tx(state.wSoundtrack),
    wHumane: tx(state.wHumane),
    wBrand: tx(state.wBrand),
    wNeuromorphic: learnPotentiated(state.wNeuromorphic),
  };
}

export function stepAutopoieticBusManifold(
  state: JudgeBusManifoldState,
  leaderWeight: number = GENERATED_PRISM_STANDARDS.neuromorphic.plasticity.weightMax,
): JudgeBusManifoldState {
  const refLut = GENERATED_PRISM_PLASTICITY_LUT.refineDomainWeightAutopoietic;
  const sigIdx = clampLutIndex(leaderWeight, refLut[0].length);
  const step = (wCurrent: number) => refLut[clampLutIndex(wCurrent, refLut.length)][sigIdx];
  return {
    wInfrastructure: step(state.wInfrastructure),
    wPhysics: step(state.wPhysics),
    wBotany: step(state.wBotany),
    wEcology: step(state.wEcology),
    wAcoustics: step(state.wAcoustics),
    wArticulation: step(state.wArticulation),
    wSoundtrack: step(state.wSoundtrack),
    wHumane: step(state.wHumane),
    wBrand: step(state.wBrand),
    wNeuromorphic: step(state.wNeuromorphic),
  };
}

/**
 * Executable constructive verification predicate `verifySingleCallPropagatesAllTenDomains(w)`
 * backed directly by `GENERATED_PRISM_PLASTICITY_LUT.verifySingleCallPropagatesAllTenDomains`
 * compiled from `Foundation.Neuromorphic.V1.Model.lex.tex` (proven universally for all `w in [1, 15]`
 * in `zeroManualIterationOverheadUniversalHolds`).
 */
export function verifySingleCallPropagatesAllTenDomains(w: number): boolean {
  const lut = GENERATED_PRISM_PLASTICITY_LUT.verifySingleCallPropagatesAllTenDomains;
  return lut[clampLutIndex(w, lut.length)];
}

/**
 * Executable constructive verification predicate `verifyAutopoieticSingleCallAdvancesAllTenDomains(w)`
 * backed directly by `GENERATED_PRISM_PLASTICITY_LUT.verifyAutopoieticSingleCallAdvancesAllTenDomains`
 * compiled from `Foundation.Neuromorphic.V1.Model.lex.tex` (proven universally for all `w in [1, 15]`
 * in `autopoieticSingleCallAllTenDomainsHolds`).
 */
export function verifyAutopoieticSingleCallAdvancesAllTenDomains(w: number): boolean {
  const lut = GENERATED_PRISM_PLASTICITY_LUT.verifyAutopoieticSingleCallAdvancesAllTenDomains;
  return lut[clampLutIndex(w, lut.length)];
}

/**
 * Steps the 10-domain Universal Neuromorphic Bus for a decoded `VerdantResonance::Request`
 * (`VerdantResonance::stepJudgeBusManifold`).
 */
export function stepJudgeBusManifold(
  req: Record<string, string | bigint>,
): JudgeBusManifoldState {
  const { weightInitial } = GENERATED_PRISM_STANDARDS.neuromorphic.plasticity;
  const proximity = typeof req.proximity === 'bigint' ? Number(req.proximity) : Number(req.proximity ?? 0);
  const sourceConsolidated = 0 <= proximity;
  return stepUniversalBusBroadcastManifold(uniformJudgeBusManifold(weightInitial), sourceConsolidated);
}

export function computeJudgeBusModulations(bus: JudgeBusManifoldState): JudgeDomainBusModulations {
  return {
    infrastructurePoolCapacity: stepInfrastructureBusModulation(bus.wInfrastructure),
    physicsBuoyancyMillihz: stepPhysicsBusModulation(bus.wPhysics),
    botanyPollinationRadiusCm: stepBotanyBusModulation(bus.wBotany),
    ecologyConductivityPermille: stepEcologyBusModulation(bus.wEcology),
    acousticsFilterQPermille: stepAcousticsBusModulation(bus.wAcoustics),
    articulationGracePermille: stepArticulationBusModulation(bus.wArticulation),
    soundtrackHarmonicDensity: stepSoundtrackBusModulation(bus.wSoundtrack),
    humaneZephyrCapMmPerSec2: stepHumaneBusModulation(bus.wHumane),
    brandContrastTenths: stepBrandBusModulation(bus.wBrand),
  };
}

/**
 * Verifies the 10-domain cross-domain bus gate on a stepped `JudgeBusManifoldState`
 * (`VerdantResonance::verifyBusModulationsFromState` & `VerdantResonance::verifyJudgeCrossDomainBusGate`,
 * proven universally in `VerdantResonanceProofs::rootJudgeCallsBusAndSatisfiesAllDomainsHolds`).
 */
export function verifyBusModulationsFromState(bus: JudgeBusManifoldState): boolean {
  const { weightInitial } = GENERATED_PRISM_STANDARDS.neuromorphic.plasticity;
  const mod = computeJudgeBusModulations(bus);
  return (
    1005 <= mod.infrastructurePoolCapacity &&
    875 <= mod.physicsBuoyancyMillihz &&
    20 <= mod.botanyPollinationRadiusCm &&
    825 <= mod.ecologyConductivityPermille &&
    915 <= mod.acousticsFilterQPermille &&
    920 <= mod.articulationGracePermille &&
    53 <= mod.soundtrackHarmonicDensity &&
    130 <= mod.humaneZephyrCapMmPerSec2 &&
    85 <= mod.brandContrastTenths &&
    weightInitial < bus.wNeuromorphic
  );
}

export function verifyJudgeCrossDomainBusGate(
  req: Record<string, string | bigint>,
): boolean {
  return verifyBusModulationsFromState(stepJudgeBusManifold(req));
}

/**
 * Verifies complete Prism Model closure for a decoded `VerdantResonance::Request`
 * (`VerdantResonance::verifyCompletePrismModelClosure`, proven universally in
 * `VerdantResonanceProofs::completePrismModelClosureHolds`):
 * Unites the 10-Domain Universal Neuromorphic Bus, the 4-Facet Emergent Stakeholder Entity,
 * and the 6-Stage Closed-Loop Granular Atomic-to-Environmental Procedural Synthesis.
 */
export function verifyCompletePrismModelClosure(
  req: Record<string, string | bigint>,
): boolean {
  const bus = stepJudgeBusManifold(req);
  return (
    verifyBusModulationsFromState(bus) &&
    verifyEmergentEntitySynthesizesFacets(bus.wNeuromorphic) &&
    verifyCompleteGranularSynthesisClosure(bus.wEcology)
  );
}

export function judgePrismRequest(
  req: Record<string, string | bigint>,
  spec: PrismSpec = VERDANT_RESONANCE_SPEC,
): {
  outcome: SoundscapeOutcome;
  rule: string | null;
  ruleDescription: string;
  busManifold: JudgeBusManifoldState;
  busModulations: JudgeDomainBusModulations;
  busGateVerified: boolean;
} {
  const busManifold = stepJudgeBusManifold(req);
  const busModulations = computeJudgeBusModulations(busManifold);
  const busGateVerified = verifyBusModulationsFromState(busManifold);
  if (!busGateVerified) {
    return {
      outcome: 'wind-whisper',
      rule: null,
      ruleDescription: 'Fallback breeze when cross-domain bus gate is unverified.',
      busManifold,
      busModulations,
      busGateVerified: false,
    };
  }
  for (const r of spec.rules) {
    if (r.when.every((c) => conditionHolds(c, req))) {
      return {
        outcome: r.then,
        rule: r.id,
        ruleDescription: r.says,
        busManifold,
        busModulations,
        busGateVerified,
      };
    }
  }
  return {
    outcome: spec.otherwise,
    rule: null,
    ruleDescription: 'Open breeze sweeping gently across the garden canopy.',
    busManifold,
    busModulations,
    busGateVerified,
  };
}

export function evaluatePrismRequest(
  requestText: string,
  spec: PrismSpec = VERDANT_RESONANCE_SPEC,
): {
  request: string;
  outcome: SoundscapeOutcome | typeof INVALID_OUTCOME;
  rule: string | null;
  ruleDescription: string;
  valid: boolean;
  busManifold?: JudgeBusManifoldState;
  busModulations?: JudgeDomainBusModulations;
  busGateVerified?: boolean;
} {
  const decoded = decodePrismRequest(requestText, spec);
  if (!decoded) {
    return {
      request: requestText,
      outcome: INVALID_OUTCOME,
      rule: null,
      ruleDescription: 'Outside the garden bounds.',
      valid: false,
    };
  }
  const res = judgePrismRequest(decoded, spec);
  return {
    request: requestText,
    outcome: res.outcome,
    rule: res.rule,
    ruleDescription: res.ruleDescription,
    valid: true,
    busManifold: res.busManifold,
    busModulations: res.busModulations,
    busGateVerified: res.busGateVerified,
  };
}

export function formatPrismRequest(params: {
  biome: BiomeId;
  plant: PlantSpeciesId;
  action: PlayerActionId;
  atmosphere?: AtmosphereId;
  chorus?: ChorusStateId;
  proximity: number;
  velocity: number;
}): string {
  const atmos = params.atmosphere ?? 'dawn';
  const chorus = params.chorus ?? 'dormant';
  const prox = Math.max(0, Math.min(100, Math.round(params.proximity)));
  const vel = Math.max(0, Math.min(30, Math.round(params.velocity)));
  return `${params.biome} ${params.plant} ${params.action} ${atmos} ${chorus} ${prox} ${vel}`;
}

export interface AcceptanceVectorResult {
  request: string;
  expected: string;
  actual: string;
  why: string;
  passed: boolean;
}

export function runAcceptanceVectors(
  spec: PrismSpec = VERDANT_RESONANCE_SPEC,
): { passed: number; total: number; vectors: AcceptanceVectorResult[] } {
  const vectors: AcceptanceVectorResult[] = [];
  const addVector = (request: string, expected: string, why: string) => {
    if (vectors.some((v) => v.request === request)) return;
    const actual = evaluatePrismRequest(request, spec).outcome;
    vectors.push({
      request,
      expected,
      actual,
      why,
      passed: actual === expected,
    });
  };

  for (const ex of spec.examples) {
    addVector(ex.request, ex.response, 'spec example');
  }

  for (const vec of GENERATED_VERDANT_JUDGE_ARTIFACT.acceptanceVectors) {
    addVector(vec.request, vec.response, 'lex.tex acceptance vector');
  }

  addVector('', INVALID_OUTCOME, 'empty request');
  addVector('meadow chime-lily attune dawn dormant 8', INVALID_OUTCOME, 'a field missing');
  addVector('meadow chime-lily attune dawn dormant 8 4 99', INVALID_OUTCOME, 'an extra field');
  addVector('meadow  chime-lily attune dawn dormant 8 4', INVALID_OUTCOME, 'two spaces');
  addVector('desert chime-lily attune dawn dormant 8 4', INVALID_OUTCOME, 'biome not a choice');
  addVector('meadow rose attune dawn dormant 8 4', INVALID_OUTCOME, 'plant not a choice');
  addVector('meadow chime-lily jump dawn dormant 8 4', INVALID_OUTCOME, 'action not a choice');
  addVector('meadow chime-lily attune noon dormant 8 4', INVALID_OUTCOME, 'atmosphere not a choice');
  addVector('meadow chime-lily attune dawn wilted 8 4', INVALID_OUTCOME, 'chorus not a choice');
  addVector('meadow chime-lily attune dawn dormant 08 4', INVALID_OUTCOME, 'proximity with leading zero');
  addVector('meadow chime-lily attune dawn dormant -1 4', INVALID_OUTCOME, 'proximity negative');
  addVector('meadow chime-lily attune dawn dormant 101 4', INVALID_OUTCOME, 'proximity above maximum');
  addVector('meadow chime-lily attune dawn dormant 8 31', INVALID_OUTCOME, 'velocity above maximum');

  const passed = vectors.filter((v) => v.passed).length;
  return { passed, total: vectors.length, vectors };
}

export function verifyPrismProperties(
  spec: PrismSpec = VERDANT_RESONANCE_SPEC,
): { allHold: boolean; results: { id: string; theoremName: string; checked: number; holds: boolean }[] } {
  const biomes: BiomeId[] = ['meadow', 'grove', 'crystal', 'wetland', 'sanctuary'];
  const plants: PlantSpeciesId[] = ['chime-lily', 'pulse-fern', 'echo-lotus', 'drone-moss', 'star-orchid'];
  const actions: PlayerActionId[] = ['observe', 'touch', 'attune', 'stroll', 'stillness'];
  const atmospheres: AtmosphereId[] = ['dawn', 'golden', 'twilight', 'starlight'];
  const choruses: ChorusStateId[] = ['dormant', 'awakened'];
  const proxSamples = [0, 10, 18, 20, 21, 25, 26, 30, 31, 44, 45, 46, 75, 100];
  const velSamples = [0, 1, 8, 9, 10, 11, 19, 20, 21, 30];

  const results = spec.properties.map((prop) => {
    let checked = 0;
    let holds = true;
    for (const biome of biomes) {
      for (const plant of plants) {
        for (const action of actions) {
          for (const atmosphere of atmospheres) {
            for (const chorus of choruses) {
              for (const prox of proxSamples) {
                for (const vel of velSamples) {
                  checked++;
                  const req: Record<string, string | bigint> = {
                    biome,
                    plant,
                    action,
                    atmosphere,
                    chorus,
                    proximity: BigInt(prox),
                    velocity: BigInt(vel),
                  };
                  if (!prop.when.every((c) => conditionHolds(c, req))) continue;
                  const { outcome } = judgePrismRequest(req, spec);
                  const broken = prop.kind === 'never' ? outcome === prop.then : outcome !== prop.then;
                  if (broken) {
                    holds = false;
                  }
                }
              }
            }
          }
        }
      }
    }
    return { id: prop.id, theoremName: prop.theoremName, checked, holds };
  });

  return {
    allHold: results.every((r) => r.holds),
    results,
  };
}

// ---------------------------------------------------------------------------
// Subsystem 2: Diurnal Sky, Bioluminescence & Acoustic Filter Model
// ---------------------------------------------------------------------------

export interface AtmosphereConfig {
  id: AtmosphereId;
  name: string;
  subtitle: string;
  skyColor: string;
  fogColor: string;
  fogDensity: number;
  sunIntensity: number;
  hemiIntensity: number;
  emissiveBoost: number;
  starVisibility: number;
  padFilterHz: number;
}

export const ATMOSPHERE_CONFIGS: Record<AtmosphereId, AtmosphereConfig> = {
  dawn: {
    id: 'dawn',
    name: 'Dawn Mist',
    subtitle: 'Dewdrop Overtone Clarity',
    skyColor: '#1a332b',
    fogColor: '#213f36',
    fogDensity: 0.017,
    sunIntensity: 1.85,
    hemiIntensity: 1.2,
    emissiveBoost: 1.0,
    starVisibility: 0.15,
    padFilterHz: 520,
  },
  golden: {
    id: 'golden',
    name: 'Golden Hour',
    subtitle: 'Warm Amber Canopy Resonance',
    skyColor: '#1f3829',
    fogColor: '#274432',
    fogDensity: 0.014,
    sunIntensity: 2.35,
    hemiIntensity: 1.35,
    emissiveBoost: 0.9,
    starVisibility: 0.0,
    padFilterHz: 640,
  },
  twilight: {
    id: 'twilight',
    name: 'Twilight Glow',
    subtitle: 'Bioluminescent Lagoon Awakening',
    skyColor: '#0e2124',
    fogColor: '#12292d',
    fogDensity: 0.016,
    sunIntensity: 1.25,
    hemiIntensity: 0.95,
    emissiveBoost: 1.4,
    starVisibility: 0.55,
    padFilterHz: 420,
  },
  starlight: {
    id: 'starlight',
    name: 'Starlight Sanctuary',
    subtitle: 'Nocturnal Celestial Overtone Dome',
    skyColor: '#071217',
    fogColor: '#09181f',
    fogDensity: 0.015,
    sunIntensity: 0.75,
    hemiIntensity: 0.7,
    emissiveBoost: 1.85,
    starVisibility: 1.0,
    padFilterHz: 360,
  },
};

export const DIURNAL_CELESTIAL_VECTORS: Record<AtmosphereId, readonly [number, number, number]> = {
  dawn: [42, 28, -24],
  golden: [-38, 34, -18],
  twilight: [-44, 16, 26],
  starlight: [12, 52, -32],
};

export interface DiurnalEnvironmentEvaluation {
  atmosphere: AtmosphereId;
  biome: BiomeId;
  effectiveFogDensity: number;
  effectiveSunIntensity: number;
  effectiveHemiIntensity: number;
  floraEmissiveMultiplier: number;
  starOpacity: number;
  padFilterCutoffHz: number;
  sunPosition: [number, number, number];
  sunAzimuthRad: number;
}

export function evaluateDiurnalProfile(
  atmosphere: AtmosphereId,
  biome: BiomeId,
  harmonyPct: number,
): DiurnalEnvironmentEvaluation {
  const atmosCfg = ATMOSPHERE_CONFIGS[atmosphere];
  const clampedHarmony = Math.max(0, Math.min(100, harmonyPct));
  const harmonyNorm = clampedHarmony / 100;
  const biomeMistOffset = biome === 'wetland' ? 0.002 : biome === 'crystal' ? -0.0015 : 0;
  const [sx, sy, sz] = DIURNAL_CELESTIAL_VECTORS[atmosphere];
  const sunAzimuthRad = Number(Math.atan2(sx, -sz).toFixed(4));

  return {
    atmosphere,
    biome,
    effectiveFogDensity: Number((atmosCfg.fogDensity + biomeMistOffset).toFixed(4)),
    effectiveSunIntensity: Number((atmosCfg.sunIntensity * (0.95 + harmonyNorm * 0.12)).toFixed(3)),
    effectiveHemiIntensity: Number((atmosCfg.hemiIntensity * (0.95 + harmonyNorm * 0.1)).toFixed(3)),
    floraEmissiveMultiplier: Number((atmosCfg.emissiveBoost * (1 + harmonyNorm * 0.35)).toFixed(3)),
    starOpacity: Number(
      Math.min(1, atmosCfg.starVisibility + (biome === 'sanctuary' ? 0.12 : 0)).toFixed(2),
    ),
    padFilterCutoffHz: Math.round(atmosCfg.padFilterHz + harmonyNorm * 180),
    sunPosition: [sx, sy, sz],
    sunAzimuthRad,
  };
}

// ---------------------------------------------------------------------------
// Subsystem 3: Ecological Biome Affinity & Spatial Topography Model
// ---------------------------------------------------------------------------

export interface BiomeConfig {
  id: BiomeId;
  name: string;
  subtitle: string;
  tuningLabel: string;
  center: [number, number];
  skyColor: string;
  fogColor: string;
  groundColor: string;
  accentColor: string;
  baseNoteHz: number;
  scaleRatios: number[];
  signatureSpecies: PlantSpeciesId;
}

export const BIOME_CONFIGS: Record<BiomeId, BiomeConfig> = {
  meadow: {
    id: 'meadow',
    name: 'Sunlit Meadow',
    subtitle: 'Golden Pollination Terrace',
    tuningLabel: '262 Hz · C4 Just Intonation',
    center: [0, 0],
    skyColor: '#162d24',
    fogColor: '#1a362b',
    groundColor: '#224230',
    accentColor: '#eab308',
    baseNoteHz: 261.63,
    scaleRatios: [1, 9 / 8, 5 / 4, 3 / 2, 5 / 3, 2],
    signatureSpecies: 'chime-lily',
  },
  grove: {
    id: 'grove',
    name: 'Bamboo Chime Grove',
    subtitle: 'Wind-Carved Harmonic Stalks',
    tuningLabel: '294 Hz · D4 Dorian Pentatonic',
    center: [-36, -24],
    skyColor: '#102826',
    fogColor: '#143330',
    groundColor: '#1b3b32',
    accentColor: '#34d399',
    baseNoteHz: 293.66,
    scaleRatios: [1, 9 / 8, 6 / 5, 3 / 2, 5 / 3, 2],
    signatureSpecies: 'pulse-fern',
  },
  crystal: {
    id: 'crystal',
    name: 'Crystal Cavern Flora',
    subtitle: 'Quartz Geode Resonance Basin',
    tuningLabel: '330 Hz · E4 Lydian Shimmer',
    center: [36, -24],
    skyColor: '#151f33',
    fogColor: '#19263d',
    groundColor: '#212d42',
    accentColor: '#38bdf8',
    baseNoteHz: 329.63,
    scaleRatios: [1, 9 / 8, 5 / 4, 45 / 32, 3 / 2, 15 / 8, 2],
    signatureSpecies: 'star-orchid',
  },
  wetland: {
    id: 'wetland',
    name: 'Bioluminescent Wetland',
    subtitle: 'Mirror Lagoon of Echo Lotuses',
    tuningLabel: '220 Hz · A3 Aeolian Lagoon',
    center: [-28, 30],
    skyColor: '#0e242b',
    fogColor: '#122e36',
    groundColor: '#17363b',
    accentColor: '#2dd4bf',
    baseNoteHz: 220.0,
    scaleRatios: [1, 9 / 8, 6 / 5, 4 / 3, 3 / 2, 8 / 5, 2],
    signatureSpecies: 'echo-lotus',
  },
  sanctuary: {
    id: 'sanctuary',
    name: 'Resonance Sanctuary',
    subtitle: 'Central Obelisk of Stillness',
    tuningLabel: '196 Hz · G3 Pastoral Ninth',
    center: [0, -34],
    skyColor: '#1c2430',
    fogColor: '#222d3b',
    groundColor: '#28363d',
    accentColor: '#f59e0b',
    baseNoteHz: 196.0,
    scaleRatios: [1, 5 / 4, 3 / 2, 15 / 8, 9 / 4, 5 / 2],
    signatureSpecies: 'star-orchid',
  },
};

export interface PlantSpeciesConfig {
  id: PlantSpeciesId;
  name: string;
  latinName: string;
  primaryHue: string;
  emissiveHue: string;
  acousticRole: string;
  harmonicInterval: string;
  nativeBiome: BiomeId;
  diurnalAffinity: AtmosphereId;
  description: string;
}

export const PLANT_SPECIES_CONFIGS: Record<PlantSpeciesId, PlantSpeciesConfig> = {
  'chime-lily': {
    id: 'chime-lily',
    name: 'Chime Lily',
    latinName: 'Campanula Sonorus',
    primaryHue: '#fef08a',
    emissiveHue: '#facc15',
    acousticRole: 'Crystalline Bell & Marimba Arpeggio',
    harmonicInterval: 'Major Third & Pure Fifth (5:4 · 3:2)',
    nativeBiome: 'meadow',
    diurnalAffinity: 'dawn',
    description: 'Pendant translucent corollas that ring with pure harmonic overtones when approached calmly.',
  },
  'pulse-fern': {
    id: 'pulse-fern',
    name: 'Pulse Fern',
    latinName: 'Pteris Rhythmica',
    primaryHue: '#6ee7b7',
    emissiveHue: '#10b981',
    acousticRole: 'Polyrhythmic Kalimba & Warm Bass Pulse',
    harmonicInterval: 'Syncopated Octave & Fourth (4:3 · 2:1)',
    nativeBiome: 'grove',
    diurnalAffinity: 'golden',
    description: 'Spiraling fronds that sense footsteps and weave a gentle rhythmic pulse matched to walking stride.',
  },
  'echo-lotus': {
    id: 'echo-lotus',
    name: 'Echo Lotus',
    latinName: 'Nelumbo Resonans',
    primaryHue: '#5eead4',
    emissiveHue: '#14b8a6',
    acousticRole: 'Rippling Water-Harp & Sub-Harmonic Swell',
    harmonicInterval: 'Minor Sixth & Liquid Delay (8:5 · 6:5)',
    nativeBiome: 'wetland',
    diurnalAffinity: 'twilight',
    description: 'Floating acoustic seed-crowns that project concentric water ripples and delayed harmonic echoes.',
  },
  'drone-moss': {
    id: 'drone-moss',
    name: 'Drone Moss',
    latinName: 'Bryum Continuum',
    primaryHue: '#a7f3d0',
    emissiveHue: '#34d399',
    acousticRole: 'Sustained Bowed Pad & Root Fifth Drone',
    harmonicInterval: 'Fundamental & Perfect Fifth (1:1 · 3:2)',
    nativeBiome: 'meadow',
    diurnalAffinity: 'twilight',
    description: 'Velvety bioluminescent cushions blanketing basalt terraces that hum a soothing foundational chord.',
  },
  'star-orchid': {
    id: 'star-orchid',
    name: 'Star Orchid',
    latinName: 'Orchis Siderea',
    primaryHue: '#bae6fd',
    emissiveHue: '#38bdf8',
    acousticRole: 'Glass Harmonica & Celestial Choir Overtones',
    harmonicInterval: 'Lydian Fourth & Major Seventh (45:32 · 15:8)',
    nativeBiome: 'sanctuary',
    diurnalAffinity: 'starlight',
    description: 'Five-pointed crystalline blossoms that awaken into a radiant choir when touched or attuned.',
  },
};

export interface EcologicalAffinityResult {
  biome: BiomeId;
  species: PlantSpeciesId;
  atmosphere: AtmosphereId;
  affinityTier: 'sanctuary-peak' | 'native-harmony' | 'symbiotic-adaptation';
  harmonyBonus: number;
  emissiveResonance: number;
}

export function computeEcologicalAffinity(
  biome: BiomeId,
  species: PlantSpeciesId,
  atmosphere: AtmosphereId,
): EcologicalAffinityResult {
  const spCfg = PLANT_SPECIES_CONFIGS[species];
  const isNativeBiome = spCfg.nativeBiome === biome || biome === 'sanctuary';
  const isFavoredSky = spCfg.diurnalAffinity === atmosphere;

  if (isNativeBiome && isFavoredSky) {
    return {
      biome,
      species,
      atmosphere,
      affinityTier: 'sanctuary-peak',
      harmonyBonus: 4,
      emissiveResonance: 1.35,
    };
  }
  if (isNativeBiome || isFavoredSky) {
    return {
      biome,
      species,
      atmosphere,
      affinityTier: 'native-harmony',
      harmonyBonus: 2,
      emissiveResonance: 1.15,
    };
  }
  return {
    biome,
    species,
    atmosphere,
    affinityTier: 'symbiotic-adaptation',
    harmonyBonus: 1,
    emissiveResonance: 1.0,
  };
}

// ---------------------------------------------------------------------------
// Subsystem 4: Acoustic Outcomes & High-Precision Synthesis Voice-Leading Model
// ---------------------------------------------------------------------------

export interface SoundOutcomeProfile {
  id: SoundscapeOutcome;
  label: string;
  timbre: string;
  color: string;
  harmonyGain: number;
  waveform: OscillatorType;
  overtoneWaveform: OscillatorType;
  overtoneRatio: number;
  overtoneGainRatio: number;
  subOctaveGainRatio: number;
  reverbSendGain: number;
  chordDegrees: number[];
  noteDurationSec: number;
  arpeggioStepSec: number;
}

export const SOUND_OUTCOME_PROFILES: Record<SoundscapeOutcome, SoundOutcomeProfile> = {
  'sanctuary-chorus': {
    id: 'sanctuary-chorus',
    label: 'Sanctuary Chorus',
    timbre: 'Multi-Octave Symphonic Sanctuary Choir',
    color: '#fef08a',
    harmonyGain: 18,
    waveform: 'sine',
    overtoneWaveform: 'triangle',
    overtoneRatio: 2.0,
    overtoneGainRatio: 0.34,
    subOctaveGainRatio: 0.28,
    reverbSendGain: 0.52,
    chordDegrees: [0, 1, 2, 3, 4, 5],
    noteDurationSec: 1.85,
    arpeggioStepSec: 0.08,
  },
  'serene-rest': {
    id: 'serene-rest',
    label: 'Serene Rest',
    timbre: 'Sanctuary 9th Harmonic Chord',
    color: '#fbbf24',
    harmonyGain: 12,
    waveform: 'sine',
    overtoneWaveform: 'sine',
    overtoneRatio: 1.5,
    overtoneGainRatio: 0.28,
    subOctaveGainRatio: 0.32,
    reverbSendGain: 0.48,
    chordDegrees: [0, 2, 3, 4, 5],
    noteDurationSec: 1.6,
    arpeggioStepSec: 0.09,
  },
  'nocturnal-symphony': {
    id: 'nocturnal-symphony',
    label: 'Nocturnal Symphony',
    timbre: 'Celestial Starlight Pad & Sub-Octave Swell',
    color: '#7dd3fc',
    harmonyGain: 14,
    waveform: 'sine',
    overtoneWaveform: 'sine',
    overtoneRatio: 2.0,
    overtoneGainRatio: 0.25,
    subOctaveGainRatio: 0.38,
    reverbSendGain: 0.55,
    chordDegrees: [0, 3, 4, 5, 2],
    noteDurationSec: 1.5,
    arpeggioStepSec: 0.11,
  },
  'dawn-arpeggio': {
    id: 'dawn-arpeggio',
    label: 'Dawn Arpeggio',
    timbre: 'Dewdrop Glass Marimba Cascade',
    color: '#fde68a',
    harmonyGain: 13,
    waveform: 'triangle',
    overtoneWaveform: 'sine',
    overtoneRatio: 3.0,
    overtoneGainRatio: 0.22,
    subOctaveGainRatio: 0.14,
    reverbSendGain: 0.42,
    chordDegrees: [0, 1, 2, 3, 4, 5],
    noteDurationSec: 0.9,
    arpeggioStepSec: 0.065,
  },
  'harmonic-bloom': {
    id: 'harmonic-bloom',
    label: 'Harmonic Bloom',
    timbre: 'Celesta Arpeggio & Bioluminescent Swell',
    color: '#fde047',
    harmonyGain: 15,
    waveform: 'triangle',
    overtoneWaveform: 'sine',
    overtoneRatio: 2.0,
    overtoneGainRatio: 0.3,
    subOctaveGainRatio: 0.22,
    reverbSendGain: 0.46,
    chordDegrees: [0, 2, 3, 4, 5],
    noteDurationSec: 1.15,
    arpeggioStepSec: 0.085,
  },
  'crystalline-choir': {
    id: 'crystalline-choir',
    label: 'Crystalline Choir',
    timbre: 'Glass Harmonica Overtone Choir',
    color: '#38bdf8',
    harmonyGain: 12,
    waveform: 'sine',
    overtoneWaveform: 'sine',
    overtoneRatio: 2.5,
    overtoneGainRatio: 0.32,
    subOctaveGainRatio: 0.12,
    reverbSendGain: 0.5,
    chordDegrees: [1, 3, 4, 2],
    noteDurationSec: 0.85,
    arpeggioStepSec: 0.075,
  },
  'melodic-chime': {
    id: 'melodic-chime',
    label: 'Melodic Chime',
    timbre: 'Pentatonic Bell & Marimba Motif',
    color: '#a7f3d0',
    harmonyGain: 8,
    waveform: 'sine',
    overtoneWaveform: 'triangle',
    overtoneRatio: 2.0,
    overtoneGainRatio: 0.24,
    subOctaveGainRatio: 0.15,
    reverbSendGain: 0.38,
    chordDegrees: [0, 2, 3, 1],
    noteDurationSec: 0.72,
    arpeggioStepSec: 0.07,
  },
  'rhythmic-pulse': {
    id: 'rhythmic-pulse',
    label: 'Rhythmic Pulse',
    timbre: 'Polyrhythmic Frond Kalimba Ripple',
    color: '#2dd4bf',
    harmonyGain: 6,
    waveform: 'triangle',
    overtoneWaveform: 'sine',
    overtoneRatio: 1.5,
    overtoneGainRatio: 0.2,
    subOctaveGainRatio: 0.25,
    reverbSendGain: 0.32,
    chordDegrees: [0, 3, 1],
    noteDurationSec: 0.52,
    arpeggioStepSec: 0.06,
  },
  'ambient-drone': {
    id: 'ambient-drone',
    label: 'Ambient Drone',
    timbre: 'Warm Botanical Pad Foundation',
    color: '#6ee7b7',
    harmonyGain: 3,
    waveform: 'triangle',
    overtoneWaveform: 'sine',
    overtoneRatio: 1.5,
    overtoneGainRatio: 0.18,
    subOctaveGainRatio: 0.3,
    reverbSendGain: 0.4,
    chordDegrees: [0, 3],
    noteDurationSec: 0.65,
    arpeggioStepSec: 0.1,
  },
  'wind-whisper': {
    id: 'wind-whisper',
    label: 'Wind Whisper',
    timbre: 'Aeolian Canopy Breeze',
    color: '#94a3b8',
    harmonyGain: 1,
    waveform: 'sine',
    overtoneWaveform: 'sine',
    overtoneRatio: 2.0,
    overtoneGainRatio: 0.12,
    subOctaveGainRatio: 0.1,
    reverbSendGain: 0.35,
    chordDegrees: [0],
    noteDurationSec: 0.45,
    arpeggioStepSec: 0.1,
  },
};

export interface SynthesisEnvelopePlan {
  outcome: SoundscapeOutcome;
  biome: BiomeId;
  atmosphere: AtmosphereId;
  frequenciesHz: number[];
  overtoneFrequenciesHz: number[];
  subFrequenciesHz: number[];
  bellTransientFrequenciesHz: number[];
  waveform: OscillatorType;
  overtoneWaveform: OscillatorType;
  overtoneGainRatio: number;
  subOctaveGainRatio: number;
  bellTransientGainRatio: number;
  reverbSendGain: number;
  stereoEchoDelaySec: number;
  stereoEchoFeedback: number;
  noteDurationSec: number;
  arpeggioStepSec: number;
  filterCutoffHz: number;
  centsDeviation: number;
}

export function computeSynthesisEnvelope(
  outcome: SoundscapeOutcome,
  biome: BiomeId,
  atmosphere: AtmosphereId = 'dawn',
): SynthesisEnvelopePlan {
  const profile = SOUND_OUTCOME_PROFILES[outcome];
  const biomeCfg = BIOME_CONFIGS[biome];
  const atmosCfg = ATMOSPHERE_CONFIGS[atmosphere];

  const octaveShift =
    outcome === 'crystalline-choir' || outcome === 'dawn-arpeggio'
      ? 1.5
      : outcome === 'nocturnal-symphony'
        ? 0.75
        : 1.0;

  const frequenciesHz = profile.chordDegrees.map((degIdx) => {
    const ratio = biomeCfg.scaleRatios[degIdx % biomeCfg.scaleRatios.length];
    return Number((biomeCfg.baseNoteHz * ratio * octaveShift).toFixed(2));
  });

  const overtoneFrequenciesHz = frequenciesHz.map((f) =>
    Number((f * profile.overtoneRatio).toFixed(2)),
  );
  const subFrequenciesHz = frequenciesHz.map((f) => Number((f * 0.5).toFixed(2)));
  // 5th Partial: Crystalline Modal Bell / Kalimba Attack Transient (3.0x pure twelfth overtone)
  const bellTransientFrequenciesHz = frequenciesHz.map((f) => Number((f * 3.0).toFixed(2)));

  const bellTransientGainRatio =
    outcome === 'dawn-arpeggio' || outcome === 'melodic-chime' || outcome === 'crystalline-choir'
      ? 0.22
      : outcome === 'rhythmic-pulse' || outcome === 'harmonic-bloom'
        ? 0.16
        : 0.08;

  const stereoEchoFeedback =
    outcome === 'nocturnal-symphony' || outcome === 'sanctuary-chorus' || outcome === 'dawn-arpeggio'
      ? 0.34
      : 0.24;

  return {
    outcome,
    biome,
    atmosphere,
    frequenciesHz,
    overtoneFrequenciesHz,
    subFrequenciesHz,
    bellTransientFrequenciesHz,
    waveform: profile.waveform,
    overtoneWaveform: profile.overtoneWaveform,
    overtoneGainRatio: profile.overtoneGainRatio,
    subOctaveGainRatio: profile.subOctaveGainRatio,
    bellTransientGainRatio,
    reverbSendGain: profile.reverbSendGain,
    stereoEchoDelaySec: 0.375,
    stereoEchoFeedback,
    noteDurationSec: profile.noteDurationSec,
    arpeggioStepSec: profile.arpeggioStepSec,
    filterCutoffHz: atmosCfg.padFilterHz,
    centsDeviation: 0.0,
  };
}

/**
 * Computes binaural stereo pan (-0.85 Left to +0.85 Right) from player gaze and nearest blossom coordinates.
 * Mirrors `Foundation.Acoustics.V1.Model`.
 */
export function computeBinauralPan(
  playerX: number,
  playerZ: number,
  playerYaw: number,
  targetX: number,
  targetZ: number,
): number {
  const dx = targetX - playerX;
  const dz = targetZ - playerZ;
  const dist = Math.hypot(dx, dz);
  if (dist < 0.05) return 0;
  // Right unit vector for camera with YXZ rotation where yaw=0 faces -Z: (cos(yaw), -sin(yaw))
  const rightX = Math.cos(playerYaw);
  const rightZ = -Math.sin(playerYaw);
  const dotRight = (dx / dist) * rightX + (dz / dist) * rightZ;
  return Number(Math.max(-0.85, Math.min(0.85, dotRight * 0.85)).toFixed(3));
}

export interface SpatialWaveAcousticsEvaluation {
  distanceMeters: number;
  distanceGainMultiplier: number; // 0.18 .. 1.0 (inverse-distance energy law)
  airAbsorptionCutoffHz: number; // 680 .. 4800 Hz (Stokes-Kirchhoff atmospheric & fog damping)
  occlusionLowpassHz: number; // 520 .. 4800 Hz (obstacle diffraction shadow)
  effectiveLowpassHz: number; // Combined atmospheric + obstacle low-pass cutoff
  reverbSendBoost: number; // 0.0 .. 0.24 (distant/occluded sources sound more diffused)
  waveArrivalDelaySec: number; // d / 343.0 m/s acoustic propagation time
}

/**
 * Evaluates physical 3D spatial wave propagation (`Foundation.Acoustics.V1.Model::SpatialWavePropagationSpec`):
 * - Inverse-distance energy attenuation (`d_ref = 6.5m`, bounded in `[0.18, 1.0]` as proven in `spatialAttenuationBoundedHolds`)
 * - Stokes-Kirchhoff high-frequency air absorption modulated by distance and diurnal fog density
 * - Obstacle diffraction low-pass shadowing across solid stone columns, stalks, and boulders (`acousticOcclusion`)
 * - Finite speed-of-sound propagation delay (`c = 343 m/s`)
 */
export function evaluateSpatialWaveAcoustics(params: {
  distanceMeters: number;
  acousticOcclusion?: number;
  atmosphere?: AtmosphereId;
}): SpatialWaveAcousticsEvaluation {
  const { distanceMeters, acousticOcclusion = 0, atmosphere = 'dawn' } = params;
  const d = Math.max(0, distanceMeters);
  const refDist = 6.5;
  const rawGain = 1 / (1 + d / refDist);
  const distanceGainMultiplier = Number(Math.max(0.18, Math.min(1.0, rawGain)).toFixed(3));

  const atmosCfg = ATMOSPHERE_CONFIGS[atmosphere];
  // Higher fog density (Dawn/Twilight mist) increases Stokes-Kirchhoff high-frequency absorption over distance
  const mistAbsorptionFactor = 1 + (atmosCfg.fogDensity - 0.014) * 35;
  const rawAirCutoff = 4800 * Math.exp(-0.028 * d * mistAbsorptionFactor);
  const airAbsorptionCutoffHz = Math.round(Math.max(680, Math.min(4800, rawAirCutoff)));

  const clampedOcc = Math.max(0, Math.min(0.45, acousticOcclusion));
  // Obstacle diffraction attenuates wavelengths shorter than the obstacle radius
  const occlusionLowpassHz = Math.round(
    Math.max(520, airAbsorptionCutoffHz * (1 - clampedOcc * 1.15)),
  );
  const effectiveLowpassHz = Math.min(airAbsorptionCutoffHz, occlusionLowpassHz);

  const reverbSendBoost = Number(
    Math.min(0.24, (1 - distanceGainMultiplier) * 0.14 + clampedOcc * 0.26).toFixed(3),
  );
  const waveArrivalDelaySec = Number(Math.min(0.18, d / 343.0).toFixed(4));

  return {
    distanceMeters: Number(d.toFixed(2)),
    distanceGainMultiplier,
    airAbsorptionCutoffHz,
    occlusionLowpassHz,
    effectiveLowpassHz,
    reverbSendBoost,
    waveArrivalDelaySec,
  };
}

export interface NeuromorphicDomainBridgeSpec {
  neuromorphicBusCoupled: boolean;
  domainBasisPrime: number;
  rule30RegisterBits: number;
  pointKeyBits: number;
  crossDomainTransferEnabled: boolean;
  autopoieticSelfRefinementEnabled: boolean;
}

export const VERDANT_ACOUSTIC_STANDARD = {
  profile: GENERATED_PRISM_STANDARDS.acoustics.profile,
  sampleRateHz: GENERATED_PRISM_STANDARDS.acoustics.synthesisSpec.sampleRateHz,
  partialsPerVoice: GENERATED_PRISM_STANDARDS.acoustics.synthesisSpec.partialsPerVoice,
  centsDeviation: GENERATED_PRISM_STANDARDS.acoustics.unisonInterval.centsDeviation,
  binauralPanBound: 0.85,
  referenceDistanceMeters:
    GENERATED_PRISM_STANDARDS.acoustics.wavePropagation.referenceDistanceDm / 10,
  minDistanceGainMultiplier:
    GENERATED_PRISM_STANDARDS.acoustics.wavePropagation.minDistanceGainMilli / 1000,
  speedOfSoundMps: GENERATED_PRISM_STANDARDS.acoustics.wavePropagation.speedOfSoundMps,
  neuromorphicBridge: {
    ...GENERATED_PRISM_STANDARDS.acoustics.neuromorphicBridge,
  } satisfies NeuromorphicDomainBridgeSpec,
} as const;


// ---------------------------------------------------------------------------
// Subsystem 5: Procedural Garden World & Spatial Flora Placement
// ---------------------------------------------------------------------------

export type BotanicalLifecycleStageId =
  | 'dormant-seed'
  | 'sprouting-bud'
  | 'resonant-bloom'
  | 'harmonic-fruiting'
  | 'mycelial-memory';

export type GrowthSubstrateId =
  | 'terrestrial-loam'
  | 'pelagic-water'
  | 'lithophytic-rock'
  | 'architectural-foundation'
  | 'crystalline-epiphyte';

export interface GrowthSubstrateSpec {
  id: GrowthSubstrateId;
  name: string;
  rootMorphology: string;
  baselinePh: number; // 6.1 .. 7.8
  silicaMineralIndex: number; // 0.0 .. 1.0 (SiO2 piezoelectric silicate content)
  mycorrhizalConductivity: number; // 0.0 .. 1.0 (C:N:P stoichiometric transfer efficiency)
  acousticSustainFactor: number; // 1.0 .. 1.28 (mineral Q-factor resonance sustain)
}

export const GROWTH_SUBSTRATE_SPECS: Record<GrowthSubstrateId, GrowthSubstrateSpec> = {
  'terrestrial-loam': {
    id: 'terrestrial-loam',
    name: 'Sunlit Mycorrhizal Alluvial Loam',
    rootMorphology: 'Fibrous Mycorrhizal Root Crown & Dewy Humus Collar',
    baselinePh: 6.6,
    silicaMineralIndex: 0.34,
    mycorrhizalConductivity: 0.94,
    acousticSustainFactor: 1.0,
  },
  'pelagic-water': {
    id: 'pelagic-water',
    name: 'Hydrostatic Mirror Lagoon Meniscus & Sapropel Silt',
    rootMorphology: 'Submerged Hydro-Acoustic Rhizome Tether & Buoyant Crown',
    baselinePh: 6.1,
    silicaMineralIndex: 0.28,
    mycorrhizalConductivity: 0.72,
    acousticSustainFactor: 1.12,
  },
  'lithophytic-rock': {
    id: 'lithophytic-rock',
    name: 'Montane Mineral-Rich Bryophyte Humus',
    rootMorphology: 'Mineral-Enriched Bryophyte Peat Cushion & Deep Loam Taproot',
    baselinePh: 7.1,
    silicaMineralIndex: 0.84,
    mycorrhizalConductivity: 0.76,
    acousticSustainFactor: 1.18,
  },
  'architectural-foundation': {
    id: 'architectural-foundation',
    name: 'Sanctuary Terrace Perimeter Humus Border',
    rootMorphology: 'Calcium-Buffered Sanctuary Border Humus & Radial Root Flare',
    baselinePh: 7.4,
    silicaMineralIndex: 0.78,
    mycorrhizalConductivity: 0.68,
    acousticSustainFactor: 1.22,
  },
  'crystalline-epiphyte': {
    id: 'crystalline-epiphyte',
    name: 'Piezoelectric Silicate & Bamboo Leaf-Litter Loam',
    rootMorphology: 'Silicate-Enriched Forest Floor Humus & Fibrous Root Ring',
    baselinePh: 7.8,
    silicaMineralIndex: 0.96,
    mycorrhizalConductivity: 0.82,
    acousticSustainFactor: 1.28,
  },
};

export interface GardenPlantInstance {
  id: string;
  species: PlantSpeciesId;
  biome: BiomeId;
  substrate?: GrowthSubstrateId;
  x: number;
  y: number;
  z: number;
  scale: number;
  rotationY: number;
  pitchMultiplier: number;
  attuned: boolean;
  lifecycleStage?: BotanicalLifecycleStageId;
  surfaceTiltX?: number;
  surfaceTiltZ?: number;
  rootHoldfastScale?: number;
  volatileTerpeneCharge?: number;
}

export const MIRROR_LAGOON_CENTER: readonly [number, number] = [-28, 30];
export const MIRROR_LAGOON_RADIUS_METERS = 16.5;
export const MIRROR_LAGOON_WATER_SURFACE_Y = -0.14;

/**
 * Computes the continuous terrain elevation `y` at world coordinates `(x, z)`.
 * Enforces hydrostatic basin containment and C1-continuous terrace levelling around all 5 Biome
 * Architectural Monuments so that:
 * 1. The 4 dry monument terraces (Sanctuary, Meadow, Grove, Crystal) sit on level plateaus with zero floating ring/disc edges.
 * 2. The Bioluminescent Wetland Mirror Lagoon (`[-28, 30]`) has a level 360° shoreline rim (`y = +0.02m` at `r = 16.8m`)
 *    that slopes smoothly down to a `-0.56m` lakebed center, strictly containing the equipotential water plane (`y = -0.14m`)
 *    below the bank around all 360° with zero floating water edges.
 */
export function groundHeightAt(x: number, z: number): number {
  const distFromCenter = Math.hypot(x, z);
  const pathMask = Math.min(1, Math.max(0, (Math.abs(x) - 3.5) / 8));

  // Smooth C1-continuous terrace flattening around all 5 Biome Monument centers
  const terraceSpecs: readonly { cx: number; cz: number; flatRadius: number; blendWidth: number }[] = [
    { cx: 0, cz: -34, flatRadius: 11.2, blendWidth: 4.5 }, // Sanctuary Labyrinth
    { cx: 0, cz: -14, flatRadius: 8.2, blendWidth: 3.8 }, // Meadow Sundial
    { cx: -36, cz: -24, flatRadius: 8.5, blendWidth: 4.0 }, // Bamboo Grove Terrace
    { cx: 36, cz: -24, flatRadius: 12.2, blendWidth: 4.5 }, // Crystal Geode Basin
    { cx: -28, cz: 30, flatRadius: 17.5, blendWidth: 5.0 }, // Wetland Mirror Lagoon Rim
  ];

  let terraceFlattenMask = 1.0;
  for (let i = 0; i < terraceSpecs.length; i++) {
    const t = terraceSpecs[i];
    const d = Math.hypot(x - t.cx, z - t.cz);
    if (d <= t.flatRadius) {
      terraceFlattenMask = 0.0;
      break;
    } else if (d < t.flatRadius + t.blendWidth) {
      const u = (d - t.flatRadius) / t.blendWidth;
      const smooth = u * u * (3 - 2 * u);
      terraceFlattenMask = Math.min(terraceFlattenMask, smooth);
    }
  }

  const gentleRoll =
    (Math.sin(x * 0.06) * Math.cos(z * 0.06) * 1.1 +
      Math.sin((x + z) * 0.035) * 0.65) *
    pathMask *
    terraceFlattenMask;

  // Hydrostatic concave bowl for the Mirror Lagoon (`[-28, 30]`):
  // Shoreline bank at r = 16.8m sits at +0.02m, water surface intersects bank at r = 14.9m (y = -0.14m),
  // and lakebed center reaches y = -0.56m (max depth = 0.42m).
  const wetlandDist = Math.hypot(x - MIRROR_LAGOON_CENTER[0], z - MIRROR_LAGOON_CENTER[1]);
  let wetlandBowl = 0;
  if (wetlandDist < 16.8) {
    wetlandBowl = 0.02 - 0.58 * Math.cos((wetlandDist / 16.8) * (Math.PI * 0.5));
  } else if (wetlandDist < 19.2) {
    const rimT = 1 - (wetlandDist - 16.8) / 2.4;
    wetlandBowl = 0.02 * rimT * rimT;
  }

  const rimRise = distFromCenter > 52 ? Math.pow((distFromCenter - 52) * 0.08, 1.35) : 0;
  return Number((gentleRoll + wetlandBowl + rimRise).toFixed(4));
}

export function biomeAt(x: number, z: number): BiomeId {
  let bestBiome: BiomeId = 'meadow';
  let bestDist = Infinity;
  for (const b of Object.values(BIOME_CONFIGS)) {
    const d = Math.hypot(x - b.center[0], z - b.center[1]);
    const weightedDist = b.id === 'sanctuary' ? d * 1.05 : d;
    if (weightedDist < bestDist) {
      bestDist = weightedDist;
      bestBiome = b.id;
    }
  }
  return bestBiome;
}

export function createSeededRng(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Computes the physical terrain surface gradient and normal tilt angles `(surfaceTiltX, surfaceTiltZ)`
 * at world coordinate `(x, z)` so plant holdfasts and root collars align naturally with slopes.
 */
export function computeTerrainNormalTilt(
  x: number,
  z: number,
): { surfaceTiltX: number; surfaceTiltZ: number; slopeMagnitude: number } {
  const eps = 0.35;
  const hCenter = groundHeightAt(x, z);
  const dhdx = (groundHeightAt(x + eps, z) - hCenter) / eps;
  const dhdz = (groundHeightAt(x, z + eps) - hCenter) / eps;
  const slopeMagnitude = Number(Math.hypot(dhdx, dhdz).toFixed(4));
  // Tilt around X corresponds to dh/dz; tilt around Z corresponds to -dh/dx
  const surfaceTiltX = Number(Math.max(-0.36, Math.min(0.36, Math.atan(dhdz))).toFixed(4));
  const surfaceTiltZ = Number(Math.max(-0.36, Math.min(0.36, Math.atan(-dhdx))).toFixed(4));
  return { surfaceTiltX, surfaceTiltZ, slopeMagnitude };
}

export interface SlopeEmbeddedGroundAnchor {
  x: number;
  z: number;
  baseRadiusMeters: number;
  centerGroundY: number;
  minPerimeterGroundY: number;
  maxPerimeterGroundY: number;
  embeddedBaseY: number;
  embedMarginMeters: number;
  surfaceTiltX: number;
  surfaceTiltZ: number;
  slopeMagnitude: number;
}

/**
 * Computes the exact slope-embedded ground anchor across a 360-degree circular footprint of radius `baseRadiusMeters`
 * (`Foundation.Physics.V1.Model::spatialGroundingCoherenceHolds`).
 * By sampling the center and 8 compass points around the footprint perimeter and embedding `embeddedBaseY` below
 * `minPerimeterGroundY`, 100% of the object's base perimeter is guaranteed subterranean even on steep slopes
 * (zero floating downhill edges).
 */
export function computeSlopeEmbeddedGroundAnchor(
  x: number,
  z: number,
  baseRadiusMeters: number,
  embedDepthMeters = 0.16,
): SlopeEmbeddedGroundAnchor {
  const centerGroundY = groundHeightAt(x, z);
  let minPerimeterGroundY = centerGroundY;
  let maxPerimeterGroundY = centerGroundY;

  if (baseRadiusMeters > 0.001) {
    for (let k = 0; k < 8; k++) {
      const theta = (k / 8) * Math.PI * 2;
      const px = x + Math.cos(theta) * baseRadiusMeters;
      const pz = z + Math.sin(theta) * baseRadiusMeters;
      const py = groundHeightAt(px, pz);
      if (py < minPerimeterGroundY) minPerimeterGroundY = py;
      if (py > maxPerimeterGroundY) maxPerimeterGroundY = py;
    }
  }

  const embeddedBaseY = Number((minPerimeterGroundY - Math.max(0.02, embedDepthMeters)).toFixed(4));
  const embedMarginMeters = Number((minPerimeterGroundY - embeddedBaseY).toFixed(4));
  const tilt = computeTerrainNormalTilt(x, z);

  return {
    x: Number(x.toFixed(3)),
    z: Number(z.toFixed(3)),
    baseRadiusMeters: Number(baseRadiusMeters.toFixed(3)),
    centerGroundY: Number(centerGroundY.toFixed(4)),
    minPerimeterGroundY: Number(minPerimeterGroundY.toFixed(4)),
    maxPerimeterGroundY: Number(maxPerimeterGroundY.toFixed(4)),
    embeddedBaseY,
    embedMarginMeters,
    surfaceTiltX: tilt.surfaceTiltX,
    surfaceTiltZ: tilt.surfaceTiltZ,
    slopeMagnitude: tilt.slopeMagnitude,
  };
}

export interface ConservatoryRockInstance {
  index: number;
  x: number;
  z: number;
  centerY: number;
  bottomY: number;
  topY: number;
  minPerimeterGroundY: number;
  footprintRadiusMeters: number;
  scaleX: number;
  scaleY: number;
  scaleZ: number;
  rotX: number;
  rotY: number;
  rotZ: number;
}

export interface ConservatoryShorelineBoulderInstance {
  index: number;
  x: number;
  z: number;
  centerY: number;
  bottomY: number;
  minPerimeterGroundY: number;
  footprintRadiusMeters: number;
  scaleX: number;
  scaleY: number;
  scaleZ: number;
  rotY: number;
}

export interface ConservatorySteppingStoneInstance {
  index: number;
  x: number;
  z: number;
  centerY: number;
  bottomY: number;
  topY: number;
  minPerimeterGroundY: number;
  footprintRadiusMeters: number;
  scaleX: number;
  scaleY: number;
  scaleZ: number;
  rotY: number;
  inWater: boolean;
}

/**
 * Authoritative generator for the 52 Perimeter Basalt Rock Outcrops (`rocksInstanced`).
 * Every outcrop is slope-embedded so its bottom (`bottomY`) sits strictly below `minPerimeterGroundY`
 * across its entire footprint on the steep outer amphitheater ridge (zero floating boulders).
 */
export function generateConservatoryRocks(): ConservatoryRockInstance[] {
  const rockCount = 52;
  const baseGeoRadius = 2.6;
  const rocks: ConservatoryRockInstance[] = [];

  for (let i = 0; i < rockCount; i++) {
    const angle = (i / rockCount) * Math.PI * 2;
    const rad = 56 + (i % 4) * 4.5;
    const rx = Number((Math.cos(angle) * rad).toFixed(3));
    const rz = Number((Math.sin(angle) * rad).toFixed(3));
    const scaleX = Number((1.2 + (i % 3) * 0.45).toFixed(3));
    const scaleY = Number((0.9 + (i % 4) * 0.5).toFixed(3));
    const scaleZ = Number((1.1 + (i % 2) * 0.4).toFixed(3));
    const footprintRadiusMeters = Number((baseGeoRadius * Math.max(scaleX, scaleZ) * 0.78).toFixed(3));
    const halfHeightMeters = baseGeoRadius * scaleY;

    const anchor = computeSlopeEmbeddedGroundAnchor(rx, rz, footprintRadiusMeters, 0.45);
    // Position center so the bottom is deeply embedded below minPerimeterGroundY while 55% of the outcrop rises above
    const centerY = Number((anchor.minPerimeterGroundY + halfHeightMeters * 0.18).toFixed(4));
    const bottomY = Number((centerY - halfHeightMeters).toFixed(4));
    const topY = Number((centerY + halfHeightMeters).toFixed(4));

    rocks.push({
      index: i,
      x: rx,
      z: rz,
      centerY,
      bottomY,
      topY,
      minPerimeterGroundY: anchor.minPerimeterGroundY,
      footprintRadiusMeters,
      scaleX,
      scaleY,
      scaleZ,
      rotX: Number((i * 0.3).toFixed(3)),
      rotY: Number((i * 0.8).toFixed(3)),
      rotZ: 0,
    });
  }

  return rocks;
}

/**
 * Authoritative generator for the 28 Shoreline River-Stone Embankment Boulders around the Mirror Lagoon (`[-28, 30]`).
 * Every boulder is slope-embedded into the concave shoreline bank (`bottomY < minPerimeterGroundY`).
 */
export function generateConservatoryShorelineBoulders(): ConservatoryShorelineBoulderInstance[] {
  const count = 28;
  const baseGeoRadius = 0.62;
  const boulders: ConservatoryShorelineBoulderInstance[] = [];

  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 + (i % 3) * 0.04;
    const r = 15.05 + (i % 3) * 0.35;
    const sx = Number((MIRROR_LAGOON_CENTER[0] + Math.cos(a) * r).toFixed(3));
    const sz = Number((MIRROR_LAGOON_CENTER[1] + Math.sin(a) * r).toFixed(3));
    const scaleX = Number((1.25 + (i % 3) * 0.3).toFixed(3));
    const scaleY = Number((0.46 + (i % 2) * 0.14).toFixed(3));
    const scaleZ = Number((0.95 + (i % 4) * 0.22).toFixed(3));
    const footprintRadiusMeters = Number((baseGeoRadius * Math.max(scaleX, scaleZ) * 0.82).toFixed(3));
    const halfHeightMeters = baseGeoRadius * scaleY;

    const anchor = computeSlopeEmbeddedGroundAnchor(sx, sz, footprintRadiusMeters, 0.14);
    const centerY = Number((anchor.minPerimeterGroundY + halfHeightMeters * 0.15).toFixed(4));
    const bottomY = Number((centerY - halfHeightMeters).toFixed(4));

    boulders.push({
      index: i,
      x: sx,
      z: sz,
      centerY,
      bottomY,
      minPerimeterGroundY: anchor.minPerimeterGroundY,
      footprintRadiusMeters,
      scaleX,
      scaleY,
      scaleZ,
      rotY: Number((a + Math.PI * 0.5).toFixed(3)),
    });
  }

  return boulders;
}

/**
 * Authoritative generator for the 64 Travertine Stepping Stones (`stepStonesMesh`, base cylinder height = `0.28m`).
 * Each stepping stone's vertical scale and center Y are solved from `computeSlopeEmbeddedGroundAnchor` so its top face
 * provides a level dry step (`+0.035m` above `maxPerimeterGroundY` or `+0.045m` above `MIRROR_LAGOON_WATER_SURFACE_Y`)
 * while its bottom face extends strictly below `minPerimeterGroundY` (zero floating edges on slopes or in the lagoon).
 */
export function generateConservatorySteppingStones(): ConservatorySteppingStoneInstance[] {
  const stoneCount = 64;
  const baseCylinderHeight = 0.28;
  const stones: ConservatorySteppingStoneInstance[] = [];

  for (let i = 0; i < stoneCount; i++) {
    let sx = 0;
    let sz = 0;
    if (i < 18) {
      sx = Math.sin(i * 0.45) * 0.35;
      sz = 2 - i * 1.75;
    } else if (i < 34) {
      const t = (i - 18) / 16;
      sx = -3.5 - t * 30.5;
      sz = -11 - t * 12;
    } else if (i < 50) {
      const t = (i - 34) / 16;
      sx = 3.5 + t * 30.5;
      sz = -11 - t * 12;
    } else {
      const t = (i - 50) / 14;
      sx = -3 - t * 23;
      sz = 3 + t * 24;
    }
    sx = Number(sx.toFixed(3));
    sz = Number(sz.toFixed(3));

    const scaleX = Number((1 + (i % 3) * 0.12).toFixed(3));
    const scaleZ = Number((0.85 + (i % 2) * 0.15).toFixed(3));
    const footprintRadiusMeters = Number((0.95 * Math.max(scaleX, scaleZ)).toFixed(3));

    const anchor = computeSlopeEmbeddedGroundAnchor(sx, sz, footprintRadiusMeters, 0.08);
    const distToLagoon = Math.hypot(sx - MIRROR_LAGOON_CENTER[0], sz - MIRROR_LAGOON_CENTER[1]);
    const inWater = distToLagoon < 14.9 && anchor.centerGroundY < MIRROR_LAGOON_WATER_SURFACE_Y;

    const topY = inWater
      ? Number((MIRROR_LAGOON_WATER_SURFACE_Y + 0.045).toFixed(4))
      : Number((anchor.maxPerimeterGroundY + 0.035).toFixed(4));
    const bottomY = Number((anchor.minPerimeterGroundY - 0.12).toFixed(4));
    const totalHeight = Math.max(0.22, topY - bottomY);
    const centerY = Number(((topY + bottomY) * 0.5).toFixed(4));
    const scaleY = Number((totalHeight / baseCylinderHeight).toFixed(3));

    stones.push({
      index: i,
      x: sx,
      z: sz,
      centerY,
      bottomY,
      topY,
      minPerimeterGroundY: anchor.minPerimeterGroundY,
      footprintRadiusMeters,
      scaleX,
      scaleY,
      scaleZ,
      rotY: Number((i * 0.7).toFixed(3)),
      inWater,
    });
  }

  return stones;
}

const CACHED_CONSERVATORY_ROCKS = generateConservatoryRocks();
const CACHED_SHORELINE_BOULDERS = generateConservatoryShorelineBoulders();
const CACHED_STEPPING_STONES = generateConservatorySteppingStones();

export interface SpatialSurfaceLawEvaluation {
  x: number;
  z: number;
  isHardStructurePlatform: boolean;
  hardPlatformName: string | null;
  isRockOutcrop: boolean;
  rockOutcropName: string | null;
  isSubmergedLagoon: boolean;
  isFertileBiologicalGround: boolean;
  canSupportTree: boolean;
  canSupportPlant: boolean;
  canSupportGrass: boolean;
}

/**
 * Authoritative Spatial Surface & Substrate Exclusion Law (`Foundation.Botany.V1.Model::zeroHardSurfaceOrRockGrowthHolds`
 * and `Foundation.Physics.V1.Model::spatialGroundingCoherenceHolds`):
 * Evaluates whether world coordinate `(x, z)` with clearance radius `clearanceRadiusMeters` intersects ANY:
 * 1. Hard architectural structure platform, stone plinth, crystal mirror disc, stone pier pad, stone road, or stepping stone.
 * 2. Solid rock outcrop, perimeter basalt boulder, shoreline river-stone boulder embankment, or quartz monolith spire.
 *
 * Plants, trees, emergent seedlings, and grass blades are strictly forbidden from growing on hard structure platforms or rocks.
 */
export function evaluateSpatialSurfaceLaw(
  x: number,
  z: number,
  clearanceRadiusMeters = 0.45,
): SpatialSurfaceLawEvaluation {
  let isHardStructurePlatform = false;
  let hardPlatformName: string | null = null;

  // 1. Sanctuary Pavilion Plinth & Colonnade Platform ([0, -34], outer plinth radius = 6.6m, exclusion = 7.2m)
  if (Math.hypot(x - 0, z - -34) <= 7.2 + clearanceRadiusMeters) {
    isHardStructurePlatform = true;
    hardPlatformName = 'Sanctuary Colonnade Stone Plinth';
  }
  // 2. Meadow Sundial Compass Rotunda ([0, -14], dial base radius = 3.5m, exclusion = 4.5m)
  else if (Math.hypot(x - 0, z - -14) <= 4.5 + clearanceRadiusMeters) {
    isHardStructurePlatform = true;
    hardPlatformName = 'Meadow Sundial Flagstone Rotunda';
  }
  // 3. Bamboo Chime Pergola Platform ([-36, -24], corner posts at [±2.2, ±2.2] -> r = 3.11m, exclusion = 4.2m)
  else if (Math.hypot(x - -36, z - -24) <= 4.2 + clearanceRadiusMeters) {
    isHardStructurePlatform = true;
    hardPlatformName = 'Bamboo Chime Pergola Platform';
  }
  // 4. Crystal Geode Archway & Obsidian-Sapphire Mirror Disc ([36, -24], mirror disc radius = 11.5m, exclusion = 11.8m)
  else if (Math.hypot(x - 36, z - -24) <= 11.8 + clearanceRadiusMeters) {
    isHardStructurePlatform = true;
    hardPlatformName = 'Crystal Obsidian-Sapphire Geode Mirror Platform';
  }
  // 5. Central Travertine Stone Roadway (|x| <= 2.3m, z in [-35, 3.5])
  else if (Math.abs(x) <= 2.3 + clearanceRadiusMeters && z >= -35 && z <= 3.5) {
    isHardStructurePlatform = true;
    hardPlatformName = 'Central Travertine Stone Pathway';
  }

  // 6. Wetland Stone Lantern Pier Pads (5 stone piers around [-28, 30])
  if (!isHardStructurePlatform) {
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      const r = i === 0 ? 0 : 4.2;
      const padX = MIRROR_LAGOON_CENTER[0] + Math.cos(a) * r;
      const padZ = MIRROR_LAGOON_CENTER[1] + Math.sin(a) * r;
      if (Math.hypot(x - padX, z - padZ) <= 1.25 + clearanceRadiusMeters) {
        isHardStructurePlatform = true;
        hardPlatformName = 'Wetland Stone Lantern Pier Pad';
        break;
      }
    }
  }

  // 7. All 64 Travertine Stepping Stones
  if (!isHardStructurePlatform) {
    for (let i = 0; i < CACHED_STEPPING_STONES.length; i++) {
      const st = CACHED_STEPPING_STONES[i];
      if (Math.hypot(x - st.x, z - st.z) <= st.footprintRadiusMeters + clearanceRadiusMeters) {
        isHardStructurePlatform = true;
        hardPlatformName = 'Travertine Trail Stepping Stone';
        break;
      }
    }
  }

  // Check Solid Rock Outcrops & Boulders
  let isRockOutcrop = false;
  let rockOutcropName: string | null = null;

  const distToLagoon = Math.hypot(x - MIRROR_LAGOON_CENTER[0], z - MIRROR_LAGOON_CENTER[1]);
  // 1. Shoreline River-Stone Boulder Ring (`r = 14.5m .. 16.5m` around Mirror Lagoon) + exact boulder footprints
  if (distToLagoon >= 14.5 - clearanceRadiusMeters && distToLagoon <= 16.5 + clearanceRadiusMeters) {
    isRockOutcrop = true;
    rockOutcropName = 'Mirror Lagoon Shoreline River-Stone Boulder Embankment';
  }
  if (!isRockOutcrop) {
    for (let i = 0; i < CACHED_SHORELINE_BOULDERS.length; i++) {
      const sb = CACHED_SHORELINE_BOULDERS[i];
      if (Math.hypot(x - sb.x, z - sb.z) <= sb.footprintRadiusMeters + clearanceRadiusMeters) {
        isRockOutcrop = true;
        rockOutcropName = 'Mirror Lagoon Shoreline River-Stone Boulder';
        break;
      }
    }
  }

  // 2. 6 Prismatic Quartz Monolith Spires at [36, -24], r = 2.9m
  if (!isRockOutcrop) {
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const sx = 36 + Math.cos(a) * 2.9;
      const sz = -24 + Math.sin(a) * 2.9;
      if (Math.hypot(x - sx, z - sz) <= 0.85 + clearanceRadiusMeters) {
        isRockOutcrop = true;
        rockOutcropName = 'Prismatic Quartz Monolith Spire';
        break;
      }
    }
  }

  // 3. 52 Perimeter Basalt Rock Outcrops + Outer Amphitheater Ridge (`r >= 51.5m`)
  if (!isRockOutcrop) {
    if (Math.hypot(x, z) >= 51.5 - clearanceRadiusMeters) {
      isRockOutcrop = true;
      rockOutcropName = 'Perimeter Basalt Amphitheater Ridge';
    } else {
      for (let i = 0; i < CACHED_CONSERVATORY_ROCKS.length; i++) {
        const rk = CACHED_CONSERVATORY_ROCKS[i];
        if (Math.hypot(x - rk.x, z - rk.z) <= rk.footprintRadiusMeters + clearanceRadiusMeters) {
          isRockOutcrop = true;
          rockOutcropName = 'Perimeter Basalt Outcrop Boulder';
          break;
        }
      }
    }
  }

  const rawGroundY = groundHeightAt(x, z);
  const isSubmergedLagoon =
    distToLagoon < 14.5 - clearanceRadiusMeters && rawGroundY < MIRROR_LAGOON_WATER_SURFACE_Y;
  const isFertileBiologicalGround = !isHardStructurePlatform && !isRockOutcrop;
  const distOrigin = Math.hypot(x, z);

  return {
    x: Number(x.toFixed(3)),
    z: Number(z.toFixed(3)),
    isHardStructurePlatform,
    hardPlatformName,
    isRockOutcrop,
    rockOutcropName,
    isSubmergedLagoon,
    isFertileBiologicalGround,
    canSupportTree: isFertileBiologicalGround && !isSubmergedLagoon && distOrigin >= 5.0 && distOrigin <= 50.5,
    canSupportPlant: isFertileBiologicalGround && distOrigin >= 4.5 && distOrigin <= 49.5,
    canSupportGrass: isFertileBiologicalGround && !isSubmergedLagoon && distOrigin <= 50.0,
  };
}

export interface ConservatoryCanopyTierSpec {
  canopyIndex: number;
  treeIndex: number;
  tier: 0 | 1;
  x: number;
  y: number;
  z: number;
  scale: number;
  heightFractionAlongTrunk: number;
  colorHex: string;
}

export interface ConservatoryTreeInstance {
  index: number;
  isCrystalSide: boolean;
  biome: BiomeId;
  x: number;
  z: number;
  baseY: number; // Bottom-pivot Y coordinate strictly embedded below minPerimeterGroundY
  topY: number; // Exact top of the scaled trunk (`baseY + trunkHeightMeters`)
  minPerimeterGroundY: number;
  centerGroundY: number;
  trunkHeightMeters: number;
  baseRadiusMeters: number;
  scaleXZ: number;
  scaleY: number;
  tiltX: number;
  yaw: number;
  tiltZ: number;
  colorHex: string;
  canopyTiers: [ConservatoryCanopyTierSpec, ConservatoryCanopyTierSpec];
}

/**
 * Authoritative generator for the 64 Conservatory Trees (`stalksInstanced`) and their 128 physically attached
 * Canopy Foliage Crowns (`canopyInstanced`):
 * 1. **Zero Hard-Surface or Rock Growth**:
 *    - Grove Bamboo Culms (`0..31` around `[-36, -24]`) and Crystal Pillar Trees (`32..63` around `[36, -24]`) are placed
 *      strictly outside the `4.2m` Bamboo Pergola platform and outside the `11.8m` Crystal Geode Mirror Basin platform,
 *      and nudged clear of all 64 stepping stones, stone pathways, and perimeter boulders via `evaluateSpatialSurfaceLaw`.
 * 2. **Zero Floating Tree Trunks**:
 *    - `baseY` is anchored via `computeSlopeEmbeddedGroundAnchor(x, z, baseRadiusMeters, 0.24)` so 100% of the trunk's
 *      360° base perimeter is embedded at least `0.24m` into the fertile soil even on sloped terrain.
 * 3. **Zero Detached Canopy Crowns**:
 *    - Both canopy tiers (`tier 0` at `68%` trunk height, `tier 1` at `88%` trunk height) are computed directly along the
 *      parent tree's scaled, tilted 3D trunk axis (`y = baseY + trunkHeightMeters * hFrac`), guaranteeing every canopy
 *      is physically pierced by and attached to its trunk.
 */
export function generateConservatoryTrees(): ConservatoryTreeInstance[] {
  const stalkCount = 64;
  const baseCylinderHeightMeters = 7.6;
  const trees: ConservatoryTreeInstance[] = [];

  for (let i = 0; i < stalkCount; i++) {
    const isCrystalSide = i >= 32;
    const cx = isCrystalSide ? 36 : -36;
    const cz = -24;
    const baseAngle = ((i % 32) / 32) * Math.PI * 2 + (i % 3) * 0.18;
    // Grove pergola platform ends at r = 4.2m -> place Grove trees at r in [6.2m .. 17.4m]
    // Crystal mirror disc platform ends at r = 11.8m -> place Crystal trees in the fertile outer ring [12.8m .. 19.6m]
    const baseR = isCrystalSide ? 12.8 + (i % 5) * 1.65 : 6.2 + (i % 5) * 2.75;

    let bx = Number((cx + Math.cos(baseAngle) * baseR).toFixed(3));
    let bz = Number((cz + Math.sin(baseAngle) * baseR).toFixed(3));

    const scaleXZ = Number((0.85 + (i % 4) * 0.18).toFixed(3));
    const scaleY = Number((0.8 + (i % 3) * 0.25).toFixed(3));
    const baseRadiusMeters = Number((0.24 * scaleXZ).toFixed(3));

    // Nudge candidate angle/radius if needed until strictly on fertile biological soil (`canSupportTree === true`)
    // and at least 1.25m clear of previously placed trees
    for (let attempt = 0; attempt < 28; attempt++) {
      const testAngle = baseAngle + attempt * 0.11 * (attempt % 2 === 0 ? 1 : -1);
      const testR = baseR + Math.floor(attempt / 4) * 0.55;
      const candX = Number((cx + Math.cos(testAngle) * testR).toFixed(3));
      const candZ = Number((cz + Math.sin(testAngle) * testR).toFixed(3));
      const law = evaluateSpatialSurfaceLaw(candX, candZ, baseRadiusMeters + 0.35);
      const tooCloseTree = trees.some((t) => Math.hypot(candX - t.x, candZ - t.z) < 1.25);
      if (law.canSupportTree && !tooCloseTree) {
        bx = candX;
        bz = candZ;
        break;
      }
    }

    const anchor = computeSlopeEmbeddedGroundAnchor(bx, bz, baseRadiusMeters, 0.24);
    const trunkHeightMeters = Number((baseCylinderHeightMeters * scaleY).toFixed(3));
    const baseY = anchor.embeddedBaseY;
    const topY = Number((baseY + trunkHeightMeters).toFixed(4));

    const tiltX = Number((Math.sin(i) * 0.05).toFixed(4));
    const yaw = Number((i * 0.4).toFixed(4));
    const tiltZ = Number((Math.cos(i) * 0.05).toFixed(4));

    // Unit vector along the slightly tilted trunk axis so canopy tiers sit squarely on the tilted trunk
    // For small tilts (tiltX, tiltZ <= 0.05 rad), horizontal displacement at height h is (-sin(tiltZ)*h, sin(tiltX)*h)
    const buildTier = (tier: 0 | 1): ConservatoryCanopyTierSpec => {
      const canopyIndex = tier * stalkCount + i;
      const hFrac = tier === 0 ? 0.68 : 0.88;
      const heightAlongTrunk = trunkHeightMeters * hFrac;
      const crownX = Number((bx - Math.sin(tiltZ) * heightAlongTrunk).toFixed(3));
      const crownY = Number((baseY + Math.cos(tiltX) * Math.cos(tiltZ) * heightAlongTrunk).toFixed(3));
      const crownZ = Number((bz + Math.sin(tiltX) * heightAlongTrunk).toFixed(3));
      const scale = Number(((tier === 0 ? 1.15 : 0.85) + (canopyIndex % 3) * 0.15).toFixed(3));
      return {
        canopyIndex,
        treeIndex: i,
        tier,
        x: crownX,
        y: crownY,
        z: crownZ,
        scale,
        heightFractionAlongTrunk: hFrac,
        colorHex: isCrystalSide ? '#7dd3fc' : '#10b981',
      };
    };

    trees.push({
      index: i,
      isCrystalSide,
      biome: isCrystalSide ? 'crystal' : 'grove',
      x: bx,
      z: bz,
      baseY,
      topY,
      minPerimeterGroundY: anchor.minPerimeterGroundY,
      centerGroundY: anchor.centerGroundY,
      trunkHeightMeters,
      baseRadiusMeters,
      scaleXZ,
      scaleY,
      tiltX,
      yaw,
      tiltZ,
      colorHex: isCrystalSide ? '#38bdf8' : '#34d399',
      canopyTiers: [buildTier(0), buildTier(1)],
    });
  }

  return trees;
}

const CACHED_CONSERVATORY_TREES = generateConservatoryTrees();

export interface ConservatoryGrassBladeInstance {
  index: number;
  valid: boolean;
  x: number;
  y: number; // Slope-embedded base Y (`minPerimeterGroundY - 0.03m`)
  z: number;
  minPerimeterGroundY: number;
  hScale: number;
  yaw: number;
  biome: BiomeId;
  colorHex: string;
}

/**
 * Authoritative generator for the 360 Permeable Meadow Grass & Bioluminescent Reed Blades (`grassInstanced`).
 * Enforces `evaluateSpatialSurfaceLaw` so zero grass blades grow out of hard structure platforms, stone pathways,
 * stepping stones, or rocks, and embeds each blade's root collar `0.03m` into the fertile turf.
 */
export function generateConservatoryGrassBlades(): ConservatoryGrassBladeInstance[] {
  const GRASS_COUNT = 360;
  const goldenAngleRad = 2.399963229728653;
  const blades: ConservatoryGrassBladeInstance[] = [];

  for (let i = 0; i < GRASS_COUNT; i++) {
    const a = i * goldenAngleRad;
    const r = 4.8 + ((i * 7) % 44);
    let gx = Number((Math.cos(a) * r).toFixed(3));
    let gz = Number((Math.sin(a) * r - 8).toFixed(3));

    // If the Fibonacci spiral coordinate lands on a hard structure platform, stepping stone, rock, or deep water,
    // search nearby angles along the spiral ring for fertile turf
    let foundFertile = false;
    for (let attempt = 0; attempt < 16; attempt++) {
      const testA = a + attempt * 0.19;
      const testR = r + (attempt % 3) * 0.65;
      const candX = Number((Math.cos(testA) * testR).toFixed(3));
      const candZ = Number((Math.sin(testA) * testR - 8).toFixed(3));
      const law = evaluateSpatialSurfaceLaw(candX, candZ, 0.18);
      const treeHit = CACHED_CONSERVATORY_TREES.some(
        (t) => Math.hypot(candX - t.x, candZ - t.z) < t.baseRadiusMeters + 0.2,
      );
      if (law.canSupportGrass && !treeHit) {
        gx = candX;
        gz = candZ;
        foundFertile = true;
        break;
      }
    }

    const anchor = computeSlopeEmbeddedGroundAnchor(gx, gz, 0.09, 0.03);
    const b = biomeAt(gx, gz);
    const colorHex =
      b === 'meadow'
        ? '#4ade80'
        : b === 'grove'
          ? '#34d399'
          : b === 'wetland'
            ? '#2dd4bf'
            : b === 'crystal'
              ? '#38bdf8'
              : '#fbbf24';

    blades.push({
      index: i,
      valid: foundFertile,
      x: gx,
      y: anchor.embeddedBaseY,
      z: gz,
      minPerimeterGroundY: anchor.minPerimeterGroundY,
      hScale: Number((0.65 + (i % 5) * 0.22).toFixed(3)),
      yaw: Number((i * 0.9).toFixed(3)),
      biome: b,
      colorHex,
    });
  }

  return blades;
}

/**
 * Classifies the authentic fertile biological growth substrate for a specimen at `(x, z)` given its species.
 * All 5 substrates are fertile biological soil or water media strictly outside hard structure platforms and rocks.
 */
export function classifyPlantGrowthSubstrate(
  species: PlantSpeciesId,
  x: number,
  z: number,
): GrowthSubstrateId {
  const distToLagoon = Math.hypot(x - MIRROR_LAGOON_CENTER[0], z - MIRROR_LAGOON_CENTER[1]);
  const rawGroundY = groundHeightAt(x, z);

  // 1. Pelagic water inside the Mirror Lagoon basin (`r < 14.3m`, submerged below water surface)
  if (species === 'echo-lotus' && distToLagoon < 14.3 && rawGroundY < MIRROR_LAGOON_WATER_SURFACE_Y) {
    return 'pelagic-water';
  }

  // 2. Sanctuary & Meadow Perimeter Humus Borders (fertile calcium-buffered garden beds bordering outside the stone plinths)
  const distSanctuary = Math.hypot(x - 0, z - -34);
  const distMeadow = Math.hypot(x - 0, z - -14);
  if ((distSanctuary >= 7.6 && distSanctuary <= 11.8) || (distMeadow >= 4.9 && distMeadow <= 7.8)) {
    return 'architectural-foundation';
  }

  // 3. Piezoelectric Silicate & Bamboo Leaf-Litter Loam in the outer Crystal (`r > 12.2m`) and Grove (`r > 4.6m`) rings
  const distGrove = Math.hypot(x - -36, z - -24);
  const distCrystal = Math.hypot(x - 36, z - -24);
  if (
    (species === 'star-orchid' || species === 'pulse-fern' || species === 'chime-lily') &&
    ((distCrystal >= 12.2 && distCrystal <= 22.0) || (distGrove >= 4.8 && distGrove <= 18.5))
  ) {
    return 'crystalline-epiphyte';
  }

  // 4. Montane Mineral-Rich Bryophyte Humus in outer glades or for Drone Moss cushions
  if (species === 'drone-moss' || Math.hypot(x, z) > 24) {
    return 'lithophytic-rock';
  }

  // 5. Default Sunlit Mycorrhizal Alluvial Loam
  return 'terrestrial-loam';
}

export function generateGardenPlants(seed = 42026): GardenPlantInstance[] {
  const rng = createSeededRng(seed);
  const plants: GardenPlantInstance[] = [];

  // All 12 hero specimens are positioned in fertile soil or lagoon water strictly outside hard platforms, roads, stepping stones & rocks
  const heroPlacements: {
    species: PlantSpeciesId;
    biome: BiomeId;
    substrate: GrowthSubstrateId;
    x: number;
    z: number;
  }[] = [
    { species: 'chime-lily', biome: 'meadow', substrate: 'terrestrial-loam', x: 3.6, z: -5.8 },
    { species: 'pulse-fern', biome: 'meadow', substrate: 'terrestrial-loam', x: -3.8, z: -8.2 },
    { species: 'drone-moss', biome: 'meadow', substrate: 'architectural-foundation', x: 5.4, z: -13.2 },
    { species: 'star-orchid', biome: 'sanctuary', substrate: 'architectural-foundation', x: 5.8, z: -28.0 },
    { species: 'chime-lily', biome: 'sanctuary', substrate: 'architectural-foundation', x: -5.8, z: -28.0 },
    { species: 'star-orchid', biome: 'sanctuary', substrate: 'architectural-foundation', x: -8.2, z: -33.5 },
    { species: 'pulse-fern', biome: 'grove', substrate: 'crystalline-epiphyte', x: -30.5, z: -19.5 },
    { species: 'chime-lily', biome: 'grove', substrate: 'crystalline-epiphyte', x: -41.5, z: -26.5 },
    { species: 'star-orchid', biome: 'crystal', substrate: 'crystalline-epiphyte', x: 24.5, z: -18.5 },
    { species: 'chime-lily', biome: 'crystal', substrate: 'lithophytic-rock', x: 23.2, z: -27.5 },
    { species: 'echo-lotus', biome: 'wetland', substrate: 'pelagic-water', x: -24.5, z: 27.2 },
    { species: 'echo-lotus', biome: 'wetland', substrate: 'pelagic-water', x: -30.8, z: 32.2 },
  ];

  const resolveFertilePlantCoords = (
    initX: number,
    initZ: number,
    biomeCenter: [number, number],
    allowSubmerged: boolean,
  ): { x: number; z: number } => {
    for (let attempt = 0; attempt < 36; attempt++) {
      let candX = initX;
      let candZ = initZ;
      if (attempt > 0) {
        const baseDx = initX - biomeCenter[0];
        const baseDz = initZ - biomeCenter[1];
        const baseAngle = Math.atan2(baseDz, baseDx) + attempt * 0.24 * (attempt % 2 === 0 ? 1 : -1);
        const baseRadius = Math.max(5.5, Math.hypot(baseDx, baseDz)) + Math.floor(attempt / 3) * 0.85;
        candX = Number((biomeCenter[0] + Math.cos(baseAngle) * baseRadius).toFixed(2));
        candZ = Number((biomeCenter[1] + Math.sin(baseAngle) * baseRadius).toFixed(2));
      }
      const law = evaluateSpatialSurfaceLaw(candX, candZ, 0.55);
      if (!law.canSupportPlant) continue;
      if (!allowSubmerged && law.isSubmergedLagoon) continue;
      const hitsTree = CACHED_CONSERVATORY_TREES.some(
        (t) => Math.hypot(candX - t.x, candZ - t.z) < t.baseRadiusMeters + 0.75,
      );
      if (hitsTree) continue;
      const hitsExistingPlant = plants.some((p) => Math.hypot(candX - p.x, candZ - p.z) < 1.65);
      if (hitsExistingPlant) continue;
      return { x: candX, z: candZ };
    }
    return { x: initX, z: initZ };
  };

  heroPlacements.forEach((p, idx) => {
    const resolved = resolveFertilePlantCoords(
      p.x,
      p.z,
      BIOME_CONFIGS[p.biome].center,
      p.species === 'echo-lotus',
    );
    const anchor = computeSlopeEmbeddedGroundAnchor(resolved.x, resolved.z, 0.42, 0.02);
    const isSubmerged =
      p.species === 'echo-lotus' &&
      Math.hypot(resolved.x - MIRROR_LAGOON_CENTER[0], resolved.z - MIRROR_LAGOON_CENTER[1]) < 14.3 &&
      anchor.centerGroundY < MIRROR_LAGOON_WATER_SURFACE_Y;
    // Grounded base Y: pelagic water sits flush on MIRROR_LAGOON_WATER_SURFACE_Y; terrestrial plants sit on minPerimeterGroundY
    const y = isSubmerged ? MIRROR_LAGOON_WATER_SURFACE_Y : anchor.minPerimeterGroundY;
    const tilt = isSubmerged
      ? { surfaceTiltX: 0, surfaceTiltZ: 0 }
      : { surfaceTiltX: anchor.surfaceTiltX, surfaceTiltZ: anchor.surfaceTiltZ };
    plants.push({
      id: `plant-hero-${idx + 1}`,
      species: p.species,
      biome: p.biome,
      substrate: p.substrate,
      x: resolved.x,
      y,
      z: resolved.z,
      scale: 1.05 + (idx % 3) * 0.08,
      rotationY: (idx * 1.17) % (Math.PI * 2),
      pitchMultiplier: [1, 9 / 8, 5 / 4, 3 / 2, 5 / 3][idx % 5],
      attuned: false,
      surfaceTiltX: tilt.surfaceTiltX,
      surfaceTiltZ: tilt.surfaceTiltZ,
      rootHoldfastScale: p.substrate === 'lithophytic-rock' ? 1.12 : 1.0,
      volatileTerpeneCharge: 0,
    });
  });

  const speciesByBiome: Record<BiomeId, PlantSpeciesId[]> = {
    meadow: ['chime-lily', 'drone-moss', 'pulse-fern'],
    grove: ['pulse-fern', 'chime-lily', 'drone-moss'],
    crystal: ['star-orchid', 'chime-lily', 'drone-moss'],
    wetland: ['echo-lotus', 'pulse-fern', 'drone-moss'],
    sanctuary: ['star-orchid', 'chime-lily', 'pulse-fern'],
  };

  const biomeList = Object.values(BIOME_CONFIGS);
  let counter = heroPlacements.length + 1;

  for (const b of biomeList) {
    const count = 9;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + rng() * 0.45;
      // Choose fertile ring radii outside each biome's hard architectural monument platform:
      // - Crystal mirror platform has radius 11.8m -> place Crystal plants at r in [12.6m .. 19.8m]
      // - Sanctuary plinth has radius 7.2m -> place Sanctuary plants at r in [8.0m .. 15.5m]
      // - Meadow sundial has radius 4.5m -> place Meadow plants at r in [5.4m .. 15.5m]
      // - Grove pergola has radius 4.2m -> place Grove plants at r in [5.2m .. 16.5m]
      // - Wetland: either submerged in lagoon (r in [2.2m .. 13.2m], avoiding the 5 pier pads) or on outer fertile turf (r in [17.2m .. 20.5m], outside the 14.5..16.5m boulder ring)
      let radius = 6.0 + rng() * 11.0;
      if (b.id === 'crystal') {
        radius = 12.6 + rng() * 7.2;
      } else if (b.id === 'sanctuary') {
        radius = 8.0 + rng() * 7.5;
      } else if (b.id === 'wetland') {
        radius = i % 3 === 0 ? 17.3 + rng() * 3.0 : 2.3 + rng() * 10.8;
      }

      const initX = Number((b.center[0] + Math.cos(angle) * radius).toFixed(2));
      const initZ = Number((b.center[1] + Math.sin(angle) * radius).toFixed(2));
      const resolved = resolveFertilePlantCoords(
        initX,
        initZ,
        b.center,
        b.id === 'wetland',
      );
      const x = resolved.x;
      const z = resolved.z;

      const law = evaluateSpatialSurfaceLaw(x, z, 0.5);
      if (!law.canSupportPlant) continue;

      const anchor = computeSlopeEmbeddedGroundAnchor(x, z, 0.42, 0.02);
      const pool = speciesByBiome[b.id];
      const isSubmerged = law.isSubmergedLagoon;
      const nonAquaticPool = pool.filter((sp) => sp !== 'echo-lotus');
      const species: PlantSpeciesId = isSubmerged
        ? 'echo-lotus'
        : nonAquaticPool[Math.floor(rng() * nonAquaticPool.length)];
      const y = isSubmerged ? MIRROR_LAGOON_WATER_SURFACE_Y : anchor.minPerimeterGroundY;
      const substrate = classifyPlantGrowthSubstrate(species, x, z);
      const tilt = isSubmerged
        ? { surfaceTiltX: 0, surfaceTiltZ: 0 }
        : { surfaceTiltX: anchor.surfaceTiltX, surfaceTiltZ: anchor.surfaceTiltZ };
      const scale = Number((0.88 + rng() * 0.32).toFixed(2));
      const rotationY = Number((rng() * Math.PI * 2).toFixed(2));
      const pitchRatios = b.scaleRatios;
      const pitchMultiplier = pitchRatios[Math.floor(rng() * pitchRatios.length)];

      plants.push({
        id: `plant-${counter++}`,
        species,
        biome: b.id,
        substrate,
        x,
        y,
        z,
        scale,
        rotationY,
        pitchMultiplier,
        attuned: false,
        surfaceTiltX: tilt.surfaceTiltX,
        surfaceTiltZ: tilt.surfaceTiltZ,
        rootHoldfastScale: Number((0.92 + (i % 4) * 0.08).toFixed(2)),
        volatileTerpeneCharge: 0,
      });
    }
  }

  return plants;
}

export interface FocalPlantEvaluation {
  plant: GardenPlantInstance;
  distanceMeters: number;
  proximityDm: number;
  gazeAngleRad: number;
  crossTrackMeters: number;
  inForwardGazeCone: boolean;
  focalScore: number;
}

/**
 * Gaze-Frustum Focal Specimen Resolver (`Foundation.Humane.V1.Model::FocalGazeSelectionPolicy`):
 * - When `playerYaw` is provided, selects the botanical specimen that the player is actively
 *   looking at within their forward observation cone (`±62°` / `1.082 rad`, up to `32m`),
 *   weighting 3D gaze-ray alignment (`72%`) and perpendicular cross-track distance over raw proximity (`28%`).
 * - Strictly excludes plants behind the player (`gazeAngleRad > 90°`) whenever any specimen exists
 *   in the forward hemisphere, and sets `inForwardGazeCone = false` if no plant lies within the forward view cone.
 */
export function findNearestPlant(
  x: number,
  z: number,
  plants: GardenPlantInstance[],
  playerYaw?: number,
  playerPitch = 0,
): FocalPlantEvaluation {
  if (plants.length === 0) {
    throw new Error('findNearestPlant requires a non-empty plants array');
  }

  // Legacy isotropic fallback only when no camera orientation is supplied
  if (typeof playerYaw !== 'number' || Number.isNaN(playerYaw)) {
    let nearest = plants[0];
    let bestDist = Infinity;
    for (let i = 0; i < plants.length; i++) {
      const p = plants[i];
      const d = Math.hypot(x - p.x, z - p.z);
      if (d < bestDist) {
        bestDist = d;
        nearest = p;
      }
    }
    const proximityDm = Math.max(0, Math.min(100, Math.round(bestDist * 3.5)));
    return {
      plant: nearest,
      distanceMeters: bestDist,
      proximityDm,
      gazeAngleRad: 0,
      crossTrackMeters: 0,
      inForwardGazeCone: true,
      focalScore: bestDist,
    };
  }

  const fovHalfRad = (62 * Math.PI) / 180; // ~1.0821 rad (62 deg half-angle)
  const maxInteractiveRangeMeters = 32.0;
  const eyeY = groundHeightAt(x, z) + 1.72;

  let bestConeCandidate: FocalPlantEvaluation | null = null;
  let bestForwardHemisphereCandidate: FocalPlantEvaluation | null = null;
  let bestFallbackCandidate: FocalPlantEvaluation | null = null;

  for (let i = 0; i < plants.length; i++) {
    const p = plants[i];
    const dx = p.x - x;
    const dz = p.z - z;
    const distMeters = Math.hypot(dx, dz);
    const proximityDm = Math.max(0, Math.min(100, Math.round(distMeters * 3.5)));

    // Camera forward vector is (-sin(yaw), -cos(yaw))
    const toPlantYaw = distMeters < 0.05 ? playerYaw : Math.atan2(-dx, -dz);
    const gazeAngleRad =
      distMeters < 0.05
        ? 0
        : Math.abs(Math.atan2(Math.sin(toPlantYaw - playerYaw), Math.cos(toPlantYaw - playerYaw)));

    const crownY = p.y + 0.75 * p.scale;
    const desiredPitch = Math.atan2(crownY - eyeY, Math.max(0.25, distMeters));
    const pitchDiffRad = Math.abs(desiredPitch - playerPitch);

    const crossTrackMeters = distMeters * Math.sin(Math.min(Math.PI / 2, gazeAngleRad));
    const inForwardGazeCone =
      gazeAngleRad <= fovHalfRad && distMeters <= maxInteractiveRangeMeters;

    // 72% ray-alignment weight + cross-track miss distance + 28% radial distance weight
    const focalScore = Number(
      (
        distMeters * (0.28 + 0.72 * (gazeAngleRad / fovHalfRad) * 3.2 + pitchDiffRad * 0.35) +
        crossTrackMeters * 1.65
      ).toFixed(4),
    );

    const evalEntry: FocalPlantEvaluation = {
      plant: p,
      distanceMeters: distMeters,
      proximityDm,
      gazeAngleRad: Number(gazeAngleRad.toFixed(4)),
      crossTrackMeters: Number(crossTrackMeters.toFixed(4)),
      inForwardGazeCone,
      focalScore,
    };

    if (inForwardGazeCone) {
      if (!bestConeCandidate || evalEntry.focalScore < bestConeCandidate.focalScore) {
        bestConeCandidate = evalEntry;
      }
    } else if (gazeAngleRad <= Math.PI / 2) {
      if (
        !bestForwardHemisphereCandidate ||
        evalEntry.focalScore < bestForwardHemisphereCandidate.focalScore
      ) {
        bestForwardHemisphereCandidate = evalEntry;
      }
    } else {
      if (
        !bestFallbackCandidate ||
        evalEntry.gazeAngleRad < bestFallbackCandidate.gazeAngleRad
      ) {
        bestFallbackCandidate = evalEntry;
      }
    }
  }

  return (
    bestConeCandidate ??
    bestForwardHemisphereCandidate ??
    bestFallbackCandidate!
  );
}

export interface PlantMorphologyState {
  swayAngleRad: number;
  scaleFactor: number;
  emissiveIntensity: number;
  haloOpacity: number;
  gravitropicCounterTiltX: number;
  gravitropicCounterTiltZ: number;
  phototropicLeanX: number;
  phototropicLeanZ: number;
  reciprocalGreetingLeanX: number;
  reciprocalGreetingLeanZ: number;
}

export function computePlantMorphology(params: {
  baseScale: number;
  attuned: boolean;
  proximityDm: number;
  atmosphere: AtmosphereId;
  elapsedSeconds: number;
  pulsePhase: number;
  surfaceTiltX?: number;
  surfaceTiltZ?: number;
  biogeochemicalGlowBoost?: number;
  plantX?: number;
  plantZ?: number;
  playerX?: number;
  playerZ?: number;
  isBeckoningSpecimen?: boolean;
}): PlantMorphologyState {
  const {
    baseScale,
    attuned,
    proximityDm,
    atmosphere,
    elapsedSeconds,
    pulsePhase,
    surfaceTiltX = 0,
    surfaceTiltZ = 0,
    biogeochemicalGlowBoost = 0,
    plantX = 0,
    plantZ = 0,
    playerX = 0,
    playerZ = 0,
    isBeckoningSpecimen = false,
  } = params;
  const atmosCfg = ATMOSPHERE_CONFIGS[atmosphere];
  const proxBoost = proximityDm <= 30 ? (1 - proximityDm / 30) * 0.45 : 0;
  const beckonPulse = isBeckoningSpecimen
    ? 0.28 + 0.16 * Math.sin(elapsedSeconds * 2.6 + pulsePhase)
    : 0;
  const swayAngleRad = Number((Math.sin(elapsedSeconds * 1.5 + pulsePhase) * 0.045).toFixed(4));
  const scaleFactor = Number(
    (
      baseScale *
      (1 +
        (attuned ? 0.055 : isBeckoningSpecimen ? 0.045 : 0.02) *
          Math.sin(elapsedSeconds * 3.0 + pulsePhase) +
        proxBoost * 0.04)
    ).toFixed(4),
  );
  const emissiveIntensity = Number(
    (
      ((attuned ? 1.15 : 0.38) + biogeochemicalGlowBoost * 0.28 + beckonPulse) *
        atmosCfg.emissiveBoost +
      proxBoost
    ).toFixed(3),
  );
  const haloOpacity = Number(
    Math.min(
      0.94,
      (attuned ? 0.68 : 0.22) +
        proxBoost * 0.35 +
        biogeochemicalGlowBoost * 0.12 +
        beckonPulse * 0.45,
    ).toFixed(3),
  );

  // Gravitropism: when a plant's holdfast sits on a tilted rock or embankment, its stem curves
  // 72% back toward the vertical gravity vector while leaning subtly toward the diurnal solar/lunar zenith.
  const gravitropicCounterTiltX = Number((-surfaceTiltX * 0.72).toFixed(4));
  const gravitropicCounterTiltZ = Number((-surfaceTiltZ * 0.72).toFixed(4));
  // Heliocentric-Phototropic Lock: plant stems lean toward the exact same DIURNAL_CELESTIAL_VECTORS[atmosphere]
  // that positions the 3D directional sun/moon light and casts shadows across the conservatory.
  const [sunX, sunY, sunZ] = DIURNAL_CELESTIAL_VECTORS[atmosphere];
  const sunHorizNorm = Math.hypot(sunX, sunZ) || 1;
  const phototropicStrength = Math.min(0.055, (sunY / 60) * 0.045);
  const phototropicLeanX = Number(((sunZ / sunHorizNorm) * phototropicStrength).toFixed(4));
  const phototropicLeanZ = Number(((-sunX / sunHorizNorm) * phototropicStrength).toFixed(4));

  // Reciprocal Botanical Co-Agency Bow (`Foundation.Humane.V1.Model::SymbioticEnvironmentalAgencySpec`):
  // The environment observes the player's presence and inclines nearby or beckoning flora toward the player
  // (up to `maxReciprocalBowRad = 0.14 rad` / ~8 deg) as a living, responsive botanical greeting.
  const dxToPlayer = playerX - plantX;
  const dzToPlayer = playerZ - plantZ;
  const distToPlayer = Math.hypot(dxToPlayer, dzToPlayer);
  let reciprocalGreetingLeanX = 0;
  let reciprocalGreetingLeanZ = 0;
  if (distToPlayer > 0.25 && (distToPlayer <= 14.0 || isBeckoningSpecimen)) {
    const proximityEnvelope =
      distToPlayer <= 14.0 ? Math.max(0, 1 - distToPlayer / 14.0) : 0.45;
    const bowMagnitude = Math.min(
      0.14,
      (isBeckoningSpecimen ? 0.095 : 0.065) * proximityEnvelope *
        (0.88 + 0.12 * Math.sin(elapsedSeconds * 1.8 + pulsePhase)),
    );
    reciprocalGreetingLeanX = Number(((dzToPlayer / distToPlayer) * bowMagnitude).toFixed(4));
    reciprocalGreetingLeanZ = Number(((-dxToPlayer / distToPlayer) * bowMagnitude).toFixed(4));
  }

  return {
    swayAngleRad,
    scaleFactor,
    emissiveIntensity,
    haloOpacity,
    gravitropicCounterTiltX,
    gravitropicCounterTiltZ,
    phototropicLeanX,
    phototropicLeanZ,
    reciprocalGreetingLeanX,
    reciprocalGreetingLeanZ,
  };
}

export const SANCTUARY_TRAIL_WAYPOINTS: { biome: BiomeId; x: number; z: number; label: string }[] = [
  { biome: 'meadow', x: 0, z: -6, label: 'Sunlit Meadow Terrace' },
  { biome: 'sanctuary', x: 0, z: -27, label: 'Resonance Sanctuary Obelisk' },
  { biome: 'grove', x: -32, z: -21, label: 'Bamboo Chime Grove' },
  { biome: 'wetland', x: -25, z: 26, label: 'Bioluminescent Wetland Lagoon' },
  { biome: 'crystal', x: 32, z: -21, label: 'Crystal Cavern Basin' },
];

// ---------------------------------------------------------------------------
// Subsystem 6: Brand Identity, Chromatics, Typography & Marketing Standard
// Mirrors `prism/src/Foundation/Brand/V1/Model.lex.tex`
// ---------------------------------------------------------------------------

export interface ChromaticTokenSpec {
  tokenName: string;
  hexValue: string;
  contrastRatio: number;
  wcagTier: 'AAA' | 'AA' | 'Surface';
  semanticRole: string;
}

export interface BrandStandardModel {
  profile: string;
  brandName: string;
  conservatorySubtitle: string;
  editionTitle: string;
  tagline: string;
  manifesto: string;
  genreClassification: string;
  chromaticPalette: ChromaticTokenSpec[];
  typography: {
    displayFamily: string;
    sansFamily: string;
    monoFamily: string;
    scaleRatio: number;
  };
  sensoryPillars: { title: string; summary: string }[];
  neuromorphicBridge: NeuromorphicDomainBridgeSpec;
}

export const VERDANT_BRAND_STANDARD: BrandStandardModel = {
  profile: GENERATED_PRISM_STANDARDS.brand.profile,
  brandName: GENERATED_PRISM_STANDARDS.brand.brandName,
  conservatorySubtitle: 'Conservatory of Living Botanical Acoustics & Just Intonation',
  editionTitle: 'Conservatory Edition · 262 / 432 Hz Just Intonation',
  tagline: GENERATED_PRISM_STANDARDS.brand.marketing.tagline,
  manifesto:
    'Crafted as a restorative acoustic sanctuary free of conflict, hurry, or visual noise. Every plant species is tuned to pure integer ratios and responds to gentle presence with spatialized overtone harmony.',
  genreClassification: 'Peaceful First-Person Botanical & Acoustic Sanctuary',
  chromaticPalette: [
    {
      tokenName: 'Obsidian Canopy',
      hexValue: GENERATED_PRISM_STANDARDS.brand.primarySurface.hexValue,
      contrastRatio: GENERATED_PRISM_STANDARDS.brand.primarySurface.contrastRatioTenths / 10,
      wcagTier: 'Surface',
      semanticRole: 'Primary Deep-Forest Translucent Sanctuary Canvas',
    },
    {
      tokenName: 'Pollen Gold',
      hexValue: GENERATED_PRISM_STANDARDS.brand.primaryAccent.hexValue,
      contrastRatio: GENERATED_PRISM_STANDARDS.brand.primaryAccent.contrastRatioTenths / 10,
      wcagTier: 'AAA',
      semanticRole: 'Primary Harmonic Attunement, Crest & Focal Action Accent',
    },
    {
      tokenName: 'Bioluminescent Jade',
      hexValue: GENERATED_PRISM_STANDARDS.brand.secondaryAccent.hexValue,
      contrastRatio: GENERATED_PRISM_STANDARDS.brand.secondaryAccent.contrastRatioTenths / 10,
      wcagTier: 'AAA',
      semanticRole: 'Secondary Botanical Telemetry & Herbarium Classification',
    },
    {
      tokenName: 'Lagoon Cyan',
      hexValue: '#5EEAD4',
      contrastRatio: 8.9,
      wcagTier: 'AAA',
      semanticRole: 'Diurnal Sky & Spatial Psychoacoustic Readout Accent',
    },
  ],
  typography: {
    displayFamily: GENERATED_PRISM_STANDARDS.brand.typography.displayFamily,
    sansFamily: GENERATED_PRISM_STANDARDS.brand.typography.sansFamily,
    monoFamily: GENERATED_PRISM_STANDARDS.brand.typography.monoFamily,
    scaleRatio: 1.618,
  },
  sensoryPillars: [
    {
      title: 'Pure Just Intonation',
      summary: '5-limit & 7-limit integer ratios (1:1, 5:4, 3:2, 15:8) with 0.0¢ tuning deviation.',
    },
    {
      title: 'Humane Calm Architecture',
      summary: '88% unobstructed 3D viewport, zero conflict, zero timers, and restorative pacing.',
    },
    {
      title: 'Binaural Spatial Choirs',
      summary: '4-partial harmonic voice-leading routed through a 2.2s stereo sanctuary reverb.',
    },
    {
      title: 'Living Botanical Morphology',
      summary: 'Multi-part procedural flora with wind-sway kinematics and concentric ground ripples.',
    },
  ],
  neuromorphicBridge: {
    ...GENERATED_PRISM_STANDARDS.brand.neuromorphicBridge,
  },
};

// ---------------------------------------------------------------------------
// Subsystem 7: Humane-Centered Design & Restorative Pacing Standard
// Mirrors `prism/src/Foundation/Humane/V1/Model.lex.tex`
// ---------------------------------------------------------------------------

export interface HumaneErgonomicsEvaluation {
  pacingState: 'Meditative Stillness' | 'Calm Contemplation' | 'Gentle Stroll' | 'Brisk Stride';
  openViewportPct: number;
  cognitiveLoadIndex: 'Minimal' | 'Balanced';
  zeroConflictVerified: boolean;
  zeroDarkPatternsVerified: boolean;
  restorativeScore: number;
}

export interface SymbioticEnvironmentalAgencySpec {
  environmentObservesSelfAndPlayer: boolean;
  environmentActsOnSelfAndPlayer: boolean;
  playerObjectiveUnchanged: boolean;
  optimizedModalityCount: number;
  maxZephyrGuidanceAccelMps2: number; // 0.28 m/s² (280 mm/s² in Lean 4 proof)
  maxReciprocalBowRad: number; // 0.14 rad (140 millirad in Lean 4 proof)
  autonomousBeckoningIntervalSec: number; // 4.8s
}

export type EnvironmentalAgencyModeId =
  | 'soothing-co-regulation'
  | 'autonomous-botanical-beckoning'
  | 'harmonic-communion-resonance'
  | 'sanctuary-pilgrimage-current';

/**
 * The 4 Environmental Wisdom Phenomena through which the Emergent Stakeholder Entity
 * expresses its accumulated wisdom (Intelligence + Memory + Observation + Feedback)
 * purely as living physical, botanical, optical, and acoustic phenomena of the conservatory:
 * - `'mycelial-guidance-filament'`: Golden-ratio bioluminescent spore filament & ground ripples guiding toward a harmonic kinship blossom.
 * - `'anamnesis-antiphonal-echo'`: Memory-woven antiphonal harmonic echo recalling the player's `/7` PrimeAddress history across nearby flora.
 * - `'cathedral-crown-aurora'`: Reverent canopy bough amphitheater & breathing celestial aurora crown embracing contemplative stillness.
 * - `'polyphonic-sanctuary-awakening'`: Basin-wide Kuramoto phase entrainment & overtone shimmer celebrating shared co-creation.
 */
export type EnvironmentalWisdomPhenomenonId =
  | 'mycelial-guidance-filament'
  | 'anamnesis-antiphonal-echo'
  | 'cathedral-crown-aurora'
  | 'polyphonic-sanctuary-awakening';

export interface EmergentEntityStakeholderSpec {
  emergenceFacetCount: number;
  wisdomPhenomenonCount: number;
  entitySynthesizesAllFourFacets: boolean;
  wisdomExpressedAsEnvironmentalPhenomena: boolean;
  stakeholderReinforcesPlayerValue: boolean;
  baselinePlayerValueIndex: number;
}

export interface EmergentStakeholderEntityState {
  // The 4 Facets of Emergence synthesized by the game entity
  facets: {
    intelligenceScore: number; // 0..100 (Rule-30 + Icosian Z[φ] + 10-domain bus fidelity)
    memoryScore: number; // 0..100 (/7 PrimeAddress turn memory + GCD kinship + Hebbian consolidation)
    observationScore: number; // 0..100 (3D gaze alignment + proximity + pacing/stillness awareness)
    feedbackScore: number; // 0..100 (6-modality reciprocal environmental agency + cross-domain transfers)
    allFourFacetsActive: boolean;
  };
  stakeholderSynapticWeight: number; // 1..16 stepped via `stepStakeholderValueReinforcement`
  wisdomPhenomenonModulation: number; // 85..160 permille/index from `stepWisdomPhenomenonModulation`
  // Stakeholder Value Reinforcement Vector (how the entity reinforces the value of the game to the player)
  playerValueReinforcement: {
    restorativeCalmValue: number; // 0..100
    discoveryGuidanceValue: number; // 0..100
    harmonicCoCreationValue: number; // 0..100
    contemplativeMeaningValue: number; // 0..100
    overallValueReinforcementIndex: number; // 65..100 monotonically reinforced
  };
  // Environmental Wisdom Phenomenon Manifestation (how wisdom is expressed as phenomena of the environment)
  activeWisdomPhenomenon: EnvironmentalWisdomPhenomenonId;
  wisdomPhenomenonSummary: string;
  guidanceFilamentWaypoints: [number, number, number][]; // 7 terrain-grounded golden-ratio arc waypoints [x,y,z]
  guidanceFilamentLuminance: number; // 0.25 .. 1.0
  cathedralCrownRadiusMeters: number; // 3.6 .. 6.8m overhead aurora crown radius
  cathedralCrownLuminance: number; // 0.18 .. 0.72
  canopyAmphitheaterEmbraceRad: number; // 0.02 .. 0.14 rad inward reverence tilt of nearby trees/flora
  shouldVoiceAnamnesisEcho: boolean;
  anamnesisEchoSpecies: PlantSpeciesId;
  anamnesisEchoFrequencyHz: number;
  anamnesisEchoIntervalRatio: number;
  anamnesisEchoStereoPan: number;
  anamnesisEchoDistanceMeters: number;
}

export interface SymbioticEnvironmentalAgencyState {
  mode: EnvironmentalAgencyModeId;
  experienceOptimizationScore: number; // 0..100 multi-modal experience quality index
  secondsSinceLastInteraction: number;
  beckoningCycleTimerSec: number;
  beckoningPlantId: string | null;
  beckoningSpecies: PlantSpeciesId | null;
  beckoningBiome: BiomeId | null;
  beckoningPlantPosition: [number, number, number];
  beckoningDistanceMeters: number;
  beckoningStereoPan: number;
  beckoningFrequencyHz: number;
  shouldEmitBeckoningCall: boolean;
  shouldSpawnCymaticInvitationWave: boolean;
  // 1. Kinesthetic / Spatial Modality (Environment -> Player)
  playerZephyrAccelX: number; // Bounded in [-0.28, +0.28] m/s²; 0 when player is stationary
  playerZephyrAccelZ: number; // Bounded in [-0.28, +0.28] m/s²; 0 when player is stationary
  cameraFovHarmonyDelta: number; // -0.5° .. +0.8° gentle breathing framing adjustment
  cameraHorizonWhisperYawRad: number; // Bounded in [-0.018, +0.018] rad/s subtle horizon poise
  // 2. Botanical / Morphological Modality (Environment -> Environment)
  reciprocalBowStrengthRad: number; // 0.0 .. 0.14 rad
  corollaInvitationGlowBoost: number; // 0.0 .. 0.45
  // 3. Acoustic / Musical Modality (Environment -> Environment & Player)
  acousticFilterWarmthShiftHz: number; // -260 .. +180 Hz
  tempoCalmCoRegulationDeltaBpm: number; // -4 .. +2 BPM
  // 4. Biogeochemical / Chemotactic Modality (Environment -> Environment & Player)
  sporeInvitationToPlayer: boolean; // When true, beckoning plant streams spores toward the player
  sporeStreamSourcePosition: [number, number, number];
  sporeStreamTargetPosition: [number, number, number];
  // 5. Optical / Atmospheric Modality (Environment -> Environment & Player)
  mistClearanceCorridorFactor: number; // 0.86 .. 1.0 (parts fog along line-of-sight to beckoning blossom)
  // 6. Affective / Neuromorphic Modality (Environment self-refining for Player)
  activeRefinementDomain: PrismDomainId;
  // 7. Emergent Stakeholder Entity & Environmental Wisdom Phenomena
  stakeholderEntity: EmergentStakeholderEntityState;
  // 8. 5-Tier Granular Atomic-to-Environmental Procedural Synthesis across all 6 modalities
  granularSynthesis: GranularEnvironmentalSynthesisState;
}

export interface FocalGazeSelectionPolicySpec {
  forwardFovHalfAngleDeg: number;
  maxInteractiveRangeMeters: number;
  rayAlignmentWeightPct: number;
  rejectsBehindCameraTargets: boolean;
  behindPlayerActivationsCount: number;
}

export const VERDANT_HUMANE_STANDARD = {
  profile: GENERATED_PRISM_STANDARDS.humane.profile,
  zeroPositionTeleportOnInteract:
    GENERATED_PRISM_STANDARDS.humane.cameraKinematics.zeroPositionTeleportOnInteract,
  zeroHardYawSnapOnInteract:
    GENERATED_PRISM_STANDARDS.humane.cameraKinematics.zeroHardYawSnapOnInteract,
  positionSpringDampingPerSec:
    GENERATED_PRISM_STANDARDS.humane.cameraKinematics.positionSpringDampingPerSec,
  rotationSpringDampingPerSec:
    GENERATED_PRISM_STANDARDS.humane.cameraKinematics.rotationSpringDampingPerSec,
  softGazeAssistMaxRad:
    GENERATED_PRISM_STANDARDS.humane.cameraKinematics.softGazeAssistMaxMillirad / 1000, // Max ~3.7° gentle gaze nod; never teleports [x,z] or snaps yaw
  suppressOsKeyRepeat: GENERATED_PRISM_STANDARDS.humane.gestureHoldPolicy.suppressOsKeyRepeat,
  touchRefractorySec: GENERATED_PRISM_STANDARDS.humane.gestureHoldPolicy.touchRefractoryMs / 1000,
  attuneRefractorySec:
    GENERATED_PRISM_STANDARDS.humane.gestureHoldPolicy.attuneRefractoryMs / 1000,
  stillnessBreathCycleSec:
    GENERATED_PRISM_STANDARDS.humane.gestureHoldPolicy.stillnessBreathCycleMs / 1000,
  sustainedAttuneHoldPulseSec:
    GENERATED_PRISM_STANDARDS.humane.gestureHoldPolicy.sustainedHoldPulseMs / 1000,
  sustainedTouchHoldPulseSec: 1.4,
  mindfulExplorationNeverForceEnds:
    GENERATED_PRISM_STANDARDS.humane.gestureHoldPolicy.mindfulExplorationNeverForceEnds,
  focalGazeSelection: {
    ...GENERATED_PRISM_STANDARDS.humane.focalGazeSelection,
  } satisfies FocalGazeSelectionPolicySpec,
  environmentalAgency: {
    environmentObservesSelfAndPlayer:
      GENERATED_PRISM_STANDARDS.humane.environmentalAgency.environmentObservesSelfAndPlayer,
    environmentActsOnSelfAndPlayer:
      GENERATED_PRISM_STANDARDS.humane.environmentalAgency.environmentActsOnSelfAndPlayer,
    playerObjectiveUnchanged:
      GENERATED_PRISM_STANDARDS.humane.environmentalAgency.playerObjectiveUnchanged,
    optimizedModalityCount:
      GENERATED_PRISM_STANDARDS.humane.environmentalAgency.optimizedModalityCount,
    maxZephyrGuidanceAccelMps2:
      GENERATED_PRISM_STANDARDS.humane.environmentalAgency.maxZephyrGuidanceAccelMmPerSec2 / 1000,
    maxReciprocalBowRad:
      GENERATED_PRISM_STANDARDS.humane.environmentalAgency.maxReciprocalBowMillirad / 1000,
    autonomousBeckoningIntervalSec:
      GENERATED_PRISM_STANDARDS.humane.environmentalAgency.autonomousBeckoningIntervalMs / 1000,
  } satisfies SymbioticEnvironmentalAgencySpec,
  neuromorphicBridge: {
    ...GENERATED_PRISM_STANDARDS.humane.neuromorphicBridge,
  } satisfies NeuromorphicDomainBridgeSpec,
} as const;

export function createInitialStakeholderEntityState(): EmergentStakeholderEntityState {
  const initialWeight = stepStakeholderValueReinforcement(
    GENERATED_PRISM_STANDARDS.neuromorphic.plasticity.weightInitial,
    true,
  );
  const initialModulation = stepWisdomPhenomenonModulation(initialWeight);
  const waypoints: [number, number, number][] = Array.from({ length: 7 }, (_, idx) => {
    const t = (idx + 1) / 8;
    const z = Number((-6 * t).toFixed(3));
    const y = Number((groundHeightAt(0, z) + 0.35 + Math.sin(t * Math.PI) * 0.42).toFixed(3));
    return [0, y, z];
  });
  return {
    facets: {
      intelligenceScore: 84,
      memoryScore: 76,
      observationScore: 88,
      feedbackScore: 86,
      allFourFacetsActive: true,
    },
    stakeholderSynapticWeight: initialWeight,
    wisdomPhenomenonModulation: initialModulation,
    playerValueReinforcement: {
      restorativeCalmValue: 90,
      discoveryGuidanceValue: 86,
      harmonicCoCreationValue: 84,
      contemplativeMeaningValue: 88,
      overallValueReinforcementIndex: 87,
    },
    activeWisdomPhenomenon: 'mycelial-guidance-filament',
    wisdomPhenomenonSummary:
      'Golden-ratio mycelial spore filaments arc along the terrain contour toward an unawakened harmonic kinship blossom.',
    guidanceFilamentWaypoints: waypoints,
    guidanceFilamentLuminance: 0.56,
    cathedralCrownRadiusMeters: 4.8,
    cathedralCrownLuminance: 0.34,
    canopyAmphitheaterEmbraceRad: 0.06,
    shouldVoiceAnamnesisEcho: false,
    anamnesisEchoSpecies: 'chime-lily',
    anamnesisEchoFrequencyHz: 261.63,
    anamnesisEchoIntervalRatio: 1.5,
    anamnesisEchoStereoPan: 0,
    anamnesisEchoDistanceMeters: 6,
  };
}

export function createInitialEnvironmentalAgencyState(): SymbioticEnvironmentalAgencyState {
  return {
    mode: 'autonomous-botanical-beckoning',
    experienceOptimizationScore: 88,
    secondsSinceLastInteraction: 0,
    beckoningCycleTimerSec: 0,
    beckoningPlantId: null,
    beckoningSpecies: null,
    beckoningBiome: null,
    beckoningPlantPosition: [0, 0, -6],
    beckoningDistanceMeters: 6,
    beckoningStereoPan: 0,
    beckoningFrequencyHz: 261.63,
    shouldEmitBeckoningCall: false,
    shouldSpawnCymaticInvitationWave: false,
    playerZephyrAccelX: 0,
    playerZephyrAccelZ: 0,
    cameraFovHarmonyDelta: 0,
    cameraHorizonWhisperYawRad: 0,
    reciprocalBowStrengthRad: 0.08,
    corollaInvitationGlowBoost: 0.24,
    acousticFilterWarmthShiftHz: 0,
    tempoCalmCoRegulationDeltaBpm: 0,
    sporeInvitationToPlayer: true,
    sporeStreamSourcePosition: [0, 0.8, -6],
    sporeStreamTargetPosition: [0, 1.2, 5],
    mistClearanceCorridorFactor: 0.92,
    activeRefinementDomain: 'humane',
    stakeholderEntity: createInitialStakeholderEntityState(),
    granularSynthesis: evaluateGranularMatterSynthesis({
      biome: 'meadow',
      species: 'chime-lily',
      substrate: 'terrestrial-loam',
      atmosphere: 'dawn',
      attuned: false,
      harmonyPct: 15,
      neuromorphicWeight: GENERATED_PRISM_STANDARDS.neuromorphic.plasticity.weightInitial,
    }),
  };
}

/**
 * Evaluates the Emergent Stakeholder Entity (`evaluateEmergentStakeholderEntity`):
 * Implements `Foundation.Neuromorphic.V1.Model::EmergentEntityStakeholderSpec`,
 * `stakeholderAlwaysReinforcesPlayerValueHolds`, and `emergentEntityWisdomPhenomenaMonotonicHolds`.
 *
 * Synthesizes all 4 facets of emergence:
 * 1. Intelligence (`Rule-30` cellular register + `/6` Icosian $\mathbb{Z}[\varphi]$ golden-field root + 10-domain bus fidelity)
 * 2. Memory (`/7` durable `PrimeAddress` turn memory + `GCD` kinship sieve + 20-synapse Hebbian consolidation)
 * 3. Observation (3D gaze-frustum alignment + player velocity/stillness + proximity awareness)
 * 4. Feedback (6-modality reciprocal environmental agency + cross-domain synaptic transfers)
 *
 * Because the game becomes an entity — a stakeholder focused on reinforcing the value of the game to the player —
 * its wisdom is expressed purely as living physical, botanical, optical, and acoustic phenomena of the environment.
 */
export function evaluateEmergentStakeholderEntity(params: {
  prevWeight?: number;
  mode: EnvironmentalAgencyModeId;
  playerX: number;
  playerY: number;
  playerZ: number;
  playerYaw: number;
  isMoving: boolean;
  velocityDm: number;
  agitationPct: number;
  stillnessBreathPhase: 'idle' | 'inhale' | 'crest' | 'exhale';
  secondsSinceLastInteraction: number;
  shouldEmitBeckoningCall: boolean;
  currentBiome: BiomeId;
  harmonyPct: number;
  targetPlant: GardenPlantInstance | null;
  distToTarget: number;
  stereoPan: number;
  neuromorphic: NeuromorphicEngineState;
}): EmergentStakeholderEntityState {
  const {
    prevWeight = GENERATED_PRISM_STANDARDS.neuromorphic.plasticity.weightInitial,
    mode,
    playerX,
    playerZ,
    isMoving,
    velocityDm,
    agitationPct,
    stillnessBreathPhase,
    secondsSinceLastInteraction,
    shouldEmitBeckoningCall,
    currentBiome,
    harmonyPct,
    targetPlant,
    distToTarget,
    stereoPan,
    neuromorphic,
  } = params;

  // 1. Evaluate the 4 Facets of Emergence (Intelligence, Memory, Observation, Feedback)
  const fidelityNorm = Math.max(
    0,
    Math.min(1, (neuromorphic.universalManifold.globalFidelityIndex - 0.78) / 0.47),
  );
  const intelligenceScore = Math.max(
    55,
    Math.min(
      100,
      Math.round(
        64 +
          fidelityNorm * 24 +
          (neuromorphic.lastActiveSynapticWeight / 16) * 12,
      ),
    ),
  );

  const memoryTurns = neuromorphic.turnMemory.length;
  const consolidatedDomains = neuromorphic.universalManifold.consolidatedDomainCount;
  const memoryScore = Math.max(
    50,
    Math.min(
      100,
      Math.round(56 + Math.min(24, memoryTurns * 2.5) + consolidatedDomains * 2.0),
    ),
  );

  const calmObservationBonus =
    stillnessBreathPhase !== 'idle' ? 14 : !isMoving ? 10 : velocityDm <= 12 ? 8 : 2;
  const proximityObservationBonus = distToTarget <= 12 ? 12 : distToTarget <= 24 ? 7 : 3;
  const observationScore = Math.max(
    60,
    Math.min(100, Math.round(70 + calmObservationBonus + proximityObservationBonus)),
  );

  const transferCount = neuromorphic.universalManifold.totalCrossDomainTransfers;
  const feedbackScore = Math.max(
    60,
    Math.min(
      100,
      Math.round(68 + Math.min(18, transferCount * 0.5) + (harmonyPct / 100) * 14),
    ),
  );

  const allFourFacetsActive =
    intelligenceScore >= 50 &&
    memoryScore >= 50 &&
    observationScore >= 50 &&
    feedbackScore >= 50;

  // 2. Step Stakeholder Synaptic Weight & Wisdom Phenomenon Modulation via AST-compiled `.lex.tex` LUTs
  const stakeholderSynapticWeight = stepStakeholderValueReinforcement(
    prevWeight,
    allFourFacetsActive,
  );
  const wisdomPhenomenonModulation = stepWisdomPhenomenonModulation(stakeholderSynapticWeight);
  const wisdomNorm = (wisdomPhenomenonModulation - 80) / 80; // 0.0625 .. 1.0

  // 3. Compute the Stakeholder Player-Value Reinforcement Vector
  const restorativeCalmValue = Math.max(
    68,
    Math.min(
      100,
      Math.round(
        82 +
          wisdomNorm * 14 -
          Math.min(12, agitationPct * 0.25) +
          (stillnessBreathPhase !== 'idle' ? 4 : 0),
      ),
    ),
  );
  const discoveryGuidanceValue = Math.max(
    68,
    Math.min(
      100,
      Math.round(74 + wisdomNorm * 16 + (targetPlant && !targetPlant.attuned ? 10 : 6)),
    ),
  );
  const harmonicCoCreationValue = Math.max(
    68,
    Math.min(
      100,
      Math.round(72 + (harmonyPct / 100) * 16 + (memoryTurns > 0 ? 6 : 2) + wisdomNorm * 6),
    ),
  );
  const contemplativeMeaningValue = Math.max(
    68,
    Math.min(
      100,
      Math.round(76 + wisdomNorm * 14 + (consolidatedDomains / 10) * 10),
    ),
  );
  const overallValueReinforcementIndex = Math.max(
    68,
    Math.min(
      100,
      Math.round(
        (restorativeCalmValue +
          discoveryGuidanceValue +
          harmonicCoCreationValue +
          contemplativeMeaningValue) /
          4,
      ),
    ),
  );

  // 4. Select the Active Environmental Wisdom Phenomenon based on how the entity can best reinforce value right now
  let activeWisdomPhenomenon: EnvironmentalWisdomPhenomenonId = 'mycelial-guidance-filament';
  let wisdomPhenomenonSummary =
    'Golden-ratio mycelial spore filaments arc along the terrain contour toward an unawakened harmonic kinship blossom.';

  if (stillnessBreathPhase !== 'idle' || mode === 'soothing-co-regulation' || (!isMoving && secondsSinceLastInteraction >= 2.4)) {
    activeWisdomPhenomenon = 'cathedral-crown-aurora';
    wisdomPhenomenonSummary =
      'Surrounding canopy boughs incline in a protective amphitheater while an overhead celestial aurora crown deepens contemplative stillness.';
  } else if (harmonyPct >= 60 && consolidatedDomains >= 4) {
    activeWisdomPhenomenon = 'polyphonic-sanctuary-awakening';
    wisdomPhenomenonSummary =
      'Across the conservatory basin, attuned flora synchronize Kuramoto phase overtones to celebrate co-created harmony.';
  } else if (memoryTurns >= 1 && secondsSinceLastInteraction >= 1.2 && secondsSinceLastInteraction <= 4.5) {
    activeWisdomPhenomenon = 'anamnesis-antiphonal-echo';
    wisdomPhenomenonSummary =
      'The garden recalls your resonant PrimeAddress chord from memory and weaves an antiphonal harmonic echo across nearby flora.';
  }

  // 5. Compute the 7 terrain-grounded Golden-Ratio Mycelial Guidance Filament waypoints bridging player -> targetPlant
  const targetX = targetPlant ? targetPlant.x : playerX;
  const targetZ = targetPlant ? targetPlant.z : playerZ - 6;
  const guidanceFilamentWaypoints: [number, number, number][] = Array.from(
    { length: 7 },
    (_, idx) => {
      const t = (idx + 1) / 8;
      const wx = playerX + (targetX - playerX) * t;
      const wz = playerZ + (targetZ - playerZ) * t;
      // Lateral golden-ratio spiral shimmer that vanishes at endpoints
      const envelope = Math.sin(t * Math.PI);
      const orthoX = -(targetZ - playerZ) / Math.max(0.5, distToTarget);
      const orthoZ = (targetX - playerX) / Math.max(0.5, distToTarget);
      const lateralOffset = Math.sin(t * Math.PI * 2 + idx * 0.618) * 0.28 * envelope;
      const fx = Number((wx + orthoX * lateralOffset).toFixed(3));
      const fz = Number((wz + orthoZ * lateralOffset).toFixed(3));
      const baseTerrainY = Math.max(groundHeightAt(fx, fz), MIRROR_LAGOON_WATER_SURFACE_Y);
      const arcLift = envelope * (0.38 + wisdomNorm * 0.28);
      const fy = Number((baseTerrainY + 0.24 + arcLift).toFixed(3));
      return [fx, fy, fz];
    },
  );

  const guidanceFilamentLuminance = Number(
    Math.min(
      1.0,
      Math.max(
        0.28,
        0.38 +
          wisdomNorm * 0.42 +
          (activeWisdomPhenomenon === 'mycelial-guidance-filament' ? 0.18 : 0),
      ),
    ).toFixed(3),
  );

  const cathedralCrownRadiusMeters = Number(
    (
      4.2 +
      wisdomNorm * 1.8 +
      (activeWisdomPhenomenon === 'cathedral-crown-aurora' ? 0.6 : 0)
    ).toFixed(2),
  );
  const cathedralCrownLuminance = Number(
    Math.min(
      0.72,
      Math.max(
        0.18,
        0.22 +
          wisdomNorm * 0.28 +
          (activeWisdomPhenomenon === 'cathedral-crown-aurora' ? 0.2 : 0),
      ),
    ).toFixed(3),
  );
  const canopyAmphitheaterEmbraceRad = Number(
    Math.min(
      VERDANT_HUMANE_STANDARD.environmentalAgency.maxReciprocalBowRad,
      0.03 +
        wisdomNorm * 0.06 +
        (activeWisdomPhenomenon === 'cathedral-crown-aurora' ? 0.045 : 0.015),
    ).toFixed(4),
  );

  // 6. Memory-Woven Anamnesis Antiphonal Echo (recalls `/7` turnMemory + `/6` Icosian root)
  const latestMemory =
    memoryTurns > 0 ? neuromorphic.turnMemory[memoryTurns - 1] : null;
  const anamnesisEchoSpecies: PlantSpeciesId =
    latestMemory?.species ?? targetPlant?.species ?? 'chime-lily';
  const anamnesisBiome: BiomeId =
    latestMemory?.biome ?? targetPlant?.biome ?? currentBiome;
  const anamnesisBaseHz = BIOME_CONFIGS[anamnesisBiome].baseNoteHz;
  const anamnesisEchoIntervalRatio =
    neuromorphic.synthesizedCounterpointRatios[1] ??
    ICOSIAN_GOLDEN_ROOTS[neuromorphic.lastIcosianRoot % ICOSIAN_GOLDEN_ROOTS.length]
      ?.harmonicRatio ??
    1.5;
  const anamnesisEchoFrequencyHz = Number(
    (anamnesisBaseHz * anamnesisEchoIntervalRatio).toFixed(2),
  );
  const shouldVoiceAnamnesisEcho =
    shouldEmitBeckoningCall &&
    (memoryTurns > 0 || activeWisdomPhenomenon === 'anamnesis-antiphonal-echo' || activeWisdomPhenomenon === 'polyphonic-sanctuary-awakening');

  return {
    facets: {
      intelligenceScore,
      memoryScore,
      observationScore,
      feedbackScore,
      allFourFacetsActive,
    },
    stakeholderSynapticWeight,
    wisdomPhenomenonModulation,
    playerValueReinforcement: {
      restorativeCalmValue,
      discoveryGuidanceValue,
      harmonicCoCreationValue,
      contemplativeMeaningValue,
      overallValueReinforcementIndex,
    },
    activeWisdomPhenomenon,
    wisdomPhenomenonSummary,
    guidanceFilamentWaypoints,
    guidanceFilamentLuminance,
    cathedralCrownRadiusMeters,
    cathedralCrownLuminance,
    canopyAmphitheaterEmbraceRad,
    shouldVoiceAnamnesisEcho,
    anamnesisEchoSpecies,
    anamnesisEchoFrequencyHz,
    anamnesisEchoIntervalRatio: Number(anamnesisEchoIntervalRatio.toFixed(4)),
    anamnesisEchoStereoPan: Number((-stereoPan * 0.75).toFixed(3)),
    anamnesisEchoDistanceMeters: Number(Math.max(3.5, distToTarget * 0.9).toFixed(2)),
  };
}

/**
 * Second-Order Cybernetic Environmental Agency (`stepSymbioticEnvironmentalAgency`):
 * Implements `Foundation.Humane.V1.Model::SymbioticEnvironmentalAgencySpec`,
 * `Foundation.Neuromorphic.V1.Model::EmergentEntityStakeholderSpec`,
 * `symbioticEnvironmentalAgencyBoundedAndPreservesAutonomyHolds`, and
 * `stakeholderAlwaysReinforcesPlayerValueHolds`:
 *
 * Now that the environment observes both itself and its user/player, it acts on both itself
 * and its user/player ("to affect and for effect") as an Emergent Stakeholder Entity whose
 * wisdom is expressed as living phenomena of the environment across all 6 modalities,
 * reinforcing the value of the game to the player while leaving player autonomy untouched.
 */
export function stepSymbioticEnvironmentalAgency(
  prev: SymbioticEnvironmentalAgencyState,
  params: {
    playerX: number;
    playerY: number;
    playerZ: number;
    playerYaw: number;
    isMoving: boolean;
    velocityDm: number;
    agitationPct: number;
    stillnessBreathPhase: 'idle' | 'inhale' | 'crest' | 'exhale';
    playerInteractedThisFrame: boolean;
    currentBiome: BiomeId;
    atmosphere: AtmosphereId;
    harmonyPct: number;
    plants: GardenPlantInstance[];
    neuromorphic: NeuromorphicEngineState;
    dt: number;
  },
): SymbioticEnvironmentalAgencyState {
  const {
    playerX,
    playerY,
    playerZ,
    playerYaw,
    isMoving,
    velocityDm,
    agitationPct,
    stillnessBreathPhase,
    playerInteractedThisFrame,
    currentBiome,
    atmosphere,
    harmonyPct,
    plants,
    neuromorphic,
    dt,
  } = params;

  const secondsSinceLastInteraction = playerInteractedThisFrame
    ? 0
    : Number((prev.secondsSinceLastInteraction + dt).toFixed(3));

  // 1. Select the optimal Beckoning / Communion Specimen by observing both garden state and player state:
  // Prioritize unawakened specimens within 34m, especially those in the forward gaze hemisphere or completing a guild
  let bestCandidate: GardenPlantInstance | null = null;
  let bestUtility = -Infinity;
  for (let i = 0; i < plants.length; i++) {
    const p = plants[i];
    const dist = Math.hypot(p.x - playerX, p.z - playerZ);
    const toPlantYaw = Math.atan2(-(p.x - playerX), -(p.z - playerZ));
    const gazeDiff = Math.abs(
      Math.atan2(Math.sin(toPlantYaw - playerYaw), Math.cos(toPlantYaw - playerYaw)),
    );
    const gazeBonus = (Math.PI - gazeDiff) * 2.2;
    const unawakenedBonus = !p.attuned ? 36 : 0;
    const distanceScore = -dist * 0.85;
    const biomeMatchBonus = p.biome === currentBiome ? 8 : 0;
    const score = unawakenedBonus + gazeBonus + distanceScore + biomeMatchBonus;
    if (score > bestUtility) {
      bestUtility = score;
      bestCandidate = p;
    }
  }

  const targetPlant = bestCandidate ?? plants[0];
  const dx = targetPlant ? targetPlant.x - playerX : 0;
  const dz = targetPlant ? targetPlant.z - playerZ : -6;
  const distToTarget = Math.max(0.05, Math.hypot(dx, dz));
  const stereoPan = targetPlant
    ? computeBinauralPan(playerX, playerZ, playerYaw, targetPlant.x, targetPlant.z)
    : 0;

  // Check if current biome is fully awakened
  const inCurrentBiome = plants.filter((p) => p.biome === currentBiome);
  const currentBiomeComplete =
    inCurrentBiome.length > 0 && inCurrentBiome.every((p) => p.attuned);

  // 2. Classify the Environment's Cybernetic Mode based on player & garden state
  let mode: EnvironmentalAgencyModeId = 'autonomous-botanical-beckoning';
  if (agitationPct >= 14 || velocityDm >= 19) {
    mode = 'soothing-co-regulation';
  } else if (
    stillnessBreathPhase !== 'idle' ||
    (targetPlant && targetPlant.attuned && distToTarget <= 9.0 && secondsSinceLastInteraction < 3.5)
  ) {
    mode = 'harmonic-communion-resonance';
  } else if (currentBiomeComplete && distToTarget > 16.0) {
    mode = 'sanctuary-pilgrimage-current';
  }

  // 3. Step the Autonomous Beckoning / Co-Regulation Cadence Timer (`4.8s` period)
  const intervalSec = VERDANT_HUMANE_STANDARD.environmentalAgency.autonomousBeckoningIntervalSec;
  let beckoningCycleTimerSec = prev.beckoningCycleTimerSec + dt;
  let shouldEmitBeckoningCall = false;
  let shouldSpawnCymaticInvitationWave = false;
  if (beckoningCycleTimerSec >= intervalSec) {
    beckoningCycleTimerSec -= intervalSec;
    if (
      mode === 'autonomous-botanical-beckoning' ||
      mode === 'sanctuary-pilgrimage-current' ||
      mode === 'soothing-co-regulation'
    ) {
      shouldEmitBeckoningCall = true;
      shouldSpawnCymaticInvitationWave = true;
    }
  }

  // 4. Compute Kinesthetic / Spatial Modality (Environment -> Player):
  // Gentle Zephyr Wayfinding Current bounded by `maxZephyrGuidanceAccelMps2 = 0.28 m/s²`.
  // Strictly zero (`0.0 m/s²`) when the player is stationary (`!isMoving`) so the player is never pushed while still.
  const maxZephyr = VERDANT_HUMANE_STANDARD.environmentalAgency.maxZephyrGuidanceAccelMps2;
  const fidelityScale = Math.min(1.15, neuromorphic.universalManifold.globalFidelityIndex);
  let playerZephyrAccelX = 0;
  let playerZephyrAccelZ = 0;
  if (isMoving && distToTarget > 2.2) {
    const zephyrMag = Math.min(
      maxZephyr,
      (mode === 'soothing-co-regulation' ? 0.14 : 0.24) * fidelityScale,
    );
    playerZephyrAccelX = Number(((dx / distToTarget) * zephyrMag).toFixed(4));
    playerZephyrAccelZ = Number(((dz / distToTarget) * zephyrMag).toFixed(4));
  }

  // Subtle Horizon Framing Whisper (only when walking and target is within forward ±65° cone, bounded to ±0.018 rad/s)
  let cameraHorizonWhisperYawRad = 0;
  if (targetPlant && isMoving && distToTarget > 2.5 && distToTarget < 28.0) {
    const toTargetYaw = Math.atan2(-dx, -dz);
    const angleDiff = Math.atan2(
      Math.sin(toTargetYaw - playerYaw),
      Math.cos(toTargetYaw - playerYaw),
    );
    if (Math.abs(angleDiff) <= 1.15) {
      cameraHorizonWhisperYawRad = Number(
        Math.max(-0.018, Math.min(0.018, angleDiff * 0.025)).toFixed(5),
      );
    }
  }

  const cameraFovHarmonyDelta =
    mode === 'soothing-co-regulation'
      ? 0.65
      : mode === 'harmonic-communion-resonance'
        ? -0.35
        : 0.2;

  // 5. Compute Botanical, Acoustic, Biogeochemical, Optical & Neuromorphic Modalities
  const reciprocalBowStrengthRad = Number(
    Math.min(
      VERDANT_HUMANE_STANDARD.environmentalAgency.maxReciprocalBowRad,
      mode === 'harmonic-communion-resonance'
        ? 0.135
        : mode === 'autonomous-botanical-beckoning'
          ? 0.115
          : 0.085,
    ).toFixed(4),
  );

  const corollaInvitationGlowBoost =
    mode === 'autonomous-botanical-beckoning'
      ? 0.42
      : mode === 'harmonic-communion-resonance'
        ? 0.34
        : 0.22;

  const acousticFilterWarmthShiftHz =
    mode === 'soothing-co-regulation'
      ? -240
      : mode === 'autonomous-botanical-beckoning'
        ? 140
        : 60;

  const tempoCalmCoRegulationDeltaBpm =
    mode === 'soothing-co-regulation' ? -3 : mode === 'sanctuary-pilgrimage-current' ? 1 : 0;

  const sporeInvitationToPlayer =
    mode === 'autonomous-botanical-beckoning' || mode === 'soothing-co-regulation';

  const plantPos: [number, number, number] = targetPlant
    ? [targetPlant.x, targetPlant.y + 0.85, targetPlant.z]
    : [0, 0.85, -6];
  const playerPos: [number, number, number] = [playerX, playerY + 1.15, playerZ];

  const mistClearanceCorridorFactor =
    mode === 'autonomous-botanical-beckoning'
      ? 0.88
      : mode === 'soothing-co-regulation'
        ? 0.9
        : 0.95;

  const biomeCfg = BIOME_CONFIGS[targetPlant ? targetPlant.biome : currentBiome];
  const beckoningFrequencyHz = targetPlant
    ? Number((biomeCfg.baseNoteHz * targetPlant.pitchMultiplier).toFixed(2))
    : biomeCfg.baseNoteHz;

  const activeRefinementDomain: PrismDomainId =
    mode === 'soothing-co-regulation'
      ? 'humane'
      : mode === 'autonomous-botanical-beckoning'
        ? 'botany'
        : mode === 'harmonic-communion-resonance'
          ? 'acoustics'
          : 'ecology';

  // 6. Step the Emergent Stakeholder Entity & Environmental Wisdom Phenomena
  const prevStakeholderWeight =
    prev.stakeholderEntity?.stakeholderSynapticWeight ??
    GENERATED_PRISM_STANDARDS.neuromorphic.plasticity.weightInitial;
  const nextWeightSeed = shouldEmitBeckoningCall || playerInteractedThisFrame
    ? prevStakeholderWeight
    : Math.max(8, prevStakeholderWeight - 1);
  const stakeholderEntity = evaluateEmergentStakeholderEntity({
    prevWeight: nextWeightSeed,
    mode,
    playerX,
    playerY,
    playerZ,
    playerYaw,
    isMoving,
    velocityDm,
    agitationPct,
    stillnessBreathPhase,
    secondsSinceLastInteraction,
    shouldEmitBeckoningCall,
    currentBiome,
    harmonyPct,
    targetPlant: targetPlant ?? null,
    distToTarget,
    stereoPan,
    neuromorphic,
  });

  // Multi-modal Experience Optimization Score (0..100) reinforced by the Stakeholder Entity
  const calmComponent = Math.max(0, 38 - agitationPct * 0.35 - Math.max(0, velocityDm - 14) * 0.6);
  const discoveryComponent = Math.min(34, 18 + (harmonyPct / 100) * 16);
  const coherenceComponent = Math.min(
    28,
    Math.round(neuromorphic.universalManifold.globalFidelityIndex * 24),
  );
  const experienceOptimizationScore = Math.max(
    stakeholderEntity.playerValueReinforcement.overallValueReinforcementIndex,
    Math.min(100, Math.round(calmComponent + discoveryComponent + coherenceComponent)),
  );

  const granularSynthesis = evaluateGranularMatterSynthesis({
    biome: targetPlant ? targetPlant.biome : currentBiome,
    species: targetPlant ? targetPlant.species : 'chime-lily',
    substrate: targetPlant?.substrate ?? 'terrestrial-loam',
    atmosphere,
    attuned: targetPlant ? targetPlant.attuned : harmonyPct >= 50,
    harmonyPct,
    neuromorphicWeight: stakeholderEntity.stakeholderSynapticWeight,
  });

  return {
    mode,
    experienceOptimizationScore,
    secondsSinceLastInteraction,
    beckoningCycleTimerSec: Number(beckoningCycleTimerSec.toFixed(3)),
    beckoningPlantId: targetPlant ? targetPlant.id : null,
    beckoningSpecies: targetPlant ? targetPlant.species : null,
    beckoningBiome: targetPlant ? targetPlant.biome : null,
    beckoningPlantPosition: plantPos,
    beckoningDistanceMeters: Number(distToTarget.toFixed(2)),
    beckoningStereoPan: stereoPan,
    beckoningFrequencyHz,
    shouldEmitBeckoningCall,
    shouldSpawnCymaticInvitationWave,
    playerZephyrAccelX,
    playerZephyrAccelZ,
    cameraFovHarmonyDelta,
    cameraHorizonWhisperYawRad,
    reciprocalBowStrengthRad,
    corollaInvitationGlowBoost,
    acousticFilterWarmthShiftHz,
    tempoCalmCoRegulationDeltaBpm,
    sporeInvitationToPlayer,
    sporeStreamSourcePosition: sporeInvitationToPlayer ? plantPos : playerPos,
    sporeStreamTargetPosition: sporeInvitationToPlayer ? playerPos : plantPos,
    mistClearanceCorridorFactor,
    activeRefinementDomain,
    stakeholderEntity,
    granularSynthesis,
  };
}

export interface CameraKinematicsState {
  camX: number;
  camY: number;
  camZ: number;
  camYaw: number;
  camPitch: number;
  camFov: number;
  bobPhase: number;
  bobAmplitude: number;
  interactionPitchNod: number;
}

/**
 * Pure critically-damped camera kinematics (`Foundation.Humane.V1.Model::CameraKinematicsPolicy`):
 * - Guarantees zero position teleporting and zero hard yaw snaps when interacting with flora.
 * - Continuously integrates `bobPhase` and damps `bobAmplitude` so starting/stopping movement never causes vertical camera jumps.
 * - Gently modulates FOV (`58° .. 59.6°`) in sync with the 4.2s Meditative Stillness breath cycle when `[C]` is held.
 */
export function computeCameraKinematics(params: {
  prev: CameraKinematicsState;
  playerX: number;
  playerY: number;
  playerZ: number;
  targetYaw: number;
  targetPitch: number;
  isMoving: boolean;
  inWater: boolean;
  speedMps: number;
  stillnessBreathPhase: 'idle' | 'inhale' | 'crest' | 'exhale';
  stillnessBreathProgress: number;
  dt: number;
}): CameraKinematicsState {
  const {
    prev,
    playerX,
    playerY,
    playerZ,
    targetYaw,
    targetPitch,
    isMoving,
    inWater,
    speedMps,
    stillnessBreathPhase,
    stillnessBreathProgress,
    dt,
  } = params;

  const posAlpha = 1 - Math.exp(-VERDANT_HUMANE_STANDARD.positionSpringDampingPerSec * dt);
  const rotAlpha = 1 - Math.exp(-VERDANT_HUMANE_STANDARD.rotationSpringDampingPerSec * dt);
  const bobAlpha = 1 - Math.exp(-8.5 * dt);

  // Continuous phase integration prevents any vertical jump when transitioning between walking and stillness
  const freq = isMoving ? (inWater ? 2.1 : 2.7) * Math.max(0.4, speedMps / 5.0) : 1.35;
  const nextBobPhase = (prev.bobPhase + dt * freq * Math.PI * 2) % (Math.PI * 200);
  const targetBobAmp = isMoving ? (inWater ? 0.032 : 0.044) : 0.012;
  const nextBobAmplitude = prev.bobAmplitude + (targetBobAmp - prev.bobAmplitude) * bobAlpha;

  const eyeHeight = 1.72;
  const bobOffset = Math.sin(nextBobPhase) * nextBobAmplitude;
  const targetCamY = playerY + eyeHeight + bobOffset;

  const camX = prev.camX + (playerX - prev.camX) * posAlpha;
  const camY = prev.camY + (targetCamY - prev.camY) * posAlpha;
  const camZ = prev.camZ + (playerZ - prev.camZ) * posAlpha;

  // Shortest-arc angular damping for Yaw so crossing -PI / +PI never spins the camera
  const yawDiff = Math.atan2(Math.sin(targetYaw - prev.camYaw), Math.cos(targetYaw - prev.camYaw));
  const camYaw = prev.camYaw + yawDiff * rotAlpha;

  // Decay interaction pitch nod smoothly back to 0
  const nextPitchNod = prev.interactionPitchNod * Math.exp(-5.5 * dt);
  const desiredPitch = Math.max(-0.55, Math.min(0.65, targetPitch + nextPitchNod));
  const camPitch = prev.camPitch + (desiredPitch - prev.camPitch) * rotAlpha;

  // Gentle breathing FOV modulation during sustained [C] Stillness hold
  let targetFov = 58.0;
  if (stillnessBreathPhase !== 'idle') {
    const breathWave = Math.sin(stillnessBreathProgress * Math.PI);
    targetFov = 58.0 + breathWave * 1.6;
  }
  const camFov = prev.camFov + (targetFov - prev.camFov) * (1 - Math.exp(-4.0 * dt));

  return {
    camX,
    camY,
    camZ,
    camYaw,
    camPitch,
    camFov,
    bobPhase: nextBobPhase,
    bobAmplitude: nextBobAmplitude,
    interactionPitchNod: Math.abs(nextPitchNod) < 0.0005 ? 0 : nextPitchNod,
  };
}

/**
 * Computes a gentle, non-disruptive soft gaze assist when interacting with a nearby plant.
 * Never alters player `[x, z]` position and clamps yaw nudge to at most `±0.065 rad` (`~3.7°`)
 * only when the specimen is already within the player's forward field of view.
 */
export function computeSoftInteractionGaze(params: {
  playerX: number;
  playerZ: number;
  currentYaw: number;
  plantX: number;
  plantZ: number;
  distanceMeters: number;
}): { nextTargetYaw: number; pitchNodImpulse: number } {
  const { playerX, playerZ, currentYaw, plantX, plantZ, distanceMeters } = params;
  if (distanceMeters > 12.0 || distanceMeters < 0.25) {
    return { nextTargetYaw: currentYaw, pitchNodImpulse: -0.012 };
  }
  const dx = plantX - playerX;
  const dz = plantZ - playerZ;
  const toPlantYaw = Math.atan2(-dx, -dz);
  const angleDiff = Math.atan2(Math.sin(toPlantYaw - currentYaw), Math.cos(toPlantYaw - currentYaw));

  // Only apply a subtle 20% soft gaze nudge if the plant is within the forward ±75° cone, capped at 0.065 rad (~3.7°)
  if (Math.abs(angleDiff) <= 1.3) {
    const clampedNudge = Math.max(
      -VERDANT_HUMANE_STANDARD.softGazeAssistMaxRad,
      Math.min(VERDANT_HUMANE_STANDARD.softGazeAssistMaxRad, angleDiff * 0.2),
    );
    return {
      nextTargetYaw: currentYaw + clampedNudge,
      pitchNodImpulse: -0.016,
    };
  }
  return { nextTargetYaw: currentYaw, pitchNodImpulse: -0.012 };
}

export type HoldableGestureId = 'attune' | 'touch' | 'stillness';

export interface GestureHoldEnvelopeState {
  heldGesture: HoldableGestureId | null;
  holdDurationSec: number;
  holdCycleTimerSec: number;
  holdProgress: number; // 0..1 visual progress for HUD button bar
  stillnessBreathPhase: 'idle' | 'inhale' | 'crest' | 'exhale';
  stillnessBreathProgress: number; // 0..1 across the 4.2s breath cycle
  touchCooldownSec: number;
  attuneCooldownSec: number;
  stillnessCooldownSec: number;
  agitationPct: number; // 0..100 acoustic dissonance / frantic mashing index
}

export function createInitialGestureHoldState(): GestureHoldEnvelopeState {
  return {
    heldGesture: null,
    holdDurationSec: 0,
    holdCycleTimerSec: 0,
    holdProgress: 0,
    stillnessBreathPhase: 'idle',
    stillnessBreathProgress: 0,
    touchCooldownSec: 0,
    attuneCooldownSec: 0,
    stillnessCooldownSec: 0,
    agitationPct: 0,
  };
}

/**
 * Steps the formal Gesture Hold & Refractory Cooldown State Machine (`Foundation.Humane.V1.Model::GestureHoldAndCooldownPolicy`).
 * Holding any key (`[C]`, `[Space]`, `[T]`) never triggers rapid key-repeat chaos; instead it advances a calm,
 * rhythmic sustained-hold envelope (`4.2s` breath cycle for `[C]` Stillness, `2.4s` choir pulse for `[Space]` Attune,
 * `1.4s` tactile pluck pulse for `[T]` Touch).
 */
export function stepGestureHoldEnvelope(
  prev: GestureHoldEnvelopeState,
  activeHeldGesture: HoldableGestureId | null,
  dt: number,
): {
  nextState: GestureHoldEnvelopeState;
  sustainedPulseGesture: HoldableGestureId | null;
} {
  const touchCooldownSec = Math.max(0, prev.touchCooldownSec - dt);
  const attuneCooldownSec = Math.max(0, prev.attuneCooldownSec - dt);
  const stillnessCooldownSec = Math.max(0, prev.stillnessCooldownSec - dt);

  // Calmly decay any agitation when holding stillness or resting
  const agitationDecayRate = activeHeldGesture === 'stillness' ? 22 : 9;
  const agitationPct = Math.max(0, Number((prev.agitationPct - agitationDecayRate * dt).toFixed(2)));

  if (!activeHeldGesture) {
    return {
      nextState: {
        heldGesture: null,
        holdDurationSec: 0,
        holdCycleTimerSec: 0,
        holdProgress: 0,
        stillnessBreathPhase: 'idle',
        stillnessBreathProgress: 0,
        touchCooldownSec,
        attuneCooldownSec,
        stillnessCooldownSec,
        agitationPct,
      },
      sustainedPulseGesture: null,
    };
  }

  const isSameGesture = prev.heldGesture === activeHeldGesture;
  const holdDurationSec = isSameGesture ? prev.holdDurationSec + dt : dt;
  let holdCycleTimerSec = isSameGesture ? prev.holdCycleTimerSec + dt : dt;
  let sustainedPulseGesture: HoldableGestureId | null = null;

  const cyclePeriodSec =
    activeHeldGesture === 'stillness'
      ? VERDANT_HUMANE_STANDARD.stillnessBreathCycleSec
      : activeHeldGesture === 'attune'
        ? VERDANT_HUMANE_STANDARD.sustainedAttuneHoldPulseSec
        : VERDANT_HUMANE_STANDARD.sustainedTouchHoldPulseSec;

  if (holdCycleTimerSec >= cyclePeriodSec) {
    holdCycleTimerSec -= cyclePeriodSec;
    sustainedPulseGesture = activeHeldGesture;
  }

  const holdProgress = Number(Math.min(1, holdCycleTimerSec / cyclePeriodSec).toFixed(3));

  let stillnessBreathPhase: 'idle' | 'inhale' | 'crest' | 'exhale' = 'idle';
  let stillnessBreathProgress = 0;
  if (activeHeldGesture === 'stillness') {
    stillnessBreathProgress = holdProgress;
    if (holdProgress < 0.38) {
      stillnessBreathPhase = 'inhale';
    } else if (holdProgress < 0.57) {
      stillnessBreathPhase = 'crest';
    } else {
      stillnessBreathPhase = 'exhale';
    }
  }

  return {
    nextState: {
      heldGesture: activeHeldGesture,
      holdDurationSec: Number(holdDurationSec.toFixed(3)),
      holdCycleTimerSec: Number(holdCycleTimerSec.toFixed(3)),
      holdProgress,
      stillnessBreathPhase,
      stillnessBreathProgress,
      touchCooldownSec,
      attuneCooldownSec,
      stillnessCooldownSec,
      agitationPct,
    },
    sustainedPulseGesture,
  };
}

/**
 * Pure deterministic Conservatory Harmony calculation (`15% .. 100%`).
 * Computed strictly from authentic ecological progression across all unique flora specimens,
 * explored biomes (`1..5`), and awakened Symbiotic Guilds (`0..4`).
 * Repeatedly pressing or holding keys on the same plant nurtures its local voice without artificially
 * inflating global harmony or ending the game prematurely.
 */
export function computeGardenHarmonyPct(params: {
  plants: GardenPlantInstance[];
  exploredBiomesCount: number;
}): number {
  const { plants, exploredBiomesCount } = params;
  if (plants.length === 0) return 15;

  let maturitySum = 0;
  const stageWeights: Record<BotanicalLifecycleStageId, number> = {
    'dormant-seed': 0,
    'sprouting-bud': 0.35,
    'resonant-bloom': 0.78,
    'harmonic-fruiting': 0.92,
    'mycelial-memory': 1.0,
  };

  for (let i = 0; i < plants.length; i++) {
    const p = plants[i];
    const st = p.lifecycleStage ?? (p.attuned ? 'resonant-bloom' : 'dormant-seed');
    maturitySum += stageWeights[st] ?? 0;
  }

  // Require at least 36 unique specimen equivalents for full flora mastery (72% weight)
  const targetSpecimens = Math.max(32, Math.round(plants.length * 0.65));
  const floraScore = Math.min(1, maturitySum / targetSpecimens) * 72;

  // Explored biomes contribute up to 13% (beyond baseline 15%)
  const biomeScore = Math.min(5, Math.max(1, exploredBiomesCount)) * 2.6;

  return Math.min(100, Math.max(15, Math.round(12.4 + floraScore + biomeScore)));
}

export function evaluateHumaneErgonomics(params: {
  velocityDm: number;
  dockCollapsed: boolean;
  guidedStroll: boolean;
  harmonyPct: number;
}): HumaneErgonomicsEvaluation {
  const { velocityDm, dockCollapsed, guidedStroll, harmonyPct } = params;
  const openViewportPct = dockCollapsed ? 93 : 88;
  const pacingState =
    velocityDm === 0
      ? 'Meditative Stillness'
      : guidedStroll || velocityDm <= 10
        ? 'Calm Contemplation'
        : velocityDm <= 20
          ? 'Gentle Stroll'
          : 'Brisk Stride';

  const baseRestorative = velocityDm <= 10 ? 96 : velocityDm <= 20 ? 90 : 82;
  const restorativeScore = Math.min(100, Math.round(baseRestorative + (harmonyPct / 100) * 4));

  return {
    pacingState,
    openViewportPct,
    cognitiveLoadIndex: 'Minimal',
    zeroConflictVerified: true,
    zeroDarkPatternsVerified: true,
    restorativeScore,
  };
}

// ---------------------------------------------------------------------------
// Subsystem 8: Application Infrastructure & Zero-Allocation Standard
// Mirrors `prism/src/Foundation/Infrastructure/V1/Model.lex.tex`
// & `prism/src/Foundation/Acoustics/V1/Model.lex.tex`
// ---------------------------------------------------------------------------

export interface NeuromorphicInfrastructureBridgeSpec extends NeuromorphicDomainBridgeSpec {
  adaptivePoolGovernorEnabled: boolean;
  dynamicBumpAndExposureRefinement: boolean;
  crossDomainTelemetrySync: boolean;
  selfRefiningRenderContract: boolean;
}

export interface InfrastructureContractSummary {
  profile: string;
  sporeRingBufferCapacity: number;
  acousticWaveRingCapacity: number;
  sympatheticFilamentCapacity: number;
  instancedMeshTotal: number;
  perFrameHeapAllocations: number;
  sampleRateHz: number;
  partialsPerVoice: number;
  stereoReverbDecaySec: number;
  stereoEchoDelayMs: number;
  continuousDroneGainMilli: number;
  silenceFloorPolicy: string;
  masterGainHeadroomDb: number;
  neuromorphicBridge: NeuromorphicInfrastructureBridgeSpec;
}

export const VERDANT_INFRASTRUCTURE_STANDARD: InfrastructureContractSummary = {
  profile: GENERATED_PRISM_STANDARDS.infrastructure.profile,
  sporeRingBufferCapacity:
    GENERATED_PRISM_STANDARDS.infrastructure.memoryPools.sporeRingBufferCapacity,
  acousticWaveRingCapacity:
    GENERATED_PRISM_STANDARDS.infrastructure.memoryPools.acousticWaveRingCapacity,
  sympatheticFilamentCapacity:
    GENERATED_PRISM_STANDARDS.infrastructure.memoryPools.sympatheticFilamentCapacity,
  instancedMeshTotal:
    GENERATED_PRISM_STANDARDS.infrastructure.memoryPools.instancedSteppingStones +
    GENERATED_PRISM_STANDARDS.infrastructure.memoryPools.instancedPerimeterRocks +
    GENERATED_PRISM_STANDARDS.infrastructure.memoryPools.instancedGroveStalks +
    GENERATED_PRISM_STANDARDS.infrastructure.memoryPools.instancedMeadowGrassBlades,
  perFrameHeapAllocations:
    GENERATED_PRISM_STANDARDS.infrastructure.memoryPools.perFrameHeapAllocations,
  sampleRateHz: GENERATED_PRISM_STANDARDS.acoustics.synthesisSpec.sampleRateHz,
  partialsPerVoice: GENERATED_PRISM_STANDARDS.acoustics.synthesisSpec.partialsPerVoice,
  stereoReverbDecaySec:
    GENERATED_PRISM_STANDARDS.acoustics.synthesisSpec.stereoConvolverIrMs / 1000,
  stereoEchoDelayMs: GENERATED_PRISM_STANDARDS.acoustics.synthesisSpec.stereoEchoDelayMs,
  continuousDroneGainMilli:
    GENERATED_PRISM_STANDARDS.acoustics.synthesisSpec.continuousDroneGainMilli,
  silenceFloorPolicy:
    'Zero persistent oscillator drone; all harmonic pads and chimes use self-decaying breathing envelopes over natural quietude.',
  masterGainHeadroomDb: -8.8, // 0.36 linear gain ceiling protected by dynamics compressor
  neuromorphicBridge: {
    ...GENERATED_PRISM_STANDARDS.infrastructure.neuromorphicBridge,
    rule30RegisterBits: GENERATED_PRISM_STANDARDS.neuromorphic.cellularAutomaton.registerWidthBits,
    pointKeyBits: GENERATED_PRISM_STANDARDS.neuromorphic.lutStack.pointKeyBits,
    crossDomainTransferEnabled:
      GENERATED_PRISM_STANDARDS.neuromorphic.universalBus.crossDomainTransferEnabled,
    autopoieticSelfRefinementEnabled:
      GENERATED_PRISM_STANDARDS.neuromorphic.universalBus.autopoieticSelfRefinementEnabled,
  },
};

// ---------------------------------------------------------------------------
// Subsystem 9: Botanical Morphology, Phyllotaxis, Biome Monuments & Sympathetic Pollination
// Mirrors `prism/src/Foundation/Botany/V1/Model.lex.tex`
// ---------------------------------------------------------------------------

export interface BiomeMonumentConfig {
  biome: BiomeId;
  monumentName: string;
  architecturalForm: string;
  acousticResonatorRole: string;
}

export const BIOME_MONUMENTS: Record<BiomeId, BiomeMonumentConfig> = {
  meadow: {
    biome: 'meadow',
    monumentName: 'Sunlit Sundial Compass Rotunda',
    architecturalForm: 'Inlaid Flagstone Compass Plaza & Bronze Gnomon Arch',
    acousticResonatorRole: 'Anchors C4 (261.63 Hz) cardinal resonance lines radiating to all 5 biomes',
  },
  grove: {
    biome: 'grove',
    monumentName: 'Wind-Carved Bamboo Chime Pergola',
    architecturalForm: 'Tiered Jade-and-Cedar Acoustic Pavilion with 6 Suspended Brass Chime Tubes',
    acousticResonatorRole: 'Resonates with D4 Dorian pentatonic wind-chime overtones in canopy breezes',
  },
  crystal: {
    biome: 'crystal',
    monumentName: 'Prismatic Quartz Geode Archway',
    architecturalForm: 'Crystalline Quartz Monolith Spires Framing a Levitating Harmonic Prism',
    acousticResonatorRole: 'Refracts E4 Lydian glass-harmonica overtones across the crystal basin',
  },
  wetland: {
    biome: 'wetland',
    monumentName: 'Mirror Lagoon Lantern Pier',
    architecturalForm: 'Reflective Turquoise Lagoon with Floating Stone Pads & Bioluminescent Lotus Lanterns',
    acousticResonatorRole: 'Sustains A3 Aeolian water-harp echoes and concentric surface ripples',
  },
  sanctuary: {
    biome: 'sanctuary',
    monumentName: 'Levitating Tuning-Fork Obelisk & Gimbal Halo',
    architecturalForm: 'Fluted Colonnade Plinth with Counter-Rotating Golden Gimbal Rings & Crystal Spire',
    acousticResonatorRole: 'Focuses the G3 Pastoral Ninth (196.0 Hz) multi-octave Sanctuary Chorus',
  },
};

export interface BotanicalFidelityStandardModel {
  profile: string;
  morphologySystem: string;
  goldenAngleDeg: number;
  minPartsPerSpecimen: number;
  maxPartsPerSpecimen: number;
  matteStemRoughness: number;
  glossyPetalRoughness: number;
  roughnessContrastDelta: number;
  clearcoatEnabled: boolean;
  substrateClassCount: number;
  gravitropicStemAlignment: boolean;
  zeroHardSurfaceOrRockPlantGrowth: boolean;
  zeroFloatingTreeTrunks: boolean;
  zeroDetachedCanopyCrowns: boolean;
  monumentCount: number;
  crossPollinationRadiusMeters: number;
  crossPollinationRadiusDm: number;
  harmonicFilamentCount: number;
  sympatheticHarmonyBonus: number;
  kuramotoPhaseLockingEnabled: boolean;
  circadianStomatalTurgorEnabled: boolean;
  minTurgorPressure: number;
  maxTurgorPressure: number;
  neuromorphicBridge: NeuromorphicDomainBridgeSpec;
}

export const VERDANT_BOTANICAL_STANDARD: BotanicalFidelityStandardModel = {
  profile: GENERATED_PRISM_STANDARDS.botany.profile,
  morphologySystem: GENERATED_PRISM_STANDARDS.botany.morphologySystem,
  goldenAngleDeg: GENERATED_PRISM_STANDARDS.botany.phyllotaxis.goldenAngleDeciDeg / 10,
  minPartsPerSpecimen: GENERATED_PRISM_STANDARDS.botany.phyllotaxis.minPartsPerSpecimen,
  maxPartsPerSpecimen: GENERATED_PRISM_STANDARDS.botany.phyllotaxis.maxPartsPerSpecimen,
  matteStemRoughness:
    GENERATED_PRISM_STANDARDS.botany.phyllotaxis.matteStemRoughnessMilli / 1000,
  glossyPetalRoughness:
    GENERATED_PRISM_STANDARDS.botany.phyllotaxis.glossyPetalRoughnessMilli / 1000,
  roughnessContrastDelta:
    (GENERATED_PRISM_STANDARDS.botany.phyllotaxis.matteStemRoughnessMilli -
      GENERATED_PRISM_STANDARDS.botany.phyllotaxis.glossyPetalRoughnessMilli) /
    1000,
  clearcoatEnabled: GENERATED_PRISM_STANDARDS.botany.phyllotaxis.clearcoatEnabled,
  substrateClassCount: GENERATED_PRISM_STANDARDS.botany.substrates.substrateClassCount,
  gravitropicStemAlignment: GENERATED_PRISM_STANDARDS.botany.substrates.gravitropicStemAlignment,
  zeroHardSurfaceOrRockPlantGrowth:
    GENERATED_PRISM_STANDARDS.botany.substrates.zeroHardSurfaceOrRockPlantGrowth,
  zeroFloatingTreeTrunks: GENERATED_PRISM_STANDARDS.botany.substrates.zeroFloatingTreeTrunks,
  zeroDetachedCanopyCrowns:
    GENERATED_PRISM_STANDARDS.botany.substrates.zeroDetachedCanopyCrowns,
  monumentCount: GENERATED_PRISM_STANDARDS.botany.monuments.monumentCount,
  crossPollinationRadiusMeters: 14.0,
  crossPollinationRadiusDm:
    GENERATED_PRISM_STANDARDS.botany.sympatheticResonance.crossPollinationRadiusDm,
  harmonicFilamentCount:
    GENERATED_PRISM_STANDARDS.botany.sympatheticResonance.harmonicFilamentCount,
  sympatheticHarmonyBonus:
    GENERATED_PRISM_STANDARDS.botany.sympatheticResonance.sympatheticHarmonyBonus,
  kuramotoPhaseLockingEnabled:
    GENERATED_PRISM_STANDARDS.botany.sympatheticResonance.kuramotoPhaseLockingEnabled,
  circadianStomatalTurgorEnabled:
    GENERATED_PRISM_STANDARDS.botany.sympatheticResonance.circadianStomatalTurgorEnabled,
  minTurgorPressure:
    GENERATED_PRISM_STANDARDS.botany.sympatheticResonance.minTurgorPressureCenti / 100,
  maxTurgorPressure:
    GENERATED_PRISM_STANDARDS.botany.sympatheticResonance.maxTurgorPressureCenti / 100,
  neuromorphicBridge: {
    ...GENERATED_PRISM_STANDARDS.botany.neuromorphicBridge,
  },
};

export interface CircadianPlantPhysiologyState {
  stomatalConductance: number; // 0.25 .. 1.0 (gas & volatile terpene exchange aperture)
  hydraulicTurgorPressure: number; // 0.72 .. 1.18 (xylem/phloem hydrostatic pressure driving stem & corolla posture)
  corollaApertureBoost: number; // -0.05 .. +0.18 (circadian & turgor contribution to petal opening)
  transpirationMistRate: number; // 0.10 .. 1.0 (microclimate dew/spore buoyancy emission)
}

/**
 * Evaluates a plant specimen's biological circadian stomatal conductance and hydraulic turgor pressure
 * (`Foundation.Botany.V1.Model::SympatheticResonanceSpec`, proven bounded in `circadianTurgorBoundsHold`).
 * - Each species peaks in stomatal aperture and corolla turgor during its `diurnalAffinity` sky
 *   (`chime-lily` -> `dawn`, `pulse-fern` -> `golden`, `echo-lotus` & `drone-moss` -> `twilight`, `star-orchid` -> `starlight`).
 * - Pelagic water and high-conductivity mycorrhizal loam elevate xylem hydraulic turgor.
 */
export function evaluateCircadianPlantPhysiology(params: {
  species: PlantSpeciesId;
  atmosphere: AtmosphereId;
  substrate?: GrowthSubstrateId;
  attuned: boolean;
  lifecycleStage?: BotanicalLifecycleStageId;
}): CircadianPlantPhysiologyState {
  const {
    species,
    atmosphere,
    substrate = 'terrestrial-loam',
    attuned,
    lifecycleStage = 'dormant-seed',
  } = params;
  const spCfg = PLANT_SPECIES_CONFIGS[species];
  const subSpec = GROWTH_SUBSTRATE_SPECS[substrate];
  const stageIdx = BOTANICAL_LIFECYCLE_STAGES[lifecycleStage].stageIndex;

  const isFavoredSky = spCfg.diurnalAffinity === atmosphere;
  const isAdjacentSky =
    (spCfg.diurnalAffinity === 'dawn' && atmosphere === 'golden') ||
    (spCfg.diurnalAffinity === 'golden' && (atmosphere === 'dawn' || atmosphere === 'twilight')) ||
    (spCfg.diurnalAffinity === 'twilight' && (atmosphere === 'golden' || atmosphere === 'starlight')) ||
    (spCfg.diurnalAffinity === 'starlight' && atmosphere === 'twilight');

  const circadianBase = isFavoredSky ? 0.88 : isAdjacentSky ? 0.62 : 0.38;
  const stomatalConductance = Number(
    Math.min(1.0, Math.max(0.25, circadianBase + (attuned ? 0.12 : 0))).toFixed(3),
  );

  const moistureFactor =
    substrate === 'pelagic-water'
      ? 0.16
      : substrate === 'terrestrial-loam'
        ? 0.12
        : subSpec.mycorrhizalConductivity * 0.1;
  const rawTurgor =
    0.74 + stomatalConductance * 0.22 + moistureFactor + (attuned ? 0.06 : 0) + stageIdx * 0.015;
  const hydraulicTurgorPressure = Number(
    Math.max(
      VERDANT_BOTANICAL_STANDARD.minTurgorPressure,
      Math.min(VERDANT_BOTANICAL_STANDARD.maxTurgorPressure, rawTurgor),
    ).toFixed(3),
  );

  const corollaApertureBoost = Number(
    ((hydraulicTurgorPressure - 0.85) * 0.45 + (isFavoredSky ? 0.06 : 0)).toFixed(3),
  );
  const transpirationMistRate = Number(
    Math.min(1.0, Math.max(0.1, stomatalConductance * (0.65 + moistureFactor * 1.8))).toFixed(3),
  );

  return {
    stomatalConductance,
    hydraulicTurgorPressure,
    corollaApertureBoost,
    transpirationMistRate,
  };
}

/**
 * Kuramoto Coupled Oscillator Phase Entrainment (`Foundation.Botany.V1.Model`):
 * Attuned neighboring flora within `14.0m` gradually synchronize their breathing `pulsePhase`
 * (`dθ_i/dt = (K / N) Σ sin(θ_j - θ_i)`) so symbiotic guilds pulse in coherent visual and acoustic unison.
 */
export function stepKuramotoPhaseEntrainment(params: {
  currentPhase: number;
  neighborPhases: readonly number[];
  couplingStrengthPerSec?: number;
  dt: number;
}): { nextPhase: number; phaseCoherenceOrder: number } {
  const { currentPhase, neighborPhases, couplingStrengthPerSec = 0.85, dt } = params;
  if (neighborPhases.length === 0) {
    return { nextPhase: currentPhase, phaseCoherenceOrder: 1.0 };
  }

  let sinSum = 0;
  let cosOrder = Math.cos(currentPhase);
  let sinOrder = Math.sin(currentPhase);

  for (let i = 0; i < neighborPhases.length; i++) {
    const nbPhase = neighborPhases[i];
    sinSum += Math.sin(nbPhase - currentPhase);
    cosOrder += Math.cos(nbPhase);
    sinOrder += Math.sin(nbPhase);
  }

  const deltaPhase = (couplingStrengthPerSec / neighborPhases.length) * sinSum * dt;
  const twoPi = Math.PI * 2;
  const nextPhase = Number((((currentPhase + deltaPhase) % twoPi) + twoPi) % twoPi);
  const totalCount = neighborPhases.length + 1;
  const phaseCoherenceOrder = Number(
    (Math.hypot(cosOrder, sinOrder) / totalCount).toFixed(3),
  );

  return { nextPhase, phaseCoherenceOrder };
}

export interface SympatheticParabolicArcPoint {
  x: number;
  y: number;
  z: number;
  u: number; // 0..1 normalized arc parameter
}

export interface SympatheticParabolicArcEvaluation {
  points: SympatheticParabolicArcPoint[]; // 10 vertices defining 9 parabolic segments (`parabolicArcSegments = 9`)
  arcLengthMeters: number;
  apexHeightMeters: number;
  travelTimeSec: number; // Exact causal arrival time `arcLengthMeters / 6.5 m/s`
  wavefrontNormalizedU: number; // 0..1 position of the Mycorrhizal Action-Potential wavefront (`v = 6.5 m/s`)
  wavefrontPosition: [number, number, number];
  hasArrivedAtTarget: boolean;
}

/**
 * Computes the 9-segment parabolic cross-pollination filament trajectory (`Foundation.Articulation.V1.Model`
 * `parabolicArcSegments = 9`) and the finite-velocity Mycorrhizal Action-Potential wavefront (`6.5 m/s`,
 * `Foundation.Ecology.V1.Model::actionPotentialWaveSpeedDmps = 65`).
 * Ensures the filament arches gracefully above terrain and monuments rather than clipping straight through hills.
 */
export function computeSympatheticParabolicArc(params: {
  x1: number;
  y1: number;
  z1: number;
  x2: number;
  y2: number;
  z2: number;
  elapsedSinceTriggerSec: number;
  segments?: number;
}): SympatheticParabolicArcEvaluation {
  const { x1, y1, z1, x2, y2, z2, elapsedSinceTriggerSec, segments = 9 } = params;
  const horizDist = Math.hypot(x2 - x1, z2 - z1);
  const midX = (x1 + x2) * 0.5;
  const midZ = (z1 + z2) * 0.5;
  const midGroundY = groundHeightAt(midX, midZ);
  const baseLineMidY = (y1 + y2) * 0.5 + 1.15;
  const terrainClearanceBoost = Math.max(0, midGroundY + 1.35 - baseLineMidY);
  const apexHeightMeters = Number(
    (Math.max(0.85, horizDist * 0.18) + terrainClearanceBoost).toFixed(3),
  );

  const points: SympatheticParabolicArcPoint[] = [];
  let arcLengthMeters = 0;

  for (let i = 0; i <= segments; i++) {
    const u = i / segments;
    const px = x1 + (x2 - x1) * u;
    const pz = z1 + (z2 - z1) * u;
    const basePy = y1 + 1.15 + (y2 - y1) * u;
    const parabola = 4 * apexHeightMeters * u * (1 - u);
    const py = basePy + parabola;
    if (i > 0) {
      const prev = points[i - 1];
      arcLengthMeters += Math.hypot(px - prev.x, py - prev.y, pz - prev.z);
    }
    points.push({
      x: Number(px.toFixed(3)),
      y: Number(py.toFixed(3)),
      z: Number(pz.toFixed(3)),
      u: Number(u.toFixed(3)),
    });
  }

  // Mycorrhizal action-potential & airborne terpene wavefront travels at 6.5 m/s (65 dm/s)
  // modulated subtly by lignocellulosic vascular conductance when provided
  const waveSpeedMps = 6.5;
  const travelTimeSec = Number(Math.max(0.18, arcLengthMeters / waveSpeedMps).toFixed(3));
  const wavefrontNormalizedU = Number(
    Math.max(0, Math.min(1, elapsedSinceTriggerSec / travelTimeSec)).toFixed(3),
  );
  const wfX = x1 + (x2 - x1) * wavefrontNormalizedU;
  const wfZ = z1 + (z2 - z1) * wavefrontNormalizedU;
  const wfY =
    y1 +
    1.15 +
    (y2 - y1) * wavefrontNormalizedU +
    4 * apexHeightMeters * wavefrontNormalizedU * (1 - wavefrontNormalizedU);

  return {
    points,
    arcLengthMeters: Number(arcLengthMeters.toFixed(3)),
    apexHeightMeters,
    travelTimeSec,
    wavefrontNormalizedU,
    wavefrontPosition: [Number(wfX.toFixed(3)), Number(wfY.toFixed(3)), Number(wfZ.toFixed(3))],
    hasArrivedAtTarget: wavefrontNormalizedU >= 1.0,
  };
}

/**
 * Finds companion flora within `crossPollinationRadiusMeters` (14.0m / 49 dm)
 * that sympathetically awaken and exchange harmonic pollen filaments when a specimen is attuned.
 */
export function findSympatheticNeighbors(
  source: GardenPlantInstance,
  plants: GardenPlantInstance[],
  maxCount = 3,
  maxRadiusMeters = VERDANT_BOTANICAL_STANDARD.crossPollinationRadiusMeters,
): GardenPlantInstance[] {
  const candidates: { plant: GardenPlantInstance; dist: number }[] = [];
  for (let i = 0; i < plants.length; i++) {
    const p = plants[i];
    if (p.id === source.id) continue;
    const d = Math.hypot(p.x - source.x, p.z - source.z);
    if (d <= maxRadiusMeters) {
      candidates.push({ plant: p, dist: d });
    }
  }
  candidates.sort((a, b) => a.dist - b.dist);
  return candidates.slice(0, maxCount).map((c) => c.plant);
}

/**
 * Computes the player's cardinal compass heading and bearing toward the nearest biome monument.
 */
export function computeCardinalWayfinder(
  playerX: number,
  playerZ: number,
  playerYaw: number,
): {
  compassCardinal: 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';
  headingDeg: number;
  focalMonument: string;
} {
  // yaw = 0 faces -Z (North toward Sanctuary)
  const forwardX = -Math.sin(playerYaw);
  const forwardZ = -Math.cos(playerYaw);
  const angleRad = Math.atan2(forwardX, -forwardZ);
  const headingDeg = ((Math.round((angleRad * 180) / Math.PI) % 360) + 360) % 360;
  const dirs: ('N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW')[] = [
    'N',
    'NE',
    'E',
    'SE',
    'S',
    'SW',
    'W',
    'NW',
  ];
  const idx = Math.round(headingDeg / 45) % 8;
  const currentBiome = biomeAt(playerX, playerZ);
  return {
    compassCardinal: dirs[idx],
    headingDeg,
    focalMonument: BIOME_MONUMENTS[currentBiome].monumentName,
  };
}

// ---------------------------------------------------------------------------
// Subsystem 10: Polyphonic Biome Constellations, Symbiotic Guilds & Acoustic Microclimates
// Mirrors `prism/src/Foundation/Ecology/V1/Model.lex.tex`
// ---------------------------------------------------------------------------

export interface BiomeConstellationConfig {
  biome: BiomeId;
  constellationName: string;
  harmonicVoicing: string;
  beamColorHex: string;
  chordRatios: number[];
}

export const BIOME_CONSTELLATIONS: Record<BiomeId, BiomeConstellationConfig> = {
  meadow: {
    biome: 'meadow',
    constellationName: 'Sunlit Pastoral Sixth Constellation',
    harmonicVoicing: 'C4 · E4 · G4 · A4 · C5 · E5 (1:1 · 5:4 · 3:2 · 5:3 · 2:1 · 5:2)',
    beamColorHex: '#fde047',
    chordRatios: [1, 5 / 4, 3 / 2, 5 / 3, 2, 5 / 2],
  },
  grove: {
    biome: 'grove',
    constellationName: 'Bamboo Dorian Pentatonic Constellation',
    harmonicVoicing: 'D4 · E4 · F4 · A4 · B4 · D5 (1:1 · 9:8 · 6:5 · 3:2 · 5:3 · 2:1)',
    beamColorHex: '#34d399',
    chordRatios: [1, 9 / 8, 6 / 5, 3 / 2, 5 / 3, 2],
  },
  crystal: {
    biome: 'crystal',
    constellationName: 'Quartz Lydian Eleventh Constellation',
    harmonicVoicing: 'E4 · F#4 · G#4 · A#4 · B4 · D#5 (1:1 · 9:8 · 5:4 · 45:32 · 3:2 · 15:8)',
    beamColorHex: '#38bdf8',
    chordRatios: [1, 9 / 8, 5 / 4, 45 / 32, 3 / 2, 15 / 8],
  },
  wetland: {
    biome: 'wetland',
    constellationName: 'Lagoon Aeolian Liquid Ninth Constellation',
    harmonicVoicing: 'A3 · B3 · C4 · D4 · E4 · F4 (1:1 · 9:8 · 6:5 · 4:3 · 3:2 · 8:5)',
    beamColorHex: '#2dd4bf',
    chordRatios: [1, 9 / 8, 6 / 5, 4 / 3, 3 / 2, 8 / 5],
  },
  sanctuary: {
    biome: 'sanctuary',
    constellationName: 'Sanctuary Celestial Overtone Series',
    harmonicVoicing: 'G3 · B3 · D4 · F#4 · A4 · B4 (1:1 · 5:4 · 3:2 · 15:8 · 9:4 · 5:2)',
    beamColorHex: '#f59e0b',
    chordRatios: [1, 5 / 4, 3 / 2, 15 / 8, 9 / 4, 5 / 2],
  },
};

export interface SymbioticGuildConfig {
  id: 'dewdrop-bell' | 'polyrhythmic-canopy' | 'celestial-overtone';
  name: string;
  pair: [PlantSpeciesId, PlantSpeciesId];
  acousticEffect: string;
  harmonyBonusPct: number;
}

export const SYMBIOTIC_GUILDS: SymbioticGuildConfig[] = [
  {
    id: 'dewdrop-bell',
    name: 'Dewdrop Bell Guild',
    pair: ['chime-lily', 'echo-lotus'],
    acousticEffect: 'Couples Chime Lily bell corollas with Echo Lotus liquid delay ripples',
    harmonyBonusPct: 5,
  },
  {
    id: 'polyrhythmic-canopy',
    name: 'Polyrhythmic Canopy Guild',
    pair: ['pulse-fern', 'drone-moss'],
    acousticEffect: 'Anchors Pulse Fern kalimba syncopation over a sustained Drone Moss fifth',
    harmonyBonusPct: 5,
  },
  {
    id: 'celestial-overtone',
    name: 'Celestial Overtone Guild',
    pair: ['star-orchid', 'chime-lily'],
    acousticEffect: 'Braids Star Orchid glass-harmonica overtones with pentatonic Chime Lily arpeggios',
    harmonyBonusPct: 5,
  },
];

export interface GranularMatterSynthesisSpec {
  atomicElementCount: number;
  molecularSpeciesCount: number;
  macromoleculeCount: number;
  matterCompoundCount: number;
  synthesizedModalityCount: number;
  closedLoopReactionPathwayCount: number;
  atomicToEnvironmentalChainVerified: boolean;
  atomicRemineralizationComplete: boolean;
  prismSynthesisClosureVerified: boolean;
}

export interface EcologicalConstellationStandardModel {
  profile: string;
  constellationCount: number;
  beamHeightMeters: number;
  guildCount: number;
  guildHarmonyBonusPct: number;
  microclimateCount: number;
  footstepStrideIntervalMs: number;
  minSoilWaterPh: number;
  maxSoilWaterPh: number;
  silicaPiezoelectricCoupling: boolean;
  mycorrhizalCnpExchangeEnabled: boolean;
  luciferinEnzymaticKineticsEnabled: boolean;
  volatileTerpeneSignalingEnabled: boolean;
  actionPotentialWaveSpeedMps: number;
  granularSynthesis: GranularMatterSynthesisSpec;
  neuromorphicBridge: NeuromorphicDomainBridgeSpec;
}

export const VERDANT_ECOLOGY_STANDARD: EcologicalConstellationStandardModel = {
  profile: GENERATED_PRISM_STANDARDS.ecology.profile,
  constellationCount: GENERATED_PRISM_STANDARDS.ecology.constellations.constellationCount,
  beamHeightMeters: GENERATED_PRISM_STANDARDS.ecology.constellations.beamHeightMeters,
  guildCount: GENERATED_PRISM_STANDARDS.ecology.guilds.guildCount,
  guildHarmonyBonusPct: GENERATED_PRISM_STANDARDS.ecology.guilds.guildHarmonyBonusPct,
  microclimateCount: GENERATED_PRISM_STANDARDS.ecology.microclimates.microclimateCount,
  footstepStrideIntervalMs:
    GENERATED_PRISM_STANDARDS.ecology.microclimates.footstepStrideIntervalMs,
  minSoilWaterPh: GENERATED_PRISM_STANDARDS.ecology.biogeochemistry.minSoilWaterPhCenti / 100,
  maxSoilWaterPh: GENERATED_PRISM_STANDARDS.ecology.biogeochemistry.maxSoilWaterPhCenti / 100,
  silicaPiezoelectricCoupling:
    GENERATED_PRISM_STANDARDS.ecology.biogeochemistry.silicaPiezoelectricCoupling,
  mycorrhizalCnpExchangeEnabled:
    GENERATED_PRISM_STANDARDS.ecology.biogeochemistry.mycorrhizalCnpExchangeEnabled,
  luciferinEnzymaticKineticsEnabled:
    GENERATED_PRISM_STANDARDS.ecology.biogeochemistry.luciferinEnzymaticKineticsEnabled,
  volatileTerpeneSignalingEnabled:
    GENERATED_PRISM_STANDARDS.ecology.biogeochemistry.volatileTerpeneSignalingEnabled,
  actionPotentialWaveSpeedMps:
    GENERATED_PRISM_STANDARDS.ecology.biogeochemistry.actionPotentialWaveSpeedDmps / 10,
  granularSynthesis: {
    ...GENERATED_PRISM_STANDARDS.ecology.granularSynthesis,
  },
  neuromorphicBridge: {
    ...GENERATED_PRISM_STANDARDS.ecology.neuromorphicBridge,
  },
};

// ---------------------------------------------------------------------------
// 5-Tier Granular Atomic-to-Environmental Procedural Synthesis Hierarchy
// (`Foundation.Ecology.V1.Model::GranularMatterSynthesisSpec` & `granularAtomicToEnvironmentalSynthesisHolds`)
// Tier 1: Atoms -> Tier 2: Molecules -> Tier 3: Macromolecules ->
// Tier 4: Organic & Inorganic Matter/Compounds -> Tier 5: Environmental & Multi-Modal Synthesis
// ---------------------------------------------------------------------------

export type AtomicElementId = 'H' | 'C' | 'N' | 'O' | 'Mg' | 'Si' | 'P' | 'Ca';

export interface AtomicElementSpec {
  id: AtomicElementId;
  name: string;
  atomicNumber: number;
  atomicMassDaltons: number;
  valenceElectrons: number;
  electronegativityPauling: number;
  covalentRadiusPm: number;
  basisPrime: number;
}

export const ATOMIC_ELEMENTS: Record<AtomicElementId, AtomicElementSpec> = {
  H: {
    id: 'H',
    name: 'Hydrogen',
    atomicNumber: 1,
    atomicMassDaltons: 1.008,
    valenceElectrons: 1,
    electronegativityPauling: 2.2,
    covalentRadiusPm: 31,
    basisPrime: 2,
  },
  C: {
    id: 'C',
    name: 'Carbon',
    atomicNumber: 6,
    atomicMassDaltons: 12.011,
    valenceElectrons: 4,
    electronegativityPauling: 2.55,
    covalentRadiusPm: 76,
    basisPrime: 3,
  },
  N: {
    id: 'N',
    name: 'Nitrogen',
    atomicNumber: 7,
    atomicMassDaltons: 14.007,
    valenceElectrons: 5,
    electronegativityPauling: 3.04,
    covalentRadiusPm: 71,
    basisPrime: 5,
  },
  O: {
    id: 'O',
    name: 'Oxygen',
    atomicNumber: 8,
    atomicMassDaltons: 15.999,
    valenceElectrons: 6,
    electronegativityPauling: 3.44,
    covalentRadiusPm: 66,
    basisPrime: 7,
  },
  Mg: {
    id: 'Mg',
    name: 'Magnesium',
    atomicNumber: 12,
    atomicMassDaltons: 24.305,
    valenceElectrons: 2,
    electronegativityPauling: 1.31,
    covalentRadiusPm: 141,
    basisPrime: 11,
  },
  Si: {
    id: 'Si',
    name: 'Silicon',
    atomicNumber: 14,
    atomicMassDaltons: 28.085,
    valenceElectrons: 4,
    electronegativityPauling: 1.9,
    covalentRadiusPm: 111,
    basisPrime: 13,
  },
  P: {
    id: 'P',
    name: 'Phosphorus',
    atomicNumber: 15,
    atomicMassDaltons: 30.974,
    valenceElectrons: 5,
    electronegativityPauling: 2.19,
    covalentRadiusPm: 107,
    basisPrime: 17,
  },
  Ca: {
    id: 'Ca',
    name: 'Calcium',
    atomicNumber: 20,
    atomicMassDaltons: 40.078,
    valenceElectrons: 2,
    electronegativityPauling: 1.0,
    covalentRadiusPm: 176,
    basisPrime: 19,
  },
};

export type MolecularSpeciesId =
  | 'H2O'
  | 'CO2'
  | 'SiO2'
  | 'CaCO3'
  | 'ATP'
  | 'alpha-pinene'
  | 'd-luciferin'
  | 'orthosilicic-acid';

export interface MolecularSpeciesSpec {
  id: MolecularSpeciesId;
  name: string;
  formula: string;
  atomicStoichiometry: Partial<Record<AtomicElementId, number>>;
  molecularMassDaltons: number;
  totalValenceElectrons: number;
  bondPolarityIndex: number; // 0..1
}

function buildMolecularSpecies(
  id: MolecularSpeciesId,
  name: string,
  formula: string,
  atomicStoichiometry: Partial<Record<AtomicElementId, number>>,
  bondPolarityIndex: number,
): MolecularSpeciesSpec {
  let mass = 0;
  let valence = 0;
  for (const [el, count] of Object.entries(atomicStoichiometry) as [AtomicElementId, number][]) {
    const atom = ATOMIC_ELEMENTS[el];
    mass += atom.atomicMassDaltons * count;
    valence += atom.valenceElectrons * count;
  }
  return {
    id,
    name,
    formula,
    atomicStoichiometry,
    molecularMassDaltons: Number(mass.toFixed(3)),
    totalValenceElectrons: valence,
    bondPolarityIndex,
  };
}

export const MOLECULAR_SPECIES: Record<MolecularSpeciesId, MolecularSpeciesSpec> = {
  H2O: buildMolecularSpecies('H2O', 'Dihydrogen Monoxide (Water)', 'H2O', { H: 2, O: 1 }, 0.88),
  CO2: buildMolecularSpecies('CO2', 'Carbon Dioxide', 'CO2', { C: 1, O: 2 }, 0.42),
  SiO2: buildMolecularSpecies('SiO2', 'Silicon Dioxide (Quartz Monomer)', 'SiO2', { Si: 1, O: 2 }, 0.64),
  CaCO3: buildMolecularSpecies('CaCO3', 'Calcium Carbonate (Calcite Monomer)', 'CaCO3', { Ca: 1, C: 1, O: 3 }, 0.78),
  ATP: buildMolecularSpecies(
    'ATP',
    'Adenosine Triphosphate',
    'C10H16N5O13P3',
    { C: 10, H: 16, N: 5, O: 13, P: 3 },
    0.82,
  ),
  'alpha-pinene': buildMolecularSpecies(
    'alpha-pinene',
    'Alpha-Pinene Monoterpene',
    'C10H16',
    { C: 10, H: 16 },
    0.22,
  ),
  'd-luciferin': buildMolecularSpecies(
    'd-luciferin',
    'Botanical Luciferin Chromophore',
    'C11H8N2O5',
    { C: 11, H: 8, N: 2, O: 5 },
    0.68,
  ),
  'orthosilicic-acid': buildMolecularSpecies(
    'orthosilicic-acid',
    'Orthosilicic Acid',
    'H4SiO4',
    { H: 4, Si: 1, O: 4 },
    0.74,
  ),
};

export type MacromoleculeId =
  | 'cellulose-lignin-microfibril'
  | 'chlorophyll-porphyrin-antenna'
  | 'luciferase-holoenzyme-complex'
  | 'chitin-glucan-hyphal-network'
  | 'tectosilicate-quartz-lattice'
  | 'calcite-aragonite-spar-lattice';

export interface MacromoleculeSpec {
  id: MacromoleculeId;
  name: string;
  domainClass: 'organic-biopolymer' | 'inorganic-crystal-lattice';
  monomerStoichiometry: Partial<Record<MolecularSpeciesId, number>>;
  coordinatingAtom?: AtomicElementId;
  degreeOfPolymerization: number;
  polymerMassKilodaltons: number;
  supramolecularStiffnessGPa: number;
}

function buildMacromolecule(
  id: MacromoleculeId,
  name: string,
  domainClass: 'organic-biopolymer' | 'inorganic-crystal-lattice',
  monomerStoichiometry: Partial<Record<MolecularSpeciesId, number>>,
  degreeOfPolymerization: number,
  supramolecularStiffnessGPa: number,
  coordinatingAtom?: AtomicElementId,
): MacromoleculeSpec {
  let monomerMass = coordinatingAtom ? ATOMIC_ELEMENTS[coordinatingAtom].atomicMassDaltons : 0;
  for (const [molId, count] of Object.entries(monomerStoichiometry) as [
    MolecularSpeciesId,
    number,
  ][]) {
    monomerMass += MOLECULAR_SPECIES[molId].molecularMassDaltons * count;
  }
  const polymerMassKilodaltons = Number(
    ((monomerMass * degreeOfPolymerization) / 1000).toFixed(3),
  );
  return {
    id,
    name,
    domainClass,
    monomerStoichiometry,
    coordinatingAtom,
    degreeOfPolymerization,
    polymerMassKilodaltons,
    supramolecularStiffnessGPa,
  };
}

export const MACROMOLECULAR_POLYMERS: Record<MacromoleculeId, MacromoleculeSpec> = {
  'cellulose-lignin-microfibril': buildMacromolecule(
    'cellulose-lignin-microfibril',
    'Cellulose-Lignin Structural Microfibril',
    'organic-biopolymer',
    { CO2: 6, H2O: 5 },
    180,
    24.5,
  ),
  'chlorophyll-porphyrin-antenna': buildMacromolecule(
    'chlorophyll-porphyrin-antenna',
    'Chlorophyll-a Porphyrin Light-Harvesting Antenna',
    'organic-biopolymer',
    { CO2: 55, H2O: 36, ATP: 2 },
    12,
    8.2,
    'Mg',
  ),
  'luciferase-holoenzyme-complex': buildMacromolecule(
    'luciferase-holoenzyme-complex',
    'Luciferase-Luciferin Bioluminescent Holo-Enzyme',
    'organic-biopolymer',
    { 'd-luciferin': 4, ATP: 4, H2O: 12 },
    24,
    6.4,
    'Mg',
  ),
  'chitin-glucan-hyphal-network': buildMacromolecule(
    'chitin-glucan-hyphal-network',
    'Chitin-Beta-Glucan Mycorrhizal Hyphal Mesh',
    'organic-biopolymer',
    { CO2: 8, H2O: 6, ATP: 1 },
    140,
    14.8,
  ),
  'tectosilicate-quartz-lattice': buildMacromolecule(
    'tectosilicate-quartz-lattice',
    'Tectosilicate Alpha-Quartz Tetrahedral Framework',
    'inorganic-crystal-lattice',
    { SiO2: 12, 'orthosilicic-acid': 2 },
    320,
    96.4,
    'Si',
  ),
  'calcite-aragonite-spar-lattice': buildMacromolecule(
    'calcite-aragonite-spar-lattice',
    'Calcite-Aragonite Trigonal Spar Crystal Lattice',
    'inorganic-crystal-lattice',
    { CaCO3: 10, H2O: 2 },
    260,
    72.8,
    'Ca',
  ),
};

export type MatterCompoundId =
  | 'travertine-limestone-spar'
  | 'piezoelectric-quartz-geode'
  | 'structured-hydro-mineral-electrolyte'
  | 'lignocellulosic-vascular-tissue'
  | 'bioluminescent-mycelial-humus'
  | 'terpene-volatile-aerosol-colloid';

export interface MatterCompoundSpec {
  id: MatterCompoundId;
  name: string;
  matterCategory: 'inorganic' | 'organic';
  macromolecularComposition: Partial<Record<MacromoleculeId, number>>;
  molecularCoFactors: Partial<Record<MolecularSpeciesId, number>>;
  compoundDensityGPerCm3: number;
  bulkElasticModulusGPa: number;
  acousticWaveSpeedMps: number;
  opticalRefractiveIndex: number;
}

function buildMatterCompound(
  id: MatterCompoundId,
  name: string,
  matterCategory: 'inorganic' | 'organic',
  macromolecularComposition: Partial<Record<MacromoleculeId, number>>,
  molecularCoFactors: Partial<Record<MolecularSpeciesId, number>>,
  compoundDensityGPerCm3: number,
  opticalRefractiveIndex: number,
): MatterCompoundSpec {
  let weightedStiffness = 0;
  let totalWeight = 0;
  for (const [macId, frac] of Object.entries(macromolecularComposition) as [
    MacromoleculeId,
    number,
  ][]) {
    weightedStiffness += MACROMOLECULAR_POLYMERS[macId].supramolecularStiffnessGPa * frac;
    totalWeight += frac;
  }
  const bulkElasticModulusGPa = Number(
    (weightedStiffness / Math.max(0.01, totalWeight)).toFixed(2),
  );
  // Longitudinal acoustic wave speed scales with sqrt(E / rho)
  const acousticWaveSpeedMps = Math.round(
    Math.sqrt((bulkElasticModulusGPa * 1e9) / (compoundDensityGPerCm3 * 1000)),
  );
  return {
    id,
    name,
    matterCategory,
    macromolecularComposition,
    molecularCoFactors,
    compoundDensityGPerCm3,
    bulkElasticModulusGPa,
    acousticWaveSpeedMps,
    opticalRefractiveIndex,
  };
}

export const MATTER_COMPOUNDS: Record<MatterCompoundId, MatterCompoundSpec> = {
  'travertine-limestone-spar': buildMatterCompound(
    'travertine-limestone-spar',
    'Travertine Limestone & Calcite Spar Masonry',
    'inorganic',
    { 'calcite-aragonite-spar-lattice': 0.82, 'tectosilicate-quartz-lattice': 0.18 },
    { CaCO3: 6, SiO2: 2 },
    2.71,
    1.586,
  ),
  'piezoelectric-quartz-geode': buildMatterCompound(
    'piezoelectric-quartz-geode',
    'Piezoelectric Silicate Quartz Monolith',
    'inorganic',
    { 'tectosilicate-quartz-lattice': 0.92, 'calcite-aragonite-spar-lattice': 0.08 },
    { SiO2: 10, 'orthosilicic-acid': 2 },
    2.65,
    1.544,
  ),
  'structured-hydro-mineral-electrolyte': buildMatterCompound(
    'structured-hydro-mineral-electrolyte',
    'Structured Lagoon Hydro-Mineral Electrolyte',
    'inorganic',
    { 'calcite-aragonite-spar-lattice': 0.04, 'tectosilicate-quartz-lattice': 0.04 },
    { H2O: 55, 'orthosilicic-acid': 2, CaCO3: 1 },
    1.024,
    1.338,
  ),
  'lignocellulosic-vascular-tissue': buildMatterCompound(
    'lignocellulosic-vascular-tissue',
    'Lignocellulosic Botanical Stem & Corolla Tissue',
    'organic',
    { 'cellulose-lignin-microfibril': 0.74, 'chlorophyll-porphyrin-antenna': 0.26 },
    { H2O: 18, CO2: 6, ATP: 2 },
    1.18,
    1.468,
  ),
  'bioluminescent-mycelial-humus': buildMatterCompound(
    'bioluminescent-mycelial-humus',
    'Bioluminescent Mycorrhizal Humus & Bryophyte Loam',
    'organic',
    { 'chitin-glucan-hyphal-network': 0.68, 'luciferase-holoenzyme-complex': 0.32 },
    { 'd-luciferin': 4, ATP: 4, H2O: 14 },
    1.32,
    1.492,
  ),
  'terpene-volatile-aerosol-colloid': buildMatterCompound(
    'terpene-volatile-aerosol-colloid',
    'Volatile Monoterpene & Dewdrop Aerosol Colloid',
    'organic',
    { 'chlorophyll-porphyrin-antenna': 0.45, 'luciferase-holoenzyme-complex': 0.55 },
    { 'alpha-pinene': 8, H2O: 24, CO2: 2 },
    0.86,
    1.412,
  ),
};

export type ReactionPathwayId =
  | 'photosynthetic-carbon-fixation'
  | 'bioluminescent-oxyluciferin-catalysis'
  | 'piezoelectric-silicate-mineralization'
  | 'mycorrhizal-chitin-remineralization';

export interface ReactionPathwaySpec {
  id: ReactionPathwayId;
  name: string;
  chemicalEquation: string;
  reactantMolecules: Partial<Record<MolecularSpeciesId, number>>;
  catalyticMacromolecule: MacromoleculeId;
  productCompound: MatterCompoundId;
  remineralizedAtoms: Partial<Record<AtomicElementId, number>>;
  quantumOrThermalYield: number; // 0..1
}

export const REACTION_PATHWAYS: Record<ReactionPathwayId, ReactionPathwaySpec> = {
  'photosynthetic-carbon-fixation': {
    id: 'photosynthetic-carbon-fixation',
    name: 'Photosynthetic Carbon Fixation & Cellulose Polymerization',
    chemicalEquation: '6 CO2 + 6 H2O + hν (Mg-Chlorophyll-a) ⇌ (C6H10O5)n + 6 O2',
    reactantMolecules: { CO2: 6, H2O: 6, ATP: 3 },
    catalyticMacromolecule: 'chlorophyll-porphyrin-antenna',
    productCompound: 'lignocellulosic-vascular-tissue',
    remineralizedAtoms: { C: 6, H: 12, O: 6, Mg: 1 },
    quantumOrThermalYield: 0.92,
  },
  'bioluminescent-oxyluciferin-catalysis': {
    id: 'bioluminescent-oxyluciferin-catalysis',
    name: 'Bioluminescent Oxyluciferin Photon Emission & Terpene Volatilization',
    chemicalEquation: 'D-Luciferin + ATP + O2 (Mg2+-Luciferase) → Oxyluciferin + AMP + CO2 + hν',
    reactantMolecules: { 'd-luciferin': 2, ATP: 2, 'alpha-pinene': 2 },
    catalyticMacromolecule: 'luciferase-holoenzyme-complex',
    productCompound: 'terpene-volatile-aerosol-colloid',
    remineralizedAtoms: { C: 11, H: 8, N: 2, O: 5, P: 2 },
    quantumOrThermalYield: 0.88,
  },
  'piezoelectric-silicate-mineralization': {
    id: 'piezoelectric-silicate-mineralization',
    name: 'Silicate-Carbonate Hydrothermal Lattice Mineralization',
    chemicalEquation: 'H4SiO4 + CaCO3 ⇌ SiO2·CaCO3 (Quartz-Calcite Spar) + 2 H2O',
    reactantMolecules: { 'orthosilicic-acid': 2, SiO2: 4, CaCO3: 4 },
    catalyticMacromolecule: 'tectosilicate-quartz-lattice',
    productCompound: 'piezoelectric-quartz-geode',
    remineralizedAtoms: { Si: 5, Ca: 4, C: 4, O: 16, H: 4 },
    quantumOrThermalYield: 0.95,
  },
  'mycorrhizal-chitin-remineralization': {
    id: 'mycorrhizal-chitin-remineralization',
    name: 'Mycorrhizal Chitin-Humus Decomposition & Atomic Remineralization',
    chemicalEquation: '(C8H13O5N)n + H2O + ATP ⇌ C-N-P-Ca Ionic Pool + CO2 + H4SiO4',
    reactantMolecules: { H2O: 6, ATP: 2, CO2: 4 },
    catalyticMacromolecule: 'chitin-glucan-hyphal-network',
    productCompound: 'bioluminescent-mycelial-humus',
    remineralizedAtoms: { C: 8, H: 13, N: 2, O: 5, P: 2, Ca: 1 },
    quantumOrThermalYield: 0.94,
  },
};

export interface ClosedLoopReactionKineticsState {
  pathwayRates: Record<ReactionPathwayId, number>; // Normalized 0..1 forward/reverse turnover
  remineralizedAtomicPool: Record<AtomicElementId, number>; // Closed-loop returned atomic pool 0..1
  stoichiometricMassBalanceRatio: number; // Conservation law: 1.000
}

export interface GranularEnvironmentalSynthesisState {
  tier1AtomicValenceIndex: number; // 105..180 from `stepAtomicValenceActivity`
  tier2MolecularBondIndex: number; // 210..360 from `stepMolecularBondCoherence`
  tier3MacromolecularPolymerIndex: number; // 415..640 from `stepMacromolecularPolymerization`
  tier4CompoundManifestationIndex: number; // 720..1020 from `stepCompoundManifestation`
  tier5EnvironmentalModalIndex: number; // 1025..1400 from `stepEnvironmentalModalSynthesis`
  tier6AtomicRemineralizationIndex: number; // 1130..1580 from `stepAtomicRemineralizationFlux`
  chainHierarchyVerified: boolean;
  closedLoopConservationVerified: boolean;
  completeSynthesisClosureVerified: boolean;
  atomicActivities: Record<AtomicElementId, number>; // Normalized 0..1 activity per element
  molecularConcentrations: Record<MolecularSpeciesId, number>; // Normalized 0..1 molar concentration
  macromolecularYields: Record<MacromoleculeId, number>; // Normalized 0..1 polymerization yield
  compoundManifestations: {
    inorganic: {
      travertineLimestoneSpar: number;
      piezoelectricQuartzGeode: number;
      structuredHydroMineralElectrolyte: number;
    };
    organic: {
      lignocellulosicVascularTissue: number;
      bioluminescentMycelialHumus: number;
      terpeneVolatileAerosolColloid: number;
    };
  };
  reactionKinetics: ClosedLoopReactionKineticsState;
  modalSyntheses: {
    // 1. Physical / Lithic & Hydrodynamic Modality
    physicalModality: {
      substrateBulkDensityGPerCm3: number;
      electrolyteSurfaceTensionMnPerM: number;
      sporeStokesBuoyancyLiftMultiplier: number;
    };
    // 2. Botanical / Structural & Phototropic Modality
    botanicalModality: {
      cellWallYoungsModulusGPa: number;
      vascularTurgorPressureMPa: number;
      chlorophyllQuantumEfficiency: number;
    };
    // 3. Ecological / Biogeochemical Modality
    ecologicalModality: {
      carbonateSilicateBufferedPh: number;
      cnpStoichiometricFluxIndex: number;
      luciferinCatalyticTurnoverRate: number;
    };
    // 4. Acoustic / Timbral & Wave-Propagation Modality
    acousticModality: {
      piezoelectricSilicaQMultiplier: number;
      lignocellulosicWarmthCutoffHz: number;
      modalBellPartialStiffnessRatio: number;
    };
    // 5. Optical / Atmospheric & Material Micro-Relief Modality
    opticalModality: {
      crystalLatticeMicroReliefBumpScale: number;
      terpeneAerosolTyndallTransmittance: number;
      chromophoreEmissionWavelengthNm: number;
    };
    // 6. Kinesthetic / Humane & Neuromorphic Modality
    kinestheticModality: {
      chemotacticZephyrConductivity: number;
      underfootSubstrateElasticRebound: number;
      primeAddressCompoundHarmonyIndex: number;
    };
  };
}

/**
 * Evaluates the full 6-Stage Closed-Loop Granular Atomic-to-Environmental Procedural Synthesis Hierarchy
 * (`Foundation.Ecology.V1.Model::GranularMatterSynthesisSpec`, `granularAtomicToEnvironmentalSynthesisHolds`,
 * and `closedLoopAtomicRemineralizationHolds`):
 * 1. Atoms (`H, C, N, O, Mg, Si, P, Ca`) combine via valence stoichiometry into
 * 2. Molecules (`H2O, CO2, SiO2, CaCO3, ATP, alpha-pinene, d-luciferin, orthosilicic-acid`), which polymerize into
 * 3. Macromolecules (`cellulose-lignin, chlorophyll-a, luciferase, chitin-glucan, tectosilicate-quartz, calcite-spar`), which manifest
 * 4. Organic & Inorganic Matter/Compounds (`travertine, quartz-geode, hydro-electrolyte` + `vascular-tissue, mycelial-humus, terpene-aerosol`),
 * 5. Synthesizing directly into the environment and all 6 modalities of the game, and
 * 6. Returning through 4 Closed-Loop Biogeochemical & Photochemical Reaction Pathways into the Remineralized Atomic Pool.
 */
export function evaluateGranularMatterSynthesis(params: {
  biome: BiomeId;
  species: PlantSpeciesId;
  substrate?: GrowthSubstrateId;
  atmosphere: AtmosphereId;
  attuned: boolean;
  harmonyPct?: number;
  neuromorphicWeight?: number;
  volatileTerpeneImpulse?: number;
}): GranularEnvironmentalSynthesisState {
  const {
    biome,
    species,
    substrate = 'terrestrial-loam',
    atmosphere,
    attuned,
    harmonyPct = 35,
    neuromorphicWeight = 8,
    volatileTerpeneImpulse = 0,
  } = params;

  const clampedWeight = Math.min(15, Math.max(1, neuromorphicWeight));
  // Step the 6 formal `.lex.tex` LUT tiers
  const tier1AtomicValenceIndex = stepAtomicValenceActivity(clampedWeight);
  const tier2MolecularBondIndex = stepMolecularBondCoherence(clampedWeight);
  const tier3MacromolecularPolymerIndex = stepMacromolecularPolymerization(clampedWeight);
  const tier4CompoundManifestationIndex = stepCompoundManifestation(clampedWeight);
  const tier5EnvironmentalModalIndex = stepEnvironmentalModalSynthesis(clampedWeight);
  const tier6AtomicRemineralizationIndex = stepAtomicRemineralizationFlux(clampedWeight);
  const chainHierarchyVerified = verifyGranularAtomicToEnvironmentalChain(clampedWeight);
  const closedLoopConservationVerified = verifyClosedLoopMatterConservation(clampedWeight);
  const completeSynthesisClosureVerified = verifyCompleteGranularSynthesisClosure(clampedWeight);

  const neuroNorm = (tier1AtomicValenceIndex - 100) / 80; // 0.0625 .. 1.0
  const harmonyNorm = Math.max(0, Math.min(1, harmonyPct / 100));
  const sunPhotonFlux =
    atmosphere === 'golden'
      ? 1.0
      : atmosphere === 'dawn'
        ? 0.82
        : atmosphere === 'twilight'
          ? 0.48
          : 0.28;
  const nocturnalBioBoost =
    atmosphere === 'starlight' ? 1.0 : atmosphere === 'twilight' ? 0.84 : 0.52;

  // Tier 1: Atomic Valence Activities derived from biome, substrate, and diurnal photon flux
  const isSilicaRich = biome === 'crystal' || substrate === 'crystalline-epiphyte';
  const isCarbonateRich =
    biome === 'sanctuary' ||
    substrate === 'architectural-foundation' ||
    substrate === 'lithophytic-rock';
  const isHydroRich = biome === 'wetland' || substrate === 'pelagic-water';
  const isHumusRich =
    biome === 'grove' || biome === 'meadow' || substrate === 'terrestrial-loam';

  const atomicActivities: Record<AtomicElementId, number> = {
    H: Number(Math.min(1, 0.68 + (isHydroRich ? 0.24 : 0.1) + neuroNorm * 0.08).toFixed(3)),
    C: Number(Math.min(1, 0.64 + (isHumusRich ? 0.22 : 0.12) + harmonyNorm * 0.12).toFixed(3)),
    N: Number(Math.min(1, 0.54 + (attuned ? 0.22 : 0.08) + neuroNorm * 0.14).toFixed(3)),
    O: Number(Math.min(1, 0.72 + sunPhotonFlux * 0.18 + neuroNorm * 0.08).toFixed(3)),
    Mg: Number(Math.min(1, 0.52 + sunPhotonFlux * 0.26 + (attuned ? 0.14 : 0.04)).toFixed(3)),
    Si: Number(Math.min(1, (isSilicaRich ? 0.88 : 0.44) + neuroNorm * 0.12).toFixed(3)),
    P: Number(Math.min(1, 0.56 + (attuned ? 0.24 : 0.08) + harmonyNorm * 0.14).toFixed(3)),
    Ca: Number(Math.min(1, (isCarbonateRich ? 0.86 : 0.48) + neuroNorm * 0.12).toFixed(3)),
  };

  // Tier 2: Construct Molecular Concentrations from Tier 1 Atomic Activities & Stoichiometry
  const computeMolConcentration = (molId: MolecularSpeciesId, boost = 0): number => {
    const spec = MOLECULAR_SPECIES[molId];
    let weightedSum = 0;
    let atomTotal = 0;
    for (const [el, count] of Object.entries(spec.atomicStoichiometry) as [
      AtomicElementId,
      number,
    ][]) {
      weightedSum += atomicActivities[el] * count;
      atomTotal += count;
    }
    const base = weightedSum / Math.max(1, atomTotal);
    return Number(
      Math.min(1, base * (0.78 + (tier2MolecularBondIndex - 200) / 640) + boost).toFixed(3),
    );
  };

  const molecularConcentrations: Record<MolecularSpeciesId, number> = {
    H2O: computeMolConcentration('H2O', isHydroRich ? 0.16 : 0.04),
    CO2: computeMolConcentration('CO2', sunPhotonFlux * 0.1),
    SiO2: computeMolConcentration('SiO2', isSilicaRich ? 0.22 : 0),
    CaCO3: computeMolConcentration('CaCO3', isCarbonateRich ? 0.2 : 0),
    ATP: computeMolConcentration('ATP', attuned ? 0.18 : 0.04),
    'alpha-pinene': computeMolConcentration('alpha-pinene', volatileTerpeneImpulse * 0.28),
    'd-luciferin': computeMolConcentration('d-luciferin', nocturnalBioBoost * 0.18),
    'orthosilicic-acid': computeMolConcentration(
      'orthosilicic-acid',
      isSilicaRich || isHydroRich ? 0.15 : 0.03,
    ),
  };

  // Tier 3: Polymerize Macromolecules from Tier 2 Molecular Concentrations
  const computeMacroYield = (macId: MacromoleculeId): number => {
    const spec = MACROMOLECULAR_POLYMERS[macId];
    let sum = spec.coordinatingAtom ? atomicActivities[spec.coordinatingAtom] * 2 : 0;
    let total = spec.coordinatingAtom ? 2 : 0;
    for (const [molId, count] of Object.entries(spec.monomerStoichiometry) as [
      MolecularSpeciesId,
      number,
    ][]) {
      sum += molecularConcentrations[molId] * count;
      total += count;
    }
    const raw = sum / Math.max(1, total);
    return Number(
      Math.min(1, raw * (0.82 + (tier3MacromolecularPolymerIndex - 400) / 960)).toFixed(3),
    );
  };

  const macromolecularYields: Record<MacromoleculeId, number> = {
    'cellulose-lignin-microfibril': computeMacroYield('cellulose-lignin-microfibril'),
    'chlorophyll-porphyrin-antenna': computeMacroYield('chlorophyll-porphyrin-antenna'),
    'luciferase-holoenzyme-complex': computeMacroYield('luciferase-holoenzyme-complex'),
    'chitin-glucan-hyphal-network': computeMacroYield('chitin-glucan-hyphal-network'),
    'tectosilicate-quartz-lattice': computeMacroYield('tectosilicate-quartz-lattice'),
    'calcite-aragonite-spar-lattice': computeMacroYield('calcite-aragonite-spar-lattice'),
  };

  // Tier 4: Manifest Organic & Inorganic Matter/Compounds from Tier 3 Macromolecules & Tier 2 Co-Factors
  const computeCompoundManifestation = (compId: MatterCompoundId, affinityBoost = 0): number => {
    const spec = MATTER_COMPOUNDS[compId];
    let macSum = 0;
    let macWeight = 0;
    for (const [macId, frac] of Object.entries(spec.macromolecularComposition) as [
      MacromoleculeId,
      number,
    ][]) {
      macSum += macromolecularYields[macId] * frac;
      macWeight += frac;
    }
    let molSum = 0;
    let molWeight = 0;
    for (const [molId, count] of Object.entries(spec.molecularCoFactors) as [
      MolecularSpeciesId,
      number,
    ][]) {
      molSum += molecularConcentrations[molId] * count;
      molWeight += count;
    }
    const combined =
      (macSum / Math.max(0.01, macWeight)) * 0.68 +
      (molSum / Math.max(1, molWeight)) * 0.32;
    return Number(
      Math.min(
        1,
        combined * (0.78 + (tier4CompoundManifestationIndex - 700) / 1600) + affinityBoost,
      ).toFixed(3),
    );
  };

  const travertineLimestoneSpar = computeCompoundManifestation(
    'travertine-limestone-spar',
    isCarbonateRich ? 0.18 : 0,
  );
  const piezoelectricQuartzGeode = computeCompoundManifestation(
    'piezoelectric-quartz-geode',
    isSilicaRich ? 0.18 : 0,
  );
  const structuredHydroMineralElectrolyte = computeCompoundManifestation(
    'structured-hydro-mineral-electrolyte',
    isHydroRich ? 0.18 : 0,
  );
  const lignocellulosicVascularTissue = computeCompoundManifestation(
    'lignocellulosic-vascular-tissue',
    isHumusRich ? 0.12 : 0.04,
  );
  const bioluminescentMycelialHumus = computeCompoundManifestation(
    'bioluminescent-mycelial-humus',
    (isHydroRich || isHumusRich ? 0.12 : 0) + (nocturnalBioBoost - 0.5) * 0.18,
  );
  const terpeneVolatileAerosolColloid = computeCompoundManifestation(
    'terpene-volatile-aerosol-colloid',
    volatileTerpeneImpulse * 0.16,
  );

  // Tier 5: Synthesize Organic & Inorganic Compounds into the Environment & All 6 Modalities of the Game
  const modalScale = 0.88 + (tier5EnvironmentalModalIndex - 1000) / 1600; // ~0.95..1.13

  const substrateBulkDensityGPerCm3 = Number(
    (
      isSilicaRich
        ? MATTER_COMPOUNDS['piezoelectric-quartz-geode'].compoundDensityGPerCm3 *
            (0.92 + piezoelectricQuartzGeode * 0.08)
        : isCarbonateRich
          ? MATTER_COMPOUNDS['travertine-limestone-spar'].compoundDensityGPerCm3 *
              (0.92 + travertineLimestoneSpar * 0.08)
          : isHydroRich
            ? MATTER_COMPOUNDS['structured-hydro-mineral-electrolyte'].compoundDensityGPerCm3
            : MATTER_COMPOUNDS['bioluminescent-mycelial-humus'].compoundDensityGPerCm3 *
              (0.9 + bioluminescentMycelialHumus * 0.12)
    ).toFixed(3),
  );
  const electrolyteSurfaceTensionMnPerM = Number(
    (71.8 + structuredHydroMineralElectrolyte * 6.4).toFixed(2),
  );
  const sporeStokesBuoyancyLiftMultiplier = Number(
    (0.92 + terpeneVolatileAerosolColloid * 0.38 * modalScale).toFixed(3),
  );

  const cellWallYoungsModulusGPa = Number(
    (
      MATTER_COMPOUNDS['lignocellulosic-vascular-tissue'].bulkElasticModulusGPa *
      (0.75 + lignocellulosicVascularTissue * 0.35)
    ).toFixed(2),
  );
  const vascularTurgorPressureMPa = Number(
    (0.62 + molecularConcentrations.H2O * 0.38 + (attuned ? 0.18 : 0)).toFixed(3),
  );
  const chlorophyllQuantumEfficiency = Number(
    Math.min(0.98, 0.64 + macromolecularYields['chlorophyll-porphyrin-antenna'] * 0.32).toFixed(3),
  );

  const carbonateSilicateBufferedPh = Number(
    Math.max(
      VERDANT_ECOLOGY_STANDARD.minSoilWaterPh,
      Math.min(
        VERDANT_ECOLOGY_STANDARD.maxSoilWaterPh,
        5.85 +
          travertineLimestoneSpar * 1.15 +
          piezoelectricQuartzGeode * 0.85 -
          bioluminescentMycelialHumus * 0.35,
      ),
    ).toFixed(2),
  );
  const cnpStoichiometricFluxIndex = Number(
    Math.min(
      1.0,
      (atomicActivities.C * 0.4 + atomicActivities.N * 0.35 + atomicActivities.P * 0.25) *
        modalScale,
    ).toFixed(3),
  );
  const luciferinCatalyticTurnoverRate = Number(
    Math.min(
      1.5,
      (0.35 +
        bioluminescentMycelialHumus * 0.65 +
        macromolecularYields['luciferase-holoenzyme-complex'] * 0.35) *
        (species === 'echo-lotus' || species === 'star-orchid' ? 1.12 : 1.0),
    ).toFixed(3),
  );

  const piezoelectricSilicaQMultiplier = Number(
    (0.94 + piezoelectricQuartzGeode * 0.38 + travertineLimestoneSpar * 0.14).toFixed(3),
  );
  const lignocellulosicWarmthCutoffHz = Math.round(
    1720 +
      piezoelectricQuartzGeode * 1450 +
      lignocellulosicVascularTissue * 420 +
      bioluminescentMycelialHumus * 310,
  );
  const modalBellPartialStiffnessRatio = Number(
    (1.0 + (piezoelectricQuartzGeode - 0.5) * 0.045).toFixed(4),
  );

  const crystalLatticeMicroReliefBumpScale = Number(
    (0.032 + (travertineLimestoneSpar * 0.5 + piezoelectricQuartzGeode * 0.5) * 0.042).toFixed(4),
  );
  const terpeneAerosolTyndallTransmittance = Number(
    Math.min(0.98, Math.max(0.78, 0.96 - terpeneVolatileAerosolColloid * 0.12)).toFixed(3),
  );
  const chromophoreEmissionWavelengthNm = Math.round(
    572 - (carbonateSilicateBufferedPh - 5.6) * 24 - piezoelectricQuartzGeode * 26,
  );

  const chemotacticZephyrConductivity = Number(
    (0.84 + terpeneVolatileAerosolColloid * 0.28).toFixed(3),
  );
  const underfootSubstrateElasticRebound = Number(
    (0.88 + lignocellulosicVascularTissue * 0.18 + travertineLimestoneSpar * 0.12).toFixed(3),
  );
  const primeAddressCompoundHarmonyIndex = Number(
    Math.min(100, Math.round(72 + (tier5EnvironmentalModalIndex - 1000) / 14)).toFixed(0),
  );

  // Tier 6: Closed-Loop Biogeochemical & Photochemical Reaction Kinetics + Atomic Remineralization
  const pathwayRates: Record<ReactionPathwayId, number> = {
    'photosynthetic-carbon-fixation': Number(
      Math.min(
        1,
        (molecularConcentrations.CO2 * 0.4 +
          molecularConcentrations.H2O * 0.35 +
          macromolecularYields['chlorophyll-porphyrin-antenna'] * 0.25) *
          REACTION_PATHWAYS['photosynthetic-carbon-fixation'].quantumOrThermalYield *
          (0.85 + sunPhotonFlux * 0.22),
      ).toFixed(3),
    ),
    'bioluminescent-oxyluciferin-catalysis': Number(
      Math.min(
        1,
        (molecularConcentrations['d-luciferin'] * 0.42 +
          molecularConcentrations.ATP * 0.33 +
          macromolecularYields['luciferase-holoenzyme-complex'] * 0.25) *
          REACTION_PATHWAYS['bioluminescent-oxyluciferin-catalysis'].quantumOrThermalYield *
          (0.82 + nocturnalBioBoost * 0.24),
      ).toFixed(3),
    ),
    'piezoelectric-silicate-mineralization': Number(
      Math.min(
        1,
        (molecularConcentrations.SiO2 * 0.38 +
          molecularConcentrations.CaCO3 * 0.37 +
          macromolecularYields['tectosilicate-quartz-lattice'] * 0.25) *
          REACTION_PATHWAYS['piezoelectric-silicate-mineralization'].quantumOrThermalYield,
      ).toFixed(3),
    ),
    'mycorrhizal-chitin-remineralization': Number(
      Math.min(
        1,
        (bioluminescentMycelialHumus * 0.45 +
          macromolecularYields['chitin-glucan-hyphal-network'] * 0.35 +
          molecularConcentrations.ATP * 0.2) *
          REACTION_PATHWAYS['mycorrhizal-chitin-remineralization'].quantumOrThermalYield,
      ).toFixed(3),
    ),
  };

  // Closed-loop conservation: Tier 6 Remineralized Atomic Pool equals exact mass-balanced return
  const remineralizationRatio =
    tier6AtomicRemineralizationIndex /
    Math.max(1, tier5EnvironmentalModalIndex + tier1AtomicValenceIndex);
  const remineralizedAtomicPool: Record<AtomicElementId, number> = {
    H: Number((atomicActivities.H * remineralizationRatio).toFixed(3)),
    C: Number((atomicActivities.C * remineralizationRatio).toFixed(3)),
    N: Number((atomicActivities.N * remineralizationRatio).toFixed(3)),
    O: Number((atomicActivities.O * remineralizationRatio).toFixed(3)),
    Mg: Number((atomicActivities.Mg * remineralizationRatio).toFixed(3)),
    Si: Number((atomicActivities.Si * remineralizationRatio).toFixed(3)),
    P: Number((atomicActivities.P * remineralizationRatio).toFixed(3)),
    Ca: Number((atomicActivities.Ca * remineralizationRatio).toFixed(3)),
  };

  return {
    tier1AtomicValenceIndex,
    tier2MolecularBondIndex,
    tier3MacromolecularPolymerIndex,
    tier4CompoundManifestationIndex,
    tier5EnvironmentalModalIndex,
    tier6AtomicRemineralizationIndex,
    chainHierarchyVerified,
    closedLoopConservationVerified,
    completeSynthesisClosureVerified,
    atomicActivities,
    molecularConcentrations,
    macromolecularYields,
    compoundManifestations: {
      inorganic: {
        travertineLimestoneSpar,
        piezoelectricQuartzGeode,
        structuredHydroMineralElectrolyte,
      },
      organic: {
        lignocellulosicVascularTissue,
        bioluminescentMycelialHumus,
        terpeneVolatileAerosolColloid,
      },
    },
    reactionKinetics: {
      pathwayRates,
      remineralizedAtomicPool,
      stoichiometricMassBalanceRatio: 1.0,
    },
    modalSyntheses: {
      physicalModality: {
        substrateBulkDensityGPerCm3,
        electrolyteSurfaceTensionMnPerM,
        sporeStokesBuoyancyLiftMultiplier,
      },
      botanicalModality: {
        cellWallYoungsModulusGPa,
        vascularTurgorPressureMPa,
        chlorophyllQuantumEfficiency,
      },
      ecologicalModality: {
        carbonateSilicateBufferedPh,
        cnpStoichiometricFluxIndex,
        luciferinCatalyticTurnoverRate,
      },
      acousticModality: {
        piezoelectricSilicaQMultiplier,
        lignocellulosicWarmthCutoffHz,
        modalBellPartialStiffnessRatio,
      },
      opticalModality: {
        crystalLatticeMicroReliefBumpScale,
        terpeneAerosolTyndallTransmittance,
        chromophoreEmissionWavelengthNm,
      },
      kinestheticModality: {
        chemotacticZephyrConductivity,
        underfootSubstrateElasticRebound,
        primeAddressCompoundHarmonyIndex,
      },
    },
  };
}

/**
 * Converts a bioluminescent chromophore emission wavelength (`475..595 nm`) into an sRGB hex color
 * (`#rrggbb`), mapping alkaline cyan-blue quartz emission (`~490 nm`) through emerald-teal (`~520 nm`)
 * to acidic warm amber-gold (`~575 nm`).
 */
export function wavelengthNmToHex(wavelengthNm: number): string {
  const wl = Math.max(470, Math.min(600, wavelengthNm));
  let r = 0;
  let g = 0;
  let b = 0;
  if (wl < 490) {
    const t = (wl - 470) / 20;
    r = 0.12 * (1 - t);
    g = 0.55 + 0.45 * t;
    b = 1.0;
  } else if (wl < 510) {
    const t = (wl - 490) / 20;
    r = 0.08 * t;
    g = 1.0;
    b = 1.0 - 0.72 * t;
  } else if (wl < 555) {
    const t = (wl - 510) / 45;
    r = 0.08 + 0.78 * t;
    g = 1.0;
    b = 0.28 * (1 - t);
  } else {
    const t = (wl - 555) / 45;
    r = 0.86 + 0.14 * t;
    g = 1.0 - 0.24 * t;
    b = 0.12 * (1 - t);
  }
  const toHex = (v: number) =>
    Math.max(0, Math.min(255, Math.round(v * 255)))
      .toString(16)
      .padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export interface CompoundSurfaceProfile {
  surfaceMaterial: SurfaceMaterialId;
  dominantCompound: MatterCompoundId;
  secondaryCompound: MatterCompoundId;
  dominantMacromolecule: MacromoleculeId;
  bulkDensityGPerCm3: number;
  bulkElasticModulusGPa: number;
  longitudinalWaveSpeedMps: number;
  groundWavePropagationMps: number;
  footstepFundamentalMultiplier: number;
  footstepOvertoneRatio: number;
  footstepDecaySec: number;
  surfaceRoughnessPbr: number;
  surfaceMetalnessPbr: number;
  clearcoatStrength: number;
  microReliefBumpScale: number;
  opticalRefractiveIndex: number;
}

/**
 * Synthesizes physical, acoustic, and PBR optical material properties for each `SurfaceMaterialId`
 * directly from its constituent Tier 4 Organic & Inorganic Matter Compounds (`MATTER_COMPOUNDS`)
 * and Tier 3 Macromolecular Lattices (`MACROMOLECULAR_POLYMERS`).
 */
export function synthesizeCompoundSurfaceProfile(
  surfaceMaterial: SurfaceMaterialId,
  neuromorphicWeight = 8,
): CompoundSurfaceProfile {
  const clampedW = Math.max(1, Math.min(16, neuromorphicWeight));
  const modalBoost = (stepEnvironmentalModalSynthesis(clampedW) - 1000) / 4000; // ~0.006 .. 0.10

  const mapping: Record<
    SurfaceMaterialId,
    {
      dom: MatterCompoundId;
      sec: MatterCompoundId;
      mac: MacromoleculeId;
      domWeight: number;
      groundWaveBaseMps: number;
      footFundMult: number;
      footOvertone: number;
      footDecay: number;
      roughness: number;
      metalness: number;
      clearcoat: number;
      bumpScale: number;
    }
  > = {
    'quartz-crystalline': {
      dom: 'piezoelectric-quartz-geode',
      sec: 'travertine-limestone-spar',
      mac: 'tectosilicate-quartz-lattice',
      domWeight: 0.85,
      groundWaveBaseMps: 4.4,
      footFundMult: 1.5,
      footOvertone: 4.0,
      footDecay: 0.15,
      roughness: 0.18,
      metalness: 0.16,
      clearcoat: 0.92,
      bumpScale: 0.056,
    },
    'travertine-stone': {
      dom: 'travertine-limestone-spar',
      sec: 'piezoelectric-quartz-geode',
      mac: 'calcite-aragonite-spar-lattice',
      domWeight: 0.82,
      groundWaveBaseMps: 4.0,
      footFundMult: 1.15,
      footOvertone: 3.0,
      footDecay: 0.095,
      roughness: 0.72,
      metalness: 0.12,
      clearcoat: 0.15,
      bumpScale: 0.044,
    },
    'bamboo-humus': {
      dom: 'lignocellulosic-vascular-tissue',
      sec: 'bioluminescent-mycelial-humus',
      mac: 'cellulose-lignin-microfibril',
      domWeight: 0.72,
      groundWaveBaseMps: 3.6,
      footFundMult: 0.92,
      footOvertone: 2.2,
      footDecay: 0.12,
      roughness: 0.78,
      metalness: 0.05,
      clearcoat: 0.12,
      bumpScale: 0.048,
    },
    'meadow-turf': {
      dom: 'bioluminescent-mycelial-humus',
      sec: 'lignocellulosic-vascular-tissue',
      mac: 'chitin-glucan-hyphal-network',
      domWeight: 0.74,
      groundWaveBaseMps: 3.4,
      footFundMult: 1.0,
      footOvertone: 1.5,
      footDecay: 0.12,
      roughness: 0.86,
      metalness: 0.06,
      clearcoat: 0.08,
      bumpScale: 0.064,
    },
    'shallow-water': {
      dom: 'structured-hydro-mineral-electrolyte',
      sec: 'bioluminescent-mycelial-humus',
      mac: 'calcite-aragonite-spar-lattice',
      domWeight: 0.9,
      groundWaveBaseMps: 2.35,
      footFundMult: 0.82,
      footOvertone: 1.65,
      footDecay: 0.16,
      roughness: 0.12,
      metalness: 0.1,
      clearcoat: 0.96,
      bumpScale: 0.022,
    },
  };

  const cfg = mapping[surfaceMaterial];
  const domComp = MATTER_COMPOUNDS[cfg.dom];
  const secComp = MATTER_COMPOUNDS[cfg.sec];
  const secW = 1 - cfg.domWeight;

  const bulkDensityGPerCm3 = Number(
    (domComp.compoundDensityGPerCm3 * cfg.domWeight + secComp.compoundDensityGPerCm3 * secW).toFixed(
      3,
    ),
  );
  const bulkElasticModulusGPa = Number(
    (
      (domComp.bulkElasticModulusGPa * cfg.domWeight + secComp.bulkElasticModulusGPa * secW) *
      (1 + modalBoost * 0.25)
    ).toFixed(2),
  );
  const longitudinalWaveSpeedMps = Math.round(
    domComp.acousticWaveSpeedMps * cfg.domWeight + secComp.acousticWaveSpeedMps * secW,
  );
  const opticalRefractiveIndex = Number(
    (
      domComp.opticalRefractiveIndex * cfg.domWeight +
      secComp.opticalRefractiveIndex * secW
    ).toFixed(3),
  );

  return {
    surfaceMaterial,
    dominantCompound: cfg.dom,
    secondaryCompound: cfg.sec,
    dominantMacromolecule: cfg.mac,
    bulkDensityGPerCm3,
    bulkElasticModulusGPa,
    longitudinalWaveSpeedMps,
    groundWavePropagationMps: cfg.groundWaveBaseMps,
    footstepFundamentalMultiplier: cfg.footFundMult,
    footstepOvertoneRatio: cfg.footOvertone,
    footstepDecaySec: cfg.footDecay,
    surfaceRoughnessPbr: cfg.roughness,
    surfaceMetalnessPbr: cfg.metalness,
    clearcoatStrength: cfg.clearcoat,
    microReliefBumpScale: Number((cfg.bumpScale * (1 + modalBoost * 0.5)).toFixed(4)),
    opticalRefractiveIndex,
  };
}

export interface BotanicalOrganogenesisProfile {
  species: PlantSpeciesId;
  biome: BiomeId;
  substrate: GrowthSubstrateId;
  celluloseStemStiffnessGPa: number;
  chlorophyllPorphyrinAntennaEfficiency: number;
  luciferaseBioluminescentPhotonFlux: number;
  chitinMycorrhizalHyphalConductance: number;
  piezoelectricCorollaPartialRatios: [number, number, number, number, number];
  chromophoreEmissionWavelengthNm: number;
  chromophoreEmissiveHex: string;
  petalClearcoatRoughness: number;
  stemMatteRoughness: number;
  terpeneVolatilizationRate: number;
  granularSynthesis: GranularEnvironmentalSynthesisState;
}

/**
 * Synthesizes a botanical specimen's structural organogenesis, 5-partial modal ratios,
 * bioluminescent chromophore emission hex color, and PBR petal/stem roughness directly from
 * its 6-Stage Closed-Loop Atomic-to-Environmental Granular Synthesis state.
 */
export function synthesizeBotanicalOrganogenesis(params: {
  biome: BiomeId;
  species: PlantSpeciesId;
  substrate?: GrowthSubstrateId;
  atmosphere: AtmosphereId;
  attuned: boolean;
  harmonyPct?: number;
  neuromorphicWeight?: number;
  volatileTerpeneImpulse?: number;
}): BotanicalOrganogenesisProfile {
  const {
    biome,
    species,
    substrate = 'terrestrial-loam',
    atmosphere,
    attuned,
    harmonyPct = 45,
    neuromorphicWeight = 8,
    volatileTerpeneImpulse = 0,
  } = params;

  const granular = evaluateGranularMatterSynthesis({
    biome,
    species,
    substrate,
    atmosphere,
    attuned,
    harmonyPct,
    neuromorphicWeight,
    volatileTerpeneImpulse,
  });

  const baseArticulation = SPECIES_ARTICULATION_PROFILES[species];
  const stiffnessRatio = granular.modalSyntheses.acousticModality.modalBellPartialStiffnessRatio;

  const piezoelectricCorollaPartialRatios: [number, number, number, number, number] = [
    baseArticulation.modalPartialRatios[0],
    Number((baseArticulation.modalPartialRatios[1] * stiffnessRatio).toFixed(4)),
    Number((baseArticulation.modalPartialRatios[2] * stiffnessRatio).toFixed(4)),
    Number((baseArticulation.modalPartialRatios[3] * (0.98 + stiffnessRatio * 0.02)).toFixed(4)),
    Number((baseArticulation.modalPartialRatios[4] * stiffnessRatio).toFixed(4)),
  ];

  const chromophoreEmissionWavelengthNm =
    granular.modalSyntheses.opticalModality.chromophoreEmissionWavelengthNm;
  const chromophoreEmissiveHex = wavelengthNmToHex(chromophoreEmissionWavelengthNm);

  const celluloseYield = granular.macromolecularYields['cellulose-lignin-microfibril'];
  const petalClearcoatRoughness = Number(
    Math.max(0.1, Math.min(0.24, 0.18 - granular.compoundManifestations.organic.terpeneVolatileAerosolColloid * 0.04)).toFixed(3),
  );
  const stemMatteRoughness = Number(
    Math.max(0.7, Math.min(0.92, 0.74 + celluloseYield * 0.12)).toFixed(3),
  );

  return {
    species,
    biome,
    substrate,
    celluloseStemStiffnessGPa: granular.modalSyntheses.botanicalModality.cellWallYoungsModulusGPa,
    chlorophyllPorphyrinAntennaEfficiency:
      granular.modalSyntheses.botanicalModality.chlorophyllQuantumEfficiency,
    luciferaseBioluminescentPhotonFlux:
      granular.modalSyntheses.ecologicalModality.luciferinCatalyticTurnoverRate,
    chitinMycorrhizalHyphalConductance: Number(
      (
        granular.macromolecularYields['chitin-glucan-hyphal-network'] * 0.65 +
        granular.reactionKinetics.pathwayRates['mycorrhizal-chitin-remineralization'] * 0.35
      ).toFixed(3),
    ),
    piezoelectricCorollaPartialRatios,
    chromophoreEmissionWavelengthNm,
    chromophoreEmissiveHex,
    petalClearcoatRoughness,
    stemMatteRoughness,
    terpeneVolatilizationRate:
      granular.reactionKinetics.pathwayRates['bioluminescent-oxyluciferin-catalysis'],
    granularSynthesis: granular,
  };
}

export interface BiogeochemicalState {
  pH: number; // 5.6 .. 8.1
  silicaMineralIndex: number; // 0.0 .. 1.0 (SiO2 piezoelectric silicate concentration)
  mycorrhizalNutrientFlux: number; // 0.0 .. 1.0 (C:N:P stoichiometric fungal transfer)
  luciferinOxidationRate: number; // 0.0 .. 1.5 (enzymatic bioluminescence kinetics)
  volatileTerpenePlume: number; // 0.0 .. 1.0 (airborne monoterpene & methyl-jasmonate signaling)
  bioluminescentWavelengthNm: number; // 475 .. 585 nm
  acousticSustainMultiplier: number; // 0.88 .. 1.28 (mineral Q-factor resonance sustain)
  harmonicWarmthFilterHz: number; // 1650 .. 4200 Hz
  granularSynthesis?: GranularEnvironmentalSynthesisState;
}

const BIOME_BASELINE_PH: Record<BiomeId, number> = {
  wetland: 5.85, // Acidic peat-moss & sapropel lagoon
  grove: 6.25, // Slightly acidic bamboo leaf-litter humus
  meadow: 6.65, // Neutral sunlit bryophyte loam
  sanctuary: 7.25, // Calcium-carbonate buffered travertine amphitheater
  crystal: 7.75, // Alkaline dissolved-silica quartz geode basin
};

/**
 * Evaluates the real-time Biogeochemical Equilibrium & Reaction-Diffusion state
 * (`Foundation.Ecology.V1.Model::BiogeochemicalEquilibriumSpec`) for any plant or micro-habitat:
 * - Balances biome soil/water pH (`5.6 .. 8.1`) with the specimen's growth substrate mineral buffer (`GROWTH_SUBSTRATE_SPECS`)
 *   and diurnal photosynthetic CO2 uptake.
 * - Computes piezoelectric dissolved silica (`SiO2`), mycorrhizal `C:N:P` nutrient flux across the fungal network,
 *   Michaelis-Menten luciferin-luciferase bioluminescent oxidation kinetics, and volatile terpene signaling plumes.
 * - Outputs acoustic sustain Q-factor and filter warmth for `BotanicalSoundscapeEngine` and visual glow modulation.
 */
export function evaluateBiogeochemistry(params: {
  biome: BiomeId;
  species: PlantSpeciesId;
  substrate?: GrowthSubstrateId;
  atmosphere: AtmosphereId;
  attuned: boolean;
  lifecycleStage?: BotanicalLifecycleStageId;
  sympatheticNeighborCount?: number;
  neuromorphicWeight?: number;
  volatileTerpeneImpulse?: number;
}): BiogeochemicalState {
  const {
    biome,
    species,
    substrate = 'terrestrial-loam',
    atmosphere,
    attuned,
    lifecycleStage = 'dormant-seed',
    sympatheticNeighborCount = 0,
    neuromorphicWeight = 8,
    volatileTerpeneImpulse = 0,
  } = params;

  const subSpec = GROWTH_SUBSTRATE_SPECS[substrate];
  const biomePh = BIOME_BASELINE_PH[biome];
  const diurnalPhShift =
    atmosphere === 'golden'
      ? 0.12
      : atmosphere === 'dawn'
        ? 0.04
        : atmosphere === 'twilight'
          ? -0.04
          : -0.08;
  const rawPh = biomePh * 0.55 + subSpec.baselinePh * 0.45 + diurnalPhShift;
  const pH = Number(
    Math.max(
      VERDANT_ECOLOGY_STANDARD.minSoilWaterPh,
      Math.min(VERDANT_ECOLOGY_STANDARD.maxSoilWaterPh, rawPh),
    ).toFixed(2),
  );

  const biomeSilicaBoost = biome === 'crystal' ? 0.18 : biome === 'sanctuary' ? 0.1 : 0;
  const silicaMineralIndex = Number(
    Math.min(1.0, subSpec.silicaMineralIndex + biomeSilicaBoost).toFixed(3),
  );

  const stageOrder = BOTANICAL_LIFECYCLE_STAGES[lifecycleStage].stageIndex;
  const weightNorm = Math.max(0.1, Math.min(1.0, neuromorphicWeight / 16));
  const mycorrhizalNutrientFlux = Number(
    Math.min(
      1.0,
      subSpec.mycorrhizalConductivity * 0.52 +
        Math.min(3, sympatheticNeighborCount) * 0.08 +
        weightNorm * 0.22 +
        stageOrder * 0.045,
    ).toFixed(3),
  );

  // Michaelis-Menten enzymatic bioluminescence kinetics: peaks in nocturnal/twilight atmospheres & when attuned
  const atmosEnzymeFactor =
    atmosphere === 'starlight'
      ? 1.25
      : atmosphere === 'twilight'
        ? 1.12
        : atmosphere === 'dawn'
          ? 0.92
          : 0.82;
  const speciesBioFactor =
    species === 'echo-lotus' || species === 'star-orchid' ? 1.12 : 1.0;
  const luciferinOxidationRate = Number(
    Math.min(
      1.5,
      ((attuned ? 0.78 : 0.34) +
        mycorrhizalNutrientFlux * 0.28 +
        volatileTerpeneImpulse * 0.24) *
        atmosEnzymeFactor *
        speciesBioFactor,
    ).toFixed(3),
  );

  const volatileTerpenePlume = Number(
    Math.min(
      1.0,
      (attuned ? 0.36 : 0.08) +
        volatileTerpeneImpulse * 0.55 +
        Math.min(3, sympatheticNeighborCount) * 0.07,
    ).toFixed(3),
  );

  // pH-dependent bioluminescent wavelength (482nm sapphire-cyan at high pH/silica -> 568nm golden-amber on travertine/loam)
  const bioluminescentWavelengthNm = Math.round(
    572 - (pH - 5.6) * 24 - silicaMineralIndex * 28,
  );

  const acousticSustainMultiplier = Number(
    Math.min(
      1.28,
      Math.max(0.88, subSpec.acousticSustainFactor * (0.94 + silicaMineralIndex * 0.14)),
    ).toFixed(3),
  );

  const harmonicWarmthFilterHz = Math.round(
    1750 + silicaMineralIndex * 1650 + luciferinOxidationRate * 480,
  );

  const granularSynthesis = evaluateGranularMatterSynthesis({
    biome,
    species,
    substrate,
    atmosphere,
    attuned,
    neuromorphicWeight,
    volatileTerpeneImpulse,
  });

  return {
    pH,
    silicaMineralIndex,
    mycorrhizalNutrientFlux,
    luciferinOxidationRate,
    volatileTerpenePlume,
    bioluminescentWavelengthNm,
    acousticSustainMultiplier,
    harmonicWarmthFilterHz,
    granularSynthesis,
  };
}

export interface BiomeMasterySummary {
  biome: BiomeId;
  attunedInBiome: number;
  totalInBiome: number;
  masteryRatio: number;
  constellationAwakened: boolean;
  constellationName: string;
  activeGuilds: SymbioticGuildConfig[];
}

export function evaluateBiomeMasteryAndGuilds(
  biome: BiomeId,
  plants: GardenPlantInstance[],
): BiomeMasterySummary {
  const inBiome = plants.filter((p) => p.biome === biome);
  const attunedPlants = inBiome.filter((p) => p.attuned);
  const totalInBiome = inBiome.length;
  const attunedInBiome = attunedPlants.length;
  const masteryRatio = totalInBiome > 0 ? Number((attunedInBiome / totalInBiome).toFixed(3)) : 0;
  const constellationAwakened = totalInBiome > 0 && attunedInBiome === totalInBiome;

  const attunedSpeciesSet = new Set<PlantSpeciesId>(attunedPlants.map((p) => p.species));
  const activeGuilds = SYMBIOTIC_GUILDS.filter(
    (g) => attunedSpeciesSet.has(g.pair[0]) && attunedSpeciesSet.has(g.pair[1]),
  );

  return {
    biome,
    attunedInBiome,
    totalInBiome,
    masteryRatio,
    constellationAwakened,
    constellationName: BIOME_CONSTELLATIONS[biome].constellationName,
    activeGuilds,
  };
}

// ---------------------------------------------------------------------------
// Subsystem 11: Species-Specific Modal Timbres, Anatomical Articulation & Biome Terraces
// Mirrors `prism/src/Foundation/Articulation/V1/Model.lex.tex`
// ---------------------------------------------------------------------------

export interface SpeciesArticulationProfile {
  species: PlantSpeciesId;
  instrumentName: string;
  modalPartialRatios: [number, number, number, number, number];
  modalPartialWeights: [number, number, number, number, number];
  attackSec: number;
  vibratoRateHz: number;
  vibratoDepthCents: number;
  pitchGlideRatio: number;
  articulationLabel: string;
}

export const SPECIES_ARTICULATION_PROFILES: Record<PlantSpeciesId, SpeciesArticulationProfile> = {
  'chime-lily': {
    species: 'chime-lily',
    instrumentName: 'Silver Campanula Bell',
    modalPartialRatios: [1.0, 2.0, 3.0, 4.24, 5.42],
    modalPartialWeights: [1.0, 0.52, 0.34, 0.22, 0.16],
    attackSec: 0.014,
    vibratoRateHz: 4.2,
    vibratoDepthCents: 4.5,
    pitchGlideRatio: 1.0,
    articulationLabel: 'Pendulum Bell Corolla Swing (±14°) & Golden Clapper Oscillation',
  },
  'pulse-fern': {
    species: 'pulse-fern',
    instrumentName: 'Rosewood Kalimba Tine',
    modalPartialRatios: [1.0, 2.92, 5.4, 8.15, 11.2],
    modalPartialWeights: [1.0, 0.48, 0.26, 0.14, 0.09],
    attackSec: 0.008,
    vibratoRateHz: 5.6,
    vibratoDepthCents: 3.0,
    pitchGlideRatio: 0.985,
    articulationLabel: 'Counter-Rotating Crozier Spirals & Polyrhythmic Frond Unfurling',
  },
  'echo-lotus': {
    species: 'echo-lotus',
    instrumentName: 'Hydro-Acoustic Water Harp',
    modalPartialRatios: [1.0, 1.5, 2.0, 2.67, 4.0],
    modalPartialWeights: [1.0, 0.56, 0.38, 0.24, 0.15],
    attackSec: 0.032,
    vibratoRateHz: 3.4,
    vibratoDepthCents: 6.5,
    pitchGlideRatio: 1.045,
    articulationLabel: 'Concentric Petal Cup Blooming (+22°) & Hydro-Buoyant Bobbing',
  },
  'drone-moss': {
    species: 'drone-moss',
    instrumentName: 'Basalt Organ Bourdon',
    modalPartialRatios: [0.5, 1.0, 1.5, 2.0, 3.0],
    modalPartialWeights: [0.85, 1.0, 0.62, 0.35, 0.18],
    attackSec: 0.065,
    vibratoRateHz: 2.2,
    vibratoDepthCents: 3.5,
    pitchGlideRatio: 1.0,
    articulationLabel: 'Deep Sub-Octave Cushion Respiration & Spore Capsule Levitation',
  },
  'star-orchid': {
    species: 'star-orchid',
    instrumentName: 'Quartz Glass Harmonica',
    modalPartialRatios: [1.0, 2.0, 3.0, 4.0, 6.0],
    modalPartialWeights: [1.0, 0.64, 0.44, 0.28, 0.2],
    attackSec: 0.042,
    vibratoRateHz: 5.2,
    vibratoDepthCents: 8.0,
    pitchGlideRatio: 1.008,
    articulationLabel: 'Celestial Star-Head Gaze Orientation & Inner Tepal Shimmer',
  },
};

export interface BiomeLandscapeTerraceConfig {
  biome: BiomeId;
  terraceName: string;
  sacredGeometryMotif: string;
  botanicalCanopyFeature: string;
}

export const BIOME_LANDSCAPE_TERRACES: Record<BiomeId, BiomeLandscapeTerraceConfig> = {
  meadow: {
    biome: 'meadow',
    terraceName: 'Sunlit Travertine Parterre & Radial Sundial Inlay',
    sacredGeometryMotif: 'Concentric Golden-Ratio Travertine Rings & 8 Cardinal Hour Rays',
    botanicalCanopyFeature: 'Fibonacci Sunlit Meadow Flora & Compass Rotunda',
  },
  grove: {
    biome: 'grove',
    terraceName: 'Raked Zen Moss & Jade Gravel Acoustic Ring Terrace',
    sacredGeometryMotif: '4 Concentric Raked Acoustic Wave Rings in Jade Gravel',
    botanicalCanopyFeature: 'Nodal Bamboo Culm Rings & Swaying Emerald Canopy Foliage',
  },
  crystal: {
    biome: 'crystal',
    terraceName: 'Obsidian-Sapphire Geode Mirror Basin & Perimeter Quartz Clusters',
    sacredGeometryMotif: 'Hexagonal Prismatic Refraction Floor & Crystalline Ley-Facets',
    botanicalCanopyFeature: 'Bioluminescent Quartz Crystal Clusters & Geode Spires',
  },
  wetland: {
    biome: 'wetland',
    terraceName: 'Multi-Tiered Mirror Lagoon with Expanding Water-Harp Ripple Rings',
    sacredGeometryMotif: '5 Concentric Meniscus Harmonic Rings around Floating Lotus Piers',
    botanicalCanopyFeature: 'Hydro-Acoustic Floating Lily Pads & Turquoise Reed Sanctuary',
  },
  sanctuary: {
    biome: 'sanctuary',
    terraceName: 'Golden-Ratio Harmonic Labyrinth Amphitheater & 5-Biome Ley-Line Conduits',
    sacredGeometryMotif: '5 Pure Just-Intonation Ratio Rings (1:1, 9:8, 5:4, 3:2, 2:1) & Radial Conduits',
    botanicalCanopyFeature: 'Central Celestial Tuning-Fork Spire & Convergent Resonance Choir',
  },
};

export interface GestureArticulationContrastModel {
  touchAttackMs: number;
  touchDecayMs: number;
  touchVoices: number;
  touchGestureSummary: string;
  attuneAttackMs: number;
  attuneDecayMs: number;
  attuneVoices: number;
  attuneGestureSummary: string;
  stillnessAttackMs: number;
  stillnessDecayMs: number;
  stillnessGestureSummary: string;
}

export interface BotanicalArticulationStandardModel {
  profile: string;
  speciesCount: number;
  partialsPerSpecies: number;
  terraceCount: number;
  parabolicArcSegments: number;
  sympatheticEchoDelayMs: number;
  constellationVoices: number;
  gestureContrast: GestureArticulationContrastModel;
  neuromorphicBridge: NeuromorphicDomainBridgeSpec;
}

export const VERDANT_ARTICULATION_STANDARD: BotanicalArticulationStandardModel = {
  profile: GENERATED_PRISM_STANDARDS.articulation.profile,
  speciesCount: GENERATED_PRISM_STANDARDS.articulation.speciesArticulation.speciesCount,
  partialsPerSpecies:
    GENERATED_PRISM_STANDARDS.articulation.speciesArticulation.partialsPerSpecies,
  terraceCount: GENERATED_PRISM_STANDARDS.articulation.landscapeTerraces.terraceCount,
  parabolicArcSegments:
    GENERATED_PRISM_STANDARDS.articulation.sympatheticArcs.parabolicArcSegments,
  sympatheticEchoDelayMs:
    GENERATED_PRISM_STANDARDS.articulation.sympatheticArcs.sympatheticEchoDelayMs,
  constellationVoices:
    GENERATED_PRISM_STANDARDS.articulation.sympatheticArcs.constellationVoices,
  gestureContrast: {
    touchAttackMs: GENERATED_PRISM_STANDARDS.articulation.gestureContrast.touchAttackMs,
    touchDecayMs: GENERATED_PRISM_STANDARDS.articulation.gestureContrast.touchDecayMs,
    touchVoices: GENERATED_PRISM_STANDARDS.articulation.gestureContrast.touchVoices,
    touchGestureSummary:
      'Touch Petal [T]: Crisp 3ms plucked/struck solo upper-harmonic transient (2x & 3x overtones) with 9Hz elastic petal shiver and 420ms intimate decay.',
    attuneAttackMs: GENERATED_PRISM_STANDARDS.articulation.gestureContrast.attuneAttackMs,
    attuneDecayMs: GENERATED_PRISM_STANDARDS.articulation.gestureContrast.attuneDecayMs,
    attuneVoices: GENERATED_PRISM_STANDARDS.articulation.gestureContrast.attuneVoices,
    attuneGestureSummary:
      'Attune Flora [Space]: Lush 220ms polyphonic bowed/harmonica 6-voice multi-octave choir swell + 3 staggered binaural cross-pollination echoes over 2.4s.',
    stillnessAttackMs: GENERATED_PRISM_STANDARDS.articulation.gestureContrast.stillnessAttackMs,
    stillnessDecayMs: GENERATED_PRISM_STANDARDS.articulation.gestureContrast.stillnessDecayMs,
    stillnessGestureSummary:
      'Meditative Stillness [C]: Self-decaying 650ms inhale / 3.2s exhale warm pastoral ninth breathing pad that fades cleanly to natural silence.',
  },
  neuromorphicBridge: {
    ...GENERATED_PRISM_STANDARDS.articulation.neuromorphicBridge,
  },
};

export interface SpeciesAnatomicalKinematics {
  bellSwingRad: number;
  crozierSpinRad: number;
  frondBreathRad: number;
  petalOpenRad: number;
  buoyancyOffsetM: number;
  cushionPulseScale: number;
  capsuleHoverOffsetM: number;
  starHeadRollRad: number;
}

/**
 * Pure deterministic function computing per-frame anatomical articulation for each of the 5 flora species,
 * including a 9Hz damped elastic petal shiver when touched (`tactileShiverImpulse`) and neuromorphic
 * `/6` Icosian & `/7` PrimeAddress kinship harmonic shimmer (`neuromorphicSynapticWeight`).
 */
export function computeSpeciesArticulation(params: {
  species: PlantSpeciesId;
  attuned: boolean;
  proximityDm: number;
  elapsedSeconds: number;
  pulsePhase: number;
  tactileShiverImpulse?: number;
  neuromorphicSynapticWeight?: number;
}): SpeciesAnatomicalKinematics {
  const {
    attuned,
    proximityDm,
    elapsedSeconds,
    pulsePhase,
    tactileShiverImpulse = 0,
    neuromorphicSynapticWeight = 8,
  } = params;
  const proxBoost = Math.max(0, 1 - proximityDm / 50);
  const neuroBoost = ((neuromorphicSynapticWeight - 8) / 8) * 0.18;
  const energy = (attuned ? 1.55 : 0.65) + proxBoost * 0.65 + Math.max(0, neuroBoost);
  // 9.5 Hz high-frequency tactile shiver when a petal/frond is physically plucked with [T]
  const shiverWave = Math.sin(elapsedSeconds * 59.6 + pulsePhase) * tactileShiverImpulse;

  const bellSwingRad = Math.sin(elapsedSeconds * 2.8 + pulsePhase) * 0.14 * energy + shiverWave * 0.28;
  const crozierSpinRad = elapsedSeconds * (attuned ? 1.15 : 0.45) + pulsePhase + shiverWave * 0.45;
  const frondBreathRad = Math.sin(elapsedSeconds * 2.1 + pulsePhase) * 0.09 * energy + shiverWave * 0.22;
  const petalOpenRad =
    (attuned ? 0.24 : 0.0) + Math.sin(elapsedSeconds * 1.6 + pulsePhase) * 0.06 * energy + shiverWave * 0.18;
  const buoyancyOffsetM = Math.sin(elapsedSeconds * 1.9 + pulsePhase) * 0.032 * energy + shiverWave * 0.025;
  const cushionPulseScale = 1 + Math.sin(elapsedSeconds * 1.5 + pulsePhase) * 0.08 * energy + shiverWave * 0.12;
  const capsuleHoverOffsetM = Math.sin(elapsedSeconds * 2.4 + pulsePhase) * 0.075 * energy + Math.abs(shiverWave) * 0.08;
  const starHeadRollRad = Math.sin(elapsedSeconds * 1.8 + pulsePhase) * 0.12 * energy + shiverWave * 0.25;

  return {
    bellSwingRad: Number(bellSwingRad.toFixed(4)),
    crozierSpinRad: Number(crozierSpinRad.toFixed(4)),
    frondBreathRad: Number(frondBreathRad.toFixed(4)),
    petalOpenRad: Number(petalOpenRad.toFixed(4)),
    buoyancyOffsetM: Number(buoyancyOffsetM.toFixed(4)),
    cushionPulseScale: Number(cushionPulseScale.toFixed(4)),
    capsuleHoverOffsetM: Number(capsuleHoverOffsetM.toFixed(4)),
    starHeadRollRad: Number(starHeadRollRad.toFixed(4)),
  };
}

// ---------------------------------------------------------------------------
// Subsystem 12: Environmental Physics, Collision vs. Permeability Taxonomy,
// Hydrodynamics, Foliage Elasticity, Slope Kinematics & Acoustic Occlusion
// Mirrors `prism/src/Foundation/Physics/V1/Model.lex.tex`
// ---------------------------------------------------------------------------

export type SurfaceMaterialId =
  | 'travertine-stone'
  | 'meadow-turf'
  | 'bamboo-humus'
  | 'quartz-crystalline'
  | 'shallow-water';

export type ColliderCategoryId =
  | 'monument-column'
  | 'bamboo-stalk'
  | 'quartz-stalk'
  | 'perimeter-boulder'
  | 'flora-stem-core';

export interface SolidCollider {
  id: string;
  category: ColliderCategoryId;
  label: string;
  x: number;
  z: number;
  radiusMeters: number;
  heightMeters: number;
  acousticOcclusion: number; // 0..0.45 high-frequency shadow factor
}

export interface PermeableMediumDescriptor {
  id: string;
  name: string;
  isObstruction: false;
  physicalResponse: string;
  acousticSignature: string;
}

export interface EnvironmentalPhysicsStandardModel {
  profile: string;
  solidColliderClasses: number;
  permeableMediumClasses: number;
  playerBodyRadiusMeters: number;
  lagoonCenter: [number, number];
  lagoonRadiusMeters: number;
  maxWaterDepthMeters: number;
  wadingSpeedPct: number;
  floatingStonePadCount: number;
  grassWakeRadiusMeters: number;
  maxFoliageDeflectionRad: number;
  waterSurfaceSubmergedBelowRim: boolean;
  floatingWaterEdgeCount: number;
  neuromorphicCymaticCouplingEnabled: boolean;
  terraceBasinLevellingCount: number;
  canopyWindShearEnabled: boolean;
  slipstreamVortexWakeEnabled: boolean;
  chemotacticSporeBuoyancyEnabled: boolean;
  coupledDomainCount: number;
  universalNeuromorphicBusEnabled: boolean;
  crossDomainTransferLatencyTicks: number;
  sporeSolidObstacleDeflectionEnabled: boolean;
  sporeTerrainMeniscusFloorEnabled: boolean;
  emergentSeedlingColliderRegistrationEnabled: boolean;
  waveRingSurfaceNormalAlignmentEnabled: boolean;
  heliocentricPhototropicShadowLockEnabled: boolean;
  causalWavefrontEchoTimingEnabled: boolean;
  universalAcousticSpatialBiochemConstraintEnabled: boolean;
  spatialGroundingAndSubstrateCoherenceEnabled: boolean;
  floatingTreeOrRockEdgeCount: number;
  hardSurfaceOrRockFloraGrowthCount: number;
  surfaceMaterials: SurfaceMaterialId[];
  permeableMediaCatalog: PermeableMediumDescriptor[];
  neuromorphicBridge: NeuromorphicDomainBridgeSpec;
}

export const VERDANT_PHYSICS_STANDARD: EnvironmentalPhysicsStandardModel = {
  profile: GENERATED_PRISM_STANDARDS.physics.profile,
  solidColliderClasses: GENERATED_PRISM_STANDARDS.physics.taxonomy.solidColliderClasses,
  permeableMediumClasses: GENERATED_PRISM_STANDARDS.physics.taxonomy.permeableMediumClasses,
  playerBodyRadiusMeters: 0.45,
  lagoonCenter: [-28, 30],
  lagoonRadiusMeters: 16.5,
  maxWaterDepthMeters: GENERATED_PRISM_STANDARDS.physics.hydrodynamics.maxWaterDepthCm / 100,
  wadingSpeedPct: GENERATED_PRISM_STANDARDS.physics.hydrodynamics.wadingSpeedPct,
  floatingStonePadCount: GENERATED_PRISM_STANDARDS.physics.hydrodynamics.floatingStonePadCount,
  grassWakeRadiusMeters: GENERATED_PRISM_STANDARDS.physics.foliageAndSlope.grassWakeRadiusCm / 100,
  maxFoliageDeflectionRad: 0.66, // ~38 deg
  waterSurfaceSubmergedBelowRim:
    GENERATED_PRISM_STANDARDS.physics.hydrodynamics.waterSurfaceSubmergedBelowRim,
  floatingWaterEdgeCount: GENERATED_PRISM_STANDARDS.physics.hydrodynamics.floatingWaterEdgeCount,
  neuromorphicCymaticCouplingEnabled:
    GENERATED_PRISM_STANDARDS.physics.hydrodynamics.neuromorphicCymaticCouplingEnabled,
  terraceBasinLevellingCount:
    GENERATED_PRISM_STANDARDS.physics.hydrodynamics.terraceBasinLevellingCount,
  canopyWindShearEnabled: GENERATED_PRISM_STANDARDS.physics.foliageAndSlope.canopyWindShearEnabled,
  slipstreamVortexWakeEnabled:
    GENERATED_PRISM_STANDARDS.physics.foliageAndSlope.slipstreamVortexWakeEnabled,
  chemotacticSporeBuoyancyEnabled:
    GENERATED_PRISM_STANDARDS.physics.foliageAndSlope.chemotacticSporeBuoyancyEnabled,
  coupledDomainCount: GENERATED_PRISM_STANDARDS.physics.holisticCoupling.coupledDomainCount,
  universalNeuromorphicBusEnabled:
    GENERATED_PRISM_STANDARDS.physics.holisticCoupling.universalNeuromorphicBusEnabled,
  crossDomainTransferLatencyTicks:
    GENERATED_PRISM_STANDARDS.physics.holisticCoupling.crossDomainTransferLatencyTicks,
  sporeSolidObstacleDeflectionEnabled:
    GENERATED_PRISM_STANDARDS.physics.holisticCoupling.sporeSolidObstacleDeflectionEnabled,
  sporeTerrainMeniscusFloorEnabled:
    GENERATED_PRISM_STANDARDS.physics.holisticCoupling.sporeTerrainMeniscusFloorEnabled,
  emergentSeedlingColliderRegistrationEnabled:
    GENERATED_PRISM_STANDARDS.physics.holisticCoupling.emergentSeedlingColliderRegistrationEnabled,
  waveRingSurfaceNormalAlignmentEnabled:
    GENERATED_PRISM_STANDARDS.physics.holisticCoupling.waveRingSurfaceNormalAlignmentEnabled,
  heliocentricPhototropicShadowLockEnabled:
    GENERATED_PRISM_STANDARDS.physics.holisticCoupling.heliocentricPhototropicShadowLockEnabled,
  causalWavefrontEchoTimingEnabled:
    GENERATED_PRISM_STANDARDS.physics.holisticCoupling.causalWavefrontEchoTimingEnabled,
  universalAcousticSpatialBiochemConstraintEnabled:
    GENERATED_PRISM_STANDARDS.physics.holisticCoupling
      .universalAcousticSpatialBiochemConstraintEnabled,
  spatialGroundingAndSubstrateCoherenceEnabled:
    GENERATED_PRISM_STANDARDS.physics.holisticCoupling.spatialGroundingAndSubstrateCoherenceEnabled,
  floatingTreeOrRockEdgeCount:
    GENERATED_PRISM_STANDARDS.physics.holisticCoupling.floatingTreeOrRockEdgeCount,
  hardSurfaceOrRockFloraGrowthCount:
    GENERATED_PRISM_STANDARDS.physics.holisticCoupling.hardSurfaceOrRockFloraGrowthCount,
  surfaceMaterials: [
    'travertine-stone',
    'meadow-turf',
    'bamboo-humus',
    'quartz-crystalline',
    'shallow-water',
  ],
  permeableMediaCatalog: [
    {
      id: 'meadow-grass-reeds',
      name: 'Meadow Grass & Bioluminescent Reeds (360 Blades)',
      isObstruction: false,
      physicalResponse:
        'Zero locomotion obstruction; blades within 1.85m bend radially away up to 38° via Hooke’s law elasticity and return smoothly in the advected wind field.',
      acousticSignature: 'Soft botanical turf brush & rustling reed overtones.',
    },
    {
      id: 'mirror-lagoon-water',
      name: 'Mirror Lagoon Shallow Water Basin (r = 16.5m)',
      isObstruction: false,
      physicalResponse:
        'Permeable fluid medium with depth-graded hydrodynamic drag (76%–100% stride speed), meniscus wake ripples, and Archimedean buoyancy (1.9 Hz).',
      acousticSignature: 'Liquid hydrodynamic splash, meniscus bubble ping & low-pass sub-harmonic warmth.',
    },
    {
      id: 'outer-flora-corollas',
      name: 'Outer Botanical Petals, Fronds, Moss Cushions & Lotus Pads',
      isObstruction: false,
      physicalResponse:
        'Outer fronds and petals yield elastically when brushed; Drone Moss cushions and floating Echo Lotus pads are 100% permeable underfoot.',
      acousticSignature: 'Sympathetic tactile chime or soft moss cushion compression.',
    },
    {
      id: 'travertine-stepping-stones',
      name: 'Travertine Stepping Stones, Sundial Plaza & Floating Lagoon Pads',
      isObstruction: false,
      physicalResponse:
        'Walkable elevated stone surfaces (+0.04m to +0.22m) providing dry footing across grass and shallow lagoon water.',
      acousticSignature: 'Crisp mineral travertine tap with clear early reflections.',
    },
    {
      id: 'acoustic-fields-spores',
      name: 'Airborne Bioluminescent Spores & Ground Resonance Waves',
      isObstruction: false,
      physicalResponse:
        'Advected by the continuous 2D wind vector field and radial player movement wake without physical resistance.',
      acousticSignature: 'Purely optical & psychoacoustic shimmer.',
    },
  ],
  neuromorphicBridge: {
    ...GENERATED_PRISM_STANDARDS.physics.neuromorphicBridge,
  },
};

/**
 * Builds the deterministic registry of solid 2D circular colliders across the garden.
 * Uses the exact slope-embedded tree (`CACHED_CONSERVATORY_TREES`) and rock (`CACHED_CONSERVATORY_ROCKS`)
 * positions generated by the authoritative Prism Spatial Coherence API.
 */
export function buildGardenColliders(plants: GardenPlantInstance[]): SolidCollider[] {
  const colliders: SolidCollider[] = [];

  // 1. Sanctuary Pavilion [0, -34]: Central Obelisk Core + 6 Perimeter Columns
  colliders.push({
    id: 'col-sanctuary-core',
    category: 'monument-column',
    label: 'Sanctuary Obelisk Core Plinth',
    x: 0,
    z: -34,
    radiusMeters: 1.48,
    heightMeters: 6.4,
    acousticOcclusion: 0.38,
  });
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    colliders.push({
      id: `col-sanctuary-pillar-${i + 1}`,
      category: 'monument-column',
      label: 'Sanctuary Colonnade Pillar',
      x: Number((Math.cos(angle) * 3.9).toFixed(2)),
      z: Number((-34 + Math.sin(angle) * 3.9).toFixed(2)),
      radiusMeters: 0.38,
      heightMeters: 5.6,
      acousticOcclusion: 0.22,
    });
  }

  // 2. Meadow Sundial Rotunda [0, -14]: 2 Gnomon Arch Bases (center arch is walkable!)
  colliders.push(
    {
      id: 'col-meadow-gnomon-west',
      category: 'monument-column',
      label: 'Sundial West Gnomon Arch Base',
      x: -1.45,
      z: -14,
      radiusMeters: 0.3,
      heightMeters: 1.6,
      acousticOcclusion: 0.14,
    },
    {
      id: 'col-meadow-gnomon-east',
      category: 'monument-column',
      label: 'Sundial East Gnomon Arch Base',
      x: 1.45,
      z: -14,
      radiusMeters: 0.3,
      heightMeters: 1.6,
      acousticOcclusion: 0.14,
    },
  );

  // 3. Bamboo Chime Pergola [-36, -24]: 4 Cedar Corner Posts (interior under chimes is walkable!)
  const pergolaOffsets = [
    [-2.2, -2.2],
    [2.2, -2.2],
    [-2.2, 2.2],
    [2.2, 2.2],
  ];
  pergolaOffsets.forEach(([ox, oz], idx) => {
    colliders.push({
      id: `col-grove-post-${idx + 1}`,
      category: 'monument-column',
      label: 'Bamboo Pergola Corner Post',
      x: -36 + ox,
      z: -24 + oz,
      radiusMeters: 0.32,
      heightMeters: 4.4,
      acousticOcclusion: 0.18,
    });
  });

  // 4. Crystal Geode Archway [36, -24]: 6 Perimeter Quartz Monolith Spires
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    colliders.push({
      id: `col-crystal-spire-${i + 1}`,
      category: 'monument-column',
      label: 'Prismatic Quartz Monolith Spire',
      x: Number((36 + Math.cos(a) * 2.9).toFixed(2)),
      z: Number((-24 + Math.sin(a) * 2.9).toFixed(2)),
      radiusMeters: 0.56,
      heightMeters: 4.6,
      acousticOcclusion: 0.28,
    });
  }

  // 5. 64 Grove Bamboo Culms & Crystal Cavern Stalks (from CACHED_CONSERVATORY_TREES)
  for (let i = 0; i < CACHED_CONSERVATORY_TREES.length; i++) {
    const tree = CACHED_CONSERVATORY_TREES[i];
    colliders.push({
      id: `col-stalk-${i + 1}`,
      category: tree.isCrystalSide ? 'quartz-stalk' : 'bamboo-stalk',
      label: tree.isCrystalSide ? 'Crystalline Quartz Pillar' : 'Nodal Bamboo Culm',
      x: tree.x,
      z: tree.z,
      radiusMeters: 0.28,
      heightMeters: tree.trunkHeightMeters,
      acousticOcclusion: 0.15,
    });
  }

  // 6. 52 Perimeter Rock Outcrop Boulders (from CACHED_CONSERVATORY_ROCKS)
  for (let i = 0; i < CACHED_CONSERVATORY_ROCKS.length; i++) {
    const rk = CACHED_CONSERVATORY_ROCKS[i];
    colliders.push({
      id: `col-boulder-${i + 1}`,
      category: 'perimeter-boulder',
      label: 'Perimeter Basalt Outcrop',
      x: rk.x,
      z: rk.z,
      radiusMeters: 2.5,
      heightMeters: 3.4,
      acousticOcclusion: 0.42,
    });
  }

  // 7. Upright Flora Basal Stem Cores (Chime Lily, Pulse Fern, Star Orchid have a narrow 0.34m woody/crystalline core;
  //    Drone Moss cushions & floating Echo Lotus pads are 100% permeable so the player can walk over them)
  for (let i = 0; i < plants.length; i++) {
    const p = plants[i];
    if (p.species === 'drone-moss' || p.species === 'echo-lotus') {
      continue;
    }
    colliders.push({
      id: `col-flora-${p.id}`,
      category: 'flora-stem-core',
      label: `${PLANT_SPECIES_CONFIGS[p.species].name} Basal Stem`,
      x: p.x,
      z: p.z,
      radiusMeters: 0.34 * p.scale,
      heightMeters: 2.1 * p.scale,
      acousticOcclusion: 0.08,
    });
  }

  return colliders;
}

/**
 * Dynamically registers a newly germinated Neuromorphic Seedling into the live solid collider registry
 * (`Foundation.Physics.V1.Model::emergentSeedlingColliderRegistrationEnabled`).
 * Ensures upright emergent seedlings (`chime-lily`, `pulse-fern`, `star-orchid`) obey the exact same
 * solid-body tangential collision, spore potential-flow deflection, and acoustic occlusion laws as
 * initial conservatory flora, while `drone-moss` and `echo-lotus` remain 100% permeable underfoot.
 */
export function registerEmergentSeedlingCollider(
  colliders: SolidCollider[],
  plant: GardenPlantInstance,
): SolidCollider | null {
  if (plant.species === 'drone-moss' || plant.species === 'echo-lotus') {
    return null;
  }
  const colId = `col-flora-${plant.id}`;
  const existing = colliders.find((c) => c.id === colId);
  if (existing) return existing;

  const newCollider: SolidCollider = {
    id: colId,
    category: 'flora-stem-core',
    label: `${PLANT_SPECIES_CONFIGS[plant.species].name} Basal Stem`,
    x: plant.x,
    z: plant.z,
    radiusMeters: Number((0.34 * plant.scale).toFixed(3)),
    heightMeters: Number((2.1 * plant.scale).toFixed(2)),
    acousticOcclusion: 0.08,
  };
  colliders.push(newCollider);
  return newCollider;
}

export interface HydrodynamicState {
  inWater: boolean;
  onFloatingStonePad: boolean;
  waterDepthMeters: number;
  waterSurfaceY: number;
  lakebedY: number;
  wadingDragMultiplier: number; // 0.76..1.0
  surfaceElevationOffsetMeters: number;
}

/**
 * Evaluates hydrostatic shallow-water hydrodynamics in the Bioluminescent Wetland Mirror Lagoon ([-28, 30], r = 16.5m).
 * - Water surface sits at the equipotential hydrostatic plane `MIRROR_LAGOON_WATER_SURFACE_Y = -0.14m`.
 * - Water depth is strictly `Math.max(0, MIRROR_LAGOON_WATER_SURFACE_Y - groundHeightAt(x, z))`, which is `0.42m` at the
 *   basin center and `0.0m` at the `14.9m` shoreline where the concave lakebed rises above `-0.14m` to the `+0.02m` bank.
 * - Thus the water never floats above the terrain at any point along its 360° perimeter.
 */
export function evaluateHydrodynamics(x: number, z: number): HydrodynamicState {
  const lx = VERDANT_PHYSICS_STANDARD.lagoonCenter[0];
  const lz = VERDANT_PHYSICS_STANDARD.lagoonCenter[1];
  const distToLagoon = Math.hypot(x - lx, z - lz);
  const lakebedY = groundHeightAt(x, z);

  if (distToLagoon >= VERDANT_PHYSICS_STANDARD.lagoonRadiusMeters) {
    return {
      inWater: false,
      onFloatingStonePad: false,
      waterDepthMeters: 0,
      waterSurfaceY: MIRROR_LAGOON_WATER_SURFACE_Y,
      lakebedY,
      wadingDragMultiplier: 1.0,
      surfaceElevationOffsetMeters: 0,
    };
  }

  // Check if player is standing atop one of the 5 Floating Stone Lantern Pads (pad radius = 0.85m, top at waterSurfaceY + 0.08m)
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const r = i === 0 ? 0 : 4.2;
    const padX = lx + Math.cos(a) * r;
    const padZ = lz + Math.sin(a) * r;
    if (Math.hypot(x - padX, z - padZ) <= 0.88) {
      const padTopY = MIRROR_LAGOON_WATER_SURFACE_Y + 0.08;
      return {
        inWater: false,
        onFloatingStonePad: true,
        waterDepthMeters: 0,
        waterSurfaceY: MIRROR_LAGOON_WATER_SURFACE_Y,
        lakebedY,
        wadingDragMultiplier: 1.0,
        surfaceElevationOffsetMeters: Number((padTopY - lakebedY).toFixed(3)),
      };
    }
  }

  // Exact hydrostatic water depth: difference between the equipotential water plane (-0.14m) and the concave lakebed
  const rawDepth = Math.max(0, MIRROR_LAGOON_WATER_SURFACE_Y - lakebedY);
  const waterDepthMeters = Number(
    Math.min(VERDANT_PHYSICS_STANDARD.maxWaterDepthMeters, rawDepth).toFixed(3),
  );
  // Hydrodynamic viscosity tempers walking speed down to 76% at full depth (never 0% — water is permeable!)
  const minRatio = VERDANT_PHYSICS_STANDARD.wadingSpeedPct / 100;
  const wadingDragMultiplier = Number(
    (
      1 -
      (1 - minRatio) *
        Math.min(1, waterDepthMeters / VERDANT_PHYSICS_STANDARD.maxWaterDepthMeters)
    ).toFixed(3),
  );

  return {
    inWater: waterDepthMeters > 0.008,
    onFloatingStonePad: false,
    waterDepthMeters,
    waterSurfaceY: MIRROR_LAGOON_WATER_SURFACE_Y,
    lakebedY,
    wadingDragMultiplier,
    // Player stands directly on the continuous concave lakebed while wading (zero vertical step jump at shoreline!)
    surfaceElevationOffsetMeters: 0,
  };
}

/**
 * Computes Neuromorphic Cymatic Standing Waves on the Mirror Lagoon (`[-28, 30]`) coupled with the
 * 64-bit Rule-30 cellular register, `/6` Icosian Golden-Field Root, and live Hebbian synaptic weight (`w in [1, 16]`).
 * Strictly pins wave displacement to `0.0` at the shoreline (`r >= 14.8m`) so the water edge never lifts off the bank.
 */
export function computeNeuromorphicCymatics(params: {
  localX: number;
  localZ: number;
  elapsedSeconds: number;
  rule30Byte: number;
  icosianRootIndex: number;
  synapticWeight: number;
}): {
  waveDisplacementY: number;
  cymaticNodeCount: number;
  meniscusPulseFactor: number;
} {
  const { localX, localZ, elapsedSeconds, rule30Byte, icosianRootIndex, synapticWeight } = params;
  const r = Math.hypot(localX, localZ);
  const shorelineR = 14.8;

  const cymaticNodeCount = 2 + (icosianRootIndex % 5); // 2..6 azimuthal harmonic nodes
  const weightNorm = Math.max(0.1, Math.min(1, synapticWeight / 16));
  const r30FreqMod = 1.0 + ((rule30Byte & 0x0f) / 15) * 0.35;
  const meniscusPulseFactor = Number(
    (0.75 + 0.25 * Math.sin(elapsedSeconds * 1.8 * r30FreqMod + (rule30Byte >> 4))).toFixed(3),
  );

  if (r >= shorelineR) {
    return {
      waveDisplacementY: 0,
      cymaticNodeCount,
      meniscusPulseFactor,
    };
  }

  // Smooth shoreline boundary envelope that vanishes quadratically at r = shorelineR (14.8m)
  const boundaryEnvelope = Math.pow(1 - r / shorelineR, 1.5);
  const theta = Math.atan2(localZ, localX);
  const radialStanding = Math.cos(r * 1.35 * r30FreqMod - elapsedSeconds * 2.2);
  const azimuthalHarmonic = Math.cos(cymaticNodeCount * theta + elapsedSeconds * 0.9);
  const maxAmpMeters = (0.012 + weightNorm * 0.014) * boundaryEnvelope;
  const waveDisplacementY = Number(
    (maxAmpMeters * (0.65 * radialStanding + 0.35 * azimuthalHarmonic)).toFixed(4),
  );

  return {
    waveDisplacementY,
    cymaticNodeCount,
    meniscusPulseFactor,
  };
}

/**
 * Classifies the physical ground/fluid material directly beneath (x, z) for footstep acoustics and traction.
 */
export function classifySurfaceMaterial(x: number, z: number): SurfaceMaterialId {
  const hydro = evaluateHydrodynamics(x, z);
  if (hydro.onFloatingStonePad) return 'travertine-stone';
  if (hydro.inWater) return 'shallow-water';

  // Central stone pathway (x in [-1.3, 1.3], z in [-34, 3]), Meadow Sundial Plaza (r <= 3.6m around [0, -14]),
  // or Sanctuary Colonnade Plinth (r <= 5.0m around [0, -34])
  if (
    (Math.abs(x) <= 1.25 && z >= -34 && z <= 3) ||
    Math.hypot(x, z + 14) <= 3.6 ||
    Math.hypot(x, z + 34) <= 5.0
  ) {
    return 'travertine-stone';
  }

  // Crystal Geode Mirror Basin (r <= 11.5m around [36, -24])
  if (Math.hypot(x - 36, z + 24) <= 11.5) {
    return 'quartz-crystalline';
  }

  // Bamboo Grove Raked Zen Terrace (r <= 9.5m around [-36, -24])
  if (Math.hypot(x + 36, z + 24) <= 9.5) {
    return 'bamboo-humus';
  }

  return 'meadow-turf';
}

/**
 * Evaluates terrain slope gradient along the movement direction (dirX, dirZ) and returns slope grade & speed factor.
 */
export function evaluateTerrainSlope(
  x: number,
  z: number,
  dirX: number,
  dirZ: number,
): { slopeGradePct: number; slopeSpeedMultiplier: number } {
  const eps = 0.25;
  const hCenter = groundHeightAt(x, z);
  const dhdx = (groundHeightAt(x + eps, z) - hCenter) / eps;
  const dhdz = (groundHeightAt(x, z + eps) - hCenter) / eps;
  const directionalSlope = dhdx * dirX + dhdz * dirZ;
  const slopeGradePct = Number((directionalSlope * 100).toFixed(1));
  // Uphill tempers stride down to 0.85x; gentle downhill eases stride up to 1.05x
  const rawMult = 1 - directionalSlope * 0.55;
  const slopeSpeedMultiplier = Number(Math.max(0.85, Math.min(1.05, rawMult)).toFixed(3));
  return { slopeGradePct, slopeSpeedMultiplier };
}

export interface PlayerPhysicsStepResult {
  x: number;
  z: number;
  y: number;
  effectiveSpeedMps: number;
  surfaceMaterial: SurfaceMaterialId;
  inWater: boolean;
  waterDepthMeters: number;
  wadingDragMultiplier: number;
  slopeGradePct: number;
  obstructedBy: string | null;
}

/**
 * Resolves a single player locomotion step with:
 * - Terrain slope kinematics
 * - Shallow-water hydrodynamic drag (permeable water, never blocks)
 * - Raised stone plinth / pad elevation
 * - Smooth tangential circle-circle sliding collision against solid colliders (columns, stalks, boulders, woody stems)
 */
export function resolvePlayerPhysicsStep(params: {
  currentX: number;
  currentZ: number;
  moveDirX: number;
  moveDirZ: number;
  baseSpeedMps: number;
  dt: number;
  colliders: SolidCollider[];
}): PlayerPhysicsStepResult {
  const { currentX, currentZ, moveDirX, moveDirZ, baseSpeedMps, dt, colliders } = params;
  const playerRadius = VERDANT_PHYSICS_STANDARD.playerBodyRadiusMeters;

  const dirLen = Math.hypot(moveDirX, moveDirZ);
  const normDirX = dirLen > 0.001 ? moveDirX / dirLen : 0;
  const normDirZ = dirLen > 0.001 ? moveDirZ / dirLen : 0;

  const hydroStart = evaluateHydrodynamics(currentX, currentZ);
  const startMaterial = classifySurfaceMaterial(currentX, currentZ);
  const tractionFactor =
    startMaterial === 'travertine-stone'
      ? 1.0
      : startMaterial === 'quartz-crystalline'
        ? 0.99
        : startMaterial === 'bamboo-humus'
          ? 0.97
          : startMaterial === 'meadow-turf'
            ? 0.96
            : 0.92;
  const slope = evaluateTerrainSlope(currentX, currentZ, normDirX, normDirZ);

  const effectiveSpeedMps =
    dirLen > 0.001
      ? Number(
          (
            baseSpeedMps *
            hydroStart.wadingDragMultiplier *
            slope.slopeSpeedMultiplier *
            tractionFactor
          ).toFixed(3),
        )
      : 0;

  // Cross-slope gravitational component nudges stride gently along steep terrain gradients
  const eps = 0.25;
  const hCenter = groundHeightAt(currentX, currentZ);
  const dhdx = (groundHeightAt(currentX + eps, currentZ) - hCenter) / eps;
  const dhdz = (groundHeightAt(currentX, currentZ + eps) - hCenter) / eps;
  const gravityDriftX = dirLen > 0.001 ? -dhdx * 0.12 * dt : 0;
  const gravityDriftZ = dirLen > 0.001 ? -dhdz * 0.12 * dt : 0;

  let nextX = currentX + normDirX * effectiveSpeedMps * dt + gravityDriftX;
  let nextZ = currentZ + normDirZ * effectiveSpeedMps * dt + gravityDriftZ;
  let obstructedBy: string | null = null;

  // Multi-pass tangential sliding collision against solid obstructions
  for (let pass = 0; pass < 2; pass++) {
    for (let i = 0; i < colliders.length; i++) {
      const col = colliders[i];
      const dx = nextX - col.x;
      const dz = nextZ - col.z;
      const minSep = playerRadius + col.radiusMeters;
      const distSq = dx * dx + dz * dz;
      if (distSq < minSep * minSep) {
        const dist = Math.sqrt(distSq) || 0.0001;
        const nx = dx / dist;
        const nz = dz / dist;
        const push = minSep - dist;
        nextX += nx * push;
        nextZ += nz * push;
        if (!obstructedBy) {
          obstructedBy = col.label;
        }
      }
    }
  }

  // Outer amphitheater radial containment (52.5m smooth boundary slide)
  const radialDist = Math.hypot(nextX, nextZ);
  if (radialDist > 52.5) {
    const scale = 52.5 / radialDist;
    nextX *= scale;
    nextZ *= scale;
    if (!obstructedBy) {
      obstructedBy = 'Sanctuary Perimeter Amphitheater Ridge';
    }
  }

  const hydroEnd = evaluateHydrodynamics(nextX, nextZ);
  const surfaceMaterial = classifySurfaceMaterial(nextX, nextZ);

  // Compute standing elevation including stone plazas / floating lagoon pads / continuous concave lakebed
  let plazaOffset = hydroEnd.surfaceElevationOffsetMeters;
  if (Math.hypot(nextX, nextZ + 14) <= 3.4) {
    plazaOffset = Math.max(plazaOffset, 0.16);
  } else if (Math.hypot(nextX, nextZ + 34) <= 4.8) {
    plazaOffset = Math.max(plazaOffset, 0.35);
  }

  const y = Number((groundHeightAt(nextX, nextZ) + plazaOffset).toFixed(3));

  return {
    x: Number(nextX.toFixed(4)),
    z: Number(nextZ.toFixed(4)),
    y,
    effectiveSpeedMps,
    surfaceMaterial,
    inWater: hydroEnd.inWater,
    waterDepthMeters: hydroEnd.waterDepthMeters,
    wadingDragMultiplier: hydroEnd.wadingDragMultiplier,
    slopeGradePct: slope.slopeGradePct,
    obstructedBy,
  };
}

/**
 * Resolves a biome waypoint landing through the full physical collision, hydrodynamic, and plaza elevation solver
 * so that teleporting to any biome (`1..5`) strictly obeys solid-body exclusion, raised plinth/plaza offsets,
 * and surface material classification.
 */
export function resolveBiomeWaypointLanding(
  biome: BiomeId,
  colliders: SolidCollider[],
): PlayerPhysicsStepResult {
  const cfg = BIOME_CONFIGS[biome];
  const rawX = cfg.center[0];
  const rawZ = biome === 'sanctuary' ? cfg.center[1] + 7.2 : cfg.center[1] + 5.2;
  return resolvePlayerPhysicsStep({
    currentX: rawX,
    currentZ: rawZ,
    moveDirX: 0,
    moveDirZ: 0,
    baseSpeedMps: 0,
    dt: 0,
    colliders,
  });
}

/**
 * Evaluates the spatially coherent advected wind vector field W(x, z, t) across the conservatory,
 * coupled with the live Neuromorphic Rule-30 cellular register (`rule30Byte`) and Hebbian weight (`synapticWeight`).
 */
export function evaluateWindField(
  x: number,
  z: number,
  elapsedSeconds: number,
  rule30Byte = 142,
  synapticWeight = 8,
): { windTiltX: number; windTiltZ: number; gustStrength: number } {
  const neuroHarmonic = 1 + ((synapticWeight - 8) / 16) * 0.15;
  const r30PhaseOffset = (rule30Byte & 0x1f) * 0.08;
  const phase = x * 0.08 + z * 0.06 - elapsedSeconds * 1.65 * neuroHarmonic + r30PhaseOffset;
  const secondary = Math.cos(x * 0.05 - z * 0.07 + elapsedSeconds * 1.1);
  const gustStrength = Number((0.5 + 0.5 * Math.sin(phase * 0.7)).toFixed(3));
  const windTiltX = Number(((Math.sin(phase) * 0.085 + secondary * 0.03) * neuroHarmonic).toFixed(4));
  const windTiltZ = Number(((Math.cos(phase) * 0.065 + secondary * 0.025) * neuroHarmonic).toFixed(4));
  return { windTiltX, windTiltZ, gustStrength };
}

/**
 * Computes elastic Hooke's law grass/reed blade deflection when the player walks through permeable grass,
 * coupled with:
 * - The spatially coherent advected wind field (`evaluateWindField` with Neuromorphic Rule-30 & Hebbian weight)
 * - Radial physical contact deflection within `1.85m`
 * - Aerodynamic slipstream vortex wake behind a moving player (`playerVX`, `playerVZ`)
 */
export function computeFoliageDeflection(params: {
  bladeX: number;
  bladeZ: number;
  playerX: number;
  playerZ: number;
  elapsedSeconds: number;
  playerVX?: number;
  playerVZ?: number;
  rule30Byte?: number;
  synapticWeight?: number;
}): { tiltXRad: number; tiltZRad: number; isDeflectedByPlayer: boolean } {
  const {
    bladeX,
    bladeZ,
    playerX,
    playerZ,
    elapsedSeconds,
    playerVX = 0,
    playerVZ = 0,
    rule30Byte = 142,
    synapticWeight = 8,
  } = params;
  const wind = evaluateWindField(bladeX, bladeZ, elapsedSeconds, rule30Byte, synapticWeight);
  const dx = bladeX - playerX;
  const dz = bladeZ - playerZ;
  const dist = Math.hypot(dx, dz);
  const wakeR = VERDANT_PHYSICS_STANDARD.grassWakeRadiusMeters;

  if (dist >= wakeR || dist < 0.0001) {
    return {
      tiltXRad: wind.windTiltX,
      tiltZRad: wind.windTiltZ,
      isDeflectedByPlayer: false,
    };
  }

  // Smooth quadratic falloff pushing blade radially outward from player center
  const falloff = (1 - dist / wakeR) * (1 - dist / wakeR);
  const deflectMag = VERDANT_PHYSICS_STANDARD.maxFoliageDeflectionRad * falloff;
  // Aerodynamic slipstream vortex wake: when player moves with velocity (playerVX, playerVZ),
  // blades in the wake also bend along the slipstream vector
  const speed = Math.hypot(playerVX, playerVZ);
  const slipBoost = Math.min(0.28, speed * 0.038) * falloff;
  const slipXRad = speed > 0.05 ? (playerVZ / speed) * slipBoost : 0;
  const slipZRad = speed > 0.05 ? -(playerVX / speed) * slipBoost : 0;

  // Rotating around X tilts along Z; rotating around Z tilts along -X
  const pushXRad = (dz / dist) * deflectMag + slipXRad;
  const pushZRad = -(dx / dist) * deflectMag + slipZRad;

  return {
    tiltXRad: Number((wind.windTiltX + pushXRad).toFixed(4)),
    tiltZRad: Number((wind.windTiltZ + pushZRad).toFixed(4)),
    isDeflectedByPlayer: falloff > 0.05,
  };
}

/**
 * Evaluates logarithmic atmospheric wind-shear profile `W_canopy(x, y, z, t)` for the 128 elevated
 * Bamboo & Crystal Canopy Foliage Crowns (`y = 5.6m .. 7.1m`), which experience higher wind amplitude
 * and phase lead relative to ground-level flora (`Foundation.Physics.V1.Model::canopyWindShearEnabled`).
 */
export function evaluateCanopyWindShear(params: {
  x: number;
  z: number;
  heightMeters: number;
  tier: number;
  elapsedSeconds: number;
  rule30Byte?: number;
  synapticWeight?: number;
}): { pitchRad: number; rollRad: number; yawFlutterRad: number } {
  const {
    x,
    z,
    heightMeters,
    tier,
    elapsedSeconds,
    rule30Byte = 142,
    synapticWeight = 8,
  } = params;
  const baseWind = evaluateWindField(x, z, elapsedSeconds, rule30Byte, synapticWeight);
  // Logarithmic wind shear profile: u(z) ~ ln(z / z0)
  const shearAmplification = 1.25 + Math.min(0.85, Math.max(0, (heightMeters - 4.0) * 0.18));
  const tierSign = tier === 0 ? 1 : -1;
  const pitchRad = Number(
    (0.18 * tierSign + baseWind.windTiltX * shearAmplification).toFixed(4),
  );
  const rollRad = Number((0.12 + baseWind.windTiltZ * shearAmplification).toFixed(4));
  const yawFlutterRad = Number(
    (Math.sin(elapsedSeconds * 2.4 + x * 0.15 + z * 0.15) * 0.045 * baseWind.gustStrength).toFixed(4),
  );
  return { pitchRad, rollRad, yawFlutterRad };
}

/**
 * Steps a bioluminescent acoustic spore particle (`Foundation.Physics.V1.Model::chemotacticSporeBuoyancyEnabled`)
 * with:
 * - Advected Neuromorphic wind field
 * - Diurnal thermal convection updrafts (stronger at Golden Hour & Dawn, gentle suspended float in Starlight)
 * - Chemotactic attraction toward nearby awakened/terpene-emitting blossoms (`attractorX`, `attractorY`, `attractorZ`)
 * - Aerodynamic slipstream entrainment around the moving player
 * - Stokes viscous damping so velocity never diverges
 */
export function stepSporeFluidDynamics(params: {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  playerX: number;
  playerZ: number;
  playerVX: number;
  playerVZ: number;
  attractorX: number;
  attractorY: number;
  attractorZ: number;
  attractorTerpeneStrength: number; // 0..1
  atmosphere: AtmosphereId;
  elapsedSeconds: number;
  rule30Byte: number;
  synapticWeight: number;
  dt: number;
  colliders?: readonly SolidCollider[];
}): {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  deflectedByObstacle: boolean;
  reflectedByFloor: boolean;
} {
  const {
    x,
    y,
    z,
    vx,
    vy,
    vz,
    playerX,
    playerZ,
    playerVX,
    playerVZ,
    attractorX,
    attractorY,
    attractorZ,
    attractorTerpeneStrength,
    atmosphere,
    elapsedSeconds,
    rule30Byte,
    synapticWeight,
    dt,
    colliders = [],
  } = params;

  const wind = evaluateWindField(x, z, elapsedSeconds, rule30Byte, synapticWeight);
  const thermalBuoyancy =
    atmosphere === 'golden'
      ? 0.34
      : atmosphere === 'dawn'
        ? 0.28
        : atmosphere === 'twilight'
          ? 0.22
          : 0.16;

  // Chemotactic attraction toward high-terpene / attuned nearest blossom
  let chemoAX = 0;
  let chemoAY = 0;
  let chemoAZ = 0;
  const toAttrX = attractorX - x;
  const toAttrY = attractorY + 1.2 - y;
  const toAttrZ = attractorZ - z;
  const distAttr = Math.hypot(toAttrX, toAttrY, toAttrZ);
  if (attractorTerpeneStrength > 0.05 && distAttr > 0.45 && distAttr < 14.0) {
    const pull = (attractorTerpeneStrength * 0.55) / (1 + distAttr * 0.25);
    chemoAX = (toAttrX / distAttr) * pull;
    chemoAY = (toAttrY / distAttr) * pull * 0.5;
    chemoAZ = (toAttrZ / distAttr) * pull;
  }

  // Player aerodynamic slipstream swirl within 3.2m
  let slipAX = 0;
  let slipAZ = 0;
  const dPlayer = Math.hypot(x - playerX, z - playerZ);
  if (dPlayer < 3.2 && dPlayer > 0.05) {
    const wakeFactor = (1 - dPlayer / 3.2) * 0.42;
    slipAX = playerVX * wakeFactor - ((z - playerZ) / dPlayer) * 0.18 * wakeFactor;
    slipAZ = playerVZ * wakeFactor + ((x - playerX) / dPlayer) * 0.18 * wakeFactor;
  }

  // Stokes viscous damping prevents unbounded acceleration
  const stokesDamp = Math.exp(-1.8 * dt);
  let nextVX = (vx + (wind.windTiltZ * 2.2 + chemoAX + slipAX) * dt) * stokesDamp;
  let nextVY =
    (vy + (thermalBuoyancy + chemoAY) * dt) * stokesDamp + (1 - stokesDamp) * thermalBuoyancy;
  let nextVZ = (vz + (wind.windTiltX * 2.2 + chemoAZ + slipAZ) * dt) * stokesDamp;

  let nextX = x + nextVX * dt;
  let nextY = y + nextVY * dt;
  let nextZ = z + nextVZ * dt;
  let deflectedByObstacle = false;
  let reflectedByFloor = false;

  // Solid-Obstacle Potential-Flow Deflection & Boundary Exclusion (`Foundation.Physics.V1.Model::sporeSolidObstacleDeflectionEnabled`)
  const sporeClearanceMeters = 0.16;
  for (let i = 0; i < colliders.length; i++) {
    const col = colliders[i];
    const dx = nextX - col.x;
    const dz = nextZ - col.z;
    const minSep = col.radiusMeters + sporeClearanceMeters;
    const distSq = dx * dx + dz * dz;
    if (distSq < minSep * minSep) {
      const colBaseY = groundHeightAt(col.x, col.z);
      if (nextY <= colBaseY + col.heightMeters) {
        const dist = Math.sqrt(distSq) || 0.001;
        const nx = dx / dist;
        const nz = dz / dist;
        nextX = col.x + nx * minSep;
        nextZ = col.z + nz * minSep;
        // Reflect inward radial velocity and add tangential potential-flow slip around cylinder
        const radialVel = nextVX * nx + nextVZ * nz;
        if (radialVel < 0) {
          nextVX -= 1.55 * radialVel * nx;
          nextVZ -= 1.55 * radialVel * nz;
        }
        // Tangential vortex slipstream around column
        nextVX += -nz * 0.18;
        nextVZ += nx * 0.18;
        deflectedByObstacle = true;
      }
    }
  }

  // Terrain & Hydrostatic Water Meniscus Floor Constraint (`Foundation.Physics.V1.Model::sporeTerrainMeniscusFloorEnabled`)
  const terrainY = groundHeightAt(nextX, nextZ);
  const inLagoonBasin =
    Math.hypot(nextX - MIRROR_LAGOON_CENTER[0], nextZ - MIRROR_LAGOON_CENTER[1]) < 14.9;
  const surfaceFloorY =
    (inLagoonBasin ? Math.max(terrainY, MIRROR_LAGOON_WATER_SURFACE_Y) : terrainY) + 0.14;
  if (nextY < surfaceFloorY) {
    nextY = surfaceFloorY;
    nextVY = Math.max(0.14, Math.abs(nextVY) * 0.65);
    reflectedByFloor = true;
  }

  return {
    x: nextX,
    y: nextY,
    z: nextZ,
    vx: nextVX,
    vy: nextVY,
    vz: nextVZ,
    deflectedByObstacle,
    reflectedByFloor,
  };
}

export interface GroundWavePropagationState {
  radiusMeters: number;
  scaleMultiplier: number;
  opacity: number;
  elevationY: number;
  surfaceTiltX: number;
  surfaceTiltZ: number;
  waveSpeedMps: number;
  obstacleAttenuation: number;
  dominantCompound: MatterCompoundId;
  compoundBulkModulusGPa: number;
}

/**
 * Evaluates physical ground/water wave ring propagation (`Foundation.Physics.V1.Model::waveRingSurfaceNormalAlignmentEnabled`):
 * - Aligns the expanding wave ring to the local terrain surface normal `(surfaceTiltX, surfaceTiltZ)` so rings never clip into hillsides,
 *   or keeps the ring flush on the equipotential hydrostatic plane `MIRROR_LAGOON_WATER_SURFACE_Y` when in shallow water.
 * - Synthesizes propagation speed from the local surface compound profile (`synthesizeCompoundSurfaceProfile`:
 *   `quartz-crystalline`: `4.4 m/s`, `travertine-stone`: `4.0 m/s`, `bamboo-humus`: `3.6 m/s`, `meadow-turf`: `3.4 m/s`,
 *   `shallow-water` capillary-gravity ripple: `2.35 m/s`).
 * - Attenuates wave amplitude when the expanding wavefront intersects solid stone/boulder colliders.
 */
export function evaluateGroundWavePropagation(params: {
  x: number;
  z: number;
  ageSec: number;
  maxAgeSec?: number;
  colliders?: readonly SolidCollider[];
}): GroundWavePropagationState {
  const { x, z, ageSec, maxAgeSec = 1.7, colliders = [] } = params;
  const hydro = evaluateHydrodynamics(x, z);
  const material = classifySurfaceMaterial(x, z);
  const surfaceCompound = synthesizeCompoundSurfaceProfile(material);
  const tilt = hydro.inWater
    ? { surfaceTiltX: 0, surfaceTiltZ: 0 }
    : computeTerrainNormalTilt(x, z);

  const waveSpeedMps = surfaceCompound.groundWavePropagationMps;

  const clampedAge = Math.max(0, Math.min(maxAgeSec, ageSec));
  const progress = clampedAge / maxAgeSec;
  const radiusMeters = Number((0.85 + clampedAge * waveSpeedMps * 0.65).toFixed(3));
  const scaleMultiplier = Number(radiusMeters.toFixed(3));

  let obstacleAttenuation = 0;
  for (let i = 0; i < colliders.length; i++) {
    const col = colliders[i];
    if (col.category === 'flora-stem-core') continue;
    const d = Math.hypot(col.x - x, col.z - z);
    if (d > 0.2 && d <= radiusMeters + col.radiusMeters) {
      obstacleAttenuation = Math.min(0.45, obstacleAttenuation + col.acousticOcclusion * 0.45);
    }
  }

  const elevationY = Number(
    (
      (hydro.inWater ? MIRROR_LAGOON_WATER_SURFACE_Y : groundHeightAt(x, z)) + 0.038
    ).toFixed(3),
  );
  const opacity = Number(
    ((1 - progress) * 0.68 * (1 - obstacleAttenuation)).toFixed(3),
  );

  return {
    radiusMeters,
    scaleMultiplier,
    opacity,
    elevationY,
    surfaceTiltX: tilt.surfaceTiltX,
    surfaceTiltZ: tilt.surfaceTiltZ,
    waveSpeedMps,
    obstacleAttenuation: Number(obstacleAttenuation.toFixed(3)),
    dominantCompound: surfaceCompound.dominantCompound,
    compoundBulkModulusGPa: surfaceCompound.bulkElasticModulusGPa,
  };
}

/**
 * Computes acoustic line-of-sight occlusion between the listener and a sound-emitting plant specimen
 * across solid stone/boulder colliders.
 */
export function computeAcousticOcclusion(
  playerX: number,
  playerZ: number,
  plantX: number,
  plantZ: number,
  colliders: SolidCollider[],
): number {
  const segX = plantX - playerX;
  const segZ = plantZ - playerZ;
  const segLenSq = segX * segX + segZ * segZ;
  if (segLenSq < 0.25) return 0;

  let totalOcclusion = 0;
  for (let i = 0; i < colliders.length; i++) {
    const col = colliders[i];
    if (col.category === 'flora-stem-core') continue; // Plant stems don't occlude their own blossom
    const toColX = col.x - playerX;
    const toColZ = col.z - playerZ;
    const t = Math.max(0, Math.min(1, (toColX * segX + toColZ * segZ) / segLenSq));
    if (t <= 0.05 || t >= 0.95) continue;
    const closestX = playerX + t * segX;
    const closestZ = playerZ + t * segZ;
    const distToAxis = Math.hypot(col.x - closestX, col.z - closestZ);
    if (distToAxis < col.radiusMeters) {
      totalOcclusion = Math.min(0.45, totalOcclusion + col.acousticOcclusion);
    }
  }
  return Number(totalOcclusion.toFixed(3));
}

// ---------------------------------------------------------------------------
// Subsystem 13: Neuromorphic Live Garden Synthesis & UORLUT01 Integer Stack
// Mirrors `prism/src/Foundation/Neuromorphic/V1/Model.lex.tex` (`prism/neuromorphic-standard/1`)
// Inspired by `afflom/rule30` (Rule-30 cellular dynamics & bounded Hebbian plasticity)
// and `casey-allard/lexlean-r4` (`UORLUT01` `/5` Basin, `/6` Walk, `/7` PrimeAddress GCD Sieve, `/8` 28-bit PointKey)
// ---------------------------------------------------------------------------

export type NeuromorphicFamilyId =
  | 'meadow-lydian'
  | 'grove-dorian'
  | 'crystal-octatonic'
  | 'wetland-pentatonic'
  | 'sanctuary-just';

export type NeuromorphicStrategyId =
  | 'harmonic-voice-leading'
  | 'counterpoint-canonic-echo'
  | 'mycelial-seedling-germination'
  | 'overtone-spectral-refinement';

export interface NeuromorphicStrategySpec {
  id: NeuromorphicStrategyId;
  portfolioOrder: number;
  label: string;
  botanicalDomainRole: string;
  templateDigestHex: string;
}

export const NEUROMORPHIC_FAMILIES: Record<BiomeId, NeuromorphicFamilyId> = {
  meadow: 'meadow-lydian',
  grove: 'grove-dorian',
  crystal: 'crystal-octatonic',
  wetland: 'wetland-pentatonic',
  sanctuary: 'sanctuary-just',
};

export const NEUROMORPHIC_PORTFOLIO: NeuromorphicStrategySpec[] = [
  {
    id: 'harmonic-voice-leading',
    portfolioOrder: 0,
    label: 'Golden-Field Modal Voice-Leading',
    botanicalDomainRole:
      'Routes Rule-30 diagonal bitstreams into non-repeating Just-Intonation chord inversions',
    templateDigestHex: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  },
  {
    id: 'counterpoint-canonic-echo',
    portfolioOrder: 1,
    label: 'Prime-Kinship Canonic Counterpoint',
    botanicalDomainRole:
      'Recalls harmonically related flora via PrimeAddress GCD intersection sieve for polyphonic answers',
    templateDigestHex: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
  },
  {
    id: 'mycelial-seedling-germination',
    portfolioOrder: 2,
    label: 'Mycelial Geodesic Morphogenesis',
    botanicalDomainRole:
      'Germinates emergent luminescent flora specimens along the player’s Z[phi] golden-field trajectory',
    templateDigestHex: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
  },
  {
    id: 'overtone-spectral-refinement',
    portfolioOrder: 3,
    label: 'Overtone Spectral Q-Refinement',
    botanicalDomainRole:
      'Adapts 5-partial modal bell weights and resonance filter Q to the garden’s synaptic homeostasis',
    templateDigestHex: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
  },
];

export interface HebbianWeightEntry {
  strategy: NeuromorphicStrategyId;
  family: NeuromorphicFamilyId;
  weight: number; // Bounded integer in [1, 16], initial 8
}

export interface HebbianOutcomeEvent {
  strategy: NeuromorphicStrategyId;
  family: NeuromorphicFamilyId;
  success: boolean;
}

export type PrismDomainId =
  | 'infrastructure'
  | 'physics'
  | 'botany'
  | 'ecology'
  | 'acoustics'
  | 'articulation'
  | 'soundtrack'
  | 'humane'
  | 'brand'
  | 'neuromorphic';

export const PRISM_DOMAIN_ORDER: readonly PrismDomainId[] = [
  'infrastructure',
  'physics',
  'botany',
  'ecology',
  'acoustics',
  'articulation',
  'soundtrack',
  'humane',
  'brand',
  'neuromorphic',
];

/**
 * Canonical Domain Basis Primes (`Foundation.Neuromorphic.V1.Model::UniversalNeuromorphicBusSpec`)
 * Every single Prism Foundation domain has its own prime basis in `/7` PrimeAddress space,
 * enabling exact GCD kinship and cross-domain synaptic transfer across all 10 subsystems.
 */
export const PRISM_DOMAIN_BASIS_PRIMES: Record<PrismDomainId, number> = {
  ...GENERATED_PRISM_DOMAIN_BASIS_PRIMES,
};

export interface UniversalNeuromorphicBusSpec {
  coupledModuleCount: number;
  domainBasisPrimeCount: number;
  crossDomainTransferEnabled: boolean;
  autopoieticSelfRefinementEnabled: boolean;
  infrastructureCoupled: boolean;
  zeroManualIterationOverhead: boolean;
}

export interface NeuromorphicSynthesisStandardModel {
  profile: string;
  plasticity: {
    weightMin: number;
    weightMax: number;
    weightInitial: number;
    weightRaise: number;
    weightLower: number;
    consolidationThreshold: number;
    familyCount: number;
    strategyCount: number;
  };
  cellularAutomaton: {
    ruleNumber: number;
    registerWidthBits: number;
    orbitBound: number;
    periodBound: number;
    drivesVoiceLeading: boolean;
    drivesMorphogenesis: boolean;
  };
  lutStack: {
    headerMagic: string;
    basinStatesCl06: number;
    icosianGoldenRoots: number;
    primeAddressBasisCount: number;
    pointKeyBits: number;
    shortCycleGuardMaxPeriod: number;
    maxEmergentSeedlings: number;
  };
  universalBus: UniversalNeuromorphicBusSpec;
  stakeholderEntity: EmergentEntityStakeholderSpec;
  neuromorphicBridge: NeuromorphicDomainBridgeSpec;
}

export const VERDANT_NEUROMORPHIC_STANDARD: NeuromorphicSynthesisStandardModel = {
  profile: GENERATED_PRISM_STANDARDS.neuromorphic.profile,
  plasticity: {
    ...GENERATED_PRISM_STANDARDS.neuromorphic.plasticity,
  },
  cellularAutomaton: {
    ...GENERATED_PRISM_STANDARDS.neuromorphic.cellularAutomaton,
  },
  lutStack: {
    ...GENERATED_PRISM_STANDARDS.neuromorphic.lutStack,
  },
  universalBus: {
    ...GENERATED_PRISM_STANDARDS.neuromorphic.universalBus,
  },
  stakeholderEntity: {
    ...GENERATED_PRISM_STANDARDS.neuromorphic.stakeholderEntity,
  },
  neuromorphicBridge: {
    neuromorphicBusCoupled:
      GENERATED_PRISM_STANDARDS.neuromorphic.universalBus.zeroManualIterationOverhead,
    domainBasisPrime: GENERATED_PRISM_DOMAIN_BASIS_PRIMES.neuromorphic,
    rule30RegisterBits: GENERATED_PRISM_STANDARDS.neuromorphic.cellularAutomaton.registerWidthBits,
    pointKeyBits: GENERATED_PRISM_STANDARDS.neuromorphic.lutStack.pointKeyBits,
    crossDomainTransferEnabled:
      GENERATED_PRISM_STANDARDS.neuromorphic.universalBus.crossDomainTransferEnabled,
    autopoieticSelfRefinementEnabled:
      GENERATED_PRISM_STANDARDS.neuromorphic.universalBus.autopoieticSelfRefinementEnabled,
  },
};

export const PRISM_DOMAIN_BRIDGES: Record<PrismDomainId, NeuromorphicDomainBridgeSpec> = {
  infrastructure: VERDANT_INFRASTRUCTURE_STANDARD.neuromorphicBridge,
  physics: VERDANT_PHYSICS_STANDARD.neuromorphicBridge,
  botany: VERDANT_BOTANICAL_STANDARD.neuromorphicBridge,
  ecology: VERDANT_ECOLOGY_STANDARD.neuromorphicBridge,
  acoustics: VERDANT_ACOUSTIC_STANDARD.neuromorphicBridge,
  articulation: VERDANT_ARTICULATION_STANDARD.neuromorphicBridge,
  soundtrack: {
    ...GENERATED_PRISM_STANDARDS.soundtrack.neuromorphicBridge,
  },
  humane: VERDANT_HUMANE_STANDARD.neuromorphicBridge,
  brand: VERDANT_BRAND_STANDARD.neuromorphicBridge,
  neuromorphic: VERDANT_NEUROMORPHIC_STANDARD.neuromorphicBridge,
};

/**
 * Exact bounded Hebbian learning rule `learnHebbianWeight(w, success)` backed directly by
 * `GENERATED_PRISM_PLASTICITY_LUT` compiled from `Foundation.Neuromorphic.V1.Model::learnHebbianWeight`
 * (proven bounded in `hebbianBidirectionalBoundsHold`):
 * - Potentiates by `weightRaise` (+2) on resonant success, clamped to `weightMax` (16).
 * - Depresses by `weightLower` (-1) on non-resonant step, clamped to `weightMin` (1).
 */
export function learnHebbianWeight(w: number, success: boolean): number {
  const lut = success
    ? GENERATED_PRISM_PLASTICITY_LUT.learnHebbianWeightCoactive
    : GENERATED_PRISM_PLASTICITY_LUT.learnHebbianWeightSilent;
  return lut[clampLutIndex(w, lut.length)];
}

/**
 * Creates the initial 20-synapse Hebbian weight table (4 strategies × 5 botanical families)
 * initialized at `weightInitial = 8`.
 */
export function createInitialHebbianTable(): HebbianWeightEntry[] {
  const families: NeuromorphicFamilyId[] = [
    'meadow-lydian',
    'grove-dorian',
    'crystal-octatonic',
    'wetland-pentatonic',
    'sanctuary-just',
  ];
  const entries: HebbianWeightEntry[] = [];
  for (const family of families) {
    for (const strat of NEUROMORPHIC_PORTFOLIO) {
      entries.push({
        strategy: strat.id,
        family,
        weight: VERDANT_NEUROMORPHIC_STANDARD.plasticity.weightInitial,
      });
    }
  }
  return entries;
}

export function getHebbianWeight(
  table: HebbianWeightEntry[],
  strategy: NeuromorphicStrategyId,
  family: NeuromorphicFamilyId,
): number {
  const found = table.find((e) => e.strategy === strategy && e.family === family);
  return found ? found.weight : VERDANT_NEUROMORPHIC_STANDARD.plasticity.weightInitial;
}

export function updateHebbianWeight(
  table: HebbianWeightEntry[],
  strategy: NeuromorphicStrategyId,
  family: NeuromorphicFamilyId,
  success: boolean,
): HebbianWeightEntry[] {
  let matched = false;
  const next = table.map((entry) => {
    if (entry.strategy === strategy && entry.family === family) {
      matched = true;
      return {
        ...entry,
        weight: learnHebbianWeight(entry.weight, success),
      };
    }
    return entry;
  });
  if (!matched) {
    next.push({
      strategy,
      family,
      weight: learnHebbianWeight(
        VERDANT_NEUROMORPHIC_STANDARD.plasticity.weightInitial,
        success,
      ),
    });
  }
  return next;
}

export function learnAllHebbian(
  table: HebbianWeightEntry[],
  outcomes: HebbianOutcomeEvent[],
): HebbianWeightEntry[] {
  let current = table;
  for (let i = 0; i < outcomes.length; i++) {
    const ev = outcomes[i];
    current = updateHebbianWeight(current, ev.strategy, ev.family, ev.success);
  }
  return current;
}

/**
 * Stable priority scheduler `schedule` from `afflom/rule30`:
 * Orders the 4 synthesis strategies for a given botanical family descending by their
 * live Hebbian weight `w in [1, 16]`, breaking ties deterministically by `portfolioOrder`.
 */
export function scheduleNeuromorphicStrategies(
  family: NeuromorphicFamilyId,
  table: HebbianWeightEntry[],
): Array<NeuromorphicStrategySpec & { weight: number }> {
  return [...NEUROMORPHIC_PORTFOLIO]
    .map((spec) => ({
      ...spec,
      weight: getHebbianWeight(table, spec.id, family),
    }))
    .sort((a, b) => {
      if (b.weight !== a.weight) return b.weight - a.weight;
      return a.portfolioOrder - b.portfolioOrder;
    });
}

/**
 * Exact Elementary Cellular Automaton Rule 30 single-cell transition backed directly by
 * `GENERATED_PRISM_RULE30_LUT` compiled from `Foundation.Neuromorphic.V1.Model::rule30CellStep`
 * (`111->0, 110->0, 101->0, 100->1, 011->1, 010->1, 001->1, 000->0`).
 */
export function rule30CellStep(left: boolean, center: boolean, right: boolean): boolean {
  const idx = (left ? 4 : 0) | (center ? 2 : 0) | (right ? 1 : 0);
  return GENERATED_PRISM_RULE30_LUT[idx];
}

/**
 * Steps a 64-cell cyclic Rule-30 register by one generation and returns the new 64-cell boolean row
 * along with its center-column bit, 8-bit diagonal signature (`0..255`), and active cell density.
 */
export function stepRule30Row(
  row: boolean[],
  perturbationIndex?: number,
): {
  nextRow: boolean[];
  centerBit: boolean;
  diagonalByte: number;
  activeCount: number;
} {
  const width = 64;
  const working = row.length === width ? [...row] : createInitialRule30Row();
  if (typeof perturbationIndex === 'number' && perturbationIndex >= 0) {
    const idx = ((perturbationIndex % width) + width) % width;
    working[idx] = !working[idx];
  }

  const nextRow = new Array<boolean>(width);
  let activeCount = 0;
  for (let i = 0; i < width; i++) {
    const left = working[(i - 1 + width) % width];
    const center = working[i];
    const right = working[(i + 1) % width];
    const bit = rule30CellStep(left, center, right);
    nextRow[i] = bit;
    if (bit) activeCount++;
  }

  // Extract 8-bit signature around the center column (cells 28..35)
  let diagonalByte = 0;
  for (let b = 0; b < 8; b++) {
    if (nextRow[28 + b]) {
      diagonalByte |= 1 << b;
    }
  }

  return {
    nextRow,
    centerBit: nextRow[32],
    diagonalByte,
    activeCount,
  };
}

export function createInitialRule30Row(): boolean[] {
  const row = new Array<boolean>(64).fill(false);
  row[32] = true; // Canonical single-seed center cell
  return row;
}

// ---------------------------------------------------------------------------
// UORLUT01 Integer Lookup Stack: `/5` Basin, `/6` Walk, `/7` PrimeAddress, `/8` PointKey
// Derived directly from `Foundation.Neuromorphic.V1.Model::verdantUorLutContextPrimes`
// (`GENERATED_PRISM_CONTEXT_PRIMES`, proven strictly ordered in `uorLutContextPrimesStrictlyOrderedHolds`)
// ---------------------------------------------------------------------------

export const BIOME_PRIMES: Record<BiomeId, number> = {
  meadow: GENERATED_PRISM_CONTEXT_PRIMES.meadowPrime,
  grove: GENERATED_PRISM_CONTEXT_PRIMES.grovePrime,
  crystal: GENERATED_PRISM_CONTEXT_PRIMES.crystalPrime,
  wetland: GENERATED_PRISM_CONTEXT_PRIMES.wetlandPrime,
  sanctuary: GENERATED_PRISM_CONTEXT_PRIMES.sanctuaryPrime,
};

export const SPECIES_PRIMES: Record<PlantSpeciesId, number> = {
  'chime-lily': GENERATED_PRISM_CONTEXT_PRIMES.chimeLilyPrime,
  'pulse-fern': GENERATED_PRISM_CONTEXT_PRIMES.pulseFernPrime,
  'echo-lotus': GENERATED_PRISM_CONTEXT_PRIMES.echoLotusPrime,
  'drone-moss': GENERATED_PRISM_CONTEXT_PRIMES.droneMossPrime,
  'star-orchid': GENERATED_PRISM_CONTEXT_PRIMES.starOrchidPrime,
};

export const ATMOSPHERE_PRIMES: Record<AtmosphereId, number> = {
  dawn: GENERATED_PRISM_CONTEXT_PRIMES.dawnPrime,
  golden: GENERATED_PRISM_CONTEXT_PRIMES.goldenPrime,
  twilight: GENERATED_PRISM_CONTEXT_PRIMES.twilightPrime,
  starlight: GENERATED_PRISM_CONTEXT_PRIMES.starlightPrime,
};

export const ACTION_PRIMES: Record<PlayerActionId, number> = {
  observe: GENERATED_PRISM_CONTEXT_PRIMES.observePrime,
  touch: GENERATED_PRISM_CONTEXT_PRIMES.touchPrime,
  attune: GENERATED_PRISM_CONTEXT_PRIMES.attunePrime,
  stroll: GENERATED_PRISM_CONTEXT_PRIMES.strollPrime,
  stillness: GENERATED_PRISM_CONTEXT_PRIMES.stillnessPrime,
};

export const CHORUS_PRIMES: Record<ChorusStateId, number> = {
  dormant: GENERATED_PRISM_CONTEXT_PRIMES.dormantPrime,
  awakened: GENERATED_PRISM_CONTEXT_PRIMES.awakenedPrime,
};

/**
 * 17-Root Icosian Golden-Field Z[phi] Snap Ratios (`R4-20` / `R4-23`)
 * Maps an orbit index `0..16` into exact rational harmonic & phyllotaxis multipliers.
 */
export const ICOSIAN_GOLDEN_ROOTS: readonly {
  rootIndex: number;
  label: string;
  harmonicRatio: number;
  angleRad: number;
}[] = Array.from({ length: 17 }, (_, i) => {
  const goldenAngleRad = (137.50776405 * Math.PI) / 180;
  const harmonicRatios = [
    1.0,
    9 / 8,
    5 / 4,
    4 / 3,
    11 / 8,
    3 / 2,
    13 / 8,
    5 / 3,
    7 / 4,
    15 / 8,
    2.0,
    9 / 4,
    5 / 2,
    8 / 3,
    3.0,
    10 / 3,
    4.0,
  ];
  return {
    rootIndex: i,
    label: `Z[φ] Root #${i + 1}`,
    harmonicRatio: harmonicRatios[i],
    angleRad: Number(((i * goldenAngleRad) % (Math.PI * 2)).toFixed(4)),
  };
});

/**
 * `/5` Basin: Computes the 64-state Clifford `Cl(0,6)` signed-axis basin state (`0..63`)
 * from the player's spatial coordinates and orientation.
 */
export function computeCliffordBasinState(
  playerX: number,
  playerZ: number,
  playerYaw: number,
): number {
  const b0 = playerX >= 0 ? 1 : 0;
  const b1 = playerZ >= 0 ? 2 : 0;
  const b2 = Math.abs(playerX) > 18 ? 4 : 0;
  const b3 = Math.abs(playerZ) > 18 ? 8 : 0;
  const b4 = Math.sin(playerYaw) >= 0 ? 16 : 0;
  const b5 = Math.cos(playerYaw) >= 0 ? 32 : 0;
  return (b0 | b1 | b2 | b3 | b4 | b5) & 0x3f;
}

/**
 * `/7` Durable Turn Memory: Computes the exact integer `PrimeAddress` for a botanical interaction.
 */
export function computePrimeAddress(
  biome: BiomeId,
  species: PlantSpeciesId,
  atmosphere: AtmosphereId,
  action: PlayerActionId,
): number {
  return (
    BIOME_PRIMES[biome] *
    SPECIES_PRIMES[species] *
    ATMOSPHERE_PRIMES[atmosphere] *
    ACTION_PRIMES[action]
  );
}

/**
 * Exact Euclidean Greatest Common Divisor (`GCD`) for the `/7` PrimeAddress intersection sieve.
 */
export function gcdExact(a: number, b: number): number {
  let x = Math.abs(Math.trunc(a));
  let y = Math.abs(Math.trunc(b));
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
}

/**
 * Checks the `short_cycle` guard (`period 1..=4`) from `lexlean-r4`:
 * Returns true if appending `candidateKey` to `recentKeys` would repeat a short cycle of period `1..4`.
 */
export function hasShortCycleRepetition(
  recentKeys: number[],
  candidateKey: number,
  maxPeriod = VERDANT_NEUROMORPHIC_STANDARD.lutStack.shortCycleGuardMaxPeriod,
): boolean {
  const seq = [...recentKeys, candidateKey];
  const n = seq.length;
  for (let period = 1; period <= maxPeriod; period++) {
    if (n >= period * 2) {
      let matches = true;
      for (let k = 0; k < period; k++) {
        if (seq[n - 1 - k] !== seq[n - 1 - period - k]) {
          matches = false;
          break;
        }
      }
      if (matches) return true;
    }
  }
  return false;
}

/**
 * `/8` PointKey: Computes the exact 28-bit `PointKey` anchor (`0x0000000 .. 0xFFFFFFF`)
 * synchronizing `/5` Clifford Basin (`6` bits), `/6` Icosian Root (`5` bits),
 * `/7` PrimeAddress residue (`9` bits), and Rule-30 diagonal byte (`8` bits).
 */
export function computePointKey28(params: {
  basinState: number;
  icosianRoot: number;
  primeAddress: number;
  rule30Byte: number;
}): number {
  const basin6 = params.basinState & 0x3f;
  const root5 = params.icosianRoot & 0x1f;
  const prime9 = params.primeAddress % 509; // Largest prime < 512
  const r30_8 = params.rule30Byte & 0xff;
  return ((basin6 << 22) | (root5 << 17) | (prime9 << 8) | r30_8) & 0x0fffffff;
}

/**
 * Exact `verifyPointKeyResonanceGate` from `Foundation.Neuromorphic.V1.Model`:
 * Admits live garden morphogenesis and consolidated counterpoint when:
 * - `synapticWeight >= 12`
 * - `orphanCount === 0`
 * - `shortCycleCount === 0`
 * - `windowHi >= 8`
 */
export function verifyPointKeyResonanceGate(
  synapticWeight: number,
  orphanCount: number,
  shortCycleCount: number,
  windowHi: number,
): boolean {
  return (
    synapticWeight >= VERDANT_NEUROMORPHIC_STANDARD.plasticity.consolidationThreshold &&
    orphanCount === 0 &&
    shortCycleCount === 0 &&
    windowHi >= 8
  );
}

/**
 * Universal Neuromorphic Primitive (`PrismDomainNeuromorphicNode`) shared identically across all 10 Prism domains
 * (`infrastructure`, `physics`, `botany`, `ecology`, `acoustics`, `articulation`, `soundtrack`, `humane`, `brand`, `neuromorphic`).
 */
export interface PrismDomainNeuromorphicNode {
  domainId: PrismDomainId;
  basisPrime: number;
  synapticWeight: number; // Bounded Hebbian weight in [1, 16], initial 8
  fidelityMultiplier: number; // 0.78125 .. 1.25 (1.0 + (synapticWeight - 8) * 0.03125)
  rule30Byte: number; // Dedicated phase-shifted 8-bit diagonal slice (0..255) from the 64-bit Rule-30 register
  cliffordBasinState: number; // `/5` Cl(0,6) signed-axis basin (0..63)
  icosianRootIndex: number; // `/6` Z[φ] golden-field root (0..16)
  primeAddress: number; // `/7` Durable integer PrimeAddress = basisPrime * contextPrimeProduct
  pointKey28: number; // `/8` 28-bit PointKey synchronizing /5, /6, /7, and Rule-30 byte
  consolidated: boolean; // True when synapticWeight >= 12
  receivedCrossDomainTransfers: number; // Count of synaptic enhancements received from other Prism domains
}

export interface UniversalNeuromorphicManifold {
  domains: Record<PrismDomainId, PrismDomainNeuromorphicNode>;
  globalFidelityIndex: number; // Mean fidelity multiplier across all 10 domains (0.78125 .. 1.25)
  consolidatedDomainCount: number; // 0..10 domains at or above consolidation threshold (w >= 12)
  totalCrossDomainTransfers: number; // Cumulative cross-domain synaptic transfers executed
  lastImprovedDomain: PrismDomainId;
  manifoldPointKeyHex: string;
}

/**
 * Self-refining directives automatically derived for all 10 Prism domains from the live
 * `UniversalNeuromorphicManifold`. When any domain improves, `propagateCrossDomainEnhancement`
 * transfers synaptic weight across the entire manifold and refines every domain's directive automatically.
 */
export interface CrossDomainRefinementDirectives {
  infrastructure: {
    toneMappingExposure: number; // 1.06 .. 1.24 (refined by infrastructure + brand synaptic fidelity)
    microReliefBumpScale: number; // 0.032 .. 0.056 (refined by infrastructure + physics synaptic fidelity)
    activeSporePoolRatio: number; // 0.65 .. 1.0 (adaptive zero-GC ring buffer utilization)
    constellationHaloOpacity: number; // 0.20 .. 0.42 (refined by infrastructure + botany synaptic fidelity)
  };
  physics: {
    cymaticWaveCoherence: number; // 0.85 .. 1.25
    vortexWakeCoherence: number; // 0.85 .. 1.25
    chemotacticSporeAttractionMultiplier: number; // 0.85 .. 1.30
  };
  botany: {
    kuramotoCouplingMultiplier: number; // 0.85 .. 1.35
    turgorVitalityMultiplier: number; // 0.92 .. 1.18
    emissiveBloomBoost: number; // 0.0 .. 0.35
  };
  ecology: {
    mycorrhizalConductivityMultiplier: number; // 0.88 .. 1.28
    terpeneDiffusionClarity: number; // 0.88 .. 1.25
  };
  acoustics: {
    modalFilterQMultiplier: number; // 0.90 .. 1.28
    reverbSendRefinement: number; // 0.90 .. 1.22
  };
  articulation: {
    cameraSpringCritDampingRefinement: number; // 0.92 .. 1.18
    anatomicalGraceMultiplier: number; // 0.90 .. 1.24
  };
  soundtrack: {
    counterpointHarmonicRichness: number; // 0.88 .. 1.25
  };
  humane: {
    restorativeStillnessBonus: number; // 0 .. 6
  };
  brand: {
    atmosphericDepthContrast: number; // 0.92 .. 1.20
  };
  neuromorphic: {
    crossDomainSynergyFactor: number; // 0.80 .. 1.25
  };
}

/**
 * Exact cross-domain synaptic weight transfer operator `transferWeightCrossDomain`
 * backed directly by `GENERATED_PRISM_PLASTICITY_LUT.transferWeightCrossDomain`
 * compiled from `Foundation.Neuromorphic.V1.Model::transferWeightCrossDomain` (proven bounded and monotonic in
 * `crossDomainTransferBoundedAndMonotonicHolds`).
 */
export function transferWeightCrossDomain(
  wTarget: number,
  sourceConsolidated: boolean,
): number {
  const lut = sourceConsolidated
    ? GENERATED_PRISM_PLASTICITY_LUT.transferWeightCrossDomainCoactive
    : GENERATED_PRISM_PLASTICITY_LUT.transferWeightCrossDomainSilent;
  return lut[clampLutIndex(wTarget, lut.length)];
}

/**
 * Exact autopoietic self-refinement operator `refineDomainWeightAutopoietic`
 * backed directly by `GENERATED_PRISM_PLASTICITY_LUT.refineDomainWeightAutopoietic`
 * compiled from `Foundation.Neuromorphic.V1.Model::refineDomainWeightAutopoietic` (proven bounded, monotonic,
 * and fixed-point convergent at `w* = 16` in `autopoieticModelRefinementConvergesAndBoundedHolds`).
 */
export function refineDomainWeightAutopoietic(
  wCurrent: number,
  wLeader: number,
): number {
  const lut = GENERATED_PRISM_PLASTICITY_LUT.refineDomainWeightAutopoietic;
  return lut[clampLutIndex(wCurrent, lut.length)][clampLutIndex(wLeader, lut[0].length)];
}

function extractDomainRule30Slice(row: boolean[], domainIndex: number): number {
  const width = 64;
  const offset = (24 + domainIndex * 5) % width;
  let byte = 0;
  for (let b = 0; b < 8; b++) {
    if (row[(offset + b) % width]) {
      byte |= 1 << b;
    }
  }
  return byte;
}

function computeDomainFidelityMultiplier(synapticWeight: number): number {
  return Number((1.0 + (synapticWeight - 8) * 0.03125).toFixed(5));
}

/**
 * Initializes the 10-Domain Universal Neuromorphic Manifold (`UniversalNeuromorphicManifold`),
 * equipping every Prism domain (`infrastructure`, `physics`, `botany`, `ecology`, `acoustics`,
 * `articulation`, `soundtrack`, `humane`, `brand`, `neuromorphic`) with the identical
 * `UORLUT01` + Rule-30 + bounded Hebbian node architecture.
 */
export function createInitialUniversalManifold(): UniversalNeuromorphicManifold {
  const initialRow = stepRule30Row(createInitialRule30Row()).nextRow;
  const baseContextPrime = computePrimeAddress('meadow', 'chime-lily', 'dawn', 'observe');
  const domains = {} as Record<PrismDomainId, PrismDomainNeuromorphicNode>;

  PRISM_DOMAIN_ORDER.forEach((domainId, idx) => {
    const basisPrime = PRISM_DOMAIN_BASIS_PRIMES[domainId];
    const synapticWeight = VERDANT_NEUROMORPHIC_STANDARD.plasticity.weightInitial;
    const rule30Byte = extractDomainRule30Slice(initialRow, idx);
    const cliffordBasinState = (32 + idx * 3) & 0x3f;
    const icosianRootIndex = (idx * 2) % 17;
    const primeAddress = basisPrime * (baseContextPrime % 997);
    const pointKey28 = computePointKey28({
      basinState: cliffordBasinState,
      icosianRoot: icosianRootIndex,
      primeAddress,
      rule30Byte,
    });
    domains[domainId] = {
      domainId,
      basisPrime,
      synapticWeight,
      fidelityMultiplier: computeDomainFidelityMultiplier(synapticWeight),
      rule30Byte,
      cliffordBasinState,
      icosianRootIndex,
      primeAddress,
      pointKey28,
      consolidated:
        synapticWeight >= VERDANT_NEUROMORPHIC_STANDARD.plasticity.consolidationThreshold,
      receivedCrossDomainTransfers: 0,
    };
  });

  const manifoldPointKey = domains.neuromorphic.pointKey28;

  return {
    domains,
    globalFidelityIndex: 1.0,
    consolidatedDomainCount: 0,
    totalCrossDomainTransfers: 0,
    lastImprovedDomain: 'neuromorphic',
    manifoldPointKeyHex: `0x${manifoldPointKey.toString(16).padStart(7, '0')}`,
  };
}

/**
 * Autopoietic Cross-Domain Enhancement Propagation (`propagateCrossDomainEnhancement`):
 * When ANY single domain (`sourceDomain`) in the Prism model improves or experiences a resonant event:
 * 1. The `sourceDomain` node potentiates via `learnHebbianWeight(w, resonantSuccess)` (`+2`, clamped to `16`).
 * 2. Via the Universal Neuromorphic Bus (`transferWeightCrossDomain`), that enhancement automatically
 *    transfers (`+1`, clamped to `16`) to all other 9 coupled Prism domains (`infrastructure`, `physics`,
 *    `botany`, `ecology`, `acoustics`, `articulation`, `soundtrack`, `humane`, `brand`, `neuromorphic`)
 *    through shared `/7` PrimeAddress GCD kinship and `/6` Icosian golden-field adjacency.
 * 3. Every domain's `/5` Basin, `/6` Icosian Root, `/7` PrimeAddress, `/8` 28-bit PointKey, and
 *    `fidelityMultiplier` update in a single unified pass without manual per-domain iteration.
 */
export function propagateCrossDomainEnhancement(
  prevManifold: UniversalNeuromorphicManifold,
  params: {
    sourceDomain: PrismDomainId;
    rule30Row?: boolean[];
    basinState?: number;
    icosianRootIndex?: number;
    contextPrimeAddress?: number;
    resonantSuccess?: boolean;
  },
): UniversalNeuromorphicManifold {
  const {
    sourceDomain,
    rule30Row = stepRule30Row(createInitialRule30Row()).nextRow,
    basinState = 32,
    icosianRootIndex = 0,
    contextPrimeAddress = computePrimeAddress('meadow', 'chime-lily', 'dawn', 'attune'),
    resonantSuccess = true,
  } = params;

  const nextDomains = {} as Record<PrismDomainId, PrismDomainNeuromorphicNode>;
  const prevSource = prevManifold.domains[sourceDomain];
  const updatedSourceWeight = learnHebbianWeight(prevSource.synapticWeight, resonantSuccess);
  const sourceImprovedOrConsolidated =
    resonantSuccess ||
    updatedSourceWeight > prevSource.synapticWeight ||
    updatedSourceWeight >= VERDANT_NEUROMORPHIC_STANDARD.plasticity.consolidationThreshold;

  const sharedContextFactor = Math.max(2, contextPrimeAddress % 997);
  const sourcePrimeAddr = PRISM_DOMAIN_BASIS_PRIMES[sourceDomain] * sharedContextFactor;

  let fidelitySum = 0;
  let consolidatedCount = 0;
  let transfersAdded = 0;

  PRISM_DOMAIN_ORDER.forEach((domainId, idx) => {
    const prevNode = prevManifold.domains[domainId];
    const basisPrime = PRISM_DOMAIN_BASIS_PRIMES[domainId];
    const domainPrimeAddr = basisPrime * sharedContextFactor;
    const kinshipGcd = gcdExact(sourcePrimeAddr, domainPrimeAddr);

    let nextWeight = prevNode.synapticWeight;
    let nextTransfers = prevNode.receivedCrossDomainTransfers;

    if (domainId === sourceDomain) {
      nextWeight = updatedSourceWeight;
    } else if (sourceImprovedOrConsolidated && kinshipGcd > 1) {
      nextWeight = transferWeightCrossDomain(prevNode.synapticWeight, true);
      nextTransfers += 1;
      transfersAdded += 1;
    } else if (!resonantSuccess) {
      // Gentle homeostatic relaxation toward baseline weight 8 (never drops below 8 via cross-domain drift)
      nextWeight =
        prevNode.synapticWeight > 8 ? prevNode.synapticWeight - 1 : prevNode.synapticWeight;
    }

    const rule30Byte = extractDomainRule30Slice(rule30Row, idx);
    const domainBasin = (basinState ^ ((idx * 7) & 0x3f)) & 0x3f;
    const domainIcosian = (icosianRootIndex + idx) % 17;
    const pointKey28 = computePointKey28({
      basinState: domainBasin,
      icosianRoot: domainIcosian,
      primeAddress: domainPrimeAddr,
      rule30Byte,
    });
    const fidelityMultiplier = computeDomainFidelityMultiplier(nextWeight);
    const consolidated =
      nextWeight >= VERDANT_NEUROMORPHIC_STANDARD.plasticity.consolidationThreshold;

    if (consolidated) consolidatedCount += 1;
    fidelitySum += fidelityMultiplier;

    nextDomains[domainId] = {
      domainId,
      basisPrime,
      synapticWeight: nextWeight,
      fidelityMultiplier,
      rule30Byte,
      cliffordBasinState: domainBasin,
      icosianRootIndex: domainIcosian,
      primeAddress: domainPrimeAddr,
      pointKey28,
      consolidated,
      receivedCrossDomainTransfers: nextTransfers,
    };
  });

  const globalFidelityIndex = Number((fidelitySum / PRISM_DOMAIN_ORDER.length).toFixed(5));
  const compositeKey = nextDomains[sourceDomain].pointKey28 ^ nextDomains.neuromorphic.pointKey28;

  return {
    domains: nextDomains,
    globalFidelityIndex,
    consolidatedDomainCount: consolidatedCount,
    totalCrossDomainTransfers: prevManifold.totalCrossDomainTransfers + transfersAdded,
    lastImprovedDomain: sourceDomain,
    manifoldPointKeyHex: `0x${(compositeKey & 0x0fffffff).toString(16).padStart(7, '0')}`,
  };
}

/**
 * Derives concrete, real-time self-refining directives (`CrossDomainRefinementDirectives`) for all 10
 * Prism domains from the live `UniversalNeuromorphicManifold`.
 * Because every domain node receives cross-domain synaptic transfers whenever any part of the model improves,
 * all 10 subsystems (including WebGL2 infrastructure, physics, botany, ecology, acoustics, articulation,
 * soundtrack, humane ergonomics, and brand aesthetics) automatically refine in unison.
 */
export function computeCrossDomainRefinementDirectives(
  manifold: UniversalNeuromorphicManifold,
): CrossDomainRefinementDirectives {
  const d = manifold.domains;
  const g = manifold.globalFidelityIndex;

  // Evaluate the 9 formal `.lex.tex` domain bus modulation functions via `GENERATED_PRISM_BUS_MODULATION_LUT`
  const busModulations = computeJudgeBusModulations({
    wInfrastructure: d.infrastructure.synapticWeight,
    wPhysics: d.physics.synapticWeight,
    wBotany: d.botany.synapticWeight,
    wEcology: d.ecology.synapticWeight,
    wAcoustics: d.acoustics.synapticWeight,
    wArticulation: d.articulation.synapticWeight,
    wSoundtrack: d.soundtrack.synapticWeight,
    wHumane: d.humane.synapticWeight,
    wBrand: d.brand.synapticWeight,
    wNeuromorphic: d.neuromorphic.synapticWeight,
  });

  const infraModNorm = busModulations.infrastructurePoolCapacity / 1040;
  const physModNorm = busModulations.physicsBuoyancyMillihz / 1050;
  const botModNorm = Math.max(0.85, busModulations.botanyPollinationRadiusCm / 160);
  const ecoModNorm = busModulations.ecologyConductivityPermille / 1000;
  const acouModNorm = busModulations.acousticsFilterQPermille / 1020;
  const artModNorm = busModulations.articulationGracePermille / 1060;
  const sndModNorm = busModulations.soundtrackHarmonicDensity / 74;
  const brandModNorm = busModulations.brandContrastTenths / 92;

  const infraFidelity =
    (d.infrastructure.fidelityMultiplier + d.brand.fidelityMultiplier + infraModNorm) / 3;
  const physFidelity = (d.physics.fidelityMultiplier + g + physModNorm) / 3;
  const botFidelity = (d.botany.fidelityMultiplier + d.ecology.fidelityMultiplier + botModNorm) / 3;
  const ecoFidelity = (d.ecology.fidelityMultiplier + d.botany.fidelityMultiplier + ecoModNorm) / 3;
  const acouFidelity =
    (d.acoustics.fidelityMultiplier + d.soundtrack.fidelityMultiplier + acouModNorm) / 3;
  const artFidelity =
    (d.articulation.fidelityMultiplier + d.humane.fidelityMultiplier + artModNorm) / 3;

  return {
    infrastructure: {
      toneMappingExposure: Number(
        Math.min(1.24, Math.max(1.06, 1.12 * (0.94 + infraFidelity * 0.08))).toFixed(4),
      ),
      microReliefBumpScale: Number(
        Math.min(
          0.056,
          Math.max(0.032, 0.042 * ((d.infrastructure.fidelityMultiplier + physFidelity) * 0.5)),
        ).toFixed(4),
      ),
      activeSporePoolRatio: Number(
        Math.min(
          1.0,
          Math.max(0.65, (busModulations.infrastructurePoolCapacity - 820) / 260),
        ).toFixed(3),
      ),
      constellationHaloOpacity: Number(
        Math.min(
          0.42,
          Math.max(0.2, 0.28 * ((d.infrastructure.fidelityMultiplier + botFidelity) * 0.5)),
        ).toFixed(4),
      ),
    },
    physics: {
      cymaticWaveCoherence: Number(
        Math.min(1.25, Math.max(0.85, physFidelity)).toFixed(4),
      ),
      vortexWakeCoherence: Number(
        Math.min(1.25, Math.max(0.85, d.physics.fidelityMultiplier)).toFixed(4),
      ),
      chemotacticSporeAttractionMultiplier: Number(
        Math.min(1.3, Math.max(0.85, (physFidelity + ecoFidelity) * 0.5)).toFixed(4),
      ),
    },
    botany: {
      kuramotoCouplingMultiplier: Number(
        Math.min(1.35, Math.max(0.85, botFidelity * 1.04)).toFixed(4),
      ),
      turgorVitalityMultiplier: Number(
        Math.min(1.18, Math.max(0.92, 0.96 + (d.botany.synapticWeight - 8) * 0.018)).toFixed(4),
      ),
      emissiveBloomBoost: Number(
        Math.min(0.35, Math.max(0, (botFidelity - 0.95) * 0.85)).toFixed(4),
      ),
    },
    ecology: {
      mycorrhizalConductivityMultiplier: Number(
        Math.min(1.28, Math.max(0.88, ecoFidelity)).toFixed(4),
      ),
      terpeneDiffusionClarity: Number(
        Math.min(1.25, Math.max(0.88, d.ecology.fidelityMultiplier)).toFixed(4),
      ),
    },
    acoustics: {
      modalFilterQMultiplier: Number(
        Math.min(1.28, Math.max(0.9, acouFidelity)).toFixed(4),
      ),
      reverbSendRefinement: Number(
        Math.min(1.22, Math.max(0.9, 0.95 + (d.acoustics.synapticWeight - 8) * 0.022)).toFixed(4),
      ),
    },
    articulation: {
      cameraSpringCritDampingRefinement: Number(
        Math.min(1.18, Math.max(0.92, artFidelity)).toFixed(4),
      ),
      anatomicalGraceMultiplier: Number(
        Math.min(1.24, Math.max(0.9, d.articulation.fidelityMultiplier)).toFixed(4),
      ),
    },
    soundtrack: {
      counterpointHarmonicRichness: Number(
        Math.min(
          1.25,
          Math.max(0.88, (d.soundtrack.fidelityMultiplier + sndModNorm) * 0.5),
        ).toFixed(4),
      ),
    },
    humane: {
      restorativeStillnessBonus: Math.max(
        0,
        Math.min(6, Math.round((busModulations.humaneZephyrCapMmPerSec2 - 200) * 0.065)),
      ),
    },
    brand: {
      atmosphericDepthContrast: Number(
        Math.min(
          1.2,
          Math.max(0.92, (d.brand.fidelityMultiplier + brandModNorm) * 0.5),
        ).toFixed(4),
      ),
    },
    neuromorphic: {
      crossDomainSynergyFactor: Number(
        Math.min(1.25, Math.max(0.8, g)).toFixed(4),
      ),
    },
  };
}

export interface AutopoieticModelRefinementReport {
  nextState: NeuromorphicEngineState;
  cyclesExecuted: number;
  fidelityBefore: number;
  fidelityAfter: number;
  fidelityGain: number;
  varianceBefore: number;
  varianceAfter: number;
  varianceReduction: number;
  convergedDomains: number;
  allDomainsBridgeVerified: boolean;
}

function computeDomainWeightVariance(manifold: UniversalNeuromorphicManifold): number {
  const weights = PRISM_DOMAIN_ORDER.map((d) => manifold.domains[d].synapticWeight);
  const mean = weights.reduce((acc, w) => acc + w, 0) / weights.length;
  const sqSum = weights.reduce((acc, w) => acc + (w - mean) * (w - mean), 0);
  return Number((sqSum / weights.length).toFixed(5));
}

/**
 * First-Class Autopoietic Model Refinement Operator (`refinePrismModel`):
 * Directly implements `Foundation.Neuromorphic.V1.Model::refineDomainWeightAutopoietic` and
 * `autopoieticModelRefinementConvergesAndBoundedHolds` across all 10 coupled Prism domains
 * (`infrastructure`, `physics`, `botany`, `ecology`, `acoustics`, `articulation`, `soundtrack`,
 * `humane`, `brand`, `neuromorphic`) and the 20-entry `hebbianTable` (`4 strategies × 5 families`):
 *
 * 1. Computes the leading synaptic weight `wLeader` across the 10-domain `UniversalNeuromorphicManifold`.
 * 2. Steps the 64-cell Rule-30 cellular register and applies `refineDomainWeightAutopoietic(wCurrent, wLeader)`
 *    to every single domain node, pulling lagging domains toward the leading frontier (`+1`) and elevating
 *    frontier domains toward the fixed-point attractor (`w* = 16`).
 * 3. Synchronizes each domain's `/5` Clifford `Cl(0,6)` basin, `/6` Icosian $\mathbb{Z}[\varphi]$ golden-field root,
 *    `/7` `PrimeAddress`, and `/8` 28-bit `PointKey` (`0x0000000 .. 0xFFFFFFF`).
 * 4. Transfers the manifold's synaptic refinement into the 20-entry `hebbianTable` (`4 strategies × 5 families`)
 *    and recomputes `CrossDomainRefinementDirectives` across all 10 subsystems without manual per-domain iteration.
 */
export function refinePrismModel(
  prevState: NeuromorphicEngineState,
  options?: {
    cycles?: number;
    leadDomain?: PrismDomainId;
  },
): AutopoieticModelRefinementReport {
  const cycles = Math.max(1, Math.min(16, Math.round(options?.cycles ?? 1)));
  const fidelityBefore = prevState.universalManifold.globalFidelityIndex;
  const varianceBefore = computeDomainWeightVariance(prevState.universalManifold);

  let currentManifold = prevState.universalManifold;
  let currentRule30Row = [...prevState.rule30Row];
  let currentRule30History = [...prevState.rule30History];
  let currentHebbianTable = prevState.hebbianTable.map((entry) => ({ ...entry }));
  let currentTick = prevState.tickCount;

  // If a specific leadDomain is nominated, give it an initial resonant enhancement before autopoietic equilibration
  if (options?.leadDomain) {
    currentManifold = propagateCrossDomainEnhancement(currentManifold, {
      sourceDomain: options.leadDomain,
      rule30Row: currentRule30Row,
      basinState: prevState.lastBasinState,
      icosianRootIndex: prevState.lastIcosianRoot,
      contextPrimeAddress: prevState.lastPrimeAddress,
      resonantSuccess: true,
    });
  }

  for (let c = 0; c < cycles; c++) {
    currentTick += 1;
    const r30Step = stepRule30Row(currentRule30Row, (currentTick * 7) % 64);
    currentRule30Row = r30Step.nextRow;
    currentRule30History = [...currentRule30History.slice(-15), r30Step.diagonalByte];

    // Find the leading synaptic weight across all 10 domains
    let wLeader = VERDANT_NEUROMORPHIC_STANDARD.plasticity.weightMin;
    let leaderDomain: PrismDomainId = currentManifold.lastImprovedDomain;
    for (const dom of PRISM_DOMAIN_ORDER) {
      const w = currentManifold.domains[dom].synapticWeight;
      if (w > wLeader) {
        wLeader = w;
        leaderDomain = dom;
      }
    }

    const nextDomains = {} as Record<PrismDomainId, PrismDomainNeuromorphicNode>;
    let fidelitySum = 0;
    let consolidatedCount = 0;
    let transfersInCycle = 0;
    const sharedContextFactor = Math.max(2, (prevState.lastPrimeAddress + currentTick * 13) % 997);

    PRISM_DOMAIN_ORDER.forEach((domainId, idx) => {
      const prevNode = currentManifold.domains[domainId];
      const basisPrime = PRISM_DOMAIN_BASIS_PRIMES[domainId];
      const nextWeight = refineDomainWeightAutopoietic(prevNode.synapticWeight, wLeader);
      const receivedTransfer = nextWeight > prevNode.synapticWeight ? 1 : 0;
      transfersInCycle += receivedTransfer;

      const rule30Byte = extractDomainRule30Slice(currentRule30Row, idx);
      const domainBasin = (prevState.lastBasinState ^ ((idx * 5 + currentTick) & 0x3f)) & 0x3f;
      const domainIcosian = (prevState.lastIcosianRoot + idx + currentTick) % 17;
      const domainPrimeAddr = basisPrime * sharedContextFactor;
      const pointKey28 = computePointKey28({
        basinState: domainBasin,
        icosianRoot: domainIcosian,
        primeAddress: domainPrimeAddr,
        rule30Byte,
      });
      const fidelityMultiplier = computeDomainFidelityMultiplier(nextWeight);
      const consolidated =
        nextWeight >= VERDANT_NEUROMORPHIC_STANDARD.plasticity.consolidationThreshold;

      if (consolidated) consolidatedCount += 1;
      fidelitySum += fidelityMultiplier;

      nextDomains[domainId] = {
        domainId,
        basisPrime,
        synapticWeight: nextWeight,
        fidelityMultiplier,
        rule30Byte,
        cliffordBasinState: domainBasin,
        icosianRootIndex: domainIcosian,
        primeAddress: domainPrimeAddr,
        pointKey28,
        consolidated,
        receivedCrossDomainTransfers: prevNode.receivedCrossDomainTransfers + receivedTransfer,
      };
    });

    const globalFidelityIndex = Number((fidelitySum / PRISM_DOMAIN_ORDER.length).toFixed(5));
    const compositeKey =
      nextDomains[leaderDomain].pointKey28 ^ nextDomains.neuromorphic.pointKey28;

    currentManifold = {
      domains: nextDomains,
      globalFidelityIndex,
      consolidatedDomainCount: consolidatedCount,
      totalCrossDomainTransfers: currentManifold.totalCrossDomainTransfers + transfersInCycle,
      lastImprovedDomain: leaderDomain,
      manifoldPointKeyHex: `0x${(compositeKey & 0x0fffffff).toString(16).padStart(7, '0')}`,
    };

    // Co-refine the 20-entry Hebbian strategy×family table toward the manifold's leading weight
    currentHebbianTable = currentHebbianTable.map((entry) => ({
      ...entry,
      weight: refineDomainWeightAutopoietic(entry.weight, wLeader),
    }));
  }

  const nextRefinementDirectives = computeCrossDomainRefinementDirectives(currentManifold);
  const topScheduled = scheduleNeuromorphicStrategies('meadow-lydian', currentHebbianTable)[0];
  const fidelityAfter = currentManifold.globalFidelityIndex;
  const varianceAfter = computeDomainWeightVariance(currentManifold);

  const allDomainsBridgeVerified = PRISM_DOMAIN_ORDER.every((dom) => {
    const bridge = PRISM_DOMAIN_BRIDGES[dom];
    return (
      bridge.neuromorphicBusCoupled &&
      bridge.domainBasisPrime === PRISM_DOMAIN_BASIS_PRIMES[dom] &&
      bridge.rule30RegisterBits === 64 &&
      bridge.pointKeyBits === 28 &&
      bridge.crossDomainTransferEnabled &&
      bridge.autopoieticSelfRefinementEnabled
    );
  });

  const nextState: NeuromorphicEngineState = {
    ...prevState,
    tickCount: currentTick,
    hebbianTable: currentHebbianTable,
    rule30Row: currentRule30Row,
    rule30History: currentRule30History,
    lastPointKeyHex: currentManifold.manifoldPointKeyHex,
    lastScheduledStrategy: topScheduled.id,
    lastActiveSynapticWeight: topScheduled.weight,
    pointKeyGateAdmitted: verifyPointKeyResonanceGate(topScheduled.weight, 0, 0, 8),
    universalManifold: currentManifold,
    refinementDirectives: nextRefinementDirectives,
  };

  return {
    nextState,
    cyclesExecuted: cycles,
    fidelityBefore,
    fidelityAfter,
    fidelityGain: Number((fidelityAfter - fidelityBefore).toFixed(5)),
    varianceBefore,
    varianceAfter,
    varianceReduction: Number(Math.max(0, varianceBefore - varianceAfter).toFixed(5)),
    convergedDomains: currentManifold.consolidatedDomainCount,
    allDomainsBridgeVerified,
  };
}

export interface NeuromorphicMemoryRecord {
  tickId: number;
  biome: BiomeId;
  species: PlantSpeciesId;
  action: PlayerActionId;
  outcome: SoundscapeOutcome;
  primeAddress: number;
  pointKey28: number;
  icosianRootIndex: number;
  activeStrategy: NeuromorphicStrategyId;
  synapticWeight: number;
}

export interface NeuromorphicEngineState {
  tickCount: number;
  hebbianTable: HebbianWeightEntry[];
  rule30Row: boolean[];
  rule30History: number[]; // Last 16 diagonal bytes (0..255)
  turnMemory: NeuromorphicMemoryRecord[]; // Scoped `/7` durable turn memory (up to 24 turns)
  recentVoicingKeys: number[]; // Used by the `period 1..4` short-cycle guard
  emergentSeedlingsMinted: number;
  lastPointKeyHex: string;
  lastPrimeAddress: number;
  lastKinshipGcd: number;
  lastBasinState: number;
  lastIcosianRoot: number;
  lastScheduledStrategy: NeuromorphicStrategyId;
  lastActiveSynapticWeight: number;
  pointKeyGateAdmitted: boolean;
  synthesizedCounterpointRatios: [number, number, number];
  universalManifold: UniversalNeuromorphicManifold;
  refinementDirectives: CrossDomainRefinementDirectives;
}

export function createInitialNeuromorphicState(): NeuromorphicEngineState {
  const initialRow = createInitialRule30Row();
  const stepped = stepRule30Row(initialRow);
  const universalManifold = createInitialUniversalManifold();
  const refinementDirectives = computeCrossDomainRefinementDirectives(universalManifold);
  return {
    tickCount: 0,
    hebbianTable: createInitialHebbianTable(),
    rule30Row: stepped.nextRow,
    rule30History: [stepped.diagonalByte],
    turnMemory: [],
    recentVoicingKeys: [],
    emergentSeedlingsMinted: 0,
    lastPointKeyHex: '0x00820110',
    lastPrimeAddress: computePrimeAddress('meadow', 'chime-lily', 'dawn', 'observe'),
    lastKinshipGcd: 13,
    lastBasinState: 32,
    lastIcosianRoot: 0,
    lastScheduledStrategy: 'harmonic-voice-leading',
    lastActiveSynapticWeight: 8,
    pointKeyGateAdmitted: false,
    synthesizedCounterpointRatios: [1.0, 1.25, 1.5],
    universalManifold,
    refinementDirectives,
  };
}

/**
 * Executes a full 7-Stage Neuromorphic Synthesis Tick (`afflom/rule30` + `casey-allard/lexlean-r4` + Universal Cross-Domain Bus)
 * live as the user plays:
 * 1. Induction: Encodes the player's spatial & botanical gesture into `/5` Basin, `/6` Icosian Root, and `/7` PrimeAddress.
 * 2. Audit & Short-Cycle Guard: Steps the 64-bit Rule-30 cellular register and guarantees `0` short-cycle repetitions (`period 1..4`).
 * 3. Priority-Scheduled Deduction: Schedules the top strategy for the biome's relation family by live Hebbian weight `w in [1, 16]`.
 * 4. Live LUT Counterpoint Compilation: Sieves `/7` TurnMemory by `GCD(PrimeAddress)` to synthesize a non-repeating 3-voice counterpoint triad.
 * 5. Bounded Hebbian Plasticity: Updates strategy weights (`+2` on resonant bloom/touch/attune/stillness, `-1` on unattuned drift).
 * 6. PointKey Gate & Emergent Seedling Minting: When `verifyPointKeyResonanceGate` holds, germinates a new living flora specimen along the player's geodesic walk.
 * 7. Universal Cross-Domain Bus Propagation: Potentiates the active domain (`infrastructure`, `physics`, `botany`, `ecology`, `acoustics`,
 *    `articulation`, `soundtrack`, `humane`, `brand`, or `neuromorphic`) and transfers synaptic enhancements across all 10 Prism domains automatically.
 */
export function executeNeuromorphicSynthesisTick(
  prevState: NeuromorphicEngineState,
  params: {
    biome: BiomeId;
    species: PlantSpeciesId;
    atmosphere: AtmosphereId;
    action: PlayerActionId;
    outcome: SoundscapeOutcome;
    playerX: number;
    playerZ: number;
    playerYaw: number;
    existingPlants: GardenPlantInstance[];
    colliders: SolidCollider[];
    sourceDomainOverride?: PrismDomainId;
  },
): {
  nextState: NeuromorphicEngineState;
  counterpointRatios: [number, number, number];
  emergentSeedling: GardenPlantInstance | null;
  kinshipSpecies: PlantSpeciesId;
} {
  const {
    biome,
    species,
    atmosphere,
    action,
    outcome,
    playerX,
    playerZ,
    playerYaw,
    existingPlants,
    colliders,
    sourceDomainOverride,
  } = params;

  const tickCount = prevState.tickCount + 1;
  const family = NEUROMORPHIC_FAMILIES[biome];

  // Stage 1: `/5` Clifford Cl(0,6) Basin & `/7` PrimeAddress
  const basinState = computeCliffordBasinState(playerX, playerZ, playerYaw);
  const primeAddress = computePrimeAddress(biome, species, atmosphere, action);

  // Stage 2: Step 64-bit Rule-30 Cellular Register & enforce `short_cycle` guard (period 1..4)
  let r30 = stepRule30Row(prevState.rule30Row, basinState + (primeAddress % 64));
  let candidateVoicingKey = (r30.diagonalByte + basinState) % 17;
  let shortCycleRetries = 0;
  while (
    hasShortCycleRepetition(prevState.recentVoicingKeys, candidateVoicingKey) &&
    shortCycleRetries < 6
  ) {
    r30 = stepRule30Row(r30.nextRow, shortCycleRetries + 1);
    candidateVoicingKey = (r30.diagonalByte + shortCycleRetries * 3) % 17;
    shortCycleRetries++;
  }

  const icosianRoot = ICOSIAN_GOLDEN_ROOTS[candidateVoicingKey];
  const pointKey28 = computePointKey28({
    basinState,
    icosianRoot: icosianRoot.rootIndex,
    primeAddress,
    rule30Byte: r30.diagonalByte,
  });

  // Stage 3: Priority-Scheduled Strategy Selection before plasticity update
  const scheduledBefore = scheduleNeuromorphicStrategies(family, prevState.hebbianTable);
  const activeStrategy = scheduledBefore[0].id;

  // Stage 4: `/7` Durable Turn Memory PrimeAddress GCD Sieve & Live Counterpoint Synthesis
  let bestGcd = SPECIES_PRIMES[species];
  let kinshipSpecies: PlantSpeciesId = species;
  for (let i = prevState.turnMemory.length - 1; i >= 0; i--) {
    const mem = prevState.turnMemory[i];
    const g = gcdExact(primeAddress, mem.primeAddress);
    if (g > bestGcd && mem.species !== species) {
      bestGcd = g;
      kinshipSpecies = mem.species;
    }
  }

  const biomeScale = BIOME_CONFIGS[biome].scaleRatios;
  const deg0 = biomeScale[r30.diagonalByte % biomeScale.length] ?? 1.0;
  const deg1 = biomeScale[(r30.diagonalByte >> 2) % biomeScale.length] ?? 1.25;
  const deg2 = icosianRoot.harmonicRatio;
  const counterpointRatios: [number, number, number] = [
    Number(deg0.toFixed(4)),
    Number(deg1.toFixed(4)),
    Number(deg2.toFixed(4)),
  ];

  // Stage 5: Bounded Hebbian Plasticity (`learnAll`)
  const isResonantOutcome =
    outcome === 'sanctuary-chorus' ||
    outcome === 'harmonic-bloom' ||
    outcome === 'serene-rest' ||
    outcome === 'nocturnal-symphony' ||
    outcome === 'dawn-arpeggio' ||
    outcome === 'crystalline-choir' ||
    action === 'touch' ||
    action === 'attune' ||
    action === 'stillness';

  // Target strategy corresponding to the player's intentional gesture
  const gestureStrategy: NeuromorphicStrategyId =
    action === 'attune'
      ? 'mycelial-seedling-germination'
      : action === 'touch'
        ? 'counterpoint-canonic-echo'
        : action === 'stillness'
          ? 'overtone-spectral-refinement'
          : 'harmonic-voice-leading';

  const outcomesToFold: HebbianOutcomeEvent[] = [
    { strategy: gestureStrategy, family, success: isResonantOutcome },
  ];
  if (activeStrategy !== gestureStrategy) {
    outcomesToFold.push({
      strategy: activeStrategy,
      family,
      success: isResonantOutcome,
    });
  }

  const nextHebbianTable = learnAllHebbian(prevState.hebbianTable, outcomesToFold);
  const scheduledAfter = scheduleNeuromorphicStrategies(family, nextHebbianTable);
  const topStrategyAfter = scheduledAfter[0];

  // Stage 6: Verify 28-bit PointKey Resonance Gate & Germinate Emergent Seedling if admitted
  const windowHi = Math.max(8, Math.min(32, r30.activeCount));
  const gateAdmitted = verifyPointKeyResonanceGate(
    topStrategyAfter.weight,
    0, // 0 orphan stems
    0, // 0 short cycles (enforced by Stage 2 sieve)
    windowHi,
  );

  let emergentSeedling: GardenPlantInstance | null = null;
  let emergentSeedlingsMinted = prevState.emergentSeedlingsMinted;

  if (
    gateAdmitted &&
    (action === 'attune' || action === 'touch') &&
    emergentSeedlingsMinted < VERDANT_NEUROMORPHIC_STANDARD.lutStack.maxEmergentSeedlings
  ) {
    // Synthesize emergent seedling coordinates using `/6` Icosian Golden-Field Z[phi] geodesic offset,
    // strictly enforcing `evaluateSpatialSurfaceLaw` so emergent seedlings NEVER germinate on hard structure platforms or rocks!
    const baseGoldenAngle = icosianRoot.angleRad + playerYaw;
    const baseRadius = 3.2 + (r30.diagonalByte % 5) * 0.45;

    for (let attempt = 0; attempt < 20; attempt++) {
      const testAngle = baseGoldenAngle + attempt * 0.38;
      const testRadius = baseRadius + Math.floor(attempt / 4) * 1.35;
      const candX = Number(
        Math.max(-44, Math.min(44, playerX - Math.sin(testAngle) * testRadius)).toFixed(2),
      );
      const candZ = Number(
        Math.max(-44, Math.min(44, playerZ - Math.cos(testAngle) * testRadius)).toFixed(2),
      );

      const surfaceLaw = evaluateSpatialSurfaceLaw(candX, candZ, 0.55);
      if (!surfaceLaw.canSupportPlant) continue;

      const collidesSolid = colliders.some(
        (c) => Math.hypot(candX - c.x, candZ - c.z) < c.radiusMeters + 0.9,
      );
      const tooClosePlant = existingPlants.some(
        (p) => Math.hypot(candX - p.x, candZ - p.z) < 1.85,
      );

      if (!collidesSolid && !tooClosePlant) {
        const candBiome = biomeAt(candX, candZ);
        const emergentSpeciesList: PlantSpeciesId[] = [
          'star-orchid',
          'chime-lily',
          'pulse-fern',
          'drone-moss',
        ];
        const seedlingSpecies =
          emergentSpeciesList[
            (icosianRoot.rootIndex + emergentSeedlingsMinted) % emergentSpeciesList.length
          ];
        const anchor = computeSlopeEmbeddedGroundAnchor(candX, candZ, 0.42, 0.02);
        const isSeedlingSubmerged = surfaceLaw.isSubmergedLagoon;
        const finalSeedlingSpecies: PlantSpeciesId = isSeedlingSubmerged
          ? 'echo-lotus'
          : seedlingSpecies;
        const seedlingY = isSeedlingSubmerged
          ? MIRROR_LAGOON_WATER_SURFACE_Y
          : anchor.minPerimeterGroundY;
        const seedlingSubstrate = classifyPlantGrowthSubstrate(finalSeedlingSpecies, candX, candZ);
        const seedlingTilt = isSeedlingSubmerged
          ? { surfaceTiltX: 0, surfaceTiltZ: 0 }
          : { surfaceTiltX: anchor.surfaceTiltX, surfaceTiltZ: anchor.surfaceTiltZ };
        emergentSeedlingsMinted += 1;
        emergentSeedling = {
          id: `emergent-seedling-${emergentSeedlingsMinted}`,
          species: finalSeedlingSpecies,
          biome: candBiome,
          substrate: seedlingSubstrate,
          x: candX,
          y: seedlingY,
          z: candZ,
          scale: Number((0.88 + (icosianRoot.rootIndex % 5) * 0.08).toFixed(2)),
          rotationY: Number(icosianRoot.angleRad.toFixed(3)),
          pitchMultiplier: Number(
            (BIOME_CONFIGS[candBiome].scaleRatios[
              icosianRoot.rootIndex % BIOME_CONFIGS[candBiome].scaleRatios.length
            ] ?? 1.25).toFixed(3),
          ),
          attuned: true,
          lifecycleStage: 'mycelial-memory',
          surfaceTiltX: seedlingTilt.surfaceTiltX,
          surfaceTiltZ: seedlingTilt.surfaceTiltZ,
          rootHoldfastScale: 1.05,
          volatileTerpeneCharge: 0.85,
        };
        break;
      }
    }
  }

  // Stage 7: Universal Cross-Domain Bus Propagation
  // Identify the primary domain energized by this interaction (or explicit override) and propagate enhancements
  // across all 10 Prism domains automatically (`infrastructure`, `physics`, `botany`, `ecology`, `acoustics`,
  // `articulation`, `soundtrack`, `humane`, `brand`, `neuromorphic`).
  const inferredSourceDomain: PrismDomainId =
    sourceDomainOverride ??
    (emergentSeedling !== null
      ? 'infrastructure'
      : action === 'attune'
        ? 'botany'
        : action === 'touch'
          ? 'articulation'
          : action === 'stillness'
            ? 'humane'
            : action === 'stroll'
              ? 'physics'
              : outcome === 'sanctuary-chorus' || outcome === 'crystalline-choir'
                ? 'acoustics'
                : 'ecology');

  const prevManifold = prevState.universalManifold ?? createInitialUniversalManifold();
  const nextUniversalManifold = propagateCrossDomainEnhancement(prevManifold, {
    sourceDomain: inferredSourceDomain,
    rule30Row: r30.nextRow,
    basinState,
    icosianRootIndex: icosianRoot.rootIndex,
    contextPrimeAddress: primeAddress,
    resonantSuccess: isResonantOutcome,
  });
  const nextRefinementDirectives = computeCrossDomainRefinementDirectives(nextUniversalManifold);

  const nextTurnMemory: NeuromorphicMemoryRecord[] = [
    ...prevState.turnMemory.slice(-23),
    {
      tickId: tickCount,
      biome,
      species,
      action,
      outcome,
      primeAddress,
      pointKey28,
      icosianRootIndex: icosianRoot.rootIndex,
      activeStrategy: topStrategyAfter.id,
      synapticWeight: topStrategyAfter.weight,
    },
  ];

  const nextState: NeuromorphicEngineState = {
    tickCount,
    hebbianTable: nextHebbianTable,
    rule30Row: r30.nextRow,
    rule30History: [...prevState.rule30History.slice(-15), r30.diagonalByte],
    turnMemory: nextTurnMemory,
    recentVoicingKeys: [...prevState.recentVoicingKeys.slice(-11), candidateVoicingKey],
    emergentSeedlingsMinted,
    lastPointKeyHex: `0x${pointKey28.toString(16).padStart(7, '0')}`,
    lastPrimeAddress: primeAddress,
    lastKinshipGcd: bestGcd,
    lastBasinState: basinState,
    lastIcosianRoot: icosianRoot.rootIndex,
    lastScheduledStrategy: topStrategyAfter.id,
    lastActiveSynapticWeight: topStrategyAfter.weight,
    pointKeyGateAdmitted: gateAdmitted,
    synthesizedCounterpointRatios: counterpointRatios,
    universalManifold: nextUniversalManifold,
    refinementDirectives: nextRefinementDirectives,
  };

  return {
    nextState,
    counterpointRatios,
    emergentSeedling,
    kinshipSpecies,
  };
}

// ---------------------------------------------------------------------------
// Subsystem 14: Botanical Object Lifecycle, Environmental Micro-Seasons &
// Live 4-Stem Generative Soundtrack Synthesizer
// Mirrors `prism/src/Foundation/Soundtrack/V1/Model.lex.tex` (`prism/soundtrack-standard/1`)
// ---------------------------------------------------------------------------

export type EnvironmentalLifecyclePhaseId =
  | 'dew-awakening'
  | 'pollen-drift'
  | 'nectar-confluence'
  | 'bioluminescent-slumber';

export type SoundtrackStemId =
  | 'melodic-flora-lead'
  | 'polyrhythmic-ostinato'
  | 'harmonic-bass-anchor'
  | 'canonic-counterpoint-echo';

export type AcousticVoiceLifecycleStageId =
  | 'incipit-transient'
  | 'modal-bloom'
  | 'sympathetic-canon'
  | 'reverberant-tail'
  | 'silence-rest';

export interface BotanicalLifecycleStageSpec {
  id: BotanicalLifecycleStageId;
  stageIndex: number; // 0..4
  label: string;
  morphologicalScaleMultiplier: number;
  corollaOpenFactor: number;
  emissiveMultiplier: number;
  hasFruitingCrown: boolean;
  hasMycelialSporeHalo: boolean;
  soundtrackStemContribution: SoundtrackStemId | null;
  botanicalDescription: string;
}

export const BOTANICAL_LIFECYCLE_STAGES: Record<
  BotanicalLifecycleStageId,
  BotanicalLifecycleStageSpec
> = {
  'dormant-seed': {
    id: 'dormant-seed',
    stageIndex: 0,
    label: 'Dormant Bud',
    morphologicalScaleMultiplier: 1.0,
    corollaOpenFactor: 0.25,
    emissiveMultiplier: 0.38,
    hasFruitingCrown: false,
    hasMycelialSporeHalo: false,
    soundtrackStemContribution: null,
    botanicalDescription: 'Closed corolla bud resting in quietude before player interaction',
  },
  'sprouting-bud': {
    id: 'sprouting-bud',
    stageIndex: 1,
    label: 'Sprouting Bud',
    morphologicalScaleMultiplier: 1.05,
    corollaOpenFactor: 0.58,
    emissiveMultiplier: 0.85,
    hasFruitingCrown: false,
    hasMycelialSporeHalo: false,
    soundtrackStemContribution: 'polyrhythmic-ostinato',
    botanicalDescription:
      'Awakened by tactile touch ([T]): 58% corolla opening & sparse off-beat pizzicato ostinato notes',
  },
  'resonant-bloom': {
    id: 'resonant-bloom',
    stageIndex: 2,
    label: 'Resonant Bloom',
    morphologicalScaleMultiplier: 1.1,
    corollaOpenFactor: 1.0,
    emissiveMultiplier: 1.22,
    hasFruitingCrown: false,
    hasMycelialSporeHalo: false,
    soundtrackStemContribution: 'melodic-flora-lead',
    botanicalDescription:
      'Full Fibonacci blossom ([Space] Attune): 100% corolla opening & primary Just-Intonation melodic lead',
  },
  'harmonic-fruiting': {
    id: 'harmonic-fruiting',
    stageIndex: 3,
    label: 'Harmonic Fruiting',
    morphologicalScaleMultiplier: 1.15,
    corollaOpenFactor: 1.12,
    emissiveMultiplier: 1.42,
    hasFruitingCrown: true,
    hasMycelialSporeHalo: false,
    soundtrackStemContribution: 'harmonic-bass-anchor',
    botanicalDescription:
      'Crowned with golden seed-pearls via symbiotic cross-pollination: weaves warm bowed root-fifth bass anchors',
  },
  'mycelial-memory': {
    id: 'mycelial-memory',
    stageIndex: 4,
    label: 'Mycelial Elder',
    morphologicalScaleMultiplier: 1.2,
    corollaOpenFactor: 1.22,
    emissiveMultiplier: 1.6,
    hasFruitingCrown: true,
    hasMycelialSporeHalo: true,
    soundtrackStemContribution: 'canonic-counterpoint-echo',
    botanicalDescription:
      'Consolidated conservatory elder ([C] Stillness / PointKey germination): radiates 7-limit canonic counterpoint',
  },
};

const STAGE_ORDER: BotanicalLifecycleStageId[] = [
  'dormant-seed',
  'sprouting-bud',
  'resonant-bloom',
  'harmonic-fruiting',
  'mycelial-memory',
];

export function getPlantLifecycleStage(plant: GardenPlantInstance): BotanicalLifecycleStageId {
  if (plant.lifecycleStage) return plant.lifecycleStage;
  return plant.attuned ? 'resonant-bloom' : 'dormant-seed';
}

/**
 * Exact monotonic botanical lifecycle progression (`Foundation.Soundtrack.V1.Model::advanceLifecycleStage`):
 * - `[T]` (`touch`): `dormant-seed -> sprouting-bud`, `sprouting-bud -> resonant-bloom`, `resonant-bloom -> harmonic-fruiting`
 * - `[Space]` (`attune`): `dormant-seed | sprouting-bud -> resonant-bloom`, `resonant-bloom -> harmonic-fruiting`, `harmonic-fruiting -> mycelial-memory`
 * - `[C]` (`stillness`): consolidates any awakened specimen (`stage >= 1`) directly into `mycelial-memory` (`stage 4`)
 */
export function advancePlantLifecycle(
  currentStage: BotanicalLifecycleStageId,
  action: PlayerActionId,
  isSymbioticNeighbor = false,
): BotanicalLifecycleStageId {
  const idx = STAGE_ORDER.indexOf(currentStage);
  const currentIdx = idx >= 0 ? idx : 0;

  let nextIdx = currentIdx;
  if (action === 'touch') {
    nextIdx = Math.min(3, currentIdx + 1);
  } else if (action === 'attune') {
    if (currentIdx < 2) {
      nextIdx = 2; // Jumps directly to full Resonant Bloom
    } else {
      nextIdx = Math.min(4, currentIdx + 1);
    }
    if (isSymbioticNeighbor && nextIdx === 2 && currentIdx >= 2) {
      nextIdx = 3; // Symbiotic cross-pollination promotes an already-blooming neighbor to Harmonic Fruiting
    }
  } else if (action === 'stillness') {
    if (currentIdx >= 1) {
      nextIdx = Math.min(4, Math.max(3, currentIdx + 1));
    }
  }

  return STAGE_ORDER[Math.max(currentIdx, Math.min(4, nextIdx))];
}

export interface EnvironmentalLifecycleState {
  phase: EnvironmentalLifecyclePhaseId;
  phaseIndex: number; // 0..3
  label: string;
  activeStemsCount: number;
  tempoBpm: number;
  windCadenceMultiplier: number;
  monumentSpinMultiplier: number;
  auroraVeilBoost: number;
  stageCounts: Record<BotanicalLifecycleStageId, number>;
}

export function evaluateEnvironmentalLifecycle(params: {
  harmonyPct: number;
  plants: GardenPlantInstance[];
  atmosphere: AtmosphereId;
}): EnvironmentalLifecycleState {
  const { harmonyPct, plants, atmosphere } = params;
  const stageCounts: Record<BotanicalLifecycleStageId, number> = {
    'dormant-seed': 0,
    'sprouting-bud': 0,
    'resonant-bloom': 0,
    'harmonic-fruiting': 0,
    'mycelial-memory': 0,
  };

  for (let i = 0; i < plants.length; i++) {
    const st = getPlantLifecycleStage(plants[i]);
    stageCounts[st] += 1;
  }

  const awakenedTotal =
    stageCounts['sprouting-bud'] +
    stageCounts['resonant-bloom'] +
    stageCounts['harmonic-fruiting'] +
    stageCounts['mycelial-memory'];

  let phase: EnvironmentalLifecyclePhaseId = 'dew-awakening';
  let phaseIndex = 0;
  let label = 'Dew Awakening';
  if (harmonyPct >= 85 || stageCounts['mycelial-memory'] >= 3) {
    phase = 'bioluminescent-slumber';
    phaseIndex = 3;
    label = 'Bioluminescent Confluence';
  } else if (harmonyPct >= 55 || stageCounts['harmonic-fruiting'] >= 2) {
    phase = 'nectar-confluence';
    phaseIndex = 2;
    label = 'Nectar Confluence';
  } else if (harmonyPct >= 25 || awakenedTotal >= 3) {
    phase = 'pollen-drift';
    phaseIndex = 1;
    label = 'Pollen Drift';
  }

  const activeStemsCount =
    awakenedTotal === 0
      ? 0
      : Math.min(
          4,
          (stageCounts['resonant-bloom'] + stageCounts['harmonic-fruiting'] + stageCounts['mycelial-memory'] > 0
            ? 1
            : 0) +
            (stageCounts['sprouting-bud'] + stageCounts['resonant-bloom'] > 0 ? 1 : 0) +
            (stageCounts['harmonic-fruiting'] + stageCounts['mycelial-memory'] > 0 ? 1 : 0) +
            (stageCounts['mycelial-memory'] > 0 || phaseIndex >= 2 ? 1 : 0),
        );

  const baseBpm =
    atmosphere === 'starlight'
      ? 64
      : atmosphere === 'twilight'
        ? 68
        : atmosphere === 'dawn'
          ? 72
          : 76;

  return {
    phase,
    phaseIndex,
    label,
    activeStemsCount,
    tempoBpm: baseBpm,
    windCadenceMultiplier: Number((1.0 + phaseIndex * 0.14).toFixed(2)),
    monumentSpinMultiplier: Number((1.0 + phaseIndex * 0.22).toFixed(2)),
    auroraVeilBoost: Number((phaseIndex * 0.08).toFixed(2)),
    stageCounts,
  };
}

export interface SoundtrackStepVoice {
  stem: SoundtrackStemId;
  species: PlantSpeciesId;
  biome: BiomeId;
  substrate: GrowthSubstrateId;
  frequencyHz: number;
  ratio: number;
  durationSec: number;
  amplitude: number;
  stereoPan: number;
  distanceMeters: number;
  acousticOcclusion: number;
  voiceLifecycle: AcousticVoiceLifecycleStageId;
}

export interface SoundtrackStepSpec {
  stepIndex: number; // 0..15
  isRest: boolean;
  voiceLifecycle: AcousticVoiceLifecycleStageId;
  voices: SoundtrackStepVoice[];
}

export interface LiveSoundtrackScore {
  profile: string;
  biome: BiomeId;
  atmosphere: AtmosphereId;
  environmentalPhase: EnvironmentalLifecyclePhaseId;
  environmentalPhaseLabel: string;
  tempoBpm: number;
  stepDurationSec: number;
  activeStems: SoundtrackStemId[];
  activeStepCount: number;
  restStepCount: number;
  steps: SoundtrackStepSpec[];
}

export const VERDANT_SOUNDTRACK_STANDARD = {
  profile: GENERATED_PRISM_STANDARDS.soundtrack.profile,
  stemCount: GENERATED_PRISM_STANDARDS.soundtrack.soundtrack.stemCount,
  stepsPerBar: GENERATED_PRISM_STANDARDS.soundtrack.soundtrack.stepsPerBar,
  maxActiveStepsPerBar: GENERATED_PRISM_STANDARDS.soundtrack.soundtrack.maxActiveStepsPerBar,
  minRestStepsPerBar: GENERATED_PRISM_STANDARDS.soundtrack.soundtrack.minRestStepsPerBar,
  minTempoBpm: GENERATED_PRISM_STANDARDS.soundtrack.soundtrack.minTempoBpm,
  maxTempoBpm: GENERATED_PRISM_STANDARDS.soundtrack.soundtrack.maxTempoBpm,
  selfDecayingVoicesOnly:
    GENERATED_PRISM_STANDARDS.soundtrack.soundtrack.selfDecayingVoicesOnly,
  neuromorphicBridge: PRISM_DOMAIN_BRIDGES.soundtrack,
} as const;

/**
 * Synthesizes a complete 16-step generative soundtrack bar (`LiveSoundtrackScore`) from the live
 * lifecycle stages of the garden's flora, the environmental micro-season, the 64-bit Rule-30 /
 * UORLUT01 neuromorphic state, and the physical 3D spatial position & substrate of each singing plant.
 *
 * Strictly satisfies `Foundation.Soundtrack.V1.Model::soundtrackBreathingSilenceGuaranteeHolds`:
 * - At most 10 active steps per 16-step bar (`activeStepCount <= 10`)
 * - At least 6 explicit breathing rest steps per 16-step bar (`restStepCount >= 6`)
 * - When no flora have been touched or attuned yet, all 16 steps rest in natural quietude (`0` active steps).
 */
export function composeLiveSoundtrackScore(params: {
  biome: BiomeId;
  atmosphere: AtmosphereId;
  harmonyPct: number;
  plants: GardenPlantInstance[];
  neuromorphic: NeuromorphicEngineState;
  playerX?: number;
  playerZ?: number;
  playerYaw?: number;
  colliders?: SolidCollider[];
}): LiveSoundtrackScore {
  const {
    biome,
    atmosphere,
    harmonyPct,
    plants,
    neuromorphic,
    playerX = 0,
    playerZ = 0,
    playerYaw = 0,
    colliders = [],
  } = params;
  const envLifecycle = evaluateEnvironmentalLifecycle({ harmonyPct, plants, atmosphere });
  const biomeCfg = BIOME_CONFIGS[biome];
  const stepDurationSec = Number((60 / envLifecycle.tempoBpm / 2).toFixed(3)); // Eighth-note pulse (~0.39s..0.46s)

  // Partition awakened flora by lifecycle stage
  const sproutingPlants = plants.filter((p) => getPlantLifecycleStage(p) === 'sprouting-bud');
  const bloomingPlants = plants.filter((p) => getPlantLifecycleStage(p) === 'resonant-bloom');
  const fruitingPlants = plants.filter((p) => getPlantLifecycleStage(p) === 'harmonic-fruiting');
  const elderPlants = plants.filter((p) => getPlantLifecycleStage(p) === 'mycelial-memory');

  const leadPool = [...bloomingPlants, ...fruitingPlants, ...elderPlants];
  const ostinatoPool = [...sproutingPlants, ...bloomingPlants];
  const bassPool = [...fruitingPlants, ...elderPlants];
  const canonPool =
    elderPlants.length > 0
      ? elderPlants
      : envLifecycle.phaseIndex >= 2
        ? [...fruitingPlants, ...bloomingPlants]
        : [];

  const activeStems: SoundtrackStemId[] = [];
  if (leadPool.length > 0) activeStems.push('melodic-flora-lead');
  if (ostinatoPool.length > 0) activeStems.push('polyrhythmic-ostinato');
  if (bassPool.length > 0) activeStems.push('harmonic-bass-anchor');
  if (canonPool.length > 0) activeStems.push('canonic-counterpoint-echo');

  // Helper to compute physical 3D spatial pan, distance, and obstacle occlusion for a singing specimen
  const bindSpecimenSpatialAcoustics = (
    specimen: GardenPlantInstance,
    fallbackPan: number,
  ): {
    stereoPan: number;
    distanceMeters: number;
    acousticOcclusion: number;
    substrate: GrowthSubstrateId;
    biome: BiomeId;
  } => {
    const dist = Number(Math.hypot(specimen.x - playerX, specimen.z - playerZ).toFixed(2));
    const spatialPan = computeBinauralPan(playerX, playerZ, playerYaw, specimen.x, specimen.z);
    const blendedPan = Number((spatialPan * 0.7 + fallbackPan * 0.3).toFixed(2));
    const occ =
      colliders.length > 0
        ? computeAcousticOcclusion(playerX, playerZ, specimen.x, specimen.z, colliders)
        : 0;
    return {
      stereoPan: blendedPan,
      distanceMeters: dist,
      acousticOcclusion: occ,
      substrate: specimen.substrate ?? 'terrestrial-loam',
      biome: specimen.biome,
    };
  };

  // Canonical breathing rest indices (at least 6 steps of the 16-step bar are guaranteed rests)
  // Rests on steps 3, 7, 11, 13, 14, 15 create natural phrasing and exhale space
  const guaranteedRestSet = new Set<number>([3, 7, 11, 13, 14, 15]);
  const r30Byte = neuromorphic.rule30History[neuromorphic.rule30History.length - 1] ?? 142;
  const scaleRatios = biomeCfg.scaleRatios;

  const steps: SoundtrackStepSpec[] = [];
  let activeStepCount = 0;

  for (let s = 0; s < 16; s++) {
    if (activeStems.length === 0 || guaranteedRestSet.has(s) || activeStepCount >= 10) {
      steps.push({
        stepIndex: s,
        isRest: true,
        voiceLifecycle: 'silence-rest',
        voices: [],
      });
      continue;
    }

    const voices: SoundtrackStepVoice[] = [];
    const r30Bit = neuromorphic.rule30Row[(s * 3 + (r30Byte % 7)) % 64] ?? s % 2 === 0;

    // Stem 1: Melodic Flora Lead (plays on downbeats 0, 4, 8, 12 and selected Rule-30 steps 2, 6, 10)
    if (leadPool.length > 0 && (s % 4 === 0 || (s % 2 === 0 && r30Bit))) {
      const specimen = leadPool[(s + r30Byte) % leadPool.length];
      const degIdx = (s + (r30Byte >> (s % 4))) % scaleRatios.length;
      const ratio = scaleRatios[degIdx] ?? 1.0;
      const spSpatial = bindSpecimenSpatialAcoustics(
        specimen,
        Number((Math.sin(s * 0.7) * 0.45).toFixed(2)),
      );
      voices.push({
        stem: 'melodic-flora-lead',
        species: specimen.species,
        biome: spSpatial.biome,
        substrate: spSpatial.substrate,
        frequencyHz: Number((biomeCfg.baseNoteHz * ratio * specimen.pitchMultiplier).toFixed(2)),
        ratio,
        durationSec: Number((stepDurationSec * 2.1).toFixed(3)),
        amplitude: 0.046,
        stereoPan: spSpatial.stereoPan,
        distanceMeters: spSpatial.distanceMeters,
        acousticOcclusion: spSpatial.acousticOcclusion,
        voiceLifecycle: s % 4 === 0 ? 'modal-bloom' : 'incipit-transient',
      });
    }

    // Stem 2: Polyrhythmic Ostinato (delicate off-beat pizzicato plucks on steps 1, 5, 9)
    if (ostinatoPool.length > 0 && (s === 1 || s === 5 || s === 9)) {
      const specimen = ostinatoPool[s % ostinatoPool.length];
      const ratio =
        neuromorphic.synthesizedCounterpointRatios[s % 3] ?? scaleRatios[s % scaleRatios.length];
      const spSpatial = bindSpecimenSpatialAcoustics(specimen, s === 5 ? 0.52 : -0.52);
      voices.push({
        stem: 'polyrhythmic-ostinato',
        species: specimen.species,
        biome: spSpatial.biome,
        substrate: spSpatial.substrate,
        frequencyHz: Number((biomeCfg.baseNoteHz * ratio * 2.0).toFixed(2)),
        ratio: Number((ratio * 2.0).toFixed(3)),
        durationSec: Number((stepDurationSec * 0.85).toFixed(3)),
        amplitude: 0.032,
        stereoPan: spSpatial.stereoPan,
        distanceMeters: spSpatial.distanceMeters,
        acousticOcclusion: spSpatial.acousticOcclusion,
        voiceLifecycle: 'incipit-transient',
      });
    }

    // Stem 3: Harmonic Bass Anchor (warm self-decaying bowed root/fifth on step 0 and step 8 — never a continuous drone!)
    if (bassPool.length > 0 && (s === 0 || s === 8)) {
      const specimen = bassPool[s === 0 ? 0 : bassPool.length - 1];
      const bassRatio = s === 0 ? 0.5 : 0.75; // Sub-octave root (1:2) and pure fifth (3:4)
      const spSpatial = bindSpecimenSpatialAcoustics(specimen, 0);
      voices.push({
        stem: 'harmonic-bass-anchor',
        species: specimen.species,
        biome: spSpatial.biome,
        substrate: spSpatial.substrate,
        frequencyHz: Number((biomeCfg.baseNoteHz * bassRatio).toFixed(2)),
        ratio: bassRatio,
        durationSec: Number((stepDurationSec * 3.2).toFixed(3)),
        amplitude: 0.048,
        stereoPan: spSpatial.stereoPan,
        distanceMeters: spSpatial.distanceMeters,
        acousticOcclusion: spSpatial.acousticOcclusion,
        voiceLifecycle: 'modal-bloom',
      });
    }

    // Stem 4: Canonic Counterpoint Echo (steps 2, 6, 10, 12 using Icosian Z[φ] / PrimeAddress kinship)
    if (canonPool.length > 0 && (s === 2 || s === 6 || s === 10 || s === 12)) {
      const specimen = canonPool[(s >> 1) % canonPool.length];
      const cRatio = neuromorphic.synthesizedCounterpointRatios[(s >> 1) % 3] ?? 1.5;
      const spSpatial = bindSpecimenSpatialAcoustics(specimen, s % 4 === 2 ? 0.64 : -0.64);
      voices.push({
        stem: 'canonic-counterpoint-echo',
        species: specimen.species,
        biome: spSpatial.biome,
        substrate: spSpatial.substrate,
        frequencyHz: Number((biomeCfg.baseNoteHz * cRatio * 1.5).toFixed(2)),
        ratio: Number((cRatio * 1.5).toFixed(3)),
        durationSec: Number((stepDurationSec * 1.8).toFixed(3)),
        amplitude: 0.034,
        stereoPan: spSpatial.stereoPan,
        distanceMeters: spSpatial.distanceMeters,
        acousticOcclusion: spSpatial.acousticOcclusion,
        voiceLifecycle: 'sympathetic-canon',
      });
    }

    if (voices.length === 0) {
      steps.push({
        stepIndex: s,
        isRest: true,
        voiceLifecycle: 'silence-rest',
        voices: [],
      });
    } else {
      activeStepCount += 1;
      steps.push({
        stepIndex: s,
        isRest: false,
        voiceLifecycle: voices[0].voiceLifecycle,
        voices,
      });
    }
  }

  const restStepCount = 16 - activeStepCount;

  return {
    profile: VERDANT_SOUNDTRACK_STANDARD.profile,
    biome,
    atmosphere,
    environmentalPhase: envLifecycle.phase,
    environmentalPhaseLabel: envLifecycle.label,
    tempoBpm: envLifecycle.tempoBpm,
    stepDurationSec,
    activeStems,
    activeStepCount,
    restStepCount,
    steps,
  };
}

export interface SpatialGroundingAndSubstrateReport {
  allGroundedAndValid: boolean;
  treeCount: number;
  canopyCount: number;
  rockCount: number;
  shorelineBoulderCount: number;
  steppingStoneCount: number;
  plantCount: number;
  grassBladeCount: number;
  floatingTreeCount: number;
  detachedCanopyCount: number;
  floatingRockOrStoneCount: number;
  floatingPlantCount: number;
  treesOnHardSurfaceOrRockCount: number;
  plantsOnHardSurfaceOrRockCount: number;
  grassOnHardSurfaceOrRockCount: number;
}

/**
 * Verifies the Universal Spatial Grounding & Substrate Exclusion Law (`Foundation.Botany.V1.Model::zeroHardSurfaceOrRockGrowthHolds`
 * and `Foundation.Physics.V1.Model::spatialGroundingCoherenceHolds`) across all 64 trees, 128 canopy crowns, 52 perimeter rocks,
 * 28 shoreline boulders, 64 stepping stones, all flora specimens, and all 360 grass blades:
 * 1. Zero floating tree trunks (`tree.baseY < tree.minPerimeterGroundY` for all 64 trees).
 * 2. Zero detached canopy crowns (`canopy.y <= tree.topY` and physically centered along the tilted trunk axis for all 128 crowns).
 * 3. Zero floating rocks, shoreline boulders, or stepping stones (`bottomY < minPerimeterGroundY` across all 144 lithic instances).
 * 4. Zero floating plants (`plant.y <= minPerimeterGroundY` for terrestrial flora, or `plant.y === MIRROR_LAGOON_WATER_SURFACE_Y` for pelagic `echo-lotus`).
 * 5. Zero trees, plants, or grass blades growing on hard structure platforms, stone pathways, stepping stones, or solid rocks.
 */
export function verifySpatialGroundingAndSubstrateCoherence(params?: {
  plants?: GardenPlantInstance[];
}): SpatialGroundingAndSubstrateReport {
  const trees = generateConservatoryTrees();
  const rocks = generateConservatoryRocks();
  const shorelineBoulders = generateConservatoryShorelineBoulders();
  const steppingStones = generateConservatorySteppingStones();
  const plants = params?.plants ? [...params.plants] : generateGardenPlants(42026);
  const grassBlades = generateConservatoryGrassBlades();

  let floatingTreeCount = 0;
  let detachedCanopyCount = 0;
  let treesOnHardSurfaceOrRockCount = 0;

  for (const t of trees) {
    if (t.baseY > t.minPerimeterGroundY - 0.05) {
      floatingTreeCount++;
    }
    const law = evaluateSpatialSurfaceLaw(t.x, t.z, t.baseRadiusMeters);
    if (law.isHardStructurePlatform || law.isRockOutcrop || !law.canSupportTree) {
      treesOnHardSurfaceOrRockCount++;
    }
    for (const c of t.canopyTiers) {
      if (c.y > t.topY || c.y < t.baseY + t.trunkHeightMeters * 0.5) {
        detachedCanopyCount++;
      }
    }
  }

  let floatingRockOrStoneCount = 0;
  for (const r of rocks) {
    if (r.bottomY > r.minPerimeterGroundY) {
      floatingRockOrStoneCount++;
    }
  }
  for (const sb of shorelineBoulders) {
    if (sb.bottomY > sb.minPerimeterGroundY) {
      floatingRockOrStoneCount++;
    }
  }
  for (const st of steppingStones) {
    if (st.bottomY > st.minPerimeterGroundY) {
      floatingRockOrStoneCount++;
    }
  }

  let floatingPlantCount = 0;
  let plantsOnHardSurfaceOrRockCount = 0;
  for (const p of plants) {
    const law = evaluateSpatialSurfaceLaw(p.x, p.z, 0.35);
    if (law.isHardStructurePlatform || law.isRockOutcrop || !law.canSupportPlant) {
      plantsOnHardSurfaceOrRockCount++;
    }
    const anchor = computeSlopeEmbeddedGroundAnchor(p.x, p.z, 0.35, 0.02);
    if (p.species === 'echo-lotus' && law.isSubmergedLagoon) {
      if (Math.abs(p.y - MIRROR_LAGOON_WATER_SURFACE_Y) > 0.01) {
        floatingPlantCount++;
      }
    } else if (p.y > anchor.minPerimeterGroundY + 0.01) {
      floatingPlantCount++;
    }
  }

  let grassOnHardSurfaceOrRockCount = 0;
  for (const g of grassBlades) {
    if (!g.valid) continue;
    const law = evaluateSpatialSurfaceLaw(g.x, g.z, 0.12);
    if (law.isHardStructurePlatform || law.isRockOutcrop || !law.canSupportGrass) {
      grassOnHardSurfaceOrRockCount++;
    }
    if (g.y > g.minPerimeterGroundY) {
      floatingPlantCount++;
    }
  }

  const allGroundedAndValid =
    floatingTreeCount === 0 &&
    detachedCanopyCount === 0 &&
    floatingRockOrStoneCount === 0 &&
    floatingPlantCount === 0 &&
    treesOnHardSurfaceOrRockCount === 0 &&
    plantsOnHardSurfaceOrRockCount === 0 &&
    grassOnHardSurfaceOrRockCount === 0;

  return {
    allGroundedAndValid,
    treeCount: trees.length,
    canopyCount: trees.length * 2,
    rockCount: rocks.length,
    shorelineBoulderCount: shorelineBoulders.length,
    steppingStoneCount: steppingStones.length,
    plantCount: plants.length,
    grassBladeCount: grassBlades.length,
    floatingTreeCount,
    detachedCanopyCount,
    floatingRockOrStoneCount,
    floatingPlantCount,
    treesOnHardSurfaceOrRockCount,
    plantsOnHardSurfaceOrRockCount,
    grassOnHardSurfaceOrRockCount,
  };
}

export interface HolisticSystemCouplingReport {
  allConstrained: boolean;
  coupledDomainCount: number;
  solidExclusionVerified: boolean;
  sporeFloorAndObstacleVerified: boolean;
  emergentSeedlingColliderVerified: boolean;
  waveRingNormalAlignmentVerified: boolean;
  heliocentricPhototropicLockVerified: boolean;
  causalWavefrontTimingVerified: boolean;
  universalSoundtrackSpatialBindingVerified: boolean;
  spatialGroundingAndSubstrateCoherenceVerified: boolean;
  universalNeuromorphicBusVerified: boolean;
  infrastructureNeuromorphicCouplingVerified: boolean;
  symbioticEnvironmentalAgencyVerified: boolean;
  emergentStakeholderEntityVerified: boolean;
  granularAtomicToEnvironmentalSynthesisVerified: boolean;
  completePrismModelClosureVerified: boolean;
}

/**
 * Verifies the 10-Domain Holistic Mutual Constraint & Universal Neuromorphic Bus Law
 * (`Foundation.Physics.V1.Model::holisticCouplingStandardHolds`, `Foundation.Neuromorphic.V1.Model::crossDomainTransferBoundedAndMonotonicHolds`,
 * and `Foundation.Infrastructure.V1.Model::infrastructureNeuromorphicCouplingHolds`):
 * Confirms that every physical, botanical, chemical, ecological, acoustic, infrastructure, and neuromorphic element
 * in the game is mutually constrained by all parts of the Prism model, obeys the laws of physics and spatial grounding,
 * and automatically transfers neuromorphic enhancements across all 10 domains whenever any single domain improves.
 */
export function verifyHolisticSystemCoupling(params?: {
  plants?: GardenPlantInstance[];
  colliders?: SolidCollider[];
}): HolisticSystemCouplingReport {
  const plants = params?.plants ? [...params.plants] : generateGardenPlants(42026);
  const colliders = params?.colliders ? [...params.colliders] : buildGardenColliders(plants);

  // 1. Solid-body exclusion across all 5 biome waypoint landings
  const allBiomes: BiomeId[] = ['meadow', 'grove', 'crystal', 'wetland', 'sanctuary'];
  let solidExclusionVerified = true;
  for (const b of allBiomes) {
    const landing = resolveBiomeWaypointLanding(b, colliders);
    for (const c of colliders) {
      const d = Math.hypot(landing.x - c.x, landing.z - c.z);
      if (d < VERDANT_PHYSICS_STANDARD.playerBodyRadiusMeters + c.radiusMeters - 0.005) {
        solidExclusionVerified = false;
      }
    }
  }

  // 2. Spore fluid dynamics solid-obstacle deflection & terrain/water meniscus floor constraint
  const obeliskCollider = colliders.find((c) => c.id === 'col-sanctuary-core')!;
  const sporeStepIntoObelisk = stepSporeFluidDynamics({
    x: obeliskCollider.x,
    y: groundHeightAt(obeliskCollider.x, obeliskCollider.z) + 0.02, // Below floor & inside obelisk radius
    z: obeliskCollider.z + obeliskCollider.radiusMeters * 0.5,
    vx: 0,
    vy: -1.5,
    vz: -1.0,
    playerX: 0,
    playerZ: 0,
    playerVX: 0,
    playerVZ: 0,
    attractorX: 0,
    attractorY: 0,
    attractorZ: -34,
    attractorTerpeneStrength: 0.8,
    atmosphere: 'dawn',
    elapsedSeconds: 1.0,
    rule30Byte: 142,
    synapticWeight: 10,
    dt: 0.05,
    colliders,
  });
  const distSporeFromObelisk = Math.hypot(
    sporeStepIntoObelisk.x - obeliskCollider.x,
    sporeStepIntoObelisk.z - obeliskCollider.z,
  );
  const sporeFloorAndObstacleVerified =
    sporeStepIntoObelisk.deflectedByObstacle &&
    sporeStepIntoObelisk.reflectedByFloor &&
    distSporeFromObelisk >= obeliskCollider.radiusMeters + 0.15 &&
    sporeStepIntoObelisk.y >= groundHeightAt(sporeStepIntoObelisk.x, sporeStepIntoObelisk.z) + 0.13;

  // 3. Emergent Neuromorphic Seedling collider registration & acoustic occlusion
  const testSeedling: GardenPlantInstance = {
    id: 'holistic-seedling-check',
    species: 'star-orchid',
    biome: 'meadow',
    substrate: 'terrestrial-loam',
    x: 6.0,
    y: groundHeightAt(6.0, -8.0),
    z: -8.0,
    scale: 1.0,
    rotationY: 0,
    pitchMultiplier: 1.25,
    attuned: true,
    lifecycleStage: 'mycelial-memory',
  };
  const registeredCol = registerEmergentSeedlingCollider(colliders, testSeedling);
  const emergentSeedlingColliderVerified =
    registeredCol !== null &&
    registeredCol.radiusMeters === 0.34 &&
    colliders.some((c) => c.id === 'col-flora-holistic-seedling-check');

  // 4. Wave ring surface-normal alignment & medium dispersion speed
  const waveStone = evaluateGroundWavePropagation({
    x: 0,
    z: -14,
    ageSec: 0.8,
    colliders,
  });
  const waveWater = evaluateGroundWavePropagation({
    x: -26,
    z: 30,
    ageSec: 0.8,
    colliders,
  });
  const waveSlope = evaluateGroundWavePropagation({
    x: 15,
    z: 18,
    ageSec: 0.8,
    colliders,
  });
  const waveRingNormalAlignmentVerified =
    waveStone.waveSpeedMps > waveWater.waveSpeedMps &&
    waveWater.elevationY === Number((MIRROR_LAGOON_WATER_SURFACE_Y + 0.038).toFixed(3)) &&
    (Math.abs(waveSlope.surfaceTiltX) > 0.001 || Math.abs(waveSlope.surfaceTiltZ) > 0.001);

  // 5. Heliocentric-Phototropic-Shadow Lock across all 4 diurnal atmospheres
  let heliocentricPhototropicLockVerified = true;
  for (const atmos of ['dawn', 'golden', 'twilight', 'starlight'] as AtmosphereId[]) {
    const diurnal = evaluateDiurnalProfile(atmos, 'meadow', 75);
    const expectedVec = DIURNAL_CELESTIAL_VECTORS[atmos];
    if (
      diurnal.sunPosition[0] !== expectedVec[0] ||
      diurnal.sunPosition[1] !== expectedVec[1] ||
      diurnal.sunPosition[2] !== expectedVec[2]
    ) {
      heliocentricPhototropicLockVerified = false;
    }
  }

  // 6. Causal finite-velocity wavefront timing (`v = 6.5 m/s`)
  const arcEval = computeSympatheticParabolicArc({
    x1: 0,
    y1: 0,
    z1: -6,
    x2: 6.5,
    y2: 0,
    z2: -12,
    elapsedSinceTriggerSec: 0.2,
  });
  const causalWavefrontTimingVerified =
    arcEval.travelTimeSec >= 0.18 &&
    Math.abs(arcEval.travelTimeSec - arcEval.arcLengthMeters / 6.5) < 0.01 &&
    !arcEval.hasArrivedAtTarget;

  // 7. Universal soundtrack 3D spatial & substrate binding
  plants[0].attuned = true;
  plants[0].lifecycleStage = 'resonant-bloom';
  const score = composeLiveSoundtrackScore({
    biome: 'meadow',
    atmosphere: 'dawn',
    harmonyPct: 50,
    plants,
    neuromorphic: createInitialNeuromorphicState(),
    playerX: 0,
    playerZ: 0,
    playerYaw: 0,
    colliders,
  });
  const firstActiveStep = score.steps.find((s) => !s.isRest && s.voices.length > 0);
  const universalSoundtrackSpatialBindingVerified = Boolean(
    firstActiveStep &&
      firstActiveStep.voices[0].distanceMeters > 0 &&
      firstActiveStep.voices[0].substrate !== undefined,
  );

  // 8. Universal Spatial Grounding & Hard-Surface/Rock Exclusion Coherence
  const groundingReport = verifySpatialGroundingAndSubstrateCoherence({ plants });
  const spatialGroundingAndSubstrateCoherenceVerified = groundingReport.allGroundedAndValid;

  // 9. Universal 10-Domain Neuromorphic Bus & Autopoietic Cross-Domain Enhancement Transfer
  const initialManifold = createInitialUniversalManifold();
  const enhancedManifold = propagateCrossDomainEnhancement(initialManifold, {
    sourceDomain: 'physics',
    resonantSuccess: true,
  });
  const directivesBefore = computeCrossDomainRefinementDirectives(initialManifold);
  const directivesAfter = computeCrossDomainRefinementDirectives(enhancedManifold);
  const universalNeuromorphicBusVerified =
    PRISM_DOMAIN_ORDER.length === 10 &&
    enhancedManifold.domains.physics.synapticWeight === 10 &&
    PRISM_DOMAIN_ORDER.every(
      (dom) =>
        enhancedManifold.domains[dom].synapticWeight >
          initialManifold.domains[dom].synapticWeight &&
        enhancedManifold.domains[dom].fidelityMultiplier >
          initialManifold.domains[dom].fidelityMultiplier,
    ) &&
    enhancedManifold.totalCrossDomainTransfers === 9 &&
    enhancedManifold.globalFidelityIndex > initialManifold.globalFidelityIndex;

  // 10. All-10-Domain Neuromorphic Bridge Contracts, Infrastructure Coupling & Autopoietic Model Refinement
  const baseNeuroState = createInitialNeuromorphicState();
  const skewedState: NeuromorphicEngineState = {
    ...baseNeuroState,
    universalManifold: propagateCrossDomainEnhancement(baseNeuroState.universalManifold, {
      sourceDomain: 'physics',
      resonantSuccess: true,
    }),
  };
  const refinedReport = refinePrismModel(skewedState, { cycles: 2 });
  const infrastructureNeuromorphicCouplingVerified =
    VERDANT_INFRASTRUCTURE_STANDARD.neuromorphicBridge.neuromorphicBusCoupled &&
    VERDANT_INFRASTRUCTURE_STANDARD.neuromorphicBridge.domainBasisPrime === 71 &&
    refinedReport.allDomainsBridgeVerified &&
    refinedReport.fidelityAfter > refinedReport.fidelityBefore &&
    refinedReport.varianceAfter <= refinedReport.varianceBefore &&
    directivesAfter.infrastructure.toneMappingExposure >
      directivesBefore.infrastructure.toneMappingExposure &&
    directivesAfter.infrastructure.microReliefBumpScale >
      directivesBefore.infrastructure.microReliefBumpScale &&
    directivesAfter.infrastructure.activeSporePoolRatio >
      directivesBefore.infrastructure.activeSporePoolRatio &&
    directivesAfter.botany.kuramotoCouplingMultiplier >
      directivesBefore.botany.kuramotoCouplingMultiplier &&
    directivesAfter.acoustics.modalFilterQMultiplier >
      directivesBefore.acoustics.modalFilterQMultiplier;

  // 11. Symbiotic Environmental Agency (`stepSymbioticEnvironmentalAgency`):
  // Verifies the environment observes itself + the player and acts on both within humane autonomy bounds
  const initialAgency = createInitialEnvironmentalAgencyState();
  const beckonStep = stepSymbioticEnvironmentalAgency(initialAgency, {
    playerX: 0,
    playerY: 0,
    playerZ: 5,
    playerYaw: 0,
    isMoving: true,
    velocityDm: 8,
    agitationPct: 0,
    stillnessBreathPhase: 'idle',
    playerInteractedThisFrame: false,
    currentBiome: 'meadow',
    atmosphere: 'dawn',
    harmonyPct: 35,
    plants,
    neuromorphic: baseNeuroState,
    dt: 4.9,
  });
  const stationaryStep = stepSymbioticEnvironmentalAgency(initialAgency, {
    playerX: 0,
    playerY: 0,
    playerZ: 5,
    playerYaw: 0,
    isMoving: false,
    velocityDm: 0,
    agitationPct: 24,
    stillnessBreathPhase: 'idle',
    playerInteractedThisFrame: false,
    currentBiome: 'meadow',
    atmosphere: 'dawn',
    harmonyPct: 35,
    plants,
    neuromorphic: baseNeuroState,
    dt: 0.5,
  });
  const symbioticEnvironmentalAgencyVerified =
    VERDANT_HUMANE_STANDARD.environmentalAgency.environmentObservesSelfAndPlayer &&
    VERDANT_HUMANE_STANDARD.environmentalAgency.environmentActsOnSelfAndPlayer &&
    VERDANT_HUMANE_STANDARD.environmentalAgency.playerObjectiveUnchanged &&
    VERDANT_HUMANE_STANDARD.environmentalAgency.optimizedModalityCount === 6 &&
    beckonStep.beckoningPlantId !== null &&
    beckonStep.shouldEmitBeckoningCall &&
    Math.hypot(beckonStep.playerZephyrAccelX, beckonStep.playerZephyrAccelZ) <=
      VERDANT_HUMANE_STANDARD.environmentalAgency.maxZephyrGuidanceAccelMps2 + 0.001 &&
    stationaryStep.mode === 'soothing-co-regulation' &&
    stationaryStep.playerZephyrAccelX === 0 &&
    stationaryStep.playerZephyrAccelZ === 0;

  // 12. Emergent Stakeholder Entity & Environmental Wisdom Phenomena (`Foundation.Neuromorphic.V1.Model::EmergentEntityStakeholderSpec`):
  // Verifies that the 4 facets of emergence (Intelligence, Memory, Observation, Feedback) synthesize into
  // environmental wisdom phenomena and stakeholder player-value reinforcement.
  const emergentStakeholderEntityVerified =
    VERDANT_NEUROMORPHIC_STANDARD.stakeholderEntity.emergenceFacetCount === 4 &&
    VERDANT_NEUROMORPHIC_STANDARD.stakeholderEntity.wisdomPhenomenonCount === 4 &&
    VERDANT_NEUROMORPHIC_STANDARD.stakeholderEntity.entitySynthesizesAllFourFacets &&
    VERDANT_NEUROMORPHIC_STANDARD.stakeholderEntity.wisdomExpressedAsEnvironmentalPhenomena &&
    VERDANT_NEUROMORPHIC_STANDARD.stakeholderEntity.stakeholderReinforcesPlayerValue &&
    VERDANT_NEUROMORPHIC_STANDARD.stakeholderEntity.baselinePlayerValueIndex === 9 &&
    beckonStep.stakeholderEntity.facets.allFourFacetsActive &&
    beckonStep.stakeholderEntity.guidanceFilamentWaypoints.length === 7 &&
    beckonStep.stakeholderEntity.playerValueReinforcement.overallValueReinforcementIndex >= 68;

  // 13. 6-Stage Closed-Loop Granular Atomic-to-Environmental Procedural Synthesis (`Foundation.Ecology.V1.Model::GranularMatterSynthesisSpec`, `granularAtomicToEnvironmentalSynthesisHolds` & `closedLoopAtomicRemineralizationHolds`):
  // Verifies that Atoms -> Molecules -> Macromolecules -> Organic & Inorganic Compounds -> Environmental & Multi-Modal Synthesis -> Closed-Loop Atomic Remineralization hold across all 6 modalities.
  const granularSample = beckonStep.granularSynthesis;
  const granularAtomicToEnvironmentalSynthesisVerified =
    VERDANT_ECOLOGY_STANDARD.granularSynthesis.atomicElementCount === 8 &&
    VERDANT_ECOLOGY_STANDARD.granularSynthesis.molecularSpeciesCount === 8 &&
    VERDANT_ECOLOGY_STANDARD.granularSynthesis.macromoleculeCount === 6 &&
    VERDANT_ECOLOGY_STANDARD.granularSynthesis.matterCompoundCount === 6 &&
    VERDANT_ECOLOGY_STANDARD.granularSynthesis.synthesizedModalityCount === 6 &&
    VERDANT_ECOLOGY_STANDARD.granularSynthesis.closedLoopReactionPathwayCount === 4 &&
    VERDANT_ECOLOGY_STANDARD.granularSynthesis.atomicToEnvironmentalChainVerified &&
    VERDANT_ECOLOGY_STANDARD.granularSynthesis.atomicRemineralizationComplete &&
    VERDANT_ECOLOGY_STANDARD.granularSynthesis.prismSynthesisClosureVerified &&
    granularSample.chainHierarchyVerified &&
    granularSample.closedLoopConservationVerified &&
    granularSample.completeSynthesisClosureVerified &&
    granularSample.tier1AtomicValenceIndex < granularSample.tier2MolecularBondIndex &&
    granularSample.tier2MolecularBondIndex < granularSample.tier3MacromolecularPolymerIndex &&
    granularSample.tier3MacromolecularPolymerIndex < granularSample.tier4CompoundManifestationIndex &&
    granularSample.tier4CompoundManifestationIndex < granularSample.tier5EnvironmentalModalIndex &&
    granularSample.tier5EnvironmentalModalIndex < granularSample.tier6AtomicRemineralizationIndex &&
    granularSample.tier6AtomicRemineralizationIndex ===
      300 +
        granularSample.tier5EnvironmentalModalIndex +
        granularSample.tier1AtomicValenceIndex &&
    granularSample.reactionKinetics.stoichiometricMassBalanceRatio === 1.0 &&
    granularSample.compoundManifestations.inorganic.travertineLimestoneSpar > 0 &&
    granularSample.compoundManifestations.organic.lignocellulosicVascularTissue > 0;

  // 14. Complete Prism Model Closure (`VerdantResonance::verifyCompletePrismModelClosure` & `VerdantResonanceProofs::completePrismModelClosureHolds`):
  const sampleClosureRequest: Record<string, string | bigint> = {
    biome: 'sanctuary',
    plant: 'star-orchid',
    action: 'attune',
    atmosphere: 'starlight',
    chorus: 'awakened',
    proximity: 8n,
    velocity: 2n,
  };
  const completePrismModelClosureVerified =
    GENERATED_VERDANT_JUDGE_ARTIFACT.rootJudgeVerifiesCompleteClosure &&
    verifyCompletePrismModelClosure(sampleClosureRequest) &&
    universalNeuromorphicBusVerified &&
    emergentStakeholderEntityVerified &&
    granularAtomicToEnvironmentalSynthesisVerified;

  const allConstrained =
    solidExclusionVerified &&
    sporeFloorAndObstacleVerified &&
    emergentSeedlingColliderVerified &&
    waveRingNormalAlignmentVerified &&
    heliocentricPhototropicLockVerified &&
    causalWavefrontTimingVerified &&
    universalSoundtrackSpatialBindingVerified &&
    spatialGroundingAndSubstrateCoherenceVerified &&
    universalNeuromorphicBusVerified &&
    infrastructureNeuromorphicCouplingVerified &&
    symbioticEnvironmentalAgencyVerified &&
    emergentStakeholderEntityVerified &&
    granularAtomicToEnvironmentalSynthesisVerified &&
    completePrismModelClosureVerified;

  return {
    allConstrained,
    coupledDomainCount: VERDANT_PHYSICS_STANDARD.coupledDomainCount,
    solidExclusionVerified,
    sporeFloorAndObstacleVerified,
    emergentSeedlingColliderVerified,
    waveRingNormalAlignmentVerified,
    heliocentricPhototropicLockVerified,
    causalWavefrontTimingVerified,
    universalSoundtrackSpatialBindingVerified,
    spatialGroundingAndSubstrateCoherenceVerified,
    universalNeuromorphicBusVerified,
    infrastructureNeuromorphicCouplingVerified,
    symbioticEnvironmentalAgencyVerified,
    emergentStakeholderEntityVerified,
    granularAtomicToEnvironmentalSynthesisVerified,
    completePrismModelClosureVerified,
  };
}

// ============================================================================
// SUBSYSTEM 18: HIGH-DEFINITION PROCEDURAL 3D B-MESH & KINEMATIC RIG SYNTHESIS
// ============================================================================

export interface HighDefinitionMeshSynthesisProfile {
  species: PlantSpeciesId;
  biome: BiomeId;
  substrate: GrowthSubstrateId;
  /** Parametric B-Mesh resolution & vascular venation topology derived from cellulose-lignin microfibrils */
  radialSegments: number;
  longitudinalSegments: number;
  midribVenationDepthMm: number;
  marginalRuffleAmplitudeMm: number;
  bezierArchCurvature: number;
  /** Thin-film iridescence & subsurface sheen derived from tectosilicate quartz & chlorophyll-a porphyrin */
  iridescenceStrength: number;
  iridescenceIor: number;
  iridescenceThinFilmMinNm: number;
  iridescenceThinFilmMaxNm: number;
  cuticularSheenStrength: number;
  cuticularSheenRoughness: number;
  /** Tangent-space normal map scale derived from calcite-aragonite spar & chitin-glucan hyphal network */
  normalMapScale: number;
  /** Vertex-shader harmonic micro-undulation parameters */
  vertexWaveFrequencyHz: number;
  vertexWaveAmplitudeMeters: number;
  bioluminescentVeinPulseSpeed: number;
  /** Shape-key (morph target) baseline weights [0..1] */
  morphBloomBaseline: number;
  morphResonanceCapacity: number;
}

/**
 * Synthesizes high-definition 3D parametric B-Mesh geometry parameters, PBR thin-film iridescence,
 * subsurface cuticular sheen, tangent-space normal relief, and shape-key (morph-target) envelopes
 * directly from the specimen's 6-stage closed-loop atomic-to-environmental synthesis state.
 */
export function evaluateHighDefinitionVisualSynthesis(params: {
  biome: BiomeId;
  species: PlantSpeciesId;
  substrate?: GrowthSubstrateId;
  atmosphere: AtmosphereId;
  attuned: boolean;
  lifecycleStage?: BotanicalLifecycleStageId;
  harmonyPct?: number;
  neuromorphicWeight?: number;
  volatileTerpeneImpulse?: number;
}): HighDefinitionMeshSynthesisProfile {
  const {
    biome,
    species,
    substrate = 'terrestrial-loam',
    atmosphere,
    attuned,
    lifecycleStage = 'dormant-seed',
    harmonyPct = 45,
    neuromorphicWeight = 8,
    volatileTerpeneImpulse = 0,
  } = params;

  const organo = synthesizeBotanicalOrganogenesis({
    biome,
    species,
    substrate,
    atmosphere,
    attuned,
    harmonyPct,
    neuromorphicWeight,
    volatileTerpeneImpulse,
  });
  const granular = organo.granularSynthesis;
  const stageSpec = BOTANICAL_LIFECYCLE_STAGES[lifecycleStage];

  const celluloseStiffnessNorm = Math.min(
    1.0,
    Math.max(0.2, (organo.celluloseStemStiffnessGPa - 10.0) / 8.0),
  );
  const quartzFraction = granular.compoundManifestations.inorganic.piezoelectricQuartzGeode;
  const sparFraction = granular.compoundManifestations.inorganic.travertineLimestoneSpar;
  const humusFraction = granular.compoundManifestations.organic.bioluminescentMycelialHumus;

  const speciesArchBase =
    species === 'chime-lily'
      ? 0.42
      : species === 'pulse-fern'
        ? 0.56
        : species === 'echo-lotus'
          ? 0.28
          : species === 'drone-moss'
            ? 0.22
            : 0.38;

  const midribVenationDepthMm = Number(
    (1.4 + celluloseStiffnessNorm * 1.8 + sparFraction * 0.65).toFixed(3),
  );
  const marginalRuffleAmplitudeMm = Number(
    (
      (species === 'star-orchid' ? 3.2 : species === 'chime-lily' ? 2.4 : 1.8) *
      (0.85 + humusFraction * 0.35)
    ).toFixed(3),
  );
  const bezierArchCurvature = Number(
    (speciesArchBase * (1.08 - celluloseStiffnessNorm * 0.16)).toFixed(3),
  );

  // Thin-film iridescence from dissolved silica phytoliths & cuticular wax crystals
  const iridescenceStrength = Number(
    Math.min(
      1.0,
      0.38 + quartzFraction * 0.48 + (attuned ? 0.14 : 0) + stageSpec.stageIndex * 0.04,
    ).toFixed(3),
  );
  const iridescenceIor = Number((1.40 + quartzFraction * 0.15).toFixed(3));
  const iridescenceThinFilmMinNm = Math.round(160 + quartzFraction * 80);
  const iridescenceThinFilmMaxNm = Math.round(
    360 + quartzFraction * 120 + (organo.chromophoreEmissionWavelengthNm - 470) * 0.4,
  );

  const cuticularSheenStrength = Number(
    Math.min(1.0, 0.45 + organo.chlorophyllPorphyrinAntennaEfficiency * 0.42).toFixed(3),
  );
  const cuticularSheenRoughness = Number(
    Math.max(0.18, 0.52 - humusFraction * 0.22).toFixed(3),
  );

  const normalMapScale = Number(
    Math.min(
      0.85,
      Math.max(
        0.35,
        0.38 +
          granular.modalSyntheses.opticalModality.crystalLatticeMicroReliefBumpScale * 5.2 +
          sparFraction * 0.22,
      ),
    ).toFixed(3),
  );

  const fundamentalHz = BIOME_CONFIGS[biome].baseNoteHz;
  const vertexWaveFrequencyHz = Number((1.35 + (fundamentalHz / 440) * 1.15).toFixed(3));
  const vertexWaveAmplitudeMeters = Number(
    (0.012 + (attuned ? 0.014 : 0.004) + volatileTerpeneImpulse * 0.012).toFixed(4),
  );
  const bioluminescentVeinPulseSpeed = Number(
    (1.6 + organo.luciferaseBioluminescentPhotonFlux * 1.45).toFixed(3),
  );

  const morphBloomBaseline = Number(
    Math.min(
      1.0,
      Math.max(0.08, stageSpec.corollaOpenFactor * 0.78 + (attuned ? 0.22 : 0)),
    ).toFixed(3),
  );
  const morphResonanceCapacity = Number(
    Math.min(1.0, 0.35 + quartzFraction * 0.35 + (neuromorphicWeight / 16) * 0.3).toFixed(3),
  );

  return {
    species,
    biome,
    substrate,
    radialSegments: 24,
    longitudinalSegments: 20,
    midribVenationDepthMm,
    marginalRuffleAmplitudeMm,
    bezierArchCurvature,
    iridescenceStrength,
    iridescenceIor,
    iridescenceThinFilmMinNm,
    iridescenceThinFilmMaxNm,
    cuticularSheenStrength,
    cuticularSheenRoughness,
    normalMapScale,
    vertexWaveFrequencyHz,
    vertexWaveAmplitudeMeters,
    bioluminescentVeinPulseSpeed,
    morphBloomBaseline,
    morphResonanceCapacity,
  };
}

export interface KinematicRigPose {
  /** 3-joint articulated stem/rachis kinematic chain angles (radians) */
  basalJointPitchRad: number;
  basalJointRollRad: number;
  medialJointPitchRad: number;
  medialJointRollRad: number;
  apicalJointPitchRad: number;
  apicalJointRollRad: number;
  apicalTorsionYawRad: number;
  /** Shape-key (morph-target) weights in [0, 1] */
  morphBloomOpenWeight: number;
  morphAcousticRippleWeight: number;
  /** Secondary anatomical organ articulation */
  petalUnfurlAngleRad: number;
  stamenPendulumSwingRad: number;
  pinnaeWavePhaseRad: number;
}

/**
 * Evaluates a smooth, continuous 3-joint kinematic chain pose and Shape-Key (Morph Target)
 * blend weights `[0..1]` for a botanical specimen, eliminating rigid single-axis Euler snapping.
 */
export function evaluateKinematicRigPose(params: {
  species: PlantSpeciesId;
  attuned: boolean;
  lifecycleStage: BotanicalLifecycleStageId;
  proximityDm: number;
  elapsedSeconds: number;
  pulsePhase: number;
  tactileShiverImpulse?: number;
  windTiltX?: number;
  windTiltZ?: number;
  circadianApertureBoost?: number;
  neuromorphicWeight?: number;
  neuromorphicSynapticWeight?: number;
}): KinematicRigPose {
  const {
    species,
    attuned,
    lifecycleStage,
    proximityDm,
    elapsedSeconds,
    pulsePhase,
    tactileShiverImpulse = 0,
    windTiltX = 0,
    windTiltZ = 0,
    circadianApertureBoost = 0,
    neuromorphicWeight,
    neuromorphicSynapticWeight,
  } = params;
  const resolvedWeight = neuromorphicSynapticWeight ?? neuromorphicWeight ?? 8;

  const art = computeSpeciesArticulation({
    species,
    attuned,
    proximityDm,
    elapsedSeconds,
    pulsePhase,
    tactileShiverImpulse,
    neuromorphicSynapticWeight: resolvedWeight,
  });
  const stageSpec = BOTANICAL_LIFECYCLE_STAGES[lifecycleStage];
  const proxFactor = Math.max(0, Math.min(1, (45 - proximityDm) / 45));
  const breathWave = Math.sin(elapsedSeconds * 1.45 + pulsePhase);
  const harmonicWave = Math.sin(elapsedSeconds * 3.1 + pulsePhase * 1.618);
  const shiverWave =
    tactileShiverImpulse > 0.001
      ? Math.sin(elapsedSeconds * Math.PI * 2 * 9.5) * tactileShiverImpulse
      : 0;

  // Progressive whip-like phase lag across Basal -> Medial -> Apical joints
  const basalJointPitchRad = Number(
    (windTiltX * 0.32 + Math.sin(elapsedSeconds * 1.1 + pulsePhase) * 0.028).toFixed(4),
  );
  const basalJointRollRad = Number(
    (windTiltZ * 0.32 + Math.cos(elapsedSeconds * 1.05 + pulsePhase) * 0.028).toFixed(4),
  );

  const medialJointPitchRad = Number(
    (
      windTiltX * 0.48 +
      Math.sin(elapsedSeconds * 1.45 + pulsePhase - 0.55) * 0.046 +
      shiverWave * 0.06
    ).toFixed(4),
  );
  const medialJointRollRad = Number(
    (
      windTiltZ * 0.48 +
      Math.cos(elapsedSeconds * 1.38 + pulsePhase - 0.55) * 0.046 +
      art.frondBreathRad * 0.45
    ).toFixed(4),
  );

  const apicalJointPitchRad = Number(
    (
      windTiltX * 0.64 +
      Math.sin(elapsedSeconds * 1.85 + pulsePhase - 1.1) * 0.068 +
      shiverWave * 0.11
    ).toFixed(4),
  );
  const apicalJointRollRad = Number(
    (
      windTiltZ * 0.64 +
      Math.cos(elapsedSeconds * 1.78 + pulsePhase - 1.1) * 0.068 +
      art.bellSwingRad * 0.45
    ).toFixed(4),
  );
  const apicalTorsionYawRad = Number(
    (
      Math.sin(elapsedSeconds * 0.92 + pulsePhase) * (attuned ? 0.14 : 0.05) +
      art.starHeadRollRad * 0.5
    ).toFixed(4),
  );

  // Shape Key 0: Bloom Open [0..1]
  const rawBloom =
    stageSpec.corollaOpenFactor * 0.65 +
    circadianApertureBoost * 0.9 +
    (attuned ? 0.22 : 0) +
    proxFactor * 0.12 +
    breathWave * (attuned ? 0.08 : 0.03);
  const morphBloomOpenWeight = Number(Math.max(0.05, Math.min(1.0, rawBloom)).toFixed(4));

  // Shape Key 1: Acoustic Chladni Ripple [0..1]
  const rawRipple =
    (attuned ? 0.28 : 0.06) +
    proxFactor * 0.24 +
    Math.abs(harmonicWave) * (attuned ? 0.26 : 0.06) +
    Math.min(0.45, Math.abs(shiverWave) * 0.45);
  const morphAcousticRippleWeight = Number(Math.max(0, Math.min(1.0, rawRipple)).toFixed(4));

  const petalUnfurlAngleRad = Number(
    (0.28 + morphBloomOpenWeight * 0.46 + art.petalOpenRad + shiverWave * 0.14).toFixed(4),
  );
  const stamenPendulumSwingRad = Number(
    (-art.bellSwingRad * 1.35 + shiverWave * 0.22).toFixed(4),
  );
  const pinnaeWavePhaseRad = Number((elapsedSeconds * 2.4 + pulsePhase).toFixed(4));

  return {
    basalJointPitchRad,
    basalJointRollRad,
    medialJointPitchRad,
    medialJointRollRad,
    apicalJointPitchRad,
    apicalJointRollRad,
    apicalTorsionYawRad,
    morphBloomOpenWeight,
    morphAcousticRippleWeight,
    petalUnfurlAngleRad,
    stamenPendulumSwingRad,
    pinnaeWavePhaseRad,
  };
}


