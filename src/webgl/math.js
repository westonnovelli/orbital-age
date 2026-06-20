// Build a column-major 3x3 orthographic projection that maps the rectangle
// [left, right] x [bottom, top] to NDC [-1, 1]. An optional (centerX, centerY)
// translation shifts the framed world point that lands at the center of the
// view — used by "Zoom to Earth" tracking so the camera can follow a moving
// body. With centerX/centerY = 0 (the default) the behavior is unchanged: the
// world origin maps to NDC center.
export function createOrtho2D(left, right, bottom, top, centerX = 0, centerY = 0) {
  const lr = 1 / (right - left);
  const bt = 1 / (top - bottom);

  return new Float32Array([
    2 * lr,
    0,
    0,
    0,
    2 * bt,
    0,
    -(right + left) * lr - 2 * centerX * lr,
    -(top + bottom) * bt - 2 * centerY * bt,
    1
  ]);
}
