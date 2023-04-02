<template>
    <AlgoModal title="Wybierz format zapisu">
        <div class="flex-center">
            <v-btn @click="handleDownloadOption('PNG')" class="download-button">PNG (jedna klatka)</v-btn>
            <v-btn @click="handleDownloadOption('PDF')" class="download-button">PDF (wszystkie klatki)</v-btn>
        </div>
    </AlgoModal>
</template>

<script>
    import AlgoModal from "@/components/global/AlgoModal.vue";
    import { popModal } from "jenesius-vue-modal";
    import { defineComponent } from "vue";

    export default defineComponent({
        components: { AlgoModal },

        props: ["callback"],

        methods: {
            handleDownloadOption(selectedOption) {
                this.$props.callback(selectedOption);
                popModal();
            },
        },
    });
</script>

<style scoped>
    .download-button {
        margin: 5px 15px;
    }
</style>
