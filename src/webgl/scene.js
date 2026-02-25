export class Scene {
  constructor() {
    this.nodes = [];
    this.isInitialized = false;
  }

  add(node) {
    this.nodes.push(node);
    return this;
  }

  init(gl) {
    if (this.isInitialized) {
      return;
    }

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
  }
}
