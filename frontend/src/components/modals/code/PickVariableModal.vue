<template>
    <AlgoModal title="Zaznacz zmienne" closeButtonLabel="Gotowe">
        <AlgoDraggable
            id="variable-chips"
            :draggableList="selectedVariables"
            :on-click-close="handlePickVariable"
            @update-list="
                (list) => {
                    this.selectedVariables = list;
                }
            "
            :content="(variable) => `${variable.name}`"
        />

        <CodeViewer
            id="pick-variable-viewer"
            :code="this.code"
            :editable="false"
            :clickable="true"
            @pickVariableEvent="handlePickVariable"
            :highlightedVariables="this.$props.sceneObject.variables"
            :showBreakpoints="true"
        />
    </AlgoModal>
</template>

<script>
    import CodeViewer from "../../mainPage/codeEditor/CodeViewer.vue";
    import AlgoModal from "@/components/global/AlgoModal.vue";
    import AlgoDraggable from "../../global/AlgoDraggable.vue";
    import { defineComponent } from "vue";
    import { mapState } from "pinia";
    import { useProjectStore } from "@/stores/project";

    export default defineComponent({
        components: { CodeViewer, AlgoModal, AlgoDraggable },

        props: ["callback", "sceneObject"],

        data() {
            return {
                selectedVariables: [],
            };
        },

        mounted() {
            this.selectedVariables = this.$props.sceneObject.variables;
        },

        methods: {
            handlePickVariable(variable) {
                this.$props.callback(variable);
            },

            deleteVariable(variable) {
                this.$props.callback(variable);
            },
        },
        computed: {
            ...mapState(useProjectStore, ["code"]),
        },
    });
</script>

<style scoped>
    .dialog {
        width: 80vw;
        height: 85vh;
        display: flex;
        flex-direction: column;
    }

    #pick-variable-viewer {
        height: 85%;
    }
</style>
