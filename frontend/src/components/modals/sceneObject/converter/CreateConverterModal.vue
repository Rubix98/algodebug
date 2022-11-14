<template>
  <AlgoModal title="Utwórz nowy konwerter">
    <template #default>
      <AlgoFieldRow label="Nazwa">
        <AlgoInput 
          v-model:value="converter.title"
          placeholder="Nazwa"/>
      </AlgoFieldRow>

      <AlgoFieldRow label="Kod">
        <AlgoTextarea 
          v-model:value="converter.code"
          placeholder="Kod"/>
      </AlgoFieldRow>
    </template>

    <template #buttons>
      <AlgoButton @click="addConverter()">Ustaw</AlgoButton>
      <AlgoButton @click="saveConverter()">Zapisz i ustaw</AlgoButton>
    </template>
  </AlgoModal>
</template>

<script>
import AlgoFieldRow from '@/components/global/AlgoFieldRow.vue';
import AlgoInput from '@/components/global/AlgoInput.vue';
import AlgoTextarea from '@/components/global/AlgoTextarea.vue';
import AlgoButton from '@/components/global/AlgoButton.vue';
import AlgoModal from '@/components/global/AlgoModal.vue';
import { popModal } from 'jenesius-vue-modal';

export default {
  components: {AlgoModal, AlgoFieldRow, AlgoInput, AlgoButton, AlgoTextarea},

  props: ['callback'],

  data() {
    return {
      converter: {
        title: '',
        code: 'ostream& operator <<(ostream& os, const <typ> <nazwa>) {\n\t// Konwersja obiektu na string \n\treturn os;\n}'
      }
    }
  },

  methods: {
    addConverter() {
      popModal()
        .then(() => {
          this.$props.callback(this.converter);
        });
    },

    saveConverter() {
      this.$root.sendRequest('BACKEND/converter/save', this.converter)
        .then(() => {
          this.addConverter()
        });
    }
  },
}
</script>

<style scoped>
  .dialog {
    width: 60vw;
  }

</style>
