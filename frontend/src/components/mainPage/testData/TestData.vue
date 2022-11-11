<template>
  <div class="test-data-container flex-row" >
    <TestCasePicker />
    
    <div class="full-size flex-row">
      <AlgoBlock class="full-size" header="Dane wejściowe">
        <AlgoTextarea 
          v-model:value="input"
          placeholder="Wprowadź dane wejściowe do programu"
          :readonly="project.isRunning">
        </AlgoTextarea>
      </AlgoBlock>

      <AlgoBlock class="full-size" header="Dane wyjściowe" v-if="project.isRunning">
        <AlgoTextarea 
          :value="currentTestCase.output"
          :readonly="true">
        </AlgoTextarea>
      </AlgoBlock>
    </div>
  </div>
</template>

<script>
import TestCasePicker from "@/components/mainPage/testData/subcomponents/TestCasePicker.vue";
import AlgoBlock from '@/components/global/AlgoBlock.vue';
import AlgoTextarea from '@/components/global/AlgoTextarea.vue';
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  components: { TestCasePicker, AlgoTextarea, AlgoBlock },

  methods: {
    ...mapActions('project', ['updateCurrentTestCaseInput']),
  },
  computed: {
    ...mapState(['project']),
    ...mapGetters('project', ['currentTestCase', 'currentFrame']),

    input: {
      get() {return this.currentTestCase.input},
      set(newValue) {this.updateCurrentTestCaseInput(newValue)}
    },

    output: {
      get() {return this.currentTestCase.output}
    },
  },
  
}
</script>

<style scoped>
  .test-data-container > :first-child {
    width: 20%;
    min-width: 200px;
    max-width: 300px;
    height: 100%;
  }

  textarea {
    height: 100%;
    padding: 5px;
  }
</style>
