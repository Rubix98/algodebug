import { sendRequest } from "@/javascript/utils/axiosUtils";
import { CodeParser } from "@/javascript/codeParser/CodeParser";

export default {
  namespaced: true,
  state: {
    id: null,
    code: '#include <iostream>\nusing namespace std;\n\nint main() {\n\tcout << "Hello world" << endl;\n}',
    language: 'cpp',
    breakpoints: new Map(),
    testData: [{input: 'a'}],
    sceneObjects: [],
    isRunning: false,
    selectedTestCaseId: 0,
    selectedFrameId: 0,
  },

  getters: {
    variables(state) {
      let variables = new Map();
      for (let sceneObject of state.sceneObjects) {
        if (sceneObject.variable) {
          sceneObject.variable.id = sceneObject.variable.name;
          variables.addElement(sceneObject.variable);
        }
        
        for (let subobject of sceneObject.subobjects) {
          if (subobject.variable) {
            subobject.variable.id = subobject.variable.name;
            variables.addElement(subobject.variable);
          }
          
        }
      }
      return variables;
    },
  
    converters(state) {
      let converters = new Map();
        for (let sceneObject of state.sceneObjects) {
          if (sceneObject.converter) {
            converters.addElement(sceneObject.converter);
          }
          
          for (let subobject of sceneObject.subobjects) {
            if (subobject.converter) {
              converters.addElement(subobject.converter);
            }
          }
        }
        return converters;
    },

    debugCode(state, getters) {
      return new CodeParser(state.code, getters.variables, state.breakpoints, getters.converters).parse();
    },

    currentTestCase(state) {
      return state.testData[state.selectedTestCaseId];
    },
  
    currentFrame(state, getters) {
      return getters.currentTestCase.frames[state.selectedFrameId];
    },

    numberOfTestCases(state) {
      return state.testData.length;
    },

    numberOfFrames(state, getters) {
      return getters.currentTestCase.frames.length;
    }

  },

  mutations: {
    set(state, {key, value}) {
      state[key] = value;
    },

    addTestCase(state) {
      state.testData.push({input: 'b'});
    }, 

    deleteTestCase(state, index) {
      state.testData.splice(index, 1);
    },

    changeCurrentTestCase(state, index) {
      state.selectedTestCaseId = index;
    },
  
    changeCurrentFrame(state, index) {
      state.selectedFrameId = index;
    },

    updateCurrentTestCaseInput(state, newValue) {
      state.testData[state.selectedTestCaseId].input = newValue
    },

    deleteSceneObject(state, index) {
      state.sceneObjects.splice(index, 1);
    },

    setProject(state, project) { // TODO: Dynamiczne przepisywanie
      state.id = project.id;
      state.code = project.code;
      state.breakpoints = new Map(project.breakpoints.map(breakpoint => {
        return [breakpoint.id, breakpoint];
      })); // TODO: array -> map/set
      state.language = project.language;
      state.testData = project.testCases;
      state.sceneObjects = project.sceneObjects;
      state.title = project.title;
    }
  },

  actions: {
    setIsRunning: ({commit}, newValue) => commit('set', {key: 'isRunning', value: newValue}), 
    setCode: ({commit}, newValue) => commit('set', {key: 'code', value: newValue}), 
    addTestCase: ({commit}) => commit('addTestCase'), 
    deleteTestCase: ({commit}, index) => commit('deleteTestCase', index), 
    changeCurrentTestCase: ({commit}, x) => commit('changeCurrentTestCase', x), 
    changeCurrentFrame: ({commit}, index) => commit('changeCurrentFrame', index),
    updateCurrentTestCaseInput: ({commit}, newValue) => {commit('updateCurrentTestCaseInput', newValue)}, 
    deleteSceneObject: ({commit}, index) => commit('deleteSceneObject', index),

    loadProject({commit}, projectId) {
      sendRequest('BACKEND/project/find/' + projectId, {}, "get").then(response => {
        commit('setProject', response.data)
      })
    },

    saveProject({commit, state}, title) {
      sendRequest("BACKEND/project/save", {
        id: state.id,
        title: title,
        language: state.language,
        code: state.code,
        breakpoints: state.breakpoints.toArray(), // TODO: save as map
        testCases: state.testData,
        sceneObjects: state.sceneObjects
      }).then(response => {
        if (response.status === 200) {
          commit('set', {key: 'title', value: title});
        }
      })
    },
  }
}