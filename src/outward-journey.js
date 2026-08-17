import { AU_TO_SCENE, AUTO_FIT_MARGIN } from "./scale.js";

export const KM_PER_AU = 149_597_870.7;

function assertFiniteNumber(value, name) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new TypeError(`${name} must be a finite number`);
  }
}

function assertPoint(point, name) {
  if (point === null || typeof point !== "object") {
    throw new TypeError(`${name} must contain finite x and y coordinates`);
  }

  assertFiniteNumber(point.x, `${name}.x`);
  assertFiniteNumber(point.y, `${name}.y`);
}

function nonNegativeDistanceAu(distanceTraveledKm) {
  if (
    typeof distanceTraveledKm !== "number" ||
    !Number.isFinite(distanceTraveledKm) ||
    distanceTraveledKm <= 0
  ) {
    return 0;
  }

  return distanceTraveledKm / KM_PER_AU;
}

export function createOutwardJourneyState({ originAu, distanceTraveledKm }) {
  assertPoint(originAu, "originAu");

  const radius = Math.hypot(originAu.x, originAu.y);
  const outwardDirection =
    radius === 0
      ? { x: 0, y: 0 }
      : { x: originAu.x / radius, y: originAu.y / radius };
  const distanceAu = nonNegativeDistanceAu(distanceTraveledKm);
  const distanceScene = distanceAu * AU_TO_SCENE;

  return {
    origin: { x: originAu.x, y: originAu.y },
    outwardDirection,
    distanceAu,
    endpoint: {
      x: originAu.x + outwardDirection.x * distanceScene,
      y: originAu.y + outwardDirection.y * distanceScene
    }
  };
}

export function journeyExtentHalfHeight({
  journey,
  origin,
  minimumHalfHeight
}) {
  if (journey === null || typeof journey !== "object") {
    throw new TypeError("journey must contain an endpoint");
  }
  assertPoint(journey.origin, "journey.origin");
  assertPoint(journey.endpoint, "journey.endpoint");
  assertPoint(origin, "origin");
  assertFiniteNumber(minimumHalfHeight, "minimumHalfHeight");

  const originDistance = Math.hypot(
    journey.origin.x - origin.x,
    journey.origin.y - origin.y
  );
  const endpointDistance = Math.hypot(
    journey.endpoint.x - origin.x,
    journey.endpoint.y - origin.y
  );

  return Math.max(
    minimumHalfHeight,
    originDistance * AUTO_FIT_MARGIN,
    endpointDistance * AUTO_FIT_MARGIN
  );
}
