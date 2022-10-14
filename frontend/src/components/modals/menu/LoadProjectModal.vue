<template>
  <div class="dialog-content">
    <AlgoPickList :options="projects" @selectOptionEvent="loadProject" />
  </div>
</template>

<script>
import AlgoPickList from '@/components/global/AlgoPickList.vue';

export default {
  components: {AlgoPickList},

  props: ['data', 'callback'],

  data() {
    return {
      title: 'Wczytaj projekt',
      projects: []
    }
  },

  created() {
    this.$root.sendRequest('BACKEND/project/findAll')
      .then((response) => {
        this.projects = response.data;
      });
  },

  methods: {
    loadProject(selectedProject) {
      this.$root.redirectTo("?projectId=" + selectedProject.id);
    }
  },
}
</script>

<style scoped>
  .dialog-content {
    width: 60vw;
  }

</style>
