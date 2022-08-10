<template>
  <div>
    <div v-for="(option, index) in options" :key="index" 
      class="option"
      @click="selectOption(option)">
      {{option.label}}
      <div v-if="option.dialogData">
        <div  v-for="(property, index) in option.dialogData.properties" :key="index"
          v-show="property.value != null">
            <b>{{property.label}}</b>:
            
            <span v-if="property.fieldType === 'textarea'">
              <AlgoTextarea :value="property.value" size="small" />
            </span>
            <span v-else>
              {{property.value}}
            </span>
        </div>
      </div>
    </div>
  </div>

  <div v-if="options == null || options.length === 0">
    Brak danych
  </div>
</template>

<script>
import AlgoTextarea from './AlgoTextarea.vue';
export default {
    props: ["options"],
    components: { AlgoTextarea },

    methods: {
      selectOption(selectedOption) {
        this.$emit('selectOptionEvent', selectedOption);
      }
    }
}
</script>

<style scoped>
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
