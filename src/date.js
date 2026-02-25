const MIN_DATE_ISO = "1900-01-01";
const MAX_DATE_ISO = "2100-12-31";

function toUtcMidnight(dateString) {
  return new Date(`${dateString}T00:00:00Z`);
}

export function todayUtcDate() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

export function validateBirthday(dateString) {
  if (!dateString) {
    return { ok: false, message: "Birthday is required." };
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
