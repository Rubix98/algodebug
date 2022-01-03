<template>
  <div class="full-size flex-row">
    <div class="width-1-of-2">
      <CodeEditor id="displayCode" :readonly="true" />
    </div>
    <div class="width-1-of-2">
      <SceneInterface />
    </div>
  </div>
</template>

<script>
import CodeEditor from '@/components/codeEditor/CodeEditor.vue';
import SceneInterface from '@/components/sceneInterface/SceneInterface.vue';
export default {
  components: { CodeEditor, SceneInterface }
}
</script>

<style scoped>
  
</style>
