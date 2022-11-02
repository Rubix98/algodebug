<template>
  <div class="frame-number-panel-container" v-if="currentFrame">
    <!-- Cannot read properties of undefined reading id -->
    {{currentFrame.id+1}}/{{numberOfFrames}}
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters('project', ['currentFrame', 'numberOfFrames']),
  }
}
</script>

<style scoped>
  .frame-number-panel-container {
    font-size: 30px;
    padding-right: 5px;
  }
</style>
