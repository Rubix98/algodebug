<template>
  <AlgoModal title="Dodaj nowy obiekt">
    <template #default>
      <AlgoPickList :options="types" @selectOptionEvent="handleSelectOption" />
    </template>
  </AlgoModal>
</template>

<script>
import AlgoPickList from '@/components/global/AlgoPickList.vue';
import AlgoModal from '@/components/global/AlgoModal.vue';

export default {
  components: {AlgoPickList, AlgoModal},

  props: ['callback'],

  data() {
    return {
      types: [
        {key: 'variable', label: 'Zmienna'},
        {key: 'graph', label: 'Graf'},
        {key: 'array', label: 'Tablica'},
        {key: 'points', label: 'Zbiór punktów'},
        {key: 'circle', label: 'Okrąg'},
        {key: 'shape', label: 'Wielokąt'},
      ]
    }
  },

  methods: {
    handleSelectOption(selectedType) {
      this.$props.callback(selectedType);
      this.$root.popDialog();
    }
  },
}
</script>

<style scoped>
  .dialog {
    width: 40vw;
  }
</style>
