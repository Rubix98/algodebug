<template>
  <Modal
    v-show="isDialogVisible"
    v-model="isDialogVisible"
    :close="closeDialog">
    <div class="modal">
      <h1>Zapisz projekt</h1>
      <input v-model="title" placeholder="Tytuł"> <br />
      <button @click="saveProject">Zapisz</button>
      <button @click="closeDialog">Anuluj</button>
    </div>
  </Modal>
</template>

<script>
export default {
  data() {
    return {
      isDialogVisible: false,
      title: ''
    }
  },

  methods: {
    openDialog() {
      this.isDialogVisible = true;
    },

    closeDialog() {
      this.isDialogVisible = false;
    },
    
    saveProject() {
      console.log(`this.save(${this.title})`);
      this.emitter.emit('saveProject', this.title)
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
</style>
