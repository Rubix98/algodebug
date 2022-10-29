<template>
  <AlgoModal title="Kod debugujący">
    <template #default>
      <CodeEditor id="debug-code-editor" :code="debugCode" :editable="false" :clickable="true"/>
    </template>
  </AlgoModal>
</template>

<script>
import CodeEditor from "@/components/mainPage/codeEditor/CodeEditor.vue";
import AlgoModal from '@/components/global/AlgoModal.vue';
import { mapGetters } from "vuex";

export default {
  components: { AlgoModal, CodeEditor },

  mounted() {
    console.log(this.debugCode)
  },

  computed: {
    ...mapGetters('project', ['debugCode'])
  },
}
</script>

<style scoped>
  .dialog {
    width: 60vw;
  }
</style>
