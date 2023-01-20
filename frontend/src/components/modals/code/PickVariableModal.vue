<template>
    <AlgoModal title="Zaznacz zmienną">
        <CodeEditor
            id="pick-variable-editor"
            :code="this.code"
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
    import { defineComponent } from "vue";
    import { popModal } from "jenesius-vue-modal";
    import { storeToRefs } from "pinia";
    import { useProjectStore } from "@/stores/project";

    export default defineComponent({
        components: { CodeEditor, AlgoModal },

        props: ["callback"],
        setup() {
            const store = useProjectStore();

            const { code } = storeToRefs(store);

            return { code };
        },

        methods: {
            handlePickVariable(variable) {
                this.$props.callback(variable);
                popModal();
            },
        },
    });
</script>

<style scoped>
    .dialog {
        width: 80vw;
    }

    #pick-variable-editor {
        height: 20rem;
    }
</style>
