import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import zlib from "node:zlib";
import crypto from "node:crypto";

const cwd = process.cwd();
const dataDir = path.resolve(cwd, process.env.EPHEMERIS_DATA_DIR ?? "data/ephemeris/v1");
const outModulePath = path.resolve(cwd, process.env.EPHEMERIS_OUTPUT_MODULE ?? "src/ephemeris/generated-v1.js");
const headerPath = path.join(dataDir, "header.json");
const snapshotsPath = path.join(dataDir, "snapshots.ndjson");
const snapshotsGzPath = path.join(dataDir, "snapshots.ndjson.gz");
const manifestPath = path.join(dataDir, "manifest.json");

const header = JSON.parse(fs.readFileSync(headerPath, "utf8"));
const targetByNaifId = new Map(header.targets.map((target) => [target.naifId, target.key]));
const vectorsByKey = new Map(header.targets.map((target) => [target.key, []]));
const offsets = new Map();
let rowCount = 0;

const stream = fs.createReadStream(snapshotsPath, { encoding: "utf8" });
const lineReader = readline.createInterface({ input: stream, crlfDelay: Infinity });

for await (const line of lineReader) {
  if (!line.trim()) {
    continue;
  }

  const row = JSON.parse(line);
  const key = targetByNaifId.get(row.naifId);
  if (!key) {
    throw new Error(`Unknown naifId in snapshots: ${row.naifId}`);
  }

  const vectors = vectorsByKey.get(key);
  vectors.push(Number(row.xAu), Number(row.yAu), Number(row.zAu));

  const state = offsets.get(row.naifId) ?? { startRow: rowCount, stride: null, rowCount: 0, lastRow: null };
  if (state.lastRow !== null && state.stride === null) {
    state.stride = rowCount - state.lastRow;
  }
  if (state.lastRow !== null && state.stride !== null) {
    const observedStride = rowCount - state.lastRow;
    if (observedStride !== state.stride) {
      throw new Error(`Inconsistent stride for naifId ${row.naifId}: expected ${state.stride}, got ${observedStride}`);
    }
  }

  state.rowCount += 1;
  state.lastRow = rowCount;
  offsets.set(row.naifId, state);

  rowCount += 1;
}

const snapshotsBuffer = fs.readFileSync(snapshotsPath);
const datasetSha256 = crypto.createHash("sha256").update(snapshotsBuffer).digest("hex");
fs.writeFileSync(snapshotsGzPath, zlib.gzipSync(snapshotsBuffer, { level: zlib.constants.Z_BEST_COMPRESSION }));

const manifest = {
  datasetSha256,
  bodyIndexOffsets: Object.fromEntries(
    [...offsets.entries()].map(([naifId, state]) => [
      String(naifId),
      {
        startRow: state.startRow,
        stride: state.stride ?? 0,
        rowCount: state.rowCount
      }
    ])
  ),
  rowCount,
  generatedOn: process.env.EPHEMERIS_GENERATED_ON_UTC ?? new Date().toISOString()
};

fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

const generated = {
  schemaVersion: header.schemaVersion,
  frame: header.frame,
  origin: header.origin,
  startUtc: header.window.startUtc,
  endUtc: header.window.endUtc,
  stepSeconds: 86400,
  samplesPerBody: header.cadence.samplesPerBody,
  targets: header.targets
};

const keys = header.targets.map((target) => target.key);
const vectorsBase64 = {};
for (const key of keys) {
  const values = vectorsByKey.get(key);
  const vectorArray = Float32Array.from(values);
  vectorsBase64[key] = Buffer.from(vectorArray.buffer).toString("base64");
}

// Derived datasets: every body's primary blob is barycentric (uniform, honest).
// Bodies annotated with `relativeTo: <naifId>` in header.targets additionally
// get a *separate derived blob* holding their per-epoch offset relative to the
// referenced parent body (`delta = body_ssb - parent_ssb`). This keeps the
// primary dataset uniform while still letting the render layer fetch a small
// Earth-relative offset (e.g. the Moon) without recomputing it. The primary
// `EPHEMERIS_V1_BODY_VECTORS_BASE64["moon"]` remains true barycentric.
const keyByNaifId = new Map(header.targets.map((target) => [target.naifId, target.key]));
const derivedVectorsBase64 = {};
const derivedDescriptors = {};
for (const target of header.targets) {
  if (target.relativeTo === undefined || target.relativeTo === null) {
    continue;
  }
  const parentKey = keyByNaifId.get(target.relativeTo);
  if (!parentKey) {
    throw new Error(
      `relativeTo target ${target.relativeTo} for "${target.key}" is not a tracked body.`
    );
  }
  const bodyValues = vectorsByKey.get(target.key);
  const parentValues = vectorsByKey.get(parentKey);
  if (bodyValues.length !== parentValues.length) {
    throw new Error(
      `Cannot derive "${target.key}" relative to "${parentKey}": vector length mismatch.`
    );
  }
  const delta = new Float32Array(bodyValues.length);
  for (let i = 0; i < bodyValues.length; i += 1) {
    delta[i] = bodyValues[i] - parentValues[i];
  }
  derivedVectorsBase64[target.key] = Buffer.from(delta.buffer).toString("base64");
  derivedDescriptors[target.key] = {
    relativeTo: target.relativeTo,
    relativeToKey: parentKey,
    rowCount: delta.length / 3
  };
}

const derivedMeta = {
  schemaVersion: header.schemaVersion,
  frame: header.frame,
  startUtc: header.window.startUtc,
  endUtc: header.window.endUtc,
  stepSeconds: 86400,
  samplesPerBody: header.cadence.samplesPerBody,
  bodies: derivedDescriptors
};

const keyListLiteral = `[${keys.map((key) => JSON.stringify(key)).join(", ")}]`;
const derivedKeys = Object.keys(derivedVectorsBase64);
const derivedKeyListLiteral = `[${derivedKeys.map((key) => JSON.stringify(key)).join(", ")}]`;
const moduleSource = `// Generated from data/ephemeris/v1/snapshots.ndjson. Do not edit manually.\nexport const EPHEMERIS_V1 = Object.freeze(${JSON.stringify(generated, null, 2)});\n\nexport const EPHEMERIS_V1_BODY_VECTORS_BASE64 = Object.freeze(${JSON.stringify(vectorsBase64, null, 2)});\n\nexport const EPHEMERIS_V1_BODY_KEYS = Object.freeze(${keyListLiteral});\n\nexport const EPHEMERIS_V1_DERIVED = Object.freeze(${JSON.stringify(derivedMeta, null, 2)});\n\nexport const EPHEMERIS_V1_DERIVED_VECTORS_BASE64 = Object.freeze(${JSON.stringify(derivedVectorsBase64, null, 2)});\n\nexport const EPHEMERIS_V1_DERIVED_BODY_KEYS = Object.freeze(${derivedKeyListLiteral});\n`;

fs.writeFileSync(outModulePath, moduleSource);

console.log(`Rebuilt ephemeris dataset artifacts from ${snapshotsPath}`);
console.log(`- wrote ${path.relative(cwd, snapshotsGzPath)}`);
console.log(`- wrote ${path.relative(cwd, manifestPath)}`);
console.log(`- wrote ${path.relative(cwd, outModulePath)}`);
