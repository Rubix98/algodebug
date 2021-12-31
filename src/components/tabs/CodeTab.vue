<template>
  <div class="full-size">
    <CodeEditor id="code" :readonly="false" />
    <TestCase />
  </div>
</template>

<script>
import CodeEditor from '@/components/codeEditor/CodeEditor.vue'
import TestCase from '@/components/testCase/TestCase.vue'
export default {
  components: { CodeEditor, TestCase }
}
</script>

<style scoped>
  .code-editor {
    height: 70%;
  }
  
  .test-case {
    height: 30%;
  }
</style>
