<template>
  <AlgoModal title="Wybierz konwerter">
    <template #default>
      <AlgoPickList :options="converters" @selectOptionEvent="handleSelectOption" />
    </template>

    <template #buttons>
      <AlgoButton @click="createConverter()">Utwórz nowy kowerter</AlgoButton>
    </template>
  </AlgoModal>
</template>

<script>
import AlgoPickList from '@/components/global/AlgoPickList.vue';
import AlgoButton from '@/components/global/AlgoButton.vue';
import AlgoModal from '@/components/global/AlgoModal.vue';
import { popModal, pushModal } from 'jenesius-vue-modal';
import CreateConverterModal from '@/components/modals/sceneObject/converter/CreateConverterModal.vue';

export default {
  components: { AlgoPickList, AlgoButton, AlgoModal },

  props: ['callback'],

  data() {
    return {
      converters: []
    }
  },

  created() {
    this.$root.sendRequest('BACKEND/converter/findAll')
      .then((response) => {
        this.converters = response.data;
      });
  },

  methods: {
    handleSelectOption(selectedConverter) {
      this.$props.callback(selectedConverter);
      popModal();
    },

    createConverter() {
      pushModal(CreateConverterModal, {
        callback: (newConverter) => {
          this.converters.push(newConverter);
          this.handleSelectOption(newConverter);
        }
      });
    }
  },
}
</script>

<style scoped>
  .dialog {
    width: 80vw;
  }

</style>
