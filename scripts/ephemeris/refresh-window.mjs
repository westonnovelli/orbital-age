const MS_PER_DAY = 86400000;

function addUtcDays(iso, days) {
  return new Date(Date.parse(iso) + days * MS_PER_DAY).toISOString().replace(".000Z", "Z");
}

function utcDateFromIso(iso) {
  return new Date(iso).toISOString().slice(0, 10);
}

function utcMidnightIso(iso) {
  const date = new Date(iso);
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
    .toISOString()
    .replace(".000Z", "Z");
}

export function buildIncrementalWindow({ currentEndUtc, nowUtc, endUtc = null }) {
  const requestedStartUtc = addUtcDays(currentEndUtc, 1);
  const requestedEndUtc = endUtc
    ? utcMidnightIso(endUtc)
    : utcMidnightIso(new Date(Date.parse(nowUtc) + MS_PER_DAY).toISOString());
  const startDate = utcDateFromIso(requestedStartUtc);
  const stopDate = utcDateFromIso(requestedEndUtc);
  const requestStartDate = startDate === stopDate
    ? utcDateFromIso(addUtcDays(`${startDate}T00:00:00Z`, -1))
    : startDate;
  return { requestedStartUtc, requestedEndUtc, startDate, stopDate, requestStartDate };
}
