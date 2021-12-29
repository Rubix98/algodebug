<template>
  <div class="code-editor-body full-size">
      <div class="highlights full-size"></div>

      <textarea 
        class="codearea full-size"
        :class="{'trackVariablesMode': trackVariablesMode}"
        :value="code"
        @input="this.$emit('codeareaInputEvent', $event.target.value)"
        @scroll="this.$emit('codeareaScrollEvent')"
        @click="this.$emit('codeareaClickEvent')"
        :readonly="!canEditCode"
        spellcheck="false">
      </textarea>
  </div>
</template>

<script>

export default {
  props: ['code', 'trackVariablesMode', 'showExtendedCode', 'readonly'],

  computed: {
    canEditCode() {
      return !this.$props.readonly && !this.$props.trackVariablesMode && !this.$props.showExtendedCode;
    }
  }
}
</script>

<style scoped>
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
    resize: none;
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

  .trackVariablesMode {
    cursor: pointer;
  }
</style>
