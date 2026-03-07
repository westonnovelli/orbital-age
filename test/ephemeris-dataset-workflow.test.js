import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import { EPHEMERIS_V1, EPHEMERIS_V1_BODY_KEYS } from "../src/ephemeris/generated-v1.js";

const DATA_DIR = path.resolve(process.cwd(), "data/ephemeris/v1");

test("generated ephemeris metadata stays aligned with dataset header contract", () => {
  const header = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "header.json"), "utf8"));

  assert.equal(EPHEMERIS_V1.schemaVersion, header.schemaVersion);
  assert.equal(EPHEMERIS_V1.frame, header.frame);
  assert.equal(EPHEMERIS_V1.origin, header.origin);
  assert.equal(EPHEMERIS_V1.startUtc, header.window.startUtc);
  assert.equal(EPHEMERIS_V1.endUtc, header.window.endUtc);
  assert.equal(EPHEMERIS_V1.samplesPerBody, header.cadence.samplesPerBody);

  const expectedKeys = header.targets.map((target) => target.key);
  assert.deepEqual(EPHEMERIS_V1_BODY_KEYS, expectedKeys);
});

test("manifest row count matches header cadence x target count", () => {
  const header = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "header.json"), "utf8"));
  const manifest = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "manifest.json"), "utf8"));

  const expectedRows = header.cadence.samplesPerBody * header.targets.length;
  assert.equal(manifest.rowCount, expectedRows);

  for (const target of header.targets) {
    const offset = manifest.bodyIndexOffsets[String(target.naifId)];
    assert.ok(offset, `missing offset for naifId ${target.naifId}`);
    assert.equal(offset.rowCount, header.cadence.samplesPerBody);
  }
});
