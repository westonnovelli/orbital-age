import test from "node:test";
import assert from "node:assert/strict";
import { enabledBodies, loadCatalog, normalizedBody, validateCatalog } from "../scripts/ephemeris/catalog.mjs";

test("body catalog defines every enabled body through a named dataset", () => {
  const catalog = loadCatalog();
  assert.ok(enabledBodies(catalog).length >= 20);
  assert.equal(catalog.datasets.primary.load, "eager");
  assert.equal(catalog.datasets.auxiliary.load, "lazy");
  assert.equal(catalog.bodies.find((body) => body.key === "moon").relativeTo, "earth");
});

test("catalog includes the curated spacecraft layer with distinct Horizons targets", () => {
  const catalog = loadCatalog();
  const expected = new Map([
    ["voyager-1", -31], ["voyager-2", -32], ["new-horizons", -98],
    ["pioneer-10", -23], ["pioneer-11", -24], ["curiosity", -76],
    ["perseverance", -168], ["cassini", -82], ["juno-spacecraft", -61], ["dawn", -203]
  ]);
  const spacecraft = catalog.bodies.filter((body) => body.kind === "spacecraft");
  expected.set("artemis-ii", -1024);
  assert.equal(spacecraft.length, expected.size);
  for (const [key, naifId] of expected) {
    const body = spacecraft.find((candidate) => candidate.key === key);
    assert.ok(body, `${key} spacecraft entry`);
    assert.equal(body.naifId, naifId);
    assert.deepEqual(body.layers, ["spacecraft"]);
    assert.equal(body.render.defaultVisible, true);
    assert.equal(body.render.cameraFit, false);
    assert.equal(body.render.trail.defaultVisible, false);
  }
  const artemis = spacecraft.find((body) => body.key === "artemis-ii");
  assert.deepEqual(
    { start: artemis.coverageStartUtc, end: artemis.coverageEndUtc },
    { start: "2026-04-03T00:00:00Z", end: "2026-04-08T00:00:00Z" }
  );
});

test("body catalog rejects duplicate keys and invalid parent references", () => {
  const base = {
    ephemeris: {}, format: {}, datasets: { primary: {} },
    bodies: [{ key: "earth", dataset: "primary", naifId: 399, render: { enabled: false } }]
  };
  assert.throws(() => validateCatalog({ ...base, bodies: [...base.bodies, { ...base.bodies[0] }] }), /duplicated/);
  assert.throws(() => validateCatalog({ ...base, bodies: [{ ...base.bodies[0], relativeTo: "moon" }] }), /unknown parent/);
});

test("enabled is the body kill switch and capabilities otherwise remain independent", () => {
  const body = {
    key: "test-body", dataset: "primary", naifId: 1, enabled: false,
    render: { enabled: false, label: { enabled: true }, trail: { enabled: true }, follow: { enabled: true }, distance: { enabled: true } }
  };
  const catalog = { ephemeris: {}, format: {}, datasets: { primary: {} }, bodies: [body] };

  assert.doesNotThrow(() => validateCatalog(catalog));
  assert.deepEqual(enabledBodies(catalog), [], "disabled bodies are excluded before manifest generation");
  assert.deepEqual(normalizedBody(body).capabilities, {
    canRender: false, canShowByDefault: false, canFitCamera: false,
    canShowLabel: false, canToggleTrail: false, canFollow: false, canShowDistance: false
  });

  const enabledBody = { ...body, enabled: true };
  assert.doesNotThrow(() => validateCatalog({ ...catalog, bodies: [enabledBody] }));
  assert.deepEqual(enabledBodies({ ...catalog, bodies: [enabledBody] }), [enabledBody]);
  assert.deepEqual(normalizedBody(enabledBody).capabilities, {
    canRender: false, canShowByDefault: false, canFitCamera: false,
    canShowLabel: true, canToggleTrail: true, canFollow: true, canShowDistance: true
  });
});
