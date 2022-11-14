<template>
  <div class="code-editor-header flex-horizontal-center"> 
      <i class="fa fa-play" title="Uruchom program" v-show="!project.isRunning" @click="runProgram()" />
      <i class="fa fa-stop" title="Zatrzymaj program" v-show="project.isRunning" @click="stopProgram()" />
      <i class="fa fa-eye" title="Pokaż program debugujący" @click="showExtendedCode()" />

      <select :value="language" :disabled="project.isRunning">
        <option v-for="language in languages" :key="language.key" 
          :value="language.key" 
          :disabled="language.disabled">
            {{language.label}}
        </option>
      </select>
      
  </div>
</template>

<script>
import { openModal } from "jenesius-vue-modal";
import { mapState, mapActions, mapGetters } from "vuex";
import ShowDebugCodeModal from "@/components/modals/code/ShowDebugCodeModal.vue";

// CORS Error: No 'Access-Control-Allow-Origin' header on response
const COMPILER_API_URL = 'https://codex-api.herokuapp.com/';

export default {
  props: [],

  data() {
    return {
      languages:  [
        {key: "cpp", label: "C++"},
        {key: "c", label: "C", disabled: true},
        {key: "java", label: "Java", disabled: true},
        {key: "csharp", label: "C#", disabled: true},
        {key: "python", label: "Python", disabled: true},
      ]
    }
  },

  methods: {
    ...mapActions('project', ['setLanguage', 'setIsRunning', 'changeCurrentFrame']),

    showExtendedCode() {
      openModal(ShowDebugCodeModal)
    },

    async runProgram() {
      console.log("compiling")
      for (let testCase of this.project.testData) {
        let response = await this.$root.sendRequest(COMPILER_API_URL, {
          code:     this.debugCode,
          language: "cpp",
          input:    testCase.input
        });
        console.log(response.data)
        
        if (response.data.success) {
          let output = response.data.output;
          testCase.output = output;

          const parser = new DOMParser();
          const parsedOutput = parser.parseFromString(output, "text/html");

          testCase.frames = [];
          for (let breakpoint of parsedOutput.getElementsByTagName("algodebug-breakpoint")) {
            testCase.frames.push({
              id: testCase.frames.length,
              output: breakpoint.outerHTML,
              line: Number(breakpoint.getAttribute("line")),
              variables: breakpoint.getElementsByTagName("algodebug-variable")
            });
          }

        } else {
          testCase.output = response.data.error;
        }
      }
      this.setIsRunning(true);
      this.emitter.emit("startDebuggingEvent");
    },

    stopProgram() {
      this.setIsRunning(false);
      this.changeCurrentFrame(0);
      this.emitter.emit('stopDebuggingEvent');
    },
  },

  computed: {
    ...mapState(['project']),
    ...mapGetters('project', ['debugCode']),

    language: {
      get() {return this.project.language},
      set(newValue) {this.setLanguage(newValue)}
    }
  }
}
</script>

<style scoped>
  .code-editor-header {
    position: absolute;
    justify-content:flex-end;
    z-index: 1;
    padding: 5px 15px;
    font: initial;
    color: white;
    right: 0;
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
    color: #ccc;
  }

  i:hover {
    color: white;
  }

  select {
    cursor: pointer;
  }

</style>
