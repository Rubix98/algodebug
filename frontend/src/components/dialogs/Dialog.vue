<template>
  <div class="dialog">
    <div class="dialog-header flex-vertical-space-between">
        <h1>{{title}}</h1>
        <i class="fa fa-close" title="Zamknij okno" @click="popModal()"></i> 
    </div>

    <div class="dialog-content">
      <component :is="modalComponentName" :data="data" :callback="callback" ref="modalComponent"></component>
    </div>

    <div class="flex-vertical-right" style="margin-top: 10px">
      <span v-for="(button, index) in buttons" :key="index">
        <AlgoButton :class="button.class" @click="button.action">{{button.label}}</AlgoButton>
      </span>
      
    </div>
  </div>
</template>

<script>
/* eslint-disable vue/no-unused-components */
import LoadProjectModal from './custom/LoadProjectModal.vue';
import SaveProjectDialog from './custom/SaveProjectDialog.vue';
import ShowSceneObjectsModal from './custom/ShowSceneObjectsModal.vue';
import SelectSceneObjectTypeModal from './custom/SelectSceneObjectTypeModal.vue';
import ConfigureSceneObjectModal from './custom/ConfigureSceneObjectModal.vue'
import PickVariableModal from './custom/PickVariableModal.vue'
import SelectConverterModal from './custom/SelectConverterModal.vue';
import AddNewConverterModal from './custom/AddNewConverterModal.vue';
import SelectSubobjectTypeModal from './custom/SelectSubobjectTypeModal.vue';
import ShowExtendedCodeModal from './custom/ShowExtendedCodeModal.vue';
import AlgoButton from '../global/AlgoButton.vue';

export default {
  components: {LoadProjectModal, SaveProjectDialog, ShowSceneObjectsModal, SelectSceneObjectTypeModal, ConfigureSceneObjectModal, PickVariableModal, SelectConverterModal, AddNewConverterModal, SelectSubobjectTypeModal, ShowExtendedCodeModal, AlgoButton},

  props: ['modalComponentName', 'data', 'callback'],

  data() {
    return {
      title: '',
      buttons: []
    }
  },

  mounted() {
    this.title = this.modalComponent.title;
    this.buttons = this.modalComponent.buttons;

  },

  methods: {
    popModal() {
      this.$root.popDialog()
    },
  },

  computed: {
    modalComponent() {
      return this.$refs.modalComponent;
    }
  }
}
</script>

<style>
  .modal-container {
    z-index: 10;
  }

  .dialog {
    padding: 30px 50px;
    box-sizing: border-box;
    background-color: #fff;
    font-size: 20px;
    z-index: 100;
    border-radius: 20px;
  }

  .dialog-header {
    margin-bottom: 15px;
  }

  .dialog-content {
    max-height: 70vh;
    overflow: auto;
  }

  button {
    margin-left: 5px;
  }

  i {
    cursor: pointer;
  }
</style>
