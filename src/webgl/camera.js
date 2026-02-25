import { createOrtho2D } from "./math.js";

export class OrthoCamera2D {
  constructor({ halfHeight = 1.6 } = {}) {
    this.halfHeight = halfHeight;
    this.viewportWidth = 1;
    this.viewportHeight = 1;
    this.matrix = createOrtho2D(-halfHeight, halfHeight, -halfHeight, halfHeight);
  }

  setViewport(width, height) {
    const safeWidth = Math.max(1, width);
    const safeHeight = Math.max(1, height);
    const aspect = safeWidth / safeHeight;
    const halfWidth = this.halfHeight * aspect;

    this.viewportWidth = safeWidth;
    this.viewportHeight = safeHeight;
    this.matrix = createOrtho2D(-halfWidth, halfWidth, -this.halfHeight, this.halfHeight);
  }
}
