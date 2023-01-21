import Konva from "konva";
import { Painter } from "../Painter";

export class VariablePainter extends Painter {
    layerPosition = "topLeft";

    style = {
        fontSize: 30,
    };

    drawModel(variable) {
        let variableNumber = this.getLayer().find(".variable").length;

        const variableText = new Konva.Text({
            name: "variable",
            text: this.sceneObject.variable.name + ": " + variable,
            fontSize: this.style.fontSize,
            fill: this.color,
            y: variableNumber * this.style.fontSize,
            fill: this.themeColor,
        });
        this.mainGroup.add(variableText);
    }
}
