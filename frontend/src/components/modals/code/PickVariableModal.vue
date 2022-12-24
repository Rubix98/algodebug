<template>
    <AlgoModal title="Zaznacz zmienną">
        <CodeEditor
            id="pick-variable-editor"
            :code="project.code"
            :editable="false"
            :clickable="true"
            @pickVariableEvent="handlePickVariable"
            :showHighlightedVariables="true"
            :showBreakpoints="true"
        />
    </AlgoModal>
</template>

<script>
import CodeEditor from "@/components/mainPage/codeEditor/CodeEditor.vue";
import AlgoModal from "@/components/global/AlgoModal.vue";
import { mapState } from "vuex";
import { popModal } from "jenesius-vue-modal";

export default {
    components: { CodeEditor, AlgoModal },

    props: ["callback"],

    methods: {
        handlePickVariable(variable) {
            this.$props.callback(variable);
            popModal();
        },
    },

    computed: {
        ...mapState(["project"]),
    },
};
</script>

<style scoped>
.dialog {
    width: 80vw;
}

#pick-variable-editor {
    height: 20rem;
}
</style>
