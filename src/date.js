import { SUPPORTED_DATE_RANGE } from "./orbital-time.js";

const MIN_DATE_ISO = SUPPORTED_DATE_RANGE.min;
const MAX_DATE_ISO = SUPPORTED_DATE_RANGE.max;

function toUtcMidnight(dateString) {
  return new Date(`${dateString}T00:00:00Z`);
}

function isStrictIsoDate(dateString) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateString);
  if (!match) {
    return false;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const utcDate = new Date(Date.UTC(year, month - 1, day));

  return (
    utcDate.getUTCFullYear() === year
    && utcDate.getUTCMonth() === month - 1
    && utcDate.getUTCDate() === day
  );
}

export function todayUtcDate() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

export function validateBirthday(dateString) {
  if (!dateString) {
    return { ok: false, message: "Birthday is required." };
  }

  if (!isStrictIsoDate(dateString)) {
    return { ok: false, message: "Enter a valid date." };
  }

  const date = toUtcMidnight(dateString);
  if (Number.isNaN(date.getTime())) {
    return { ok: false, message: "Enter a valid date." };
  }

  if (dateString < MIN_DATE_ISO || dateString > MAX_DATE_ISO) {
    return { ok: false, message: `Birthday must be between ${MIN_DATE_ISO} and ${MAX_DATE_ISO}.` };
  }

  if (date > todayUtcDate()) {
    return { ok: false, message: "Birthday cannot be in the future." };
  }

  return { ok: true, message: "", date };
}

export function dayOfYearUtc(date) {
  const yearStart = Date.UTC(date.getUTCFullYear(), 0, 1);
  const day = Math.floor((date.getTime() - yearStart) / 86400000);
  return day + 1;
}

export function earthAngleFromDate(date) {
  const yearLength = 365.25;
  const day = dayOfYearUtc(date);
  return (day / yearLength) * Math.PI * 2;
}
