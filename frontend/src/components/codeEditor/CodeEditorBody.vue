<template>
  <div class="code-editor-body full-size">
      <div class="highlights full-size"></div>

      <textarea 
        class="codearea full-size"
        :class="{'cursor-pointer': isTrackingModeOn}"
        :value="code"
        @input="this.$emit('codeareaInputEvent', $event.target.value)"
        @scroll="this.$emit('codeareaScrollEvent')"
        @click="this.$emit('codeareaClickEvent')"
        :readonly="!isCodingModeOn"
        spellcheck="false">
      </textarea>
  </div>
</template>

<script>

export default {
  props: ['code', 'mode'],

  computed: {
    isCodingModeOn() {
      return this.$props.mode === 'CODING';
    },

    isTrackingModeOn() {
      return this.$props.mode === 'TRACKING';
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

  .cursor-pointer {
    cursor: pointer;
  }
</style>
