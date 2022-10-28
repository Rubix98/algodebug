<template>
  <div class="code-editor full-size">
    <div class="editor-main flex-row">
      <div class="width-1-of-2" style="position:relative">
        <!-- no property !isRunning -->
        <CodeEditor 
          id="main-editor"
          :code="project.code"
          :editable="true"
          :clickable="false" />

      </div>
      <div class="width-1-of-2">

        <Scene/>

      </div>
    </div>

    <TestData/>

  </div>
</template>

<script>
import CodeEditor from './codeEditor/CodeEditor.vue';
import TestData from './testData/TestData.vue';
import Scene from './scene/Scene.vue';
import {mapState, mapActions} from "vuex";

export default {
  components: { CodeEditor, TestData, Scene },

  mounted() {
    if (this.projectId) {
      this.loadProject(this.projectId);
    }

    this.emitter.on('openSaveProjectModalEvent', this.openSaveProjectModal)
    this.emitter.on('saveSceneObjectEvent', this.saveSceneObject)
  },

  methods: {
    ...mapActions('project', ['loadProject']),
  },

  computed: {
    ...mapState(['project']),

    projectId() {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get("projectId");
    }
  }
}
</script>

<style>
  .code-editor {
    /* background-image: url('/images/background.png');  */
    font: 16px Consolas;
    padding: 10px;
  }

  .code-editor-line-numbers {
    width: 60px;
    height: 100%;
    background-color: silver;
    color: black;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
  }

  .editor-main {
    height: 70%;
    gap: 10px;
  }
  
  .code-editor-test-cases {
    height: 30%;
    margin-top: 5px;
  }

  .code-editor-body {
    background-color: black;
    color: white;
    border-radius: 10px;
  }

</style>
