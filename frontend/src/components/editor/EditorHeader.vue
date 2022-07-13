<template>
  <div class="code-editor-header flex-horizontal-center"> 
      <i v-for="icon in icons" :key="icon.icon" 
        :class="getIconClass(icon)"
        :title="icon.title"
        @click="iconClickHandler(icon.mode)"
        v-show="icon.isVisible()"
      /> 
      
      <select :value="language" @input="this.$emit('update:language', $event.target.value)" :disabled="isLanguageSelectDisabled">
        <option v-for="language in availableLanguages" :key="language">{{language}}</option>
      </select>
  </div>
</template>

<script>
import {EditorModes} from '@/scripts/EditorModes';

export default {
  props: ['language', 'isMode'],

  data() {
    return {
      EditorModes,
      availableLanguages:   ['C++', 'C', 'Java', 'C#', 'Python'],
      icons: [
        {icon: 'fa fa-stop', title: 'Zatrzymaj program', mode: EditorModes.MODE_DEBUGGING, isVisible: () => this.$props.isMode(EditorModes.MODE_DEBUGGING)},
        {icon: 'fa fa-play', title: 'Uruchom program', mode: EditorModes.MODE_COMPILING, isVisible: () => !this.$props.isMode(EditorModes.MODE_DEBUGGING)},
        {icon: 'fa fa-hand-pointer', title: 'Zaznacz zmienne i breakpointy', mode: EditorModes.MODE_SETTINGS, isVisible: () => true},
        {icon: 'fa fa-eye', title: 'Pokaż rozszerzony kod', mode: EditorModes.MODE_INSPECTING, isVisible: () => true},
      ]
    }
  },

  methods: {
    iconClickHandler(mode) {
      if (this.isIconActive(mode)) {
        if (this.$props.isMode(mode)) {
          mode = EditorModes.MODE_CODING;
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
        return this.isMode(mode) || this.isMode(EditorModes.MODE_CODING);
      }
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

  .icon-active:hover {
    color: white;
  }

</style>
