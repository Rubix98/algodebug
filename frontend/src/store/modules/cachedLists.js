import { sendRequest } from "@/javascript/utils/axiosUtils";
import { getDialogDataForProject, getDialogDataForConverter } from "@/javascript/utils/dialogUtils";

export default {
    namespaced: true,
    state: {
        projectsList: [],
        convertersList: [],
    },

    getters: {
        projectsList(state) {
            return state.projectsList;
        },

        convertersList(state) {
            return state.convertersList;
        },
    },

    mutations: {
        setProjectsList(state, projectsList) {
            state.projectsList = projectsList;
        },

        setConvertersList(state, convertersList) {
            state.convertersList = convertersList;
        },
    },

    actions: {
        updateProjectsList({ commit }) {
            sendRequest("/project/findAll", null, "GET").then((responseData) => {
                responseData.forEach((project) => {
                    project.dialogData = getDialogDataForProject(project);
                });
                commit("setProjectsList", responseData);
            });
        },

        updateConvertersList({ commit }) {
            sendRequest("/converter/findAll", null, "GET").then((responseData) => {
                responseData.forEach((converter) => {
                    converter.dialogData = getDialogDataForConverter(converter);
                });
                commit("setConvertersList", responseData);
            });
        },
    },
};
