<template>
  <div class="scene-canvas">
    <canvas id="canvas" class="full-size"></canvas>
  </div>
</template>

<script>
import {Graph} from '@/scripts/Graph.js';
import {Painter} from '@/scripts/Painter.js';

export default {
  data() {
    return {
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
    

    
  }
}
</script>

<style scoped>
  canvas {
    border: 1px solid black;
    background-color: white;
  }

</style>
