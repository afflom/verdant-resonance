/**
 * Comprehensive Botanical Soundscape, Diurnal Sky, Ecological Affinity & Synthesis Models
 * Formally modeled and verified via `prism/spec.json` (`prism/src/VerdantResonance.lex.tex`).
 */

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

export const VERDANT_RESONANCE_SPEC: PrismSpec = {
  schema: SPEC_SCHEMA,
  name: 'verdant-resonance',
  title: 'Verdant Resonance',
  purpose:
    'Decides the botanical soundscape, diurnal harmony, and flora resonance response as a player explores a peaceful procedural garden without violence or conflict.',
  fields: [
    { name: 'biome', kind: 'choice', values: ['meadow', 'grove', 'crystal', 'wetland', 'sanctuary'] },
    {
      name: 'plant',
      kind: 'choice',
      values: ['chime-lily', 'pulse-fern', 'echo-lotus', 'drone-moss', 'star-orchid'],
    },
    { name: 'action', kind: 'choice', values: ['observe', 'touch', 'attune', 'stroll', 'stillness'] },
    { name: 'atmosphere', kind: 'choice', values: ['dawn', 'golden', 'twilight', 'starlight'] },
    { name: 'chorus', kind: 'choice', values: ['dormant', 'awakened'] },
    { name: 'proximity', kind: 'number', min: 0, max: 100 },
    { name: 'velocity', kind: 'number', min: 0, max: 30 },
  ],
  outcomes: [
    'sanctuary-chorus',
    'serene-rest',
    'nocturnal-symphony',
    'dawn-arpeggio',
    'harmonic-bloom',
    'crystalline-choir',
    'melodic-chime',
    'rhythmic-pulse',
    'ambient-drone',
    'wind-whisper',
  ],
  rules: [
    {
      id: 'REQ-001',
      when: [
        { field: 'action', op: 'is', value: 'stillness' },
        { field: 'velocity', op: '=', value: 0 },
        { field: 'biome', op: 'is', value: 'sanctuary' },
        { field: 'proximity', op: '<=', value: 45 },
      ],
      then: 'serene-rest',
      says: 'Resting in meditative stillness within the Resonance Sanctuary awakens the sustained pastoral ninth chord.',
    },
    {
      id: 'REQ-002',
      when: [
        { field: 'biome', op: 'is', value: 'sanctuary' },
        { field: 'chorus', op: 'is', value: 'awakened' },
        { field: 'action', op: 'is', value: 'attune' },
        { field: 'proximity', op: '<=', value: 20 },
        { field: 'velocity', op: '<=', value: 10 },
      ],
      then: 'sanctuary-chorus',
      says: 'Attuning to an awakened blossom inside the Resonance Sanctuary unleashes the full multi-octave Sanctuary Chorus.',
    },
    {
      id: 'REQ-003',
      when: [
        { field: 'chorus', op: 'is', value: 'awakened' },
        { field: 'plant', op: 'is', value: 'star-orchid' },
        { field: 'atmosphere', op: 'is', value: 'starlight' },
        { field: 'action', op: 'is', value: 'observe' },
        { field: 'proximity', op: '<=', value: 20 },
        { field: 'velocity', op: '<=', value: 10 },
      ],
      then: 'sanctuary-chorus',
      says: 'Observing an awakened Star Orchid beneath the Starlight Sanctuary sky radiates a full celestial Sanctuary Chorus.',
    },
    {
      id: 'REQ-004',
      when: [
        { field: 'chorus', op: 'is', value: 'awakened' },
        { field: 'biome', op: 'is', value: 'wetland' },
        { field: 'plant', op: 'is', value: 'echo-lotus' },
        { field: 'action', op: 'is', value: 'attune' },
        { field: 'proximity', op: '<=', value: 20 },
        { field: 'velocity', op: '<=', value: 10 },
      ],
      then: 'sanctuary-chorus',
      says: 'Attuning to an awakened Echo Lotus in the Bioluminescent Wetland awakens the lagoon Sanctuary Chorus.',
    },
    {
      id: 'REQ-005',
      when: [
        { field: 'action', op: 'is', value: 'attune' },
        { field: 'proximity', op: '<=', value: 20 },
        { field: 'velocity', op: '<=', value: 10 },
      ],
      then: 'harmonic-bloom',
      says: 'Attuning closely to any blossom at a calm pace triggers a full bioluminescent Harmonic Bloom.',
    },
    {
      id: 'REQ-006',
      when: [
        { field: 'chorus', op: 'is', value: 'awakened' },
        { field: 'biome', op: 'is', value: 'meadow' },
        { field: 'plant', op: 'is', value: 'chime-lily' },
        { field: 'action', op: 'is', value: 'touch' },
        { field: 'proximity', op: '<=', value: 20 },
        { field: 'velocity', op: '<=', value: 10 },
      ],
      then: 'harmonic-bloom',
      says: 'Touching an awakened Chime Lily in the Sunlit Meadow cascades into a golden Harmonic Bloom.',
    },
    {
      id: 'REQ-007',
      when: [
        { field: 'atmosphere', op: 'is', value: 'starlight' },
        { field: 'action', op: 'is', value: 'stillness' },
        { field: 'velocity', op: '=', value: 0 },
        { field: 'proximity', op: '<=', value: 30 },
      ],
      then: 'nocturnal-symphony',
      says: 'Pausing in stillness beneath the Starlight canopy reveals a deep nocturnal overtone symphony.',
    },
    {
      id: 'REQ-008',
      when: [
        { field: 'atmosphere', op: 'is', value: 'twilight' },
        { field: 'plant', op: 'is', value: 'echo-lotus' },
        { field: 'proximity', op: '<=', value: 20 },
        { field: 'velocity', op: '<=', value: 10 },
      ],
      then: 'nocturnal-symphony',
      says: 'Approaching an Echo Lotus during Twilight Glow weaves a liquid nocturnal symphony across the lagoon.',
    },
    {
      id: 'REQ-009',
      when: [
        { field: 'atmosphere', op: 'is', value: 'starlight' },
        { field: 'plant', op: 'is', value: 'drone-moss' },
        { field: 'proximity', op: '<=', value: 20 },
        { field: 'velocity', op: '<=', value: 10 },
      ],
      then: 'nocturnal-symphony',
      says: 'Lingering by Drone Moss under Starlight awakens a resonant sub-bass nocturnal symphony.',
    },
    {
      id: 'REQ-010',
      when: [
        { field: 'atmosphere', op: 'is', value: 'dawn' },
        { field: 'plant', op: 'is', value: 'chime-lily' },
        { field: 'proximity', op: '<=', value: 20 },
        { field: 'velocity', op: '<=', value: 10 },
      ],
      then: 'dawn-arpeggio',
      says: 'Morning mist around a Chime Lily at Dawn awakens sparkling dewdrop glass-marimba arpeggios.',
    },
    {
      id: 'REQ-011',
      when: [
        { field: 'atmosphere', op: 'is', value: 'golden' },
        { field: 'biome', op: 'is', value: 'meadow' },
        { field: 'action', op: 'is', value: 'touch' },
        { field: 'proximity', op: '<=', value: 20 },
      ],
      then: 'dawn-arpeggio',
      says: 'Touching Sunlit Meadow flora during Golden Hour releases warm sunlit marimba arpeggios.',
    },
    {
      id: 'REQ-012',
      when: [
        { field: 'atmosphere', op: 'is', value: 'dawn' },
        { field: 'biome', op: 'is', value: 'grove' },
        { field: 'plant', op: 'is', value: 'pulse-fern' },
        { field: 'proximity', op: '<=', value: 20 },
        { field: 'velocity', op: '<=', value: 10 },
      ],
      then: 'dawn-arpeggio',
      says: 'Observing a Pulse Fern in the Bamboo Chime Grove at Dawn sets dewdrop kalimba arpeggios in motion.',
    },
    {
      id: 'REQ-013',
      when: [
        { field: 'biome', op: 'is', value: 'crystal' },
        { field: 'action', op: 'is', value: 'touch' },
        { field: 'proximity', op: '<=', value: 20 },
      ],
      then: 'crystalline-choir',
      says: 'Touching flora within the Crystal Cavern Basin resonates with glass-harmonica choir overtones.',
    },
    {
      id: 'REQ-014',
      when: [
        { field: 'plant', op: 'is', value: 'star-orchid' },
        { field: 'biome', op: 'is', value: 'sanctuary' },
        { field: 'proximity', op: '<=', value: 20 },
        { field: 'velocity', op: '<=', value: 10 },
      ],
      then: 'crystalline-choir',
      says: 'Approaching a Star Orchid inside the Sanctuary releases shimmering celestial choir harmonics.',
    },
    {
      id: 'REQ-015',
      when: [
        { field: 'plant', op: 'is', value: 'chime-lily' },
        { field: 'proximity', op: '<=', value: 30 },
        { field: 'velocity', op: '<=', value: 20 },
      ],
      then: 'melodic-chime',
      says: 'Walking gently near a Chime Lily sets its pendant corollas ringing in pentatonic bell intervals.',
    },
    {
      id: 'REQ-016',
      when: [
        { field: 'plant', op: 'is', value: 'star-orchid' },
        { field: 'action', op: 'is', value: 'touch' },
        { field: 'proximity', op: '<=', value: 30 },
      ],
      then: 'melodic-chime',
      says: 'Gently touching a Star Orchid petal produces a clear, bell-like melodic chime.',
    },
    {
      id: 'REQ-017',
      when: [
        { field: 'plant', op: 'is', value: 'pulse-fern' },
        { field: 'proximity', op: '<=', value: 30 },
        { field: 'velocity', op: '>=', value: 10 },
        { field: 'velocity', op: '<=', value: 20 },
      ],
      then: 'rhythmic-pulse',
      says: 'Moving at a steady stride past a Pulse Fern weaves a warm polyrhythmic kalimba ripple.',
    },
    {
      id: 'REQ-018',
      when: [
        { field: 'plant', op: 'is', value: 'echo-lotus' },
        { field: 'biome', op: 'is', value: 'wetland' },
        { field: 'proximity', op: '<=', value: 30 },
      ],
      then: 'rhythmic-pulse',
      says: 'Gathering near an Echo Lotus in the Bioluminescent Wetland sends rhythmic water-harp ripples across the lagoon.',
    },
    {
      id: 'REQ-019',
      when: [
        { field: 'plant', op: 'is', value: 'drone-moss' },
        { field: 'proximity', op: '<=', value: 30 },
        { field: 'velocity', op: '<=', value: 10 },
      ],
      then: 'ambient-drone',
      says: 'Lingering near terraced Drone Moss cushions deepens the foundational harmonic fifth drone.',
    },
    {
      id: 'REQ-020',
      when: [
        { field: 'velocity', op: '<=', value: 10 },
        { field: 'proximity', op: '<=', value: 45 },
      ],
      then: 'ambient-drone',
      says: 'A slow, unhurried walk through the garden sustains a warm botanical pad foundation.',
    },
  ],
  otherwise: 'wind-whisper',
  properties: [
    {
      id: 'INV-001',
      kind: 'always',
      when: [
        { field: 'action', op: 'is', value: 'stillness' },
        { field: 'velocity', op: '=', value: 0 },
        { field: 'biome', op: 'is', value: 'sanctuary' },
        { field: 'proximity', op: '<=', value: 45 },
      ],
      then: 'serene-rest',
      says: 'Stillness at rest within the Sanctuary always awakens Serene Rest.',
      theoremName: 'PrismVerdantResonanceProofs.inv001Holds',
    },
    {
      id: 'INV-002',
      kind: 'always',
      when: [
        { field: 'biome', op: 'is', value: 'sanctuary' },
        { field: 'chorus', op: 'is', value: 'awakened' },
        { field: 'action', op: 'is', value: 'attune' },
        { field: 'proximity', op: '<=', value: 20 },
        { field: 'velocity', op: '<=', value: 10 },
      ],
      then: 'sanctuary-chorus',
      says: 'Attuning an awakened blossom in the Sanctuary always unleashes the Sanctuary Chorus.',
      theoremName: 'PrismVerdantResonanceProofs.inv002Holds',
    },
    {
      id: 'INV-003',
      kind: 'always',
      when: [
        { field: 'chorus', op: 'is', value: 'awakened' },
        { field: 'biome', op: 'is', value: 'wetland' },
        { field: 'plant', op: 'is', value: 'echo-lotus' },
        { field: 'action', op: 'is', value: 'attune' },
        { field: 'proximity', op: '<=', value: 20 },
        { field: 'velocity', op: '<=', value: 10 },
      ],
      then: 'sanctuary-chorus',
      says: 'Attuning an awakened Echo Lotus in the Wetland always unleashes the Sanctuary Chorus.',
      theoremName: 'PrismVerdantResonanceProofs.inv003Holds',
    },
    {
      id: 'INV-004',
      kind: 'never',
      when: [{ field: 'proximity', op: '>', value: 45 }],
      then: 'sanctuary-chorus',
      says: 'Sanctuary Chorus never triggers when distant from garden flora.',
      theoremName: 'PrismVerdantResonanceProofs.inv004Holds',
    },
    {
      id: 'INV-005',
      kind: 'never',
      when: [{ field: 'proximity', op: '>', value: 45 }],
      then: 'harmonic-bloom',
      says: 'Harmonic Bloom never triggers when far from flora.',
      theoremName: 'PrismVerdantResonanceProofs.inv005Holds',
    },
    {
      id: 'INV-006',
      kind: 'never',
      when: [{ field: 'proximity', op: '>', value: 45 }],
      then: 'nocturnal-symphony',
      says: 'Nocturnal Symphony never triggers when far from blossoms.',
      theoremName: 'PrismVerdantResonanceProofs.inv006Holds',
    },
    {
      id: 'INV-007',
      kind: 'never',
      when: [{ field: 'proximity', op: '>', value: 45 }],
      then: 'crystalline-choir',
      says: 'Crystalline Choir never triggers when far from blossoms.',
      theoremName: 'PrismVerdantResonanceProofs.inv007Holds',
    },
    {
      id: 'INV-008',
      kind: 'always',
      when: [{ field: 'proximity', op: '>', value: 45 }],
      then: 'wind-whisper',
      says: 'Exploring open clearings far from flora always yields Wind Whisper.',
      theoremName: 'PrismVerdantResonanceProofs.inv008Holds',
    },
  ],
  examples: [
    { request: 'sanctuary star-orchid stillness dawn dormant 10 0', response: 'serene-rest' },
    { request: 'sanctuary star-orchid attune golden awakened 10 4', response: 'sanctuary-chorus' },
    { request: 'meadow star-orchid observe starlight awakened 12 4', response: 'sanctuary-chorus' },
    { request: 'wetland echo-lotus attune twilight awakened 12 4', response: 'sanctuary-chorus' },
    { request: 'meadow chime-lily attune dawn dormant 10 4', response: 'harmonic-bloom' },
    { request: 'meadow chime-lily touch dawn awakened 12 4', response: 'harmonic-bloom' },
    { request: 'meadow star-orchid stillness starlight dormant 15 0', response: 'nocturnal-symphony' },
    { request: 'wetland echo-lotus observe twilight dormant 15 5', response: 'nocturnal-symphony' },
    { request: 'meadow drone-moss observe starlight dormant 15 5', response: 'nocturnal-symphony' },
    { request: 'meadow chime-lily observe dawn dormant 15 5', response: 'dawn-arpeggio' },
    { request: 'meadow pulse-fern touch golden dormant 15 15', response: 'dawn-arpeggio' },
    { request: 'grove pulse-fern observe dawn dormant 15 5', response: 'dawn-arpeggio' },
    { request: 'crystal star-orchid touch golden dormant 15 15', response: 'crystalline-choir' },
    { request: 'sanctuary star-orchid observe golden dormant 15 5', response: 'crystalline-choir' },
    { request: 'grove chime-lily observe golden dormant 25 15', response: 'melodic-chime' },
    { request: 'grove star-orchid touch golden dormant 25 15', response: 'melodic-chime' },
    { request: 'grove pulse-fern stroll golden dormant 25 15', response: 'rhythmic-pulse' },
    { request: 'wetland echo-lotus stroll golden dormant 25 15', response: 'rhythmic-pulse' },
    { request: 'meadow drone-moss stroll golden dormant 25 5', response: 'ambient-drone' },
    { request: 'meadow pulse-fern stroll golden dormant 40 5', response: 'ambient-drone' },
    { request: 'meadow chime-lily stroll golden dormant 70 20', response: 'wind-whisper' },
  ],
};

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

export function judgePrismRequest(
  req: Record<string, string | bigint>,
  spec: PrismSpec = VERDANT_RESONANCE_SPEC,
): { outcome: SoundscapeOutcome; rule: string | null; ruleDescription: string } {
  for (const r of spec.rules) {
    if (r.when.every((c) => conditionHolds(c, req))) {
      return { outcome: r.then, rule: r.id, ruleDescription: r.says };
    }
  }
  return {
    outcome: spec.otherwise,
    rule: null,
    ruleDescription: 'Open breeze sweeping gently across the garden canopy.',
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
  const proxSamples = [0, 10, 19, 20, 21, 29, 30, 31, 44, 45, 46, 75, 100];
  const velSamples = [0, 1, 9, 10, 11, 19, 20, 21, 30];

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

export interface DiurnalEnvironmentEvaluation {
  atmosphere: AtmosphereId;
  biome: BiomeId;
  effectiveFogDensity: number;
  effectiveSunIntensity: number;
  effectiveHemiIntensity: number;
  floraEmissiveMultiplier: number;
  starOpacity: number;
  padFilterCutoffHz: number;
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
// Subsystem 4: Acoustic Outcomes & Synthesis Voice-Leading Model
// ---------------------------------------------------------------------------

export interface SoundOutcomeProfile {
  id: SoundscapeOutcome;
  label: string;
  timbre: string;
  color: string;
  harmonyGain: number;
  waveform: OscillatorType;
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
  waveform: OscillatorType;
  noteDurationSec: number;
  arpeggioStepSec: number;
  filterCutoffHz: number;
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

  return {
    outcome,
    biome,
    atmosphere,
    frequenciesHz,
    waveform: profile.waveform,
    noteDurationSec: profile.noteDurationSec,
    arpeggioStepSec: profile.arpeggioStepSec,
    filterCutoffHz: atmosCfg.padFilterHz,
  };
}

// ---------------------------------------------------------------------------
// Subsystem 5: Procedural Garden World & Spatial Flora Placement
// ---------------------------------------------------------------------------

export interface GardenPlantInstance {
  id: string;
  species: PlantSpeciesId;
  biome: BiomeId;
  x: number;
  y: number;
  z: number;
  scale: number;
  rotationY: number;
  pitchMultiplier: number;
  attuned: boolean;
}

export function groundHeightAt(x: number, z: number): number {
  const distFromCenter = Math.hypot(x, z);
  const pathMask = Math.min(1, Math.max(0, (Math.abs(x) - 3.5) / 8));
  const gentleRoll =
    (Math.sin(x * 0.06) * Math.cos(z * 0.06) * 1.1 +
      Math.sin((x + z) * 0.035) * 0.65) *
    pathMask;
  const wetlandDist = Math.hypot(x - -28, z - 30);
  const wetlandDip = wetlandDist < 18 ? -0.45 * Math.cos((wetlandDist / 18) * (Math.PI * 0.5)) : 0;
  const rimRise = distFromCenter > 52 ? Math.pow((distFromCenter - 52) * 0.08, 1.35) : 0;
  return Number((gentleRoll + wetlandDip + rimRise).toFixed(4));
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

export function generateGardenPlants(seed = 42026): GardenPlantInstance[] {
  const rng = createSeededRng(seed);
  const plants: GardenPlantInstance[] = [];

  const heroPlacements: { species: PlantSpeciesId; biome: BiomeId; x: number; z: number }[] = [
    { species: 'chime-lily', biome: 'meadow', x: 2.2, z: -5.5 },
    { species: 'pulse-fern', biome: 'meadow', x: -2.6, z: -8.0 },
    { species: 'drone-moss', biome: 'meadow', x: 3.4, z: -13.0 },
    { species: 'star-orchid', biome: 'sanctuary', x: 2.6, z: -29.5 },
    { species: 'chime-lily', biome: 'sanctuary', x: -2.6, z: -29.5 },
    { species: 'star-orchid', biome: 'sanctuary', x: -1.8, z: -32.0 },
    { species: 'pulse-fern', biome: 'grove', x: -32.0, z: -21.0 },
    { species: 'chime-lily', biome: 'grove', x: -38.5, z: -26.0 },
    { species: 'star-orchid', biome: 'crystal', x: 33.0, z: -21.0 },
    { species: 'chime-lily', biome: 'crystal', x: 38.0, z: -26.5 },
    { species: 'echo-lotus', biome: 'wetland', x: -25.0, z: 27.0 },
    { species: 'echo-lotus', biome: 'wetland', x: -30.5, z: 32.0 },
  ];

  heroPlacements.forEach((p, idx) => {
    const y = groundHeightAt(p.x, p.z);
    plants.push({
      id: `plant-hero-${idx + 1}`,
      species: p.species,
      biome: p.biome,
      x: p.x,
      y,
      z: p.z,
      scale: 1.05 + (idx % 3) * 0.08,
      rotationY: (idx * 1.17) % (Math.PI * 2),
      pitchMultiplier: [1, 9 / 8, 5 / 4, 3 / 2, 5 / 3][idx % 5],
      attuned: false,
    });
  });

  const speciesByBiome: Record<BiomeId, PlantSpeciesId[]> = {
    meadow: ['chime-lily', 'drone-moss', 'pulse-fern'],
    grove: ['pulse-fern', 'chime-lily', 'drone-moss'],
    crystal: ['star-orchid', 'chime-lily', 'drone-moss'],
    wetland: ['echo-lotus', 'pulse-fern', 'drone-moss'],
    sanctuary: ['star-orchid', 'chime-lily', 'echo-lotus'],
  };

  const biomeList = Object.values(BIOME_CONFIGS);
  let counter = heroPlacements.length + 1;

  for (const b of biomeList) {
    const count = 9;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + rng() * 0.45;
      const radius = 5.5 + rng() * 14.0;
      const x = Number((b.center[0] + Math.cos(angle) * radius).toFixed(2));
      const z = Number((b.center[1] + Math.sin(angle) * radius).toFixed(2));

      if (Math.hypot(x, z) < 4.5) continue;
      if (Math.abs(x) < 1.6 && z > -28 && z < 2) continue;

      const y = groundHeightAt(x, z);
      const pool = speciesByBiome[b.id];
      const species = pool[Math.floor(rng() * pool.length)];
      const scale = Number((0.88 + rng() * 0.32).toFixed(2));
      const rotationY = Number((rng() * Math.PI * 2).toFixed(2));
      const pitchRatios = b.scaleRatios;
      const pitchMultiplier = pitchRatios[Math.floor(rng() * pitchRatios.length)];

      plants.push({
        id: `plant-${counter++}`,
        species,
        biome: b.id,
        x,
        y,
        z,
        scale,
        rotationY,
        pitchMultiplier,
        attuned: false,
      });
    }
  }

  return plants;
}

export function findNearestPlant(
  x: number,
  z: number,
  plants: GardenPlantInstance[],
): { plant: GardenPlantInstance; distanceMeters: number; proximityDm: number } {
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
  return { plant: nearest, distanceMeters: bestDist, proximityDm };
}

export interface PlantMorphologyState {
  swayAngleRad: number;
  scaleFactor: number;
  emissiveIntensity: number;
  haloOpacity: number;
}

export function computePlantMorphology(params: {
  baseScale: number;
  attuned: boolean;
  proximityDm: number;
  atmosphere: AtmosphereId;
  elapsedSeconds: number;
  pulsePhase: number;
}): PlantMorphologyState {
  const { baseScale, attuned, proximityDm, atmosphere, elapsedSeconds, pulsePhase } = params;
  const atmosCfg = ATMOSPHERE_CONFIGS[atmosphere];
  const proxBoost = proximityDm <= 30 ? (1 - proximityDm / 30) * 0.45 : 0;
  const swayAngleRad = Number((Math.sin(elapsedSeconds * 1.5 + pulsePhase) * 0.045).toFixed(4));
  const scaleFactor = Number(
    (
      baseScale *
      (1 + (attuned ? 0.055 : 0.02) * Math.sin(elapsedSeconds * 3.0 + pulsePhase) + proxBoost * 0.04)
    ).toFixed(4),
  );
  const emissiveIntensity = Number(
    ((attuned ? 1.15 : 0.38) * atmosCfg.emissiveBoost + proxBoost).toFixed(3),
  );
  const haloOpacity = Number(Math.min(0.9, (attuned ? 0.68 : 0.22) + proxBoost * 0.35).toFixed(3));

  return {
    swayAngleRad,
    scaleFactor,
    emissiveIntensity,
    haloOpacity,
  };
}

export const SANCTUARY_TRAIL_WAYPOINTS: { biome: BiomeId; x: number; z: number; label: string }[] = [
  { biome: 'meadow', x: 0, z: -6, label: 'Sunlit Meadow Terrace' },
  { biome: 'sanctuary', x: 0, z: -27, label: 'Resonance Sanctuary Obelisk' },
  { biome: 'grove', x: -32, z: -21, label: 'Bamboo Chime Grove' },
  { biome: 'wetland', x: -25, z: 26, label: 'Bioluminescent Wetland Lagoon' },
  { biome: 'crystal', x: 32, z: -21, label: 'Crystal Cavern Basin' },
];

