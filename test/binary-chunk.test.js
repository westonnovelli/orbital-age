import test from "node:test";
import assert from "node:assert/strict";
import zlib from "node:zlib";
import { decodeBinaryChunk, encodeBinaryChunk } from "../src/ephemeris/binary-chunk.js";

test("binary ephemeris chunks preserve Float32 vectors through gzip", () => {
  const metadata = {
    chunkId: "primary-primary-historical-1766-1800",
    stream: "primary",
    group: "primary",
    startUtc: "1766-07-23T00:00:00Z",
    endUtc: "1766-07-24T00:00:00Z",
    stepSeconds: 86400,
    samplesPerBody: 2,
    frame: "ECLIPJ2000",
    origin: "SSB",
    bodyKeys: ["earth", "mars"]
  };
  const vectors = [
    [1, 2, 3, 4, 5, 6],
    [-1, -2, -3, -4, -5, -6]
  ];

  const encoded = encodeBinaryChunk({ metadata, vectors });
  const decoded = decodeBinaryChunk(zlib.gunzipSync(zlib.gzipSync(encoded)));

  assert.equal(decoded.chunkId, metadata.chunkId);
  assert.deepEqual([...decoded.vectors.earth], vectors[0]);
  assert.deepEqual([...decoded.vectors.mars], vectors[1]);
});
