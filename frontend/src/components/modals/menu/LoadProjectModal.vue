<template>
    <AlgoModal title="Wczytaj projekt">
        <v-list lines="two">
            <v-list-item :key="project._id" v-for="project in this.projectsWithHrefs" @click="redirectTo(project.href)">
                <v-list-item-title>
                    {{ project.title }}
                </v-list-item-title>
                <v-list-item-subtitle>
                    Autor: {{ project.author.username }} <br />
                    Data modyfikacji: {{ project.modificationDate }}
                </v-list-item-subtitle>
                <template v-slot:append>
                    <v-btn
                        icon="mdi-delete"
                        variant="text"
                        v-if="shouldShowButton(project)"
                        @click.stop="deleteProject(project)"
                    />
                </template>
            </v-list-item>
        </v-list>
    </AlgoModal>
</template>

<script>
    import AlgoModal from "@/components/global/AlgoModal.vue";
    import { defineComponent } from "vue";
    import { useCachedListStore } from "@/stores/cachedList";
    import { mapActions, mapState } from "pinia";
    import { pushModal } from "jenesius-vue-modal";
    import DeleteProjectModal from "@/components/modals/menu/DeleteProjectModal.vue";
    import { canUserEditProject } from "@/javascript/utils/authorizationUtils";
    import { useUserStore } from "@/stores/user";
    import { redirectTo } from "@/javascript/utils/other";

    export default defineComponent({
        components: { AlgoModal },

        created() {
            this.updateProjects();
        },

        methods: {
            redirectTo,
            ...mapActions(useCachedListStore, ["updateProjects"]),

            deleteProject(project) {
                pushModal(DeleteProjectModal, { projectToDelete: project });
            },

            shouldShowButton(project) {
                return canUserEditProject(this.user, project);
            },
        },

        computed: {
            ...mapState(useCachedListStore, ["projects"]),
            ...mapState(useUserStore, ["user"]),

            projectsWithHrefs() {
                return this.projects.map((project) => {
                    return { ...project, href: "?projectId=" + project._id };
                });
            },
        },
    });
</script>
