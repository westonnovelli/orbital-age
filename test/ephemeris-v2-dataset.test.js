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

  assert.equal(manifest.datasetVersion, "2.1.0");
  assert.equal(manifest.compatibility.manifestSchema, "ephemeris.manifest.v2");
  assert.equal(manifest.datasets.primary.load, "eager");
  assert.equal(manifest.datasets.auxiliary.load, "lazy");
  assert.equal(manifest.formatVersion, "1.0.0");
  assert.equal(manifest.chunkSchema, "ephemeris.chunk.v2");
  assert.equal(manifest.encoder, "binary-f32-gzip");
  assert.equal(manifest.chunks.every((chunk) => chunk.format === "binary-f32-gzip"), true);
  assert.equal(manifest.chunks.every((chunk) => chunk.vectorEncoding === "float32-le"), true);
});

test("v2 has a sharded primary source contract below GitHub's file limit", () => {
  const source = readJson("source.json");
  const limit = 100 * 1024 * 1024;

  assert.equal(source.schemaVersion, "ephemeris.source.v2");
  assert.equal(source.frame, "ECLIPJ2000");
  assert.equal(source.origin, "SSB");
  for (const target of source.targets.filter((target) => target.synthetic !== "origin")) {
    const rawPath = path.join(DATA_DIR, "raw-horizons-primary", `${target.naifId}.json`);
    assert.ok(fs.existsSync(rawPath), `missing primary source payload for ${target.key}`);
    assert.ok(fs.statSync(rawPath).size < limit, `${target.key} payload exceeds GitHub's file limit`);
  }
});

test("v2 primary stream has a recent hot chunk and historical chunks", () => {
  const manifest = readJson("manifest.json");
  const primaryChunks = manifest.chunks.filter((chunk) => chunk.stream === "primary");

  assert.ok(primaryChunks.some((chunk) => chunk.kind === "recent"));
  assert.ok(primaryChunks.some((chunk) => chunk.kind === "historical"));
  assert.ok(new Set(primaryChunks.map((chunk) => chunk.group)).has("primary"));
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

test("v2 auxiliary stream has named bodies and lazy chunks", () => {
  const manifest = readJson("manifest.json");
  const auxiliaryChunks = manifest.chunks.filter((chunk) => chunk.stream === "auxiliary");

  assert.ok(auxiliaryChunks.some((chunk) => chunk.kind === "recent"));
  assert.ok(auxiliaryChunks.some((chunk) => chunk.kind === "historical"));
  assert.ok(manifest.streams.auxiliary.bodyKeys.includes("ceres"));
  assert.ok(manifest.streams.auxiliary.bodyKeys.includes("halley"));
  assert.equal(manifest.bodies.ceres.hasLabel, false);
  assert.equal(manifest.bodies.ceres.hasTrail, false);
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

test("asteroid belt has 100 visible marker-only bodies", () => {
  const manifest = readJson("manifest.json");
  const beltBodies = Object.values(manifest.bodies)
    .filter((body) => body.layers.includes("asteroidBelt"));

  assert.equal(beltBodies.length, 100);
  for (const body of beltBodies) {
    assert.equal(body.capabilities.canRender, true);
    assert.equal(body.capabilities.canShowByDefault, true);
    assert.equal(body.capabilities.canFitCamera, false);
    assert.equal(body.hasLabel, false);
    assert.equal(body.hasTrail, false);
    assert.equal(body.capabilities.canFollow, false);
    assert.equal(body.capabilities.canShowDistance, false);
  }
});
