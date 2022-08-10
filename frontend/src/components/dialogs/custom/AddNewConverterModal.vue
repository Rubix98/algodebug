<template>
  <div class="dialog-content">
    <AlgoFieldRow label="Nazwa">
      <AlgoInput v-model:value="converter.title"/>
    </AlgoFieldRow>

    <AlgoFieldRow label="Rodzaj zmiennej">
      {{converter.type}}
    </AlgoFieldRow>

    <AlgoFieldRow label="Język programowania">
      {{converter.language}}
    </AlgoFieldRow>

    <AlgoFieldRow label="Kod">
      <AlgoTextarea v-model:value="converter.code"/>
    </AlgoFieldRow>
  </div>
</template>

<script>
import {ButtonsFactory} from '@/scripts/ButtonsFactory';
import AlgoFieldRow from '../../global/AlgoFieldRow.vue';
import AlgoInput from '../../global/AlgoInput.vue';
import AlgoTextarea from '../../global/AlgoTextarea.vue';

export default {
  components: {AlgoFieldRow, AlgoInput, AlgoTextarea },

  props: ['data', 'callback'],

  data() {
    return {
      title: 'Utwórz nowy operator wyjścia',
      buttons: [
        ButtonsFactory.buttonOK('Zapisz', async () => {
          let response = await this.$root.sendRequest('BACKEND/converter/save', this.converter);
          this.converter = response.data;
          this.$props.callback(this.converter);
          this.$root.popDialog();
        })
      ],
      converter: {
        title: '',
        type: '',
        language: '',
        code: ''
      }
    }
  },

  mounted() {
    this.converter.type = this.$props.data.type.key;
    this.converter.language = this.$props.data.language;
  },

  methods: {
  },
}
</script>

<style scoped>
  .dialog-content {
    width: 60vw;
  }

</style>
