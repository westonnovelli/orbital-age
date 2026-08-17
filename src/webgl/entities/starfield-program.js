import { createProgram } from "../program.js";

const VERTEX_SHADER = `
attribute vec2 aClipPosition;
void main() {
  gl_Position = vec4(aClipPosition, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision mediump float;
uniform vec2 uViewport;
uniform float uSeed;
uniform float uCount;
uniform vec4 uBaseColor;

float hash(vec2 value) {
  return fract(sin(dot(value, vec2(12.9898, 78.233)) + uSeed * 0.61803398875) * 43758.5453);
}

void main() {
  float cellSize = sqrt(max(1.0, (uViewport.x * uViewport.y) / max(1.0, uCount)));
  vec2 cell = floor(gl_FragCoord.xy / cellSize);
  vec2 cellUv = fract(gl_FragCoord.xy / cellSize);
  vec2 starUv = vec2(hash(cell), hash(cell + vec2(37.0, 17.0)));
  float radius = mix(0.65, 1.5, hash(cell + vec2(11.0, 53.0)));
  float brightness = mix(0.35, 1.0, hash(cell + vec2(73.0, 29.0)));
  float distanceToStar = length((cellUv - starUv) * cellSize);
  float alpha = 1.0 - smoothstep(radius - 0.7, radius, distanceToStar);
  gl_FragColor = vec4(uBaseColor.rgb, uBaseColor.a * brightness * alpha);
}
`;

export function createStarfieldProgram(gl) {
  const program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
  return {
    program,
    attributes: {
      clipPosition: gl.getAttribLocation(program, "aClipPosition")
    },
    uniforms: {
      viewport: gl.getUniformLocation(program, "uViewport"),
      seed: gl.getUniformLocation(program, "uSeed"),
      count: gl.getUniformLocation(program, "uCount"),
      baseColor: gl.getUniformLocation(program, "uBaseColor")
    }
  };
}
