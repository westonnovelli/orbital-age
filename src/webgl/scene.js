export class Scene {
  constructor() {
    this.nodes = [];
    this.isInitialized = false;
    this.gl = null;
  }

  add(node) {
    this.nodes.push(node);
    if (this.isInitialized && this.gl) {
      node.init?.(this.gl);
    }
    return this;
  }

  init(gl) {
    if (this.isInitialized) {
      return;
    }

    this.gl = gl;
    for (const node of this.nodes) {
      node.init?.(gl);
    }
    this.isInitialized = true;
  }

  render(context) {
    for (const node of this.nodes) {
      node.render?.(context);
    }
  }

  dispose(gl) {
    for (const node of this.nodes) {
      node.dispose?.(gl);
    }
    this.isInitialized = false;
    this.gl = null;
  }
}
