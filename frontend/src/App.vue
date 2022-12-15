<template>
    <div class="app-container">
        <Menu />

        <div class="content-container">
            <MainPage />
        </div>

        <Modal />
    </div>
</template>

<script>
import Menu from "@/components/menu/Menu.vue";
import MainPage from "@/components/mainPage/MainPage.vue";
import { container } from "jenesius-vue-modal";

import { handleGoogleLogin, handleGoogleLogout, checkGoogleLogin } from "@/javascript/utils/googleLoginUtils";

// temporary config file
import config from "../config.json";

export default {
    // ERROR: Name "Menu" is reserved in HTML
    // eslint-disable-next-line
    components: { Menu, MainPage, Modal: container },

    mounted() {
        /* global google */
        google.accounts.id.initialize({
            client_id: config.google_client_id,
            callback: handleGoogleLogin,
        });

        google.accounts.id.renderButton(document.getElementById("google-login-button"), {
            theme: "outline",
            size: "large",
        });

        checkGoogleLogin();
        this.emitter.on("GoogleLogout", handleGoogleLogout);
    },
};
</script>

<style scoped>
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
</style>

<style>
/* Global */

@font-face {
    font-family: "SourceCodePro";
    font-weight: 400;
    font-style: normal;
    font-display: auto;
    src: local("SourceCodePro"), url("/public/fonts/SourceCodePro-Regular.ttf");
}

body {
    font-family: "Tahoma", sans-serif;
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

.Vue-Toastification__container {
    margin-top: 55px;
}
</style>
