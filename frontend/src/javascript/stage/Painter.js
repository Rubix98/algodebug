import Konva from "konva";
import { parse } from "../utils/parsingUtils";
export class Painter {
    constructor(properties) {
        Object.assign(this, properties);
        this.mainGroup = new Konva.Group({
            id: "mainGroup",
            ...this.getPosition("group"),
            draggable: true,
        });
        this.mainGroup.on("dragmove", (event) => this.handleGroupMove(event));
    }

    draw() {
        this.model = this.getVariable(this.sceneObject);
        if (!this.model) return;

        this.drawModel(this.model);

        for (let subobject of this.sceneObject.subobjects) {
            let variable = this.getVariable(subobject);
            if (!variable) continue;
            this.subobjectFunctionMap[subobject.type].call(this, variable, subobject);
        }

        this.getLayer().add(this.mainGroup);
    }

    handleGroupMove(event) {
        if (event.target.id() !== "mainGroup") return;

        const groupNode = event.target;
        this.handlePositionChange("group", {
            x: groupNode.x(),
            y: groupNode.y(),
        });
    }

    handlePositionChange(key, point) {
        let newPosition = this.sceneObject.position ?? {};
        newPosition[key] = point;

        this.updateSceneObjectPosition({
            id: this.sceneObject.id,
            position: newPosition,
        });
    }

    getVariable(sceneObject) {
        const id = sceneObject.variable.id;
        const type = sceneObject.type;
        let variable = this.frame.variables[id];
        return variable ? parse(variable, type) : undefined;
    }

    getPosition(name, defaultPosition = { x: 0, y: 0 }) {
        return this.sceneObject.position?.[name] ?? defaultPosition;
    }

    getLayer() {
        return this.layers[this.layerPosition];
    }
}
