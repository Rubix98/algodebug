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
export default {
  props: ['breakpoints', 'numberOfCodeLines', 'editable'],

  data() {
    return {
    }
  },

  mounted() {
  },

  methods: {
    addOrDeleteBreakpoint(lineIndex) {
      if (this.$props.editable) {
        let breakpoints = this.$props.breakpoints;
        breakpoints.addOrDelete({id: lineIndex});
        this.$emit("update:breakpoints", breakpoints);
      }
    }
  },

  computed: {
    isBreakpointSet() {
      return lineIndex => {
        return this.$props.breakpoints ? this.$props.breakpoints.has(lineIndex) : false;
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
