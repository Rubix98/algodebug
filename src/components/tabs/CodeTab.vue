<template>
  <div class="full-size">
    <CodeEditor id="code" :readonly="false" />
  </div>
</template>

<script>
import CodeEditor from '@/components/codeEditor/CodeEditor.vue'
export default {
  components: { CodeEditor }
}
</script>

<style scoped>
  
</style>
