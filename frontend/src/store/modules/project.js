import { sendRequest } from "@/javascript/utils/axiosUtils";
import { CodeParser } from "@/javascript/codeParser/CodeParser";

export default {
    namespaced: true,
    state: {
        id: null,
        code: '#include <iostream>\nusing namespace std;\n\nint main() {\n\tcout << "Hello world" << endl;\n}',
        language: "cpp",
        breakpoints: [],
        testData: [{ id: 0, input: "" }],
        sceneObjects: [],
        isRunning: false,
        waitingForCompile: false,
        selectedTestCaseId: 0,
        selectedFrameId: 0,
    },

    getters: {
        variables(state) {
            return state.sceneObjects
                .flatMap((sceneObject) => [sceneObject, ...sceneObject.subobjects])
                .filter((sceneObject) => sceneObject.variable != null)
                .map((sceneObject) => sceneObject.variable)
                .map((variable) => ({ id: variable.name, ...variable }));
        },

        converters(state) {
            return state.sceneObjects
                .flatMap((sceneObject) => [sceneObject, ...sceneObject.subobjects])
                .filter((sceneObject) => sceneObject.converter != null)
                .map((sceneObject) => sceneObject.converter)
                .map((converter) => ({ id: converter.code, ...converter }));
        },

        debugCode(state, getters) {
            return new CodeParser(state.code, getters.variables, state.breakpoints, getters.converters).parse();
        },

        currentTestCase(state) {
            return state.testData.findById(state.selectedTestCaseId);
        },

        numberOfTestCases(state) {
            return state.testData.length;
        },

        currentFrame(state, getters) {
            return getters.currentTestCase.frames.findById(state.selectedFrameId);
        },

        numberOfFrames(_, getters) {
            return getters.currentTestCase.frames.length;
        },
    },

    mutations: {
        set(state, { key, value }) {
            state[key] = value;
        },

        addTestCase(state) {
            state.testData.addElement({ input: "" });
        },

        deleteTestCase(state, id) {
            state.testData.deleteById(id);
        },

        changeCurrentTestCase(state, index) {
            state.selectedTestCaseId = index;
        },

        changeCurrentFrame(state, index) {
            state.selectedFrameId = index;
        },

        updateCurrentTestCaseInput(state, newValue) {
            state.testData.findById(state.selectedTestCaseId).input = newValue;
        },

        addSceneObject(state, sceneObject) {
            state.sceneObjects.addElement(sceneObject);
        },

        deleteSceneObject(state, id) {
            state.sceneObjects.deleteById(id);
        },

        updateSceneObjectPosition(state, { id, position }) {
            state.sceneObjects.findById(id).position = position;
        },

        setProject(state, project) {
            // TODO: Zmienić strukturę tych obiektów w bazie danych
            project.breakpoints.forEach((breakpoint) => (breakpoint.id = breakpoint._id));
            project.sceneObjects.forEach((sceneObject) => {
                if (sceneObject.converter) {
                    sceneObject.converter = { ...sceneObject.converter, id: sceneObject.converter._id };
                }

                sceneObject.subobjects.forEach((subobject) => {
                    if (subobject.converter) {
                        subobject.converter = { ...subobject.converter, id: subobject.converter._id };
                    }
                });
            });

            // TODO: Dynamiczne przepisywanie
            state.id = project._id;
            state.code = project.code;
            state.breakpoints = project.breakpoints;
            state.language = project.language;
            state.testData = project.testCases;
            state.sceneObjects = project.sceneObjects;
            state.title = project.title;
            state.author = project.author;
            state.description = project.description;

            state.selectedTestCaseId = project.testCases.firstId();
        },

        addOutputs(state, outputs) {
            for (let i in state.testData) {
                state.testData[i] = {
                    ...state.testData[i],
                    ...outputs[i].output,
                };
            }
        },

        removeOutdatedVariables(state, handlerFunction) {
            state.sceneObjects.forEach(handlerFunction);
        },

        toggleBreakpoint(state, id) {
            state.breakpoints.toggleElement({ id: id });
        },

        renameVariables(state, sceneObject) {
            sceneObject.variable.id = sceneObject.variable.name = state.code.substring(
                sceneObject.variable.start,
                sceneObject.variable.end
            );

            sceneObject.subobjects.forEach((subObj) => {
                subObj.variable.id = subObj.variable.name = state.code.substring(
                    subObj.variable.start,
                    subObj.variable.end
                );
            });
        },
    },

    actions: {
        setIsRunning: ({ commit }, newValue) => commit("set", { key: "isRunning", value: newValue }),
        setCode: ({ commit }, newValue) => commit("set", { key: "code", value: newValue }),
        setBreakpoints: ({ commit }, newValue) => commit("set", { key: "breakpoints", value: newValue }),
        addTestCase: ({ commit }) => commit("addTestCase"),
        deleteTestCase: ({ commit }, id) => commit("deleteTestCase", id),
        changeCurrentTestCase: ({ commit }, index) => commit("changeCurrentTestCase", index),
        changeCurrentFrame: ({ commit }, index) => commit("changeCurrentFrame", index),
        updateCurrentTestCaseInput: ({ commit }, newValue) => {
            commit("updateCurrentTestCaseInput", newValue);
        },
        deleteSceneObject: ({ commit }, index) => commit("deleteSceneObject", index),
        updateSceneObjectPosition: ({ commit }, payload) => commit("updateSceneObjectPosition", payload),

        addSceneObject({ commit }, sceneObject) {
            commit("addSceneObject", sceneObject);
        },

        loadProject({ commit }, projectId) {
            sendRequest("/project/find/" + projectId, null, "GET").then((responseData) => {
                commit("setProject", responseData);
            });
        },

        saveProject({ commit, state }, { title, override }) {
            sendRequest(
                "/project/save",
                {
                    _id: override ? state.id : null,
                    title: title,
                    language: state.language,
                    code: state.code,
                    breakpoints: state.breakpoints,
                    testCases: state.testData,
                    sceneObjects: state.sceneObjects,
                    author: state.author ? state.author : "AlgoDebug",
                    description: state.description ? state.description : null,
                },
                "PUT"
            ).then((responseData) => {
                commit("set", { key: "id", value: responseData.id });
                commit("set", { key: "title", value: responseData.title });
            });
        },

        compile({ commit, state, getters }) {
            commit("set", { key: "waitingForCompile", value: true });
            const inputs = state.testData.map((testCase) => testCase.input);
            return sendRequest(
                "/compiler/compile",
                {
                    code: getters.debugCode,
                    language: "cpp",
                    inputs: inputs,
                },
                "POST"
            )
                .then((responseData) => {
                    commit("addOutputs", responseData);
                    commit("set", { key: "isRunning", value: true });
                    commit("set", { key: "waitingForCompile", value: false });
                    return true;
                })
                .catch(() => {
                    commit("set", { key: "waitingForCompile", value: false });
                });
        },

        removeOutdatedVariables: ({ commit }, handlerFunction) => commit("removeOutdatedVariables", handlerFunction),
        toggleBreakpoint: ({ commit }, id) => commit("toggleBreakpoint", id),
        renameVariables: ({ commit }, sceneObject) => commit("renameVariables", sceneObject),
    },
};
