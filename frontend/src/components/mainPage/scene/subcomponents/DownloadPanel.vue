<template>
    <div class="download-panel-container">
        <i class="fa-solid fa-download" @click="download"></i>
    </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
    methods: {
        download() {
            this.emitter.emit("downloadStageEvent");
        },
    },
});
</script>

<style scoped>
.download-panel-container {
    padding-top: 5px;
    padding-right: 10px;
}

i {
    font-size: 30px;
}
</style>
