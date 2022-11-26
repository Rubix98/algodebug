<template>
  <button :class="bindClass">
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: ['type'],

  computed: {
    bindClass() {
      return this.type ?? 'default';
    }
  }
}
</script>

<style scoped>
  button {
    padding: 7px 15px;
    cursor: pointer;
    border-radius: 10px;
    border: none;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
    margin: 0;
  }

  button:hover {
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.7);
    
  }
  
  .ok {
    background: linear-gradient(#C3EB78, #508B54); 
  }

  .ok:hover {
    background: linear-gradient(#D3FB88, #609B64);
  }

  .cancel {
    background-color: red;
  }

  .cancel:hover {
    background-color: red;
  }
</style>
