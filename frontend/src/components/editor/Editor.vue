<template>
  <div class="code-editor full-size">
    <div class="editor-main flex-row">
      <div class="width-1-of-2" style="position:relative">

        <CodeEditor 
          id="main-editor"
          v-model:code="code"
          :variables="variables"
          :breakpoints="breakpoints"
          :editable="!isRunning"
          :clickable="false"
          :testCases="testCases"
          :isRunning="isRunning">

          <EditorHeader v-model:language="language" :isRunning="isRunning" 
            @showExtendedCodeEvent="showExtendedCode()"
            @runProgramEvent="runProgram"
            @stopProgramEvent="stopProgram"
          />
        
        </CodeEditor>

      </div>
      <div class="width-1-of-2">

        <EditorScene
          :testCases="testCases"
          :isRunning="isRunning"
          :code="code"
          :variables="variables"
          :breakpoints="breakpoints"
          :language="language"
          :sceneObjects="sceneObjects"
        />

      </div>
    </div>

    <EditorData
      v-model:testCases="testCases"
      :isRunning="isRunning"
    />

  </div>
</template>

<script>
import EditorHeader from './EditorHeader.vue';
import EditorData from './EditorData.vue';
import EditorScene from './EditorScene.vue';
import {TestCases} from '@/scripts/TestCases.js';
import {HighlightUtils} from '@/scripts/HighlightUtils.js';
import {CodeParser} from '@/scripts/CodeParser.js';
import CodeEditor from './CodeEditor.vue';

export default {
  components: { EditorHeader, EditorData, EditorScene, CodeEditor },

  data() {
    return {
      code:                 '#include <iostream>\nusing namespace std;\n\nint main() {\n\tcout << "Hello world" << endl;\n}',
      language:             'cpp',
      breakpoints:            new Map(),
      isRunning:            false,
      testCases:            new TestCases(),
      sceneObjects:         [],
      selectedFrame:        null
    }
  },

  mounted() {
    if (this.projectId != '') {
      
      this.loadProject(this.projectId);
    }

    this.emitter.on('saveProjectEvent', this.saveProject)
    this.emitter.on('trackVariableEvent', this.trackVariable)
    this.emitter.on('saveSceneObjectEvent', this.saveSceneObject)
  },

  methods: {
    loadProject(projectId) {
      this.$root.sendRequest('BACKEND/project/find/' + projectId).then(response => {
        let data = response.data;
        this.code = data.code;
        this.breakpoints = new Map(data.breakpoints.map(breakpoint => {
          return [breakpoint.id, breakpoint];
        })); // TODO: array -> map
        this.language = data.language;
        this.testCases = new TestCases(data.testCases);
        this.sceneObjects = data.sceneObjects;
      })
    },

    saveProject(title) {
      this.$root.sendRequest("BACKEND/project/save", {
        id: this.projectId != null && this.projectId.length !== 0 ? this.projectId : undefined,
        title: title,
        language: this.language,
        code: this.code,
        breakpoints: this.breakpoints.toArray(), // TODO: save as map
        testCases: this.testCases.testCases,
        sceneObjects: this.sceneObjects
      });
    },

    showExtendedCode() {
      this.$root.openDialog('ShowExtendedCodeModal', {
        code: this.debugCode
      });
    },

    async runProgram() {
      console.log("compiling")
      for (let testCase of this.testCases.testCases) {
        let response = await this.$root.sendRequest('https://codex-api.herokuapp.com/', {
          code:     this.debugCode,
          language: "cpp",
          input:    testCase.input
        });
        console.log(response.data)
        
        if (response.data.success) {
          let output = response.data.output;
          testCase.output = output;

          const parser = new DOMParser();
          const parsedOutput = parser.parseFromString(output, "text/html");

          testCase.frames = [];
          for (let breakpoint of parsedOutput.getElementsByTagName("algodebug-breakpoint")) {
            testCase.frames.push({
              output: breakpoint.outerHTML,
              line: Number(breakpoint.getAttribute("line")),
              variables: breakpoint.getElementsByTagName("algodebug-variable")
            });
          }

        } else {
          testCase.output = response.data.error;
        }
      }
      this.isRunning = true;
      this.emitter.emit("startDebuggingEvent", this.testCases.currentFrame());
    },

    stopProgram() {
      this.isRunning = false;
    },

    saveSceneObject(sceneObject) {
      if (sceneObject.id != null) {
        this.sceneObjects[sceneObject.id] = sceneObject;
      } else {
        sceneObject.id = this.sceneObjects.length;
        this.sceneObjects.push(sceneObject);
      }
      
    },

    highlightVariables() {
      this.highlightsDOM.innerHTML = HighlightUtils.highlightVariables(this.code, this.variables);
    },

    highlightLine(lineNumber) {
      this.highlightsDOM.innerHTML = HighlightUtils.highlightLine(this.code, lineNumber);
    },

    clearHighlights() {
      this.highlightsDOM.innerHTML = ""
    }
  },

  computed: {
    debugCode() {
      return new CodeParser(this.code, this.variables, this.breakpoints, this.converters).parse();
    },

    variables() {
      let variables = new Map();
      for (let sceneObject of this.sceneObjects) {
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

    converters() {
      let converters = new Map();
      for (let sceneObject of this.sceneObjects) {
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

    numberOfCodeLines() {
      return this.code.split("\n").length;
    },

    currentTestCase() {
      return this.testCases.getCurrent();
    },

    currentFrame() {
      return this.currentTestCase.frames[this.selectedFrame]
    },

    projectId() {
      let projectId = window.location.pathname;
      projectId = projectId.replace("algodebug", "");
      projectId = projectId.replaceAll("/", "");
      return projectId;
    }
  },

  watch: {
    selectedFrame() {
      this.currentTestCase.trackedVariables = JSON.stringify(this.currentFrame);
      this.highlightLine(this.currentFrame.line-1);
    }
  }

}
</script>

<style>
  .code-editor {
    background-color: silver;
    font: 16px Consolas;
    padding: 10px;
  }

  .code-editor-line-numbers {
    width: 70px;
    height: 100%;
    background-color: silver;
    color: black;
  }

  .editor-main {
    height: 70%;
    gap: 10px;
  }
  
  .code-editor-test-cases {
    height: 30%;
  }

  .code-editor-body {
    background-color: black;
    color: white;
  }

</style>
