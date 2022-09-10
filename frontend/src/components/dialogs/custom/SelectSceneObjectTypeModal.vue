<template>
  <div class="dialog-content">
    <AlgoPickList :options="options" @selectOptionEvent="addNewObject" />
  </div>
</template>

<script>
import AlgoPickList from '@/components/global/AlgoPickList.vue';

export default {
  components: {AlgoPickList},

  props: ['data', 'callback'],

  data() {
    return {
      title: 'Dodaj nowy obiekt',
      buttons: [],
      options: [
        {key: 'variable', label: 'Zmienna'},
        {key: 'graph', label: 'Graf'},
        {key: 'array', label: 'Tablica'},
        {key: 'points', label: 'Zbiór punktów'},
        {key: 'circle', label: 'Okrąg'},
        {key: 'shape', label: 'Wielokąt'},
      ]
    }
  },

  mounted() {
  },

  methods: {
    addNewObject(selectedType) {
      this.$props.callback(selectedType);
      this.$root.popDialog();
    }
  },
}
</script>

<style scoped>
  .dialog-content {
    width: 70vw;
  }

  .option {
    width: 300px;
    height: 260px;
    background-color: skyblue;
    border: 1px solid black;
    border-radius: 5px;
    padding: 5px;
    margin: 10px;
    text-align: center;
    cursor: pointer;
    transition: background-color 0.5s;
  }

  .option:hover {
    background-color: rgb(90, 180, 220);
  }

  img {
    width: 200px;
    height: 200px;
  }
</style>
