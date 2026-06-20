import test from "node:test";
import assert from "node:assert/strict";

import {
  earthHeliocentricPositionAuAtInstant,
  earthPositionOnUnitOrbitAtInstant
} from "../src/orbital-time.js";
import { TimelineControllerEntity } from "../src/webgl/entities/timeline-controller.js";

const MAX_COMPONENT_ERROR_AU = 5e-7;
const MAX_ANGLE_ERROR_DEG = 1e-4;

// Reference points re-fetched directly from JPL Horizons in the barycentric frame
// (CENTER='500@0', ECLIPJ2000, AU) on 2026-06-19, kept as an independent external
// check rather than reading back from our own rebuilt dataset.
const REFERENCE_DATES = [
  {
    utc: "1926-01-01T00:00:00Z",
    xAu: -0.1858372388403036,
    yAu: 0.9709631095356719,
    zAu: 0.00009656725127948322
  },
  {
    utc: "1950-06-15T00:00:00Z",
    xAu: -0.1054500783825576,
    yAu: -1.008518807542483,
    zAu: -0.000183890812410401
  },
  {
    utc: "1969-07-20T00:00:00Z",
    xAu: 0.4742318007809231,
    yAu: -0.900132946395822,
    zAu: -0.0001191810348943268
  },
  {
    utc: "2000-01-01T00:00:00Z",
    xAu: -0.1756645157282301,
    yAu: 0.9659910118824405,
    zAu: 0.0002022251612712026
  },
  {
    utc: "2012-06-05T00:00:00Z",
    xAu: -0.2724288645202578,
    yAu: -0.9799795472630243,
    zAu: 0.00001278559461971269
  },
  {
    utc: "2024-02-29T00:00:00Z",
    xAu: -0.9358499829949305,
    yAu: 0.3427213062305836,
    zAu: 0.0001941610404147327
  },
  {
    utc: "2025-12-30T00:00:00Z",
    xAu: -0.1428507033630466,
    yAu: 0.9678579691767725,
    zAu: 0.00007238982125166174
  }
];

function normalizedDeg(value) {
  const result = value % 360;
  return result < 0 ? result + 360 : result;
}

function angularDeltaDeg(aDeg, bDeg) {
  const delta = Math.abs(normalizedDeg(aDeg) - normalizedDeg(bDeg));
  return Math.min(delta, 360 - delta);
}

function longitudeFromReference(reference) {
  return normalizedDeg((Math.atan2(reference.yAu, reference.xAu) * 180) / Math.PI);
}

test("earth heliocentric model stays within reference AU and angle error bounds", () => {
  for (const reference of REFERENCE_DATES) {
    const model = earthHeliocentricPositionAuAtInstant(reference.utc);

    assert.ok(Math.abs(model.xAu - reference.xAu) <= MAX_COMPONENT_ERROR_AU, `${reference.utc} xAu`);
    assert.ok(Math.abs(model.yAu - reference.yAu) <= MAX_COMPONENT_ERROR_AU, `${reference.utc} yAu`);
    assert.ok(Math.abs(model.zAu - reference.zAu) <= MAX_COMPONENT_ERROR_AU, `${reference.utc} zAu`);

    const modelUnit = earthPositionOnUnitOrbitAtInstant(reference.utc);
    const referenceLongitudeDeg = longitudeFromReference(reference);
    assert.ok(
      angularDeltaDeg(modelUnit.longitudeDeg, referenceLongitudeDeg) <= MAX_ANGLE_ERROR_DEG,
      `${reference.utc} longitude`
    );
  }
});

test("earth heliocentric interpolation matches midpoint reference between adjacent days", () => {
  const start = {
    xAu: -0.9358499829949305,
    yAu: 0.3427213062305836,
    zAu: 0.0001941610404147327
  };
  const end = {
    xAu: -0.9419962568513052,
    yAu: 0.3264828993061092,
    zAu: 0.0001956247059280089
  };

  const expectedMidpoint = {
    xAu: (start.xAu + end.xAu) / 2,
    yAu: (start.yAu + end.yAu) / 2,
    zAu: (start.zAu + end.zAu) / 2
  };

  const modelMidpoint = earthHeliocentricPositionAuAtInstant("2024-02-29T12:00:00Z");

  assert.ok(Math.abs(modelMidpoint.xAu - expectedMidpoint.xAu) <= MAX_COMPONENT_ERROR_AU);
  assert.ok(Math.abs(modelMidpoint.yAu - expectedMidpoint.yAu) <= MAX_COMPONENT_ERROR_AU);
  assert.ok(Math.abs(modelMidpoint.zAu - expectedMidpoint.zAu) <= MAX_COMPONENT_ERROR_AU);
});

test("timeline controller feeds rendered marker positions from the same model output", () => {
  const marker = {
    positions: [],
    setPosition(x, y) {
      this.positions.push({ x, y });
    }
  };

  const controller = new TimelineControllerEntity({
    birthday: "2024-02-29",
    maxTimelineDate: "2024-02-29",
    bodies: [{ key: "earth", marker, trail: null }]
  });

  controller.init();

  assert.equal(marker.positions.length, 1);
  const rendered = marker.positions[0];
  const model = earthHeliocentricPositionAuAtInstant("2024-02-29T00:00:00Z");

  assert.ok(Math.abs(rendered.x - model.xAu) <= MAX_COMPONENT_ERROR_AU);
  assert.ok(Math.abs(rendered.y - model.yAu) <= MAX_COMPONENT_ERROR_AU);
});
