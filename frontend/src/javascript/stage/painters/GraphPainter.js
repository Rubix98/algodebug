import Konva from "konva";
import { Painter } from "../Painter";

export class GraphPainter extends Painter {
    subobjectFunctionMap = {
        graph_vertices: this.highlightVertices,
        graph_edges: this.highlightEdges,
        graph_path: this.highlightPath,
    };
    layerPosition = "center";

    style = {
        graphRadius: 220,
        vertexRadius: 20,
        fontSize: 20,
    };

    drawModel(graph) {
        this.drawVertices(graph.vertices);
        this.drawEdges(graph.edges);
    }

    drawVertices(vertices) {
        vertices.forEach((vertex, index) => {
            const vertexId = "vertex-" + vertex;
            const vertexPosition = this.getPosition(
                vertexId,
                this.calculateDefaultVertexPosition(index, vertices.length, this.style.graphRadius)
            );

            const vertexGroup = new Konva.Group({
                vertex: vertex,
                id: `vertex-${vertex}`,
                name: "vertex",
                ...vertexPosition,
                width: this.style.vertexRadius,
                height: this.style.vertexRadius,
                draggable: true,
            });
            this.mainGroup.add(vertexGroup);

            const vertexCircle = new Konva.Circle({
                id: `vertex-circle-${vertex}`,
                name: "vertex-circle",
                radius: this.style.vertexRadius,
                fill: "white",
                stroke: "black",
                strokeWidth: 2,
            });
            vertexGroup.add(vertexCircle);

            const vertexText = new Konva.Text({
                id: `vertex-text-${vertex}`,
                name: "vertex-text",
                text: String(vertex),
                x: -this.style.vertexRadius,
                y: -this.style.vertexRadius,
                width: 2 * this.style.vertexRadius,
                height: 2 * this.style.vertexRadius,
                fontSize: this.style.fontSize,
                align: "center",
                verticalAlign: "middle",
                fill: "black",
            });
            vertexGroup.add(vertexText);

            vertexGroup.on("dragmove", (event) => this.handleVertexMove(event));
        });
    }

    drawEdges(edges) {
        for (let edge of edges) {
            const vertexFrom = this.mainGroup.find(`#vertex-${edge.a}`)[0];
            const vertexTo = this.mainGroup.find(`#vertex-${edge.b}`)[0];
            const centerPoint = {
                x: (vertexFrom.x() + vertexTo.x()) / 2,
                y: (vertexFrom.y() + vertexTo.y()) / 2,
            };

            const edgeGroup = new Konva.Group({
                edge: edge,
                id: `edge-${edge.a}-${edge.b}`,
                name: "edge",
            });
            this.mainGroup.add(edgeGroup);
            edgeGroup.moveToBottom();

            const edgeLine = new Konva.Line({
                id: `edge-line-${edge.a}-${edge.b}`,
                name: "edge-line",
                points: [vertexFrom.x(), vertexFrom.y(), vertexTo.x(), vertexTo.y()],
                stroke: this.color,
            });
            edgeGroup.add(edgeLine);

            if (edge.d) {
                const edgeText = new Konva.Text({
                    id: `edge-text-${edge.a}-${edge.b}`,
                    name: "edge-text",
                    text: String(edge.d),
                    x: centerPoint.x,
                    y: centerPoint.y,
                    strokeEnabled: true,
                    fillAfterStrokeEnabled: true,
                    stroke: this.color == "white" ? "black" : "white",
                    strokeWidth: 5,
                    fill: this.color,
                    fontSize: this.style.fontSize,
                });
                edgeGroup.add(edgeText);
            }
        }
    }

    highlightVertices(vertices, subobject) {
        if (
            vertices.length === this.model.vertices.length &&
            vertices.filter((vertex) => vertex != 0 && vertex != 1).length === 0
        ) {
            vertices = vertices
                .map((vertex, index) => (vertex == 1 ? index : undefined))
                .filter((vertex) => vertex !== undefined);
        }

        for (let vertex of vertices) {
            const vertexCircleNode = this.mainGroup.find(`#vertex-circle-${vertex}`)[0];
            if (vertexCircleNode) {
                vertexCircleNode.fill(subobject.color);
                vertexCircleNode.strokeWidth(3);
            }
        }
    }

    highlightEdges(edges, subobject) {
        for (let edge of edges) {
            const edgeLineNode =
                this.mainGroup.find(`#edge-line-${edge.a}-${edge.b}`)[0] ??
                this.mainGroup.find(`#edge-line-${edge.a}-${edge.b}`)[0];
            if (edgeLineNode) {
                edgeLineNode.stroke(subobject.color);
                edgeLineNode.strokeWidth(5);
            }
        }
    }

    highlightPath(path, subobject) {
        let vertices = [];
        let edges = [];

        let previousVertex;
        for (let vertex of path) {
            vertices.push(vertex);
            if (previousVertex) {
                edges.push({ a: previousVertex, b: vertex });
            }
            previousVertex = vertex;
        }

        this.highlightVertices(vertices, subobject);
        this.highlightEdges(edges, subobject);
    }

    handleVertexMove(event) {
        const vertexNode = event.target;
        const vertex = vertexNode.attrs.vertex;
        this.mainGroup.find(".edge").forEach((edgeNode) => {
            let edge = edgeNode.attrs.edge;
            if (edge.a != vertex && edge.b != vertex) return;

            const vertexFrom = this.mainGroup.find(`#vertex-${edge.a}`)[0];
            const vertexTo = this.mainGroup.find(`#vertex-${edge.b}`)[0];
            const centerPoint = {
                x: (vertexFrom.x() + vertexTo.x()) / 2,
                y: (vertexFrom.y() + vertexTo.y()) / 2,
            };

            const edgeLineNode = edgeNode.find(".edge-line")[0];
            if (edgeLineNode) {
                edgeLineNode.points([vertexFrom.x(), vertexFrom.y(), vertexTo.x(), vertexTo.y()]);
            }

            if (edgeLineText) {
                edgeLineText.x(centerPoint.x);
                edgeLineText.y(centerPoint.y);
            }
        });

        this.handlePositionChange(vertexNode.id(), {
            x: vertexNode.x(),
            y: vertexNode.y(),
        });
    }

    calculateDefaultVertexPosition(i, n, R) {
        const alpha = (i / n) * 2 * Math.PI;
        return {
            x: R * Math.cos(alpha),
            y: R * Math.sin(alpha),
        };
    }
}
