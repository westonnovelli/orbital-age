import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const DATA_DIR = path.resolve(process.cwd(), "data/ephemeris/v2");

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, relativePath), "utf8"));
}

test("v2 manifest carries tunable format metadata", () => {
  const manifest = readJson("manifest.json");

  assert.equal(manifest.datasetVersion, "2.0.0");
  assert.equal(manifest.formatVersion, "1.0.0");
  assert.equal(manifest.chunkSchema, "ephemeris.chunk.v1");
  assert.equal(manifest.encoder, "json-base64");
  assert.equal(manifest.chunks.every((chunk) => chunk.format === "json-base64"), true);
  assert.equal(manifest.chunks.every((chunk) => chunk.vectorEncoding === "float32-base64"), true);
});

test("v2 primary stream has a recent hot chunk and historical chunks", () => {
  const manifest = readJson("manifest.json");
  const primaryChunks = manifest.chunks.filter((chunk) => chunk.stream === "primary");

  assert.ok(primaryChunks.some((chunk) => chunk.kind === "recent"));
  assert.ok(primaryChunks.some((chunk) => chunk.kind === "historical"));
  assert.deepEqual(manifest.streams.primary.bodyKeys, [
    "sun",
    "mercury",
    "venus",
    "earth",
    "mars",
    "jupiter",
    "saturn",
    "uranus",
    "neptune",
    "pluto",
    "moon"
  ]);
});

test("v2 chunk byte and hash metadata matches files", () => {
  const manifest = readJson("manifest.json");

  for (const chunk of manifest.chunks) {
    const relativePath = chunk.url.replace("../../data/ephemeris/v2/", "");
    const buffer = fs.readFileSync(path.join(DATA_DIR, relativePath));
    assert.equal(buffer.byteLength, chunk.byteLength);
    assert.equal(crypto.createHash("sha256").update(buffer).digest("hex"), chunk.sha256);
  }
});

test("belt sample bodies are never label or trail enabled", () => {
  const manifest = readJson("manifest.json");

  for (const body of Object.values(manifest.bodies)) {
    if (body.renderClass === "beltSample") {
      assert.equal(body.hasLabel, false);
      assert.equal(body.hasTrail, false);
    }
  }
});
