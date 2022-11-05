<template>
  <div :id="id" class="code-editor-container full-size" >
    <slot></slot>
    <div class="flex-row full-size" >
      <CodeLineNumbers
        :code="code"
        :editable="editable"
      />

      <Codearea :id="id" :code="code" :editable="editable" :clickable="clickable" @scrollEvent="handleScroll" @pickVariableEvent="handlePickVariable"/>
    </div>
    
  </div>
</template>

<script>
import CodeLineNumbers from './subcomponents/CodeLineNumbers.vue';
import Codearea from './subcomponents/Codearea.vue';
import { mapState, mapActions, mapGetters } from "vuex";

export default {
    components: { CodeLineNumbers, Codearea },
    props: ["id", "code", "editable", "clickable"],

    mounted() {
      this.codeareaDOM = document.getElementById(this.id).getElementsByClassName('codearea')[0];
      this.highlightsDOM = document.getElementById(this.id).getElementsByClassName('highlights')[0];
      this.linesDOM = document.getElementById(this.id).getElementsByClassName('code-editor-line-numbers')[0];
    },

    methods: {
      ...mapActions('project', ['setCode']),

      handleScroll() {
        const target = this.codeareaDOM ?? this.highlightsDOM;
        this.linesDOM.scrollTop = this.highlightsDOM.scrollTop = target.scrollTop;
        this.highlightsDOM.scrollLeft = target.scrollLeft;
      },

      handlePickVariable(variable) {
        this.$emit('pickVariableEvent', variable)
      }
    },

    computed: {
      ...mapState(['project']),
      ...mapGetters('project', ['variables', 'currentFrame']),
    },
    
}
</script>

<style scoped>
  .code-editor-container {
    display: block;
    transform: translateZ(0);
    height: 100%;
    font-size: 16px;
  }

  .codearea-container {
    width: calc(100% - 60px);
    height: 100%;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
    border-radius: 0 10px 10px 0;
  }
</style>
