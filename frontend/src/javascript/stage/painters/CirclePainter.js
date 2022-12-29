import Konva from "konva";
import { Painter } from "../Painter";

export class CirclePainter extends Painter {
    layerPosition = "center";

    drawModel(circles) {
        for (let circle of circles) {
            this.mainGroup.add(
                new Konva.Circle({
                    x: circle.x,
                    y: -circle.y,
                    radius: circle.r,
                    stroke: this.color,
                    strokeWidth: 1,
                })
            );
        }
    }
}
