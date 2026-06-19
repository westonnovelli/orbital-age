import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { orbitsCompleted, currentAge, distanceTraveledKm } from "../src/stats.js";

describe("orbitsCompleted", () => {
  it("returns 0 for less than one orbit", () => {
    assert.equal(orbitsCompleted(100), 0);
  });

  it("returns 1 after exactly 365.25 days", () => {
    assert.equal(orbitsCompleted(365.25), 1);
  });

  it("returns correct count for multiple orbits", () => {
    assert.equal(orbitsCompleted(365.25 * 32 + 187), 32);
  });

  it("returns 0 for 0 elapsed days", () => {
    assert.equal(orbitsCompleted(0), 0);
  });
});

describe("currentAge", () => {
  it("formats age with years and days", () => {
    assert.equal(currentAge(365.25 * 32 + 187), "32y 187d");
  });

  it("zero-pads the day count to three digits", () => {
    assert.equal(currentAge(365.25 * 5 + 7), "5y 007d");
  });

  it("shows 0y for less than one orbit", () => {
    assert.equal(currentAge(100), "0y 100d");
  });

  it("pads sub-10 day counts", () => {
    assert.equal(currentAge(9), "0y 009d");
  });

  it("handles exact orbit boundary", () => {
    assert.equal(currentAge(365.25), "1y 000d");
  });

  it("handles zero elapsed days", () => {
    assert.equal(currentAge(0), "0y 000d");
  });
});

describe("distanceTraveledKm", () => {
  it("returns 0 for 0 elapsed days", () => {
    assert.equal(distanceTraveledKm(0), 0);
  });

  it("returns one orbit distance after 365.25 days", () => {
    assert.equal(distanceTraveledKm(365.25), 940_000_000);
  });

  it("scales linearly with elapsed days", () => {
    const half = distanceTraveledKm(365.25 / 2);
    assert.equal(half, 940_000_000 / 2);
  });
});
