export function calculateVelocity(
  x: number,
  y: number,
  x1: number,
  y1: number
) {
  const angle = Math.atan2(y1 - y, x1 - x);
  const velocity = {
    x: Math.cos(angle),
    y: Math.sin(angle),
  };

  return velocity;
}
