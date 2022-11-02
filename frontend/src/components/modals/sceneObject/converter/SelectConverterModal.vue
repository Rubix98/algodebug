<template>
  <div class="dialog-content">
    <AlgoPickList :options="converters" @selectOptionEvent="selectConverter" />
  </div>
</template>

<script>
import AlgoPickList from '@/components/global/AlgoPickList.vue';

export default {
  components: {AlgoPickList},

  props: ['data', 'callback'],

  data() {
    return {
      title: 'Wybierz operator wyjścia',
      converters: [],
      buttons: [
        {class: 'ok', label: 'Utwórz nowy operator', action: () => {
          this.$root.pushDialog('AddNewConverterModal', this.$props.data, (newConverter) => {
            this.converters.push(newConverter);
          });
        }}
      ]
    }
  },

  created() {
    this.$root.sendRequest('BACKEND/converter/findAll', {}, 'get')
      .then((response) => {
        this.converters = response.data;
      });
  },

  mounted() {
    
  },

  methods: {
    selectConverter(selectedConverter) {
      this.$props.callback(selectedConverter);
      this.$root.popDialog();
    }
  },
}
</script>

<style scoped>
  .dialog-content {
    width: 60vw;
  }

</style>
