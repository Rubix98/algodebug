export class Shape {
  variable; value; layer;

  constructor(sceneObject, position) {
    this.sceneObject = sceneObject;
    this.variable = sceneObject.variable.name;
    this.position = position;
    this.createLayer();
  }

  createLayer() {
    const Konva = window.Konva;
    this.layer = new Konva.Layer();
  }

  updateLayer(currentFrame) {
    const Konva = window.Konva;
    let value = null;
    for (let variable of currentFrame.variables) {
      if (variable.getAttribute("name") == this.variable) {
        value = variable.innerText;
      }
    }

    for (let group of this.layer.find("Group")) {
      group.destroy();
    }

    let group = new Konva.Group({
      x: this.position.x,
      y: this.position.y
    })
    this.layer.add(group);

    if (value) {
      let points = value.trim().split("\n");
      let previous = points.at(-1).split(" ");
      for (let point of points) {
        point = point.split(" ");
        group.add(new Konva.Line({
          stroke: 'black',
          strokeWidth: 1,
          points: [Number(point[0]), Number(point[1]), Number(previous[0], previous[1])]
        }));
        previous = point;
      }
    } 
    this.layer.draw();
    
  }
}