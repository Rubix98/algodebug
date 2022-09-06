export class Array {
  variable; value; position; layer;

  constructor(sceneObject, position, width, height) {
    this.sceneObject = sceneObject;
    this.variable = sceneObject.variable.name;
    this.position = position;
    this.width = width;
    this.height = height;
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

    if (value) {
      let i = 0;
      let arrayGroup = new Konva.Group({
        x: this.position.x,
        y: this.position.y,
        id: "array",
        draggable: true
      });
      this.layer.add(arrayGroup);
      
      if (value.includes(" ")) {
        value = value.trim().split(" ")
      }
      let row = Math.floor(this.width / 50)-1;
      console.log(row);
      for (let element of value) {
        const group = new Konva.Group({
          id: String(i),
          x: (i % row)*50,
          y: Math.floor(i / row) * 70,
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
          text: String(element),
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
          for (let arrayIndex of value.trim().split(" ")) {
            let group = this.layer.find("#" + arrayIndex)[0];
            let rect = group.find("Rect")[0];
            let index = group.find(".index")[0];

            rect.stroke(subobject.color);
            rect.strokeWidth(5);
            group.moveToTop();

            index.fill(subobject.color);
          }
        } else if (subobject.type.key === 'array_part') {
          for (let part of value.trim().split("\n")) {
            part = part.split(" ");
            let a = Number(part[0]);
            let b = Number(part[1]);
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
}