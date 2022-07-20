<template>
  <Modal
    v-show="isDialogVisible"
    v-model="isDialogVisible"
    :close="closeDialog">
    <div class="modal">
      <h1>Wybierz rodzaj zmiennej</h1>

      <div v-for="option in options" :key="option.alias" 
        class="option"
        @click="selectOption(option.alias)">
        {{option.label}}
      </div>
      
      <button @click="closeDialog">Anuluj</button>
    </div>
  </Modal>
</template>

<script>
export default {
  data() {
    return {
      isDialogVisible: false,
      options: [
        {label: 'Zwykła zmienna', alias: 'Variable'},
        {label: 'Graf', alias: 'Graph'},
        {label: 'Kolorowanie krawędzi', alias: 'Edges'},
        {label: 'Kolorowanie wierzchołków', alias: 'vertices'},
        {label: 'Punkt', alias: 'point'},
        {label: 'Zbiór punktów', alias: 'points'},
        {label: 'Odcinek', alias: 'stretch'},
        {label: 'Tekst', alias: 'text'},
        {label: 'Tablica', alias: 'array'},
        {label: 'Tablica 2D', alias: 'array2d'},
        {label: 'Macierz', alias: 'matrix'}
      ]
        
    }
  },

  methods: {
    openDialog(data) {
      this.isDialogVisible = true;
      this.mark = data;
    },

    closeDialog() {
      this.isDialogVisible = false;
    },
    
    selectOption(option) {
      this.mark.type = option
      if (option === 'Variable') {
        this.emitter.emit('trackVariableEvent', this.mark)
      } else {
        this.emitter.emit('SelectVariableConstructorDialog:open', this.mark);
      }
      
      this.closeDialog();
    }
  }
}
</script>

<style scoped>
  .modal {
    width: 500px;
    padding: 30px;
    box-sizing: border-box;
    background-color: #fff;
    font-size: 20px;
    text-align: center;
  }

  .option {
    border: 1px solid black;
    border-radius: 5px;
    margin: 5px 0;
    cursor: pointer;
  }

  .option:hover {
    background-color: #eee;
  }
</style>
