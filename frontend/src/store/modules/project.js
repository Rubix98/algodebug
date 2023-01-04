import { sendRequest } from "@/javascript/utils/axiosUtils";
import { CodeParser } from "@/javascript/codeParser/CodeParser";

export default {
    namespaced: true,
    state: {
        _id: null,
        title: "",
        code: '#include <iostream>\nusing namespace std;\n\nint main() {\n\tcout << "Hello world" << endl;\n}',
        language: "cpp",
        breakpoints: [],
        testData: [{ id: 0, input: "" }],
        sceneObjects: [],
        isRunning: false,
        waitingForCompile: false,
        currentTestCaseId: 0,
        currentFrameId: 0,
    },

    getters: {
        debugCode(state, getters) {
            return new CodeParser(state.code, getters.variables, state.breakpoints, getters.converters).parse();
        },

        variables(_, getters) {
            return getters.sceneObjectsFlat
                .filter((sceneObject) => sceneObject.variable != null)
                .map((sceneObject) => sceneObject.variable);
        },

        converters(_, getters) {
            return getters.sceneObjectsFlat
                .filter((sceneObject) => sceneObject.converter != null)
                .map((sceneObject) => sceneObject.converter);
        },

        sceneObjectsFlat(state) {
            return state.sceneObjects.flatMap((sceneObject) => [sceneObject, ...sceneObject.subobjects]);
        },

        currentTestCase(state) {
            return state.testData.findById(state.currentTestCaseId);
        },

        currentFrame(state, getters) {
            return getters.currentTestCase.frames.findById(state.currentFrameId);
        },

        numberOfFrames(_, getters) {
            return getters.currentTestCase.frames.length;
        },

        jsonForSave(state) {
            return (override, title = null) => {
                let result = {
                    _id: override ? state._id : undefined,
                    title: title ?? state.title,
                };
                ["code", "language", "breakpoints", "testData", "sceneObjects"].forEach(
                    (property) => (result[property] = state[property])
                );

                return result;
            };
        },

        jsonForCompile(state, getters) {
            return {
                code: getters.debugCode,
                language: state.language,
                inputs: state.testData.map((testCase) => testCase.input),
            };
        },
    },

    mutations: {
        /* Setters */
        set(state, { key, value }) {
            state[key] = value;
        },

        setProject(state, project) {
            ["_id", "title", "code", "breakpoints", "language", "testData", "sceneObjects", "title"].forEach(
                (property) => (state[property] = project[property])
            );
            state.currentTestCaseId = project.testData.firstId();
        },

        switchCurrentTestCase(state, index) {
            state.currentTestCaseId = index;
        },

        switchCurrentFrame(state, index) {
            state.currentFrameId = index;
        },

        /* Breakpoints */
        toggleBreakpoint(state, id) {
            state.breakpoints.toggleElement({ id: id });
        },

        /* TestData */
        addTestCase(state) {
            state.testData.addElement({ input: "" });
        },

        deleteTestCase(state, id) {
            state.testData.deleteById(id);
        },

        updateCurrentTestCaseInput(state, newValue) {
            state.testData.findById(state.currentTestCaseId).input = newValue;
        },

        addOutputs(state, outputs) {
            state.testData.forEach((testCase, index) => {
                Object.assign(testCase, outputs[index].output);
            });
        },

        /* SceneObjects */
        addSceneObject(state, sceneObject) {
            state.sceneObjects.addElement(sceneObject);
        },

        deleteSceneObject(state, id) {
            state.sceneObjects.deleteById(id);
        },

        updateSceneObjectPosition(state, { id, position }) {
            state.sceneObjects.findById(id).position = position;
        },

        /* Variables */
        updateVariable(state, { id, variable }) {
            variable.id = variable.name = state.code.substring(variable.start, variable.end);
            state.sceneObjects
                .flatMap((sceneObject) => [sceneObject, ...sceneObject.subobjects])
                .find((sceneObject) => sceneObject.variable?.id === id).variable = variable;
        },

        deleteVariable(state, id) {
            state.sceneObjects
                .flatMap((sceneObject) => [sceneObject, ...sceneObject.subobjects])
                .find((sceneObject) => sceneObject.variable?.id === id).variable = null;
        },
    },

    actions: {
        /* Setters */
        setCode: ({ commit }, newValue) => commit("set", { key: "code", value: newValue }),
        setBreakpoints: ({ commit }, newValue) => commit("set", { key: "breakpoints", value: newValue }),
        setIsRunning: ({ commit }, newValue) => commit("set", { key: "isRunning", value: newValue }),
        setWaitingForCompile: ({ commit }, newValue) => commit("set", { key: "waitingForCompile", value: newValue }),
        switchCurrentTestCase: ({ commit }, index) => commit("switchCurrentTestCase", index),
        switchCurrentFrame: ({ commit }, index) => commit("switchCurrentFrame", index),

        /* Breakpoints */
        toggleBreakpoint: ({ commit }, id) => commit("toggleBreakpoint", id),

        /* TestData */
        addTestCase: ({ commit }) => commit("addTestCase"),
        deleteTestCase: ({ commit }, id) => commit("deleteTestCase", id),
        updateCurrentTestCaseInput: ({ commit }, newValue) => commit("updateCurrentTestCaseInput", newValue),

        /* SceneObjects */
        addSceneObject: ({ commit }, sceneObject) => commit("addSceneObject", sceneObject),
        deleteSceneObject: ({ commit }, index) => commit("deleteSceneObject", index),
        updateSceneObjectPosition: ({ commit }, payload) => commit("updateSceneObjectPosition", payload),

        /* Variables */
        updateVariable: ({ commit }, payload) => commit("updateVariable", payload),
        deleteVariable: ({ commit }, id) => commit("deleteVariable", id),

        /* Logic */
        loadProject({ commit }, projectId) {
            sendRequest("/project/find/" + projectId, null, "GET").then((responseData) => {
                commit("setProject", responseData);
            });
        },

        saveProject({ commit, getters }, { override, title }) {
            sendRequest("/project/save", getters.jsonForSave(override, title), override ? "PUT" : "POST").then(
                (responseData) => {
                    commit("set", { key: "id", value: responseData.id });
                    commit("set", { key: "title", value: responseData.title });
                }
            );
        },

        compile({ commit, getters }) {
            commit("set", { key: "waitingForCompile", value: true });
            return sendRequest("/compiler/compile", getters.jsonForCompile, "POST")
                .then((responseData) => {
                    commit("addOutputs", responseData);
                    commit("set", { key: "isRunning", value: true });
                    return true;
                })
                .finally(() => {
                    commit("set", { key: "waitingForCompile", value: false });
                });
        },
    },
};
