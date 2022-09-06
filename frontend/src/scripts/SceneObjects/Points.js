export class Points {
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
    for (let pointsGroup of this.layer.find("#points")) {
      pointsGroup.destroy();
    }

    let value = null;
    for (let variable of currentFrame.variables) {
      if (variable.getAttribute("name") == this.variable) {
        value = variable.innerText;
      }
    }

    if (value) {
      let pointsGroup = new Konva.Group({
        x: this.position.x,
        y: this.position.y,
        id: "points",
        draggable: true
      });
      this.layer.add(pointsGroup);
      let i = 0;
      for (let point of value.split("\n")) {
        if (point === "") break;

        let cords = point.split(" ");
        const group = new Konva.Group({
          id: "group_" + i,
          x: Number(cords[0]),
          y: Number(cords[1]),
          width: 50,
          height: 50,
        })

        group.add(new Konva.Circle({
          id: "circle_" + i,
          fill: 'black',
          radius: 5,
        }))

        group.add(new Konva.Text({
          text: String(i),
          fill: 'black',
          fontSize: 15,
          x: 5, 
          y: 5,
          align: 'center',
          verticalAlign: 'middle',
          width: 10,
          height: 10
        }));

        pointsGroup.add(group);
        i++;
      }

      this.pointsGroup = pointsGroup;
      this.addSubobjects(currentFrame)
    }

    this.layer.find('Line').forEach(line => line.moveToBottom());
    
    this.layer.draw();
    
  }

  addSubobjects(currentFrame) {
    const Konva = window.Konva;
    for (let subobject of this.sceneObject.subobjects) {
      let value = null;
      for (let variable of currentFrame.variables) {
        if (variable.getAttribute("name") == subobject.variable.name) {
          value = variable.innerText;
        }
      }

      if (value) {
        if (subobject.type.key === 'points_point') {
          for (let point of value.split(" ")) {
            if (point === "") break;
            let pointNode = this.layer.find("#circle_" + point)[0];
            pointNode.fill(subobject.color)
            pointNode.radius(5);
          }
        } else if (subobject.type.key === 'points_stretch') { 
          for (let stretch of value.split("\n")) {
            if (stretch === "") break;
            stretch = stretch.split(" ");
            let a = stretch[0];
            let b = stretch[1];
            let pointA = this.layer.find("#group_" + a)[0];
            let pointB = this.layer.find("#group_" + b)[0];
            
            this.pointsGroup.add(new Konva.Line({
              stroke: subobject.color,
              points: [pointA.x(), pointA.y(), pointB.x(), pointB.y()]
            }));

          }
        } else if (subobject.type.key === 'points_path') { 
          let previous = -1;
          for (let point of value.split(" ")) {
            if (point === "") break;

            let pointNode = this.layer.find("#circle_" + point)[0];
            pointNode.fill(subobject.color)
            pointNode.radius(5);

            if (previous !== -1) {
              let a = point;
              let b = previous;
              let pointA = this.layer.find("#group_" + a)[0];
              let pointB = this.layer.find("#group_" + b)[0];

              
              this.pointsGroup.add(new Konva.Line({
                stroke: subobject.color,
                points: [pointA.x(), pointA.y(), pointB.x(), pointB.y()]
              }));
            }
            previous = point;

          }
        }
      }
    }
  }
}