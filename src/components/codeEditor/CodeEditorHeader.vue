<template>
  <div class="code-editor-header flex-horizontal-center"> 
      <i v-for="icon in icons" :key="icon.icon" 
        :class="getIconClass(icon)"
        :title="icon.title"
        @click="iconClickHandler(icon.mode)" /> 
      
      <select :value="language" @input="this.$emit('update:language', $event.target.value)" :disabled="isLanguageSelectDisabled">
        <option v-for="language in availableLanguages" :key="language">{{language}}</option>
      </select>
  </div>
</template>

<script>

export default {
  props: ['language', 'mode'],

  data() {
    return {
      availableLanguages:   ['C++', 'C', 'Java', 'C#', 'Python'],
      icons: [
        {icon: 'fa fa-play', title: 'Uruchom program', mode: 'DEBUGGING'},
        {icon: 'fa fa-hand-pointer', title: 'Zaznacz zmienne i breakpointy', mode: 'TRACKING'},
        {icon: 'fa fa-magnifying-glass', title: 'Pokaż rozszerzony kod', mode: 'EXTENDING'},

      ]
    }
  },

  methods: {
    iconClickHandler(mode) {
      if (this.isIconActive(mode)) {
        if (this.$props.mode === mode) {
          mode = 'CODING';
        }
        this.$emit('update:mode', mode);
      }
    }
  },

  computed: {
    getIconClass() {
      return (icon) => {
        let result = icon.icon;
        if (this.isIconActive(icon.mode)) {
          result += ' icon-active';
        }
        return result;
      }
    },

    isIconActive() {
      return (mode) => {
        return this.$props.mode === 'CODING' || this.$props.mode === mode;
      }
    },

    isLanguageSelectDisabled() {
      return this.$props.mode !== 'CODING';
    }
  }
}
</script>

<style scoped>
  .code-editor-header {
    position: absolute;
    justify-content:flex-end;
    z-index: 10;
    padding: 5px 15px;
    width: 100%;
    font: initial;
    color: white; 
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
    color: #111;
  }

  .icon-active {
    color: silver;
  }

  i:hover {
    color: white;
  }

</style>
