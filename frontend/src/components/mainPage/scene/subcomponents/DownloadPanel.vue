<template>
    <div class="download-panel-container">
        <v-btn icon elevation="0" @click="openDownloadFormatModal">
            <v-icon> mdi-download </v-icon>
        </v-btn>
    </div>
</template>

<script>
    import { pushModal } from "jenesius-vue-modal";
    import { defineComponent } from "vue";
    import DownloadSceneModal from "../../../modals/downloading/DownloadSceneModal.vue";

    export default defineComponent({
        methods: {
            openDownloadFormatModal() {
                pushModal(DownloadSceneModal, {
                    callback: (format) => {
                        this.download(format);
                    },
                });
            },

            download(format) {
                this.emitter.emit("downloadStageEvent", format);
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
