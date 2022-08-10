<template>
  <div :id="id" class="code-editor-body full-size">
    <div class="flex-row full-size">
      
      <slot></slot>

      <EditorLineNumbers
        :breakpoints="breakpoints"
        :numberOfCodeLines="numberOfCodeLines"
        :editable="editable"
      />

      <div class="code-editor-containter">
        <pre class="full-size codearea" @scroll="codeareaScrollHandler()" :contenteditable="editable" spellcheck="false" @input="onInput"><code v-html="extendedCode" @click="pickVariable" ></code></pre>
      </div>
    </div>
    
  </div>
</template>

<script>
import { HighlightUtils } from '../../scripts/HighlightUtils';
import EditorLineNumbers from './EditorLineNumbers.vue';


export default {
    components: { EditorLineNumbers },
    props: ["id", "code", "variables", "breakpoints", "editable", "clickable"],
    data() {
      return {
        extendedCode: ""
      };
    },
    mounted() {
      this.codeareaDOM = document.getElementById(this.id).getElementsByClassName('codearea')[0];
      this.linesDOM = document.getElementById(this.id).getElementsByClassName('code-editor-line-numbers')[0];

      if (this.$props.clickable) {
        this.extendedCode = HighlightUtils.insertTargetTagsIntoCode(this.$props.code);
      }
      else if (this.$props.variables) {
        this.extendedCode = HighlightUtils.highlightVariables(this.$props.code, this.$props.variables);
      } else {
        this.extendedCode = this.$props.code.escapeHTML();
      }

      console.log(this.extendedCode);
    },

    methods: {
      codeareaScrollHandler() {
        this.linesDOM.scrollTop = this.codeareaDOM.scrollTop;
      },

      pickVariable(e) {
        console.log(e);
        if (e.target.localName === 'algo-target') {
          console.log("here")
          let start = Number(e.target.attributes.start.value);
          let end = Number(e.target.attributes.end.value);
          let name = this.code.slice(start, end);
          this.$emit('pickVariableEvent', {start, end, name});
        }
      },

      highlightVariables() {
        this.extendedCode = HighlightUtils.highlightVariables(this.$props.code, this.$props.variables);
      },

      onInput(event) {
        let code = event.target.innerText;
        if (code.split("\n").at(-1) == "") {
          code = code.slice(0,-1);
        }
        this.$emit("update:code", code);
      }
    },

    computed: {
      numberOfCodeLines() {
        console.log(this.code);
        return this.code.split("\n").length;
      },
    },

    watch: {
      variables: {
        deep: true,
        handler() {
          this.highlightVariables();
        }
      }
    }
    
}
</script>

<style>
  pre, code {
    border: 0px;
    background-color: black;
    color: white;
    word-wrap: break-word;
    word-break: break-all;
    overflow: auto;
    display:inline-block;
  }

  .code-editor-containter {
    width: calc(100% - 70px);
    height: 100%;
    display:inline-block;
  }

  algo-target {
    transition: background-color 0.2s;
    border-radius: 5px;
  }

  algo-target:hover {
    background-color: orange;
    cursor: pointer;
  }

  algo-highlight {
    background-color: red;
  }
</style>
