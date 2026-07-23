import fs from "node:fs";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import { enabledBodies, loadCatalog } from "./catalog.mjs";

const HORIZONS_API_URL = "https://ssd.jpl.nasa.gov/api/horizons.api";
const cwd = process.cwd();
const v1Dir = path.resolve(cwd, process.env.EPHEMERIS_V1_DATA_DIR ?? "data/ephemeris/v1");
const v2Dir = path.resolve(cwd, process.env.EPHEMERIS_V2_DATA_DIR ?? "data/ephemeris/v2");
const rawDir = path.join(v2Dir, "raw-horizons-auxiliary");
const snapshotsPath = path.join(v2Dir, "auxiliary-snapshots.ndjson");

function parseArgs(argv) {
  const flags = new Set(argv);
  return {
    fetch: flags.has("--fetch"),
    yes: flags.has("--yes"),
    printPlan: flags.has("--print-plan")
  };
}

function utcDateFromIso(iso) {
  return new Date(iso).toISOString().slice(0, 10);
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
  const response = await fetch(url);
  if (!response.ok || !response.body) {
    throw new Error(`Horizons request failed (${response.status}) for ${url}`);
  }
  await pipeline(Readable.fromWeb(response.body), fs.createWriteStream(destination));
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
  const header = JSON.parse(fs.readFileSync(path.join(v1Dir, "header.json"), "utf8"));
  const auxiliary = enabledBodies(loadCatalog(cwd), "auxiliary");
  const startDate = utcDateFromIso(header.window.startUtc);
  const stopDate = utcDateFromIso(header.window.endUtc);

  const planLines = [
    "Auxiliary Horizons refresh plan:",
    `- window: ${startDate}..${stopDate}`,
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
      const url = buildUrl(horizonsParams({ command: target.horizonsCommand, startDate, stopDate }));
      const destination = path.join(rawDir, `${target.key}.json`);
      await fetchRawJson(url, destination);
      console.log(`Fetched ${target.key} -> ${path.relative(cwd, destination)}`);
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
    if (rows.length !== header.cadence.samplesPerBody) {
      throw new Error(
        `Row count mismatch for ${target.key}: expected ${header.cadence.samplesPerBody}, got ${rows.length}`
      );
    }
    rowsByTarget.set(target.key, rows);
  }

  // The asteroid-belt catalog produces millions of rows. Write incrementally
  // rather than building one multi-gigabyte string in memory.
  const snapshotsFd = fs.openSync(snapshotsPath, "w");
  let rowCount = 0;
  try {
    for (let i = 0; i < header.cadence.samplesPerBody; i += 1) {
      for (const target of auxiliary) {
        fs.writeSync(snapshotsFd, `${JSON.stringify(rowsByTarget.get(target.key)[i])}\n`);
        rowCount += 1;
      }
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
