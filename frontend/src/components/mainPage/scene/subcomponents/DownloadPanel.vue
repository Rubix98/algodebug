<template>
    <div class="download-panel-container">
        <v-btn icon elevation="0" @click="download">
            <v-icon> mdi-download </v-icon>
        </v-btn>
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
