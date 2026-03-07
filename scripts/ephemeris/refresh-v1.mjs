import fs from "node:fs";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import { createInterface } from "node:readline/promises";

const HORIZONS_API_URL = "https://ssd.jpl.nasa.gov/api/horizons.api";
const DEFAULT_DATA_DIR = "data/ephemeris/v1";
const RAW_DIR_NAME = "raw-horizons";

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
    yes: flags.has("--yes"),
    printPlan: flags.has("--print-plan"),
    retrievedOn: values.get("--retrieved-on") ?? null,
    dataDir: values.get("--data-dir") ?? process.env.EPHEMERIS_DATA_DIR ?? DEFAULT_DATA_DIR
  };
}

function utcDateFromIso(iso) {
  return new Date(iso).toISOString().slice(0, 10);
}

function horizonsParams({ naifId, startDate, stopDate }) {
  return {
    format: "json",
    COMMAND: String(naifId),
    OBJ_DATA: "NO",
    MAKE_EPHEM: "YES",
    EPHEM_TYPE: "VECTORS",
    CENTER: "500@10",
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
  const search = new URLSearchParams(params);
  return `${HORIZONS_API_URL}?${search.toString()}`;
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
      origin: "SUN",
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
    origin: "SUN",
    xAu: 0,
    yAu: 0,
    zAu: 0
  }));
}

async function fetchRawJson(url, destination) {
  const response = await fetch(url);
  if (!response.ok || !response.body) {
    throw new Error(`Horizons request failed (${response.status}) for ${url}`);
  }

  await pipeline(Readable.fromWeb(response.body), fs.createWriteStream(destination));
}

async function askForConfirmation() {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  try {
    const answer = await rl.question("This will overwrite header.json and snapshots.ndjson. Continue? [y/N] ");
    return answer.trim().toLowerCase() === "y";
  } finally {
    rl.close();
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const cwd = process.cwd();
  const dataDir = path.resolve(cwd, options.dataDir);
  const headerPath = path.join(dataDir, "header.json");
  const snapshotsPath = path.join(dataDir, "snapshots.ndjson");
  const rawDir = path.join(dataDir, RAW_DIR_NAME);

  const header = JSON.parse(fs.readFileSync(headerPath, "utf8"));
  const startDate = utcDateFromIso(header.window.startUtc);
  const stopDate = utcDateFromIso(header.window.endUtc);

  const nonSunTargets = header.targets.filter((target) => target.key !== "sun");
  const sunTarget = header.targets.find((target) => target.key === "sun") ?? null;

  const planLines = [
    "Horizons refresh plan:",
    `- data dir: ${path.relative(cwd, dataDir)}`,
    `- raw dir: ${path.relative(cwd, rawDir)}`,
    `- window: ${startDate}..${stopDate}`,
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
      const params = horizonsParams({ naifId: target.naifId, startDate, stopDate });
      const url = buildUrl(params);
      const destination = path.join(rawDir, `${target.naifId}.json`);
      await fetchRawJson(url, destination);
      console.log(`Fetched ${target.key} -> ${path.relative(cwd, destination)}`);
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
    if (rows.length !== header.cadence.samplesPerBody) {
      throw new Error(
        `Row count mismatch for ${target.key} (${target.naifId}): expected ${header.cadence.samplesPerBody}, got ${rows.length}`
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

    for (let i = 0; i < referenceEpochs.length; i += 1) {
      if (referenceEpochs[i] !== epochs[i]) {
        throw new Error(`Epoch mismatch for naifId ${target.naifId} at index ${i}`);
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

    if (sunRows.length !== header.cadence.samplesPerBody) {
      throw new Error(
        `Row count mismatch for sun (${sunTarget.naifId}): expected ${header.cadence.samplesPerBody}, got ${sunRows.length}`
      );
    }

    rowsByNaifId.set(sunTarget.naifId, sunRows);
  }

  const rowMapsByNaifId = new Map(
    [...rowsByNaifId.entries()].map(([naifId, targetRows]) => [naifId, new Map(targetRows.map((row) => [row.epochUnixS, row]))])
  );

  const rows = [];
  for (const epochUnixS of referenceEpochs) {
    for (const target of header.targets) {
      const row = rowMapsByNaifId.get(target.naifId).get(epochUnixS);
      if (!row) {
        throw new Error(`Missing row for naifId ${target.naifId} at epoch ${epochUnixS}`);
      }
      rows.push(row);
    }
  }

  const serialized = rows.map((row) => `${JSON.stringify(row)}\n`).join("");
  fs.writeFileSync(snapshotsPath, serialized);

  const retrievedOn = options.retrievedOn ?? new Date().toISOString().slice(0, 10);
  header.ephemerisSource = {
    ...header.ephemerisSource,
    retrievedOn
  };
  fs.writeFileSync(headerPath, `${JSON.stringify(header, null, 2)}\n`);

  console.log(`Wrote ${path.relative(cwd, snapshotsPath)} (${rows.length} rows)`);
  console.log(`Updated ${path.relative(cwd, headerPath)} ephemerisSource.retrievedOn=${retrievedOn}`);
  console.log("Next: run `npm run data:ephemeris:rebuild` then `npm run data:ephemeris:verify`.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
