<template>
  <textarea :class="size" 
    v-model="model" 
    :readonly="readonly"
    @input="$emit('update:value', $event.target.value)" />
</template>

<script>
export default {
  props: ['value', 'size', 'readonly'],

  computed: {
    model: {
      get() {
        return this.$props.value;
      },
      set() {}
    }
  }
}
</script>

<style scoped>
  textarea {
    width: 100%;
    height: 250px;
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
