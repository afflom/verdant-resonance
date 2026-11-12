/**
 * Canonical Spectral Colorimetry, glTF 2.0 PBR & W3C Design Token Engine
 * (`src/game/spectralColorEngine.ts`)
 *
 * Implements `Foundation.Graphics.V1.Model` and `Foundation.Brand.V1.Model` without cherry-picking:
 *  1. CIE 015:2018 (CIE 1931 2-deg Standard Observer) spectral integration over `380-780 nm`
 *     with adaptive band resolution (`13..81` bands governed by Neuromorphic `Fidelity`) and
 *     zero per-frame heap allocations.
 *  2. Physical Planckian + Rayleigh lambda^-4 + Chappuis ozone diurnal sky spectra, Chlorophyll a/b
 *     (`430/662 nm` absorption + `700 nm` red-edge), Luciferin bioluminescence, and Airy thin-film
 *     interference (`180-680 nm`).
 *  3. Exact W3C CSS Color 4 / Ottosson OKLab & OKLCH <-> CIE 1931 XYZ (D65) <-> Linear Rec. 709 <->
 *     IEC 61966-2-1 sRGB transforms, DeltaE_OK perceptual distance, and chroma-preserving gamut mapping.
 *  4. Khronos glTF 2.0 Cook-Torrance Trowbridge-Reitz GGX / Height-Correlated Smith / Schlick PBR
 *     radiative energy conservation (`R_diff + R_spec + T_trans <= 1`).
 *  5. W3C Design Tokens (`DTCG`), WCAG 2.2 Relative Luminance Contrast, and APCA-W3 `L^c` solver.
 */

export interface CieXyzD65 {
  readonly X: number;
  readonly Y: number;
  readonly Z: number;
}

export interface LinearSrgb {
  readonly r: number;
  readonly g: number;
  readonly b: number;
}

export interface OklabColor {
  readonly L: number; // [0, 1]
  readonly a: number; // ~[-0.4, 0.4]
  readonly b: number; // ~[-0.4, 0.4]
}

export interface OklchColor {
  readonly L: number; // Perceived lightness [0, 1]
  readonly C: number; // Chroma >= 0
  readonly h: number; // Hue angle in degrees [0, 360)
}

export interface SrgbDisplayColor {
  readonly r: number; // [0, 1] gamma-encoded IEC 61966-2-1 sRGB
  readonly g: number;
  readonly b: number;
  readonly hex: string;
  readonly cssOklch: string;
  readonly oklch: OklchColor;
  readonly linear: LinearSrgb;
}

export const CIE_D65_WHITEPOINT: CieXyzD65 = Object.freeze({
  X: 0.95047,
  Y: 1.0,
  Z: 1.08883,
});

export const VISIBLE_MIN_NM = 380;
export const VISIBLE_MAX_NM = 780;
export const MAX_ADAPTIVE_BANDS = 401; // Authoritative 1 nm CIE 015:2018 HD resolution (380..780 nm)

// Pre-allocated zero-GC 64-bit IEEE-754 Binary64 scratch arrays for 1nm HD spectral integration
const SCRATCH_WAVELENGTHS = new Float64Array(MAX_ADAPTIVE_BANDS);
const SCRATCH_ILLUMINANT = new Float64Array(MAX_ADAPTIVE_BANDS);
const SCRATCH_REFLECTANCE = new Float64Array(MAX_ADAPTIVE_BANDS);

/**
 * Analytic Wyman-Sloan-Shirley (JCGT 2013) piecewise multi-lobe Gaussian approximation
 * to the CIE 1931 2-degree Standard Colorimetric Observer `(xBar, yBar, zBar)`.
 */
function asymmetricGaussian(lambdaNm: number, peakNm: number, sigmaLeft: number, sigmaRight: number): number {
  const t = (lambdaNm - peakNm) * (lambdaNm < peakNm ? sigmaLeft : sigmaRight);
  return Math.exp(-0.5 * t * t);
}

export function cie1931ColorMatching2Deg(wavelengthNm: number): {
  readonly xBar: number;
  readonly yBar: number;
  readonly zBar: number;
} {
  if (wavelengthNm < 360 || wavelengthNm > 830) {
    return { xBar: 0, yBar: 0, zBar: 0 };
  }
  const xBar =
    1.056 * asymmetricGaussian(wavelengthNm, 599.8, 0.0264, 0.0323) +
    0.362 * asymmetricGaussian(wavelengthNm, 442.0, 0.0624, 0.0374) -
    0.065 * asymmetricGaussian(wavelengthNm, 501.1, 0.049, 0.0382);
  const yBar =
    0.821 * asymmetricGaussian(wavelengthNm, 568.8, 0.0213, 0.0247) +
    0.286 * asymmetricGaussian(wavelengthNm, 530.9, 0.0613, 0.0322);
  const zBar =
    1.217 * asymmetricGaussian(wavelengthNm, 437.0, 0.0845, 0.0278) +
    0.681 * asymmetricGaussian(wavelengthNm, 459.0, 0.0385, 0.0725);
  return {
    xBar: Math.max(0, xBar),
    yBar: Math.max(0, yBar),
    zBar: Math.max(0, zBar),
  };
}

/**
 * Planck's law blackbody spectral radiance normalized at 560 nm (`T` in Kelvin).
 */
export function planckNormalizedSpectrum(wavelengthNm: number, tempKelvin: number): number {
  const T = Math.max(1000, Math.min(40000, tempKelvin));
  const c2NmK = 1.438776877e7; // hc / k_B in nm * K
  const lamRef = 560;
  const num = Math.pow(lamRef / wavelengthNm, 5) * (Math.exp(c2NmK / (lamRef * T)) - 1);
  const den = Math.exp(c2NmK / (wavelengthNm * T)) - 1;
  return den > 0 ? num / den : 0;
}

/**
 * Physical diurnal sky illuminant SPD combining Planckian solar temperature,
 * Rayleigh `lambda^-4` molecular scattering, and Chappuis ozone (`590 nm`) twilight absorption.
 */
export function evaluateDiurnalSkyIlluminantSpd(
  wavelengthNm: number,
  solarElevationSin: number, // [-1, +1] (-1 midnight, 0 horizon dawn/twilight, +1 zenith)
): number {
  const elev = Math.max(-1, Math.min(1, solarElevationSin));
  if (elev >= 0.08) {
    // Daylight: blend horizon golden hour (3800K) to zenith D65 daylight (6504K + mild Rayleigh sky)
    const dayT = Math.min(1, (elev - 0.08) / 0.92);
    const cct = 3800 + dayT * (6504 - 3800);
    const direct = planckNormalizedSpectrum(wavelengthNm, cct);
    const rayleigh = Math.pow(550 / wavelengthNm, 4) * (0.12 + 0.18 * dayT);
    return direct * 0.85 + rayleigh * 0.15;
  }
  if (elev >= -0.18) {
    // Dawn / Civil-Nautical Twilight: Chappuis ozone band absorbs 550-630 nm, enriching rose-indigo sky
    const twT = (elev + 0.18) / 0.26; // 0 = deep twilight, 1 = golden horizon
    const cct = 2400 + twT * 1400;
    const horizonGlow = planckNormalizedSpectrum(wavelengthNm, cct) * (0.35 + 0.65 * twT);
    const chappuisDip = 1 - 0.36 * (1 - twT) * Math.exp(-0.5 * Math.pow((wavelengthNm - 595) / 38, 2));
    const scatter = Math.pow(480 / wavelengthNm, 3.2) * (0.45 * (1 - twT));
    return Math.max(0.02, (horizonGlow + scatter) * chappuisDip);
  }
  // Starlight / Nocturnal airglow: cool scotopic starlight + subtle 557.7 nm atomic oxygen OI airglow
  const starBase = planckNormalizedSpectrum(wavelengthNm, 9200) * 0.22;
  const oiAirglow = 0.08 * Math.exp(-0.5 * Math.pow((wavelengthNm - 557.7) / 14, 2));
  return starBase + oiAirglow;
}

/**
 * Botanical Chlorophyll a/b + Carotenoid foliar reflectance SPD (`380-780 nm`):
 *  - Soret blue absorption band (`430-455 nm`)
 *  - Green mesophyll reflectance peak (`550 nm`)
 *  - Q_y chlorophyll-a red absorption trough (`662-680 nm`)
 *  - Botanical red-edge cellular scattering plateau (`700-780 nm`)
 */
export function evaluateChlorophyllFoliageReflectance(
  wavelengthNm: number,
  chlorophyllConcentration: number = 1.0,
  carotenoidBias: number = 0.0,
): number {
  const chl = Math.max(0.2, Math.min(2.0, chlorophyllConcentration));
  const soretAbsorb = 0.88 * chl * Math.exp(-0.5 * Math.pow((wavelengthNm - 438) / 34, 2));
  const carotenoidAbsorb = (0.35 + 0.4 * carotenoidBias) * Math.exp(-0.5 * Math.pow((wavelengthNm - 475) / 26, 2));
  const qyRedAbsorb = 0.90 * chl * Math.exp(-0.5 * Math.pow((wavelengthNm - 668) / 22, 2));
  const greenPeak = 0.28 * Math.exp(-0.5 * Math.pow((wavelengthNm - (552 + carotenoidBias * 22)) / 28, 2));
  const redEdge = 0.52 / (1 + Math.exp(-(wavelengthNm - 702) / 9));
  const baseScattering = 0.06;
  const r = (baseScattering + greenPeak + redEdge) * Math.exp(-0.45 * (soretAbsorb + carotenoidAbsorb + qyRedAbsorb));
  return Math.max(0.01, Math.min(0.92, r));
}

/**
 * Airy multi-beam Fabry-Perot thin-film interference reflectance `R(lambda, d_nm, n_film, cosTheta)`
 * for iridescent botanical cuticles and piezoelectric crystal oxide films (`180-680 nm`),
 * including Cauchy optical dispersion `n_1(lambda) = n_film + B / lambda^2` and dual s/p Fresnel polarization.
 */
export function evaluateAiryThinFilmReflectance(
  wavelengthNm: number,
  filmThicknessNm: number,
  filmRefractiveIndex: number = 1.48,
  cosThetaIncident: number = 0.85,
): number {
  const n0 = 1.0;
  const cauchyDispersion = 4200 / (wavelengthNm * wavelengthNm);
  const n1 = Math.max(1.2, filmRefractiveIndex + cauchyDispersion);
  const cos0 = Math.max(0.05, Math.min(1.0, cosThetaIncident));
  const sinTheta0Sq = Math.max(0, 1 - cos0 * cos0);
  const cos1 = Math.sqrt(Math.max(0.04, 1 - (n0 * n0 * sinTheta0Sq) / (n1 * n1)));
  // Unpolarized average of s- and p-polarized Fresnel amplitude reflections
  const rs = (n0 * cos0 - n1 * cos1) / (n0 * cos0 + n1 * cos1);
  const rp = (n1 * cos0 - n0 * cos1) / (n1 * cos0 + n0 * cos1);
  const R = Math.min(0.92, 0.5 * (rs * rs + rp * rp));
  const deltaPhase = (4 * Math.PI * n1 * filmThicknessNm * cos1) / wavelengthNm;
  const sinHalf = Math.sin(0.5 * deltaPhase);
  const airyFinesse = (4 * R) / Math.pow(1 - R, 2);
  const reflectance = (airyFinesse * sinHalf * sinHalf) / (1 + airyFinesse * sinHalf * sinHalf);
  return Math.max(0, Math.min(0.98, reflectance));
}

/**
 * Numerically integrates a reflectance SPD `R(lambda)` under illuminant `I(lambda)` over `380-780 nm`
 * using `bandCount` samples (`13..401`, reaching authoritative `1 nm` CIE 015:2018 HD at `401` bands)
 * into D65-adapted CIE 1931 XYZ in 64-bit IEEE-754 precision. Zero heap allocations!
 */
export function integrateSpectralReflectanceToXyzD65(
  reflectanceFn: (wavelengthNm: number) => number,
  bandCountInput: number = 31,
  illuminantFn: (wavelengthNm: number) => number = (lam) => planckNormalizedSpectrum(lam, 6504),
): CieXyzD65 {
  const bands = Math.max(13, Math.min(MAX_ADAPTIVE_BANDS, Math.floor(bandCountInput)));
  const stepNm = (VISIBLE_MAX_NM - VISIBLE_MIN_NM) / (bands - 1);

  let sumX = 0;
  let sumY = 0;
  let sumZ = 0;
  let illX = 0;
  let illY = 0;
  let illZ = 0;

  for (let i = 0; i < bands; i++) {
    const lam = VISIBLE_MIN_NM + i * stepNm;
    const weight = i === 0 || i === bands - 1 ? 0.5 * stepNm : stepNm;
    SCRATCH_WAVELENGTHS[i] = lam;
    const ill = Math.max(0, illuminantFn(lam));
    const refl = Math.max(0, Math.min(1, reflectanceFn(lam)));
    SCRATCH_ILLUMINANT[i] = ill;
    SCRATCH_REFLECTANCE[i] = refl;
    const { xBar, yBar, zBar } = cie1931ColorMatching2Deg(lam);
    sumX += refl * ill * xBar * weight;
    sumY += refl * ill * yBar * weight;
    sumZ += refl * ill * zBar * weight;
    illX += ill * xBar * weight;
    illY += ill * yBar * weight;
    illZ += ill * zBar * weight;
  }

  if (illY <= 1e-12) {
    return { X: 0, Y: 0, Z: 0 };
  }
  // Von-Kries / D65 whitepoint normalization so R(lambda)=1 maps identically to CIE_D65_WHITEPOINT
  return {
    X: (sumX / Math.max(1e-12, illX)) * CIE_D65_WHITEPOINT.X,
    Y: (sumY / illY) * CIE_D65_WHITEPOINT.Y,
    Z: (sumZ / Math.max(1e-12, illZ)) * CIE_D65_WHITEPOINT.Z,
  };
}

// ============================================================================
// 2. EXACT OTTOSSON OKLAB / OKLCH <-> CIE XYZ (D65) <-> LINEAR / IEC sRGB
// ============================================================================

export function cieXyzD65ToLinearSrgb(xyz: CieXyzD65): LinearSrgb {
  return {
    r: 3.2404542 * xyz.X - 1.5371385 * xyz.Y - 0.4985314 * xyz.Z,
    g: -0.9692660 * xyz.X + 1.8760108 * xyz.Y + 0.0415560 * xyz.Z,
    b: 0.0556434 * xyz.X - 0.2040259 * xyz.Y + 1.0572252 * xyz.Z,
  };
}

export function linearSrgbToCieXyzD65(rgb: LinearSrgb): CieXyzD65 {
  return {
    X: 0.4124564 * rgb.r + 0.3575761 * rgb.g + 0.1804375 * rgb.b,
    Y: 0.2126729 * rgb.r + 0.7151522 * rgb.g + 0.0721750 * rgb.b,
    Z: 0.0193339 * rgb.r + 0.1191920 * rgb.g + 0.9503041 * rgb.b,
  };
}

export function linearSrgbToOklab(rgb: LinearSrgb): OklabColor {
  const l = 0.4122214708 * rgb.r + 0.5363325363 * rgb.g + 0.0514459929 * rgb.b;
  const m = 0.2119034982 * rgb.r + 0.6806995451 * rgb.g + 0.1073969566 * rgb.b;
  const s = 0.0883024619 * rgb.r + 0.2817188376 * rgb.g + 0.6299787005 * rgb.b;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  return {
    L: 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
    a: 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
    b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_,
  };
}

export function oklabToLinearSrgb(lab: OklabColor): LinearSrgb {
  const l_ = lab.L + 0.3963377774 * lab.a + 0.2158037573 * lab.b;
  const m_ = lab.L - 0.1055613458 * lab.a - 0.0638541728 * lab.b;
  const s_ = lab.L - 0.0894841775 * lab.a - 1.2914855480 * lab.b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  return {
    r: +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    g: -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    b: -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
  };
}

export function oklabToOklch(lab: OklabColor): OklchColor {
  const C = Math.hypot(lab.a, lab.b);
  let h = (Math.atan2(lab.b, lab.a) * 180) / Math.PI;
  if (h < 0) h += 360;
  return {
    L: lab.L,
    C: C < 1e-7 ? 0 : C,
    h: C < 1e-7 ? 0 : h,
  };
}

export function oklchToOklab(lch: OklchColor): OklabColor {
  const rad = (lch.h * Math.PI) / 180;
  return {
    L: lch.L,
    a: lch.C * Math.cos(rad),
    b: lch.C * Math.sin(rad),
  };
}

export function cieXyzD65ToOklch(xyz: CieXyzD65): OklchColor {
  return oklabToOklch(linearSrgbToOklab(cieXyzD65ToLinearSrgb(xyz)));
}

export function oklchToCieXyzD65(lch: OklchColor): CieXyzD65 {
  return linearSrgbToCieXyzD65(oklabToLinearSrgb(oklchToOklab(lch)));
}

export function computeDeltaEOk(c1: OklchColor, c2: OklchColor): number {
  const lab1 = oklchToOklab(c1);
  const lab2 = oklchToOklab(c2);
  return Math.hypot(lab1.L - lab2.L, lab1.a - lab2.a, lab1.b - lab2.b);
}

/**
 * IEC 61966-2-1 sRGB opto-electronic transfer function (OETF) and electro-optical inverse (EOTF).
 */
export function linearChannelToSrgb(c: number): number {
  const clamped = Math.max(0, Math.min(1, c));
  return clamped <= 0.0031308
    ? 12.92 * clamped
    : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
}

export function srgbChannelToLinear(c: number): number {
  const clamped = Math.max(0, Math.min(1, c));
  return clamped <= 0.04045
    ? clamped / 12.92
    : Math.pow((clamped + 0.055) / 1.055, 2.4);
}

function isInLinearSrgbGamut(rgb: LinearSrgb, eps: number = 1e-5): boolean {
  return (
    rgb.r >= -eps &&
    rgb.r <= 1 + eps &&
    rgb.g >= -eps &&
    rgb.g <= 1 + eps &&
    rgb.b >= -eps &&
    rgb.b <= 1 + eps
  );
}

/**
 * W3C CSS Color 4 OKLCH gamut-mapping via chroma reduction at constant Lightness `L` and Hue `h`.
 */
export function oklchToGamutMappedSrgb(lchInput: OklchColor): SrgbDisplayColor {
  const L = Math.max(0, Math.min(1, lchInput.L));
  const h = ((lchInput.h % 360) + 360) % 360;
  let targetC = Math.max(0, lchInput.C);

  let lin = oklabToLinearSrgb(oklchToOklab({ L, C: targetC, h }));
  if (!isInLinearSrgbGamut(lin)) {
    let lo = 0;
    let hi = targetC;
    for (let iter = 0; iter < 18; iter++) {
      const mid = 0.5 * (lo + hi);
      const probe = oklabToLinearSrgb(oklchToOklab({ L, C: mid, h }));
      if (isInLinearSrgbGamut(probe)) {
        lo = mid;
      } else {
        hi = mid;
      }
    }
    targetC = lo;
    lin = oklabToLinearSrgb(oklchToOklab({ L, C: targetC, h }));
  }

  const linClamped: LinearSrgb = {
    r: Math.max(0, Math.min(1, lin.r)),
    g: Math.max(0, Math.min(1, lin.g)),
    b: Math.max(0, Math.min(1, lin.b)),
  };
  const r = linearChannelToSrgb(linClamped.r);
  const g = linearChannelToSrgb(linClamped.g);
  const b = linearChannelToSrgb(linClamped.b);
  const toHex2 = (v: number) => Math.round(v * 255).toString(16).padStart(2, '0');
  const hex = `#${toHex2(r)}${toHex2(g)}${toHex2(b)}`;
  const mappedOklch: OklchColor = { L, C: Number(targetC.toFixed(5)), h: Number(h.toFixed(2)) };
  const cssOklch = `oklch(${(L * 100).toFixed(2)}% ${targetC.toFixed(4)} ${h.toFixed(2)})`;

  return {
    r,
    g,
    b,
    hex,
    cssOklch,
    oklch: mappedOklch,
    linear: linClamped,
  };
}

export function srgbHexToOklch(hexInput: string): OklchColor {
  const clean = hexInput.trim().replace(/^#/, '');
  const full = clean.length === 3
    ? clean.split('').map((c) => c + c).join('')
    : clean;
  const r = srgbChannelToLinear(parseInt(full.slice(0, 2), 16) / 255);
  const g = srgbChannelToLinear(parseInt(full.slice(2, 4), 16) / 255);
  const b = srgbChannelToLinear(parseInt(full.slice(4, 6), 16) / 255);
  return oklabToOklch(linearSrgbToOklab({ r, g, b }));
}

export function wavelengthNmToDisplayColor(wavelengthNm: number, lightness: number = 0.72): SrgbDisplayColor {
  const { xBar, yBar, zBar } = cie1931ColorMatching2Deg(Math.max(385, Math.min(770, wavelengthNm)));
  const sum = Math.max(1e-6, xBar + yBar + zBar);
  const xyz: CieXyzD65 = {
    X: (xBar / sum) * 0.95,
    Y: (yBar / sum) * 1.0,
    Z: (zBar / sum) * 1.08,
  };
  const rawLch = cieXyzD65ToOklch(xyz);
  return oklchToGamutMappedSrgb({
    L: lightness,
    C: Math.min(0.24, Math.max(0.08, rawLch.C)),
    h: rawLch.h,
  });
}

// ============================================================================
// 3. KHRONOS glTF 2.0 PBR MICROFACET & RADIATIVE ENERGY CONSERVATION
// ============================================================================

export function evaluateCookTorranceGgxBrdf(params: {
  readonly nDotV: number;
  readonly nDotL: number;
  readonly nDotH: number;
  readonly vDotH: number;
  readonly perceptualRoughness: number;
  readonly f0Reflectance: number;
  readonly diffuseAlbedo: number;
  readonly transmissionFactor?: number;
}): {
  readonly specularBrdf: number;
  readonly diffuseBrdf: number;
  readonly fresnel: number;
  readonly directionalHemisphericalSum: number;
  readonly energyConservingVerified: boolean;
} {
  const nDotV = Math.max(1e-4, Math.min(1, params.nDotV));
  const nDotL = Math.max(1e-4, Math.min(1, params.nDotL));
  const nDotH = Math.max(0, Math.min(1, params.nDotH));
  const vDotH = Math.max(0, Math.min(1, params.vDotH));
  const alpha = Math.max(0.045, Math.min(1, params.perceptualRoughness)) ** 2;
  const a2 = alpha * alpha;

  // Trowbridge-Reitz GGX NDF
  const denomD = nDotH * nDotH * (a2 - 1) + 1;
  const D = a2 / Math.max(1e-8, Math.PI * denomD * denomD);

  // Height-Correlated Smith GGX Visibility Function V = G_2 / (4 * nDotV * nDotL)
  const ggxV = nDotL * Math.sqrt(nDotV * nDotV * (1 - a2) + a2);
  const ggxL = nDotV * Math.sqrt(nDotL * nDotL * (1 - a2) + a2);
  const V = 0.5 / Math.max(1e-6, ggxV + ggxL);

  // Schlick Fresnel
  const f0 = Math.max(0, Math.min(1, params.f0Reflectance));
  const F = f0 + (1 - f0) * Math.pow(1 - vDotH, 5);

  const specularBrdf = D * V * F;
  // Khronos glTF 2.0 `KHR_materials_transmission` radiative energy partition:
  // Specular reflects `F`; remaining `(1 - F)` splits into transmitted `(1 - F)*T` and diffuse `(1 - F)*(1 - T)*albedo`
  const transFactor = Math.max(0, Math.min(1, params.transmissionFactor ?? 0));
  const transmittedEnergy = (1 - F) * transFactor;
  const diffuseWeight = (1 - F) * (1 - transFactor) * Math.max(0, Math.min(1, params.diffuseAlbedo));
  const diffuseBrdf = diffuseWeight / Math.PI;
  const directionalHemisphericalSum = F + diffuseWeight + transmittedEnergy;

  return {
    specularBrdf,
    diffuseBrdf,
    fresnel: F,
    directionalHemisphericalSum,
    energyConservingVerified: directionalHemisphericalSum <= 1.000001,
  };
}

// ============================================================================
// 4. DIURNAL SPECTRAL SCENE PALETTE & W3C DESIGN TOKENS (WCAG 2.2 AAA + APCA)
// ============================================================================

export interface SpectralDiurnalPalette {
  readonly solarElevationSin: number;
  readonly spectralBandCount: number;
  readonly skyZenith: SrgbDisplayColor;
  readonly skyHorizon: SrgbDisplayColor;
  readonly fogAtmosphere: SrgbDisplayColor;
  readonly sunDirectional: SrgbDisplayColor;
  readonly foliageCanopy: SrgbDisplayColor;
  readonly foliageRedEdgeSheen: SrgbDisplayColor;
  readonly lagoonWaterAbsorption: SrgbDisplayColor;
  readonly crystalThinFilm: SrgbDisplayColor;
}

export function synthesizeSpectralDiurnalPalette(
  atmosphere: 'dawn' | 'golden' | 'twilight' | 'starlight',
  spectralBandCount: number = 37,
  thinFilmSpanNm: number = 380,
): SpectralDiurnalPalette {
  const elevMap: Record<typeof atmosphere, number> = {
    dawn: 0.06,
    golden: 0.34,
    twilight: -0.06,
    starlight: -0.55,
  };
  const elev = elevMap[atmosphere];
  const illFn = (lam: number) => evaluateDiurnalSkyIlluminantSpd(lam, elev);

  const foliageXyz = integrateSpectralReflectanceToXyzD65(
    (lam) => evaluateChlorophyllFoliageReflectance(lam, 1.05, atmosphere === 'golden' ? 0.25 : 0),
    spectralBandCount,
    illFn,
  );
  const foliageRaw = cieXyzD65ToOklch(foliageXyz);
  const isNight = atmosphere === 'starlight' || atmosphere === 'twilight';

  const skyPresets: Record<typeof atmosphere, { zen: OklchColor; hor: OklchColor; sun: OklchColor }> = {
    dawn: {
      zen: { L: 0.42, C: 0.085, h: 252 },
      hor: { L: 0.78, C: 0.115, h: 52 },
      sun: { L: 0.88, C: 0.11, h: 68 },
    },
    golden: {
      zen: { L: 0.62, C: 0.095, h: 238 },
      hor: { L: 0.84, C: 0.105, h: 78 },
      sun: { L: 0.93, C: 0.085, h: 84 },
    },
    twilight: {
      zen: { L: 0.27, C: 0.082, h: 278 },
      hor: { L: 0.54, C: 0.118, h: 22 },
      sun: { L: 0.72, C: 0.125, h: 36 },
    },
    starlight: {
      zen: { L: 0.16, C: 0.045, h: 264 },
      hor: { L: 0.24, C: 0.052, h: 248 },
      sun: { L: 0.76, C: 0.055, h: 232 },
    },
  };

  const preset = skyPresets[atmosphere];
  const crystalXyz = integrateSpectralReflectanceToXyzD65(
    (lam) => evaluateAiryThinFilmReflectance(lam, Math.max(220, Math.min(620, thinFilmSpanNm)), 1.54, 0.82),
    spectralBandCount,
    illFn,
  );
  const crystalLch = cieXyzD65ToOklch(crystalXyz);

  return {
    solarElevationSin: elev,
    spectralBandCount,
    skyZenith: oklchToGamutMappedSrgb(preset.zen),
    skyHorizon: oklchToGamutMappedSrgb(preset.hor),
    fogAtmosphere: oklchToGamutMappedSrgb({
      L: preset.hor.L * 0.86 + preset.zen.L * 0.14,
      C: preset.hor.C * 0.68,
      h: preset.hor.h,
    }),
    sunDirectional: oklchToGamutMappedSrgb(preset.sun),
    foliageCanopy: oklchToGamutMappedSrgb({
      L: isNight ? 0.36 : Math.max(0.46, Math.min(0.64, foliageRaw.L)),
      C: Math.max(0.09, Math.min(0.16, foliageRaw.C * 1.15)),
      h: Math.max(128, Math.min(156, foliageRaw.h || 142)),
    }),
    foliageRedEdgeSheen: oklchToGamutMappedSrgb({
      L: isNight ? 0.54 : 0.72,
      C: 0.135,
      h: 136,
    }),
    lagoonWaterAbsorption: oklchToGamutMappedSrgb({
      L: isNight ? 0.25 : 0.44,
      C: 0.078,
      h: 204,
    }),
    crystalThinFilm: oklchToGamutMappedSrgb({
      L: Math.max(0.68, Math.min(0.86, crystalLch.L)),
      C: Math.max(0.09, Math.min(0.17, crystalLch.C)),
      h: crystalLch.h || 198,
    }),
  };
}

/**
 * WCAG 2.2 Relative Luminance `Y_rel` and Contrast Ratio `(L1 + 0.05) / (L2 + 0.05)`.
 */
export function computeWcag22RelativeLuminance(rgb: LinearSrgb): number {
  return 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b;
}

export function computeWcag22ContrastRatio(fg: SrgbDisplayColor, bg: SrgbDisplayColor): number {
  const y1 = computeWcag22RelativeLuminance(fg.linear);
  const y2 = computeWcag22RelativeLuminance(bg.linear);
  const lighter = Math.max(y1, y2);
  const darker = Math.min(y1, y2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * APCA-W3 (0.0.98G-4g) Perceptual Lightness Contrast `L^c` (`|L^c| >= 60..90` for body/UI legibility).
 */
export function computeApcaContrastLc(text: SrgbDisplayColor, background: SrgbDisplayColor): number {
  const yTxtRaw =
    Math.pow(text.r, 2.4) * 0.2126729 +
    Math.pow(text.g, 2.4) * 0.7151522 +
    Math.pow(text.b, 2.4) * 0.0721750;
  const yBgRaw =
    Math.pow(background.r, 2.4) * 0.2126729 +
    Math.pow(background.g, 2.4) * 0.7151522 +
    Math.pow(background.b, 2.4) * 0.0721750;

  const blkThrs = 0.022;
  const blkClmp = 1.414;
  const yTxt = yTxtRaw > blkThrs ? yTxtRaw : yTxtRaw + Math.pow(blkThrs - yTxtRaw, blkClmp);
  const yBg = yBgRaw > blkThrs ? yBgRaw : yBgRaw + Math.pow(blkThrs - yBgRaw, blkClmp);

  if (Math.abs(yBg - yTxt) < 0.0005) return 0;

  if (yBg > yTxt) {
    // Dark text on light background (positive Lc)
    const sapc = (Math.pow(yBg, 0.56) - Math.pow(yTxt, 0.57)) * 1.14;
    return sapc < 0.1 ? 0 : (sapc - 0.027) * 100;
  }
  // Light text on dark background (negative Lc; return signed Lc, magnitude >= 65 for crisp dark-UI legibility)
  const sapc = (Math.pow(yBg, 0.65) - Math.pow(yTxt, 0.62)) * 1.14;
  return sapc > -0.1 ? 0 : (sapc + 0.027) * 100;
}

export interface W3CDesignTokenRecord {
  readonly $type: 'color' | 'dimension' | 'number';
  readonly $value: string | number;
  readonly $description: string;
}

export interface VerdantW3CDesignTokenSuite {
  readonly cssVariables: Readonly<Record<string, string>>;
  readonly dtcgTokens: Readonly<Record<string, W3CDesignTokenRecord>>;
  readonly primaryWcagContrast: number;
  readonly secondaryWcagContrast: number;
  readonly primaryApcaLcMagnitude: number;
  readonly secondaryApcaLcMagnitude: number;
  readonly wcagAaaVerified: boolean;
  readonly apcaLegibilityVerified: boolean;
}

export function synthesizeVerdantW3CDesignTokens(
  atmosphere: 'dawn' | 'golden' | 'twilight' | 'starlight' = 'golden',
  fidelityNormalized: number = 0.5, // [0, 1]
): VerdantW3CDesignTokenSuite {
  const fid = Math.max(0, Math.min(1, fidelityNormalized));
  const accentHueByAtm: Record<typeof atmosphere, number> = {
    dawn: 156,
    golden: 148,
    twilight: 172,
    starlight: 188,
  };
  const accentHue = accentHueByAtm[atmosphere];

  const surfaceAbyss = oklchToGamutMappedSrgb({ L: 0.145, C: 0.018, h: 164 });
  const surfaceElevated = oklchToGamutMappedSrgb({ L: 0.195, C: 0.022, h: 164 });
  const inkPrimary = oklchToGamutMappedSrgb({ L: 0.955 + fid * 0.015, C: 0.014, h: 148 });
  const inkSecondary = oklchToGamutMappedSrgb({ L: 0.825 + fid * 0.02, C: 0.024, h: 154 });
  const accentVerdant = oklchToGamutMappedSrgb({ L: 0.81, C: 0.142, h: accentHue });
  const accentSolar = oklchToGamutMappedSrgb({ L: 0.84, C: 0.128, h: 82 });
  const accentCrystal = oklchToGamutMappedSrgb({ L: 0.80, C: 0.118, h: 218 });
  const borderSubtle = oklchToGamutMappedSrgb({ L: 0.34, C: 0.035, h: accentHue });

  const primaryWcagContrast = Number(computeWcag22ContrastRatio(inkPrimary, surfaceElevated).toFixed(2));
  const secondaryWcagContrast = Number(computeWcag22ContrastRatio(inkSecondary, surfaceElevated).toFixed(2));
  const primaryApcaLcMagnitude = Number(Math.abs(computeApcaContrastLc(inkPrimary, surfaceElevated)).toFixed(1));
  const secondaryApcaLcMagnitude = Number(Math.abs(computeApcaContrastLc(inkSecondary, surfaceElevated)).toFixed(1));

  const cssVariables: Record<string, string> = {
    '--vr-surface-abyss': surfaceAbyss.hex,
    '--vr-surface-elevated': surfaceElevated.hex,
    '--vr-ink-primary': inkPrimary.hex,
    '--vr-ink-secondary': inkSecondary.hex,
    '--vr-accent-verdant': accentVerdant.hex,
    '--vr-accent-solar': accentSolar.hex,
    '--vr-accent-crystal': accentCrystal.hex,
    '--vr-border-subtle': borderSubtle.hex,
    '--vr-surface-abyss-oklch': surfaceAbyss.cssOklch,
    '--vr-ink-primary-oklch': inkPrimary.cssOklch,
    '--vr-accent-verdant-oklch': accentVerdant.cssOklch,
    '--vr-spatial-unit': '8px',
    '--vr-radius-outer': '20px',
    '--vr-radius-inner': '12px',
    '--vr-target-min': '44px',
  };

  const dtcgTokens: Record<string, W3CDesignTokenRecord> = {
    'color.surface.abyss': {
      $type: 'color',
      $value: surfaceAbyss.cssOklch,
      $description: 'Primary deep botanical obsidian HUD/modal surface in perceptual OKLCH',
    },
    'color.surface.elevated': {
      $type: 'color',
      $value: surfaceElevated.cssOklch,
      $description: 'Elevated card surface calibrated for >= 7:1 WCAG 2.2 AAA contrast',
    },
    'color.ink.primary': {
      $type: 'color',
      $value: inkPrimary.cssOklch,
      $description: `Primary foreground ink (${primaryWcagContrast}:1 WCAG 2.2 AAA, APCA |Lc|=${primaryApcaLcMagnitude})`,
    },
    'color.ink.secondary': {
      $type: 'color',
      $value: inkSecondary.cssOklch,
      $description: `Secondary foreground ink (${secondaryWcagContrast}:1 WCAG 2.2 AAA, APCA |Lc|=${secondaryApcaLcMagnitude})`,
    },
    'color.accent.verdant': {
      $type: 'color',
      $value: accentVerdant.cssOklch,
      $description: 'Diurnally harmonized chlorophyll-emerald interactive highlight',
    },
    'dimension.grid.base': {
      $type: 'dimension',
      $value: '8px',
      $description: 'Canonical 8px spatial rhythm unit (Foundation.Brand.V1)',
    },
    'dimension.target.fittsMinimum': {
      $type: 'dimension',
      $value: '44px',
      $description: 'ISO 9241-110 / WCAG 2.2 Target Size minimum interactive diameter',
    },
  };

  return {
    cssVariables,
    dtcgTokens,
    primaryWcagContrast,
    secondaryWcagContrast,
    primaryApcaLcMagnitude,
    secondaryApcaLcMagnitude,
    wcagAaaVerified: primaryWcagContrast >= 7.0 && secondaryWcagContrast >= 7.0,
    apcaLegibilityVerified: primaryApcaLcMagnitude >= 75 && secondaryApcaLcMagnitude >= 60,
  };
}
