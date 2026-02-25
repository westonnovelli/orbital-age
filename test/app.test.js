import test from "node:test";
import assert from "node:assert/strict";

import { addUtcDays, parseSpeedValue, toIsoUtcDate } from "../src/app.js";

test("parseSpeedValue returns positive finite speeds and falls back otherwise", () => {
  assert.equal(parseSpeedValue("30"), 30);
  assert.equal(parseSpeedValue(90), 90);
  assert.equal(parseSpeedValue("0"), 30);
  assert.equal(parseSpeedValue("-5"), 30);
  assert.equal(parseSpeedValue("invalid"), 30);
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
