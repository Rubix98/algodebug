<template>
  <div class="dialog-content">

    <AlgoFieldRow label="Rodzaj obiektu">
      <AlgoLink :value="typeLabel" @click="selectType()" />
    </AlgoFieldRow>

    <AlgoFieldRow label="Przypisana zmienna">
      <AlgoLink :value="variableName" @click="selectVariable()" />
    </AlgoFieldRow>

    <AlgoFieldRow label="Operator wyjścia" v-if="sceneObject.type">
      <AlgoLink :value="converterTitle" label="Brak" @click="selectConverter()" />
    </AlgoFieldRow><br />

    <AlgoTable 
      v-if="sceneObject.type && sceneObject.type.key !== 'variable'"
      v-model:value="sceneObject.subobjects"
      :type="sceneObject.type"
      label="Obiekty wewnętrzne"
      :headers="['Rodzaj', 'Przypisana zmienna', 'Operator wyjścia', 'Kolor']"
      :emptyRow="{name: '', type: null, variable: null, converter: null}"
      :codeData="data"
    >
        
    </AlgoTable>

    {{sceneObject}}
  </div>
</template>

<script>
import {ButtonsFactory} from '@/scripts/ButtonsFactory';
import AlgoLink from '../../global/AlgoLink.vue';
import AlgoFieldRow from '../../global/AlgoFieldRow.vue';
import AlgoTable from '../../global/AlgoTable.vue';

export default {
  props: ["data"],
  components: { AlgoLink, AlgoFieldRow, AlgoTable },
  data() {
    return {
      title: this.$props.data.sceneObject ? "Konfiguruj obiekt" : "Dodaj nowy obiekt",
      buttons: [
        ButtonsFactory.buttonOK("Zapisz", () => {
          this.emitter.emit('saveSceneObjectEvent', this.sceneObject);
          this.$root.popDialog();
        })
      ],
      sceneObject: {
        type: null,
        variable: null,
        converter: null,
        subobjects: []
      }
      
    };
  },
  mounted() {
    console.log(this.$props.data);
    if (this.$props.data.sceneObject) {
      this.sceneObject = this.$props.data.sceneObject;
    }
    
  },

  methods: {
    selectType() {
      this.$root.pushDialog("SelectSceneObjectTypeModal", {}, (selectedType) => {
        this.sceneObject.type = selectedType;
        this.sceneObject.converter = null;
        this.sceneObject.subobjects = [];
      });
    },

    selectVariable() {
      this.$root.pushDialog("PickVariableModal", this.$props.data, (selectedVariable) => {
        this.sceneObject.variable = selectedVariable;
      });
    },

    selectConverter() {
      this.$root.pushDialog("SelectConverterModal", {...this.$props.data, type: this.type}, (selectedConverter) => {
        this.sceneObject.converter = selectedConverter;
      });
    }
  },

  computed: {
    typeLabel() {
      return this.sceneObject.type ? this.sceneObject.type.label : null;
    },

    variableName() {
      return this.sceneObject.variable ? this.sceneObject.variable.name : null;
    },

    converterTitle() {
      return this.sceneObject.converter ? this.sceneObject.converter.title : null;
    }
  }
}
</script>

<style scoped>
  .dialog-content {
    width: 60vw;
  }

</style>
