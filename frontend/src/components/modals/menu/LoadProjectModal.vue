<template>
    <AlgoModal title="Wczytaj projekt">
        <AlgoPickList :options="projectsList" @selectOptionEvent="loadProject" />
    </AlgoModal>
</template>

<script>
import AlgoModal from "@/components/global/AlgoModal.vue";
import AlgoPickList from "@/components/global/AlgoPickList.vue";
import { redirectTo } from "@/javascript/utils/other";
import { mapActions, mapGetters } from "vuex";

export default {
    components: { AlgoModal, AlgoPickList },

    created() {
        this.updateProjectsList();
    },

    methods: {
        ...mapActions("cachedLists", ["updateProjectsList"]),

        loadProject(selectedProject) {
            redirectTo("?projectId=" + selectedProject._id);
        },
    },

    computed: {
        ...mapGetters("cachedLists", ["projectsList"]),
    },
};
</script>

<style scoped>
.dialog {
    width: 60vw;
}
</style>
