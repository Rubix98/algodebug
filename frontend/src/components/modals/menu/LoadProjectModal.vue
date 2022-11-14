<template>
  <AlgoModal title="Wczytaj projekt">
    <template #default>
      <AlgoPickList :options="projects" @selectOptionEvent="loadProject" />
    </template>
  </AlgoModal>
</template>

<script>
import AlgoPickList from '@/components/global/AlgoPickList.vue';
import AlgoModal from "@/components/global/AlgoModal.vue";

export default {
  components: {AlgoPickList, AlgoModal},
  data() {
    return {
      projects: []
    }
  },

  created() {
    this.$root.sendRequest('BACKEND/project/findAll', {}, 'get')
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
  .dialog {
    width: 60vw;
  }

</style>
