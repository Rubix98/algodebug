<template>
  <input type="text" v-model="model" />
</template>

<script>
export default {
  props: ['value'],

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
</style>
