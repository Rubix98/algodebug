<template>
    <div class="center-panel-container flex-center">
        <AlgoButton @click="addNewSceneObject()" icon="mdi-plus-circle" size="x-large"> Dodaj nowy obiekt </AlgoButton>
    </div>
</template>

<script>
import AlgoButton from "@/components/global/AlgoButton";
import ConfigureSceneObjectModal from "@/components/modals/sceneObject/ConfigureSceneObjectModal.vue";
import { openModal } from "jenesius-vue-modal";
import { defineComponent } from "vue";

export default defineComponent({
    components: { AlgoButton },

    methods: {
        addNewSceneObject() {
            openModal(ConfigureSceneObjectModal);
        },
    },
});
</script>
