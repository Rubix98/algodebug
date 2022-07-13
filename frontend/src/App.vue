<template>
  <div class="main-container">
    <Menu v-model:currentTab="currentTab"/>

    <div class="tab-container">
      <Editor />
    </div>

    <SaveProjectDialog ref="saveProjectDialog" />
    <LoadProjectsDialog ref="loadProjectsDialog" />
    <SelectVariableTypeDialog ref="selectVariableTypeDialog" />
    <SelectVariableConstructorDialog ref="selectVariableConstructorDialog" />
    <AddNewVariableConstructorDialog ref="addNewVariableConstructorDialog" />
  </div>
</template>

<script>
import Menu from '@/components/other/Menu.vue';
import Editor from '@/components/editor/Editor.vue';
import SaveProjectDialog from '@/components/dialogs/SaveProjectDialog.vue'
import LoadProjectsDialog from '@/components/dialogs/LoadProjectsDialog.vue'
import SelectVariableTypeDialog from '@/components/dialogs/SelectVariableTypeDialog.vue'
import SelectVariableConstructorDialog from '@/components/dialogs/SelectVariableConstructorDialog.vue'
import AddNewVariableConstructorDialog from '@/components/dialogs/AddNewVariableConstructorDialog.vue'


import axios from 'axios';

export default {
  components: {Menu, Editor, SaveProjectDialog, LoadProjectsDialog, SelectVariableTypeDialog, SelectVariableConstructorDialog, AddNewVariableConstructorDialog},
  data() {
    return {
      currentTab: 2,
    }
  },

  methods: {
    async sendRequest(url, data={}) {
      let response = await axios.post(url, data);
      return response;
    },

    openDialog(dialog, data) {
      this.$refs[dialog].openDialog(data);
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
