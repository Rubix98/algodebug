<template>
  <div class="dialog-content">
    <AlgoPickList :options="converters" @selectOptionEvent="selectConverter" />
  </div>
</template>

<script>
import AlgoPickList from '@/components/global/AlgoPickList.vue';
import {ButtonsFactory} from '@/scripts/ButtonsFactory';

export default {
  components: {AlgoPickList},

  props: ['data', 'callback'],

  data() {
    return {
      title: 'Wybierz operator wyjścia',
      converters: [],
      buttons: [
        ButtonsFactory.buttonOK('Utwórz nowy operator', () => {
          this.$root.pushDialog('AddNewConverterModal', this.$props.data, (newConverter) => {
            this.converters.push(newConverter);
          });
        })
      ]
    }
  },

  created() {
    this.$root.sendRequest('BACKEND/converter/findAll')
      .then((response) => {
        console.log(response);
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
