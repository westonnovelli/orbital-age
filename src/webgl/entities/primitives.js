import { createProgram } from "../program.js";

const VERTEX_SHADER = `
attribute vec2 aPosition;
uniform mat3 uMatrix;
uniform float uPointSize;
void main() {
  vec3 transformed = uMatrix * vec3(aPosition, 1.0);
  gl_Position = vec4(transformed.xy, 0.0, 1.0);
  gl_PointSize = uPointSize;
}
`;

const FRAGMENT_SHADER = `
precision mediump float;
uniform vec4 uColor;
void main() {
  gl_FragColor = uColor;
}
`;

export function createPrimitiveProgram(gl) {
  const program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
  return {
    program,
    attributes: {
      position: gl.getAttribLocation(program, "aPosition")
    },
    uniforms: {
      matrix: gl.getUniformLocation(program, "uMatrix"),
      color: gl.getUniformLocation(program, "uColor"),
      pointSize: gl.getUniformLocation(program, "uPointSize")
    }
  };
}
