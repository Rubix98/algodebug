<template>
    <div class="scene-objects-panel-container">
        <div
            class="scene-object-tile flex-vertical-space-between"
            v-for="(sceneObject, index) in sceneObjects"
            :key="index"
            @click="configureSceneObject(sceneObject, $event)"
        >
            {{ sceneObject.type.label }} {{ sceneObject.variable ? sceneObject.variable.name : "null" }}
            <AlgoIcon type="x" @click="deleteSceneObject(index)" />
        </div>
    </div>
</template>

<script>
import AlgoIcon from "@/components/global/AlgoIcon";
import ConfigureSceneObjectModal from "@/components/modals/sceneObject/ConfigureSceneObjectModal.vue";
import { mapActions, mapGetters } from "vuex";
import { openModal } from "jenesius-vue-modal";

export default {
    components: { AlgoIcon },

    methods: {
        ...mapActions("project", ["deleteSceneObject"]),

        configureSceneObject(sceneObject, event) {
            if (event.target.localName === "i") return;
            openModal(ConfigureSceneObjectModal, { sceneObject });
        },
    },

    computed: {
        ...mapGetters("project", ["sceneObjects"]),
    },
};
</script>

<style scoped>
.scene-object-tile {
    margin: 5px;
    padding: 5px 10px;
    border-radius: 10px;
    gap: 10px;
    background: linear-gradient(#427aa1, #05668d);
    color: white;
    cursor: pointer;
}
</style>
