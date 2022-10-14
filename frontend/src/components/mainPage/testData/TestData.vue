<template>
  <div class="code-editor-test-cases">
    <div class="full-size flex-row flex-vertical-space-between">
      <TestCasePicker />
      
      <div class="test-cases-body full-size flex-row flex-vertical-space-between">
        <AlgoBlock header="Dane wejściowe">
          <AlgoTextarea 
            v-model:value="input"
            placeholder="Wprowadź dane wejściowe do programu"
            :readonly="project.isRunning">
          </AlgoTextarea>
        </AlgoBlock>

        <AlgoBlock header="Dane wyjściowe" v-if="project.isRunning">
          <AlgoTextarea 
            :value="currentTestCase.output"
            :readonly="true">
          </AlgoTextarea>
        </AlgoBlock>

        <AlgoBlock header="Zawartość pułapki" v-if="project.isRunning">
          <AlgoTextarea 
            :value="currentTestCase.output"
            :readonly="true">
          </AlgoTextarea>
        </AlgoBlock>
      </div>
    </div>
  </div>
</template>

<script>
import TestCasePicker from "./subcomponents/TestCasePicker.vue";
import AlgoTextarea from '@/components/global/AlgoTextarea.vue';
import AlgoBlock from '@/components/global/AlgoBlock.vue';
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  components: { TestCasePicker, AlgoTextarea, AlgoBlock },

  data() {
    return {
      textareasData: [ // TODO zastosować tablicę do budowania template
        {key: 'input', title: "Dane wejściowe", model: this.input, isVisible: () => true},
        {key: 'output', title: "Dane wyjściowe", model: this.output, isVisible: () => this.project.isRunning},
        {key: 'frame', title: "Zawartość pułapki", model: this.frame, isVisible: () => this.project.isRunning},
      ]
    };
  },

  methods: {
    ...mapActions('project', ['updateCurrentTestCaseInput']),
  },
  computed: {
    ...mapState(['project']),
    ...mapGetters('project', ['currentTestCase', 'currentFrame']),

    input: {
      get() {return this.currentTestCase.input;},
      set(newValue) {this.updateCurrentTestCaseInput(newValue)}
    },

    output: {
      get() {return this.currentTestCase.output},
      set() {}
    },

    frame: {
      get() {return this.currentFrame.output},
      set() {}
    },

    isTestCaseSelected() {
      return (index) => index === this.project.selectedTestCaseId;
    }
  },
  
}
</script>

<style scoped>
  .test-cases-header {
    height: 30px;
    padding-top: 5px;
  }

  .test-cases-header button {
    padding: 2px;
    width: 70px;
    margin-right: 5px;
  }

  .test-cases-body > div {
    width: 100%;
  }

  .test-cases-body textarea {
    width: 100%;
    height: calc(100% - 24px);
    padding: 5px;
  }

  .tests-block {
    width: 20%;
    min-width: 200px;
    max-width: 250px;
  }

  .tests-container {
    height: calc(100% - 24px);
    overflow: auto;
    background-color: white;
    border-radius: 10px;
    width: 100%;
  }

  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
    background-color: white;
    width: 100%;
  }

  li {
    border-bottom: 1px solid silver;
    padding: 5px;
    cursor: pointer;
  }

  li:last-child {
    border: none;
  }

  li:hover {
    background-color: #ddd;
  }

  .selected {
    background-color: #ddd;
  }

  .button-container {
    text-align: center;
    margin-top: 10px;
  }

</style>
