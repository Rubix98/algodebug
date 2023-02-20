<template>
    <AlgoModal title="Wybierz format zapisu">
        <v-btn @click="handleDownloadOption('PNG')">PNG (jedna klatka)</v-btn>
        <v-btn @click="handleDownloadOption('PDF')">PDF (wszystkie klatki)</v-btn>
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
