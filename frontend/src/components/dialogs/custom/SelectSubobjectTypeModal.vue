<template>
  <div class="dialog-content">
    <AlgoPickList :options="types[data.type.key]" @selectOptionEvent="selectOption" />
  </div>
</template>

<script>
import AlgoPickList from '@/components/global/AlgoPickList.vue';

export default {
  components: {AlgoPickList},

  props: ['data', 'callback'],

  data() {
    return {
      title: 'Wybierz typ obiektu wewnętrznego',
      buttons: [],
      types: {
        graph: [
          {label: 'Wyróżnienie krawędzi', key: 'graph_edges'},
          {label: 'Wyróżnienie wierzchołka/wierzchołków', key: 'graph_vertices'},
          {label: 'Ścieżka', key: 'graph_path'},
        ],
        points: [
          {label: 'Wyróżnienie punktu/punktów', key: 'graph_edges'},
          {label: 'Odcinek/Odcinki (współrzędne)', key: 'graph_edges'},
          {label: 'Odcinek/Odcinki (identyfikatory)', key: 'graph_edges'},
          {label: 'Łamana (współrzędne)', key: 'graph_edges'},
          {label: 'Łamana (identyfikatory)', key: 'graph_edges'},
          {label: 'Łamana zamknięta (współrzędne)', key: 'graph_edges'},
          {label: 'Łamana zamknięta (identyfikatory)', key: 'graph_edges'},
          {label: 'Prosta', key: 'graph_edges'},
          {label: 'Półprosta', key: 'graph_edges'},
        ],
        array: [
          {label: 'Wyróżnienie elementu/elementów', key: 'array_index'},
          {label: 'Przedział', key: 'array_part'},
        ]
      }
    }
  },

  mounted() {
    console.log(this.$props.data);
  },

  methods: {
    selectOption(selectedOption) {
      this.$props.callback(selectedOption);
      this.$root.popDialog();
    }
  },
}
</script>

<style scoped>
  .dialog-content {
    width: 60vw;
  }

</style>
