import { OrthoCamera2D } from "./camera.js";

export class WebGLRenderer {
  constructor(canvas, { clearColor = [0.02, 0.03, 0.06, 1], camera = new OrthoCamera2D() } = {}) {
    this.canvas = canvas;
    this.clearColor = clearColor;
    this.camera = camera;
    this.gl = null;
    this.scene = null;
    this.running = false;
    this.frameRequest = 0;
    this.lastFrameTime = 0;
    this.resizeObserver = null;
    this.devicePixelRatio = 1;
  }

  initialize() {
    this.gl = this.canvas.getContext("webgl", {
      antialias: true,
      alpha: false,
      powerPreference: "high-performance"
    });

    if (!this.gl) {
      return false;
    }

    this.devicePixelRatio = Math.max(1, window.devicePixelRatio || 1);
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    this.#resize();
    this.#observeResize();
    return true;
  }

  setScene(scene) {
    if (!this.gl) {
      throw new Error("Renderer must be initialized before setting a scene.");
    }

    if (this.scene) {
      this.scene.dispose(this.gl);
    }

    this.scene = scene;
    this.scene.init(this.gl);
  }

  start() {
    if (!this.gl || this.running) {
      return;
    }
    this.running = true;
    this.lastFrameTime = performance.now();
    this.frameRequest = requestAnimationFrame((time) => this.#frame(time));
  }

  stop() {
    this.running = false;
    if (this.frameRequest) {
      cancelAnimationFrame(this.frameRequest);
      this.frameRequest = 0;
    }
  }

  dispose() {
    this.stop();
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    if (this.scene && this.gl) {
      this.scene.dispose(this.gl);
      this.scene = null;
    }
    this.gl = null;
  }

  #frame(timeMs) {
    if (!this.running || !this.gl) {
      return;
    }

    const deltaSeconds = Math.min(0.25, (timeMs - this.lastFrameTime) / 1000);
    this.lastFrameTime = timeMs;
    this.#draw(timeMs / 1000, deltaSeconds);
    this.frameRequest = requestAnimationFrame((next) => this.#frame(next));
  }

  #draw(timeSeconds, deltaSeconds) {
    if (!this.gl || !this.scene) {
      return;
    }

    const gl = this.gl;
    gl.clearColor(...this.clearColor);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    this.scene.render({
      gl,
      camera: this.camera,
      nowSeconds: timeSeconds,
      deltaSeconds
    });
  }

  #observeResize() {
    this.resizeObserver = new ResizeObserver(() => this.#resize());
    this.resizeObserver.observe(this.canvas);
    if (this.canvas.parentElement) {
      this.resizeObserver.observe(this.canvas.parentElement);
    }
  }

  #resize() {
    if (!this.gl) {
      return;
    }

    const rect = this.canvas.getBoundingClientRect();
    const displayWidth = Math.max(1, Math.floor(rect.width * this.devicePixelRatio));
    const displayHeight = Math.max(1, Math.floor(rect.height * this.devicePixelRatio));

    if (this.canvas.width !== displayWidth || this.canvas.height !== displayHeight) {
      this.canvas.width = displayWidth;
      this.canvas.height = displayHeight;
    }

    this.gl.viewport(0, 0, displayWidth, displayHeight);
    this.camera.setViewport(displayWidth, displayHeight);
  }
}
