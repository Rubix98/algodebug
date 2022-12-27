<template>
    <AlgoModal title="Kod debugujący">
        <CodeEditor id="debug-code-editor" :code="this.debugCode" :editable="false" :clickable="false" />

        <template #buttons>
            <AlgoButton @click="copy()" type="ok">Kopiuj</AlgoButton>
        </template>
    </AlgoModal>
</template>

<script>
import CodeEditor from "@/components/mainPage/codeEditor/CodeEditor.vue";
import AlgoModal from "@/components/global/AlgoModal.vue";
import AlgoButton from "@/components/global/AlgoButton.vue";
import { mapGetters } from "vuex";
import { defineComponent } from "vue";
import toast from "@/javascript/utils/toastUtils";

export default defineComponent({
    components: { AlgoModal, CodeEditor, AlgoButton },

    methods: {
        copy() {
            navigator.clipboard.writeText(this.debugCode).then(() => toast.info("Skopiowano"));
        },
    },

    computed: {
        ...mapGetters("project", ["debugCode"]),
    },
});
</script>

<style scoped>
#debug-code-editor {
    height: 50vh;
    min-width: 90rem;
}
</style>
