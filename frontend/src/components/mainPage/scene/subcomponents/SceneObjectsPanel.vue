<template>
    <div class="scene-objects-panel-container">
        <v-chip
            closable
            v-for="sceneObject in project.sceneObjects"
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
    import { mapActions, mapState } from "vuex";
    import { openModal } from "jenesius-vue-modal";
    import { defineComponent } from "vue";

    export default defineComponent({
        methods: {
            ...mapActions("project", ["deleteSceneObject"]),

            configureSceneObject(sceneObject, event) {
                if (event.target.localName === "i") return;
                openModal(ConfigureSceneObjectModal, { sceneObject });
            },
        },

        computed: {
            ...mapState(["project"]),

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
