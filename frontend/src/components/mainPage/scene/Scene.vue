<template>
  <div class="scene-container full-size">
    <SceneCanvas class="full-size" :sceneObjects="project.sceneObjects" :isRunning="project.isRunning"></SceneCanvas>

    <CenterPanel v-if="!project.isRunning"/>
    <SceneObjectsPanel v-if="!project.isRunning"/>
    <DownloadPanel v-if="project.isRunning"/>
    <NavigationPanel v-if="project.isRunning" />
    <FrameNumberPanel v-if="project.isRunning" />
  </div>
</template>

<script>
import SceneCanvas from './subcomponents/SceneCanvas.vue';
import CenterPanel from './subcomponents/CenterPanel.vue';
import SceneObjectsPanel from './subcomponents/SceneObjectsPanel.vue';
import DownloadPanel from './subcomponents/DownloadPanel.vue';
import NavigationPanel from './subcomponents/NavigationPanel.vue';
import FrameNumberPanel from './subcomponents/FrameNumberPanel.vue';
import { mapState } from "vuex";

export default {
    components: { SceneCanvas, CenterPanel, SceneObjectsPanel, DownloadPanel, NavigationPanel, FrameNumberPanel },
    computed: {
      ...mapState(['project']),
    }
}
</script>

<style scoped>
  .scene-container {
    position: relative;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
    border-radius: 10px;
  }

  .center-panel-container {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }

  .scene-objects-panel-container {
    position: absolute;
    left: 0;
    top: 0;
  }

  .download-panel-container {
    position: absolute;
    top: 0px;
    right: 0px;
  }

  .navigation-panel-container {
    position: absolute;
    width: 100%;
    bottom: 0px;
  }

  .frame-number-panel-container {
    position: absolute;
    bottom: 0px;
    right: 0px;
  }
</style>
