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
    import { useCachedListStore } from "@/stores/cachedList";
    import { mapActions, mapState } from "pinia";

    export default defineComponent({
        components: { AlgoModal, AlgoPickList },

        created() {
            this.updateProjects();
        },

        methods: {
            ...mapActions(useCachedListStore, ["updateProjects"]),
            loadProject(selectedProject) {
                redirectTo("?projectId=" + selectedProject._id);
            },
        },

        computed: {
            ...mapState(useCachedListStore, ["projects"]),
        },
    });
</script>
