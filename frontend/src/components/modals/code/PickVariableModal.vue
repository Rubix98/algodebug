<template>
    <AlgoModal title="Zaznacz zmienne" closeButtonLabel="Gotowe">
        <div id="variable-chips-container">
            <v-chip
                closable
                v-for="variable in this.selectedVariables"
                class="ma-2"
                :key="variable.id"
                @click:close="deleteVariable(variable)"
            >
                {{ variable.name }}
            </v-chip>
        </div>
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
    import { defineComponent } from "vue";
    import { mapState } from "pinia";
    import { useProjectStore } from "@/stores/project";

    export default defineComponent({
        components: { CodeViewer, AlgoModal },

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

    #variable-chips-container {
        height: 15%;
        white-space: nowrap;
        overflow-y: auto;
    }

    #pick-variable-viewer {
        height: 85%;
    }
</style>
