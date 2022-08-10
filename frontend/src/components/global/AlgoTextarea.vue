<template>
  <textarea :class="size" v-model="model" />
</template>

<script>
export default {
  props: ['value', 'size'],

  data() {
    return {
      model: ''
    }
  },

  mounted() {
    this.model = this.$props.value;
  },

  watch: {
    model() {
      this.$emit('update:value', this.model)
    }
  }
}
</script>

<style scoped>
  textarea {
    width: 100%;
    height: 250px;
    resize: none;
  }

  .small {
    height: 100px;
  }
</style>
