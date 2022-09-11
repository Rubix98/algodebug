<template>
  <div :id="id" class="code-editor-body full-size">
    <div class="flex-row full-size">
      
      <slot></slot>

      <EditorLineNumbers
        :breakpoints="breakpoints"
        :numberOfCodeLines="numberOfCodeLines"
        :editable="editable"
      />

      <div class="code-editor-containter" @scroll="codeareaScrollHandler()" @keydown.tab.prevent="insertTab($event)">
        <pre class="full-size codearea" id="editor"  :contenteditable="editable" spellcheck="false" @input="onInput"><code v-html="extendedCode" @click="pickVariable" ></code></pre>
      </div>
    </div>
    
  </div>
</template>

<script>
import { HighlightUtils } from '../../scripts/HighlightUtils';
import EditorLineNumbers from './EditorLineNumbers.vue';


export default {
    components: { EditorLineNumbers },
    props: ["id", "code", "variables", "breakpoints", "testCases", "editable", "clickable", "isRunning"],
    data() {
      return {
        extendedCode: ""
      };
    },
    mounted() {
      this.codeareaDOM = document.getElementById(this.id).getElementsByClassName('code-editor-containter')[0];
      this.linesDOM = document.getElementById(this.id).getElementsByClassName('code-editor-line-numbers')[0];

      if (this.$props.clickable) {
        this.extendedCode = HighlightUtils.insertTargetTagsIntoCode(this.$props.code);
      }
      else if (this.$props.variables) {
        this.extendedCode = HighlightUtils.highlightVariables(this.$props.code, this.$props.variables);
      } else {
        this.extendedCode = this.$props.code.escapeHTML();
      }

      this.emitter.on("startDebuggingEvent", this.highlightLine);
      this.emitter.on("currentFrameChangedEvent", this.highlightLine);
      this.emitter.on("stopDebuggingEvent", this.highlightVariables);
    },

    methods: {
      codeareaScrollHandler() {
        this.linesDOM.scrollTop = this.codeareaDOM.scrollTop;
      },

      pickVariable(e) {
        if (e.target.localName === 'algo-target') {
          let start = Number(e.target.attributes.start.value);
          let end = Number(e.target.attributes.end.value);
          let name = this.code.slice(start, end);
          this.$emit('pickVariableEvent', {start, end, name});
        }
      },

      highlightVariables() {
        this.extendedCode = HighlightUtils.highlightVariables(this.$props.code, this.$props.variables);
        return this.extendedCode
      },

      highlightLine(currentFrame) {
        this.extendedCode = HighlightUtils.highlightLine(this.$props.code, currentFrame.line-1);
      },

      onInput(event) {
        let code = event.target.innerText;
        if (code.split("\n").at(-1) == "") {
          code = code.slice(0,-1);
        }
        this.$emit("update:code", code);
      },

      insertTab(event) {
        if (event) {
          event.preventDefault(); 
          var editor = document.getElementById("editor");
          var doc = editor.ownerDocument.defaultView;
          var sel = doc.getSelection();
          var range = sel.getRangeAt(0);

          var tabNode = document.createTextNode("\u00a0\u00a0\u00a0\u00a0");
          range.insertNode(tabNode);

          range.setStartAfter(tabNode);
          range.setEndAfter(tabNode); 
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }
    },

    computed: {
      numberOfCodeLines() {
        return this.code.split("\n").length;
      },
    },

    watch: {
      variables: {
        deep: true,
        handler() {
          this.highlightVariables();
        }
      },
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
    display:inline-block;
    outline: none;
    width: 100%;
  }

  .code-editor-containter {
    width: calc(100% - 60px);
    height: 100%;
    display:inline-block;
    overflow: auto;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
    border-radius: 0 10px 10px 0;
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
    border-radius: 5px;
  }

  .highlight-variable {
    background-color: purple;
  }

  .highlight-line {
    background-color: orange;
    width: 100%;
    display: inline-block;
  }
</style>
