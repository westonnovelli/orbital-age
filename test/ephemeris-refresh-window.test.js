import test from "node:test";
import assert from "node:assert/strict";
import { buildIncrementalWindow } from "../scripts/ephemeris/refresh-window.mjs";

test("daily refresh uses an overlap when only one day is missing", () => {
  const window = buildIncrementalWindow({
    currentEndUtc: "2026-08-04T00:00:00Z",
    nowUtc: "2026-08-04T12:00:00Z"
  });

  assert.deepEqual(window, {
    requestedStartUtc: "2026-08-05T00:00:00Z",
    requestedEndUtc: "2026-08-05T00:00:00Z",
    startDate: "2026-08-05",
    stopDate: "2026-08-05",
    requestStartDate: "2026-08-04"
  });
});

test("daily refresh preserves a multi-day catch-up window", () => {
  const window = buildIncrementalWindow({
    currentEndUtc: "2026-08-02T00:00:00Z",
    nowUtc: "2026-08-04T12:00:00Z"
  });

  assert.equal(window.startDate, "2026-08-03");
  assert.equal(window.stopDate, "2026-08-05");
  assert.equal(window.requestStartDate, "2026-08-03");
});
