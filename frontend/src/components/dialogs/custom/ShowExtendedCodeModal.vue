<template>
  <div class="dialog-content">
    <CodeEditor id="debug-code-editor" :code="data.code" :editable="false" :clickable="false"/>
  </div>
</template>

<script>
import CodeEditor from "../../editor/CodeEditor.vue";

export default {
  components: { CodeEditor },
  
  props: ["data"],

  data() {
    return {
      title: 'Kod debugujący',
      extendedCode: ''
    };
  },

  mounted() {
  },

  methods: {

  },
}
</script>

<style scoped>
  .dialog-content {
    width: 60vw;
    height: 500px;
    overflow: hidden;
  }

  

</style>
