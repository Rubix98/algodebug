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
        const name = sceneObject.variable.name;
        const type = sceneObject.type;
        let variable = this.frame.variables[name];
        return variable ? parse(variable, type) : undefined;
    }

    getPosition(name, defaultPosition = { x: 0, y: 0 }) {
        return this.sceneObject.position?.[name] ?? defaultPosition;
    }

    getLayer() {
        return this.layers[this.layerPosition];
    }

    rescalePoints(points) {
        let minX = Math.min.apply(null, points.map(function(point) { return point.x; }));
        let maxX = Math.max.apply(null, points.map(function(point) { return point.x; }));
        let minY = Math.min.apply(null, points.map(function(point) { return point.y; }));
        let maxY = Math.max.apply(null, points.map(function(point) { return point.y; }));

        let scaleX = 1;
        let scaleY = 1;
        let centerX = minX += (maxX - minX) / 2
        let centerY = minY += (maxY - minY) / 2

        if (maxX - minX != 0)
            scaleX = 240 / (maxX - minX);

        if (maxY - minY != 0)
            scaleY = 240 / (maxY - minY);
            
        for (let point of points) {
            point.x = (point.x - centerX) * scaleX;
            point.y = (point.y - centerY) * scaleY;
        }
    }

}