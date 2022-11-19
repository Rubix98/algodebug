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
      const rootDOM = document.getElementById(this.id);
      const codeareaDOM = rootDOM.getElementsByClassName('codearea')[0];
      const highlightsDOM = rootDOM.getElementsByClassName('highlights')[0];
      const linesDOM = rootDOM.getElementsByClassName('code-line-numbers-container')[0];

      target = target.localName === 'textarea' ? codeareaDOM : highlightsDOM;
      linesDOM.scrollTop = highlightsDOM.scrollTop = target.scrollTop;
      highlightsDOM.scrollLeft = target.scrollLeft;
    },

    handlePickVariable(variable) {
      this.$emit('pickVariableEvent', variable);
    }
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
