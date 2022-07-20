<template>
  <div>
    <Modal
      v-if="isVisible"
      v-model="isVisible"
      :close="closeDialog">

      <div class="dialog">
        <div class="dialog-header">
          <h1>{{currentDialog.title}}</h1>
        </div>
        <div class="dialog-content">
          <SelectListDialog 
            ref="SelectListDialog"
            v-if="currentDialog.type === 'SelectListDialog'"
            @selectOptionEvent="accept()"
            :options="currentDialog.options">
          </SelectListDialog>
          
          <SaveProjectDialog 
            ref="SaveProjectDialog"
            v-if="currentDialog.type === 'SaveProjectDialog'"
            :data="currentDialog.data">
          </SaveProjectDialog>
        </div>

        <div class="flex-vertical-right">
          <button class="algo-button-default" v-if="dialogsQueue.length > 1" @click="back()">Cofnij</button>
          <button class="algo-button-ok" @click="accept()">OK</button>
        </div>
      </div>

    </Modal>
  </div>
</template>

<script>
import SelectListDialog from './global/SelectListDialog.vue';
import SaveProjectDialog from './custom/SaveProjectDialog.vue';
import { DialogsFactory } from '@/scripts/DialogsFactory';

export default {
  components: {SelectListDialog, SaveProjectDialog},

  data() {
    return {
      isVisible: false,
      dialogsQueue: [],
      callback: null
    }
  },

  methods: {
    async openDialog(dialog, callback) {
      let dialogData = await DialogsFactory.get(dialog, this.$root.sendRequest);
      console.log(dialogData);
      this.dialogsQueue.push(dialogData);
      this.isVisible = true;
      if (callback) {
        this.callback = callback;
      }
    },

    accept() {
      let output = this.currentComponent.getOutput();
      let nextDialog = this.currentDialog.nextDialog != null ? this.currentDialog.nextDialog(output) : null;
      this.currentDialog.output = output;

      this.isVisible = false;
      if (nextDialog != null) {
        this.openDialog(nextDialog);
      } else {
        this.callback(output);
      }
    },

    closeDialog() {
      this.isVisible = false;
      this.dialogsQueue = [];
    },

    back() {
      this.dialogsQueue.pop();
    },
  },

  computed: {
    currentDialog() {
      return this.dialogsQueue.at(-1);
    },

    currentComponent() {
      return this.$refs[this.currentDialog.type];
    }
  }
}
</script>

<style>
  .vue-universal-modal, .vue-universal-modal-content {
    z-index: 10;
  }

  .dialog {
    position: relative;
    width: auto;
    padding: 30px 50px;
    box-sizing: border-box;
    background-color: #fff;
    font-size: 20px;
    z-index: 1000;
    border-radius: 20px;
  }

  .dialog-content {
    max-height: 70vh;
    overflow: auto;
  }

  .button {
    margin-left: 5px;
  }
</style>
