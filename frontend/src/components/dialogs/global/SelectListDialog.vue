<template>
  <div class="dialog-content">
    <div v-for="option in options" :key="option.key" 
      class="option"
      @click="selectOption(option)">
      {{option.label}}
      <div v-for="(property, index) in option.dialogData.properties" :key="index"
         v-show="property.value != null">
          <b>{{property.label}}</b>: {{property.value}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['options'],

  data() {
    return {
      selectedOption: ''
    }
  },

  mounted() {
  },

  methods: {
    selectOption(option) {
      this.selectedOption = option;
      this.$emit('selectOptionEvent');
    },

    getOutput() {
      return this.selectedOption;
    }
  }
}
</script>

<style scoped>
  .dialog-content {
    width: 80vw;
  }

  .option {
    width: 100%;
    border: 1px solid black;
    border-radius: 5px;
    margin: 5px 0;
    padding: 5px 10px;
    cursor: pointer;
  }

  .option:hover {
    background-color: #eee;
  }
</style>
