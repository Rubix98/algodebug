import Konva from "konva";
import { Painter } from "./Painter";

export class ArrayPainter extends Painter {
  subobjectFunctionMap = {
    'array_index': this.highlightElements,
    'array_part': this.highlightRanges,
  }
  layerPosition = "center";

  style = {
    cellSize: 50,
    rowHeight: 70,
    fontSize: 20,
    indexFontSize: 15
  }

  drawModel(array) {
    const rowCapacity = Math.floor(this.stageSize.width / this.style.cellSize);
    const numberOfColumns = Math.min(array.length, rowCapacity)
    const numberOfRows = Math.ceil(array.length / rowCapacity);
    const startX = -numberOfColumns * this.style.cellSize / 2;
    const startY = -numberOfRows * this.style.rowHeight / 2;

    let index = 0;
    for (let element of array) {
      const elementGroup = new Konva.Group({
        id: `element-${index}`,
        name: "element",
        x: startX + (index % rowCapacity) * this.style.cellSize,
        y: startY + Math.floor(index / rowCapacity) * this.style.rowHeight,
      })
      this.mainGroup.add(elementGroup);

      const elementRect = new Konva.Rect({
        id: `element-rect-${index}`,
        name: "element-rect",
        width: this.style.cellSize,
        height: this.style.cellSize,
        stroke: 'black',
        strokeWidth: 1,
      });
      elementGroup.add(elementRect);

      const elementText = new Konva.Text({
        id: `element-text-${index}`,
        name: 'element-text',
        text: String(element),
        width: this.style.cellSize,
        height: this.style.cellSize,
        fontSize: this.style.fontSize,
        align: 'center',
        verticalAlign: 'middle',
      });
      elementGroup.add(elementText);

      const elementIndex = new Konva.Text({
        id: `element-index-${index}`,
        name: 'element-index',
        text: String(index),
        x: 0, 
        y: this.style.cellSize,
        width: this.style.cellSize,
        height: this.style.rowHeight - this.style.cellSize,
        fontSize: this.style.indexFontSize,
        align: 'center',
        verticalAlign: 'middle',
      });
      elementGroup.add(elementIndex);
      index++;
    }
  }

  highlightElements(elements, subobject) {
    for (let elementIndex of elements) {
      const elementGroupNode = this.mainGroup.find(`#element-${elementIndex}`)[0];
      if (elementGroupNode) {
        const elementRectNode = elementGroupNode.find(".element-rect")[0];
        const elementIndexNode = elementGroupNode.find(".element-index")[0];
        if (elementRectNode && elementIndexNode) {
          elementGroupNode.moveToTop();
          elementRectNode.stroke(subobject.color);
          elementRectNode.strokeWidth(3);
          elementIndexNode.fill(subobject.color)
        }
      }
    }
  }

  highlightRanges(ranges, subobject) {
    let elements = [];

    for (let range of ranges) {
      for (let i = Number(range[0]); i < Number(range[1]); i++) {
        elements.push(i);
      }
    }

    this.highlightElements(elements, subobject);
  }
}