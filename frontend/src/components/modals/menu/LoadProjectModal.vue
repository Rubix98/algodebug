<template>
    <AlgoModal title="Wczytaj projekt">
        <AlgoPickList :options="projects" @selectOptionEvent="loadProject" />
    </AlgoModal>
</template>

<script>
import AlgoModal from "@/components/global/AlgoModal.vue";
import AlgoPickList from "@/components/global/AlgoPickList.vue";
import { sendRequest } from "@/javascript/utils/axiosUtils";
import { redirectTo } from "@/javascript/utils/other";
import { getDialogDataForProject } from "@/javascript/utils/dialogUtils";
import { defineComponent } from "vue";

export default defineComponent({
    components: { AlgoModal, AlgoPickList },
    data() {
        return {
            projects: [],
        };
    },

    created() {
        sendRequest("/project/findAll", null, "GET").then((responseData) => {
            this.projects = responseData;
            this.projects.forEach((project) => {
                project.dialogData = getDialogDataForProject(project);
            });
        });
    },

    methods: {
        loadProject(selectedProject) {
            redirectTo("?projectId=" + selectedProject._id);
        },
    },
});
</script>
