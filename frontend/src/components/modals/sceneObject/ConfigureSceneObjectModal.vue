<template>
  <div class="dialog-content">

    <AlgoFieldRow label="Rodzaj obiektu">
      <AlgoLink :value="typeLabel" @click="selectType()" />
    </AlgoFieldRow>

    <AlgoFieldRow label="Przypisana zmienna">
      <AlgoLink :value="variableName" @click="selectVariable()" />
    </AlgoFieldRow>

    <AlgoFieldRow label="Konwerter" v-if="sceneObject.type">
      <AlgoLink :value="converterTitle" label="Brak" @click="selectConverter()" />
    </AlgoFieldRow><br />

    <AlgoTable 
      v-if="sceneObject.type && sceneObject.type.key !== 'variable' && sceneObject.type.key !== 'circle' && sceneObject.type.key !== 'shape' && sceneObject.type.key !== 'line'"
      v-model:value="sceneObject.subobjects"
      :type="sceneObject.type"
      label="Właściwości"
      :headers="['Rodzaj', 'Przypisana zmienna', 'Konwerter', 'Kolor']"
      :emptyRow="{name: '', type: null, variable: null, converter: null}"
      :codeData="data"
    >
        
    </AlgoTable>
  </div>
</template>

<script>
import AlgoLink from '@/components/global/AlgoLink.vue';
import AlgoFieldRow from '@/components/global/AlgoFieldRow.vue';
import AlgoTable from '@/components/global/AlgoTable.vue';

export default {
  props: ["data"],
  components: {AlgoLink, AlgoFieldRow, AlgoTable },
  data() {
    return {
      title: this.$props.data.sceneObject ? "Konfiguruj obiekt" : "Dodaj nowy obiekt",
      buttons: [
        {class: 'ok', label: "Zapisz", action: () => {
          this.emitter.emit('saveSceneObjectEvent', this.sceneObject);
          this.$root.popDialog();
        }}
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
      this.$root.pushDialog("SelectConverterModal", {...this.$props.data, type: this.sceneObject.type}, (selectedConverter) => {
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
