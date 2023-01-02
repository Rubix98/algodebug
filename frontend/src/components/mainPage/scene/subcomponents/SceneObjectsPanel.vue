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
            {{ sceneObject.type.label }} {{ sceneObject.variable ? sceneObject.variable.name : "null" }}
        </v-chip>
    </div>
</template>

<script>
    import ConfigureSceneObjectModal from "@/components/modals/sceneObject/ConfigureSceneObjectModal.vue";
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
        },
    });
</script>
