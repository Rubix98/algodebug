import { defineStore } from "pinia";
import { sendRequest } from "@/javascript/utils/axiosUtils";
import { CodeParser } from "@/javascript/codeParser/CodeParser";

export const useProjectStore = defineStore("project", {
    state: () => ({
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
    }),

    getters: {
        debugCode() {
            return new CodeParser(
                this.code,
                this.sceneObjectsFlat,
                this.variables,
                this.breakpoints,
                this.converters
            ).parse();
        },

        variables() {
            return this.sceneObjectsFlat
                .filter((sceneObject) => sceneObject.variables != null)
                .map((sceneObject) => sceneObject.variables)
                .flat()
                .unique();
        },

        converters() {
            return this.sceneObjectsFlat
                .filter((sceneObject) => sceneObject.converter != null)
                .map((sceneObject) => sceneObject.converter)
                .unique("_id");
        },

        sceneObjectsFlat() {
            return this.sceneObjects.flatMap((sceneObject) => [
                sceneObject,
                ...sceneObject.subobjects.map((subObject) => {
                    return { ...subObject, id: sceneObject.id + "_" + subObject.id };
                }),
            ]);
        },

        currentTestCase() {
            return this.testData.findById(this.currentTestCaseId);
        },

        currentFrame() {
            return this.currentTestCase.frames.findById(this.currentFrameId);
        },

        numberOfFrames() {
            return this.currentTestCase.frames.length;
        },

        allFrames() {
            return this.currentTestCase.frames;
        },

        jsonForSave() {
            return (override, title = null) => {
                let result = {
                    _id: override ? this._id : undefined,
                    title: title ?? this.title,
                };
                ["code", "language", "breakpoints", "testData", "sceneObjects"].forEach(
                    (property) => (result[property] = this[property])
                );

                return result;
            };
        },

        jsonForCompile() {
            return {
                code: this.debugCode,
                language: this.language,
                inputs: this.testData.map((testCase) => testCase.input),
            };
        },

        projectTitle() {
            return this.title;
        },
    },

    actions: {
        /* Setters */
        setCode(newValue) {
            this.code = newValue;
        },
        setBreakpoints(newValue) {
            this.breakpoints = newValue;
        },
        setIsRunning(newValue) {
            this.isRunning = newValue;
        },
        setWaitingForCompile(newValue) {
            this.waitingForCompile = newValue;
        },
        switchCurrentTestCase(index) {
            this.currentTestCaseId = index;
        },
        switchCurrentFrame(index) {
            this.currentFrameId = index;
        },

        /* Breakpoints */
        toggleBreakpoint(id) {
            this.breakpoints.toggleElement({ id: id });
        },

        /* TestData */
        addTestCase() {
            this.testData.addElement({ input: "" });
        },
        deleteTestCase(id) {
            this.testData.deleteById(id);
        },
        updateCurrentTestCaseInput(newValue) {
            this.testData.findById(this.currentTestCaseId).input = newValue;
        },

        /* SceneObjects */
        addSceneObject(sceneObject) {
            this.sceneObjects.addElement(sceneObject);
        },
        deleteSceneObject(index) {
            this.sceneObjects.deleteById(index);
        },
        updateSceneObjectPosition(payload) {
            this.sceneObjects.findById(payload.id).position = payload.position;
        },

        /* Variables */
        updateVariable(payload) {
            const { id, variable } = payload;
            variable.name = this.code.substring(variable.start, variable.end);
            variable.id = variable.name + "@" + variable.start;
            this.sceneObjects
                .flatMap((sceneObject) => [sceneObject, ...sceneObject.subobjects])
                .forEach((sceneObject) => {
                    sceneObject.variables.forEach((oldVariable, index) => {
                        if (oldVariable.id === id) sceneObject.variables[index] = variable;
                    });
                });
        },
        deleteVariable(id) {
            this.sceneObjects
                .flatMap((sceneObject) => [sceneObject, ...sceneObject.subobjects])
                .forEach((sceneObject) => {
                    sceneObject.variables = sceneObject.variables.filter((oldVariable) => {
                        oldVariable.id !== id;
                    });
                });
        },

        /* Logic */
        loadProject(projectId) {
            sendRequest("/project/find/" + projectId, null, "GET").then((responseData) => {
                const project = responseData;
                ["_id", "title", "code", "breakpoints", "language", "testData", "sceneObjects", "title"].forEach(
                    (property) => (this[property] = project[property])
                );
                this.currentTestCaseId = project.testData.firstId();
            });
        },

        saveProject(title, override) {
            if (override || this.title == "") this.title = title;
            sendRequest("/project/save", this.jsonForSave(override, title), override ? "PUT" : "POST").then(
                (responseData) => {
                    if (this._id == null) this._id = responseData.insertedId;
                }
            );
        },

        compile() {
            this.waitingForCompile = true;
            return sendRequest("/compiler/compile", this.jsonForCompile, "POST")
                .then((responseData) => {
                    this.testData.forEach((testCase, index) => {
                        Object.assign(testCase, responseData[index].output);
                    });
                    this.isRunning = true;
                    return true;
                })
                .finally(() => {
                    this.waitingForCompile = false;
                });
        },
    },
});
