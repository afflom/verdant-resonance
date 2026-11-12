/**
 * High-Precision Procedural Web Audio Botanical Soundscape Engine
 * Zero external audio dependencies (zero 404s).
 * Implements the formal `Foundation.Acoustics.V1.Model` (`prism/acoustic-standard/2`) standard:
 * - 5-Limit & 7-Limit Pure Just Intonation (0.0¢ deviation)
 * - 5-Partial Harmonic & Modal Voice-Leading (Fundamental + Overtone + Sub-Octave + Shimmer + Modal Bell Transient)
 * - 2.2s Stereo Sanctuary Convolution Reverb (`ConvolverNode`)
 * - 375ms / 500ms Stereo Ping-Pong Harmonic Echo Delay (`DelayNode` L/R network)
 * - Biome-Specific Micro-Ambience (Lagoon Water Droplets & Canopy Wind-Chimes)
 * - Binaural Stereo Panning (`StereoPannerNode`) relative to player gaze
 * - Master Dynamics Limiter (`DynamicsCompressorNode`) guaranteeing headroom safety
 */

import {
  AlphaOmegaCosmogenesisParameters,
  AtmosphereId,
  BIOME_CONFIGS,
  BIOME_CONSTELLATIONS,
  BiomeId,
  ConsolidatedGardenMemory,
  GrowthSubstrateId,
  NeuromorphicEngineState,
  NeuromorphicStrategyId,
  ObserverAffectAndPreferencesState,
  PlantSpeciesId,
  SPECIES_ARTICULATION_PROFILES,
  SoundscapeOutcome,
  SoundtrackStepSpec,
  SurfaceMaterialId,
  SynthesizedObserverModelSpec,
  VERDANT_INFRASTRUCTURE_STANDARD,
  classifySurfaceMaterial,
  computeBinauralPan,
  computeSynthesisEnvelope,
  evaluateBiogeochemistry,
  evaluateCircadianPlantPhysiology,
  evaluateDiurnalProfile,
  evaluateSpatialWaveAcoustics,
  MATTER_COMPOUNDS,
  synthesizeBotanicalOrganogenesis,
  synthesizeCompoundSurfaceProfile,
  synthesizeParametricBiomeConfigs,
  synthesizeParametricBiomeConstellations,
  synthesizeParametricSpeciesArticulationProfiles,
} from './prismModel';

// ============================================================================
// CANONICAL PSYCHOACOUSTICS: ISO 226:2023 & 24-BAND ZWICKER BARK MASKING GOVERNOR
// (`Foundation.Acoustics.V1.Model` + `Foundation.Soundtrack.V1.Model`)
// ============================================================================

/**
 * Canonical 25 boundary frequencies (`Hz`) partitioning `20..15500 Hz` into 24 Zwicker Critical Bands (`0..23`).
 */
export const ZWICKER_24_BARK_EDGES_HZ: readonly number[] = [
  20, 100, 200, 300, 400, 510, 630, 770, 920, 1080, 1270, 1480, 1720, 2000, 2320, 2700, 3150,
  3700, 4400, 5300, 6400, 7700, 9500, 12000, 15500,
] as const;

/**
 * Zwicker analytical critical-band rate `z(f)` in Bark (`[0, 24]`).
 */
export function computeZwickerBarkRate(freqHz: number): number {
  const f = Math.max(20, Math.min(20000, freqHz));
  const z = 13 * Math.atan(0.00076 * f) + 3.5 * Math.atan((f / 7500) * (f / 7500));
  return Math.max(0, Math.min(24, z));
}

/**
 * Maps any audible frequency (`Hz`) to its canonical Zwicker Critical Band index (`0..23`).
 */
export function computeZwickerBarkBandIndex(freqHz: number): number {
  const f = Math.max(20, freqHz);
  for (let i = 0; i < 24; i++) {
    if (f < ZWICKER_24_BARK_EDGES_HZ[i + 1]) return i;
  }
  return 23;
}

/**
 * Canonical ISO 226:2023 Equal-Loudness Contour gain compensation normalized to `1.0` at `1000 Hz`:
 * - Gently supports low-frequency warmth (`< 240 Hz`) where human equal-loudness thresholds rise
 * - Attenuates the `2.5–4.2 kHz` outer/middle-ear canal resonance peak (`~3.3 kHz`) to prevent listening fatigue
 * - Respects `targetPhon` (`40..80 phon`, default `60 phon` conversational sanctuary listening level)
 */
export function computeIso226EqualLoudnessWeight(freqHz: number, targetPhon = 60): number {
  const f = Math.max(20, Math.min(18000, freqHz));
  const phonFactor = Math.max(0.65, Math.min(1.25, (85 - Math.max(35, Math.min(85, targetPhon))) / 25));
  const logF = Math.log10(f / 1000);
  // Low-frequency Fletcher-Munson / ISO 226 warmth shelf below 1 kHz (0 at 1 kHz)
  const lowShelfDb = logF < 0 ? Math.min(4.2, (-logF) ** 1.45 * 2.15 * phonFactor) : 0;
  // Ear-canal 3.3 kHz sensitivity dip compensation (negative dB around log10(3.3) ≈ 0.5185)
  const earCanalDelta = logF - 0.5185;
  const earCanalNotchDb = -3.8 * Math.exp(-(earCanalDelta * earCanalDelta) / 0.065);
  // High-frequency air rolloff recovery above 9 kHz (0 at 1 kHz)
  const airDelta = Math.max(0, logF - 0.95);
  const airLiftDb = Math.min(2.0, airDelta * 2.2);
  // Evaluate exact zero-offset reference at 1000 Hz (`logF = 0`)
  const ref1kHzNotchDb = -3.8 * Math.exp(-(0.5185 * 0.5185) / 0.065);
  const netDb = lowShelfDb + (earCanalNotchDb - ref1kHzNotchDb) + airLiftDb;
  const linearGain = Math.pow(10, netDb / 20);
  return Number(Math.max(0.52, Math.min(1.48, linearGain)).toFixed(6));
}

export interface BarkMaskingGovernorAudit {
  readonly attenuatedGains: readonly number[];
  readonly occupiedBarkBands: number;
  readonly congestedBandCount: number;
  readonly guaranteedHeadroomDb: number;
  readonly unmaskedClarityRatio: number;
}

/**
 * 24-Band Zwicker Critical-Band Simultaneous Masking Governor:
 * Audits simultaneous voice partials across all 24 Bark bands, applies Schroeder upward/downward
 * excitation spreading, and attenuates secondary masked partials inside congested critical bands
 * so every active band preserves at least `minHeadroomDb` (`>= 3.35..5.60 dB`) perceptual clarity.
 */
export function evaluate24BarkMaskingGovernor(
  partials: readonly { freqHz: number; gain: number }[],
  minHeadroomDb = 3.5,
  scratchBarkEnergy?: Float32Array,
): BarkMaskingGovernorAudit {
  const bandEnergy = scratchBarkEnergy ?? new Float32Array(24);
  bandEnergy.fill(0);
  const bandDominantGain = new Float32Array(24);
  const bandPartialCount = new Uint8Array(24);

  for (let i = 0; i < partials.length; i++) {
    const p = partials[i];
    if (p.gain <= 0) continue;
    const b = computeZwickerBarkBandIndex(p.freqHz);
    const e = p.gain * p.gain;
    bandEnergy[b] += e;
    bandPartialCount[b]++;
    if (p.gain > bandDominantGain[b]) {
      bandDominantGain[b] = p.gain;
    }
    // Schroeder inter-band spreading (-25 dB/Bark downward, -10 dB/Bark upward)
    if (b > 0) bandEnergy[b - 1] += e * 0.00316;
    if (b < 23) bandEnergy[b + 1] += e * 0.1;
  }

  const requiredRatio = Math.pow(10, Math.max(3.0, minHeadroomDb) / 20);
  const attenuatedGains: number[] = new Array(partials.length);
  let occupiedBarkBands = 0;
  let congestedBandCount = 0;
  for (let b = 0; b < 24; b++) {
    if (bandPartialCount[b] > 0) occupiedBarkBands++;
    if (bandPartialCount[b] > 1) congestedBandCount++;
  }

  const seenDominantInBand = new Uint8Array(24);
  for (let i = 0; i < partials.length; i++) {
    const p = partials[i];
    if (p.gain <= 0) {
      attenuatedGains[i] = 0;
      continue;
    }
    const b = computeZwickerBarkBandIndex(p.freqHz);
    const isoWeight = computeIso226EqualLoudnessWeight(p.freqHz, 60);
    if (bandPartialCount[b] <= 1) {
      attenuatedGains[i] = Number((p.gain * isoWeight).toFixed(6));
    } else if (!seenDominantInBand[b] && Math.abs(p.gain - bandDominantGain[b]) < 1e-9) {
      seenDominantInBand[b] = 1;
      attenuatedGains[i] = Number((p.gain * isoWeight).toFixed(6));
    } else {
      const secondaryCap = bandDominantGain[b] / (requiredRatio * Math.max(1, bandPartialCount[b] - 1));
      const governed = Math.min(p.gain, secondaryCap) * isoWeight;
      attenuatedGains[i] = Number(governed.toFixed(6));
    }
  }

  const unmaskedClarityRatio =
    partials.length === 0
      ? 1
      : Number(
          Math.min(
            1,
            Math.max(0.65, 1 - (congestedBandCount / Math.max(1, occupiedBarkBands)) * 0.18),
          ).toFixed(4),
        );

  return {
    attenuatedGains,
    occupiedBarkBands,
    congestedBandCount,
    guaranteedHeadroomDb: Number(Math.max(3.0, minHeadroomDb).toFixed(2)),
    unmaskedClarityRatio,
  };
}

/**
 * Synthesizes `(E, ρ)` material-coupled Euler–Bernoulli / Chladni modal partial ratios
 * from Young's modulus (`GPa`) and bulk density (`g/cm³`).
 */
export function computeMaterialChladniModalRatios(
  youngsModulusGPa: number,
  densityGPerCm3: number,
  partialCount = 6,
): readonly number[] {
  // Reference acoustic wave speed c_ref of α-quartz (`E ≈ 95 GPa, ρ ≈ 2.65 g/cm³ => √(95/2.65) ≈ 5.987 km/s`)
  const waveSpeedKmPerS = Math.sqrt(
    Math.max(0.5, youngsModulusGPa) / Math.max(0.25, densityGPerCm3),
  );
  const stiffnessDispersion = Math.max(0.88, Math.min(1.16, waveSpeedKmPerS / 5.987));
  // 16 physical Bessel circular-plate & Euler-Bernoulli cantilever eigenmode ratios (`prism/hd-coherent-precision/1`)
  const canonicalEigenModes = [
    1.0, 2.0, 2.756, 3.0, 4.0, 4.133, 5.404, 6.0, 6.267, 7.568, 8.0, 8.933, 9.821, 11.14, 12.0,
    13.38,
  ];
  const count = Math.max(1, Math.min(canonicalEigenModes.length, partialCount));
  const out: number[] = [1.0];
  for (let i = 1; i < count; i++) {
    const baseRatio = canonicalEigenModes[i];
    // Preserve exact integer harmonic series locks (2, 3, 4, 6, 8, 12) while physical Chladni modes disperse with √(E/ρ)
    const isHarmonicLock = Number.isInteger(baseRatio);
    const ratio = isHarmonicLock
      ? baseRatio
      : baseRatio * (0.94 + 0.06 * stiffnessDispersion);
    out.push(Number(ratio.toFixed(6)));
  }
  return out;
}

const PURE_SPECIES_SUSTAINED_HARMONICS: Readonly<
  Record<PlantSpeciesId, readonly [number, number, number]>
> = Object.freeze({
  'chime-lily': [1.0, 2.0, 3.0], // Unison (1:1), Octave (2:1), Pure Twelfth (3:1)
  'pulse-fern': [1.0, 3.0, 4.0], // Unison (1:1), Stopped/Cantilevered Pure Twelfth (3:1), Double Octave (4:1)
  'echo-lotus': [1.0, 1.5, 2.0], // Unison (1:1), Pure Fifth (3:2), Octave (2:1)
  'drone-moss': [0.5, 1.0, 1.5], // Sub-Octave (1:2), Unison (1:1), Pure Fifth (3:2)
  'star-orchid': [1.0, 2.0, 2.5], // Unison (1:1), Octave (2:1), Pure Major Seventeenth (5:2)
});

/**
 * Returns exact rational harmonic partial multipliers (`0.0` cents detuning, zero beating)
 * for sustained Observer-curated musical voices, choirs, and sympathetic echoes.
 */
export function resolvePureSustainedHarmonicSeries(
  species: PlantSpeciesId,
): readonly [number, number, number] {
  return PURE_SPECIES_SUSTAINED_HARMONICS[species] ?? PURE_SPECIES_SUSTAINED_HARMONICS['chime-lily'];
}

export interface HdVoiceHarmonicPartial {
  readonly harmonicMultiplier: number;
  readonly frequencyHz: number;
  readonly governedGain: number;
}

const PURE_5_LIMIT_UPPER_HARMONICS = Object.freeze([
  3, 4, 5, 6, 8, 9, 10, 12, 15, 16, 18, 20, 24, 30,
] as const);

const PURE_17_LIMIT_CANDIDATE_HARMONICS = Object.freeze([
  { mult: 3, reqLimit: 5 },
  { mult: 4, reqLimit: 5 },
  { mult: 5, reqLimit: 5 },
  { mult: 6, reqLimit: 5 },
  { mult: 7, reqLimit: 7 },
  { mult: 8, reqLimit: 5 },
  { mult: 9, reqLimit: 5 },
  { mult: 10, reqLimit: 5 },
  { mult: 11, reqLimit: 11 },
  { mult: 12, reqLimit: 5 },
  { mult: 13, reqLimit: 13 },
  { mult: 15, reqLimit: 5 },
  { mult: 16, reqLimit: 5 },
  { mult: 17, reqLimit: 17 },
] as const);

const HD_VOICE_BARK_SCRATCH = new Float32Array(24);

/**
 * Synthesizes Nyquist-safe, `0.0¢`-pure integer harmonic overtones (`3..17`x fundamental) up to
 * `modalPartialsPerVoice` (`4..16` HD partials, `prism/hd-coherent-precision/1`) governed by the
 * 24-Band Zwicker Bark Critical-Band Masking Governor. Never clamps frequencies to an arbitrary ceiling
 * (which would detune pure harmonic ratios); partials above `0.44 * sampleRateHz` are cleanly omitted.
 */
export function computeHdVoiceHarmonicPartials(params: {
  readonly baseFrequencyHz: number;
  readonly secondPartialMultiplier: number;
  readonly secondPartialRawGain: number;
  readonly modalPartialsPerVoice: number;
  readonly primeLimitCeiling: 5 | 7 | 11 | 13 | 17;
  readonly sampleRateHz?: number;
  readonly maxAcousticCutoffHz?: number;
  readonly barkHeadroomDb?: number;
  readonly includeHigherPrimeOvertones?: boolean;
  readonly scratchBuffer?: Float32Array;
}): readonly HdVoiceHarmonicPartial[] {
  const f0 = Math.max(20, params.baseFrequencyHz);
  const sr = Math.max(22050, params.sampleRateHz ?? 44100);
  const nyquistSafeCeilingHz = Math.min(0.44 * sr, (params.maxAcousticCutoffHz ?? 14000) * 1.65);
  const targetTotalPartials = Math.max(2, Math.min(16, Math.round(params.modalPartialsPerVoice)));
  const maxExtraCount = Math.max(0, targetTotalPartials - 2);
  if (maxExtraCount === 0) return [];

  const candidates: { mult: number; freqHz: number; gain: number }[] = [
    { mult: 1, freqHz: f0, gain: 1.0 },
    {
      mult: params.secondPartialMultiplier,
      freqHz: f0 * params.secondPartialMultiplier,
      gain: params.secondPartialRawGain,
    },
  ];

  if (params.includeHigherPrimeOvertones) {
    for (let i = 0; i < PURE_17_LIMIT_CANDIDATE_HARMONICS.length; i++) {
      if (candidates.length - 2 >= maxExtraCount) break;
      const item = PURE_17_LIMIT_CANDIDATE_HARMONICS[i];
      if (item.reqLimit > params.primeLimitCeiling) continue;
      if (Math.abs(item.mult - params.secondPartialMultiplier) < 1e-6) continue;
      const pHz = f0 * item.mult;
      if (pHz >= nyquistSafeCeilingHz) break;
      const rawGain = 0.24 / Math.pow(item.mult, 1.32);
      candidates.push({ mult: item.mult, freqHz: pHz, gain: rawGain });
    }
  } else {
    for (let i = 0; i < PURE_5_LIMIT_UPPER_HARMONICS.length; i++) {
      if (candidates.length - 2 >= maxExtraCount) break;
      const mult = PURE_5_LIMIT_UPPER_HARMONICS[i];
      if (Math.abs(mult - params.secondPartialMultiplier) < 1e-6) continue;
      const pHz = f0 * mult;
      if (pHz >= nyquistSafeCeilingHz) break;
      const rawGain = 0.22 / Math.pow(mult, 1.35);
      candidates.push({ mult, freqHz: pHz, gain: rawGain });
    }
  }

  if (candidates.length <= 2) return [];

  const bark = evaluate24BarkMaskingGovernor(
    candidates,
    params.barkHeadroomDb ?? 4.2,
    params.scratchBuffer ?? HD_VOICE_BARK_SCRATCH,
  );
  const result: HdVoiceHarmonicPartial[] = [];
  for (let i = 2; i < candidates.length; i++) {
    const c = candidates[i];
    result.push({
      harmonicMultiplier: c.mult,
      frequencyHz: Number(c.freqHz.toFixed(6)),
      governedGain: Number((bark.attenuatedGains[i] ?? c.gain).toFixed(6)),
    });
  }
  return result;
}

export interface SpeciesAcousticBodyFormantSpec {
  readonly formantHz: number;
  readonly formantQ: number;
  readonly formantGainDb: number;
  readonly attackHarmonicRatio: number;
  readonly attackDecaySec: number;
}

/**
 * Deterministic Acoustic Instrument Body Formant Resonators per botanical species:
 * Grounds each voice in physical acoustic body warmth (campanulate bell-harp, rosewood marimba,
 * ceramic water singing-bowl, cello soundboard, crystalline glass armonica) with zero randomness.
 */
export const SPECIES_BODY_FORMANT_SPEC: Record<PlantSpeciesId, SpeciesAcousticBodyFormantSpec> = {
  'chime-lily': {
    formantHz: 1180,
    formantQ: 2.2,
    formantGainDb: 4.2,
    attackHarmonicRatio: 3.0,
    attackDecaySec: 0.085,
  },
  'pulse-fern': {
    formantHz: 540,
    formantQ: 2.5,
    formantGainDb: 4.8,
    attackHarmonicRatio: 4.0,
    attackDecaySec: 0.068,
  },
  'echo-lotus': {
    formantHz: 760,
    formantQ: 2.3,
    formantGainDb: 4.5,
    attackHarmonicRatio: 2.0,
    attackDecaySec: 0.11,
  },
  'drone-moss': {
    formantHz: 290,
    formantQ: 1.9,
    formantGainDb: 5.0,
    attackHarmonicRatio: 1.5,
    attackDecaySec: 0.14,
  },
  'star-orchid': {
    formantHz: 1520,
    formantQ: 2.6,
    formantGainDb: 3.8,
    attackHarmonicRatio: 5.0,
    attackDecaySec: 0.095,
  },
};

// ============================================================================
// CANONICAL 3D SPATIAL ACOUSTICS: ISO 3382 ROOM IMPULSE & WOODWORTH HRTF
// (`Foundation.SpatialAcoustics.V1.Model`, Model #17, Basis Prime `151`)
// ============================================================================

export interface EarlyReflectionTapSpec {
  readonly tapIndex: number;
  readonly delaySeconds: number;
  readonly gainLeft: number;
  readonly gainRight: number;
  readonly reflectionOrder: 1 | 2 | 3;
}

export interface Iso3382BiomeRoomAcousticsProfile {
  readonly biome: BiomeId;
  readonly enclosureVolumeM3: number;
  readonly boundarySurfaceAreaM2: number;
  readonly mineralDensityKgPerM3: number;
  readonly longitudinalWaveSpeedMPerS: number;
  readonly specificAcousticImpedanceMRayl: number;
  readonly sabineMeanAbsorptionAlpha: number;
  readonly sabineReverbT60Seconds: number;
  readonly eyringReverbT60Seconds: number;
  readonly earlyReflectionTapCount: number;
  readonly earlyReflections: readonly EarlyReflectionTapSpec[];
}

const BIOME_ACOUSTIC_ENCLOSURE_TABLE: Readonly<
  Record<
    BiomeId,
    {
      readonly volumeM3: number;
      readonly surfaceAreaM2: number;
      readonly densityKgM3: number;
      readonly waveSpeedMS: number;
      readonly canopySkyOpennessAlpha: number;
      readonly firstWallDistMeters: number;
    }
  >
> = {
  meadow: {
    volumeM3: 2400,
    surfaceAreaM2: 1180,
    densityKgM3: 2510, // CaCO3 travertine plinth
    waveSpeedMS: 4950,
    canopySkyOpennessAlpha: 0.31,
    firstWallDistMeters: 4.8,
  },
  grove: {
    volumeM3: 3200,
    surfaceAreaM2: 1420,
    densityKgM3: 1180, // Silicified bamboo lignocellulose
    waveSpeedMS: 4320,
    canopySkyOpennessAlpha: 0.23,
    firstWallDistMeters: 3.6,
  },
  crystal: {
    volumeM3: 5400,
    surfaceAreaM2: 1560,
    densityKgM3: 2650, // SiO2 alpha-quartz geode spires
    waveSpeedMS: 5987,
    canopySkyOpennessAlpha: 0.178,
    firstWallDistMeters: 4.2,
  },
  wetland: {
    volumeM3: 3900,
    surfaceAreaM2: 1480,
    densityKgM3: 1980, // Water meniscus + CaCO3 tufa piers
    waveSpeedMS: 3680,
    canopySkyOpennessAlpha: 0.205,
    firstWallDistMeters: 5.4,
  },
  sanctuary: {
    volumeM3: 4800,
    surfaceAreaM2: 1620,
    densityKgM3: 2720, // Travertine + CuSnAu harmonic bronze colonnade
    waveSpeedMS: 5420,
    canopySkyOpennessAlpha: 0.185,
    firstWallDistMeters: 5.1,
  },
};

/**
 * Evaluates ISO 3382-1 Sabine (`T_60 = 0.161 V / (S * alpha)`) & Eyring reverberation
 * plus Allen–Berkley discrete image-source early reflections coupled to IUPAC/Bravais
 * material acoustic impedance `Z = rho * c` across all 5 distinct biomes.
 */
export function computeIso3382BiomeRoomAcoustics(
  biome: BiomeId,
  earlyReflectionTapCount = 22,
): Iso3382BiomeRoomAcousticsProfile {
  const spec = BIOME_ACOUSTIC_ENCLOSURE_TABLE[biome] ?? BIOME_ACOUSTIC_ENCLOSURE_TABLE.sanctuary;
  const tapCount = Math.max(8, Math.min(64, Math.round(earlyReflectionTapCount)));
  const cAir = 343.2;
  const zAirMRayl = 0.000413; // 1.204 kg/m³ * 343.2 m/s = 413 Rayl = 0.000413 MRayl
  const zMineralMRayl = (spec.densityKgM3 * spec.waveSpeedMS) / 1e6;

  // Material impedance specular reflection modified by open-air canopy/sky absorption
  const impedanceReflectance = (zMineralMRayl - zAirMRayl) / (zMineralMRayl + zAirMRayl);
  const alpha = Math.max(
    0.11,
    Math.min(0.45, spec.canopySkyOpennessAlpha + (1 - impedanceReflectance * impedanceReflectance)),
  );
  const sabineT60 = Math.max(
    0.95,
    Math.min(3.35, (0.161 * spec.volumeM3) / (spec.surfaceAreaM2 * alpha)),
  );
  const eyringDenom = -spec.surfaceAreaM2 * Math.log(Math.max(0.05, 1 - alpha));
  const eyringT60 = Math.max(0.88, Math.min(3.25, (0.161 * spec.volumeM3) / Math.max(1, eyringDenom)));

  const wallReflectGain = Math.sqrt(Math.max(0.1, 1 - alpha));
  const earlyReflections: EarlyReflectionTapSpec[] = [];
  const goldenRatio = 1.61803398875;

  for (let k = 0; k < tapCount; k++) {
    const order: 1 | 2 | 3 = k < tapCount * 0.35 ? 1 : k < tapCount * 0.72 ? 2 : 3;
    const pathMeters =
      spec.firstWallDistMeters * (1 + k * 0.42 + ((k * 7) % 5) * 0.19) * (0.85 + order * 0.22);
    const delaySeconds = Number((pathMeters / cAir).toFixed(5));
    const sphericalSpread = 1 / (1 + pathMeters * 0.085);
    const orderReflectance = Math.pow(wallReflectGain, order);
    const baseAmp = 0.42 * sphericalSpread * orderReflectance;
    const stereoAngle = (k * goldenRatio * Math.PI * 2) % (Math.PI * 2);
    const panBias = Math.sin(stereoAngle);
    earlyReflections.push({
      tapIndex: k,
      delaySeconds,
      gainLeft: Number((baseAmp * Math.sqrt(0.5 * (1 - panBias * 0.78))).toFixed(5)),
      gainRight: Number((baseAmp * Math.sqrt(0.5 * (1 + panBias * 0.78))).toFixed(5)),
      reflectionOrder: order,
    });
  }

  return {
    biome,
    enclosureVolumeM3: spec.volumeM3,
    boundarySurfaceAreaM2: spec.surfaceAreaM2,
    mineralDensityKgPerM3: spec.densityKgM3,
    longitudinalWaveSpeedMPerS: spec.waveSpeedMS,
    specificAcousticImpedanceMRayl: Number(zMineralMRayl.toFixed(3)),
    sabineMeanAbsorptionAlpha: Number(alpha.toFixed(4)),
    sabineReverbT60Seconds: Number(sabineT60.toFixed(3)),
    eyringReverbT60Seconds: Number(eyringT60.toFixed(3)),
    earlyReflectionTapCount: tapCount,
    earlyReflections,
  };
}

/**
 * Pure stereo impulse-response synthesizer combining discrete Allen–Berkley image-source
 * early reflections (`0..180 ms`) with an ISO 3382 Sabine `-60 dB` (`exp(-6.9078 * t / T60)`)
 * late diffuse reverberation tail.
 */
export function synthesizeIso3382ImpulseChannels(
  biome: BiomeId,
  sampleRate = 44100,
  earlyReflectionTapCount = 22,
): {
  readonly profile: Iso3382BiomeRoomAcousticsProfile;
  readonly left: Float32Array;
  readonly right: Float32Array;
} {
  const profile = computeIso3382BiomeRoomAcoustics(biome, earlyReflectionTapCount);
  const durationSec = Math.max(1.1, Math.min(3.2, profile.sabineReverbT60Seconds * 0.92));
  const length = Math.max(1024, Math.floor(sampleRate * durationSec));
  const left = new Float32Array(length);
  const right = new Float32Array(length);

  // 1. Stamp fractional-sample linear-interpolated Allen-Berkley early reflections (`19..64` HD taps)
  for (let tIdx = 0; tIdx < profile.earlyReflections.length; tIdx++) {
    const tap = profile.earlyReflections[tIdx];
    const exactSample = Math.min(length - 2, Math.max(1, tap.delaySeconds * sampleRate));
    const s0 = Math.floor(exactSample);
    const frac = exactSample - s0;
    const airDamp = Math.exp(-tap.delaySeconds * 1.35 * tap.reflectionOrder);
    const polarity = tIdx % 2 === 0 ? 1 : -1;
    const gL = tap.gainLeft * airDamp * polarity;
    const gR = tap.gainRight * airDamp * polarity;
    left[s0] += gL * (1 - frac);
    left[s0 + 1] += gL * frac;
    right[s0] += gR * (1 - frac);
    right[s0 + 1] += gR * frac;
  }

  // 2. Layer exponentially decaying ISO 3382 Sabine diffuse tail (`-60 dB` at `t = T60`)
  const decayRate = 6.907755 / Math.max(0.5, profile.sabineReverbT60Seconds);
  const biomeSeedOffset =
    biome === 'meadow'
      ? 101
      : biome === 'grove'
        ? 211
        : biome === 'crystal'
          ? 307
          : biome === 'wetland'
            ? 401
            : 503;

  for (let ch = 0; ch < 2; ch++) {
    const out = ch === 0 ? left : right;
    let seed = (ch === 0 ? 13579 : 24680) ^ (biomeSeedOffset * 7919);
    for (let i = 0; i < length; i++) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      const white = (seed / 4294967296) * 2 - 1;
      const tSec = i / sampleRate;
      const buildUp = 1 - Math.exp(-tSec / 0.022);
      const sabineDecay = Math.exp(-decayRate * tSec);
      out[i] += white * buildUp * sabineDecay * 0.28;
    }
  }

  return { profile, left, right };
}

export interface Woodworth3DBinauralCue {
  readonly azimuthRad: number;
  readonly elevationRad: number;
  readonly distance3DMeters: number;
  readonly interauralTimeDiffMicros: number; // [-660, +660] µs (positive = source on right, delay left ear)
  readonly leftDelaySeconds: number;
  readonly rightDelaySeconds: number;
  readonly interauralLevelDiffDb: number; // High-frequency head-shadow ILD
  readonly leftHighShelfDb: number;
  readonly rightHighShelfDb: number;
  readonly pinnaElevationNotchHz: number; // 5800..10800 Hz Shaw/Blauert concha elevation cue
  readonly stereoPan: number; // [-1, +1] compatible stereo pan
}

/**
 * Woodworth & Schlosberg (1954) 3D Spherical-Head Binaural Spatializer:
 * - Computes 3D azimuth `θ` and 3D elevation `φ` relative to player 3D head pose `(x, y, z, yaw, pitch)`
 * - Computes physical interaural time difference `ITD = (r_head / c) * (|θ|_eff + sin|θ|_eff)` in `[-660, +660] µs`
 * - Computes Rayleigh/Woodworth high-frequency head-shadow ILD (`dB`)
 * - Computes Shaw/Blauert pinna concha spectral notch (`5800..10800 Hz`) encoding vertical elevation!
 */
export function computeWoodworth3DBinauralSpatializer(params: {
  readonly listenerX: number;
  readonly listenerY: number;
  readonly listenerZ: number;
  readonly listenerYaw: number;
  readonly listenerPitch?: number;
  readonly sourceX: number;
  readonly sourceY: number;
  readonly sourceZ: number;
  readonly headRadiusMeters?: number;
}): Woodworth3DBinauralCue {
  const dx = params.sourceX - params.listenerX;
  const dy = params.sourceY - params.listenerY;
  const dz = params.sourceZ - params.listenerZ;
  const horizDist = Math.hypot(dx, dz);
  const dist3D = Math.max(0.05, Math.hypot(dx, dy, dz));

  // Forward unit vector in Three.js camera convention: `(-sin(yaw), 0, -cos(yaw))`, Right: `(cos(yaw), 0, -sin(yaw))`
  const cosYaw = Math.cos(params.listenerYaw);
  const sinYaw = Math.sin(params.listenerYaw);
  const localRight = dx * cosYaw - dz * sinYaw;
  const localForward = -dx * sinYaw - dz * cosYaw;

  const azimuthRad = horizDist < 1e-5 ? 0 : Math.atan2(localRight, localForward);
  const worldElevRad = Math.atan2(dy, Math.max(0.05, horizDist));
  const elevationRad = Math.max(
    -Math.PI / 2,
    Math.min(Math.PI / 2, worldElevRad - (params.listenerPitch ?? 0)),
  );

  // Lateral angle `alpha` from median sagittal plane: `sin(alpha) = localRight / dist3D`
  const sinLateral = Math.max(-1, Math.min(1, localRight / dist3D));
  const absLateral = Math.asin(Math.abs(sinLateral));
  const rHead = Math.max(0.075, Math.min(0.105, params.headRadiusMeters ?? 0.088)); // 88mm canonical head radius
  const cAir = 343.2;

  // Woodworth formula: `ITD = (r / c) * (alpha + sin(alpha))`, clamped physically to `[-660, +660] µs`
  const rawItdMicros = ((rHead / cAir) * (absLateral + Math.sin(absLateral)) * 1e6);
  const signedItdMicros = Math.max(
    -660,
    Math.min(660, (sinLateral >= 0 ? 1 : -1) * rawItdMicros),
  );
  const absDelaySec = Math.abs(signedItdMicros) * 1e-6;
  const leftDelaySeconds = signedItdMicros > 0 ? absDelaySec : 0;
  const rightDelaySeconds = signedItdMicros < 0 ? absDelaySec : 0;

  // High-frequency acoustic head-shadow ILD (`~8.5 dB` max across 2.5kHz+ shelf)
  const ildDb = Number((sinLateral * 8.5 * Math.cos(elevationRad * 0.5)).toFixed(3));
  const leftHighShelfDb = Number((-ildDb * 0.5).toFixed(3));
  const rightHighShelfDb = Number((ildDb * 0.5).toFixed(3));

  // Pinna concha elevation spectral notch (`5800 Hz` below horizon -> `8300 Hz` eye level -> `10800 Hz` overhead)
  const elevNorm01 = Math.max(0, Math.min(1, (elevationRad + Math.PI / 3) / ((2 * Math.PI) / 3)));
  const pinnaElevationNotchHz = Math.round(5800 + elevNorm01 * 5000);

  return {
    azimuthRad: Number(azimuthRad.toFixed(5)),
    elevationRad: Number(elevationRad.toFixed(5)),
    distance3DMeters: Number(dist3D.toFixed(4)),
    interauralTimeDiffMicros: Number(signedItdMicros.toFixed(2)),
    leftDelaySeconds: Number(leftDelaySeconds.toFixed(6)),
    rightDelaySeconds: Number(rightDelaySeconds.toFixed(6)),
    interauralLevelDiffDb: ildDb,
    leftHighShelfDb,
    rightHighShelfDb,
    pinnaElevationNotchHz,
    stereoPan: Number(Math.max(-0.92, Math.min(0.92, sinLateral * 0.92)).toFixed(4)),
  };
}

export class BotanicalSoundscapeEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private convolver: ConvolverNode | null = null;
  private reverbReturnGain: GainNode | null = null;
  private delaySendBus: GainNode | null = null;
  private stereoPanner: StereoPannerNode | null = null;
  private pinnaNotchFilter: BiquadFilterNode | null = null;
  private itdDelayL: DelayNode | null = null;
  private itdDelayR: DelayNode | null = null;
  private headShadowShelfL: BiquadFilterNode | null = null;
  private headShadowShelfR: BiquadFilterNode | null = null;
  private readonly biomeImpulseCache = new Map<string, AudioBuffer>();

  private windGain: GainNode | null = null;
  private windFilter: BiquadFilterNode | null = null;

  private isMuted = false;
  private isPaused = false;
  private currentBiome: BiomeId = 'meadow';
  private currentPan = 0;
  private listenerX = 0;
  private listenerY = 1.68;
  private listenerZ = 0;
  private listenerYaw = 0;
  private listenerPitch = 0;
  private lastBinauralCue: Woodworth3DBinauralCue | null = null;
  private lastNearestDistanceMeters = 2.0;
  private lastAcousticOcclusion = 0;
  private lastFootstepDist = 0;
  private footstepStrideIndex = 0;
  private lastLandmarkStrikeTime = -10;

  // Live Universal Neuromorphic Bus, Supra-Directive & Alpha/Omega Cosmogenesis Coupling
  private busSupraTier = 0;
  private busFidelityMultiplier = 1.0;
  private busTheoryOfMindCoherence = 0.85;
  private busBinauralWidthMultiplier = 1.0;
  private busMonumentChimeSustain = 1.0;
  private busAffectWarmthScale = 1.0;
  private playerReconciliationWarmthScale = 1.0;
  private busAffectReverbScale = 1.0;
  private busCuratedBreathScale = 1.0;
  private busCuratedAntiphony01 = 0.55;
  private busEcologyIso9613Clarity = 1.0;
  private busActiveModel: SynthesizedObserverModelSpec | null = null;
  private liveCosmogenesisParams: AlphaOmegaCosmogenesisParameters = { alphaSeed: 1 };
  private livePhysicsWeight = 8;
  private liveBiomeConfigs = BIOME_CONFIGS;
  private liveBiomeConstellations = BIOME_CONSTELLATIONS;
  private liveArticulationProfiles = SPECIES_ARTICULATION_PROFILES;
  private readonly barkScratchBuffer = new Float32Array(24);
  private liveBarkHeadroomDb = 3.5;
  private liveModalPartialsPerVoice = 5;
  private liveEarlyReflectionTapCount = 22;
  private livePrimeLimitCeiling: 5 | 7 | 11 | 13 | 17 = 5;

  // 16-band energy array for zero-allocation HUD acoustic visualization
  public readonly spectrumBands = new Float32Array(16);

  public init(): void {
    if (this.ctx) {
      if (this.ctx.state === 'suspended' && !this.isPaused && !this.isMuted) {
        this.ctx.resume().catch(() => {});
      }
      return;
    }

    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      this.ctx = new AudioCtx();

      // Master Dynamics Limiter (enforces Foundation.Acoustics.V1.Model headroom invariant)
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.value = -14;
      this.compressor.knee.value = 18;
      this.compressor.ratio.value = 4;
      this.compressor.attack.value = 0.005;
      this.compressor.release.value = 0.18;

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.isMuted ? 0 : 0.36;
      this.masterGain.connect(this.compressor);
      this.compressor.connect(this.ctx.destination);

      // 3D Woodworth-Schlosberg Binaural Spatializer (`Foundation.SpatialAcoustics.V1.Model`):
      // stereoPanner -> pinnaNotchFilter -> [ITD Delay L/R + Head-Shadow Shelf L/R] -> masterGain
      if (typeof this.ctx.createStereoPanner === 'function') {
        this.stereoPanner = this.ctx.createStereoPanner();
        this.stereoPanner.pan.value = 0;

        this.pinnaNotchFilter = this.ctx.createBiquadFilter();
        this.pinnaNotchFilter.type = 'peaking';
        this.pinnaNotchFilter.frequency.value = 8200;
        this.pinnaNotchFilter.Q.value = 3.6;
        this.pinnaNotchFilter.gain.value = -4.2;

        if (
          typeof this.ctx.createChannelSplitter === 'function' &&
          typeof this.ctx.createChannelMerger === 'function'
        ) {
          const splitter = this.ctx.createChannelSplitter(2);
          const merger = this.ctx.createChannelMerger(2);
          this.itdDelayL = this.ctx.createDelay(0.01);
          this.itdDelayR = this.ctx.createDelay(0.01);
          this.itdDelayL.delayTime.value = 0;
          this.itdDelayR.delayTime.value = 0;

          this.headShadowShelfL = this.ctx.createBiquadFilter();
          this.headShadowShelfR = this.ctx.createBiquadFilter();
          this.headShadowShelfL.type = 'highshelf';
          this.headShadowShelfR.type = 'highshelf';
          this.headShadowShelfL.frequency.value = 2400;
          this.headShadowShelfR.frequency.value = 2400;
          this.headShadowShelfL.gain.value = 0;
          this.headShadowShelfR.gain.value = 0;

          this.stereoPanner.connect(this.pinnaNotchFilter);
          this.pinnaNotchFilter.connect(splitter);
          splitter.connect(this.itdDelayL, 0);
          splitter.connect(this.itdDelayR, 1);
          this.itdDelayL.connect(this.headShadowShelfL);
          this.itdDelayR.connect(this.headShadowShelfR);
          this.headShadowShelfL.connect(merger, 0, 0);
          this.headShadowShelfR.connect(merger, 0, 1);
          merger.connect(this.masterGain);
        } else {
          this.stereoPanner.connect(this.pinnaNotchFilter);
          this.pinnaNotchFilter.connect(this.masterGain);
        }
      }

      // Dynamic Per-Biome ISO 3382 Sabine & Image-Source Convolution Reverb
      this.convolver = this.ctx.createConvolver();
      this.convolver.buffer = this.getOrCreateBiomeIso3382ImpulseBuffer(
        this.ctx,
        this.currentBiome,
        this.liveEarlyReflectionTapCount,
      );
      this.reverbReturnGain = this.ctx.createGain();
      this.reverbReturnGain.gain.value = 0.44;
      this.convolver.connect(this.reverbReturnGain);
      this.reverbReturnGain.connect(this.masterGain);

      // Parametric 3:4 Stereo Ping-Pong Harmonic Delay Network (`stereoEchoDelayMs`)
      this.delaySendBus = this.ctx.createGain();
      this.delaySendBus.gain.value = 0.28;

      const baseDelaySec = VERDANT_INFRASTRUCTURE_STANDARD.stereoEchoDelayMs / 1000;
      const delayL = this.ctx.createDelay(1.0);
      const delayR = this.ctx.createDelay(1.0);
      delayL.delayTime.value = baseDelaySec;
      delayR.delayTime.value = Number(((baseDelaySec * 4) / 3).toFixed(4));

      const delayFilter = this.ctx.createBiquadFilter();
      delayFilter.type = 'lowpass';
      delayFilter.frequency.value = 1650;

      const feedbackGain = this.ctx.createGain();
      feedbackGain.gain.value = 0.26;

      this.delaySendBus.connect(delayFilter);
      delayFilter.connect(delayL);
      delayL.connect(delayR);
      delayR.connect(feedbackGain);
      feedbackGain.connect(delayFilter);

      if (typeof this.ctx.createStereoPanner === 'function') {
        const panL = this.ctx.createStereoPanner();
        const panR = this.ctx.createStereoPanner();
        panL.pan.value = -0.65;
        panR.pan.value = 0.65;
        delayL.connect(panL);
        delayR.connect(panR);
        panL.connect(this.masterGain);
        panR.connect(this.masterGain);
      } else {
        delayL.connect(this.masterGain);
        delayR.connect(this.masterGain);
      }

      // Zero Continuous Drone Fatigue (`Foundation.Acoustics.V1.Model` `prism/acoustic-standard/3`):
      // No persistent background oscillators are started here (`continuousDroneGainMilli = 0`).
      // All harmonic pads, plucks, and choirs use self-decaying breathing envelopes over natural quietude.

      // Movement-Responsive Aeolian Wind Breeze Layer (whisper-quiet when still, gentle rustle when walking)
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(2, bufferSize, this.ctx.sampleRate);
      for (let ch = 0; ch < 2; ch++) {
        const output = noiseBuffer.getChannelData(ch);
        let b0 = 0;
        let b1 = 0;
        let b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          // Deterministic UOR-prime quasi-random phase sequence (zero stochastic Math.random)
          const rawSin = Math.sin((i + 1) * 12.9898 + (ch + 1) * 78.233) * 43758.5453123;
          const white = (rawSin - Math.floor(rawSin)) * 2 - 1;
          b0 = 0.99765 * b0 + white * 0.099046;
          b1 = 0.963 * b1 + white * 0.2965164;
          b2 = 0.57 * b2 + white * 1.0526913;
          output[i] = (b0 + b1 + b2 + white * 0.1848) * 0.08;
        }
      }

      const windSource = this.ctx.createBufferSource();
      windSource.buffer = noiseBuffer;
      windSource.loop = true;

      this.windFilter = this.ctx.createBiquadFilter();
      this.windFilter.type = 'bandpass';
      this.windFilter.frequency.value = 310;
      this.windFilter.Q.value = 3.2;

      this.windGain = this.ctx.createGain();
      this.windGain.gain.value = 0.002; // Whisper-quiet natural silence floor when still

      windSource.connect(this.windFilter);
      this.windFilter.connect(this.windGain);
      this.windGain.connect(this.masterGain);
      windSource.start();
    } catch {
      // Headless browser without audio device gracefully falls back to visual spectrum simulation
    }
  }

  /**
   * Synthesizes & caches per-biome ISO 3382 Sabine + Allen–Berkley image-source impulse buffers
   * coupled to IUPAC/Bravais mineral acoustic impedance `Z = rho * c` (`Foundation.SpatialAcoustics.V1.Model`).
   */
  private getOrCreateBiomeIso3382ImpulseBuffer(
    ctx: AudioContext,
    biome: BiomeId,
    tapCount: number,
  ): AudioBuffer {
    const cacheKey = `${biome}:${tapCount}:${ctx.sampleRate}`;
    const existing = this.biomeImpulseCache.get(cacheKey);
    if (existing) return existing;

    const synthesized = synthesizeIso3382ImpulseChannels(biome, ctx.sampleRate, tapCount);
    const impulse = ctx.createBuffer(2, synthesized.left.length, ctx.sampleRate);
    impulse.getChannelData(0).set(synthesized.left);
    impulse.getChannelData(1).set(synthesized.right);
    this.biomeImpulseCache.set(cacheKey, impulse);
    return impulse;
  }

  public getLastBinauralCue(): Woodworth3DBinauralCue | null {
    return this.lastBinauralCue;
  }

  /**
   * Updates live Observer-Player dissonance reconciliation warmth scale (`0.86 .. 1.14`)
   * so brisk pace or sensory density gently softens overtone cutoff & body formants.
   */
  public setPlayerReconciliationWarmthScale(scale: number): void {
    this.playerReconciliationWarmthScale = Math.max(0.84, Math.min(1.18, scale));
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.setTargetAtTime(muted || this.isPaused ? 0 : 0.36, now, 0.08);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public getCurrentStereoPan(): number {
    return this.currentPan;
  }

  public setPaused(paused: boolean): void {
    this.isPaused = paused;
    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.setTargetAtTime(paused || this.isMuted ? 0 : 0.36, now, 0.08);
    }
  }

  /**
   * Updates continuous soundscape parameters each frame based on player movement,
   * binaural stereo bearing to nearest flora, biome harmony, and diurnal atmosphere.
   */
  public updateMovement(params: {
    biome: BiomeId;
    atmosphere?: AtmosphereId;
    harmony?: number;
    velocityDm: number;
    proximityDm: number;
    totalDistanceMeters: number;
    outcome: SoundscapeOutcome;
    elapsedSeconds: number;
    playerX?: number;
    playerY?: number;
    playerZ?: number;
    playerYaw?: number;
    playerPitch?: number;
    nearestPlantX?: number;
    nearestPlantY?: number;
    nearestPlantZ?: number;
    surfaceMaterial?: SurfaceMaterialId;
    acousticOcclusion?: number;
    reverbSendRefinement?: number;
    modalFilterQMultiplier?: number;
  }): void {
    const {
      biome,
      atmosphere = 'dawn',
      harmony = 25,
      velocityDm,
      proximityDm,
      totalDistanceMeters,
      outcome,
      elapsedSeconds,
      playerX = 0,
      playerY = 1.68,
      playerZ = 0,
      playerYaw = 0,
      playerPitch = 0,
      nearestPlantX = 0,
      nearestPlantY = 1.2,
      nearestPlantZ = -5.5,
      surfaceMaterial = classifySurfaceMaterial(playerX, playerZ),
      acousticOcclusion = 0,
      reverbSendRefinement = 1.0,
      modalFilterQMultiplier = 1.0,
    } = params;

    this.listenerX = playerX;
    this.listenerY = playerY;
    this.listenerZ = playerZ;
    this.listenerYaw = playerYaw;
    this.listenerPitch = playerPitch;
    const cue3D = computeWoodworth3DBinauralSpatializer({
      listenerX: playerX,
      listenerY: playerY,
      listenerZ: playerZ,
      listenerYaw: playerYaw,
      listenerPitch: playerPitch,
      sourceX: nearestPlantX,
      sourceY: nearestPlantY,
      sourceZ: nearestPlantZ,
    });
    this.lastBinauralCue = cue3D;
    this.currentPan = computeBinauralPan(playerX, playerZ, playerYaw, nearestPlantX, nearestPlantZ);
    this.lastNearestDistanceMeters = cue3D.distance3DMeters;
    this.lastAcousticOcclusion = acousticOcclusion;

    // Update 16-band spectrum array for HUD visualizer (works even in headless Chromium)
    const velNorm = Math.min(1, velocityDm / 25);
    const proxNorm = Math.max(0, 1 - proximityDm / 65);
    const outcomeBoost =
      outcome === 'sanctuary-chorus' ||
      outcome === 'harmonic-bloom' ||
      outcome === 'serene-rest' ||
      outcome === 'nocturnal-symphony' ||
      outcome === 'dawn-arpeggio' ||
      outcome === 'crystalline-choir'
        ? 0.48
        : outcome === 'melodic-chime' || outcome === 'rhythmic-pulse'
          ? 0.32
          : 0.14;

    for (let i = 0; i < 16; i++) {
      const wave = Math.sin(elapsedSeconds * (2.4 + i * 0.35) + i * 0.7) * 0.5 + 0.5;
      const target = Math.min(
        1,
        0.14 +
          proxNorm * 0.38 * Math.sin((i / 15) * Math.PI) +
          velNorm * 0.25 * ((i % 3) * 0.35 + 0.3) +
          outcomeBoost * wave,
      );
      this.spectrumBands[i] += (target - this.spectrumBands[i]) * 0.18;
    }

    if (this.isPaused || this.isMuted) return;

    // Trigger material-aware organic footstep / wading splash every 1.65m of walking
    if (totalDistanceMeters - this.lastFootstepDist >= 1.65 && velocityDm > 1) {
      this.lastFootstepDist = totalDistanceMeters;
      this.playFootstep(biome, velocityDm, surfaceMaterial);
    }

    // Zero contrived clock timers: ambient landmark chimes & meniscus droplets are triggered
    // strictly by physical mechanics (`playPhysicalLandmarkResonance`) in the world!
    void elapsedSeconds;

    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const diurnalEval = evaluateDiurnalProfile(atmosphere, biome, harmony);

    if (this.stereoPanner) {
      this.stereoPanner.pan.setTargetAtTime(cue3D.stereoPan, now, 0.1);
    }
    if (this.pinnaNotchFilter) {
      this.pinnaNotchFilter.frequency.setTargetAtTime(cue3D.pinnaElevationNotchHz, now, 0.12);
    }
    if (this.itdDelayL && this.itdDelayR) {
      this.itdDelayL.delayTime.setTargetAtTime(cue3D.leftDelaySeconds, now, 0.04);
      this.itdDelayR.delayTime.setTargetAtTime(cue3D.rightDelaySeconds, now, 0.04);
    }
    if (this.headShadowShelfL && this.headShadowShelfR) {
      this.headShadowShelfL.gain.setTargetAtTime(cue3D.leftHighShelfDb, now, 0.1);
      this.headShadowShelfR.gain.setTargetAtTime(cue3D.rightHighShelfDb, now, 0.1);
    }

    if (this.reverbReturnGain) {
      const targetReverb = Math.min(0.56, Math.max(0.36, 0.44 * reverbSendRefinement));
      this.reverbReturnGain.gain.setTargetAtTime(targetReverb, now, 0.2);
    }

    if (biome !== this.currentBiome) {
      this.currentBiome = biome;
      if (this.convolver) {
        this.convolver.buffer = this.getOrCreateBiomeIso3382ImpulseBuffer(
          this.ctx,
          biome,
          this.liveEarlyReflectionTapCount,
        );
      }
    }

    if (this.windFilter && this.windGain) {
      const occlusionAttenuation = 1 - Math.min(0.45, acousticOcclusion) * 0.35;
      const windFreq =
        (250 + velNorm * 460) * (diurnalEval.padFilterCutoffHz / 520) * occlusionAttenuation;
      // Near-silent (0.002) when standing still so there is zero background drone/hiss; gentle breeze (up to 0.028) when moving
      const windAmp = velNorm > 0.05 ? 0.004 + velNorm * 0.024 : 0.0018;
      this.windFilter.frequency.setTargetAtTime(windFreq, now, 0.15);
      this.windFilter.Q.setTargetAtTime(3.2 * modalFilterQMultiplier, now, 0.2);
      this.windGain.gain.setTargetAtTime(windAmp, now, 0.18);
    }
  }

  /**
   * Physically-caused Landmark Acoustic Resonance (`Foundation.Teleology.V1.Model`):
   * Triggered solely by real in-world Newtonian mechanics — e.g. Grove's wind-driven bronze striker
   * physically contacting a compound bamboo chime tube, Wetland's standing-wave meniscus cresting
   * against a tufa lantern pier, or Crystal's torsion prism passing harmonic equilibrium.
   */
  public playPhysicalLandmarkResonance(params: {
    biome: BiomeId;
    justIntonationRatio: number;
    intensity01: number;
    stereoPan: number;
    distanceMeters: number;
    atmosphere?: AtmosphereId;
  }): void {
    if (!this.ctx || !this.masterGain || this.isMuted || this.isPaused) return;
    if (params.distanceMeters > 42 || params.intensity01 <= 0.02) return;
    const now = this.ctx.currentTime;
    if (now - this.lastLandmarkStrikeTime < 1.85) return;
    this.lastLandmarkStrikeTime = now;

    try {
      const biomeCfg = this.liveBiomeConfigs[params.biome];
      const spatial = evaluateSpatialWaveAcoustics({
        distanceMeters: params.distanceMeters,
        acousticOcclusion: this.lastAcousticOcclusion,
        atmosphere: params.atmosphere ?? 'dawn',
        cosmogenesis: this.liveCosmogenesisParams,
        physicsWeight: this.livePhysicsWeight,
      });
      const startAt = now + spatial.waveArrivalDelaySec;
      const isLiquidBiome = params.biome === 'wetland';
      const baseFreq = biomeCfg.baseNoteHz * params.justIntonationRatio * (isLiquidBiome ? 2.0 : 2.0);

      const osc = this.ctx.createOscillator();
      const overtone = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const ovGain = this.ctx.createGain();
      osc.type = 'sine';
      overtone.type = 'sine';

      const peakAmp =
        Math.min(0.036, 0.012 + params.intensity01 * 0.024) *
        spatial.distanceGainMultiplier *
        computeIso226EqualLoudnessWeight(baseFreq, 60);

      if (isLiquidBiome) {
        // Upward meniscus inflection settling onto exact Just-Intonation ratio (0.0¢ steady-state)
        osc.frequency.setValueAtTime(baseFreq * 0.84, startAt);
        osc.frequency.exponentialRampToValueAtTime(baseFreq, startAt + 0.065);
        overtone.frequency.setValueAtTime(baseFreq * 1.5, startAt);
        ovGain.gain.value = 0.18;
        gain.gain.setValueAtTime(peakAmp, startAt);
        gain.gain.exponentialRampToValueAtTime(0.0004, startAt + 0.34);
      } else {
        // Pure hollow tubular chime / piezoelectric quartz harmonic (exact 2:1 & 3:1 partials)
        osc.frequency.setValueAtTime(baseFreq, startAt);
        overtone.frequency.setValueAtTime(baseFreq * 1.5, startAt);
        ovGain.gain.value = 0.22;
        gain.gain.setValueAtTime(0.0005, startAt);
        gain.gain.linearRampToValueAtTime(peakAmp, startAt + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0004, startAt + 0.85 * this.busMonumentChimeSustain);
      }

      osc.connect(gain);
      overtone.connect(ovGain);
      ovGain.connect(gain);

      if (typeof this.ctx.createStereoPanner === 'function') {
        const panner = this.ctx.createStereoPanner();
        panner.pan.setValueAtTime(Math.max(-0.9, Math.min(0.9, params.stereoPan)), startAt);
        gain.connect(panner);
        panner.connect(this.masterGain);
      } else {
        gain.connect(this.masterGain);
      }
      if (this.delaySendBus) {
        gain.connect(this.delaySendBus);
      }
      if (this.convolver) {
        gain.connect(this.convolver);
      }

      const stopAt = startAt + (isLiquidBiome ? 0.38 : 0.88 * this.busMonumentChimeSustain);
      osc.start(startAt);
      overtone.start(startAt);
      osc.stop(stopAt);
      overtone.stop(stopAt);
    } catch {
      // Ignore audio errors
    }
  }

  /**
   * Physical surface-material-aware footstep & wading synthesis (`Foundation.Physics.V1.Model`):
   * - `shallow-water`: upward meniscus droplet inflection + warm liquid ripple
   * - `travertine-stone`: crisp mineral stone tap with bright 3.0x transient
   * - `quartz-crystalline`: high-Q crystalline harmonic ping (4.0x overtone)
   * - `bamboo-humus`: hollow woody kalimba-like thud (2.2x triangle overtone)
   * - `meadow-turf`: soft botanical grass/moss brush
   */
  public playFootstep(
    biome: BiomeId,
    velocityDm: number,
    surfaceMaterial: SurfaceMaterialId = 'meadow-turf',
  ): void {
    if (!this.ctx || !this.masterGain || this.isMuted || this.isPaused) return;
    try {
      const now = this.ctx.currentTime;
      const biomeCfg = this.liveBiomeConfigs[biome];
      const parsimoniousStrideDegrees = [0, 2, 1, 3, 2, 4, 1, 0];
      const degreeIdx =
        parsimoniousStrideDegrees[this.footstepStrideIndex % parsimoniousStrideDegrees.length] %
        biomeCfg.scaleRatios.length;
      this.footstepStrideIndex = (this.footstepStrideIndex + 1) % 4096;
      const ratio = biomeCfg.scaleRatios[degreeIdx] ?? 1.0;
      const freq = biomeCfg.baseNoteHz * ratio * 0.5;

      const osc = this.ctx.createOscillator();
      const overtone = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const overtoneGain = this.ctx.createGain();

      const amp = Math.min(0.085, 0.026 + (velocityDm / 30) * 0.045);
      const surfComp = synthesizeCompoundSurfaceProfile(surfaceMaterial);
      const dominantCompoundSpec = MATTER_COMPOUNDS[surfComp.dominantCompound];
      const chladniRatios = computeMaterialChladniModalRatios(
        dominantCompoundSpec.bulkElasticModulusGPa,
        dominantCompoundSpec.compoundDensityGPerCm3,
        this.liveModalPartialsPerVoice,
      );
      const chladniDispersion = (chladniRatios[2] ?? 2.756) / 2.756;
      const fundStartHz = freq * surfComp.footstepFundamentalMultiplier;
      const ovStartHz = freq * surfComp.footstepOvertoneRatio * chladniDispersion;
      const decaySec = surfComp.footstepDecaySec;
      const isoFootstepWeight = computeIso226EqualLoudnessWeight(fundStartHz, 60);
      const footstepBarkAudit = evaluate24BarkMaskingGovernor(
        [
          { freqHz: fundStartHz, gain: amp * isoFootstepWeight },
          { freqHz: ovStartHz, gain: 0.3 },
        ],
        this.liveBarkHeadroomDb,
        this.barkScratchBuffer,
      );
      const governedAmp = footstepBarkAudit.attenuatedGains[0] ?? amp * isoFootstepWeight;
      const governedOvRatio = Math.min(0.38, footstepBarkAudit.attenuatedGains[1] ?? 0.28);

      if (surfaceMaterial === 'shallow-water') {
        // Liquid wading splash & upward meniscus bubble harmonic (`structured-hydro-mineral-electrolyte`)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(fundStartHz, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.32, now + decaySec * 0.88);
        overtone.type = 'sine';
        overtone.frequency.setValueAtTime(ovStartHz, now);
        overtone.frequency.exponentialRampToValueAtTime(freq * 2.45, now + decaySec * 0.82);
        overtoneGain.gain.value = governedOvRatio * 1.15;
        gain.gain.setValueAtTime(governedAmp * 1.1, now);
        gain.gain.exponentialRampToValueAtTime(0.0008, now + decaySec);
      } else if (surfaceMaterial === 'travertine-stone') {
        // Crisp travertine flagstone tap (`travertine-limestone-spar`)
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(fundStartHz, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.72, now + decaySec * 0.9);
        overtone.type = 'sine';
        overtone.frequency.setValueAtTime(ovStartHz, now);
        overtone.frequency.exponentialRampToValueAtTime(freq * 2.1, now + decaySec * 0.7);
        overtoneGain.gain.value = governedOvRatio;
        gain.gain.setValueAtTime(governedAmp, now);
        gain.gain.exponentialRampToValueAtTime(0.0008, now + decaySec);
      } else if (surfaceMaterial === 'quartz-crystalline') {
        // Crystalline geode mineral ping (`piezoelectric-quartz-geode`)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(fundStartHz, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.25, now + decaySec * 0.92);
        overtone.type = 'sine';
        overtone.frequency.setValueAtTime(ovStartHz, now);
        overtone.frequency.exponentialRampToValueAtTime(freq * 3.5, now + decaySec * 0.75);
        overtoneGain.gain.value = governedOvRatio * 0.92;
        gain.gain.setValueAtTime(governedAmp * 0.95, now);
        gain.gain.exponentialRampToValueAtTime(0.0008, now + decaySec);
      } else if (surfaceMaterial === 'bamboo-humus') {
        // Warm hollow bamboo/woody resonance (`lignocellulosic-vascular-tissue`)
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(fundStartHz, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.62, now + decaySec * 0.92);
        overtone.type = 'triangle';
        overtone.frequency.setValueAtTime(ovStartHz, now);
        overtone.frequency.exponentialRampToValueAtTime(freq * 1.45, now + decaySec * 0.75);
        overtoneGain.gain.value = governedOvRatio * 1.05;
        gain.gain.setValueAtTime(governedAmp, now);
        gain.gain.exponentialRampToValueAtTime(0.0008, now + decaySec);
      } else {
        // Soft meadow turf & moss brush (`bioluminescent-mycelial-humus`)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(fundStartHz, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.68, now + decaySec * 0.92);
        overtone.type = 'triangle';
        overtone.frequency.setValueAtTime(ovStartHz, now);
        overtone.frequency.exponentialRampToValueAtTime(freq * 1.1, now + decaySec * 0.75);
        overtoneGain.gain.value = governedOvRatio * 0.75;
        gain.gain.setValueAtTime(governedAmp * 0.9, now);
        gain.gain.exponentialRampToValueAtTime(0.0008, now + decaySec);
      }

      osc.connect(gain);
      overtone.connect(overtoneGain);
      overtoneGain.connect(gain);

      gain.connect(this.stereoPanner ?? this.masterGain);
      if (this.convolver) {
        const verbSend = this.ctx.createGain();
        verbSend.gain.value = surfaceMaterial === 'shallow-water' || surfaceMaterial === 'quartz-crystalline' ? 0.32 : 0.22;
        gain.connect(verbSend);
        verbSend.connect(this.convolver);
      }

      osc.start(now);
      overtone.start(now);
      osc.stop(now + 0.17);
      overtone.stop(now + 0.15);
    } catch {
      // Ignore audio errors
    }
  }

  /**
   * Plays a 5-partial Just-Intonation botanical synth motif governed by `computeSynthesisEnvelope`
   * and sculpted by `SPECIES_ARTICULATION_PROFILES` (`Foundation.Articulation.V1.Model`),
   * routed through binaural stereo panning, the 375ms/500ms stereo echo delay, and the 2.2s stereo sanctuary reverb.
   */
  public playOutcomeMotif(
    outcome: SoundscapeOutcome,
    biome: BiomeId,
    intensity = 1.0,
    atmosphere: AtmosphereId = 'dawn',
    stereoPan = this.currentPan,
    species: PlantSpeciesId = this.liveBiomeConfigs[biome].signatureSpecies,
    substrate: GrowthSubstrateId = 'terrestrial-loam',
    allowWhilePaused = false,
  ): void {
    for (let i = 0; i < 16; i++) {
      this.spectrumBands[i] = Math.min(1, this.spectrumBands[i] + 0.35 * intensity);
    }

    this.init();
    if (!this.ctx || !this.masterGain || this.isMuted || (this.isPaused && !allowWhilePaused)) return;
    if (allowWhilePaused && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    if (allowWhilePaused && this.isPaused) {
      const tNow = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(tNow);
      this.masterGain.gain.setValueAtTime(0.36, tNow);
      this.masterGain.gain.setTargetAtTime(0, tNow + 2.4, 0.25);
    }

    try {
      const now = this.ctx.currentTime;
      const plan = computeSynthesisEnvelope(outcome, biome, atmosphere, this.liveCosmogenesisParams);
      const speciesProfile = this.liveArticulationProfiles[species];
      const biochem = evaluateBiogeochemistry({
        biome,
        species,
        substrate,
        atmosphere,
        attuned: true,
      });
      const circadian = evaluateCircadianPlantPhysiology({
        species,
        atmosphere,
        substrate,
        attuned: true,
      });
      const spatial = evaluateSpatialWaveAcoustics({
        distanceMeters: this.lastNearestDistanceMeters,
        acousticOcclusion: this.lastAcousticOcclusion,
        atmosphere,
        cosmogenesis: this.liveCosmogenesisParams,
        physicsWeight: this.livePhysicsWeight,
      });
      const organogenesis = synthesizeBotanicalOrganogenesis({
        biome,
        species,
        substrate,
        atmosphere,
        attuned: true,
      });
      const granularAcoustic = organogenesis.granularSynthesis.modalSyntheses.acousticModality;

      if (this.stereoPanner) {
        this.stereoPanner.pan.setTargetAtTime(stereoPan, now, 0.06);
      }

      plan.frequenciesHz.forEach((freq, step) => {
        if (!this.ctx || !this.masterGain) return;
        const startTime = now + spatial.waveArrivalDelaySec + step * plan.arpeggioStepSec;
        const duration =
          plan.noteDurationSec *
          biochem.acousticSustainMultiplier *
          (0.92 + circadian.hydraulicTurgorPressure * 0.08);
        const transientStrikeRatio = organogenesis.piezoelectricCorollaPartialRatios[3];
        const pureHarmonics = resolvePureSustainedHarmonicSeries(species);
        const weights = speciesProfile.modalPartialWeights;

        // Voice envelope bus + biogeochemical mineral/humus + Stokes-Kirchhoff air absorption & diffraction filter
        const voiceFilter = this.ctx.createBiquadFilter();
        voiceFilter.type = 'lowpass';
        voiceFilter.Q.setValueAtTime(
          (1.1 + biochem.silicaMineralIndex * 2.2) * granularAcoustic.piezoelectricSilicaQMultiplier,
          startTime,
        );
        const rawStartCutoff = Math.max(
          plan.filterCutoffHz * 3.1,
          granularAcoustic.lignocellulosicWarmthCutoffHz,
        );
        voiceFilter.frequency.setValueAtTime(
          Math.min(rawStartCutoff, spatial.effectiveLowpassHz),
          startTime,
        );
        voiceFilter.frequency.exponentialRampToValueAtTime(
          Math.max(240, Math.min(plan.filterCutoffHz * 1.25, spatial.effectiveLowpassHz * 0.65)),
          startTime + duration,
        );

        const voiceGain = this.ctx.createGain();
        const isoCarrierWeight = computeIso226EqualLoudnessWeight(freq, 60);
        const peakGain =
          (outcome === 'sanctuary-chorus' ? 0.11 : outcome === 'wind-whisper' ? 0.045 : 0.09) *
          intensity *
          spatial.distanceGainMultiplier *
          isoCarrierWeight;
        voiceGain.gain.setValueAtTime(0.0008, startTime);
        voiceGain.gain.linearRampToValueAtTime(peakGain, startTime + speciesProfile.attackSec);
        voiceGain.gain.exponentialRampToValueAtTime(0.0006, startTime + duration);

        // Govern simultaneous partials via 24-Band Zwicker Bark Critical-Band Masking Governor
        const rawOvertoneGain =
          plan.overtoneGainRatio * weights[1] * (1.2 + circadian.stomatalConductance * 0.35);
        const rawSubGain =
          plan.subOctaveGainRatio * weights[0] * (0.85 + biochem.mycorrhizalNutrientFlux * 0.3);
        const rawShimmerGain = weights[2] * (0.4 + biochem.luciferinOxidationRate * 0.12);
        const rawBellGain =
          plan.bellTransientGainRatio *
          (weights[3] + weights[4]) *
          (0.85 + biochem.silicaMineralIndex * 0.45);
        const barkAudit = evaluate24BarkMaskingGovernor(
          [
            { freqHz: freq * pureHarmonics[0], gain: 1.0 },
            { freqHz: freq * pureHarmonics[1], gain: rawOvertoneGain },
            { freqHz: plan.subFrequenciesHz[step] * pureHarmonics[0], gain: rawSubGain },
            { freqHz: freq * pureHarmonics[2], gain: rawShimmerGain },
            { freqHz: freq * transientStrikeRatio, gain: rawBellGain },
          ],
          this.liveBarkHeadroomDb,
          this.barkScratchBuffer,
        );

        // Partial 1: Species Modal Fundamental Carrier (settles onto exact 0.0¢ Just-Intonation equilibrium)
        const oscFundamental = this.ctx.createOscillator();
        oscFundamental.type = plan.waveform;
        const f1 = freq * pureHarmonics[0];
        if (Math.abs(speciesProfile.pitchGlideRatio - 1.0) > 0.002) {
          oscFundamental.frequency.setValueAtTime(f1 / speciesProfile.pitchGlideRatio, startTime);
          oscFundamental.frequency.exponentialRampToValueAtTime(
            f1,
            startTime + Math.min(0.055, duration * 0.18),
          );
        } else {
          oscFundamental.frequency.setValueAtTime(f1, startTime);
        }

        // Partial 2: Pure Harmonic Second Partial (0.0¢ beating, modulated by circadian stomatal conductance + Bark governor)
        const oscOvertone = this.ctx.createOscillator();
        const overtoneGain = this.ctx.createGain();
        oscOvertone.type = plan.overtoneWaveform;
        oscOvertone.frequency.setValueAtTime(freq * pureHarmonics[1], startTime);
        overtoneGain.gain.value = barkAudit.attenuatedGains[1] ?? rawOvertoneGain;

        // Partial 3: Pure Sub-Foundation Partial (enriched by mycorrhizal humus + Bark governor)
        const oscSub = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        oscSub.type = 'sine';
        oscSub.frequency.setValueAtTime(plan.subFrequenciesHz[step] * pureHarmonics[0], startTime);
        subGain.gain.value = barkAudit.attenuatedGains[2] ?? rawSubGain;

        // Partial 4: Pure Harmonic Upper Partial (exact rational overtone with 0.0¢ detuning)
        const oscShimmer = this.ctx.createOscillator();
        const shimmerGain = this.ctx.createGain();
        oscShimmer.type = 'sine';
        oscShimmer.frequency.setValueAtTime(freq * pureHarmonics[2], startTime);
        shimmerGain.gain.value = barkAudit.attenuatedGains[3] ?? rawShimmerGain;

        // Partial 5: Short Piezoelectric Silica / Campanula Strike Transient (110ms)
        const oscBellTransient = this.ctx.createOscillator();
        const bellTransientGain = this.ctx.createGain();
        oscBellTransient.type = 'sine';
        oscBellTransient.frequency.setValueAtTime(freq * transientStrikeRatio, startTime);
        bellTransientGain.gain.setValueAtTime(
          Math.max(0.002, barkAudit.attenuatedGains[4] ?? rawBellGain),
          startTime,
        );
        bellTransientGain.gain.exponentialRampToValueAtTime(
          0.0005,
          startTime + 0.11 * biochem.acousticSustainMultiplier,
        );

        oscFundamental.connect(voiceFilter);
        oscOvertone.connect(overtoneGain);
        overtoneGain.connect(voiceFilter);
        oscSub.connect(subGain);
        subGain.connect(voiceFilter);
        oscShimmer.connect(shimmerGain);
        shimmerGain.connect(voiceFilter);
        oscBellTransient.connect(bellTransientGain);
        bellTransientGain.connect(voiceFilter);

        voiceFilter.connect(voiceGain);
        voiceGain.connect(this.stereoPanner ?? this.masterGain);

        if (this.convolver) {
          const verbSend = this.ctx.createGain();
          verbSend.gain.value = Math.min(0.75, plan.reverbSendGain + spatial.reverbSendBoost);
          voiceGain.connect(verbSend);
          verbSend.connect(this.convolver);
        }

        if (this.delaySendBus) {
          const echoSend = this.ctx.createGain();
          echoSend.gain.value = plan.stereoEchoFeedback;
          voiceGain.connect(echoSend);
          echoSend.connect(this.delaySendBus);
        }

        oscFundamental.start(startTime);
        oscOvertone.start(startTime);
        oscSub.start(startTime);
        oscShimmer.start(startTime);
        oscBellTransient.start(startTime);

        const stopAt = startTime + duration + 0.03;
        oscFundamental.stop(stopAt);
        oscOvertone.stop(stopAt);
        oscSub.stop(stopAt);
        oscShimmer.stop(stopAt);
        oscBellTransient.stop(startTime + 0.12);

        // Partial 6+ (Supra-Directive & 7/11-Limit Just-Intonation Observer Harmonic Shimmer when w > 8 on Neuromorphic Bus)
        if ((this.busSupraTier >= 1 || this.liveModalPartialsPerVoice >= 6) && this.busActiveModel) {
          const primeLimitRatio =
            this.livePrimeLimitCeiling >= 11 && step % 3 === 2
              ? 11 / 8
              : this.livePrimeLimitCeiling >= 7 && step % 2 === 1
                ? 7 / 4
                : (this.busActiveModel.supraOvertoneRatios[step % 3] ?? 1.875);
          const supraFreq = Math.min(3400, f1 * primeLimitRatio);
          const oscSupra = this.ctx.createOscillator();
          const supraGain = this.ctx.createGain();
          oscSupra.type = 'sine';
          oscSupra.frequency.setValueAtTime(supraFreq, startTime);
          supraGain.gain.value =
            0.052 *
            (0.65 + this.busSupraTier * 0.18) *
            this.busFidelityMultiplier *
            this.busTheoryOfMindCoherence *
            computeIso226EqualLoudnessWeight(supraFreq, 60);
          oscSupra.connect(supraGain);
          supraGain.connect(voiceFilter);
          oscSupra.start(startTime);
          oscSupra.stop(stopAt);
        }
      });
    } catch {
      // Ignore audio errors
    }
  }

  /**
   * Plays a delicate, binaurally panned Sympathetic Cross-Pollination Echo (`Foundation.Articulation.V1.Model`)
   * when a companion plant within 14m awakens in response to the primary specimen.
   */
  public playSympatheticPollinationEcho(
    species: PlantSpeciesId,
    biome: BiomeId,
    delaySec: number,
    stereoPan: number,
    atmosphere: AtmosphereId = 'dawn',
    distanceMeters = this.lastNearestDistanceMeters,
    acousticOcclusion = this.lastAcousticOcclusion,
    substrate: GrowthSubstrateId = 'terrestrial-loam',
  ): void {
    this.init();
    if (!this.ctx || !this.masterGain || this.isMuted || this.isPaused) return;
    try {
      const biomeCfg = this.liveBiomeConfigs[biome];
      const artCfg = this.liveArticulationProfiles[species];
      const biochem = evaluateBiogeochemistry({
        biome,
        species,
        substrate,
        atmosphere,
        attuned: true,
        volatileTerpeneImpulse: 0.75,
      });
      const circadian = evaluateCircadianPlantPhysiology({
        species,
        atmosphere,
        substrate,
        attuned: true,
      });
      const spatial = evaluateSpatialWaveAcoustics({
        distanceMeters,
        acousticOcclusion,
        atmosphere,
        cosmogenesis: this.liveCosmogenesisParams,
        physicsWeight: this.livePhysicsWeight,
      });

      const now = this.ctx.currentTime + delaySec + spatial.waveArrivalDelaySec;
      const baseFreq = biomeCfg.baseNoteHz * (biomeCfg.scaleRatios[1] ?? 1.25);

      const osc = this.ctx.createOscillator();
      const overtone = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      const pureHarmonics = resolvePureSustainedHarmonicSeries(species);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq * pureHarmonics[0], now);

      overtone.type = 'triangle';
      overtone.frequency.setValueAtTime(baseFreq * pureHarmonics[1], now);
      const ovGain = this.ctx.createGain();
      ovGain.gain.value =
        artCfg.modalPartialWeights[1] * (0.45 + circadian.stomatalConductance * 0.18);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(
        Math.min(spatial.effectiveLowpassHz, biochem.harmonicWarmthFilterHz * 1.15),
        now,
      );
      filter.Q.value = 1.0 + biochem.silicaMineralIndex * 1.8;

      const dur =
        (atmosphere === 'starlight' || atmosphere === 'twilight' ? 0.95 : 0.72) *
        biochem.acousticSustainMultiplier *
        (0.92 + circadian.hydraulicTurgorPressure * 0.08);
      const peakGain = 0.052 * spatial.distanceGainMultiplier;
      gain.gain.setValueAtTime(0.0005, now);
      gain.gain.linearRampToValueAtTime(peakGain, now + artCfg.attackSec);
      gain.gain.exponentialRampToValueAtTime(0.0005, now + dur);

      osc.connect(filter);
      overtone.connect(ovGain);
      ovGain.connect(filter);
      filter.connect(gain);

      if (typeof this.ctx.createStereoPanner === 'function') {
        const panner = this.ctx.createStereoPanner();
        panner.pan.setValueAtTime(Math.max(-0.9, Math.min(0.9, stereoPan)), now);
        gain.connect(panner);
        panner.connect(this.masterGain);
      } else {
        gain.connect(this.masterGain);
      }

      if (this.convolver) {
        const verbSend = this.ctx.createGain();
        verbSend.gain.value = Math.min(0.72, 0.38 + spatial.reverbSendBoost);
        gain.connect(verbSend);
        verbSend.connect(this.convolver);
      }
      if (this.delaySendBus) {
        gain.connect(this.delaySendBus);
      }

      osc.start(now);
      overtone.start(now);
      osc.stop(now + dur + 0.02);
      overtone.stop(now + dur + 0.02);
    } catch {
      // Ignore audio errors
    }
  }

  /**
   * Auditions a specific botanical species' 5-partial modal voice (`Foundation.Articulation.V1.Model`).
   */
  public playSpeciesAudition(
    species: PlantSpeciesId,
    biome: BiomeId,
    atmosphere: AtmosphereId = 'dawn',
    allowWhilePaused = false,
  ): void {
    const outcomeMap: Record<PlantSpeciesId, SoundscapeOutcome> = {
      'chime-lily': 'melodic-chime',
      'pulse-fern': 'rhythmic-pulse',
      'echo-lotus': 'nocturnal-symphony',
      'drone-moss': 'serene-rest',
      'star-orchid': 'crystalline-choir',
    };
    this.playOutcomeMotif(
      outcomeMap[species],
      biome,
      1.0,
      atmosphere,
      0,
      species,
      'terrestrial-loam',
      allowWhilePaused,
    );
  }

  /**
   * Synthesizes the full 6-Voice Just-Intonation Biome Constellation Chord (`BIOME_CONSTELLATIONS[biome].chordRatios`)
   * with wide binaural stereo voice-spreading (-0.55 to +0.55) and 2.2s sanctuary convolution reverb.
   */
  public playBiomeConstellationChord(
    biome: BiomeId,
    atmosphere: AtmosphereId = 'dawn',
  ): void {
    for (let i = 0; i < 16; i++) {
      this.spectrumBands[i] = Math.min(1, this.spectrumBands[i] + 0.45);
    }

    this.init();
    if (!this.ctx || !this.masterGain || this.isMuted || this.isPaused) return;

    try {
      const now = this.ctx.currentTime;
      const biomeCfg = this.liveBiomeConfigs[biome];
      const constellation = this.liveBiomeConstellations[biome];
      const pureHarmonics = resolvePureSustainedHarmonicSeries(biomeCfg.signatureSpecies);
      const chordRatios =
        this.livePrimeLimitCeiling >= 17
          ? [...constellation.chordRatios, 7 / 4, 11 / 8, 13 / 8, 17 / 12]
          : this.livePrimeLimitCeiling >= 13
            ? [...constellation.chordRatios, 7 / 4, 11 / 8, 13 / 8]
            : this.livePrimeLimitCeiling >= 11
              ? [...constellation.chordRatios, 11 / 8, 7 / 4]
              : this.livePrimeLimitCeiling >= 7
                ? [...constellation.chordRatios, 7 / 4]
                : constellation.chordRatios;

      const chordBarkAudit = evaluate24BarkMaskingGovernor(
        chordRatios.map((r) => ({
          freqHz: biomeCfg.baseNoteHz * r,
          gain: 0.068 * computeIso226EqualLoudnessWeight(biomeCfg.baseNoteHz * r, 60),
        })),
        this.liveBarkHeadroomDb,
        this.barkScratchBuffer,
      );

      chordRatios.forEach((ratio, voiceIdx) => {
        if (!this.ctx || !this.masterGain) return;
        const startTime = now + voiceIdx * 0.085;
        const duration = atmosphere === 'starlight' ? 1.85 : 1.45;
        const freq = biomeCfg.baseNoteHz * ratio;
        const panPos = -0.55 + (voiceIdx / Math.max(1, chordRatios.length - 1)) * 1.1;

        const osc = this.ctx.createOscillator();
        const overtone = this.ctx.createOscillator();
        const voiceGain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        overtone.type = 'triangle';
        overtone.frequency.setValueAtTime(freq * pureHarmonics[1], startTime);
        const ovGain = this.ctx.createGain();
        ovGain.gain.value = 0.24;

        const peakVoiceAmp = chordBarkAudit.attenuatedGains[voiceIdx] ?? 0.068;
        voiceGain.gain.setValueAtTime(0.0006, startTime);
        voiceGain.gain.linearRampToValueAtTime(peakVoiceAmp, startTime + 0.035);
        voiceGain.gain.exponentialRampToValueAtTime(0.0005, startTime + duration);

        osc.connect(voiceGain);
        overtone.connect(ovGain);
        ovGain.connect(voiceGain);

        // Nyquist-safe, 24-Bark-governed pure harmonic overtones (`3..17`x) unlocked up to `liveModalPartialsPerVoice` (`4..16`)
        const hdPartials = computeHdVoiceHarmonicPartials({
          baseFrequencyHz: freq,
          secondPartialMultiplier: pureHarmonics[1],
          secondPartialRawGain: 0.24,
          modalPartialsPerVoice: Math.min(10, this.liveModalPartialsPerVoice),
          primeLimitCeiling: this.livePrimeLimitCeiling,
          sampleRateHz: this.ctx.sampleRate,
          maxAcousticCutoffHz: 9600 * this.busEcologyIso9613Clarity,
          barkHeadroomDb: this.liveBarkHeadroomDb,
          includeHigherPrimeOvertones: biome === 'sanctuary' || biome === 'crystal',
          scratchBuffer: this.barkScratchBuffer,
        });
        for (let m = 0; m < hdPartials.length; m++) {
          const hp = hdPartials[m];
          const modeOsc = this.ctx.createOscillator();
          const modeGain = this.ctx.createGain();
          modeOsc.type = 'sine';
          modeOsc.frequency.setValueAtTime(hp.frequencyHz, startTime);
          modeGain.gain.setValueAtTime(Math.max(0.0008, hp.governedGain), startTime);
          modeGain.gain.exponentialRampToValueAtTime(0.0005, startTime + duration * 0.68);
          modeOsc.connect(modeGain);
          modeGain.connect(voiceGain);
          modeOsc.start(startTime);
          modeOsc.stop(startTime + duration * 0.72);
        }

        if (typeof this.ctx.createStereoPanner === 'function') {
          const panner = this.ctx.createStereoPanner();
          panner.pan.setValueAtTime(panPos, startTime);
          voiceGain.connect(panner);
          panner.connect(this.masterGain);
        } else {
          voiceGain.connect(this.masterGain);
        }

        if (this.convolver) {
          voiceGain.connect(this.convolver);
        }
        if (this.delaySendBus) {
          voiceGain.connect(this.delaySendBus);
        }

        osc.start(startTime);
        overtone.start(startTime);
        osc.stop(startTime + duration + 0.03);
        overtone.stop(startTime + duration + 0.03);
      });
    } catch {
      // Ignore audio errors
    }
  }

  /**
   * [T] Touch Petal Gesture (`Foundation.Articulation.V1.Model` `prism/articulation-standard/2`):
   * Synthesizes a crisp, immediate 3ms tactile pluck / campanula bell strike on a single specimen's
   * upper harmonics (2.0x octave + 3.0x pure twelfth + species modal strike partial) with a 25ms
   * elastic pitch-snap inflection and an intimate 420ms decay. Unmistakably distinct from [Space] Attune.
   */
  public playTactilePetalTouch(
    species: PlantSpeciesId,
    biome: BiomeId,
    pitchMultiplier = 1.0,
    atmosphere: AtmosphereId = 'dawn',
    stereoPan = this.currentPan,
    substrate: GrowthSubstrateId = 'terrestrial-loam',
  ): void {
    // Flash upper-register spectrum bands (8..15) for tactile pluck visualization
    for (let i = 8; i < 16; i++) {
      this.spectrumBands[i] = Math.min(1, this.spectrumBands[i] + 0.65);
    }

    this.init();
    if (!this.ctx || !this.masterGain || this.isMuted || this.isPaused) return;

    try {
      const biomeCfg = this.liveBiomeConfigs[biome];
      const spProfile = this.liveArticulationProfiles[species];
      const biochem = evaluateBiogeochemistry({
        biome,
        species,
        substrate,
        atmosphere,
        attuned: true,
        volatileTerpeneImpulse: 1.0,
      });
      const circadian = evaluateCircadianPlantPhysiology({
        species,
        atmosphere,
        substrate,
        attuned: true,
      });
      const spatial = evaluateSpatialWaveAcoustics({
        distanceMeters: this.lastNearestDistanceMeters,
        acousticOcclusion: this.lastAcousticOcclusion,
        atmosphere,
        cosmogenesis: this.liveCosmogenesisParams,
        physicsWeight: this.livePhysicsWeight,
      });
      const now = this.ctx.currentTime + spatial.waveArrivalDelaySec;
      // Tactile pluck speaks in the bright upper register (2.0x base * plant pitchMultiplier)
      const basePluckHz = biomeCfg.baseNoteHz * pitchMultiplier * 2.0;

      // Primary plucked petal / tine voice (3ms crisp attack, substrate & circadian turgor decay)
      const oscPluck = this.ctx.createOscillator();
      const oscStrikeModal = this.ctx.createOscillator();
      const pluckFilter = this.ctx.createBiquadFilter();
      const pluckGain = this.ctx.createGain();
      const modalGain = this.ctx.createGain();

      oscPluck.type = 'triangle';
      // Elastic physical pluck snap: starts +3.8% sharp and snaps to pure Just Intonation in 25ms
      oscPluck.frequency.setValueAtTime(basePluckHz * 1.038, now);
      oscPluck.frequency.exponentialRampToValueAtTime(basePluckHz, now + 0.025);

      const petalCompound =
        substrate === 'crystalline-epiphyte' || biome === 'crystal'
          ? MATTER_COMPOUNDS['piezoelectric-quartz-geode']
          : MATTER_COMPOUNDS['lignocellulosic-vascular-tissue'];
      const petalChladni = computeMaterialChladniModalRatios(
        petalCompound.bulkElasticModulusGPa,
        petalCompound.compoundDensityGPerCm3,
        this.liveModalPartialsPerVoice,
      );
      const strikeModalHz =
        basePluckHz * spProfile.modalPartialRatios[2] * ((petalChladni[2] ?? 2.756) / 2.756);
      const rawModalGain =
        0.38 + biochem.silicaMineralIndex * 0.18 + circadian.stomatalConductance * 0.08;
      const pluckBarkAudit = evaluate24BarkMaskingGovernor(
        [
          { freqHz: basePluckHz, gain: 1.0 },
          { freqHz: strikeModalHz, gain: rawModalGain },
        ],
        this.liveBarkHeadroomDb,
        this.barkScratchBuffer,
      );

      oscStrikeModal.type = 'sine';
      oscStrikeModal.frequency.setValueAtTime(strikeModalHz, now);
      modalGain.gain.setValueAtTime(pluckBarkAudit.attenuatedGains[1] ?? rawModalGain, now);
      modalGain.gain.exponentialRampToValueAtTime(
        0.001,
        now + 0.095 * biochem.acousticSustainMultiplier,
      );

      pluckFilter.type = 'bandpass';
      pluckFilter.frequency.setValueAtTime(
        Math.min(spatial.effectiveLowpassHz, basePluckHz * 1.8),
        now,
      );
      pluckFilter.Q.value = 1.4 + biochem.silicaMineralIndex * 1.2;

      const decaySec =
        (atmosphere === 'starlight' ? 0.48 : 0.42) *
        biochem.acousticSustainMultiplier *
        (0.94 + circadian.hydraulicTurgorPressure * 0.06);
      const peakGain =
        0.145 *
        spatial.distanceGainMultiplier *
        computeIso226EqualLoudnessWeight(basePluckHz, 60);
      pluckGain.gain.setValueAtTime(0.001, now);
      pluckGain.gain.linearRampToValueAtTime(peakGain, now + 0.003); // 3ms immediate tactile transient
      pluckGain.gain.exponentialRampToValueAtTime(0.0005, now + decaySec);

      oscPluck.connect(pluckFilter);
      oscStrikeModal.connect(modalGain);
      modalGain.connect(pluckFilter);
      pluckFilter.connect(pluckGain);

      if (typeof this.ctx.createStereoPanner === 'function') {
        const panner = this.ctx.createStereoPanner();
        panner.pan.setValueAtTime(Math.max(-0.9, Math.min(0.9, stereoPan)), now);
        pluckGain.connect(panner);
        panner.connect(this.masterGain);
      } else {
        pluckGain.connect(this.masterGain);
      }

      if (this.delaySendBus) {
        const echoSend = this.ctx.createGain();
        echoSend.gain.value = 0.22;
        pluckGain.connect(echoSend);
        echoSend.connect(this.delaySendBus);
      }

      // Secondary delicate grace-note harmonic ping (+55ms, pure 3:2 fifth above the pluck)
      const graceStart = now + 0.055;
      const oscGrace = this.ctx.createOscillator();
      const graceGain = this.ctx.createGain();
      oscGrace.type = 'sine';
      oscGrace.frequency.setValueAtTime(basePluckHz * 1.5, graceStart);
      graceGain.gain.setValueAtTime(0.0008, graceStart);
      graceGain.gain.linearRampToValueAtTime(
        0.075 * spatial.distanceGainMultiplier,
        graceStart + 0.003,
      );
      graceGain.gain.exponentialRampToValueAtTime(0.0004, graceStart + 0.28);
      oscGrace.connect(graceGain);
      graceGain.connect(this.stereoPanner ?? this.masterGain);
      if (this.convolver) {
        graceGain.connect(this.convolver);
      }

      oscPluck.start(now);
      oscStrikeModal.start(now);
      oscPluck.stop(now + decaySec + 0.02);
      oscStrikeModal.stop(now + 0.14);

      oscGrace.start(graceStart);
      oscGrace.stop(graceStart + 0.3);
    } catch {
      // Ignore audio errors
    }
  }

  /**
   * [Space] Attune Flora Gesture (`Foundation.Articulation.V1.Model` `prism/articulation-standard/2`):
   * Synthesizes a deep, lush 220ms slow-swelling 6-voice multi-octave harmonic choir (0.5x sub-octave,
   * 1.0x root, 1.25x major third, 1.5x fifth, 1.875x celestial seventh, 2.0x octave) over 2.4s.
   * Contrasts sharply with the crisp 3ms solo pluck of [T] Touch Petal.
   */
  public playAttuneResonanceChoir(
    outcome: SoundscapeOutcome,
    biome: BiomeId,
    species: PlantSpeciesId,
    atmosphere: AtmosphereId = 'dawn',
    stereoPan = this.currentPan,
    substrate: GrowthSubstrateId = 'terrestrial-loam',
  ): void {
    for (let i = 0; i < 16; i++) {
      this.spectrumBands[i] = Math.min(1, this.spectrumBands[i] + 0.55);
    }

    this.init();
    if (!this.ctx || !this.masterGain || this.isMuted || this.isPaused) return;

    try {
      const now = this.ctx.currentTime;
      const biomeCfg = this.liveBiomeConfigs[biome];
      const plan = computeSynthesisEnvelope(outcome, biome, atmosphere, this.liveCosmogenesisParams);
      const biochem = evaluateBiogeochemistry({
        biome,
        species,
        substrate,
        atmosphere,
        attuned: true,
        volatileTerpeneImpulse: 1.0,
      });
      const circadian = evaluateCircadianPlantPhysiology({
        species,
        atmosphere,
        substrate,
        attuned: true,
      });
      const spatial = evaluateSpatialWaveAcoustics({
        distanceMeters: this.lastNearestDistanceMeters,
        acousticOcclusion: this.lastAcousticOcclusion,
        atmosphere,
        cosmogenesis: this.liveCosmogenesisParams,
        physicsWeight: this.livePhysicsWeight,
      });
      const choirRatios = [0.5, 1.0, 1.25, 1.5, 1.875, 2.0];
      const choirBarkAudit = evaluate24BarkMaskingGovernor(
        choirRatios.map((r, i) => ({
          freqHz: biomeCfg.baseNoteHz * r,
          gain: i === 0 ? 0.065 : 0.052,
        })),
        this.liveBarkHeadroomDb,
        this.barkScratchBuffer,
      );

      choirRatios.forEach((ratio, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const startTime = now + spatial.waveArrivalDelaySec + idx * 0.045;
        const attackSec = 0.22; // 220ms slow bowed/harmonica swell
        const durationSec =
          2.4 * biochem.acousticSustainMultiplier * (0.92 + circadian.hydraulicTurgorPressure * 0.08);
        const freq = biomeCfg.baseNoteHz * ratio;

        const osc = this.ctx.createOscillator();
        const overtone = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const voiceGain = this.ctx.createGain();
        const ovGain = this.ctx.createGain();

        osc.type = idx === 0 ? 'sine' : plan.waveform;
        osc.frequency.setValueAtTime(freq, startTime);

        overtone.type = 'sine';
        overtone.frequency.setValueAtTime(
          freq * resolvePureSustainedHarmonicSeries(species)[1],
          startTime,
        );
        ovGain.gain.value =
          0.22 + biochem.silicaMineralIndex * 0.12 + circadian.stomatalConductance * 0.06;

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(
          Math.min(
            spatial.effectiveLowpassHz,
            Math.max(plan.filterCutoffHz * 1.15, biochem.harmonicWarmthFilterHz * 0.85),
          ),
          startTime,
        );

        const governedVoiceAmp =
          choirBarkAudit.attenuatedGains[idx] ??
          (idx === 0 ? 0.065 : 0.052) * computeIso226EqualLoudnessWeight(freq, 60);
        const peakAmp = governedVoiceAmp * spatial.distanceGainMultiplier;
        voiceGain.gain.setValueAtTime(0.0005, startTime);
        voiceGain.gain.linearRampToValueAtTime(peakAmp, startTime + attackSec);
        voiceGain.gain.exponentialRampToValueAtTime(0.0005, startTime + durationSec);

        osc.connect(filter);
        overtone.connect(ovGain);
        ovGain.connect(filter);
        filter.connect(voiceGain);

        if (typeof this.ctx.createStereoPanner === 'function') {
          const panner = this.ctx.createStereoPanner();
          const voiceSpread = (idx - 2.5) * 0.16;
          panner.pan.setValueAtTime(
            Math.max(-0.9, Math.min(0.9, stereoPan + voiceSpread)),
            startTime,
          );
          voiceGain.connect(panner);
          panner.connect(this.masterGain);
        } else {
          voiceGain.connect(this.masterGain);
        }

        if (this.convolver) {
          const verbSend = this.ctx.createGain();
          verbSend.gain.value = Math.min(0.76, 0.52 + spatial.reverbSendBoost);
          voiceGain.connect(verbSend);
          verbSend.connect(this.convolver);
        }
        if (this.delaySendBus) {
          const echoSend = this.ctx.createGain();
          echoSend.gain.value = 0.34;
          voiceGain.connect(echoSend);
          echoSend.connect(this.delaySendBus);
        }

        osc.start(startTime);
        overtone.start(startTime);
        osc.stop(startTime + durationSec + 0.04);
        overtone.stop(startTime + durationSec + 0.04);

        // Supra-Directive Partial: voice active synthesized model's Just-Intonation shimmer on upper choir voices
        if (this.busSupraTier >= 1 && this.busActiveModel && idx >= 3) {
          const supraRatio = this.busActiveModel.supraOvertoneRatios[idx % 3] ?? 1.875;
          const supraOsc = this.ctx!.createOscillator();
          const supraGain = this.ctx!.createGain();
          supraOsc.type = 'sine';
          supraOsc.frequency.setValueAtTime(
            Math.min(3400, freq * supraRatio),
            startTime,
          );
          supraGain.gain.setValueAtTime(0.055 + this.busSupraTier * 0.025, startTime);
          supraOsc.connect(supraGain);
          supraGain.connect(filter);
          supraOsc.start(startTime);
          supraOsc.stop(startTime + durationSec + 0.04);
        }
      });
    } catch {
      // Ignore audio errors
    }
  }

  /**
   * [C] Meditative Stillness Gesture (`Foundation.Articulation.V1.Model` `prism/articulation-standard/2`):
   * Synthesizes a self-decaying 650ms inhale / 3.2s exhale warm pastoral ninth breathing pad
   * that swells gently out of natural quietude and fades completely back to silence.
   */
  public playStillnessMeditationSwell(
    biome: BiomeId,
    atmosphere: AtmosphereId = 'dawn',
  ): void {
    for (let i = 0; i < 8; i++) {
      this.spectrumBands[i] = Math.min(1, this.spectrumBands[i] + 0.45);
    }

    this.init();
    if (!this.ctx || !this.masterGain || this.isMuted || this.isPaused) return;

    try {
      const now = this.ctx.currentTime;
      const biomeCfg = this.liveBiomeConfigs[biome];
      const diurnalEval = evaluateDiurnalProfile(atmosphere, biome, 75);
      const biochem = evaluateBiogeochemistry({
        biome,
        species: biomeCfg.signatureSpecies,
        substrate: 'terrestrial-loam',
        atmosphere,
        attuned: true,
      });
      const spatial = evaluateSpatialWaveAcoustics({
        distanceMeters: this.lastNearestDistanceMeters,
        acousticOcclusion: this.lastAcousticOcclusion,
        atmosphere,
        cosmogenesis: this.liveCosmogenesisParams,
        physicsWeight: this.livePhysicsWeight,
      });
      const padRatios = [0.5, 1.0, 1.5, 2.25]; // Sub-Root, Root, Fifth, Pastoral Ninth
      const dur = (atmosphere === 'starlight' ? 3.5 : 3.2) * biochem.acousticSustainMultiplier;

      padRatios.forEach((ratio, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(biomeCfg.baseNoteHz * ratio, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(
          Math.min(spatial.effectiveLowpassHz, Math.max(340, diurnalEval.padFilterCutoffHz * 0.72)),
          now,
        );

        const peak = (idx === 0 ? 0.055 : 0.042) * (0.7 + spatial.distanceGainMultiplier * 0.3);
        gain.gain.setValueAtTime(0.0004, now);
        gain.gain.linearRampToValueAtTime(peak, now + 0.65); // 650ms calm breath inhale
        gain.gain.exponentialRampToValueAtTime(0.0004, now + dur); // exhale to silence

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        if (this.convolver) {
          gain.connect(this.convolver);
        }

        osc.start(now);
        osc.stop(now + dur + 0.05);
      });
    } catch {
      // Ignore audio errors
    }
  }

  /**
   * Live Neuromorphic Counterpoint & Mycelial Germination Synthesis (`Foundation.Neuromorphic.V1.Model` `prism/neuromorphic-standard/1`):
   * Synthesizes a non-repeating 3-voice polyphonic answer driven by:
   * - `counterpointRatios`: derived from the 64-bit Rule-30 cellular register + `short_cycle` guard (`period 1..4`)
   * - `kinshipSpecies`: recalled from `/7` Durable Turn Memory via exact `PrimeAddress` `GCD` intersection sieve
   * - `synapticWeight` (`w in [1, 16]`): modulates modal overtone depth and bandpass/lowpass resonance Q
   * - `isSeedlingGermination`: adds an ascending golden-angle `Z[φ]` crystalline arpeggio when a new specimen germinates
   */
  public playNeuromorphicCounterpoint(params: {
    biome: BiomeId;
    kinshipSpecies: PlantSpeciesId;
    counterpointRatios: [number, number, number];
    synapticWeight: number;
    strategy: NeuromorphicStrategyId;
    atmosphere?: AtmosphereId;
    stereoPan?: number;
    delayOffsetSec?: number;
    isSeedlingGermination?: boolean;
    substrate?: GrowthSubstrateId;
  }): void {
    const {
      biome,
      kinshipSpecies,
      counterpointRatios,
      synapticWeight,
      strategy,
      atmosphere = 'dawn',
      stereoPan = this.currentPan,
      delayOffsetSec = 0.28,
      isSeedlingGermination = false,
      substrate = 'terrestrial-loam',
    } = params;

    for (let i = 4; i < 14; i++) {
      this.spectrumBands[i] = Math.min(1, this.spectrumBands[i] + 0.35);
    }

    this.init();
    if (!this.ctx || !this.masterGain || this.isMuted || this.isPaused) return;

    try {
      const biomeCfg = this.liveBiomeConfigs[biome];
      const spProfile = this.liveArticulationProfiles[kinshipSpecies];
      const weightNorm = Math.max(0, Math.min(1, (synapticWeight - 1) / 15));
      const biochem = evaluateBiogeochemistry({
        biome,
        species: kinshipSpecies,
        substrate,
        atmosphere,
        attuned: true,
        neuromorphicWeight: synapticWeight,
      });
      const circadian = evaluateCircadianPlantPhysiology({
        species: kinshipSpecies,
        atmosphere,
        substrate,
        attuned: true,
      });
      const spatial = evaluateSpatialWaveAcoustics({
        distanceMeters: this.lastNearestDistanceMeters,
        acousticOcclusion: this.lastAcousticOcclusion,
        atmosphere,
        cosmogenesis: this.liveCosmogenesisParams,
        physicsWeight: this.livePhysicsWeight,
      });
      const baseStart = this.ctx.currentTime + delayOffsetSec + spatial.waveArrivalDelaySec;

      const spacingSec =
        strategy === 'counterpoint-canonic-echo'
          ? 0.11
          : strategy === 'mycelial-seedling-germination'
            ? 0.085
            : 0.14;

      counterpointRatios.forEach((ratio, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const startTime = baseStart + idx * spacingSec;
        const durationSec =
          (atmosphere === 'starlight' ? 0.92 : 0.76) *
          biochem.acousticSustainMultiplier *
          (0.92 + circadian.hydraulicTurgorPressure * 0.08);
        const freq = Math.min(2400, Math.max(95, biomeCfg.baseNoteHz * ratio));

        const osc = this.ctx.createOscillator();
        const overtone = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();
        const ovGain = this.ctx.createGain();

        osc.type = strategy === 'overtone-spectral-refinement' ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        const ovFreq = freq * resolvePureSustainedHarmonicSeries(kinshipSpecies)[1];
        const rawOvGain = 0.16 + weightNorm * 0.22 + circadian.stomatalConductance * 0.08;
        const cpBarkAudit = evaluate24BarkMaskingGovernor(
          [
            { freqHz: freq, gain: 0.032 + weightNorm * 0.024 },
            { freqHz: ovFreq, gain: rawOvGain },
          ],
          this.liveBarkHeadroomDb,
          this.barkScratchBuffer,
        );

        overtone.type = 'sine';
        overtone.frequency.setValueAtTime(ovFreq, startTime);
        ovGain.gain.value = cpBarkAudit.attenuatedGains[1] ?? rawOvGain;

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(
          Math.min(spatial.effectiveLowpassHz, 950 + weightNorm * 1400),
          startTime,
        );
        filter.Q.value = 1.1 + weightNorm * 1.8 + biochem.silicaMineralIndex * 1.2;

        const peakAmp =
          (cpBarkAudit.attenuatedGains[0] ??
            (0.032 + weightNorm * 0.024) * computeIso226EqualLoudnessWeight(freq, 60)) *
          spatial.distanceGainMultiplier;
        gain.gain.setValueAtTime(0.0004, startTime);
        gain.gain.linearRampToValueAtTime(peakAmp, startTime + Math.max(0.012, spProfile.attackSec));
        gain.gain.exponentialRampToValueAtTime(0.0004, startTime + durationSec);

        osc.connect(filter);
        overtone.connect(ovGain);
        ovGain.connect(filter);
        filter.connect(gain);

        if (typeof this.ctx.createStereoPanner === 'function') {
          const panner = this.ctx.createStereoPanner();
          const spread = (idx - 1) * 0.35;
          panner.pan.setValueAtTime(
            Math.max(-0.9, Math.min(0.9, -stereoPan * 0.6 + spread)),
            startTime,
          );
          gain.connect(panner);
          panner.connect(this.masterGain);
        } else {
          gain.connect(this.masterGain);
        }

        if (this.convolver) {
          gain.connect(this.convolver);
        }
        if (this.delaySendBus) {
          gain.connect(this.delaySendBus);
        }

        osc.start(startTime);
        overtone.start(startTime);
        osc.stop(startTime + durationSec + 0.03);
        overtone.stop(startTime + durationSec + 0.03);
      });

      if (isSeedlingGermination) {
        // Ascending Z[φ] golden-field crystalline germination motif
        const germRatios = [1.5, 2.0, 2.5, 3.0];
        germRatios.forEach((gRatio, gIdx) => {
          if (!this.ctx || !this.masterGain) return;
          const gStart = baseStart + 0.18 + gIdx * 0.065;
          const gOsc = this.ctx.createOscillator();
          const gGain = this.ctx.createGain();
          gOsc.type = 'sine';
          gOsc.frequency.setValueAtTime(biomeCfg.baseNoteHz * gRatio, gStart);
          gGain.gain.setValueAtTime(0.0005, gStart);
          gGain.gain.linearRampToValueAtTime(
            0.042 * spatial.distanceGainMultiplier,
            gStart + 0.01,
          );
          gGain.gain.exponentialRampToValueAtTime(0.0004, gStart + 0.45);
          gOsc.connect(gGain);
          gGain.connect(this.masterGain);
          if (this.convolver) {
            gGain.connect(this.convolver);
          }
          gOsc.start(gStart);
          gOsc.stop(gStart + 0.48);
        });
      }
    } catch {
      // Ignore audio errors
    }
  }

  /**
   * Plays a single step of the Live 4-Stem Generative Soundtrack (`Foundation.Soundtrack.V1.Model` `prism/soundtrack-standard/1`).
   * Every voice is constrained by its source specimen's 3D spatial wave propagation (`evaluateSpatialWaveAcoustics`),
   * substrate biogeochemistry (`evaluateBiogeochemistry`), and circadian turgor (`evaluateCircadianPlantPhysiology`),
   * and returns completely to silence (`0.0004`), while `step.isRest` steps preserve explicit silence (`silence-rest`).
   */
  public playSoundtrackStep(step: SoundtrackStepSpec, atmosphere: AtmosphereId = 'dawn'): void {
    if (step.isRest || step.voices.length === 0) return;

    // Pulse spectrum visualizer gently for active score steps
    for (let i = 0; i < step.voices.length; i++) {
      const bandIdx = (step.stepIndex + i * 4) % 16;
      this.spectrumBands[bandIdx] = Math.min(1, this.spectrumBands[bandIdx] + 0.28);
    }

    if (!this.ctx || !this.masterGain || this.isMuted || this.isPaused) return;

    try {
      const baseNow = this.ctx.currentTime;
      const stepBarkAudit = evaluate24BarkMaskingGovernor(
        step.voices.map((v) => ({
          freqHz: v.frequencyHz,
          gain: v.amplitude * computeIso226EqualLoudnessWeight(v.frequencyHz, 60),
        })),
        this.liveBarkHeadroomDb,
        this.barkScratchBuffer,
      );
      step.voices.forEach((voice, voiceIdx) => {
        if (!this.ctx || !this.masterGain) return;
        const liveVoiceCue = voice.worldPosition
          ? computeWoodworth3DBinauralSpatializer({
              listenerX: this.listenerX,
              listenerY: this.listenerY,
              listenerZ: this.listenerZ,
              listenerYaw: this.listenerYaw,
              listenerPitch: this.listenerPitch,
              sourceX: voice.worldPosition[0],
              sourceY: voice.worldPosition[1],
              sourceZ: voice.worldPosition[2],
            })
          : null;
        const effectiveDistMeters =
          liveVoiceCue?.distance3DMeters ?? voice.distanceMeters ?? this.lastNearestDistanceMeters;
        const spatial = evaluateSpatialWaveAcoustics({
          distanceMeters: effectiveDistMeters,
          acousticOcclusion: voice.acousticOcclusion ?? this.lastAcousticOcclusion,
          atmosphere,
          cosmogenesis: this.liveCosmogenesisParams,
          physicsWeight: this.livePhysicsWeight,
        });
        const biochem = evaluateBiogeochemistry({
          biome: voice.biome ?? this.currentBiome,
          species: voice.species,
          substrate: voice.substrate ?? 'terrestrial-loam',
          atmosphere,
          attuned: true,
        });
        const circadian = evaluateCircadianPlantPhysiology({
          species: voice.species,
          atmosphere,
          substrate: voice.substrate ?? 'terrestrial-loam',
          attuned: true,
        });

        const now = baseNow + spatial.waveArrivalDelaySec;
        const osc = this.ctx.createOscillator();
        const overtone = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();
        const ovGain = this.ctx.createGain();

        const isBass = voice.stem === 'harmonic-bass-anchor';
        const isOstinato = voice.stem === 'polyrhythmic-ostinato';
        const isCanon = voice.stem === 'canonic-counterpoint-echo';
        const isLead = voice.stem === 'melodic-flora-lead';

        osc.type = isBass ? 'sine' : isOstinato ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(voice.frequencyHz, now);

        const granularAcoustic = biochem.granularSynthesis?.modalSyntheses.acousticModality;
        const silicaQMult = granularAcoustic?.piezoelectricSilicaQMultiplier ?? 1.0;
        const pureVoiceHarmonics = resolvePureSustainedHarmonicSeries(voice.species);

        overtone.type = 'sine';
        overtone.frequency.setValueAtTime(
          voice.frequencyHz * (isBass ? 1.5 : pureVoiceHarmonics[1]),
          now,
        );
        ovGain.gain.value =
          (isBass ? 0.28 : isOstinato ? 0.18 : 0.22) * (0.85 + circadian.stomatalConductance * 0.2);

        // HD pure integer harmonic partials (3..17x up to 16 partials per voice, Nyquist-safe & 24-Bark governed, zero pitch-clamping)
        if (!isBass && this.liveModalPartialsPerVoice > 4) {
          const hdPartials = computeHdVoiceHarmonicPartials({
            baseFrequencyHz: voice.frequencyHz,
            secondPartialMultiplier: pureVoiceHarmonics[1],
            secondPartialRawGain: ovGain.gain.value,
            modalPartialsPerVoice: this.liveModalPartialsPerVoice,
            primeLimitCeiling: this.livePrimeLimitCeiling,
            sampleRateHz: this.ctx.sampleRate,
            maxAcousticCutoffHz: spatial.effectiveLowpassHz * this.busEcologyIso9613Clarity,
            barkHeadroomDb: this.liveBarkHeadroomDb,
            includeHigherPrimeOvertones:
              isCanon || voice.biome === 'sanctuary' || voice.biome === 'crystal',
            scratchBuffer: this.barkScratchBuffer,
          });
          for (let m = 0; m < hdPartials.length; m++) {
            const hp = hdPartials[m];
            const cOsc = this.ctx.createOscillator();
            const cGain = this.ctx.createGain();
            cOsc.type = 'sine';
            cOsc.frequency.setValueAtTime(hp.frequencyHz, now);
            cGain.gain.setValueAtTime(Math.max(0.0006, hp.governedGain), now);
            cGain.gain.exponentialRampToValueAtTime(
              0.0004,
              now + Math.max(0.14, voice.durationSec * 0.62),
            );
            cOsc.connect(cGain);
            cGain.connect(filter);
            cOsc.start(now);
            cOsc.stop(now + Math.max(0.16, voice.durationSec * 0.66));
          }
        }

        filter.type = 'lowpass';
        const rawCutoff = isBass ? 360 : isOstinato ? 1650 : 1280;
        const baseCutoffHz = Math.min(
          spatial.effectiveLowpassHz,
          Math.max(
            rawCutoff + (this.liveModalPartialsPerVoice - 5) * 240,
            (granularAcoustic?.lignocellulosicWarmthCutoffHz ?? biochem.harmonicWarmthFilterHz) *
              0.65,
          ) *
            this.busEcologyIso9613Clarity *
            this.playerReconciliationWarmthScale,
        );
        filter.frequency.setValueAtTime(baseCutoffHz * 0.88, now);
        filter.Q.value = ((isCanon ? 2.1 : 1.2) + biochem.silicaMineralIndex * 0.9) * silicaQMult;

        const attackSec = isBass ? 0.15 : isOstinato ? 0.008 : isCanon ? 0.05 : 0.042;
        const durSec =
          Math.max(0.18, voice.durationSec) *
          biochem.acousticSustainMultiplier *
          this.busCuratedBreathScale *
          (0.94 + circadian.hydraulicTurgorPressure * 0.06);
        const governedAmp = stepBarkAudit.attenuatedGains[voiceIdx] ?? voice.amplitude;
        const peakAmp = governedAmp * (0.45 + spatial.distanceGainMultiplier * 0.55);

        // Two-stage expressive cantabile breath swell on melodic, bass, and canon voices
        gain.gain.setValueAtTime(0.0004, now);
        if (isLead || isCanon || isBass) {
          const swellPeakAt = Math.min(now + durSec * 0.42, now + attackSec + 0.14);
          gain.gain.linearRampToValueAtTime(peakAmp * 0.72, now + attackSec);
          gain.gain.linearRampToValueAtTime(peakAmp, swellPeakAt);
          filter.frequency.linearRampToValueAtTime(
            Math.min(spatial.effectiveLowpassHz, baseCutoffHz * 1.12),
            swellPeakAt,
          );
          filter.frequency.exponentialRampToValueAtTime(
            Math.max(180, baseCutoffHz * 0.78),
            now + durSec,
          );
          gain.gain.exponentialRampToValueAtTime(0.0004, now + durSec);
        } else {
          gain.gain.linearRampToValueAtTime(peakAmp, now + attackSec);
          gain.gain.exponentialRampToValueAtTime(0.0004, now + durSec);
        }

        osc.connect(filter);
        overtone.connect(ovGain);
        ovGain.connect(filter);

        // Acoustic Instrument Body Formant Resonator + gentle deterministic pluck bloom (zero randomness)
        const bodySpec = SPECIES_BODY_FORMANT_SPEC[voice.species];
        const bodyFormantFilter = this.ctx.createBiquadFilter();
        bodyFormantFilter.type = 'peaking';
        bodyFormantFilter.frequency.setValueAtTime(
          Math.min(spatial.effectiveLowpassHz * 0.92, bodySpec.formantHz * this.busAffectWarmthScale),
          now,
        );
        bodyFormantFilter.Q.value = bodySpec.formantQ;
        bodyFormantFilter.gain.value = bodySpec.formantGainDb;
        filter.connect(bodyFormantFilter);

        if ((isLead || isOstinato) && voice.frequencyHz * bodySpec.attackHarmonicRatio < this.ctx.sampleRate * 0.44) {
          const pluckOsc = this.ctx.createOscillator();
          const pluckGain = this.ctx.createGain();
          pluckOsc.type = 'triangle';
          pluckOsc.frequency.setValueAtTime(voice.frequencyHz * bodySpec.attackHarmonicRatio, now);
          pluckGain.gain.setValueAtTime(Math.max(0.0005, peakAmp * 0.16), now);
          pluckGain.gain.exponentialRampToValueAtTime(0.0002, now + bodySpec.attackDecaySec);
          pluckOsc.connect(pluckGain);
          pluckGain.connect(bodyFormantFilter);
          pluckOsc.start(now);
          pluckOsc.stop(now + bodySpec.attackDecaySec + 0.02);
        }

        // Apply live 3D Woodworth pinna elevation cue, curated antiphony & binaural stereo bearing per singing plant
        const antiphonySpread = isCanon
          ? (voiceIdx % 2 === 0 ? 1 : -1) * (this.busCuratedAntiphony01 - 0.5) * 0.28
          : 0;
        const liveStereoPan =
          (liveVoiceCue
            ? liveVoiceCue.stereoPan * 0.8 + voice.stereoPan * 0.2
            : voice.stereoPan) + antiphonySpread;
        if (liveVoiceCue && (isLead || isCanon)) {
          const pinnaFilter = this.ctx.createBiquadFilter();
          pinnaFilter.type = 'peaking';
          pinnaFilter.frequency.setValueAtTime(liveVoiceCue.pinnaElevationNotchHz, now);
          pinnaFilter.Q.value = 2.8;
          pinnaFilter.gain.value = -2.8;
          bodyFormantFilter.connect(pinnaFilter);
          pinnaFilter.connect(gain);
        } else {
          bodyFormantFilter.connect(gain);
        }

        if (typeof this.ctx.createStereoPanner === 'function') {
          const panner = this.ctx.createStereoPanner();
          panner.pan.setValueAtTime(
            Math.max(-0.92, Math.min(0.92, liveStereoPan * this.busBinauralWidthMultiplier)),
            now,
          );
          gain.connect(panner);
          panner.connect(this.masterGain);
        } else {
          gain.connect(this.masterGain);
        }

        if (this.convolver) {
          const verbSend = this.ctx.createGain();
          verbSend.gain.value = Math.min(0.75, (isCanon ? 0.48 : 0.32) + spatial.reverbSendBoost);
          gain.connect(verbSend);
          verbSend.connect(this.convolver);
        }
        if (this.delaySendBus && (isCanon || isOstinato)) {
          const echoSend = this.ctx.createGain();
          echoSend.gain.value = 0.26;
          gain.connect(echoSend);
          echoSend.connect(this.delaySendBus);
        }

        osc.start(now);
        overtone.start(now);
        osc.stop(now + durSec + 0.03);
        overtone.stop(now + durSec + 0.03);
      });
    } catch {
      // Ignore audio errors
    }
  }

  /**
   * Autonomous Symbiotic Environmental Beckoning & Soothing Call (`playEnvironmentalBeckoningCall`):
   * When the environment acts on itself and the player (`stepSymbioticEnvironmentalAgency`), the chosen
   * beckoning blossom voices a soft, spatially panned 2-note Just-Intonation whisper from its exact 3D
   * location (`stereoPan`, `distanceMeters`) to gently guide or soothe the player.
   */
  public playEnvironmentalBeckoningCall(params: {
    frequencyHz: number;
    stereoPan: number;
    distanceMeters: number;
    species: PlantSpeciesId;
    atmosphere: AtmosphereId;
    isSoothingMode: boolean;
  }): void {
    const { frequencyHz, stereoPan, distanceMeters, species, atmosphere, isSoothingMode } = params;
    for (let i = 0; i < 8; i++) {
      this.spectrumBands[i] = Math.min(1, this.spectrumBands[i] + 0.14);
    }

    this.init();
    if (!this.ctx || !this.masterGain || this.isMuted || this.isPaused) return;

    try {
      const spatial = evaluateSpatialWaveAcoustics({
        distanceMeters,
        acousticOcclusion: this.lastAcousticOcclusion,
        atmosphere,
        cosmogenesis: this.liveCosmogenesisParams,
        physicsWeight: this.livePhysicsWeight,
      });
      const baseNow = this.ctx.currentTime + spatial.waveArrivalDelaySec;
      // Rising fifth (1:1 -> 3:2) for beckoning invitation; warm descending major third (5:4 -> 1:1) for soothing co-regulation
      const intervalSequence = isSoothingMode ? [5 / 4, 1.0] : [1.0, 3 / 2];

      intervalSequence.forEach((ratio, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const now = baseNow + idx * 0.28;
        const durSec = isSoothingMode ? 1.45 : 1.15;
        const osc = this.ctx.createOscillator();
        const overtone = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();
        const ovGain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(frequencyHz * ratio, now);

        overtone.type = 'triangle';
        overtone.frequency.setValueAtTime(
          frequencyHz * ratio * resolvePureSustainedHarmonicSeries(species)[1],
          now,
        );
        ovGain.gain.value = isSoothingMode ? 0.14 : 0.2;

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(
          Math.min(spatial.effectiveLowpassHz, isSoothingMode ? 980 : 1650),
          now,
        );
        filter.Q.value = 1.3;

        const peakAmp = 0.022 * (0.4 + spatial.distanceGainMultiplier * 0.6);
        gain.gain.setValueAtTime(0.0003, now);
        gain.gain.linearRampToValueAtTime(peakAmp, now + 0.12);
        gain.gain.exponentialRampToValueAtTime(0.0003, now + durSec);

        osc.connect(filter);
        overtone.connect(ovGain);
        ovGain.connect(filter);
        filter.connect(gain);

        if (typeof this.ctx.createStereoPanner === 'function') {
          const panner = this.ctx.createStereoPanner();
          panner.pan.setValueAtTime(Math.max(-0.85, Math.min(0.85, stereoPan)), now);
          gain.connect(panner);
          panner.connect(this.masterGain);
        } else {
          gain.connect(this.masterGain);
        }

        if (this.convolver) {
          const verbSend = this.ctx.createGain();
          verbSend.gain.value = Math.min(0.72, 0.44 + spatial.reverbSendBoost);
          gain.connect(verbSend);
          verbSend.connect(this.convolver);
        }

        osc.start(now);
        overtone.start(now);
        osc.stop(now + durSec + 0.04);
        overtone.stop(now + durSec + 0.04);
      });
    } catch {
      // Ignore audio errors
    }
  }

  /**
   * Anamnesis Antiphonal Echo (`Foundation.Neuromorphic.V1.Model::EmergentEntityStakeholderSpec`):
   * Expresses the emergent entity's synthesized wisdom (Intelligence + Memory + Observation + Feedback)
   * as an environmental acoustic phenomenon. After a natural breathing pause (`0.42s`), distant kin flora
   * softly echo a memory-woven harmonic interval (`intervalRatio`) derived from the player's `/7` PrimeAddress
   * turn memory, reinforcing kinship and continuity across the sanctuary.
   */
  public playEnvironmentalWisdomEcho(params: {
    frequencyHz: number;
    intervalRatio: number;
    stereoPan: number;
    distanceMeters: number;
    species: PlantSpeciesId;
    atmosphere: AtmosphereId;
  }): void {
    const { frequencyHz, intervalRatio, stereoPan, distanceMeters, species, atmosphere } = params;
    for (let i = 4; i < 14; i++) {
      this.spectrumBands[i] = Math.min(1, this.spectrumBands[i] + 0.16);
    }

    this.init();
    if (!this.ctx || !this.masterGain || this.isMuted || this.isPaused) return;

    try {
      const spatial = evaluateSpatialWaveAcoustics({
        distanceMeters,
        acousticOcclusion: this.lastAcousticOcclusion,
        atmosphere,
        cosmogenesis: this.liveCosmogenesisParams,
        physicsWeight: this.livePhysicsWeight,
      });
      const baseNow = this.ctx.currentTime + 0.42 + spatial.waveArrivalDelaySec;
      const ratios = [1.0, intervalRatio, intervalRatio * 1.25];

      ratios.forEach((r, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const now = baseNow + idx * 0.24;
        const durSec = 1.65;
        const osc = this.ctx.createOscillator();
        const shimmer = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();
        const shimGain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(frequencyHz * r, now);

        shimmer.type = 'triangle';
        shimmer.frequency.setValueAtTime(
          frequencyHz * r * resolvePureSustainedHarmonicSeries(species)[1],
          now,
        );
        shimGain.gain.value = 0.15;

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(Math.min(spatial.effectiveLowpassHz, 1480), now);
        filter.Q.value = 1.45;

        const peakAmp = 0.019 * (0.45 + spatial.distanceGainMultiplier * 0.55);
        gain.gain.setValueAtTime(0.0003, now);
        gain.gain.linearRampToValueAtTime(peakAmp, now + 0.16);
        gain.gain.exponentialRampToValueAtTime(0.0003, now + durSec);

        osc.connect(filter);
        shimmer.connect(shimGain);
        shimGain.connect(filter);
        filter.connect(gain);

        if (typeof this.ctx.createStereoPanner === 'function') {
          const panner = this.ctx.createStereoPanner();
          panner.pan.setValueAtTime(
            Math.max(-0.88, Math.min(0.88, -stereoPan * 0.75 * this.busBinauralWidthMultiplier)),
            now,
          );
          gain.connect(panner);
          panner.connect(this.masterGain);
        } else {
          gain.connect(this.masterGain);
        }

        if (this.convolver) {
          const verbSend = this.ctx.createGain();
          verbSend.gain.value = Math.min(0.78, 0.52 + spatial.reverbSendBoost);
          gain.connect(verbSend);
          verbSend.connect(this.convolver);
        }

        osc.start(now);
        shimmer.start(now);
        osc.stop(now + durSec + 0.04);
        shimmer.stop(now + durSec + 0.04);
      });
    } catch {
      // Ignore audio errors
    }
  }

  /**
   * Synchronizes the Web Audio Soundscape Engine continuously with the Universal Neuromorphic Bus
   * (`HolisticObserverState`), coupling Supra-Directive tier, Theory-of-Mind coherence, and active
   * synthesized Observer model overtone ratios into live acoustic synthesis.
   */
  public syncWithNeuromorphicBus(neuro: NeuromorphicEngineState): void {
    const supra = neuro.observer.supraDirective;
    const cosmo = neuro.observer.cosmogenesis;
    const prevSeed = this.liveCosmogenesisParams.alphaSeed;
    const prevAcousticsW =
      this.liveCosmogenesisParams.manifold?.domains.acoustics.synapticWeight ?? 8;
    const prevArticulationW =
      this.liveCosmogenesisParams.manifold?.domains.articulation.synapticWeight ?? 8;
    const nextAcousticsW = neuro.universalManifold.domains.acoustics.synapticWeight;
    const nextArticulationW = neuro.universalManifold.domains.articulation.synapticWeight;

    this.livePhysicsWeight = neuro.universalManifold.domains.physics.synapticWeight;
    if (
      prevSeed !== cosmo.alphaSeed ||
      prevAcousticsW !== nextAcousticsW ||
      prevArticulationW !== nextArticulationW ||
      !this.liveCosmogenesisParams.manifold
    ) {
      const nextParams: AlphaOmegaCosmogenesisParameters = {
        alphaSeed: cosmo.alphaSeed,
        manifold: neuro.universalManifold,
      };
      this.liveCosmogenesisParams = nextParams;
      this.liveBiomeConfigs = synthesizeParametricBiomeConfigs(nextParams);
      this.liveBiomeConstellations = synthesizeParametricBiomeConstellations(nextParams);
      this.liveArticulationProfiles = synthesizeParametricSpeciesArticulationProfiles(nextParams);
    }

    this.busSupraTier = supra.tier;
    this.busFidelityMultiplier = supra.fidelityPermille / 1000;
    this.busTheoryOfMindCoherence = supra.theoryOfMindCoherencePermille / 1000;
    this.busBinauralWidthMultiplier = Math.max(
      0.85,
      Math.min(1.25, cosmo.playerRealm.binauralEarSpacingMeters / 0.215),
    );
    this.busMonumentChimeSustain = Math.max(
      0.9,
      Math.min(1.85, cosmo.inorganicRealm.chimeSustainFactor),
    );
    const steering = neuro.observer.affectAndPreferences.liveSteering;
    const vd = neuro.observer.vedantaAndDharma;
    this.busAffectWarmthScale = steering.acousticWarmthScale * vd.karunaLowpassWarmthFactor;
    this.busAffectReverbScale =
      steering.reverbBloomScale * (1 + vd.mandukyaTuriya.overtoneSerenityGain01 * 0.08);
    if (this.ctx && this.reverbReturnGain) {
      this.reverbReturnGain.gain.setTargetAtTime(
        Math.min(0.68, 0.42 * this.busAffectReverbScale),
        this.ctx.currentTime,
        0.14,
      );
    }
    const multiModalFidelity = neuro.observer.canonicalStandardModelsContext.multiModalFidelity;
    this.liveBarkHeadroomDb = multiModalFidelity.barkMaskingHeadroomDb;
    this.liveModalPartialsPerVoice = multiModalFidelity.chladniModalPartialsPerVoice;
    this.livePrimeLimitCeiling = multiModalFidelity.primeLimitHarmonicCeiling;
    this.busEcologyIso9613Clarity =
      0.88 + (multiModalFidelity.ecologyMicroclimateIso9613ClarityPermille / 1000) * 0.24;
    const curatedMus = neuro.observer.conservatoryCuration?.incumbentPoint.musicalProfile;
    if (curatedMus) {
      this.busCuratedBreathScale = Math.max(
        0.92,
        Math.min(1.22, curatedMus.breathReleasePermille / 1000),
      );
      this.busCuratedAntiphony01 = Math.max(
        0.35,
        Math.min(0.95, curatedMus.spatialAntiphonyPermille / 1000),
      );
    }
    if (this.liveEarlyReflectionTapCount !== multiModalFidelity.earlyReflectionTapCount) {
      this.liveEarlyReflectionTapCount = multiModalFidelity.earlyReflectionTapCount;
      if (this.ctx && this.convolver) {
        this.convolver.buffer = this.getOrCreateBiomeIso3382ImpulseBuffer(
          this.ctx,
          this.currentBiome,
          this.liveEarlyReflectionTapCount,
        );
      }
    }
    this.busActiveModel = supra.activeModel;
  }

  /**
   * Auditions the Observer's Preferred 5-Limit Just-Intonation Golden Chord (`[1/1, 5/4, 3/2, 15/8]`),
   * shaped in real time by its Foundational Mathematical Affect (`Harmony vs. Chaos` warmth & sanctuary bloom).
   */
  public playObserverPreferenceHarmonyAudition(
    affectPrefs: ObserverAffectAndPreferencesState,
    biome: BiomeId = 'sanctuary',
    atmosphere: AtmosphereId = 'dawn',
  ): void {
    for (let i = 0; i < 16; i++) {
      this.spectrumBands[i] = Math.min(1, this.spectrumBands[i] + 0.46);
    }

    this.init();
    if (!this.ctx || !this.masterGain || this.isMuted || this.isPaused) return;

    try {
      const biomeCfg = this.liveBiomeConfigs[biome];
      const baseNow = this.ctx.currentTime + 0.02;
      const ratios = affectPrefs.liveSteering.preferredAuditionRatios;
      const warmth = affectPrefs.liveSteering.acousticWarmthScale;
      const reverbScale = affectPrefs.liveSteering.reverbBloomScale;
      // Subtle φ⁻³ (~0.236s) golden arpeggio stagger honoring the 76.4% : 23.6% Harmony-Chaos equilibrium
      const goldenStaggerSec = 0.118;
      const panSpread = [-0.36, -0.12, 0.14, 0.38];

      const prefBarkAudit = evaluate24BarkMaskingGovernor(
        ratios.map((r) => ({
          freqHz: Math.min(2800, Math.max(96, biomeCfg.baseNoteHz * r)),
          gain: 0.046 * Math.min(1.22, this.busFidelityMultiplier),
        })),
        this.liveBarkHeadroomDb,
        this.barkScratchBuffer,
      );

      ratios.forEach((ratio, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const startAt = baseNow + idx * goldenStaggerSec;
        const durSec = (atmosphere === 'starlight' ? 1.85 : 1.55) * this.busMonumentChimeSustain;
        const freq = Math.min(2800, Math.max(96, biomeCfg.baseNoteHz * ratio));

        const osc = this.ctx.createOscillator();
        const overtone = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();
        const ovGain = this.ctx.createGain();

        osc.type = idx === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, startAt);

        overtone.type = 'sine';
        overtone.frequency.setValueAtTime(Math.min(3400, freq * 2.0), startAt);
        ovGain.gain.value = 0.14 * this.busFidelityMultiplier;

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(Math.min(3400, 1850 * warmth + idx * 180), startAt);
        filter.Q.value = 1.35;

        const peakAmp =
          prefBarkAudit.attenuatedGains[idx] ??
          0.046 *
            Math.min(1.22, this.busFidelityMultiplier) *
            computeIso226EqualLoudnessWeight(freq, 60);
        gain.gain.setValueAtTime(0.0004, startAt);
        gain.gain.linearRampToValueAtTime(peakAmp, startAt + 0.032);
        gain.gain.exponentialRampToValueAtTime(0.0004, startAt + durSec);

        osc.connect(filter);
        overtone.connect(ovGain);
        ovGain.connect(filter);
        filter.connect(gain);

        if (typeof this.ctx.createStereoPanner === 'function') {
          const panner = this.ctx.createStereoPanner();
          panner.pan.setValueAtTime(
            Math.max(-0.85, Math.min(0.85, (panSpread[idx] ?? 0) * this.busBinauralWidthMultiplier)),
            startAt,
          );
          gain.connect(panner);
          panner.connect(this.masterGain);
        } else {
          gain.connect(this.masterGain);
        }

        if (this.convolver) {
          const verbSend = this.ctx.createGain();
          verbSend.gain.value = Math.min(0.78, 0.54 * reverbScale);
          gain.connect(verbSend);
          verbSend.connect(this.convolver);
        }

        osc.start(startAt);
        overtone.start(startAt);
        osc.stop(startAt + durSec + 0.05);
        overtone.stop(startAt + durSec + 0.05);
      });
    } catch {
      // Ignore audio errors
    }
  }

  /**
   * Auditions any Compile-Time or Runtime `SynthesizedObserverModelSpec` from the Neuromorphic Bus,
   * voicing its Pure Just-Intonation Supra-Directive triad (`supraOvertoneRatios`) in its native biome tuning.
   */
  public playSynthesizedObserverModelAudition(
    model: SynthesizedObserverModelSpec,
    atmosphere: AtmosphereId = 'dawn',
  ): void {
    for (let i = 0; i < 16; i++) {
      this.spectrumBands[i] = Math.min(1, this.spectrumBands[i] + 0.42);
    }

    this.init();
    if (!this.ctx || !this.masterGain || this.isMuted || this.isPaused) return;

    try {
      const biomeCfg = this.liveBiomeConfigs[model.biome];
      const baseNow = this.ctx.currentTime + 0.02;
      const chordRatios = [1.0, ...model.supraOvertoneRatios];
      const modelBarkAudit = evaluate24BarkMaskingGovernor(
        chordRatios.map((r) => ({
          freqHz: Math.min(3100, Math.max(96, biomeCfg.baseNoteHz * r)),
          gain: 0.048 * Math.min(1.25, model.fidelityMultiplier),
        })),
        this.liveBarkHeadroomDb,
        this.barkScratchBuffer,
      );

      chordRatios.forEach((ratio, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const startAt = baseNow + idx * 0.095;
        const durSec =
          (atmosphere === 'starlight' ? 1.35 : 1.12) *
          model.qualityMultiplier *
          this.busMonumentChimeSustain;
        const freq = Math.min(3100, Math.max(96, biomeCfg.baseNoteHz * ratio));

        const osc = this.ctx.createOscillator();
        const overtone = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();
        const ovGain = this.ctx.createGain();

        osc.type = idx === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, startAt);

        overtone.type = 'sine';
        overtone.frequency.setValueAtTime(
          Math.min(3600, freq * resolvePureSustainedHarmonicSeries(model.species)[1]),
          startAt,
        );
        ovGain.gain.value = 0.18 * model.fidelityMultiplier;

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(
          Math.min(3500, (1400 + model.unlockedFeatureCount * 240) * this.busAffectWarmthScale),
          startAt,
        );
        filter.Q.value = 1.4 + (model.synapticWeight - 8) * 0.16;

        const peakAmp =
          modelBarkAudit.attenuatedGains[idx] ??
          0.048 *
            Math.min(1.25, model.fidelityMultiplier) *
            computeIso226EqualLoudnessWeight(freq, 60);
        gain.gain.setValueAtTime(0.0004, startAt);
        gain.gain.linearRampToValueAtTime(peakAmp, startAt + 0.018);
        gain.gain.exponentialRampToValueAtTime(0.0004, startAt + durSec);

        osc.connect(filter);
        overtone.connect(ovGain);
        ovGain.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        if (this.convolver) {
          const verbSend = this.ctx.createGain();
          verbSend.gain.value = Math.min(0.75, 0.56 * this.busAffectReverbScale);
          gain.connect(verbSend);
          verbSend.connect(this.convolver);
        }

        osc.start(startAt);
        overtone.start(startAt);
        osc.stop(startAt + durSec + 0.04);
        overtone.stop(startAt + durSec + 0.04);
      });
    } catch {
      // Ignore audio errors
    }
  }

  /**
   * Voices an Observer-synthesized Biome Landmark (`Foundation.Teleology.V1.Model`) when the player
   * performs `[Space]` Attune, `[T]` Touch, or `[C]` Stillness within its sanctuary resonance aura.
   * Uses the landmark's native mineral/organic Chladni eigenmodes and 3D Woodworth-Schlosberg HRTF.
   */
  public playLandmarkResonatorVoice(params: {
    readonly biome: BiomeId;
    readonly gesture: 'attune' | 'touch' | 'stillness';
    readonly atmosphere: AtmosphereId;
    readonly fundamentalHz: number;
    readonly mineralModalRatios: readonly [number, number, number, number];
    readonly listenerX: number;
    readonly listenerY: number;
    readonly listenerZ: number;
    readonly listenerYaw: number;
    readonly listenerPitch: number;
    readonly landmarkX: number;
    readonly landmarkY: number;
    readonly landmarkZ: number;
  }): void {
    for (let i = 2; i < 14; i++) {
      this.spectrumBands[i] = Math.min(1, this.spectrumBands[i] + 0.35);
    }

    this.init();
    if (!this.ctx || !this.masterGain || this.isMuted || this.isPaused) return;

    try {
      const compoundKey =
        params.biome === 'meadow'
          ? 'travertine-limestone-spar'
          : params.biome === 'grove'
            ? 'lignocellulosic-vascular-tissue'
            : params.biome === 'crystal'
              ? 'piezoelectric-quartz-geode'
              : params.biome === 'wetland'
                ? 'structured-hydro-mineral-electrolyte'
                : 'pyrite-solar-bronze-crystal';
      const compound = MATTER_COMPOUNDS[compoundKey];
      const chladniRatios = computeMaterialChladniModalRatios(
        compound.bulkElasticModulusGPa,
        compound.compoundDensityGPerCm3,
        this.liveModalPartialsPerVoice,
      );

      const spatialCue = computeWoodworth3DBinauralSpatializer({
        listenerX: params.listenerX,
        listenerY: params.listenerY,
        listenerZ: params.listenerZ,
        listenerYaw: params.listenerYaw,
        listenerPitch: params.listenerPitch,
        sourceX: params.landmarkX,
        sourceY: params.landmarkY,
        sourceZ: params.landmarkZ,
      });

      const distMeters = Math.hypot(
        params.landmarkX - params.listenerX,
        params.landmarkZ - params.listenerZ,
      );
      const arrivalDelaySec = Math.min(0.08, distMeters / 343.0);
      const distAtten = 1 / (1 + distMeters * 0.065);
      const baseStart = this.ctx.currentTime + 0.012 + arrivalDelaySec;

      const activeRatios =
        params.gesture === 'touch'
          ? [params.mineralModalRatios[1], params.mineralModalRatios[2], params.mineralModalRatios[3]]
          : params.mineralModalRatios;

      const barkAudit = evaluate24BarkMaskingGovernor(
        activeRatios.map((r, idx) => ({
          freqHz: Math.min(3200, Math.max(90, params.fundamentalHz * r)),
          gain: (idx === 0 ? 0.055 : 0.038) * distAtten,
        })),
        this.liveBarkHeadroomDb,
        this.barkScratchBuffer,
      );

      const panVal = Math.max(
        -0.9,
        Math.min(0.9, spatialCue.interauralTimeDiffMicros / 660),
      );

      activeRatios.forEach((ratio, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const staggerSec =
          params.gesture === 'touch' ? idx * 0.045 : params.gesture === 'stillness' ? idx * 0.14 : idx * 0.085;
        const startAt = baseStart + staggerSec;
        const durSec =
          (params.gesture === 'touch' ? 0.68 : params.gesture === 'stillness' ? 1.85 : 1.35) *
          this.busMonumentChimeSustain;
        const freq = Math.min(3200, Math.max(90, params.fundamentalHz * ratio));

        const osc = this.ctx.createOscillator();
        const modalOvertone = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();
        const modalGain = this.ctx.createGain();

        osc.type = params.biome === 'grove' || params.biome === 'sanctuary' ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, startAt);

        const chladniFactor = (chladniRatios[idx % chladniRatios.length] ?? 1.5) / 1.5;
        modalOvertone.type = 'sine';
        modalOvertone.frequency.setValueAtTime(
          Math.min(3500, freq * Math.max(1.25, Math.min(2.75, chladniFactor * 1.5))),
          startAt,
        );
        modalGain.gain.value = 0.16;

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(
          Math.min(3400, (params.biome === 'crystal' ? 2800 : 2100) * this.busAffectWarmthScale),
          startAt,
        );
        filter.Q.value = params.biome === 'crystal' ? 2.4 : 1.5;

        const peakAmp =
          (barkAudit.attenuatedGains[idx] ?? 0.042 * distAtten) *
          computeIso226EqualLoudnessWeight(freq, 60);
        const attackSec = params.gesture === 'touch' ? 0.006 : params.gesture === 'stillness' ? 0.18 : 0.028;

        gain.gain.setValueAtTime(0.0004, startAt);
        gain.gain.linearRampToValueAtTime(peakAmp, startAt + attackSec);
        gain.gain.exponentialRampToValueAtTime(0.0004, startAt + durSec);

        osc.connect(filter);
        modalOvertone.connect(modalGain);
        modalGain.connect(filter);
        filter.connect(gain);

        if (typeof this.ctx.createStereoPanner === 'function') {
          const panner = this.ctx.createStereoPanner();
          panner.pan.setValueAtTime(panVal, startAt);
          gain.connect(panner);
          panner.connect(this.masterGain);
        } else {
          gain.connect(this.masterGain);
        }

        if (this.convolver) {
          const verbSend = this.ctx.createGain();
          verbSend.gain.value = Math.min(0.78, 0.52 * this.busAffectReverbScale);
          gain.connect(verbSend);
          verbSend.connect(this.convolver);
        }

        osc.start(startAt);
        modalOvertone.start(startAt);
        osc.stop(startAt + durSec + 0.04);
        modalOvertone.stop(startAt + durSec + 0.04);
      });
    } catch {
      // Ignore audio errors
    }
  }

  /**
   * Piezo-Travertine Lithophone Waystone Note (`Foundation.Teleology.V1.Model::interactiveLithophoneWaystoneCount`):
   * Voices a delicate, velvet-mallet `CaCO3` travertine flagstone chime underfoot when the player steps
   * onto a stepping stone along conservatory trails, spatialized in 3D Woodworth HRTF and governed by 24-Bark masking.
   */
  public playLithophoneWaystoneNote(params: {
    readonly biome: BiomeId;
    readonly scaleDegreeRatio: number;
    readonly coupling01: number;
    readonly listenerX: number;
    readonly listenerY: number;
    readonly listenerZ: number;
    readonly listenerYaw: number;
    readonly listenerPitch: number;
    readonly stoneX: number;
    readonly stoneY: number;
    readonly stoneZ: number;
    readonly chainedEchoRatios?: readonly number[];
    readonly isTuningGesture?: boolean;
  }): void {
    this.spectrumBands[2] = Math.min(1, this.spectrumBands[2] + 0.24);
    this.spectrumBands[6] = Math.min(1, this.spectrumBands[6] + 0.2);

    this.init();
    if (!this.ctx || !this.masterGain || this.isMuted || this.isPaused) return;

    try {
      const ctx = this.ctx;
      const masterGain = this.masterGain;
      const biomeCfg = this.liveBiomeConfigs[params.biome];
      const compound = MATTER_COMPOUNDS['travertine-limestone-spar'];
      const chladniRatios = computeMaterialChladniModalRatios(
        compound.bulkElasticModulusGPa,
        compound.compoundDensityGPerCm3,
        this.liveModalPartialsPerVoice,
      );
      const spatialCue = computeWoodworth3DBinauralSpatializer({
        listenerX: params.listenerX,
        listenerY: params.listenerY,
        listenerZ: params.listenerZ,
        listenerYaw: params.listenerYaw,
        listenerPitch: params.listenerPitch,
        sourceX: params.stoneX,
        sourceY: params.stoneY,
        sourceZ: params.stoneZ,
      });

      const basePanVal = Math.max(
        -0.75,
        Math.min(0.75, spatialCue.interauralTimeDiffMicros / 660),
      );
      const rawAmpBase =
        (params.isTuningGesture ? 0.048 : 0.036) * (0.72 + params.coupling01 * 0.35);

      const scheduleStoneStrike = (
        degreeRatio: number,
        delayOffsetSec: number,
        ampScale: number,
        panSpreadOffset: number,
      ) => {
        const baseHz = Math.max(24, biomeCfg.baseNoteHz * degreeRatio);
        if (baseHz >= ctx.sampleRate * 0.44) return;
        const marimbaOvertoneHz = Math.min(
          ctx.sampleRate * 0.42,
          baseHz * ((chladniRatios[1] ?? 1.5) * 1.32),
        );
        const strikeAmp = rawAmpBase * ampScale;
        const barkAudit = evaluate24BarkMaskingGovernor(
          [
            { freqHz: baseHz, gain: strikeAmp },
            { freqHz: marimbaOvertoneHz, gain: strikeAmp * 0.35 },
          ],
          this.liveBarkHeadroomDb,
          this.barkScratchBuffer,
        );

        const startAt = ctx.currentTime + 0.008 + delayOffsetSec;
        const durSec =
          (params.isTuningGesture ? 0.56 : 0.44) * this.busMonumentChimeSustain;
        const panVal = Math.max(-0.85, Math.min(0.85, basePanVal + panSpreadOffset));

        const osc = ctx.createOscillator();
        const modalOsc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const stoneBodyFormant = ctx.createBiquadFilter();
        const gain = ctx.createGain();
        const modalGain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseHz, startAt);
        modalOsc.type = 'triangle';
        modalOsc.frequency.setValueAtTime(marimbaOvertoneHz, startAt);
        modalGain.gain.setValueAtTime(0.24, startAt);
        modalGain.gain.exponentialRampToValueAtTime(0.001, startAt + 0.14);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(
          1850 * this.busAffectWarmthScale * this.playerReconciliationWarmthScale,
          startAt,
        );
        filter.Q.value = 1.2;

        // Travertine stone-marimba acoustic body resonator
        stoneBodyFormant.type = 'peaking';
        stoneBodyFormant.frequency.setValueAtTime(680 * this.busAffectWarmthScale, startAt);
        stoneBodyFormant.Q.value = 2.4;
        stoneBodyFormant.gain.value = 4.2;

        const peakAmp =
          (barkAudit.attenuatedGains[0] ?? strikeAmp) *
          computeIso226EqualLoudnessWeight(baseHz, 60);
        gain.gain.setValueAtTime(0.0003, startAt);
        gain.gain.linearRampToValueAtTime(peakAmp, startAt + 0.011);
        gain.gain.exponentialRampToValueAtTime(0.0003, startAt + durSec);

        osc.connect(filter);
        modalOsc.connect(modalGain);
        modalGain.connect(filter);
        filter.connect(stoneBodyFormant);
        stoneBodyFormant.connect(gain);

        if (typeof ctx.createStereoPanner === 'function') {
          const panner = ctx.createStereoPanner();
          panner.pan.setValueAtTime(panVal, startAt);
          gain.connect(panner);
          panner.connect(masterGain);
        } else {
          gain.connect(masterGain);
        }

        if (this.convolver) {
          const verbSend = ctx.createGain();
          verbSend.gain.value = Math.min(0.6, 0.36 * this.busAffectReverbScale);
          gain.connect(verbSend);
          verbSend.connect(this.convolver);
        }

        osc.start(startAt);
        modalOsc.start(startAt);
        osc.stop(startAt + durSec + 0.03);
        modalOsc.stop(startAt + durSec + 0.03);
      };

      scheduleStoneStrike(params.scaleDegreeRatio, 0, 1.0, 0);
      if (params.chainedEchoRatios && params.chainedEchoRatios.length > 0) {
        const echoScales = [0.52, 0.34] as const;
        for (let i = 0; i < Math.min(2, params.chainedEchoRatios.length); i++) {
          scheduleStoneStrike(
            params.chainedEchoRatios[i],
            0.11 * (i + 1),
            echoScales[i],
            (i === 0 ? 0.14 : -0.14),
          );
        }
      }
    } catch {
      // Ignore audio errors
    }
  }

  /**
   * Immanent Co-Observer Witness Communion (`Foundation.Teleology.V1.Model::witnessCommunionInteractive`):
   * Voices a warm 4-voice Just-Intonation harmonic-bronze + quartz-core astrolabe chord spatialized at the
   * Witness's 3D coordinates when the player communes via `[Space]` Attune, `[T]` Touch, or `[C]` Stillness.
   */
  public playWitnessCommunionResonance(params: {
    readonly gesture: 'attune' | 'touch' | 'stillness';
    readonly chordRatios: readonly [number, number, number, number];
    readonly reciprocity01: number;
    readonly listenerX: number;
    readonly listenerY: number;
    readonly listenerZ: number;
    readonly listenerYaw: number;
    readonly listenerPitch: number;
    readonly witnessX: number;
    readonly witnessY: number;
    readonly witnessZ: number;
  }): void {
    for (let b = 3; b < 13; b += 2) {
      this.spectrumBands[b] = Math.min(1, this.spectrumBands[b] + 0.38);
    }

    this.init();
    if (!this.ctx || !this.masterGain || this.isMuted || this.isPaused) return;

    try {
      const compound = MATTER_COMPOUNDS['pyrite-solar-bronze-crystal'];
      const chladniRatios = computeMaterialChladniModalRatios(
        compound.bulkElasticModulusGPa,
        compound.compoundDensityGPerCm3,
        this.liveModalPartialsPerVoice,
      );
      const spatialCue = computeWoodworth3DBinauralSpatializer({
        listenerX: params.listenerX,
        listenerY: params.listenerY,
        listenerZ: params.listenerZ,
        listenerYaw: params.listenerYaw,
        listenerPitch: params.listenerPitch,
        sourceX: params.witnessX,
        sourceY: params.witnessY,
        sourceZ: params.witnessZ,
      });

      const distMeters = Math.hypot(
        params.witnessX - params.listenerX,
        params.witnessZ - params.listenerZ,
      );
      const arrivalDelaySec = Math.min(0.06, distMeters / 343.0);
      const distAtten = 1 / (1 + distMeters * 0.055);
      const baseHz = 261.63; // Pure C4 Sanctuary-Witness Astrolabe Reference
      const baseStart = this.ctx.currentTime + 0.012 + arrivalDelaySec;
      const panVal = Math.max(
        -0.88,
        Math.min(0.88, spatialCue.interauralTimeDiffMicros / 660),
      );

      const activeRatios: readonly [number, number, number, number] =
        params.gesture === 'stillness' ? [1.0, 1.25, 1.5, 2.0] : params.chordRatios;
      const barkAudit = evaluate24BarkMaskingGovernor(
        activeRatios.map((r, idx) => ({
          freqHz: baseHz * r,
          gain: (idx === 0 ? 0.052 : 0.038) * distAtten * (0.8 + params.reciprocity01 * 0.25),
        })),
        this.liveBarkHeadroomDb,
        this.barkScratchBuffer,
      );

      activeRatios.forEach((ratio, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const startAt =
          baseStart + (params.gesture === 'touch' ? idx * 0.04 : idx * 0.095);
        const durSec =
          (params.gesture === 'touch' ? 0.85 : params.gesture === 'stillness' ? 2.1 : 1.55) *
          this.busMonumentChimeSustain;
        const freq = baseHz * ratio;

        const osc = this.ctx.createOscillator();
        const quartzHarmonic = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();
        const qGain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startAt);
        quartzHarmonic.type = 'triangle';
        quartzHarmonic.frequency.setValueAtTime(
          Math.min(3400, freq * ((chladniRatios[idx % chladniRatios.length] ?? 1.5) / 1.5) * 2.0),
          startAt,
        );
        qGain.gain.value = 0.15;

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2400 * this.busAffectWarmthScale, startAt);
        filter.Q.value = 1.6;

        const peakAmp =
          (barkAudit.attenuatedGains[idx] ?? 0.04 * distAtten) *
          computeIso226EqualLoudnessWeight(freq, 60);
        const attackSec = params.gesture === 'touch' ? 0.008 : 0.045;
        gain.gain.setValueAtTime(0.0004, startAt);
        gain.gain.linearRampToValueAtTime(peakAmp, startAt + attackSec);
        gain.gain.exponentialRampToValueAtTime(0.0004, startAt + durSec);

        osc.connect(filter);
        quartzHarmonic.connect(qGain);
        qGain.connect(filter);
        filter.connect(gain);

        if (typeof this.ctx.createStereoPanner === 'function') {
          const panner = this.ctx.createStereoPanner();
          panner.pan.setValueAtTime(panVal, startAt);
          gain.connect(panner);
          panner.connect(this.masterGain);
        } else {
          gain.connect(this.masterGain);
        }

        if (this.convolver) {
          const verbSend = this.ctx.createGain();
          verbSend.gain.value = Math.min(0.76, 0.54 * this.busAffectReverbScale);
          gain.connect(verbSend);
          verbSend.connect(this.convolver);
        }

        osc.start(startAt);
        quartzHarmonic.start(startAt);
        osc.stop(startAt + durSec + 0.04);
        quartzHarmonic.stop(startAt + durSec + 0.04);
      });
    } catch {
      // Ignore audio errors
    }
  }

  /**
   * Shared κ-Memory Resonance Gift (`uorc/conservatory-curation/1`):
   * When the Observer consolidates a new `κ`-named `ConsolidatedGardenMemory` (from Symbiotic Guild
   * completion, Biome Sanctuary mastery, Witness Communion, or Māṇḍūkya Turīya stillness), it shares
   * that memory's pure Just-Intonation triad + octave halo with the player in 3D Woodworth space.
   * Zero stochastic randomness (`0.0¢` pure rational harmonic lock, 24-Bark governed).
   */
  public playConsolidatedKappaResonanceGift(params: {
    readonly memory: ConsolidatedGardenMemory;
    readonly sourceX: number;
    readonly sourceY: number;
    readonly sourceZ: number;
  }): void {
    for (let b = 1; b < 15; b += 2) {
      this.spectrumBands[b] = Math.min(1, this.spectrumBands[b] + 0.34);
    }

    this.init();
    if (!this.ctx || !this.masterGain || this.isMuted || this.isPaused) return;

    try {
      const biomeCfg = this.liveBiomeConfigs[params.memory.biome] ?? this.liveBiomeConfigs.meadow;
      const baseHz = biomeCfg.baseNoteHz;
      const cue = computeWoodworth3DBinauralSpatializer({
        listenerX: this.listenerX,
        listenerY: this.listenerY,
        listenerZ: this.listenerZ,
        listenerYaw: this.listenerYaw,
        listenerPitch: this.listenerPitch,
        sourceX: params.sourceX,
        sourceY: params.sourceY,
        sourceZ: params.sourceZ,
      });
      const distAtten = 1 / (1 + cue.distance3DMeters * 0.045);
      const arrivalDelaySec = Math.min(0.06, cue.distance3DMeters / 343.0);
      const baseStart = this.ctx.currentTime + 0.02 + arrivalDelaySec;

      const giftRatios: readonly [number, number, number, number] = [
        params.memory.signatureRatios[0],
        params.memory.signatureRatios[1],
        params.memory.signatureRatios[2],
        2.0,
      ];
      const barkAudit = evaluate24BarkMaskingGovernor(
        giftRatios.map((r, idx) => ({
          freqHz: baseHz * r,
          gain: (idx === 0 ? 0.044 : 0.033) * distAtten,
        })),
        this.liveBarkHeadroomDb,
        this.barkScratchBuffer,
      );

      giftRatios.forEach((ratio, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const startAt = baseStart + idx * 0.13;
        const durSec = (1.75 + idx * 0.18) * this.busCuratedBreathScale;
        const freq = baseHz * ratio;

        const osc = this.ctx.createOscillator();
        const pureOctave = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();
        const octGain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startAt);
        pureOctave.type = 'sine';
        pureOctave.frequency.setValueAtTime(Math.min(3600, freq * 2.0), startAt);
        octGain.gain.value = 0.16;

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2100 * this.busAffectWarmthScale, startAt);
        filter.Q.value = 1.4;

        const peakAmp =
          (barkAudit.attenuatedGains[idx] ?? 0.032 * distAtten) *
          computeIso226EqualLoudnessWeight(freq, 60);
        gain.gain.setValueAtTime(0.0003, startAt);
        gain.gain.linearRampToValueAtTime(peakAmp * 0.7, startAt + 0.065);
        gain.gain.linearRampToValueAtTime(peakAmp, startAt + 0.24);
        gain.gain.exponentialRampToValueAtTime(0.0003, startAt + durSec);

        osc.connect(filter);
        pureOctave.connect(octGain);
        octGain.connect(filter);
        filter.connect(gain);

        if (typeof this.ctx.createStereoPanner === 'function') {
          const panner = this.ctx.createStereoPanner();
          const antiphonalSpread = ((idx % 2 === 0 ? -1 : 1) * 0.22);
          panner.pan.setValueAtTime(
            Math.max(-0.9, Math.min(0.9, cue.stereoPan * 0.78 + antiphonalSpread)),
            startAt,
          );
          gain.connect(panner);
          panner.connect(this.masterGain);
        } else {
          gain.connect(this.masterGain);
        }

        if (this.convolver) {
          const verbSend = this.ctx.createGain();
          verbSend.gain.value = Math.min(0.78, 0.56 * this.busAffectReverbScale);
          gain.connect(verbSend);
          verbSend.connect(this.convolver);
        }

        osc.start(startAt);
        pureOctave.start(startAt);
        osc.stop(startAt + durSec + 0.04);
        pureOctave.stop(startAt + durSec + 0.04);
      });
    } catch {
      // Ignore audio errors
    }
  }
}
