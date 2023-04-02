<template>
    <AlgoModal title="Kod debugujący">
        <CodeViewer id="debug-code-viewer" :code="this.debugCode" :editable="false" :clickable="false" />

        <template #buttons>
            <v-btn @click="copy()" color="primary">Kopiuj</v-btn>
        </template>
    </AlgoModal>
</template>

<script>
    import CodeViewer from "@/components/mainPage/codeEditor/CodeViewer.vue";
    import AlgoModal from "@/components/global/AlgoModal.vue";
    import { defineComponent } from "vue";
    import toast from "@/javascript/utils/toastUtils";
    import { mapState } from "pinia";
    import { useProjectStore } from "@/stores/project";

    export default defineComponent({
        components: { AlgoModal, CodeViewer },

        methods: {
            copy() {
                navigator.clipboard.writeText(this.debugCode).then(() => toast.info("Skopiowano"));
            },
        },

        computed: {
            ...mapState(useProjectStore, ["debugCode"]),
        },
    });
</script>

<style scoped>
    #debug-code-viewer {
        height: 50vh;
        min-width: 90rem;
    }
</style>
