<template>
  <div class="main-container">
    <Menu v-model:currentTab="currentTab"/>

    <div class="tab-container">
      <CodeTab ref="codeTab" v-show="currentTab === 0" />
    </div>
  </div>
</template>

<script>
import CodeTab from '@/components/tabs/CodeTab.vue'
import Menu from '@/components/other/Menu.vue'

export default {
  components: {CodeTab, Menu},
  data() {
    return {
      currentTab: 0,
    }
  }
}
</script>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .main-container {
    width: 100vw;
    height: 100vh;
  }

  .menu {
    height: 60px;
  }

  .tab-container {
    width: 100%;
    height: calc(100% - 60px);
    padding: 10px;
  }

  /* Global */

  .full-size {
    width: 100%;
    height: 100%;
  }

  .flex {
    display: flex;
  }

  .flex-row {
    display: flex;
    flex-direction: row;
  }

  .flex-column {
    display: flex;
    flex-direction: column;
  }

  .flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .flex-vertical-center {
    display: flex;
    justify-content: center;
  }

  .flex-vertical-space-between {
    display: flex;
    justify-content: space-between;
  }

  .flex-horizontal-center {
    display: flex;
    align-items: center;
  }

</style>
