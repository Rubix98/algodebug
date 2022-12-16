<template>
    <AlgoModal title="Wczytaj projekt">
        <AlgoPickList :options="projects" @selectOptionEvent="loadProject" />
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
        this.updateProjects();
    },

    methods: {
        ...mapActions("cachedLists", ["updateProjects"]),

        loadProject(selectedProject) {
            redirectTo("?projectId=" + selectedProject._id);
        },
    },

    computed: {
        ...mapGetters("cachedLists", ["projects"]),
    },
};
</script>

<style scoped>
.dialog {
    width: 60vw;
}
</style>
