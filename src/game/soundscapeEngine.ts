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
      const fundStartHz = freq * surfComp.footstepFundamentalMultiplier;
      const ovStartHz = freq * surfComp.footstepOvertoneRatio;
      const decaySec = surfComp.footstepDecaySec;

      if (surfaceMaterial === 'shallow-water') {
        // Liquid wading splash & upward meniscus bubble harmonic (`structured-hydro-mineral-electrolyte`)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(fundStartHz, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.32, now + decaySec * 0.88);
        overtone.type = 'sine';
        overtone.frequency.setValueAtTime(ovStartHz, now);
        overtone.frequency.exponentialRampToValueAtTime(freq * 2.45, now + decaySec * 0.82);
        overtoneGain.gain.value = 0.34;
        gain.gain.setValueAtTime(amp * 1.1, now);
        gain.gain.exponentialRampToValueAtTime(0.0008, now + decaySec);
      } else if (surfaceMaterial === 'travertine-stone') {
        // Crisp travertine flagstone tap (`travertine-limestone-spar`)
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(fundStartHz, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.72, now + decaySec * 0.9);
        overtone.type = 'sine';
        overtone.frequency.setValueAtTime(ovStartHz, now);
        overtone.frequency.exponentialRampToValueAtTime(freq * 2.1, now + decaySec * 0.7);
        overtoneGain.gain.value = 0.28;
        gain.gain.setValueAtTime(amp, now);
        gain.gain.exponentialRampToValueAtTime(0.0008, now + decaySec);
      } else if (surfaceMaterial === 'quartz-crystalline') {
        // Crystalline geode mineral ping (`piezoelectric-quartz-geode`)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(fundStartHz, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.25, now + decaySec * 0.92);
        overtone.type = 'sine';
        overtone.frequency.setValueAtTime(ovStartHz, now);
        overtone.frequency.exponentialRampToValueAtTime(freq * 3.5, now + decaySec * 0.75);
        overtoneGain.gain.value = 0.25;
        gain.gain.setValueAtTime(amp * 0.95, now);
        gain.gain.exponentialRampToValueAtTime(0.0008, now + decaySec);
      } else if (surfaceMaterial === 'bamboo-humus') {
        // Warm hollow bamboo/woody resonance (`lignocellulosic-vascular-tissue`)
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(fundStartHz, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.62, now + decaySec * 0.92);
        overtone.type = 'triangle';
        overtone.frequency.setValueAtTime(ovStartHz, now);
        overtone.frequency.exponentialRampToValueAtTime(freq * 1.45, now + decaySec * 0.75);
        overtoneGain.gain.value = 0.3;
        gain.gain.setValueAtTime(amp, now);
        gain.gain.exponentialRampToValueAtTime(0.0008, now + decaySec);
      } else {
        // Soft meadow turf & moss brush (`bioluminescent-mycelial-humus`)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(fundStartHz, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.68, now + decaySec * 0.92);
        overtone.type = 'triangle';
        overtone.frequency.setValueAtTime(ovStartHz, now);
        overtone.frequency.exponentialRampToValueAtTime(freq * 1.1, now + decaySec * 0.75);
        overtoneGain.gain.value = 0.2;
        gain.gain.setValueAtTime(amp * 0.9, now);
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
        const peakGain =
          (outcome === 'sanctuary-chorus' ? 0.11 : outcome === 'wind-whisper' ? 0.045 : 0.09) *
          intensity *
          spatial.distanceGainMultiplier;
        voiceGain.gain.setValueAtTime(0.0008, startTime);
        voiceGain.gain.linearRampToValueAtTime(peakGain, startTime + speciesProfile.attackSec);
        voiceGain.gain.exponentialRampToValueAtTime(0.0006, startTime + duration);

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

        // Partial 2: Species Modal Second Partial (modulated by circadian stomatal conductance)
        const oscOvertone = this.ctx.createOscillator();
        const overtoneGain = this.ctx.createGain();
        oscOvertone.type = plan.overtoneWaveform;
        oscOvertone.frequency.setValueAtTime(freq * ratios[1], startTime);
        overtoneGain.gain.value =
          plan.overtoneGainRatio * weights[1] * (1.2 + circadian.stomatalConductance * 0.35);

        // Partial 3: Species Modal Third / Sub-Foundation Partial (enriched by mycorrhizal humus)
        const oscSub = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        oscSub.type = 'sine';
        oscSub.frequency.setValueAtTime(plan.subFrequenciesHz[step] * ratios[0], startTime);
        subGain.gain.value =
          plan.subOctaveGainRatio * weights[0] * (0.85 + biochem.mycorrhizalNutrientFlux * 0.3);

        // Partial 4: Species Modal Fourth Partial with Natural Chorus Shimmer
        const oscShimmer = this.ctx.createOscillator();
        const shimmerGain = this.ctx.createGain();
        oscShimmer.type = 'sine';
        oscShimmer.frequency.setValueAtTime(freq * ratios[2] * 1.0022, startTime);
        shimmerGain.gain.value = weights[2] * (0.4 + biochem.luciferinOxidationRate * 0.12);

        // Partial 5: Species Modal Fifth Partial (Piezoelectric Silica / Campanula Bell Transient)
        const oscBellTransient = this.ctx.createOscillator();
        const bellTransientGain = this.ctx.createGain();
        oscBellTransient.type = 'sine';
        oscBellTransient.frequency.setValueAtTime(freq * ratios[3], startTime);
        bellTransientGain.gain.setValueAtTime(
          plan.bellTransientGainRatio *
            (weights[3] + weights[4]) *
            (0.85 + biochem.silicaMineralIndex * 0.45),
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

        // Partial 6 (Supra-Directive Observer Harmonic Shimmer when w > 8 on Neuromorphic Bus)
        if (this.busSupraTier >= 1 && this.busActiveModel) {
          const supraRatio = this.busActiveModel.supraOvertoneRatios[step % 3] ?? 1.875;
          const supraFreq = Math.min(3400, f1 * supraRatio);
          const oscSupra = this.ctx.createOscillator();
          const supraGain = this.ctx.createGain();
          oscSupra.type = 'sine';
          oscSupra.frequency.setValueAtTime(supraFreq, startTime);
          supraGain.gain.value =
            0.055 * (0.65 + this.busSupraTier * 0.18) * this.busFidelityMultiplier * this.busTheoryOfMindCoherence;
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

      constellation.chordRatios.forEach((ratio, voiceIdx) => {
        if (!this.ctx || !this.masterGain) return;
        const startTime = now + voiceIdx * 0.085;
        const duration = atmosphere === 'starlight' ? 1.85 : 1.45;
        const freq = biomeCfg.baseNoteHz * ratio;
        const panPos = -0.55 + (voiceIdx / Math.max(1, constellation.chordRatios.length - 1)) * 1.1;

        const osc = this.ctx.createOscillator();
        const overtone = this.ctx.createOscillator();
        const voiceGain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        overtone.type = 'triangle';
        overtone.frequency.setValueAtTime(freq * spProfile.modalPartialRatios[1], startTime);
        const ovGain = this.ctx.createGain();
        ovGain.gain.value = 0.28;

        voiceGain.gain.setValueAtTime(0.0006, startTime);
        voiceGain.gain.linearRampToValueAtTime(0.068, startTime + 0.035);
        voiceGain.gain.exponentialRampToValueAtTime(0.0005, startTime + duration);

        osc.connect(voiceGain);
        overtone.connect(ovGain);
        ovGain.connect(voiceGain);

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

      oscStrikeModal.type = 'sine';
      oscStrikeModal.frequency.setValueAtTime(
        basePluckHz * spProfile.modalPartialRatios[2],
        now,
      );
      modalGain.gain.setValueAtTime(
        0.38 + biochem.silicaMineralIndex * 0.18 + circadian.stomatalConductance * 0.08,
        now,
      );
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
      const peakGain = 0.145 * spatial.distanceGainMultiplier;
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

        const peakAmp = (idx === 0 ? 0.065 : 0.052) * spatial.distanceGainMultiplier;
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

        overtone.type = 'sine';
        overtone.frequency.setValueAtTime(
          freq * (spProfile.modalPartialRatios[1] ?? 1.5),
          startTime,
        );
        ovGain.gain.value = 0.16 + weightNorm * 0.22 + circadian.stomatalConductance * 0.08;

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(
          Math.min(spatial.effectiveLowpassHz, 950 + weightNorm * 1400),
          startTime,
        );
        filter.Q.value = 1.1 + weightNorm * 1.8 + biochem.silicaMineralIndex * 1.2;

        const peakAmp = (0.032 + weightNorm * 0.024) * spatial.distanceGainMultiplier;
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
      step.voices.forEach((voice) => {
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

        overtone.type = 'sine';
        overtone.frequency.setValueAtTime(
          voice.frequencyHz *
            (isBass ? 1.5 : (spProfile.modalPartialRatios[1] ?? 2.0) * partialStiffness),
          now,
        );
        ovGain.gain.value =
          (isBass ? 0.28 : isOstinato ? 0.18 : 0.22) * (0.85 + circadian.stomatalConductance * 0.2);

        filter.type = 'lowpass';
        const rawCutoff = isBass ? 360 : isOstinato ? 1650 : 1280;
        filter.frequency.setValueAtTime(
          Math.min(
            spatial.effectiveLowpassHz,
            Math.max(
              rawCutoff,
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
        const peakAmp = voice.amplitude * (0.45 + spatial.distanceGainMultiplier * 0.55);

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

        const peakAmp = 0.046 * Math.min(1.22, this.busFidelityMultiplier);
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

        const peakAmp = 0.048 * Math.min(1.25, model.fidelityMultiplier);
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
