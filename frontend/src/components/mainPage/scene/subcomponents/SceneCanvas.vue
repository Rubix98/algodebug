<template>
    <div class="scene">
        <div id="canvas"></div>
    </div>
</template>

<script>
    import { Stage } from "@/javascript/stage/Stage";
    import { defineComponent } from "vue";
    import { useProjectStore } from "@/stores/project";
    import { mapActions, mapState } from "pinia";
    import { exportToPNG, exportToPDF } from "@/javascript/utils/downloadUtils";

    export default defineComponent({
        mounted() {
            this.stage = new Stage("canvas");

            this.emitter.on("startDebuggingEvent", this.draw);
            this.emitter.on("currentFrameChangedEvent", this.draw);
            this.emitter.on("stopDebuggingEvent", this.clearStage);
            this.emitter.on("downloadStageEvent", this.download);
            this.emitter.on("themeChangeEvent", this.draw);
        },

        methods: {
            ...mapActions(useProjectStore, ["updateSceneObjectPosition"]),

            draw() {
                if (!this.isRunning || !this.currentFrame) return;

                this.stage.draw(this.sceneObjects, this.currentFrame, this.updateSceneObjectPosition);
            },

            clearStage() {
                this.stage.clearStage();
            },

            download(format) {
                if (format == "PNG") {
                    exportToPNG(this.stage);
                } else if (format == "PDF") {
                    exportToPDF(this.stage);
                }
            },
        },

        computed: {
            ...mapState(useProjectStore, ["currentFrame", "isRunning", "sceneObjects"]),
        },
    });
</script>

<style scoped>
    #canvas {
        width: 100%;
        height: 100%;
        border-radius: 10px;
    }
</style>
