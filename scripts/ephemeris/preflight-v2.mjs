import fs from "node:fs";
import path from "node:path";

const cwd = process.cwd();
const v2Dir = path.resolve(cwd, process.env.EPHEMERIS_V2_DATA_DIR ?? "data/ephemeris/v2");
const manifest = JSON.parse(fs.readFileSync(path.join(v2Dir, "manifest.json"), "utf8"));
const maxBytes = Number(process.env.EPHEMERIS_MAX_DEPLOY_ASSET_BYTES ?? 100 * 1024 * 1024);

const largest = [...manifest.chunks].sort((a, b) => b.byteLength - a.byteLength)[0];
const totalBytes = manifest.chunks.reduce((sum, chunk) => sum + chunk.byteLength, 0);
const missing = manifest.chunks.filter((chunk) => {
  const relative = chunk.url.replace("../../data/ephemeris/v2/", "");
  return !fs.existsSync(path.join(v2Dir, relative));
});

console.log(`Ephemeris preflight: ${manifest.chunks.length} chunks, ${(totalBytes / 1024 / 1024).toFixed(1)} MiB compressed`);
console.log(`- window: ${manifest.window.startUtc}..${manifest.window.endUtc}`);
console.log(`- largest chunk: ${largest?.id ?? "none"} (${largest?.byteLength ?? 0} bytes)`);

if (missing.length > 0) {
  throw new Error(`Manifest references ${missing.length} missing chunk files.`);
}
if (largest && largest.byteLength > maxBytes) {
  throw new Error(`Chunk ${largest.id} exceeds deploy asset limit of ${maxBytes} bytes.`);
}
