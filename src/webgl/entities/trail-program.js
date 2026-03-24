import { createProgram } from "../program.js";

const VERTEX_SHADER = `
attribute vec2 aPosition;
attribute float aFade;
uniform mat3 uProjection;
uniform float uScale;
varying float vFade;
void main() {
  vec3 transformed = uProjection * vec3(aPosition, 1.0);
  gl_Position = vec4(transformed.xy, 0.0, 1.0);
  vFade = aFade;
}
`;

const FRAGMENT_SHADER = `
precision mediump float;
varying float vFade;
uniform vec4 uColor;
void main() {
  gl_FragColor = vec4(uColor.rgb, uColor.a * vFade);
}
`;

export function createTrailProgram(gl) {
  const program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
  return {
    program,
    attributes: {
      position: gl.getAttribLocation(program, "aPosition"),
      fade: gl.getAttribLocation(program, "aFade")
    },
    uniforms: {
      projection: gl.getUniformLocation(program, "uProjection"),
      scale: gl.getUniformLocation(program, "uScale"),
      color: gl.getUniformLocation(program, "uColor")
    }
  };
}
