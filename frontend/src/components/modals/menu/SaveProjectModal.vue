<template>
  <div class="dialog-content">
    <input type="text" v-model="projectTitle" class="full-size" placeholder="Tytuł projektu"> 
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {
      title: 'Zapisz projekt',
      buttons: [
        {class: 'ok', label: 'Zapisz', action: () => {
          this.saveProject(this.projectTitle);
        }}
      ],
      projectTitle: '',
    }
  },

  mounted() {
    this.projectTitle = this.project.title;
  },

  methods: {
    ...mapActions('project', ['saveProject'],)
  },

  computed: {
    ...mapState(['project']),
  }
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
