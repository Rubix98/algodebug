<template>
  <div class="main-panel-container flex-center">
    <AlgoButton @click="addNewSceneObject()"><i class="fa-solid fa-square-plus"></i> Dodaj nowy obiekt</AlgoButton>
  </div>
</template>

<script>
import AlgoButton from '@/components/global/AlgoButton';

export default {
  components: {AlgoButton},

  methods: {
    addNewSceneObject() {
      this.$root.openDialog("ConfigureSceneObjectModal");
    },
  },
}
</script>

<style scoped>
  button {
    font-size: 30px;
  }
</style>
