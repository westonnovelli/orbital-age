import {
  EPHEMERIS_INTERPOLATION_WINDOW,
  SUPPORTED_PLANET_KEYS,
  getBodyPositionAuAtInstant
} from "./ephemeris/runtime.js";

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const JULIAN_DAY_UNIX_EPOCH = 2440587.5;
const J2000_JULIAN_DAY = 2451545.0;

export const SUPPORTED_DATE_RANGE = Object.freeze({
  min: EPHEMERIS_INTERPOLATION_WINDOW.startUtc.slice(0, 10),
  max: EPHEMERIS_INTERPOLATION_WINDOW.endUtc.slice(0, 10)
});

function mod(value, base) {
  const result = value % base;
  return result >= 0 ? result : result + base;
}

function toDateFromInput(input) {
  if (input instanceof Date || typeof input === "number") {
    const date = new Date(input);
    if (Number.isNaN(date.getTime())) {
      throw new Error("Invalid date input");
    }
    return date;
  }

  if (typeof input === "string") {
    const date = new Date(input);
    if (Number.isNaN(date.getTime())) {
      throw new Error(`Invalid date input: ${input}`);
    }
    return date;
  }

  throw new Error(`Unsupported date input type: ${typeof input}`);
}

function toIsoUtcDate(date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseIsoDateUtc(dateString) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateString);
  if (!match) {
    throw new Error(`Expected YYYY-MM-DD date, received: ${dateString}`);
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const utcDate = new Date(Date.UTC(year, month - 1, day));

  if (
    utcDate.getUTCFullYear() !== year ||
    utcDate.getUTCMonth() !== month - 1 ||
    utcDate.getUTCDate() !== day
  ) {
    throw new Error(`Invalid calendar date: ${dateString}`);
  }

  return utcDate;
}

function isIsoTimestampWithExplicitZone(value) {
  return (
    /^\d{4}-\d{2}-\d{2}T/.test(value) &&
    /(Z|[+-]\d{2}:\d{2})$/.test(value)
  );
}

export function normalizeToUtcMidnight(input) {
  if (input instanceof Date || typeof input === "number") {
    const source = new Date(input);
    if (Number.isNaN(source.getTime())) {
      throw new Error("Invalid date input");
    }

    return new Date(
      Date.UTC(
        source.getUTCFullYear(),
        source.getUTCMonth(),
        source.getUTCDate()
      )
    );
  }

  if (typeof input === "string") {
    if (/^\d{4}-\d{2}-\d{2}$/.test(input)) {
      return parseIsoDateUtc(input);
    }

    if (!isIsoTimestampWithExplicitZone(input)) {
      throw new Error(
        `Expected YYYY-MM-DD or ISO-8601 timestamp with explicit timezone, received: ${input}`
      );
    }

    const source = new Date(input);
    if (Number.isNaN(source.getTime())) {
      throw new Error(`Invalid ISO-8601 timestamp: ${input}`);
    }

    return normalizeToUtcMidnight(source);
  }

  throw new Error(`Unsupported date input type: ${typeof input}`);
}

export function daysBetweenUtc(startInput, endInput) {
  const start = normalizeToUtcMidnight(startInput);
  const end = normalizeToUtcMidnight(endInput);
  return Math.round((end.getTime() - start.getTime()) / MS_PER_DAY);
}

export function assertDateInSupportedRange(dateInput) {
  const date = normalizeToUtcMidnight(dateInput);
  const min = parseIsoDateUtc(SUPPORTED_DATE_RANGE.min);
  const max = parseIsoDateUtc(SUPPORTED_DATE_RANGE.max);

  if (date < min || date > max) {
    throw new Error(
      `Date ${toIsoUtcDate(date)} is outside supported range ${SUPPORTED_DATE_RANGE.min} to ${SUPPORTED_DATE_RANGE.max}`
    );
  }

  return date;
}

export function earthHeliocentricLongitudeDeg(dateInput) {
  return earthHeliocentricLongitudeDegAtInstant(
    normalizeToUtcMidnight(dateInput)
  );
}

export function earthHeliocentricLongitudeDegAtInstant(dateInput) {
  const instant = toDateFromInput(dateInput);
  assertDateInSupportedRange(instant);

  const earthPosition = getBodyPositionAuAtInstant("earth", instant);
  if (earthPosition) {
    return mod(
      (Math.atan2(earthPosition.yAu, earthPosition.xAu) * 180) / Math.PI,
      360
    );
  }

  const julianDay = instant.getTime() / MS_PER_DAY + JULIAN_DAY_UNIX_EPOCH;
  const daysSinceJ2000 = julianDay - J2000_JULIAN_DAY;

  const meanAnomaly = mod(357.529 + 0.98560028 * daysSinceJ2000, 360);
  const meanLongitude = mod(280.459 + 0.98564736 * daysSinceJ2000, 360);

  const meanAnomalyRad = (meanAnomaly * Math.PI) / 180;
  const sunEclipticLongitude =
    meanLongitude +
    1.915 * Math.sin(meanAnomalyRad) +
    0.02 * Math.sin(2 * meanAnomalyRad);

  return mod(sunEclipticLongitude + 180, 360);
}

export function earthPositionOnUnitOrbit(dateInput) {
  const longitudeDeg = earthHeliocentricLongitudeDeg(dateInput);
  const longitudeRad = (longitudeDeg * Math.PI) / 180;

  return {
    x: Math.cos(longitudeRad),
    y: Math.sin(longitudeRad),
    longitudeDeg
  };
}

export function earthPositionOnUnitOrbitAtInstant(dateInput) {
  const earthPositionAu = earthHeliocentricPositionAuAtInstant(dateInput);
  const radius = Math.hypot(earthPositionAu.xAu, earthPositionAu.yAu);
  const safeRadius = radius === 0 ? 1 : radius;
  const longitudeDeg = mod(
    (Math.atan2(earthPositionAu.yAu, earthPositionAu.xAu) * 180) / Math.PI,
    360
  );

  return {
    x: earthPositionAu.xAu / safeRadius,
    y: earthPositionAu.yAu / safeRadius,
    longitudeDeg
  };
}

export function bodyHeliocentricPositionAuAtInstant(bodyKey, dateInput) {
  const normalizedBodyKey = String(bodyKey).toLowerCase();
  if (!SUPPORTED_PLANET_KEYS.includes(normalizedBodyKey)) {
    throw new Error(
      `Unsupported body "${bodyKey}". Expected one of: ${SUPPORTED_PLANET_KEYS.join(", ")}`
    );
  }

  const instant = toDateFromInput(dateInput);
  assertDateInSupportedRange(instant);

  const position = getBodyPositionAuAtInstant(normalizedBodyKey, instant);
  if (!position) {
    throw new Error(
      `No ephemeris position available for ${normalizedBodyKey} at ${instant.toISOString()}`
    );
  }

  return {
    body: normalizedBodyKey,
    xAu: position.xAu,
    yAu: position.yAu,
    zAu: position.zAu
  };
}

export function earthHeliocentricPositionAuAtInstant(dateInput) {
  return bodyHeliocentricPositionAuAtInstant("earth", dateInput);
}

export function computeOrbitalTimelineState({
  birthday,
  timelineDate,
  maxTimelineDate = new Date()
}) {
  const birthdayUtc = assertDateInSupportedRange(birthday);
  const timelineUtc = assertDateInSupportedRange(timelineDate);
  const maxTimelineUtc = assertDateInSupportedRange(maxTimelineDate);

  if (birthdayUtc > maxTimelineUtc) {
    throw new Error(
      `Birthday ${toIsoUtcDate(birthdayUtc)} cannot be after max timeline date ${toIsoUtcDate(maxTimelineUtc)}`
    );
  }

  if (timelineUtc < birthdayUtc) {
    throw new Error(
      `Timeline date ${toIsoUtcDate(timelineUtc)} cannot be before birthday ${toIsoUtcDate(birthdayUtc)}`
    );
  }

  if (timelineUtc > maxTimelineUtc) {
    throw new Error(
      `Timeline date ${toIsoUtcDate(timelineUtc)} cannot be after max timeline date ${toIsoUtcDate(maxTimelineUtc)}`
    );
  }

  const elapsedDays = daysBetweenUtc(birthdayUtc, timelineUtc);
  const totalTimelineDays = daysBetweenUtc(birthdayUtc, maxTimelineUtc);
  const normalizedProgress =
    totalTimelineDays === 0 ? 1 : elapsedDays / totalTimelineDays;

  return {
    birthdayUtc: toIsoUtcDate(birthdayUtc),
    timelineDateUtc: toIsoUtcDate(timelineUtc),
    maxTimelineDateUtc: toIsoUtcDate(maxTimelineUtc),
    elapsedDays,
    totalTimelineDays,
    normalizedProgress,
    earth: earthPositionOnUnitOrbit(timelineUtc)
  };
}
