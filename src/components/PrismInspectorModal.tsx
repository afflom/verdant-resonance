import React, { useState } from 'react';
import {
  ATMOSPHERE_CONFIGS,
  AtmosphereId,
  BIOME_CONFIGS,
  BiomeId,
  ChorusStateId,
  PLANT_SPECIES_CONFIGS,
  PlantSpeciesId,
  PlayerActionId,
  SOUND_OUTCOME_PROFILES,
  SoundscapeOutcome,
  VERDANT_BRAND_STANDARD,
  VERDANT_INFRASTRUCTURE_STANDARD,
  computeEcologicalAffinity,
  computeSynthesisEnvelope,
  evaluateHumaneErgonomics,
  evaluatePrismRequest,
  formatPrismRequest,
  GardenPlantInstance,
} from '../game/prismModel';
import { BotanicalSoundscapeEngine } from '../game/soundscapeEngine';
import { LiveTelemetryState } from './GardenCanvas';
import { PlantSpeciesIcon } from './BotanicalIcons';

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
}) => {
  const [activeTab, setActiveTab] = useState<
    'herbarium' | 'biomes' | 'harmonies' | 'soundboard' | 'ethos'
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
  const sbEvaluation = evaluatePrismRequest(sbRequest);
  const sbOutcome = (sbEvaluation.valid ? sbEvaluation.outcome : 'wind-whisper') as SoundscapeOutcome;
  const sbOutcomeProfile = SOUND_OUTCOME_PROFILES[sbOutcome];
  const sbSynthPlan = computeSynthesisEnvelope(sbOutcome, sbBiome, sbAtmosphere);
  const sbAffinity = computeEcologicalAffinity(sbBiome, sbPlant, sbAtmosphere);

  const humaneEval = evaluateHumaneErgonomics({
    velocityDm: telemetry.velocityDm,
    dockCollapsed: false,
    guidedStroll: telemetry.guidedStroll,
    harmonyPct: telemetry.harmony,
  });

  const speciesList = Object.values(PLANT_SPECIES_CONFIGS);
  const biomeList = Object.values(BIOME_CONFIGS);
  const atmosphereList = Object.values(ATMOSPHERE_CONFIGS);
  const outcomeList = Object.values(SOUND_OUTCOME_PROFILES);

  const handleAuditionSpecies = (speciesId: PlantSpeciesId) => {
    const spCfg = PLANT_SPECIES_CONFIGS[speciesId];
    const req = formatPrismRequest({
      biome: spCfg.nativeBiome,
      plant: speciesId,
      action: speciesId === 'star-orchid' ? 'touch' : 'observe',
      atmosphere: spCfg.diurnalAffinity,
      chorus: 'awakened',
      proximity: 12,
      velocity: 6,
    });
    const ev = evaluatePrismRequest(req);
    const out = (ev.valid ? ev.outcome : 'melodic-chime') as SoundscapeOutcome;
    soundEngine.setPaused(false);
    soundEngine.playOutcomeMotif(out, spCfg.nativeBiome, 1.0, spCfg.diurnalAffinity);
  };

  const handleAuditionOutcome = (outcomeId: SoundscapeOutcome) => {
    soundEngine.setPaused(false);
    soundEngine.playOutcomeMotif(outcomeId, telemetry.biome, 1.0, atmosphere);
  };

  const handlePlaySoundboard = () => {
    soundEngine.setPaused(false);
    soundEngine.playOutcomeMotif(sbOutcome, sbBiome, 1.0, sbAtmosphere);
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-4 md:p-6 pointer-events-auto"
      style={{ backgroundColor: 'rgba(5, 13, 10, 0.86)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-heading"
    >
      <div className="w-full max-w-4xl rounded-xl border border-emerald-400/25 bg-[#0a1914] p-5 md:p-6 shadow-2xl text-emerald-50 max-h-[92vh] flex flex-col justify-between">
        {/* Top Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-emerald-400/15 pb-3">
          <div>
            <p className="text-[11px] font-mono tracking-wider text-emerald-300/80 uppercase">
              {mode === 'gameover'
                ? 'SANCTUARY ATTUNEMENT COMPLETE · HARMONIC EQUILIBRIUM'
                : 'CONSERVATORY FIELD GUIDE · ACOUSTIC HERBARIUM & ETHOS'}
            </p>
            <h2
              id="modal-heading"
              className="font-display text-2xl md:text-3xl font-semibold text-amber-100 mt-0.5"
            >
              {mode === 'gameover'
                ? 'Verdant Harmony Achieved'
                : 'Sanctuary Herbarium & Soundscape Atlas'}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {mode === 'paused' && (
              <button
                type="button"
                onClick={onResume}
                className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Resume Garden
              </button>
            )}
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
              {BIOME_CONFIGS[telemetry.biome].tuningLabel} · 0.0¢
            </div>
          </div>
        </div>

        {/* Interactive Filter Tabs + Diurnal Sky Switcher */}
        <div className="flex items-center justify-between gap-2 mb-2.5 flex-wrap">
          <div className="flex items-center gap-1 p-1 rounded-lg bg-[#07120e] border border-emerald-500/15 flex-wrap">
            <button
              type="button"
              onClick={() => setActiveTab('herbarium')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
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
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
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
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
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
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'soundboard'
                  ? 'bg-emerald-500/25 text-amber-100 border border-emerald-400/30'
                  : 'text-emerald-300/70 hover:text-emerald-100'
              }`}
            >
              Harmonic Soundboard
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ethos')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'ethos'
                  ? 'bg-emerald-500/25 text-amber-100 border border-emerald-400/30'
                  : 'text-emerald-300/70 hover:text-emerald-100'
              }`}
            >
              Sanctuary Ethos & Design
            </button>
          </div>

          {/* Diurnal Sky Quick Switcher */}
          <div className="flex items-center gap-1">
            {atmosphereList.map((atm) => (
              <button
                key={atm.id}
                type="button"
                onClick={() => {
                  onSelectAtmosphere(atm.id);
                  setSbAtmosphere(atm.id);
                }}
                className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  atmosphere === atm.id
                    ? 'bg-teal-500/30 text-amber-200 border border-teal-400/40'
                    : 'text-emerald-300/70 hover:text-emerald-100 bg-[#07120e]'
                }`}
              >
                {atm.name}
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
                        <div className="flex items-center gap-2 whitespace-nowrap overflow-hidden">
                          <span className="text-sm font-semibold text-amber-100">{sp.name}</span>
                          <span className="text-xs italic text-emerald-300/75">{sp.latinName}</span>
                          <span aria-hidden="true" className="text-emerald-400/40">·</span>
                          <span className="text-xs font-mono text-emerald-200/85 tabular-nums">
                            {attunedOfSpecies}/{totalOfSpecies} attuned
                          </span>
                          <span aria-hidden="true" className="text-emerald-400/40">·</span>
                          <span className="text-[11px] font-mono text-amber-200/80">
                            {nativeBiomeCfg.name} · {skyCfg.name}
                          </span>
                        </div>
                        <div className="text-xs text-emerald-100/80 truncate mt-0.5">{sp.description}</div>
                        <div className="text-[11px] font-mono text-teal-300/80 truncate">
                          {sp.acousticRole} · {sp.harmonicInterval}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAuditionSpecies(sp.id)}
                      className="px-3 py-1.5 rounded-md border border-amber-300/35 bg-emerald-950 hover:bg-emerald-900 text-amber-200 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Listen to Motif
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'biomes' && (
            <div className="space-y-1.5">
              {biomeList.map((b) => {
                const isVisited = telemetry.exploredBiomes.includes(b.id);
                const sigSpecies = PLANT_SPECIES_CONFIGS[b.signatureSpecies];
                return (
                  <div
                    key={b.id}
                    className="rounded-lg border border-emerald-400/15 bg-[#0c1d17] px-4 py-2.5 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-amber-100">{b.name}</span>
                        <span aria-hidden="true" className="text-emerald-400/40">·</span>
                        <span className="text-xs text-emerald-200/80">{b.subtitle}</span>
                        <span aria-hidden="true" className="text-emerald-400/40">·</span>
                        <span className="text-xs font-mono text-teal-300">
                          {isVisited ? 'Explored' : 'Unvisited'}
                        </span>
                      </div>
                      <div className="text-xs font-mono text-emerald-300/80 mt-0.5">
                        Tuning: {b.tuningLabel} · Signature Flora: {sigSpecies.name} · Ratios:{' '}
                        {b.scaleRatios.map((r) => r.toFixed(2)).join(' : ')}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onTeleportBiome(b.id);
                        onResume();
                      }}
                      className="px-3.5 py-1.5 rounded-md bg-emerald-500/25 hover:bg-emerald-500/40 border border-emerald-400/35 text-emerald-100 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Travel Here
                    </button>
                  </div>
                );
              })}
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
                synthesizes 4-partial Just Intonation voices across biome tuning, flora species, gesture,
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
                    <span className="text-emerald-300">0.0¢ Just Intonation</span>
                  </div>
                  <div className="text-xs text-emerald-100/90">{sbEvaluation.ruleDescription}</div>
                  <div className="text-[11px] font-mono text-teal-300/85 flex items-center gap-2 flex-wrap">
                    <span>
                      Carriers: {sbSynthPlan.frequenciesHz.map((f) => `${Math.round(f)}Hz`).join(' · ')}
                    </span>
                    <span>·</span>
                    <span>
                      Overtones: {sbSynthPlan.overtoneFrequenciesHz.slice(0, 3).map((f) => `${Math.round(f)}Hz`).join(' · ')}
                    </span>
                    <span>·</span>
                    <span>Reverb: {Math.round(sbSynthPlan.reverbSendGain * 100)}% (2.2s)</span>
                    <span>·</span>
                    <span className="capitalize">Affinity: {sbAffinity.affinityTier.replace('-', ' ')}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handlePlaySoundboard}
                  className="px-4 py-2.5 rounded-lg bg-amber-300 hover:bg-amber-200 text-slate-950 font-semibold text-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Play Resonance Chord
                </button>
              </div>
            </div>
          )}

          {activeTab === 'ethos' && (
            <div className="space-y-3">
              {/* Conservatory Brand Identity & Chromatic Contrast Standard */}
              <div className="rounded-lg border border-emerald-400/20 bg-[#0c1d17] p-3.5 space-y-2.5">
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

              {/* Humane-Centered Design & Acoustic/Runtime Architecture */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-lg border border-emerald-400/20 bg-[#0c1d17] p-3.5 space-y-1.5">
                  <div className="text-[10px] font-mono text-teal-300 uppercase tracking-wider">
                    HUMANE-CENTERED DESIGN & CALM VIEWPORT
                  </div>
                  <div className="text-sm font-semibold text-emerald-50">
                    Restorative Score: {humaneEval.restorativeScore}% · {humaneEval.pacingState}
                  </div>
                  <div className="text-xs text-emerald-200/80 space-y-1">
                    <div>
                      • Unobstructed 3D Sanctuary Viewport: {humaneEval.openViewportPct}% (collapsible to
                      93%)
                    </div>
                    <div>
                      • Zero Violence, Zero Punitive Timers & Zero Dark Patterns Guaranteed
                    </div>
                    <div>
                      • Comfortable 3.6m Blossom Framing & Hands-Free Guided Trail Stroll [G]
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-emerald-400/20 bg-[#0c1d17] p-3.5 space-y-1.5">
                  <div className="text-[10px] font-mono text-amber-200 uppercase tracking-wider">
                    PSYCHOACOUSTICS & ZERO-ALLOCATION ARCHITECTURE
                  </div>
                  <div className="text-sm font-semibold text-emerald-50">
                    {VERDANT_INFRASTRUCTURE_STANDARD.partialsPerVoice}-Partial Voices ·{' '}
                    {VERDANT_INFRASTRUCTURE_STANDARD.stereoReverbDecaySec}s Stereo Sanctuary Reverb
                  </div>
                  <div className="text-xs text-emerald-200/80 space-y-1">
                    <div>
                      • 5-Limit & 7-Limit Just Intonation (0.0¢) + Binaural Gaze Panning
                    </div>
                    <div>
                      • Pooled Ring Buffers: {VERDANT_INFRASTRUCTURE_STANDARD.sporeRingBufferCapacity}{' '}
                      Spores, {VERDANT_INFRASTRUCTURE_STANDARD.instancedMeshTotal} Instanced Landmarks
                    </div>
                    <div>
                      • Per-Frame Heap Allocations: {VERDANT_INFRASTRUCTURE_STANDARD.perFrameHeapAllocations}{' '}
                      · Headroom Ceiling: {VERDANT_INFRASTRUCTURE_STANDARD.masterGainHeadroomDb} dB
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
