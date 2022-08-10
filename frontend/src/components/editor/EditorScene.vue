<template>
  <div class="scene-canvas full-size">
    
    <canvas id="canvas" class="full-size"></canvas>

    <div class="buttons-container" v-if="!isRunning">
      <button class="algo-button-default" @click="addNewSceneObject()">Dodaj nowy obiekt</button> <br/><br/>
      <button v-if="sceneObjects.length" class="algo-button-default" @click="showSceneObjects()">Konfiguruj obiekty</button>
    </div>

    <div class="scene-navigation" v-if="isRunning">

      <i v-for="icon in icons" :key="icon.icon"
        :class="icon.icon"
        @click="icon.action"
      />
    </div>
  </div>
</template>

<script>
import {Graph} from '@/scripts/Graph.js';
import {Painter} from '@/scripts/Painter.js';

export default {
  props: ['testCases', 'isRunning', 'code', 'variables', 'breakpoints', 'language', 'sceneObjects'],

  data() {
    return {
      icons: [
        {icon: 'fa-solid fa-backward-step', action: () => {this.setSelectedFrame(0)}},
        {icon: 'fa-solid fa-backward', action: () => {this.setSelectedFrame(this.selectedFrameId-1)}},
        {icon: 'fa-solid fa-play', action: () => {}},
        {icon: 'fa-solid fa-forward', action: () => {this.setSelectedFrame(this.selectedFrameId+1)}},
        {icon: 'fa-solid fa-forward-step', action: () => {this.setSelectedFrame(this.numberOfFrames-1)}},
      ]
    }
  },

  mounted() {
    let canvasDOM = document.getElementById('canvas');
    this.canvas = canvasDOM.getContext('2d');
    this.canvasWidth = canvasDOM.width = canvasDOM.offsetWidth;
    this.canvasHeight = canvasDOM.height = canvasDOM.offsetHeight;
    this.painter = new Painter(this.canvas);
  },

  methods: {
    setSelectedFrame(selectedFrameId) {
      if (selectedFrameId >= 0 && selectedFrameId < this.numberOfFrames) {
        this.$props.testCases.current().selectedFrameId = selectedFrameId;
      }
      
    },
    
    drawFrame(frame) {
      this.painter.clear();
      let graph = new Graph(frame.graph);
      this.painter.drawGraph(graph);
    },

    addNewSceneObject() {
      this.$root.openDialog('ConfigureSceneObjectModal', {
        code: this.$props.code,
        variables: this.$props.variables,
        breakpoints: this.$props.breakpoints,
        language: this.language
      });
    },

    showSceneObjects() {
      this.$root.openDialog('ShowSceneObjectsModal', {
        sceneObjects: this.$props.sceneObjects,
        code: this.$props.code,
        variables: this.$props.variables,
        breakpoints: this.$props.breakpoints,
        language: this.language
      })
    }
  },

  computed: {
    numberOfFrames() {
      return this.testCases.current().frames.length;
    },

    selectedFrameId() {
      return this.$props.testCases.current().selectedFrameId;
    }
  }
}
</script>

<style scoped>
  canvas {
    border: 1px solid black;
    background-color: white;
  }

  .scene-canvas {
    position: relative;
  }

  .scene-navigation {
    color: black;
    position: absolute;
    width: 100%;
    text-align: center;
    bottom: 0px;
    font-size: 40px;
  }

  .scene-navigation i {
    margin: 0 10px;
    cursor: pointer;
  }

  .buttons-container {
    color: black;
    position: absolute;
    width: 100%;
    text-align: center;
    top: 45%;
  }

  .buttons-container button {
    font-size: 30px;

  }


</style>
