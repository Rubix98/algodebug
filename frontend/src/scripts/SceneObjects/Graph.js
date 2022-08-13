import Konva from "konva";

export class Graph {
  variable; value; position; layer;
  vertices; edges;

  constructor(sceneObject, position) {
    this.variable = sceneObject.variable.name;
    this.position = position;
    this.createLayer();
  }

  createLayer() {
    const Konva = window.Konva
    this.layer = new Konva.Layer();
  }

  updateLayer(currentFrame) {
    let value = null;
    for (let variable of currentFrame.variables) {
      if (variable.getAttribute("name") == this.variable) {
        value = variable.innerText;
      }
    }

    if (value) {
      this.parseGraph(value);
      this.updateVertices();
      this.clearEdges();
      this.updateEdges();
      
    }
    //this.layer.setAttr("visible", value ? true : false);
    this.layer.draw();
    
  }

  parseGraph(value) {
    let verticesSet = new Set();
    this.edges = [];
    for (let edge of value.split("\n")) {
      if (edge != "") {
        let edgeSplitted = edge.split(" ");
        let a = Number(edgeSplitted[0]);
        let b = Number(edgeSplitted[1]);
        let d = edgeSplitted[2] ? Number(edgeSplitted[2]) : undefined;

        verticesSet.add(a);
        verticesSet.add(b);

        this.edges.push({a, b, d});
      }
      
    }
    this.vertices = [...verticesSet];
  }

  updateVertices() {
    const Konva = window.Konva
    let i = 0;
    let alpha = 2*Math.PI / this.vertices.length;
    for (let vertex of this.vertices) {
      if (this.layer.find("#" + vertex).length === 0) {
        let group = new Konva.Group({
          id: String(vertex),
          x: this.position.x + 200 * Math.cos(i*alpha),
					y: this.position.y + 200 * Math.sin(i*alpha),
          width: 50,
          height: 50,
          draggable: true
        });
        this.layer.add(group);

        
        let circle = new Konva.Circle({
          fill: 'blue',
          stroke: 'black',
          strokeWidth: 5,
          radius: 20,
        });
        group.add(circle);
        i++;

        group.add(new Konva.Text({
          text: String(vertex),
          fill: 'white',
          fontSize: 20,
          x: -25, 
          y:-25,
          align: 'center',
          verticalAlign: 'middle',
          width: 50,
          height: 50
        }))

        group.on('dragmove', () => {
          this.clearEdges();
          this.updateEdges();
        });
      }
    }
  }

  clearEdges() {
    for (let arrow of this.layer.find("Line")) {
      arrow.destroy();
    }
    for (let arrow of this.layer.find(".edge-label")) {
      arrow.destroy();
    }
  }

  updateEdges() {
    for (let edge of this.edges) {
      let vertexFrom = this.layer.find("#"+edge.a)[0];
      let vertexTo = this.layer.find("#"+edge.b)[0];
      let cx = (vertexFrom.x() + vertexTo.x()) / 2;
      let cy = (vertexFrom.y() + vertexTo.y()) / 2;
      
      
      let line = new Konva.Line({
        stroke: 'black',
        fill: 'black',
        points: [vertexFrom.x(), vertexFrom.y(), vertexTo.x(), vertexTo.y()]
      });
      this.layer.add(line)
      line.moveToBottom();

      let text = new Konva.Text({
        name: 'edge-label',
        x: cx,
        y: cy,
        text: String(edge.d),
        fontSize: 20,
      })
      this.layer.add(text);
    }
  }
}