<template>
    <div class="frame-number-panel-container">{{ currentFrameId }}/{{ numberOfFrames }}</div>
</template>

<script>
    import { defineComponent } from "vue";
    import { useProjectStore } from "@/stores/project";
    import { storeToRefs } from "pinia";

    export default defineComponent({
        setup() {
            const store = useProjectStore();

            const { currentFrame, numberOfFrames } = storeToRefs(store);

            return { currentFrame, numberOfFrames };
        },
        computed: {
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
