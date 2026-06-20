import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import crypto from "node:crypto";
import readline from "node:readline";

const cwd = process.cwd();
const dataDir = path.resolve(cwd, process.env.EPHEMERIS_DATA_DIR ?? "data/ephemeris/v1");
const headerPath = path.join(dataDir, "header.json");
const snapshotsPath = path.join(dataDir, "snapshots.ndjson");
const snapshotsGzPath = path.join(dataDir, "snapshots.ndjson.gz");
const manifestPath = path.join(dataDir, "manifest.json");

const header = JSON.parse(fs.readFileSync(headerPath, "utf8"));
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

const snapshotsBuffer = fs.readFileSync(snapshotsPath);
const sha = crypto.createHash("sha256").update(snapshotsBuffer).digest("hex");
if (sha !== manifest.datasetSha256) {
  throw new Error(`datasetSha256 mismatch: manifest=${manifest.datasetSha256}, actual=${sha}`);
}

const gunzipped = zlib.gunzipSync(fs.readFileSync(snapshotsGzPath));
if (!gunzipped.equals(snapshotsBuffer)) {
  throw new Error("snapshots.ndjson.gz does not round-trip to snapshots.ndjson");
}

const countsByNaifId = new Map(header.targets.map((target) => [target.naifId, 0]));
let rowCount = 0;
let previousUnix = -Infinity;

const stream = fs.createReadStream(snapshotsPath, { encoding: "utf8" });
const lineReader = readline.createInterface({ input: stream, crlfDelay: Infinity });
for await (const line of lineReader) {
  if (!line.trim()) {
    continue;
  }

  const row = JSON.parse(line);
  if (!countsByNaifId.has(row.naifId)) {
    throw new Error(`Unexpected naifId in snapshots: ${row.naifId}`);
  }

  countsByNaifId.set(row.naifId, countsByNaifId.get(row.naifId) + 1);

  if (row.epochUnixS < previousUnix) {
    throw new Error(`Rows are not epoch-sorted at row ${rowCount}`);
  }
  previousUnix = row.epochUnixS;

  rowCount += 1;
}

if (rowCount !== manifest.rowCount) {
  throw new Error(`rowCount mismatch: manifest=${manifest.rowCount}, actual=${rowCount}`);
}

for (const target of header.targets) {
  const count = countsByNaifId.get(target.naifId);
  if (count !== header.cadence.samplesPerBody) {
    throw new Error(`Row count mismatch for ${target.key} (${target.naifId}): expected ${header.cadence.samplesPerBody}, got ${count}`);
  }
}

// Derived-dataset consistency: every body annotated with `relativeTo` must
// reference a real tracked body, and (when the generated module is the default
// one) its derived blob must have exactly `samplesPerBody` rows. The primary
// (barycentric) blobs are validated above and remain unchanged by derivation.
const naifIds = new Set(header.targets.map((target) => target.naifId));
const derivedTargets = header.targets.filter(
  (target) => target.relativeTo !== undefined && target.relativeTo !== null
);
for (const target of derivedTargets) {
  if (!naifIds.has(target.relativeTo)) {
    throw new Error(
      `relativeTo target ${target.relativeTo} for "${target.key}" is not a tracked body.`
    );
  }
}

const outModulePath = path.resolve(cwd, process.env.EPHEMERIS_OUTPUT_MODULE ?? "src/ephemeris/generated-v1.js");
if (derivedTargets.length > 0 && fs.existsSync(outModulePath)) {
  const generated = await import(`file://${outModulePath}`);
  const derivedMeta = generated.EPHEMERIS_V1_DERIVED;
  const derivedVectors = generated.EPHEMERIS_V1_DERIVED_VECTORS_BASE64;
  if (derivedMeta && derivedVectors) {
    for (const target of derivedTargets) {
      const descriptor = derivedMeta.bodies?.[target.key];
      if (!descriptor) {
        throw new Error(`Generated module is missing derived descriptor for "${target.key}".`);
      }
      if (descriptor.relativeTo !== target.relativeTo) {
        throw new Error(
          `Derived descriptor relativeTo mismatch for "${target.key}": header=${target.relativeTo}, module=${descriptor.relativeTo}`
        );
      }
      if (descriptor.rowCount !== header.cadence.samplesPerBody) {
        throw new Error(
          `Derived row count mismatch for "${target.key}": expected ${header.cadence.samplesPerBody}, got ${descriptor.rowCount}`
        );
      }
      const encoded = derivedVectors[target.key];
      if (!encoded) {
        throw new Error(`Generated module is missing derived vectors for "${target.key}".`);
      }
    }
    console.log(`- derived datasets: ${derivedTargets.map((t) => t.key).join(", ")}`);
  }
}

console.log(`Verified ${path.relative(cwd, dataDir)} ephemeris dataset.`);
console.log(`- ${rowCount} rows`);
console.log(`- sha256 ${sha}`);
