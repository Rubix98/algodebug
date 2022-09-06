<template>
  <div class="menu">
    <div class="menu-content flex-row flex-horizontal-center">
      <img src="images/logo.png" />
      <i class="fa fa-save" @click="openSaveProjectDialog()"></i>
      <i class="fa fa-search" @click="openLoadProjectDialog()"></i>
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
    openLoadProjectDialog() {
      this.$root.openDialog('LoadProjectModal', {}, selectedOption => {
        this.$root.redirectTo(selectedOption.id);
      });
    },

    openSaveProjectDialog() {
      this.$root.openDialog('SaveProjectDialog', {}, title => {
        this.emitter.emit('saveProjectEvent', title);
        this.$root.closeDialog();
      });
    }
  }
}
</script>

<style scoped>
  .menu-content {
    background-color: green;
    position: fixed;
    z-index: 9;
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

  img {
    width: 150px;
    height: auto;
  }
</style>
