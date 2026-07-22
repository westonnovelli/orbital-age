import test from "node:test";
import assert from "node:assert/strict";

import {
  EphemerisDataMissingError,
  bodyPathLengthAuBetween,
  ensureEphemerisLoaded,
  ephemerisBootPromise,
  getBodyPositionAuAtInstant,
  getLoadedCoverage,
  hasBodyPosition,
  planEphemerisLoad
} from "../src/ephemeris/runtime.js";

test("v2 boot path loads primary coverage in Node", async () => {
  await ephemerisBootPromise;

  assert.equal(hasBodyPosition("earth", "2026-07-03T00:00:00Z"), true);
  const coverage = getLoadedCoverage({ stream: "primary", bodyKeys: ["earth"] });
  assert.ok(coverage);
  assert.equal(coverage.startUtc, "1926-01-01T00:00:00Z");
});

test("older primary dates produce a deterministic load plan", () => {
  const plan = planEphemerisLoad({
    startUtc: "1955-05-05T00:00:00Z",
    endUtc: "2026-07-03T00:00:00Z",
    streams: ["primary"]
  });

  assert.equal(plan.streams[0], "primary");
  assert.ok(plan.chunks.length >= 2);
  assert.equal(plan.chunks.at(-1).kind, "recent");
});

test("ensureEphemerisLoaded is idempotent for already loaded chunks", async () => {
  await ephemerisBootPromise;
  const before = planEphemerisLoad({
    startUtc: "1988-01-01T00:00:00Z",
    endUtc: "2026-07-03T00:00:00Z",
    streams: ["primary"]
  });
  assert.equal(before.loaded, true);

  const after = await ensureEphemerisLoaded({
    startUtc: "1988-01-01T00:00:00Z",
    endUtc: "2026-07-03T00:00:00Z",
    streams: ["primary"]
  });

  assert.equal(after.loaded, true);
  assert.equal(after.missingChunks.length, 0);
});

test("v2 interpolation works across a chunk boundary", async () => {
  await ephemerisBootPromise;

  const before = getBodyPositionAuAtInstant("earth", "1986-07-03T12:00:00Z");
  const boundary = getBodyPositionAuAtInstant("earth", "1986-07-04T00:00:00Z");
  const after = getBodyPositionAuAtInstant("earth", "1986-07-04T12:00:00Z");

  assert.ok(Number.isFinite(before.xAu));
  assert.ok(Number.isFinite(boundary.xAu));
  assert.ok(Number.isFinite(after.xAu));
  assert.notEqual(before.xAu, after.xAu);
});

test("path length stitches loaded chunks", async () => {
  await ephemerisBootPromise;

  const au = bodyPathLengthAuBetween("earth", "1977-11-06T00:00:00Z", "1977-11-08T00:00:00Z");
  assert.ok(au > 0);
});

test("unloaded auxiliary body reads throw a load-plan error", () => {
  assert.throws(
    () => getBodyPositionAuAtInstant("ceres", "2026-01-01T00:00:00Z"),
    EphemerisDataMissingError
  );
});
