<template>
  <div class="code-editor-line-numbers">
    <div class="line flex-row flex-vertical-space-between" 
      v-for="line in numberOfLines" :key="line" >
      
      <div class="flex-horizontal-center">
        <i class="fa fa-circle breakpoint" v-if="isBreakpointSet(line)" @click="this.$emit('breakPointClickEvent', line)"></i>
        <i class="fa fa-square-o" v-else-if="trackVariablesMode" @click="this.$emit('breakPointClickEvent', line)"></i>
      </div>
      <div class="line-index">{{line}}</div>
    </div>
  </div>
</template>

<script>

export default {
  props: ['code', 'breakpoints', 'trackVariablesMode'],

  data() {
    return {
    }
  },

  computed: {
    numberOfLines() {
      return this.$props.code.split("\n").length;
    },

    isBreakpointSet() {
      return line => {
        return this.$props.breakpoints.has(line);
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
