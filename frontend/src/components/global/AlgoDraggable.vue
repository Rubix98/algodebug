<template>
    <div
        :id="id"
        class="algo-draggable-container"
        v-on:drop="drop"
        v-on:dragover="
            (event) => {
                event.preventDefault();
            }
        "
    >
        <TransitionGroup name="algo-draggable-group">
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
</template>

<script>
    import { defineComponent } from "vue";

    export default defineComponent({
        props: ["draggableList"],

        data() {
            return {
                selectedVariables: [],
                draggedVariableId: "",
            };
        },

        mounted() {
            this.selectedVariables = this.$props.draggableList;
        },

        methods: {
            deleteVariable(selectedVariable) {
                let index = this.selectedVariables.findIndex((variable) => variable.id === selectedVariable.id);
                if (index != -1) this.selectedVariables.splice(index, 1);
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
                    event.target.parentNode.classList.contains("algo-draggable-container") &&
                    !event.target.classList.contains("algo-draggable-group-move")
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
    });
</script>

<style scoped>
    .algo-draggable-container {
        height: 15%;
        white-space: nowrap;
        overflow-y: auto;
    }

    .dragged {
        transform: translate(0px, -5px);
    }

    .algo-draggable-group-move,
    .algo-draggable-group-enter-active,
    .algo-draggable-group-leave-active {
        transition: all 0.5s ease;
    }

    .algo-draggable-group-enter-from {
        opacity: 0;
        transform: translateY(-30px);
    }
    .algo-draggable-group-leave-to {
        opacity: 0;
        transform: translateY(30px);
    }

    .algo-draggable-group-leave-active {
        position: absolute;
    }
</style>
