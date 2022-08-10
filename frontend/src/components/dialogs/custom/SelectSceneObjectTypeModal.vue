<template>
  <div class="dialog-content">
    <div class="flex-wrap flex-vertical-center">
      <div v-for="option in options" :key="option.key" class="option flex-column flex-center" @click="addNewObject(option)">
        <img :src="option.image" alt="graf" /> <br/>
        {{option.label}}
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: ['data', 'callback'],

  data() {
    return {
      title: 'Dodaj nowy obiekt',
      buttons: [],
      options: [
        {key: 'variable', label: 'Zmienna', image: 'images/variable.png'},
        {key: 'graph', label: 'Graf', image: 'images/graph.png'},
        {key: 'points', label: 'Zbiór punktów', image: 'images/points.png'},
        {key: 'array', label: 'Tablica', image: 'images/array.png'},
      ]
    }
  },

  mounted() {
    console.log(this.$props.data);
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
