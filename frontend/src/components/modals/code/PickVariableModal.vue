<template>
    <AlgoModal title="Zaznacz zmienne" closeButtonLabel="Gotowe">
        <div
            id="variable-chips-container"
            v-on:drop="drop"
            v-on:dragover="
                (event) => {
                    event.preventDefault();
                }
            "
        >
            <TransitionGroup name="variable-chips-group">
                <v-chip
                    closable
                    v-for="variable in this.selectedVariables"
                    class="ma-2"
                    v-bind:class="{ dragged: draggedVariableId === variable.id }"
                    :key="variable.id"
                    @click:close="deleteVariable(variable)"
                    draggable
                    style="cursor: move"
                    v-on:dragstart="dragStart"
                    v-on:dragenter="dragEnter"
                    :id="variable.id"
                >
                    {{ variable.name }}
                </v-chip>
            </TransitionGroup>
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
                draggedVariableId: "",
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

            dragStart: function (event) {
                this.draggedVariableId = event.target.id;
                event.dataTransfer.clearData();
                event.dataTransfer.setData("text/plain", event.target.id);
            },

            dragEnter: function (event) {
                event.preventDefault();
                var data = event.dataTransfer.getData("text");
                if (
                    event.target.id != data &&
                    event.target.parentNode.id == "variable-chips-container" &&
                    !event.target.classList.contains("variable-chips-group-move")
                ) {
                    let index_from = this.selectedVariables.findIndex((variable) => variable.id === data);
                    let index_to = this.selectedVariables.findIndex((variable) => variable.id === event.target.id);
                    let cutOut = this.selectedVariables.splice(index_from, 1)[0];
                    this.selectedVariables.splice(index_to, 0, cutOut);
                }
            },

            drop: function () {
                this.draggedVariableId = "";
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

    .dragged {
        transform: translate(0px, -5px);
    }

    .variable-chips-group-move,
    .variable-chips-group-enter-active,
    .variable-chips-group-leave-active {
        transition: all 0.5s ease;
    }

    .variable-chips-group-enter-from {
        opacity: 0;
        transform: translateY(-30px);
    }
    .variable-chips-group-leave-to {
        opacity: 0;
        transform: translateY(30px);
    }

    .variable-chips-group-leave-active {
        position: absolute;
    }
</style>
