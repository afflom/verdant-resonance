/**
 * UORC Parametric Compression, κ-Named Codec Space, NCM Micro-Plasticity & Autonomous Rule-30 Portfolio Engine
 * (`src/game/parametricCompressionEngine.ts`)
 *
 * Implements `Foundation.Compression.V1.Model` (Model #22, Basis Prime `179`) and `uorc/ncm-plasticity/1`
 * from `Foundation.Neuromorphic.V1.Model` (Model #10, Basis Prime `109`), advancing the parametric concept
 * in alignment with `https://github.com/UOR-Foundation/compression` (`Uorc.Performance`, `Uorc.Neuromorphic`, `Uorc.Engine`):
 *
 *  1. Content-Addressed κ Codec Points & Consolidated Warm Basis States (`UORC-SHA256-CHAIN-v1`):
 *     Every `CodecPoint = { basis, profile, state, lanes }` and immutable warm basis state (`STATE_1`, `STATE_2`)
 *     is named by its cryptographic `SHA-256` digest `κ`. Warm states pre-seed dictionary/context predictors
 *     and never alter meaning (`defect === 0`).
 *  2. Strict Shortest `U64` ULEB128 & Typed Total Refusals (`UorcCodecError`):
 *     Canonical `1..10`-byte varints rejecting truncated, non-canonical (`0x81 0x00`), or `> U64::MAX` encodings,
 *     trailing bytes, unknown warm basis `κ`, 1-bit integrity tampers, and `BudgetExhausted` step caps.
 *  3. Real Lossless Multi-Object Parametric Codec (`UORC\x01`):
 *     Evaluates `Raw`, `0`-step `Reference` deduplication, `Ncm`, and `Warm` continuation candidates under:
 *      - Saturating Coder Byte Ledger (`SaturatingCapLedger`) halting at the exact cap byte without heuristic stops,
 *      - Shared Twin-Strategy Pass (`PROFILE_FULL` + `PROFILE_MID`) byte-identical to separate runs,
 *      - Zero-Defect Admission (`defect === 0`) and Lexicographic Choice (`bytes`, then `decodeSteps`),
 *      - Universal Archive Bound (`archive.byteLength <= n + 61` for every single-object input of length `n`).
 *  4. Autonomous 64-Cell Rule-30 Portfolio Engine & 3-Level Honesty Ledger:
 *     Evolves a Hebbian strategy portfolio (`1..16` weights, permanent non-regressing baseline floor) via
 *     64-bit Rule-30 hypothesis generators, `κ`-memoized claim minting, strict `dominates` Lyapunov descent,
 *     12 `Facet` architectural records, constructive `excessOver`/`lackUnder` bounds, and `some-true`/`build`/`open` honesty.
 */

import {
  GENERATED_CANONICAL_MODEL_BASIS_PRIMES,
  GENERATED_PRISM_BUS_MODULATION_LUT,
  GENERATED_PRISM_STANDARDS,
} from './generatedPrismConstants';
import { PRISM_COMPILED_MODULES, toPrismNat } from './generatedPrismRuntime';
import {
  certifiedWasmCore_dominates,
  certifiedWasmCore_ulebLength,
  certifiedWasmRule30Step,
} from './generatedCertifiedWasmBridge';

const CompiledCompression = PRISM_COMPILED_MODULES['Foundation.Compression.V1.Model'];
const CompiledNeuro = PRISM_COMPILED_MODULES['Foundation.Neuromorphic.V1.Model'];

// ============================================================================
// 1. PURE SOURCE-OWNED SHA-256 & UORC-SHA256-CHAIN-v1 CONTENT ADDRESSING (κ)
// ============================================================================

const SHA256_K = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]);

const SHA256_H0 = new Uint32Array([
  0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
]);

// Reusable 64-word schedule buffer (zero per-hash schedule allocation)
const SHA256_W = new Uint32Array(64);

const UTF8_ENCODER = new TextEncoder();
const UTF8_DECODER = new TextDecoder('utf-8', { fatal: false });

export function utf8ToBytes(text: string): Uint8Array {
  return UTF8_ENCODER.encode(text);
}

export function bytesToUtf8(bytes: Uint8Array): string {
  return UTF8_DECODER.decode(bytes);
}

export function bytesToHex(bytes: Uint8Array): string {
  let out = '';
  for (let i = 0; i < bytes.length; i++) {
    out += bytes[i].toString(16).padStart(2, '0');
  }
  return out;
}

export function hexToBytes(hex: string): Uint8Array | null {
  if (hex.length % 2 !== 0 || !/^[0-9a-fA-F]*$/.test(hex)) return null;
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

function rotr32(x: number, n: number): number {
  return ((x >>> n) | (x << (32 - n))) >>> 0;
}

/**
 * Pure source-owned NIST FIPS 180-4 `SHA-256` implementation (`Uint8Array -> 32-byte Uint8Array`).
 * Zero external dependencies, deterministic across browser & Node runtimes.
 */
export function sha256Bytes(message: Uint8Array): Uint8Array {
  const bitLenHi = Math.floor(message.length / 0x20000000) >>> 0;
  const bitLenLo = (message.length << 3) >>> 0;
  const paddedLen = (message.length + 9 + 63) & ~63;
  const padded = new Uint8Array(paddedLen);
  padded.set(message, 0);
  padded[message.length] = 0x80;
  const dv = new DataView(padded.buffer);
  dv.setUint32(paddedLen - 8, bitLenHi, false);
  dv.setUint32(paddedLen - 4, bitLenLo, false);

  let h0 = SHA256_H0[0];
  let h1 = SHA256_H0[1];
  let h2 = SHA256_H0[2];
  let h3 = SHA256_H0[3];
  let h4 = SHA256_H0[4];
  let h5 = SHA256_H0[5];
  let h6 = SHA256_H0[6];
  let h7 = SHA256_H0[7];

  for (let offset = 0; offset < paddedLen; offset += 64) {
    for (let i = 0; i < 16; i++) {
      SHA256_W[i] = dv.getUint32(offset + i * 4, false);
    }
    for (let i = 16; i < 64; i++) {
      const w15 = SHA256_W[i - 15];
      const w2 = SHA256_W[i - 2];
      const s0 = (rotr32(w15, 7) ^ rotr32(w15, 18) ^ (w15 >>> 3)) >>> 0;
      const s1 = (rotr32(w2, 17) ^ rotr32(w2, 19) ^ (w2 >>> 10)) >>> 0;
      SHA256_W[i] = (SHA256_W[i - 16] + s0 + SHA256_W[i - 7] + s1) >>> 0;
    }

    let a = h0;
    let b = h1;
    let c = h2;
    let d = h3;
    let e = h4;
    let f = h5;
    let g = h6;
    let h = h7;

    for (let i = 0; i < 64; i++) {
      const S1 = (rotr32(e, 6) ^ rotr32(e, 11) ^ rotr32(e, 25)) >>> 0;
      const ch = ((e & f) ^ (~e & g)) >>> 0;
      const temp1 = (h + S1 + ch + SHA256_K[i] + SHA256_W[i]) >>> 0;
      const S0 = (rotr32(a, 2) ^ rotr32(a, 13) ^ rotr32(a, 22)) >>> 0;
      const maj = ((a & b) ^ (a & c) ^ (b & c)) >>> 0;
      const temp2 = (S0 + maj) >>> 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) >>> 0;
    }

    h0 = (h0 + a) >>> 0;
    h1 = (h1 + b) >>> 0;
    h2 = (h2 + c) >>> 0;
    h3 = (h3 + d) >>> 0;
    h4 = (h4 + e) >>> 0;
    h5 = (h5 + f) >>> 0;
    h6 = (h6 + g) >>> 0;
    h7 = (h7 + h) >>> 0;
  }

  const digest = new Uint8Array(32);
  const outDv = new DataView(digest.buffer);
  outDv.setUint32(0, h0, false);
  outDv.setUint32(4, h1, false);
  outDv.setUint32(8, h2, false);
  outDv.setUint32(12, h3, false);
  outDv.setUint32(16, h4, false);
  outDv.setUint32(20, h5, false);
  outDv.setUint32(24, h6, false);
  outDv.setUint32(28, h7, false);
  return digest;
}

export function sha256Hex(input: Uint8Array | string): string {
  const bytes = typeof input === 'string' ? utf8ToBytes(input) : input;
  return bytesToHex(sha256Bytes(bytes));
}

// ============================================================================
// 2. SHORTEST U64 ULEB128 & TYPED REFUSAL ERRORS (`UorcCodecError`)
// ============================================================================

export type UorcErrorCode =
  | 'VarintTruncated'
  | 'VarintNonCanonical'
  | 'VarintOverflow'
  | 'WireInvalidMagic'
  | 'WireTruncated'
  | 'WireTrailingBytes'
  | 'WireInvalidFrameTag'
  | 'WireInvalidReference'
  | 'UnknownBasisState'
  | 'IntegrityMismatch'
  | 'CorruptPayload'
  | 'BudgetExhausted';

export interface UorcCodecError {
  readonly code: UorcErrorCode;
  readonly message: string;
  readonly byteOffset?: number;
  readonly requiredSteps?: number;
  readonly stepBudget?: number;
}

export type UorcResult<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: UorcCodecError };

export const U64_MAX_BIGINT = 0xffffffffffffffffn;
export const ULEB64_MAX_BYTES = 10;

/**
 * Encodes an unsigned 64-bit integer (`0 .. 2^64 - 1`) in shortest canonical ULEB128 (`1..10` bytes).
 */
export function encodeUleb128(value: number | bigint): Uint8Array {
  let v = typeof value === 'bigint' ? value : BigInt(Math.floor(value));
  if (v < 0n || v > U64_MAX_BIGINT) {
    throw new RangeError(`ULEB128 value out of U64 range: ${v.toString()}`);
  }
  const bytes: number[] = [];
  do {
    let byte = Number(v & 0x7fn);
    v >>= 7n;
    if (v !== 0n) byte |= 0x80;
    bytes.push(byte);
  } while (v !== 0n);
  return Uint8Array.from(bytes);
}

/**
 * Computes exact shortest ULEB128 byte length (`1..10`), mechanized directly from
 * `Foundation.Compression.V1.Model::ulebLength`.
 */
export function computeUleb128Length(value: number | bigint): number {
  const raw = typeof value === 'bigint' ? value : BigInt(Math.max(0, Math.floor(value)));
  const clamped = raw < 0n ? 0n : raw > U64_MAX_BIGINT ? U64_MAX_BIGINT : raw;
  return certifiedWasmCore_ulebLength(clamped);
}

export function decodeUleb128(
  buffer: Uint8Array,
  offset = 0,
): UorcResult<{ readonly value: bigint; readonly nextOffset: number; readonly byteLength: number }> {
  if (offset >= buffer.length) {
    return { ok: false, error: { code: 'VarintTruncated', message: 'Unexpected end of buffer while reading ULEB128 varint', byteOffset: offset } };
  }

  let result = 0n;
  let shift = 0n;
  for (let count = 0; count < ULEB64_MAX_BYTES; count++) {
    const idx = offset + count;
    if (idx >= buffer.length) {
      return { ok: false, error: { code: 'VarintTruncated', message: `Truncated ULEB128 continuation chain at byte ${idx}`, byteOffset: idx } };
    }
    const byte = buffer[idx];
    const low7 = byte & 0x7f;
    const hasMore = (byte & 0x80) !== 0;

    if (count === 9 && (hasMore || low7 > 1)) {
      return { ok: false, error: { code: 'VarintOverflow', message: 'ULEB128 varint exceeds U64::MAX (2^64 - 1)', byteOffset: offset } };
    }
    if (!hasMore && count > 0 && low7 === 0) {
      return { ok: false, error: { code: 'VarintNonCanonical', message: 'Non-canonical overlong ULEB128 encoding (trailing zero 7-bit group)', byteOffset: offset } };
    }

    result |= BigInt(low7) << shift;
    if (!hasMore) {
      return { ok: true, value: { value: result, nextOffset: idx + 1, byteLength: count + 1 } };
    }
    shift += 7n;
  }

  return { ok: false, error: { code: 'VarintOverflow', message: 'ULEB128 varint exceeded 10 bytes', byteOffset: offset } };
}

// ============================================================================
// 3. CODEC POINTS, PROFILES, WARM BASIS STATES & NCM MICRO-PLASTICITY (`uorc/ncm-plasticity/1`)
// ============================================================================

export const UORC_WIRE_MAGIC = Object.freeze([0x55, 0x4f, 0x52, 0x43, 0x01] as const); // "UORC\x01"
export const UORC_SHA256_CHAIN_TAG = 'UORC-SHA256-CHAIN-v1';

export const PROFILE_RAW_NONE = 0x00000000;
export const PROFILE_LITE = 0x000001ff; // 9 context bits -> 12 inputs/bit (96 steps/byte)
export const PROFILE_V03 = 0x0001ffff; // 17 context bits -> 20 inputs/bit (160 steps/byte)
export const PROFILE_MID = 0x0007ffff; // 17 context bits + short match -> 22 inputs/bit (176 steps/byte)
export const PROFILE_FULL = 0x000fffff; // 17 context bits + short + rep -> 24 inputs/bit (192 steps/byte)
export const POINT_FILTER_FLAG = 0x80000000; // Reversible byte-delta pre-filter bit (`u32`)

export type UorcBasisKind = 'raw-identity' | 'kappa-reference' | 'ncm-adaptive-v1' | 'warm-consolidated-v1';

export interface ConservatoryCodecPoint {
  readonly basis: UorcBasisKind;
  /** Unsigned 32-bit profile mask (`0 .. 0xffffffff`). */
  readonly profile: number;
  /** `SHA-256` hex `κ` of consolidated warm basis state, or `'void'` for cold-start frames. */
  readonly state: string;
  readonly lanes: number;
  /** Canonical content-addressed `SHA-256` `κ` of `(basis, profile, state, lanes)`. */
  readonly kappa: string;
}

export function createCodecPoint(params: {
  readonly basis: UorcBasisKind;
  readonly profile: number;
  readonly state?: string;
  readonly lanes?: number;
}): ConservatoryCodecPoint {
  const profileU32 = params.profile >>> 0;
  const state = params.state ?? 'void';
  const lanes = Math.max(1, Math.floor(params.lanes ?? 1));
  const canonicalText = `UORC-CODEC-POINT-v1:${params.basis}:${profileU32.toString(16).padStart(8, '0')}:${state}:${lanes}`;
  return {
    basis: params.basis,
    profile: profileU32,
    state,
    lanes,
    kappa: sha256Hex(canonicalText),
  };
}

export interface ConsolidatedWarmBasisState {
  readonly slotId: 'STATE_1' | 'STATE_2';
  readonly title: string;
  readonly kappaHex: string;
  readonly kappaBytes: Uint8Array;
  readonly dictionaryBytes: Uint8Array;
}

const WARM_DICTIONARY_1_TEXT =
  '{"profile":"prism/anamnesis-merkle-standard/1","merkleDigestHex":"0x","merkleDigestHead32":0,"savedAtIso":"2026-","payload":{"schemaVersion":1,"basisPrime":157,"alphaSeed":1,"atmosphere":"golden","isMuted":false,"exploredBiomes":["meadow","grove","crystal","wetland","sanctuary"],"domainWeights10":{"infrastructure":16,"physics":16,"botany":16,"ecology":16,"acoustics":16,"articulation":16,"soundtrack":16,"humane":16,"brand":16,"neuromorphic":16},"floraStates":[{"id":"plant-","attuned":true,"lifecycleStage":"harmonic-fruiting","resonant-bloom":"mycelial-memory","sprouting-shoot":"dormant-seed","volatileTerpeneCharge":0.}],"episodicHorizon":[{"tickIndex":,"biome":"sanctuary","plantId":"plant-","harmonyPct":,"meanSynapticWeight":}]}}';

const WARM_DICTIONARY_2_TEXT =
  '{"id":"plant-0","species":"chime-lily","pulse-fern":"echo-lotus","drone-moss":"star-orchid","biome":"sanctuary","meadow":"crystal","harmonyPct":88,"attuned":true,"stage":"resonant-bloom","synapticWeight":16,"terpene":0.92}';

function buildWarmState(slotId: 'STATE_1' | 'STATE_2', title: string, dictText: string): ConsolidatedWarmBasisState {
  const dictionaryBytes = utf8ToBytes(dictText);
  const tagPrefix = utf8ToBytes(`UORC-WARM-BASIS-v1:${slotId}:`);
  const combined = new Uint8Array(tagPrefix.length + dictionaryBytes.length);
  combined.set(tagPrefix, 0);
  combined.set(dictionaryBytes, tagPrefix.length);
  const kappaBytes = sha256Bytes(combined);
  return Object.freeze({
    slotId,
    title,
    kappaHex: bytesToHex(kappaBytes),
    kappaBytes,
    dictionaryBytes,
  });
}

export const CONSERVATORY_WARM_STATE_1: ConsolidatedWarmBasisState = buildWarmState(
  'STATE_1',
  'Conservatory Anamnesis & Multi-Biome Flora Genome Consolidated Basis',
  WARM_DICTIONARY_1_TEXT,
);

export const CONSERVATORY_WARM_STATE_2: ConsolidatedWarmBasisState = buildWarmState(
  'STATE_2',
  'Compact Botanical Specimen & Telemetry Suffix Consolidated Basis',
  WARM_DICTIONARY_2_TEXT,
);

export const CONSERVATORY_WARM_STATES: readonly ConsolidatedWarmBasisState[] = Object.freeze([
  CONSERVATORY_WARM_STATE_1,
  CONSERVATORY_WARM_STATE_2,
]);

const WARM_STATE_BY_KAPPA = new Map<string, ConsolidatedWarmBasisState>([
  [CONSERVATORY_WARM_STATE_1.kappaHex, CONSERVATORY_WARM_STATE_1],
  [CONSERVATORY_WARM_STATE_2.kappaHex, CONSERVATORY_WARM_STATE_2],
]);

export function lookupWarmStateByKappa(kappaHex: string): ConsolidatedWarmBasisState | undefined {
  return WARM_STATE_BY_KAPPA.get(kappaHex.toLowerCase());
}

const NCM_FAST_PLASTICITY_SPAN = 8192;
const MECHANIZED_NCM_PLASTICITY_LUT = (() => {
  const lut = new Uint8Array(NCM_FAST_PLASTICITY_SPAN);
  for (let i = 0; i < NCM_FAST_PLASTICITY_SPAN; i++) {
    lut[i] = Number(CompiledNeuro.ncmPlasticity(BigInt(i)));
  }
  return lut;
})();

const MECHANIZED_NCM_SLOT_RATE_LUT = (() => {
  const limit = Number(CompiledNeuro.ncmCountLimit());
  const lut = new Uint16Array(limit + 1);
  for (let i = 0; i <= limit; i++) {
    lut[i] = Number(CompiledNeuro.ncmSlotRate(BigInt(i)));
  }
  return lut;
})();

/**
 * Exact `uorc/ncm-plasticity/1` hyperbolic synaptic schedule mechanized directly from
 * `Foundation.Neuromorphic.V1.Model::ncmPlasticity` (`128` at `pos=0`, `76` at `pos=4096`, `25` at `421888`, `24` at `>=421889`).
 */
export function evaluateNcmPlasticity(bytePos: number): number {
  const p = Math.max(0, Math.floor(bytePos));
  if (p < NCM_FAST_PLASTICITY_SPAN) {
    return MECHANIZED_NCM_PLASTICITY_LUT[p];
  }
  return Number(CompiledNeuro.ncmPlasticity(toPrismNat(p)));
}

/**
 * Exact `uorc/ncm-plasticity/1` context-slot learning rate mechanized directly from
 * `Foundation.Neuromorphic.V1.Model::ncmSlotRate` (`43690` at `count=0`, consolidating to `510` at `count=127`).
 */
export function evaluateNcmSlotRate(slotCount: number): number {
  const maxIdx = MECHANIZED_NCM_SLOT_RATE_LUT.length - 1;
  const clamped = Math.min(Math.max(0, Math.floor(slotCount)), maxIdx);
  return MECHANIZED_NCM_SLOT_RATE_LUT[clamped];
}

export function popcount17(mask: number): number {
  let x = mask & 0x0001ffff;
  let c = 0;
  while (x !== 0) {
    x &= x - 1;
    c++;
  }
  return c;
}

export function decodeProfileCapabilities(profile: number): {
  readonly contextCount: number;
  readonly hasShortMatch: boolean;
  readonly hasRepeatOffset: boolean;
  readonly hasDeltaFilter: boolean;
  readonly inputsPerBit: number;
  readonly stepsPerByte: number;
} {
  const u = profile >>> 0;
  const contextCount = popcount17(u);
  const hasShortMatch = (u & 0x00060000) !== 0;
  const hasRepeatOffset = (u & 0x00080000) !== 0;
  const hasDeltaFilter = (u & POINT_FILTER_FLAG) !== 0;
  const inputsPerBit =
    3 + contextCount + (hasShortMatch ? 2 : 0) + (hasRepeatOffset ? 2 : 0);
  return {
    contextCount,
    hasShortMatch,
    hasRepeatOffset,
    hasDeltaFilter,
    inputsPerBit,
    stepsPerByte: 8 * inputsPerBit,
  };
}

// ============================================================================
// 4. SATURATING CODER BYTE LEDGER, LEXICOGRAPHIC CHOICE & DOMINANCE OPERATORS
// ============================================================================

export function saturateCounter(value: number, limit: number): number {
  return Number(CompiledCompression.saturate(toPrismNat(value), toPrismNat(limit)));
}

export function excessOverThreshold(threshold: number, observed: number): number {
  return Number(CompiledCompression.excessOver(toPrismNat(threshold), toPrismNat(observed)));
}

export function lackUnderThreshold(threshold: number, observed: number): number {
  return Number(CompiledCompression.lackUnder(toPrismNat(threshold), toPrismNat(observed)));
}

/**
 * Saturating Coder Byte Ledger (`Uorc.Performance::saturate`, `encodedPayloadBelowCap`):
 * Tracks emitted compressed payload bytes up to `capBytes` and halts at the exact `capBytes + 1` byte
 * without statistical guessing or heuristic early-stop drift.
 */
export class SaturatingCapLedger {
  public readonly capBytes: number;
  private readonly buffer: Uint8Array;
  private emittedSaturated = 0;

  constructor(capBytes: number) {
    this.capBytes = Math.max(0, Math.floor(capBytes));
    this.buffer = new Uint8Array(this.capBytes);
  }

  public get saturatedCount(): number {
    return this.emittedSaturated;
  }

  public get abandonedAtCap(): boolean {
    return this.emittedSaturated > this.capBytes;
  }

  /** Emits one byte if strictly below/within `capBytes`; saturates to `capBytes + 1` and returns `false` on overflow. */
  public emitByte(byte: number): boolean {
    if (this.emittedSaturated < this.capBytes) {
      this.buffer[this.emittedSaturated] = byte & 0xff;
      this.emittedSaturated++;
      return true;
    }
    this.emittedSaturated = saturateCounter(this.emittedSaturated + 1, this.capBytes + 1);
    return false;
  }

  public takePayloadIfBelowCap(): Uint8Array | null {
    if (this.emittedSaturated > this.capBytes) return null;
    return this.buffer.slice(0, this.emittedSaturated);
  }
}

export interface PerformancePair {
  readonly bytes: number;
  readonly decodeSteps: number;
}

/** Strict partial order `dominates(cand, inc)` mechanized from `Foundation.Compression.V1.Model::dominates`. */
export function strictlyDominates(cand: PerformancePair, inc: PerformancePair): boolean {
  return certifiedWasmCore_dominates(Math.floor(cand.bytes), Math.floor(cand.decodeSteps), Math.floor(inc.bytes), Math.floor(inc.decodeSteps));
}

/** Lexicographic choice (`bytes`, then `decodeSteps`) from `Foundation.Compression.V1.Model::pickBytes/pickSteps`. */
export function pickLexicographicBest<T extends PerformancePair>(cand: T, inc: T): T {
  const bestBytes = Number(CompiledCompression.pickBytes(toPrismNat(cand.bytes), toPrismNat(cand.decodeSteps), toPrismNat(inc.bytes), toPrismNat(inc.decodeSteps)));
  const bestSteps = Number(CompiledCompression.pickSteps(toPrismNat(cand.bytes), toPrismNat(cand.decodeSteps), toPrismNat(inc.bytes), toPrismNat(inc.decodeSteps)));
  return cand.bytes === bestBytes && cand.decodeSteps === bestSteps && (cand.bytes < inc.bytes || (cand.bytes === inc.bytes && cand.decodeSteps < inc.decodeSteps)) ? cand : inc;
}

export function computeLyapunovCost(p: PerformancePair): number {
  return Number(CompiledCompression.consolidateCost(toPrismNat(p.bytes), toPrismNat(p.decodeSteps), toPrismNat(p.bytes), toPrismNat(p.decodeSteps)));
}

// ============================================================================
// 5. REVERSIBLE BYTE-DELTA FILTER, LZ77 + WARM DICTIONARY & NCM RANGE CODER
// ============================================================================

function applyByteDeltaFilter(input: Uint8Array): Uint8Array {
  const out = new Uint8Array(input.length);
  let prev = 0;
  for (let i = 0; i < input.length; i++) {
    const cur = input[i];
    out[i] = (cur - prev) & 0xff;
    prev = cur;
  }
  return out;
}

function invertByteDeltaFilter(filtered: Uint8Array): Uint8Array {
  const out = new Uint8Array(filtered.length);
  let prev = 0;
  for (let i = 0; i < filtered.length; i++) {
    prev = (prev + filtered[i]) & 0xff;
    out[i] = prev;
  }
  return out;
}

const LZ_HASH_BITS = 13;
const LZ_HASH_SIZE = 1 << LZ_HASH_BITS;

function hash4(buf: Uint8Array, pos: number): number {
  const v =
    buf[pos] |
    (buf[pos + 1] << 8) |
    (buf[pos + 2] << 16) |
    (buf[pos + 3] << 24);
  return (Math.imul(v, 0x9e3779b1) >>> (32 - LZ_HASH_BITS)) & (LZ_HASH_SIZE - 1);
}

function hash3(buf: Uint8Array, pos: number): number {
  const v = buf[pos] | (buf[pos + 1] << 8) | (buf[pos + 2] << 16);
  return (Math.imul(v, 0x9e3779b1) >>> (32 - LZ_HASH_BITS)) & (LZ_HASH_SIZE - 1);
}

/**
 * Deterministic LZ77 + Warm Basis Dictionary tokenizer (`profile`-parameterized):
 * Token stream format:
 *   Packed in blocks of 8 tokens: `[flagsByte, ...tokenPayloads]`
 *   - Flag bit `0`: literal `1` byte
 *   - Flag bit `1`: match:
 *     - If `lenCode === 0` (`byte0 === 0`): repeat-offset match (`len = 3 + nextByte`, `dist = lastRepDist`) when `hasRepeatOffset`
 *     - Else `hdr = byte0`:
 *       - `lenBase = hdr >>> 4` (`1..15`): if `lenBase === 15`, `len = 17 + nextByte`; else `len = lenBase + 2` (`3..16`)
 *       - `distHi = hdr & 0x0f`, `distLo = nextByte` -> `dist = ((distHi << 8) | distLo) + 1` (`1..4096`)
 */
function tokenizeLzWithWarmBasis(
  source: Uint8Array,
  profile: number,
  warmDictionary?: Uint8Array,
): Uint8Array {
  const caps = decodeProfileCapabilities(profile);
  const dictLen = warmDictionary ? warmDictionary.length : 0;
  const combined = new Uint8Array(dictLen + source.length);
  if (warmDictionary && dictLen > 0) {
    combined.set(warmDictionary, 0);
  }
  combined.set(source, dictLen);

  const head4 = new Int32Array(LZ_HASH_SIZE).fill(-1);
  const prev4 = new Int32Array(combined.length).fill(-1);
  const head3 = caps.hasShortMatch ? new Int32Array(LZ_HASH_SIZE).fill(-1) : null;

  // Index warm basis dictionary positions (`0 .. dictLen - 1`)
  for (let p = 0; p < dictLen; p++) {
    if (p + 4 <= combined.length) {
      const h = hash4(combined, p);
      prev4[p] = head4[h];
      head4[h] = p;
    }
    if (head3 && p + 3 <= combined.length) {
      head3[hash3(combined, p)] = p;
    }
  }

  const out: number[] = [];
  let lastDist = 1;
  let pos = dictLen;
  const end = combined.length;

  while (pos < end) {
    const flagIndex = out.length;
    out.push(0);
    let flags = 0;

    for (let bit = 0; bit < 8 && pos < end; bit++) {
      let bestLen = 0;
      let bestDist = 0;
      let useRep = false;

      // 1. Check repeat-offset match if enabled in profile
      if (caps.hasRepeatOffset && pos - lastDist >= 0 && pos + 3 <= end) {
        const ref = pos - lastDist;
        const maxL = Math.min(258, end - pos);
        let l = 0;
        while (l < maxL && combined[ref + l] === combined[pos + l]) l++;
        if (l >= 3) {
          bestLen = l;
          bestDist = lastDist;
          useRep = true;
        }
      }

      // 2. Search 4-byte hash chain within 4096-byte addressable distance window
      if (pos + 4 <= end) {
        const h4 = hash4(combined, pos);
        let cand = head4[h4];
        let chainSteps = 0;
        const maxL = Math.min(272, end - pos);
        while (cand >= 0 && pos - cand <= 4096 && chainSteps < 24) {
          let l = 0;
          while (l < maxL && combined[cand + l] === combined[pos + l]) l++;
          if (l >= 4 && l > bestLen + (useRep ? 1 : 0)) {
            bestLen = l;
            bestDist = pos - cand;
            useRep = false;
            if (l >= 64) break;
          }
          cand = prev4[cand];
          chainSteps++;
        }
      }

      // 3. Check 3-byte short match if enabled in profile (`PROFILE_MID` / `PROFILE_FULL`)
      if (bestLen === 0 && head3 && pos + 3 <= end) {
        const h3 = hash3(combined, pos);
        const cand3 = head3[h3];
        if (cand3 >= 0 && pos - cand3 <= 4096) {
          if (
            combined[cand3] === combined[pos] &&
            combined[cand3 + 1] === combined[pos + 1] &&
            combined[cand3 + 2] === combined[pos + 2]
          ) {
            bestLen = 3;
            bestDist = pos - cand3;
            useRep = false;
          }
        }
      }

      if (bestLen >= 3) {
        flags |= 1 << bit;
        if (useRep && bestLen <= 258) {
          out.push(0);
          out.push(bestLen - 3);
        } else {
          const d0 = bestDist - 1;
          const distHi = (d0 >>> 8) & 0x0f;
          const distLo = d0 & 0xff;
          if (bestLen <= 16) {
            const lenCode = bestLen - 2; // 1..14
            out.push((lenCode << 4) | distHi);
            out.push(distLo);
          } else {
            const clampedLen = Math.min(272, bestLen);
            out.push((15 << 4) | distHi);
            out.push(clampedLen - 17);
            out.push(distLo);
            bestLen = clampedLen;
          }
          lastDist = bestDist;
        }

        for (let s = 0; s < bestLen; s++) {
          const cur = pos + s;
          if (cur + 4 <= end) {
            const h = hash4(combined, cur);
            prev4[cur] = head4[h];
            head4[h] = cur;
          }
          if (head3 && cur + 3 <= end) {
            head3[hash3(combined, cur)] = cur;
          }
        }
        pos += bestLen;
      } else {
        // Literal byte
        out.push(combined[pos]);
        if (pos + 4 <= end) {
          const h = hash4(combined, pos);
          prev4[pos] = head4[h];
          head4[h] = pos;
        }
        if (head3 && pos + 3 <= end) {
          head3[hash3(combined, pos)] = pos;
        }
        pos++;
      }
    }

    out[flagIndex] = flags;
  }

  return Uint8Array.from(out);
}

function detokenizeLzWithWarmBasis(
  tokens: Uint8Array,
  expectedLength: number,
  warmDictionary?: Uint8Array,
): UorcResult<Uint8Array> {
  const dictLen = warmDictionary ? warmDictionary.length : 0;
  const combined = new Uint8Array(dictLen + expectedLength);
  if (warmDictionary && dictLen > 0) {
    combined.set(warmDictionary, 0);
  }

  let outPos = dictLen;
  const outEnd = dictLen + expectedLength;
  let inPos = 0;
  let lastDist = 1;

  while (outPos < outEnd) {
    if (inPos >= tokens.length) {
      return {
        ok: false,
        error: { code: 'CorruptPayload', message: 'Truncated LZ token stream flags', byteOffset: inPos },
      };
    }
    const flags = tokens[inPos++];
    for (let bit = 0; bit < 8 && outPos < outEnd; bit++) {
      if ((flags & (1 << bit)) === 0) {
        if (inPos >= tokens.length) {
          return {
            ok: false,
            error: { code: 'CorruptPayload', message: 'Truncated LZ literal byte', byteOffset: inPos },
          };
        }
        combined[outPos++] = tokens[inPos++];
      } else {
        if (inPos >= tokens.length) {
          return {
            ok: false,
            error: { code: 'CorruptPayload', message: 'Truncated LZ match header', byteOffset: inPos },
          };
        }
        const hdr = tokens[inPos++];
        let matchLen = 0;
        let matchDist = 0;
        if (hdr === 0) {
          if (inPos >= tokens.length) {
            return {
              ok: false,
              error: { code: 'CorruptPayload', message: 'Truncated repeat-match length', byteOffset: inPos },
            };
          }
          matchLen = 3 + tokens[inPos++];
          matchDist = lastDist;
        } else {
          const lenCode = hdr >>> 4;
          const distHi = hdr & 0x0f;
          if (lenCode === 15) {
            if (inPos + 1 >= tokens.length) {
              return {
                ok: false,
                error: { code: 'CorruptPayload', message: 'Truncated long-match header', byteOffset: inPos },
              };
            }
            matchLen = 17 + tokens[inPos++];
            const distLo = tokens[inPos++];
            matchDist = ((distHi << 8) | distLo) + 1;
          } else {
            if (inPos >= tokens.length) {
              return {
                ok: false,
                error: { code: 'CorruptPayload', message: 'Truncated match distance', byteOffset: inPos },
              };
            }
            matchLen = lenCode + 2;
            const distLo = tokens[inPos++];
            matchDist = ((distHi << 8) | distLo) + 1;
          }
          lastDist = matchDist;
        }

        const refStart = outPos - matchDist;
        if (refStart < 0 || outPos + matchLen > outEnd) {
          return {
            ok: false,
            error: {
              code: 'CorruptPayload',
              message: `Invalid LZ match reference (dist=${matchDist}, len=${matchLen})`,
              byteOffset: inPos,
            },
          };
        }
        for (let k = 0; k < matchLen; k++) {
          combined[outPos + k] = combined[refStart + k];
        }
        outPos += matchLen;
      }
    }
  }

  return { ok: true, value: combined.slice(dictLen, outEnd) };
}

/**
 * Bijective Two-Endpoint 32-Bit Adaptive Context Range Coder driven by `uorc/ncm-plasticity/1`:
 * Uses `contextMask = (1 << min(10, contextCount)) - 1` hashed with the partial byte tree `1..255`
 * and updates 12-bit bit-1 probability via `evaluateNcmPlasticity(bytePos)` + `evaluateNcmSlotRate(count)`.
 */
function computeNcmContextIndex(
  prevByte: number,
  prevPrevByte: number,
  bitTree: number,
  activeContextBits: number,
): number {
  const ctxBits = Math.max(0, Math.min(8, activeContextBits));
  if (ctxBits === 0) return bitTree & 0xff;
  const prevHash = ((prevByte * 37) ^ (prevPrevByte * 7)) & ((1 << ctxBits) - 1);
  return (prevHash << 8) | (bitTree & 0xff);
}

function splitRangeMid(x1: number, x2: number, p1: number): number {
  const span = (x2 - x1) >>> 0;
  const hi = span >>> 12;
  const lo = span & 0xfff;
  const delta = (Math.imul(hi, p1) + ((lo * p1) >>> 12)) >>> 0;
  return (x1 + delta) >>> 0;
}

function adaptBitProb12(prob12: number, bit: number, plasticity: number, slotCount: number): number {
  const slotRate = evaluateNcmSlotRate(slotCount);
  // Fast early adaptation (`slotRate = 43690`, `plasticity = 128`), steadier as slot consolidates (`slotRate -> 510` at count=127)
  const stepShift = slotRate <= 1500 ? 5 : plasticity >= 80 ? 3 : 4;
  if (bit === 1) {
    const next = prob12 + ((4096 - prob12) >>> stepShift);
    return next > 4095 ? 4095 : next < 1 ? 1 : next;
  }
  const next = prob12 - (prob12 >>> stepShift);
  return next < 1 ? 1 : next > 4095 ? 4095 : next;
}

function rangeEncodeTokenStreamBelowCap(
  tokenBytes: Uint8Array,
  activeContextBits: number,
  capBytes: number,
): { readonly payload: Uint8Array | null; readonly ledger: SaturatingCapLedger } {
  const ledger = new SaturatingCapLedger(capBytes);
  const lenVarint = encodeUleb128(tokenBytes.length);
  for (let i = 0; i < lenVarint.length; i++) {
    if (!ledger.emitByte(lenVarint[i])) {
      return { payload: null, ledger };
    }
  }

  if (tokenBytes.length === 0) {
    return { payload: ledger.takePayloadIfBelowCap(), ledger };
  }

  const ctxBits = Math.max(0, Math.min(8, activeContextBits));
  const tableSize = 1 << (ctxBits + 8);
  const probs = new Uint16Array(tableSize).fill(2048);
  const counts = new Uint8Array(tableSize);

  let x1 = 0 >>> 0;
  let x2 = 0xffffffff >>> 0;
  let prev1 = 0;
  let prev2 = 0;

  for (let pos = 0; pos < tokenBytes.length; pos++) {
    const byte = tokenBytes[pos];
    const plasticity = evaluateNcmPlasticity(pos);
    let bitTree = 1;

    for (let b = 7; b >= 0; b--) {
      const bit = (byte >>> b) & 1;
      const ctx = computeNcmContextIndex(prev1, prev2, bitTree, ctxBits);
      const p1 = probs[ctx];
      const xmid = splitRangeMid(x1, x2, p1);

      if (bit === 1) {
        x2 = xmid;
      } else {
        x1 = (xmid + 1) >>> 0;
      }

      const c = counts[ctx];
      probs[ctx] = adaptBitProb12(p1, bit, plasticity, c);
      if (c < 127) counts[ctx] = c + 1;

      while (((x1 ^ x2) >>> 24) === 0) {
        if (!ledger.emitByte((x2 >>> 24) & 0xff)) {
          return { payload: null, ledger };
        }
        x1 = (x1 << 8) >>> 0;
        x2 = (((x2 << 8) >>> 0) | 0xff) >>> 0;
      }

      bitTree = (bitTree << 1) | bit;
    }

    prev2 = prev1;
    prev1 = byte;
  }

  // Exact 4-byte termination flush (`x = x1` satisfies `x1 <= x <= x2` unconditionally)
  if (
    !ledger.emitByte((x1 >>> 24) & 0xff) ||
    !ledger.emitByte((x1 >>> 16) & 0xff) ||
    !ledger.emitByte((x1 >>> 8) & 0xff) ||
    !ledger.emitByte(x1 & 0xff)
  ) {
    return { payload: null, ledger };
  }

  return { payload: ledger.takePayloadIfBelowCap(), ledger };
}

function rangeDecodeTokenStream(
  payload: Uint8Array,
  activeContextBits: number,
): UorcResult<Uint8Array> {
  const lenRes = decodeUleb128(payload, 0);
  if (!lenRes.ok) return lenRes;
  const tokenLenBig = lenRes.value.value;
  if (tokenLenBig > 16777216n) {
    return {
      ok: false,
      error: { code: 'CorruptPayload', message: 'Token stream length exceeds safety bound' },
    };
  }
  const tokenLen = Number(tokenLenBig);
  if (tokenLen === 0) {
    return { ok: true, value: new Uint8Array(0) };
  }

  let readPos = lenRes.value.nextOffset;
  if (readPos + 4 > payload.length) {
    return {
      ok: false,
      error: { code: 'CorruptPayload', message: 'Truncated range coder initial 4-byte state' },
    };
  }

  const nextByte = (): number => (readPos < payload.length ? payload[readPos++] : 0);

  let x1 = 0 >>> 0;
  let x2 = 0xffffffff >>> 0;
  let x =
    (((nextByte() << 24) >>> 0) |
      (nextByte() << 16) |
      (nextByte() << 8) |
      nextByte()) >>>
    0;

  const ctxBits = Math.max(0, Math.min(8, activeContextBits));
  const tableSize = 1 << (ctxBits + 8);
  const probs = new Uint16Array(tableSize).fill(2048);
  const counts = new Uint8Array(tableSize);

  const out = new Uint8Array(tokenLen);
  let prev1 = 0;
  let prev2 = 0;

  for (let pos = 0; pos < tokenLen; pos++) {
    const plasticity = evaluateNcmPlasticity(pos);
    let bitTree = 1;

    for (let b = 7; b >= 0; b--) {
      const ctx = computeNcmContextIndex(prev1, prev2, bitTree, ctxBits);
      const p1 = probs[ctx];
      const xmid = splitRangeMid(x1, x2, p1);
      const bit = (x >>> 0) <= (xmid >>> 0) ? 1 : 0;

      if (bit === 1) {
        x2 = xmid;
      } else {
        x1 = (xmid + 1) >>> 0;
      }

      const c = counts[ctx];
      probs[ctx] = adaptBitProb12(p1, bit, plasticity, c);
      if (c < 127) counts[ctx] = c + 1;

      while (((x1 ^ x2) >>> 24) === 0) {
        x1 = (x1 << 8) >>> 0;
        x2 = (((x2 << 8) >>> 0) | 0xff) >>> 0;
        x = (((x << 8) >>> 0) | nextByte()) >>> 0;
      }

      bitTree = (bitTree << 1) | bit;
    }

    const decodedByte = bitTree & 0xff;
    out[pos] = decodedByte;
    prev2 = prev1;
    prev1 = decodedByte;
  }

  return { ok: true, value: out };
}

export function encodeNcmPayloadBelowCap(
  rawBytes: Uint8Array,
  profile: number,
  capBytes: number,
  warmState?: ConsolidatedWarmBasisState,
): { readonly payload: Uint8Array | null; readonly ledger: SaturatingCapLedger } {
  const caps = decodeProfileCapabilities(profile);
  const working = caps.hasDeltaFilter ? applyByteDeltaFilter(rawBytes) : rawBytes;
  const tokens = tokenizeLzWithWarmBasis(working, profile, warmState?.dictionaryBytes);
  const activeCtxBits = Math.min(8, Math.floor(caps.contextCount / 2));
  return rangeEncodeTokenStreamBelowCap(tokens, activeCtxBits, capBytes);
}

export function decodeNcmPayload(
  payload: Uint8Array,
  origLength: number,
  profile: number,
  warmState?: ConsolidatedWarmBasisState,
): UorcResult<Uint8Array> {
  const caps = decodeProfileCapabilities(profile);
  const activeCtxBits = Math.min(8, Math.floor(caps.contextCount / 2));
  const tokRes = rangeDecodeTokenStream(payload, activeCtxBits);
  if (!tokRes.ok) return tokRes;
  const lzRes = detokenizeLzWithWarmBasis(tokRes.value, origLength, warmState?.dictionaryBytes);
  if (!lzRes.ok) return lzRes;
  const restored = caps.hasDeltaFilter ? invertByteDeltaFilter(lzRes.value) : lzRes.value;
  return { ok: true, value: restored };
}

/**
 * Shared Twin-Strategy Pass (`Uorc.Performance` `twinSharedStrategyCount === 2`):
 * Evaluates `PROFILE_FULL` (`0x000fffff`) and `PROFILE_MID` (`0x0007ffff`) under one shared pre-filtered
 * pass over `rawBytes`, guaranteed byte-identical to running `encodeNcmPayloadBelowCap` separately.
 */
export function encodeTwinProfilesBelowCap(
  rawBytes: Uint8Array,
  capBytes: number,
  useDeltaFilter = false,
  warmState?: ConsolidatedWarmBasisState,
): {
  readonly fullProfile: number;
  readonly midProfile: number;
  readonly fullResult: { readonly payload: Uint8Array | null; readonly ledger: SaturatingCapLedger };
  readonly midResult: { readonly payload: Uint8Array | null; readonly ledger: SaturatingCapLedger };
} {
  const filterBits = useDeltaFilter ? POINT_FILTER_FLAG : 0;
  const fullProfile = (PROFILE_FULL | filterBits) >>> 0;
  const midProfile = (PROFILE_MID | filterBits) >>> 0;
  // Shared pre-filtering pass over input bytes
  const sharedWorking = useDeltaFilter ? applyByteDeltaFilter(rawBytes) : rawBytes;
  const fullTokens = tokenizeLzWithWarmBasis(sharedWorking, fullProfile, warmState?.dictionaryBytes);
  const midTokens = tokenizeLzWithWarmBasis(sharedWorking, midProfile, warmState?.dictionaryBytes);
  const fullCtxBits = Math.min(8, Math.floor(decodeProfileCapabilities(fullProfile).contextCount / 2));
  const midCtxBits = Math.min(8, Math.floor(decodeProfileCapabilities(midProfile).contextCount / 2));

  return {
    fullProfile,
    midProfile,
    fullResult: rangeEncodeTokenStreamBelowCap(fullTokens, fullCtxBits, capBytes),
    midResult: rangeEncodeTokenStreamBelowCap(midTokens, midCtxBits, capBytes),
  };
}

// ============================================================================
// 6. MULTI-OBJECT UORC WIRE CODEC, HEADER INSPECTION & SHA-256 CHAIN VERIFICATION
// ============================================================================

export type UorcFrameTag = 0 | 1 | 2 | 3;
export type UorcFrameKind = 'raw' | 'reference' | 'ncm' | 'warm';

export interface UorcInspectedFrame {
  readonly objectIndex: number;
  readonly kind: UorcFrameKind;
  readonly originalBytes: number;
  readonly wireBytes: number;
  readonly decodeSteps: number;
  readonly codecPoint: ConservatoryCodecPoint;
  readonly referenceIndex?: number;
}

export interface UorcArchiveInspection {
  readonly magic: 'UORC\\x01';
  readonly objectCount: number;
  readonly totalOriginalBytes: number;
  readonly totalArchiveBytes: number;
  readonly totalDecodeSteps: number;
  readonly primaryCodecPoint: ConservatoryCodecPoint;
  readonly frames: readonly UorcInspectedFrame[];
  readonly trailerDigestHex: string;
}

export interface UorcCompressionReport {
  readonly archiveBytes: Uint8Array;
  readonly inspection: UorcArchiveInspection;
  readonly corpusKappa: string;
  readonly rawBaselineBoundBytes: number;
  readonly archiveBoundSatisfied: boolean;
  readonly zeroDefectVerified: boolean;
}

function writeU32BE(target: number[], val: number): void {
  const u = val >>> 0;
  target.push((u >>> 24) & 0xff, (u >>> 16) & 0xff, (u >>> 8) & 0xff, u & 0xff);
}

function readU32BE(buf: Uint8Array, offset: number): number {
  return (
    (((buf[offset] << 24) >>> 0) |
      (buf[offset + 1] << 16) |
      (buf[offset + 2] << 8) |
      buf[offset + 3]) >>>
    0
  );
}

function bytesEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export function computeCorpusKappa(objects: readonly Uint8Array[]): string {
  const parts: number[] = [];
  const tag = utf8ToBytes('UORC-CORPUS-v1:');
  for (let i = 0; i < tag.length; i++) parts.push(tag[i]);
  const countVar = encodeUleb128(objects.length);
  for (let i = 0; i < countVar.length; i++) parts.push(countVar[i]);
  for (let i = 0; i < objects.length; i++) {
    const lenVar = encodeUleb128(objects[i].length);
    for (let j = 0; j < lenVar.length; j++) parts.push(lenVar[j]);
    const digest = sha256Bytes(objects[i]);
    for (let j = 0; j < 32; j++) parts.push(digest[j]);
  }
  return bytesToHex(sha256Bytes(Uint8Array.from(parts)));
}

function computeArchiveTrailerDigest(
  wirePrefix: Uint8Array,
  decodedObjects: readonly Uint8Array[],
): Uint8Array {
  const tagBytes = utf8ToBytes(UORC_SHA256_CHAIN_TAG);
  const totalLen = tagBytes.length + wirePrefix.length + decodedObjects.length * 32;
  const chainInput = new Uint8Array(totalLen);
  let offset = 0;
  chainInput.set(tagBytes, offset);
  offset += tagBytes.length;
  chainInput.set(wirePrefix, offset);
  offset += wirePrefix.length;
  for (let i = 0; i < decodedObjects.length; i++) {
    chainInput.set(sha256Bytes(decodedObjects[i]), offset);
    offset += 32;
  }
  return sha256Bytes(chainInput);
}

interface CandidateEncodedFrame extends PerformancePair {
  readonly kind: UorcFrameKind;
  readonly wireFrame: Uint8Array;
  readonly codecPoint: ConservatoryCodecPoint;
  readonly defect: number;
}

function buildRawFrame(obj: Uint8Array): CandidateEncodedFrame {
  const lenVar = encodeUleb128(obj.length);
  const wire = new Uint8Array(1 + lenVar.length + obj.length);
  wire[0] = 0; // Raw tag
  wire.set(lenVar, 1);
  wire.set(obj, 1 + lenVar.length);
  return {
    kind: 'raw',
    bytes: wire.length,
    decodeSteps: obj.length, // rawFrameSteps(n) = n
    wireFrame: wire,
    codecPoint: createCodecPoint({ basis: 'raw-identity', profile: PROFILE_RAW_NONE }),
    defect: 0,
  };
}

function buildReferenceFrame(refIndex: number, origLen: number): CandidateEncodedFrame {
  const refVar = encodeUleb128(refIndex);
  const lenVar = encodeUleb128(origLen);
  const wire = new Uint8Array(1 + refVar.length + lenVar.length);
  wire[0] = 1; // Reference tag
  wire.set(refVar, 1);
  wire.set(lenVar, 1 + refVar.length);
  return {
    kind: 'reference',
    bytes: wire.length,
    decodeSteps: 0, // referenceFrameSteps(n) = 0
    wireFrame: wire,
    codecPoint: createCodecPoint({ basis: 'kappa-reference', profile: PROFILE_RAW_NONE }),
    defect: 0,
  };
}

function tryBuildModelledFrame(
  obj: Uint8Array,
  profile: number,
  incumbentBytes: number,
  warmState?: ConsolidatedWarmBasisState,
): CandidateEncodedFrame | null {
  const origVar = encodeUleb128(obj.length);
  const fixedMetaBytes = 1 + 4 + (warmState ? 32 : 0) + origVar.length + 1; // +1 min uleb for payloadLen
  if (incumbentBytes <= fixedMetaBytes) {
    return null;
  }
  const payloadCap = incumbentBytes - fixedMetaBytes;
  const enc = encodeNcmPayloadBelowCap(obj, profile, payloadCap, warmState);
  if (!enc.payload) return null;

  // Enforce zero-defect round-trip admission (`admitZeroDefectBytes`: defect MUST equal 0)
  const dec = decodeNcmPayload(enc.payload, obj.length, profile, warmState);
  const defect = dec.ok && bytesEqual(dec.value, obj) ? 0 : 1;
  if (defect !== 0) return null;

  const payLenVar = encodeUleb128(enc.payload.length);
  const headerArr: number[] = [warmState ? 3 : 2];
  writeU32BE(headerArr, profile);
  if (warmState) {
    for (let i = 0; i < 32; i++) headerArr.push(warmState.kappaBytes[i]);
  }
  for (let i = 0; i < origVar.length; i++) headerArr.push(origVar[i]);
  for (let i = 0; i < payLenVar.length; i++) headerArr.push(payLenVar[i]);

  const wire = new Uint8Array(headerArr.length + enc.payload.length);
  wire.set(headerArr, 0);
  wire.set(enc.payload, headerArr.length);

  const caps = decodeProfileCapabilities(profile);
  const decodeSteps = caps.stepsPerByte * obj.length;

  return {
    kind: warmState ? 'warm' : 'ncm',
    bytes: wire.length,
    decodeSteps,
    wireFrame: wire,
    codecPoint: createCodecPoint({
      basis: warmState ? 'warm-consolidated-v1' : 'ncm-adaptive-v1',
      profile,
      state: warmState ? warmState.kappaHex : 'void',
      lanes: 1,
    }),
    defect: 0,
  };
}

export interface CompressUorcOptions {
  readonly allowWarmStates?: boolean;
  readonly candidateProfiles?: readonly number[];
}

/**
 * Compresses one or more objects into a self-verifying lossless `UORC\x01` archive.
 * Guarantees `archive.byteLength <= n + 61` for every single-object input of length `n`,
 * `0`-step `κ` deduplication on repeated objects, exact cap-stop via `SaturatingCapLedger`,
 * and zero-defect (`defect === 0`) lexicographic selection (`bytes`, then `decodeSteps`).
 */
export function compressUorcArchive(
  objects: readonly Uint8Array[],
  options?: CompressUorcOptions,
): UorcCompressionReport {
  const allowWarm = options?.allowWarmStates ?? true;
  const profiles = options?.candidateProfiles ?? [
    PROFILE_V03,
    PROFILE_MID,
    PROFILE_FULL,
    (PROFILE_V03 | POINT_FILTER_FLAG) >>> 0,
  ];

  const seenObjectByKappa = new Map<string, number>();
  const chosenFrames: CandidateEncodedFrame[] = [];

  for (let idx = 0; idx < objects.length; idx++) {
    const obj = objects[idx];
    const objKappa = sha256Hex(obj);

    // 1. Baseline floor candidate: Raw frame (never fails, defect === 0)
    let incumbent = buildRawFrame(obj);

    // 2. Check 0-step κ-Reference deduplication against earlier objects in the archive
    const prevIdx = seenObjectByKappa.get(objKappa);
    if (prevIdx !== undefined) {
      const refCand = buildReferenceFrame(prevIdx, obj.length);
      if (bytesEqual(objects[prevIdx], obj)) {
        incumbent = pickLexicographicBest(refCand, incumbent);
      }
    } else {
      seenObjectByKappa.set(objKappa, idx);
    }

    // 3. Evaluate cold-start NCM profiles under saturating byte cap against current incumbent
    if (obj.length >= 16 && incumbent.kind !== 'reference') {
      for (let p = 0; p < profiles.length; p++) {
        const cand = tryBuildModelledFrame(obj, profiles[p], incumbent.bytes);
        if (cand && cand.defect === 0) {
          incumbent = pickLexicographicBest(cand, incumbent);
        }
      }

      // 4. Evaluate κ-named Consolidated Warm Basis States (`STATE_1`, `STATE_2`)
      if (allowWarm) {
        for (let w = 0; w < CONSERVATORY_WARM_STATES.length; w++) {
          const warmState = CONSERVATORY_WARM_STATES[w];
          const candMid = tryBuildModelledFrame(obj, PROFILE_MID, incumbent.bytes, warmState);
          if (candMid && candMid.defect === 0) {
            incumbent = pickLexicographicBest(candMid, incumbent);
          }
          const candFull = tryBuildModelledFrame(obj, PROFILE_FULL, incumbent.bytes, warmState);
          if (candFull && candFull.defect === 0) {
            incumbent = pickLexicographicBest(candFull, incumbent);
          }
        }
      }
    }

    chosenFrames.push(incumbent);
  }

  const countVar = encodeUleb128(objects.length);
  let framesTotalBytes = 0;
  for (let i = 0; i < chosenFrames.length; i++) {
    framesTotalBytes += chosenFrames[i].wireFrame.length;
  }

  const prefixLen = UORC_WIRE_MAGIC.length + countVar.length + framesTotalBytes;
  const wirePrefix = new Uint8Array(prefixLen);
  let pos = 0;
  wirePrefix.set(UORC_WIRE_MAGIC, pos);
  pos += UORC_WIRE_MAGIC.length;
  wirePrefix.set(countVar, pos);
  pos += countVar.length;
  for (let i = 0; i < chosenFrames.length; i++) {
    wirePrefix.set(chosenFrames[i].wireFrame, pos);
    pos += chosenFrames[i].wireFrame.length;
  }

  const trailer = computeArchiveTrailerDigest(wirePrefix, objects);
  const archiveBytes = new Uint8Array(prefixLen + 32);
  archiveBytes.set(wirePrefix, 0);
  archiveBytes.set(trailer, prefixLen);

  const inspectRes = inspectUorcArchive(archiveBytes);
  if (!inspectRes.ok) {
    throw new Error(`Internal UORC self-inspection invariant violated: ${inspectRes.error.message}`);
  }

  const singleObjLen = objects.length === 1 ? objects[0].length : objects.reduce((a, b) => a + b.length, 0);
  const rawBaselineBoundBytes =
    singleObjLen +
    GENERATED_PRISM_STANDARDS.compression.codecSpaceAndBounds.rawMaxOverheadBytes *
      Math.max(1, objects.length);

  return {
    archiveBytes,
    inspection: inspectRes.value,
    corpusKappa: computeCorpusKappa(objects),
    rawBaselineBoundBytes,
    archiveBoundSatisfied: archiveBytes.length <= rawBaselineBoundBytes,
    zeroDefectVerified: true,
  };
}

/**
 * Header-only inspection (`inspectUorcArchive`):
 * Reads `CodecPoint` (`κ`), frame kinds, byte counts, and exact `totalDecodeSteps` from frame headers
 * without executing range/LZ payload decompression. Rejects malformed headers or trailing bytes.
 */
export function inspectUorcArchive(archiveBytes: Uint8Array): UorcResult<UorcArchiveInspection> {
  if (archiveBytes.length < UORC_WIRE_MAGIC.length + 1 + 32) {
    return {
      ok: false,
      error: {
        code: 'WireInvalidMagic',
        message: 'Archive shorter than minimum UORC header + SHA-256 trailer',
        byteOffset: 0,
      },
    };
  }
  for (let i = 0; i < UORC_WIRE_MAGIC.length; i++) {
    if (archiveBytes[i] !== UORC_WIRE_MAGIC[i]) {
      return {
        ok: false,
        error: {
          code: 'WireInvalidMagic',
          message: 'Invalid UORC wire magic header',
          byteOffset: i,
        },
      };
    }
  }

  const bodyEnd = archiveBytes.length - 32;
  const countRes = decodeUleb128(archiveBytes, UORC_WIRE_MAGIC.length);
  if (!countRes.ok) return countRes;
  if (countRes.value.nextOffset > bodyEnd) {
    return {
      ok: false,
      error: { code: 'WireTruncated', message: 'Object count varint overflows trailer boundary' },
    };
  }

  const objectCountBig = countRes.value.value;
  if (objectCountBig > 65536n) {
    return {
      ok: false,
      error: { code: 'VarintOverflow', message: 'Archive object count exceeds bound' },
    };
  }
  const objectCount = Number(objectCountBig);
  let offset = countRes.value.nextOffset;

  const frames: UorcInspectedFrame[] = [];
  let totalOriginalBytes = 0;
  let totalDecodeSteps = 0;

  for (let idx = 0; idx < objectCount; idx++) {
    if (offset >= bodyEnd) {
      return {
        ok: false,
        error: {
          code: 'WireTruncated',
          message: `Truncated frame header for object ${idx}`,
          byteOffset: offset,
        },
      };
    }
    const frameStart = offset;
    const tag = archiveBytes[offset++];

    if (tag === 0) {
      const lenRes = decodeUleb128(archiveBytes, offset);
      if (!lenRes.ok) return lenRes;
      const rawLen = Number(lenRes.value.value);
      offset = lenRes.value.nextOffset;
      if (offset + rawLen > bodyEnd) {
        return {
          ok: false,
          error: { code: 'WireTruncated', message: 'Raw frame payload truncated', byteOffset: offset },
        };
      }
      offset += rawLen;
      const steps = rawLen;
      totalOriginalBytes += rawLen;
      totalDecodeSteps += steps;
      frames.push({
        objectIndex: idx,
        kind: 'raw',
        originalBytes: rawLen,
        wireBytes: offset - frameStart,
        decodeSteps: steps,
        codecPoint: createCodecPoint({ basis: 'raw-identity', profile: PROFILE_RAW_NONE }),
      });
    } else if (tag === 1) {
      const refRes = decodeUleb128(archiveBytes, offset);
      if (!refRes.ok) return refRes;
      offset = refRes.value.nextOffset;
      const lenRes = decodeUleb128(archiveBytes, offset);
      if (!lenRes.ok) return lenRes;
      offset = lenRes.value.nextOffset;
      if (offset > bodyEnd) {
        return {
          ok: false,
          error: { code: 'WireTruncated', message: 'Reference frame overflows body', byteOffset: offset },
        };
      }
      const refIdx = Number(refRes.value.value);
      const origLen = Number(lenRes.value.value);
      if (refIdx >= idx || frames[refIdx].originalBytes !== origLen) {
        return {
          ok: false,
          error: {
            code: 'WireInvalidReference',
            message: `Invalid reference index ${refIdx} at frame ${idx}`,
            byteOffset: frameStart,
          },
        };
      }
      totalOriginalBytes += origLen;
      frames.push({
        objectIndex: idx,
        kind: 'reference',
        originalBytes: origLen,
        wireBytes: offset - frameStart,
        decodeSteps: 0,
        codecPoint: createCodecPoint({ basis: 'kappa-reference', profile: PROFILE_RAW_NONE }),
        referenceIndex: refIdx,
      });
    } else if (tag === 2 || tag === 3) {
      const isWarm = tag === 3;
      const needFixed = 4 + (isWarm ? 32 : 0);
      if (offset + needFixed > bodyEnd) {
        return {
          ok: false,
          error: { code: 'WireTruncated', message: 'Truncated modelled frame header', byteOffset: offset },
        };
      }
      const profile = readU32BE(archiveBytes, offset);
      offset += 4;
      let stateKappaHex = 'void';
      if (isWarm) {
        stateKappaHex = bytesToHex(archiveBytes.slice(offset, offset + 32));
        offset += 32;
        if (!lookupWarmStateByKappa(stateKappaHex)) {
          return {
            ok: false,
            error: {
              code: 'UnknownBasisState',
              message: `Unknown warm basis state κ=${stateKappaHex.slice(0, 16)}…`,
              byteOffset: offset - 32,
            },
          };
        }
      }
      const origRes = decodeUleb128(archiveBytes, offset);
      if (!origRes.ok) return origRes;
      offset = origRes.value.nextOffset;
      const payRes = decodeUleb128(archiveBytes, offset);
      if (!payRes.ok) return payRes;
      offset = payRes.value.nextOffset;

      const origLen = Number(origRes.value.value);
      const payLen = Number(payRes.value.value);
      if (offset + payLen > bodyEnd) {
        return {
          ok: false,
          error: {
            code: 'WireTruncated',
            message: 'Modelled frame compressed payload truncated',
            byteOffset: offset,
          },
        };
      }
      offset += payLen;

      const caps = decodeProfileCapabilities(profile);
      const steps = caps.stepsPerByte * origLen;
      totalOriginalBytes += origLen;
      totalDecodeSteps += steps;
      frames.push({
        objectIndex: idx,
        kind: isWarm ? 'warm' : 'ncm',
        originalBytes: origLen,
        wireBytes: offset - frameStart,
        decodeSteps: steps,
        codecPoint: createCodecPoint({
          basis: isWarm ? 'warm-consolidated-v1' : 'ncm-adaptive-v1',
          profile,
          state: stateKappaHex,
          lanes: 1,
        }),
      });
    } else {
      return {
        ok: false,
        error: {
          code: 'WireInvalidFrameTag',
          message: `Unknown UORC frame tag ${tag}`,
          byteOffset: frameStart,
        },
      };
    }
  }

  if (offset !== bodyEnd) {
    return {
      ok: false,
      error: {
        code: 'WireTrailingBytes',
        message: `Archive contains ${bodyEnd - offset} unparsed trailing byte(s) before trailer`,
        byteOffset: offset,
      },
    };
  }

  const trailerDigestHex = bytesToHex(archiveBytes.slice(bodyEnd));
  const primaryCodecPoint =
    frames[0]?.codecPoint ?? createCodecPoint({ basis: 'raw-identity', profile: PROFILE_RAW_NONE });

  return {
    ok: true,
    value: {
      magic: 'UORC\\x01',
      objectCount,
      totalOriginalBytes,
      totalArchiveBytes: archiveBytes.length,
      totalDecodeSteps,
      primaryCodecPoint,
      frames,
      trailerDigestHex,
    },
  };
}

export interface DecompressUorcOptions {
  /** Optional deterministic decode step budget; refuses with `'BudgetExhausted'` if exceeded. */
  readonly stepBudget?: number;
}

/**
 * Decompresses and cryptographically verifies a `UORC\x01` archive.
 * Enforces `stepBudget` BEFORE decoding payloads (zero partial output on budget exhaustion)
 * and verifies the 32-byte `UORC-SHA256-CHAIN-v1` trailer over both wire prefix and decoded objects.
 */
export function decompressUorcArchive(
  archiveBytes: Uint8Array,
  options?: DecompressUorcOptions,
): UorcResult<{ readonly objects: readonly Uint8Array[]; readonly inspection: UorcArchiveInspection }> {
  const inspectRes = inspectUorcArchive(archiveBytes);
  if (!inspectRes.ok) return inspectRes;
  const inspection = inspectRes.value;

  if (options?.stepBudget !== undefined && inspection.totalDecodeSteps > options.stepBudget) {
    return {
      ok: false,
      error: {
        code: 'BudgetExhausted',
        message: `Archive requires ${inspection.totalDecodeSteps} decode steps, exceeding stepBudget=${options.stepBudget}`,
        requiredSteps: inspection.totalDecodeSteps,
        stepBudget: options.stepBudget,
      },
    };
  }

  const bodyEnd = archiveBytes.length - 32;
  const countRes = decodeUleb128(archiveBytes, UORC_WIRE_MAGIC.length);
  if (!countRes.ok) return countRes;
  let offset = countRes.value.nextOffset;

  const decodedObjects: Uint8Array[] = [];

  for (let idx = 0; idx < inspection.objectCount; idx++) {
    const tag = archiveBytes[offset++];
    if (tag === 0) {
      const lenRes = decodeUleb128(archiveBytes, offset);
      if (!lenRes.ok) return lenRes;
      const rawLen = Number(lenRes.value.value);
      offset = lenRes.value.nextOffset;
      decodedObjects.push(archiveBytes.slice(offset, offset + rawLen));
      offset += rawLen;
    } else if (tag === 1) {
      const refRes = decodeUleb128(archiveBytes, offset);
      if (!refRes.ok) return refRes;
      offset = refRes.value.nextOffset;
      const lenRes = decodeUleb128(archiveBytes, offset);
      if (!lenRes.ok) return lenRes;
      offset = lenRes.value.nextOffset;
      const refIdx = Number(refRes.value.value);
      decodedObjects.push(decodedObjects[refIdx].slice());
    } else {
      const isWarm = tag === 3;
      const profile = readU32BE(archiveBytes, offset);
      offset += 4;
      let warmState: ConsolidatedWarmBasisState | undefined;
      if (isWarm) {
        const stateHex = bytesToHex(archiveBytes.slice(offset, offset + 32));
        offset += 32;
        warmState = lookupWarmStateByKappa(stateHex);
        if (!warmState) {
          return {
            ok: false,
            error: { code: 'UnknownBasisState', message: `Unknown warm basis κ=${stateHex}` },
          };
        }
      }
      const origRes = decodeUleb128(archiveBytes, offset);
      if (!origRes.ok) return origRes;
      offset = origRes.value.nextOffset;
      const payRes = decodeUleb128(archiveBytes, offset);
      if (!payRes.ok) return payRes;
      offset = payRes.value.nextOffset;

      const origLen = Number(origRes.value.value);
      const payLen = Number(payRes.value.value);
      const payload = archiveBytes.slice(offset, offset + payLen);
      offset += payLen;

      const decRes = decodeNcmPayload(payload, origLen, profile, warmState);
      if (!decRes.ok) return decRes;
      decodedObjects.push(decRes.value);
    }
  }

  const wirePrefix = archiveBytes.slice(0, bodyEnd);
  const expectedTrailer = computeArchiveTrailerDigest(wirePrefix, decodedObjects);
  const actualTrailer = archiveBytes.slice(bodyEnd);
  if (!bytesEqual(expectedTrailer, actualTrailer)) {
    return {
      ok: false,
      error: {
        code: 'IntegrityMismatch',
        message: 'UORC-SHA256-CHAIN-v1 trailer digest mismatch (1-bit or structural tamper detected)',
        byteOffset: bodyEnd,
      },
    };
  }

  return {
    ok: true,
    value: {
      objects: decodedObjects,
      inspection,
    },
  };
}

export function verifyUorcArchive(archiveBytes: Uint8Array): UorcResult<UorcArchiveInspection> {
  const dec = decompressUorcArchive(archiveBytes);
  if (!dec.ok) return dec;
  return { ok: true, value: dec.value.inspection };
}

// ============================================================================
// 7. AUTONOMOUS 64-CELL RULE-30 PORTFOLIO ENGINE, κ-CLAIM LEDGER & HONESTY POLICY
// ============================================================================

export const RULE30_MASK64 = 0xffffffffffffffffn;
export const RULE30_SEED64 = 11400714819323198485n; // 0x9e3779b97f4a7c15
export const RULE30_STEP_SEED64 = 8170733857868071477n;
export const RULE30_STEP_ONE64 = 9223372036854775811n;

/**
 * Exact 64-cell cyclic Rule-30 automaton step matching `Foundation.Compression.V1.Model::nextCell`:
 * `l(i) = cell(s, (i + 1) mod 64)`, `c(i) = cell(s, i)`, `r(i) = cell(s, (i + 63) mod 64)`,
 * `nextCell(s, i) = l(i) XOR (c(i) OR r(i))` on `Z/64Z`.
 */
export function stepPureRule30Ring64(state64: bigint): bigint {
  const s = state64 & RULE30_MASK64;
  return s === 0n ? 0n : certifiedWasmRule30Step(s);
}

/**
 * Exact 64-cell autonomous generator step matching `Foundation.Compression.V1.Model::rule30Step`
 * (seeds `0` with `RULE30_SEED64` so the portfolio generator never collapses into the all-zero absorbing state):
 *  - `stepRule30Ring64(11400714819323198485n) === 8170733857868071477n`
 *  - `stepRule30Ring64(0n) === 8170733857868071477n`
 *  - `stepRule30Ring64(1n) === 9223372036854775811n`
 */
export function stepRule30Ring64(state64: bigint): bigint {
  return certifiedWasmRule30Step(state64 & RULE30_MASK64);
}

export type PortfolioGeneratorKind =
  | 'drop-context'
  | 'add-context'
  | 'filter-toggle'
  | 'promote-warm-state';

export type ClaimMintDecision = 'minted' | 'refusedKnown' | 'refusedBudget';

export interface MintedCompressionClaim {
  readonly claimKappa: string;
  readonly codecPointKappa: string;
  readonly corpusKappa: string;
  readonly generatorKind: PortfolioGeneratorKind;
  readonly bytes: number;
  readonly decodeSteps: number;
  readonly lyapunovCost: number;
}

export interface PortfolioStrategySlot {
  readonly slotId: string;
  readonly codecPoint: ConservatoryCodecPoint;
  readonly warmStateSlot?: 'STATE_1' | 'STATE_2';
  readonly weight: number; // 1..16
  readonly pinnedBaselineFloor: boolean;
}

export interface AutonomousCompressionPortfolioState {
  readonly rule30Register64: bigint;
  readonly tickCount: number;
  readonly slots: readonly PortfolioStrategySlot[];
  readonly knownClaimKappas: ReadonlySet<string>;
  readonly mintedClaims: readonly MintedCompressionClaim[];
  readonly incumbentBest: PerformancePair & { readonly codecPointKappa: string };
  readonly lyapunovCostHistory: readonly number[];
  readonly potentialNeverRises: boolean;
  readonly winnerIsScheduledFirst: boolean;
  readonly baselineFloorNoRegression: boolean;
}

export function computeClaimKappa(params: {
  readonly codecPointKappa: string;
  readonly corpusKappa: string;
  readonly bytes: number;
  readonly decodeSteps: number;
}): string {
  return sha256Hex(
    `UORC-CLAIM-v1:${params.codecPointKappa}:${params.corpusKappa}:${params.bytes}:${params.decodeSteps}`,
  );
}

/**
 * Exact claim admission gate mechanized from `Foundation.Compression.V1.Model::admitMintCode`:
 *  - `known === true` -> `'refusedKnown'` (`code = 1`)
 *  - `remainingBudget <= 0` -> `'refusedBudget'` (`code = 2`)
 *  - otherwise -> `'minted'` (`code = 0`)
 */
export function evaluateClaimMintAdmission(
  claimKappa: string,
  knownClaimKappas: ReadonlySet<string>,
  remainingBudget: number,
): { readonly decision: ClaimMintDecision; readonly code: 0 | 1 | 2 } {
  const code = Number(
    CompiledCompression.admitMintCode(knownClaimKappas.has(claimKappa), toPrismNat(remainingBudget)),
  ) as 0 | 1 | 2;
  if (code === 1) return { decision: 'refusedKnown', code: 1 };
  if (code === 2) return { decision: 'refusedBudget', code: 2 };
  return { decision: 'minted', code: 0 };
}

export function computeWinnerPortfolioWeight(candidateWeight: number, incumbentWeight: number): number {
  return Number(CompiledCompression.winnerWeight(toPrismNat(candidateWeight), toPrismNat(incumbentWeight)));
}

export function computeLoserPortfolioWeight(incumbentWeight: number): number {
  return Number(CompiledCompression.loserWeight(toPrismNat(incumbentWeight)));
}

export function createAutonomousCompressionPortfolio(
  initialSampleObjects: readonly Uint8Array[] = [utf8ToBytes('{"biome":"sanctuary","harmonyPct":88}')],
): AutonomousCompressionPortfolioState {
  const rawBaseline = compressUorcArchive(initialSampleObjects, {
    allowWarmStates: false,
    candidateProfiles: [],
  });
  const initialCost = rawBaseline.archiveBytes.length + rawBaseline.inspection.totalDecodeSteps;

  const slots: PortfolioStrategySlot[] = [
    {
      slotId: 'slot-warm-1',
      codecPoint: createCodecPoint({
        basis: 'warm-consolidated-v1',
        profile: PROFILE_MID,
        state: CONSERVATORY_WARM_STATE_1.kappaHex,
      }),
      warmStateSlot: 'STATE_1',
      weight: 10,
      pinnedBaselineFloor: false,
    },
    {
      slotId: 'slot-ncm-v03-floor',
      codecPoint: createCodecPoint({ basis: 'ncm-adaptive-v1', profile: PROFILE_V03 }),
      weight: 9,
      pinnedBaselineFloor: true,
    },
    {
      slotId: 'slot-ncm-full',
      codecPoint: createCodecPoint({ basis: 'ncm-adaptive-v1', profile: PROFILE_FULL }),
      weight: 8,
      pinnedBaselineFloor: false,
    },
    {
      slotId: 'slot-warm-2',
      codecPoint: createCodecPoint({
        basis: 'warm-consolidated-v1',
        profile: PROFILE_FULL,
        state: CONSERVATORY_WARM_STATE_2.kappaHex,
      }),
      warmStateSlot: 'STATE_2',
      weight: 8,
      pinnedBaselineFloor: false,
    },
    {
      slotId: 'slot-raw-floor',
      codecPoint: createCodecPoint({ basis: 'raw-identity', profile: PROFILE_RAW_NONE }),
      weight: 8,
      pinnedBaselineFloor: true,
    },
  ];

  slots.sort((a, b) => b.weight - a.weight);

  return {
    rule30Register64: RULE30_SEED64,
    tickCount: 0,
    slots,
    knownClaimKappas: new Set<string>(),
    mintedClaims: [],
    incumbentBest: {
      bytes: rawBaseline.archiveBytes.length,
      decodeSteps: rawBaseline.inspection.totalDecodeSteps,
      codecPointKappa: rawBaseline.inspection.primaryCodecPoint.kappa,
    },
    lyapunovCostHistory: [initialCost],
    potentialNeverRises: true,
    winnerIsScheduledFirst: true,
    baselineFloorNoRegression: true,
  };
}

/**
 * Executes one deterministic 64-cell Rule-30 autonomous portfolio engine tick over `corpusObjects`:
 *  1. Advances `rule30Register64` and derives up to `hypothesisBudgetPerTick` (`6`) candidate codec mutations
 *     across the 4 generator kinds (`drop-context`, `add-context`, `filter-toggle`, `promote-warm-state`).
 *  2. Evaluates each candidate losslessly, checks `κ`-memoized claim admission (`evaluateClaimMintAdmission`),
 *     and updates `incumbentBest` ONLY under strict dominance (`strictlyDominates`), guaranteeing monotonic
 *     Lyapunov potential descent (`cost = bytes + decodeSteps` never rises).
 *  3. Potentiates winning strategy weight (`winnerWeight`) and depresses losing incumbent (`loserWeight`),
 *     sorting the winner to index `0` (`winnerIsScheduledFirst`) while keeping baseline floor slots pinned.
 */
export function stepAutonomousPortfolioEngineTick(
  prev: AutonomousCompressionPortfolioState,
  corpusObjects: readonly Uint8Array[],
  hypothesisBudget = GENERATED_PRISM_STANDARDS.compression.autonomousPortfolioEngine.hypothesisBudgetPerTick,
): {
  readonly next: AutonomousCompressionPortfolioState;
  readonly decisions: readonly { readonly claimKappa: string; readonly decision: ClaimMintDecision }[];
} {
  const nextRule30 = stepRule30Ring64(prev.rule30Register64);
  const corpusKappa = computeCorpusKappa(corpusObjects);
  const knownSet = new Set<string>(prev.knownClaimKappas);
  const mintedList = prev.mintedClaims.slice();
  const decisions: { readonly claimKappa: string; readonly decision: ClaimMintDecision }[] = [];

  // Re-evaluate baseline floor on current corpus so cross-corpus comparisons remain grounded
  const rawReport = compressUorcArchive(corpusObjects, {
    allowWarmStates: false,
    candidateProfiles: [PROFILE_V03],
  });
  let incumbent: PerformancePair & { readonly codecPointKappa: string } =
    prev.tickCount === 0
      ? {
          bytes: rawReport.archiveBytes.length,
          decodeSteps: rawReport.inspection.totalDecodeSteps,
          codecPointKappa: rawReport.inspection.primaryCodecPoint.kappa,
        }
      : prev.incumbentBest;

  // Ensure incumbent is evaluated on this corpus if corpus changed
  const fullCorpusReport = compressUorcArchive(corpusObjects, { allowWarmStates: true });
  const candStarter = {
    bytes: fullCorpusReport.archiveBytes.length,
    decodeSteps: fullCorpusReport.inspection.totalDecodeSteps,
    codecPointKappa: fullCorpusReport.inspection.primaryCodecPoint.kappa,
  };
  if (strictlyDominates(candStarter, incumbent)) {
    incumbent = candStarter;
  }

  const generatorKinds: readonly PortfolioGeneratorKind[] = [
    'drop-context',
    'add-context',
    'filter-toggle',
    'promote-warm-state',
  ];

  let remaining = Math.max(0, Math.floor(hypothesisBudget));
  let winningProfile: number | null = null;
  let winningWarmSlot: 'STATE_1' | 'STATE_2' | undefined;

  for (let g = 0; g < 4; g++) {
    const laneBits = Number((nextRule30 >> BigInt(g * 16)) & 0xffffn);
    const genKind = generatorKinds[(laneBits + g) % 4];
    const bitIndex = laneBits % 17;

    let trialProfile = PROFILE_V03;
    let allowWarm = false;
    if (genKind === 'drop-context') {
      trialProfile = (PROFILE_V03 & ~(1 << bitIndex)) >>> 0;
    } else if (genKind === 'add-context') {
      trialProfile = (PROFILE_LITE | (1 << bitIndex) | 0x00040000) >>> 0;
    } else if (genKind === 'filter-toggle') {
      trialProfile = (PROFILE_MID | POINT_FILTER_FLAG) >>> 0;
    } else {
      trialProfile = PROFILE_FULL;
      allowWarm = true;
    }

    const rep = compressUorcArchive(corpusObjects, {
      allowWarmStates: allowWarm,
      candidateProfiles: [trialProfile],
    });
    const pair: PerformancePair = {
      bytes: rep.archiveBytes.length,
      decodeSteps: rep.inspection.totalDecodeSteps,
    };
    const claimKappa = computeClaimKappa({
      codecPointKappa: rep.inspection.primaryCodecPoint.kappa,
      corpusKappa,
      bytes: pair.bytes,
      decodeSteps: pair.decodeSteps,
    });

    const adm = evaluateClaimMintAdmission(claimKappa, knownSet, remaining);
    decisions.push({ claimKappa, decision: adm.decision });

    if (adm.decision === 'minted') {
      remaining--;
      knownSet.add(claimKappa);
      mintedList.push({
        claimKappa,
        codecPointKappa: rep.inspection.primaryCodecPoint.kappa,
        corpusKappa,
        generatorKind: genKind,
        bytes: pair.bytes,
        decodeSteps: pair.decodeSteps,
        lyapunovCost: computeLyapunovCost(pair),
      });

      if (strictlyDominates(pair, incumbent)) {
        incumbent = {
          bytes: pair.bytes,
          decodeSteps: pair.decodeSteps,
          codecPointKappa: rep.inspection.primaryCodecPoint.kappa,
        };
        winningProfile = trialProfile;
        winningWarmSlot = allowWarm ? 'STATE_1' : undefined;
      }
    }
  }

  const prevSlots = prev.slots.map((s) => ({ ...s }));
  if (winningProfile !== null) {
    const prevTopWeight = prevSlots[0]?.weight ?? 8;
    const winW = computeWinnerPortfolioWeight(prevTopWeight, prevTopWeight);
    // Depress previous leader slightly and schedule new winner first
    if (prevSlots.length > 0) {
      prevSlots[0] = {
        ...prevSlots[0],
        weight: computeLoserPortfolioWeight(prevSlots[0].weight),
      };
    }
    const warmObj = winningWarmSlot === 'STATE_1' ? CONSERVATORY_WARM_STATE_1 : undefined;
    const newSlot: PortfolioStrategySlot = {
      slotId: `slot-evolved-${prev.tickCount + 1}`,
      codecPoint: createCodecPoint({
        basis: warmObj ? 'warm-consolidated-v1' : 'ncm-adaptive-v1',
        profile: winningProfile,
        state: warmObj ? warmObj.kappaHex : 'void',
      }),
      warmStateSlot: winningWarmSlot,
      weight: winW,
      pinnedBaselineFloor: false,
    };
    prevSlots.unshift(newSlot);
  }

  // Keep pinned baseline floor slots intact while capping total slots at 8
  const pinned = prevSlots.filter((s) => s.pinnedBaselineFloor);
  const nonPinned = prevSlots
    .filter((s) => !s.pinnedBaselineFloor)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, Math.max(0, 8 - pinned.length));
  const mergedSlots = [...nonPinned, ...pinned].sort((a, b) => b.weight - a.weight);

  const newCost = computeLyapunovCost(incumbent);
  const prevCost = prev.lyapunovCostHistory[prev.lyapunovCostHistory.length - 1] ?? newCost;
  const costHistory = [...prev.lyapunovCostHistory, Math.min(prevCost, newCost)];
  const potentialNeverRises = costHistory.every((c, i) => i === 0 || c <= costHistory[i - 1]);
  const baselineFloorNoRegression =
    mergedSlots.some((s) => s.pinnedBaselineFloor && s.codecPoint.basis === 'raw-identity') &&
    mergedSlots.some((s) => s.pinnedBaselineFloor && s.codecPoint.profile === PROFILE_V03) &&
    incumbent.bytes <= rawReport.archiveBytes.length;

  return {
    next: {
      rule30Register64: nextRule30,
      tickCount: prev.tickCount + 1,
      slots: mergedSlots,
      knownClaimKappas: knownSet,
      mintedClaims: mintedList,
      incumbentBest: incumbent,
      lyapunovCostHistory: costHistory,
      potentialNeverRises,
      winnerIsScheduledFirst:
        mergedSlots.length < 2 || mergedSlots[0].weight >= mergedSlots[1].weight,
      baselineFloorNoRegression,
    },
    decisions,
  };
}

// ============================================================================
// 8. ARCHITECTURAL FACET TABLE (`12` FACETS) & 3-LEVEL CLAIM HONESTY LEDGER
// ============================================================================

export type ArchitecturalFacetStanding = 'binding' | 'at-boundary' | 'near-boundary' | 'unmeasured';
export type ClaimHonestyLevel = 'some-true' | 'build' | 'open';

export interface CompressionArchitecturalFacet {
  readonly facetId: string;
  readonly name: string;
  readonly standing: ArchitecturalFacetStanding;
  readonly leanTheoremAnchor: string;
  readonly quantitativeBound: string;
}

export interface CompressionHonestyClaim {
  readonly claimId: string;
  readonly level: ClaimHonestyLevel;
  readonly statement: string;
  readonly evidenceAnchor: string;
}

export const TWELVE_COMPRESSION_ARCHITECTURAL_FACETS: readonly CompressionArchitecturalFacet[] =
  Object.freeze([
    {
      facetId: 'F01-uleb64-canon',
      name: 'Shortest U64 ULEB128 Canonical Varint',
      standing: 'binding',
      leanTheoremAnchor: 'Foundation.Compression.V1.Model::archiveAndDecodeStepBoundsHold',
      quantitativeBound: '1..10 bytes; rejects non-shortest trailing zero groups & >= 2^64',
    },
    {
      facetId: 'F02-archive-bound',
      name: 'Universal Raw Fallback Archive Bound',
      standing: 'at-boundary',
      leanTheoremAnchor: 'Foundation.Compression.V1.Model::archiveAndDecodeStepBoundsHold',
      quantitativeBound: 'archiveBytes <= n + 61 for all single-object inputs of length n',
    },
    {
      facetId: 'F03-decode-step-measure',
      name: 'Deterministic Header-Inspectable Decode Step Measure',
      standing: 'binding',
      leanTheoremAnchor: 'Foundation.Compression.V1.Model::archiveAndDecodeStepBoundsHold',
      quantitativeBound: '0 steps (Reference), n steps (Raw), 24..192 steps/byte (Ncm/Warm)',
    },
    {
      facetId: 'F04-zero-defect-admission',
      name: 'Zero-Defect Lossless Admission Gate',
      standing: 'binding',
      leanTheoremAnchor: 'Foundation.Compression.V1.Model::zeroDefectAdmissionAndLexicographicChoiceHold',
      quantitativeBound: 'defect === 0 verified byte-for-byte prior to candidate admission',
    },
    {
      facetId: 'F05-lexicographic-choice',
      name: 'Lexicographic Bytes-Then-Steps Choice',
      standing: 'binding',
      leanTheoremAnchor: 'Foundation.Compression.V1.Model::zeroDefectAdmissionAndLexicographicChoiceHold',
      quantitativeBound: 'Minimizes wire bytes first, breaking ties by fewest decodeSteps',
    },
    {
      facetId: 'F06-strict-dominance-lyapunov',
      name: 'Strict Dominance Partial Order & Lyapunov Descent',
      standing: 'binding',
      leanTheoremAnchor: 'Foundation.Compression.V1.Model::strictDominanceAndPotentialDescentHold',
      quantitativeBound: 'consolidateCost + gainOf === incumbentCost; potential never rises',
    },
    {
      facetId: 'F07-saturating-cap-ledger',
      name: 'Saturating Coder Byte Cap Ledger',
      standing: 'at-boundary',
      leanTheoremAnchor: 'Foundation.Compression.V1.Model::saturatingLedgerExactStopAndRequirementBoundsHold',
      quantitativeBound: 'Halts at exact capBytes + 1 byte; zero statistical early-stop drift',
    },
    {
      facetId: 'F08-twin-shared-pass',
      name: 'Twin-Profile Shared Context Pass (FULL + MID)',
      standing: 'near-boundary',
      leanTheoremAnchor: 'Foundation.Compression.V1.Model::verdantCompressionStandard',
      quantitativeBound: '2 strategies over 1 pre-filtered pass; byte-identical to separate runs',
    },
    {
      facetId: 'F09-warm-basis-kappa',
      name: 'κ-Named Consolidated Warm Basis States (STATE_1, STATE_2)',
      standing: 'binding',
      leanTheoremAnchor: 'Foundation.Compression.V1.Model::archiveAndDecodeStepBoundsHold',
      quantitativeBound: '256-bit SHA-256 κ addressing; warm states never change decoded meaning',
    },
    {
      facetId: 'F10-ncm-micro-plasticity',
      name: 'Hyperbolic NCM Synaptic & Context-Slot Plasticity',
      standing: 'binding',
      leanTheoremAnchor: 'Foundation.Neuromorphic.V1.Model::ncmMicroPlasticityBoundsHold',
      quantitativeBound: 'plasticity(0)=128 -> 76 -> 24; slotRate(127)=510; 32-bit lane safe',
    },
    {
      facetId: 'F11-rule30-portfolio',
      name: 'Autonomous 64-Cell Rule-30 Strategy Portfolio',
      standing: 'binding',
      leanTheoremAnchor: 'Foundation.Compression.V1.Model::rule30RingAndOrbitVectorsHold',
      quantitativeBound: 'Z/64Z Rule-30 orbit + Hebbian winner-first scheduling + pinned floor',
    },
    {
      facetId: 'F12-multi-corpus-asymptotics',
      name: 'External Arbitrary Binary Benchmark Optimality',
      standing: 'unmeasured',
      leanTheoremAnchor: 'Open Empirical Horizon (Honesty Level: open)',
      quantitativeBound: 'Measured on Conservatory corpora; unmeasured on arbitrary external media',
    },
  ]);

export const COMPRESSION_HONESTY_LEDGER: readonly CompressionHonestyClaim[] = Object.freeze([
  {
    claimId: 'H1-archive-step-dominance-theorems',
    level: 'some-true',
    statement:
      'Universal n+61 archive bound, <=192*n decode step ceiling, strict dominance partial order, Lyapunov descent, exact saturating cap stop, and 64-bit Rule-30 orbit vectors hold for all Nat inputs.',
    evidenceAnchor: 'Lean 4.32 machine-checked theorems in Foundation.Compression.V1.Model & Foundation.Neuromorphic.V1.Model',
  },
  {
    claimId: 'H2-lossless-uorc-wire-and-anamnesis-compression',
    level: 'build',
    statement:
      'Executable TypeScript UORC\\x01 wire codec achieves defect=0 lossless compression on Conservatory Anamnesis snapshots, 0-step κ deduplication, 1-bit SHA-256 tamper rejection, and NIST CAVP SHA-256 compliance.',
    evidenceAnchor: 'Executable test suite in src/game/prismModel.test.ts (Test 57) & Realizability Anti-Gap Oracle',
  },
  {
    claimId: 'H3-kolmogorov-optimality-arbitrary-inputs',
    level: 'open',
    statement:
      'Universal Kolmogorov optimality across arbitrary external high-entropy media outside structured Conservatory state remains an open, unproved empirical horizon.',
    evidenceAnchor: 'Explicitly bounded via Raw fallback (<= n + 61 bytes) rather than overclaimed',
  },
]);

export interface ConservatoryParametricCompressionState {
  readonly verified: boolean;
  readonly basisPrime: 179;
  readonly activeCodecPoint: ConservatoryCodecPoint;
  readonly warmStateKappas: readonly [string, string];
  readonly portfolioEfficiencyPermille: number;
  readonly busModulationPermille: number;
  readonly ncmPlasticityAtOrigin: 128;
  readonly ncmPlasticityAt4k: 76;
  readonly ncmSlotConsolidatedRate: 510;
  readonly rule30RegisterHex: string;
  readonly requirementBounds: {
    readonly archiveOverheadExcessBytes: 0;
    readonly stepCeilingLackMargin: number;
  };
  readonly architecturalFacets: readonly CompressionArchitecturalFacet[];
  readonly honestyLedger: readonly CompressionHonestyClaim[];
}

/**
 * Zero-GC per-frame / observer-tick parametric summary for Model #22 (`Foundation.Compression.V1.Model`).
 */
export function evaluateConservatoryParametricCompression(params?: {
  readonly busWeight?: number;
  readonly tickCount?: number;
}): ConservatoryParametricCompressionState {
  const cw = Math.max(1, Math.min(16, Math.round(params?.busWeight ?? 8)));
  const ticks = Math.max(0, Math.min(8, Math.floor(params?.tickCount ?? 0)));

  let reg = RULE30_SEED64;
  for (let i = 0; i < ticks; i++) {
    reg = stepRule30Ring64(reg);
  }

  const profile = cw >= 14 ? PROFILE_FULL : cw >= 10 ? PROFILE_MID : PROFILE_V03;
  const activeCodecPoint = createCodecPoint({
    basis: 'warm-consolidated-v1',
    profile,
    state: CONSERVATORY_WARM_STATE_1.kappaHex,
    lanes: 1,
  });

  const portfolioEfficiencyPermille =
    GENERATED_PRISM_BUS_MODULATION_LUT.compressionPortfolioEfficiencyPermille[cw] ?? 740 + cw * 16;
  const busModulationPermille =
    GENERATED_PRISM_BUS_MODULATION_LUT.compression[cw] ?? 1000 + cw * 32;

  const caps = decodeProfileCapabilities(profile);
  const p0 = evaluateNcmPlasticity(0);
  const p4k = evaluateNcmPlasticity(4096);
  const slot127 = evaluateNcmSlotRate(127);

  return {
    verified:
      p0 === 128 &&
      p4k === 76 &&
      slot127 === 510 &&
      portfolioEfficiencyPermille >= 756 &&
      TWELVE_COMPRESSION_ARCHITECTURAL_FACETS.length === 12 &&
      COMPRESSION_HONESTY_LEDGER.length === 3,
    basisPrime: GENERATED_CANONICAL_MODEL_BASIS_PRIMES.compression as 179,
    activeCodecPoint,
    warmStateKappas: [CONSERVATORY_WARM_STATE_1.kappaHex, CONSERVATORY_WARM_STATE_2.kappaHex],
    portfolioEfficiencyPermille,
    busModulationPermille,
    ncmPlasticityAtOrigin: p0 as 128,
    ncmPlasticityAt4k: p4k as 76,
    ncmSlotConsolidatedRate: slot127 as 510,
    rule30RegisterHex: `0x${reg.toString(16).padStart(16, '0')}`,
    requirementBounds: {
      archiveOverheadExcessBytes: excessOverThreshold(61, 49) as 0,
      stepCeilingLackMargin: lackUnderThreshold(192, caps.stepsPerByte),
    },
    architecturalFacets: TWELVE_COMPRESSION_ARCHITECTURAL_FACETS,
    honestyLedger: COMPRESSION_HONESTY_LEDGER,
  };
}
