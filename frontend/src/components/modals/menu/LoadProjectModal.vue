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

  mounted() {
    
  },

  methods: {
    loadProject(selectedProject) {
      this.$props.callback(selectedProject);
    }
  },
}
</script>

<style scoped>
  .dialog-content {
    width: 60vw;
  }

</style>
