<template>
  <div class="code-editor-line-numbers">
    <div v-for="(line, index) in numberOfCodeLines" :key="index" class="line flex-row flex-vertical-space-between">
      <div class="flex-horizontal-center">
        <i :class="bindIconClass(index)" 
          @click="addOrDeleteBreakpoint(index)">
        </i>
      </div>
      <div class="line-index">{{line}}</div>
    </div>
    <br/>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: ['code', 'breakpoints', 'editable'],

  methods: {
    addOrDeleteBreakpoint(lineIndex) {
      if (this.$props.editable) {
        console.log(this.project.breakpoints)
        this.project.breakpoints.addOrDelete({id: lineIndex});
      }
    }
  },

  computed: {
    ...mapState(['project']),
    
    isBreakpointSet() {
      return lineIndex => {
        return this.$store.state.project.breakpoints ? this.$store.state.project.breakpoints.has(lineIndex) : false;
      }
    },

    bindIconClass() {
      return lineIndex => {
        if (this.isBreakpointSet(lineIndex)) {
          return 'fa fa-circle breakpoint';
        } else if (this.$props.editable) {
          return 'fa-regular fa-square';
        }
      }
    },

    numberOfCodeLines() {
      return this.$props.code.split("\n").length;
    }
  }
}
</script>

<style scoped>
  .code-editor-line-numbers {
    overflow: hidden;
    height: 100%;
  }
 
  .line {
    padding: 0 5px;
  }

  .line i {
    cursor: pointer;
  }

  .breakpoint {
    color: red;
  }
</style>
