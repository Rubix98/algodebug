<template>
    <AlgoModal title="Usuń projekt">
        <div v-if="showLoading" class="deleting-progress">
            <v-progress-circular indeterminate color="primary" />
            <p>Usuwanie projektu...</p>
        </div>
        <div v-else class="delete-info">
            <p class="title">Zamierzasz usunąć projekt "{{ projectToDelete.title }}".</p>
            <p class="warning">
                Usunięcie projektu jest operacją nieodwracalną. Nie ma późniejszej możliwości go odzyskania.
            </p>
        </div>
        <template #buttons>
            <v-btn color="primary" @click="this.onDeleteProject">Usuń projekt</v-btn>
        </template>
    </AlgoModal>
</template>

<script>
    import AlgoModal from "@/components/global/AlgoModal.vue";
    import { defineComponent } from "vue";
    import { mapActions, mapState } from "pinia";
    import { useProjectStore } from "@/stores/project";
    import { popModal } from "jenesius-vue-modal";
    import { deleteProject } from "@/javascript/utils/projectUtils";
    import { useCachedListStore } from "@/stores/cachedList";

    export default defineComponent({
        name: "DeleteProjectModal",

        components: { AlgoModal },

        props: ["projectToDelete"],

        data() {
            return {
                showLoading: false,
            };
        },

        methods: {
            ...mapActions(useCachedListStore, ["updateProjects"]),

            onDeleteProject() {
                this.showLoading = true;
                const projectIdToDelete = this.projectToDelete !== undefined ? this.projectToDelete._id : this.id;

                deleteProject(projectIdToDelete)
                    .then(() => {
                        popModal();
                        this.updateProjects();
                        if (projectIdToDelete === this.projectId) {
                            window.location.href = "/";
                        }
                    })
                    .finally(() => {
                        this.showLoading = false;
                    });
            },
        },

        computed: {
            ...mapState(useProjectStore, ["projectId"]),
        },
    });
</script>

<style lang="scss" scoped>
    div.deleting-progress {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    p {
        line-height: 2rem;

        &.warning {
            color: red;
        }

        &.title {
            font-weight: bold;
            font-size: large;
        }
    }
</style>
