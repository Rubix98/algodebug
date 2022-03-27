export class Painter {
	defaultStyle = {
		lineWidth: 1,
		strokeStyle: 'black',
		fillStyle: 'black',
		font: '25px Arial'
	};

	constructor(canvas) {
		this.canvas = canvas;
	}

	setStyle(style) {
		for (let key in style) {
			this.canvas[key] = style[key];
		}
	}

	setDefaultStyle() {
		this.setStyle(this.defaultStyle);
	}

	clear() {
		this.canvas.clearRect(0, 0, 1000, 1000);
	}

	drawGraph(graph) {
		this.drawEdges(graph);
		this.drawVertices(graph);
	}

	drawVertices(graph) {
		this.setDefaultStyle();

		for (let vertex of Object.values(graph.vertices)) {
			this.canvas.beginPath();

			this.canvas.arc(vertex.properties.cx, vertex.properties.cy, graph.properties.vertexRadius, 0, 2*Math.PI);
			this.canvas.fillStyle = graph.properties.vertexColor;
			this.canvas.fill();
			
			this.canvas.fillStyle = graph.properties.vertexLabelColor;
			this.canvas.fillText(vertex.id, vertex.properties.cx-8, vertex.properties.cy+8);
			this.canvas.stroke();
		}
	}

	drawEdges(graph) {
		this.setDefaultStyle();

		for (let edge of graph.edges) {
			this.canvas.beginPath();

			this.canvas.strokeStyle = edge.color;
			this.canvas.moveTo(edge.properties.x1, edge.properties.y1);
			this.canvas.lineTo(edge.properties.x2, edge.properties.y2);
			
			if (edge.weight && graph.properties.displayWeights) {
				this.canvas.fillText(edge.weight, edge.properties.cx, edge.properties.cy);
			}
			this.canvas.stroke();
		}
	}
}