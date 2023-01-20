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
        </v-chip>
    </div>
</template>

<script>
    import ConfigureSceneObjectModal from "@/components/modals/sceneObject/ConfigureSceneObjectModal.vue";
    import { getSceneObjectTypeLabel } from "@/javascript/utils/sceneObjectTypesUtils";
    import { openModal } from "jenesius-vue-modal";
    import { defineComponent } from "vue";
    import { useProjectStore } from "@/stores/project";
    import { storeToRefs } from "pinia";

    export default defineComponent({
        setup() {
            const store = useProjectStore();

            const { deleteSceneObject } = store;

            const { sceneObjects } = storeToRefs(store);

            return { deleteSceneObject, sceneObjects };
        },
        methods: {
            configureSceneObject(sceneObject, event) {
                if (event.target.localName === "i") return;
                openModal(ConfigureSceneObjectModal, { sceneObject });
            },
        },

        computed: {
            sceneObjectLabel() {
                return (sceneObject) => {
                    return `${getSceneObjectTypeLabel(sceneObject.type)} ${
                        sceneObject.variable ? sceneObject.variable.name : "null"
                    }`;
                };
            },
        },
    });
</script>
