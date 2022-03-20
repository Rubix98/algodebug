<template>
  <div class="code-editor-header flex-horizontal-center">
    Tytuł:
    <input type="text" :value="title" @input="this.$emit('update:title', $event.target.value)" :disabled="readonly" />
    
    Język programowania: 
    <select :value="language" @input="this.$emit('update:language', $event.target.value)" :disabled="readonly">
      <option v-for="language in availableLanguages" :key="language">{{language}}</option>
    </select>

    <button @click="this.$emit('update:trackVariablesMode', !trackVariablesMode)" :disabled="readonly || showExtendedCode">
      {{buttonLabel(['Zaznacz zmienne', 'Edytuj kod'], trackVariablesMode)}}
    </button>

    <button @click="this.$emit('update:showExtendedCode', !showExtendedCode)">
      {{buttonLabel(['Pokaż rozszerzony kod', 'Pokaż bazowy kod'], showExtendedCode)}}
    </button>

    <button @click="this.$emit('compileEvent')">
      Kompiluj
    </button>
  </div>
</template>

<script>

export default {
  props: ['title', 'language', 'trackVariablesMode', 'showExtendedCode', 'readonly'],

  data() {
    return {
      availableLanguages:   ['C++', 'C', 'Java', 'C#', 'Python']
    }
  },

  methods: {
  },

  computed: {
    buttonLabel() {
      return (labels, variable) => {
        return labels[variable ? 1 : 0];
      }
    }
  }
}
</script>

<style scoped>
  .code-editor-header {
    padding: 5px 0;
    width: 100%;
    font: initial;
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

</style>
