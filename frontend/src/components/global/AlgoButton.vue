<template>
  <button :class="buttonClass">
    {{label}}
    <slot></slot>
  </button>
</template>

<script>


export default {
  props: ['type'],

  data() {
    return {
      buttonClass: '',
      label: ''
    }
  },

  mounted() {
    if (this.$props.type === "plus") {
      this.buttonClass = 'ok';
      this.label = '+';
    } else if (this.$props.type === "minus") {
      this.buttonClass = 'cancel';
      this.label = '-';
    }
  }
}
</script>

<style scoped>
  button {
    padding: 5px 10px;
    cursor: pointer;
    border-radius: 10px;
  }

  .ok {
    background-color: lime;
    border: 1px solid green;
  }

  .cancel {
    background-color: red;
    border: 1px solid rgb(128, 0, 0);
  }


</style>
