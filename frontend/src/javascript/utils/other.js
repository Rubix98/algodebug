export function calculateDefaultVertexPosition(i, n, R) {
  const alpha = i/n * 2*Math.PI;
  return {
    x: R * Math.cos(alpha),
    y: R * Math.sin(alpha),
  }
}