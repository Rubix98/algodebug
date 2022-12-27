<template>
    <AlgoModal title="Wczytaj projekt">
        <AlgoPickList :options="this.projects" @selectOptionEvent="loadProject" />
    </AlgoModal>
</template>

<script>
import AlgoModal from "@/components/global/AlgoModal.vue";
import AlgoPickList from "@/components/global/AlgoPickList.vue";
import { redirectTo } from "@/javascript/utils/other";
import { defineComponent } from "vue";
import { mapActions, mapGetters } from "vuex";

export default defineComponent({
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
});
</script>
