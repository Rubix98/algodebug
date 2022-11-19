import { CirclePainter } from "./CirclePainter";
import { GraphPainter } from "./GraphPainter";
import { PointsPainter } from "./PointsPainter";
import { ShapePainter } from "./ShapePainter";
import { ArrayPainter } from "./ArrayPainter";
import { VariablePainter } from "./VariablePainter";

export function PainterFactory(key, properties) {
  if (key === 'graph') return new GraphPainter(properties);
  if (key === 'points') return new PointsPainter(properties);
  if (key === 'circle') return new CirclePainter(properties);
  if (key === 'shape') return new ShapePainter(properties);
  if (key === 'array') return new ArrayPainter(properties);
  if (key === 'variable') return new VariablePainter(properties);
}