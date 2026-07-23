import test from "node:test";
import assert from "node:assert/strict";

import {
  SUPPORTED_DATE_RANGE,
  assertDateInSupportedRange,
  bodyHeliocentricPositionAuAtInstant,
  bodyEarthRelativePositionAuAtInstant,
  computeOrbitalTimelineState,
  daysBetweenUtc,
  earthHeliocentricPositionAuAtInstant,
  earthPositionOnUnitOrbitAtInstant,
  earthPositionOnUnitOrbit,
  ensureEphemerisLoaded,
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

// The dataset window advances over time (Phase 5 extends it through "today + 1" on
// every scheduled refresh), so boundary expectations are derived from the live
// SUPPORTED_DATE_RANGE rather than pinned to fixed calendar dates.
const MS_PER_DAY_TEST = 86400000;

function isoDayOffset(isoDay, days) {
  return new Date(Date.parse(`${isoDay}T00:00:00Z`) + days * MS_PER_DAY_TEST)
    .toISOString()
    .slice(0, 10);
}

test("assertDateInSupportedRange enforces model range", () => {
  assert.equal(
    assertDateInSupportedRange(SUPPORTED_DATE_RANGE.min).toISOString(),
    `${SUPPORTED_DATE_RANGE.min}T00:00:00.000Z`
  );
  assert.equal(
    assertDateInSupportedRange(SUPPORTED_DATE_RANGE.max).toISOString(),
    `${SUPPORTED_DATE_RANGE.max}T00:00:00.000Z`
  );

  assert.throws(
    () => assertDateInSupportedRange(isoDayOffset(SUPPORTED_DATE_RANGE.min, -1)),
    /outside supported range/
  );
  assert.throws(
    () => assertDateInSupportedRange(isoDayOffset(SUPPORTED_DATE_RANGE.max, 1)),
    /outside supported range/
  );
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
  assert.equal(midnight.xAu, -0.18583723902702332);
  assert.equal(midnight.yAu, 0.9709631204605103);

  const midday = earthHeliocentricPositionAuAtInstant("1926-01-01T12:00:00Z");
  assert.ok(Math.abs(midday.xAu - -0.19441179931163788) < 1e-12);
  assert.ok(Math.abs(midday.yAu - 0.9692348837852478) < 1e-12);
});

test("bodyHeliocentricPositionAuAtInstant supports multiple planets", () => {
  const mars = bodyHeliocentricPositionAuAtInstant("mars", "1926-01-01T00:00:00Z");
  assert.equal(mars.body, "mars");
  assert.equal(mars.xAu, -1.175010323524475);
  assert.equal(mars.yAu, -1.0370988845825195);

  const pluto = bodyHeliocentricPositionAuAtInstant("pluto", "1926-01-01T00:00:00Z");
  assert.equal(pluto.body, "pluto");
  assert.ok(Number.isFinite(pluto.xAu));
  assert.ok(Number.isFinite(pluto.yAu));
  assert.ok(Number.isFinite(pluto.zAu));

  assert.throws(
    () => bodyHeliocentricPositionAuAtInstant("nibiru", "1926-01-01T00:00:00Z"),
    /Unsupported body/
  );
});

test("bodyHeliocentricPositionAuAtInstant supports loaded auxiliary bodies", async () => {
  await ensureEphemerisLoaded({
    startUtc: "2020-01-01T00:00:00Z",
    endUtc: "2026-07-22T00:00:00Z",
    streams: ["auxiliary"],
    bodyKeys: ["ceres"]
  });

  const ceres = bodyHeliocentricPositionAuAtInstant("ceres", "2026-01-01T00:00:00Z");
  assert.equal(ceres.body, "ceres");
  assert.ok(Number.isFinite(ceres.xAu));
  assert.ok(Number.isFinite(ceres.yAu));
  assert.ok(Number.isFinite(ceres.zAu));
});

test("Moon resolves to a true barycentric position like every other body", () => {
  const moon = bodyHeliocentricPositionAuAtInstant("moon", "1926-01-01T00:00:00Z");
  assert.equal(moon.body, "moon");
  assert.ok(Number.isFinite(moon.xAu));
  assert.ok(Number.isFinite(moon.yAu));
  assert.ok(Number.isFinite(moon.zAu));

  // The Moon's barycentric position is ~1 AU from the origin (it shares Earth's
  // heliocentric distance), NOT the tiny Earth-relative offset.
  const radius = Math.hypot(moon.xAu, moon.yAu);
  assert.ok(radius > 0.9 && radius < 1.1, `expected ~1 AU barycentric radius, got ${radius}`);
});

test("Moon Earth-relative offset matches moon_ssb - earth_ssb and is small", () => {
  const date = "1926-01-01T00:00:00Z";
  const moon = bodyHeliocentricPositionAuAtInstant("moon", date);
  const earth = bodyHeliocentricPositionAuAtInstant("earth", date);
  const delta = bodyEarthRelativePositionAuAtInstant("moon", date);

  assert.equal(delta.body, "moon");
  // The derived offset equals barycentric Moon minus barycentric Earth, within
  // float32 round-off of differencing two ~1 AU magnitudes.
  assert.ok(Math.abs(delta.xAu - (moon.xAu - earth.xAu)) < 1e-5);
  assert.ok(Math.abs(delta.yAu - (moon.yAu - earth.yAu)) < 1e-5);
  assert.ok(Math.abs(delta.zAu - (moon.zAu - earth.zAu)) < 1e-5);

  // The Moon orbits Earth at ~0.0026 AU; the offset magnitude is tiny.
  const magnitude = Math.hypot(delta.xAu, delta.yAu, delta.zAu);
  assert.ok(magnitude > 0.002 && magnitude < 0.003, `expected ~0.0026 AU, got ${magnitude}`);
});

test("bodyEarthRelativePositionAuAtInstant rejects bodies without a derived dataset", () => {
  assert.throws(
    () => bodyEarthRelativePositionAuAtInstant("earth", "1926-01-01T00:00:00Z"),
    /No derived/
  );
});

test("earth heliocentric AU position interpolates within the max supported UTC day", () => {
  const maxDay = SUPPORTED_DATE_RANGE.max;
  const start = earthHeliocentricPositionAuAtInstant(`${maxDay}T00:00:00Z`);
  const midday = earthHeliocentricPositionAuAtInstant(`${maxDay}T12:00:00Z`);

  assert.notEqual(start.xAu, midday.xAu);
  assert.notEqual(start.yAu, midday.yAu);
});

test("earth heliocentric AU position rejects instants at and beyond first non-interpolable UTC day", () => {
  // The last interpolable day is SUPPORTED_DATE_RANGE.max; the next two days lie at
  // and beyond the interpolation ceiling (endUtc - stepSeconds).
  const firstNonInterpolable = isoDayOffset(SUPPORTED_DATE_RANGE.max, 1);
  const beyond = isoDayOffset(SUPPORTED_DATE_RANGE.max, 2);

  assert.throws(
    () => earthHeliocentricPositionAuAtInstant(`${firstNonInterpolable}T12:00:00Z`),
    /outside supported range|No ephemeris position available/
  );
  assert.throws(
    () => earthHeliocentricPositionAuAtInstant(`${beyond}T00:00:00Z`),
    /outside supported range|No ephemeris position available/
  );
});
