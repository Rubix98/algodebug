import { CirclePainter } from "./painters/CirclePainter";
import { GraphPainter } from "./painters/GraphPainter";
import { PointsPainter } from "./painters/PointsPainter";
import { ShapePainter } from "./painters/ShapePainter";
import { ArrayPainter } from "./painters/ArrayPainter";
import { VariablePainter } from "./painters/VariablePainter";
import { ChartPainter } from "./painters/ChartPainter";

export function PainterFactory(key, properties) {
    if (key === "graph") return new GraphPainter(properties);
    if (key === "points") return new PointsPainter(properties);
    if (key === "circle") return new CirclePainter(properties);
    if (key === "shape") return new ShapePainter(properties);
    if (key === "array") return new ArrayPainter(properties);
    if (key === "variable") return new VariablePainter(properties);
    if (key === "chart") return new ChartPainter(properties);
}
