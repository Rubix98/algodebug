export class Circle {
  variable; value; layer;

  constructor(sceneObject, position) {
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
      value = value.split(" ")
      group.add(new Konva.Circle({
        x: Number(value[0]),
        y: Number(value[1]),
        radius: Number(value[2]),
        stroke: 'black',
        strokeWidth: 1
      }))
    } 
    this.layer.draw();
    
  }
}