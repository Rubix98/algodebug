<template>
    <div :id="id" class="algo-draggable-container" :class="class">
        <TransitionGroup name="algo-draggable-group">
            <v-chip
                closable
                v-for="variable in this.draggableList"
                class="ma-2"
                :key="variable.id"
                @click="onClick(variable, $event)"
                @click:close="onClickClose(variable, $event)"
                draggable
                style="cursor: grab"
                v-on:dragstart="dragStart"
                v-on:dragenter="dragEnter"
                v-on:dragend="dragEnd"
                :id="variable.id"
            >
                {{ content(variable) }}
            </v-chip>
        </TransitionGroup>
    </div>
</template>

<script>
    import { defineComponent } from "vue";

    export default defineComponent({
        props: ["id", "draggableList", "onClickClose", "onClick", "content", "class"],

        data() {
            return {
                draggedVariable: "",
            };
        },

        methods: {
            dragStart: function (event) {
                this.draggedVariableId = event.target.id;
            },

            dragEnter: function (event) {
                if (
                    this.draggedVariableId != "" &&
                    event.target.id != this.draggedVariableId &&
                    event.target.parentNode.classList.contains("algo-draggable-container") &&
                    !event.target.classList.contains("algo-draggable-group-move")
                ) {
                    let index_from = this.draggableList.findIndex((variable) => variable.id == this.draggedVariableId);
                    let index_to = this.draggableList.findIndex((variable) => variable.id == event.target.id);
                    let cutOut = this.draggableList.splice(index_from, 1)[0];
                    this.draggableList.splice(index_to, 0, cutOut);
                }
            },

            dragEnd: function () {
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
