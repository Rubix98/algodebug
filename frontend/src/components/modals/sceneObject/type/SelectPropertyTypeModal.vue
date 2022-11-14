<template>
  <AlgoModal title="Wybierz typ obiektu wewnętrznego">
    <template #default>
      <AlgoPickList :options="types[sceneObjectType.key]" @selectOptionEvent="handleSelectOption" />
    </template>
  </AlgoModal>
</template>

<script>
import AlgoPickList from '@/components/global/AlgoPickList.vue';
import AlgoModal from '@/components/global/AlgoModal.vue';
import {popModal} from "jenesius-vue-modal";

export default {
  components: {AlgoPickList, AlgoModal},

  props: ['sceneObjectType', 'callback'],

  data() {
    return {
      types: {
        graph: [
          {label: 'Wyróżnienie krawędzi', key: 'graph_edges'},
          {label: 'Wyróżnienie wierzchołków', key: 'graph_vertices'},
          {label: 'Ścieżka', key: 'graph_path'},
        ],
        points: [
          {label: 'Wyróżnienie punktów', key: 'points_point'},
          {label: 'Odcinki', key: 'points_stretch'},
          {label: 'Łamana', key: 'points_path'},
        ],
        array: [
          {label: 'Wyróżnienie komórek', key: 'array_index'},
          {label: 'Przedział', key: 'array_part'},
        ]
      }
    }
  },

  methods: {
    handleSelectOption(selectedOption) {
      this.$props.callback(selectedOption);
      popModal();
    }
  },
}
</script>

<style scoped>
  .dialog {
    width: 40vw;
  }

</style>
