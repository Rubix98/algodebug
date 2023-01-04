<template>
    <div class="scene">
        <div id="canvas"></div>
    </div>
</template>

<script>
    import { Stage } from "@/javascript/stage/Stage";
    import { mapActions, mapGetters, mapState } from "vuex";
    import { defineComponent } from "vue";

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
            ...mapActions("project", ["updateSceneObjectPosition"]),

            draw() {
                if (!this.projectIsRunning || !this.currentFrame) return;

                this.stage.draw(this.sceneObjects, this.currentFrame, this.updateSceneObjectPosition);
            },

            clearStage() {
                this.stage.clearStage();
            },

            download() {
                this.stage.downloadImage();
            },
        },

        computed: {
            ...mapState(["project"]),
            ...mapGetters("project", ["sceneObjects", "currentFrame", "projectIsRunning"]),
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
