import test from "node:test";
import assert from "node:assert/strict";

import {
  addUtcDays,
  createBirthdayOutwardJourneyState,
  maximumSupportedJourneyDistanceAu,
  parseSpeedValue,
  solarSystemFitHalfHeightForBodies,
  toIsoUtcDate
} from "../src/app.js";
import {
  bodyHeliocentricPositionAuAtInstant,
  daysBetweenUtc,
  SUPPORTED_DATE_RANGE
} from "../src/orbital-time.js";
import { distanceTraveledKm } from "../src/stats.js";
import { KM_PER_AU } from "../src/outward-journey.js";
import { autoFitHalfHeight } from "../src/webgl/scale.js";

test("parseSpeedValue returns positive finite speeds and falls back to 120", () => {
  assert.equal(parseSpeedValue("30"), 30);
  assert.equal(parseSpeedValue(90), 90);
  assert.equal(parseSpeedValue("0"), 120);
  assert.equal(parseSpeedValue("-5"), 120);
  assert.equal(parseSpeedValue("invalid"), 120);
  assert.equal(parseSpeedValue(undefined), 120);
  assert.equal(parseSpeedValue(NaN), 120);
  assert.equal(parseSpeedValue(Infinity), 120);
});

test("parseSpeedValue parses all supported speed options correctly", () => {
  for (const speed of [1, 10, 30, 120, 365]) {
    assert.equal(parseSpeedValue(String(speed)), speed);
    assert.equal(parseSpeedValue(speed), speed);
  }
});

test("addUtcDays moves dates in UTC days", () => {
  const start = new Date("2024-02-28T00:00:00Z");
  const leapDay = addUtcDays(start, 1);
  const nextDay = addUtcDays(start, 2);

  assert.equal(leapDay.toISOString(), "2024-02-29T00:00:00.000Z");
  assert.equal(nextDay.toISOString(), "2024-03-01T00:00:00.000Z");
});

test("toIsoUtcDate formats date to YYYY-MM-DD in UTC", () => {
  const date = new Date("1999-12-31T23:00:00-01:00");
  assert.equal(toIsoUtcDate(date), "2000-01-01");
});

test("createBirthdayOutwardJourneyState anchors a zero-distance journey at birthday Earth", () => {
  const birthday = new Date("2000-01-01T00:00:00Z");
  const earth = bodyHeliocentricPositionAuAtInstant("earth", birthday);

  const journey = createBirthdayOutwardJourneyState(birthday, 0);

  assert.deepEqual(journey.origin, { x: earth.xAu, y: earth.yAu });
  assert.equal(journey.distanceAu, 0);
  assert.deepEqual(journey.endpoint, journey.origin);
});

test("Solar System Fit excludes auxiliary and spacecraft extents", () => {
  const configs = [
    { key: "neptune", stream: "primary", kind: "planet", orbitRadiusAu: 30.33, cameraFit: true },
    { key: "voyager-1", stream: "primary", kind: "spacecraft", orbitRadiusAu: 170, cameraFit: true },
    { key: "halley", stream: "auxiliary", kind: "comet", orbitRadiusAu: 35.1, cameraFit: true },
    { key: "deep-probe", stream: "auxiliary", kind: "spacecraft", orbitRadiusAu: 800, cameraFit: true }
  ];

  assert.equal(solarSystemFitHalfHeightForBodies(configs), autoFitHalfHeight(30.33));
});

test("maximum journey distance is fixed to the complete supported date range", () => {
  const expectedDays = daysBetweenUtc(SUPPORTED_DATE_RANGE.min, SUPPORTED_DATE_RANGE.max);
  const expectedDistanceAu = distanceTraveledKm(expectedDays) / KM_PER_AU;

  assert.equal(maximumSupportedJourneyDistanceAu(), expectedDistanceAu);
});
