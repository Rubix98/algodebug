<template>
    <div class="scene-objects-panel-container">
        <v-chip
            closable
            v-for="sceneObject in this.sceneObjects"
            class="ma-2"
            :key="sceneObject.id"
            @click="configureSceneObject(sceneObject, $event)"
            @click:close="deleteSceneObject(sceneObject.id)"
        >
            {{ sceneObjectLabel(sceneObject) }}
            <span class="subObjectStyle" v-if="subObjectCount(sceneObject)">
                [{{ sceneObject.subobjects.length }}]
            </span>
        </v-chip>
    </div>
</template>

<script>
    import ConfigureSceneObjectModal from "@/components/modals/sceneObject/ConfigureSceneObjectModal.vue";
    import { getSceneObjectTypeLabel } from "@/javascript/utils/sceneObjectTypesUtils";
    import { openModal } from "jenesius-vue-modal";
    import { defineComponent } from "vue";
    import { useProjectStore } from "@/stores/project";
    import { mapActions, mapState } from "pinia";
    import { isEmpty } from "lodash";

    export default defineComponent({
        methods: {
            ...mapActions(useProjectStore, ["deleteSceneObject"]),

            configureSceneObject(sceneObject, event) {
                if (event.target.localName === "i") return;
                openModal(ConfigureSceneObjectModal, { sceneObject });
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

            subObjectCount() {
                return (sceneObject) => {
                    return !isEmpty(sceneObject.subobjects);
                }
            }
        },
    });
</script>

<style>
    .subObjectStyle {
        margin-left: 5px;
        color: gray;
    }
</style>
