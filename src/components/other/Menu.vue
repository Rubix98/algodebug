<template>
  <div class="menu">
    <div class="menu-content flex-row flex-horizontal-center">
      <div class="menu-option" 
        v-for="(tab, index) in tabs" :key="index" 
        @click="this.$emit('update:currentTab', index)"
        :class="{selected: currentTab === index}">
          {{tab}}
        </div>
    </div>
    <div class="menu-placeholder"></div>
  </div>
</template>

<script>
export default {
  props: ['currentTab'],
  data() {
    return {
      tabs: ['Edycja kodu', 'Konfiguracja sceny', 'Wyświetlanie']
    }
  }
}
</script>

<style scoped>
  .menu-content {
    background-color: green;
    position: fixed;
    z-index: 1;
  }

  .menu-content, .menu-placeholder {
    width: 100%;
    height: inherit;
  }

  .menu-option {
    padding: 10px;
    border: 2px solid black;
    margin: 0 10px;
    cursor: pointer
  }

  .selected {
    background-color: lime;
  }
</style>
