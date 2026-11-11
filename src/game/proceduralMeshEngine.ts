import * as THREE from 'three';
import type { SynthesizedObserverModelSpec } from './prismModel';
import {
  FOURTEEN_BRAVAIS_LATTICES,
  verifyExteriorDerivativeNilpotencyOnMesh,
} from './standardModelEngine';

/**
 * High-Definition Procedural 3D B-Mesh, Lofted Spline, Shape-Key (Morph Target)
 * & PBR Shader Synthesis Engine (`src/game/proceduralMeshEngine.ts`).
 *
 * Replaces primitive boxes, cones, and cylinders with parametrically sculpted,
 * anatomically accurate 3D geometries complete with analytical normals, UVs,
 * vertex color gradients, and Blender-style Shape Keys (`morphAttributes.position`).
 * Connected to the Universal Neuromorphic Bus for Supra-Directive (`w > 8`) model synthesis.
 */

export interface ProceduralGeometryMetadata {
  name: string;
  vertexCount: number;
  triangleCount: number;
  morphTargetCount: number;
  hasNormals: boolean;
  hasVertexColors: boolean;
  hasUVs: boolean;
}

export interface BotanicalShaderUniforms {
  uTime: { value: number };
  uResonancePulse: { value: number };
  uSupraDefinition: { value: number };
  uAperiodicShimmer: { value: number };
}

export function inspectGeometryMetadata(
  geometry: THREE.BufferGeometry,
  name = 'procedural-mesh',
): ProceduralGeometryMetadata {
  const posAttr = geometry.getAttribute('position');
  const normAttr = geometry.getAttribute('normal');
  const uvAttr = geometry.getAttribute('uv');
  const colorAttr = geometry.getAttribute('color');
  const indexAttr = geometry.getIndex();
  const vertexCount = posAttr ? posAttr.count : 0;
  const triangleCount = indexAttr
    ? Math.floor(indexAttr.count / 3)
    : Math.floor(vertexCount / 3);
  const morphPositions = geometry.morphAttributes.position;
  return {
    name,
    vertexCount,
    triangleCount,
    morphTargetCount: morphPositions ? morphPositions.length : 0,
    hasNormals: Boolean(normAttr),
    hasVertexColors: Boolean(colorAttr),
    hasUVs: Boolean(uvAttr),
  };
}

/**
 * 1. Sculpted Botanical Petal B-Mesh (`createSculptedPetalGeometry`)
 * - Parametric bicubic surface with a central vascular midrib keel, secondary lateral venation,
 *   delicate ruffled margins, base-to-tip vertex color gradient, and 2 Shape Keys:
 *   - Shape Key 0 (`bloomOpen`): Unfurls the petal from an enclosed bud into a reflexed chalice curve.
 *   - Shape Key 1 (`acousticRipple`): Standing-wave Chladni harmonic margin undulation.
 */
export function createSculptedPetalGeometry(options?: {
  length?: number;
  maxWidth?: number;
  archCurvature?: number;
  curvature?: number;
  tipRecurve?: number;
  cupDepth?: number;
  midribDepth?: number;
  ruffleAmplitude?: number;
  baseColorHex?: string;
  tipColorHex?: string;
  uSegments?: number;
  vSegments?: number;
  radialSegments?: number;
  longitudinalSegments?: number;
}): THREE.BufferGeometry {
  const length = options?.length ?? 0.76;
  const maxWidth = options?.maxWidth ?? 0.32;
  const archCurvature = options?.archCurvature ?? options?.curvature ?? 0.24;
  const cupDepth = options?.cupDepth ?? 0.065;
  const midribDepth = options?.midribDepth ?? 0.018;
  const ruffleAmplitude = options?.ruffleAmplitude ?? 0.014;
  const uSegs = options?.uSegments ?? options?.radialSegments ?? 12;
  const vSegs = options?.vSegments ?? options?.longitudinalSegments ?? 16;

  const vertexCount = (uSegs + 1) * (vSegs + 1);
  const basePositions = new Float32Array(vertexCount * 3);
  const bloomMorphPositions = new Float32Array(vertexCount * 3);
  const rippleMorphPositions = new Float32Array(vertexCount * 3);
  const uvs = new Float32Array(vertexCount * 2);
  const colors = new Float32Array(vertexCount * 3);

  let vIdx = 0;
  for (let iv = 0; iv <= vSegs; iv++) {
    const v = iv / vSegs; // 0 at base attachment, 1 at petal apex
    // Botanical obovate-lanceolate width profile: narrow claw at base, broad blade at v=0.58, acuminate tip at v=1
    const widthEnvelope = Math.sin(Math.pow(v, 0.78) * Math.PI) * (1 - 0.12 * v * v);
    const halfSpan = (maxWidth * 0.5) * widthEnvelope;

    for (let iu = 0; iu <= uSegs; iu++) {
      const u = (iu / uSegs) * 2 - 1; // -1 left margin .. 0 midrib .. +1 right margin
      const absU = Math.abs(u);

      // Transverse cupping + central midrib keel + secondary lateral veins
      const cupZ = (u * u) * cupDepth * Math.sin(v * Math.PI);
      const midribZ = -Math.exp(-absU * 6.5) * midribDepth * (1 - v * 0.4);
      const secondaryVein =
        Math.sin((v * 7.0 - absU * 2.8) * Math.PI) * 0.0045 * absU * (1 - absU);
      const edgeRuffle =
        Math.pow(absU, 2.2) *
        Math.sin(v * Math.PI * 5.0) *
        ruffleAmplitude *
        Math.sin(v * Math.PI);

      // Base pose (partially enclosed bud-to-chalice)
      const x = u * halfSpan;
      const y = v * length;
      const archZ = Math.pow(v, 1.55) * archCurvature;
      const z = archZ - cupZ + midribZ + secondaryVein + edgeRuffle;

      basePositions[vIdx * 3] = x;
      basePositions[vIdx * 3 + 1] = y;
      basePositions[vIdx * 3 + 2] = z;

      // Shape Key 0 (`bloomOpen`): Unfurls outward along +Z and widens the upper blade
      const bloomOutwardZ = Math.pow(v, 1.35) * (archCurvature * 1.15);
      const bloomTipReflexY = -Math.pow(v, 2.4) * length * 0.14;
      const bloomWideX = x * (1 + 0.16 * Math.sin(v * Math.PI));
      bloomMorphPositions[vIdx * 3] = bloomWideX;
      bloomMorphPositions[vIdx * 3 + 1] = y + bloomTipReflexY;
      bloomMorphPositions[vIdx * 3 + 2] = z + bloomOutwardZ;

      // Shape Key 1 (`acousticRipple`): High-order Chladni petal margin harmonic wave
      const chladniDeltaZ =
        (0.5 + 0.5 * absU) *
        Math.sin(v * Math.PI * 6.0) *
        Math.cos(u * Math.PI * 2.0) *
        0.028 *
        v;
      const chladniDeltaX =
        Math.sign(u) * Math.sin(v * Math.PI * 4.0) * 0.012 * absU * v;
      rippleMorphPositions[vIdx * 3] = x + chladniDeltaX;
      rippleMorphPositions[vIdx * 3 + 1] = y;
      rippleMorphPositions[vIdx * 3 + 2] = z + chladniDeltaZ;

      uvs[vIdx * 2] = iu / uSegs;
      uvs[vIdx * 2 + 1] = v;

      // Subtle botanical vertex color gradient: deeper nectar base -> luminous apex & glowing midrib
      const baseToTipLum = 0.72 + 0.28 * Math.pow(v, 0.7) + (1 - absU) * 0.12;
      colors[vIdx * 3] = Math.min(1, baseToTipLum);
      colors[vIdx * 3 + 1] = Math.min(1, baseToTipLum * (0.94 + 0.06 * v));
      colors[vIdx * 3 + 2] = Math.min(1, baseToTipLum * (0.88 + 0.12 * v));

      vIdx++;
    }
  }

  const indices: number[] = [];
  const stride = uSegs + 1;
  for (let iv = 0; iv < vSegs; iv++) {
    for (let iu = 0; iu < uSegs; iu++) {
      const a = iv * stride + iu;
      const b = a + 1;
      const c = (iv + 1) * stride + iu;
      const d = c + 1;
      indices.push(a, b, d);
      indices.push(a, d, c);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(basePositions, 3));
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.morphAttributes.position = [
    new THREE.BufferAttribute(bloomMorphPositions, 3),
    new THREE.BufferAttribute(rippleMorphPositions, 3),
  ];
  geometry.computeVertexNormals();
  return geometry;
}

/**
 * 2. Fluted & Scalloped Chalice Bell Corolla (`createFlutedBellCorollaGeometry`)
 * - Replaces the 5-point low-poly LatheGeometry with a parametric campanulate bell
 *   featuring 8 longitudinal vascular ribs, a flared scalloped margin, and 2 Shape Keys
 *   (`bloomOpen` + `acousticRipple`).
 */
export function createFlutedBellCorollaGeometry(options?: {
  height?: number;
  baseRadius?: number;
  mouthRadius?: number;
  radiusTop?: number;
  fluteCount?: number;
  lobeCount?: number;
  radialSegments?: number;
  heightSegments?: number;
}): THREE.BufferGeometry {
  const height = options?.height ?? 0.62;
  const baseRadius = options?.baseRadius ?? 0.032;
  const mouthRadius = options?.mouthRadius ?? options?.radiusTop ?? 0.46;
  const fluteCount = options?.fluteCount ?? options?.lobeCount ?? 8;
  const rSegs = options?.radialSegments ?? 32;
  const hSegs = options?.heightSegments ?? 18;

  const vertexCount = (rSegs + 1) * (hSegs + 1);
  const basePositions = new Float32Array(vertexCount * 3);
  const bloomMorphPositions = new Float32Array(vertexCount * 3);
  const rippleMorphPositions = new Float32Array(vertexCount * 3);
  const uvs = new Float32Array(vertexCount * 2);

  let idx = 0;
  for (let ih = 0; ih <= hSegs; ih++) {
    const v = ih / hSegs; // 0 at receptacle base, 1 at flared bell mouth
    // Campanulate S-curve flare profile
    const bellCurve =
      baseRadius +
      (mouthRadius - baseRadius) *
        (0.55 * Math.pow(v, 1.25) + 0.45 * Math.pow(v, 2.8));

    for (let ir = 0; ir <= rSegs; ir++) {
      const u = ir / rSegs;
      const theta = u * Math.PI * 2;
      const fluteWave = Math.cos(theta * fluteCount);
      const ribMod = 1 + fluteWave * (0.065 * Math.sin(v * Math.PI) + 0.085 * v * v);
      const r = bellCurve * ribMod;
      // Scalloped petal-lobe rim at the mouth (v -> 1)
      const scallopY = Math.pow(v, 2.6) * fluteWave * 0.042;
      const y = v * height + scallopY;
      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;

      basePositions[idx * 3] = x;
      basePositions[idx * 3 + 1] = y;
      basePositions[idx * 3 + 2] = z;

      // Shape Key 0 (`bloomOpen`): Flares mouth wider and deepens scalloped petal lobes
      const bloomScaleR = 1 + Math.pow(v, 1.6) * 0.28 * (1 + fluteWave * 0.15);
      const bloomReflexY = -Math.pow(v, 2.8) * 0.065;
      bloomMorphPositions[idx * 3] = x * bloomScaleR;
      bloomMorphPositions[idx * 3 + 1] = y + bloomReflexY;
      bloomMorphPositions[idx * 3 + 2] = z * bloomScaleR;

      // Shape Key 1 (`acousticRipple`): Quadrupolar (2,0) & octupolar (4,0) bell vibration mode
      const modalRadial =
        1 +
        (Math.cos(theta * 2) * 0.06 + Math.sin(theta * 4) * 0.04) *
          Math.pow(v, 1.4);
      rippleMorphPositions[idx * 3] = x * modalRadial;
      rippleMorphPositions[idx * 3 + 1] =
        y + Math.sin(theta * fluteCount) * Math.pow(v, 2.0) * 0.025;
      rippleMorphPositions[idx * 3 + 2] = z * modalRadial;

      uvs[idx * 2] = u;
      uvs[idx * 2 + 1] = v;
      idx++;
    }
  }

  const indices: number[] = [];
  const stride = rSegs + 1;
  for (let ih = 0; ih < hSegs; ih++) {
    for (let ir = 0; ir < rSegs; ir++) {
      const a = ih * stride + ir;
      const b = a + 1;
      const c = (ih + 1) * stride + ir;
      const d = c + 1;
      indices.push(a, c, b);
      indices.push(b, c, d);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(basePositions, 3));
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.morphAttributes.position = [
    new THREE.BufferAttribute(bloomMorphPositions, 3),
    new THREE.BufferAttribute(rippleMorphPositions, 3),
  ];
  geometry.computeVertexNormals();
  return geometry;
}

/**
 * 3. Pinnate Fern Frond with Paired Pinnae Leaflets & Curved Rachis (`createPinnateFrondGeometry`)
 * - Replaces the boxy `BoxGeometry(0.22, 1.56, 0.055)` with a true compound pinnate fern frond:
 *   - Central curved vascular rachis spine with dorsal groove
 *   - 9 pairs of sculpted lanceolate pinnae leaflets tapering from base to apex
 *   - 2 Shape Keys (`frondUnfurl` + `acousticRipple`)
 */
export function createPinnateFrondGeometry(options?: {
  length?: number;
  maxSpan?: number;
  maxWidth?: number;
  pinnaPairs?: number;
  pinnaePairs?: number;
}): THREE.BufferGeometry {
  const length = options?.length ?? 1.58;
  const maxSpan = options?.maxSpan ?? options?.maxWidth ?? 0.44;
  const pinnaPairs = options?.pinnaPairs ?? options?.pinnaePairs ?? 9;

  const positions: number[] = [];
  const bloomPositions: number[] = [];
  const ripplePositions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  let vOffset = 0;

  // Part A: Curved Vascular Rachis Spine (14 segments, 6 radial sides)
  const rSteps = 14;
  const rSides = 6;
  for (let i = 0; i <= rSteps; i++) {
    const t = i / rSteps;
    const y = t * length;
    const archZ = Math.pow(t, 1.65) * 0.28;
    const radius = (1 - t * 0.72) * 0.022;

    for (let s = 0; s <= rSides; s++) {
      const a = (s / rSides) * Math.PI * 2;
      const x = Math.cos(a) * radius;
      const z = archZ + Math.sin(a) * radius;
      positions.push(x, y, z);

      // Shape Key 0: Graceful outward unfurl
      const unfurlZ = archZ + Math.pow(t, 1.4) * 0.16;
      bloomPositions.push(x, y - Math.pow(t, 2.2) * 0.08, unfurlZ + Math.sin(a) * radius);

      // Shape Key 1: Travelling wave along rachis
      const waveZ = Math.sin(t * Math.PI * 3.0) * 0.032 * t;
      ripplePositions.push(x, y, z + waveZ);

      uvs.push(s / rSides, t);
    }
  }
  const rachisStride = rSides + 1;
  for (let i = 0; i < rSteps; i++) {
    for (let s = 0; s < rSides; s++) {
      const a = vOffset + i * rachisStride + s;
      const b = a + 1;
      const c = a + rachisStride;
      const d = c + 1;
      indices.push(a, b, d);
      indices.push(a, d, c);
    }
  }
  vOffset += (rSteps + 1) * rachisStride;

  // Part B: 9 Pairs of Sculpted Lanceolate Pinnae Leaflets along the Rachis
  const pinnaUSegs = 6;
  const pinnaVSegs = 3;
  for (let p = 0; p < pinnaPairs; p++) {
    const frac = 0.14 + (p / (pinnaPairs - 1)) * 0.82;
    const envelope = Math.sin(Math.pow(frac, 0.75) * Math.PI);
    const pinnaLength = (maxSpan * 0.5) * (0.28 + 0.72 * envelope);
    const pinnaWidth = 0.048 * (0.4 + 0.6 * envelope);
    const sweepAngle = 0.26 + frac * 0.28; // Forward apical sweep

    for (const side of [-1, 1] as const) {
      const attachY = frac * length + (side === 1 ? 0.018 : -0.018);
      const attachZ = Math.pow(frac, 1.65) * 0.28;

      for (let iu = 0; iu <= pinnaUSegs; iu++) {
        const u = iu / pinnaUSegs; // 0 at rachis stem -> 1 at pinna leaflet tip
        // Non-zero petiolule attachment width (0.22) at u=0 so every leaflet is physically embedded inside the central rachis spine
        const widthProfile = 0.22 * (1 - u) + Math.sin(Math.pow(u, 0.75) * Math.PI);
        const localReach = u * pinnaLength;

        for (let iv = 0; iv <= pinnaVSegs; iv++) {
          const v = (iv / pinnaVSegs) * 2 - 1; // -1 posterior edge .. +1 anterior edge
          const x = side * localReach * Math.cos(sweepAngle);
          const y =
            attachY +
            localReach * Math.sin(sweepAngle) +
            v * pinnaWidth * widthProfile;
          const droopZ =
            attachZ +
            Math.pow(u, 1.6) * 0.045 -
            Math.abs(v) * 0.008 * widthProfile;

          positions.push(x, y, droopZ);

          // Shape Key 0: Pinnae spread wider and arch gracefully
          const bloomX = x * 1.14;
          const bloomZ =
            attachZ +
            Math.pow(frac, 1.4) * 0.16 +
            Math.pow(u, 1.5) * 0.075;
          bloomPositions.push(bloomX, y - Math.pow(frac, 2.2) * 0.08, bloomZ);

          // Shape Key 1: Sympathetic pinnae flutter wave
          const flutterZ =
            Math.sin((frac * 4.0 + u * 2.0) * Math.PI) * 0.036 * (0.3 + u * 0.7);
          ripplePositions.push(x, y, droopZ + flutterZ);

          uvs.push(u, (v + 1) * 0.5);
        }
      }

      const pStride = pinnaVSegs + 1;
      for (let iu = 0; iu < pinnaUSegs; iu++) {
        for (let iv = 0; iv < pinnaVSegs; iv++) {
          const a = vOffset + iu * pStride + iv;
          const b = a + 1;
          const c = a + pStride;
          const d = c + 1;
          if (side === 1) {
            indices.push(a, b, d);
            indices.push(a, d, c);
          } else {
            indices.push(a, d, b);
            indices.push(a, c, d);
          }
        }
      }
      vOffset += (pinnaUSegs + 1) * pStride;
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.morphAttributes.position = [
    new THREE.Float32BufferAttribute(bloomPositions, 3),
    new THREE.Float32BufferAttribute(ripplePositions, 3),
  ];
  geometry.computeVertexNormals();
  return geometry;
}

/**
 * 4. Logarithmic Spiral Crozier Fiddlehead (`createLogarithmicCrozierGeometry`)
 * - Sweeps a fluted cross-section along a true golden logarithmic spiral in the XY plane
 *   with an unfurling Shape Key (`morphAttributes.position`).
 */
export function createLogarithmicCrozierGeometry(options?: {
  outerRadius?: number;
  scaleRadius?: number;
  tubeRadius?: number;
  turns?: number;
  tubularSegments?: number;
  radialSegments?: number;
}): THREE.BufferGeometry {
  const outerRadius = options?.outerRadius ?? options?.scaleRadius ?? 0.25;
  const tubeRadius = options?.tubeRadius ?? 0.048;
  const turns = options?.turns ?? 1.85;
  const tSegs = options?.tubularSegments ?? 36;
  const rSegs = options?.radialSegments ?? 10;

  const vertexCount = (tSegs + 1) * (rSegs + 1);
  const basePositions = new Float32Array(vertexCount * 3);
  const unfurlMorphPositions = new Float32Array(vertexCount * 3);
  const rippleMorphPositions = new Float32Array(vertexCount * 3);
  const uvs = new Float32Array(vertexCount * 2);

  let idx = 0;
  for (let it = 0; it <= tSegs; it++) {
    const t = it / tSegs; // 0 at basal stem attachment (0,0,0) -> 1 at tightly coiled inner apex
    const theta = -Math.PI * 0.5 + t * Math.PI * 2 * turns;
    const spiralR = outerRadius * Math.exp(-1.35 * t);
    // Offset by (0, +outerRadius) so at t = 0 (theta = -pi/2), centerX = 0 and centerY = 0 (anchored directly at the stem apex!)
    const centerX = Math.cos(theta) * spiralR;
    const centerY = outerRadius + Math.sin(theta) * spiralR;
    const centerZ = t * 0.025;

    // Unfurl morph target unwinds the spiral angle by 32% while keeping t=0 anchored at (0,0,0)
    const unfurlTheta = -Math.PI * 0.5 + t * Math.PI * 2 * turns * 0.68;
    const unfurlR = outerRadius * Math.exp(-0.95 * t);
    const unfurlCenterX = Math.cos(unfurlTheta) * unfurlR;
    const unfurlCenterY = outerRadius + Math.sin(unfurlTheta) * unfurlR + t * 0.14;

    // Tangent normal in XY plane
    const radAngle = theta;
    const nx = Math.cos(radAngle);
    const ny = Math.sin(radAngle);

    const localTubeR = tubeRadius * (1 - 0.58 * t);

    for (let ir = 0; ir <= rSegs; ir++) {
      const u = ir / rSegs;
      const phi = u * Math.PI * 2;
      const rib = 1 + Math.cos(phi * 5) * 0.12;
      const r = localTubeR * rib;

      const cosPhi = Math.cos(phi);
      const sinPhi = Math.sin(phi);

      const x = centerX + nx * cosPhi * r;
      const y = centerY + ny * cosPhi * r;
      const z = centerZ + sinPhi * r;

      basePositions[idx * 3] = x;
      basePositions[idx * 3 + 1] = y;
      basePositions[idx * 3 + 2] = z;

      unfurlMorphPositions[idx * 3] =
        unfurlCenterX + Math.cos(unfurlTheta) * cosPhi * r;
      unfurlMorphPositions[idx * 3 + 1] =
        unfurlCenterY + Math.sin(unfurlTheta) * cosPhi * r;
      unfurlMorphPositions[idx * 3 + 2] = z;

      const pulseR = r * (1 + Math.sin(t * Math.PI * 4) * 0.22);
      rippleMorphPositions[idx * 3] = centerX + nx * cosPhi * pulseR;
      rippleMorphPositions[idx * 3 + 1] = centerY + ny * cosPhi * pulseR;
      rippleMorphPositions[idx * 3 + 2] = centerZ + sinPhi * pulseR;

      uvs[idx * 2] = t;
      uvs[idx * 2 + 1] = u;
      idx++;
    }
  }

  const indices: number[] = [];
  const stride = rSegs + 1;
  for (let it = 0; it < tSegs; it++) {
    for (let ir = 0; ir < rSegs; ir++) {
      const a = it * stride + ir;
      const b = a + 1;
      const c = (it + 1) * stride + ir;
      const d = c + 1;
      indices.push(a, b, d);
      indices.push(a, d, c);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(basePositions, 3));
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.morphAttributes.position = [
    new THREE.BufferAttribute(unfurlMorphPositions, 3),
    new THREE.BufferAttribute(rippleMorphPositions, 3),
  ];
  geometry.computeVertexNormals();
  return geometry;
}

/**
 * 5. Notched Cordate Floating Lotus Pad (`createCordateLotusPadGeometry`)
 * - Replaces `CylinderGeometry(0.92, 0.98, 0.05, 18)` with a true heart-notched (cordate)
 *   aquatic leaf disk featuring:
 *   - Radial V-sinus notch at theta = 0
 *   - Upturned hydrostatic meniscus rim around the perimeter
 *   - 14 raised radiating vascular venation ribs across the upper blade
 */
export function createCordateLotusPadGeometry(options?: {
  radius?: number;
  rimHeight?: number;
  sinusDepth?: number;
  veinCount?: number;
  radialSegments?: number;
  ringSegments?: number;
}): THREE.BufferGeometry {
  const radius = options?.radius ?? 0.96;
  const rSegs = options?.radialSegments ?? 40;
  const ringSegs = options?.ringSegments ?? 12;

  const vertexCount = (rSegs + 1) * (ringSegs + 1);
  const positions = new Float32Array(vertexCount * 3);
  const uvs = new Float32Array(vertexCount * 2);

  let idx = 0;
  for (let ir = 0; ir <= ringSegs; ir++) {
    const rho = ir / ringSegs; // 0 at center petiole umbilicus -> 1 at outer margin
    for (let ia = 0; ia <= rSegs; ia++) {
      const u = ia / rSegs;
      // Angle mapped around the V-notch sinus (leave a 22-degree cleft indent)
      const angle = (u - 0.5) * Math.PI * 2;
      const notchIndent = 1 - 0.52 * Math.exp(-Math.pow(angle / 0.28, 2));
      const marginWave = 1 + Math.cos(angle * 14) * 0.018 * rho;
      const r = rho * radius * notchIndent * marginWave;

      // Raised radiating primary vascular veins (14 ribs) + upturned hydrostatic rim
      const veinRib =
        Math.pow(Math.max(0, Math.cos(angle * 7)), 4) *
        0.016 *
        Math.sin(rho * Math.PI);
      const rimLipY = Math.pow(rho, 4.2) * 0.048;
      const centerDimpleY = -Math.exp(-rho * 6.0) * 0.018;
      const y = 0.018 + centerDimpleY + veinRib + rimLipY;

      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;

      positions[idx * 3] = x;
      positions[idx * 3 + 1] = y;
      positions[idx * 3 + 2] = z;

      uvs[idx * 2] = 0.5 + (x / (radius * 2));
      uvs[idx * 2 + 1] = 0.5 + (z / (radius * 2));
      idx++;
    }
  }

  const indices: number[] = [];
  const stride = rSegs + 1;
  for (let ir = 0; ir < ringSegs; ir++) {
    for (let ia = 0; ia < rSegs; ia++) {
      const a = ir * stride + ia;
      const b = a + 1;
      const c = (ir + 1) * stride + ia;
      const d = c + 1;
      indices.push(a, c, b);
      indices.push(b, c, d);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

/**
 * 6. Segmented Bamboo & Crystal Culm Stalk with Nodal Diaphragms (`createSegmentedBambooStalkGeometry`)
 * - Replaces plain `CylinderGeometry` for conservatory trees with a 5-internode segmented culm:
 *   - Swollen nodal diaphragm rings at each internode boundary
 *   - Concave internode waist profile + classical entasis taper
 *   - 12 longitudinal vascular silica ridges
 *   - Bottom-pivoted at y = 0 for exact subterranean root grounding
 */
export function createSegmentedBambooStalkGeometry(options?: {
  height?: number;
  baseRadius?: number;
  radiusBase?: number;
  topRadius?: number;
  radiusTop?: number;
  internodeCount?: number;
  nodeCount?: number;
  radialSegments?: number;
  heightSegments?: number;
}): THREE.BufferGeometry {
  const height = options?.height ?? 7.6;
  const baseRadius = options?.baseRadius ?? options?.radiusBase ?? 0.24;
  const topRadius = options?.topRadius ?? options?.radiusTop ?? 0.165;
  const internodeCount = options?.internodeCount ?? options?.nodeCount ?? 5;
  const rSegs = options?.radialSegments ?? 18;
  const hSegs = options?.heightSegments ?? 30;

  const vertexCount = (rSegs + 1) * (hSegs + 1);
  const positions = new Float32Array(vertexCount * 3);
  const uvs = new Float32Array(vertexCount * 2);

  let idx = 0;
  for (let ih = 0; ih <= hSegs; ih++) {
    const v = ih / hSegs; // 0 at subterranean base -> 1 at crown apex
    const y = v * height;
    const baseTaper = baseRadius + (topRadius - baseRadius) * Math.pow(v, 0.85);

    // Nodal ring ridge at each internode boundary
    const internodePhase = (v * internodeCount) % 1;
    const distFromNode = Math.min(internodePhase, 1 - internodePhase);
    const nodalRidge = Math.exp(-Math.pow(distFromNode / 0.065, 2)) * 0.14;
    const internodeWaist = -Math.sin(internodePhase * Math.PI) * 0.035;

    for (let ir = 0; ir <= rSegs; ir++) {
      const u = ir / rSegs;
      const theta = u * Math.PI * 2;
      const flute = 1 + Math.cos(theta * 12) * 0.025;
      const r = baseTaper * (1 + nodalRidge + internodeWaist) * flute;

      positions[idx * 3] = Math.cos(theta) * r;
      positions[idx * 3 + 1] = y;
      positions[idx * 3 + 2] = Math.sin(theta) * r;

      uvs[idx * 2] = u;
      uvs[idx * 2 + 1] = v * internodeCount;
      idx++;
    }
  }

  const indices: number[] = [];
  const stride = rSegs + 1;
  for (let ih = 0; ih < hSegs; ih++) {
    for (let ir = 0; ir < rSegs; ir++) {
      const a = ih * stride + ir;
      const b = a + 1;
      const c = (ih + 1) * stride + ir;
      const d = c + 1;
      indices.push(a, c, b);
      indices.push(b, c, d);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

/**
 * 7. Sculpted Botanical Canopy Foliage Crown (`createSculptedCanopyCrownGeometry`)
 * - Replaces the 5-sided `ConeGeometry(0.95, 1.45, 5)` with a multi-tiered dome of
 *   radiating arched botanical leaf sprays with fluted umbrella ribs and scalloped drip-tips.
 */
export function createSculptedCanopyCrownGeometry(options?: {
  radius?: number;
  height?: number;
  lobeCount?: number;
  radialSegments?: number;
  ringSegments?: number;
}): THREE.BufferGeometry {
  const radius = options?.radius ?? 1.08;
  const height = options?.height ?? 1.42;
  const lobeCount = options?.lobeCount ?? 9;
  const rSegs = options?.radialSegments ?? 27;
  const ringSegs = options?.ringSegments ?? 10;

  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  let vOffset = 0;

  // Part A: Sculpted Multi-Lobed Foliage Dome
  for (let ir = 0; ir <= ringSegs; ir++) {
    const v = ir / ringSegs; // 0 at crown apex (+height*0.5), 1 at drooping outer leaf tips (-height*0.5)
    for (let ia = 0; ia <= rSegs; ia++) {
      const u = ia / rSegs;
      const theta = u * Math.PI * 2;
      const leafLobe = Math.cos(theta * lobeCount);
      const sprayReach =
        Math.sin(Math.pow(v, 0.72) * (Math.PI * 0.58)) *
        radius *
        (1 + leafLobe * 0.22 * v);
      const archY =
        height * 0.5 -
        Math.pow(v, 1.35) * height +
        leafLobe * 0.085 * Math.sin(v * Math.PI) -
        Math.pow(v, 3.0) * Math.max(0, leafLobe) * 0.14;

      positions.push(Math.cos(theta) * sprayReach, archY, Math.sin(theta) * sprayReach);
      uvs.push(u, v);
    }
  }

  const stride = rSegs + 1;
  for (let ir = 0; ir < ringSegs; ir++) {
    for (let ia = 0; ia < rSegs; ia++) {
      const a = vOffset + ir * stride + ia;
      const b = a + 1;
      const c = (ir + 1) * stride + ia + vOffset;
      const d = c + 1;
      indices.push(a, b, d);
      indices.push(a, d, c);
    }
  }
  vOffset += (ringSegs + 1) * stride;

  // Part B: Underside Foliar Cup & Trunk-Clasping Nodal Collar (`r = 0.20m` at `y = -height * 0.42`)
  // Connects the outer drooping canopy margin (`v = 1`) smoothly inward and downward to the central tree trunk axis (0, -height*0.42, 0)
  const underRings = 4;
  const collarR = 0.18;
  for (let ur = 0; ur <= underRings; ur++) {
    const t = ur / underRings; // 0 at outer canopy rim -> 1 at central trunk nodal collar
    for (let ia = 0; ia <= rSegs; ia++) {
      const u = ia / rSegs;
      const theta = u * Math.PI * 2;
      const leafLobe = Math.cos(theta * lobeCount);
      const outerR =
        Math.sin(Math.PI * 0.58) * radius * (1 + leafLobe * 0.22);
      const outerY =
        -height * 0.5 - Math.max(0, leafLobe) * 0.14;
      const boughRib = Math.pow(Math.max(0, Math.cos(theta * lobeCount)), 2) * 0.08 * Math.sin(t * Math.PI);
      const r = outerR * (1 - t) + collarR * t;
      const y = outerY * (1 - t) + (-height * 0.36) * t + Math.sin(t * Math.PI) * 0.22 + boughRib;

      positions.push(Math.cos(theta) * r, y, Math.sin(theta) * r);
      uvs.push(u, 1 - t * 0.5);
    }
  }
  for (let ur = 0; ur < underRings; ur++) {
    for (let ia = 0; ia < rSegs; ia++) {
      const a = vOffset + ur * stride + ia;
      const b = a + 1;
      const c = a + stride;
      const d = c + 1;
      indices.push(a, d, b);
      indices.push(a, c, d);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

/**
 * 8. Curved Carinate Grass & Reed Blade (`createSculptedGrassBladeGeometry`)
 * - Replaces the 4-sided `ConeGeometry(0.09, 0.85, 4)` with a true curved V-channel (carinate)
 *   botanical grass blade, bottom-pivoted at y = 0.
 */
export function createSculptedGrassBladeGeometry(options?: {
  height?: number;
  width?: number;
  arch?: number;
  archCurve?: number;
  heightSegments?: number;
}): THREE.BufferGeometry {
  const height = options?.height ?? 0.92;
  const width = options?.width ?? 0.11;
  const arch = options?.arch ?? options?.archCurve ?? 0.18;
  const hSegs = options?.heightSegments ?? 7;
  const uSegs = 2; // Left margin (-1), Central V-keel midrib (0), Right margin (+1)

  const vertexCount = (uSegs + 1) * (hSegs + 1);
  const positions = new Float32Array(vertexCount * 3);
  const uvs = new Float32Array(vertexCount * 2);

  let idx = 0;
  for (let ih = 0; ih <= hSegs; ih++) {
    const v = ih / hSegs; // 0 at soil root -> 1 at acuminate tip
    const bladeWidth = width * Math.sin((1 - Math.pow(v, 1.35)) * (Math.PI * 0.5));
    const y = v * height;
    const archZ = Math.pow(v, 1.85) * arch;

    for (let iu = 0; iu <= uSegs; iu++) {
      const u = (iu / uSegs) * 2 - 1; // -1, 0, +1
      const x = u * (bladeWidth * 0.5);
      const keelOffsetZ = -Math.abs(u) * 0.018 * (1 - v * 0.7);
      const z = archZ + keelOffsetZ;

      positions[idx * 3] = x;
      positions[idx * 3 + 1] = y;
      positions[idx * 3 + 2] = z;

      uvs[idx * 2] = (u + 1) * 0.5;
      uvs[idx * 2 + 1] = v;
      idx++;
    }
  }

  const indices: number[] = [];
  const stride = uSegs + 1;
  for (let ih = 0; ih < hSegs; ih++) {
    for (let iu = 0; iu < uSegs; iu++) {
      const a = ih * stride + iu;
      const b = a + 1;
      const c = (ih + 1) * stride + iu;
      const d = c + 1;
      // Double-sided triangles so grass blades have crisp normals from all viewing angles
      indices.push(a, b, d);
      indices.push(a, d, c);
      indices.push(a, d, b);
      indices.push(a, c, d);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

/**
 * 9. Crystallographic Hexagonal Bipyramidal Quartz Prism (`createHexagonalQuartzCrystalGeometry`)
 * - Builds a true 6-sided trigonal/hexagonal alpha-quartz crystal with rhombohedral
 *   termination facets, chamfered prism waist, and horizontal growth striations.
 */
export function createHexagonalQuartzCrystalGeometry(options?: {
  radius?: number;
  height?: number;
  tipRatio?: number;
  doubleTerminated?: boolean;
}): THREE.BufferGeometry {
  const radius = options?.radius ?? 0.68;
  const height = options?.height ?? 4.6;
  const tipRatio = options?.tipRatio ?? 0.28;
  const doubleTerminated = options?.doubleTerminated ?? false;

  const sides = 6;
  const rings = doubleTerminated
    ? [
        { y: -height * 0.5, r: 0.0 },
        { y: -height * (0.5 - tipRatio * 0.65), r: radius * 0.88 },
        { y: height * (0.5 - tipRatio), r: radius * 0.84 },
        { y: height * 0.5, r: 0.0 },
      ]
    : [
        { y: -height * 0.5, r: radius * 1.06 },
        { y: -height * 0.15, r: radius * 0.96 },
        { y: height * (0.5 - tipRatio), r: radius * 0.82 },
        { y: height * 0.5, r: 0.0 },
      ];

  const ringCount = rings.length;
  const vertexCount = (sides + 1) * ringCount;
  const positions = new Float32Array(vertexCount * 3);
  const uvs = new Float32Array(vertexCount * 2);

  let idx = 0;
  for (let ir = 0; ir < ringCount; ir++) {
    const ring = rings[ir];
    const v = ir / (ringCount - 1);
    for (let is = 0; is <= sides; is++) {
      const u = is / sides;
      const theta = u * Math.PI * 2;
      // Alternating r/z rhombohedral face asymmetry characteristic of natural alpha-quartz
      const asym = ring.r > 0 ? 1 + (is % 2 === 0 ? 0.045 : -0.045) : 0;
      const x = Math.cos(theta) * ring.r * asym;
      const z = Math.sin(theta) * ring.r * asym;

      positions[idx * 3] = x;
      positions[idx * 3 + 1] = ring.y;
      positions[idx * 3 + 2] = z;

      uvs[idx * 2] = u;
      uvs[idx * 2 + 1] = v;
      idx++;
    }
  }

  const indices: number[] = [];
  const stride = sides + 1;
  for (let ir = 0; ir < ringCount - 1; ir++) {
    for (let is = 0; is < sides; is++) {
      const a = ir * stride + is;
      const b = a + 1;
      const c = (ir + 1) * stride + is;
      const d = c + 1;
      indices.push(a, c, b);
      indices.push(b, c, d);
    }
  }

  const flatGeo = new THREE.BufferGeometry();
  flatGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  flatGeo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  flatGeo.setIndex(indices);
  // Convert to non-indexed for razor-sharp crystallographic facet normals
  const facetedGeo = flatGeo.toNonIndexed();
  facetedGeo.computeVertexNormals();
  return facetedGeo;
}

/**
 * 10. Classical Fluted Entasis Architectural Column (`createFlutedEntasisPillarGeometry`)
 * - Builds a high-definition architectural column with:
 *   - Moulded torus-and-scotia Attic base plinth
 *   - 16-flute concave shaft with classical entasis curve
 *   - Flared echinus and abacus capital
 */
export function createFlutedEntasisPillarGeometry(options?: {
  height?: number;
  baseRadius?: number;
  radiusBase?: number;
  topRadius?: number;
  radiusTop?: number;
  fluteCount?: number;
}): THREE.BufferGeometry {
  const height = options?.height ?? 5.6;
  const baseRadius = options?.baseRadius ?? options?.radiusBase ?? 0.34;
  const topRadius = options?.topRadius ?? options?.radiusTop ?? 0.26;
  const fluteCount = options?.fluteCount ?? 16;
  const rSegs = 32;
  const hSegs = 24;

  const vertexCount = (rSegs + 1) * (hSegs + 1);
  const positions = new Float32Array(vertexCount * 3);
  const uvs = new Float32Array(vertexCount * 2);

  let idx = 0;
  for (let ih = 0; ih <= hSegs; ih++) {
    const v = ih / hSegs; // 0 at bottom (-height/2) -> 1 at top (+height/2)
    const y = (v - 0.5) * height;

    // Classical entasis curve + moulded Attic base (v < 0.12) + Doric echinus capital (v > 0.88)
    const entasisR =
      baseRadius +
      (topRadius - baseRadius) * v +
      Math.sin(v * Math.PI) * 0.022;
    const baseMoulding =
      v < 0.12 ? Math.cos((v / 0.12) * Math.PI * 0.5) * 0.11 : 0;
    const capitalMoulding =
      v > 0.88 ? Math.sin(((v - 0.88) / 0.12) * Math.PI * 0.5) * 0.12 : 0;
    const inFlutedShaft = v >= 0.12 && v <= 0.88;

    for (let ir = 0; ir <= rSegs; ir++) {
      const u = ir / rSegs;
      const theta = u * Math.PI * 2;
      const fluteIndent = inFlutedShaft
        ? -Math.max(0, Math.cos(theta * fluteCount)) * 0.024
        : 0;
      const r = entasisR + baseMoulding + capitalMoulding + fluteIndent;

      positions[idx * 3] = Math.cos(theta) * r;
      positions[idx * 3 + 1] = y;
      positions[idx * 3 + 2] = Math.sin(theta) * r;

      uvs[idx * 2] = u;
      uvs[idx * 2 + 1] = v;
      idx++;
    }
  }

  const indices: number[] = [];
  const stride = rSegs + 1;
  for (let ih = 0; ih < hSegs; ih++) {
    for (let ir = 0; ir < rSegs; ir++) {
      const a = ih * stride + ir;
      const b = a + 1;
      const c = (ih + 1) * stride + ir;
      const d = c + 1;
      indices.push(a, c, b);
      indices.push(b, c, d);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

/**
 * 11. Stratified Geological Boulder Geometry (`createStratifiedBoulderGeometry`)
 * - Replaces uniform `DodecahedronGeometry` with a stratified geological outcrop featuring
 *   terraced sedimentary/metamorphic cleavage shelves and organic faceted planes.
 */
export function createStratifiedBoulderGeometry(options?: {
  radius?: number;
  detail?: number;
  detailRings?: number;
  radialSegments?: number;
  seed?: number;
}): THREE.BufferGeometry {
  const radius = options?.radius ?? 2.6;
  const ringSegs = options?.detailRings ?? 14;
  const rSegs = options?.radialSegments ?? 18;
  const seedPhase = (options?.seed ?? 101) * 0.13;

  const vertexCount = (ringSegs + 1) * (rSegs + 1);
  const positions = new Float32Array(vertexCount * 3);
  const uvs = new Float32Array(vertexCount * 2);

  let idx = 0;
  for (let ir = 0; ir <= ringSegs; ir++) {
    const v = ir / ringSegs;
    const phi = v * Math.PI;
    const sinPhi = Math.sin(phi);
    const cosPhi = Math.cos(phi);

    for (let ia = 0; ia <= rSegs; ia++) {
      const u = ia / rSegs;
      const theta = u * Math.PI * 2;
      const nx = sinPhi * Math.cos(theta);
      const ny = cosPhi;
      const nz = sinPhi * Math.sin(theta);

      const strataStep = Math.sin(ny * Math.PI * 5.0 + seedPhase) * 0.085;
      const fractureFacet =
        Math.cos(nx * 3.7 + nz * 2.9 + seedPhase) *
        Math.sin(ny * 4.1 - nx * 2.3) *
        0.14;
      const basalBroadening = ny < 0 ? 1 + Math.abs(ny) * 0.18 : 1 - ny * 0.08;
      const localR = radius * (1 + strataStep + fractureFacet) * basalBroadening;

      positions[idx * 3] = nx * localR;
      positions[idx * 3 + 1] = ny * radius * (0.82 + strataStep * 0.5);
      positions[idx * 3 + 2] = nz * localR;
      uvs[idx * 2] = u;
      uvs[idx * 2 + 1] = v;
      idx++;
    }
  }

  const indices: number[] = [];
  const stride = rSegs + 1;
  for (let ir = 0; ir < ringSegs; ir++) {
    for (let ia = 0; ia < rSegs; ia++) {
      const a = ir * stride + ia;
      const b = a + 1;
      const c = (ir + 1) * stride + ia;
      const d = c + 1;
      indices.push(a, c, b);
      indices.push(b, c, d);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

export interface HighDefinitionPbrTextureSuite {
  texelResolution: number;
  mossColorTex: THREE.CanvasTexture;
  mossNormalTex: THREE.CanvasTexture;
  mossRoughnessTex: THREE.CanvasTexture;
  stoneColorTex: THREE.CanvasTexture;
  stoneNormalTex: THREE.CanvasTexture;
  petalVeinNormalTex: THREE.CanvasTexture;
  dispose: () => void;
}

/**
 * 12. High-Definition Procedural PBR Texture & Sobel Tangent-Space Normal Map Generator
 * - Synthesizes Albedo (`SRGBColorSpace`), Tangent-Space Normal Maps (`RGB = [Nx, Ny, Nz]`),
 *   and Roughness Maps directly from our macromolecular/compound structural layers, scaled
 *   monotonically by `multiModalFidelity.proceduralTexelResolution`.
 */
export function createHighDefinitionPbrTextureSuite(
  maxAnisotropy: number,
  isSoftwareGl: boolean,
  requestedResolution = 512,
): HighDefinitionPbrTextureSuite {
  const clampedReq = Math.max(256, Math.min(768, Math.round(requestedResolution)));
  const size = isSoftwareGl ? 256 : Math.max(384, clampedReq);
  const densityScale = size / 384;

  // Helper: convert a grayscale heightfield canvas into a true tangent-space normal map canvas
  const heightCanvasToNormalCanvas = (
    heightCanvas: HTMLCanvasElement,
    strength = 2.6,
  ): HTMLCanvasElement => {
    const w = heightCanvas.width;
    const h = heightCanvas.height;
    const srcCtx = heightCanvas.getContext('2d')!;
    const srcData = srcCtx.getImageData(0, 0, w, h).data;

    const normCanvas = document.createElement('canvas');
    normCanvas.width = w;
    normCanvas.height = h;
    const dstCtx = normCanvas.getContext('2d')!;
    const dstImg = dstCtx.createImageData(w, h);
    const dstData = dstImg.data;

    const sampleH = (x: number, y: number): number => {
      const wx = (x + w) % w;
      const wy = (y + h) % h;
      return srcData[(wy * w + wx) * 4] / 255;
    };

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        // 3x3 Sobel gradient filter for crisp tangent-space surface normals
        const tl = sampleH(x - 1, y - 1);
        const l = sampleH(x - 1, y);
        const bl = sampleH(x - 1, y + 1);
        const t = sampleH(x, y - 1);
        const b = sampleH(x, y + 1);
        const tr = sampleH(x + 1, y - 1);
        const r = sampleH(x + 1, y);
        const br = sampleH(x + 1, y + 1);

        const dX = (tr + 2 * r + br - (tl + 2 * l + bl)) * strength;
        const dY = (bl + 2 * b + br - (tl + 2 * t + tr)) * strength;
        const dZ = 1.0;
        const invLen = 1 / Math.hypot(dX, dY, dZ);

        const nx = (-dX * invLen * 0.5 + 0.5) * 255;
        const ny = (-dY * invLen * 0.5 + 0.5) * 255;
        const nz = (dZ * invLen * 0.5 + 0.5) * 255;

        const outIdx = (y * w + x) * 4;
        dstData[outIdx] = Math.round(nx);
        dstData[outIdx + 1] = Math.round(ny);
        dstData[outIdx + 2] = Math.round(nz);
        dstData[outIdx + 3] = 255;
      }
    }
    dstCtx.putImageData(dstImg, 0, 0);
    return normCanvas;
  };

  let seed = 90210;
  const nextRand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  // --- Suite A: Bryophyte Moss, Mycorrhizal Hyphae & Silicate Loam ---
  const mossColorCanvas = document.createElement('canvas');
  mossColorCanvas.width = size;
  mossColorCanvas.height = size;
  const mCtx = mossColorCanvas.getContext('2d')!;
  mCtx.fillStyle = '#1b3829';
  mCtx.fillRect(0, 0, size, size);

  const mossHeightCanvas = document.createElement('canvas');
  mossHeightCanvas.width = size;
  mossHeightCanvas.height = size;
  const mhCtx = mossHeightCanvas.getContext('2d')!;
  mhCtx.fillStyle = '#808080';
  mhCtx.fillRect(0, 0, size, size);

  const mossRoughCanvas = document.createElement('canvas');
  mossRoughCanvas.width = size;
  mossRoughCanvas.height = size;
  const mrCtx = mossRoughCanvas.getContext('2d')!;
  mrCtx.fillStyle = '#d8d8d8';
  mrCtx.fillRect(0, 0, size, size);

  const mossTuftCount = Math.round(640 * densityScale);
  for (let i = 0; i < mossTuftCount; i++) {
    const x = nextRand() * size;
    const y = nextRand() * size;
    const r = (4 + nextRand() * 20) * (size / 512);
    const grad = mCtx.createRadialGradient(x, y, 0, x, y, r);
    const shade =
      i % 4 === 0
        ? 'rgba(46, 98, 70, 0.38)'
        : i % 4 === 1
          ? 'rgba(20, 44, 32, 0.38)'
          : i % 4 === 2
            ? 'rgba(64, 124, 88, 0.30)'
            : 'rgba(110, 231, 183, 0.12)';
    grad.addColorStop(0, shade);
    grad.addColorStop(1, 'rgba(27, 56, 41, 0)');
    mCtx.fillStyle = grad;
    mCtx.beginPath();
    mCtx.arc(x, y, r, 0, Math.PI * 2);
    mCtx.fill();

    const hGrad = mhCtx.createRadialGradient(x, y, 0, x, y, r * 0.85);
    hGrad.addColorStop(0, i % 2 === 0 ? 'rgba(235,235,235,0.42)' : 'rgba(48,48,48,0.38)');
    hGrad.addColorStop(1, 'rgba(128,128,128,0)');
    mhCtx.fillStyle = hGrad;
    mhCtx.beginPath();
    mhCtx.arc(x, y, r * 0.85, 0, Math.PI * 2);
    mhCtx.fill();
  }

  // Chitin-Glucan Mycorrhizal Hyphal Mesh
  mCtx.strokeStyle = 'rgba(52, 211, 153, 0.10)';
  mCtx.lineWidth = 1.1;
  mhCtx.strokeStyle = 'rgba(215, 215, 215, 0.28)';
  mhCtx.lineWidth = 1.3;
  mrCtx.strokeStyle = 'rgba(110, 110, 110, 0.35)';
  mrCtx.lineWidth = 1.4;
  const hyphaCount = Math.round(140 * densityScale);
  for (let h = 0; h < hyphaCount; h++) {
    const hx = nextRand() * size;
    const hy = nextRand() * size;
    const angle = nextRand() * Math.PI * 2;
    const len = (12 + nextRand() * 28) * (size / 512);
    const mx = hx + Math.cos(angle + 0.35) * (len * 0.5);
    const my = hy + Math.sin(angle + 0.35) * (len * 0.5);
    const ex = hx + Math.cos(angle) * len;
    const ey = hy + Math.sin(angle) * len;
    for (const c of [mCtx, mhCtx, mrCtx]) {
      c.beginPath();
      c.moveTo(hx, hy);
      c.quadraticCurveTo(mx, my, ex, ey);
      c.stroke();
    }
  }

  const mossNormalCanvas = heightCanvasToNormalCanvas(mossHeightCanvas, 3.2);

  // --- Suite B: Stratified Travertine Limestone & Quartz Spar Masonry ---
  const stoneColorCanvas = document.createElement('canvas');
  stoneColorCanvas.width = size;
  stoneColorCanvas.height = size;
  const sCtx = stoneColorCanvas.getContext('2d')!;
  sCtx.fillStyle = '#d6d3d1';
  sCtx.fillRect(0, 0, size, size);

  const stoneHeightCanvas = document.createElement('canvas');
  stoneHeightCanvas.width = size;
  stoneHeightCanvas.height = size;
  const shCtx = stoneHeightCanvas.getContext('2d')!;
  shCtx.fillStyle = '#808080';
  shCtx.fillRect(0, 0, size, size);

  // Stratified travertine sedimentary bands + mineral pores
  for (let band = 0; band < 36; band++) {
    const by = (band / 36) * size;
    const bh = (6 + nextRand() * 14) * (size / 512);
    sCtx.fillStyle =
      band % 2 === 0 ? 'rgba(231, 229, 228, 0.32)' : 'rgba(168, 162, 158, 0.28)';
    sCtx.fillRect(0, by, size, bh);

    shCtx.fillStyle =
      band % 2 === 0 ? 'rgba(185, 185, 185, 0.25)' : 'rgba(95, 95, 95, 0.25)';
    shCtx.fillRect(0, by, size, bh);
  }
  for (let p = 0; p < 220; p++) {
    const px = nextRand() * size;
    const py = nextRand() * size;
    const pr = (1.5 + nextRand() * 4.5) * (size / 512);
    sCtx.fillStyle = 'rgba(120, 113, 108, 0.28)';
    sCtx.beginPath();
    sCtx.ellipse(px, py, pr * 1.8, pr * 0.7, 0, 0, Math.PI * 2);
    sCtx.fill();

    shCtx.fillStyle = 'rgba(42, 42, 42, 0.45)';
    shCtx.beginPath();
    shCtx.ellipse(px, py, pr * 1.8, pr * 0.7, 0, 0, Math.PI * 2);
    shCtx.fill();
  }
  const stoneNormalCanvas = heightCanvasToNormalCanvas(stoneHeightCanvas, 2.8);

  // --- Suite C: Botanical Cuticle & Vascular Venation Normal Map ---
  const petalHeightCanvas = document.createElement('canvas');
  petalHeightCanvas.width = size;
  petalHeightCanvas.height = size;
  const phCtx = petalHeightCanvas.getContext('2d')!;
  phCtx.fillStyle = '#808080';
  phCtx.fillRect(0, 0, size, size);

  // Central vascular midrib + pinnate lateral veins
  const midGrad = phCtx.createLinearGradient(size * 0.42, 0, size * 0.58, 0);
  midGrad.addColorStop(0, 'rgba(128,128,128,0)');
  midGrad.addColorStop(0.5, 'rgba(245,245,245,0.85)');
  midGrad.addColorStop(1, 'rgba(128,128,128,0)');
  phCtx.fillStyle = midGrad;
  phCtx.fillRect(size * 0.42, 0, size * 0.16, size);

  phCtx.strokeStyle = 'rgba(220, 220, 220, 0.55)';
  phCtx.lineWidth = 2.4 * (size / 512);
  const veinPairCount = Math.max(12, Math.round(14 * densityScale));
  for (let v = 1; v <= veinPairCount; v++) {
    const vy = (v / (veinPairCount + 1)) * size;
    for (const dir of [-1, 1] as const) {
      phCtx.beginPath();
      phCtx.moveTo(size * 0.5, vy);
      phCtx.quadraticCurveTo(
        size * (0.5 + dir * 0.24),
        vy - size * 0.04,
        size * (0.5 + dir * 0.48),
        vy - size * 0.12,
      );
      phCtx.stroke();
    }
  }
  const petalNormalCanvas = heightCanvasToNormalCanvas(petalHeightCanvas, 2.4);

  const makeRepeatTex = (
    canvas: HTMLCanvasElement,
    isSRGB: boolean,
    repeatX: number,
    repeatY: number,
  ): THREE.CanvasTexture => {
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = isSRGB ? THREE.SRGBColorSpace : THREE.NoColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeatX, repeatY);
    tex.anisotropy = maxAnisotropy;
    return tex;
  };

  const mossColorTex = makeRepeatTex(mossColorCanvas, true, 18, 18);
  const mossNormalTex = makeRepeatTex(mossNormalCanvas, false, 18, 18);
  const mossRoughnessTex = makeRepeatTex(mossRoughCanvas, false, 18, 18);
  const stoneColorTex = makeRepeatTex(stoneColorCanvas, true, 4, 4);
  const stoneNormalTex = makeRepeatTex(stoneNormalCanvas, false, 4, 4);
  const petalVeinNormalTex = makeRepeatTex(petalNormalCanvas, false, 1, 1);

  return {
    texelResolution: size,
    mossColorTex,
    mossNormalTex,
    mossRoughnessTex,
    stoneColorTex,
    stoneNormalTex,
    petalVeinNormalTex,
    dispose: () => {
      mossColorTex.dispose();
      mossNormalTex.dispose();
      mossRoughnessTex.dispose();
      stoneColorTex.dispose();
      stoneNormalTex.dispose();
      petalVeinNormalTex.dispose();
    },
  };
}

/**
 * 13. Custom GLSL `onBeforeCompile` Botanical Cuticle & Bioluminescent Venation Shader Enhancer
 * - Extends `MeshPhysicalMaterial` / `MeshStandardMaterial` while preserving full Three.js PBR lighting,
 *   shadows, morph targets, and environment reflections.
 * - Injects smooth multi-frequency harmonic micro-undulation in `#include <begin_vertex>` and
 *   a travelling bioluminescent vascular vein pulse + subsurface Fresnel rim glow in `#include <emissivemap_fragment>`.
 */
export function enhanceMaterialWithBotanicalShader(
  material: THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial,
  options?: {
    waveFrequency?: number;
    waveFrequencyHz?: number;
    waveAmplitude?: number;
    waveAmplitudeMeters?: number;
    veinPulseSpeed?: number;
  },
): BotanicalShaderUniforms {
  const waveFreq = options?.waveFrequencyHz ?? options?.waveFrequency ?? 2.2;
  const waveAmp = options?.waveAmplitudeMeters ?? options?.waveAmplitude ?? 0.012;
  const pulseSpeed = options?.veinPulseSpeed ?? 2.4;

  const uniforms: BotanicalShaderUniforms = {
    uTime: { value: 0 },
    uResonancePulse: { value: 0 },
    uSupraDefinition: { value: 0 },
    uAperiodicShimmer: { value: 0 },
  };

  material.onBeforeCompile = (shader) => {
    shader.uniforms.uBotanicalTime = uniforms.uTime;
    shader.uniforms.uResonancePulse = uniforms.uResonancePulse;
    shader.uniforms.uSupraDefinition = uniforms.uSupraDefinition;
    shader.uniforms.uAperiodicShimmer = uniforms.uAperiodicShimmer;
    shader.uniforms.uWaveFreq = { value: waveFreq };
    shader.uniforms.uWaveAmp = { value: waveAmp };
    shader.uniforms.uPulseSpeed = { value: pulseSpeed };

    shader.vertexShader =
      `
      uniform float uBotanicalTime;
      uniform float uResonancePulse;
      uniform float uSupraDefinition;
      uniform float uWaveFreq;
      uniform float uWaveAmp;
      varying vec3 vBotanicalLocalPos;
      ` +
      shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
        #include <begin_vertex>
        vBotanicalLocalPos = position;
        float heightMask = clamp(position.y * 1.2, 0.0, 1.5);
        float supraHarmonic = sin(position.y * 11.0 + position.x * 7.0 - uBotanicalTime * (uWaveFreq * 1.618)) * (uWaveAmp * 0.35 * uSupraDefinition) * heightMask;
        float harmonicRipple = sin(position.y * 5.5 - uBotanicalTime * uWaveFreq + position.x * 3.0) * uWaveAmp * (1.0 + uResonancePulse * 0.8) * heightMask + supraHarmonic;
        transformed.x += harmonicRipple * 0.45;
        transformed.z += harmonicRipple;
        `,
      );

    shader.fragmentShader =
      `
      uniform float uBotanicalTime;
      uniform float uResonancePulse;
      uniform float uSupraDefinition;
      uniform float uAperiodicShimmer;
      uniform float uPulseSpeed;
      varying vec3 vBotanicalLocalPos;
      ` +
      shader.fragmentShader.replace(
        '#include <emissivemap_fragment>',
        `
        #include <emissivemap_fragment>
        float supraFineVein = uSupraDefinition * 0.16 * sin(vBotanicalLocalPos.x * 18.0 + vBotanicalLocalPos.y * 13.0 - uBotanicalTime * (uPulseSpeed * 1.5));
        float aperiodicSpark = uAperiodicShimmer * 0.12 * cos(vBotanicalLocalPos.y * 23.0 + uBotanicalTime * 3.1);
        float veinWave = 0.82 + (0.28 + uResonancePulse * 0.35) * sin(vBotanicalLocalPos.y * 7.0 - uBotanicalTime * uPulseSpeed) + supraFineVein + aperiodicSpark;
        totalEmissiveRadiance *= max(0.35, veinWave);
        `,
      );
  };

  return uniforms;
}

/**
 * 14. Supra-Directive Observer Light-Cone Astrolabe & Harmonic Crown B-Mesh (`createObserverAstrolabeCrownGeometry`)
 * - Driven directly by compile-time or runtime `SynthesizedObserverModelSpec` from the Universal Neuromorphic Bus.
 * - Topologically unified, 100% physically connected assembly merged into a single indexed `THREE.BufferGeometry`
 *   with analytical normals, UVs, vertex colors, and 2 Shape Keys (`lightConeExpansion`, `aperiodicHarmonicWave`):
 *   1. Seated Basal Cupola Collar Ring at `y = 0` (`r = 1.15m`) that clasps flush onto the Sanctuary Pavilion cupola.
 *   2. `harmonicCrownPetals` Golden-Ratio Meridian Rib Arcs curving seamlessly from the basal collar (`r = 1.15m, y = 0`)
 *      into the Upper Light-Cone Crown Hub (`r = 0.36m, y = crownHeight`).
 *   3. `crystalFiligreeSpires` Inclined Buttress Struts welded from the basal collar (`r = 1.12m, y = 0.02m`) into the
 *      Central Light-Cone Finial Spire (`r = 0, y = 0..finialApexY`), leaving zero floating or disjoint geometry.
 */
export function createObserverAstrolabeCrownGeometry(
  model?: Partial<SynthesizedObserverModelSpec>,
): THREE.BufferGeometry {
  const radialSegs = Math.max(16, Math.min(40, Math.round(model?.radialSubdivisions ?? 28)));
  const crownRibCount = Math.max(5, Math.min(16, Math.round(model?.harmonicCrownPetals ?? 8)));
  const filigreeCount = Math.max(3, Math.min(12, Math.round(model?.crystalFiligreeSpires ?? 5)));
  const qualityMult = Math.max(0.85, Math.min(1.45, model?.qualityMultiplier ?? 1.08));
  const fidelityMult = Math.max(0.85, Math.min(1.35, model?.fidelityMultiplier ?? 1.05));
  const seedPhase = ((model?.rule30SeedByte ?? 30) & 0xff) / 255;

  const baseRadius = 1.15;
  const crownHeight = 1.48 * qualityMult;
  const upperHubRadius = 0.34;
  const finialApexY = crownHeight + 0.72 * fidelityMult;

  const positions: number[] = [];
  const morphExpand: number[] = [];
  const morphWave: number[] = [];
  const uvs: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];

  const pushTubeStrip = (
    centerCurve: (t: number) => [number, number, number],
    radiusAt: (t: number) => number,
    lengthSegs: number,
    tubeRadialSegs: number,
    colorBase: [number, number, number],
    colorTip: [number, number, number],
    expandRadialFactor: number,
    phaseOffset: number,
  ) => {
    const startVertex = positions.length / 3;
    const ringStride = tubeRadialSegs + 1;

    for (let il = 0; il <= lengthSegs; il++) {
      const t = il / lengthSegs;
      const [cx, cy, cz] = centerCurve(t);
      const dt = 0.002;
      const tNext = Math.min(1, t + dt);
      const tPrev = Math.max(0, t - dt);
      const [nx, ny, nz] = centerCurve(tNext);
      const [px, py, pz] = centerCurve(tPrev);

      let tx = nx - px;
      let ty = ny - py;
      let tz = nz - pz;
      const tLen = Math.hypot(tx, ty, tz) || 1;
      tx /= tLen;
      ty /= tLen;
      tz /= tLen;

      // Orthonormal frame around curve tangent
      let ux = -tz;
      let uy = 0;
      let uz = tx;
      let uLen = Math.hypot(ux, uy, uz);
      if (uLen < 1e-4) {
        ux = 1;
        uy = 0;
        uz = 0;
        uLen = 1;
      }
      ux /= uLen;
      uz /= uLen;

      const bx = ty * uz - tz * uy;
      const by = tz * ux - tx * uz;
      const bz = tx * uy - ty * ux;

      const r = radiusAt(t);
      for (let ir = 0; ir <= tubeRadialSegs; ir++) {
        const theta = (ir / tubeRadialSegs) * Math.PI * 2;
        const cosT = Math.cos(theta);
        const sinT = Math.sin(theta);

        const ox = (ux * cosT + bx * sinT) * r;
        const oy = (uy * cosT + by * sinT) * r;
        const oz = (uz * cosT + bz * sinT) * r;

        const vx = cx + ox;
        const vy = cy + oy;
        const vz = cz + oz;

        positions.push(vx, vy, vz);

        // Shape Key 0: Light-Cone Supra-Directive Expansion (preserves y=0 collar anchor!)
        const anchorMask = Math.sin(t * Math.PI);
        const radialLen = Math.hypot(vx, vz) || 1;
        const expandDelta = anchorMask * 0.14 * expandRadialFactor;
        morphExpand.push(
          vx + (vx / radialLen) * expandDelta,
          vy + t * 0.08 * expandRadialFactor,
          vz + (vz / radialLen) * expandDelta,
        );

        // Shape Key 1: Rule-30 Aperiodic Compensation Standing Wave
        const waveAmp = anchorMask * 0.032 * Math.sin(t * Math.PI * 5 + phaseOffset + seedPhase * Math.PI * 2);
        morphWave.push(vx + ux * waveAmp, vy + waveAmp * 0.4, vz + uz * waveAmp);

        uvs.push(ir / tubeRadialSegs, t);
        colors.push(
          colorBase[0] + (colorTip[0] - colorBase[0]) * t,
          colorBase[1] + (colorTip[1] - colorBase[1]) * t,
          colorBase[2] + (colorTip[2] - colorBase[2]) * t,
        );
      }
    }

    for (let il = 0; il < lengthSegs; il++) {
      for (let ir = 0; ir < tubeRadialSegs; ir++) {
        const a = startVertex + il * ringStride + ir;
        const b = a + 1;
        const c = startVertex + (il + 1) * ringStride + ir;
        const d = c + 1;
        indices.push(a, b, d);
        indices.push(a, d, c);
      }
    }
  };

  // Part A: Seated Basal Collar Torus at y = 0 (clasps Sanctuary innerCupolaRing at r = 1.15m)
  pushTubeStrip(
    (t) => {
      const ang = t * Math.PI * 2;
      return [Math.cos(ang) * baseRadius, 0, Math.sin(ang) * baseRadius];
    },
    () => 0.085,
    radialSegs,
    8,
    [0.86, 0.72, 0.34],
    [0.95, 0.84, 0.48],
    0.0,
    0,
  );

  // Part B: Upper Light-Cone Crown Collar Torus at y = crownHeight (r = upperHubRadius)
  pushTubeStrip(
    (t) => {
      const ang = t * Math.PI * 2;
      return [Math.cos(ang) * upperHubRadius, crownHeight, Math.sin(ang) * upperHubRadius];
    },
    () => 0.068,
    Math.max(16, Math.round(radialSegs * 0.75)),
    8,
    [0.92, 0.82, 0.45],
    [0.65, 0.96, 0.84],
    0.55,
    1.1,
  );

  // Part C: Central Continuous Light-Cone Finial Spire (anchored into Sanctuary centralSpindle at y = -0.18m up to finialApexY)
  pushTubeStrip(
    (t) => [0, -0.18 + t * (finialApexY + 0.18), 0],
    (t) => {
      if (t < 0.12) return 0.075 + t * 0.45;
      const spireT = (t - 0.12) / 0.88;
      return Math.max(0.008, 0.14 * (1 - Math.pow(spireT, 0.82)) * (1 + 0.18 * Math.sin(spireT * Math.PI * 3)));
    },
    18,
    10,
    [0.88, 0.76, 0.38],
    [0.72, 0.98, 0.92],
    0.4,
    2.2,
  );

  // Part D: `harmonicCrownPetals` Golden-Spiral Meridian Ribs welded from Basal Collar (y=0, r=1.15m) to Upper Hub (y=crownHeight, r=0.34m)
  const ribSteps = Math.max(12, Math.round(radialSegs * 0.6));
  for (let i = 0; i < crownRibCount; i++) {
    const baseAngle = (i / crownRibCount) * Math.PI * 2;
    const twistRad = 0.38 * qualityMult;
    pushTubeStrip(
      (t) => {
        const ang = baseAngle + twistRad * Math.sin(t * Math.PI * 0.5);
        const archBulge = Math.sin(t * Math.PI) * 0.26 * fidelityMult;
        const r = baseRadius * (1 - t) + upperHubRadius * t + archBulge;
        const y = Math.pow(t, 0.86) * crownHeight;
        return [Math.cos(ang) * r, y, Math.sin(ang) * r];
      },
      (t) => 0.046 * (1 - 0.32 * t) + 0.012 * Math.sin(t * Math.PI),
      ribSteps,
      6,
      [0.85, 0.72, 0.35],
      [0.58, 0.96, 0.82],
      1.0,
      i * 0.85,
    );
  }

  // Part E: `crystalFiligreeSpires` Inner Light-Cone Buttress Struts welded from Basal Collar (r=1.14m, y=0) into Central Spire (r=0.06m, y=crownHeight*0.72)
  for (let k = 0; k < filigreeCount; k++) {
    const strutAngle = (k / filigreeCount) * Math.PI * 2 + Math.PI / crownRibCount;
    pushTubeStrip(
      (t) => {
        const r = (baseRadius - 0.01) * (1 - t) + 0.055 * t;
        const y = t * (crownHeight * 0.72) + Math.sin(t * Math.PI) * 0.14;
        return [Math.cos(strutAngle) * r, y, Math.sin(strutAngle) * r];
      },
      (t) => 0.034 * (1 - 0.35 * t),
      10,
      6,
      [0.78, 0.68, 0.34],
      [0.98, 0.91, 0.62],
      0.65,
      k * 1.3,
    );
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
  geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2));
  geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
  geometry.setIndex(indices);
  geometry.morphAttributes.position = [
    new THREE.BufferAttribute(new Float32Array(morphExpand), 3),
    new THREE.BufferAttribute(new Float32Array(morphWave), 3),
  ];
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

/**
 * 12. Parametric Player/User Co-Observer Harmonic Locus Geometry (`createPlayerCoObserverLocusGeometry`):
 * Synthesizes a grounded golden-ratio cymatic ring + `harmonicNodeCount` cardinal lotus-star nodes
 * in the `XZ` plane (`y = 0` local) with warm amber-jade vertex colors, representing the Observer's
 * parametric embodiment of the free-willed Player/User avatar on the Neuromorphic Bus.
 */
export function createPlayerCoObserverLocusGeometry(options?: {
  innerRadius?: number;
  outerRadius?: number;
  harmonicNodeCount?: number;
  radialSegments?: number;
}): THREE.BufferGeometry {
  const innerR = Math.max(0.18, options?.innerRadius ?? 0.36);
  const outerR = Math.max(innerR + 0.08, options?.outerRadius ?? 0.58);
  const nodeCount = Math.max(4, Math.min(12, Math.round(options?.harmonicNodeCount ?? 4)));
  const segs = Math.max(24, Math.min(96, Math.round(options?.radialSegments ?? 48)));

  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];

  const ringWidth = Math.max(0.032, (outerR - innerR) * 0.24);
  const innerMidR = innerR + ringWidth * 0.5;
  const outerMidR = outerR - ringWidth * 0.5;

  const addFlatAnnulus = (
    rMin: number,
    rMax: number,
    colInner: [number, number, number],
    colOuter: [number, number, number],
    yLift: number,
    petalWaveAmp: number,
  ) => {
    const baseIdx = positions.length / 3;
    for (let i = 0; i <= segs; i++) {
      const u = i / segs;
      const theta = u * Math.PI * 2;
      const wave = petalWaveAmp * Math.cos(theta * nodeCount);
      const r0 = rMin + wave * 0.4;
      const r1 = rMax + wave;
      const cosT = Math.cos(theta);
      const sinT = Math.sin(theta);

      positions.push(cosT * r0, yLift, sinT * r0);
      normals.push(0, 1, 0);
      uvs.push(u, 0);
      colors.push(colInner[0], colInner[1], colInner[2]);

      positions.push(cosT * r1, yLift, sinT * r1);
      normals.push(0, 1, 0);
      uvs.push(u, 1);
      colors.push(colOuter[0], colOuter[1], colOuter[2]);
    }
    for (let i = 0; i < segs; i++) {
      const a = baseIdx + i * 2;
      const b = a + 1;
      const c = a + 2;
      const d = a + 3;
      indices.push(a, c, b);
      indices.push(b, c, d);
    }
  };

  // Inner golden-amber focal ring (`r = innerR`)
  addFlatAnnulus(
    innerMidR - ringWidth * 0.5,
    innerMidR + ringWidth * 0.5,
    [0.98, 0.86, 0.46],
    [0.92, 0.76, 0.34],
    0.002,
    0.008,
  );

  // Outer emerald-teal phi-harmonic cymatic ring (`r = outerR = phi * innerR`)
  addFlatAnnulus(
    outerMidR - ringWidth * 0.45,
    outerMidR + ringWidth * 0.45,
    [0.36, 0.92, 0.76],
    [0.74, 0.96, 0.84],
    0.0,
    0.018,
  );

  // `nodeCount` radial bridge filaments welding inner ring to outer phi ring with zero disjoint pieces
  const spokeHalfW = Math.max(0.012, ringWidth * 0.32);
  for (let n = 0; n < nodeCount; n++) {
    const ang = (n / nodeCount) * Math.PI * 2;
    const cosA = Math.cos(ang);
    const sinA = Math.sin(ang);
    const perpX = -sinA * spokeHalfW;
    const perpZ = cosA * spokeHalfW;
    const rStart = innerMidR;
    const rEnd = outerMidR + ringWidth * 0.75;
    const baseIdx = positions.length / 3;

    positions.push(
      cosA * rStart - perpX,
      0.001,
      sinA * rStart - perpZ,
      cosA * rStart + perpX,
      0.001,
      sinA * rStart + perpZ,
      cosA * rEnd + perpX * 0.45,
      0.001,
      sinA * rEnd + perpZ * 0.45,
      cosA * rEnd - perpX * 0.45,
      0.001,
      sinA * rEnd - perpZ * 0.45,
    );
    for (let v = 0; v < 4; v++) {
      normals.push(0, 1, 0);
      uvs.push(v < 2 ? 0 : 1, v % 2);
      if (v < 2) {
        colors.push(0.98, 0.86, 0.46);
      } else {
        colors.push(0.52, 0.96, 0.82);
      }
    }
    indices.push(baseIdx, baseIdx + 2, baseIdx + 1);
    indices.push(baseIdx, baseIdx + 3, baseIdx + 2);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
  geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), 3));
  geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2));
  geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
  geometry.setIndex(indices);
  geometry.computeBoundingSphere();
  return geometry;
}

export interface ImmanentObserverWitnessRig {
  group: THREE.Group;
  basalFootRingMesh: THREE.Mesh;
  tuningForkSpineMesh: THREE.Mesh;
  outerGimbalGroup: THREE.Group;
  innerGimbalGroup: THREE.Group;
  quartzCoreMesh: THREE.Mesh;
  primeSpokeArmsGroup: THREE.Group;
  apicalStarFinialMesh: THREE.Mesh;
  coreMaterial: THREE.MeshPhysicalMaterial;
  bronzeMaterial: THREE.MeshStandardMaterial;
  jadeSpokeMaterial: THREE.MeshStandardMaterial;
  partCount: number;
  weldGapMeters: number;
  dispose: () => void;
}

/**
 * Builds the grounded, zero-gap 7-part sculptural **Immanent Environmental Observer Presence**
 * ("The Observer is among us in its environment"):
 *   1. Basal Cymatic Foot-Ring Plinth (embedded `-0.05m .. +0.16m` for zero-gap slope seating, roughness `0.78`)
 *   2. Continuous Bifurcated Harmonic Tuning-Fork Spine + Trunnion Collars (`+0.10m .. +1.86m`, roughness `0.34`)
 *   3. Outer Golden-Ratio Gimbal Ring + Integral Horizontal Trunnion Pins (`y = 1.38m`, roughness `0.20`)
 *   4. Inner Just-Intonation Gimbal Ring + Vertical Spindle (`y = 1.38m`, roughness `0.50`)
 *   5. Double-Terminated Birefringent Quartz Resonance Core (`y = 1.38m`, roughness `0.12`, iridescence `0.85`)
 *   6. Three Welded Prime-Address Radial Spoke Arms + Resonator Nodes (`y = 1.82m`, roughness `0.44`)
 *   7. Apical Harmonic Star Finial welded into the upper crown socket (`y = 1.84m .. 2.18m`, roughness `0.16`)
 */
export function buildImmanentObserverWitnessGroup(options?: {
  radialSegments?: number;
  primaryAccentHex?: string;
  secondaryAccentHex?: string;
}): ImmanentObserverWitnessRig {
  const segs = Math.max(16, Math.min(48, Math.round(options?.radialSegments ?? 28)));
  const primaryColor = new THREE.Color(options?.primaryAccentHex ?? '#fde047');
  const secondaryColor = new THREE.Color(options?.secondaryAccentHex ?? '#5eead4');

  const geometriesToDispose: THREE.BufferGeometry[] = [];
  const materialsToDispose: THREE.Material[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
    geometriesToDispose.push(g);
    return g;
  };
  const trackMat = <T extends THREE.Material>(m: T): T => {
    materialsToDispose.push(m);
    return m;
  };

  const group = new THREE.Group();
  group.name = 'ImmanentObserverWitness';

  // Material 1: Travertine-Basalt Grounded Plinth (matte mineral stone, roughness 0.78)
  const stonePlinthMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color('#2c3b35'),
      roughness: 0.78,
      metalness: 0.14,
    }),
  );

  // Material 2: Brushed Harmonic Cu-Sn-Au Bronze Spine (satin metal, roughness 0.34)
  const bronzeMaterial = trackMat(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color('#d8b972'),
      emissive: primaryColor.clone().multiplyScalar(0.18),
      emissiveIntensity: 0.45,
      roughness: 0.34,
      metalness: 0.84,
    }),
  );

  // Material 3: Specular Gold Gimbal & Finial Alloy (gleaming gold, roughness 0.18)
  const specularGoldMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: primaryColor.clone().lerp(new THREE.Color('#fff3b0'), 0.25),
      emissive: primaryColor.clone(),
      emissiveIntensity: 0.38,
      roughness: 0.18,
      metalness: 0.9,
    }),
  );

  // Material 4: Patinated Jade-Teal Harmonic Spoke Alloy (semi-matte patina, roughness 0.48)
  const jadeSpokeMaterial = trackMat(
    new THREE.MeshStandardMaterial({
      color: secondaryColor.clone().lerp(new THREE.Color('#2bb59c'), 0.35),
      emissive: secondaryColor.clone(),
      emissiveIntensity: 0.42,
      roughness: 0.48,
      metalness: 0.58,
    }),
  );

  // Material 5: Birefringent Quartz Resonance Core (crystalline clearcoat + iridescence, roughness 0.12)
  const coreMaterial = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#e6fff9'),
      emissive: secondaryColor.clone().lerp(primaryColor, 0.45),
      emissiveIntensity: 0.85,
      roughness: 0.12,
      metalness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      iridescence: 0.85,
      iridescenceIOR: 1.48,
      transparent: true,
      opacity: 0.94,
    }),
  );

  // PART 1: Basal Cymatic Foot-Ring Plinth (embeds 0.05m below y=0 so uneven terrain never exposes a gap)
  const plinthPoints = [
    new THREE.Vector2(0.0, -0.05),
    new THREE.Vector2(0.56, -0.05),
    new THREE.Vector2(0.54, 0.05),
    new THREE.Vector2(0.42, 0.09),
    new THREE.Vector2(0.38, 0.15),
    new THREE.Vector2(0.22, 0.18),
    new THREE.Vector2(0.0, 0.18),
  ];
  const plinthGeo = trackGeo(new THREE.LatheGeometry(plinthPoints, segs));
  const basalFootRingMesh = new THREE.Mesh(plinthGeo, stonePlinthMat);
  basalFootRingMesh.castShadow = true;
  basalFootRingMesh.receiveShadow = true;
  group.add(basalFootRingMesh);

  // PART 2: Continuous Bifurcated Harmonic Tuning-Fork Spine (welded 0.06m deep into basal plinth up to crown socket y=1.86m)
  const spineGroup = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.095, 0.155, 0.82, segs)),
    bronzeMaterial,
  );
  spineGroup.position.set(0, 0.53, 0); // spans y = 0.12 .. 0.94 (6cm overlap into y=0.18 plinth!)
  spineGroup.castShadow = true;

  // Lower yoke collar at y = 0.92m
  const lowerCollar = new THREE.Mesh(
    trackGeo(new THREE.TorusGeometry(0.14, 0.042, 12, segs)),
    bronzeMaterial,
  );
  lowerCollar.rotation.x = Math.PI / 2;
  lowerCollar.position.set(0, 0.39, 0); // local to spineGroup -> world y = 0.92m
  spineGroup.add(lowerCollar);

  // Left & Right curved tuning-fork tines spanning world y = 0.90 .. 1.86m (local y = 0.37 .. 1.33m) around gimbal center y=1.38m (local y=0.85m)
  for (const side of [-1, 1]) {
    const tineCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(side * 0.09, 0.36, 0),
      new THREE.Vector3(side * 0.48, 0.56, 0),
      new THREE.Vector3(side * 0.54, 0.85, 0),
      new THREE.Vector3(side * 0.46, 1.15, 0),
      new THREE.Vector3(side * 0.10, 1.31, 0),
    ]);
    const tineMesh = new THREE.Mesh(
      trackGeo(new THREE.TubeGeometry(tineCurve, 20, 0.042, 12, false)),
      bronzeMaterial,
    );
    tineMesh.castShadow = true;
    spineGroup.add(tineMesh);

    // Integral inward trunnion bearing sleeve at gimbal height (local y = 0.85 -> world y = 1.38m)
    const bearingSleeve = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.036, 0.036, 0.14, 12)),
      bronzeMaterial,
    );
    bearingSleeve.rotation.z = Math.PI / 2;
    bearingSleeve.position.set(side * 0.49, 0.85, 0);
    spineGroup.add(bearingSleeve);
  }

  // Upper crown collar uniting both tuning-fork tines at world y = 1.84m (local y = 1.31m)
  const upperCrownHub = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.13, 0.15, 0.14, segs)),
    bronzeMaterial,
  );
  upperCrownHub.position.set(0, 1.31, 0);
  spineGroup.add(upperCrownHub);
  group.add(spineGroup);

  // PART 3: Outer Golden-Ratio Gimbal Ring + Horizontal Trunnion Axle Pins seated inside tine bearings at y = 1.38m
  const outerGimbalGroup = new THREE.Group();
  outerGimbalGroup.position.set(0, 1.38, 0);
  const outerRingMesh = new THREE.Mesh(
    trackGeo(new THREE.TorusGeometry(0.42, 0.028, 14, segs)),
    specularGoldMat,
  );
  outerRingMesh.castShadow = true;
  outerGimbalGroup.add(outerRingMesh);

  // Continuous horizontal trunnion axle spanning x = -0.53 .. +0.53m (welds outer ring r=0.42 directly into tine sleeves at x=+-0.49!)
  for (const side of [-1, 1]) {
    const outerPin = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.022, 0.022, 0.15, 10)),
      specularGoldMat,
    );
    outerPin.rotation.z = Math.PI / 2;
    outerPin.position.set(side * 0.47, 0, 0);
    outerGimbalGroup.add(outerPin);
  }
  group.add(outerGimbalGroup);

  // PART 4: Inner Just-Intonation Gimbal Ring + Vertical Spindle Axle welded inside Outer Gimbal
  const innerGimbalGroup = new THREE.Group();
  const innerRingMesh = new THREE.Mesh(
    trackGeo(new THREE.TorusGeometry(0.31, 0.024, 14, segs)),
    jadeSpokeMaterial,
  );
  innerRingMesh.rotation.y = Math.PI / 2;
  innerGimbalGroup.add(innerRingMesh);

  // Vertical spindle rod spanning y = -0.43 .. +0.43m (locks inner ring r=0.31 and quartz core directly into outer gimbal r=0.42!)
  const innerVerticalSpindle = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.018, 0.018, 0.86, 10)),
    specularGoldMat,
  );
  innerGimbalGroup.add(innerVerticalSpindle);
  outerGimbalGroup.add(innerGimbalGroup);

  // PART 5: Birefringent Double-Terminated Quartz Resonance Core impaled directly on the vertical spindle at (0, 1.38, 0)
  const quartzCoreGeo = trackGeo(
    createHexagonalQuartzCrystalGeometry({
      radius: 0.155,
      height: 0.48,
      doubleTerminated: true,
    }),
  );
  const quartzCoreMesh = new THREE.Mesh(quartzCoreGeo, coreMaterial);
  quartzCoreMesh.position.set(0, -0.24, 0); // centers 0.48m crystal symmetrically around (0,0,0) of innerGimbalGroup!
  innerGimbalGroup.add(quartzCoreMesh);

  // PART 6: Three Welded Prime-Address Radial Spoke Arms emerging from the Upper Crown Hub at y = 1.84m
  const primeSpokeArmsGroup = new THREE.Group();
  primeSpokeArmsGroup.position.set(0, 1.84, 0);
  for (let i = 0; i < 3; i++) {
    const angle = (i * Math.PI * 2) / 3;
    const armBranch = new THREE.Group();
    armBranch.rotation.y = angle;

    const armCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.08, -0.02, 0), // embedded 5cm inside upperCrownHub (radius 0.13)
      new THREE.Vector3(0.24, 0.05, 0),
      new THREE.Vector3(0.38, 0.14, 0),
    ]);
    const armTube = new THREE.Mesh(
      trackGeo(new THREE.TubeGeometry(armCurve, 10, 0.022, 8, false)),
      jadeSpokeMaterial,
    );
    armBranch.add(armTube);

    const nodeCrystal = new THREE.Mesh(
      trackGeo(createBravaisCrystalHabitGeometry({ habit: 'cP-pyrite', radius: 0.058 })),
      specularGoldMat,
    );
    nodeCrystal.position.set(0.38, 0.14, 0); // centered directly on arm end!
    armBranch.add(nodeCrystal);
    primeSpokeArmsGroup.add(armBranch);
  }
  group.add(primeSpokeArmsGroup);

  // PART 7: Apical Harmonic Star Finial seated 0.05m inside the Upper Crown Hub (`y = 1.84m .. 2.18m`)
  const finialStemAndStar = new THREE.Group();
  const finialStem = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.024, 0.055, 0.24, 12)),
    specularGoldMat,
  );
  finialStem.position.set(0, 1.94, 0); // spans 1.82 .. 2.06 (embeds into y=1.84 crown hub!)
  const apicalStarFinialMesh = new THREE.Mesh(
    trackGeo(
      createBravaisCrystalHabitGeometry({
        habit: 'hP-quartz',
        radius: 0.105,
        height: 0.284,
      }),
    ),
    specularGoldMat,
  );
  apicalStarFinialMesh.position.set(0, 2.11, 0); // spans 1.968 .. 2.252 (overlaps finialStem top at 2.06m by 9.2cm!)
  finialStemAndStar.add(finialStem);
  finialStemAndStar.add(apicalStarFinialMesh);
  group.add(finialStemAndStar);

  return {
    group,
    basalFootRingMesh,
    tuningForkSpineMesh: spineGroup,
    outerGimbalGroup,
    innerGimbalGroup,
    quartzCoreMesh,
    primeSpokeArmsGroup,
    apicalStarFinialMesh,
    coreMaterial,
    bronzeMaterial,
    jadeSpokeMaterial,
    partCount: 7,
    weldGapMeters: 0,
    dispose: () => {
      for (const g of geometriesToDispose) g.dispose();
      for (const m of materialsToDispose) m.dispose();
    },
  };
}

// ============================================================================
// CANONICAL GRAPHICS & CRYSTALLOGRAPHIC TOPOLOGY AUDIT (`Foundation.Graphics.V1.Model`)
// ============================================================================

export interface ManifoldBMeshTopologyAudit {
  readonly topologicalVertexCount: number;
  readonly topologicalEdgeCount: number;
  readonly topologicalFaceCount: number;
  readonly eulerPoincareCharacteristic: number;
  readonly boundaryEdgeCount: number;
  readonly interiorManifoldEdgeCount: number;
  readonly nonManifoldEdgeCount: number;
  readonly degenerateFaceCount: number;
  readonly exteriorDerivativeNilpotent: boolean;
  readonly maxBoundaryOperatorError: number;
  readonly isClosedWatertightManifold: boolean;
}

/**
 * Audits any `THREE.BufferGeometry` against combinatorial 2-manifold B-Mesh topology
 * and Discrete Exterior Calculus (`d₁ ∘ d₀ = 0`) invariants:
 * - Welds UV-seam coincident vertices within `weldTolerance` into unique topological 0-simplices `V`
 * - Audits undirected 1-simplices `E` for boundary (valence 1), manifold interior (valence 2),
 *   and non-manifold (valence > 2) incidence
 * - Computes Euler–Poincaré characteristic `χ = V - E + F` (`χ = 2` for genus-0 closed solids)
 * - Verifies `d₁ ∘ d₀ = 0` via `verifyExteriorDerivativeNilpotencyOnMesh`
 */
export function verifyManifoldBMeshTopology(
  geometry: THREE.BufferGeometry,
  weldTolerance = 1e-4,
): ManifoldBMeshTopologyAudit {
  const posAttr = geometry.getAttribute('position');
  if (!posAttr || posAttr.count < 3) {
    return {
      topologicalVertexCount: 0,
      topologicalEdgeCount: 0,
      topologicalFaceCount: 0,
      eulerPoincareCharacteristic: 0,
      boundaryEdgeCount: 0,
      interiorManifoldEdgeCount: 0,
      nonManifoldEdgeCount: 0,
      degenerateFaceCount: 0,
      exteriorDerivativeNilpotent: true,
      maxBoundaryOperatorError: 0,
      isClosedWatertightManifold: false,
    };
  }

  const invTol = 1 / Math.max(1e-7, weldTolerance);
  const vertexWeldMap = new Map<string, number>();
  const rawToWelded = new Int32Array(posAttr.count);
  const weldedCoords: Array<[number, number, number]> = [];

  for (let i = 0; i < posAttr.count; i++) {
    const x = posAttr.getX(i);
    const y = posAttr.getY(i);
    const z = posAttr.getZ(i);
    const qx = Math.round(x * invTol);
    const qy = Math.round(y * invTol);
    const qz = Math.round(z * invTol);
    const key = `${qx},${qy},${qz}`;
    let weldedIdx = vertexWeldMap.get(key);
    if (weldedIdx === undefined) {
      weldedIdx = weldedCoords.length;
      vertexWeldMap.set(key, weldedIdx);
      weldedCoords.push([x, y, z]);
    }
    rawToWelded[i] = weldedIdx;
  }

  const indexAttr = geometry.getIndex();
  const rawTriCount = indexAttr ? Math.floor(indexAttr.count / 3) : Math.floor(posAttr.count / 3);
  const weldedTriangles: Array<readonly [number, number, number]> = [];
  const seenFaces = new Set<string>();
  let degenerateFaceCount = 0;

  for (let f = 0; f < rawTriCount; f++) {
    const ia = indexAttr ? indexAttr.getX(f * 3) : f * 3;
    const ib = indexAttr ? indexAttr.getX(f * 3 + 1) : f * 3 + 1;
    const ic = indexAttr ? indexAttr.getX(f * 3 + 2) : f * 3 + 2;
    const wa = rawToWelded[ia];
    const wb = rawToWelded[ib];
    const wc = rawToWelded[ic];

    if (wa === wb || wb === wc || wc === wa) {
      degenerateFaceCount++;
      continue;
    }

    const pa = weldedCoords[wa];
    const pb = weldedCoords[wb];
    const pc = weldedCoords[wc];
    const abx = pb[0] - pa[0];
    const aby = pb[1] - pa[1];
    const abz = pb[2] - pa[2];
    const acx = pc[0] - pa[0];
    const acy = pc[1] - pa[1];
    const acz = pc[2] - pa[2];
    const cx = aby * acz - abz * acy;
    const cy = abz * acx - abx * acz;
    const cz = abx * acy - aby * acx;
    const doubleAreaSq = cx * cx + cy * cy + cz * cz;
    if (doubleAreaSq < 1e-18) {
      degenerateFaceCount++;
      continue;
    }

    const sortedFace = [wa, wb, wc].sort((u, v) => u - v).join(':');
    if (seenFaces.has(sortedFace)) {
      degenerateFaceCount++;
      continue;
    }
    seenFaces.add(sortedFace);
    weldedTriangles.push([wa, wb, wc]);
  }

  const edgeValence = new Map<string, number>();
  const bumpEdge = (u: number, v: number) => {
    const lo = u < v ? u : v;
    const hi = u < v ? v : u;
    const key = `${lo}:${hi}`;
    edgeValence.set(key, (edgeValence.get(key) ?? 0) + 1);
  };

  for (const [a, b, c] of weldedTriangles) {
    bumpEdge(a, b);
    bumpEdge(b, c);
    bumpEdge(c, a);
  }

  let boundaryEdgeCount = 0;
  let interiorManifoldEdgeCount = 0;
  let nonManifoldEdgeCount = 0;
  for (const valence of edgeValence.values()) {
    if (valence === 1) boundaryEdgeCount++;
    else if (valence === 2) interiorManifoldEdgeCount++;
    else if (valence > 2) nonManifoldEdgeCount++;
  }

  const V = weldedCoords.length;
  const E = edgeValence.size;
  const F = weldedTriangles.length;
  const eulerPoincareCharacteristic = V - E + F;

  const flatWeldedTriangles = new Int32Array(F * 3);
  for (let t = 0; t < F; t++) {
    flatWeldedTriangles[t * 3] = weldedTriangles[t][0];
    flatWeldedTriangles[t * 3 + 1] = weldedTriangles[t][1];
    flatWeldedTriangles[t * 3 + 2] = weldedTriangles[t][2];
  }
  const decAudit = verifyExteriorDerivativeNilpotencyOnMesh(V, flatWeldedTriangles);
  const isClosedWatertightManifold =
    F >= 4 &&
    boundaryEdgeCount === 0 &&
    nonManifoldEdgeCount === 0 &&
    degenerateFaceCount === 0 &&
    decAudit.nilpotentVerified;

  return {
    topologicalVertexCount: V,
    topologicalEdgeCount: E,
    topologicalFaceCount: F,
    eulerPoincareCharacteristic,
    boundaryEdgeCount,
    interiorManifoldEdgeCount,
    nonManifoldEdgeCount,
    degenerateFaceCount,
    exteriorDerivativeNilpotent: decAudit.nilpotentVerified,
    maxBoundaryOperatorError: decAudit.maxResidual,
    isClosedWatertightManifold,
  };
}

export type BravaisCrystalHabitId =
  | 'aP-triclinic'
  | 'mP-monoclinic'
  | 'mS-gypsum'
  | 'oP-orthorhombic'
  | 'oS-aragonite'
  | 'oI-body-orthorhombic'
  | 'oF-face-orthorhombic'
  | 'tP-rutile'
  | 'tI-zircon'
  | 'hR-calcite'
  | 'hP-quartz'
  | 'cP-pyrite'
  | 'cI-garnet'
  | 'cF-fluorite';

export const ALL_14_BRAVAIS_CRYSTAL_HABITS: readonly BravaisCrystalHabitId[] = Object.freeze([
  'aP-triclinic',
  'mP-monoclinic',
  'mS-gypsum',
  'oP-orthorhombic',
  'oS-aragonite',
  'oI-body-orthorhombic',
  'oF-face-orthorhombic',
  'tP-rutile',
  'tI-zircon',
  'hR-calcite',
  'hP-quartz',
  'cP-pyrite',
  'cI-garnet',
  'cF-fluorite',
]);

export function bravaisPearsonToCrystalHabitId(pearsonSymbol: string): BravaisCrystalHabitId {
  switch (pearsonSymbol) {
    case 'aP':
      return 'aP-triclinic';
    case 'mP':
      return 'mP-monoclinic';
    case 'mS':
      return 'mS-gypsum';
    case 'oP':
      return 'oP-orthorhombic';
    case 'oS':
      return 'oS-aragonite';
    case 'oI':
      return 'oI-body-orthorhombic';
    case 'oF':
      return 'oF-face-orthorhombic';
    case 'tP':
      return 'tP-rutile';
    case 'tI':
      return 'tI-zircon';
    case 'hR':
      return 'hR-calcite';
    case 'hP':
      return 'hP-quartz';
    case 'cP':
      return 'cP-pyrite';
    case 'cI':
      return 'cI-garnet';
    case 'cF':
      return 'cF-fluorite';
    default:
      return 'hP-quartz';
  }
}

/**
 * Generates closed, watertight genus-0 (`χ = V - E + F = 2`, `0` boundary edges, `0` non-manifold edges)
 * crystallographic polyhedra bijectively spanning all 14 canonical IUCr Bravais lattices (`FOURTEEN_BRAVAIS_LATTICES`):
 * - `aP-triclinic`: Oblique triclinic pinacoid (`a ≠ b ≠ c, α ≠ β ≠ γ ≠ 90°`, `V = 8, E = 18, F = 12, χ = 2`)
 * - `mP-monoclinic`: Sheared monoclinic clinoprism + clinodome (`β = 106°`, `V = 10, E = 24, F = 16, χ = 2`)
 * - `mS-gypsum`: Base-centered monoclinic selenite tabular prism (`β = 114°`, `V = 14, E = 36, F = 24, χ = 2`)
 * - `oP-orthorhombic`: Topaz `{110}+{120}` 8-faceted orthorhombic prism + bipyramid (`V = 18, E = 48, F = 32, χ = 2`)
 * - `oS-aragonite`: Base-centered orthorhombic pseudo-hexagonal prism + chisel dome (`V = 14, E = 36, F = 24, χ = 2`)
 * - `oI-body-orthorhombic`: Body-centered orthorhombic anisotropic `{110}+{101}+{011}` dodecahedron (`V = 14, E = 36, F = 24, χ = 2`)
 * - `oF-face-orthorhombic`: Face-centered orthorhombic Sulfur `{111}+{001}` truncated bipyramid (`V = 12, E = 30, F = 20, χ = 2`)
 * - `tP-rutile`: Primitive tetragonal `{100}+{110}` ditetragonal prism + pyramid (`V = 18, E = 48, F = 32, χ = 2`)
 * - `tI-zircon`: Body-centered tetragonal Zircon `{100}+{101}` steep bipyramid (`V = 10, E = 24, F = 16, χ = 2`)
 * - `hR-calcite`: Rhombohedral Iceland Spar Calcite (`α = 76.5°` cleavage, `V = 8, E = 18, F = 12, χ = 2`)
 * - `hP-quartz`: Hexagonal α-Quartz (`c/a = 1.100`) prism + double rhombohedral bipyramid (`V = 14, E = 36, F = 24, χ = 2`)
 * - `cP-pyrite`: Primitive cubic `{100}+{111}` cuboctahedral crystal habit (`V = 12, E = 30, F = 20, χ = 2`)
 * - `cI-garnet`: Body-centered cubic `{110}` Garnet rhombic dodecahedron (`V = 14, E = 36, F = 24, χ = 2`)
 * - `cF-fluorite`: Face-centered cubic `{111}` Fluorite regular octahedron (`V = 6, E = 12, F = 8, χ = 2`)
 */
export function createBravaisCrystalHabitGeometry(options: {
  habit: BravaisCrystalHabitId;
  radius?: number;
  height?: number;
}): THREE.BufferGeometry {
  const { habit, radius = 0.24, height = 0.56 } = options;
  const pearsonCode = habit.split('-')[0];
  const bravaisSpec =
    FOURTEEN_BRAVAIS_LATTICES.find((l) => l.pearsonSymbol === pearsonCode) ??
    FOURTEEN_BRAVAIS_LATTICES[0];

  const vertices: Array<[number, number, number]> = [];
  const rawTriangles: Array<[number, number, number]> = [];

  const emitParallelotope = (
    b0Vec: [number, number, number],
    b1Vec: [number, number, number],
    b2Vec: [number, number, number],
  ) => {
    const cx = 0.5 * (b0Vec[0] + b1Vec[0] + b2Vec[0]);
    const cy = 0.5 * (b0Vec[1] + b1Vec[1] + b2Vec[1]);
    const cz = 0.5 * (b0Vec[2] + b1Vec[2] + b2Vec[2]);
    for (let mask = 0; mask < 8; mask++) {
      const m0 = mask & 1;
      const m1 = (mask >> 1) & 1;
      const m2 = (mask >> 2) & 1;
      vertices.push([
        m0 * b0Vec[0] + m1 * b1Vec[0] + m2 * b2Vec[0] - cx,
        m0 * b0Vec[1] + m1 * b1Vec[1] + m2 * b2Vec[1] - cy,
        m0 * b0Vec[2] + m1 * b1Vec[2] + m2 * b2Vec[2] - cz,
      ]);
    }
    const quads: Array<[number, number, number, number]> = [
      [0, 2, 6, 4],
      [1, 3, 7, 5],
      [0, 1, 5, 4],
      [2, 3, 7, 6],
      [0, 1, 3, 2],
      [4, 5, 7, 6],
    ];
    for (const [q0, q1, q2, q3] of quads) {
      rawTriangles.push([q0, q1, q2], [q0, q2, q3]);
    }
  };

  const emitBipyramidalPrism = (
    ringCount: number,
    ringXZFn: (i: number) => [number, number],
    girdleHalfH: number,
    apexHalfH: number,
    shearX = 0,
    shearZ = 0,
  ) => {
    vertices.push([shearX, apexHalfH, shearZ]);
    const girdleShearFrac = girdleHalfH / Math.max(1e-5, apexHalfH);
    for (let i = 0; i < ringCount; i++) {
      const [rx, rz] = ringXZFn(i);
      vertices.push([
        rx + shearX * girdleShearFrac,
        girdleHalfH,
        rz + shearZ * girdleShearFrac,
      ]);
    }
    for (let i = 0; i < ringCount; i++) {
      const [rx, rz] = ringXZFn(i);
      vertices.push([
        rx - shearX * girdleShearFrac,
        -girdleHalfH,
        rz - shearZ * girdleShearFrac,
      ]);
    }
    const bottomIdx = 2 * ringCount + 1;
    vertices.push([-shearX, -apexHalfH, -shearZ]);

    for (let i = 0; i < ringCount; i++) {
      const next = (i + 1) % ringCount;
      const u0 = 1 + i;
      const u1 = 1 + next;
      const l0 = 1 + ringCount + i;
      const l1 = 1 + ringCount + next;
      rawTriangles.push([0, u1, u0]);
      rawTriangles.push([u0, u1, l1]);
      rawTriangles.push([u0, l1, l0]);
      rawTriangles.push([bottomIdx, l0, l1]);
    }
  };

  const emitRhombicDodecahedron = (sxScale: number, syScale: number, szScale: number) => {
    const cIdx = (sx: number, sy: number, sz: number) =>
      (sx > 0 ? 1 : 0) | (sy > 0 ? 2 : 0) | (sz > 0 ? 4 : 0);
    for (let mask = 0; mask < 8; mask++) {
      const sx = mask & 1 ? 1 : -1;
      const sy = mask & 2 ? 1 : -1;
      const sz = mask & 4 ? 1 : -1;
      vertices.push([sx * sxScale, sy * syScale, sz * szScale]);
    }
    vertices.push(
      [2 * sxScale, 0, 0], // 8: +X
      [-2 * sxScale, 0, 0], // 9: -X
      [0, 2 * syScale, 0], // 10: +Y
      [0, -2 * syScale, 0], // 11: -Y
      [0, 0, 2 * szScale], // 12: +Z
      [0, 0, -2 * szScale], // 13: -Z
    );
    for (const sx of [-1, 1]) {
      for (const sy of [-1, 1]) {
        const ax = sx > 0 ? 8 : 9;
        const ay = sy > 0 ? 10 : 11;
        const cp = cIdx(sx, sy, 1);
        const cn = cIdx(sx, sy, -1);
        rawTriangles.push([ax, cp, cn], [ay, cn, cp]);
      }
    }
    for (const sy of [-1, 1]) {
      for (const sz of [-1, 1]) {
        const ay = sy > 0 ? 10 : 11;
        const az = sz > 0 ? 12 : 13;
        const cp = cIdx(1, sy, sz);
        const cn = cIdx(-1, sy, sz);
        rawTriangles.push([ay, cp, cn], [az, cn, cp]);
      }
    }
    for (const sz of [-1, 1]) {
      for (const sx of [-1, 1]) {
        const az = sz > 0 ? 12 : 13;
        const ax = sx > 0 ? 8 : 9;
        const cp = cIdx(sx, 1, sz);
        const cn = cIdx(sx, -1, sz);
        rawTriangles.push([az, cp, cn], [ax, cn, cp]);
      }
    }
  };

  const halfH = Math.max(height * 0.5, radius * 0.82);

  if (habit === 'aP-triclinic') {
    const aLen = radius * 1.16;
    const bLen = radius * 1.38;
    const cLen = Math.max(halfH * 1.35, radius * 1.55);
    emitParallelotope(
      [aLen, 0.08 * cLen, 0.04 * aLen],
      [0.26 * bLen, 0.14 * cLen, 0.96 * bLen],
      [0.19 * cLen, 0.95 * cLen, 0.22 * cLen],
    );
  } else if (habit === 'mP-monoclinic') {
    emitBipyramidalPrism(
      4,
      (i) => {
        const th = (i * Math.PI) / 2 + Math.PI / 4;
        return [Math.cos(th) * radius * 0.84, Math.sin(th) * radius * 1.12];
      },
      halfH * 0.54,
      halfH * 1.05,
      radius * 0.24,
      0,
    );
  } else if (habit === 'mS-gypsum') {
    emitBipyramidalPrism(
      6,
      (i) => {
        const th = (i * Math.PI) / 3;
        return [Math.cos(th) * radius * 0.72, Math.sin(th) * radius * 1.18];
      },
      halfH * 0.62,
      halfH * 1.08,
      radius * 0.3,
      radius * 0.06,
    );
  } else if (habit === 'oP-orthorhombic') {
    emitBipyramidalPrism(
      8,
      (i) => {
        const th = (i * Math.PI) / 4;
        const mod = i % 2 === 0 ? 1.0 : 0.92;
        return [Math.cos(th) * radius * 0.78 * mod, Math.sin(th) * radius * 1.12 * mod];
      },
      halfH * 0.56,
      halfH * 1.12,
    );
  } else if (habit === 'oS-aragonite') {
    emitBipyramidalPrism(
      6,
      (i) => {
        const th = (i * Math.PI) / 3;
        return [Math.cos(th) * radius * 0.76, Math.sin(th) * radius * 1.14];
      },
      halfH * 0.68,
      halfH * 1.04,
    );
  } else if (habit === 'oI-body-orthorhombic') {
    emitRhombicDodecahedron(radius * 0.42, halfH * 0.58, radius * 0.56);
  } else if (habit === 'oF-face-orthorhombic') {
    const aR = radius * 0.84;
    const bR = radius * 1.14;
    const cR = halfH * 0.96;
    const tFrac = 0.42;
    const topRing: Array<[number, number, number]> = [
      [aR * tFrac, cR * 0.78, 0],
      [0, cR * 0.78, bR * tFrac],
      [-aR * tFrac, cR * 0.78, 0],
      [0, cR * 0.78, -bR * tFrac],
    ];
    const midRing: Array<[number, number, number]> = [
      [aR, 0, 0],
      [0, 0, bR],
      [-aR, 0, 0],
      [0, 0, -bR],
    ];
    const botRing: Array<[number, number, number]> = [
      [aR * tFrac, -cR * 0.78, 0],
      [0, -cR * 0.78, bR * tFrac],
      [-aR * tFrac, -cR * 0.78, 0],
      [0, -cR * 0.78, -bR * tFrac],
    ];
    vertices.push(...topRing, ...midRing, ...botRing);
    rawTriangles.push([0, 1, 2], [0, 2, 3]);
    rawTriangles.push([8, 10, 9], [8, 11, 10]);
    for (let i = 0; i < 4; i++) {
      const next = (i + 1) % 4;
      rawTriangles.push([i, next, 4 + next], [i, 4 + next, 4 + i]);
      rawTriangles.push([4 + i, 4 + next, 8 + next], [4 + i, 8 + next, 8 + i]);
    }
  } else if (habit === 'tP-rutile') {
    emitBipyramidalPrism(
      8,
      (i) => {
        const th = (i * Math.PI) / 4;
        const mod = i % 2 === 0 ? 1.0 : 0.94;
        return [Math.cos(th) * radius * mod, Math.sin(th) * radius * mod];
      },
      halfH * 0.64,
      halfH * 1.15,
    );
  } else if (habit === 'tI-zircon') {
    emitBipyramidalPrism(
      4,
      (i) => {
        const th = (i * Math.PI) / 2 + Math.PI / 4;
        return [Math.cos(th) * radius * 0.96, Math.sin(th) * radius * 0.96];
      },
      halfH * 0.30,
      halfH * 1.18,
    );
  } else if (habit === 'hP-quartz') {
    const cOverA = bravaisSpec.crystalSystem === 'hexagonal' ? 1.1001 : 1.0;
    const qHalfH = Math.max(height * 0.5, radius * cOverA * 0.65);
    emitBipyramidalPrism(
      6,
      (i) => {
        const theta = (i * Math.PI) / 3;
        const rMod = i % 2 === 0 ? 1.0 : 0.965; // trigonal α-quartz 32 symmetry
        return [Math.cos(theta) * radius * rMod, Math.sin(theta) * radius * rMod];
      },
      qHalfH * 0.52,
      qHalfH,
    );
  } else if (habit === 'cP-pyrite') {
    // 12 cuboctahedron vertices scaled to `radius`
    const s = radius / Math.SQRT2;
    const coordKeyMap = new Map<string, number>();
    const getVert = (x: number, y: number, z: number): number => {
      const key = `${x},${y},${z}`;
      const existing = coordKeyMap.get(key);
      if (existing !== undefined) return existing;
      const idx = vertices.length;
      vertices.push([x * s, y * s, z * s]);
      coordKeyMap.set(key, idx);
      return idx;
    };

    for (const sign of [-1, 1]) {
      const x0 = getVert(sign, 1, 0);
      const x1 = getVert(sign, 0, 1);
      const x2 = getVert(sign, -1, 0);
      const x3 = getVert(sign, 0, -1);
      rawTriangles.push([x0, x1, x2], [x0, x2, x3]);

      const y0 = getVert(1, sign, 0);
      const y1 = getVert(0, sign, 1);
      const y2 = getVert(-1, sign, 0);
      const y3 = getVert(0, sign, -1);
      rawTriangles.push([y0, y1, y2], [y0, y2, y3]);

      const z0 = getVert(1, 0, sign);
      const z1 = getVert(0, 1, sign);
      const z2 = getVert(-1, 0, sign);
      const z3 = getVert(0, -1, sign);
      rawTriangles.push([z0, z1, z2], [z0, z2, z3]);
    }

    for (const sx of [-1, 1]) {
      for (const sy of [-1, 1]) {
        for (const sz of [-1, 1]) {
          const vxy = getVert(sx, sy, 0);
          const vyz = getVert(0, sy, sz);
          const vzx = getVert(sx, 0, sz);
          rawTriangles.push([vxy, vyz, vzx]);
        }
      }
    }
  } else if (habit === 'cI-garnet') {
    const iso = radius * 0.52;
    emitRhombicDodecahedron(iso, iso, iso);
  } else if (habit === 'cF-fluorite') {
    const octR = radius * 1.12;
    vertices.push(
      [octR, 0, 0], // 0
      [-octR, 0, 0], // 1
      [0, octR, 0], // 2
      [0, -octR, 0], // 3
      [0, 0, octR], // 4
      [0, 0, -octR], // 5
    );
    for (const ix of [0, 1]) {
      for (const iy of [2, 3]) {
        for (const iz of [4, 5]) {
          rawTriangles.push([ix, iy, iz]);
        }
      }
    }
  } else {
    // `hR-calcite`: trigonal rhombohedron spanned by 3 equal-length vectors around c-axis (`α = 76.5°` rhombohedral cleavage)
    const alphaDeg = bravaisSpec.centering === 'R' ? 76.5 : 90.0;
    const alphaRad = (alphaDeg * Math.PI) / 180;
    const cosThetaSq = Math.min(0.88, Math.max(0.18, (Math.cos(alphaRad) + 0.5) / 1.5));
    const cosTheta = Math.sqrt(cosThetaSq);
    const sinTheta = Math.sqrt(1 - cosThetaSq);
    const edgeLen = radius * 1.35;

    const basis: Array<[number, number, number]> = [0, 1, 2].map((k) => {
      const phi = (k * 2 * Math.PI) / 3;
      return [
        edgeLen * sinTheta * Math.cos(phi),
        edgeLen * cosTheta,
        edgeLen * sinTheta * Math.sin(phi),
      ];
    });
    emitParallelotope(basis[0], basis[1], basis[2]);
  }

  // Enforce outward right-handed winding (`(vb - va) × (vc - va) · faceCentroid > 0`) on all faces
  const positions = new Float32Array(vertices.length * 3);
  const uvs = new Float32Array(vertices.length * 2);
  const colors = new Float32Array(vertices.length * 3);
  const systemPalette: Record<string, number> = {
    triclinic: 0x67e8f9,
    monoclinic: 0x6ee7b7,
    orthorhombic: 0xfde68a,
    tetragonal: 0xfda4af,
    trigonal: 0xe0e7ff,
    hexagonal: 0xcffafe,
    cubic: 0xfef08a,
  };
  const baseColor = new THREE.Color(systemPalette[bravaisSpec.crystalSystem] ?? 0xcffafe);

  for (let i = 0; i < vertices.length; i++) {
    const [vx, vy, vz] = vertices[i];
    positions[i * 3] = vx;
    positions[i * 3 + 1] = vy;
    positions[i * 3 + 2] = vz;
    const len = Math.max(1e-6, Math.hypot(vx, vy, vz));
    uvs[i * 2] = Math.atan2(vz, vx) / (2 * Math.PI) + 0.5;
    uvs[i * 2 + 1] = vy / (2 * len) + 0.5;
    const apexHighlight = 0.86 + 0.14 * (vy / len + 1) * 0.5;
    colors[i * 3] = Math.min(1, baseColor.r * apexHighlight);
    colors[i * 3 + 1] = Math.min(1, baseColor.g * apexHighlight);
    colors[i * 3 + 2] = Math.min(1, baseColor.b * apexHighlight);
  }

  const indices: number[] = [];
  for (const [a, b, c] of rawTriangles) {
    const va = vertices[a];
    const vb = vertices[b];
    const vc = vertices[c];
    const abx = vb[0] - va[0];
    const aby = vb[1] - va[1];
    const abz = vb[2] - va[2];
    const acx = vc[0] - va[0];
    const acy = vc[1] - va[1];
    const acz = vc[2] - va[2];
    const nx = aby * acz - abz * acy;
    const ny = abz * acx - abx * acz;
    const nz = abx * acy - aby * acx;
    const mx = (va[0] + vb[0] + vc[0]) / 3;
    const my = (va[1] + vb[1] + vc[1]) / 3;
    const mz = (va[2] + vb[2] + vc[2]) / 3;
    if (nx * mx + ny * my + nz * mz >= 0) {
      indices.push(a, b, c);
    } else {
      indices.push(a, c, b);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

// ============================================================================
// PARAMETRIC L-SYSTEM & MURRAY VASCULAR MORPHOGENESIS (`Foundation.Morphogenesis.V1.Model`)
// ============================================================================

export type MorphogenesisLifecycleStageId =
  | 'dormant-seed'
  | 'sprouting-bud'
  | 'resonant-bloom'
  | 'harmonic-fruiting'
  | 'mycelial-memory';

export interface BotanicalLSystemOrganPrimordium {
  readonly index: number;
  readonly azimuthRad: number;
  readonly vogelRadiusNormalized: number;
  readonly elevationNormalized: number;
  readonly childVascularRadiusMeters: number;
}

export interface BotanicalMorphogenesisSynthesis {
  readonly species:
    | 'chime-lily'
    | 'pulse-fern'
    | 'echo-lotus'
    | 'drone-moss'
    | 'star-orchid';
  readonly lifecycleStage: MorphogenesisLifecycleStageId;
  readonly stageIndex: number;
  readonly busWeight: number;
  readonly derivationDepth: number;
  readonly axiom: string;
  readonly derivedWord: string;
  readonly derivedSymbolCount: number;
  // Topological organ counts replacing fixed loop constants
  readonly basalFoliageCount: number;
  readonly primaryBranchCount: number;
  readonly secondaryWhorlCount: number;
  readonly fruitingPearlCount: number;
  // Murray's Cubic Vascular Law (r_parent^3 = sum r_child^3)
  readonly basalStemRadiusMeters: number;
  readonly medialStemRadiusMeters: number;
  readonly childBranchRadiusMeters: number;
  readonly parentRadiusCubedM3: number;
  readonly childrenRadiusCubedSumM3: number;
  readonly murrayCubicResidualM3: number;
  readonly murrayLawConserved: boolean;
  // Turing-Vogel 137.508° Phyllotaxis Primordia
  readonly goldenDivergenceRad: number;
  readonly primordia: readonly BotanicalLSystemOrganPrimordium[];
}

const LIFECYCLE_STAGE_TO_INDEX: Readonly<Record<MorphogenesisLifecycleStageId, number>> = {
  'dormant-seed': 0,
  'sprouting-bud': 1,
  'resonant-bloom': 2,
  'harmonic-fruiting': 3,
  'mycelial-memory': 4,
};

const GOLDEN_DIVERGENCE_RAD = (137.50776405003785 * Math.PI) / 180;

/**
 * Evaluates a deterministic parametric `D0L` Lindenmayer grammar + Murray's cubic pipe law
 * (`r_0^3 = sum_{i=1}^k r_i^3`) + Vogel `137.508°` phyllotaxis for any botanical species,
 * lifecycle stage, and Neuromorphic Fidelity bus weight (`Foundation.Morphogenesis.V1.Model`, Prime `149`).
 */
export function synthesizeLSystemBotanicalMorphogenesis(params: {
  readonly species:
    | 'chime-lily'
    | 'pulse-fern'
    | 'echo-lotus'
    | 'drone-moss'
    | 'star-orchid';
  readonly lifecycleStage: MorphogenesisLifecycleStageId;
  readonly busWeight: number;
}): BotanicalMorphogenesisSynthesis {
  const stageIndex = LIFECYCLE_STAGE_TO_INDEX[params.lifecycleStage] ?? 0;
  const w = Math.max(1, Math.min(16, Math.round(params.busWeight)));
  const fidelityTier = w >= 12 ? 2 : w >= 7 ? 1 : 0;
  // Matches `Foundation.Morphogenesis.V1.Model::stepLSystemDerivationDepth`
  const derivationDepth = 2 + stageIndex + fidelityTier;

  // Species-specific D0L axioms & meristematic production rules
  let axiom = 'I[L]A';
  let rules: Record<string, string> = {};
  let baseBasal = 4;
  let basePrimary = 3;
  let baseSecondary = 3;
  let basalStemRadiusMeters = 0.115;

  switch (params.species) {
    case 'chime-lily':
      axiom = 'R[L][L]I[B]A';
      rules = {
        R: 'R[L]',
        A: 'I[B]A',
      };
      baseBasal = 4;
      basePrimary = 2;
      baseSecondary = 2;
      basalStemRadiusMeters = 0.122;
      break;
    case 'pulse-fern':
      axiom = 'C[F][F][F]M';
      rules = {
        C: 'C[F]',
        M: 'I[F][S]M',
      };
      baseBasal = 6;
      basePrimary = 6;
      baseSecondary = 2;
      basalStemRadiusMeters = 0.096;
      break;
    case 'echo-lotus':
      axiom = 'P[O][O][N]K';
      rules = {
        P: 'P[O]',
        K: '[O][N]K',
      };
      baseBasal = 1;
      basePrimary = 6;
      baseSecondary = 4;
      basalStemRadiusMeters = 0.138;
      break;
    case 'drone-moss':
      axiom = 'B[S][S]U';
      rules = {
        B: 'B[C]',
        U: '[S]U',
      };
      baseBasal = 3;
      basePrimary = 3;
      baseSecondary = 3;
      basalStemRadiusMeters = 0.074;
      break;
    case 'star-orchid':
      axiom = 'L[B]I[S][T]G';
      rules = {
        L: 'L[B]',
        G: '[S][T]G',
      };
      baseBasal = 3;
      basePrimary = 4;
      baseSecondary = 3;
      basalStemRadiusMeters = 0.118;
      break;
  }

  // Execute deterministic D0L parallel rewriting for `derivationDepth` plastochrons
  let word = axiom;
  for (let step = 0; step < derivationDepth; step++) {
    let next = '';
    for (let i = 0; i < word.length; i++) {
      const ch = word[i];
      next += rules[ch] ?? ch;
    }
    word = next;
  }

  // Derive bounded, strictly stage- and fidelity-monotonic organ counts from L-system depth
  const stageBoost = Math.floor((stageIndex + 1) / 2); // 0, 1, 1, 2, 2
  const fidelityOrganBoost = fidelityTier; // 0, 1, 2
  const basalFoliageCount =
    params.species === 'echo-lotus'
      ? 1 + (stageIndex >= 3 && fidelityTier >= 2 ? 1 : 0)
      : baseBasal + stageBoost + fidelityOrganBoost;
  const primaryBranchCount = basePrimary + stageIndex + fidelityOrganBoost;
  const secondaryWhorlCount = baseSecondary + stageBoost + fidelityOrganBoost;
  const fruitingPearlCount = 3 + stageBoost + fidelityOrganBoost;

  // Murray's Cubic Pipe Law: r_parent^3 = r_apicalContinuation^3 + sum_{i=1}^k r_branch_i^3
  // Apical dominance allocates `alpha = 0.382` (`1 - 1/phi`) of cubic vascular conductance to the apical continuation,
  // and `0.618` (`1/phi`) across the `k = primaryBranchCount` lateral meristem branches!
  const parentRadiusCubedM3 = Math.pow(basalStemRadiusMeters, 3);
  const apicalConductanceShare = 0.382;
  const lateralConductanceShare = 1 - apicalConductanceShare;
  const medialStemRadiusMeters = Math.cbrt(parentRadiusCubedM3 * apicalConductanceShare);
  const perChildCubed = (parentRadiusCubedM3 * lateralConductanceShare) / Math.max(1, primaryBranchCount);
  const childBranchRadiusMeters = Math.cbrt(perChildCubed);

  const childrenRadiusCubedSumM3 =
    Math.pow(medialStemRadiusMeters, 3) +
    primaryBranchCount * Math.pow(childBranchRadiusMeters, 3);
  const murrayCubicResidualM3 = Math.abs(parentRadiusCubedM3 - childrenRadiusCubedSumM3);

  const primordia: BotanicalLSystemOrganPrimordium[] = [];
  for (let i = 0; i < primaryBranchCount; i++) {
    const normIdx = (i + 0.5) / Math.max(1, primaryBranchCount);
    primordia.push({
      index: i,
      azimuthRad: i * GOLDEN_DIVERGENCE_RAD,
      vogelRadiusNormalized: Number(Math.sqrt(normIdx).toFixed(5)),
      elevationNormalized: Number((0.18 + normIdx * 0.74).toFixed(5)),
      childVascularRadiusMeters: Number(childBranchRadiusMeters.toFixed(6)),
    });
  }

  return {
    species: params.species,
    lifecycleStage: params.lifecycleStage,
    stageIndex,
    busWeight: w,
    derivationDepth,
    axiom,
    derivedWord: word,
    derivedSymbolCount: word.length,
    basalFoliageCount,
    primaryBranchCount,
    secondaryWhorlCount,
    fruitingPearlCount,
    basalStemRadiusMeters: Number(basalStemRadiusMeters.toFixed(5)),
    medialStemRadiusMeters: Number(medialStemRadiusMeters.toFixed(5)),
    childBranchRadiusMeters: Number(childBranchRadiusMeters.toFixed(5)),
    parentRadiusCubedM3: Number(parentRadiusCubedM3.toFixed(9)),
    childrenRadiusCubedSumM3: Number(childrenRadiusCubedSumM3.toFixed(9)),
    murrayCubicResidualM3,
    murrayLawConserved: murrayCubicResidualM3 < 1e-6,
    goldenDivergenceRad: GOLDEN_DIVERGENCE_RAD,
    primordia,
  };
}
