/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ATMOSPHERE_CONFIGS,
  AtmosphereId,
  BIOME_CONFIGS,
  BiomeId,
  BOTANICAL_LIFECYCLE_STAGES,
  GardenPlantInstance,
  PLANT_SPECIES_CONFIGS,
  SOUND_OUTCOME_PROFILES,
  SoundscapeOutcome,
  VERDANT_BRAND_STANDARD,
  VERDANT_HUMANE_STANDARD,
  clearAnamnesisStorage,
  composeLiveSoundtrackScore,
  computeCardinalWayfinder,
  computeGardenHarmonyPct,
  createInitialGestureHoldState,
  createInitialLandmarkResonanceState,
  createInitialLiveCoEvolutionState,
  createInitialNeuromorphicState,
  decodeShareableUorcGardenHash,
  encodeShareableUorcGardenHash,
  evaluateBiomeMasteryAndGuilds,
  evaluateEnvironmentalLifecycle,
  evaluateNearestSynthesizedLandmark,
  evaluateWitnessCommunionTarget,
  generateGardenPlants,
  getPlantLifecycleStage,
  hydratePlantsFromAnamnesis,
  loadAnamnesisEnvelopeFromStorage,
  persistAnamnesisEnvelopeToStorage,
  restoreLiveCoEvolutionStateFromAnamnesis,
  restoreNeuromorphicStateFromAnamnesis,
  serializeAnamnesisSnapshot,
  serializeLiveCoEvolutionStateForAnamnesis,
  synthesizeParametricAtmosphereConfigs,
  synthesizeParametricBiomeConfigs,
  synthesizeParametricBotanicalLifecycleStages,
  synthesizeParametricPlantSpeciesConfigs,
  synthesizeParametricSoundOutcomeProfiles,
  synthesizeVerdantW3CDesignTokens,
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
const LazyPrismInspectorModal = React.lazy(() =>
  import('./components/PrismInspectorModal').then((m) => ({
    default: m.PrismInspectorModal,
  })),
);

const ATMOSPHERE_ORDER: AtmosphereId[] = ['dawn', 'golden', 'twilight', 'starlight'];

export default function App() {
  const initialAutostart = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return params.get('autostart') === '1';
  }, []);

  // Hydrate Shareable `#uorc=...` URL Garden Archive first, falling back to local Merkle Anamnesis (`Foundation.Anamnesis.V1.Model`, Prime `157`)
  const initialAnamnesis = useMemo(() => {
    if (typeof window !== 'undefined' && window.location.hash.startsWith('#uorc=')) {
      const shared = decodeShareableUorcGardenHash(window.location.hash);
      if (shared.verified && shared.envelope) {
        persistAnamnesisEnvelopeToStorage(shared.envelope);
        return shared;
      }
    }
    return loadAnamnesisEnvelopeFromStorage();
  }, []);
  const initialAnamnesisPayload = initialAnamnesis.verified
    ? (initialAnamnesis.envelope?.payload ?? null)
    : null;

  const [gameState, setGameState] = useState<GameState>(initialAutostart ? 'playing' : 'title');
  const [atmosphere, setAtmosphere] = useState<AtmosphereId>(
    initialAnamnesisPayload?.atmosphere ?? 'dawn',
  );
  const [isMuted, setIsMuted] = useState<boolean>(initialAnamnesisPayload?.isMuted ?? false);
  const [dockCollapsed, setDockCollapsed] = useState<boolean>(false);
  const [recentBanner, setRecentBanner] = useState<string | null>(null);
  const [tunedWaystoneDegrees, setTunedWaystoneDegrees] = useState<readonly number[] | undefined>(
    () => initialAnamnesisPayload?.tunedWaystoneDegrees,
  );

  const alphaSeed = initialAnamnesisPayload?.alphaSeed ?? 1;
  const [plants, setPlants] = useState(() => {
    const basePlants = generateGardenPlants({
      alphaSeed: initialAnamnesisPayload?.alphaSeed ?? 1,
    });
    return initialAnamnesisPayload
      ? hydratePlantsFromAnamnesis(basePlants, initialAnamnesisPayload)
      : basePlants;
  });
  const soundEngine = useMemo(() => new BotanicalSoundscapeEngine(), []);
  const gardenHandleRef = useRef<GardenImperativeHandle | null>(null);
  const spectrumBarsRef = useRef<(SVGRectElement | null)[]>([]);

  const [telemetry, setTelemetry] = useState<LiveTelemetryState>(() => {
    const initAtm = initialAnamnesisPayload?.atmosphere ?? 'dawn';
    const initExplored: BiomeId[] = initialAnamnesisPayload?.exploredBiomes?.length
      ? [...initialAnamnesisPayload.exploredBiomes]
      : ['meadow'];
    const initHarmony = computeGardenHarmonyPct({
      plants,
      exploredBiomesCount: initExplored.length,
    });
    const initAttuned = plants.filter((p) => p.attuned).length;
    const initialNeuro = initialAnamnesisPayload
      ? restoreNeuromorphicStateFromAnamnesis(initialAnamnesisPayload)
      : createInitialNeuromorphicState();
    const initialEnvLifecycle = evaluateEnvironmentalLifecycle({
      harmonyPct: initHarmony,
      plants,
      atmosphere: initAtm,
    });
    const initialScore = composeLiveSoundtrackScore({
      biome: 'meadow',
      atmosphere: initAtm,
      harmonyPct: initHarmony,
      plants,
      neuromorphic: initialNeuro,
    });
    const initialTopo = initialNeuro.observer.cosmogenesis.worldTopology;
    const initialNearestLandmark = evaluateNearestSynthesizedLandmark({
      playerX: 0,
      playerZ: 0,
      playerYaw: 0,
      landmarkCentersXZ: {
        meadow: initialTopo.meadowSundialCenterXZ,
        grove: initialTopo.biomeCenters.grove,
        crystal: initialTopo.biomeCenters.crystal,
        wetland: initialTopo.lagoonCenterXZ,
        sanctuary: initialTopo.biomeCenters.sanctuary,
      },
      resonanceState: createInitialLandmarkResonanceState(),
      busWeight: initialNeuro.lastActiveSynapticWeight,
    });
    const initialWitnessCommunion = evaluateWitnessCommunionTarget({
      playerX: 0,
      playerZ: 0,
      playerYaw: 0,
      witnessX: initialNeuro.observer.immanentPresence.x,
      witnessZ: initialNeuro.observer.immanentPresence.z,
      busWeight: initialNeuro.lastActiveSynapticWeight,
    });
    return {
      playerX: 0,
      playerZ: 0,
      playerYaw: 0,
      biome: 'meadow',
      atmosphere: initAtm,
      chorus: initAttuned > 0 ? 'awakened' : 'dormant',
      affinityTier: 'sanctuary-peak',
      nearestPlant: plants[0],
      distanceMeters: 5.9,
      proximityDm: 20,
      velocityDm: 0,
      action: 'observe',
      prismRequest: `meadow chime-lily observe ${initAtm} dormant 20 0`,
      prismOutcome: 'dawn-arpeggio',
      prismRule: 'REQ-010',
      prismRuleDesc:
        'Morning mist around a Chime Lily at Dawn awakens sparkling dewdrop glass-marimba arpeggios.',
      harmony: initHarmony,
      attunedCount: initAttuned,
      sympatheticCount: 0,
      totalPlants: plants.length,
      exploredBiomes: initExplored,
      guidedStroll: false,
      surfaceMaterial: 'travertine-stone',
      inWater: false,
      waterDepthMeters: 0,
      slopeGradePct: 0,
      obstructedBy: null,
      acousticOcclusion: 0,
      neuromorphic: initialNeuro,
      environmentalLifecycle: initialEnvLifecycle,
      soundtrackScore: initialScore,
      currentSoundtrackStep: 0,
      gestureHold: createInitialGestureHoldState(),
      nearestLandmark: initialNearestLandmark,
      witnessCommunion: initialWitnessCommunion,
      liveCoEvolution: initialAnamnesisPayload?.coEvolutionState
        ? restoreLiveCoEvolutionStateFromAnamnesis(
            initialAnamnesisPayload.coEvolutionState,
            initialNeuro.lastActiveSynapticWeight,
          )
        : createInitialLiveCoEvolutionState(initialNeuro.lastActiveSynapticWeight),
    };
  });

  useEffect(() => {
    soundEngine.setMuted(isMuted);
  }, [isMuted, soundEngine]);

  // Debounced Content-Addressed Merkle Anamnesis Persistence (`verdant-resonance.anamnesis.v1`)
  useEffect(() => {
      const isDefaultGenesis =
      alphaSeed === 1 &&
      atmosphere === 'dawn' &&
      !isMuted &&
      !tunedWaystoneDegrees &&
      telemetry.attunedCount === 0 &&
      telemetry.neuromorphic.tickCount === 0 &&
      telemetry.liveCoEvolution.admittedMutationCount === 0 &&
      telemetry.neuromorphic.universalManifold.globalFidelityIndex <= 1.001 &&
      telemetry.exploredBiomes.length <= 1;
    if (isDefaultGenesis) return;

    const saveTimer = window.setTimeout(() => {
      const liveCoEvo =
        gardenHandleRef.current?.getLiveCoEvolutionState() ?? telemetry.liveCoEvolution;
      const envelope = serializeAnamnesisSnapshot({
        alphaSeed,
        atmosphere,
        isMuted,
        exploredBiomes: telemetry.exploredBiomes,
        manifold: telemetry.neuromorphic.universalManifold,
        plants,
        consolidatedMemories:
          telemetry.neuromorphic.observer.conservatoryCuration.consolidatedMemories,
        tunedWaystoneDegrees:
          gardenHandleRef.current?.getTunedWaystoneDegrees() ?? tunedWaystoneDegrees,
        coEvolutionState: serializeLiveCoEvolutionStateForAnamnesis(liveCoEvo),
      });
      persistAnamnesisEnvelopeToStorage(envelope);
    }, 420);
    return () => clearTimeout(saveTimer);
  }, [
    alphaSeed,
    atmosphere,
    isMuted,
    plants,
    tunedWaystoneDegrees,
    telemetry.attunedCount,
    telemetry.exploredBiomes,
    telemetry.liveCoEvolution,
    telemetry.neuromorphic.tickCount,
    telemetry.neuromorphic.universalManifold,
    telemetry.neuromorphic.observer.conservatoryCuration.consolidatedMemories,
  ]);

  useEffect(() => {
    document.body.dataset.state = gameState;
    if (gameState !== 'playing') {
      document.exitPointerLock?.();
    }
    soundEngine.setPaused(gameState !== 'playing');
  }, [gameState, soundEngine]);

  // Synchronize live Prism Parametric Display, W3C OKLCH Design Tokens & Mathematical Affect CSS custom properties onto `:root`
  const parametricDisplay = telemetry.neuromorphic.observer.parametricDisplayDesign;
  const liveMultiModalFidelity =
    telemetry.neuromorphic.observer.canonicalStandardModelsContext.multiModalFidelity;
  const w3cDesignTokens = useMemo(
    () =>
      synthesizeVerdantW3CDesignTokens(
        atmosphere,
        liveMultiModalFidelity.normalizedFidelity01,
      ),
    [atmosphere, liveMultiModalFidelity.normalizedFidelity01],
  );
  const liveAffectAuraHex =
    telemetry.neuromorphic.observer.affectAndPreferences.affect.coreAuraHex;
  useEffect(() => {
    const rootStyle = document.documentElement.style;
    for (const [varName, varVal] of Object.entries(parametricDisplay.cssVariables)) {
      rootStyle.setProperty(varName, varVal);
    }
    for (const [varName, varVal] of Object.entries(w3cDesignTokens.cssVariables)) {
      rootStyle.setProperty(varName, varVal);
    }
    // Bridge W3C OKLCH perceptual tokens & Just-Intonation modular typography directly into live HUD surfaces
    const surfAbyss = w3cDesignTokens.cssVariables['--vr-surface-abyss'] ?? '#08120e';
    const surfElev = w3cDesignTokens.cssVariables['--vr-surface-elevated'] ?? '#0f1e18';
    const accVerdant = w3cDesignTokens.cssVariables['--vr-accent-verdant'] ?? '#47df9c';
    const accSolar = w3cDesignTokens.cssVariables['--vr-accent-solar'] ?? '#f5ca5c';
    const accCrystal = w3cDesignTokens.cssVariables['--vr-accent-crystal'] ?? '#5cc8f2';
    rootStyle.setProperty('--prism-bg-canvas', surfAbyss);
    rootStyle.setProperty(
      '--prism-surface-bg',
      `color-mix(in oklch, ${surfAbyss} 86%, transparent)`,
    );
    rootStyle.setProperty(
      '--prism-surface-elevated',
      `color-mix(in oklch, ${surfElev} 91%, transparent)`,
    );
    rootStyle.setProperty(
      '--prism-border-hairline',
      `color-mix(in oklch, ${accVerdant} 30%, transparent)`,
    );
    rootStyle.setProperty('--prism-accent-primary', accSolar);
    rootStyle.setProperty('--prism-accent-secondary', accVerdant);
    rootStyle.setProperty('--prism-accent-tertiary', accCrystal);
    rootStyle.setProperty(
      '--prism-text-primary',
      w3cDesignTokens.cssVariables['--vr-ink-primary'] ?? '#eff7f1',
    );
    rootStyle.setProperty(
      '--prism-text-muted',
      w3cDesignTokens.cssVariables['--vr-ink-secondary'] ?? '#bfd8c9',
    );
    const scaleRatio = parametricDisplay.typographyAndSpatial.typeScaleRatio || 1.25;
    rootStyle.setProperty('--vr-type-lg', `${scaleRatio.toFixed(4)}rem`);
    rootStyle.setProperty('--vr-type-xl', `${(scaleRatio * scaleRatio).toFixed(4)}rem`);
    rootStyle.setProperty('--vr-type-2xl', `${Math.pow(scaleRatio, 3).toFixed(4)}rem`);
    rootStyle.setProperty('--prism-affect-aura', liveAffectAuraHex);
  }, [
    parametricDisplay.cssVariables,
    parametricDisplay.typographyAndSpatial.typeScaleRatio,
    w3cDesignTokens.cssVariables,
    liveAffectAuraHex,
  ]);

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
    clearAnamnesisStorage();
    if (typeof window !== 'undefined' && window.location.hash.startsWith('#uorc=')) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    setTunedWaystoneDegrees(undefined);
    const resetPlants = generateGardenPlants({ alphaSeed });
    setPlants(resetPlants);
    gardenHandleRef.current?.setAlphaSeed(alphaSeed, resetPlants);
    gardenHandleRef.current?.resetExploration();
    document.body.dataset.state = 'playing';
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    soundEngine.init();
    soundEngine.setPaused(false);
    setGameState('playing');
  }, [alphaSeed, soundEngine]);

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

  const liveCosmoParams = useMemo(
    () => ({
      alphaSeed: telemetry.neuromorphic.observer.cosmogenesis.alphaSeed,
      manifold: telemetry.neuromorphic.universalManifold,
      harmonyPct: telemetry.harmony,
    }),
    [
      telemetry.neuromorphic.observer.cosmogenesis.alphaSeed,
      telemetry.neuromorphic.universalManifold,
      telemetry.harmony,
    ],
  );

  const liveBiomeConfigs = useMemo(
    () => synthesizeParametricBiomeConfigs(liveCosmoParams),
    [liveCosmoParams],
  );
  const liveAtmosphereConfigs = useMemo(
    () => synthesizeParametricAtmosphereConfigs(liveCosmoParams),
    [liveCosmoParams],
  );
  const liveSpeciesConfigs = useMemo(
    () => synthesizeParametricPlantSpeciesConfigs(liveCosmoParams),
    [liveCosmoParams],
  );
  const liveOutcomeProfiles = useMemo(
    () => synthesizeParametricSoundOutcomeProfiles(liveCosmoParams),
    [liveCosmoParams],
  );
  const liveLifecycleStages = useMemo(
    () => synthesizeParametricBotanicalLifecycleStages(liveCosmoParams),
    [liveCosmoParams],
  );

  const handlePlantAttuned = useCallback(
    (_plantId: string, biome: BiomeId, outcome: SoundscapeOutcome) => {
      const profile = liveOutcomeProfiles[outcome] ?? SOUND_OUTCOME_PROFILES[outcome];
      const biomeCfg = liveBiomeConfigs[biome] ?? BIOME_CONFIGS[biome];
      setRecentBanner(`${profile.label} · ${biomeCfg.name}`);
    },
    [liveBiomeConfigs, liveOutcomeProfiles],
  );

  const handleWaystoneTuned = useCallback((degrees: readonly number[], label: string) => {
    setTunedWaystoneDegrees(degrees);
    setRecentBanner(`✦ Lithophone Tuned · ${label}`);
  }, []);

  const handleOffshootColonized = useCallback(
    (offshoot: GardenPlantInstance, guildName: string) => {
      setPlants((prev) => (prev.some((p) => p.id === offshoot.id) ? prev : [...prev, offshoot]));
      setRecentBanner(`✦ ${guildName} Offshoot Germinated`);
    },
    [],
  );

  const handleShareUorcGarden = useCallback(
    (e?: React.MouseEvent<HTMLButtonElement>) => {
      e?.currentTarget.blur();
      const liveWaystoneDegrees =
        gardenHandleRef.current?.getTunedWaystoneDegrees() ?? tunedWaystoneDegrees;
      const liveCoEvo =
        gardenHandleRef.current?.getLiveCoEvolutionState() ?? telemetry.liveCoEvolution;
      const envelope = serializeAnamnesisSnapshot({
        alphaSeed,
        atmosphere,
        isMuted,
        exploredBiomes: telemetry.exploredBiomes,
        manifold: telemetry.neuromorphic.universalManifold,
        plants,
        consolidatedMemories:
          telemetry.neuromorphic.observer.conservatoryCuration.consolidatedMemories,
        tunedWaystoneDegrees: liveWaystoneDegrees,
        coEvolutionState: serializeLiveCoEvolutionStateForAnamnesis(liveCoEvo),
      });
      persistAnamnesisEnvelopeToStorage(envelope);
      const link = encodeShareableUorcGardenHash(envelope);
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', link.hashFragment);
        const fullUrl = window.location.href;
        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
          navigator.clipboard.writeText(fullUrl).catch(() => {});
        }
      }
      setRecentBanner(`✦ UORC Garden Link Copied · ${link.archiveByteLength} B κ-Archive`);
    },
    [
      alphaSeed,
      atmosphere,
      isMuted,
      plants,
      tunedWaystoneDegrees,
      telemetry.exploredBiomes,
      telemetry.liveCoEvolution,
      telemetry.neuromorphic.universalManifold,
      telemetry.neuromorphic.observer.conservatoryCuration.consolidatedMemories,
    ],
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

      // Suppress OS key-repeat events (`e.repeat`) across all global shortcuts
      if (e.repeat) return;

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
      } else if (e.code === 'KeyU' && gameState === 'playing') {
        e.preventDefault();
        handleShareUorcGarden();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [gameState, startGame, handleToggleMute, handleRestart, cycleAtmosphere, handleShareUorcGarden]);

  // Mindful exploration never force-terminates gameplay at 100% Harmony.
  // Only extreme unmindful agitation (sustained rapid key mashing during refractory cooldowns >= 100%)
  // triggers a gentle Restorative Interlude (`gameover` overlay).
  useEffect(() => {
    if (gameState === 'playing' && telemetry.gestureHold.agitationPct >= 100) {
      setGameState('gameover');
    }
  }, [gameState, telemetry.gestureHold.agitationPct]);

  const activeBiomeCfg = liveBiomeConfigs[telemetry.biome] ?? BIOME_CONFIGS[telemetry.biome];
  const activeAtmosphereCfg = liveAtmosphereConfigs[atmosphere] ?? ATMOSPHERE_CONFIGS[atmosphere];
  const nearestSpeciesCfg =
    liveSpeciesConfigs[telemetry.nearestPlant.species] ??
    PLANT_SPECIES_CONFIGS[telemetry.nearestPlant.species];
  const outcomeProfile =
    liveOutcomeProfiles[telemetry.prismOutcome] ?? SOUND_OUTCOME_PROFILES['wind-whisper'];

  const wayfinder = computeCardinalWayfinder(
    telemetry.playerX,
    telemetry.playerZ,
    telemetry.playerYaw,
    telemetry.neuromorphic.observer.cosmogenesis.worldTopology,
  );
  const biomeMastery = evaluateBiomeMasteryAndGuilds(telemetry.biome, plants);

  return (
    <main className="relative w-full h-full overflow-hidden select-none">
      {/* Isolated 3D WebGL Procedural Garden Viewport */}
      <GardenCanvas
        gameState={gameState}
        atmosphere={atmosphere}
        plants={plants}
        initialAnamnesisPayload={initialAnamnesisPayload}
        soundEngine={soundEngine}
        onTelemetryUpdate={setTelemetry}
        onPlantAttuned={handlePlantAttuned}
        onWaystoneTuned={handleWaystoneTuned}
        onOffshootColonized={handleOffshootColonized}
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
            background: parametricDisplay.palette.titleScrimGradientCss,
          }}
        >
          {/* Top Botanical Conservatory Identity Line (Unboxed Typography) */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="text-xs font-mono text-amber-200/90 tracking-wider uppercase hud-text-shadow">
              {VERDANT_BRAND_STANDARD.editionTitle}
            </div>
            <div className="text-xs font-mono text-emerald-300/85 tracking-wide hud-text-shadow hidden sm:block">
              FIVE LIVING BIOMES · DIURNAL SKY · PURE BOTANICAL HARMONY
            </div>
          </div>

          {/* Left-Third Focal Brand Lockup */}
          <div className="max-w-xl space-y-5 my-auto pointer-events-auto">
            <div className="flex items-center gap-4">
              <VerdantResonanceEmblem
                className="w-20 h-20 shrink-0"
                supraTier={telemetry.neuromorphic.observer.supraDirective.tier}
                primaryAccentHex={parametricDisplay.palette.primaryAccentHex}
                secondaryAccentHex={parametricDisplay.palette.secondaryAccentHex}
                surfaceHex={parametricDisplay.palette.canvasBgHex}
              />
              <div className="space-y-0.5">
                <div className="text-[11px] font-mono tracking-widest text-emerald-300/90 uppercase">
                  {VERDANT_BRAND_STANDARD.genreClassification}
                </div>
                <div className="font-display italic text-lg text-amber-200/95">
                  {VERDANT_BRAND_STANDARD.conservatorySubtitle}
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              <h1
                className="font-display text-5xl md:text-6xl font-semibold tracking-tight text-amber-50 hud-text-shadow"
                style={{ textWrap: 'balance' }}
              >
                {VERDANT_BRAND_STANDARD.brandName}
              </h1>
              <p className="text-lg md:text-xl text-emerald-50/95 font-normal max-w-lg hud-text-shadow leading-relaxed">
                {VERDANT_BRAND_STANDARD.tagline}
              </p>
              <p className="text-sm text-emerald-200/80 max-w-lg hud-text-shadow leading-relaxed">
                {VERDANT_BRAND_STANDARD.manifesto}
              </p>
            </div>

            {/* Unboxed Sensory & Humane Design Pillars */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-emerald-300/90">
              <span>Living Flora &amp; Landmarks</span>
              <span aria-hidden="true">·</span>
              <span>Sympathetic Pollination</span>
              <span aria-hidden="true">·</span>
              <span>Restorative Soundscape</span>
            </div>

            {/* Primary CTA + Secondary Herbarium Button (<= 2 focal actions) */}
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
                className="px-5 py-3.5 rounded-lg border text-emerald-100 font-medium text-sm hover:bg-emerald-950/90 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                style={{
                  backgroundColor: 'var(--prism-surface-bg)',
                  borderColor: 'var(--prism-border-hairline)',
                }}
              >
                Botanical Field Guide & Atlas
              </button>
            </div>
          </div>

          {/* Single Flat Borderless Control Hint Line in Bottom Safe Margin */}
          <div className="text-xs font-mono text-emerald-200/80 hud-text-shadow">
            WASD / Arrows Move · Mouse Drag / Q-E Look · Space Attune · T Touch · C Stillness · G Stroll · L Sky · 1-5 Biomes · P Guide
          </div>
        </div>
      )}

      {/* =====================================================================
          PLAYING HUD (`document.body.dataset.state = 'playing'`)
          World-Matched Botanical Framing, >= 88% Unobstructed Viewport
         ===================================================================== */}
      {gameState === 'playing' && (
        <div className="fixed inset-0 z-20 pointer-events-none">
          {/* Exact Center Parametric Botanical Reticle (0,0 Gaze Routing) */}
          <div
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center"
            aria-hidden="true"
          >
            <svg viewBox="0 0 32 32" className="w-7 h-7 opacity-80">
              <circle
                cx="16"
                cy="16"
                r={parametricDisplay.hudAndWebglDisplay.reticleOuterRadiusPx}
                fill="none"
                stroke={
                  telemetry.proximityDm <= 25
                    ? parametricDisplay.palette.primaryAccentHex
                    : parametricDisplay.hudAndWebglDisplay.reticleStrokeHex
                }
                strokeWidth="1.35"
              />
              {Array.from({
                length: parametricDisplay.hudAndWebglDisplay.reticleHarmonicTickCount,
              }).map((_, tickIdx) => {
                const count = Math.max(
                  4,
                  parametricDisplay.hudAndWebglDisplay.reticleHarmonicTickCount,
                );
                const ang = (tickIdx * Math.PI * 2) / count;
                const rIn = parametricDisplay.hudAndWebglDisplay.reticleOuterRadiusPx + 1.2;
                const rOut = rIn + 2.1;
                return (
                  <line
                    key={tickIdx}
                    x1={16 + Math.cos(ang) * rIn}
                    y1={16 + Math.sin(ang) * rIn}
                    x2={16 + Math.cos(ang) * rOut}
                    y2={16 + Math.sin(ang) * rOut}
                    stroke={parametricDisplay.palette.secondaryAccentHex}
                    strokeWidth="1.1"
                    strokeOpacity="0.7"
                  />
                );
              })}
              <circle
                cx="16"
                cy="16"
                r={parametricDisplay.hudAndWebglDisplay.reticleInnerRadiusPx}
                fill={
                  telemetry.proximityDm <= 25
                    ? parametricDisplay.palette.primaryAccentHex
                    : parametricDisplay.hudAndWebglDisplay.reticleStrokeHex
                }
              />
            </svg>
            {recentBanner && (
              <div
                className="mt-3 px-3 py-1 border text-xs font-mono text-amber-200 whitespace-nowrap shadow-md"
                style={{
                  backgroundColor: 'var(--prism-surface-bg)',
                  borderColor: 'var(--prism-border-hairline)',
                  borderRadius: 'var(--prism-radius-inner)',
                }}
              >
                {recentBanner}
              </div>
            )}
          </div>

          {/* Corner Cluster 1 (Top-Left): Harmony Resonance & High-Precision Acoustic Readout */}
          <div
            className="fixed top-4 left-4 max-w-[500px] border px-4 py-3 shadow-xl pointer-events-auto"
            style={{
              backgroundColor: 'var(--prism-surface-bg)',
              borderColor: 'var(--prism-border-hairline)',
              borderRadius: 'var(--prism-radius-outer)',
            }}
          >
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

            {telemetry.harmony >= 100 && (
              <div className="mt-1.5 flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono text-amber-200">
                  ✦ Full Conservatory Equilibrium Flourishing
                </span>
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={(e) => {
                    e.currentTarget.blur();
                    setGameState('gameover');
                  }}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-300/20 border border-amber-300/40 text-amber-100 hover:bg-amber-300/30 cursor-pointer"
                >
                  View Certificate
                </button>
              </div>
            )}

            {/* Live Acoustic Timbre & 16-Band Spectrum Visualizer */}
            <div className="mt-2.5 pt-2 border-t border-emerald-400/15 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[11px] font-medium text-amber-200" data-testid="hud-prism-outcome">
                  {outcomeProfile.label} · {outcomeProfile.timbre}
                </div>
                <div className="text-[10px] font-mono text-emerald-300/80" data-testid="hud-soundtrack-status">
                  {activeBiomeCfg.tuningLabel} · {telemetry.environmentalLifecycle.label}
                </div>
              </div>

              {/* 16-Band Zero-Allocation Parametric SVG Spectrum Visualizer */}
              <svg
                viewBox="0 0 64 24"
                className="w-16 h-6 shrink-0"
                aria-label="Live Soundscape Spectrum"
              >
                {Array.from({
                  length: parametricDisplay.hudAndWebglDisplay.spectrumBandCount,
                }).map((_, i) => (
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
                    fill={
                      i % 2 === 0
                        ? parametricDisplay.palette.primaryAccentHex
                        : parametricDisplay.palette.secondaryAccentHex
                    }
                  />
                ))}
              </svg>
            </div>
          </div>

          {/* Corner Cluster 2 (Top-Right): Active Biome, Monument Compass, Nearest Flora & Utility Controls */}
          <div className="fixed top-4 right-4 flex items-start gap-2.5 pointer-events-auto">
            <div
              className="border px-4 py-2.5 shadow-xl"
              style={{
                backgroundColor: 'var(--prism-surface-bg)',
                borderColor: 'var(--prism-border-hairline)',
                borderRadius: 'var(--prism-radius-outer)',
              }}
            >
              <div className="flex items-center gap-2.5">
                <PlantSpeciesIcon
                  species={telemetry.nearestPlant.species}
                  attuned={telemetry.nearestPlant.attuned}
                  supraTier={telemetry.neuromorphic.observer.supraDirective.tier}
                  className="w-7 h-7 shrink-0"
                />
                <div>
                  <div className="text-[10px] font-mono tracking-wider text-emerald-300/80 uppercase flex items-center gap-1.5">
                    <span>{activeBiomeCfg.name}</span>
                    <span>·</span>
                    <span className="text-amber-200">{wayfinder.compassCardinal}</span>
                    <span>·</span>
                    <span>Biomes {telemetry.exploredBiomes.length}/5</span>
                  </div>
                  <div className="text-sm font-semibold text-emerald-50 flex items-center gap-2">
                    <span>{nearestSpeciesCfg.name}</span>
                    <span className="font-mono text-xs text-amber-200 tabular-nums">
                      {Math.round(telemetry.distanceMeters)}m
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-emerald-300/75 whitespace-nowrap">
                    {(liveLifecycleStages[getPlantLifecycleStage(telemetry.nearestPlant)] ??
                      BOTANICAL_LIFECYCLE_STAGES[getPlantLifecycleStage(telemetry.nearestPlant)]).label}{' '}
                    · {biomeMastery.attunedInBiome}/{biomeMastery.totalInBiome} Flora
                    {telemetry.inWater ? ' · Wading Lagoon' : ''}
                  </div>
                  {telemetry.nearestLandmark.inResonanceRange && (
                    <div
                      className="text-[10px] font-mono text-amber-200/90 mt-0.5 truncate max-w-[280px]"
                      data-testid="hud-landmark-cue"
                    >
                      ✦ {telemetry.nearestLandmark.phenomenon.displayName}
                    </div>
                  )}
                  {!telemetry.nearestLandmark.inResonanceRange &&
                    telemetry.witnessCommunion.inCommunionRange && (
                      <div
                        className="text-[10px] font-mono text-teal-200/90 mt-0.5 truncate max-w-[280px]"
                        data-testid="hud-witness-cue"
                      >
                        ✦ Co-Observer Witness Nearby
                      </div>
                    )}
                </div>
              </div>
            </div>

            {/* Compact Square <svg> Utility Buttons (Share UORC [U], Mute [M], Field Guide / Pause [P], Reset [R]) */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                tabIndex={-1}
                aria-label="Share UORC Garden Link [U]"
                title="Copy Shareable UORC Garden Link [U]"
                onClick={handleShareUorcGarden}
                className="w-10 h-10 rounded-lg border hover:bg-emerald-900/70 text-emerald-100 flex items-center justify-center shadow-lg transition-colors cursor-pointer"
                style={{
                  backgroundColor: 'var(--prism-surface-bg)',
                  borderColor: 'var(--prism-border-hairline)',
                }}
              >
                <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" aria-hidden="true">
                  <path
                    d="M8.5 11.5L11.5 8.5M7 13L5.6 14.4a2.83 2.83 0 01-4-4L3 9m10-2l1.4-1.4a2.83 2.83 0 014 4L17 11"
                    stroke="currentColor"
                    strokeWidth="1.65"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <button
                type="button"
                tabIndex={-1}
                aria-label={isMuted ? 'Unmute Audio [M]' : 'Mute Audio [M]'}
                onClick={handleToggleMute}
                className="w-10 h-10 rounded-lg border hover:bg-emerald-900/70 text-emerald-100 flex items-center justify-center shadow-lg transition-colors cursor-pointer"
                style={{
                  backgroundColor: 'var(--prism-surface-bg)',
                  borderColor: 'var(--prism-border-hairline)',
                }}
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
                className="w-10 h-10 rounded-lg border hover:bg-emerald-900/70 text-emerald-100 flex items-center justify-center shadow-lg transition-colors cursor-pointer"
                style={{
                  backgroundColor: 'var(--prism-surface-bg)',
                  borderColor: 'var(--prism-border-hairline)',
                }}
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
                className="w-10 h-10 rounded-lg border hover:bg-emerald-900/70 text-emerald-100 flex items-center justify-center shadow-lg transition-colors cursor-pointer"
                style={{
                  backgroundColor: 'var(--prism-surface-bg)',
                  borderColor: 'var(--prism-border-hairline)',
                }}
              >
                <ResetGlyphIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Unified Collapsible Bottom Control Dock (Zero Side-Panel Clutter) */}
          <div
            className="fixed left-1/2 -translate-x-1/2 bottom-4 z-20 flex flex-col items-center pointer-events-auto transition-transform duration-200"
            style={{ maxWidth: 'min(960px, 95vw)' }}
          >
            {/* Collapse / Expand Zen Mode Toggle */}
            <button
              type="button"
              tabIndex={-1}
              onClick={(e) => {
                e.currentTarget.blur();
                setDockCollapsed((prev) => !prev);
              }}
              className="px-3 py-1 rounded-t-lg border border-b-0 text-[11px] font-mono text-emerald-200 hover:text-amber-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              style={{
                backgroundColor: 'var(--prism-surface-bg)',
                borderColor: 'var(--prism-border-hairline)',
              }}
            >
              {dockCollapsed ? '▴ Show Sanctuary Controls [H]' : '▾ Hide Sanctuary Controls [H]'}
            </button>

            {!dockCollapsed && (
              <div
                className="border px-4 py-2.5 shadow-2xl flex flex-wrap items-center justify-center gap-2.5"
                style={{
                  backgroundColor: 'var(--prism-surface-bg)',
                  borderColor: 'var(--prism-border-hairline)',
                  borderRadius: 'var(--prism-radius-outer)',
                }}
              >
                {/* Botanical Resonance Actions with Tactile Hold & Refractory Envelopes */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    tabIndex={-1}
                    onMouseDown={(e) => {
                      e.currentTarget.blur();
                      gardenHandleRef.current?.setHeldAction('attune');
                    }}
                    onMouseUp={() => gardenHandleRef.current?.setHeldAction(null)}
                    onMouseLeave={() => {
                      if (telemetry.gestureHold.heldGesture === 'attune') {
                        gardenHandleRef.current?.setHeldAction(null);
                      }
                    }}
                    className={`relative overflow-hidden px-3.5 py-1.5 rounded-lg font-semibold text-xs transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                      telemetry.gestureHold.heldGesture === 'attune'
                        ? 'bg-amber-200 text-slate-950 scale-[0.97] ring-2 ring-amber-300/80 shadow-inner'
                        : 'bg-amber-300 hover:bg-amber-200 text-slate-950'
                    }`}
                  >
                    <span>
                      {telemetry.gestureHold.heldGesture === 'attune'
                        ? 'Attuning Choir… [Space]'
                        : 'Attune Flora [Space]'}
                    </span>
                    {(telemetry.gestureHold.heldGesture === 'attune' ||
                      telemetry.gestureHold.attuneCooldownSec > 0) && (
                      <span
                        className="absolute bottom-0 left-0 h-0.5 bg-slate-950/65 transition-all duration-75"
                        style={{
                          width: `${Math.round(
                            (telemetry.gestureHold.heldGesture === 'attune'
                              ? telemetry.gestureHold.holdProgress
                              : telemetry.gestureHold.attuneCooldownSec /
                                VERDANT_HUMANE_STANDARD.attuneRefractorySec) * 100,
                          )}%`,
                        }}
                      />
                    )}
                  </button>

                  <button
                    type="button"
                    tabIndex={-1}
                    onMouseDown={(e) => {
                      e.currentTarget.blur();
                      gardenHandleRef.current?.setHeldAction('touch');
                    }}
                    onMouseUp={() => gardenHandleRef.current?.setHeldAction(null)}
                    onMouseLeave={() => {
                      if (telemetry.gestureHold.heldGesture === 'touch') {
                        gardenHandleRef.current?.setHeldAction(null);
                      }
                    }}
                    className={`relative overflow-hidden px-3 py-1.5 rounded-lg border font-medium text-xs transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                      telemetry.gestureHold.heldGesture === 'touch'
                        ? 'border-amber-300/80 bg-emerald-800/90 text-amber-100 scale-[0.97] ring-1 ring-amber-300/50'
                        : 'border-emerald-400/30 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-100'
                    }`}
                  >
                    <span>
                      {telemetry.gestureHold.heldGesture === 'touch'
                        ? 'Plucking Petal… [T]'
                        : 'Touch Petal [T]'}
                    </span>
                    {(telemetry.gestureHold.heldGesture === 'touch' ||
                      telemetry.gestureHold.touchCooldownSec > 0) && (
                      <span
                        className="absolute bottom-0 left-0 h-0.5 bg-amber-300 transition-all duration-75"
                        style={{
                          width: `${Math.round(
                            (telemetry.gestureHold.heldGesture === 'touch'
                              ? telemetry.gestureHold.holdProgress
                              : telemetry.gestureHold.touchCooldownSec /
                                VERDANT_HUMANE_STANDARD.touchRefractorySec) * 100,
                          )}%`,
                        }}
                      />
                    )}
                  </button>

                  <button
                    type="button"
                    tabIndex={-1}
                    onMouseDown={(e) => {
                      e.currentTarget.blur();
                      gardenHandleRef.current?.setHeldAction('stillness');
                    }}
                    onMouseUp={() => gardenHandleRef.current?.setHeldAction(null)}
                    onMouseLeave={() => {
                      if (telemetry.gestureHold.heldGesture === 'stillness') {
                        gardenHandleRef.current?.setHeldAction(null);
                      }
                    }}
                    className={`relative overflow-hidden px-3 py-1.5 rounded-lg border font-medium text-xs transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                      telemetry.gestureHold.heldGesture === 'stillness'
                        ? 'border-teal-300/80 bg-teal-900/90 text-teal-100 scale-[0.97] ring-1 ring-teal-300/60'
                        : 'border-emerald-400/30 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-100'
                    }`}
                  >
                    <span>
                      {telemetry.gestureHold.heldGesture === 'stillness'
                        ? `Breath: ${
                            telemetry.gestureHold.stillnessBreathPhase === 'inhale'
                              ? 'Inhale'
                              : telemetry.gestureHold.stillnessBreathPhase === 'crest'
                                ? 'Hold'
                                : 'Exhale'
                          } [C]`
                        : 'Stillness [C]'}
                    </span>
                    {telemetry.gestureHold.heldGesture === 'stillness' && (
                      <span
                        className="absolute bottom-0 left-0 h-0.5 bg-teal-300 transition-all duration-75"
                        style={{
                          width: `${Math.round(telemetry.gestureHold.stillnessBreathProgress * 100)}%`,
                        }}
                      />
                    )}
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
        <Suspense fallback={null}>
          <LazyPrismInspectorModal
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
        </Suspense>
      )}
    </main>
  );
}
