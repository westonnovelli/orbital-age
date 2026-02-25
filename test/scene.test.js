import test from "node:test";
import assert from "node:assert/strict";
import { Scene } from "../src/webgl/scene.js";

test("scene initializes, renders, and disposes nodes in order", () => {
  const calls = [];
  const nodeA = {
    init: () => calls.push("a:init"),
    render: () => calls.push("a:render"),
    dispose: () => calls.push("a:dispose")
  };
  const nodeB = {
    init: () => calls.push("b:init"),
    render: () => calls.push("b:render"),
    dispose: () => calls.push("b:dispose")
  };

  const scene = new Scene();
  scene.add(nodeA).add(nodeB);

  scene.init({});
  scene.render({});
  scene.dispose({});

  assert.deepEqual(calls, ["a:init", "b:init", "a:render", "b:render", "a:dispose", "b:dispose"]);
});
