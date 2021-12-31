<template>
  <div class="test-case full-size">
    <div class="test-case-header flex-horizontal-center flex-vertical-space-between">
      <div class="flex-row ">
        <div v-for="number in numberOfTestCases" :key="number">
          <button @click="selectTestCase(number)" :class="{'selected': isSelected(number)}">Test {{number}}</button>
        </div>
        <div>
          <button class="add-button" @click="addTestCase">+</button>
        </div>
      </div>
      <div>
        <div>
          <button class="udebug-button">uDebug</button>
        </div>
      </div>
    </div>

    <div class="test-case-body flex-row full-size">
      <div>
        <textarea v-model=inputs[selectedTestCase]></textarea>
      </div>
      <div>
        <textarea v-model=outputs[selectedTestCase]></textarea>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  
  data() {
    return {
      selectedTestCase: 0,
      numberOfTestCases: 1,
      inputs: [''],
      outputs: ['']
    }
  },

  methods: {
    addTestCase() {
      this.selectedTestCase = this.numberOfTestCases;
      this.numberOfTestCases++;
      this.inputs.push('');
      this.outputs.push('');
    },

    selectTestCase(number) {
      this.selectedTestCase = number-1;
    }
  },

  computed: {
    isSelected() {
      return number => {
        return this.selectedTestCase === number-1;
      }
    }
  }

}
</script>

<style scoped>
  .test-case {
    background-color: silver;
    padding: 5px;
  }

  .test-case-header {
    height: 30px;
  }

  .test-case-body {
    height: calc(100% - 30px);
  }

  .test-case-header button {
    padding: 2px;
    width: 70px;
    margin-right: 5px;
  }

  .test-case-header .selected {
    background-color: grey;
  }

  .test-case-header .udebug-button {
    background-color: red;
    color: white;
  }

  .test-case-header .add-button {
    width: 30px;
    background-color: lime;
    border: 2px solid green;
  }

  .test-case-body > div {
    width: 50%;
  }

  .test-case textarea {
    width: 100%;
    height: 100%;
  }
</style>
