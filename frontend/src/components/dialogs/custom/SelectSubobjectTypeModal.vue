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
          {label: 'Wyróżnienie krawędzi', value: 'graph_edges'},
          {label: 'Wyróżnienie wierzchołka/wierzchołków', value: 'graph_vertices'},
          {label: 'Ścieżka', value: 'graph_path'},
        ],
        points: [
          {label: 'Wyróżnienie punktu/punktów', value: 'graph_edges'},
          {label: 'Odcinek/Odcinki (współrzędne)', value: 'graph_edges'},
          {label: 'Odcinek/Odcinki (identyfikatory)', value: 'graph_edges'},
          {label: 'Łamana (współrzędne)', value: 'graph_edges'},
          {label: 'Łamana (identyfikatory)', value: 'graph_edges'},
          {label: 'Łamana zamknięta (współrzędne)', value: 'graph_edges'},
          {label: 'Łamana zamknięta (identyfikatory)', value: 'graph_edges'},
          {label: 'Prosta', value: 'graph_edges'},
          {label: 'Półprosta', value: 'graph_edges'},
        ],
        array: [
          {label: 'Wyróżnienie elementu/elementów', value: 'graph_edges'},
          {label: 'Przedział', value: 'graph_edges'},
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
