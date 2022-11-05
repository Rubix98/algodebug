<template>
  <div class="codearea-container">
    <div class="highlights" :class="{'visible': !editable}" v-html="extendedCode" @scroll="emitScrollEvent" @click="handleClick"></div>
    <textarea class="codearea" v-if="editable" v-model="modelCode" spellcheck="false" @scroll="emitScrollEvent"></textarea>
  </div>
</template>

<script>
import { HighlightUtils } from '@/javascript/utils/HighlightUtils';
import { mapState, mapActions, mapGetters } from "vuex";

export default {
    props: ["id", "code", "editable", "clickable"],

    mounted() {


      //this.emitter.on("startDebuggingEvent", this.highlightLine);
      //this.emitter.on("currentFrameChangedEvent", this.highlightLine);
      //this.emitter.on("stopDebuggingEvent", this.highlightVariables);
    },

    methods: {
      ...mapActions('project', ['setCode']),

      pickVariable(e) {
        if (e.target.localName === 'algo-target') {
          let start = Number(e.target.attributes.start.value);
          let end = Number(e.target.attributes.end.value);
          let name = this.code.slice(start, end);
          this.$emit('pickVariableEvent', {start, end, name});
        }
      },

      emitScrollEvent(event) {
        this.$emit('scrollEvent', event.target);
      },

      handleClick(event) {
        if (!this.$props.clickable || event.target.localName !== 'algo-target') return;

        const variable = {
          name: event.target.innerText,
          start: event.target.attributes.start.value,
          end: event.target.attributes.end.value,
        }
        console.log("a")
        this.$emit('pickVariableEvent', variable);
      }
    },

    computed: {
      ...mapState(['project']),
      ...mapGetters('project', ['variables', 'currentFrame']),

      modelCode: {
        get() {return this.$props.code},
        set(newValue) {this.setCode(newValue)}
      },

      extendedCode() {
        let code = this.modelCode;
        if (this.$props.editable) {
          code =  HighlightUtils.highlightVariables(code, this.variables);
        } if (this.$props.clickable) {
          code = HighlightUtils.insertTargetTagsIntoCode(code);
        }
        return code.escapeHTML();
      },
    },
    
}
</script>

<style>
  .codearea-container {
    display: block;
  }

  .codearea, .highlights {
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    white-space: pre;
    font: 16px Consolas;
    overflow: auto;
    overflow-x: auto;
    color: white;
  }

  .codearea {
    background-color: transparent;
    resize: none;
  }

  .highlights {
    position: absolute;
    z-index: -1;
    width: inherit;
  }

  .visible {
    z-index: 0 !important;
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
