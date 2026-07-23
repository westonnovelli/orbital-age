import fs from "node:fs";
import path from "node:path";
import { enabledBodies, loadCatalog } from "./catalog.mjs";

const HORIZONS_API_URL = "https://ssd.jpl.nasa.gov/api/horizons.api";
const cwd = process.cwd();
const v2Dir = path.resolve(cwd, process.env.EPHEMERIS_V2_DATA_DIR ?? "data/ephemeris/v2");
const sourcePath = path.resolve(cwd, process.env.EPHEMERIS_V2_SOURCE ?? path.join(v2Dir, "source.json"));
const rawDir = path.join(v2Dir, "raw-horizons-auxiliary");
const snapshotsPath = path.join(v2Dir, "auxiliary-snapshots.ndjson");

function parseArgs(argv) {
  const flags = new Set(argv);
  return {
    fetch: flags.has("--fetch"),
    incremental: flags.has("--incremental"),
    yes: flags.has("--yes"),
    printPlan: flags.has("--print-plan")
  };
}

function utcDateFromIso(iso) {
  return new Date(iso).toISOString().slice(0, 10);
}

const MS_PER_DAY = 86400000;
const MAX_HORIZONS_DAYS_PER_REQUEST = 40000;

function addUtcDays(iso, days) {
  return new Date(Date.parse(iso) + days * MS_PER_DAY).toISOString().replace(".000Z", "Z");
}

function dateSegments(startDate, stopDate) {
  const segments = [];
  let cursor = new Date(`${startDate}T00:00:00Z`);
  const end = new Date(`${stopDate}T00:00:00Z`);
  while (cursor <= end) {
    const segmentEnd = new Date(Math.min(end.getTime(), cursor.getTime() + (MAX_HORIZONS_DAYS_PER_REQUEST - 1) * MS_PER_DAY));
    segments.push({ startDate: cursor.toISOString().slice(0, 10), stopDate: segmentEnd.toISOString().slice(0, 10) });
    cursor = new Date(segmentEnd.getTime() + MS_PER_DAY);
  }
  return segments;
}

function horizonsParams({ command, startDate, stopDate }) {
  return {
    format: "json",
    COMMAND: command,
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
  return `${HORIZONS_API_URL}?${Object.entries(params)
    .map(([key, value]) => {
      const raw = key === "format" ? String(value) : `'${value}'`;
      return `${key}=${encodeURIComponent(raw)}`;
    })
    .join("&")}`;
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
      if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, 1000 * 2 ** attempt));
    }
  }
  throw lastError;
}

function vectorSection(resultText, target) {
  const start = resultText.indexOf("$$SOE");
  const end = resultText.indexOf("$$EOE");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error(`Horizons returned no vector section for ${target.key} (${target.naifId}): ${resultText.slice(0, 180).trim()}`);
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
  return { result: `$$SOE\n${payloads.map((payload) => vectorSection(payload.result, target)).filter(Boolean).join("\n")}\n$$EOE\n` };
}

function parseHorizonsCsvRows(resultText, target) {
  const start = resultText.indexOf("$$SOE");
  const end = resultText.indexOf("$$EOE");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error(`Could not find vector rows for ${target.key}`);
  }

  return resultText
    .slice(start + 5, end)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, idx) => {
      const cols = line.split(",").map((part) => part.trim());
      const jd = Number(cols[0]);
      const numericTail = cols
        .slice(2)
        .map((value) => Number(value))
        .filter((value) => Number.isFinite(value));
      if (!Number.isFinite(jd) || numericTail.length < 3) {
        throw new Error(`Invalid vector row for ${target.key} at ${idx + 1}`);
      }
      const [xAu, yAu, zAu] = numericTail;
      const epochUnixS = Math.round((jd - 2440587.5) * 86400);
      return {
        epochUtc: new Date(epochUnixS * 1000).toISOString().replace(".000Z", "Z"),
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

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const header = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
  const auxiliary = enabledBodies(loadCatalog(cwd), "auxiliary");
  const currentEndUtc = header.window.endUtc;
  const requestedStartUtc = options.incremental ? addUtcDays(currentEndUtc, 1) : header.window.startUtc;
  const startDate = utcDateFromIso(requestedStartUtc);
  const requestedEndUtc = options.incremental ? addUtcDays(currentEndUtc, 1) : header.window.endUtc;
  const stopDate = utcDateFromIso(requestedEndUtc);

  if (options.incremental && Date.parse(requestedStartUtc) > Date.parse(requestedEndUtc)) {
    console.log(`No auxiliary refresh needed; window already ends ${header.window.endUtc}.`);
    return;
  }

  const planLines = [
    "Auxiliary Horizons refresh plan:",
    `- window: ${startDate}..${stopDate}${options.incremental ? " (incremental)" : ""}`,
    "- requests:"
  ];
  for (const target of auxiliary) {
    const url = buildUrl(horizonsParams({ command: target.horizonsCommand, startDate, stopDate }));
    planLines.push(`  - ${target.key}: ${url}`);
  }
  if (options.printPlan) {
    console.log(planLines.join("\n"));
  }
  if (!options.fetch && !options.yes && !options.printPlan) {
    throw new Error("Pass --fetch, --yes, or --print-plan.");
  }

  if (options.fetch) {
    fs.mkdirSync(rawDir, { recursive: true });
    for (const target of auxiliary) {
      let effectiveStartDate = startDate;
      let payloads = [];
      for (let recoveryAttempt = 0; recoveryAttempt < 2; recoveryAttempt += 1) {
        payloads = [];
        for (const segment of dateSegments(effectiveStartDate, stopDate)) {
          const url = buildUrl(horizonsParams({ command: target.horizonsCommand, ...segment }));
          const destination = path.join(rawDir, `${target.key}-${segment.startDate}-${segment.stopDate}.json`);
          payloads.push(await fetchRawJson(url, destination));
          console.log(`Fetched ${target.key} ${segment.startDate}..${segment.stopDate}`);
        }
        const unavailable = payloads.find((payload) => payload.result && !payload.result.includes("$$SOE"));
        const earliest = unavailable
          ? extractEarliestAvailableDate(`${unavailable.result} ${unavailable.error ?? ""}`)
          : null;
        if (!unavailable || !earliest || earliest <= effectiveStartDate) break;
        if (options.incremental) {
          throw new Error(
            `${target.key} has no auxiliary ephemeris for ${startDate}; earliest available date is ${earliest}. ` +
              "Run a full auxiliary backfill so coverage can be represented explicitly."
          );
        }
        console.log(`${target.key} unavailable before ${earliest}; retrying from its first available date.`);
        effectiveStartDate = earliest;
      }
      const destination = path.join(rawDir, `${target.key}.json`);
      fs.writeFileSync(destination, `${JSON.stringify(mergeHorizonsPayloads(payloads, target), null, 2)}\n`);
      console.log(
        `Merged ${target.key} ${effectiveStartDate}..${stopDate} ` +
          `(${payloads.length} segment${payloads.length === 1 ? "" : "s"})`
      );
    }
  }

  if (!options.yes && !options.fetch) {
    return;
  }

  const rowsByTarget = new Map();
  for (const target of auxiliary) {
    const rawPath = path.join(rawDir, `${target.key}.json`);
    if (!fs.existsSync(rawPath)) {
      throw new Error(`Missing raw Horizons response: ${path.relative(cwd, rawPath)}`);
    }
    const payload = JSON.parse(fs.readFileSync(rawPath, "utf8"));
    const rows = parseHorizonsCsvRows(payload.result, target);
    const firstRowUtc = rows[0]?.epochUtc;
    const expectedRows = options.incremental
      ? Math.round((Date.parse(requestedEndUtc) - Date.parse(currentEndUtc)) / MS_PER_DAY)
      : Math.round((Date.parse(header.window.endUtc) - Date.parse(firstRowUtc)) / MS_PER_DAY) + 1;
    if (rows.length !== expectedRows) {
      throw new Error(
        `Row count mismatch for ${target.key}: expected ${expectedRows}, got ${rows.length}`
      );
    }
    rowsByTarget.set(target.key, rows);
  }

  if (options.incremental) {
    const snapshotsFd = fs.openSync(snapshotsPath, "a");
    try {
      const newRows = auxiliary.flatMap((target) => rowsByTarget.get(target.key));
      newRows.sort((a, b) => a.epochUnixS - b.epochUnixS || a.naifId - b.naifId);
      for (const row of newRows) {
        fs.writeSync(snapshotsFd, `${JSON.stringify(row)}\n`);
      }
      console.log(`Appended ${newRows.length} auxiliary rows.`);
    } finally {
      fs.closeSync(snapshotsFd);
    }
    return;
  }

  // The asteroid-belt catalog produces millions of rows. Write incrementally
  // rather than building one multi-gigabyte string in memory.
  const snapshotsFd = fs.openSync(snapshotsPath, "w");
  let rowCount = 0;
  try {
    const allRows = auxiliary.flatMap((target) => rowsByTarget.get(target.key));
    allRows.sort((a, b) => a.epochUnixS - b.epochUnixS || a.naifId - b.naifId);
    for (const row of allRows) {
      fs.writeSync(snapshotsFd, `${JSON.stringify(row)}\n`);
      rowCount += 1;
    }
  } finally {
    fs.closeSync(snapshotsFd);
  }
  console.log(`Wrote ${path.relative(cwd, snapshotsPath)} (${rowCount} rows)`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack : String(error));
  process.exitCode = 1;
});
