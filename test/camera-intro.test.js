import test from "node:test";
import assert from "node:assert/strict";
import { OrthoCamera2D } from "../src/webgl/camera.js";
import { CameraIntroTweenEntity } from "../src/webgl/entities/camera-intro.js";

const FROM = 1; // zoomed-in (inner planets) framing
const TO = 12; // zoomed-out (auto-fit) framing

function makeCamera() {
  return new OrthoCamera2D({ halfHeight: TO, minHalfHeight: FROM, maxHalfHeight: TO });
}

test("intro tween snaps the camera to the start framing on construction", () => {
  const camera = makeCamera();
  new CameraIntroTweenEntity({
    camera,
    fromHalfHeight: FROM,
    toHalfHeight: TO,
    durationSeconds: 4
  });

  assert.equal(camera.halfHeight, FROM, "camera opens framed on the start (inner) view");
});

test("intro tween zooms out monotonically and settles exactly on the end framing", () => {
  const camera = makeCamera();
  let completed = false;
  const tween = new CameraIntroTweenEntity({
    camera,
    fromHalfHeight: FROM,
    toHalfHeight: TO,
    durationSeconds: 1,
    onComplete: () => {
      completed = true;
    }
  });

  let previous = camera.halfHeight;
  for (let i = 0; i < 9; i++) {
    tween.render({ deltaSeconds: 0.1 });
    assert.ok(camera.halfHeight >= previous, "zoom is non-decreasing (zooming out)");
    assert.ok(camera.halfHeight <= TO, "never overshoots the end framing");
    previous = camera.halfHeight;
  }
  assert.equal(completed, false, "not complete before the full duration elapses");

  // Cross the duration boundary: lands exactly on the destination and completes.
  tween.render({ deltaSeconds: 0.2 });
  assert.equal(camera.halfHeight, TO, "settles exactly on the end framing");
  assert.equal(completed, true, "onComplete fires once the tween finishes");
});

test("intro tween fires onComplete only once and stops mutating after", () => {
  const camera = makeCamera();
  let completes = 0;
  const tween = new CameraIntroTweenEntity({
    camera,
    fromHalfHeight: FROM,
    toHalfHeight: TO,
    durationSeconds: 1,
    onComplete: () => {
      completes++;
    }
  });

  tween.render({ deltaSeconds: 2 });
  assert.equal(completes, 1);

  camera.setZoom(FROM); // simulate a later manual zoom
  tween.render({ deltaSeconds: 1 });
  assert.equal(camera.halfHeight, FROM, "a finished tween no longer drives the camera");
  assert.equal(completes, 1, "onComplete does not fire again");
});

test("cancel stops the tween without settling or calling onComplete", () => {
  const camera = makeCamera();
  let completed = false;
  const tween = new CameraIntroTweenEntity({
    camera,
    fromHalfHeight: FROM,
    toHalfHeight: TO,
    durationSeconds: 4,
    onComplete: () => {
      completed = true;
    }
  });

  tween.render({ deltaSeconds: 0.5 });
  const midpoint = camera.halfHeight;
  assert.ok(midpoint > FROM && midpoint < TO, "mid-flythrough before cancel");

  tween.cancel();
  tween.render({ deltaSeconds: 4 });
  assert.equal(camera.halfHeight, midpoint, "camera left where it was when cancelled");
  assert.equal(completed, false, "cancel does not settle into the end framing");
});

test("zero-duration tween settles immediately on first render", () => {
  const camera = makeCamera();
  let completed = false;
  const tween = new CameraIntroTweenEntity({
    camera,
    fromHalfHeight: FROM,
    toHalfHeight: TO,
    durationSeconds: 0,
    onComplete: () => {
      completed = true;
    }
  });

  assert.equal(camera.halfHeight, FROM, "still opens on the start framing");
  tween.render({ deltaSeconds: 0.016 });
  assert.equal(camera.halfHeight, TO);
  assert.equal(completed, true);
});
