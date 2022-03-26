<template>
  <div class="scene-canvas full-size">
    
    <canvas id="canvas" class="full-size"></canvas>
    <div class="scene-navigation">

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
  props: ['testCases', 'selectedTestCase', 'selectedFrame'],

  data() {
    return {
      icons: [
        {icon: 'fa-solid fa-backward-step', action: () => {this.setSelectedFrame(0)}},
        {icon: 'fa-solid fa-backward', action: () => {this.setSelectedFrame(this.$props.selectedFrame-1)}},
        {icon: 'fa-solid fa-play', action: () => {}},
        {icon: 'fa-solid fa-forward', action: () => {this.setSelectedFrame(this.$props.selectedFrame+1)}},
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

    let graph = new Graph([
      {from: 0, to: 1},
      {from: 1, to: 2},
      {from: 0, to: 5},
    ]);

    this.painter.drawGraph(graph)
  },

  methods: {
    setSelectedFrame(selectedFrame) {
      if (selectedFrame >= 0 && selectedFrame < this.numberOfFrames) {
        this.$emit('update:selectedFrame', selectedFrame);
      }
    }
    
  },

  computed: {
    currentTestCase() {
      return this.$props.testCases[this.$props.selectedTestCase];
    },

    numberOfFrames() {
      return this.currentTestCase.frames.length;
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


</style>
