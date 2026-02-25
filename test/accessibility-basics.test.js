import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");

function collectAttributeValues(markup, attrName) {
  const values = [];
  const regex = new RegExp(`${attrName}="([^"]+)"`, "g");
  let match = regex.exec(markup);
  while (match) {
    values.push(match[1]);
    match = regex.exec(markup);
  }
  return values;
}

test("index.html has unique IDs to preserve label/control accessibility mappings", () => {
  const ids = collectAttributeValues(html, "id");
  const counts = new Map();
  for (const id of ids) {
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }

  const duplicates = [...counts.entries()].filter(([, count]) => count > 1).map(([id]) => id);
  assert.deepEqual(duplicates, []);
});

test("birthday form and timeline controls expose basic accessible semantics", () => {
  assert.match(html, /<label for="birthday">Birthday<\/label>/);
  assert.match(html, /<input id="birthday"[^>]*type="date"[^>]*required[^>]*min="1900-01-01"[^>]*max="2100-12-31"/);
  assert.match(html, /<fieldset id="timeline-controls" class="timeline" disabled>/);
  assert.match(html, /<legend>Timeline controls<\/legend>/);
  assert.match(html, /id="play-pause"[^>]*aria-label="Play timeline"/);
  assert.match(html, /id="timeline-status" class="message message--info" aria-live="polite"/);
  assert.match(html, /id="webgl-message" class="message message--hidden" aria-live="polite"/);
  assert.match(html, /<canvas id="orbit-canvas" aria-label="Orbital map"><\/canvas>/);
});
