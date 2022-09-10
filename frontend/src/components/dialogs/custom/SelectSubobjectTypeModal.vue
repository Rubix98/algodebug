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
          {label: 'Wyróżnienie punktu/punktów', key: 'points_point'},
          {label: 'Odcinek/Odcinki', key: 'points_stretch'},
          {label: 'Łamana', key: 'points_path'},
        ],
        array: [
          {label: 'Wyróżnienie elementu/elementów', key: 'array_index'},
          {label: 'Przedział', key: 'array_part'},
        ]
      }
    }
  },

  mounted() {
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
