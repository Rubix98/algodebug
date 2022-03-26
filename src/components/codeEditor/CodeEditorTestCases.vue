<template>
  <div class="code-editor-test-cases">
    <div class="full-size">
      
      <div class="test-cases-header flex-horizontal-center flex-vertical-space-between">
        <div class="flex-row">  

          <button v-for="number in numberOfTestCases" :key="number"
            :class="{'selected-button ': isSelected(number)}"
            @click="this.$emit('update:selectedTestCase', number-1)" >
            Test {{number}}
          </button>

          <button class="add-button" v-if="isCodingModeOn" @click="addTestCase">+</button>

        </div>
        <div>
            <button class="udebug-button" v-if="isCodingModeOn">uDebug</button>
        </div>
      </div>

      <div class="test-cases-body full-size flex-row flex-vertical-space-between">
        <div v-for="textarea in textareas" :key="textarea.fieldName" v-show="textarea.visible()">
          <div class="textarea-header">{{ textarea.title }}</div>
          <textarea 
            :value="testCases[selectedTestCase][textarea.fieldName]"
            @input="inputHandler(textarea.fieldName, $event.target.value)"></textarea>
        </div>
      </div>

    </div>
  </div>
</template>

<script>

export default {
  props: ['testCases', 'selectedTestCase', 'mode'],

  data() {
    return {
      textareas: [
        {title: 'Wejście', fieldName: 'input', visible: () => true},
        {title: 'Wyjście', fieldName: 'output', visible: () => this.isDebuggingModeOn},
        {title: 'Wartość śledzonych zmiennych', fieldName: 'trackedVariables', visible: () => this.isDebuggingModeOn},
      ]
    }
  },

  methods: {
    inputHandler(fieldName, newValue) {
      let testCases = this.$props.testCases;
      testCases[this.selectedTestCase][fieldName] = newValue;
      this.$emit('update:testCases', testCases);
    },
    
    addTestCase() {
      let testCases = this.$props.testCases;
      testCases.push({
        input: '',
        output: '',
        trackedVariables: ''
      })
      this.$emit('update:testCases', testCases);
    }
  },

  computed: {
    numberOfTestCases() {
      return this.$props.testCases.length;
    },

    isSelected() {
      return number => {
        return this.selectedTestCase === number-1;
      }
    },

    isCodingModeOn() {
      return this.$props.mode === 'CODING';
    },
    
    isTrackingModeOn() {
      return this.$props.mode === 'TRACKING';
    },

    isExtendingModeOn() {
      return this.$props.mode === 'EXTENDING';
    },

    isDebuggingModeOn() {
      return this.$props.mode === 'DEBUGGING';
    }
  }

}
</script>

<style scoped>
  .test-cases-header {
    height: 30px;
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
