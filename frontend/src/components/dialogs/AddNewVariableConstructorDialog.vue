<template>
  <Modal
    v-show="isDialogVisible"
    v-model="isDialogVisible"
    :close="closeDialog">
    <div class="modal">
      <h1>Dodaj konstruktor</h1>

      <input type="text" v-model="title" />
      <div>
        <textarea v-model="code" class="full-size" style="height: 100%"></textarea>
      </div>
      
      <button @click="saveConstructor">Zapisz</button>
      <button @click="closeDialog">Anuluj</button>
    </div>
  </Modal>
</template>

<script>
export default {
  data() {
    return {
      isDialogVisible: false,
      title: '',
      code: '',
      defaultConstructors: {
        graph: {
          code: `AlgoGraph::AlgoGraph(<graph-type> graph) {\n\tfor(<edge-type> edge: graph.<edge-variable-name>) {\n\t\tthis.addEdge(edge.<edge-start>, edge.<edge.end>, edge.<edge-weight>);\n\t}\n}`
        }
      }
        
    }
  },

  mounted() {
    this.emitter.on('AddNewVariableConstructorDialog:open', this.openDialog);
    this.code = this.defaultConstructors.graph.code;
  },

  methods: {
    openDialog(data) {
      this.isDialogVisible = true;
      this.mark = data;
    },

    closeDialog() {
      this.isDialogVisible = false;
    },
    
    saveConstructor() {
      this.$root.sendRequest("backend/constructor/save", {
        title: this.title,
        language: 'C++',
        type: 'graph',
        code: this.code
      }).then(response => {
        this.mark.constructor = response.data;
      });
      this.emitter.emit("addMark", this.mark);
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
    height: 200px;
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
