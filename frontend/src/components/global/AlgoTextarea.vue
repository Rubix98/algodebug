<template>
  <textarea
    v-model="model" 
    :readonly="readonly"
    @keydown.tab.prevent="insertTabIndent"></textarea>
</template>

<script>

export default {
  props: ['value', 'readonly'],

  methods: {
    insertTabIndent(event) {
      if (this.readonly) return;

      let startText = this.model.slice(0, event.target.selectionStart);
      let endText = this.model.slice(event.target.selectionStart);
      this.model = `${startText}    ${endText}`;
      
      let selectionStart = event.target.selectionStart;
      this.$nextTick(() => {
        event.target.selectionStart = event.target.selectionEnd = selectionStart + 4;
      });
      
    }
  },

  computed: {
    model: {
      get() {return this.$props.value;},
      set(value) {this.$emit('update:value', value)}
    }
  },
  
}
</script>

<style scoped>
  textarea {
    width: 100%;
    resize: none;
    border-radius: 0 0 10px 10px;
    font-size: 16px;
    tab-size: 4;
  }

  .without-outline {
    outline: none;
    border: none;
  }

  .small {
    height: 100px;
  }
</style>
