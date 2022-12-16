import { sendRequest } from "@/javascript/utils/axiosUtils";
import { getDialogDataForProject, getDialogDataForConverter } from "@/javascript/utils/dialogUtils";

export default {
    namespaced: true,
    state: {
        projects: [],
        converters: [],
    },

    getters: {
        projects(state) {
            return state.projects;
        },

        converters(state) {
            return state.converters;
        },
    },

    mutations: {
        setProjects(state, projects) {
            state.projects = projects;
        },

        setConverters(state, converters) {
            state.converters = converters;
        },
    },

    actions: {
        updateProjects({ commit }) {
            sendRequest("/project/findAll", null, "GET").then((responseData) => {
                responseData.forEach((project) => {
                    project.dialogData = getDialogDataForProject(project);
                });
                commit("setProjects", responseData);
            });
        },

        updateConverters({ commit }) {
            sendRequest("/converter/findAll", null, "GET").then((responseData) => {
                responseData.forEach((converter) => {
                    converter.dialogData = getDialogDataForConverter(converter);
                });
                commit("setConverters", responseData);
            });
        },
    },
};
