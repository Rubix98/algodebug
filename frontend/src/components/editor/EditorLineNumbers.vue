<template>
  <div class="code-editor-line-numbers">
    <div class="line flex-row flex-vertical-space-between" 
      v-for="(line, index) in numberOfCodeLines" :key="index" >
      
      <div class="flex-horizontal-center">
        <i :class="{'fa fa-circle breakpoint': isBreakpointSet(index), 'fa-regular fa-square': !isBreakpointSet(index)}" 
          v-if="isBreakpointIconVisible(index)"
          @click="addOrDeleteBreakpoint(index)">
        </i>
      </div>
      <div class="line-index">{{line}}</div>
    </div>
  </div>
</template>

<script>
import {EditorModes} from '@/scripts/EditorModes';

export default {
  props: ['breakpoints', 'numberOfCodeLines', 'isMode'],

  data() {
    return {
      EditorModes
    }
  },

  methods: {
    addOrDeleteBreakpoint(lineNumber) {
      if (this.$props.isMode(EditorModes.MODE_SETTINGS)) {
        let breakpoints = this.$props.breakpoints;
        breakpoints.addOrDelete({id: lineNumber});
        this.$emit("update:breakpoints", breakpoints);
      }
    }
  },

  computed: {
    isBreakpointSet() {
      return line => {
        return this.$props.breakpoints.has(line);
      }
    },

    isBreakpointIconVisible() {
      return line => {
        return !this.$props.isMode(EditorModes.MODE_INSPECTING) && 
                (this.$props.isMode(EditorModes.MODE_SETTINGS) || this.isBreakpointSet(line));
      }
    }
  }
}
</script>

<style scoped>
  .code-editor-line-numbers {
    overflow: hidden;
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
