<template>
  <div class="main-container">
    <Menu />

    <div class="tab-container">
      <MainPage />
    </div>

    <Modal/>
  </div>
</template>

<script>
import Menu from '@/components/other/Menu.vue';
import MainPage from '@/components/mainPage/MainPage.vue';
import AlgoModal from '@/components/global/AlgoModal.vue'
import {container} from "jenesius-vue-modal";
import {openModal, pushModal, closeModal, popModal} from "jenesius-vue-modal";
import axios from 'axios';

export default {
  components: {Modal: container, Menu, MainPage},

  methods: {
    sendRequest(url, data={}) {
      if (window.location.origin.includes("localhost")) {
        url = url.replace("BACKEND", "http://localhost:8080")
      } else {
        url = url.replace("BACKEND", "https://algodebug.herokuapp.com")
      }
      return axios.post(url, data);
    },

    openDialog(modalComponentName, data, callback) {
      openModal(AlgoModal, {modalComponentName, data, callback})
    },

    pushDialog(modalComponentName, data, callback) {
      pushModal(AlgoModal, {modalComponentName, data, callback})
    },

    closeDialog() {
      closeModal()
    },

    popDialog() {
      popModal()
    },

    redirectTo(url) {
      window.location.href = url;
    }
  }
}
</script>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .main-container {
    width: 100vw;
    height: 100vh;
  }

  .menu {
    height: 50px;
  }

  .tab-container {
    width: 100%;
    height: calc(100% - 50px);
  }

  /* Global */

  .full-size {
    width: 100%;
    height: 100%;
  }

  .flex {
    display: flex;
  }

  .flex-wrap {
    display: flex;
    flex-wrap: wrap;
    align-content: space-between;
  }

  .flex-row {
    display: flex;
    flex-direction: row;
  }

  .flex-column {
    display: flex;
    flex-direction: column;
  }

  .flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .flex-vertical-left {
    display: flex;
    justify-content: flex-start;
  }

  .flex-vertical-center {
    display: flex;
    justify-content: center;
  }

  .flex-vertical-right {
    display: flex;
    justify-content: flex-end;
  }

  .flex-vertical-space-between {
    display: flex;
    justify-content: space-between;
  }

  .flex-horizontal-center {
    display: flex;

    align-items: center;
  }

  .width-1-of-2 {
    width: 50%;
  }

  .modal-container{
    background-color: rgba(0, 0, 0, 0.5);
}

</style>
