<template>
    <AlgoModal title="Kod debugujący">
        <CodeEditor id="debug-code-editor" :code="debugCode" :editable="false" :clickable="true" />

        <template #buttons>
            <AlgoButton @click="copy()">Kopiuj</AlgoButton>
        </template>
    </AlgoModal>
</template>

<script>
import CodeEditor from "@/components/mainPage/codeEditor/CodeEditor.vue";
import AlgoModal from "@/components/global/AlgoModal.vue";
import AlgoButton from "@/components/global/AlgoButton.vue";
import { mapGetters } from "vuex";

export default {
    components: { AlgoModal, CodeEditor, AlgoButton },

    methods: {
        copy() {
            navigator.clipboard.writeText(this.debugCode).then(() => alert("Skopiowano"));
        },
    },

    computed: {
        ...mapGetters("project", ["debugCode"]),
    },
};
</script>

<style scoped>
.dialog {
    width: 80vw;
}

.code-editor-container {
    height: 70vh;
}
</style>
