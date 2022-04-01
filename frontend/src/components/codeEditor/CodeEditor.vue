<template>
  <div class="code-editor full-size">
    <div class="editor-main flex-row">
      <div :class="{'width-1-of-2': isDebuggingModeOn, 'full-size': !isDebuggingModeOn}" style="position:relative">
        <CodeEditorHeader
          v-model:language="language"
          v-model:mode="mode" />

        <div class="code-editor-main flex-row">
          <CodeEditorLineNumbers
            :code="code"
            :breakpoints="breakpoints"
            :mode="mode"
            @breakPointClickEvent="breakPointClickHandler" />

          <CodeEditorBody 
            v-model:code="code"
            :mode="mode"
            @codeareaScrollEvent="codeareaScrollHandler"
            @codeareaClickEvent="codeareaClickHandler"
            @codeareaInputEvent="codeareaInputHandler" />
        </div>
      </div>
        
      <div v-if="isDebuggingModeOn" class="width-1-of-2">
        <SceneCanvas 
          v-model:selectedFrame="selectedFrame"
          :testCases="testCases"
          :selectedTestCase="selectedTestCase" />
      </div>
    </div>

    <CodeEditorTestCases
      v-model:testCases="testCases"
      v-model:selectedTestCase="selectedTestCase"
      :mode="mode"
      :selectedFrame="selectedFrame" />

  </div>
</template>

<script>
import CodeEditorHeader from './CodeEditorHeader.vue';
import CodeEditorLineNumbers from './CodeEditorLineNumbers.vue';
import CodeEditorBody from './CodeEditorBody.vue';
import CodeEditorTestCases from './CodeEditorTestCases.vue';
import SceneCanvas from './SceneCanvas.vue';
import {CodeParser} from '@/scripts/CodeParser.js';
import {DeepSet} from '@/scripts/DeepSet.js';


export default {
  components: {CodeEditorHeader, CodeEditorLineNumbers, CodeEditorBody, CodeEditorTestCases, SceneCanvas},

  data() {
    return {
      code:                 '#include <iostream>\n#include <cstdio>\nusing namespace std;\n\nint gcd(int a, int b) {\n\tif (b > a) {\n\t\tswap(a, b);\n\t}\n\tif (b == 0) {\n\t\treturn a;\n\t} else {\n\t\treturn gcd(b, a % b);\n\t}\n}\n\nint main() {\n\tint a, b;\n\tcin >> a >> b;\n\tcout << gcd(a, b) << endl;\n}',
      language:             'C++',
      breakpoints:          new DeepSet(),
      marks:                new DeepSet(),
      testCases:            [{
        input:              '',
        output:             '',
        trackedVariables:   '',
      }],
      mode:                'CODING',
      selectedTestCase:     0,
      selectedFrame:        null
    }
  },

  mounted() {
    this.codeareaDOM = document.getElementsByClassName('codearea')[0];
    this.highlightsDOM = document.getElementsByClassName('highlights')[0];
    this.linesDOM = document.getElementsByClassName('code-editor-line-numbers')[0];
    this.highlightsDOM.innerHTML = this.code;
    this.reset();

    this.emitter.on('saveProject', this.saveProject)
  },

  methods: {
    codeareaScrollHandler() {
      this.linesDOM.scrollTop = this.highlightsDOM.scrollTop = this.codeareaDOM.scrollTop;
    },

    codeareaClickHandler() {
      if (this.mode === 'TRACKING') {
        let mark = CodeParser.getSelectedMark(this.code, this.codeareaDOM.selectionStart);
        this.marks.addOrDelete(mark);
        this.highlightCode();
      }
    },

    codeareaInputHandler(code) {
      this.code = code;
      this.reset();
    },

    breakPointClickHandler(index) {
      if (this.mode === 'TRACKING') {
        this.breakpoints.addOrDelete(index);
      }
    },

    compile() {
      let extendedCode = this.getExtendedCode();
      for (let testCase of this.testCases) {
        this.$root.sendRequest('compilator/.netlify/functions/enforceCode', {
          code:      extendedCode,
          language: "cpp",
          input:    testCase.input
        }).then(response => {
          console.log(response.data);
          let output = response.data.output;
          var htmlDoc = new DOMParser().parseFromString(output, 'text/html');
          testCase.frames = [];
          for (let algoviewTag of htmlDoc.getElementsByTagName("ALGOVIEW")) {
            let frame = {};
            for (let variable of algoviewTag.getElementsByTagName("variable")) {
              let variableName = variable.getAttribute("name");
              let variableValue = variable.getAttribute("value");
              if (variableName === 'edges') {
                variableName = 'graph'
                variableValue = this.parseGraph(variableValue);
              }
              frame[variableName] = variableValue;
            }
            testCase.frames.push(frame);
          }
          console.log(testCase)
          output = output.replace(/<ALGOVIEW>[\s\S]*?<\/ALGOVIEW>\n*/g, '');
          testCase.output = output;
          this.selectedFrame = 0;
        });

      }
      
    },

    parseGraph(graphValue) {
      let result = [];
      for (let edge of graphValue.split(';')) {
        if (edge !== '') {
          let edgeSplitted = edge.split(',');
          result.push({
            from: edgeSplitted[0],
            to: edgeSplitted[1]
          })
        }
      }
      return result;
    },

    saveProject(title) {
      let data = {
        title: title,
        language: this.language,
        code: this.code,
        breakpoints: this.breakpoints.sorted(),
        marks: this.marks.sorted(),
        testCases: this.testCases
      };
      this.$root.sendRequest("backend/project/save", data);
    },

    highlightCode() {
      const markStyle = 'background-color: purple; color: transparent; border-radius: 3px';
      this.highlightsDOM.innerHTML = CodeParser.highlightCode(this.code, this.marks, markStyle);
    },

    highlightLine(line) {
      const markStyle = 'background-color: orange; color: transparent; border-radius: 3px; display:block; width: 100%';
      this.highlightsDOM.innerHTML = CodeParser.highlightLine(this.code, line, markStyle);
    },

    getExtendedCode() {
      return CodeParser.extendCode(this.code, this.marks, this.breakpoints);
    },

    reset() {
      this.breakpoints = new DeepSet();
      this.marks = new DeepSet();
      this.highlightCode();
    }
  },

  computed: {
    isCodingModeOn() {
      return this.mode === 'CODING';
    },
    
    isTrackingModeOn() {
      return this.mode === 'TRACKING';
    },

    isExtendingModeOn() {
      return this.mode === 'EXTENDING';
    },

    isDebuggingModeOn() {
      return this.mode === 'DEBUGGING';
    },

    currentTestCase() {
      return this.testCases[this.selectedTestCase];
    },

    currentFrame() {
      return this.currentTestCase.frames[this.selectedFrame]
    }

  },

  watch: {
    mode(value, oldValue) {
      if (value === 'EXTENDING') {
        this.copyOfCode = this.code;
        this.code = this.getExtendedCode();
      }
      if (oldValue === 'EXTENDING') {
        this.code = this.copyOfCode;
      }

      if (value === 'DEBUGGING') {
        this.compile();
      }
    },

    selectedFrame() {
      this.testCases[this.selectedTestCase].trackedVariables = JSON.stringify(this.testCases[this.selectedTestCase].frames[this.selectedFrame]);
      this.highlightLine(this.testCases[this.selectedTestCase].frames[this.selectedFrame].line-1);
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
