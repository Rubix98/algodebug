<template>
  <div class="algo-block">
    <div class="header">{{header}}</div>
    <slot></slot>
  </div>
</template>

<script>


export default {
  props: ['header'],

  data() {
    return {
    }
  },
}
</script>

<style scoped>
  .algo-block {
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
    border-radius: 10px;
    margin: 5px;
    padding: 0;
  }

  .algo-block .header{
    background: linear-gradient(#427AA1, #05668D);
    height: 24px;
    padding: 2px 15px;
    font-size: 18px;
    border-radius: 10px 10px 0 0;
    color: #EEE
  }
</style>
