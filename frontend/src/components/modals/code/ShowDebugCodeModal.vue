<template>
    <AlgoModal title="Kod debugujący">
        <CodeEditor class="debug-code-editor" :code="debugCode" :editable="false" :clickable="true" />

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

export default defineComponent({
    components: { AlgoModal, CodeEditor, AlgoButton },

    methods: {
        copy() {
            navigator.clipboard.writeText(this.debugCode).then(() => alert("Skopiowano"));
        },
    },

    computed: {
        ...mapGetters("project", ["debugCode"]),
    },
});
</script>

<style scoped>
.debug-code-editor {
    height: 70vh;
    min-width: 90rem;
}
</style>
