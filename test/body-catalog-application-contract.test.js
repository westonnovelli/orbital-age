import test from "node:test";
import assert from "node:assert/strict";
import { loadCatalog, normalizedBody } from "../scripts/ephemeris/catalog.mjs";
import { EPHEMERIS_V2_INDEX } from "../src/ephemeris/generated-v2-index.js";
import { manifestRenderConfigs } from "../src/app.js";
import { BODY_MECHANICS } from "../src/body-mechanics.js";

const catalog = loadCatalog();
const manifest = EPHEMERIS_V2_INDEX;

test("Spec: every enabled followable body has Orbital Mechanics copy", () => {
  const followable = catalog.bodies.filter((body) =>
    body.enabled !== false && body.render?.follow?.enabled === true
  );

  assert.equal(Object.keys(BODY_MECHANICS).length, followable.length);
  for (const body of followable) {
    const mechanics = BODY_MECHANICS[body.key];
    assert.ok(mechanics, `${body.key} mechanics entry`);
    assert.ok(mechanics.path, `${body.key} orbit path`);
    assert.ok(mechanics.body, `${body.key} orbit description`);
    if (body.kind === "spacecraft") {
      assert.match(mechanics.launchDate ?? "", /^\d{4}-\d{2}-\d{2}$/, `${body.key} launch date`);
    }
  }
});

function byKey(items) {
  return new Map(items.map((item) => [item.key, item]));
}

test("Spec: every enabled body in bodies.yaml must be emitted unchanged into the runtime manifest", () => {
  const expected = enabledCatalogBodies();
  assert.deepEqual(Object.keys(manifest.bodies), expected.map((body) => body.key));

  for (const body of expected) {
    const { coverageStartUtc: _sourceCoverage, coverageEndUtc: _endCoverage, ...manifestBody } = manifest.bodies[body.key];
    assert.deepEqual(manifestBody, normalizedBody(body));
    assert.ok(manifest.datasets[body.dataset].bodyKeys.includes(body.key));
  }
});

test("Spec: every enabled renderable body has a true-scale radius", () => {
  for (const body of enabledCatalogBodies()) {
    const normalized = normalizedBody(body);
    if (!normalized.capabilities.canRender) continue;
    assert.ok(Number.isFinite(normalized.render.trueSizeAu), `${body.key} trueSizeAu`);
    assert.ok(normalized.render.trueSizeAu > 0, `${body.key} trueSizeAu must be positive`);
    assert.ok(
      normalized.render.trueSizeAu <= normalized.render.size,
      `${body.key} trueSizeAu must not exceed its display size`
    );
  }
});

test("Spec: a body whose explicit render capabilities are on must be attached to the application's default scene", () => {
  for (const dataset of Object.keys(catalog.datasets)) {
    const expectedKeys = enabledCatalogBodies()
      .filter((body) => {
        const capability = normalizedBody(body).capabilities;
        return body.dataset === dataset && capability.canRender && capability.canShowByDefault;
      })
      .map((body) => body.key);
    assert.deepEqual(manifestRenderConfigs(dataset).map((body) => body.key), expectedKeys);
  }
});

test("Spec: every enabled renderable body is available in the Bodies panel, even when initially hidden", () => {
  for (const dataset of Object.keys(catalog.datasets)) {
    const expectedKeys = enabledCatalogBodies()
      .filter((body) => body.dataset === dataset && normalizedBody(body).capabilities.canRender)
      .map((body) => body.key);
    const configs = manifestRenderConfigs(dataset, manifest.bodies, { includeHidden: true });
    assert.deepEqual(configs.map((body) => body.key), expectedKeys);
    for (const config of configs) {
      const body = catalog.bodies.find((item) => item.key === config.key);
      assert.equal(config.visible, normalizedBody(body).capabilities.canShowByDefault);
    }
  }
});

test("Spec: the application's default scene must preserve each visible body's declared visual settings and capabilities", () => {
  const appBodies = byKey(Object.keys(catalog.datasets).flatMap((dataset) => manifestRenderConfigs(dataset)));

  for (const body of enabledCatalogBodies().filter((item) => {
    const capability = normalizedBody(item).capabilities;
    return capability.canRender && capability.canShowByDefault;
  })) {
    const actual = appBodies.get(body.key);
    assert.ok(actual, `${body.key} must be attached by the application`);
    assert.deepEqual(actual.color, body.render.color, `${body.key} color`);
    assert.equal(actual.size, body.render.size, `${body.key} size`);
    assert.equal(actual.orbitRadiusAu, body.render.orbitRadiusAu, `${body.key} orbit radius`);
    const capabilities = normalizedBody(body).capabilities;
    assert.equal(actual.followEnabled, capabilities.canFollow, `${body.key} follow capability`);
    assert.equal(actual.distanceEnabled, capabilities.canShowDistance, `${body.key} distance capability`);
    assert.equal(actual.labelEnabled, capabilities.canShowLabel, `${body.key} label capability`);
    assert.equal(Boolean(actual.trail), capabilities.canToggleTrail, `${body.key} trail capability`);
    if (actual.trail) {
      assert.equal(actual.trail.visible, body.render.trail.defaultVisible, `${body.key} trail default`);
      assert.deepEqual(actual.trail.color, body.render.trail.color, `${body.key} trail color`);
    }
  }
});

test("Spec: a rendered body with defaultVisible: false must be excluded from the current default application bootstrap", () => {
  const defaultKeys = new Set(Object.keys(catalog.datasets).flatMap((dataset) => manifestRenderConfigs(dataset).map((body) => body.key)));
  for (const body of enabledCatalogBodies().filter((item) => {
    const capability = normalizedBody(item).capabilities;
    return capability.canRender && !capability.canShowByDefault;
  })) {
    assert.equal(
      defaultKeys.has(body.key),
      false,
      `${body.key} declares defaultVisible: false and must not be attached during default bootstrap`
    );
  }
});

test("Spec: each enabled capability has one independent application consequence", () => {
  const body = {
    key: "specimen",
    label: "Specimen",
    dataset: "primary",
    render: {
      color: [0.1, 0.2, 0.3], size: 0.04, orbitRadiusAu: 2,
      trail: { color: [0.2, 0.3, 0.4, 0.5], hueStart: 0.25, defaultVisible: false },
      label: { offset: [3, 4] }
    },
    capabilities: {
      canRender: true, canShowByDefault: true, canFitCamera: true,
      canShowLabel: true, canToggleTrail: true, canFollow: true, canShowDistance: true
    }
  };
  const configsFor = (capabilities) => manifestRenderConfigs("primary", {
    specimen: { ...body, capabilities: { ...body.capabilities, ...capabilities } }
  }, { fallbackToLegacy: false });

  // The two scene-admission knobs are the only capabilities that exclude the
  // body altogether. Each remaining knob changes only its own output field.
  assert.deepEqual(configsFor({ canRender: false }), []);
  assert.deepEqual(configsFor({ canShowByDefault: false }), []);

  const [allOn] = configsFor({});
  assert.equal(allOn.cameraFit, true);
  assert.equal(allOn.labelEnabled, true);
  assert.ok(allOn.trail);
  assert.equal(allOn.followEnabled, true);
  assert.equal(allOn.distanceEnabled, true);

  for (const [capability, configField, expected] of [
    ["canFitCamera", "cameraFit", false],
    ["canShowLabel", "labelEnabled", false],
    ["canFollow", "followEnabled", false],
    ["canShowDistance", "distanceEnabled", false]
  ]) {
    const [config] = configsFor({ [capability]: false });
    assert.equal(config[configField], expected, `${capability} affects only ${configField}`);
    const { [configField]: _changed, ...unchanged } = config;
    const { [configField]: _original, ...expectedUnchanged } = allOn;
    assert.deepEqual(unchanged, expectedUnchanged, `${capability} leaves every other setting unchanged`);
  }

  const [withoutTrail] = configsFor({ canToggleTrail: false });
  assert.equal(withoutTrail.trail, null, "canToggleTrail alone controls trail creation");
  const { trail: _withoutTrail, ...withoutTrailRest } = withoutTrail;
  const { trail: _withTrail, ...withTrailRest } = allOn;
  assert.deepEqual(withoutTrailRest, withTrailRest, "canToggleTrail leaves every other setting unchanged");
});

function enabledCatalogBodies() {
  return catalog.bodies.filter((body) => body.enabled !== false);
}
