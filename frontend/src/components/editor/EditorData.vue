<template>
  <div class="code-editor-test-cases">
    <div class="full-size flex-row flex-vertical-space-between">
      <AlgoBlock header="Wybór testów" class="tests-block">
        <div class="tests-container">
          <ul>
            <li v-for="(number, index) in numberOfTestCases" :key="index" 
              :class="{'selected ': isSelected(index)}"
              @click="changeSelectedTestCase(index, $event)"
            >
            <div class="flex-row flex-vertical-space-between">
              Test {{number}}
              <AlgoIcon type="x" @click="deleteTestCase(index)" v-if="!isRunning && testCases.length() > 1"/>
            </div>
            
            </li>
          </ul>

          <div class="button-container">
            <AlgoButton class="add-button" v-if="!isRunning" @click="addTestCase()">
              <i class="fa-solid fa-square-plus"></i> Dodaj nowy test
            </AlgoButton>
          </div>
        </div>
      </AlgoBlock>


      <div class="test-cases-body full-size flex-row flex-vertical-space-between">
        <AlgoBlock header="Dane wejściowe">
          <AlgoTextarea 
            :value="testCases.current().input"
            placeholder="Wprowadź dane wejściowe do programu"
            @input="inputHandler($event.target.value)">
          </AlgoTextarea>
        </AlgoBlock>

        <AlgoBlock header="Dane wyjściowe" v-if="isRunning">
          <AlgoTextarea 
            :value="testCases.current().output"
            @input="inputHandler($event.target.value)">
          </AlgoTextarea>
        </AlgoBlock>


        <AlgoBlock header="Zawartość pułapki" v-if="isRunning">
          <AlgoTextarea 
            :value="testCases.current().frames[testCases.current().selectedFrameId].output">
          </AlgoTextarea>
        </AlgoBlock>
      </div>
    </div>
  </div>
</template>

<script>
import {EditorModes} from '@/scripts/EditorModes';
import AlgoTextarea from '../global/AlgoTextarea.vue';
import AlgoBlock from '../global/AlgoBlock.vue';
import AlgoButton from '../global/AlgoButton.vue';
import AlgoIcon from '../global/AlgoIcon.vue';

export default {
    props: ["testCases", "isRunning"],
    data() {
        return {
            EditorModes,
            textareas: [
                { title: "Wejście", fieldName: "input", isVisible: () => true },
                { title: "Wyjście", fieldName: "output", isVisible: () => this.$props.isRunning },
            ]
        };
    },
    methods: {
        inputHandler(newValue) {
            let testCases = this.$props.testCases;
            testCases.current().input = newValue;
            this.$emit("update:testCases", testCases);
        },

        changeSelectedTestCase(index, event) {
            if (event.target.localName === 'i') return;

            let testCases = this.$props.testCases;
            testCases.selectedId = index;
            testCases.current().selectedFrameId = 0;
            this.$emit("update:testCases", testCases);
            if (this.$props.isRunning) {
              this.emitter.emit("currentFrameChangedEvent", this.$props.testCases.currentFrame());
            }
            
        },

        addTestCase() {
            let testCases = this.$props.testCases;
            testCases.addTestCase();
            this.$emit("update:testCases", testCases);
        }, 

        deleteTestCase(index) {
            let testCases = this.$props.testCases;
            testCases.deleteTestCase(index);
            this.$emit("update:testCases", testCases);
        }
    },
    computed: {
        numberOfTestCases() {
            return this.$props.testCases.length();
        },
        isSelected() {
            return number => {
                return this.testCases.selectedId === number;
            };
        }
    },
    components: { AlgoTextarea, AlgoBlock, AlgoButton, AlgoIcon }
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
