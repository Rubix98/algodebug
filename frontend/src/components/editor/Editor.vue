<template>
  <div class="code-editor full-size">
    <div class="editor-main flex-row">
      <div :class="{'width-1-of-2': isMode(EditorModes.MODE_DEBUGGING), 'full-size': !isMode(EditorModes.MODE_DEBUGGING)}" style="position:relative">
        <EditorHeader
          v-model:language="language"
          v-model:mode="mode"
          :isMode="isMode"
        />

        <div class="code-editor-main flex-row">
          <EditorLineNumbers
            v-model:breakpoints="breakpoints"
            :numberOfCodeLines="numberOfCodeLines"
            :isMode="isMode"
          />

          <EditorBody 
            v-model:code="code"
            :isMode="isMode"
            @codeareaInputEvent="codeareaInputHandler"
            @codeareaScrollEvent="codeareaScrollHandler"
            @codeareaClickEvent="codeareaClickHandler"
          />
        </div>
      </div>
      <div v-if="isMode(EditorModes.MODE_DEBUGGING)" class="width-1-of-2">
        <EditorScene
          :testCases="testCases"
          :isMode="isMode"
        />
      </div>
    </div>

    <EditorData
      v-model:testCases="testCases"
      :isMode="isMode"
    />

  </div>
</template>

<script>
import EditorBody from './EditorBody.vue';
import EditorHeader from './EditorHeader.vue';
import EditorLineNumbers from './EditorLineNumbers.vue';
import EditorData from './EditorData.vue';
import EditorScene from './EditorScene.vue';
import {EditorModes} from '@/scripts/EditorModes';
import {TestCases} from '@/scripts/TestCases.js';
import {HighlightUtils} from '@/scripts/HighlightUtils.js';
import {CodeParser} from '@/scripts/CodeParser.js';

import '@/prototypes/Map.js';

export default {
  components: {EditorBody, EditorHeader, EditorLineNumbers, EditorData, EditorScene},

  data() {
    return {
      EditorModes,
      code:                 '#include <iostream>\n#include <cstdio>\nusing namespace std;\n\nint gcd(int a, int b) {\n\tif (b > a) {\n\t\tswap(a, b);\n\t}\n\tif (b == 0) {\n\t\treturn a;\n\t} else {\n\t\treturn gcd(b, a % b);\n\t}\n}\n\nint main() {\n\tint a, b;\n\tcin >> a >> b;\n\tcout << gcd(a, b) << endl;\n}',
      language:             'C++',
      breakpoints:          new Map(),
      variables:            new Map(),
      mode:                 EditorModes.MODE_DEFAULT,
      testCases:            new TestCases(),
      selectedFrame:        null
    }
  },

  mounted() {
    if (this.projectId != '') {
      this.loadProject(this.projectId);
    }

    this.codeareaDOM = document.getElementsByClassName('codearea')[0];
    this.highlightsDOM = document.getElementsByClassName('highlights')[0];
    this.linesDOM = document.getElementsByClassName('code-editor-line-numbers')[0];

    this.emitter.on('saveProjectEvent', this.saveProject)
    this.emitter.on('trackVariableEvent', this.trackVariable)

    this.$root.sendRequest('BACKEND/code/load/cpp').then(response => {
      this.algoLib = response.data;
    });
  },

  methods: {
    codeareaInputHandler(code) {
      this.code = code;
      this.variables = new Map();
      this.breakpoints = new Map();
    },

    codeareaScrollHandler() {
      this.linesDOM.scrollTop = this.highlightsDOM.scrollTop = this.codeareaDOM.scrollTop;
    },

    codeareaClickHandler() {
      if (this.isMode(EditorModes.MODE_SETTINGS)) {
        let variable = HighlightUtils.selectVariable(this.code, this.codeareaDOM.selectionStart);
        if (variable == null) {
          return;
        }

        if (this.variables.hasElement(variable)) {
          this.variables.deleteElement(variable);
        } else {
          this.$root.openDialog('SelectVariableTypeDialog', variable => {
            this.variables.addElement(variable);
          });
        }
      }
    },

    trackVariable(variable) {
      if (this.isMode(this.editorModes.MODE_SETTINGS)) {
        this.variables.addElement(variable);
      }
    },

    loadProject(projectId) {
      this.$root.sendRequest('BACKEND/project/find/' + projectId).then(response => {
        let data = response.data;
        this.code = data.code;
        this.breakpoints = new Map(data.breakpoints); // TODO: array -> map
        this.variables = new Map(data.variables);
        this.language = data.language;
        this.testCases = data.testCases;
      })
    },

    saveProject(title) {
      let data = {
        title: title,
        language: this.language,
        code: this.code,
        breakpoints: this.breakpoints.toArray(), // TODO: save as map
        marks: this.marks.toArray(),
        testCases: this.testCases
      };
      this.$root.sendRequest("BACKEND/project/save", data);
    },

    compile() {
      for (let testCase of this.testCases.testCases) {
        this.$root.sendRequest('COMPILATOR/', {
          code:     this.debugCode,
          language: "cpp",
          input:    testCase.input
        }).then(response => {
          console.log(response.data)
          if (response.data.success) {
            testCase.output = response.data.output;
          } else {
            testCase.output = response.data.error;
          }
          this.mode = EditorModes.MODE_DEBUGGING;
        });
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
    isMode() {
      return mode => {
        return this.mode === mode;
      }
    },

    debugCode() {
      return this.algoLib + new CodeParser(this.code, this.variables, this.breakpoints).parse();
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
      return projectId[0] === '/' ? projectId.substring(1) : projectId;
    }
  },

  watch: {
    mode(value, oldValue) {
      if (value === EditorModes.MODE_CODING) {
        if (oldValue === EditorModes.MODE_INSPECTING) {
          this.code = this.copyOfCode;
          this.highlightVariables();
        }
      }

      if (value === EditorModes.MODE_INSPECTING) {
        this.copyOfCode = this.code;
        this.code = this.debugCode;
        this.clearHighlights()
      }

      if (value === EditorModes.MODE_COMPILING) {
        this.compile();
      }
    },

    selectedFrame() {
      this.currentTestCase.trackedVariables = JSON.stringify(this.currentFrame);
      this.highlightLine(this.currentFrame.line-1);
    },

    variables: {
      deep: true,
      handler() {
        this.highlightVariables();
      }
    }
  }

}
</script>

<style scoped>
  .code-editor {
    background-color: silver;
    font: 15px Consolas;
    padding: 10px;
  }

  .code-editor-line-numbers {
    width: 70px;
  }

  .code-editor-main {
    height: 100%;
    padding-right: 10px;
  }

  .editor-main {
    height: 70%;
  }
  
  .code-editor-test-cases {
    height: 30%;
  }

  .code-editor-body {
    background-color: black;
    color: white;
  }

</style>
