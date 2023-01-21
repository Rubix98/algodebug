<template>
    <v-card elevation="3">
        <div class="scene-container full-size" v-if="!showLoading">
            <SceneCanvas class="full-size"></SceneCanvas>

            <CenterPanel v-if="!this.isRunning" />
            <SceneObjectsPanel v-if="!this.isRunning" />
            <DownloadPanel v-if="this.isRunning" />
            <NavigationPanel v-if="this.isRunning" />
            <FrameNumberPanel v-if="this.isRunning" />
        </div>
        <div class="full-size d-flex flex-center flex-column" v-else>
            <v-progress-circular indeterminate color="primary" />
            <span class="mt-3">Trwa kompilacja kodu...</span>
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
    import { defineComponent } from "vue";
    import { mapState } from "pinia";
    import { useProjectStore } from "@/stores/project";

    export default defineComponent({
        components: { SceneCanvas, CenterPanel, SceneObjectsPanel, DownloadPanel, NavigationPanel, FrameNumberPanel },

        computed: {
            ...mapState(useProjectStore, ["isRunning", "waitingForCompile"]),

            showLoading() {
                return this.waitingForCompile;
            },
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
