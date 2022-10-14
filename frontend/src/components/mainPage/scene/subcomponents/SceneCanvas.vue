<template>
  <div class="scene">
    <div id="canvas"></div>
  </div>
</template>

<script>
import {Variable} from '@/javascript/models/sceneObjects/Variable.js';
import {Graph} from '@/javascript/models/sceneObjects/Graph.js';
import {Array} from '@/javascript/models/sceneObjects/Array.js';
import {Points} from '@/javascript/models/sceneObjects/Points.js';
import {Circle} from '@/javascript/models/sceneObjects/Circle.js';
import {Shape} from '@/javascript/models/sceneObjects/Shape.js';
import { mapGetters } from 'vuex';

export default {
  props: ['isRunning', 'sceneObjects'],

  data() {
    return {
      objects: []
    }
  },

  mounted() {
    this.emitter.on("startDebuggingEvent", this.prepareStage);
    this.emitter.on("currentFrameChangedEvent", this.drawFrame);
    this.emitter.on("stopDebuggingEvent", this.clearStage);
  },

  methods: {
    prepareStage() {
      let canvasDOM = document.getElementById("canvas");
      let width = canvasDOM.offsetWidth;
      let height = canvasDOM.offsetHeight;

      const Konva= window.Konva;
      this.stage = new Konva.Stage({
        container: 'canvas',
        width: width,
        height: height
      });
      this.objects = [];

      let backgroundLayer = new Konva.Layer();
      this.stage.add(backgroundLayer);
      backgroundLayer.add(new Konva.Rect({
        width: width,
        height: height,
        fill: 'white'
      }))

      let variableY = 5;
      for (let sceneObject of this.$props.sceneObjects) {
        let object;
        if (sceneObject.type.key === 'variable') {
          object = new Variable(sceneObject, {x: 5, y: variableY});
          variableY += 40;
        } else if (sceneObject.type.key === 'graph') {
          object = new Graph(sceneObject, {x: width/2, y: height/2});
        } else if (sceneObject.type.key === 'array') {
          object = new Array(sceneObject, {x: 5, y: 3*height/4}, width, height);
        } else if (sceneObject.type.key === 'points') {
          object = new Points(sceneObject, {x: width/2, y: height/2});
        } else if (sceneObject.type.key === 'circle') {
          object = new Circle(sceneObject, {x: width/2, y: height/2});
        } else if (sceneObject.type.key === 'shape') {
          object = new Shape(sceneObject, {x: width/2, y: height/2});
        }

        this.objects.push(object);
        this.stage.add(object.layer);
      }

      this.drawFrame();
    },

    drawFrame() {
      let currentFrame = this.currentFrame;
      for (let object of this.objects) {
        object.updateLayer(currentFrame);
      }
      //this.download();
    },

    download() {
      let uri = this.stage.toDataURL({ pixelRatio: 3 });
      var link = document.createElement('a');
      link.download = "stage.jpeg";
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    clearStage() {
      this.stage.find('Layer').forEach(layer => layer.destroy());
    }
  },

  computed: {
    ...mapGetters('project', ['currentFrame']),
  }
}
</script>

<style scoped>
  #canvas {
    background-color: white;
    width: 100%;
    height: 100%;
    border-radius: 10px;
  }
</style>
