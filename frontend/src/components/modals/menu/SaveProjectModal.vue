<template>
  <AlgoModal title="Zapisz projekt">
    <template #default>
      <input type="text" v-model="projectTitle" class="full-size" placeholder="Tytuł projektu"> 
    </template>

    <template #buttons>
      <AlgoButton @click="save(false)">Zapisz jako</AlgoButton>
      <AlgoButton @click="save(true)" v-if="project.id">Zapisz</AlgoButton>
    </template>
  </AlgoModal>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import AlgoModal from '@/components/global/AlgoModal.vue';
import AlgoButton from '@/components/global/AlgoButton.vue';
import { closeModal } from 'jenesius-vue-modal';

export default {
  components: { AlgoModal, AlgoButton },

  data() {
    return {
      projectTitle: "",
    };
  },

  mounted() {
    this.projectTitle = this.project.title;
  },

  methods: {
    ...mapActions("project", ["saveProject"]),

    save(override) {
      this.saveProject({
        title: this.projectTitle,
        override: override
      });
      closeModal();
    }
  },

  computed: {
    ...mapState(["project"]),
  },
  
}
</script>

<style scoped>
  .dialog {
    width: 40vw;
  }

  input {
    padding: 5px 10px;
  }
</style>
