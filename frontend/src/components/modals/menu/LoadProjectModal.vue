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
    import { storeToRefs } from "pinia";

    export default defineComponent({
        components: { AlgoModal, AlgoPickList },

        setup() {
            const store = useCachedListStore();

            const { updateProjects } = store;

            const { projects } = storeToRefs(store);

            return { updateProjects, projects };
        },

        created() {
            this.updateProjects();
        },

        methods: {
            loadProject(selectedProject) {
                redirectTo("?projectId=" + selectedProject._id);
            },
        },
    });
</script>
