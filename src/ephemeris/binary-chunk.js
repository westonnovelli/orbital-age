const MAGIC = new Uint8Array([0x4f, 0x41, 0x47, 0x45]);
const VERSION = 2;
const HEADER_BYTES = 10;

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

function assert(condition, message) {
  if (!condition) {
    throw new Error(`Invalid ephemeris binary chunk: ${message}`);
  }
}

function concatUint8Arrays(parts) {
  const total = parts.reduce((sum, part) => sum + part.byteLength, 0);
  const result = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) {
    result.set(part, offset);
    offset += part.byteLength;
  }
  return result;
}

export function encodeBinaryChunk({ metadata, vectors }) {
  const header = textEncoder.encode(JSON.stringify({ ...metadata, version: VERSION }));
  assert(header.byteLength < 2 ** 32, "header is too large");

  const floatValues = vectors.flatMap((values) => values);
  const vectorBytes = new Uint8Array(floatValues.length * Float32Array.BYTES_PER_ELEMENT);
  new Float32Array(vectorBytes.buffer).set(floatValues);

  const prefix = new ArrayBuffer(HEADER_BYTES);
  const prefixBytes = new Uint8Array(prefix);
  prefixBytes.set(MAGIC, 0);
  const view = new DataView(prefix);
  view.setUint16(4, VERSION, true);
  view.setUint32(6, header.byteLength, true);
  return concatUint8Arrays([prefixBytes, header, vectorBytes]);
}

export function decodeBinaryChunk(input) {
  const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
  assert(bytes.byteLength >= HEADER_BYTES, "chunk is truncated");
  for (let index = 0; index < MAGIC.length; index += 1) {
    assert(bytes[index] === MAGIC[index], "magic header mismatch");
  }

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const version = view.getUint16(4, true);
  assert(version === VERSION, `unsupported version ${version}`);
  const headerLength = view.getUint32(6, true);
  const vectorStart = HEADER_BYTES + headerLength;
  assert(vectorStart <= bytes.byteLength, "header extends past chunk");
  assert((bytes.byteLength - vectorStart) % Float32Array.BYTES_PER_ELEMENT === 0, "vector payload is misaligned");

  const metadata = JSON.parse(textDecoder.decode(bytes.subarray(HEADER_BYTES, vectorStart)));
  assert(Array.isArray(metadata.bodyKeys) && metadata.bodyKeys.length > 0, "bodyKeys are required");
  const expectedValues = metadata.bodyKeys.length * metadata.samplesPerBody * 3;
  assert(expectedValues === (bytes.byteLength - vectorStart) / 4, "vector payload length mismatch");

  const vectorBytes = Uint8Array.from(bytes.subarray(vectorStart));
  const values = new Float32Array(vectorBytes.buffer, vectorBytes.byteOffset, expectedValues);
  const vectors = {};
  const valuesPerBody = metadata.samplesPerBody * 3;
  metadata.bodyKeys.forEach((key, index) => {
    vectors[key] = values.slice(index * valuesPerBody, (index + 1) * valuesPerBody);
  });

  return { ...metadata, vectors, format: "binary-f32-gzip", vectorEncoding: "float32-le" };
}

export const BINARY_CHUNK_VERSION = VERSION;
