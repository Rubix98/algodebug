import { PainterFactory } from "./PainterFactory";
import Konva from "konva";

export class Stage {
    constructor(containerId) {
        this.containerId = containerId;
        this.createStage();
        this.createLayers();
        this.addHandlers();
    }

    createStage() {
        this.stage = new Konva.Stage({
            container: this.containerId,
            ...this.getCanvasSize(),
            draggable: true,
        });
    }

    createLayers() {
        this.layers = {
            center: new Konva.Layer({
                ...this.getCenterPoint(),
            }),
            topLeft: new Konva.Layer(),
        };

        for (let layer of Object.values(this.layers)) {
            this.stage.add(layer);
        }
    }

    addHandlers() {
        this.stage.on("dragmove", (event) => this.handleMoveStage(event));
        this.stage.on("wheel", (event) => this.handleScrollStage(event));
        window.addEventListener("resize", () => this.handleResizeWindow());
    }

    draw(sceneObjects, frame, updateSceneObjectPosition) {
        this.clearStage();

        for (let sceneObject of sceneObjects) {
            let painter = PainterFactory(sceneObject.type.key, {
                sceneObject: sceneObject,
                frame: frame,
                stageSize: this.getCanvasSize(),
                updateSceneObjectPosition: updateSceneObjectPosition,
                layers: this.layers,
            });

            painter.draw();
        }

        this.handleResizeWindow();
    }

    handleMoveStage() {
        this.layers.topLeft.x(-this.stage.x());
        this.layers.topLeft.y(-this.stage.y());
    }

    handleScrollStage(event) {
        const ratio = 1.1;
        const scale = event.evt.deltaY > 0 ? 1 / ratio : ratio;

        let layer = this.layers.center;
        let newScale = layer.scale();
        newScale.x *= scale;
        newScale.y *= scale;
        if (newScale.x >= 0.25 && newScale.x <= 4) {
            layer.scale(newScale);
        }
    }

    handleResizeWindow() {
        let size = this.getCanvasSize();
        this.stage.width(size.width);
        this.stage.height(size.height);

        let centerPoint = this.getCenterPoint();
        this.layers.center.x(centerPoint.x);
        this.layers.center.y(centerPoint.y);
    }

    clearStage() {
        this.stage.find("Group").forEach((layer) => layer.destroy());
    }

    downloadImage() {
        let uri = this.stage.toDataURL({ pixelRatio: 3 });
        var link = document.createElement("a");
        link.download = "algodebug.jpeg";
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    getCanvasSize() {
        let canvasDOM = document.getElementById(this.containerId);
        return {
            width: canvasDOM.offsetWidth,
            height: canvasDOM.offsetHeight,
        };
    }

    getCenterPoint() {
        let size = this.getCanvasSize();
        return {
            x: size.width / 2,
            y: size.height / 2,
        };
    }
}
