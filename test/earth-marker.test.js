import test from "node:test";
import assert from "node:assert/strict";

import { EarthMarkerEntity } from "../src/webgl/entities/earth-marker.js";

test("earth marker scales external unit-orbit coordinates by marker radii", () => {
  const marker = new EarthMarkerEntity({ radiusX: 2, radiusY: 0.5 });

  marker.setPosition(0.5, -0.5);

  assert.equal(marker.positionData[0], 1);
  assert.equal(marker.positionData[1], -0.25);
});
