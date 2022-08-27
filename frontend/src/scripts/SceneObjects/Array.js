export class Array {
  variable; value; position; layer;

  constructor(sceneObject, position) {
    this.sceneObject = sceneObject;
    this.variable = sceneObject.variable.name;
    this.position = position;
    this.createLayer();
  }

  createLayer() {
    const Konva = window.Konva
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

    for (let array of this.layer.find("#array")) {
      this.position = {x: array.x(), y: array.y()};
      array.destroy();
    }
    console.log(this.position)

    if (value) {
      let i = 0;
      let arrayGroup = new Konva.Group({
        x: this.position.x,
        y: this.position.y,
        id: "array",
        draggable: true
      });
      this.layer.add(arrayGroup);
      for (let char of value) {
        char;
        const group = new Konva.Group({
          id: String(i),
          x: i*50,
          y: 0,
          width: 50,
          height: 50,
        })

        group.add(new Konva.Rect({
          stroke: 'black',
          strokeWidth: 3,
          width: 50,
          height: 50
        }))

        group.add(new Konva.Text({
          text: String(char),
          fill: 'black',
          fontSize: 20,
          x: 0, 
          y: 0,
          align: 'center',
          verticalAlign: 'middle',
          width: 50,
          height: 50
        }))

        group.add(new Konva.Text({
          name: "index", 
          text: String(i),
          fill: 'black',
          fontSize: 15,
          x: 0, 
          y: 50,
          align: 'center',
          verticalAlign: 'middle',
          width: 50,
          height: 20
        }))

        arrayGroup.add(group);
        i++;
      }

      this.addSubobjects(currentFrame);
    }
    

    this.layer.draw();
    
  }

  addSubobjects(currentFrame) {
    for (let subobject of this.sceneObject.subobjects) {
      let value = null;
      for (let variable of currentFrame.variables) {
        if (variable.getAttribute("name") == subobject.variable.name) {
          value = variable.innerText;
        }
      }

      if (value) {
        if (subobject.type.key === 'array_index') {
          let group = this.layer.find("#" + value)[0];
          let rect = group.find("Rect")[0];
          let index = group.find(".index")[0];

          rect.stroke(subobject.color);
          rect.strokeWidth(5);
          group.moveToTop();

          index.fill(subobject.color);
        } else if (subobject.type.key === 'array_part') { 
          value = value.split(" ");
          let a = Number(value[0]);
          let b = Number(value[1]);

          for (let i = a; i < b; i++) {
            let group = this.layer.find("#" + i)[0];
            let rect = group.find("Rect")[0];
            let index = group.find(".index")[0];

            rect.stroke(subobject.color);
            rect.strokeWidth(5);
            group.moveToTop();

            index.fill(subobject.color);
          }
        }
      }
    }
  }
}