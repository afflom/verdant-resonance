import React from 'react';
import { PlantSpeciesId } from '../game/prismModel';

/**
 * Bespoke Inline <svg> Title Lockup Crest for Verdant Resonance
 * Combines a tuning-fork harmonic obelisk, lotus petals, and orbital acoustic rings.
 */
export const VerdantResonanceEmblem: React.FC<{
  className?: string;
  supraTier?: number;
  primaryAccentHex?: string;
  secondaryAccentHex?: string;
  surfaceHex?: string;
}> = ({
  className = 'w-16 h-16',
  supraTier = 0,
  primaryAccentHex = '#fde047',
  secondaryAccentHex = '#6ee7b7',
  surfaceHex = '#07130f',
}) => (
  <svg
    viewBox="0 0 96 96"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Dark outer protective silhouette disc */}
    <circle cx="48" cy="48" r="44" fill={surfaceHex} stroke={secondaryAccentHex} strokeWidth="1.5" strokeOpacity="0.5" />
    {supraTier >= 1 && (
      <circle
        cx="48"
        cy="48"
        r="40.5"
        fill="none"
        stroke={primaryAccentHex}
        strokeWidth={1 + supraTier * 0.22}
        strokeOpacity={Math.min(0.9, 0.35 + supraTier * 0.14)}
        strokeDasharray="6 3"
      />
    )}
    {/* Acoustic orbital rings */}
    <ellipse cx="48" cy="48" rx="36" ry="15" transform="rotate(-24 48 48)" stroke={primaryAccentHex} strokeWidth="1.2" strokeOpacity="0.48" />
    <ellipse cx="48" cy="48" rx="36" ry="15" transform="rotate(24 48 48)" stroke={secondaryAccentHex} strokeWidth="1.2" strokeOpacity="0.48" />
    {/* Outer Lotus Petals */}
    <path
      d="M48 16C55 28 60 40 48 56C36 40 41 28 48 16Z"
      fill={secondaryAccentHex}
      fillOpacity="0.24"
      stroke={secondaryAccentHex}
      strokeWidth="1.5"
    />
    <path
      d="M24 34C36 36 44 44 48 56C34 52 26 44 24 34Z"
      fill={secondaryAccentHex}
      fillOpacity="0.2"
      stroke="#5eead4"
      strokeWidth="1.4"
    />
    <path
      d="M72 34C60 36 52 44 48 56C62 52 70 44 72 34Z"
      fill={secondaryAccentHex}
      fillOpacity="0.2"
      stroke="#5eead4"
      strokeWidth="1.4"
    />
    {/* Central Tuning-Fork Resonance Spire */}
    <path
      d="M43 30V48C43 51 45 53 48 53C51 53 53 51 53 48V30"
      stroke={primaryAccentHex}
      strokeWidth="2.4"
      strokeLinecap="round"
    />
    <path d="M48 53V76" stroke={primaryAccentHex} strokeWidth="2.4" strokeLinecap="round" />
    {/* Top Harmonic Crown Star */}
    <circle cx="48" cy="22" r={3.5 + supraTier * 0.45} fill={primaryAccentHex} />
    {/* Basal Water Ripple Arcs */}
    <path d="M32 76C38 79 58 79 64 76" stroke={secondaryAccentHex} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M38 81C43 83 53 83 58 81" stroke={secondaryAccentHex} strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.7" />
  </svg>
);

/**
 * Code-authored <svg viewBox="0 0 24 24"> Plant Species Icons
 * Built with dark outer silhouette, interior structural detail, and top highlight + state fill.
 * Modulated by Neuromorphic Bus Supra-Directive tier (`supraTier`).
 */
export const PlantSpeciesIcon: React.FC<{
  species: PlantSpeciesId;
  attuned?: boolean;
  supraTier?: number;
  className?: string;
}> = ({ species, attuned = false, supraTier = 0, className = 'w-5 h-5' }) => {
  const strokeColor = attuned || supraTier >= 2 ? '#fef08a' : '#a7f3d0';
  const fillAccent = attuned ? '#facc15' : supraTier >= 1 ? '#34d399' : '#10b981';

  switch (species) {
    case 'chime-lily':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <circle cx="12" cy="12" r="10" fill="#06120e" stroke={strokeColor} strokeWidth="1.4" />
          <path d="M8 18V9C8 6.5 11 5 14 6.5" stroke="#34d399" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M11 10L17 10L18.5 15H9.5L11 10Z" fill={fillAccent} stroke="#fef08a" strokeWidth="1.2" />
          <circle cx="14" cy="16.5" r="1.5" fill="#fef08a" />
        </svg>
      );
    case 'pulse-fern':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <circle cx="12" cy="12" r="10" fill="#06120e" stroke={strokeColor} strokeWidth="1.4" />
          <path
            d="M12 18V9C12 6.8 13.8 5.5 15.5 6.8C16.8 7.8 16 10 14.2 10C12.8 10 12.5 8.6 13.5 8"
            stroke="#6ee7b7"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <path d="M8 15L12 12M16 14L12 11M7.5 12L12 9.5" stroke={fillAccent} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'echo-lotus':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <circle cx="12" cy="12" r="10" fill="#06120e" stroke={strokeColor} strokeWidth="1.4" />
          <path d="M12 6.5C14.5 9.5 15 13 12 15.5C9 13 9.5 9.5 12 6.5Z" fill={fillAccent} stroke="#5eead4" strokeWidth="1.2" />
          <path d="M6.5 11C9 11.5 10.5 13 12 15.5C8.5 15 7 13.5 6.5 11Z" fill="#14b8a6" stroke="#5eead4" strokeWidth="1.1" />
          <path d="M17.5 11C15 11.5 13.5 13 12 15.5C15.5 15 17 13.5 17.5 11Z" fill="#14b8a6" stroke="#5eead4" strokeWidth="1.1" />
          <path d="M6 17.5C9 19 15 19 18 17.5" stroke="#99f6e4" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );
    case 'drone-moss':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <circle cx="12" cy="12" r="10" fill="#06120e" stroke={strokeColor} strokeWidth="1.4" />
          <path d="M6 16.5C6 13.5 9 12 12 12C15 12 18 13.5 18 16.5H6Z" fill={fillAccent} stroke="#6ee7b7" strokeWidth="1.2" />
          <path d="M9.5 12V8M14.5 12V7" stroke="#a7f3d0" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="9.5" cy="7.5" r="1.3" fill="#fef08a" />
          <circle cx="14.5" cy="6.5" r="1.3" fill="#fef08a" />
        </svg>
      );
    case 'star-orchid':
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <circle cx="12" cy="12" r="10" fill="#06120e" stroke={strokeColor} strokeWidth="1.4" />
          <path
            d="M12 5.5L13.8 9.8L18.5 10.2L15 13.4L16 18L12 15.5L8 18L9 13.4L5.5 10.2L10.2 9.8L12 5.5Z"
            fill={fillAccent}
            stroke="#bae6fd"
            strokeWidth="1.2"
          />
          <circle cx="12" cy="12.2" r="2" fill="#fef08a" />
        </svg>
      );
  }
};

export const SoundWaveIcon: React.FC<{ muted?: boolean; className?: string }> = ({
  muted = false,
  className = 'w-4 h-4',
}) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M11 5L6 9H2V15H6L11 19V5Z"
      fill="#10b981"
      fillOpacity="0.3"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {muted ? (
      <path d="M22 9L16 15M16 9L22 15" stroke="#fbbf24" strokeWidth="1.8" strokeLinecap="round" />
    ) : (
      <>
        <path d="M15.5 8.5C17 10 17 14 15.5 15.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M19 5C22 8.5 22 15.5 19 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </>
    )}
  </svg>
);

export const PauseGlyphIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <rect x="6" y="4" width="4" height="16" rx="1" fill="#10b981" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.8" />
    <rect x="14" y="4" width="4" height="16" rx="1" fill="#10b981" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

export const ResetGlyphIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M3 12C3 7.03 7.03 3 12 3C15.3 3 18.2 4.8 19.7 7.5M21 12C21 16.97 16.97 21 12 21C8.7 21 5.8 19.2 4.3 16.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path d="M20 3V8H15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ObserverLightConeIcon: React.FC<{
  supraTier?: number;
  className?: string;
}> = ({ supraTier = 0, className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="10" fill="#06120e" stroke={supraTier >= 1 ? '#fde047' : '#34d399'} strokeWidth="1.4" />
    <path d="M6.5 7.5L12 17.5L17.5 7.5" stroke="#5eead4" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <ellipse cx="12" cy="7.5" rx="5.5" ry="2" stroke="#fde047" strokeWidth="1.2" />
    <circle cx="12" cy="12" r="1.8" fill="#fef08a" />
  </svg>
);
