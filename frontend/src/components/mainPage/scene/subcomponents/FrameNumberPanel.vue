<template>
    <div class="frame-number-panel-container">{{ currentFrameId }}/{{ numberOfFrames }}</div>
</template>

<script>
import { mapGetters } from "vuex";
import { defineComponent } from "vue";

export default defineComponent({
    computed: {
        ...mapGetters("project", ["currentFrame", "numberOfFrames"]),

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
