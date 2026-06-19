import { createProgram } from "../program.js";

const VERTEX_SHADER = `
attribute vec2 aPosition;
attribute float aFade;
attribute float aAge;
uniform mat3 uProjection;
uniform float uScale;
varying float vFade;
varying float vAge;
void main() {
  vec3 transformed = uProjection * vec3(aPosition, 1.0);
  gl_Position = vec4(transformed.xy, 0.0, 1.0);
  vFade = aFade;
  vAge = aAge;
}
`;

const FRAGMENT_SHADER = `
precision mediump float;
varying float vFade;
varying float vAge;
uniform vec4 uColor;
uniform vec3 uColorOld;
uniform vec3 uColorRecent;
void main() {
  gl_FragColor = vec4(mix(uColorOld, uColorRecent, vAge), uColor.a * vFade);
}
`;

export function createTrailProgram(gl) {
  const program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
  return {
    program,
    attributes: {
      position: gl.getAttribLocation(program, "aPosition"),
      fade: gl.getAttribLocation(program, "aFade"),
      age: gl.getAttribLocation(program, "aAge")
    },
    uniforms: {
      projection: gl.getUniformLocation(program, "uProjection"),
      scale: gl.getUniformLocation(program, "uScale"),
      color: gl.getUniformLocation(program, "uColor"),
      colorOld: gl.getUniformLocation(program, "uColorOld"),
      colorRecent: gl.getUniformLocation(program, "uColorRecent")
    }
  };
}
