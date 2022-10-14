<template>
  <div class="dialog-content">
    <CodeEditor id="debug-code-editor" :project="data.project" :code="data.code" :editable="false" :clickable="false"/>
  </div>
</template>

<script>
import CodeEditor from "@/components/mainPage/codeEditor/CodeEditor.vue";

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
    console.log()
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
