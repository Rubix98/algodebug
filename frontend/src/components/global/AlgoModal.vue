<template>
  <div class="dialog">
    <div class="dialog-header flex-vertical-space-between">
        <h1>{{title}}</h1>
        <i class="fa fa-close" title="Zamknij okno" @click="popModal()"></i> 
    </div>

    <div class="dialog-content">
      <slot></slot>
    </div>
    
    <div class="buttons flex-vertical-right">
      <AlgoButton @click="popModal()">Anuluj</AlgoButton>
      <slot name="buttons"></slot>
    </div>
  </div>
</template>

<script>
import AlgoButton from '@/components/global/AlgoButton.vue';
import { popModal } from 'jenesius-vue-modal';


export default {
  components: { AlgoButton },

  props: ["title"],

  methods: {
    popModal() {
      popModal()
    },
  }
}
</script>

<style>
  .dialog {
    width: 60vw;
    padding: 30px 50px;
    background-color: #fff;
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.5);
    z-index: 100;
    border-radius: 20px;
    font-size: 20px;
  }

  .dialog-header {
    font-size: 20px;
  }

  .dialog-content {
    max-height: 70vh;
    margin: 15px 0;
    overflow: auto;
  }

  .buttons {
    gap: 20px;
  }

  i {
    cursor: pointer;
  }
</style>
