<template>
  <div :id="id" class="code-editor full-size">
    <CodeEditorHeader
      v-model:title="title"
      v-model:language="language"
      v-model:trackVariablesMode="trackVariablesMode"
      v-model:showExtendedCode="showExtendedCode"
      :readonly="readonly" 
      @compileEvent="compile" />

    <div class="code-editor-main flex-row">
      <CodeEditorLineNumbers
        :code="code"
        :breakpoints="breakpoints"
        :trackVariablesMode="trackVariablesMode"
        :readonly="readonly"
        @breakPointClickEvent="breakPointClickHandler" />

      <CodeEditorBody 
        v-model:code="code"
        :trackVariablesMode="trackVariablesMode"
        :showExtendedCode="showExtendedCode"
        :readonly="readonly"
        @codeareaScrollEvent="codeareaScrollHandler"
        @codeareaClickEvent="codeareaClickHandler"
        @codeareaInputEvent="codeareaInputHandler" />
    </div>

    <CodeEditorTestCases
      v-model:inputs="inputs"
      v-model:outputs="outputs"
      v-model:selectedTestCase="selectedTestCase"
      :readonly="readonly" />

  </div>
</template>

<script>
import CodeEditorHeader from './CodeEditorHeader.vue';
import CodeEditorLineNumbers from './CodeEditorLineNumbers.vue';
import CodeEditorBody from './CodeEditorBody.vue';
import CodeEditorTestCases from './CodeEditorTestCases.vue';
import {CodeParser} from '@/scripts/CodeParser.js';
import {DeepSet} from '@/scripts/DeepSet.js';

let instances = {};

export default {
  props: ['id', 'readonly'],

  components: {CodeEditorHeader, CodeEditorLineNumbers, CodeEditorBody, CodeEditorTestCases},

  data() {
    return {
      code:                 '#include <iostream>\n#include <cstdio>\nusing namespace std;\n\nint gcd(int a, int b) {\n\tif (b > a) {\n\t\tswap(a, b);\n\t}\n\tif (b == 0) {\n\t\treturn a;\n\t} else {\n\t\treturn gcd(b, a % b);\n\t}\n}\n\nint main() {\n\tint a, b;\n\tcin >> a >> b;\n\tcout << gcd(a, b) << endl;\n}',
      title:                'Tytuł',
      language:             'C++',
      breakpoints:          new DeepSet(),
      marks:                new DeepSet(),
      trackVariablesMode:   false,
      showExtendedCode:     false,
      inputs:               [''],
      outputs:              [''],
      selectedTestCase:     0
    }
  },

  mounted() {
    let rootDOM = document.getElementById(this.$props.id);
    this.codeareaDOM = rootDOM.getElementsByClassName('codearea')[0];
    this.highlightsDOM = rootDOM.getElementsByClassName('highlights')[0];
    this.linesDOM = rootDOM.getElementsByClassName('code-editor-line-numbers')[0];
    this.highlightsDOM.innerHTML = this.code;
    this.reset();
    instances[this.$props.id] = this;
  },

  methods: {
    codeareaScrollHandler() {
      this.linesDOM.scrollTop = this.highlightsDOM.scrollTop = this.codeareaDOM.scrollTop;
    },

    codeareaClickHandler() {
      if (!this.readonly && this.trackVariablesMode) {
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
      if (!this.readonly && this.trackVariablesMode) {
        this.breakpoints.addOrDelete(index);
      }
    },

    compile() {
      this.$root.sendRequest({
        code:      this.getExtendedCode(),
        language: "cpp",
        input:    this.inputs[0]
      }).then(response => {
        console.log(response.data);
        this.outputs[0] = response.data.output;
      });
    },

    highlightCode() {
      const markStyle = 'background-color: purple; color: transparent; border-radius: 3px';
      this.highlightsDOM.innerHTML = CodeParser.highlightCode(this.code, this.marks, markStyle);
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

  watch: {
    showExtendedCode(value) {
      if (value) {
        this.trackVariablesMode = false;
        this.copyOfCode = this.code;
        this.code = this.getExtendedCode();
      } else {
        this.code = this.copyOfCode;
      }
    }
  },

  updated() {
    for (let id in instances) {
      if (id != this.$props.id) {
        for (let key in this.$data) {
          instances[id][key] = this[key];
        }
      }
    }
  }

}
</script>

<style scoped>
  .code-editor {
    background-color: silver;
    font: 20px Consolas;
  }

  .code-editor-line-numbers {
    width: 70px;
  }

  .code-editor-header {
    height: 40px;
    padding-left: 70px;
  }

  .code-editor-main {
    height: calc(70% - 40px);
    padding-right: 10px;
  }
  
  .code-editor-test-cases {
    height: 30%;
    padding: 10px;
  }

  .code-editor-body {
    background-color: black;
    color: white;
  }

</style>
