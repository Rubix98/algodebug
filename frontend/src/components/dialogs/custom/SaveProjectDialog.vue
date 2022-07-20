<template>
  <div class="dialog-content">
    <input type="text" v-model="projectTitle" class="full-size" placeholder="Tytuł projektu"> 
    <textarea v-model="projectDescription" class="algo-textarea full-size"  placeholder="Opis projektu"></textarea>
  </div>
</template>

<script>
export default {
  props: ['data'],

  data() {
    return {
      projectTitle: '',
      projectDescription: ''
    }
  },

  methods: {
    getOutput() {
      return {
        projectTitle: this.projectTitle,
        projectDescription: this.projectDescription
      }
    }
  },
}
</script>

<style scoped>
  .dialog-content {
    width: 40vw;
  }

  textarea {
    height: 150px;
    margin-top: 10px;
  }

  input, textarea {
    padding: 5px 10px;
  }
</style>
