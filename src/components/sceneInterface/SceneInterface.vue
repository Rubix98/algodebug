<template>
  <div class="scene-interface full-size">
    <SceneCanvas />

    <div class="output-cases-body flex-row flex-vertical-space-between">
      <div>
        <div class="textarea-header">Wyjście</div>
        <textarea></textarea>
      </div>

      <div>
        <div class="textarea-header">Wartość śledzonych zmiennych</div>
        <textarea></textarea>
      </div>
    </div>
    
  </div>
</template>

<script>
import SceneCanvas from './SceneCanvas.vue';

export default {
  components: {SceneCanvas}
}
</script>

<style scoped>
  .scene-interface {
    background-color: silver;
    padding-top: 10px;
    padding-right: 10px;
  }

  .scene-canvas {
    height: 70%;
  }

  .output-cases-body {
    height: 30%;
    padding: 10px;
    padding-top: 35px;
  }

  .output-cases-body > div {
    width: calc(50% - 5px);
  }

  .output-cases-body .textarea-header {
    text-align: center;
    height: 20px;
    font: initial;
  }

  .output-cases-body textarea {
    width: 100%;
    height: calc(100% - 20px);
    padding: 5px;
  }

</style>
