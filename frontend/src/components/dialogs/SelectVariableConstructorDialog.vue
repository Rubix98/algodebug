<template>
  <Modal
    v-show="isDialogVisible"
    v-model="isDialogVisible"
    :close="closeDialog">
    <div class="modal">
      <h1>Wybierz konstruktor</h1>

      <div v-for="constructor in constructors" :key="constructor.id" 
        class="option"
        @click="selectOption(constructor)">
        Nazwa: {{constructor.title}}<br>
        Kod: <br>
        <textarea v-model="constructor.code" class="full-size" readonly="true"></textarea>
      </div>
      
      <button @click="addNewConstructor">Dodaj nowy konstruktor</button>
      <button @click="closeDialog">Anuluj</button>
    </div>
  </Modal>
</template>

<script>
export default {
  data() {
    return {
      isDialogVisible: false,
      constructors: [],
      defaultConstructors: {
        graph: {
          code: `AlgoGraph::AlgoGraph(<graph-type> graph) {\n\tfor(<edge-type> edge: graph.<edge-variable-name>) {\n\t\tthis.addEdge(edge.<edge-start>, edge.<edge.end>, edge.<edge-weight>);\n\t}\n}`
        }
      }
        
    }
  },

  mounted() {
    this.emitter.on('SelectVariableConstructorDialog:open', this.openDialog)
  },

  methods: {
    openDialog(data) {
      this.isDialogVisible = true;

      this.mark = data;
      
      this.$root.sendRequest('backend/constructor/findAll').then(response=> {
        this.constructors = response.data;
      })
    },

    closeDialog() {
      this.isDialogVisible = false;
    },
    
    selectOption(option) {
      this.mark.constructor = option;
      this.emitter.emit("addMark", this.mark)
      this.closeDialog();
    },

    addNewConstructor() {
      this.emitter.emit('AddNewVariableConstructorDialog:open', {
        data: this.mark
      });
      this.closeDialog();
    }
  }
}
</script>

<style scoped>
  .modal {
    width: 1000px;
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
    text-align: left;
  }

  .option:hover {
    background-color: #eee;
  }
</style>
