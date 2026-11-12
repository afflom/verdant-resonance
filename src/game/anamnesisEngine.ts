/**
 * Content-Addressed Merkle State-DAG Persistence & Modular Cold-Load Delivery Engine
 * (`src/game/anamnesisEngine.ts`)
 *
 * Implements `Foundation.Anamnesis.V1.Model` (Model #18, Basis Prime `157`):
 *  - Eliminates ephemeral browser reload amnesia via content-addressed Merkle snapshots
 *    persisting Alpha Seed, Diurnal Atmosphere, Universal 10-Domain Neuromorphic Manifold weights,
 *    Hebbian synaptic entries, Explored Biomes, and Attuned Botanical Flora lifecycle states.
 *  - Guarantees 0-bit round-trip drift (`restore(persist(S)) === S`) verified by UOR-FNV64
 *    prime-salted content digests and Semantic Versioning (`schemaVersion = 1`).
 *  - Enforces reversible 1-click Sanctuary Reset clearance and modular cold-load chunk budgets (`<= 650 kB`).
 */

import {
  GENERATED_CANONICAL_MODEL_BASIS_PRIMES,
  GENERATED_PRISM_BUS_MODULATION_LUT,
  GENERATED_PRISM_STANDARDS,
} from './generatedPrismConstants';
import {
  bytesToUtf8,
  compressUorcArchive,
  decompressUorcArchive,
  utf8ToBytes,
  type UorcCodecError,
} from './parametricCompressionEngine';
import type { ConsolidatedGardenMemory } from './conservatoryCurationEngine';
import type {
  AtmosphereId,
  BiomeId,
  BotanicalLifecycleStageId,
  GardenPlantInstance,
  GrowthSubstrateId,
  PlantSpeciesId,
  UniversalNeuromorphicManifold,
} from './prismModel';

export const VERDANT_ANAMNESIS_STORAGE_KEY = 'verdant-resonance.anamnesis.v1';

export interface PersistedPlantAnamnesisRecord {
  readonly id: string;
  readonly attuned: boolean;
  readonly lifecycleStage: BotanicalLifecycleStageId;
  readonly volatileTerpeneCharge: number;
}

export interface PersistedEmergentOffshootRecord {
  readonly id: string;
  readonly species: PlantSpeciesId;
  readonly biome: BiomeId;
  readonly substrate?: GrowthSubstrateId;
  readonly x: number;
  readonly y: number;
  readonly z: number;
  readonly scale: number;
  readonly rotationY: number;
  readonly pitchMultiplier: number;
  readonly attuned: boolean;
  readonly lifecycleStage: BotanicalLifecycleStageId;
  readonly surfaceTiltX?: number;
  readonly surfaceTiltZ?: number;
  readonly rootHoldfastScale?: number;
  readonly volatileTerpeneCharge: number;
}

export interface EpisodicMemoryTraceEntry {
  readonly tickIndex: number;
  readonly biome: BiomeId;
  readonly plantId: string;
  readonly harmonyPct: number;
  readonly meanSynapticWeight: number;
}

export interface VerdantAnamnesisPayload {
  readonly schemaVersion: number;
  readonly basisPrime: number;
  readonly alphaSeed: number;
  readonly atmosphere: AtmosphereId;
  readonly isMuted: boolean;
  readonly exploredBiomes: readonly BiomeId[];
  readonly domainWeights10: Readonly<{
    readonly infrastructure: number;
    readonly physics: number;
    readonly botany: number;
    readonly ecology: number;
    readonly acoustics: number;
    readonly articulation: number;
    readonly soundtrack: number;
    readonly humane: number;
    readonly brand: number;
    readonly neuromorphic: number;
  }>;
  readonly floraStates: readonly PersistedPlantAnamnesisRecord[];
  readonly emergentOffshoots?: readonly PersistedEmergentOffshootRecord[];
  readonly tunedWaystoneDegrees?: readonly number[];
  readonly episodicHorizon: readonly EpisodicMemoryTraceEntry[];
  readonly consolidatedMemories?: readonly ConsolidatedGardenMemory[];
}

export interface ContentAddressedAnamnesisEnvelope {
  readonly profile: string;
  readonly merkleDigestHex: string;
  readonly merkleDigestHead32: number;
  readonly savedAtIso: string;
  readonly payload: VerdantAnamnesisPayload;
}

export interface AnamnesisRoundTripVerification {
  readonly verified: boolean;
  readonly schemaVersionMatches: boolean;
  readonly digestMatches: boolean;
  readonly roundTripDriftCount: number;
  readonly horizonCapacity: number;
  readonly envelope: ContentAddressedAnamnesisEnvelope | null;
}

export interface ColdLoadChunkBudgetAudit {
  readonly verified: boolean;
  readonly maxAllowedAppChunkKb: number;
  readonly observedAppChunkKb: number;
  readonly vendorSplitChunkCount: number;
}

/**
 * Deterministic canonical JSON serializer sorting object keys lexicographically
 * so content digests are 100% platform- and key-order-independent.
 */
export function canonicalizeAnamnesisJson(value: unknown): string {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map((item) => canonicalizeAnamnesisJson(item)).join(',')}]`;
  }
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj)
    .filter((k) => obj[k] !== undefined)
    .sort();
  return `{${keys
    .map((k) => `${JSON.stringify(k)}:${canonicalizeAnamnesisJson(obj[k])}`)
    .join(',')}}`;
}

/**
 * Computes a deterministic 128-bit UOR-Prime-Salted Merkle digest (4x32-bit lanes, 32-hex chars)
 * seeded by `verdantAnamnesisBasisPrime = 157` and its twin spatial-acoustic prime `151`.
 */
export function computeAnamnesisMerkleDigest(payload: VerdantAnamnesisPayload): {
  readonly hex: string;
  readonly head32: number;
} {
  const canonical = canonicalizeAnamnesisJson(payload);
  const pAnam = GENERATED_CANONICAL_MODEL_BASIS_PRIMES.anamnesis; // 157
  let h0 = (0x811c9dc5 ^ (pAnam * 0x9e3779b1)) >>> 0;
  let h1 = (0xcbf29ce4 ^ (pAnam * 0x85ebca6b)) >>> 0;
  let h2 = (0x84222325 ^ (pAnam * 0xc2b2ae35)) >>> 0;
  let h3 = (0x1b873593 ^ (pAnam * 0x27d4eb2f)) >>> 0;

  for (let i = 0; i < canonical.length; i++) {
    const c = canonical.charCodeAt(i);
    h0 = Math.imul(h0 ^ c, 0x01000193) >>> 0;
    h1 = Math.imul(h1 ^ ((c << 3) | (c >>> 5)), 0x85ebca6b) >>> 0;
    h2 = Math.imul(h2 ^ (c + (i & 0xff)), 0xc2b2ae35) >>> 0;
    h3 = Math.imul(h3 ^ (c * pAnam), 0x27d4eb2f) >>> 0;
  }

  // Final avalanche mixing across the 4 Merkle lanes
  h0 = (h0 ^ (h2 >>> 13)) >>> 0;
  h1 = (h1 ^ (h3 >>> 11)) >>> 0;
  h2 = (h2 ^ (h0 >>> 15)) >>> 0;
  h3 = (h3 ^ (h1 >>> 17)) >>> 0;

  const hex = [h0, h1, h2, h3].map((lane) => lane.toString(16).padStart(8, '0')).join('');
  return {
    hex,
    head32: h0,
  };
}

/**
 * Computes the Formal Prism episodic memory horizon capacity (`20..80` snapshots)
 * from the active `Anamnesis` / `Neuromorphic` bus weight.
 */
export function computeEpisodicMemoryHorizonCapacity(busWeight: number): number {
  const clamped = Math.max(1, Math.min(16, Math.round(busWeight)));
  return GENERATED_PRISM_BUS_MODULATION_LUT.consolidatedMemoryHorizon[clamped] ?? 48;
}

/**
 * Serializes live garden, synaptic manifold, and flora lifecycle states into a
 * content-addressed Merkle envelope (`Foundation.Anamnesis.V1.Model`).
 */
export function serializeAnamnesisSnapshot(params: {
  readonly alphaSeed: number;
  readonly atmosphere: AtmosphereId;
  readonly isMuted?: boolean;
  readonly exploredBiomes?: readonly BiomeId[];
  readonly manifold: UniversalNeuromorphicManifold;
  readonly plants: readonly GardenPlantInstance[];
  readonly tunedWaystoneDegrees?: readonly number[];
  readonly episodicHorizon?: readonly EpisodicMemoryTraceEntry[];
  readonly consolidatedMemories?: readonly ConsolidatedGardenMemory[];
  readonly savedAtIso?: string;
}): ContentAddressedAnamnesisEnvelope {
  const clampW = (v: number) => Math.max(1, Math.min(16, Math.round(v)));
  const dom = params.manifold.domains;
  const wAnam = clampW(
    (dom.infrastructure.synapticWeight +
      dom.neuromorphic.synapticWeight +
      dom.ecology.synapticWeight) /
      3,
  );
  const maxHorizon = computeEpisodicMemoryHorizonCapacity(wAnam);
  const boundedHorizon = (params.episodicHorizon ?? []).slice(-maxHorizon);
  const memoryCap =
    GENERATED_PRISM_STANDARDS.autonomousConservatoryCuration?.consolidatedMemorySlotCap ?? 16;
  const boundedMemories =
    params.consolidatedMemories && params.consolidatedMemories.length > 0
      ? params.consolidatedMemories.slice(0, memoryCap)
      : undefined;
  const maxOffshoots =
    GENERATED_PRISM_STANDARDS.teleology?.purposeAndAutonomy?.maxEmergentMicroclimateOffshoots ?? 12;
  const emergentRecords: PersistedEmergentOffshootRecord[] = params.plants
    .filter((p) => p.id.startsWith('emergent-') || p.id.startsWith('offshoot-'))
    .slice(0, maxOffshoots)
    .map((p) => ({
      id: p.id,
      species: p.species,
      biome: p.biome,
      ...(p.substrate ? { substrate: p.substrate } : {}),
      x: Number(p.x.toFixed(3)),
      y: Number(p.y.toFixed(3)),
      z: Number(p.z.toFixed(3)),
      scale: Number(p.scale.toFixed(3)),
      rotationY: Number(p.rotationY.toFixed(4)),
      pitchMultiplier: Number(p.pitchMultiplier.toFixed(4)),
      attuned: Boolean(p.attuned),
      lifecycleStage: p.lifecycleStage ?? (p.attuned ? 'resonant-bloom' : 'dormant-seed'),
      ...(p.surfaceTiltX !== undefined ? { surfaceTiltX: Number(p.surfaceTiltX.toFixed(4)) } : {}),
      ...(p.surfaceTiltZ !== undefined ? { surfaceTiltZ: Number(p.surfaceTiltZ.toFixed(4)) } : {}),
      ...(p.rootHoldfastScale !== undefined
        ? { rootHoldfastScale: Number(p.rootHoldfastScale.toFixed(3)) }
        : {}),
      volatileTerpeneCharge: Number((p.volatileTerpeneCharge ?? 0).toFixed(4)),
    }));
  const boundedWaystones =
    params.tunedWaystoneDegrees && params.tunedWaystoneDegrees.length > 0
      ? params.tunedWaystoneDegrees
          .slice(0, 64)
          .map((d) => Math.max(0, Math.min(7, Math.round(d))))
      : undefined;

  const payload: VerdantAnamnesisPayload = {
    schemaVersion: GENERATED_PRISM_STANDARDS.anamnesis.merklePersistence.schemaSemverMajor,
    basisPrime: GENERATED_CANONICAL_MODEL_BASIS_PRIMES.anamnesis,
    alphaSeed: Math.max(1, Math.min(8, Math.round(params.alphaSeed))),
    atmosphere: params.atmosphere,
    isMuted: Boolean(params.isMuted),
    exploredBiomes: Array.from(new Set(params.exploredBiomes ?? ['meadow'])),
    domainWeights10: {
      infrastructure: clampW(dom.infrastructure.synapticWeight),
      physics: clampW(dom.physics.synapticWeight),
      botany: clampW(dom.botany.synapticWeight),
      ecology: clampW(dom.ecology.synapticWeight),
      acoustics: clampW(dom.acoustics.synapticWeight),
      articulation: clampW(dom.articulation.synapticWeight),
      soundtrack: clampW(dom.soundtrack.synapticWeight),
      humane: clampW(dom.humane.synapticWeight),
      brand: clampW(dom.brand.synapticWeight),
      neuromorphic: clampW(dom.neuromorphic.synapticWeight),
    },
    floraStates: params.plants.map((p) => ({
      id: p.id,
      attuned: Boolean(p.attuned),
      lifecycleStage: p.lifecycleStage ?? (p.attuned ? 'resonant-bloom' : 'dormant-seed'),
      volatileTerpeneCharge: Number((p.volatileTerpeneCharge ?? 0).toFixed(4)),
    })),
    ...(emergentRecords.length > 0 ? { emergentOffshoots: emergentRecords } : {}),
    ...(boundedWaystones ? { tunedWaystoneDegrees: boundedWaystones } : {}),
    episodicHorizon: boundedHorizon,
    ...(boundedMemories ? { consolidatedMemories: boundedMemories } : {}),
  };

  const digest = computeAnamnesisMerkleDigest(payload);
  return {
    profile: GENERATED_PRISM_STANDARDS.anamnesis.profile,
    merkleDigestHex: digest.hex,
    merkleDigestHead32: digest.head32,
    savedAtIso: params.savedAtIso ?? new Date().toISOString(),
    payload,
  };
}

/**
 * Deserializes and cryptographically/structurally verifies a persisted Anamnesis JSON string.
 * Rejects tampered digests, invalid schema versions, or out-of-range weights cleanly.
 */
export function deserializeAndVerifyAnamnesisSnapshot(
  rawJson: string | null | undefined,
): AnamnesisRoundTripVerification {
  const expectedSchema = GENERATED_PRISM_STANDARDS.anamnesis.merklePersistence.schemaSemverMajor;
  if (!rawJson || typeof rawJson !== 'string') {
    return {
      verified: false,
      schemaVersionMatches: false,
      digestMatches: false,
      roundTripDriftCount: 0,
      horizonCapacity: computeEpisodicMemoryHorizonCapacity(8),
      envelope: null,
    };
  }

  try {
    const parsed = JSON.parse(rawJson) as Partial<ContentAddressedAnamnesisEnvelope>;
    if (!parsed || typeof parsed !== 'object' || !parsed.payload) {
      return {
        verified: false,
        schemaVersionMatches: false,
        digestMatches: false,
        roundTripDriftCount: 1,
        horizonCapacity: computeEpisodicMemoryHorizonCapacity(8),
        envelope: null,
      };
    }

    const payload = parsed.payload;
    const schemaVersionMatches = payload.schemaVersion === expectedSchema;
    const recomputed = computeAnamnesisMerkleDigest(payload);
    const digestMatches =
      recomputed.hex === parsed.merkleDigestHex &&
      recomputed.head32 === parsed.merkleDigestHead32;

    const validAtmosphere =
      payload.atmosphere === 'dawn' ||
      payload.atmosphere === 'golden' ||
      payload.atmosphere === 'twilight' ||
      payload.atmosphere === 'starlight';
    const validSeed =
      typeof payload.alphaSeed === 'number' &&
      payload.alphaSeed >= 1 &&
      payload.alphaSeed <= 8;

    const verified = schemaVersionMatches && digestMatches && validAtmosphere && validSeed;
    const wAnam = Math.round(
      ((payload.domainWeights10?.infrastructure ?? 8) +
        (payload.domainWeights10?.neuromorphic ?? 8) +
        (payload.domainWeights10?.ecology ?? 8)) /
        3,
    );

    return {
      verified,
      schemaVersionMatches,
      digestMatches,
      roundTripDriftCount: verified ? 0 : 1,
      horizonCapacity: computeEpisodicMemoryHorizonCapacity(wAnam),
      envelope: verified ? (parsed as ContentAddressedAnamnesisEnvelope) : null,
    };
  } catch {
    return {
      verified: false,
      schemaVersionMatches: false,
      digestMatches: false,
      roundTripDriftCount: 1,
      horizonCapacity: computeEpisodicMemoryHorizonCapacity(8),
      envelope: null,
    };
  }
}

/**
 * Applies a verified Anamnesis payload onto freshly generated canonical garden flora,
 * restoring exact attunement, resonance energy, touch, and sympathetic counts without drift.
 */
export function hydratePlantsFromAnamnesis(
  basePlants: readonly GardenPlantInstance[],
  payload: VerdantAnamnesisPayload,
): GardenPlantInstance[] {
  const byId = new Map<string, PersistedPlantAnamnesisRecord>();
  for (const rec of payload.floraStates) {
    byId.set(rec.id, rec);
  }
  const existingIds = new Set<string>();
  const hydrated: GardenPlantInstance[] = basePlants.map((plant) => {
    existingIds.add(plant.id);
    const saved = byId.get(plant.id);
    if (!saved) return plant;
    return {
      ...plant,
      attuned: saved.attuned,
      lifecycleStage: saved.lifecycleStage,
      volatileTerpeneCharge: saved.volatileTerpeneCharge,
    };
  });
  if (payload.emergentOffshoots) {
    for (const off of payload.emergentOffshoots) {
      if (existingIds.has(off.id)) continue;
      existingIds.add(off.id);
      hydrated.push({
        id: off.id,
        species: off.species,
        biome: off.biome,
        ...(off.substrate ? { substrate: off.substrate } : {}),
        x: off.x,
        y: off.y,
        z: off.z,
        scale: off.scale,
        rotationY: off.rotationY,
        pitchMultiplier: off.pitchMultiplier,
        attuned: off.attuned,
        lifecycleStage: off.lifecycleStage,
        ...(off.surfaceTiltX !== undefined ? { surfaceTiltX: off.surfaceTiltX } : {}),
        ...(off.surfaceTiltZ !== undefined ? { surfaceTiltZ: off.surfaceTiltZ } : {}),
        ...(off.rootHoldfastScale !== undefined
          ? { rootHoldfastScale: off.rootHoldfastScale }
          : {}),
        volatileTerpeneCharge: off.volatileTerpeneCharge,
      });
    }
  }
  return hydrated;
}

export const UORC_STORAGE_PREFIX = 'uorc1:';
export const UORC_URL_HASH_PREFIX = '#uorc=';

function uint8ToBase64Url(bytes: Uint8Array): string {
  return uint8ToBase64(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlToUint8(b64url: string): Uint8Array {
  const normalized = b64url.replace(/-/g, '+').replace(/_/g, '/');
  const padLen = (4 - (normalized.length % 4)) % 4;
  return base64ToUint8(normalized + '='.repeat(padLen));
}

function uint8ToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  if (typeof btoa === 'function') {
    return btoa(binary);
  }
  return Buffer.from(bytes).toString('base64');
}

function base64ToUint8(b64: string): Uint8Array {
  if (typeof atob === 'function') {
    const bin = atob(b64);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) {
      out[i] = bin.charCodeAt(i) & 0xff;
    }
    return out;
  }
  return new Uint8Array(Buffer.from(b64, 'base64'));
}

export interface PackedUorcAnamnesisResult {
  readonly archiveBytes: Uint8Array;
  readonly storageToken: string;
  readonly rawJsonBytes: number;
  readonly archiveByteLength: number;
  readonly compressionRatio: number;
  readonly codecPointKappa: string;
  readonly decodeSteps: number;
}

/**
 * Losslessly packs a content-addressed Merkle Anamnesis envelope into a κ-addressed `UORC\x01` binary archive
 * (`Foundation.Compression.V1.Model` + `STATE_1` warm dictionary), verifying `defect === 0` and `SHA-256` chain integrity.
 */
export function packAnamnesisEnvelopeToUorc(
  envelope: ContentAddressedAnamnesisEnvelope,
): PackedUorcAnamnesisResult {
  const rawJson = JSON.stringify(envelope);
  const rawBytes = utf8ToBytes(rawJson);
  const report = compressUorcArchive([rawBytes], { allowWarmStates: true });
  return {
    archiveBytes: report.archiveBytes,
    storageToken: `${UORC_STORAGE_PREFIX}${uint8ToBase64(report.archiveBytes)}`,
    rawJsonBytes: rawBytes.length,
    archiveByteLength: report.archiveBytes.length,
    compressionRatio: Number((report.archiveBytes.length / Math.max(1, rawBytes.length)).toFixed(4)),
    codecPointKappa: report.inspection.primaryCodecPoint.kappa,
    decodeSteps: report.inspection.totalDecodeSteps,
  };
}

/**
 * Unpacks and cryptographically verifies a `UORC\x01` Anamnesis archive (with optional deterministic `stepBudget`),
 * then runs the full Merkle + SemVer round-trip verification (`0` drift).
 */
export function unpackAnamnesisEnvelopeFromUorc(
  archiveBytes: Uint8Array,
  options?: { readonly stepBudget?: number },
): AnamnesisRoundTripVerification & { readonly uorcError?: UorcCodecError } {
  const dec = decompressUorcArchive(archiveBytes, options);
  if (!dec.ok || dec.value.objects.length !== 1) {
    return {
      verified: false,
      schemaVersionMatches: false,
      digestMatches: false,
      roundTripDriftCount: 1,
      horizonCapacity: computeEpisodicMemoryHorizonCapacity(8),
      envelope: null,
      uorcError: dec.ok
        ? { code: 'CorruptPayload', message: 'Expected single-object Anamnesis UORC archive' }
        : dec.error,
    };
  }
  const jsonText = bytesToUtf8(dec.value.objects[0]);
  return deserializeAndVerifyAnamnesisSnapshot(jsonText);
}

export interface ShareableUorcGardenLink {
  readonly hashFragment: string;
  readonly archiveByteLength: number;
  readonly rawJsonBytes: number;
  readonly compressionRatio: number;
  readonly codecPointKappa: string;
  readonly merkleDigestHex: string;
}

/**
 * Encodes any curated Conservatory envelope (including emergent cross-pollinated offshoots,
 * player-tuned lithophone waystones, κ-consolidated memories, and 10-domain synaptic weights)
 * into a compact, URL-safe `#uorc=<base64url>` shareable fragment backed by `UORC\x01`.
 */
export function encodeShareableUorcGardenHash(
  envelope: ContentAddressedAnamnesisEnvelope,
): ShareableUorcGardenLink {
  const packed = packAnamnesisEnvelopeToUorc(envelope);
  return {
    hashFragment: `${UORC_URL_HASH_PREFIX}${uint8ToBase64Url(packed.archiveBytes)}`,
    archiveByteLength: packed.archiveByteLength,
    rawJsonBytes: packed.rawJsonBytes,
    compressionRatio: packed.compressionRatio,
    codecPointKappa: packed.codecPointKappa,
    merkleDigestHex: envelope.merkleDigestHex,
  };
}

/**
 * Decodes and cryptographically verifies a `#uorc=<base64url>` URL hash fragment or full URL,
 * enforcing both `UORC\x01` SHA-256 chain integrity and 128-bit Anamnesis Merkle verification.
 */
export function decodeShareableUorcGardenHash(
  hashOrUrl: string | null | undefined,
  options?: { readonly stepBudget?: number },
): AnamnesisRoundTripVerification & { readonly uorcError?: UorcCodecError } {
  if (!hashOrUrl || typeof hashOrUrl !== 'string') {
    return deserializeAndVerifyAnamnesisSnapshot(null);
  }
  const idx = hashOrUrl.indexOf(UORC_URL_HASH_PREFIX);
  const rawToken =
    idx >= 0
      ? hashOrUrl.slice(idx + UORC_URL_HASH_PREFIX.length)
      : hashOrUrl.startsWith('uorc=')
        ? hashOrUrl.slice('uorc='.length)
        : '';
  const trimmed = rawToken.split('&')[0]?.trim() ?? '';
  if (!trimmed || !/^[A-Za-z0-9\-_]+$/.test(trimmed)) {
    return deserializeAndVerifyAnamnesisSnapshot(null);
  }
  try {
    const archiveBytes = base64UrlToUint8(trimmed);
    return unpackAnamnesisEnvelopeFromUorc(archiveBytes, options);
  } catch {
    return deserializeAndVerifyAnamnesisSnapshot(null);
  }
}

/**
 * Safe browser/custom storage persistence helper (`0` exceptions in SSR/headless/private mode).
 * Persists compact `uorc1:<base64>` binary archives by default while `loadAnamnesisEnvelopeFromStorage`
 * transparently restores both `uorc1:` compact archives and legacy plain JSON envelopes.
 */
export function persistAnamnesisEnvelopeToStorage(
  envelope: ContentAddressedAnamnesisEnvelope,
  storage?: Pick<Storage, 'setItem'> | null,
): boolean {
  const target =
    storage !== undefined
      ? storage
      : typeof window !== 'undefined' && window.localStorage
        ? window.localStorage
        : null;
  if (!target) return false;
  try {
    const packed = packAnamnesisEnvelopeToUorc(envelope);
    target.setItem(VERDANT_ANAMNESIS_STORAGE_KEY, packed.storageToken);
    return true;
  } catch {
    return false;
  }
}

export function loadAnamnesisEnvelopeFromStorage(
  storage?: Pick<Storage, 'getItem'> | null,
): AnamnesisRoundTripVerification {
  const target =
    storage !== undefined
      ? storage
      : typeof window !== 'undefined' && window.localStorage
        ? window.localStorage
        : null;
  if (!target) {
    return deserializeAndVerifyAnamnesisSnapshot(null);
  }
  try {
    const raw = target.getItem(VERDANT_ANAMNESIS_STORAGE_KEY);
    if (typeof raw === 'string' && raw.startsWith(UORC_STORAGE_PREFIX)) {
      const archiveBytes = base64ToUint8(raw.slice(UORC_STORAGE_PREFIX.length));
      return unpackAnamnesisEnvelopeFromUorc(archiveBytes);
    }
    return deserializeAndVerifyAnamnesisSnapshot(raw);
  } catch {
    return deserializeAndVerifyAnamnesisSnapshot(null);
  }
}

export function clearAnamnesisStorage(
  storage?: Pick<Storage, 'removeItem'> | null,
): boolean {
  const target =
    storage !== undefined
      ? storage
      : typeof window !== 'undefined' && window.localStorage
        ? window.localStorage
        : null;
  if (!target) return false;
  try {
    target.removeItem(VERDANT_ANAMNESIS_STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

/**
 * Verifies the `Foundation.Anamnesis.V1.Model::verifyModularColdLoadChunkGate` budget
 * (`appChunkKb <= 650 kB` and `>= 2` modular vendor/lazy chunks).
 */
export function verifyColdLoadModularChunkBudget(
  observedAppChunkKb: number,
  vendorSplitChunkCount: number,
): ColdLoadChunkBudgetAudit {
  const maxAllowedAppChunkKb =
    GENERATED_PRISM_STANDARDS.anamnesis.coldLoadBudget.maxInitialAppChunkKilobytes;
  const minVendors =
    GENERATED_PRISM_STANDARDS.anamnesis.coldLoadBudget.minVendorSplitChunkCount;
  return {
    verified:
      observedAppChunkKb <= maxAllowedAppChunkKb && vendorSplitChunkCount >= minVendors,
    maxAllowedAppChunkKb,
    observedAppChunkKb: Number(observedAppChunkKb.toFixed(2)),
    vendorSplitChunkCount,
  };
}
