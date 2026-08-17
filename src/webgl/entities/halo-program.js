import { createProgram } from "../program.js";

const VERTEX_SHADER = `
attribute vec2 aPosition;
attribute float aEdgeAlpha;
uniform mat3 uMatrix;
varying float vEdgeAlpha;
void main() {
  vec3 transformed = uMatrix * vec3(aPosition, 1.0);
  gl_Position = vec4(transformed.xy, 0.0, 1.0);
  vEdgeAlpha = aEdgeAlpha;
}
`;

const FRAGMENT_SHADER = `
precision mediump float;
uniform vec4 uColor;
varying float vEdgeAlpha;
void main() {
  gl_FragColor = vec4(uColor.rgb, uColor.a * vEdgeAlpha);
}
`;

export function createHaloProgram(gl) {
  const program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
  return {
    program,
    attributes: {
      position: gl.getAttribLocation(program, "aPosition"),
      edgeAlpha: gl.getAttribLocation(program, "aEdgeAlpha")
    },
    uniforms: {
      matrix: gl.getUniformLocation(program, "uMatrix"),
      color: gl.getUniformLocation(program, "uColor")
    }
  };
}
