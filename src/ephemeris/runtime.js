import {
  EPHEMERIS_V1,
  EPHEMERIS_V1_BODY_KEYS,
  EPHEMERIS_V1_BODY_VECTORS_BASE64,
  EPHEMERIS_V1_DERIVED_BODY_KEYS,
  EPHEMERIS_V1_DERIVED_VECTORS_BASE64
} from "./generated-v1.js";

const bodyVectorCache = new Map();
const derivedVectorCache = new Map();

function decodeBase64ToUint8Array(base64) {
  if (typeof Uint8Array.fromBase64 === "function") {
    return Uint8Array.fromBase64(base64);
  }

  if (typeof atob === "function") {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }
    return bytes;
  }

  if (typeof Buffer !== "undefined") {
    return Uint8Array.from(Buffer.from(base64, "base64"));
  }

  throw new Error("No base64 decoder available in this runtime.");
}

function toDateFromInput(input) {
  if (input instanceof Date || typeof input === "number") {
    const date = new Date(input);
    if (Number.isNaN(date.getTime())) {
      throw new Error("Invalid date input");
    }
    return date;
  }

  if (typeof input === "string") {
    const date = new Date(input);
    if (Number.isNaN(date.getTime())) {
      throw new Error(`Invalid date input: ${input}`);
    }
    return date;
  }

  throw new Error(`Unsupported date input type: ${typeof input}`);
}

function toUnixSeconds(date) {
  return date.getTime() / 1000;
}

function getBodyVectors(bodyKey) {
  if (bodyVectorCache.has(bodyKey)) {
    return bodyVectorCache.get(bodyKey);
  }

  const encoded = EPHEMERIS_V1_BODY_VECTORS_BASE64[bodyKey];
  if (!encoded) {
    return null;
  }

  const bytes = decodeBase64ToUint8Array(encoded);
  const vectors = new Float32Array(bytes.buffer, bytes.byteOffset, bytes.byteLength / 4);
  bodyVectorCache.set(bodyKey, vectors);
  return vectors;
}

function getDerivedVectors(bodyKey) {
  if (derivedVectorCache.has(bodyKey)) {
    return derivedVectorCache.get(bodyKey);
  }

  const encoded = EPHEMERIS_V1_DERIVED_VECTORS_BASE64?.[bodyKey];
  if (!encoded) {
    return null;
  }

  const bytes = decodeBase64ToUint8Array(encoded);
  const vectors = new Float32Array(bytes.buffer, bytes.byteOffset, bytes.byteLength / 4);
  derivedVectorCache.set(bodyKey, vectors);
  return vectors;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function interpolate(a, b, t) {
  return a + (b - a) * t;
}

export const EPHEMERIS_WINDOW = Object.freeze({
  startUtc: EPHEMERIS_V1.startUtc,
  endUtc: EPHEMERIS_V1.endUtc
});

const interpolableEndUtc = new Date(
  Date.parse(EPHEMERIS_V1.endUtc) - EPHEMERIS_V1.stepSeconds * 1000
).toISOString();

export const EPHEMERIS_INTERPOLATION_WINDOW = Object.freeze({
  startUtc: EPHEMERIS_V1.startUtc,
  endUtc: interpolableEndUtc
});

export const SUPPORTED_PLANET_KEYS = Object.freeze([...EPHEMERIS_V1_BODY_KEYS]);

// Bodies that additionally carry a derived parent-relative offset blob (e.g. the
// Moon, stored relative to Earth). These are NOT a substitute for the primary
// barycentric position — every body, including these, keeps an honest
// barycentric blob in EPHEMERIS_V1_BODY_VECTORS_BASE64.
export const SUPPORTED_DERIVED_BODY_KEYS = Object.freeze([
  ...(EPHEMERIS_V1_DERIVED_BODY_KEYS ?? [])
]);

// Interpolate a flat [x0,y0,z0, x1,y1,z1, …] Float32Array of daily samples at a
// given instant. Returns null when the instant is outside the dataset window.
function interpolateVectorsAtInstant(vectors, dateInput) {
  const instant = toDateFromInput(dateInput);
  const startUnixS = Date.parse(EPHEMERIS_V1.startUtc) / 1000;
  const endUnixS = Date.parse(EPHEMERIS_V1.endUtc) / 1000;
  const endExclusiveUnixS = endUnixS + EPHEMERIS_V1.stepSeconds;
  const unixSeconds = toUnixSeconds(instant);

  if (unixSeconds < startUnixS || unixSeconds >= endExclusiveUnixS) {
    return null;
  }

  const lastIndex = EPHEMERIS_V1.samplesPerBody - 1;
  const indexFloat = (unixSeconds - startUnixS) / EPHEMERIS_V1.stepSeconds;
  const lowerIndex = clamp(Math.floor(indexFloat), 0, lastIndex);
  const upperIndex = clamp(lowerIndex + 1, 0, lastIndex);
  const t = clamp(indexFloat - lowerIndex, 0, 1);

  const lowerOffset = lowerIndex * 3;
  const upperOffset = upperIndex * 3;

  return {
    xAu: interpolate(vectors[lowerOffset], vectors[upperOffset], t),
    yAu: interpolate(vectors[lowerOffset + 1], vectors[upperOffset + 1], t),
    zAu: interpolate(vectors[lowerOffset + 2], vectors[upperOffset + 2], t)
  };
}

export function getBodyPositionAuAtInstant(bodyKey, dateInput) {
  const vectors = getBodyVectors(bodyKey);
  if (!vectors) {
    throw new Error(`Unsupported body key: ${bodyKey}`);
  }

  return interpolateVectorsAtInstant(vectors, dateInput);
}

// Return the body's derived parent-relative offset (e.g. Moon relative to Earth)
// at an instant, interpolated like the primary blobs. Throws for bodies without a
// derived dataset; returns null when the instant is outside the dataset window.
export function getBodyDerivedOffsetAuAtInstant(bodyKey, dateInput) {
  const vectors = getDerivedVectors(bodyKey);
  if (!vectors) {
    throw new Error(`No derived dataset for body key: ${bodyKey}`);
  }

  return interpolateVectorsAtInstant(vectors, dateInput);
}
