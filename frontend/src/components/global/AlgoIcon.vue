<template>
  <span>
    <i class="close-icon fa-solid fa-xmark" v-if="type === 'x'"></i>
  </span>
</template>

<script>


export default {
  props: ['type']
}
</script>

<style scoped>
  .close-icon {
    color: red;
  }


</style>
