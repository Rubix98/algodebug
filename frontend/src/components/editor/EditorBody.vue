<template>
  <div class="code-editor-body full-size">
      <div class="highlights full-size"></div>
      <textarea 
        class="codearea algo-textarea full-size"
        :class="{'cursor-pointer': isMode(EditorModes.MODE_SETTINGS)}"
        :value="code"
        @input="this.$emit('codeareaInputEvent', $event.target.value)"
        @scroll="this.$emit('codeareaScrollEvent')"
        @click="this.$emit('codeareaClickEvent')"
        :readonly="!isMode(EditorModes.MODE_CODING)"
        spellcheck="false">
      </textarea>
  </div>
</template>

<script>
import {EditorModes} from '@/scripts/EditorModes';

export default {
  props: ['code', 'isMode'],

  data() {
    return {
      EditorModes
    }
  }
}
</script>

<style>
  .code-editor-body {
    display: block;
    transform: translateZ(0);
  }

  .codearea, .highlights {
    box-sizing: border-box;
    white-space: pre-wrap;
    padding: 0;
    border: 0px;
    overflow: auto;
    font: inherit;
  }

  .highlights {
    position: absolute;
    z-index: -1;
    color: transparent;
  }

  .codearea {
    color: inherit;
    background-color: transparent;
    text-decoration: none !important;
  }

  .cursor-pointer {
    cursor: pointer;
  }

  highlight {
    color: transparent;
    border-radius: 2px;
  }

  .highlight-variable {
    background-color: purple;
  }

  .highlight-line {
    background-color: orange;
  }
</style>
