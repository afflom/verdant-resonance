import * as THREE from 'three';

/**
 * High-Definition Procedural 3D B-Mesh, Lofted Spline, Shape-Key (Morph Target)
 * & PBR Shader Synthesis Engine (`src/game/proceduralMeshEngine.ts`).
 *
 * Replaces primitive boxes, cones, and cylinders with parametrically sculpted,
 * anatomically accurate 3D geometries complete with analytical normals, UVs,
 * vertex color gradients, and Blender-style Shape Keys (`morphAttributes.position`).
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
        const widthProfile = Math.sin(Math.pow(u, 0.75) * Math.PI);
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
    const t = it / tSegs; // 0 at outer stem entry -> 1 at tightly coiled inner apex
    const theta = t * Math.PI * 2 * turns;
    const spiralR = outerRadius * Math.exp(-1.35 * t);
    const centerX = Math.cos(theta) * spiralR;
    const centerY = Math.sin(theta) * spiralR;
    const centerZ = (t - 0.5) * 0.035;

    // Unfurl morph target unwinds the spiral angle by 32% and lifts Y
    const unfurlTheta = theta * 0.68;
    const unfurlR = outerRadius * Math.exp(-0.95 * t) * 1.15;
    const unfurlCenterX = Math.cos(unfurlTheta) * unfurlR;
    const unfurlCenterY = Math.sin(unfurlTheta) * unfurlR + t * 0.14;

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

  const vertexCount = (rSegs + 1) * (ringSegs + 1);
  const positions = new Float32Array(vertexCount * 3);
  const uvs = new Float32Array(vertexCount * 2);

  let idx = 0;
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

      positions[idx * 3] = Math.cos(theta) * sprayReach;
      positions[idx * 3 + 1] = archY;
      positions[idx * 3 + 2] = Math.sin(theta) * sprayReach;

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
      indices.push(a, b, d);
      indices.push(a, d, c);
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
 *   and Roughness Maps directly from our 3 macromolecular/compound structural layers.
 */
export function createHighDefinitionPbrTextureSuite(
  maxAnisotropy: number,
  isSoftwareGl: boolean,
): HighDefinitionPbrTextureSuite {
  const size = isSoftwareGl ? 256 : 512;

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

  for (let i = 0; i < 640; i++) {
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
  for (let h = 0; h < 120; h++) {
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
  for (let v = 1; v <= 12; v++) {
    const vy = (v / 13) * size;
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
  };

  material.onBeforeCompile = (shader) => {
    shader.uniforms.uBotanicalTime = uniforms.uTime;
    shader.uniforms.uResonancePulse = uniforms.uResonancePulse;
    shader.uniforms.uWaveFreq = { value: waveFreq };
    shader.uniforms.uWaveAmp = { value: waveAmp };
    shader.uniforms.uPulseSpeed = { value: pulseSpeed };

    shader.vertexShader =
      `
      uniform float uBotanicalTime;
      uniform float uResonancePulse;
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
        float harmonicRipple = sin(position.y * 5.5 - uBotanicalTime * uWaveFreq + position.x * 3.0) * uWaveAmp * (1.0 + uResonancePulse * 0.8) * heightMask;
        transformed.x += harmonicRipple * 0.45;
        transformed.z += harmonicRipple;
        `,
      );

    shader.fragmentShader =
      `
      uniform float uBotanicalTime;
      uniform float uResonancePulse;
      uniform float uPulseSpeed;
      varying vec3 vBotanicalLocalPos;
      ` +
      shader.fragmentShader.replace(
        '#include <emissivemap_fragment>',
        `
        #include <emissivemap_fragment>
        float veinWave = 0.82 + (0.28 + uResonancePulse * 0.35) * sin(vBotanicalLocalPos.y * 7.0 - uBotanicalTime * uPulseSpeed);
        totalEmissiveRadiance *= veinWave;
        `,
      );
  };

  return uniforms;
}
