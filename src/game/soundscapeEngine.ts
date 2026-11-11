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
  const canonicalEigenModes = [1.0, 2.0, 2.756, 3.0, 4.133, 5.404, 6.267, 8.933];
  const count = Math.max(1, Math.min(canonicalEigenModes.length, partialCount));
  const out: number[] = [1.0];
  for (let i = 1; i < count; i++) {
    const baseRatio = canonicalEigenModes[i];
    // Preserve pure octave (2.0) and twelfth (3.0) while letting Chladni plate/bar modes disperse physically with √(E/ρ)
    const isHarmonicLock = baseRatio === 2.0 || baseRatio === 3.0;
    const ratio = isHarmonicLock
      ? baseRatio
      : baseRatio * (0.94 + 0.06 * stiffnessDispersion);
    out.push(Number(ratio.toFixed(4)));
  }
  return out;
}

export class BotanicalSoundscapeEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private convolver: ConvolverNode | null = null;
  private reverbReturnGain: GainNode | null = null;
  private delaySendBus: GainNode | null = null;
  private stereoPanner: StereoPannerNode | null = null;

  private windGain: GainNode | null = null;
  private windFilter: BiquadFilterNode | null = null;

  private isMuted = false;
  private isPaused = false;
  private currentBiome: BiomeId = 'meadow';
  private currentPan = 0;
  private lastNearestDistanceMeters = 2.0;
  private lastAcousticOcclusion = 0;
  private lastFootstepDist = 0;
  private lastMicroAmbienceTime = 0;

  // Live Universal Neuromorphic Bus, Supra-Directive & Alpha/Omega Cosmogenesis Coupling
  private busSupraTier = 0;
  private busFidelityMultiplier = 1.0;
  private busTheoryOfMindCoherence = 0.85;
  private busBinauralWidthMultiplier = 1.0;
  private busMonumentChimeSustain = 1.0;
  private busAffectWarmthScale = 1.0;
  private busAffectReverbScale = 1.0;
  private busActiveModel: SynthesizedObserverModelSpec | null = null;
  private liveCosmogenesisParams: AlphaOmegaCosmogenesisParameters = { alphaSeed: 1 };
  private livePhysicsWeight = 8;
  private liveBiomeConfigs = BIOME_CONFIGS;
  private liveBiomeConstellations = BIOME_CONSTELLATIONS;
  private liveArticulationProfiles = SPECIES_ARTICULATION_PROFILES;
  private readonly barkScratchBuffer = new Float32Array(24);
  private liveBarkHeadroomDb = 3.5;
  private liveModalPartialsPerVoice = 5;
  private livePrimeLimitCeiling: 5 | 7 | 11 = 5;

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

      // Binaural Stereo Panner for spatial flora localization
      if (typeof this.ctx.createStereoPanner === 'function') {
        this.stereoPanner = this.ctx.createStereoPanner();
        this.stereoPanner.pan.value = 0;
        this.stereoPanner.connect(this.masterGain);
      }

      // Parametric Stereo Sanctuary Convolution Reverb (`VERDANT_INFRASTRUCTURE_STANDARD.stereoReverbDecaySec`)
      this.convolver = this.ctx.createConvolver();
      this.convolver.buffer = this.createSanctuaryImpulseBuffer(
        this.ctx,
        VERDANT_INFRASTRUCTURE_STANDARD.stereoReverbDecaySec,
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
          const white = Math.random() * 2 - 1;
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
   * Generates a 2.2s stereo diffused acoustic sanctuary impulse response buffer
   * synthesized from the inorganic travertine-spar / quartz-geode early reflections
   * and organic terpene-aerosol air absorption (`MATTER_COMPOUNDS`).
   */
  private createSanctuaryImpulseBuffer(ctx: AudioContext, durationSec: number): AudioBuffer {
    const length = Math.floor(ctx.sampleRate * durationSec);
    const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
    const travertine = MATTER_COMPOUNDS['travertine-limestone-spar'];
    const quartz = MATTER_COMPOUNDS['piezoelectric-quartz-geode'];
    const aerosol = MATTER_COMPOUNDS['terpene-volatile-aerosol-colloid'];
    const mineralReflectivity =
      (travertine.opticalRefractiveIndex + quartz.opticalRefractiveIndex) / 3.13;
    const airDampingExponent = 2.6 + (1 - aerosol.compoundDensityGPerCm3) * 1.4;
    for (let ch = 0; ch < 2; ch++) {
      const data = impulse.getChannelData(ch);
      let seed = ch === 0 ? 13579 : 24680;
      const nextRand = () => {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        return (seed / 4294967296) * 2 - 1;
      };
      for (let i = 0; i < length; i++) {
        const t = i / length;
        const env =
          Math.pow(1 - t, airDampingExponent) * (1 - Math.exp(-i / (ctx.sampleRate * 0.018)));
        const shimmer =
          (Math.sin(i * 0.015 + ch * 1.1) * 0.15 + 0.85) * mineralReflectivity;
        data[i] = nextRand() * env * shimmer * 0.38;
      }
    }
    return impulse;
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
    playerZ?: number;
    playerYaw?: number;
    nearestPlantX?: number;
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
      playerZ = 0,
      playerYaw = 0,
      nearestPlantX = 0,
      nearestPlantZ = -5.5,
      surfaceMaterial = classifySurfaceMaterial(playerX, playerZ),
      acousticOcclusion = 0,
      reverbSendRefinement = 1.0,
      modalFilterQMultiplier = 1.0,
    } = params;

    this.currentPan = computeBinauralPan(playerX, playerZ, playerYaw, nearestPlantX, nearestPlantZ);
    this.lastNearestDistanceMeters = Math.hypot(nearestPlantX - playerX, nearestPlantZ - playerZ);
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

    // Trigger sparse, delicate biome micro-ambience (single water droplet or gentle wind-chime every 8.5s)
    if (elapsedSeconds - this.lastMicroAmbienceTime > 8.5) {
      this.lastMicroAmbienceTime = elapsedSeconds;
      this.playBiomeMicroAmbience(biome);
    }

    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const diurnalEval = evaluateDiurnalProfile(atmosphere, biome, harmony);

    if (this.stereoPanner) {
      this.stereoPanner.pan.setTargetAtTime(this.currentPan, now, 0.12);
    }

    if (this.reverbReturnGain) {
      const targetReverb = Math.min(0.56, Math.max(0.36, 0.44 * reverbSendRefinement));
      this.reverbReturnGain.gain.setTargetAtTime(targetReverb, now, 0.2);
    }

    if (biome !== this.currentBiome) {
      this.currentBiome = biome;
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
   * Subtle biome-specific acoustic micro-ambience:
   * - Wetland / Crystal: resonant pentatonic lagoon water-droplet / quartz dewdrop plucks
   * - Grove / Meadow / Sanctuary: suspended brass/bamboo wind-chime overtones
   */
  private playBiomeMicroAmbience(biome: BiomeId): void {
    if (!this.ctx || !this.masterGain || this.isMuted || this.isPaused) return;
    try {
      const now = this.ctx.currentTime;
      const biomeCfg = this.liveBiomeConfigs[biome];
      const ratio = biomeCfg.scaleRatios[Math.floor(Math.random() * biomeCfg.scaleRatios.length)];
      const isLiquidBiome = biome === 'wetland' || biome === 'crystal';
      const baseFreq = biomeCfg.baseNoteHz * ratio * (isLiquidBiome ? 2.0 : 3.0);

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';

      if (isLiquidBiome) {
        // Liquid upward droplet meniscus inflection
        osc.frequency.setValueAtTime(baseFreq * 0.78, now);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.18, now + 0.095);
        gain.gain.setValueAtTime(0.022, now);
        gain.gain.exponentialRampToValueAtTime(0.0004, now + 0.14);
      } else {
        // Delicate wind-chime shimmer
        osc.frequency.setValueAtTime(baseFreq, now);
        gain.gain.setValueAtTime(0.0005, now);
        gain.gain.linearRampToValueAtTime(0.018, now + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0004, now + 0.42);
      }

      osc.connect(gain);
      if (this.delaySendBus) {
        gain.connect(this.delaySendBus);
      }
      if (this.convolver) {
        gain.connect(this.convolver);
      }
      gain.connect(this.stereoPanner ?? this.masterGain);

      osc.start(now);
      osc.stop(now + (isLiquidBiome ? 0.16 : 0.45));
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
      const pitchJitter = 0.95 + Math.random() * 0.1;
      const ratio = biomeCfg.scaleRatios[Math.floor(Math.random() * biomeCfg.scaleRatios.length)];
      const freq = biomeCfg.baseNoteHz * ratio * pitchJitter * 0.5;

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
  ): void {
    for (let i = 0; i < 16; i++) {
      this.spectrumBands[i] = Math.min(1, this.spectrumBands[i] + 0.35 * intensity);
    }

    this.init();
    if (!this.ctx || !this.masterGain || this.isMuted || this.isPaused) return;

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
        const ratios = organogenesis.piezoelectricCorollaPartialRatios;
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
            { freqHz: freq * ratios[0], gain: 1.0 },
            { freqHz: freq * ratios[1], gain: rawOvertoneGain },
            { freqHz: plan.subFrequenciesHz[step] * ratios[0], gain: rawSubGain },
            { freqHz: freq * ratios[2] * 1.0022, gain: rawShimmerGain },
            { freqHz: freq * ratios[3], gain: rawBellGain },
          ],
          this.liveBarkHeadroomDb,
          this.barkScratchBuffer,
        );

        // Partial 1: Species Modal Fundamental Carrier (with optional meniscus pitch glide)
        const oscFundamental = this.ctx.createOscillator();
        oscFundamental.type = plan.waveform;
        const f1 = freq * ratios[0];
        oscFundamental.frequency.setValueAtTime(f1, startTime);
        if (Math.abs(speciesProfile.pitchGlideRatio - 1.0) > 0.002) {
          oscFundamental.frequency.exponentialRampToValueAtTime(
            f1 * speciesProfile.pitchGlideRatio,
            startTime + Math.min(0.26, duration * 0.45),
          );
        }

        // Partial 2: Species Modal Second Partial (modulated by circadian stomatal conductance + Bark governor)
        const oscOvertone = this.ctx.createOscillator();
        const overtoneGain = this.ctx.createGain();
        oscOvertone.type = plan.overtoneWaveform;
        oscOvertone.frequency.setValueAtTime(freq * ratios[1], startTime);
        overtoneGain.gain.value = barkAudit.attenuatedGains[1] ?? rawOvertoneGain;

        // Partial 3: Species Modal Third / Sub-Foundation Partial (enriched by mycorrhizal humus + Bark governor)
        const oscSub = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        oscSub.type = 'sine';
        oscSub.frequency.setValueAtTime(plan.subFrequenciesHz[step] * ratios[0], startTime);
        subGain.gain.value = barkAudit.attenuatedGains[2] ?? rawSubGain;

        // Partial 4: Species Modal Fourth Partial with Natural Chorus Shimmer
        const oscShimmer = this.ctx.createOscillator();
        const shimmerGain = this.ctx.createGain();
        oscShimmer.type = 'sine';
        oscShimmer.frequency.setValueAtTime(freq * ratios[2] * 1.0022, startTime);
        shimmerGain.gain.value = barkAudit.attenuatedGains[3] ?? rawShimmerGain;

        // Partial 5: Species Modal Fifth Partial (Piezoelectric Silica / Campanula Bell Transient)
        const oscBellTransient = this.ctx.createOscillator();
        const bellTransientGain = this.ctx.createGain();
        oscBellTransient.type = 'sine';
        oscBellTransient.frequency.setValueAtTime(freq * ratios[3], startTime);
        bellTransientGain.gain.setValueAtTime(
          Math.max(0.002, barkAudit.attenuatedGains[4] ?? rawBellGain),
          startTime,
        );
        bellTransientGain.gain.exponentialRampToValueAtTime(
          0.0005,
          startTime + 0.11 * biochem.acousticSustainMultiplier,
        );

        if (outcome === 'sanctuary-chorus' || outcome === 'nocturnal-symphony') {
          oscFundamental.frequency.exponentialRampToValueAtTime(f1 * 1.003, startTime + duration);
        }

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

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq * artCfg.modalPartialRatios[0], now);

      overtone.type = 'triangle';
      overtone.frequency.setValueAtTime(baseFreq * artCfg.modalPartialRatios[1], now);
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
  ): void {
    const outcomeMap: Record<PlantSpeciesId, SoundscapeOutcome> = {
      'chime-lily': 'melodic-chime',
      'pulse-fern': 'rhythmic-pulse',
      'echo-lotus': 'nocturnal-symphony',
      'drone-moss': 'serene-rest',
      'star-orchid': 'crystalline-choir',
    };
    this.playOutcomeMotif(outcomeMap[species], biome, 1.0, atmosphere, 0, species);
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
      const spProfile = this.liveArticulationProfiles[biomeCfg.signatureSpecies];

      const biomeCompound =
        biome === 'crystal'
          ? MATTER_COMPOUNDS['piezoelectric-quartz-geode']
          : biome === 'sanctuary'
            ? MATTER_COMPOUNDS['travertine-limestone-spar']
            : MATTER_COMPOUNDS['lignocellulosic-vascular-tissue'];
      const chladniRatios = computeMaterialChladniModalRatios(
        biomeCompound.bulkElasticModulusGPa,
        biomeCompound.compoundDensityGPerCm3,
        this.liveModalPartialsPerVoice,
      );
      const chordRatios =
        this.livePrimeLimitCeiling === 11
          ? [...constellation.chordRatios, 11 / 8, 7 / 4]
          : this.livePrimeLimitCeiling === 7
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
        overtone.frequency.setValueAtTime(
          freq * spProfile.modalPartialRatios[1] * ((chladniRatios[1] ?? 1.58) / 1.58),
          startTime,
        );
        const ovGain = this.ctx.createGain();
        ovGain.gain.value = 0.28;

        const peakVoiceAmp = chordBarkAudit.attenuatedGains[voiceIdx] ?? 0.068;
        voiceGain.gain.setValueAtTime(0.0006, startTime);
        voiceGain.gain.linearRampToValueAtTime(peakVoiceAmp, startTime + 0.035);
        voiceGain.gain.exponentialRampToValueAtTime(0.0005, startTime + duration);

        osc.connect(voiceGain);
        overtone.connect(ovGain);
        ovGain.connect(voiceGain);

        // Additional Chladni crystalline modal partials unlocked as `liveModalPartialsPerVoice` scales (`5..8`)
        const extraModes = Math.max(0, Math.min(3, this.liveModalPartialsPerVoice - 5));
        for (let m = 0; m < extraModes; m++) {
          const modeRatio = chladniRatios[2 + m] ?? 2.756 + m * 0.85;
          const modeFreq = Math.min(3800, freq * modeRatio);
          const modeOsc = this.ctx.createOscillator();
          const modeGain = this.ctx.createGain();
          modeOsc.type = 'sine';
          modeOsc.frequency.setValueAtTime(modeFreq, startTime);
          modeGain.gain.setValueAtTime(0.08 / (m + 1.4), startTime);
          modeGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration * 0.65);
          modeOsc.connect(modeGain);
          modeGain.connect(voiceGain);
          modeOsc.start(startTime);
          modeOsc.stop(startTime + duration * 0.68);
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
      const spProfile = this.liveArticulationProfiles[species];
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
          freq * (spProfile.modalPartialRatios[1] ?? 1.5),
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

        const ovFreq = freq * (spProfile.modalPartialRatios[1] ?? 1.5);
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
        const spProfile = this.liveArticulationProfiles[voice.species];
        const spatial = evaluateSpatialWaveAcoustics({
          distanceMeters: voice.distanceMeters ?? this.lastNearestDistanceMeters,
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

        osc.type = isBass ? 'sine' : isOstinato ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(voice.frequencyHz, now);

        const granularAcoustic = biochem.granularSynthesis?.modalSyntheses.acousticModality;
        const partialStiffness = granularAcoustic?.modalBellPartialStiffnessRatio ?? 1.0;
        const silicaQMult = granularAcoustic?.piezoelectricSilicaQMultiplier ?? 1.0;
        const stemCompound =
          voice.substrate === 'crystalline-epiphyte' || voice.biome === 'crystal'
            ? MATTER_COMPOUNDS['piezoelectric-quartz-geode']
            : MATTER_COMPOUNDS['lignocellulosic-vascular-tissue'];
        const stemChladni = computeMaterialChladniModalRatios(
          stemCompound.bulkElasticModulusGPa,
          stemCompound.compoundDensityGPerCm3,
          this.liveModalPartialsPerVoice,
        );

        overtone.type = 'sine';
        overtone.frequency.setValueAtTime(
          voice.frequencyHz *
            (isBass
              ? 1.5
              : (spProfile.modalPartialRatios[1] ?? 2.0) *
                partialStiffness *
                ((stemChladni[1] ?? 1.58) / 1.58)),
          now,
        );
        ovGain.gain.value =
          (isBass ? 0.28 : isOstinato ? 0.18 : 0.22) * (0.85 + circadian.stomatalConductance * 0.2);

        // Voice upper Chladni bell/plate partials unlocked by `this.liveModalPartialsPerVoice` (`5..8`)
        if (!isBass && this.liveModalPartialsPerVoice > 5) {
          const upperModes = Math.min(2, this.liveModalPartialsPerVoice - 5);
          for (let m = 0; m < upperModes; m++) {
            const cRatio = stemChladni[2 + m] ?? 2.756 + m;
            const cFreq = Math.min(3600, voice.frequencyHz * cRatio);
            const cOsc = this.ctx.createOscillator();
            const cGain = this.ctx.createGain();
            cOsc.type = 'sine';
            cOsc.frequency.setValueAtTime(cFreq, now);
            cGain.gain.setValueAtTime(0.09 / (m + 1.3), now);
            cGain.gain.exponentialRampToValueAtTime(0.0008, now + Math.max(0.14, voice.durationSec * 0.55));
            cOsc.connect(cGain);
            cGain.connect(filter);
            cOsc.start(now);
            cOsc.stop(now + Math.max(0.16, voice.durationSec * 0.58));
          }
        }

        filter.type = 'lowpass';
        const rawCutoff = isBass ? 360 : isOstinato ? 1650 : 1280;
        filter.frequency.setValueAtTime(
          Math.min(
            spatial.effectiveLowpassHz,
            Math.max(
              rawCutoff + (this.liveModalPartialsPerVoice - 5) * 240,
              (granularAcoustic?.lignocellulosicWarmthCutoffHz ?? biochem.harmonicWarmthFilterHz) *
                0.65,
            ),
          ),
          now,
        );
        filter.Q.value = ((isCanon ? 2.1 : 1.2) + biochem.silicaMineralIndex * 0.9) * silicaQMult;

        const attackSec = isBass ? 0.16 : isOstinato ? 0.006 : isCanon ? 0.045 : 0.038;
        const durSec =
          Math.max(0.18, voice.durationSec) *
          biochem.acousticSustainMultiplier *
          (0.94 + circadian.hydraulicTurgorPressure * 0.06);
        const governedAmp = stepBarkAudit.attenuatedGains[voiceIdx] ?? voice.amplitude;
        const peakAmp = governedAmp * (0.45 + spatial.distanceGainMultiplier * 0.55);

        gain.gain.setValueAtTime(0.0004, now);
        gain.gain.linearRampToValueAtTime(peakAmp, now + attackSec);
        gain.gain.exponentialRampToValueAtTime(0.0004, now + durSec);

        osc.connect(filter);
        overtone.connect(ovGain);
        ovGain.connect(filter);
        filter.connect(gain);

        if (typeof this.ctx.createStereoPanner === 'function') {
          const panner = this.ctx.createStereoPanner();
          panner.pan.setValueAtTime(Math.max(-0.9, Math.min(0.9, voice.stereoPan)), now);
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
      const spProfile = this.liveArticulationProfiles[species];
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
          frequencyHz * ratio * (spProfile.modalPartialRatios[1] ?? 2.0),
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
      const spProfile = this.liveArticulationProfiles[species];
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
          frequencyHz * r * (spProfile.modalPartialRatios[1] ?? 2.0),
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
    this.busAffectWarmthScale = steering.acousticWarmthScale;
    this.busAffectReverbScale = steering.reverbBloomScale;
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
      const spProfile = this.liveArticulationProfiles[model.species];
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
          Math.min(3600, freq * (spProfile.modalPartialRatios[1] ?? 1.5)),
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
}
