import { createProgram } from "../program.js";

const VERTEX_SHADER = `
attribute vec2 aPosition;
attribute float aSize;
attribute float aBrightness;
uniform mat3 uMatrix;
varying float vBrightness;
void main() {
  vec3 transformed = uMatrix * vec3(aPosition, 1.0);
  gl_Position = vec4(transformed.xy, 0.0, 1.0);
  gl_PointSize = aSize;
  vBrightness = aBrightness;
}
`;

const FRAGMENT_SHADER = `
precision mediump float;
varying float vBrightness;
uniform vec4 uBaseColor;
void main() {
  gl_FragColor = vec4(uBaseColor.rgb, uBaseColor.a * vBrightness);
}
`;

export function createStarfieldProgram(gl) {
  const program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
  return {
    program,
    attributes: {
      position: gl.getAttribLocation(program, "aPosition"),
      size: gl.getAttribLocation(program, "aSize"),
      brightness: gl.getAttribLocation(program, "aBrightness")
    },
    uniforms: {
      matrix: gl.getUniformLocation(program, "uMatrix"),
      baseColor: gl.getUniformLocation(program, "uBaseColor")
    }
  };
}
