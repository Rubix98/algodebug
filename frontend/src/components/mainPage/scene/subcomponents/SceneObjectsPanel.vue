<template>
  <div class="scene-objects-panel-container" v-if="!project.isRunning">
    <div class="scene-object-tile flex-row flex-vertical-space-between"
      v-for="(sceneObject, index) of project.sceneObjects" :key="index"
      @click="configureSceneObject(sceneObject, $event)">
        {{sceneObject.type.label}} {{sceneObject.variable.name}}
        <AlgoIcon type="x" @click="deleteSceneObject(index)"/>
    </div>
  </div>
</template>

<script>
import ConfigureSceneObjectModal from '@/components/modals/sceneObject/ConfigureSceneObjectModal.vue';
import AlgoIcon from '@/components/global/AlgoIcon';
import { openModal } from 'jenesius-vue-modal';
import { mapActions, mapState } from 'vuex';

export default {
  components: {AlgoIcon},

  methods: {
    ...mapActions('project', ['deleteSceneObject']),

    configureSceneObject(sceneObject, event) {
      if (event.target.localName === 'i') return;

      openModal(ConfigureSceneObjectModal, {sceneObject})
    },
  },

  computed: {
    ...mapState(['project'])
  }
}
</script>

<style scoped>
  .scene-object-tile {
    background: linear-gradient(#427AA1, #05668D);
    margin: 5px;
    padding: 5px 10px;
    color: white;
    border-radius: 10px;
    gap: 10px;
    cursor: pointer;
  }
</style>
