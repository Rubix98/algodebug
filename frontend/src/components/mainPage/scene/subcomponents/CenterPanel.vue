<template>
    <div class="center-panel-container flex-center">
        <v-btn @click="addNewSceneObject()" prepend-icon="mdi-plus-circle" size="x-large" variant="tonal">
            Dodaj nowy obiekt
        </v-btn>
    </div>
</template>

<script>
    import ConfigureSceneObjectModal from "@/components/modals/sceneObject/ConfigureSceneObjectModal.vue";
    import { openModal } from "jenesius-vue-modal";
    import { defineComponent } from "vue";

    export default defineComponent({
        methods: {
            addNewSceneObject() {
                openModal(ConfigureSceneObjectModal);
            },
        },
    });
</script>
