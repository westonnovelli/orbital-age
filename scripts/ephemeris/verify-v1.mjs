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

console.log(`Verified ${path.relative(cwd, dataDir)} ephemeris dataset.`);
console.log(`- ${rowCount} rows`);
console.log(`- sha256 ${sha}`);
