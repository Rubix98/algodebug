<template>
    <div class="frame-number-panel-container">{{ currentFrameId }}/{{ numberOfFrames }}</div>
</template>

<script>
    import { defineComponent } from "vue";
    import { useProjectStore } from "@/stores/project";
    import { mapState } from "pinia";

    export default defineComponent({
        computed: {
            ...mapState(useProjectStore, ["currentFrame", "numberOfFrames"]),
            currentFrameId() {
                return this.numberOfFrames ? this.currentFrame.id + 1 : 0;
            },
        },
    });
</script>

<style scoped>
    .frame-number-panel-container {
        font-size: 30px;
        padding-right: 5px;
    }
</style>
