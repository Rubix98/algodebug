<template>
  <div class="dialog-content">
    <input type="text" v-model="projectTitle" class="full-size" placeholder="Tytuł projektu"> 
  </div>
</template>

<script>
export default {
  props: ['data', 'callback'],

  data() {
    return {
      title: 'Zapisz projekt',
      buttons: [
        {class: 'ok', label: 'Zapisz', action: () => {
          this.$props.callback(this.projectTitle);
        }}
      ],
      projectTitle: '',
    }
  },

  methods: {
    getOutput() {
      return {
        projectTitle: this.projectTitle,
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
