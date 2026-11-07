/**
 * Procedural Web Audio Botanical Soundscape Engine
 * Zero external audio dependencies (zero 404s).
 * Driven by the formal Synthesis Voice-Leading & Diurnal Sky models in `prismModel.ts`.
 */

import {
  AtmosphereId,
  BIOME_CONFIGS,
  BiomeId,
  SoundscapeOutcome,
  computeSynthesisEnvelope,
  evaluateDiurnalProfile,
} from './prismModel';

export class BotanicalSoundscapeEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private droneOscA: OscillatorNode | null = null;
  private droneOscB: OscillatorNode | null = null;
  private droneFilter: BiquadFilterNode | null = null;
  private droneGain: GainNode | null = null;
  private windGain: GainNode | null = null;
  private windFilter: BiquadFilterNode | null = null;

  private isMuted = false;
  private isPaused = false;
  private currentBiome: BiomeId = 'meadow';
  private lastFootstepDist = 0;
  private lastMotifTime = 0;

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
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.isMuted ? 0 : 0.36;
      this.masterGain.connect(this.ctx.destination);

      // 1. Continuous Botanical Harmonic Pad Drone
      const biome = BIOME_CONFIGS[this.currentBiome];
      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.value = 0.08;

      this.droneFilter = this.ctx.createBiquadFilter();
      this.droneFilter.type = 'lowpass';
      this.droneFilter.frequency.value = 520;

      this.droneOscA = this.ctx.createOscillator();
      this.droneOscA.type = 'sine';
      this.droneOscA.frequency.value = biome.baseNoteHz * 0.5;

      this.droneOscB = this.ctx.createOscillator();
      this.droneOscB.type = 'triangle';
      this.droneOscB.frequency.value = biome.baseNoteHz * 0.75; // Perfect 5th

      this.droneOscA.connect(this.droneFilter);
      this.droneOscB.connect(this.droneFilter);
      this.droneFilter.connect(this.droneGain);
      this.droneGain.connect(this.masterGain);

      this.droneOscA.start();
      this.droneOscB.start();

      // 2. Movement-Responsive Aeolian Wind Layer (filtered white noise buffer)
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      this.windFilter = this.ctx.createBiquadFilter();
      this.windFilter.type = 'bandpass';
      this.windFilter.frequency.value = 340;
      this.windFilter.Q.value = 3.2;

      this.windGain = this.ctx.createGain();
      this.windGain.gain.value = 0.025;

      whiteNoise.connect(this.windFilter);
      this.windFilter.connect(this.windGain);
      this.windGain.connect(this.masterGain);
      whiteNoise.start();
    } catch {
      // Headless browser without audio device gracefully falls back to visual spectrum simulation
    }
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

  public setPaused(paused: boolean): void {
    this.isPaused = paused;
    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.setTargetAtTime(paused || this.isMuted ? 0 : 0.36, now, 0.08);
    }
  }

  /**
   * Updates continuous soundscape parameters each frame based on player movement,
   * biome harmony, diurnal atmosphere, and distance traveled.
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
    } = params;

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

    // Trigger soft organic footstep chime every 1.65m of walking
    if (totalDistanceMeters - this.lastFootstepDist >= 1.65 && velocityDm > 1) {
      this.lastFootstepDist = totalDistanceMeters;
      this.playFootstep(biome, velocityDm);
    }

    // Trigger periodic ambient motif when near plants
    if (elapsedSeconds - this.lastMotifTime > 2.6 && proximityDm <= 32) {
      this.lastMotifTime = elapsedSeconds;
      this.playOutcomeMotif(outcome, biome, 0.45, atmosphere);
    }

    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const biomeCfg = BIOME_CONFIGS[biome];
    const diurnalEval = evaluateDiurnalProfile(atmosphere, biome, harmony);

    if (biome !== this.currentBiome) {
      this.currentBiome = biome;
      if (this.droneOscA && this.droneOscB) {
        this.droneOscA.frequency.setTargetAtTime(biomeCfg.baseNoteHz * 0.5, now, 0.6);
        this.droneOscB.frequency.setTargetAtTime(biomeCfg.baseNoteHz * 0.75, now, 0.6);
      }
    }

    if (this.droneFilter) {
      this.droneFilter.frequency.setTargetAtTime(diurnalEval.padFilterCutoffHz, now, 0.35);
    }

    if (this.windFilter && this.windGain) {
      const windFreq = 260 + velNorm * 580;
      const windAmp = 0.018 + velNorm * 0.075;
      this.windFilter.frequency.setTargetAtTime(windFreq, now, 0.12);
      this.windGain.gain.setTargetAtTime(windAmp, now, 0.12);
    }

    if (this.droneGain) {
      const droneAmp = 0.06 + proxNorm * 0.08;
      this.droneGain.gain.setTargetAtTime(droneAmp, now, 0.2);
    }
  }

  /**
   * Pitch-varied (+/- 8%) soft moss/stone footstep + harmonic overtone droplet
   */
  public playFootstep(biome: BiomeId, velocityDm: number): void {
    if (!this.ctx || !this.masterGain || this.isMuted || this.isPaused) return;
    try {
      const now = this.ctx.currentTime;
      const biomeCfg = BIOME_CONFIGS[biome];
      const pitchJitter = 0.92 + Math.random() * 0.16;
      const ratio = biomeCfg.scaleRatios[Math.floor(Math.random() * biomeCfg.scaleRatios.length)];
      const freq = biomeCfg.baseNoteHz * ratio * pitchJitter * 0.5;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.65, now + 0.11);

      const amp = Math.min(0.09, 0.03 + (velocityDm / 30) * 0.05);
      gain.gain.setValueAtTime(amp, now);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.12);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.13);
    } catch {
      // Ignore audio errors
    }
  }

  /**
   * Plays a multi-note botanical synth motif governed by `computeSynthesisEnvelope`
   * for any of the 10 formal `SoundscapeOutcome` states.
   */
  public playOutcomeMotif(
    outcome: SoundscapeOutcome,
    biome: BiomeId,
    intensity = 1.0,
    atmosphere: AtmosphereId = 'dawn',
  ): void {
    for (let i = 0; i < 16; i++) {
      this.spectrumBands[i] = Math.min(1, this.spectrumBands[i] + 0.35 * intensity);
    }

    this.init();
    if (!this.ctx || !this.masterGain || this.isMuted || this.isPaused) return;

    try {
      const now = this.ctx.currentTime;
      const plan = computeSynthesisEnvelope(outcome, biome, atmosphere);

      plan.frequenciesHz.forEach((freq, step) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = plan.waveform;
        const startTime = now + step * plan.arpeggioStepSec;
        const duration = plan.noteDurationSec;
        osc.frequency.setValueAtTime(freq, startTime);

        if (outcome === 'sanctuary-chorus' || outcome === 'nocturnal-symphony') {
          osc.frequency.exponentialRampToValueAtTime(freq * 1.004, startTime + duration);
        }

        const peakGain =
          (outcome === 'sanctuary-chorus' ? 0.12 : outcome === 'wind-whisper' ? 0.05 : 0.1) *
          intensity;
        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(peakGain, startTime + 0.035);
        gain.gain.exponentialRampToValueAtTime(0.0008, startTime + duration);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(startTime);
        osc.stop(startTime + duration + 0.02);
      });
    } catch {
      // Ignore audio errors
    }
  }
}
