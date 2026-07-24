import test from "node:test";
import assert from "node:assert/strict";

import {
  computeAnniversaryDates,
  BirthdayMarkerEntity
} from "../src/webgl/entities/birthday-markers.js";
import { SUPPORTED_DATE_RANGE } from "../src/orbital-time.js";

// The ephemeris window advances over time (the scheduled refresh job extends it
// to "today"), so anniversary counts are derived from the live supported range
// rather than hardcoded against a fixed end year.
const RANGE_START = new Date(SUPPORTED_DATE_RANGE.min + "T00:00:00Z");
const RANGE_END = new Date(SUPPORTED_DATE_RANGE.max + "T00:00:00Z");

test("computeAnniversaryDates spans from first anniversary through range end", () => {
  const dates = computeAnniversaryDates("1990-06-15");
  // First anniversary is the year after birth (1990 sits well inside the range).
  assert.equal(dates[0].getUTCFullYear(), 1991);
  assert.equal(dates[0].getUTCMonth(), 5); // June = 5
  assert.equal(dates[0].getUTCDate(), 15);

  // Consecutive years, no gaps.
  for (let i = 1; i < dates.length; i++) {
    assert.equal(dates[i].getUTCFullYear(), dates[i - 1].getUTCFullYear() + 1);
  }

  // The series extends exactly to the supported range end: the last anniversary
  // is within range, and one more year would fall past it.
  const last = dates[dates.length - 1];
  assert.ok(last <= RANGE_END);
  const next = new Date(Date.UTC(last.getUTCFullYear() + 1, 5, 15));
  assert.ok(next > RANGE_END);
  // Count follows from the first year and the range end (not a fixed constant).
  assert.equal(dates.length, last.getUTCFullYear() - 1991 + 1);
});

test("computeAnniversaryDates handles leap day birthday", () => {
  const dates = computeAnniversaryDates("2000-02-29");

  // Non-leap year (2001) should fall back to Feb 28
  const d2001 = dates.find((d) => d.getUTCFullYear() === 2001);
  assert.ok(d2001);
  assert.equal(d2001.getUTCMonth(), 1); // Feb = 1
  assert.equal(d2001.getUTCDate(), 28);

  // Leap year (2004) should use Feb 29
  const d2004 = dates.find((d) => d.getUTCFullYear() === 2004);
  assert.ok(d2004);
  assert.equal(d2004.getUTCMonth(), 1);
  assert.equal(d2004.getUTCDate(), 29);

  // First anniversary is the year after birth; series runs to the range end.
  assert.equal(dates[0].getUTCFullYear(), 2001);
  assert.ok(dates[dates.length - 1] <= RANGE_END);
});

test("computeAnniversaryDates clamps to ephemeris range start", () => {
  // Birthday before ephemeris start — anniversaries before the range start are
  // dropped, so the first kept anniversary is the first one at/after range start.
  const dates = computeAnniversaryDates("1920-07-01");
  assert.ok(dates[0] >= RANGE_START);
  assert.equal(dates[0].getUTCMonth(), 6); // July = 6
  assert.equal(dates[0].getUTCDate(), 1);
  // The preceding anniversary may still be in range when the coverage starts
  // before the birthday's month/day; the returned first anniversary must simply
  // be the earliest eligible one.
  const prev = new Date(Date.UTC(dates[0].getUTCFullYear() - 1, 6, 1));
  assert.equal(prev.getUTCFullYear(), 1920);
});

test("computeAnniversaryDates returns empty for birthday after ephemeris end", () => {
  // A birthday on the range's final day has its first anniversary a full year
  // later, always past the range end.
  const dates = computeAnniversaryDates(SUPPORTED_DATE_RANGE.max);
  assert.equal(dates.length, 0);
});

test("computeAnniversaryDates handles birthday at ephemeris start boundary", () => {
  // Birthday on the range start date → first anniversary is the next year.
  const dates = computeAnniversaryDates(SUPPORTED_DATE_RANGE.min);
  assert.equal(dates[0].getUTCFullYear(), RANGE_START.getUTCFullYear() + 1);
  const last = dates[dates.length - 1];
  assert.equal(dates.length, last.getUTCFullYear() - dates[0].getUTCFullYear() + 1);
});

test("BirthdayMarkerEntity computes positions with correct buffer length", () => {
  const expected = computeAnniversaryDates("1990-06-15").length;
  const entity = new BirthdayMarkerEntity({
    birthday: "1990-06-15",
    radiusX: 1,
    radiusY: 1
  });
  assert.equal(entity.markerCount, expected);
  assert.equal(entity.positionData.length, expected * 2); // markerCount * 2
});

test("BirthdayMarkerEntity applies radiusX/radiusY scaling", () => {
  const entityScaled = new BirthdayMarkerEntity({
    birthday: "2000-01-01",
    radiusX: 2,
    radiusY: 0.5
  });
  const entityUnit = new BirthdayMarkerEntity({
    birthday: "2000-01-01",
    radiusX: 1,
    radiusY: 1
  });

  // Scaled x should be 2x the unit x, scaled y should be 0.5x the unit y
  for (let i = 0; i < entityUnit.markerCount; i++) {
    const ux = entityUnit.positionData[i * 2];
    const uy = entityUnit.positionData[i * 2 + 1];
    assert.ok(
      Math.abs(entityScaled.positionData[i * 2] - ux * 2) < 1e-6,
      `x mismatch at index ${i}`
    );
    assert.ok(
      Math.abs(entityScaled.positionData[i * 2 + 1] - uy * 0.5) < 1e-6,
      `y mismatch at index ${i}`
    );
  }
});

test("BirthdayMarkerEntity defaults with no birthday produces zero markers", () => {
  const entity = new BirthdayMarkerEntity();
  assert.equal(entity.markerCount, 0);
  assert.equal(entity.positionData, null);
});

test("BirthdayMarkerEntity uses default color and pointSize", () => {
  const entity = new BirthdayMarkerEntity({ birthday: "2000-01-01" });
  assert.deepEqual(entity.color, [0.75, 0.95, 1.0, 1.0]);
  assert.equal(entity.pointSize, 5);
});
