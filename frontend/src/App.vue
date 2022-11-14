<template>
  <div class="app-container">
    <Menu />

    <div class="content-container">
      <MainPage />
    </div>

    <Modal/>
  </div>
</template>

<script>
import Menu from '@/components/other/Menu.vue';
import MainPage from '@/components/mainPage/MainPage.vue';
import {container} from "jenesius-vue-modal";
import axios from 'axios';

export default {
  // ERROR: Name "Menu" is reserved in HTML
  // eslint-disable-next-line
  components: {Menu, MainPage, Modal: container},

  methods: {
    sendRequest(url, data = {}, method = 'post') {
      if (window.location.origin.includes("localhost")) {
        url = url.replace("BACKEND", "http://localhost:8080")
      } else {
        //url = url.replace("BACKEND", "https://algodebug.herokuapp.com")
      }

      if (method === 'get') {
        return axios.get(url, data);
      }
      return axios.post(url, data);
    },

    redirectTo(url) {
      window.location.href = url;
    }
  }
}
</script>

<style>
  .app-container {
    width: 100vw;
    height: 100vh;
  }

  .menu-container {
    height: 50px;
  }

  .content-container {
    width: 100%;
    height: calc(100% - 50px);
  }

  .modal-container {
    z-index: 10;
    background-color: rgba(0, 0, 0, 0.5);
  }

  /* Global */

  body {
    font-family: 'Tahoma', sans-serif;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

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
</style>
