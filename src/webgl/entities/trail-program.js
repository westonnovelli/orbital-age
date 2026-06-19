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
uniform float uHueStart;
uniform float uHueSpan;
uniform float uSaturation;

// Standard HSV->RGB (Sam Hocevar). Hue/sat/value in [0,1].
vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
  // When uHueSpan == 0 the trail is a solid uColor.rgb (default). When it is
  // > 0 the hue sweeps that many full turns of the color wheel across the
  // trail's age (oldest -> most recent), so successive eras land on different
  // hues and dense overlap reads as a moving spectrum rather than washing to
  // white under additive blending.
  vec3 rgb = uColor.rgb;
  if (uHueSpan > 0.0) {
    float hue = fract(uHueStart + vAge * uHueSpan);
    rgb = hsv2rgb(vec3(hue, uSaturation, 1.0));
  }
  gl_FragColor = vec4(rgb, uColor.a * vFade);
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
      hueStart: gl.getUniformLocation(program, "uHueStart"),
      hueSpan: gl.getUniformLocation(program, "uHueSpan"),
      saturation: gl.getUniformLocation(program, "uSaturation")
    }
  };
}
