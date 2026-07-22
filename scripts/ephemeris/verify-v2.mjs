import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const cwd = process.cwd();
const v2Dir = path.resolve(cwd, process.env.EPHEMERIS_V2_DATA_DIR ?? "data/ephemeris/v2");
const manifestPath = path.join(v2Dir, "manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

function sha256(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

for (const field of ["datasetVersion", "formatVersion", "chunkSchema", "encoder", "chunks", "bodies"]) {
  assert(manifest[field] !== undefined, `manifest is missing ${field}`);
}

for (const chunk of manifest.chunks) {
  const chunkPath = path.resolve(v2Dir, chunk.url.replace("../../data/ephemeris/v2/", ""));
  assert(fs.existsSync(chunkPath), `missing chunk file: ${chunk.url}`);
  const buffer = fs.readFileSync(chunkPath);
  assert(buffer.byteLength === chunk.byteLength, `byteLength mismatch for ${chunk.id}`);
  assert(sha256(buffer) === chunk.sha256, `sha256 mismatch for ${chunk.id}`);

  const payload = JSON.parse(buffer.toString("utf8"));
  assert(payload.chunkId === chunk.id, `chunkId mismatch for ${chunk.id}`);
  assert(payload.format === chunk.format, `format mismatch for ${chunk.id}`);
  assert(payload.samplesPerBody === chunk.samplesPerBody, `samplesPerBody mismatch for ${chunk.id}`);
  for (const key of chunk.bodyKeys) {
    assert(payload.vectors[key], `chunk ${chunk.id} is missing vectors for ${key}`);
  }
}

for (const body of Object.values(manifest.bodies)) {
  if (body.renderClass === "beltSample") {
    assert(body.hasLabel === false, `beltSample ${body.key} must not have labels`);
    assert(body.hasTrail === false, `beltSample ${body.key} must not have trails`);
  }
}

for (const stream of Object.keys(manifest.streams)) {
  const streamChunks = manifest.chunks
    .filter((chunk) => chunk.stream === stream)
    .sort((a, b) => Date.parse(a.startUtc) - Date.parse(b.startUtc));
  for (let i = 1; i < streamChunks.length; i += 1) {
    const previous = streamChunks[i - 1];
    const current = streamChunks[i];
    assert(
      Date.parse(current.startUtc) <= Date.parse(previous.endUtc),
      `gap between ${previous.id} and ${current.id}`
    );
  }
}

console.log(`Verified ${path.relative(cwd, v2Dir)} ephemeris v2 dataset.`);
console.log(`- chunks: ${manifest.chunks.length}`);
