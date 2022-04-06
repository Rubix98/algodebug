<template>
  <div class="menu">
    <div class="menu-content flex-row flex-horizontal-center">
      <i class="fa fa-save" @click="openDialog('saveProjectDialog')"></i>
      <i class="fa fa-search" @click="openDialog('loadProjectsDialog')"></i>
    </div>
    <div class="menu-placeholder"></div>
    
  </div>
</template>

<script>

export default {
  data() {
    return {
    }
  },

  methods: {
    openDialog(dialog) {
      this.$root.openDialog(dialog);
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
