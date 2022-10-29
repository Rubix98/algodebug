<template>
  <div :id="id" class="code-editor-body full-size">
    <div class="flex-row full-size">
      <slot></slot>

      <CodeLineNumbers
        :code="code"
        :editable="editable"
      />

      <div class="code-editor-containter" >
        <pre v-if="!editable" class="full-size codearea" id="editor" spellcheck="false"><code v-html="code" @click="pickVariable" ></code></pre>
        <textarea class="codearea" v-if="editable" v-model="displayCode" spellcheck="false" @scroll="codeareaScrollHandler()"></textarea>
      </div>
    </div>
    
  </div>
</template>

<script>
import CodeLineNumbers from './subcomponents/CodeLineNumbers.vue';
import { HighlightUtils } from '@/javascript/utils/HighlightUtils';
import { mapState, mapActions, mapGetters } from "vuex";

export default {
    components: { CodeLineNumbers },
    props: ["id", "code", "editable", "clickable"],
    data() {
      return {
        extendedCode: ""
      };
    },
    mounted() {
      this.codeareaDOM = document.getElementById(this.id).getElementsByClassName('codearea')[0];
      this.linesDOM = document.getElementById(this.id).getElementsByClassName('code-editor-line-numbers')[0];

      /*if (this.$props.clickable) {
        this.extendedCode = HighlightUtils.insertTargetTagsIntoCode(this.$props.code);
      }
      else if (this.$props.variables) {
        this.extendedCode = HighlightUtils.highlightVariables(this.$props.code, this.$props.project.variables);
      } else {
        this.extendedCode = this.$props.code.escapeHTML();
      }*/

      //this.emitter.on("startDebuggingEvent", this.highlightLine);
      //this.emitter.on("currentFrameChangedEvent", this.highlightLine);
      //this.emitter.on("stopDebuggingEvent", this.highlightVariables);
    },

    methods: {
      ...mapActions('project', ['setCode']),

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

      highlightLine() {
        this.extendedCode = HighlightUtils.highlightLine(this.$props.code, this.currentFrame.line-1);
      },
    },

    computed: {
      ...mapState(['project']),
      ...mapGetters('project', ['currentFrame']),

      displayCode: {
        get() {return this.project.code},
        set(newValue) {this.setCode(newValue)}
      }
    },
    
}
</script>

<style scoped>
  pre, code, textarea {
    border: 0px;
    background-color: black;
    color: white;
    word-wrap: break-word;
    word-break: break-all;
    display:inline-block;
    outline: none;
    width: 100%;
    height: 99%; /* TODO: Poprawić ostylowanie */
    resize: none;
    font: 16px Consolas;
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
