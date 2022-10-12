<template>
  <div class="dialog-content">
    <CodeEditor 
      id="pick-variable-editor"
      :code="data.code"
      :variables="data.variables"
      :breakpoints="data.breakpoints"
      :editable="false"
      :clickable="true"
      @pickVariableEvent="pickVariable"/>
  </div>
</template>

<script>
import CodeEditor from "@/components/mainPage/codeEditor/CodeEditor.vue";

export default {
  components: { CodeEditor },
  
  props: ["data", "callback"],

  data() {
    return {
      title: 'Zaznacz zmienną',
      extendedCode: ''
    };
  },

  mounted() {
  },

  methods: {
    pickVariable(variable) {
      this.$props.callback(variable);
      this.$root.popDialog();

      
    }
  },

  computed: {
    code() {
      return this.$props.data.code;
    }
  }
}
</script>

<style scoped>
  .dialog-content {
    width: 60vw;
    height: 500px;
    overflow: hidden;
  }

  

</style>
