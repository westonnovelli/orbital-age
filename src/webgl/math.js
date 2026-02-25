export function createOrtho2D(left, right, bottom, top) {
  const lr = 1 / (right - left);
  const bt = 1 / (top - bottom);

  return new Float32Array([
    2 * lr,
    0,
    0,
    0,
    2 * bt,
    0,
    -(right + left) * lr,
    -(top + bottom) * bt,
    1
  ]);
}
