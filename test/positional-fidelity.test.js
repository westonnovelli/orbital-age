import test from "node:test";
import assert from "node:assert/strict";

import {
  earthHeliocentricPositionAuAtInstant,
  earthPositionOnUnitOrbitAtInstant
} from "../src/orbital-time.js";
import { TimelineControllerEntity } from "../src/webgl/entities/timeline-controller.js";

const MAX_COMPONENT_ERROR_AU = 5e-7;
const MAX_ANGLE_ERROR_DEG = 1e-4;

const REFERENCE_DATES = [
  {
    utc: "1926-01-01T00:00:00Z",
    xAu: -0.1853621512,
    yAu: 0.9655858574,
    zAu: 0.0001614382
  },
  {
    utc: "1950-06-15T00:00:00Z",
    xAu: -0.1056529673,
    yAu: -1.0103321048,
    zAu: -0.0001184032
  },
  {
    utc: "1969-07-20T00:00:00Z",
    xAu: 0.4697462969,
    yAu: -0.9010621505,
    zAu: -0.0000581348
  },
  {
    utc: "2000-01-01T00:00:00Z",
    xAu: -0.1685374509,
    yAu: 0.9687810705,
    zAu: -0.0000041205
  },
  {
    utc: "2012-06-05T00:00:00Z",
    xAu: -0.2699210678,
    yAu: -0.9780338896,
    zAu: 0.0000288655
  },
  {
    utc: "2024-02-29T00:00:00Z",
    xAu: -0.9281867292,
    yAu: 0.346017199,
    zAu: -0.0000131355
  },
  {
    utc: "2025-12-30T00:00:00Z",
    xAu: -0.1397828864,
    yAu: 0.9733896212,
    zAu: -0.0000595662
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
    xAu: -0.9281867292,
    yAu: 0.346017199,
    zAu: -0.0000131355
  };
  const end = {
    xAu: -0.9343380728,
    yAu: 0.3297853108,
    zAu: -0.0000116136
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
    earthMarker: marker
  });

  controller.init();

  assert.equal(marker.positions.length, 1);
  const rendered = marker.positions[0];
  const model = earthHeliocentricPositionAuAtInstant("2024-02-29T00:00:00Z");

  assert.ok(Math.abs(rendered.x - model.xAu) <= MAX_COMPONENT_ERROR_AU);
  assert.ok(Math.abs(rendered.y - model.yAu) <= MAX_COMPONENT_ERROR_AU);
});
