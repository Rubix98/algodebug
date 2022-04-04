<template>
  <div class="main-container">
    <Menu v-model:currentTab="currentTab"/>

    <div class="tab-container">
      <CodeEditor />
    </div>
  </div>
</template>

<script>
import Menu from '@/components/other/Menu.vue';
import CodeEditor from '@/components/codeEditor/CodeEditor.vue';
import axios from 'axios';

export default {
  components: {Menu, CodeEditor},
  data() {
    return {
      currentTab: 2,
    }
  },

  methods: {
    async sendRequest(url, data={}) {
      let response = await axios.post(url, data);
      return response;
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
    height: 40px;
  }

  .tab-container {
    width: 100%;
    height: calc(100% - 40px);
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

  .width-1-of-2 {
    width: 50%;
  }

</style>
