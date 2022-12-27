<template>
    <v-card>
        <div class="scene-container full-size">
            <SceneCanvas
                class="full-size"
                :sceneObjects="this.project.sceneObjects"
                :isRunning="this.project.isRunning"
            ></SceneCanvas>

            <CenterPanel v-if="!this.project.isRunning" />
            <SceneObjectsPanel v-if="!this.project.isRunning" />
            <DownloadPanel v-if="this.project.isRunning" />
            <NavigationPanel v-if="this.project.isRunning" />
            <FrameNumberPanel v-if="this.project.isRunning" />
        </div>
    </v-card>
</template>

<script>
import SceneCanvas from "@/components/mainPage/scene/subcomponents/SceneCanvas.vue";
import CenterPanel from "@/components/mainPage/scene/subcomponents/CenterPanel.vue";
import SceneObjectsPanel from "@/components/mainPage/scene/subcomponents/SceneObjectsPanel.vue";
import DownloadPanel from "@/components/mainPage/scene/subcomponents/DownloadPanel.vue";
import NavigationPanel from "@/components/mainPage/scene/subcomponents/NavigationPanel.vue";
import FrameNumberPanel from "@/components/mainPage/scene/subcomponents/FrameNumberPanel.vue";
import { mapState } from "vuex";
import { defineComponent } from "vue";

export default defineComponent({
    components: { SceneCanvas, CenterPanel, SceneObjectsPanel, DownloadPanel, NavigationPanel, FrameNumberPanel },
    computed: {
        ...mapState(["project"]),
    },
});
</script>

<style scoped>
.scene-container {
    position: relative;
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
    top: 0;
    right: 0;
}

.navigation-panel-container {
    position: absolute;
    width: 100%;
    bottom: 0;
}

.frame-number-panel-container {
    position: absolute;
    bottom: 0;
    right: 0;
}
</style>
