import Konva from "konva";
import { Painter } from "../Painter";

export class ShapePainter extends Painter {
  layerPosition = "center";

  drawModel(shape) {
    let previousPoint = shape.at(-1);
    for (let point of shape) {
      this.mainGroup.add(new Konva.Line({
        points: [point.x, -point.y, previousPoint.x, -previousPoint.y],
        stroke: 'black',
        strokeWidth: 1,
      }));
      previousPoint = point;
    }
  }
}