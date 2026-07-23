import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";

const cwd = process.cwd();
const v1Dir = path.resolve(cwd, process.env.EPHEMERIS_V1_DATA_DIR ?? "data/ephemeris/v1");
const v2Dir = path.resolve(cwd, process.env.EPHEMERIS_V2_DATA_DIR ?? "data/ephemeris/v2");
const configPath = path.join(v2Dir, "build-config.json");
const auxiliaryTargetsPath = path.join(v2Dir, "auxiliary-targets.json");
const outIndexPath = path.resolve(cwd, process.env.EPHEMERIS_V2_OUTPUT_MODULE ?? "src/ephemeris/generated-v2-index.js");

const DAY_SECONDS = 86400;
const DAY_MS = DAY_SECONDS * 1000;
const ENCODERS = {
  "json-base64": encodeJsonBase64Chunk
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function sha256(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

function isoDate(iso) {
  return new Date(iso).toISOString().slice(0, 10);
}

function isoMidnight(ms) {
  return new Date(ms).toISOString().replace(".000Z", "Z");
}

function subtractUtcYears(iso, years) {
  const date = new Date(iso);
  date.setUTCFullYear(date.getUTCFullYear() - years);
  date.setUTCHours(0, 0, 0, 0);
  return date.toISOString().replace(".000Z", "Z");
}

function targetForStream(target, stream, defaultsByRenderClass) {
  const renderClass = target.renderClass ?? (stream === "primary" ? "primary" : "featuredAuxiliary");
  const defaults = defaultsByRenderClass[renderClass] ?? {};
  return {
    key: target.key,
    label: target.label ?? target.key,
    naifId: target.naifId,
    stream,
    kind: target.kind ?? (stream === "primary" ? "majorBody" : "smallBody"),
    renderClass,
    hasLabel: target.hasLabel ?? defaults.hasLabel ?? true,
    hasTrail: target.hasTrail ?? defaults.hasTrail ?? true,
    parent: target.parent ?? null,
    relativeTo: target.relativeTo ?? null
  };
}

function planChunks({ stream, targets, epochs, vectorsByKey, config, datasetEndUtc }) {
  if (targets.length === 0 || epochs.length === 0) {
    return [];
  }

  const streamConfig = config.streams[stream];
  const hotStartMs = Date.parse(subtractUtcYears(datasetEndUtc, streamConfig.hotWindowYears));
  const firstEpochMs = epochs[0] * 1000;
  const recentStartMs = Math.max(firstEpochMs, hotStartMs);
  const bytesPerSample = targets.length * 3 * Float32Array.BYTES_PER_ELEMENT;
  const maxSamplesByUncompressed = Math.max(
    2,
    Math.floor(streamConfig.maxUncompressedBytesPerChunk / bytesPerSample)
  );
  const chunks = [];

  function addChunk(kind, startIndex, endIndex) {
    if (endIndex <= startIndex) {
      return;
    }
    chunks.push({
      id: `${stream}-${kind}-${isoDate(isoMidnight(epochs[startIndex] * 1000))}-${isoDate(isoMidnight(epochs[endIndex] * 1000))}`,
      stream,
      kind,
      startIndex,
      endIndex,
      startUtc: isoMidnight(epochs[startIndex] * 1000),
      endUtc: isoMidnight(epochs[endIndex] * 1000),
      samplesPerBody: endIndex - startIndex + 1,
      bodyKeys: targets.map((target) => target.key)
    });
  }

  const recentStartIndex = Math.max(
    0,
    epochs.findIndex((epoch) => epoch * 1000 >= recentStartMs)
  );

  let start = 0;
  const historicalEnd = Math.max(0, recentStartIndex);
  while (start < historicalEnd) {
    const end = Math.min(historicalEnd, start + maxSamplesByUncompressed - 1);
    addChunk("historical", start, end);
    start = end;
  }

  addChunk("recent", Math.max(0, historicalEnd), epochs.length - 1);

  return chunks.map((chunk) => {
    const vectors = {};
    for (const target of targets) {
      vectors[target.key] = vectorsByKey.get(target.key).slice(
        chunk.startIndex * 3,
        (chunk.endIndex + 1) * 3
      );
    }
    return { ...chunk, vectors };
  });
}

function encodeJsonBase64Chunk({ chunk, targets, header, formatConfig }) {
  const bodyVectors = {};
  for (const target of targets) {
    const values = chunk.vectors[target.key] ?? [];
    const array = Float32Array.from(values);
    bodyVectors[target.key] = Buffer.from(array.buffer).toString("base64");
  }

  return Buffer.from(
    `${JSON.stringify(
      {
        datasetVersion: "2.0.0",
        formatVersion: "1.0.0",
        chunkSchema: "ephemeris.chunk.v1",
        stream: chunk.stream,
        chunkId: chunk.id,
        startUtc: chunk.startUtc,
        endUtc: chunk.endUtc,
        stepSeconds: DAY_SECONDS,
        samplesPerBody: chunk.samplesPerBody,
        frame: header.frame,
        origin: header.origin,
        format: "json-base64",
        contentType: formatConfig.contentType,
        compression: formatConfig.compression,
        vectorEncoding: formatConfig.vectorEncoding,
        bodyKeys: chunk.bodyKeys,
        vectors: bodyVectors
      },
      null,
      2
    )}\n`
  );
}

async function readVectors({ header, targetKeys }) {
  const snapshotsPath = path.join(v1Dir, "snapshots.ndjson");
  const auxiliarySnapshotsPath = path.join(v2Dir, "auxiliary-snapshots.ndjson");
  const targetByNaifId = new Map(header.targets.map((target) => [target.naifId, target]));
  const selectedKeys = new Set(targetKeys);
  const vectorsByKey = new Map([...selectedKeys].map((key) => [key, []]));
  const epochs = [];
  let currentEpoch = null;

  const lineReader = readline.createInterface({
    input: fs.createReadStream(snapshotsPath, { encoding: "utf8" }),
    crlfDelay: Infinity
  });

  for await (const line of lineReader) {
    if (!line.trim()) {
      continue;
    }
    const row = JSON.parse(line);
    if (row.epochUnixS !== currentEpoch) {
      currentEpoch = row.epochUnixS;
      epochs.push(row.epochUnixS);
    }
    const target = targetByNaifId.get(row.naifId);
    if (!target || !selectedKeys.has(target.key)) {
      continue;
    }
    vectorsByKey.get(target.key).push(row.xAu, row.yAu, row.zAu);
  }

  if (fs.existsSync(auxiliarySnapshotsPath)) {
    const auxiliaryLineReader = readline.createInterface({
      input: fs.createReadStream(auxiliarySnapshotsPath, { encoding: "utf8" }),
      crlfDelay: Infinity
    });

    for await (const line of auxiliaryLineReader) {
      if (!line.trim()) {
        continue;
      }
      const row = JSON.parse(line);
      if (!selectedKeys.has(row.body)) {
        continue;
      }
      vectorsByKey.get(row.body).push(row.xAu, row.yAu, row.zAu);
    }
  }

  for (const key of selectedKeys) {
    const expectedLength = epochs.length * 3;
    const actualLength = vectorsByKey.get(key).length;
    if (actualLength !== expectedLength) {
      throw new Error(
        `Vector length mismatch for ${key}: expected ${expectedLength}, got ${actualLength}. ` +
          "Run the matching refresh script for this stream."
      );
    }
  }

  return { epochs, vectorsByKey };
}

async function main() {
  const config = readJson(configPath);
  const header = readJson(path.join(v1Dir, "header.json"));
  const auxiliary = fs.existsSync(auxiliaryTargetsPath) ? readJson(auxiliaryTargetsPath) : { targets: [] };
  const formatConfig = config.formats[config.encoder];
  const encoder = ENCODERS[config.encoder];
  if (!encoder || !formatConfig) {
    throw new Error(`Unsupported v2 encoder: ${config.encoder}`);
  }

  const v1TargetsByKey = new Map(header.targets.map((target) => [target.key, target]));
  const primaryKeys = config.streams.primary.includeTargetKeys;
  const primaryTargets = primaryKeys.map((key) => {
    const target = v1TargetsByKey.get(key);
    if (!target) {
      throw new Error(`Unknown primary target key: ${key}`);
    }
    return targetForStream(target, "primary", config.bodyRenderDefaults);
  });
  const auxiliaryTargets = auxiliary.targets.map((target) =>
    targetForStream(target, "auxiliary", config.bodyRenderDefaults)
  );

  const allKeys = [...new Set([...primaryTargets, ...auxiliaryTargets].map((target) => target.key))];
  const { epochs, vectorsByKey } = await readVectors({ header, targetKeys: allKeys });

  fs.rmSync(path.join(v2Dir, "chunks"), { recursive: true, force: true });
  fs.mkdirSync(path.join(v2Dir, "chunks", "primary"), { recursive: true });
  fs.mkdirSync(path.join(v2Dir, "chunks", "auxiliary"), { recursive: true });

  const chunks = [];
  for (const [stream, targets] of [
    ["primary", primaryTargets],
    ["auxiliary", auxiliaryTargets]
  ]) {
    for (const planned of planChunks({
      stream,
      targets,
      epochs,
      vectorsByKey,
      config,
      datasetEndUtc: header.window.endUtc
    })) {
      const encoded = encoder({ chunk: planned, targets, header, formatConfig });
      const relativePath = `chunks/${stream}/${planned.id}.json`;
      const outPath = path.join(v2Dir, relativePath);
      fs.writeFileSync(outPath, encoded);
      chunks.push({
        id: planned.id,
        stream: planned.stream,
        kind: planned.kind,
        startUtc: planned.startUtc,
        endUtc: planned.endUtc,
        stepSeconds: DAY_SECONDS,
        samplesPerBody: planned.samplesPerBody,
        bodyKeys: planned.bodyKeys,
        format: config.encoder,
        contentType: formatConfig.contentType,
        compression: formatConfig.compression,
        vectorEncoding: formatConfig.vectorEncoding,
        url: `../../data/ephemeris/v2/${relativePath}`,
        byteLength: encoded.byteLength,
        sha256: sha256(encoded)
      });
    }
  }

  const manifest = {
    datasetVersion: config.datasetVersion,
    formatVersion: config.formatVersion,
    chunkSchema: config.chunkSchema,
    encoder: config.encoder,
    generatedOn: process.env.EPHEMERIS_GENERATED_ON_UTC ?? new Date().toISOString(),
    source: {
      provider: header.ephemerisSource.provider,
      kernel: header.ephemerisSource.kernel,
      retrievedOn: header.ephemerisSource.retrievedOn,
      canonicalDataset: "data/ephemeris/v1"
    },
    frame: header.frame,
    origin: header.origin,
    units: header.units,
    cadence: {
      step: header.cadence.step,
      stepSeconds: DAY_SECONDS
    },
    window: header.window,
    streams: {
      primary: {
        hotWindowYears: config.streams.primary.hotWindowYears,
        bodyKeys: primaryTargets.map((target) => target.key)
      },
      auxiliary: {
        hotWindowYears: config.streams.auxiliary.hotWindowYears,
        bodyKeys: auxiliaryTargets.map((target) => target.key)
      }
    },
    bodies: Object.fromEntries(
      [...primaryTargets, ...auxiliaryTargets].map((target) => [target.key, target])
    ),
    chunks
  };

  fs.writeFileSync(path.join(v2Dir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  const moduleSource = `// Generated from data/ephemeris/v2/manifest.json. Do not edit manually.\nexport const EPHEMERIS_V2_INDEX = Object.freeze(${JSON.stringify(manifest, null, 2)});\n`;
  fs.writeFileSync(outIndexPath, moduleSource);

  console.log(`Rebuilt v2 ephemeris chunks in ${path.relative(cwd, v2Dir)}`);
  console.log(`- chunks: ${chunks.length}`);
  console.log(`- wrote ${path.relative(cwd, outIndexPath)}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack : String(error));
  process.exitCode = 1;
});
