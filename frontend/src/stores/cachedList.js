import { defineStore } from "pinia";
import { sendRequest } from "@/javascript/utils/axiosUtils";
import { getDialogDataForConverter, getDialogDataForProject } from "@/javascript/utils/dialogUtils";

export const useCachedListStore = defineStore("cachedList", {
    state: () => ({
        projects: [],
        converters: [],
    }),

    actions: {
        updateProjects() {
            sendRequest("/project/findAll", null, "GET").then((responseData) => {
                if (!responseData) return;

                responseData.forEach((project) => {
                    project.dialogData = getDialogDataForProject(project);
                });
                this.projects = responseData;
            });
        },

        updateConverters() {
            sendRequest("/converter/findAll", null, "GET").then((responseData) => {
                if (!responseData) return;

                responseData.forEach((converter) => {
                    converter.dialogData = getDialogDataForConverter(converter);
                });
                this.converters = responseData;
            });
        },
    },
});
