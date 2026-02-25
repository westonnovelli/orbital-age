import test from "node:test";
import assert from "node:assert/strict";
import { validateBirthday, dayOfYearUtc, earthAngleFromDate } from "../src/date.js";

test("validateBirthday rejects empty and future dates", () => {
  assert.equal(validateBirthday("").ok, false);

  const future = "2100-12-31";
  const result = validateBirthday(future);
  if (new Date(`${future}T00:00:00Z`) > new Date()) {
    assert.equal(result.ok, false);
  }
});

test("validateBirthday rejects malformed and non-existent calendar dates", () => {
  assert.deepEqual(validateBirthday("2024-02-31"), {
    ok: false,
    message: "Enter a valid date."
  });
  assert.deepEqual(validateBirthday("2024-2-1"), {
    ok: false,
    message: "Enter a valid date."
  });
});

test("dayOfYearUtc returns expected day index", () => {
  const jan1 = new Date("2024-01-01T00:00:00Z");
  const mar1 = new Date("2024-03-01T00:00:00Z");
  assert.equal(dayOfYearUtc(jan1), 1);
  assert.equal(dayOfYearUtc(mar1), 61);
});

test("earthAngleFromDate increases through the year", () => {
  const start = earthAngleFromDate(new Date("2024-01-01T00:00:00Z"));
  const later = earthAngleFromDate(new Date("2024-06-01T00:00:00Z"));
  assert.ok(later > start);
});

test("earthAngleFromDate returns expected angular bounds", () => {
  const start = earthAngleFromDate(new Date("2024-01-01T00:00:00Z"));
  const end = earthAngleFromDate(new Date("2024-12-31T00:00:00Z"));

  assert.ok(start > 0);
  assert.ok(end > Math.PI * 2 - 0.05);
  assert.ok(end < Math.PI * 2 + 0.05);
  assert.ok(end > start);
});
