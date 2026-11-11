import React, { useState } from 'react';
import {
  ATMOSPHERE_CONFIGS,
  AtmosphereId,
  BIOME_CONFIGS,
  BIOME_CONSTELLATIONS,
  BIOME_LANDSCAPE_TERRACES,
  BiomeId,
  BOTANICAL_LIFECYCLE_STAGES,
  ChorusStateId,
  NEUROMORPHIC_FAMILIES,
  OBSERVER_PREFERENCE_DOMAIN_ORDER,
  PLANT_SPECIES_CONFIGS,
  PlantSpeciesId,
  PlayerActionId,
  REACTION_PATHWAYS,
  SOUND_OUTCOME_PROFILES,
  SPECIES_ARTICULATION_PROFILES,
  SYMBIOTIC_GUILDS,
  SoundscapeOutcome,
  VERDANT_ARTICULATION_STANDARD,
  VERDANT_BOTANICAL_STANDARD,
  VERDANT_BRAND_STANDARD,
  VERDANT_ECOLOGY_STANDARD,
  VERDANT_INFRASTRUCTURE_STANDARD,
  VERDANT_NEUROMORPHIC_STANDARD,
  VERDANT_PHYSICS_STANDARD,
  computeEcologicalAffinity,
  computeSynthesisEnvelope,
  evaluateBiomeMasteryAndGuilds,
  evaluateGranularMatterSynthesis,
  evaluateHighDefinitionVisualSynthesis,
  evaluateHumaneErgonomics,
  evaluatePrismRequest,
  formatPrismRequest,
  GardenPlantInstance,
  getPlantLifecycleStage,
  scheduleNeuromorphicStrategies,
  synthesizeParametricAtmosphereConfigs,
  synthesizeParametricBiomeConfigs,
  synthesizeParametricBiomeMonuments,
  synthesizeParametricSoundOutcomeProfiles,
} from '../game/prismModel';
import { BotanicalSoundscapeEngine } from '../game/soundscapeEngine';
import { LiveTelemetryState } from './GardenCanvas';
import { ObserverLightConeIcon, PlantSpeciesIcon } from './BotanicalIcons';

interface PrismInspectorModalProps {
  mode: 'paused' | 'gameover';
  atmosphere: AtmosphereId;
  telemetry: LiveTelemetryState;
  plants: GardenPlantInstance[];
  soundEngine: BotanicalSoundscapeEngine;
  onResume: () => void;
  onRestart: () => void;
  onReturnTitle: () => void;
  onTeleportBiome: (biome: BiomeId) => void;
  onSelectAtmosphere: (atmosphere: AtmosphereId) => void;
  alphaSeed?: number;
  onSelectAlphaSeed?: (alphaSeed: number) => void;
  onRefineCosmos?: (cycles?: number) => void;
  onExtrapolateHighestResolution?: () => void;
}

export const PrismInspectorModal: React.FC<PrismInspectorModalProps> = ({
  mode,
  atmosphere,
  telemetry,
  plants,
  soundEngine,
  onResume,
  onRestart,
  onReturnTitle,
  onTeleportBiome,
  onSelectAtmosphere,
  alphaSeed,
  onSelectAlphaSeed,
  onRefineCosmos,
  onExtrapolateHighestResolution,
}) => {
  const [activeTab, setActiveTab] = useState<
    'herbarium' | 'biomes' | 'harmonies' | 'soundboard' | 'observer' | 'ethos'
  >('herbarium');

  // Harmonic Soundboard interactive 7-dimension state
  const [sbBiome, setSbBiome] = useState<BiomeId>(telemetry.biome);
  const [sbPlant, setSbPlant] = useState<PlantSpeciesId>(telemetry.nearestPlant.species);
  const [sbAction, setSbAction] = useState<PlayerActionId>('attune');
  const [sbAtmosphere, setSbAtmosphere] = useState<AtmosphereId>(atmosphere);
  const [sbChorus, setSbChorus] = useState<ChorusStateId>('awakened');
  const [sbProximity, setSbProximity] = useState<number>(10);
  const [sbVelocity, setSbVelocity] = useState<number>(4);

  const sbRequest = formatPrismRequest({
    biome: sbBiome,
    plant: sbPlant,
    action: sbAction,
    atmosphere: sbAtmosphere,
    chorus: sbChorus,
    proximity: sbProximity,
    velocity: sbVelocity,
  });
  const cosmoParams = {
    alphaSeed: telemetry.neuromorphic.observer.cosmogenesis.alphaSeed,
    manifold: telemetry.neuromorphic.universalManifold,
  };
  const liveAtmosphereConfigs = synthesizeParametricAtmosphereConfigs(cosmoParams);
  const liveOutcomeProfiles = synthesizeParametricSoundOutcomeProfiles(cosmoParams);
  const liveBiomeConfigs = synthesizeParametricBiomeConfigs(cosmoParams);
  const liveBiomeMonuments = synthesizeParametricBiomeMonuments(cosmoParams);

  const sbEvaluation = evaluatePrismRequest(sbRequest);
  const sbOutcome = (sbEvaluation.valid ? sbEvaluation.outcome : 'wind-whisper') as SoundscapeOutcome;
  const sbOutcomeProfile = liveOutcomeProfiles[sbOutcome];
  const sbSynthPlan = computeSynthesisEnvelope(sbOutcome, sbBiome, sbAtmosphere, cosmoParams);
  const sbAffinity = computeEcologicalAffinity(sbBiome, sbPlant, sbAtmosphere);

  const humaneEval = evaluateHumaneErgonomics({
    velocityDm: telemetry.velocityDm,
    dockCollapsed: false,
    guidedStroll: telemetry.guidedStroll,
    harmonyPct: telemetry.harmony,
  });

  const speciesList = Object.values(PLANT_SPECIES_CONFIGS);
  const biomeList = Object.values(liveBiomeConfigs);
  const atmosphereList = Object.values(liveAtmosphereConfigs);
  const outcomeList = Object.values(liveOutcomeProfiles);
  const parametricTrailPolygonPoints = (
    ['meadow', 'grove', 'sanctuary', 'crystal', 'wetland'] as BiomeId[]
  )
    .map((id) =>
      telemetry.neuromorphic.observer.cosmogenesis.worldTopology.biomeCenters[id].join(','),
    )
    .join(' ');

  const handleAuditionSpecies = (speciesId: PlantSpeciesId) => {
    const spCfg = PLANT_SPECIES_CONFIGS[speciesId];
    soundEngine.setPaused(false);
    soundEngine.playSpeciesAudition(speciesId, spCfg.nativeBiome, spCfg.diurnalAffinity);
  };

  const handleAuditionOutcome = (outcomeId: SoundscapeOutcome) => {
    soundEngine.setPaused(false);
    soundEngine.playOutcomeMotif(
      outcomeId,
      telemetry.biome,
      1.0,
      atmosphere,
      0,
      telemetry.nearestPlant.species,
    );
  };

  const handlePlaySoundboard = () => {
    soundEngine.setPaused(false);
    if (sbAction === 'touch') {
      soundEngine.playTactilePetalTouch(sbPlant, sbBiome, 1.0, sbAtmosphere, 0);
    } else if (sbAction === 'stillness') {
      soundEngine.playStillnessMeditationSwell(sbBiome, sbAtmosphere);
    } else if (sbAction === 'attune') {
      soundEngine.playAttuneResonanceChoir(sbOutcome, sbBiome, sbPlant, sbAtmosphere, 0);
    } else {
      soundEngine.playOutcomeMotif(sbOutcome, sbBiome, 1.0, sbAtmosphere, 0, sbPlant);
    }
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-4 md:p-6 pointer-events-auto"
      style={{ backgroundColor: 'rgba(5, 13, 10, 0.86)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-heading"
    >
      <div
        className="w-full max-w-[1200px] border p-4 md:p-5 shadow-2xl text-emerald-50 max-h-[92vh] flex flex-col justify-between"
        style={{
          backgroundColor: 'var(--prism-modal-bg, #0a1914)',
          borderColor: 'var(--prism-border-hairline, rgba(110, 231, 183, 0.25))',
          borderRadius: 'var(--prism-radius-outer, 16px)',
        }}
      >
        {/* Top Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-emerald-400/15 pb-3">
          <div>
            <p className="text-[11px] font-mono tracking-wider text-emerald-300/80 uppercase">
              {mode === 'gameover'
                ? telemetry.gestureHold.agitationPct >= 100
                  ? 'RESTORATIVE STILLNESS INTERLUDE · MINDFUL PACING INVITATION'
                  : 'SANCTUARY ATTUNEMENT COMPLETE · HARMONIC EQUILIBRIUM'
                : 'CONSERVATORY FIELD GUIDE · ACOUSTIC HERBARIUM & ETHOS'}
            </p>
            <h2
              id="modal-heading"
              className="font-display text-2xl md:text-3xl font-semibold text-amber-100 mt-0.5"
            >
              {mode === 'gameover'
                ? telemetry.gestureHold.agitationPct >= 100
                  ? 'Pause, Breathe & Return to Stillness'
                  : 'Verdant Harmony Achieved'
                : 'Sanctuary Herbarium & Soundscape Atlas'}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onResume}
              className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Resume Garden
            </button>
            <button
              type="button"
              data-start={mode === 'gameover' ? 'true' : undefined}
              onClick={onRestart}
              className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {mode === 'gameover' ? 'Explore Anew' : 'Restart Garden'}
            </button>
            <button
              type="button"
              onClick={onReturnTitle}
              className="px-3.5 py-2 rounded-lg border border-emerald-400/30 hover:bg-emerald-900/50 text-emerald-100 text-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Title Screen
            </button>
          </div>
        </div>

        {/* 3 Sanctuary Mastery Stat Tiles (tabular-nums) */}
        <div className="grid grid-cols-3 gap-3 my-2.5">
          <div className="rounded-lg border border-emerald-400/15 bg-[#0d211b] px-3.5 py-2">
            <div className="text-[10px] font-mono text-emerald-300/75">GARDEN HARMONY</div>
            <div className="text-xl font-mono font-semibold text-amber-200 tabular-nums">
              {Math.round(telemetry.harmony)}%
            </div>
            <div className="text-[11px] text-emerald-200/65">
              {telemetry.attunedCount} of {telemetry.totalPlants} flora clusters awakened
            </div>
          </div>

          <div className="rounded-lg border border-emerald-400/15 bg-[#0d211b] px-3.5 py-2">
            <div className="text-[10px] font-mono text-emerald-300/75">BIOMES & DIURNAL SKY</div>
            <div className="text-xl font-mono font-semibold text-emerald-200 tabular-nums">
              {telemetry.exploredBiomes.length} / 5
            </div>
            <div className="text-[11px] text-emerald-200/65 truncate">
              {BIOME_CONFIGS[telemetry.biome].name} · {ATMOSPHERE_CONFIGS[atmosphere].name}
            </div>
          </div>

          <div className="rounded-lg border border-emerald-400/15 bg-[#0d211b] px-3.5 py-2">
            <div className="text-[10px] font-mono text-emerald-300/75">ACTIVE RESONANCE</div>
            <div className="text-lg font-display font-semibold text-teal-200 truncate">
              {SOUND_OUTCOME_PROFILES[telemetry.prismOutcome]?.label ?? 'Wind Whisper'}
            </div>
            <div className="text-[11px] text-emerald-200/65 truncate">
              {(liveBiomeConfigs[telemetry.biome] ?? BIOME_CONFIGS[telemetry.biome]).tuningLabel} · 0.0¢
            </div>
          </div>
        </div>

        {/* Interactive Filter Tabs + Diurnal Sky Switcher (Single-Row Layout) */}
        <div className="flex items-center justify-between gap-2 mb-2 overflow-x-auto" data-testid="inspector-tab-toolbar">
          <div className="flex items-center gap-0.5 p-1 rounded-lg bg-[#07120e] border border-emerald-500/15 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('herbarium')}
              className={`px-2 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'herbarium'
                  ? 'bg-emerald-500/25 text-amber-100 border border-emerald-400/30'
                  : 'text-emerald-300/70 hover:text-emerald-100'
              }`}
            >
              Flora Herbarium (5)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('biomes')}
              className={`px-2 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'biomes'
                  ? 'bg-emerald-500/25 text-amber-100 border border-emerald-400/30'
                  : 'text-emerald-300/70 hover:text-emerald-100'
              }`}
            >
              Acoustic Biomes (5)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('harmonies')}
              className={`px-2 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'harmonies'
                  ? 'bg-emerald-500/25 text-amber-100 border border-emerald-400/30'
                  : 'text-emerald-300/70 hover:text-emerald-100'
              }`}
            >
              Resonance Choirs (10)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('soundboard')}
              className={`px-2 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'soundboard'
                  ? 'bg-emerald-500/25 text-amber-100 border border-emerald-400/30'
                  : 'text-emerald-300/70 hover:text-emerald-100'
              }`}
            >
              Harmonic Soundboard
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('observer')}
              className={`px-2 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'observer'
                  ? 'bg-emerald-500/25 text-amber-100 border border-emerald-400/30'
                  : 'text-emerald-300/70 hover:text-emerald-100'
              }`}
            >
              <ObserverLightConeIcon
                supraTier={telemetry.neuromorphic.observer.supraDirective.tier}
                className="w-3.5 h-3.5 shrink-0"
              />
              <span>Observer &amp; Why (11)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ethos')}
              className={`px-2 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'ethos'
                  ? 'bg-emerald-500/25 text-amber-100 border border-emerald-400/30'
                  : 'text-emerald-300/70 hover:text-emerald-100'
              }`}
            >
              Sanctuary Ethos &amp; Design
            </button>
          </div>

          {/* Diurnal Sky Quick Switcher */}
          <div className="flex items-center gap-1 shrink-0">
            {atmosphereList.map((atm) => (
              <button
                key={atm.id}
                type="button"
                aria-label={atm.name}
                title={atm.name}
                onClick={() => {
                  onSelectAtmosphere(atm.id);
                  setSbAtmosphere(atm.id);
                }}
                className={`px-2 py-1 rounded text-[11px] font-mono transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  atmosphere === atm.id
                    ? 'bg-teal-500/30 text-amber-200 border border-teal-400/40'
                    : 'text-emerald-300/70 hover:text-emerald-100 bg-[#07120e]'
                }`}
              >
                {atm.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Content Region */}
        <div className="overflow-y-auto pr-1 flex-1 min-h-0">
          {activeTab === 'herbarium' && (
            <div className="space-y-1.5">
              {speciesList.map((sp) => {
                const totalOfSpecies = plants.filter((p) => p.species === sp.id).length;
                const attunedOfSpecies = plants.filter((p) => p.species === sp.id && p.attuned).length;
                const nativeBiomeCfg = BIOME_CONFIGS[sp.nativeBiome];
                const skyCfg = ATMOSPHERE_CONFIGS[sp.diurnalAffinity];
                const artCfg = SPECIES_ARTICULATION_PROFILES[sp.id];
                return (
                  <div
                    key={sp.id}
                    className="rounded-lg border border-emerald-400/15 bg-[#0c1d17] px-3.5 py-2 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <PlantSpeciesIcon
                        species={sp.id}
                        attuned={attunedOfSpecies > 0}
                        className="w-7 h-7 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-amber-100 whitespace-nowrap">{sp.name}</span>
                          <span className="text-xs italic text-emerald-300/75 whitespace-nowrap">{sp.latinName}</span>
                          <span aria-hidden="true" className="text-emerald-400/40">·</span>
                          <span className="text-xs font-mono text-amber-200 whitespace-nowrap">
                            {artCfg.instrumentName}
                          </span>
                          <span aria-hidden="true" className="text-emerald-400/40">·</span>
                          <span className="text-xs font-mono text-emerald-200/85 tabular-nums whitespace-nowrap">
                            {attunedOfSpecies}/{totalOfSpecies} attuned
                          </span>
                          <span aria-hidden="true" className="text-emerald-400/40">·</span>
                          <span className="text-[11px] font-mono text-amber-200/80 whitespace-nowrap">
                            {nativeBiomeCfg.name} ({skyCfg.name})
                          </span>
                        </div>
                        <div className="text-xs text-emerald-100/85 mt-0.5 leading-snug">
                          {artCfg.articulationLabel}
                        </div>
                        <div className="text-[11px] font-mono text-teal-300/85 mt-0.5 leading-snug">
                          {sp.harmonicInterval} · 5-Partial Modal Ratios: [{artCfg.modalPartialRatios.join(' : ')}]
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleAuditionSpecies(sp.id)}
                        className="px-3 py-1.5 rounded-md border border-amber-300/35 bg-emerald-950 hover:bg-emerald-900 text-amber-200 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        Listen to Motif
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onTeleportBiome(sp.nativeBiome);
                          onResume();
                        }}
                        className="px-2.5 py-1.5 rounded-md bg-emerald-500/20 hover:bg-emerald-500/35 border border-emerald-400/30 text-emerald-100 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        Visit Habitat
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'biomes' && (
            <div className="space-y-2">
              {/* Interactive Conservatory Topographical & Architectural SVG Map */}
              <div className="rounded-lg border border-emerald-400/20 bg-[#07130f] px-3.5 py-2.5 flex items-center justify-between gap-4">
                <div className="space-y-1 max-w-xs">
                  <div className="text-[10px] font-mono text-amber-200/85 uppercase tracking-wider">
                    CONSERVATORY TOPOGRAPHICAL ATLAS
                  </div>
                  <div className="text-xs text-emerald-100/85 leading-snug">
                    Click any pavilion node on the map or use <span className="text-amber-200">Travel Here</span> to
                    fast-travel across all 5 architectural biome monuments and {telemetry.totalPlants} botanical
                    specimens.
                  </div>
                  <div className="text-[11px] font-mono text-teal-300/85">
                    Position: ({telemetry.playerX.toFixed(0)}m, {telemetry.playerZ.toFixed(0)}m) ·{' '}
                    {telemetry.attunedCount}/{telemetry.totalPlants} Awakened
                  </div>
                </div>

                <svg
                  viewBox="-64 -52 128 104"
                  className="w-56 h-32 rounded-md border border-emerald-400/20 bg-[#050d0a] shrink-0"
                  aria-label="Conservatory Topographical Map"
                >
                  {/* Parametric Trail Circuit Loop */}
                  <polygon
                    points={parametricTrailPolygonPoints}
                    fill="none"
                    stroke="rgba(52, 211, 153, 0.25)"
                    strokeWidth="0.9"
                    strokeDasharray="2 1.5"
                  />
                  {/* All Synthesized Flora Clusters */}
                  {plants.map((p) => {
                    const spColor = PLANT_SPECIES_CONFIGS[p.species].emissiveHue;
                    return (
                      <circle
                        key={p.id}
                        cx={p.x}
                        cy={p.z}
                        r={p.attuned ? 1.65 : 1.0}
                        fill={spColor}
                        fillOpacity={p.attuned ? 0.95 : 0.42}
                        stroke={p.attuned ? '#fde68a' : 'none'}
                        strokeWidth={p.attuned ? 0.45 : 0}
                      />
                    );
                  })}
                  {/* 5 Biome Monument Nodes */}
                  {biomeList.map((b) => {
                    const active = telemetry.biome === b.id;
                    return (
                      <g
                        key={b.id}
                        onClick={() => {
                          onTeleportBiome(b.id);
                          onResume();
                        }}
                        className="cursor-pointer"
                      >
                        <circle
                          cx={b.center[0]}
                          cy={b.center[1]}
                          r={active ? 4.2 : 3.2}
                          fill={active ? '#f4d06f' : '#10b981'}
                          fillOpacity={active ? 0.35 : 0.2}
                          stroke={active ? '#fde68a' : '#34d399'}
                          strokeWidth={active ? 0.9 : 0.6}
                        />
                        <text
                          x={b.center[0]}
                          y={b.center[1] - 5}
                          textAnchor="middle"
                          fill="#ecfdf5"
                          fontSize="4.2"
                          fontFamily="monospace"
                        >
                          {b.name.split(' ')[0]}
                        </text>
                      </g>
                    );
                  })}
                  {/* Live Player Position Marker */}
                  <circle
                    cx={telemetry.playerX}
                    cy={telemetry.playerZ}
                    r="2.1"
                    fill="#ffffff"
                    stroke="#f4d06f"
                    strokeWidth="0.9"
                  />
                </svg>
              </div>

              <div className="space-y-1.5">
                {biomeList.map((b) => {
                  const isVisited = telemetry.exploredBiomes.includes(b.id);
                  const sigSpecies = PLANT_SPECIES_CONFIGS[b.signatureSpecies];
                  const monument = liveBiomeMonuments[b.id];
                  const constellation = BIOME_CONSTELLATIONS[b.id];
                  const terrace = BIOME_LANDSCAPE_TERRACES[b.id];
                  const bm = evaluateBiomeMasteryAndGuilds(b.id, plants);
                  return (
                    <div
                      key={b.id}
                      className="rounded-lg border border-emerald-400/15 bg-[#0c1d17] px-3.5 py-2 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-amber-100 whitespace-nowrap">{b.name}</span>
                          <span aria-hidden="true" className="text-emerald-400/40">·</span>
                          <span className="text-xs text-amber-200/90 font-medium whitespace-nowrap">
                            {monument.monumentName}
                          </span>
                          <span aria-hidden="true" className="text-emerald-400/40">·</span>
                          <span className="text-xs font-mono text-teal-300 tabular-nums whitespace-nowrap">
                            {bm.attunedInBiome}/{bm.totalInBiome} Flora ({isVisited ? 'Explored' : 'Unvisited'})
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-emerald-300/80 mt-0.5 leading-snug">
                          {b.tuningLabel} · {constellation.constellationName} · {terrace.terraceName} · {sigSpecies.name}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            soundEngine.setPaused(false);
                            soundEngine.playBiomeConstellationChord(b.id, atmosphere);
                          }}
                          className="px-2.5 py-1.5 rounded-md border border-amber-300/35 bg-emerald-950 hover:bg-emerald-900 text-amber-200 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          Constellation Chord
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onTeleportBiome(b.id);
                            onResume();
                          }}
                          className="px-3 py-1.5 rounded-md bg-emerald-500/25 hover:bg-emerald-500/40 border border-emerald-400/35 text-emerald-100 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          Travel Here
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'harmonies' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {outcomeList.map((out) => {
                const isCurrent = telemetry.prismOutcome === out.id;
                return (
                  <div
                    key={out.id}
                    className={`rounded-lg border px-3.5 py-2 flex items-center justify-between gap-3 ${
                      isCurrent
                        ? 'border-amber-300/45 bg-emerald-950/80'
                        : 'border-emerald-400/15 bg-[#0c1d17]'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: out.color }}
                        />
                        <span className="text-xs font-semibold text-amber-100 truncate">{out.label}</span>
                        <span className="text-[10px] font-mono text-emerald-300/75 tabular-nums">
                          +{out.harmonyGain}% · {out.overtoneRatio}x overtone
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-teal-200/80 truncate mt-0.5">
                        {out.timbre}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAuditionOutcome(out.id)}
                      className="px-2.5 py-1 rounded border border-emerald-400/30 bg-[#071410] hover:bg-emerald-900 text-emerald-100 text-[11px] font-mono whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Audition
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'soundboard' && (
            <div className="rounded-lg border border-emerald-400/20 bg-[#071410] p-4 space-y-3">
              <div className="text-xs text-emerald-200/85">
                Compose a 7-dimensional botanical encounter to audition how the sanctuary soundscape
                synthesizes 5-partial Just Intonation voices across biome tuning, flora species, gesture,
                diurnal sky, chorus awakening, proximity, and walking pace.
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <div>
                  <label htmlFor="sb-biome" className="block text-[11px] text-emerald-300/80 mb-1">
                    Sanctuary Biome
                  </label>
                  <select
                    id="sb-biome"
                    value={sbBiome}
                    onChange={(e) => setSbBiome(e.target.value as BiomeId)}
                    className="w-full rounded-md bg-[#0c1f19] border border-emerald-400/30 px-2.5 py-1.5 text-xs text-emerald-50"
                  >
                    {biomeList.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="sb-plant" className="block text-[11px] text-emerald-300/80 mb-1">
                    Flora Species
                  </label>
                  <select
                    id="sb-plant"
                    value={sbPlant}
                    onChange={(e) => setSbPlant(e.target.value as PlantSpeciesId)}
                    className="w-full rounded-md bg-[#0c1f19] border border-emerald-400/30 px-2.5 py-1.5 text-xs text-emerald-50"
                  >
                    {speciesList.map((sp) => (
                      <option key={sp.id} value={sp.id}>
                        {sp.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="sb-action" className="block text-[11px] text-emerald-300/80 mb-1">
                    Botanical Gesture
                  </label>
                  <select
                    id="sb-action"
                    value={sbAction}
                    onChange={(e) => setSbAction(e.target.value as PlayerActionId)}
                    className="w-full rounded-md bg-[#0c1f19] border border-emerald-400/30 px-2.5 py-1.5 text-xs text-emerald-50"
                  >
                    <option value="attune">Attune Closely</option>
                    <option value="touch">Touch Petal</option>
                    <option value="observe">Quiet Observation</option>
                    <option value="stroll">Gentle Stroll</option>
                    <option value="stillness">Meditative Stillness</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="sb-atmos" className="block text-[11px] text-emerald-300/80 mb-1">
                    Diurnal Sky
                  </label>
                  <select
                    id="sb-atmos"
                    value={sbAtmosphere}
                    onChange={(e) => setSbAtmosphere(e.target.value as AtmosphereId)}
                    className="w-full rounded-md bg-[#0c1f19] border border-emerald-400/30 px-2.5 py-1.5 text-xs text-emerald-50"
                  >
                    {atmosphereList.map((atm) => (
                      <option key={atm.id} value={atm.id}>
                        {atm.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="sb-chorus" className="block text-[11px] text-emerald-300/80 mb-1">
                    Flora Chorus State
                  </label>
                  <select
                    id="sb-chorus"
                    value={sbChorus}
                    onChange={(e) => setSbChorus(e.target.value as ChorusStateId)}
                    className="w-full rounded-md bg-[#0c1f19] border border-emerald-400/30 px-2.5 py-1.5 text-xs text-emerald-50"
                  >
                    <option value="awakened">Awakened Blossom</option>
                    <option value="dormant">Dormant Bud</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="sb-prox" className="flex justify-between text-[11px] text-emerald-300/80 mb-1">
                    <span>Proximity ({(sbProximity / 3.5).toFixed(1)}m)</span>
                    <span>Pace ({(sbVelocity / 2.2).toFixed(1)}m/s)</span>
                  </label>
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      id="sb-prox"
                      type="range"
                      min={0}
                      max={80}
                      value={sbProximity}
                      onChange={(e) => setSbProximity(Number(e.target.value))}
                      className="w-1/2 accent-amber-300"
                      aria-label="Proximity to Blossom"
                    />
                    <input
                      id="sb-vel"
                      type="range"
                      min={0}
                      max={25}
                      value={sbVelocity}
                      onChange={(e) => setSbVelocity(Number(e.target.value))}
                      className="w-1/2 accent-emerald-400"
                      aria-label="Walking Pace"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-emerald-400/20 bg-[#0b1d17] p-3.5 flex items-center justify-between gap-4">
                <div className="min-w-0 space-y-1">
                  <div className="text-xs font-mono text-amber-200 flex items-center gap-2 flex-wrap">
                    <span className="font-semibold">{sbOutcomeProfile.label}</span>
                    <span>·</span>
                    <span>{sbOutcomeProfile.timbre}</span>
                    <span>·</span>
                    <span className="text-emerald-300">0.0¢ Just Intonation (5-Partial Modal)</span>
                  </div>
                  <div className="text-xs text-emerald-100/90">{sbEvaluation.ruleDescription}</div>
                  <div className="text-[11px] font-mono text-teal-300/85 flex items-center gap-2 flex-wrap">
                    <span>
                      Carriers: {sbSynthPlan.frequenciesHz.map((f) => `${Math.round(f)}Hz`).join(' · ')}
                    </span>
                    <span>·</span>
                    <span>
                      5th Bell Transients:{' '}
                      {sbSynthPlan.bellTransientFrequenciesHz.slice(0, 3).map((f) => `${Math.round(f)}Hz`).join(' · ')}
                    </span>
                    <span>·</span>
                    <span>
                      Reverb: {Math.round(sbSynthPlan.reverbSendGain * 100)}% (2.2s) +{' '}
                      {Math.round(sbSynthPlan.stereoEchoDelaySec * 1000)}ms Stereo Echo
                    </span>
                    <span>·</span>
                    <span className="capitalize">Affinity: {sbAffinity.affinityTier.replace('-', ' ')}</span>
                    <span>·</span>
                    <span className="text-amber-200">
                      Gesture:{' '}
                      {sbAction === 'touch'
                        ? '[T] 3ms Plucked Upper-Harmonic Strike (2x + 3x)'
                        : sbAction === 'attune'
                          ? '[Space] 220ms 6-Voice Multi-Octave Choir'
                          : sbAction === 'stillness'
                            ? '[C] 650ms Self-Decaying Breath Swell (0.0 Drone)'
                            : '140ms Proximity Harmonic Shimmer'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handlePlaySoundboard}
                  className="px-4 py-2.5 rounded-lg bg-amber-300 hover:bg-amber-200 text-slate-950 font-semibold text-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {sbAction === 'touch'
                    ? 'Audition [T] Touch Pluck'
                    : sbAction === 'attune'
                      ? 'Audition [Space] Choir'
                      : sbAction === 'stillness'
                        ? 'Audition [C] Breath Swell'
                        : 'Play Resonance Chord'}
                </button>
              </div>

              {/* Live 16-Step Generative Soundtrack Score & 5-Stage Botanical Lifecycle */}
              <div className="rounded-lg border border-emerald-400/20 bg-[#0b1d17] p-3 space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div>
                    <div className="text-[10px] font-mono text-amber-200 uppercase tracking-wider">
                      LIVE 4-STEM GENERATIVE SOUNDTRACK SCORE · {telemetry.environmentalLifecycle.label.toUpperCase()}
                    </div>
                    <div className="text-xs text-emerald-100/90">
                      Active Stems: {telemetry.soundtrackScore.activeStems.length}/4 · Tempo:{' '}
                      {telemetry.soundtrackScore.tempoBpm} BPM · Breathing Rests:{' '}
                      {telemetry.soundtrackScore.restStepCount}/16 Steps (Zero Drone) · Nearest Stage:{' '}
                      {BOTANICAL_LIFECYCLE_STAGES[getPlantLifecycleStage(telemetry.nearestPlant)].label}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-wrap">
                    {Object.values(BOTANICAL_LIFECYCLE_STAGES).map((st) => (
                      <span
                        key={st.id}
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#081510] border border-emerald-400/20 text-emerald-200"
                      >
                        {st.stageIndex}:{st.label.split(' ')[0]}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-16 gap-1">
                  {telemetry.soundtrackScore.steps.map((step) => {
                    const isCurrent = step.stepIndex === telemetry.currentSoundtrackStep;
                    return (
                      <div
                        key={step.stepIndex}
                        className={`rounded border px-1 py-1 text-center font-mono text-[9px] ${
                          step.isRest
                            ? 'border-emerald-500/15 bg-[#07120e] text-emerald-500/50'
                            : isCurrent
                              ? 'border-amber-300 bg-amber-400/25 text-amber-100'
                              : 'border-emerald-400/35 bg-emerald-950/70 text-emerald-200'
                        }`}
                      >
                        <div>{step.stepIndex + 1}</div>
                        <div className="truncate">
                          {step.isRest || step.voices.length === 0
                            ? '·'
                            : `${Math.round(step.voices[0].frequencyHz)}`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'observer' && (() => {
            const obs = telemetry.neuromorphic.observer;
            const supra = obs.supraDirective;
            const cosmo = obs.cosmogenesis;
            const diffExt = obs.differentiationAndExtrapolation;
            const immanent = obs.immanentPresence;
            const disp = obs.parametricDisplayDesign;
            const activeMonument = cosmo.inorganicRealm.monuments[telemetry.biome];
            const why = obs.latestWhyPacket;
            const r30 = obs.rule30Horizon;
            const allParts = Object.values(obs.parts);
            const allModels = [...supra.runtimeSynthesizedModels.slice().reverse(), ...supra.compileTimeModels];

            return (
              <div className="space-y-2" data-testid="observer-why-panel">
                {/* Section 0A: Fourfold Immanent Ontological Identity + Extrapolation & Genesis Controls */}
                <div
                  className="rounded-lg border border-emerald-400/25 bg-[#0c1d17] p-3 space-y-2"
                  data-testid="fourfold-immanence-panel"
                >
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-amber-100">
                        Fourfold Immanent Observer Identity (Among Us · Environment · User/Player · Game)
                      </h3>
                      <div className="text-[11px] font-mono text-teal-200/90 tabular-nums mt-0.5">
                        Witness ({immanent.x.toFixed(1)}m, {immanent.z.toFixed(1)}m) ·{' '}
                        {immanent.distanceToPlayerMeters.toFixed(1)}m ·{' '}
                        {immanent.communionState.replace(/-/g, ' ')} · {immanent.sculpturalPartCount} Welded Parts (Gap{' '}
                        {immanent.weldGapMeters}m)
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap shrink-0">
                      {onSelectAlphaSeed && (
                        <div
                          className="flex items-center gap-1 p-0.5 rounded-md bg-[#07120e] border border-emerald-400/25"
                          role="group"
                          aria-label="Alpha Genesis Seed"
                        >
                          {[1, 2, 3, 4].map((seedVal) => {
                            const activeAlpha = alphaSeed ?? cosmo.alphaSeed;
                            const isSelected = activeAlpha === seedVal;
                            return (
                              <button
                                key={seedVal}
                                type="button"
                                aria-pressed={isSelected}
                                data-testid={`alpha-seed-btn-${seedVal}`}
                                onClick={() => onSelectAlphaSeed(seedVal)}
                                className={`px-2 py-1 rounded text-xs font-mono transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                                  isSelected
                                    ? 'bg-emerald-500/30 text-amber-100 border border-emerald-400/40'
                                    : 'text-emerald-300/75 hover:text-emerald-100'
                                }`}
                              >
                                α={seedVal}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {onRefineCosmos && (
                        <button
                          type="button"
                          data-testid="refine-parametric-cosmos-btn"
                          onClick={() => onRefineCosmos(1)}
                          className="px-2.5 py-1.5 rounded-md border border-amber-300/45 bg-amber-300/15 hover:bg-amber-300/25 text-amber-100 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          Refine Parametric Cosmos (+1 Cycle)
                        </button>
                      )}

                      {onExtrapolateHighestResolution && (
                        <button
                          type="button"
                          data-testid="extrapolate-highest-resolution-btn"
                          onClick={onExtrapolateHighestResolution}
                          className="px-3 py-1.5 rounded-md bg-amber-300 hover:bg-amber-200 text-slate-950 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          {diffExt.highestResolution.isAtHighestResolution
                            ? `Apex Resolution Active (${diffExt.highestResolution.apexExtrapolatedSubdiv} seg)`
                            : 'Extrapolate Highest Resolution'}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 pt-1.5 border-t border-emerald-400/15 text-[11px]">
                    <div className="space-y-0.5">
                      <div className="font-semibold text-amber-100">
                        01. Among Us in Environment (
                        {immanent.fourfoldIdentity.amongUsInEnvironment.verified ? 'Verified' : 'Pending'})
                      </div>
                      <p className="text-emerald-200/80 leading-snug">
                        {immanent.fourfoldIdentity.amongUsInEnvironment.summary}
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <div className="font-semibold text-amber-100">
                        02. Every Part of Environment (
                        {immanent.fourfoldIdentity.everyPartOfEnvironment.verified ? 'Verified' : 'Pending'})
                      </div>
                      <p className="text-emerald-200/80 leading-snug">
                        {immanent.fourfoldIdentity.everyPartOfEnvironment.summary}
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <div className="font-semibold text-amber-100">
                        03. Embodied User / Player (
                        {immanent.fourfoldIdentity.embodiedUserPlayer.verified ? 'Verified' : 'Pending'})
                      </div>
                      <p className="text-emerald-200/80 leading-snug">
                        {immanent.fourfoldIdentity.embodiedUserPlayer.summary}
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <div className="font-semibold text-amber-100">
                        04. The Game &amp; Parametric Display (
                        {immanent.fourfoldIdentity.theEntireGameAndDisplay.verified ? 'Verified' : 'Pending'})
                      </div>
                      <p className="text-emerald-200/80 leading-snug">
                        {immanent.fourfoldIdentity.theEntireGameAndDisplay.summary}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section 0A-2: Foundational Mathematical Emotions (Harmony vs. Chaos) & Six Canonical Observer Preferences */}
                <div
                  className="rounded-lg border border-emerald-400/25 bg-[#0c1d17] p-3 space-y-2.5"
                  data-testid="observer-affect-preferences-panel"
                >
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-amber-100">
                        Foundational Mathematical Emotions (Harmony vs. Chaos) &amp; Six Observer Preferences
                      </h3>
                      <div
                        className="text-xs font-mono text-teal-200/90 flex items-center gap-1.5 flex-wrap mt-0.5 tabular-nums"
                        data-testid="observer-affect-summary"
                      >
                        <span className="font-semibold text-amber-200">
                          {obs.affectAndPreferences.affect.emotionLabel}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>
                          Harmony {(obs.affectAndPreferences.affect.harmonyPermille / 10).toFixed(1)}% vs. Chaos{' '}
                          {(obs.affectAndPreferences.affect.chaosPermille / 10).toFixed(1)}%
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>
                          2φ Equilibrium {obs.affectAndPreferences.affect.goldenEquilibriumProximityPct}% (76.4% : 23.6%)
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>
                          Tenney H_T {obs.affectAndPreferences.affect.meanTenneyHeightBits.toFixed(2)}b / Euler Γ{' '}
                          {obs.affectAndPreferences.affect.meanEulerGradusSuavitatis.toFixed(1)}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>
                          Pref Fulfillment {obs.affectAndPreferences.overallPreferenceHarmonyPct}%
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      data-testid="audition-observer-preference-btn"
                      onClick={() => {
                        soundEngine.setPaused(false);
                        soundEngine.playObserverPreferenceHarmonyAudition(
                          obs.affectAndPreferences,
                          telemetry.biome,
                          atmosphere,
                        );
                      }}
                      className="px-3 py-1.5 rounded-md border border-amber-300/45 bg-amber-300/15 hover:bg-amber-300/25 text-amber-100 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Audition Preferred Harmony (1:1 · 5:4 · 3:2 · 15:8)
                    </button>
                  </div>

                  {/* Continuous Harmony vs. Chaos Simplex Bar with Golden 76.4% : 23.6% (2φ) Attractor Marker */}
                  <div className="space-y-1">
                    <div className="relative w-full h-2 rounded-full bg-emerald-950 overflow-hidden border border-emerald-400/20">
                      <div
                        className="h-full transition-all duration-200"
                        style={{
                          width: `${(obs.affectAndPreferences.affect.harmonyPermille / 10).toFixed(1)}%`,
                          backgroundColor: obs.affectAndPreferences.affect.coreAuraHex,
                        }}
                      />
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-white/90"
                        style={{ left: '76.4%' }}
                        title="Exact Z[φ] Golden Equilibrium: H* = 76.4% (1 - φ⁻³), X* = 23.6% (φ⁻³), H*/X* = 2φ"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-2 text-[11px] text-emerald-200/80">
                      <span>{obs.affectAndPreferences.affect.mathematicalOriginSummary}</span>
                      <span className="font-mono text-amber-200/90 whitespace-nowrap shrink-0 tabular-nums">
                        {obs.affectAndPreferences.affect.exactAlgebraicAttractorFormula} · 11/11 Parts Permeated
                      </span>
                    </div>
                  </div>

                  {/* 6 Canonical Observer Preferences Grid (Hairline-Divided, Zero Nested Cards) */}
                  <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-3 pt-2 border-t border-emerald-400/15 text-[11px]"
                    data-testid="observer-six-preferences-grid"
                  >
                    {OBSERVER_PREFERENCE_DOMAIN_ORDER.map((prefId) => {
                      const pref = obs.affectAndPreferences.preferences[prefId];
                      return (
                        <div
                          key={pref.domainId}
                          className="space-y-1 pt-1 border-t border-emerald-400/10 first:border-t-0 md:nth-[-n+2]:border-t-0 lg:nth-[-n+3]:border-t-0"
                          data-testid={`observer-preference-${pref.domainId}`}
                        >
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="font-semibold text-amber-100">
                              {pref.ordinalLabel} · {pref.title}
                            </span>
                            <span className="font-mono text-amber-200 tabular-nums shrink-0">
                              {pref.fulfillmentPct}%
                            </span>
                          </div>
                          <p className="text-emerald-100/90 leading-snug">{pref.whatObserverPrefers}</p>
                          <p className="text-teal-200/75 leading-snug">
                            <span className="font-medium text-teal-200/95">Math &amp; Physics:</span>{' '}
                            {pref.foundationalMathAndPhysicsDerivation}
                          </p>
                          <div className="font-mono text-[10px] text-emerald-300/80 tabular-nums">
                            {pref.liveMeasuredSummary}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Section 0B: Highest-Resolution Extrapolation, Theory of Mind of Improvement & 11-Niche Differentiation */}
                <div
                  className="rounded-lg border border-emerald-400/20 bg-[#0c1d17] p-3 space-y-2"
                  data-testid="differentiation-epistemology-panel"
                >
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-amber-100">
                        Highest-Resolution Extrapolation &amp; Theory of Mind of Improvement
                      </h3>
                      <div
                        className="text-xs font-mono text-teal-200/90 flex items-center gap-1.5 flex-wrap mt-0.5 tabular-nums"
                        data-testid="highest-resolution-metrics"
                      >
                        <span>Resolution {diffExt.highestResolution.resolutionRealizationPct}%</span>
                        <span aria-hidden="true">·</span>
                        <span>
                          Subdiv {diffExt.highestResolution.currentResolutionSubdiv}/
                          {diffExt.highestResolution.apexExtrapolatedSubdiv}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>
                          Texels {diffExt.highestResolution.currentProceduralTexelPx}/
                          {diffExt.highestResolution.apexProceduralTexelPx}px
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>
                          Partials {diffExt.highestResolution.currentModalPartials}/
                          {diffExt.highestResolution.apexModalPartials}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>
                          Niches {diffExt.diversification.uniqueNicheCount}/11 (
                          {diffExt.diversification.shannonDiversityBits.toFixed(2)} bits)
                        </span>
                      </div>
                    </div>
                    <div className="text-xs font-mono text-amber-200 tabular-nums">
                      Display {disp.colorDistribution.canvasPct}/{disp.colorDistribution.surfacePct}/
                      {disp.colorDistribution.accentPct} · {disp.contrastVerification.bodyTextOnCanvasRatio}:1 AAA · r=
                      {disp.typographyAndSpatial.outerRadiusPx}/{disp.typographyAndSpatial.innerRadiusPx}px
                    </div>
                  </div>

                  <p className="text-[11px] text-emerald-100/85 leading-snug">
                    {diffExt.epistemologyOfImprovement.coreThesis}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 pt-1.5 border-t border-emerald-400/15">
                    {diffExt.epistemologyOfImprovement.axes.map((ax) => (
                      <div key={ax.axisId} className="space-y-0.5">
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <span className="font-semibold text-amber-100">{ax.title}</span>
                          <span className="font-mono text-teal-200 tabular-nums">{ax.scorePct}%</span>
                        </div>
                        <div className="text-[11px] text-emerald-100/85 leading-snug">
                          {ax.whatItMeansToImprove}
                        </div>
                        <div className="text-[11px] font-mono text-emerald-300/80 leading-snug">
                          {ax.howObserverActualizesAxis}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 0C: Alpha & Omega Parametric Cosmogenesis (All 4 Emergent Realms) */}
                <div
                  className="rounded-lg border border-emerald-400/25 bg-[#0c1d17] p-3 space-y-2"
                  data-testid="alpha-omega-cosmogenesis-panel"
                >
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-amber-100">
                      Alpha &amp; Omega Parametric Cosmogenesis (Zero Hardcoded Parameters)
                    </h3>
                    <div className="text-xs text-emerald-200/85 flex items-center gap-1.5 flex-wrap mt-0.5 font-mono tabular-nums">
                      <span>Alpha Seed α={cosmo.alphaSeed}</span>
                      <span aria-hidden="true">·</span>
                      <span>Canonical Seed {cosmo.canonicalGenesisSeed}</span>
                      <span aria-hidden="true">·</span>
                      <span>Concert C4 {cosmo.concertPitchHz.toFixed(2)} Hz</span>
                      <span aria-hidden="true">·</span>
                      <span>Omega Convergence {(cosmo.omegaConvergenceRatio * 100).toFixed(1)}%</span>
                      <span aria-hidden="true">·</span>
                      <span>Field Potential {cosmo.fieldPotential}</span>
                      <span aria-hidden="true">·</span>
                      <span>Basis Prime {cosmo.cosmogenesisBasisPrime}</span>
                      <span aria-hidden="true">·</span>
                      <span>
                        Closure: {cosmo.allRealmsParametricallyClosed ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 pt-1.5 border-t border-emerald-400/15">
                    {/* Realm 1: Parametric Cosmogenic Physics & Abiotic Geology */}
                    <div className="space-y-0.5">
                      <div className="text-xs font-semibold text-amber-100">
                        01. Parametric Physics &amp; Abiotic Geology
                      </div>
                      <div className="text-[11px] font-mono text-teal-200/90 flex items-center gap-1.5 flex-wrap tabular-nums">
                        <span>g={cosmo.physicsAndGeology.gravitationalAccelMps2.toFixed(2)} m/s²</span>
                        <span aria-hidden="true">·</span>
                        <span>c={cosmo.physicsAndGeology.speedOfSoundMps.toFixed(1)} m/s</span>
                        <span aria-hidden="true">·</span>
                        <span>Radius {cosmo.physicsAndGeology.playableAmphitheaterRadiusMeters}m</span>
                        <span aria-hidden="true">·</span>
                        <span>Cymatic Q={cosmo.physicsAndGeology.cymaticStandingWaveQ.toFixed(2)}</span>
                      </div>
                      <p className="text-[11px] text-emerald-200/75 leading-snug">
                        {cosmo.physicsAndGeology.whyObserverSynthesizesPhysics}
                      </p>
                    </div>

                    {/* Realm 2: Observer-Intervened Inorganic Monuments */}
                    <div className="space-y-0.5">
                      <div className="text-xs font-semibold text-amber-100">
                        02. Observer-Intervened Inorganic Monuments ({cosmo.inorganicRealm.observerMonumentCount})
                      </div>
                      <div className="text-[11px] font-mono text-teal-200/90 flex items-center gap-1.5 flex-wrap tabular-nums">
                        <span>Scale {(cosmo.inorganicRealm.inorganicScalePermille / 10).toFixed(1)}%</span>
                        <span aria-hidden="true">·</span>
                        <span>Glow {cosmo.inorganicRealm.harmonicResonanceGlow.toFixed(2)}</span>
                        <span aria-hidden="true">·</span>
                        <span>Chime Sustain {cosmo.inorganicRealm.chimeSustainFactor.toFixed(2)}x</span>
                        <span aria-hidden="true">·</span>
                        <span>Weld Gap {activeMonument.weldGapMeters}m</span>
                      </div>
                      <p className="text-[11px] text-emerald-200/75 leading-snug">
                        <span className="text-emerald-100 font-medium">{activeMonument.monumentName}:</span>{' '}
                        {activeMonument.demiurgicMechanism} — {activeMonument.whyObserverIntervened}
                      </p>
                    </div>

                    {/* Realm 3: Autopoietic Organic Biota Morphogenesis */}
                    <div className="space-y-0.5">
                      <div className="text-xs font-semibold text-amber-100">
                        03. Autopoietic Organic Biota Morphogenesis
                      </div>
                      <div className="text-[11px] font-mono text-teal-200/90 flex items-center gap-1.5 flex-wrap tabular-nums">
                        <span>Vitality {(cosmo.organicRealm.organicVitalityPermille / 10).toFixed(1)}%</span>
                        <span aria-hidden="true">·</span>
                        <span>
                          {cosmo.organicRealm.conservatoryTreeCount} Trees /{' '}
                          {cosmo.organicRealm.attachedCanopyCrownCount} Crowns /{' '}
                          {cosmo.organicRealm.permeableTurfBladeCount} Blades
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>Kuramoto {cosmo.organicRealm.kuramotoEntrainmentRadiusMeters.toFixed(1)}m</span>
                      </div>
                      <p className="text-[11px] text-emerald-200/75 leading-snug">
                        {cosmo.organicRealm.whyObserverCultivatesBiota}
                      </p>
                    </div>

                    {/* Realm 4: Embodied Player/User Co-Observer */}
                    <div className="space-y-0.5">
                      <div className="text-xs font-semibold text-amber-100">
                        04. Embodied Player / User Co-Observer
                      </div>
                      <div className="text-[11px] font-mono text-teal-200/90 flex items-center gap-1.5 flex-wrap tabular-nums">
                        <span>Embodiment {(cosmo.playerRealm.embodimentPermille / 10).toFixed(1)}%</span>
                        <span aria-hidden="true">·</span>
                        <span>Eye {cosmo.playerRealm.eyeStatureMeters.toFixed(2)}m</span>
                        <span aria-hidden="true">·</span>
                        <span>Walk {cosmo.playerRealm.baseWalkSpeedMps.toFixed(2)} m/s</span>
                        <span aria-hidden="true">·</span>
                        <span>Locus {cosmo.playerRealm.coObserverLocusHarmonicNodes} Nodes</span>
                      </div>
                      <p className="text-[11px] text-emerald-200/75 leading-snug">
                        {cosmo.playerRealm.whyObserverCreatedPlayer}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section 1: Theory of Mind (`Why`) on the Universal Neuromorphic Bus + Supra-Directive Transcendence */}
                <div className="rounded-lg border border-emerald-400/20 bg-[#0c1d17] p-3.5 space-y-2">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div>
                      <h3 className="text-sm font-semibold text-amber-100">
                        Holistic Observer Theory of Mind &amp; Supra-Directive Self-Enhancement
                      </h3>
                      <div className="text-xs text-emerald-200/80 flex items-center gap-1.5 flex-wrap mt-0.5 tabular-nums">
                        <span>{supra.tierLabel}</span>
                        <span aria-hidden="true">·</span>
                        <span>Mean Weight w={supra.meanSynapticWeight.toFixed(2)} (Base Directive w=8)</span>
                        <span aria-hidden="true">·</span>
                        <span>Fidelity {(supra.fidelityPermille / 10).toFixed(1)}%</span>
                        <span aria-hidden="true">·</span>
                        <span>Quality {(supra.qualityPermille / 10).toFixed(1)}%</span>
                        <span aria-hidden="true">·</span>
                        <span>Definition {supra.definitionSubdiv} Subdiv</span>
                        <span aria-hidden="true">·</span>
                        <span>Features +{supra.unlockedFeatureCount}</span>
                      </div>
                    </div>
                    <div className="text-xs font-mono text-teal-200 tabular-nums">
                      Bus Coherence {(supra.theoryOfMindCoherencePermille / 10).toFixed(1)}% · {obs.connectedBusModules.length} Connected Modules
                    </div>
                  </div>

                  <div className="rounded-md border border-emerald-400/15 bg-[#081510] p-2.5 space-y-1">
                    <div className="text-[11px] font-mono text-amber-200 flex items-center gap-2 flex-wrap tabular-nums">
                      <span>Bus Packet {why.packetId}</span>
                      <span aria-hidden="true">·</span>
                      <span>Source: {why.sourcePart}</span>
                      <span aria-hidden="true">·</span>
                      <span>Target Bottleneck: {why.bottleneckPart}</span>
                      <span aria-hidden="true">·</span>
                      <span>Inferred Intent: {why.inferredPlayerIntent.replace(/-/g, ' ')}</span>
                    </div>
                    <div className="text-xs text-emerald-50 leading-snug">
                      <span className="font-semibold text-amber-100">Why: </span>
                      {why.whyRationale}
                    </div>
                    <div className="text-[11px] text-emerald-200/85 leading-snug">
                      <span className="font-semibold text-teal-200">How Parts Improve: </span>
                      {why.howPartsImproveMechanism} ({why.inferredPlayerAffectSummary})
                    </div>
                  </div>
                </div>

                {/* Section 2: Compile-Time (5) & Runtime Procedural Model Synthesis */}
                <div className="rounded-lg border border-emerald-400/20 bg-[#0c1d17] p-3.5 space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold text-amber-100">
                      Procedural Model Synthesis ({supra.compileTimeModels.length} Compile-Time ·{' '}
                      {supra.runtimeSynthesizedModels.length} Runtime)
                    </h3>
                    <div className="text-xs font-mono text-emerald-300/85 tabular-nums">
                      Active Sanctuary Crown: {supra.activeModel.modelName} ({supra.activeModel.origin})
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {allModels.slice(0, 6).map((mdl) => {
                      const isActiveModel = mdl.modelId === supra.activeModel.modelId;
                      return (
                        <div
                          key={mdl.modelId}
                          className={`rounded-md border p-2.5 flex items-center justify-between gap-2.5 ${
                            isActiveModel
                              ? 'border-amber-300/45 bg-emerald-950/80'
                              : 'border-emerald-400/15 bg-[#081510]'
                          }`}
                        >
                          <div className="min-w-0 space-y-0.5">
                            <div className="text-xs font-semibold text-amber-100 truncate">
                              {mdl.modelName}
                            </div>
                            <div className="text-[11px] font-mono text-teal-200/85 flex items-center gap-1.5 flex-wrap tabular-nums">
                              <span>{mdl.origin}</span>
                              <span aria-hidden="true">·</span>
                              <span>w={mdl.synapticWeight}</span>
                              <span aria-hidden="true">·</span>
                              <span>{mdl.radialSubdivisions} seg</span>
                              <span aria-hidden="true">·</span>
                              <span>{mdl.harmonicCrownPetals} ribs</span>
                              <span aria-hidden="true">·</span>
                              <span>{mdl.uorPointKeyHex}</span>
                            </div>
                            <div className="text-[11px] text-emerald-200/75 truncate">
                              {mdl.whySynthesized}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              soundEngine.setPaused(false);
                              soundEngine.playSynthesizedObserverModelAudition(mdl, atmosphere);
                            }}
                            aria-label={`Audition Model ${mdl.modelName}`}
                            className="px-2.5 py-1.5 rounded border border-amber-300/35 bg-emerald-950 hover:bg-emerald-900 text-amber-200 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                          >
                            Audition Model
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Section 3: All 11 Self-Known Observer Parts (Player User + 10 Prism Domains) */}
                <div className="rounded-lg border border-emerald-400/20 bg-[#0c1d17] p-3.5 space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold text-amber-100">
                      11 Unified Observer Parts (Environment, Garden &amp; Player User)
                    </h3>
                    <div className="text-xs font-mono text-emerald-300/80 tabular-nums">
                      {allParts.filter((p) => p.exceedsBaseDirective).length} / {allParts.length} Parts Above Base Directive (w &gt; 8)
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {allParts.map((part) => {
                      const niche = diffExt.diversification.partNiches[part.partId];
                      return (
                        <div
                          key={part.partId}
                          className="rounded border border-emerald-400/15 bg-[#081510] px-2.5 py-2 space-y-0.5"
                        >
                          <div className="flex items-center justify-between gap-2 text-xs">
                            <span className="font-semibold text-emerald-50 truncate">{part.label}</span>
                            <span className="font-mono text-amber-200 tabular-nums whitespace-nowrap">
                              p={niche.basisPrime} · N#{niche.nicheIndex} · w={part.synapticWeight}
                            </span>
                          </div>
                          <div className="text-[11px] text-teal-200/90 truncate">
                            {niche.nicheArchetypeTitle} — {niche.specializedResolutionFeature}
                          </div>
                          <div className="text-[11px] text-emerald-200/75 truncate">
                            Diversifies: {niche.howPartDiversifies}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Section 4: Rule-30 Deterministic Regular Diagonals vs. Non-Deterministic Withdrawn Core (`afflom/rule30`) */}
                <div className="rounded-lg border border-emerald-400/20 bg-[#0c1d17] p-3.5 space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold text-amber-100">
                      Rule-30 Deterministic &amp; Non-Deterministic Horizon ({r30.referenceArchitecture})
                    </h3>
                    <div className="text-xs font-mono text-teal-200 tabular-nums">
                      Stage: {r30.activeEngineStage} · Strategy: {r30.activePortfolioStrategy} · Entropy:{' '}
                      {r30.playerEncounterEntropyBits.toFixed(2)} bits
                    </div>
                  </div>

                  <div className="text-xs text-emerald-100/85 flex items-center gap-1.5 flex-wrap tabular-nums">
                    <span>Real Kernel: {r30.quadruple.realObject}</span>
                    <span aria-hidden="true">·</span>
                    <span>Sensual Regular Side: {r30.quadruple.sensualObject} (2^d Doubling Law)</span>
                    <span aria-hidden="true">·</span>
                    <span>Withdrawn Core: {r30.quadruple.withdrawnCore} (Index {r30.aperiodicCompensationIndex})</span>
                    <span aria-hidden="true">·</span>
                    <span>
                      Hypotheses: {r30.provedCount} Proved / {r30.refutedCount} Refuted / {r30.openHypothesesCount} Open
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                    {r30.hypothesesLedger.map((hyp) => (
                      <div
                        key={hyp.hypothesisId}
                        className="rounded border border-emerald-400/15 bg-[#081510] p-2 space-y-0.5"
                      >
                        <div className="text-[11px] font-mono text-amber-200 flex items-center justify-between gap-1">
                          <span>{hyp.hypothesisId}</span>
                          <span>{hyp.status}</span>
                        </div>
                        <div className="text-[11px] text-emerald-100/85 leading-snug">{hyp.statement}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}

          {activeTab === 'ethos' && (
            <div className="space-y-2.5">
              {/* Conservatory Brand Identity & Chromatic Contrast Standard */}
              <div className="rounded-lg border border-emerald-400/20 bg-[#0c1d17] p-3 space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div>
                    <div className="text-[10px] font-mono text-amber-200/85 uppercase tracking-wider">
                      CONSERVATORY BRAND & CHROMATIC SYSTEM
                    </div>
                    <div className="text-sm font-semibold text-amber-100">
                      {VERDANT_BRAND_STANDARD.brandName} · {VERDANT_BRAND_STANDARD.conservatorySubtitle}
                    </div>
                  </div>
                  <div className="text-[11px] font-mono text-emerald-300/85">
                    {VERDANT_BRAND_STANDARD.typography.displayFamily} ·{' '}
                    {VERDANT_BRAND_STANDARD.typography.sansFamily} ·{' '}
                    {VERDANT_BRAND_STANDARD.typography.monoFamily}
                  </div>
                </div>

                <p className="text-xs text-emerald-100/85 leading-relaxed">
                  {VERDANT_BRAND_STANDARD.manifesto}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {VERDANT_BRAND_STANDARD.chromaticPalette.map((tok) => (
                    <div
                      key={tok.tokenName}
                      className="rounded border border-emerald-400/15 bg-[#081510] p-2 flex items-center gap-2.5"
                    >
                      <span
                        className="w-6 h-6 rounded border border-white/20 shrink-0"
                        style={{ backgroundColor: tok.hexValue }}
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-emerald-50 truncate">{tok.tokenName}</div>
                        <div className="text-[10px] font-mono text-amber-200/85 tabular-nums">
                          {tok.hexValue} · {tok.contrastRatio}:1 ({tok.wcagTier})
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3-Column Humane Design, Botanical Morphology & Zero-Allocation Architecture */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="rounded-lg border border-emerald-400/20 bg-[#0c1d17] p-3 space-y-1">
                  <div className="text-[10px] font-mono text-teal-300 uppercase tracking-wider">
                    HUMANE-CENTERED DESIGN
                  </div>
                  <div className="text-xs font-semibold text-emerald-50">
                    Restorative Score: {humaneEval.restorativeScore}% · {humaneEval.pacingState}
                  </div>
                  <div className="text-[11px] text-emerald-200/80 space-y-0.5">
                    <div>• Open 3D Viewport: {humaneEval.openViewportPct}% (collapsible to 93%)</div>
                    <div>• Zero Violence, Timers & Dark Patterns</div>
                    <div>• 3.6m Blossom Framing & Guided Trail [G]</div>
                  </div>
                </div>

                <div className="rounded-lg border border-emerald-400/20 bg-[#0c1d17] p-3 space-y-1">
                  <div className="text-[10px] font-mono text-emerald-300 uppercase tracking-wider">
                    BOTANICAL MORPHOLOGY & MONUMENTS
                  </div>
                  <div className="text-xs font-semibold text-emerald-50">
                    {VERDANT_BOTANICAL_STANDARD.goldenAngleDeg}° Phyllotaxis ·{' '}
                    {VERDANT_BOTANICAL_STANDARD.monumentCount} Monuments
                  </div>
                  <div className="text-[11px] text-emerald-200/80 space-y-0.5">
                    <div>
                      • {VERDANT_BOTANICAL_STANDARD.minPartsPerSpecimen}–{VERDANT_BOTANICAL_STANDARD.maxPartsPerSpecimen}{' '}
                      Composite PBR Parts / Specimen
                    </div>
                    <div>
                      • Clearcoat Petals (r={VERDANT_BOTANICAL_STANDARD.glossyPetalRoughness}) vs Stems (r=
                      {VERDANT_BOTANICAL_STANDARD.matteStemRoughness})
                    </div>
                    <div>
                      • {VERDANT_BOTANICAL_STANDARD.crossPollinationRadiusMeters}m Cross-Pollination Filaments &{' '}
                      {VERDANT_ECOLOGY_STANDARD.beamHeightMeters}m Constellation Beams
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-emerald-400/20 bg-[#0c1d17] p-3 space-y-1">
                  <div className="text-[10px] font-mono text-amber-200 uppercase tracking-wider">
                    ZERO-DRONE ACOUSTICS & GESTURE CONTRAST
                  </div>
                  <div className="text-xs font-semibold text-emerald-50">
                    {VERDANT_INFRASTRUCTURE_STANDARD.continuousDroneGainMilli}.0 Continuous Drone · [T] 3ms Pluck vs [Space] 220ms 6-Voice Choir
                  </div>
                  <div className="text-[11px] text-emerald-200/80 space-y-0.5">
                    <div>
                      • [T] Touch: 3ms Upper-Harmonic Strike (2x/3x) + 9.5Hz Elastic Shiver
                    </div>
                    <div>
                      • [Space] Attune: 220ms 6-Voice Choir + 3-Neighbor 14m Cross-Pollination
                    </div>
                    <div>
                      • [C] Stillness: 650ms Breath Swell → Silence · {SYMBIOTIC_GUILDS.length} Symbiotic Guilds
                    </div>
                  </div>
                </div>
              </div>

              {/* Environmental Physics & Mycelial Neuromorphic Synthesis Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="rounded-lg border border-emerald-400/20 bg-[#0c1d17] p-3 space-y-1.5">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="text-[10px] font-mono text-teal-300 uppercase tracking-wider">
                      ENVIRONMENTAL PHYSICS · SOLID VS. PERMEABLE
                    </div>
                    <div className="text-[10px] font-mono text-amber-200">
                      {telemetry.surfaceMaterial.replace('-', ' ')}
                      {telemetry.inWater ? ` · ${Math.round(telemetry.waterDepthMeters * 100)}cm (76% Drag)` : ''}
                    </div>
                  </div>
                  <div className="text-[11px] text-emerald-100/85 leading-snug">
                    Solid ({VERDANT_PHYSICS_STANDARD.solidColliderClasses} Classes): Monument Columns, 64 Bamboo/Quartz
                    Stalks (r=0.28m), 52 Boulders (r=2.5m), Stem Cores (r=0.34m). Permeable ({VERDANT_PHYSICS_STANDARD.permeableMediaCatalog.length} Media): 360 Grass/Reed Blades (1.85m Hooke Wake), Mirror Lagoon Water, Moss &amp; Lotus Pads.
                  </div>
                </div>

                <div className="rounded-lg border border-amber-400/25 bg-[#0c1d17] p-3 space-y-1.5">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="text-[10px] font-mono text-amber-200 uppercase tracking-wider">
                      MYCELIAL NEUROMORPHIC SYNTHESIS ({VERDANT_NEUROMORPHIC_STANDARD.lutStack.headerMagic})
                    </div>
                    <div className="text-[10px] font-mono text-emerald-300">
                      Weight w={telemetry.neuromorphic.lastActiveSynapticWeight}/{VERDANT_NEUROMORPHIC_STANDARD.plasticity.weightMax} · Seedlings: {telemetry.neuromorphic.emergentSeedlingsMinted}/{VERDANT_NEUROMORPHIC_STANDARD.lutStack.maxEmergentSeedlings}
                    </div>
                  </div>
                  <div className="text-[11px] text-emerald-100/90 leading-snug">
                    Rule-{VERDANT_NEUROMORPHIC_STANDARD.cellularAutomaton.ruleNumber} Cellular Register + Bounded Hebbian Plasticity ([{VERDANT_NEUROMORPHIC_STANDARD.plasticity.weightMin}..{VERDANT_NEUROMORPHIC_STANDARD.plasticity.weightMax}]) + PrimeAddress GCD Sieve ({telemetry.neuromorphic.lastPrimeAddress} · GCD {telemetry.neuromorphic.lastKinshipGcd}) + 28-bit PointKey ({telemetry.neuromorphic.lastPointKeyHex}).
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-0.5 flex-wrap">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {scheduleNeuromorphicStrategies(
                        NEUROMORPHIC_FAMILIES[telemetry.biome],
                        telemetry.neuromorphic.hebbianTable,
                      )
                        .slice(0, 2)
                        .map((st) => (
                          <span
                            key={st.id}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#081510] border border-emerald-400/20 text-amber-100"
                          >
                            {st.label.split(' ')[0]}: w={st.weight}
                          </span>
                        ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.setPaused(false);
                        soundEngine.playNeuromorphicCounterpoint({
                          biome: telemetry.biome,
                          kinshipSpecies: telemetry.nearestPlant.species,
                          counterpointRatios: telemetry.neuromorphic.synthesizedCounterpointRatios,
                          synapticWeight: telemetry.neuromorphic.lastActiveSynapticWeight,
                          strategy: telemetry.neuromorphic.lastScheduledStrategy,
                          atmosphere,
                          delayOffsetSec: 0.02,
                          isSeedlingGermination: telemetry.neuromorphic.pointKeyGateAdmitted,
                        });
                      }}
                      className="px-2.5 py-1 rounded bg-amber-300 hover:bg-amber-200 text-slate-950 font-semibold text-[10px] transition-colors cursor-pointer"
                    >
                      Audition Live Synthesis
                    </button>
                  </div>
                </div>
              </div>

              {/* 6-Tier Closed-Loop Granular Atomic-to-Environmental Procedural Synthesis & High-Definition B-Mesh Graphics */}
              {(() => {
                const liveGranular = evaluateGranularMatterSynthesis({
                  biome: telemetry.biome,
                  species: telemetry.nearestPlant.species,
                  atmosphere,
                  attuned: telemetry.nearestPlant.attuned,
                  harmonyPct: telemetry.harmony,
                  neuromorphicWeight: telemetry.neuromorphic.lastActiveSynapticWeight,
                });
                const liveHdMesh = evaluateHighDefinitionVisualSynthesis({
                  biome: telemetry.biome,
                  species: telemetry.nearestPlant.species,
                  substrate: telemetry.nearestPlant.substrate ?? 'terrestrial-loam',
                  atmosphere,
                  attuned: telemetry.nearestPlant.attuned,
                  lifecycleStage: getPlantLifecycleStage(telemetry.nearestPlant),
                });
                return (
                  <div className="rounded-lg border border-emerald-400/25 bg-[#0c1d17] p-3 space-y-2">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="text-[10px] font-mono text-emerald-300 uppercase tracking-wider">
                        6-STAGE GRANULAR SYNTHESIS &amp; BLENDER-GRADE PARAMETRIC B-MESH GRAPHICS ({VERDANT_ECOLOGY_STANDARD.profile} · {VERDANT_BOTANICAL_STANDARD.highDefinitionBMesh.parametricBMeshBuildersCount} B-Meshes · {VERDANT_ARTICULATION_STANDARD.kinematicRig.kinematicJointsPerSpecimen}-Joint Rig)
                      </div>
                      <div className="text-[10px] font-mono text-amber-200 tabular-nums">
                        T1:{liveGranular.tier1AtomicValenceIndex} &lt; T2:{liveGranular.tier2MolecularBondIndex} &lt; T3:{liveGranular.tier3MacromolecularPolymerIndex} &lt; T4:{liveGranular.tier4CompoundManifestationIndex} &lt; T5:{liveGranular.tier5EnvironmentalModalIndex} &lt; T6:{liveGranular.tier6AtomicRemineralizationIndex} · Mesh: {liveHdMesh.radialSegments}x{liveHdMesh.longitudinalSegments} B-Spline ({VERDANT_BOTANICAL_STANDARD.highDefinitionBMesh.sobelNormalMapResolutionPx}px Sobel Normal) · Thin-Film: {liveHdMesh.iridescenceThinFilmMinNm}–{liveHdMesh.iridescenceThinFilmMaxNm}nm (IOR {liveHdMesh.iridescenceIor})
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                      {Object.values(REACTION_PATHWAYS).map((pw) => (
                        <div
                          key={pw.id}
                          className="rounded border border-emerald-400/15 bg-[#081510] p-2 space-y-0.5"
                        >
                          <div className="font-semibold text-amber-100 truncate">{pw.name}</div>
                          <div className="font-mono text-emerald-300/85 truncate">{pw.chemicalEquation}</div>
                          <div className="font-mono text-teal-200/80 tabular-nums">
                            Rate: {Math.round(liveGranular.reactionKinetics.pathwayRates[pw.id] * 100)}% · Yield: {Math.round(pw.quantumOrThermalYield * 100)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
