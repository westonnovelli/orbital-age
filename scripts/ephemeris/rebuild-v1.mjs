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

const keyListLiteral = `[${keys.map((key) => JSON.stringify(key)).join(", ")}]`;
const moduleSource = `// Generated from data/ephemeris/v1/snapshots.ndjson. Do not edit manually.\nexport const EPHEMERIS_V1 = Object.freeze(${JSON.stringify(generated, null, 2)});\n\nexport const EPHEMERIS_V1_BODY_VECTORS_BASE64 = Object.freeze(${JSON.stringify(vectorsBase64, null, 2)});\n\nexport const EPHEMERIS_V1_BODY_KEYS = Object.freeze(${keyListLiteral});\n`;

fs.writeFileSync(outModulePath, moduleSource);

console.log(`Rebuilt ephemeris dataset artifacts from ${snapshotsPath}`);
console.log(`- wrote ${path.relative(cwd, snapshotsGzPath)}`);
console.log(`- wrote ${path.relative(cwd, manifestPath)}`);
console.log(`- wrote ${path.relative(cwd, outModulePath)}`);
