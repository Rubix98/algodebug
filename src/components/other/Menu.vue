<template>
  <div class="menu">
    <div class="menu-content flex-row flex-horizontal-center">
      <i class="fa fa-save" @click="openDialog('saveProject')"></i>
      <i class="fa fa-search" @click="openDialog('saveProject')"></i>
    </div>
    <div class="menu-placeholder"></div>
    <SaveProject ref="saveProject"/>
  </div>
</template>

<script>
import SaveProject from '@/components/dialogs/SaveProject.vue'
export default {
  components: { SaveProject },
  data() {
    return {
    }
  },

  methods: {
    openDialog(dialog) {
      this.$refs[dialog].openDialog();
    }
  }
}
</script>

<style scoped>
  .menu-content {
    background-color: green;
    position: fixed;
    z-index: 1;
  }

  .menu-content, .menu-placeholder {
    width: 100%;
    height: inherit;
  }

  i {
    color: white;
    font-size: 25px;
    margin-left: 10px;
    cursor: pointer;
  }
</style>
