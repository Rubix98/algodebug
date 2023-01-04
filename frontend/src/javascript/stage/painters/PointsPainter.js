import Konva from "konva";
import { Painter } from "../Painter";

export class PointsPainter extends Painter {
    subobjectFunctionMap = {
        points_point: this.highlightPoints,
        points_stretch: this.highlightLines,
        points_path: this.highlightPath,
    };
    layerPosition = "center";

    style = {
        pointRadius: 5,
        fontSize: 15,
    };

    drawModel(points) {
        points.forEach((point, index) => {
            const pointGroup = new Konva.Group({
                point: point,
                id: `point-${index}`,
                name: "point",
                x: point.x,
                y: -point.y,
            });
            this.mainGroup.add(pointGroup);

            const pointCircle = new Konva.Circle({
                id: `point-circle-${index}`,
                name: "point-circle",
                radius: this.style.pointRadius,
                fill: this.color,
            });
            pointGroup.add(pointCircle);

            const pointText = new Konva.Text({
                id: `point-text-${index}`,
                name: "point-text",
                text: String(index),
                x: this.style.pointRadius,
                y: this.style.pointRadius,
                fill: this.color,
                fontSize: this.style.fontSize,
            });
            pointGroup.add(pointText);
        });
    }

    highlightPoints(points, subobject) {
        for (let pointIndex of points) {
            const pointCircleNode = this.mainGroup.find(`#point-circle-${pointIndex}`)[0];
            if (pointCircleNode) {
                pointCircleNode.fill(subobject.color);
                pointCircleNode.radius(7);
            }
        }
    }

    highlightLines(lines, subobject) {
        for (let line of lines) {
            let a = line[0];
            let b = line[1];
            let pointANode = this.mainGroup.find(`#point-${a}`)[0];
            let pointBNode = this.mainGroup.find(`#point-${b}`)[0];

            if (pointANode && pointBNode) {
                const pointsLine = new Konva.Line({
                    stroke: subobject.color,
                    strokeWidth: 3,
                    points: [pointANode.x(), pointANode.y(), pointBNode.x(), pointBNode.y()],
                });
                this.mainGroup.add(pointsLine);
                pointsLine.moveToBottom();
            }
        }
    }

    highlightPath(path, subobject) {
        let points = [];
        let lines = [];

        let previousPointIndex;
        for (let pointIndex of path) {
            points.push(pointIndex);
            if (previousPointIndex) {
                lines.push([previousPointIndex, pointIndex]);
            }
            previousPointIndex = pointIndex;
        }

        this.highlightPoints(points, subobject);
        this.highlightLines(lines, subobject);
    }
}
