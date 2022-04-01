export class Graph {
	defaultProperties = {
		cx: 300,
		cy: 300,		
		graphRadius: 200,
		vertexRadius: 20,
		vertexColor: 'silver',
		vertexLabelColor: 'black',
		edgeWidth: 5,
		edgeColor: 'green',
		edgeLabelColor: 'black',
		displayWeights: true
	};

	constructor(edges, properties) {
		this.properties = properties != null ? properties : this.defaultProperties;
		this.edges = JSON.parse(JSON.stringify(edges));
		this.vertices = this.calculateVertices(this.edges, properties)
		this.edges = this.calculateEdges(this.edges, this.vertices);
	}

	calculateEdges() {
		for (let edge of this.edges) {
			edge.properties = {
				x1: this.vertices[edge.from].properties.cx,
				y1: this.vertices[edge.from].properties.cy,
				x2: this.vertices[edge.to].properties.cx,
				y2: this.vertices[edge.to].properties.cy
			};
			edge.properties.cx = (edge.properties.x1 + edge.properties.x2) / 2;
			edge.properties.cy = (edge.properties.y1 + edge.properties.y2) / 2;
		}
		return this.edges;
	}

	calculateVertices() {
		let verticesIds = this.calculateVerticesIds();
		let alpha = 2*Math.PI / verticesIds.length;
		let vertices = {};

		let i = 0;
		for (let vertex of verticesIds) {
			vertices[vertex] = {
				id: vertex,
				properties: {
					cx: this.properties.cx + this.properties.graphRadius * Math.cos(i*alpha),
					cy: this.properties.cy + this.properties.graphRadius * Math.sin(i*alpha)
				}
			}
			i++;
		}
		return vertices;
	}

	calculateVerticesIds() {
		let verticesIds = new Set();
		for (let edge of this.edges) {
			verticesIds.add(edge.from);
			verticesIds.add(edge.to);
		}
		verticesIds = Array.from(verticesIds);
		return verticesIds;
	}
}