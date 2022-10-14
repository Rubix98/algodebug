<template>
  <div class="menu">
    <div class="menu-content flex-row flex-horizontal-center flex-vertical-space-between">
      <img src="images/logo.png" @click="redirectToRoot()" />
      <div class="buttons-container">
        <AlgoButton @click="openSaveProjectModal()">
          <i class="fa fa-save"></i> Zapisz projekt
        </AlgoButton>

        <AlgoButton @click="openLoadProjectModal()">
          <i class="fa fa-search" ></i> Otwórz projekt
        </AlgoButton>
      </div>
      
    </div>
    <div class="menu-placeholder"></div>
    
  </div>
</template>

<script>
import AlgoButton from '../global/AlgoButton.vue';

export default {
  components: { AlgoButton },

  methods: {
    openLoadProjectModal() {
      this.$root.openDialog("LoadProjectModal");
    },
    openSaveProjectModal() {
      this.$root.openDialog("SaveProjectModal");
    },
    redirectToRoot() {
      this.$root.redirectTo(window.location.origin + window.location.pathname);
    }
  },
  
}
</script>

<style scoped>
  .menu-content {
    background: linear-gradient(#427AA1, #05668D);
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
    position: fixed;
    z-index: 9;
  }

  .menu-content, .menu-placeholder {
    width: 100%;
    height: inherit;
  }

  img {
    height: 50px;
    width: auto;
    cursor: pointer;
    margin-left: 10px;
  }

  button {
    margin-right:20px;
  }
</style>
