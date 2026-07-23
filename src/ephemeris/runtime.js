import { EPHEMERIS_V2_INDEX } from "./generated-v2-index.js";

const DAY_SECONDS = 86400;
const loadedChunks = new Map();
const loadingChunks = new Map();
const cumulativePathCache = new Map();
const isNodeRuntime = Boolean(globalThis.process?.versions?.node);

export class EphemerisDataMissingError extends Error {
  constructor(message, loadPlan) {
    super(message);
    this.name = "EphemerisDataMissingError";
    this.loadPlan = loadPlan;
  }
}

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

function toUnixSeconds(input) {
  return toDateFromInput(input).getTime() / 1000;
}

function normalizeArray(value, fallback) {
  if (value == null) {
    return fallback;
  }
  return Array.isArray(value) ? value : [value];
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function interpolate(a, b, t) {
  return a + (b - a) * t;
}

function bodyStream(bodyKey) {
  return EPHEMERIS_V2_INDEX.bodies[bodyKey]?.stream ?? null;
}

function bodyKeysForStreams(streams) {
  return streams.flatMap((stream) => EPHEMERIS_V2_INDEX.streams[stream]?.bodyKeys ?? []);
}

function chunkCovers(chunk, startUnixS, endUnixS) {
  const chunkStart = Date.parse(chunk.startUtc) / 1000;
  const chunkEnd = Date.parse(chunk.endUtc) / 1000;
  return chunkEnd >= startUnixS && chunkStart <= endUnixS;
}

function chunkHasAnyBody(chunk, bodyKeys) {
  if (!bodyKeys || bodyKeys.length === 0) {
    return true;
  }
  return bodyKeys.some((key) => chunk.bodyKeys.includes(key));
}

function bodyKeysForChunk(chunk, bodyKeys) {
  if (!bodyKeys || bodyKeys.length === 0) {
    return chunk.bodyKeys;
  }
  const requested = new Set(bodyKeys);
  return chunk.bodyKeys.filter((key) => requested.has(key));
}

function chunkHasLoadedBodies(chunk, bodyKeys) {
  const loaded = loadedChunks.get(chunk.id);
  if (!loaded) {
    return false;
  }
  return bodyKeysForChunk(chunk, bodyKeys).every((key) => loaded.bodyKeys.includes(key));
}

function loadedChunkHasRequestedBodies(chunk, bodyKeys) {
  if (!bodyKeys || bodyKeys.length === 0) {
    return true;
  }
  const relevantKeys = bodyKeys.filter((key) => bodyStream(key) === chunk.stream);
  return relevantKeys.length === 0 || relevantKeys.every((key) => chunk.bodyKeys.includes(key));
}

function chunkUrl(chunk) {
  return new URL(chunk.url, import.meta.url);
}

async function fetchChunkPayload(chunk) {
  const url = chunkUrl(chunk);
  if (isNodeRuntime && url.protocol === "file:") {
    const [{ readFile }, { fileURLToPath }] = await Promise.all([
      import("node:fs/promises"),
      import("node:url")
    ]);
    return JSON.parse(await readFile(fileURLToPath(url), "utf8"));
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load ephemeris chunk ${chunk.id}: ${response.status}`);
  }
  return response.json();
}

const decoders = {
  "json-base64"(payload, { bodyKeys } = {}) {
    const keys = bodyKeys?.length
      ? payload.bodyKeys.filter((key) => bodyKeys.includes(key))
      : payload.bodyKeys;
    const vectors = {};
    for (const key of keys) {
      const encoded = payload.vectors[key];
      const bytes = decodeBase64ToUint8Array(encoded);
      vectors[key] = new Float32Array(bytes.buffer, bytes.byteOffset, bytes.byteLength / 4);
    }
    return {
      id: payload.chunkId,
      stream: payload.stream,
      startUtc: payload.startUtc,
      endUtc: payload.endUtc,
      startUnixS: Date.parse(payload.startUtc) / 1000,
      endUnixS: Date.parse(payload.endUtc) / 1000,
      stepSeconds: payload.stepSeconds,
      samplesPerBody: payload.samplesPerBody,
      bodyKeys: keys,
      vectors
    };
  }
};

function mergeDecodedChunk(existing, decoded) {
  if (!existing) {
    return decoded;
  }
  const bodyKeys = [...new Set([...existing.bodyKeys, ...decoded.bodyKeys])];
  return {
    ...existing,
    bodyKeys,
    vectors: {
      ...existing.vectors,
      ...decoded.vectors
    }
  };
}

async function loadChunk(chunk, { bodyKeys } = {}) {
  const requestedBodyKeys = bodyKeysForChunk(chunk, bodyKeys);
  if (chunkHasLoadedBodies(chunk, requestedBodyKeys)) {
    return loadedChunks.get(chunk.id);
  }

  const loadingKey = `${chunk.id}:${requestedBodyKeys.join(",")}`;
  if (loadingChunks.has(loadingKey)) {
    return loadingChunks.get(loadingKey);
  }

  const promise = fetchChunkPayload(chunk)
    .then((payload) => {
      const decoder = decoders[chunk.format];
      if (!decoder) {
        throw new Error(`Unsupported ephemeris chunk format: ${chunk.format}`);
      }
      const decoded = decoder(payload, { bodyKeys: requestedBodyKeys });
      const merged = mergeDecodedChunk(loadedChunks.get(chunk.id), decoded);
      loadedChunks.set(chunk.id, merged);
      cumulativePathCache.clear();
      return merged;
    })
    .finally(() => {
      loadingChunks.delete(loadingKey);
    });
  loadingChunks.set(loadingKey, promise);
  return promise;
}

export function getSupportedDateRange() {
  const endUtc = new Date(
    Date.parse(EPHEMERIS_V2_INDEX.window.endUtc) - EPHEMERIS_V2_INDEX.cadence.stepSeconds * 1000
  ).toISOString();
  return Object.freeze({
    min: EPHEMERIS_V2_INDEX.window.startUtc.slice(0, 10),
    max: endUtc.slice(0, 10)
  });
}

export function getBodyRegistry() {
  return EPHEMERIS_V2_INDEX.bodies;
}

export function getLoadedCoverage({ stream, bodyKeys } = {}) {
  const streams = normalizeArray(stream, Object.keys(EPHEMERIS_V2_INDEX.streams));
  const keys = bodyKeys ? normalizeArray(bodyKeys, []) : null;
  const chunks = [...loadedChunks.values()].filter(
    (chunk) => streams.includes(chunk.stream) && loadedChunkHasRequestedBodies(chunk, keys)
  );
  if (chunks.length === 0) {
    return null;
  }
  const minStart = Math.min(...chunks.map((chunk) => chunk.startUnixS));
  const maxEnd = Math.max(...chunks.map((chunk) => chunk.endUnixS));
  return {
    startUtc: new Date(minStart * 1000).toISOString().replace(".000Z", "Z"),
    endUtc: new Date(maxEnd * 1000).toISOString().replace(".000Z", "Z"),
    chunks: chunks.map((chunk) => chunk.id)
  };
}

export function planEphemerisLoad({ startUtc, endUtc, streams, bodyKeys } = {}) {
  const requestedStreams = normalizeArray(streams, ["primary"]);
  const requestedBodyKeys = bodyKeys
    ? normalizeArray(bodyKeys, [])
    : bodyKeysForStreams(requestedStreams);
  const startUnixS = toUnixSeconds(startUtc ?? EPHEMERIS_V2_INDEX.window.startUtc);
  const endUnixS = toUnixSeconds(endUtc ?? EPHEMERIS_V2_INDEX.window.endUtc);

  const chunks = EPHEMERIS_V2_INDEX.chunks.filter(
    (chunk) =>
      requestedStreams.includes(chunk.stream) &&
      chunkCovers(chunk, startUnixS, endUnixS) &&
      chunkHasAnyBody(chunk, requestedBodyKeys)
  );
  const missingChunks = chunks.filter((chunk) => !chunkHasLoadedBodies(chunk, requestedBodyKeys));

  return {
    startUtc: new Date(startUnixS * 1000).toISOString().replace(".000Z", "Z"),
    endUtc: new Date(endUnixS * 1000).toISOString().replace(".000Z", "Z"),
    streams: requestedStreams,
    bodyKeys: requestedBodyKeys,
    chunks,
    missingChunks,
    loaded: missingChunks.length === 0,
    totalBytes: chunks.reduce((sum, chunk) => sum + chunk.byteLength, 0),
    missingBytes: missingChunks.reduce((sum, chunk) => sum + chunk.byteLength, 0)
  };
}

export async function ensureEphemerisLoaded({
  startUtc,
  endUtc,
  streams,
  bodyKeys,
  priority = "normal",
  onProgress
} = {}) {
  const plan = planEphemerisLoad({ startUtc, endUtc, streams, bodyKeys });
  if (plan.loaded) {
    onProgress?.({ loadedChunks: plan.chunks.length, totalChunks: plan.chunks.length, chunk: null, plan, priority });
    return plan;
  }

  let loadedCount = plan.chunks.length - plan.missingChunks.length;
  const totalChunks = plan.chunks.length;
  for (const chunk of plan.missingChunks) {
    onProgress?.({ loadedChunks: loadedCount, totalChunks, chunk, plan, priority });
    await loadChunk(chunk, { bodyKeys: plan.bodyKeys });
    loadedCount += 1;
    onProgress?.({ loadedChunks: loadedCount, totalChunks, chunk, plan, priority });
  }

  return planEphemerisLoad({ startUtc, endUtc, streams, bodyKeys });
}

function findLoadedChunk(bodyKey, instantUnixS) {
  const stream = bodyStream(bodyKey);
  const candidates = [...loadedChunks.values()]
    .filter(
      (chunk) =>
        chunk.stream === stream &&
        chunk.bodyKeys.includes(bodyKey) &&
        chunk.startUnixS <= instantUnixS &&
        instantUnixS < chunk.endUnixS
    )
    .sort((a, b) => a.startUnixS - b.startUnixS);
  if (candidates.length > 0) {
    return candidates[0];
  }

  return [...loadedChunks.values()].find(
    (chunk) =>
      chunk.stream === stream &&
      chunk.bodyKeys.includes(bodyKey) &&
      instantUnixS === chunk.endUnixS
  );
}

function interpolateVectorsAtInstant(chunk, bodyKey, dateInput) {
  const unixSeconds = toUnixSeconds(dateInput);
  const vectors = chunk.vectors[bodyKey];
  if (!vectors) {
    return null;
  }

  const lastIndex = chunk.samplesPerBody - 1;
  const indexFloat = (unixSeconds - chunk.startUnixS) / chunk.stepSeconds;
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

function missingPlanFor(bodyKey, dateInput) {
  const stream = bodyStream(bodyKey);
  const iso = toDateFromInput(dateInput).toISOString();
  return planEphemerisLoad({
    startUtc: iso,
    endUtc: iso,
    streams: stream ? [stream] : ["primary"],
    bodyKeys: [bodyKey]
  });
}

export function hasBodyPosition(bodyKey, instant) {
  const normalizedBodyKey = String(bodyKey).toLowerCase();
  return Boolean(findLoadedChunk(normalizedBodyKey, toUnixSeconds(instant)));
}

export function getBodyPositionAuAtInstant(bodyKey, dateInput) {
  const normalizedBodyKey = String(bodyKey).toLowerCase();
  const chunk = findLoadedChunk(normalizedBodyKey, toUnixSeconds(dateInput));
  if (!chunk) {
    throw new EphemerisDataMissingError(
      `Ephemeris data for "${normalizedBodyKey}" is not loaded at ${toDateFromInput(dateInput).toISOString()}.`,
      missingPlanFor(normalizedBodyKey, dateInput)
    );
  }
  const position = interpolateVectorsAtInstant(chunk, normalizedBodyKey, dateInput);
  if (!position) {
    throw new Error(`Unsupported body key: ${bodyKey}`);
  }
  return position;
}

export function getBodyDerivedOffsetAuAtInstant(bodyKey, dateInput) {
  const normalizedBodyKey = String(bodyKey).toLowerCase();
  const body = EPHEMERIS_V2_INDEX.bodies[normalizedBodyKey];
  if (!body?.relativeTo) {
    throw new Error(`No derived dataset for body key: ${bodyKey}`);
  }
  const parent = Object.values(EPHEMERIS_V2_INDEX.bodies).find(
    (candidate) => candidate.naifId === body.relativeTo
  );
  if (!parent) {
    throw new Error(`No parent body for derived dataset: ${bodyKey}`);
  }
  const position = getBodyPositionAuAtInstant(normalizedBodyKey, dateInput);
  const parentPosition = getBodyPositionAuAtInstant(parent.key, dateInput);
  return {
    xAu: position.xAu - parentPosition.xAu,
    yAu: position.yAu - parentPosition.yAu,
    zAu: position.zAu - parentPosition.zAu
  };
}

function samplesForBodyBetween(bodyKey, startInput, endInput) {
  const startUnixS = toUnixSeconds(startInput);
  const endUnixS = toUnixSeconds(endInput);
  const stream = bodyStream(bodyKey);
  const chunks = [...loadedChunks.values()]
    .filter(
      (chunk) =>
        chunk.stream === stream &&
        chunk.bodyKeys.includes(bodyKey) &&
        chunk.endUnixS >= startUnixS &&
        chunk.startUnixS <= endUnixS
    )
    .sort((a, b) => a.startUnixS - b.startUnixS);

  const samples = [];
  const seen = new Set();
  for (const chunk of chunks) {
    const vectors = chunk.vectors[bodyKey];
    for (let index = 0; index < chunk.samplesPerBody; index += 1) {
      const epochUnixS = chunk.startUnixS + index * chunk.stepSeconds;
      if (epochUnixS < startUnixS || epochUnixS > endUnixS || seen.has(epochUnixS)) {
        continue;
      }
      const offset = index * 3;
      samples.push({
        epochUnixS,
        xAu: vectors[offset],
        yAu: vectors[offset + 1],
        zAu: vectors[offset + 2]
      });
      seen.add(epochUnixS);
    }
  }
  return samples.sort((a, b) => a.epochUnixS - b.epochUnixS);
}

export function bodyPathLengthAuBetween(bodyKey, startInput, endInput) {
  const normalizedBodyKey = String(bodyKey).toLowerCase();
  const cacheKey = `${normalizedBodyKey}:${toDateFromInput(startInput).toISOString()}:${toDateFromInput(endInput).toISOString()}`;
  if (cumulativePathCache.has(cacheKey)) {
    return cumulativePathCache.get(cacheKey);
  }

  const startPosition = getBodyPositionAuAtInstant(normalizedBodyKey, startInput);
  const endPosition = getBodyPositionAuAtInstant(normalizedBodyKey, endInput);
  const samples = samplesForBodyBetween(normalizedBodyKey, startInput, endInput);
  if (samples.length === 0) {
    return null;
  }

  const points = [
    { epochUnixS: toUnixSeconds(startInput), ...startPosition },
    ...samples,
    { epochUnixS: toUnixSeconds(endInput), ...endPosition }
  ]
    .sort((a, b) => a.epochUnixS - b.epochUnixS)
    .filter((point, index, list) => index === 0 || point.epochUnixS !== list[index - 1].epochUnixS);

  let total = 0;
  for (let i = 1; i < points.length; i += 1) {
    const prev = points[i - 1];
    const curr = points[i];
    total += Math.hypot(curr.xAu - prev.xAu, curr.yAu - prev.yAu, curr.zAu - prev.zAu);
  }

  cumulativePathCache.set(cacheKey, total);
  return total;
}

export const EPHEMERIS_WINDOW = Object.freeze({
  startUtc: EPHEMERIS_V2_INDEX.window.startUtc,
  endUtc: EPHEMERIS_V2_INDEX.window.endUtc
});

export const EPHEMERIS_INTERPOLATION_WINDOW = Object.freeze({
  startUtc: `${getSupportedDateRange().min}T00:00:00Z`,
  endUtc: `${getSupportedDateRange().max}T00:00:00Z`
});

export const SUPPORTED_PLANET_KEYS = Object.freeze([...EPHEMERIS_V2_INDEX.streams.primary.bodyKeys]);
export const SUPPORTED_DERIVED_BODY_KEYS = Object.freeze(
  Object.values(EPHEMERIS_V2_INDEX.bodies)
    .filter((body) => body.relativeTo !== undefined && body.relativeTo !== null)
    .map((body) => body.key)
);

const recentPrimaryChunk = EPHEMERIS_V2_INDEX.chunks.find(
  (chunk) => chunk.stream === "primary" && chunk.kind === "recent"
);

export const ephemerisBootPromise = isNodeRuntime
  ? ensureEphemerisLoaded({
      streams: ["primary"],
      startUtc: EPHEMERIS_V2_INDEX.window.startUtc,
      endUtc: EPHEMERIS_V2_INDEX.window.endUtc,
      priority: "test"
    })
  : ensureEphemerisLoaded({
      streams: ["primary"],
      startUtc: recentPrimaryChunk?.startUtc,
      endUtc: EPHEMERIS_V2_INDEX.window.endUtc,
      priority: "boot"
    }).catch((error) => {
      console.error(error);
    });

if (isNodeRuntime) {
  await ephemerisBootPromise;
}
