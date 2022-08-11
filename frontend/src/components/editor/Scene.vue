<template>
  <div class="scene">
    <div id="canvas"></div>
  </div>
</template>

<script>
import {Variable} from '@/scripts/SceneObjects/Variable.js';

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
      const Konva= window.Konva;
      this.stage = new Konva.Stage({
        container: 'canvas',
        width: 500,
        height: 500
      });
      this.objects = [];

      let variableY = 5;
      for (let sceneObject of this.$props.sceneObjects) {
        let object;
        if (sceneObject.type.key === 'variable') {
          object = new Variable(sceneObject, this.$props.currentFrame, {x: 5, y: variableY});
          variableY += 40;
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
