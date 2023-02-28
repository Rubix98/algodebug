<template>
    <AlgoModal title="Wczytaj projekt">
        <AlgoPickList :options="this.projectsWithHrefs" />
    </AlgoModal>
</template>

<script>
    import AlgoModal from "@/components/global/AlgoModal.vue";
    import AlgoPickList from "@/components/global/AlgoPickList.vue";
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
        },

        computed: {
            ...mapState(useCachedListStore, ["projects"]),

            projectsWithHrefs() {
                return this.projects.map((project) => {
                    return { ...project, href: "?projectId=" + project._id };
                });
            },
        },
    });
</script>
