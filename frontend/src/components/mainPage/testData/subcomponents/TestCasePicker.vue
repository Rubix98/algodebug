<template>
  <AlgoBlock header="Wybór testów" class="tests-block">
    <div class="tests-container">
      <ul>
        <li v-for="(number, index) in numberOfTestCases" :key="index" 
          :class="{'selected ': isTestCaseSelected(index)}"
          @click="switchTestCase(index, $event)"
        >
        <div class="flex-row flex-vertical-space-between">
          Test {{number}}
          <AlgoIcon type="x" @click="deleteTestCase(index)" v-if="!project.isRunning && project.testData.length > 1"/>
        </div>
        
        </li>
      </ul>

      <div class="button-container">
        <AlgoButton class="add-button" v-if="!project.isRunning" @click="addTestCase()">
          <i class="fa-solid fa-square-plus"></i> Dodaj nowy test
        </AlgoButton>
      </div>
    </div>
  </AlgoBlock>
</template>

<script>
import AlgoBlock from '@/components/global/AlgoBlock.vue';
import AlgoButton from '@/components/global/AlgoButton.vue';
import AlgoIcon from '@/components/global/AlgoIcon.vue';
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  components: { AlgoBlock, AlgoButton, AlgoIcon },

  methods: {
    ...mapActions('project', ['addTestCase', 'deleteTestCase', 'changeCurrentTestCase']),

    switchTestCase(index, event) {
      if (event.target.localName === 'i') return;
      this.changeCurrentTestCase(index);
    }, 
  },
  
  computed: {
    ...mapState(['project']),
    ...mapGetters('project', ['numberOfTestCases']),

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
