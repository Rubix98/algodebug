<template>
  <div class="download-panel-container">
    <i class="fa-solid fa-download" @click="download"></i>
  </div>
</template>

<script>

export default {
  methods: {
    download() {
      this.emitter.emit('downloadStageEvent');
    }
  },
}
</script>

<style scoped>
  i {
    color: black;
    font-size: 40px;
    user-select:none;
    padding-right: 10px;
    padding-top: 5px;
  }
</style>
