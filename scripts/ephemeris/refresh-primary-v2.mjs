import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { createInterface } from "node:readline/promises";
import { enabledBodies, loadCatalog } from "./catalog.mjs";

const HORIZONS_API_URL = "https://ssd.jpl.nasa.gov/api/horizons.api";
const DEFAULT_DATA_DIR = "data/ephemeris/v2";
const RAW_DIR_NAME = "raw-horizons-primary";

function parseArgs(argv) {
  const flags = new Set(argv);
  const values = new Map();

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) {
      continue;
    }

    const next = argv[i + 1];
    if (next && !next.startsWith("--")) {
      values.set(token, next);
      i += 1;
    }
  }

  return {
    fetch: flags.has("--fetch"),
    incremental: flags.has("--incremental"),
    yes: flags.has("--yes"),
    printPlan: flags.has("--print-plan"),
    retrievedOn: values.get("--retrieved-on") ?? null,
    startUtc: values.get("--start-utc") ?? null,
    endUtc: values.get("--end-utc") ?? null,
    dataDir: values.get("--data-dir") ?? process.env.EPHEMERIS_V2_DATA_DIR ?? DEFAULT_DATA_DIR
  };
}

function utcDateFromIso(iso) {
  return new Date(iso).toISOString().slice(0, 10);
}

const MS_PER_DAY = 86400000;
const MAX_HORIZONS_DAYS_PER_REQUEST = 40000;

function utcMidnightIso(date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())).toISOString().replace(".000Z", "Z");
}

function addUtcDays(iso, days) {
  return new Date(Date.parse(iso) + days * MS_PER_DAY).toISOString().replace(".000Z", "Z");
}

function dateSegments(startDate, stopDate) {
  const segments = [];
  let cursor = new Date(`${startDate}T00:00:00Z`);
  const end = new Date(`${stopDate}T00:00:00Z`);
  while (cursor <= end) {
    const segmentEnd = new Date(Math.min(
      end.getTime(),
      cursor.getTime() + (MAX_HORIZONS_DAYS_PER_REQUEST - 1) * MS_PER_DAY
    ));
    segments.push({
      startDate: cursor.toISOString().slice(0, 10),
      stopDate: segmentEnd.toISOString().slice(0, 10)
    });
    cursor = new Date(segmentEnd.getTime() + MS_PER_DAY);
  }
  return segments;
}

// The interpolation ceiling at runtime is endUtc - stepSeconds (see runtime.js), so
// extending the window through "today + 1 day" is what makes *today* interpolable.
function targetEndUtcIso(options) {
  if (options.endUtc) {
    return utcMidnightIso(new Date(options.endUtc));
  }
  const tomorrow = new Date(Date.now() + MS_PER_DAY);
  return utcMidnightIso(tomorrow);
}

// Recompute the daily-cadence window so it spans [startUtc, desiredEndUtc] inclusive.
// `days` and `samplesPerBody` both track the inclusive daily sample count. The window
// is only ever extended forward, never shrunk.
function extendWindowToEnd(header, desiredEndUtcIso) {
  const startMs = Date.parse(header.window.startUtc);
  const currentEndMs = Date.parse(header.window.endUtc);
  const desiredEndMs = Date.parse(desiredEndUtcIso);
  const endMs = Math.max(currentEndMs, desiredEndMs);
  const inclusiveSamples = Math.round((endMs - startMs) / MS_PER_DAY) + 1;

  header.window.endUtc = new Date(endMs).toISOString().replace(".000Z", "Z");
  header.window.days = inclusiveSamples;
  header.cadence.samplesPerBody = inclusiveSamples;
  return header;
}

function horizonsParams({ naifId, startDate, stopDate }) {
  return {
    format: "json",
    COMMAND: String(naifId),
    OBJ_DATA: "NO",
    MAKE_EPHEM: "YES",
    EPHEM_TYPE: "VECTORS",
    CENTER: "500@0",
    REF_PLANE: "ECLIPTIC",
    REF_SYSTEM: "J2000",
    OUT_UNITS: "AU-D",
    VEC_TABLE: "1",
    VEC_CORR: "NONE",
    CSV_FORMAT: "YES",
    STEP_SIZE: "1 d",
    START_TIME: startDate,
    STOP_TIME: stopDate,
    TIME_DIGITS: "SECONDS"
  };
}

function buildUrl(params) {
  // Horizons requires parameter values to be wrapped in single quotes (except the
  // meta `format` selector). URLSearchParams also encodes spaces as `+`, which the
  // Horizons parser rejects, so emit %20 instead.
  const parts = [];
  for (const [key, value] of Object.entries(params)) {
    const raw = key === "format" ? String(value) : `'${value}'`;
    parts.push(`${key}=${encodeURIComponent(raw)}`);
  }
  return `${HORIZONS_API_URL}?${parts.join("&")}`;
}

function parseHorizonsCsvRows(resultText, target) {
  const start = resultText.indexOf("$$SOE");
  const end = resultText.indexOf("$$EOE");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error(`Could not find $$SOE/$$EOE section for naifId ${target.naifId}`);
  }

  const block = resultText.slice(start + 5, end);
  const lines = block
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.map((line, idx) => {
    const cols = line.split(",").map((part) => part.trim());
    const jd = Number(cols[0]);
    if (!Number.isFinite(jd)) {
      throw new Error(`Invalid JD at naifId ${target.naifId}, row ${idx + 1}`);
    }

    const numericTail = cols
      .slice(2)
      .map((value) => Number(value))
      .filter((value) => Number.isFinite(value));

    if (numericTail.length < 3) {
      throw new Error(`Missing XYZ values at naifId ${target.naifId}, row ${idx + 1}`);
    }

    const [xAu, yAu, zAu] = numericTail;
    const epochUnixS = Math.round((jd - 2440587.5) * 86400);
    const epochUtc = new Date(epochUnixS * 1000).toISOString().replace(".000Z", "Z");

    return {
      epochUtc,
      epochUnixS,
      naifId: target.naifId,
      body: target.key,
      frame: "ECLIPJ2000",
      origin: "SSB",
      xAu,
      yAu,
      zAu
    };
  });
}

function buildSunRows(epochs, target) {
  return epochs.map(({ epochUtc, epochUnixS }) => ({
    epochUtc,
    epochUnixS,
    naifId: target.naifId,
    body: target.key,
    frame: "ECLIPJ2000",
    origin: "SSB",
    xAu: 0,
    yAu: 0,
    zAu: 0
  }));
}

async function fetchRawJson(url, destination) {
  let lastError = null;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const response = await fetch(url);
      if (!response.ok || !response.body) {
        throw new Error(`Horizons request failed (${response.status}) for ${url}`);
      }
      const text = await response.text();
      fs.writeFileSync(destination, text);
      return JSON.parse(text);
    } catch (error) {
      lastError = error;
      if (attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * 2 ** attempt));
      }
    }
  }
  throw lastError;
}

function vectorSection(resultText, target) {
  const start = resultText.indexOf("$$SOE");
  const end = resultText.indexOf("$$EOE");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error(
      `Horizons returned no vector section for ${target.key} (${target.naifId}). ` +
      `${resultText.slice(0, 180).trim()}`
    );
  }
  return resultText.slice(start + 5, end).trim();
}

function extractEarliestAvailableDate(text) {
  const match = /prior to A\.D\.\s+(\d{4})-([A-Z]{3})-(\d{2})/i.exec(String(text));
  if (!match) return null;
  const months = new Map([
    ["JAN", 0], ["FEB", 1], ["MAR", 2], ["APR", 3], ["MAY", 4], ["JUN", 5],
    ["JUL", 6], ["AUG", 7], ["SEP", 8], ["OCT", 9], ["NOV", 10], ["DEC", 11]
  ]);
  const month = months.get(match[2].toUpperCase());
  if (month === undefined) return null;
  return new Date(Date.UTC(Number(match[1]), month, Number(match[3]))).toISOString().slice(0, 10);
}

function mergeHorizonsPayloads(payloads, target) {
  const rows = payloads.map((payload) => vectorSection(payload.result, target)).filter(Boolean);
  return {
    result: `$$SOE\n${rows.join("\n")}\n$$EOE\n`,
    signature: payloads[0]?.signature,
    mergedSegments: payloads.length
  };
}

async function askForConfirmation() {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  try {
    const answer = await rl.question("This will overwrite v2 source metadata and primary raw payloads. Continue? [y/N] ");
    return answer.trim().toLowerCase() === "y";
  } finally {
    rl.close();
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const cwd = process.cwd();
  const dataDir = path.resolve(cwd, options.dataDir);
  const headerPath = path.join(dataDir, "source.json");
  const rawDir = path.join(dataDir, RAW_DIR_NAME);

  const header = JSON.parse(fs.readFileSync(headerPath, "utf8"));
  // The v2 source contract derives its primary target list from the body catalog.
  if (path.resolve(dataDir) === path.resolve(cwd, DEFAULT_DATA_DIR)) {
    const catalog = loadCatalog(cwd);
    const primaryBodies = enabledBodies(catalog, "primary");
    const naifByKey = new Map(primaryBodies.map((body) => [body.key, body.naifId]));
    const existingTargets = new Map(header.targets.map((target) => [target.key, target]));
    header.schemaVersion = "ephemeris.source.v2";
    header.frame = catalog.ephemeris.frame;
    header.origin = catalog.ephemeris.origin;
    header.units = catalog.ephemeris.units;
    header.targets = primaryBodies.map((body) => ({
      key: body.key,
      naifId: body.naifId,
      ...(body.synthetic ? { synthetic: body.synthetic } : {}),
      ...(existingTargets.get(body.key)?.coverageStartUtc
        ? { coverageStartUtc: existingTargets.get(body.key).coverageStartUtc }
        : {}),
      ...(body.relativeTo ? { relativeTo: naifByKey.get(body.relativeTo) } : {})
    }));
  }

  // Only extend the window during a live fetch. Cached-raw rebuilds (no --fetch) keep
  // the existing window so their fixed-size raw payloads still line up.
  if (options.fetch) {
    if (options.startUtc) {
      header.window.startUtc = utcMidnightIso(new Date(options.startUtc));
    }
    extendWindowToEnd(header, targetEndUtcIso(options));
  }

  const currentEndUtc = JSON.parse(fs.readFileSync(headerPath, "utf8")).window.endUtc;
  const requestedStartUtc = options.incremental ? addUtcDays(currentEndUtc, 1) : header.window.startUtc;
  const startDate = utcDateFromIso(requestedStartUtc);
  const stopDate = utcDateFromIso(header.window.endUtc);

  if (options.incremental && Date.parse(requestedStartUtc) > Date.parse(header.window.endUtc)) {
    console.log(`No ephemeris refresh needed; window already ends ${header.window.endUtc}.`);
    return;
  }

  const nonSunTargets = header.targets.filter((target) => target.key !== "sun");
  const sunTarget = header.targets.find((target) => target.key === "sun") ?? null;
  const coverageStartByNaifId = new Map();

  const planLines = [
    "Horizons refresh plan:",
    `- data dir: ${path.relative(cwd, dataDir)}`,
    `- raw dir: ${path.relative(cwd, rawDir)}`,
    `- window: ${startDate}..${stopDate}${options.incremental ? " (incremental)" : ""}`,
    "- requests:"
  ];

  for (const target of nonSunTargets) {
    const params = horizonsParams({ naifId: target.naifId, startDate, stopDate });
    const url = buildUrl(params);
    planLines.push(`  - ${target.key} (${target.naifId}): ${url}`);
  }

  if (options.printPlan) {
    console.log(planLines.join("\n"));
  }

  if (options.fetch) {
    fs.mkdirSync(rawDir, { recursive: true });
    for (const target of nonSunTargets) {
      let effectiveStartDate = startDate;
      let payloads = [];
      for (let recoveryAttempt = 0; recoveryAttempt < 2; recoveryAttempt += 1) {
        const segments = dateSegments(effectiveStartDate, stopDate);
        payloads = [];
        for (const segment of segments) {
          const params = horizonsParams({ naifId: target.naifId, ...segment });
          const url = buildUrl(params);
          const destination = path.join(rawDir, `${target.naifId}-${segment.startDate}-${segment.stopDate}.json`);
          const payload = await fetchRawJson(url, destination);
          payloads.push(payload);
          console.log(`Fetched ${target.key} ${segment.startDate}..${segment.stopDate}`);
        }
        const unavailablePayload = payloads.find((payload) => payload.result && !payload.result.includes("$$SOE"));
        const earliest = unavailablePayload ? extractEarliestAvailableDate(`${unavailablePayload.result} ${unavailablePayload.error ?? ""}`) : null;
        if (!unavailablePayload || !earliest || earliest <= effectiveStartDate) {
          break;
        }
        console.log(`${target.key} unavailable before ${earliest}; retrying from its first available date.`);
        effectiveStartDate = earliest;
      }
      const destination = path.join(rawDir, `${target.naifId}.json`);
      if (options.incremental && fs.existsSync(destination)) {
        payloads.unshift(JSON.parse(fs.readFileSync(destination, "utf8")));
      }
      fs.writeFileSync(destination, `${JSON.stringify(mergeHorizonsPayloads(payloads, target), null, 2)}\n`);
      coverageStartByNaifId.set(target.naifId, `${effectiveStartDate}T00:00:00Z`);
      console.log(`Merged ${target.key} -> ${path.relative(cwd, destination)} (${payloads.length} segment${payloads.length === 1 ? "" : "s"})`);
    }
  }

  if (!options.yes) {
    const confirmed = await askForConfirmation();
    if (!confirmed) {
      console.log("Aborted.");
      return;
    }
  }

  const rowsByNaifId = new Map();
  for (const target of nonSunTargets) {
    const rawPath = path.join(rawDir, `${target.naifId}.json`);
    if (!fs.existsSync(rawPath)) {
      throw new Error(`Missing raw Horizons response: ${path.relative(cwd, rawPath)}. Run with --fetch or add cached raw JSON.`);
    }

    const payload = JSON.parse(fs.readFileSync(rawPath, "utf8"));
    if (typeof payload.result !== "string") {
      throw new Error(`Unexpected Horizons payload format in ${path.relative(cwd, rawPath)}`);
    }

    const rows = parseHorizonsCsvRows(payload.result, target);
    const targetCoverageStart =
      coverageStartByNaifId.get(target.naifId) ?? target.coverageStartUtc ?? header.window.startUtc;
    const expectedRows = Math.round((Date.parse(header.window.endUtc) - Date.parse(targetCoverageStart)) / MS_PER_DAY) + 1;
    if (rows.length !== expectedRows) {
      throw new Error(
        `Row count mismatch for ${target.key} (${target.naifId}): expected ${expectedRows}, got ${rows.length}`
      );
    }

    rowsByNaifId.set(target.naifId, rows);
  }

  let referenceEpochs = null;
  for (const target of nonSunTargets) {
    const rows = rowsByNaifId.get(target.naifId);
    const epochs = rows.map((row) => row.epochUnixS);
    if (!referenceEpochs) {
      referenceEpochs = epochs;
      continue;
    }

    const targetCoverageStart =
      coverageStartByNaifId.get(target.naifId) ?? target.coverageStartUtc ?? header.window.startUtc;
    const firstIndex = referenceEpochs.findIndex(
      (epochUnixS) => epochUnixS * 1000 >= Date.parse(targetCoverageStart)
    );
    if (firstIndex < 0 || epochs.length !== referenceEpochs.length - firstIndex) {
      throw new Error(
        `Epoch range mismatch for naifId ${target.naifId}: expected ${referenceEpochs.length - Math.max(0, firstIndex)} samples, got ${epochs.length}`
      );
    }
    for (let i = 0; i < epochs.length; i += 1) {
      if (referenceEpochs[firstIndex + i] !== epochs[i]) {
        throw new Error(`Epoch mismatch for naifId ${target.naifId} at index ${firstIndex + i}`);
      }
    }
  }

  if (!referenceEpochs) {
    throw new Error("No non-sun targets configured in header.json");
  }

  if (sunTarget) {
    const sunRows = buildSunRows(
      referenceEpochs.map((epochUnixS) => ({
        epochUnixS,
        epochUtc: new Date(epochUnixS * 1000).toISOString().replace(".000Z", "Z")
      })),
      sunTarget
    );

    const expectedRows = header.cadence.samplesPerBody;
    if (sunRows.length !== expectedRows) {
      throw new Error(
        `Row count mismatch for sun (${sunTarget.naifId}): expected ${expectedRows}, got ${sunRows.length}`
      );
    }

    rowsByNaifId.set(sunTarget.naifId, sunRows);
    coverageStartByNaifId.set(sunTarget.naifId, header.window.startUtc);
  }

  for (const target of header.targets) {
    const coverageStartUtc = coverageStartByNaifId.get(target.naifId) ?? target.coverageStartUtc ?? header.window.startUtc;
    if (coverageStartUtc === header.window.startUtc) {
      delete target.coverageStartUtc;
    } else {
      target.coverageStartUtc = coverageStartUtc;
    }
  }

  const retrievedOn = options.retrievedOn ?? new Date().toISOString().slice(0, 10);
  header.ephemerisSource = {
    ...header.ephemerisSource,
    retrievedOn
  };
  fs.writeFileSync(headerPath, `${JSON.stringify(header, null, 2)}\n`);

  console.log(`Validated ${referenceEpochs.length} daily primary samples without writing a monolithic snapshot.`);
  console.log(`Updated ${path.relative(cwd, headerPath)} ephemerisSource.retrievedOn=${retrievedOn}`);
  console.log("Next: run `npm run data:ephemeris:rebuild` then `npm run data:ephemeris:verify`.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
