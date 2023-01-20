<template>
    <AlgoModal title="Kod debugujący">
        <CodeEditor id="debug-code-editor" :code="this.debugCode" :editable="false" :clickable="false" />

        <template #buttons>
            <v-btn @click="copy()" color="primary">Kopiuj</v-btn>
        </template>
    </AlgoModal>
</template>

<script>
    import CodeEditor from "@/components/mainPage/codeEditor/CodeEditor.vue";
    import AlgoModal from "@/components/global/AlgoModal.vue";
    import { defineComponent } from "vue";
    import toast from "@/javascript/utils/toastUtils";
    import { storeToRefs } from "pinia";
    import { useProjectStore } from "@/stores/project";

    export default defineComponent({
        components: { AlgoModal, CodeEditor },

        setup() {
            const store = useProjectStore();

            const { debugCode } = storeToRefs(store);

            return { debugCode };
        },

        methods: {
            copy() {
                navigator.clipboard.writeText(this.debugCode).then(() => toast.info("Skopiowano"));
            },
        },
    });
</script>

<style scoped>
    #debug-code-editor {
        height: 50vh;
        min-width: 90rem;
    }
</style>
