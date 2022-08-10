<template>
  <div class="dialog-content">
    <AlgoPickList :options="options" @selectOptionEvent="selectOption" />
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
      title: 'Zarządzaj obiektami na scenie',
      buttons: [
        ButtonsFactory.buttonOK('Dodaj nowy obiekt', () => {
          this.$root.pushDialog('AddNewSceneObjectModal', this.$props.data);
        })
      ],
      options: []
    }
  },

  mounted() {
    this.options = this.$props.data.sceneObjects.map(object => {
      return {
        ...object,
        dialogData: {
          properties: [
            {label: "Typ", value: object.type.label},
            {label: "Przypisana zmienna", value: object.variable.name},
          ]
        }
      }
    })
  },

  methods: {
    selectOption(selectedOption) {
      this.$root.openDialog('ConfigureSceneObjectModal', {...this.$props.data, sceneObject: selectedOption})
    }
  },
}
</script>

<style scoped>
  .dialog-content {
    width: 60vw;
  }

</style>
