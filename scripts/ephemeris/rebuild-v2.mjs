import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import zlib from "node:zlib";
import { enabledBodies, loadCatalog, normalizedBody } from "./catalog.mjs";
import { encodeBinaryChunk } from "../../src/ephemeris/binary-chunk.js";

const cwd = process.cwd();
const v2Dir = path.resolve(cwd, process.env.EPHEMERIS_V2_DATA_DIR ?? "data/ephemeris/v2");
const sourcePath = path.resolve(cwd, process.env.EPHEMERIS_V2_SOURCE ?? path.join(v2Dir, "source.json"));
const primaryRawDir = path.resolve(cwd, process.env.EPHEMERIS_PRIMARY_RAW_DIR ?? path.join(v2Dir, "raw-horizons-primary"));
const outIndexPath = path.resolve(cwd, process.env.EPHEMERIS_V2_OUTPUT_MODULE ?? "src/ephemeris/generated-v2-index.js");

const DAY_SECONDS = 86400;
const DAY_MS = DAY_SECONDS * 1000;
const ENCODERS = {
  "json-base64": ({ chunk, targets, header, formatConfig, config }) => ({
    bytes: encodeJsonBase64Chunk({ chunk, targets, header, formatConfig, config }),
    extension: ".json"
  }),
  "binary-f32-gzip": encodeBinaryGzipChunk
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

function planChunks({ stream, group, targets, epochs, vectorsByKey, coverageStartByKey, coverageEndByKey, config, datasetEndUtc }) {
  if (targets.length === 0 || epochs.length === 0) {
    return [];
  }

  const streamConfig = config.datasets[stream];
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
    const chunkTargets = targets.filter((target) => {
      const coverageStart = coverageStartByKey.get(target.key);
      return coverageStart === undefined || Date.parse(coverageStart) <= epochs[endIndex] * 1000;
    });
    if (chunkTargets.length === 0) return;
    chunks.push({
      id: `${stream}-${group}-${kind}-${isoDate(isoMidnight(epochs[startIndex] * 1000))}-${isoDate(isoMidnight(epochs[endIndex] * 1000))}`,
      stream,
      group,
      kind,
      startIndex,
      endIndex,
      startUtc: isoMidnight(epochs[startIndex] * 1000),
      endUtc: isoMidnight(epochs[endIndex] * 1000),
      samplesPerBody: endIndex - startIndex + 1,
      bodyKeys: chunkTargets.map((target) => target.key),
      targetKeys: chunkTargets.map((target) => target.key)
    });
  }

  const recentStartIndex = Math.max(
    0,
    epochs.findIndex((epoch) => epoch * 1000 >= recentStartMs)
  );

  let start = 0;
  const historicalEnd = Math.max(0, recentStartIndex);
  const coverageBoundaries = [...new Set(
    targets
      .map((target) => coverageStartByKey.get(target.key))
      .filter(Boolean)
      .map((coverageStart) => epochs.findIndex((epoch) => epoch * 1000 >= Date.parse(coverageStart)))
      .filter((index) => index > 0 && index < historicalEnd)
  )].sort((a, b) => a - b);
  for (const boundary of [...coverageBoundaries, historicalEnd]) {
    while (start < boundary) {
      const end = Math.min(boundary, start + maxSamplesByUncompressed - 1);
      addChunk("historical", start, end);
      start = end;
    }
  }

  addChunk("recent", Math.max(0, historicalEnd), epochs.length - 1);

  return chunks.map((chunk) => {
    const vectors = {};
    for (const target of targets.filter((candidate) => chunk.targetKeys.includes(candidate.key))) {
      vectors[target.key] = vectorsByKey.get(target.key).slice(
        chunk.startIndex * 3,
        (chunk.endIndex + 1) * 3
      );
    }
    return { ...chunk, vectors };
  });
}

function encodeJsonBase64Chunk({ chunk, targets, header, formatConfig, config }) {
  const bodyVectors = {};
  for (const bodyKey of chunk.bodyKeys) {
    const array = Float32Array.from(chunk.vectors[bodyKey] ?? []);
    bodyVectors[bodyKey] = Buffer.from(array.buffer).toString("base64");
  }

  return Buffer.from(
    `${JSON.stringify(
      {
        datasetVersion: config.datasetVersion,
        formatVersion: config.formatVersion,
        chunkSchema: config.chunkSchema,
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

function encodeBinaryGzipChunk({ chunk, targets, header, config }) {
  const metadata = {
    datasetVersion: config.datasetVersion,
    formatVersion: config.formatVersion,
    chunkSchema: config.chunkSchema,
    stream: chunk.stream,
    group: chunk.group,
    chunkId: chunk.id,
    startUtc: chunk.startUtc,
    endUtc: chunk.endUtc,
    stepSeconds: DAY_SECONDS,
    samplesPerBody: chunk.samplesPerBody,
    frame: header.frame,
    origin: header.origin,
    bodyKeys: chunk.bodyKeys
  };
  const vectors = chunk.bodyKeys.map((bodyKey) => chunk.vectors[bodyKey] ?? []);
  const binary = encodeBinaryChunk({ metadata, vectors });
  return {
    bytes: zlib.gzipSync(binary, { level: zlib.constants.Z_BEST_COMPRESSION }),
    extension: ".bin.gz",
    uncompressedByteLength: binary.byteLength
  };
}

function parseHorizonsRows(result, target) {
  const start = result.indexOf("$$SOE");
  const end = result.indexOf("$$EOE");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error(`Horizons payload for ${target.key} has no vector section.`);
  }
  return result.slice(start + 5, end).trim().split(/\r?\n/).filter(Boolean).map((line) => {
    const columns = line.split(",").map((value) => value.trim());
    const julianDay = Number(columns[0]);
    const values = columns.slice(2).map(Number).filter(Number.isFinite);
    if (!Number.isFinite(julianDay) || values.length < 3) {
      throw new Error(`Invalid Horizons vector row for ${target.key}.`);
    }
    const epochUnixS = Math.round((julianDay - 2440587.5) * DAY_SECONDS);
    return { epochUnixS, epochUtc: new Date(epochUnixS * 1000).toISOString().replace(".000Z", "Z"), values: values.slice(0, 3) };
  });
}

async function readVectors({ source, targetKeys, auxiliaryKeys }) {
  const auxiliarySnapshotsPath = path.join(v2Dir, "auxiliary-snapshots.ndjson");
  const selectedKeys = new Set(targetKeys);
  const vectorsByKey = new Map([...selectedKeys].map((key) => [key, []]));
  const coverageStartByKey = new Map();
  const coverageEndByKey = new Map();
  const epochs = [];
  const primaryTargets = source.targets.filter((target) => target.synthetic !== "origin");
  for (const target of primaryTargets) {
    const rawPath = path.join(primaryRawDir, `${target.naifId}.json`);
    if (!fs.existsSync(rawPath)) throw new Error(`Missing primary Horizons payload: ${rawPath}`);
    const payload = readJson(rawPath);
    const rows = parseHorizonsRows(payload.result, target);
    if (epochs.length === 0) epochs.push(...rows.map((row) => row.epochUnixS));
    const coverageStartUtc = target.coverageStartUtc ?? source.window.startUtc;
    const firstIndex = epochs.findIndex((epoch) => epoch * 1000 >= Date.parse(coverageStartUtc));
    if (firstIndex < 0 || rows.length !== epochs.length - firstIndex) {
      throw new Error(`Primary payload coverage mismatch for ${target.key}.`);
    }
    for (let index = 0; index < rows.length; index += 1) {
      if (rows[index].epochUnixS !== epochs[firstIndex + index]) {
        throw new Error(`Primary payload epoch mismatch for ${target.key} at sample ${index}.`);
      }
    }
    if (selectedKeys.has(target.key)) {
      vectorsByKey.set(target.key, rows.flatMap((row) => row.values));
      coverageStartByKey.set(target.key, rows[0].epochUtc);
      coverageEndByKey.set(target.key, rows.at(-1).epochUtc);
    }
  }
  for (const target of source.targets.filter((candidate) => candidate.synthetic === "origin" && selectedKeys.has(candidate.key))) {
    vectorsByKey.set(target.key, new Array(epochs.length * 3).fill(0));
    coverageStartByKey.set(target.key, source.window.startUtc);
    coverageEndByKey.set(target.key, source.window.endUtc);
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
      if (!auxiliaryKeys.has(row.body)) {
        continue;
      }
      vectorsByKey.get(row.body).push(row.xAu, row.yAu, row.zAu);
      coverageStartByKey.set(row.body, coverageStartByKey.get(row.body) ?? row.epochUtc);
      coverageEndByKey.set(row.body, row.epochUtc);
    }
  }

  // Keep vectors aligned with the global epoch array. Bodies whose Horizons
  // kernels begin later are represented by a leading gap; those samples are
  // excluded from chunks until their coverage starts.
  for (const key of selectedKeys) {
    const coverageStart = coverageStartByKey.get(key);
    if (!coverageStart) continue;
    const firstIndex = epochs.findIndex((epoch) => epoch * 1000 >= Date.parse(coverageStart));
    if (firstIndex > 0) {
      vectorsByKey.set(key, [
        ...new Array(firstIndex * 3).fill(0),
        ...vectorsByKey.get(key)
      ]);
    }
  }

  for (const key of selectedKeys) {
    const expectedLength = epochs.length * 3;
    const actualLength = vectorsByKey.get(key).length;
    if (actualLength > expectedLength || actualLength % 3 !== 0) {
      throw new Error(
        `Vector length mismatch for ${key}: expected ${expectedLength}, got ${actualLength}. ` +
          "Run the matching refresh script for this stream."
      );
    }
    if (actualLength > 0 && actualLength < expectedLength) {
      const values = vectorsByKey.get(key);
      const last = values.slice(-3);
      while (values.length < expectedLength) values.push(...last);
    }
  }

  return { epochs, vectorsByKey, coverageStartByKey, coverageEndByKey };
}

async function main() {
  const catalog = loadCatalog(cwd);
  const config = {
    ...catalog.format,
    datasets: catalog.datasets,
    encoder: catalog.format.encoder,
    formats: {
      [catalog.format.encoder]: {
        contentType: catalog.format.contentType,
        compression: catalog.format.compression,
        vectorEncoding: catalog.format.vectorEncoding
      }
    }
  };
  const source = readJson(sourcePath);
  const formatConfig = config.formats[config.encoder];
  const encoder = ENCODERS[config.encoder];
  if (!encoder || !formatConfig) {
    throw new Error(`Unsupported v2 encoder: ${config.encoder}`);
  }

  const catalogTargetsBase = enabledBodies(catalog).map(normalizedBody);
  const sourceTargetsByKey = new Map(source.targets.map((target) => [target.key, target]));
  const catalogTargets = catalogTargetsBase.map((target) => ({
    ...target,
    ...(sourceTargetsByKey.get(target.key)?.coverageStartUtc
      ? { coverageStartUtc: sourceTargetsByKey.get(target.key).coverageStartUtc }
      : {}),
    ...(sourceTargetsByKey.get(target.key)?.coverageEndUtc
      ? { coverageEndUtc: sourceTargetsByKey.get(target.key).coverageEndUtc }
      : {})
  }));
  const primaryTargets = catalogTargets.filter((target) => target.stream === "primary");
  const auxiliaryTargets = catalogTargets.filter((target) => target.stream === "auxiliary");
  for (const target of primaryTargets) {
    if (!sourceTargetsByKey.has(target.key)) {
      throw new Error(`Primary catalog body ${target.key} is absent from the v2 source contract. Run data:ephemeris:refresh.`);
    }
  }

  const allKeys = [...new Set([...primaryTargets, ...auxiliaryTargets].map((target) => target.key))];
  const { epochs, vectorsByKey, coverageStartByKey, coverageEndByKey } = await readVectors({
    source,
    targetKeys: allKeys,
    auxiliaryKeys: new Set(auxiliaryTargets.map((target) => target.key))
  });
  // Auxiliary bodies are not listed in the primary source contract, so their
  // coverage cannot be copied from source metadata. Derive and publish their
  // first real sample from the auxiliary snapshot stream instead.
  for (const target of catalogTargets) {
    const coverageStart = coverageStartByKey.get(target.key);
    if (coverageStart && Date.parse(coverageStart) > Date.parse(source.window.startUtc)) {
      target.coverageStartUtc = coverageStart;
    }
    const coverageEnd = coverageEndByKey.get(target.key);
    if (coverageEnd && Date.parse(coverageEnd) < Date.parse(source.window.endUtc)) {
      target.coverageEndUtc = coverageEnd;
    }
  }

  fs.rmSync(path.join(v2Dir, "chunks"), { recursive: true, force: true });
  for (const dataset of Object.keys(config.datasets)) {
    fs.mkdirSync(path.join(v2Dir, "chunks", dataset), { recursive: true });
  }

  const chunks = [];
  for (const [stream] of Object.entries(config.datasets)) {
    const streamTargets = catalogTargets.filter((target) => target.dataset === stream);
    const groups = new Map();
    for (const target of streamTargets) {
      const group = target.group ?? target.kind ?? "default";
      const targets = groups.get(group) ?? [];
      targets.push(target);
      groups.set(group, targets);
    }
    for (const [group, targets] of groups) {
      for (const planned of planChunks({
        stream,
        group,
        targets,
        epochs,
        vectorsByKey,
        coverageStartByKey,
        coverageEndByKey,
        config,
        datasetEndUtc: source.window.endUtc
      })) {
      const encoded = encoder({ chunk: planned, targets, header: source, formatConfig, config });
      const relativePath = `chunks/${stream}/${group}/${planned.id}${encoded.extension}`;
      const outPath = path.join(v2Dir, relativePath);
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, encoded.bytes);
      chunks.push({
        id: planned.id,
        stream: planned.stream,
        group: planned.group,
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
        byteLength: encoded.bytes.byteLength,
        ...(encoded.uncompressedByteLength ? { uncompressedByteLength: encoded.uncompressedByteLength } : {}),
        sha256: sha256(encoded.bytes)
      });
      }
    }
  }

  const manifest = {
    datasetVersion: config.datasetVersion,
    formatVersion: config.formatVersion,
    chunkSchema: config.chunkSchema,
    encoder: config.encoder,
    generatedOn: process.env.EPHEMERIS_GENERATED_ON_UTC ?? new Date().toISOString(),
    compatibility: {
      manifestSchema: "ephemeris.manifest.v2",
      requiredFrame: catalog.ephemeris.frame,
      requiredOrigin: catalog.ephemeris.origin,
      requiredPositionUnit: catalog.ephemeris.units.position,
      requiredCadenceSeconds: catalog.ephemeris.cadence.stepSeconds
    },
    source: {
      provider: catalog.ephemeris.provider,
      kernel: source.ephemerisSource.kernel,
      retrievedOn: source.ephemerisSource.retrievedOn,
      canonicalDataset: "data/ephemeris/v2/source.json"
    },
    frame: catalog.ephemeris.frame,
    origin: catalog.ephemeris.origin,
    units: catalog.ephemeris.units,
    cadence: {
      step: source.cadence.step,
      stepSeconds: DAY_SECONDS
    },
    window: source.window,
    datasets: Object.fromEntries(Object.entries(config.datasets).map(([key, dataset]) => [key, {
      ...dataset,
      bodyKeys: catalogTargets.filter((body) => body.dataset === key).map((body) => body.key)
    }])),
    // `streams` remains an alias while callers migrate to the dataset contract.
    streams: {
      primary: {
        hotWindowYears: config.datasets.primary.hotWindowYears,
        load: config.datasets.primary.load,
        bodyKeys: primaryTargets.map((target) => target.key)
      },
      auxiliary: {
        hotWindowYears: config.datasets.auxiliary.hotWindowYears,
        load: config.datasets.auxiliary.load,
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
