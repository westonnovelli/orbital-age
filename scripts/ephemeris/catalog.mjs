import fs from "node:fs";
import path from "node:path";
import { parseDocument } from "yaml";

export const DEFAULT_CATALOG_PATH = "data/bodies.yaml";

export function loadCatalog(cwd = process.cwd(), sourcePath = process.env.BODY_CATALOG_PATH ?? DEFAULT_CATALOG_PATH) {
  const filePath = path.resolve(cwd, sourcePath);
  let catalog;
  try {
    const document = parseDocument(fs.readFileSync(filePath, "utf8"), { prettyErrors: true });
    if (document.errors.length > 0) {
      throw document.errors[0];
    }
    catalog = document.toJS();
  } catch (error) {
    throw new Error(`Unable to parse body catalog ${filePath}: ${error.message}`);
  }
  validateCatalog(catalog);
  return catalog;
}

export function enabledBodies(catalog, dataset = null) {
  return catalog.bodies.filter((body) => body.enabled !== false && (!dataset || body.dataset === dataset));
}

export function validateCatalog(catalog) {
  const fail = (message) => { throw new Error(`Invalid body catalog: ${message}`); };
  if (!catalog || typeof catalog !== "object") fail("root must be an object");
  if (!catalog.ephemeris || !catalog.format || !catalog.datasets || !Array.isArray(catalog.bodies)) fail("ephemeris, format, datasets, and bodies are required");
  const keys = new Set();
  const naifIds = new Set();
  for (const body of catalog.bodies) {
    if (!/^[a-z0-9][a-z0-9-]*$/.test(body.key ?? "")) fail(`body key '${body.key}' is invalid`);
    if (keys.has(body.key)) fail(`body key '${body.key}' is duplicated`);
    keys.add(body.key);
    if (!catalog.datasets[body.dataset]) fail(`${body.key} references unknown dataset '${body.dataset}'`);
    if (!Number.isInteger(body.naifId)) fail(`${body.key} must have an integer naifId`);
    if (naifIds.has(body.naifId)) fail(`naifId ${body.naifId} is duplicated`);
    naifIds.add(body.naifId);
    if (body.synthetic !== "origin" && !body.horizonsCommand && !body.naifId) fail(`${body.key} requires a Horizons source`);
    const render = body.render ?? {};
    if (render.enabled && (!Array.isArray(render.color) || render.color.length !== 3 || !Number.isFinite(render.size))) fail(`${body.key} render.enabled requires RGB color and size`);
    for (const value of render.color ?? []) if (!Number.isFinite(value) || value < 0 || value > 1) fail(`${body.key} color channels must be 0..1`);
    if (render.trail?.enabled && !render.enabled) fail(`${body.key} trail requires render.enabled`);
    if (render.label?.enabled && !render.enabled) fail(`${body.key} label requires render.enabled`);
    if (render.follow?.enabled && !render.enabled) fail(`${body.key} follow requires render.enabled`);
  }
  for (const body of catalog.bodies) if (body.relativeTo && !keys.has(body.relativeTo)) fail(`${body.key} references unknown parent '${body.relativeTo}'`);
  return catalog;
}

export function normalizedBody(body) {
  const render = body.render ?? {};
  const hasLabel = Boolean(render.label?.enabled);
  const hasTrail = Boolean(render.trail?.enabled);
  return {
    key: body.key, label: body.label ?? body.key, kind: body.kind ?? "smallBody", naifId: body.naifId,
    horizonsCommand: body.horizonsCommand ?? String(body.naifId), dataset: body.dataset, stream: body.dataset,
    enabled: body.enabled !== false, parent: body.relativeTo ?? null, relativeTo: body.relativeTo ?? null,
    // Compatibility aliases retained for consumers of manifest 2.0.
    hasLabel, hasTrail,
    layers: body.layers ?? [], render: {
      enabled: Boolean(render.enabled), defaultVisible: Boolean(render.defaultVisible), color: render.color ?? null,
      size: render.size ?? null, trueSizeAu: render.trueSizeAu ?? null, orbitRadiusAu: render.orbitRadiusAu ?? null,
      cameraFit: Boolean(render.cameraFit), relativeScale: render.relativeScale ?? null,
      label: { enabled: Boolean(render.label?.enabled), offset: render.label?.offset ?? [0, 0] },
      trail: { enabled: Boolean(render.trail?.enabled), defaultVisible: Boolean(render.trail?.defaultVisible), color: render.trail?.color ?? null, hueStart: render.trail?.hueStart ?? 0 },
      follow: { enabled: Boolean(render.follow?.enabled) }, distance: { enabled: Boolean(render.distance?.enabled) }
    }
  };
}
