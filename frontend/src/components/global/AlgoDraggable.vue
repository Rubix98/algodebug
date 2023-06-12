<template>
    <div :id="id" class="algo-draggable-container" :class="additionalClass">
        <TransitionGroup name="algo-draggable-group">
            <v-chip
                closable
                v-for="element in draggableList"
                class="ma-2"
                :key="element.id"
                @click="onClick(element, $event)"
                @click:close="onClickClose(element, $event)"
                draggable
                style="cursor: grab"
                v-on:dragstart="dragStart"
                v-on:dragenter="dragEnter"
                v-on:dragend="dragEnd"
                :id="element.id"
            >
                {{ content(element) }}
            </v-chip>
        </TransitionGroup>
    </div>
</template>

<script>
    import { defineComponent } from "vue";

    export default defineComponent({
        props: ["id", "draggableList", "onClickClose", "onClick", "content", "additionalClass"],

        data() {
            return {
                draggedElement: "",
            };
        },
        methods: {
            dragStart: function (event) {
                this.draggedElementId = event.target.id;
            },

            dragEnter: function (event) {
                if (
                    this.draggedElementId != "" &&
                    event.target.id != this.draggedElementId &&
                    event.target.parentNode.classList.contains("algo-draggable-container") &&
                    !event.target.classList.contains("algo-draggable-group-move")
                ) {
                    let index_from = this.draggableList.findIndex((element) => element.id == this.draggedElementId);
                    let index_to = this.draggableList.findIndex((element) => element.id == event.target.id);

                    let selectedElements = this.$props.draggableList;

                    let cutOut = selectedElements.splice(index_from, 1)[0];
                    selectedElements.splice(index_to, 0, cutOut);

                    this.$emit("update-list", selectedElements);
                }
            },

            dragEnd: function () {
                this.draggedElementId = "";
            },
        },
    });
</script>

<style scoped>
    .algo-draggable-container {
        height: 48px;
        width: 100%;
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
        position: fixed;
    }
</style>
