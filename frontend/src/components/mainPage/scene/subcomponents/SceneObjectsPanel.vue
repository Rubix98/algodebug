<template>
    <AlgoDraggable
        additionalClass="scene-objects-panel-container"
        id="scene-objects-chips"
        :draggableList="this.sceneObjects"
        :on-click-close="deleteSceneObjectId"
        :on-click="configureSceneObject"
        :content="
            (sceneObject) => {
                return `${sceneObjectLabel(sceneObject)}`;
            }
        "
        :swap-variables="swapVariables"
    />
</template>

<script>
    import ConfigureSceneObjectModal from "@/components/modals/sceneObject/ConfigureSceneObjectModal.vue";
    import { getSceneObjectTypeLabel } from "@/javascript/utils/sceneObjectTypesUtils";
    import { openModal } from "jenesius-vue-modal";
    import { defineComponent } from "vue";
    import { useProjectStore } from "@/stores/project";
    import { mapActions, mapState } from "pinia";
    import { isEmpty } from "lodash";
    import AlgoDraggable from "../../../global/AlgoDraggable.vue";

    export default defineComponent({
        components: { AlgoDraggable },
        methods: {
            ...mapActions(useProjectStore, ["deleteSceneObject"]),
            configureSceneObject(sceneObject, event) {
                if (event.target.localName === "i") return;
                openModal(ConfigureSceneObjectModal, { sceneObject });
            },

            deleteSceneObjectId(sceneObject) {
                this.deleteSceneObject(sceneObject.id);
            },

            swapVariables(index_from, index_to) {
                let cutOut = this.sceneObjects.splice(index_from, 1)[0];
                this.sceneObjects.splice(index_to, 0, cutOut);
            },
        },
        computed: {
            ...mapState(useProjectStore, ["sceneObjects"]),
            sceneObjectLabel() {
                return (sceneObject) => {
                    return `${getSceneObjectTypeLabel(sceneObject.type)} ${
                        sceneObject.variables.length > 0 ? sceneObject.variables[0].name : "null"
                    }`;
                };
            },
            hasSubObject() {
                return (sceneObject) => {
                    return !isEmpty(sceneObject.subobjects);
                };
            },
        },
    });
</script>

<style>
    .subObjectStyle {
        margin-left: 5px;
        color: gray;
    }
</style>
