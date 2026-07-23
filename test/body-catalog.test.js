import test from "node:test";
import assert from "node:assert/strict";
import { enabledBodies, loadCatalog, validateCatalog } from "../scripts/ephemeris/catalog.mjs";

test("body catalog defines every enabled body through a named dataset", () => {
  const catalog = loadCatalog();
  assert.ok(enabledBodies(catalog).length >= 20);
  assert.equal(catalog.datasets.primary.load, "eager");
  assert.equal(catalog.datasets.auxiliary.load, "lazy");
  assert.equal(catalog.bodies.find((body) => body.key === "moon").relativeTo, "earth");
});

test("body catalog rejects duplicate keys and invalid parent references", () => {
  const base = {
    ephemeris: {}, format: {}, datasets: { primary: {} },
    bodies: [{ key: "earth", dataset: "primary", naifId: 399, render: { enabled: false } }]
  };
  assert.throws(() => validateCatalog({ ...base, bodies: [...base.bodies, { ...base.bodies[0] }] }), /duplicated/);
  assert.throws(() => validateCatalog({ ...base, bodies: [{ ...base.bodies[0], relativeTo: "moon" }] }), /unknown parent/);
});
