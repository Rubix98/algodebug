export class Variable {
  variable; value; position; layer;

  constructor(sceneObject, position) {
    this.variable = sceneObject.variable.name;
    this.position = position;
    this.createLayer();
  }

  createLayer() {
    const Konva = window.Konva
    this.layer = new Konva.Layer();
    this.layer.add(new Konva.Text({
      text: "",
      fontSize: 30,
      x: this.position.x,
      y: this.position.y,
      draggable: true
    }));
  }

  updateLayer(currentFrame) {
    let value = null;
    for (let variable of currentFrame.variables) {
      if (variable.getAttribute("name") == this.variable) {
        value = variable.innerText;
      }
    }

    if (value) {
      this.layer.getChildren()[0].setAttr("text", `${this.variable} = ${value}`)
      this.layer.setAttr("visible", true);
    } else {
      this.layer.setAttr("visible", false);
    }
    this.layer.draw();
    
  }
}