/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ATMOSPHERE_CONFIGS,
  AtmosphereId,
  BIOME_CONFIGS,
  BiomeId,
  PLANT_SPECIES_CONFIGS,
  SOUND_OUTCOME_PROFILES,
  SoundscapeOutcome,
  generateGardenPlants,
} from './game/prismModel';
import { BotanicalSoundscapeEngine } from './game/soundscapeEngine';
import {
  GameState,
  GardenCanvas,
  GardenImperativeHandle,
  LiveTelemetryState,
} from './components/GardenCanvas';
import {
  PauseGlyphIcon,
  PlantSpeciesIcon,
  ResetGlyphIcon,
  SoundWaveIcon,
  VerdantResonanceEmblem,
} from './components/BotanicalIcons';
import { PrismInspectorModal } from './components/PrismInspectorModal';

const ATMOSPHERE_ORDER: AtmosphereId[] = ['dawn', 'golden', 'twilight', 'starlight'];

export default function App() {
  const initialAutostart = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return params.get('autostart') === '1';
  }, []);

  const [gameState, setGameState] = useState<GameState>(initialAutostart ? 'playing' : 'title');
  const [atmosphere, setAtmosphere] = useState<AtmosphereId>('dawn');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [dockCollapsed, setDockCollapsed] = useState<boolean>(false);
  const [recentBanner, setRecentBanner] = useState<string | null>(null);

  const plants = useMemo(() => generateGardenPlants(42026), []);
  const soundEngine = useMemo(() => new BotanicalSoundscapeEngine(), []);
  const gardenHandleRef = useRef<GardenImperativeHandle | null>(null);
  const spectrumBarsRef = useRef<(SVGRectElement | null)[]>([]);

  const [telemetry, setTelemetry] = useState<LiveTelemetryState>(() => ({
    playerX: 0,
    playerZ: 0,
    playerYaw: 0,
    biome: 'meadow',
    atmosphere: 'dawn',
    chorus: 'dormant',
    affinityTier: 'sanctuary-peak',
    nearestPlant: plants[0],
    distanceMeters: 5.9,
    proximityDm: 20,
    velocityDm: 0,
    action: 'observe',
    prismRequest: 'meadow chime-lily observe dawn dormant 20 0',
    prismOutcome: 'dawn-arpeggio',
    prismRule: 'REQ-007',
    prismRuleDesc:
      'Morning mist around a Chime Lily at Dawn awakens sparkling dewdrop glass-marimba arpeggios.',
    harmony: 15,
    attunedCount: 0,
    totalPlants: plants.length,
    exploredBiomes: ['meadow'],
    guidedStroll: false,
  }));

  useEffect(() => {
    document.body.dataset.state = gameState;
    if (gameState !== 'playing') {
      document.exitPointerLock?.();
    }
    soundEngine.setPaused(gameState !== 'playing');
  }, [gameState, soundEngine]);

  // Animate 16-band SVG acoustic spectrum bars directly via DOM refs without React re-renders
  useEffect(() => {
    let rafId = 0;
    const updateSpectrumDom = () => {
      const bands = soundEngine.spectrumBands;
      for (let i = 0; i < 16; i++) {
        const el = spectrumBarsRef.current[i];
        if (el) {
          const h = Math.max(3, Math.round(bands[i] * 22));
          el.setAttribute('height', String(h));
          el.setAttribute('y', String(24 - h));
        }
      }
      rafId = requestAnimationFrame(updateSpectrumDom);
    };
    rafId = requestAnimationFrame(updateSpectrumDom);
    return () => cancelAnimationFrame(rafId);
  }, [soundEngine]);

  const startGame = useCallback(() => {
    document.body.dataset.state = 'playing';
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    soundEngine.init();
    soundEngine.setPaused(false);
    setGameState('playing');
  }, [soundEngine]);

  const handleRestart = useCallback(() => {
    gardenHandleRef.current?.resetExploration();
    document.body.dataset.state = 'playing';
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    soundEngine.init();
    soundEngine.setPaused(false);
    setGameState('playing');
  }, [soundEngine]);

  const handleToggleMute = useCallback(
    (e?: React.MouseEvent<HTMLButtonElement>) => {
      e?.currentTarget.blur();
      const next = !isMuted;
      setIsMuted(next);
      soundEngine.setMuted(next);
    },
    [isMuted, soundEngine],
  );

  const cycleAtmosphere = useCallback((e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.currentTarget.blur();
    setAtmosphere((prev) => {
      const idx = ATMOSPHERE_ORDER.indexOf(prev);
      return ATMOSPHERE_ORDER[(idx + 1) % ATMOSPHERE_ORDER.length];
    });
  }, []);

  const handlePlantAttuned = useCallback(
    (_plantId: string, biome: BiomeId, outcome: SoundscapeOutcome) => {
      const profile = SOUND_OUTCOME_PROFILES[outcome];
      const biomeCfg = BIOME_CONFIGS[biome];
      setRecentBanner(`${profile.label} · ${biomeCfg.name}`);
    },
    [],
  );

  useEffect(() => {
    if (!recentBanner) return;
    const timer = window.setTimeout(() => setRecentBanner(null), 2600);
    return () => clearTimeout(timer);
  }, [recentBanner]);

  // Global keyboard shortcuts for Title -> Start, Field Guide [P/Escape], Mute [M], Reset [R], Sky [L], Hide Dock [H]
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      if (gameState === 'title') {
        if (e.code === 'Enter' || e.code === 'Space') {
          e.preventDefault();
          startGame();
        }
        return;
      }

      if (e.code === 'Escape' || e.code === 'KeyP') {
        e.preventDefault();
        setGameState((prev) => (prev === 'playing' ? 'paused' : prev === 'paused' ? 'playing' : prev));
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        handleToggleMute();
      } else if (e.code === 'KeyR' && gameState === 'playing') {
        e.preventDefault();
        handleRestart();
      } else if (e.code === 'KeyL' && gameState === 'playing') {
        e.preventDefault();
        cycleAtmosphere();
      } else if (e.code === 'KeyH' && gameState === 'playing') {
        e.preventDefault();
        setDockCollapsed((prev) => !prev);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [gameState, startGame, handleToggleMute, handleRestart, cycleAtmosphere]);

  useEffect(() => {
    if (gameState === 'playing' && telemetry.harmony >= 100) {
      const timer = window.setTimeout(() => {
        setGameState('gameover');
      }, 650);
      return () => clearTimeout(timer);
    }
  }, [gameState, telemetry.harmony]);

  const activeBiomeCfg = BIOME_CONFIGS[telemetry.biome];
  const activeAtmosphereCfg = ATMOSPHERE_CONFIGS[atmosphere];
  const nearestSpeciesCfg = PLANT_SPECIES_CONFIGS[telemetry.nearestPlant.species];
  const outcomeProfile =
    SOUND_OUTCOME_PROFILES[telemetry.prismOutcome] ?? SOUND_OUTCOME_PROFILES['wind-whisper'];

  return (
    <main className="relative w-full h-full overflow-hidden select-none">
      {/* Isolated 3D WebGL Procedural Garden Viewport */}
      <GardenCanvas
        gameState={gameState}
        atmosphere={atmosphere}
        plants={plants}
        soundEngine={soundEngine}
        onTelemetryUpdate={setTelemetry}
        onPlantAttuned={handlePlantAttuned}
        handleRef={gardenHandleRef}
      />

      {/* =====================================================================
          TITLE SCREEN OVERLAY (`document.body.dataset.state = 'title'`)
          Stage 1: Live World Camera Tour with Asymmetric Left-Third Composition
         ===================================================================== */}
      {gameState === 'title' && (
        <div
          className="fixed inset-0 z-30 flex flex-col justify-between p-10 md:p-14 pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, rgba(6, 17, 13, 0.90) 0%, rgba(6, 17, 13, 0.62) 44%, rgba(6, 17, 13, 0.12) 100%)',
          }}
        >
          {/* Top Botanical Identity Line (Unboxed Typography) */}
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono text-emerald-300/90 tracking-wide hud-text-shadow">
              BOTANICAL SOUNDSCAPE SANCTUARY · JUST INTONATION & PENTATONIC FLORA
            </div>
          </div>

          {/* Left-Third Focal Lockup */}
          <div className="max-w-xl space-y-6 my-auto pointer-events-auto">
            <VerdantResonanceEmblem className="w-20 h-20" />

            <div className="space-y-2">
              <h1
                className="font-display text-5xl md:text-6xl font-semibold tracking-tight text-amber-50 hud-text-shadow"
                style={{ textWrap: 'balance' }}
              >
                Verdant Resonance
              </h1>
              <p className="text-lg md:text-xl text-emerald-100/90 font-normal max-w-lg hud-text-shadow">
                Explore a living, conflict-free botanical sanctuary where every footstep, breeze, and
                blossom awakens a movement-responsive harmonic soundscape.
              </p>
            </div>

            {/* Unboxed Metadata Line */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-emerald-300/85">
              <span>5 Acoustic Biomes</span>
              <span aria-hidden="true">·</span>
              <span>5 Interactive Flora Species</span>
              <span aria-hidden="true">·</span>
              <span>Diurnal Sky Cycle</span>
              <span aria-hidden="true">·</span>
              <span>Peaceful Exploration</span>
            </div>

            {/* Primary CTA + Secondary Herbarium Button (<= 3 menu actions) */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                data-start="true"
                onClick={startGame}
                className="px-7 py-3.5 rounded-lg bg-amber-300 hover:bg-amber-200 text-slate-950 font-semibold text-base shadow-lg transition-transform active:scale-95 whitespace-nowrap shrink-0 cursor-pointer"
              >
                Enter the Garden
              </button>

              <button
                type="button"
                onClick={() => setGameState('paused')}
                className="px-5 py-3.5 rounded-lg border border-emerald-300/35 bg-[#091913]/85 hover:bg-emerald-950 text-emerald-100 font-medium text-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Botanical Field Guide
              </button>
            </div>
          </div>

          {/* Single Flat Borderless Control Hint Line in Bottom Safe Margin */}
          <div className="text-xs font-mono text-emerald-200/80 hud-text-shadow">
            WASD / Arrows Move · Mouse Drag / Q-E Look · Space Attune Flora · T Touch · C Stillness · L Sky Light · 1-5 Biomes · P Field Guide
          </div>
        </div>
      )}

      {/* =====================================================================
          PLAYING HUD (`document.body.dataset.state = 'playing'`)
          World-Matched Botanical Framing, >= 85% Unobstructed Viewport
         ===================================================================== */}
      {gameState === 'playing' && (
        <div className="fixed inset-0 z-20 pointer-events-none">
          {/* Exact Center Botanical Reticle (0,0 Gaze Routing) */}
          <div
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center"
            aria-hidden="true"
          >
            <svg viewBox="0 0 28 28" className="w-6 h-6 opacity-75">
              <circle
                cx="14"
                cy="14"
                r="6"
                fill="none"
                stroke={telemetry.proximityDm <= 25 ? '#fde047' : '#a7f3d0'}
                strokeWidth="1.4"
              />
              <circle
                cx="14"
                cy="14"
                r="1.5"
                fill={telemetry.proximityDm <= 25 ? '#fde047' : '#a7f3d0'}
              />
            </svg>
            {recentBanner && (
              <div className="mt-3 px-3 py-1 rounded bg-[#071510]/90 border border-amber-300/35 text-xs font-mono text-amber-200 whitespace-nowrap shadow-md">
                {recentBanner}
              </div>
            )}
          </div>

          {/* Corner Cluster 1 (Top-Left): Harmony Resonance & Live Acoustic Soundscape Readout */}
          <div className="fixed top-4 left-4 max-w-md rounded-xl border border-emerald-400/25 bg-[#071510]/90 px-4 py-3 shadow-xl pointer-events-auto">
            <div className="flex items-baseline justify-between gap-6">
              <div>
                <div className="text-[10px] font-mono tracking-wider text-emerald-300/80 uppercase">
                  HARMONY RESONANCE
                </div>
                <div
                  className="text-3xl font-display font-bold text-amber-200 tabular-nums leading-none mt-0.5"
                  data-testid="hud-harmony-value"
                >
                  {Math.round(telemetry.harmony)}%
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] font-mono tracking-wider text-emerald-300/80 uppercase">
                  FLORA ATTUNED
                </div>
                <div
                  className="text-xl font-mono font-semibold text-emerald-100 tabular-nums leading-tight"
                  data-testid="hud-attuned-count"
                >
                  {telemetry.attunedCount} / {telemetry.totalPlants}
                </div>
              </div>
            </div>

            {/* Continuous Harmony Bar */}
            <div className="w-full h-2 rounded-full bg-emerald-950 overflow-hidden mt-2 border border-emerald-500/20">
              <div
                className="h-full bg-amber-300 transition-all duration-200"
                style={{ width: `${Math.min(100, Math.round(telemetry.harmony))}%` }}
              />
            </div>

            {/* Live Acoustic Timbre & 16-Band Spectrum Visualizer */}
            <div className="mt-2.5 pt-2 border-t border-emerald-400/15 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[11px] font-medium text-amber-200" data-testid="hud-prism-outcome">
                  {outcomeProfile.label} · {outcomeProfile.timbre}
                </div>
                <div className="text-[10px] font-mono text-emerald-300/75">
                  {activeBiomeCfg.tuningLabel} · {activeAtmosphereCfg.name}
                </div>
              </div>

              {/* 16-Band Zero-Allocation SVG Spectrum Visualizer */}
              <svg
                viewBox="0 0 64 24"
                className="w-16 h-6 shrink-0"
                aria-label="Live Soundscape Spectrum"
              >
                {Array.from({ length: 16 }).map((_, i) => (
                  <rect
                    key={i}
                    ref={(el) => {
                      spectrumBarsRef.current[i] = el;
                    }}
                    x={i * 4}
                    y={14}
                    width={2.6}
                    height={10}
                    rx={1}
                    fill={i % 2 === 0 ? '#fde047' : '#34d399'}
                  />
                ))}
              </svg>
            </div>
          </div>

          {/* Corner Cluster 2 (Top-Right): Active Biome, Nearest Flora & Utility Controls */}
          <div className="fixed top-4 right-4 flex items-start gap-2.5 pointer-events-auto">
            <div className="rounded-xl border border-emerald-400/25 bg-[#071510]/90 px-4 py-2.5 shadow-xl">
              <div className="flex items-center gap-2.5">
                <PlantSpeciesIcon
                  species={telemetry.nearestPlant.species}
                  attuned={telemetry.nearestPlant.attuned}
                  className="w-7 h-7 shrink-0"
                />
                <div>
                  <div className="text-[10px] font-mono tracking-wider text-emerald-300/80 uppercase">
                    {activeBiomeCfg.name} · BIOME {telemetry.exploredBiomes.length}/5
                  </div>
                  <div className="text-sm font-semibold text-emerald-50 flex items-center gap-2">
                    <span>{nearestSpeciesCfg.name}</span>
                    <span className="font-mono text-xs text-amber-200 tabular-nums">
                      {Math.round(telemetry.distanceMeters)}m
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Compact Square <svg> Utility Buttons (Mute [M], Field Guide / Pause [P], Reset [R]) */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                tabIndex={-1}
                aria-label={isMuted ? 'Unmute Audio [M]' : 'Mute Audio [M]'}
                onClick={handleToggleMute}
                className="w-10 h-10 rounded-lg border border-emerald-400/25 bg-[#071510]/90 hover:bg-emerald-900/70 text-emerald-100 flex items-center justify-center shadow-lg transition-colors cursor-pointer"
              >
                <SoundWaveIcon muted={isMuted} className="w-4 h-4" />
              </button>

              <button
                type="button"
                tabIndex={-1}
                aria-label="Open Botanical Field Guide [P]"
                onClick={(e) => {
                  e.currentTarget.blur();
                  setGameState('paused');
                }}
                className="w-10 h-10 rounded-lg border border-emerald-400/25 bg-[#071510]/90 hover:bg-emerald-900/70 text-emerald-100 flex items-center justify-center shadow-lg transition-colors cursor-pointer"
              >
                <PauseGlyphIcon className="w-4 h-4" />
              </button>

              <button
                type="button"
                tabIndex={-1}
                aria-label="Reset Garden [R]"
                onClick={(e) => {
                  e.currentTarget.blur();
                  handleRestart();
                }}
                className="w-10 h-10 rounded-lg border border-emerald-400/25 bg-[#071510]/90 hover:bg-emerald-900/70 text-emerald-100 flex items-center justify-center shadow-lg transition-colors cursor-pointer"
              >
                <ResetGlyphIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Unified Collapsible Bottom Control Dock (Zero Side-Panel Clutter) */}
          <div
            className="fixed left-1/2 -translate-x-1/2 bottom-4 z-20 flex flex-col items-center pointer-events-auto transition-transform duration-200"
            style={{ maxWidth: 'min(940px, 95vw)' }}
          >
            {/* Collapse / Expand Zen Mode Toggle */}
            <button
              type="button"
              tabIndex={-1}
              onClick={(e) => {
                e.currentTarget.blur();
                setDockCollapsed((prev) => !prev);
              }}
              className="px-3 py-1 rounded-t-lg border border-b-0 border-emerald-400/25 bg-[#071510]/90 text-[11px] font-mono text-emerald-200 hover:text-amber-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {dockCollapsed ? '▴ Show Sanctuary Controls [H]' : '▾ Hide Sanctuary Controls [H]'}
            </button>

            {!dockCollapsed && (
              <div className="rounded-xl border border-emerald-400/25 bg-[#071510]/92 px-4 py-2.5 shadow-2xl flex flex-wrap items-center justify-center gap-2.5">
                {/* Botanical Resonance Actions */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={(e) => {
                      e.currentTarget.blur();
                      gardenHandleRef.current?.triggerAction('attune');
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-amber-300 hover:bg-amber-200 text-slate-950 font-semibold text-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Attune Flora [Space]
                  </button>

                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={(e) => {
                      e.currentTarget.blur();
                      gardenHandleRef.current?.triggerAction('touch');
                    }}
                    className="px-3 py-1.5 rounded-lg border border-emerald-400/30 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-100 font-medium text-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Touch Petal [T]
                  </button>

                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={(e) => {
                      e.currentTarget.blur();
                      gardenHandleRef.current?.triggerAction('stillness');
                    }}
                    className="px-3 py-1.5 rounded-lg border border-emerald-400/30 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-100 font-medium text-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Stillness [C]
                  </button>

                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={cycleAtmosphere}
                    className="px-3 py-1.5 rounded-lg border border-teal-400/30 bg-teal-950/70 hover:bg-teal-900/80 text-teal-100 font-mono text-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Sky: {activeAtmosphereCfg.name} [L]
                  </button>

                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={(e) => {
                      e.currentTarget.blur();
                      gardenHandleRef.current?.toggleGuidedStroll();
                    }}
                    className={`px-3 py-1.5 rounded-lg border font-mono text-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      telemetry.guidedStroll
                        ? 'border-amber-300/60 bg-amber-400/25 text-amber-200'
                        : 'border-emerald-400/30 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-100'
                    }`}
                  >
                    {telemetry.guidedStroll ? 'Guided Stroll: On [G]' : 'Guided Stroll [G]'}
                  </button>
                </div>

                <div className="h-5 w-px bg-emerald-400/20 hidden sm:block" />

                {/* 5 Biome Sanctuary Waypoints */}
                <div className="flex items-center gap-1" role="group" aria-label="Biome Sanctuary Waypoints">
                  {(
                    [
                      ['meadow', '1 Meadow'],
                      ['grove', '2 Grove'],
                      ['crystal', '3 Crystal'],
                      ['wetland', '4 Wetland'],
                      ['sanctuary', '5 Sanctuary'],
                    ] as [BiomeId, string][]
                  ).map(([biomeId, label]) => {
                    const isActive = telemetry.biome === biomeId;
                    return (
                      <button
                        key={biomeId}
                        type="button"
                        tabIndex={-1}
                        onClick={(e) => {
                          e.currentTarget.blur();
                          gardenHandleRef.current?.teleportToBiome(biomeId);
                        }}
                        className={`px-2.5 py-1.5 rounded-md text-xs font-mono transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          isActive
                            ? 'bg-emerald-500/30 text-amber-200 border border-emerald-400/40'
                            : 'text-emerald-200/75 hover:text-emerald-100 hover:bg-emerald-900/40'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          BOTANICAL FIELD GUIDE / SANCTUARY HARMONY COMPLETE MODAL
          (`document.body.dataset.state = 'paused' | 'gameover'`)
         ===================================================================== */}
      {(gameState === 'paused' || gameState === 'gameover') && (
        <PrismInspectorModal
          mode={gameState}
          atmosphere={atmosphere}
          telemetry={telemetry}
          plants={plants}
          soundEngine={soundEngine}
          onResume={() => setGameState('playing')}
          onRestart={handleRestart}
          onReturnTitle={() => setGameState('title')}
          onTeleportBiome={(biomeId) => gardenHandleRef.current?.teleportToBiome(biomeId)}
          onSelectAtmosphere={setAtmosphere}
        />
      )}
    </main>
  );
}
