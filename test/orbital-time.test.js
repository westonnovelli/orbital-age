import test from "node:test";
import assert from "node:assert/strict";

import {
  SUPPORTED_DATE_RANGE,
  assertDateInSupportedRange,
  bodyHeliocentricPositionAuAtInstant,
  computeOrbitalTimelineState,
  daysBetweenUtc,
  earthHeliocentricPositionAuAtInstant,
  earthPositionOnUnitOrbitAtInstant,
  earthPositionOnUnitOrbit,
  normalizeToUtcMidnight,
  parseIsoDateUtc
} from "../src/orbital-time.js";

test("parseIsoDateUtc enforces strict YYYY-MM-DD and calendar validity", () => {
  assert.equal(parseIsoDateUtc("2020-02-29").toISOString(), "2020-02-29T00:00:00.000Z");

  assert.throws(() => parseIsoDateUtc("2020-2-29"), /Expected YYYY-MM-DD/);
  assert.throws(() => parseIsoDateUtc("2019-02-29"), /Invalid calendar date/);
});

test("daysBetweenUtc handles leap and non-leap year boundaries", () => {
  assert.equal(daysBetweenUtc("2020-02-28", "2020-03-01"), 2);
  assert.equal(daysBetweenUtc("2019-02-28", "2019-03-01"), 1);
});

test("normalizeToUtcMidnight uses UTC day boundaries for timezone-safe determinism", () => {
  const normalized = normalizeToUtcMidnight("2020-07-01T23:30:00-05:00");
  assert.equal(normalized.toISOString(), "2020-07-02T00:00:00.000Z");
});

test("normalizeToUtcMidnight rejects ambiguous strings without explicit timezone", () => {
  assert.throws(
    () => normalizeToUtcMidnight("2024-01-15T00:00:00"),
    /explicit timezone/
  );
});

test("normalizeToUtcMidnight accepts explicit-zone ISO timestamps deterministically", () => {
  const withOffset = normalizeToUtcMidnight("2024-01-15T03:00:00+03:00");
  const withZ = normalizeToUtcMidnight("2024-01-15T00:00:00Z");

  assert.equal(withOffset.toISOString(), "2024-01-15T00:00:00.000Z");
  assert.equal(withOffset.toISOString(), withZ.toISOString());
});

test("assertDateInSupportedRange enforces model range", () => {
  assert.equal(assertDateInSupportedRange(SUPPORTED_DATE_RANGE.min).toISOString(), "1926-01-01T00:00:00.000Z");
  assert.equal(assertDateInSupportedRange(SUPPORTED_DATE_RANGE.max).toISOString(), "2025-12-31T00:00:00.000Z");

  assert.throws(() => assertDateInSupportedRange("1925-12-31"), /outside supported range/);
  assert.throws(() => assertDateInSupportedRange("2026-01-01"), /outside supported range/);
});

test("computeOrbitalTimelineState returns deterministic normalized progress and position", () => {
  const state = computeOrbitalTimelineState({
    birthday: "2000-01-01",
    timelineDate: "2000-07-02",
    maxTimelineDate: "2000-12-31"
  });

  assert.deepEqual(
    {
      birthdayUtc: state.birthdayUtc,
      timelineDateUtc: state.timelineDateUtc,
      maxTimelineDateUtc: state.maxTimelineDateUtc,
      elapsedDays: state.elapsedDays,
      totalTimelineDays: state.totalTimelineDays
    },
    {
      birthdayUtc: "2000-01-01",
      timelineDateUtc: "2000-07-02",
      maxTimelineDateUtc: "2000-12-31",
      elapsedDays: 183,
      totalTimelineDays: 365
    }
  );

  assert.equal(state.normalizedProgress, 183 / 365);
  assert.ok(state.earth.longitudeDeg >= 0 && state.earth.longitudeDeg < 360);

  const radius = Math.hypot(state.earth.x, state.earth.y);
  assert.ok(Math.abs(radius - 1) < 1e-12);
});

test("computeOrbitalTimelineState rejects out-of-order timeline dates", () => {
  assert.throws(
    () =>
      computeOrbitalTimelineState({
        birthday: "2000-01-02",
        timelineDate: "2000-01-01",
        maxTimelineDate: "2000-12-31"
      }),
    /cannot be before birthday/
  );

  assert.throws(
    () =>
      computeOrbitalTimelineState({
        birthday: "2000-01-01",
        timelineDate: "2001-01-01",
        maxTimelineDate: "2000-12-31"
      }),
    /cannot be after max timeline date/
  );
});

test("earthPositionOnUnitOrbit is deterministic for same UTC day input", () => {
  const byIso = earthPositionOnUnitOrbit("2024-01-15");
  const byDate = earthPositionOnUnitOrbit(new Date("2024-01-15T03:00:00+03:00"));

  assert.equal(byIso.longitudeDeg, byDate.longitudeDeg);
  assert.equal(byIso.x, byDate.x);
  assert.equal(byIso.y, byDate.y);
});

test("earthPositionOnUnitOrbitAtInstant changes smoothly within the same UTC day", () => {
  const start = earthPositionOnUnitOrbitAtInstant("2024-01-15T00:00:00Z");
  const midday = earthPositionOnUnitOrbitAtInstant("2024-01-15T12:00:00Z");

  assert.notEqual(start.longitudeDeg, midday.longitudeDeg);
  const radius = Math.hypot(midday.x, midday.y);
  assert.ok(Math.abs(radius - 1) < 1e-12);
});

test("earth heliocentric AU position uses ephemeris values and linear interpolation", () => {
  const midnight = earthHeliocentricPositionAuAtInstant("1926-01-01T00:00:00Z");
  assert.equal(midnight.xAu, -0.18536214530467987);
  assert.equal(midnight.yAu, 0.9655858278274536);

  const midday = earthHeliocentricPositionAuAtInstant("1926-01-01T12:00:00Z");
  assert.ok(Math.abs(midday.xAu - -0.19393327087163925) < 1e-12);
  assert.ok(Math.abs(midday.yAu - 0.9638592302799225) < 1e-12);
});

test("bodyHeliocentricPositionAuAtInstant supports multiple planets", () => {
  const mars = bodyHeliocentricPositionAuAtInstant("mars", "1926-01-01T00:00:00Z");
  assert.equal(mars.body, "mars");
  assert.equal(mars.xAu, -1.1745277643203735);
  assert.equal(mars.yAu, -1.0424778461456299);

  assert.throws(
    () => bodyHeliocentricPositionAuAtInstant("pluto", "1926-01-01T00:00:00Z"),
    /Unsupported body/
  );
});
