import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

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

test("rebuild and verify scripts run end-to-end against a fixture dataset", () => {
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ephemeris-rebuild-verify-"));
  const dataDir = path.join(tmpRoot, "data");
  const outputModule = path.join(tmpRoot, "generated-v1.js");
  fs.mkdirSync(dataDir, { recursive: true });

  const header = {
    schemaVersion: "1.0.0",
    ephemerisSource: {
      provider: "test",
      kernel: "test",
      retrievedOn: "2026-03-07"
    },
    frame: "ECLIPJ2000",
    origin: "SUN",
    window: {
      startUtc: "1970-01-01T00:00:00Z",
      endUtc: "1970-01-02T00:00:00Z",
      days: 2
    },
    cadence: {
      step: "P1D",
      samplesPerBody: 2
    },
    targets: [
      { key: "sun", naifId: 10 },
      { key: "earth", naifId: 399 }
    ],
    ordering: {
      primary: "epochUnixS",
      secondary: "naifId"
    }
  };

  const fixtureRows = [
    { epochUtc: "1970-01-01T00:00:00Z", epochUnixS: 0, naifId: 10, body: "sun", frame: "ECLIPJ2000", origin: "SUN", xAu: 0, yAu: 0, zAu: 0 },
    { epochUtc: "1970-01-01T00:00:00Z", epochUnixS: 0, naifId: 399, body: "earth", frame: "ECLIPJ2000", origin: "SUN", xAu: 1, yAu: 2, zAu: 3 },
    { epochUtc: "1970-01-02T00:00:00Z", epochUnixS: 86400, naifId: 10, body: "sun", frame: "ECLIPJ2000", origin: "SUN", xAu: 0, yAu: 0, zAu: 0 },
    { epochUtc: "1970-01-02T00:00:00Z", epochUnixS: 86400, naifId: 399, body: "earth", frame: "ECLIPJ2000", origin: "SUN", xAu: 4, yAu: 5, zAu: 6 }
  ];

  fs.writeFileSync(path.join(dataDir, "header.json"), `${JSON.stringify(header, null, 2)}\n`);
  fs.writeFileSync(path.join(dataDir, "snapshots.ndjson"), fixtureRows.map((row) => JSON.stringify(row)).join("\n") + "\n");

  const env = {
    ...process.env,
    EPHEMERIS_DATA_DIR: dataDir,
    EPHEMERIS_OUTPUT_MODULE: outputModule,
    EPHEMERIS_GENERATED_ON_UTC: "2026-03-07T00:00:00.000Z"
  };

  execFileSync("node", ["scripts/ephemeris/rebuild-v1.mjs"], { cwd: process.cwd(), env, stdio: "pipe" });
  execFileSync("node", ["scripts/ephemeris/verify-v1.mjs"], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      EPHEMERIS_DATA_DIR: dataDir
    },
    stdio: "pipe"
  });

  assert.equal(fs.existsSync(path.join(dataDir, "manifest.json")), true);
  assert.equal(fs.existsSync(path.join(dataDir, "snapshots.ndjson.gz")), true);
  assert.equal(fs.existsSync(outputModule), true);
});

test("refresh script rebuilds snapshots from cached Horizons payloads", () => {
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ephemeris-refresh-"));
  const dataDir = path.join(tmpRoot, "data");
  const rawDir = path.join(dataDir, "raw-horizons");
  fs.mkdirSync(rawDir, { recursive: true });

  const header = {
    schemaVersion: "1.0.0",
    ephemerisSource: {
      provider: "JPL NAIF / JPL Horizons",
      kernel: "de442s.bsp",
      retrievedOn: "2020-01-01"
    },
    frame: "ECLIPJ2000",
    origin: "SUN",
    window: {
      startUtc: "1970-01-01T00:00:00Z",
      endUtc: "1970-01-02T00:00:00Z",
      days: 2
    },
    cadence: {
      step: "P1D",
      samplesPerBody: 2
    },
    targets: [
      { key: "sun", naifId: 10 },
      { key: "earth", naifId: 399 }
    ],
    ordering: {
      primary: "epochUnixS",
      secondary: "naifId"
    }
  };

  const rawPayload = {
    result: [
      "*******************************************************************************",
      "$$SOE",
      "2440587.5, A.D. 1970-Jan-01 00:00:00.0000, 1, 2, 3, 0, 0, 0",
      "2440588.5, A.D. 1970-Jan-02 00:00:00.0000, 4, 5, 6, 0, 0, 0",
      "$$EOE"
    ].join("\n")
  };

  fs.writeFileSync(path.join(dataDir, "header.json"), `${JSON.stringify(header, null, 2)}\n`);
  fs.writeFileSync(path.join(rawDir, "399.json"), `${JSON.stringify(rawPayload, null, 2)}\n`);

  execFileSync("node", ["scripts/ephemeris/refresh-v1.mjs", "--yes", "--data-dir", dataDir, "--retrieved-on", "2026-03-07"], {
    cwd: process.cwd(),
    env: process.env,
    stdio: "pipe"
  });

  const refreshedHeader = JSON.parse(fs.readFileSync(path.join(dataDir, "header.json"), "utf8"));
  assert.equal(refreshedHeader.ephemerisSource.retrievedOn, "2026-03-07");

  const refreshedRows = fs
    .readFileSync(path.join(dataDir, "snapshots.ndjson"), "utf8")
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line));

  assert.equal(refreshedRows.length, 4);
  assert.deepEqual(
    refreshedRows.map((row) => [row.epochUnixS, row.naifId]),
    [
      [0, 10],
      [0, 399],
      [86400, 10],
      [86400, 399]
    ]
  );
});
