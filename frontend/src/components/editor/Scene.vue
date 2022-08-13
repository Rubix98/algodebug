<template>
  <div class="scene">
    <div id="canvas"></div>
  </div>
</template>

<script>
import {Variable} from '@/scripts/SceneObjects/Variable.js';
import { Graph } from '@/scripts/SceneObjects/Graph.js';

export default {
  props: ['isRunning', 'currentFrame', 'sceneObjects'],

  data() {
    return {
      objects: []
    }
  },

  mounted() {
    this.emitter.on("startDebuggingEvent", this.prepareStage);
    this.emitter.on("currentFrameChangedEvent", this.drawFrame);
  },

  methods: {
    prepareStage(currentFrame) {
      let canvasDOM = document.getElementById("canvas");
      let width = canvasDOM.offsetWidth;
      let height = canvasDOM.offsetHeight;

      const Konva= window.Konva;
      this.stage = new Konva.Stage({
        container: 'canvas',
        width: width,
        height: width
      });
      this.objects = [];

      let variableY = 5;
      for (let sceneObject of this.$props.sceneObjects) {
        let object;
        if (sceneObject.type.key === 'variable') {
          object = new Variable(sceneObject, {x: 5, y: variableY});
          variableY += 40;
        } else if (sceneObject.type.key === 'graph') {
          object = new Graph(sceneObject, {x: width/2, y: height/2});
        }

        this.objects.push(object);
        this.stage.add(object.layer);
      }

      this.drawFrame(currentFrame);
    },

    drawFrame(currentFrame) {
      for (let object of this.objects) {
        object.updateLayer(currentFrame);
      }
    }
  }
}
</script>

<style scoped>
  #canvas {
    border: 1px solid black;
    background-color: white;
    width: 100%;
    height: 100%;
  }
</style>
