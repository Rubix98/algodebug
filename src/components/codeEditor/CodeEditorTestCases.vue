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

          <button class="add-button" v-if="!readonly" @click="addTestCase">+</button>

        </div>
        <div>
            <button class="udebug-button" v-if="!readonly">uDebug</button>
        </div>
      </div>

      <div class="test-cases-body full-size flex-row flex-vertical-space-between">
        <div>
          <div class="textarea-header">Wejście</div>
          <textarea 
            :value="inputs[selectedTestCase]"
            :readonly="readonly"
            @input="inputHandler('inputs', selectedTestCase, $event.target.value)"></textarea>
        </div>

        <div>
          <div class="textarea-header">Wyjście</div>
          <textarea 
            :value="outputs[selectedTestCase]"
            :readonly="readonly"
            @input="inputHandler('outputs', selectedTestCase, $event.target.value)"></textarea>
        </div>

        <div>
          <div class="textarea-header">Wartość śledzonych zmiennych</div>
          <textarea 
            :value="outputs[selectedTestCase]"
            :readonly="readonly"
            @input="inputHandler('inspector', selectedTestCase, $event.target.value)"></textarea>
        </div>
      </div>

    </div>
  </div>
</template>

<script>

export default {
  props: ['inputs', 'outputs', 'selectedTestCase', 'readonly'],

  methods: {
    inputHandler(name, number, value) {
      let tab = this.$props[name];
      tab[number] = value;
      this.$emit(`update:${name}`, tab);
    },
    
    addTestCase() {
      let inputs = this.$props.inputs;
      inputs.push('');
      this.$emit('update:inputs', inputs);

      let outputs = this.$props.outputs;
      outputs.push('');
      this.$emit('update:outputs', outputs);
    }
  },

  computed: {
    numberOfTestCases() {
      return this.$props.inputs.length;
    },

    isSelected() {
      return number => {
        return this.selectedTestCase === number-1;
      }
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
    width: calc(50% - 5px);
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
