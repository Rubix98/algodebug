<template>
  <AlgoModal :title="modalTitle">
    <template #default>
      <AlgoFieldRow label="Rodzaj obiektu">
        <AlgoLink :value="typeLabel" @click="selectType()" />
      </AlgoFieldRow>

      <AlgoFieldRow label="Przypisana zmienna">
        <AlgoLink :value="variableName" @click="selectVariable()" />
      </AlgoFieldRow>

      <AlgoFieldRow label="Konwerter">
        <AlgoLink :value="converterTitle" label="Brak" @click="selectConverter()" />
      </AlgoFieldRow><br />

      <AlgoTable 
        v-if="model.type && !['variable', 'circle', 'shape', 'line'].includes(model.type.key)"
        :sceneObject="model"
        label="Właściwości"
        :headers="['Rodzaj', 'Przypisana zmienna', 'Konwerter', 'Kolor']"
        :emptyRow="{name: '', type: null, variable: null, converter: null}"
      ></AlgoTable>
    </template>

    <template #buttons>
      <AlgoButton @click="save()">Zapisz</AlgoButton>
    </template>
  </AlgoModal>
</template>

<script>
import AlgoLink from '@/components/global/AlgoLink.vue';
import AlgoButton from '@/components/global/AlgoButton.vue';
import AlgoFieldRow from '@/components/global/AlgoFieldRow.vue';
import AlgoTable from '@/components/global/AlgoTable.vue';
import AlgoModal from '@/components/global/AlgoModal.vue';
import { mapState } from 'vuex';
import {pushModal} from "jenesius-vue-modal";
import PickVariableModal from '@/components/modals/code/PickVariableModal.vue';
import SelectSceneObjectTypeModal from '@/components/modals/sceneObject/type/SelectSceneObjectTypeModal.vue';
import SelectConverterModal from '@/components/modals/sceneObject/converter/SelectConverterModal.vue';

export default {
  components: { AlgoLink, AlgoFieldRow, AlgoButton, AlgoTable, AlgoModal },
  props: ["sceneObject"],
  
  data() {
    return {
      model: {
        type: null,
        variable: null,
        converter: null,
        subobjects: []
      }
    };
  },

  mounted() {
    if (this.$props.sceneObject) {
      this.model = {...this.$props.sceneObject};
    }
  },

  methods: {
    save() {

    },

    selectType() {
      pushModal(SelectSceneObjectTypeModal, {
        callback: (selectedType) => {
          this.model.type = selectedType;
          this.model.converter = null;
          this.model.subobjects = [];
        }
      });
    },

    selectVariable() {
      pushModal(PickVariableModal, {
        callback: (selectedVariable) => {
          this.model.variable = selectedVariable;
        }
      });
    },

    selectConverter() {
      pushModal(SelectConverterModal, {
        callback: (selectedConverter) => {
          this.model.converter = selectedConverter;
        }
      })
    }
  },

  computed: {
    ...mapState(["project"]),

    modalTitle() {
      return this.$props.sceneObject ? "Konfiguruj obiekt" : "Dodaj nowy obiekt";
    },

    typeLabel() {
      return this.model.type ? this.model.type.label : null;
    },

    variableName() {
      return this.model.variable ? this.model.variable.name : null;
    },

    converterTitle() {
      return this.model.converter ? this.model.converter.title : null;
    }

  }
}
</script>

<style scoped>
  .dialog {
    width: 80vw;
  }

</style>