<template>
  <div class="code-editor-test-cases">
    <div class="full-size">

      <div class="test-cases-header flex-row">
        <button v-for="(number, index) in numberOfTestCases" :key="index"
          :class="{'selected-button ': isSelected(index)}"
          @click="changeSelectedTestCase(index)" >
          Test {{number}}
        </button>

        <button class="add-button" v-if="!isMode(EditorModes.MODE_DEBUGGING)" @click="addTestCase()">+</button>
      </div>

      <div class="test-cases-body full-size flex-row flex-vertical-space-between">
        <div v-for="textarea in textareas" :key="textarea.fieldName" v-show="textarea.isVisible()">
          <div class="textarea-header">{{ textarea.title }}</div>
          <textarea 
            class="algo-textarea"
            :value="testCases.current()[textarea.fieldName]"
            @input="inputHandler($event.target.value)"></textarea>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import {EditorModes} from '@/scripts/EditorModes';

export default {
  props: ['testCases', 'isMode'],

  data() {
    return {
      EditorModes,
      textareas: [
        {title: 'Wejście', fieldName: 'input', isVisible: () => true},
        {title: 'Wyjście', fieldName: 'output', isVisible: () => this.$props.isMode(EditorModes.MODE_DEBUGGING)},
        {title: 'Zawartość pułapki', fieldName: 'breakpoint', isVisible: () => this.$props.isMode(EditorModes.MODE_DEBUGGING)},
      ]
    }
  },

  methods: {
    inputHandler(newValue) {
      let testCases = this.$props.testCases;
      testCases.current().input = newValue;
      this.$emit('update:testCases', testCases);
    },

    changeSelectedTestCase(index) {
      let testCases = this.$props.testCases;
      testCases.selectedId = index; 
      this.$emit('update:testCases', testCases);
    },
    
    addTestCase() {
      let testCases = this.$props.testCases;
      testCases.addTestCase()
      this.$emit('update:testCases', testCases);
    }
  },

  computed: {
    numberOfTestCases() {
      return this.$props.testCases.length();
    },

    isSelected() {
      return number => {
        return this.testCases.selectedId === number;
      }
    }
  }

}
</script>

<style scoped>
  .test-cases-header {
    height: 30px;
    padding-top: 5px;
  }

  .test-cases-body {
    height: calc(100% - 30px);
  }

  .test-cases-header button {
    padding: 2px;
    width: 70px;
    margin-right: 5px;
  }

  .test-cases-header .selected-button {
    background-color: grey;
  }

  .test-cases-header .add-button {
    width: 30px;
    background-color: lime;
    border: 2px solid green;
  }

  .test-cases-header .udebug-button {
    background-color: red;
    color: white;
  }

  .test-cases-body > div {
    width: 100%;
  }

  .test-cases-body .textarea-header {
    text-align: center;
    height: 20px;
    font: initial;
  }

  .test-cases-body textarea {
    width: 100%;
    height: calc(100% - 20px);
    padding: 5px;
  }
</style>
