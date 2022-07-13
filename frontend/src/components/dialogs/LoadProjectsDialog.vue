<template>
  <Modal
    v-show="isDialogVisible"
    v-model="isDialogVisible"
    :close="closeDialog">
    <div class="modal">
      <h1>Dostępne projekty</h1>
      
      <div v-for="project in projects" :key="project.id" 
        class="project"
        @click="openProject(project.id)">
        Nazwa: {{project.title}} <br>
        Język: {{project.language}}
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
      projects: []
    }
  },

  methods: {
    openDialog() {
      this.loadProjects();
      this.isDialogVisible = true;
    },

    closeDialog() {
      this.isDialogVisible = false;
    },
    
    loadProjects() {
      this.$root.sendRequest("BACKEND/project/findAll").then(response => {
        this.projects = response.data;
      });
    },

    openProject(id) {
      window.location.href = "/" + id;
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

  .project {
    border: 1px solid black;
    border-radius: 5px;
    margin: 5px 0;
    cursor: pointer;
  }

  .project:hover {
    background-color: #eee;
  }
</style>
