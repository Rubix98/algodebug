<template>
  <div class="field-row-container flex-row">
    <div class="label-container">{{label}}:</div>
    <div class="value-container">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: ['label'],
  mounted() {
    console.log(this.$props.label)
  }
}
</script>

<style scoped>
  .field-row-container {
    margin-bottom: 5px;
  }

  .label-container {
    width: 25%;
  }

  .value-container {
    width: 75%;
  }
</style>
