import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { enabledBodies, loadCatalog } from "./catalog.mjs";
import { buildIncrementalWindow } from "./refresh-window.mjs";

const HORIZONS_API_URL = "https://ssd.jpl.nasa.gov/api/horizons.api";
const cwd = process.cwd();
const v2Dir = path.resolve(cwd, process.env.EPHEMERIS_V2_DATA_DIR ?? "data/ephemeris/v2");
const sourcePath = path.resolve(cwd, process.env.EPHEMERIS_V2_SOURCE ?? path.join(v2Dir, "source.json"));
const rawDir = path.join(v2Dir, "raw-horizons-auxiliary");
const snapshotsPath = path.join(v2Dir, "auxiliary-snapshots.ndjson");

// Horizons' one-day query lands on Apr 10 00:00, which is still roughly
// 200,000 km from Earth. Preserve the verified 23:00 terminal sample from a
// one-hour Horizons query so the packaged daily stream has a return endpoint.
const VERIFIED_TERMINAL_SAMPLES = new Map([
  [
    "artemis-ii",
    {
      epochUtc: "2026-04-10T23:00:00Z",
      epochUnixS: 1775862000,
      xAu: -0.9394815632014956,
      yAu: -0.359964939498795,
      zAu: 0.00009737640195218598
    }
  ]
]);

function parseArgs(argv) {
  const flags = new Set(argv);
  const only = process.env.EPHEMERIS_AUXILIARY_KEYS
    ? new Set(process.env.EPHEMERIS_AUXILIARY_KEYS.split(",").map((key) => key.trim()).filter(Boolean))
    : null;
  return {
    fetch: flags.has("--fetch"),
    incremental: flags.has("--incremental"),
    backfill: flags.has("--backfill"),
    replace: flags.has("--replace"),
    yes: flags.has("--yes"),
    printPlan: flags.has("--print-plan"),
    only,
    append: Boolean(only)
  };
}

async function backfillSnapshotsFromCachedRaw(auxiliary) {
  const replacementPath = `${snapshotsPath}.backfill`;
  const output = fs.createWriteStream(replacementPath, { encoding: "utf8" });
  const rawCoverageEndByKey = new Map();
  const write = async (text) => {
    if (output.write(text)) return;
    await new Promise((resolve, reject) => {
      const onDrain = () => {
        output.off("error", onError);
        resolve();
      };
      const onError = (error) => {
        output.off("drain", onDrain);
        reject(error);
      };
      output.once("drain", onDrain);
      output.once("error", onError);
    });
  };

  try {
    for (const target of auxiliary) {
      const rawPath = path.join(rawDir, `${target.key}.json`);
      if (!fs.existsSync(rawPath)) {
        throw new Error(`Missing cached raw Horizons response: ${path.relative(cwd, rawPath)}`);
      }
      const payload = JSON.parse(fs.readFileSync(rawPath, "utf8"));
      const rows = parseHorizonsCsvRows(payload.result, target);
      rawCoverageEndByKey.set(target.key, rows.at(-1).epochUnixS);
      for (const row of rows) {
        await write(`${JSON.stringify(row)}\n`);
      }
      console.log(`Backfilled ${target.key} through ${rows.at(-1).epochUtc}`);
    }

    const selectedKeys = new Set(auxiliary.map((target) => target.key));
    const input = readline.createInterface({
      input: fs.createReadStream(snapshotsPath, { encoding: "utf8" }),
      crlfDelay: Infinity
    });
    for await (const line of input) {
      if (!line.trim()) continue;
      const row = JSON.parse(line);
      const rawEnd = rawCoverageEndByKey.get(row.body);
      if (selectedKeys.has(row.body) && rawEnd !== undefined && row.epochUnixS <= rawEnd) {
        continue;
      }
      await write(`${line}\n`);
    }
    await new Promise((resolve, reject) => {
      output.once("error", reject);
      output.end(resolve);
    });
    fs.renameSync(replacementPath, snapshotsPath);
    console.log(`Merged cached historical auxiliary coverage into ${path.relative(cwd, snapshotsPath)}.`);
  } catch (error) {
    output.destroy();
    if (fs.existsSync(replacementPath)) fs.rmSync(replacementPath);
    throw error;
  }
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

function extractLatestAvailableDate(text) {
  const match = /after A\.D\.\s+(\d{4})-([A-Z]{3})-(\d{2})/i.exec(String(text));
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
  const allAuxiliary = enabledBodies(loadCatalog(cwd), "auxiliary");
  const auxiliary = options.only
    ? allAuxiliary.filter((target) => options.only.has(target.key))
    : allAuxiliary;
  if (options.only) {
    const unknown = [...options.only].filter((key) => !allAuxiliary.some((target) => target.key === key));
    if (unknown.length > 0) {
      throw new Error(`Unknown auxiliary target key(s): ${unknown.join(", ")}`);
    }
  }
  const currentEndUtc = header.window.endUtc;
  const incrementalWindow = options.incremental
    ? buildIncrementalWindow({
        currentEndUtc,
        nowUtc: process.env.EPHEMERIS_REFRESH_NOW_UTC ?? new Date().toISOString()
      })
    : null;
  const requestedStartUtc = incrementalWindow?.requestedStartUtc ?? header.window.startUtc;
  const requestedEndUtc = incrementalWindow?.requestedEndUtc ?? header.window.endUtc;
  if (options.incremental && Date.parse(currentEndUtc) >= Date.parse(requestedEndUtc)) {
    console.log(`No auxiliary refresh needed; window already ends ${header.window.endUtc}.`);
    return;
  }

  const startDate = incrementalWindow?.startDate ?? utcDateFromIso(requestedStartUtc);
  const stopDate = incrementalWindow?.stopDate ?? utcDateFromIso(requestedEndUtc);
  const requestStartDate = incrementalWindow?.requestStartDate ?? startDate;

  const planLines = [
    "Auxiliary Horizons refresh plan:",
    `- window: ${requestStartDate}..${stopDate}${options.incremental ? " (incremental)" : ""}`,
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
  if (options.backfill && options.incremental) {
    throw new Error("Use --backfill separately from --incremental.");
  }

  const unavailableIncrementalKeys = new Set();
  if (options.fetch) {
    fs.mkdirSync(rawDir, { recursive: true });
    for (const target of auxiliary) {
      let effectiveStartDate = requestStartDate;
      let effectiveStopDate = stopDate;
      let payloads = [];
      let skipIncrementalTarget = false;
      for (let recoveryAttempt = 0; recoveryAttempt < 4; recoveryAttempt += 1) {
        payloads = [];
        for (const segment of dateSegments(effectiveStartDate, effectiveStopDate)) {
          const url = buildUrl(horizonsParams({ command: target.horizonsCommand, ...segment }));
          const destination = path.join(rawDir, `${target.key}-${segment.startDate}-${segment.stopDate}.json`);
          payloads.push(await fetchRawJson(url, destination));
          console.log(`Fetched ${target.key} ${segment.startDate}..${segment.stopDate}`);
        }
        const unavailable = payloads.find((payload) => payload.result && !payload.result.includes("$$SOE"));
        const unavailableText = unavailable ? `${unavailable.result} ${unavailable.error ?? ""}` : "";
        const earliest = unavailable ? extractEarliestAvailableDate(unavailableText) : null;
        const latest = unavailable ? extractLatestAvailableDate(unavailableText) : null;
        if (!unavailable || (!earliest && !latest)) break;
        if (options.incremental) {
          if (latest && latest < effectiveStartDate) {
            console.log(`${target.key} has no auxiliary coverage after ${latest}; skipping this incremental refresh.`);
            skipIncrementalTarget = true;
            break;
          }
          if (latest && latest < effectiveStopDate) {
            console.log(`${target.key} auxiliary coverage ends at ${latest}; retrying through its last available day.`);
            effectiveStopDate = latest;
            continue;
          }
          throw new Error(`${target.key} has no complete auxiliary ephemeris in the requested incremental window.`);
        }
        if (earliest && earliest > effectiveStartDate) {
          console.log(`${target.key} unavailable before ${earliest}; retrying from the next complete UTC day.`);
          effectiveStartDate = utcDateFromIso(addUtcDays(`${earliest}T00:00:00Z`, 1));
        } else if (latest && latest < effectiveStopDate) {
          console.log(`${target.key} unavailable after ${latest}; retrying through its last available day.`);
          effectiveStopDate = latest;
        } else {
          throw new Error(`Could not find a complete Horizons date range for ${target.key}.`);
        }
      }
      if (skipIncrementalTarget) {
        unavailableIncrementalKeys.add(target.key);
        continue;
      }
      const destination = path.join(rawDir, `${target.key}.json`);
      fs.writeFileSync(destination, `${JSON.stringify(mergeHorizonsPayloads(payloads, target), null, 2)}\n`);
      console.log(
        `Merged ${target.key} ${effectiveStartDate}..${effectiveStopDate} ` +
          `(${payloads.length} segment${payloads.length === 1 ? "" : "s"})`
      );
    }
  }

  if (!options.yes && !options.fetch) {
    return;
  }

  if (options.backfill) {
    await backfillSnapshotsFromCachedRaw(auxiliary);
    return;
  }

  const rowsByTarget = new Map();
  for (const target of auxiliary) {
    if (unavailableIncrementalKeys.has(target.key)) continue;
    const rawPath = path.join(rawDir, `${target.key}.json`);
    if (!fs.existsSync(rawPath)) {
      throw new Error(`Missing raw Horizons response: ${path.relative(cwd, rawPath)}`);
    }
    const payload = JSON.parse(fs.readFileSync(rawPath, "utf8"));
    const parsedRows = parseHorizonsCsvRows(payload.result, target);
    let rows = options.incremental
      ? parsedRows.filter((row) => Date.parse(row.epochUtc) >= Date.parse(`${startDate}T00:00:00Z`))
      : parsedRows;
    const terminalSample = VERIFIED_TERMINAL_SAMPLES.get(target.key);
    if (!options.incremental && terminalSample && rows.at(-1)?.epochUtc === "2026-04-10T00:00:00Z") {
      rows = [...rows.slice(0, -1), { ...rows.at(-1), ...terminalSample }];
    }
    const firstRowUtc = rows[0]?.epochUtc;
    const lastRowUtc = rows.at(-1)?.epochUtc;
    const expectedRows = Math.round((Date.parse(lastRowUtc) - Date.parse(firstRowUtc)) / MS_PER_DAY) + 1;
    const hasVerifiedTerminalSample = Boolean(terminalSample && rows.at(-1)?.epochUtc === terminalSample.epochUtc);
    if (rows.length !== expectedRows && !hasVerifiedTerminalSample) {
      throw new Error(
        `Row count mismatch for ${target.key}: expected ${expectedRows}, got ${rows.length}`
      );
    }
    rowsByTarget.set(target.key, rows);
  }

  if (options.incremental) {
    const snapshotsFd = fs.openSync(snapshotsPath, "a");
    try {
      const newRows = auxiliary.flatMap((target) => rowsByTarget.get(target.key) ?? []);
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
  if (options.replace) {
    if (!options.only) {
      throw new Error("--replace requires EPHEMERIS_AUXILIARY_KEYS to limit the replacement scope.");
    }
    const replacementPath = `${snapshotsPath}.replace`;
    const input = readline.createInterface({
      input: fs.createReadStream(snapshotsPath, { encoding: "utf8" }),
      crlfDelay: Infinity
    });
    const output = fs.createWriteStream(replacementPath, { encoding: "utf8" });
    for await (const line of input) {
      if (!line.trim()) continue;
      const row = JSON.parse(line);
      if (!options.only.has(row.body)) output.write(`${line}\n`);
    }
    await new Promise((resolve, reject) => {
      output.once("error", reject);
      output.end(resolve);
    });
    fs.renameSync(replacementPath, snapshotsPath);
  }

  const snapshotsFd = fs.openSync(snapshotsPath, options.append || options.replace ? "a" : "w");
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
  console.log(`${options.append ? "Appended to" : "Wrote"} ${path.relative(cwd, snapshotsPath)} (${rowCount} rows)`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack : String(error));
  process.exitCode = 1;
});
