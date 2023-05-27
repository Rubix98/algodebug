import Konva from "konva";
import { Painter } from "../Painter";
import { rescalePoints } from "../../utils/geometryUtils";
export class ChartPainter extends Painter {
    layerPosition = "center";
    boxSize = 400;
    indicatorWidth = 7;
    drawModel(points) {
        this.drawAxis(points);
        rescalePoints(points);
        let previousPoint = points[0];
        for (let i = 1; i < points.length; i++) {
            this.mainGroup.add(
                new Konva.Line({
                    points: [
                        previousPoint.x - this.boxSize / 2,
                        -previousPoint.y,
                        points[i].x - this.boxSize / 2,
                        -points[i].y,
                    ],
                    stroke: this.color,
                    strokeWidth: 1,
                    tension: 1,
                })
            );
            previousPoint = points[i];
        }
    }

    drawAxis(points) {
        let maxX = points.map((point) => point.x).getMaxValue();
        let maxY = points.map((point) => point.y).getMaxValue();
        this.mainGroup.add(
            new Konva.Arrow({
                points: [-this.boxSize, this.boxSize / 2, -this.boxSize, -this.boxSize / 2 - 50],
                stroke: this.color,
                strokeWidth: 2,
                tension: 1,
            })
        );
        this.mainGroup.add(
            new Konva.Arrow({
                points: [-this.boxSize, this.boxSize / 2, 50, this.boxSize / 2],
                stroke: this.color,
                strokeWidth: 2,
                tension: 1,
            })
        );
        this.drawAxisIndicators(maxX, maxY);
    }

    drawAxisIndicators(maxX, maxY) {
        let unitY = 1;
        let unitX = 1;
        while (maxX / unitX > 10) {
            unitX *= 10;
        }
        while (maxY / unitY > 10) {
            unitY *= 10;
        }
        let segmentsOfYAxis = maxY / unitY;
        let segmentsOfXAxis = maxX / unitX;
        for (let i = 0; i < segmentsOfYAxis; i++) {
            const pointGroup = new Konva.Group();
            this.mainGroup.add(
                new Konva.Line({
                    points: [
                        -this.boxSize - this.indicatorWidth,
                        -this.boxSize / 2 + i * (this.boxSize / segmentsOfYAxis),
                        -this.boxSize + this.indicatorWidth,
                        -this.boxSize / 2 + i * (this.boxSize / segmentsOfYAxis),
                    ],
                    stroke: this.color,
                    strokeWidth: 1,
                    tension: 1,
                })
            );
            this.mainGroup.add(
                new Konva.Text({
                    text: String(Math.round(unitY * (segmentsOfYAxis - i))),
                    x: -this.boxSize - 4 * this.indicatorWidth,
                    y: -this.boxSize / 2 + i * (this.boxSize / segmentsOfYAxis) - this.indicatorWidth,
                    fill: this.color,
                })
            );
        }
        for (let i = 1; i <= segmentsOfXAxis; i++) {
            this.mainGroup.add(
                new Konva.Line({
                    points: [
                        -this.boxSize + i * (this.boxSize / segmentsOfXAxis),
                        this.boxSize / 2 - this.indicatorWidth,
                        -this.boxSize + i * (this.boxSize / segmentsOfXAxis),
                        this.boxSize / 2 + this.indicatorWidth,
                    ],
                    stroke: this.color,
                    strokeWidth: 1,
                    tension: 1,
                })
            );
            this.mainGroup.add(
                new Konva.Text({
                    text: String(Math.round(unitX * i)),
                    x: -this.boxSize + i * (this.boxSize / segmentsOfXAxis) - this.indicatorWidth,
                    y: this.boxSize / 2 + 2 * this.indicatorWidth,
                    fill: this.color,
                })
            );
        }
    }
}
