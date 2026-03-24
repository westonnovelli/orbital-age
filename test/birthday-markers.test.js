import test from "node:test";
import assert from "node:assert/strict";

import {
  computeAnniversaryDates,
  BirthdayMarkerEntity
} from "../src/webgl/entities/birthday-markers.js";

test("computeAnniversaryDates returns correct count for known birthday", () => {
  // Birthday 1990-06-15 → anniversaries from 1991 through 2025 = 35
  const dates = computeAnniversaryDates("1990-06-15");
  assert.equal(dates.length, 35);
  // First anniversary
  assert.equal(dates[0].getUTCFullYear(), 1991);
  assert.equal(dates[0].getUTCMonth(), 5); // June = 5
  assert.equal(dates[0].getUTCDate(), 15);
  // Last anniversary
  assert.equal(dates[dates.length - 1].getUTCFullYear(), 2025);
});

test("computeAnniversaryDates handles leap day birthday", () => {
  // Birthday 2000-02-29 → anniversaries from 2001 through 2025
  const dates = computeAnniversaryDates("2000-02-29");
  assert.equal(dates.length, 25);

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
});

test("computeAnniversaryDates clamps to ephemeris range", () => {
  // Birthday before ephemeris start — only anniversaries within 1926-2025
  const dates = computeAnniversaryDates("1920-07-01");
  // Anniversaries: 1921–1925 are before range start (1926-01-01), so skipped
  // 1926 onward: 1926-07-01 through 2025-07-01 = 100 anniversaries
  assert.equal(dates.length, 100);
  assert.equal(dates[0].getUTCFullYear(), 1926);
});

test("computeAnniversaryDates returns empty for birthday after ephemeris end", () => {
  const dates = computeAnniversaryDates("2026-01-01");
  assert.equal(dates.length, 0);
});

test("computeAnniversaryDates handles birthday at ephemeris start boundary", () => {
  // Birthday 1926-01-01 → anniversaries 1927 through 2025 = 99
  const dates = computeAnniversaryDates("1926-01-01");
  assert.equal(dates.length, 99);
  assert.equal(dates[0].getUTCFullYear(), 1927);
});

test("BirthdayMarkerEntity computes positions with correct buffer length", () => {
  const entity = new BirthdayMarkerEntity({
    birthday: "1990-06-15",
    radiusX: 1,
    radiusY: 0.998
  });
  assert.equal(entity.markerCount, 35);
  assert.equal(entity.positionData.length, 70); // 35 * 2
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
