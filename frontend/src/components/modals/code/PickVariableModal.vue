<template>
  <AlgoModal title="Zaznacz zmienną">
    <template #default>
      <CodeEditor 
        id="pick-variable-editor"
        :code="project.code"
        :editable="false"
        :clickable="true"
        @pickVariableEvent="handlePickVariable"/>
    </template>
  </AlgoModal>
</template>

<script>
import CodeEditor from "@/components/mainPage/codeEditor/CodeEditor.vue";
import AlgoModal from "@/components/global/AlgoModal.vue";
import { popModal } from "jenesius-vue-modal";
import { mapState } from "vuex";

export default {
  components: { CodeEditor, AlgoModal },

  methods: {
    handlePickVariable(variable) {
      this.$props.callback(variable);
      popModal();
    }
  },

  computed: {
    ...mapState(['project'])
  }
}
</script>

<style scoped>
  .dialog {
    width: 80vw;
  }
</style>
