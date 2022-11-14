<template>
  <div :id="id" class="code-editor-container full-size flex-row" >
    <slot></slot>

    <CodeLineNumbers
      :id="id"
      :code="code"
      :editable="editable"
    />

    <Codearea 
      :id="id" 
      :code="code" 
      :editable="editable" 
      @scrollEvent="handleScroll" 
      @pickVariableEvent="handlePickVariable"
    />
  </div>
</template>

<script>
import CodeLineNumbers from '@/components/mainPage/codeEditor/subcomponents/CodeLineNumbers.vue';
import Codearea from '@/components/mainPage/codeEditor/subcomponents/Codearea.vue';

export default {
    components: { CodeLineNumbers, Codearea },
    props: ["id", "code", "editable"],

    methods: {
      handleScroll(target) {
        target = target.localName === 'textarea' ? this.codeareaDOM : this.highlightsDOM;
        this.linesDOM.scrollTop = this.highlightsDOM.scrollTop = target.scrollTop;
        this.highlightsDOM.scrollLeft = target.scrollLeft;
      },

      handlePickVariable(variable) {
        this.$emit('pickVariableEvent', variable);
      }
    },

    computed: {
      codeareaDOM() {
        return this.elementDOM('codearea');
      },

      highlightsDOM() {
        return this.elementDOM('highlights');
      },

      linesDOM() {
        return this.elementDOM('code-line-numbers-container');
      },

      elementDOM() {
        return (className) => document.getElementById(this.id).getElementsByClassName(className)[0];
      },
    }
    
}
</script>

<style scoped>
  .code-editor-container {
    transform: translateZ(0);
    font: 16px Consolas;
    border-radius: 10px;
    background-color: black;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
  }
</style>
