<template>
  <div class="main-panel-container flex-center">
    <AlgoButton @click="addNewSceneObject()"><i class="fa-solid fa-square-plus"></i> Dodaj nowy obiekt</AlgoButton>
  </div>
</template>

<script>
import AlgoButton from '@/components/global/AlgoButton';
import ConfigureSceneObjectModal from '@/components/modals/sceneObject/ConfigureSceneObjectModal.vue';
import { openModal } from 'jenesius-vue-modal';

export default {
  components: {AlgoButton},

  methods: {
    addNewSceneObject() {
      openModal(ConfigureSceneObjectModal)
    },
  },
}
</script>

<style scoped>
  button {
    font-size: 30px;
  }
</style>
