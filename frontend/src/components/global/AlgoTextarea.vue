<template>
  <textarea :class="size" 
    :value="value" 
    @input="$emit('update:value', $event.target.value)" />
</template>

<script>
export default {
  props: ['value', 'size'],

  data() {
    return {
    }
  },

  mounted() {
    this.model = this.$props.value;
  }
}
</script>

<style scoped>
  textarea {
    width: 100%;
    height: 250px;
    resize: none;
    outline: none;
    border: none;
    border-radius: 0 0 10px 10px;
    font-size: 16px;
  }

  .small {
    height: 100px;
  }
</style>
