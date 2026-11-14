import React, { useState } from 'react';
import {
  ATMOSPHERE_CONFIGS,
  AtmosphereId,
  BIOME_CONFIGS,
  BiomeId,
  BOTANICAL_LIFECYCLE_STAGES,
  PLANT_SPECIES_CONFIGS,
  PlantSpeciesId,
  SOUND_OUTCOME_PROFILES,
  SOLIPSISTIC_RULE30_CEILING_PERMILLE,
  SPECIES_ARTICULATION_PROFILES,
  SoundscapeOutcome,
  VERDANT_BRAND_STANDARD,
  VERDANT_TELEOLOGICAL_PHENOMENA,
  evaluateBiomeMasteryAndGuilds,
  evaluateUniversal5WhOntologyCatalog,
  evaluateVerdantAutonomousKpis,
  evaluateVerdantTeleologySynthesis,
  GardenPlantInstance,
  getPlantLifecycleStage,
  Ontological5WhNodeExplanation,
  synthesizeParametricAtmosphereConfigs,
  synthesizeParametricBiomeConfigs,
  synthesizeParametricSoundOutcomeProfiles,
} from '../game/prismModel';
import {
  CERTIFIED_PRODUCTION_MANIFEST,
  certifiedWasmCoreCallCount,
  certifiedWasmTotalWork,
} from '../game/generatedCertifiedWasmBridge';
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

const SPECIES_PHENOMENON_ID: Readonly<Record<PlantSpeciesId, string>> = {
  'chime-lily': 'flora-chime-lily',
  'pulse-fern': 'flora-pulse-fern',
  'echo-lotus': 'flora-echo-lotus',
  'drone-moss': 'flora-drone-moss',
  'star-orchid': 'flora-star-orchid',
};

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
    'herbarium' | 'biomes' | 'harmonies' | 'ethos' | 'ontology'
  >('herbarium');
  const [ontologyFilter, setOntologyFilter] = useState<
    'causal-stratum' | 'prime-atom' | 'world-phenomenon' | 'lexlean-structure'
  >('causal-stratum');

  const cosmoParams = {
    alphaSeed: telemetry.neuromorphic.observer.cosmogenesis.alphaSeed,
    manifold: telemetry.neuromorphic.universalManifold,
  };
  const liveAtmosphereConfigs = synthesizeParametricAtmosphereConfigs(cosmoParams);
  const liveOutcomeProfiles = synthesizeParametricSoundOutcomeProfiles(cosmoParams);
  const liveBiomeConfigs = synthesizeParametricBiomeConfigs(cosmoParams);
  const teleologyReport = evaluateVerdantTeleologySynthesis(
    telemetry.neuromorphic.lastActiveSynapticWeight,
  );
  const kpiScorecard = evaluateVerdantAutonomousKpis({
    busWeight: telemetry.neuromorphic.lastActiveSynapticWeight,
    harmonyPct: telemetry.harmony,
    velocityDm: telemetry.velocityDm,
    isStillness:
      telemetry.action === 'stillness' || telemetry.gestureHold.heldGesture === 'stillness',
    hasFocalTarget: Boolean(telemetry.nearestPlant),
    focalTargetAttuned: Boolean(telemetry.nearestPlant?.attuned),
    nearestFeatureDistanceM: telemetry.distanceMeters,
    restStepCount: telemetry.soundtrackScore.restStepCount,
    activeVoiceCount: telemetry.environmentalLifecycle.activeStemsCount,
    exploredBiomesCount: telemetry.exploredBiomes.length,
  });
  const rec = kpiScorecard.reconciliation;
  const ontologyReport = evaluateUniversal5WhOntologyCatalog(
    {
      logicalCores: typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 4 : 4,
      frameBudgetMicros: 16667,
      observedFrameMicros: 8500,
    },
    {
      stillnessRatioPermille:
        telemetry.action === 'stillness' ? 900 : Math.max(0, Math.round((1 - telemetry.velocityDm / 30) * 750)),
      gazeDwellRatioPermille: telemetry.nearestPlant ? 780 : 320,
      harmonicComfortPermille: Math.round(telemetry.soundtrackScore.curatedConsonancePurity01 * 1000),
      activePresence: true,
    },
    telemetry.liveCoEvolution.ontologicalTelos.coordinates,
    telemetry.liveCoEvolution.incumbentDissonancePermille,
  );
  const filteredOntologyNodes: readonly Ontological5WhNodeExplanation[] =
    ontologyFilter === 'causal-stratum'
      ? ontologyReport.causalStratumNodes
      : ontologyFilter === 'prime-atom'
        ? ontologyReport.primeAtomNodes
        : ontologyFilter === 'world-phenomenon'
          ? ontologyReport.worldPhenomenonNodes
          : ontologyReport.structureNodes;

  const speciesList = Object.values(PLANT_SPECIES_CONFIGS);
  const biomeList = Object.values(liveBiomeConfigs);
  const atmosphereList = Object.values(liveAtmosphereConfigs);
  const outcomeList = Object.values(liveOutcomeProfiles);

  const conservatoryEcosystemFeatures = VERDANT_TELEOLOGICAL_PHENOMENA.filter(
    (p) =>
      p.category === 'traversal-substrate' ||
      p.category === 'ecological-phenomenon' ||
      p.category === 'embodied-witness',
  );

  const handleAuditionSpecies = (speciesId: PlantSpeciesId) => {
    const spCfg = PLANT_SPECIES_CONFIGS[speciesId];
    soundEngine.playSpeciesAudition(speciesId, spCfg.nativeBiome, spCfg.diurnalAffinity, true);
  };

  const handleAuditionOutcome = (outcomeId: SoundscapeOutcome) => {
    soundEngine.playOutcomeMotif(
      outcomeId,
      telemetry.biome,
      1.0,
      atmosphere,
      0,
      telemetry.nearestPlant.species,
      'terrestrial-loam',
      true,
    );
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
        className="w-full max-w-[1040px] border p-5 md:p-6 shadow-2xl text-emerald-50 max-h-[90vh] flex flex-col justify-between"
        style={{
          backgroundColor: 'var(--prism-modal-bg, #0a1914)',
          borderColor: 'var(--prism-border-hairline, rgba(110, 231, 183, 0.25))',
          borderRadius: 'var(--prism-radius-outer, 16px)',
        }}
      >
        {/* Top Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-emerald-400/15 pb-3.5">
          <div>
            <p className="text-[11px] font-mono tracking-wider text-emerald-300/80 uppercase">
              {mode === 'gameover'
                ? telemetry.gestureHold.agitationPct >= 100
                  ? 'RESTORATIVE STILLNESS INTERLUDE · UNHURRIED PACING'
                  : 'SANCTUARY ATTUNEMENT COMPLETE · LIVING HARMONY'
                : 'CONSERVATORY FIELD GUIDE · LIVING FLORA & LANDMARKS'}
            </p>
            <h2
              id="modal-heading"
              className="font-display text-2xl md:text-3xl font-semibold text-amber-100 mt-0.5"
            >
              {mode === 'gameover'
                ? telemetry.gestureHold.agitationPct >= 100
                  ? 'Pause, Breathe & Return to Stillness'
                  : 'Verdant Harmony Flourishing'
                : 'Sanctuary Herbarium & Landmark Atlas'}
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
              {mode === 'gameover' ? 'Explore Anew' : 'Reset Garden'}
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

        {/* 3 Calm Sanctuary Summary Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3">
          <div className="rounded-lg border border-emerald-400/15 bg-[#0d211b] px-4 py-2.5">
            <div className="text-[10px] font-mono text-emerald-300/75 uppercase">
              GARDEN HARMONY
            </div>
            <div className="text-xl font-mono font-semibold text-amber-200 tabular-nums">
              {Math.round(telemetry.harmony)}%
            </div>
            <div className="text-[11px] text-emerald-200/70">
              {telemetry.attunedCount} of {telemetry.totalPlants} flora awakened ·{' '}
              {telemetry.environmentalLifecycle.label}
            </div>
          </div>

          <div className="rounded-lg border border-emerald-400/15 bg-[#0d211b] px-4 py-2.5">
            <div className="text-[10px] font-mono text-emerald-300/75 uppercase">
              BIOMES &amp; DIURNAL SKY
            </div>
            <div className="text-xl font-mono font-semibold text-emerald-200 tabular-nums">
              {telemetry.exploredBiomes.length} / 5
            </div>
            <div className="text-[11px] text-emerald-200/70 truncate">
              {BIOME_CONFIGS[telemetry.biome].name} · {ATMOSPHERE_CONFIGS[atmosphere].name}
            </div>
          </div>

          <div className="rounded-lg border border-emerald-400/15 bg-[#0d211b] px-4 py-2.5">
            <div className="text-[10px] font-mono text-emerald-300/75 uppercase">
              ACTIVE CHOIR VOICE
            </div>
            <div className="text-lg font-display font-semibold text-teal-200 truncate">
              {SOUND_OUTCOME_PROFILES[telemetry.prismOutcome]?.label ?? 'Wind Whisper'}
            </div>
            <div className="text-[11px] text-emerald-200/70 truncate">
              {(liveBiomeConfigs[telemetry.biome] ?? BIOME_CONFIGS[telemetry.biome]).tuningLabel} ·{' '}
              {telemetry.soundtrackScore.activeStems.length}/4 Stems Singing
            </div>
          </div>
        </div>

        {/* Clean 4-Tab Conservatory Navigation + Diurnal Sky Switcher */}
        <div
          className="flex items-center justify-between gap-2 mb-3 overflow-x-auto"
          data-testid="inspector-tab-toolbar"
        >
          <div className="flex items-center gap-1 p-1 rounded-lg bg-[#07120e] border border-emerald-500/15 shrink-0">
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
              Biomes &amp; Landmarks (5)
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
              onClick={() => setActiveTab('ethos')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'ethos'
                  ? 'bg-emerald-500/25 text-amber-100 border border-emerald-400/30'
                  : 'text-emerald-300/70 hover:text-emerald-100'
              }`}
            >
              Sanctuary Ethos
            </button>
            <button
              type="button"
              data-testid="inspector-tab-ontology"
              onClick={() => setActiveTab('ontology')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'ontology'
                  ? 'bg-emerald-500/25 text-amber-100 border border-emerald-400/30'
                  : 'text-emerald-300/70 hover:text-emerald-100'
              }`}
            >
              5W+H Ontology (8)
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
                onClick={() => onSelectAtmosphere(atm.id)}
                className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
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

        {/* Scrollable Content Region */}
        <div className="overflow-y-auto pr-1 flex-1 min-h-0">
          {/* TAB 1: FLORA HERBARIUM */}
          {activeTab === 'herbarium' && (
            <div className="space-y-2">
              {speciesList.map((sp) => {
                const matchingPlants = plants.filter((p) => p.species === sp.id);
                const totalOfSpecies = matchingPlants.length;
                const attunedOfSpecies = matchingPlants.filter((p) => p.attuned).length;
                const samplePlant = matchingPlants[0];
                const sampleStage = samplePlant
                  ? BOTANICAL_LIFECYCLE_STAGES[getPlantLifecycleStage(samplePlant)].label
                  : 'Dormant Seed';
                const nativeBiomeCfg = BIOME_CONFIGS[sp.nativeBiome];
                const skyCfg = ATMOSPHERE_CONFIGS[sp.diurnalAffinity];
                const artCfg = SPECIES_ARTICULATION_PROFILES[sp.id];
                const phenomenon = VERDANT_TELEOLOGICAL_PHENOMENA.find(
                  (p) => p.phenomenonId === SPECIES_PHENOMENON_ID[sp.id],
                );

                return (
                  <div
                    key={sp.id}
                    className="rounded-xl border border-emerald-400/15 bg-[#0c1d17] px-4 py-3 flex items-start justify-between gap-4"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <PlantSpeciesIcon
                        species={sp.id}
                        attuned={attunedOfSpecies > 0}
                        className="w-8 h-8 shrink-0 mt-0.5"
                      />
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-amber-100">{sp.name}</span>
                          <span className="text-xs italic text-emerald-300/75">{sp.latinName}</span>
                          <span aria-hidden="true" className="text-emerald-400/40">
                            ·
                          </span>
                          <span className="text-xs font-mono text-amber-200">
                            {artCfg.instrumentName}
                          </span>
                          <span aria-hidden="true" className="text-emerald-400/40">
                            ·
                          </span>
                          <span className="text-xs font-mono text-emerald-200/85 tabular-nums">
                            {attunedOfSpecies}/{totalOfSpecies} attuned ({sampleStage})
                          </span>
                        </div>
                        <p className="text-xs text-emerald-100/85 leading-relaxed">
                          {phenomenon?.environmentalRequirement ?? sp.description}
                        </p>
                        <div className="text-[11px] text-teal-200/85">
                          <span className="font-mono text-emerald-300/80">
                            {nativeBiomeCfg.name} · {skyCfg.name} ·{' '}
                          </span>
                          <span>{phenomenon?.interactiveGameplayResponse ?? sp.description}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAuditionSpecies(sp.id)}
                      className="px-3 py-1.5 rounded-lg border border-amber-300/35 bg-amber-300/10 hover:bg-amber-300/20 text-amber-100 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Listen
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: BIOMES & SYNTHESIZED LANDMARKS */}
          {activeTab === 'biomes' && (
            <div className="space-y-2.5">
              {biomeList.map((biomeCfg) => {
                const landmark = teleologyReport.landmarksByBiome[biomeCfg.id];
                const mastery = evaluateBiomeMasteryAndGuilds(biomeCfg.id, plants);
                const isCurrent = telemetry.biome === biomeCfg.id;

                return (
                  <div
                    key={biomeCfg.id}
                    className={`rounded-xl border px-4 py-3.5 space-y-2 ${
                      isCurrent
                        ? 'border-amber-300/40 bg-[#0f251d]'
                        : 'border-emerald-400/15 bg-[#0c1d17]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-amber-100">
                            {biomeCfg.name}
                          </span>
                          <span aria-hidden="true" className="text-emerald-400/40">
                            ·
                          </span>
                          <span className="text-xs font-mono text-teal-200">
                            {landmark.displayName}
                          </span>
                          <span aria-hidden="true" className="text-emerald-400/40">
                            ·
                          </span>
                          <span className="text-xs font-mono text-emerald-300/80 tabular-nums">
                            {mastery.attunedInBiome}/{mastery.totalInBiome} Flora Awakened
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-amber-200/85 mt-0.5">
                          {biomeCfg.tuningLabel} · {landmark.shortPurposeCue}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          onTeleportBiome(biomeCfg.id);
                          onResume();
                        }}
                        className="px-3 py-1.5 rounded-lg border border-emerald-400/35 bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-100 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        {isCurrent ? 'Here Now' : 'Visit Biome'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs pt-1">
                      <div className="rounded-lg bg-[#081510] border border-emerald-400/10 p-2.5">
                        <div className="text-[10px] font-mono text-emerald-300/75 uppercase mb-0.5">
                          Why the Garden Needed It
                        </div>
                        <p className="text-emerald-100/85 leading-relaxed">
                          {landmark.environmentalRequirement}
                        </p>
                      </div>
                      <div className="rounded-lg bg-[#081510] border border-emerald-400/10 p-2.5">
                        <div className="text-[10px] font-mono text-emerald-300/75 uppercase mb-0.5">
                          Synthesized From Local Matter
                        </div>
                        <p className="text-emerald-100/85 leading-relaxed">
                          {landmark.environmentalSynthesisOrigin}
                        </p>
                      </div>
                      <div className="rounded-lg bg-[#081510] border border-emerald-400/10 p-2.5">
                        <div className="text-[10px] font-mono text-amber-200/85 uppercase mb-0.5">
                          Living Response ([Space] / [T] / [C])
                        </div>
                        <p className="text-emerald-100/85 leading-relaxed">
                          {landmark.interactiveGameplayResponse}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: RESONANCE CHOIRS */}
          {activeTab === 'harmonies' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {outcomeList.map((out) => {
                const isActive = telemetry.prismOutcome === out.id;
                return (
                  <div
                    key={out.id}
                    className={`rounded-xl border px-3.5 py-2.5 flex items-center justify-between gap-3 ${
                      isActive
                        ? 'border-amber-300/45 bg-[#10261e]'
                        : 'border-emerald-400/15 bg-[#0c1d17]'
                    }`}
                  >
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-amber-100 truncate">
                          {out.label}
                        </span>
                        {isActive && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-300/20 text-amber-200">
                            Singing
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-teal-200/85 truncate">
                        {out.timbre}
                      </div>
                      <p className="text-xs text-emerald-200/75 line-clamp-2">
                        {out.chordDegrees.length}-voice botanical bloom · {out.noteDurationSec.toFixed(1)}s natural sustain
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAuditionOutcome(out.id)}
                      className="px-3 py-1.5 rounded-lg border border-emerald-400/30 hover:bg-emerald-900/60 text-emerald-100 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Hear
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 4: SANCTUARY ETHOS & LIVING WORLD PHENOMENA */}
          {activeTab === 'ethos' && (
            <div className="space-y-3">
              <div className="rounded-xl border border-emerald-400/20 bg-[#0c1d17] p-4 space-y-2">
                <div className="text-xs font-mono text-amber-200 uppercase tracking-wider">
                  {VERDANT_BRAND_STANDARD.conservatorySubtitle}
                </div>
                <p className="text-sm text-emerald-50/95 leading-relaxed">
                  {VERDANT_BRAND_STANDARD.manifesto}
                </p>
                <p className="text-xs text-emerald-200/80 leading-relaxed">
                  Every stone path, terrace, landmark, canopy tree, lagoon ripple, and blossom in
                  Verdant Resonance grows directly from the conservatory&apos;s living ecology. As
                  you stroll unhurriedly, touch petals, attune to flora and landmarks, or rest in
                  stillness, the garden deepens its color, geometry, and polyphonic voice on its
                  own—without menus to micromanage or timers to race against.
                </p>
              </div>

              <div
                data-testid="certified-wasm-triadic-panel"
                className="rounded-xl border border-amber-300/25 bg-[#0a1a14] p-4 space-y-2.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs font-mono text-amber-200 uppercase tracking-wider">
                    Certified #![no_std] Wasm Runtime &amp; Triadic Player–Game–Observer Coherence
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-900/70 border border-emerald-400/25 text-[11px] font-mono text-emerald-100">
                    {CERTIFIED_PRODUCTION_MANIFEST.roots.length} Certified Roots (
                    {CERTIFIED_PRODUCTION_MANIFEST.rustCoreNoStdRootCount} #![no_std] +{' '}
                    {CERTIFIED_PRODUCTION_MANIFEST.rustStdRootCount} rust-std) · 0 Classical.choice
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono">
                  <div className="rounded-lg bg-[#0d221a] border border-emerald-400/15 px-3 py-2">
                    <div className="text-[10px] text-emerald-200/75 uppercase">
                      Triadic Coherence
                    </div>
                    <div className="text-sm text-amber-200 font-semibold">
                      {rec.triadicPlayerGameObserverCoherencePermille}‰
                    </div>
                    <div className="text-[10px] text-teal-200/80">
                      Rule-30 ceiling: {SOLIPSISTIC_RULE30_CEILING_PERMILLE}‰
                    </div>
                  </div>
                  <div className="rounded-lg bg-[#0d221a] border border-emerald-400/15 px-3 py-2">
                    <div className="text-[10px] text-emerald-200/75 uppercase">
                      Player Attention
                    </div>
                    <div className="text-sm text-emerald-100 font-semibold">
                      {rec.playerAttentionPermille}‰
                    </div>
                    <div className="text-[10px] text-teal-200/80">
                      Dissonance −{rec.dissonanceReductionPermille}‰
                    </div>
                  </div>
                  <div className="rounded-lg bg-[#0d221a] border border-emerald-400/15 px-3 py-2">
                    <div className="text-[10px] text-emerald-200/75 uppercase">
                      # [no_std] Kernel Calls
                    </div>
                    <div className="text-sm text-emerald-100 font-semibold">
                      {certifiedWasmCoreCallCount().toLocaleString()}
                    </div>
                    <div className="text-[10px] text-teal-200/80">
                      Work: {certifiedWasmTotalWork().toString()}
                    </div>
                  </div>
                  <div className="rounded-lg bg-[#0d221a] border border-emerald-400/15 px-3 py-2">
                    <div className="text-[10px] text-emerald-200/75 uppercase">
                      Healthy Quality
                    </div>
                    <div className="text-sm text-amber-100 font-semibold">
                      {rec.healthyGratifyingQualityPermille}‰
                    </div>
                    <div className="text-[10px] text-teal-200/80">
                      {kpiScorecard.satisfiedFacetKpiCount}/24 Facet KPIs
                    </div>
                  </div>
                </div>
                <div
                  data-testid="live-coevolution-telemetry"
                  className="rounded-lg bg-[#0d221a]/80 border border-teal-400/20 px-3 py-2 text-[11px] font-mono text-emerald-100/90 flex flex-wrap items-center justify-between gap-2"
                >
                  <span>
                    Co-Evolution Bars: {telemetry.liveCoEvolution.barTickCount} (
                    {telemetry.liveCoEvolution.admittedMutationCount} admitted ·{' '}
                    {telemetry.liveCoEvolution.playerTheoryOfMindIntent})
                  </span>
                  <span className="text-teal-200/90">
                    R30 {telemetry.liveCoEvolution.rule30RegisterHex} · Dissonance{' '}
                    {telemetry.liveCoEvolution.incumbentDissonancePermille}‰ ·{' '}
                    {telemetry.liveCoEvolution.sensoryDifferentiation.floraIridescenceBoost.toFixed(2)}×
                    Airy · Offshoots ≤
                    {telemetry.liveCoEvolution.sensoryDifferentiation.microclimateOffshootCap}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {conservatoryEcosystemFeatures.map((feat) => (
                  <div
                    key={feat.phenomenonId}
                    className="rounded-xl border border-emerald-400/15 bg-[#0b1b15] p-3.5 space-y-1"
                  >
                    <div className="text-xs font-semibold text-amber-100">{feat.displayName}</div>
                    <div className="text-[11px] font-mono text-teal-200/85">
                      {feat.shortPurposeCue}
                    </div>
                    <p className="text-xs text-emerald-200/80 leading-relaxed">
                      {feat.gameplayPurpose}
                    </p>
                  </div>
                ))}
              </div>

                <div className="rounded-xl border border-emerald-400/15 bg-[#091611] px-4 py-3 text-xs font-mono text-emerald-200/85">
                  Controls: WASD / Arrows Move · Mouse Drag or Q/E Look · Space Attune Flora or
                  Landmark · T Gentle Touch · C Meditative Stillness · G Guided Stroll · L Cycle Sky ·
                  1–5 Visit Biomes · H Hide HUD Dock
                </div>
              </div>
            )}

          {/* TAB 5: PURELY PARAMETRIC 5W+H SELF-INQUIRY ONTOLOGY */}
          {activeTab === 'ontology' && (
            <div className="space-y-3" data-testid="ontology-5wh-panel">
              <div className="rounded-xl border border-amber-300/30 bg-[#0b1d16] p-4 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs font-mono text-amber-200 uppercase tracking-wider">
                    Why Verdant Resonance Exists · Triad 2 × 3 × 5 ={' '}
                    {ontologyReport.fullGameTriadAgencyProduct}
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-900/70 border border-emerald-400/25 text-[11px] font-mono text-emerald-100">
                    {ontologyReport.groundedModuleCount}/29 Grounded Modules ·{' '}
                    {ontologyReport.totalCertifiedStructures} W5H Structures ·{' '}
                    {ontologyReport.rootVerifiedFromZeroAndOneOnly ? '{0, 1} Pure Root' : 'Unverified'}
                  </span>
                </div>
                <p className="text-xs text-emerald-50/95 leading-relaxed">
                  {ontologyReport.gameExistenceNode.whyAnswer}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono">
                  <div className="rounded-lg bg-[#081510] border border-emerald-400/15 px-3 py-2">
                    <div className="text-[10px] text-emerald-300/75 uppercase">Epistemic Opacity</div>
                    <div className="text-sm font-semibold text-emerald-200">
                      {ontologyReport.liveTelos.epistemicOpacityDebt}
                    </div>
                    <div className="text-[10px] text-teal-200/80">0 unexplained constants</div>
                  </div>
                  <div className="rounded-lg bg-[#081510] border border-emerald-400/15 px-3 py-2">
                    <div className="text-[10px] text-emerald-300/75 uppercase">Legibility Gap</div>
                    <div className="text-sm font-semibold text-amber-200">
                      {ontologyReport.liveTelos.sensoryLegibilityGap}
                    </div>
                    <div className="text-[10px] text-teal-200/80">
                      θ=[{ontologyReport.liveTelos.coordinates.harmonicSimplicity},
                      {ontologyReport.liveTelos.coordinates.phyllotaxisClarity},
                      {ontologyReport.liveTelos.coordinates.waveCalmDamping},
                      {ontologyReport.liveTelos.coordinates.iridescenceLegibility},
                      {ontologyReport.liveTelos.coordinates.guildOffshootDensity}]
                    </div>
                  </div>
                  <div className="rounded-lg bg-[#081510] border border-emerald-400/15 px-3 py-2">
                    <div className="text-[10px] text-emerald-300/75 uppercase">Telos Loss</div>
                    <div className="text-sm font-semibold text-amber-100">
                      {ontologyReport.liveTelos.totalTelosLoss}
                    </div>
                    <div className="text-[10px] text-teal-200/80">
                      Host excess: {ontologyReport.liveTelos.hostCeilingExcess}
                    </div>
                  </div>
                  <div className="rounded-lg bg-[#081510] border border-emerald-400/15 px-3 py-2">
                    <div className="text-[10px] text-emerald-300/75 uppercase">Constructive Primes</div>
                    <div className="text-sm font-semibold text-teal-200 truncate">
                      {ontologyReport.derivedPrimeAtoms.slice(0, 8).join(', ')}
                    </div>
                    <div className="text-[10px] text-teal-200/80">From 0 &amp; succ(0) only</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                {(
                  [
                    ['causal-stratum', `Causal Strata (${ontologyReport.causalStratumNodes.length})`],
                    ['prime-atom', `Prime Atoms (${ontologyReport.primeAtomNodes.length})`],
                    ['world-phenomenon', `World Phenomena (${ontologyReport.worldPhenomenonNodes.length})`],
                    ['lexlean-structure', `Certified Structures (${ontologyReport.structureNodes.length})`],
                  ] as const
                ).map(([kind, label]) => (
                  <button
                    key={kind}
                    type="button"
                    onClick={() => setOntologyFilter(kind)}
                    className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer ${
                      ontologyFilter === kind
                        ? 'bg-amber-300/20 text-amber-100 border border-amber-300/40'
                        : 'bg-[#081510] text-emerald-300/75 hover:text-emerald-100 border border-emerald-400/15'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                {filteredOntologyNodes.map((node) => (
                  <div
                    key={node.nodeId}
                    className="rounded-xl border border-emerald-400/15 bg-[#0c1d17] p-3.5 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-amber-100">{node.title}</span>
                      <span className="text-[10px] font-mono text-teal-200/90">
                        p={node.whatIntrinsicPrimeAtom} · UOR={node.whatCompositeUorSignature} ·{' '}
                        {node.w5hCertifiedByWasm ? 'W5H Wasm Certified' : 'Unverified'}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] leading-relaxed">
                      <div>
                        <span className="font-mono text-amber-200/90 uppercase">What: </span>
                        <span className="text-emerald-100/90">{node.whatAnswer}</span>
                      </div>
                      <div>
                        <span className="font-mono text-amber-200/90 uppercase">Why: </span>
                        <span className="text-emerald-100/90">{node.whyAnswer}</span>
                      </div>
                      <div>
                        <span className="font-mono text-teal-200/90 uppercase">Who: </span>
                        <span className="text-emerald-200/85">{node.whoAnswer}</span>
                      </div>
                      <div>
                        <span className="font-mono text-teal-200/90 uppercase">Where &amp; When: </span>
                        <span className="text-emerald-200/85">
                          {node.whereAnswer} · {node.whenAnswer}
                        </span>
                      </div>
                      <div className="md:col-span-2">
                        <span className="font-mono text-emerald-300/90 uppercase">How: </span>
                        <span className="text-emerald-100/85">{node.howAnswer}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
