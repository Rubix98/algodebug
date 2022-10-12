<template>
  <div class="code-editor-header flex-horizontal-center"> 
      <i class="fa fa-play" title="Uruchom program" v-show="!isRunning" @click="runProgram()" />
      <i class="fa fa-stop" title="Zatrzymaj program" v-show="isRunning" @click="stopProgram()" />
      <i class="fa fa-eye" title="Pokaż zmodyfikowany program" @click="showExtendedCode()" />

      <select :value="language" @input="changeLanguage" :disabled="isRunning">
        <option v-for="language in languages" :key="language.key" :value="language.key" :disabled="language.disabled">{{language.label}}</option>
      </select>
      
  </div>
</template>

<script>

export default {
  props: ['code', 'breakpoints', 'variables', 'converters', 'language', 'isRunning'],

  data() {
    return {
      languages:  [
        {key: "cpp", label: "C++"},
        {key: "c", label: "C", disabled: true},
        {key: "java", label: "Java", disabled: true},
        {key: "csharp", label: "C#", disabled: true},
        {key: "python", label: "Python", disabled: true},
      ]
    }
  },

  methods: {
    changeLanguage(e) {
      this.$emit('update:language', e.target.value);
    },

    runProgram() {
      this.$emit('runProgramEvent');
    },

    stopProgram() {
      this.$emit('stopProgramEvent');
    },

    showExtendedCode() {
      this.$emit("showExtendedCodeEvent");
    }
  }
}
</script>

<style scoped>
  .code-editor-header {
    position: absolute;
    justify-content:flex-end;
    z-index: 1;
    padding: 5px 15px;
    font: initial;
    color: white;
    right: 0;
  }

  input, select, button {
    margin-left: 2px;
    margin-right: 10px;
  }

  .code-editor-header select {
    width: 80px;
    padding: 2px;
  }

  .code-editor-header button {
    width: 150px;
    padding: 2px;
  }

  i {
    padding: 0 5px;
    font-size: 30px;
    cursor: pointer;
    color: #ccc;
  }

  i:hover {
    color: white;
  }

  select {
    cursor: pointer;
  }

</style>
