<template>
    <div class="menu-container">
        <div class="menu-content flex-vertical-space-between flex-horizontal-center">
            <img src="images/logo.png" @click="redirectToRoot()" />

            <!-- TODO: move this-->
            <div id="google-login-button"></div>
            <button id="logout-button" class="hidden" @click="logout">Wyloguj</button>

            <div class="buttons-container">
                <AlgoButton @click="openSaveProjectModal()"> <i class="fa fa-save"></i> Zapisz projekt </AlgoButton>

                <AlgoButton @click="openLoadProjectModal()"> <i class="fa fa-search"></i> Otwórz projekt </AlgoButton>
            </div>
        </div>

        <div class="menu-placeholder"></div>
    </div>
</template>

<script>
import AlgoButton from "@/components/global/AlgoButton.vue";
import LoadProjectModal from "@/components/modals/menu/LoadProjectModal.vue";
import SaveProjectModal from "@/components/modals/menu/SaveProjectModal.vue";
import { redirectTo } from "@/javascript/utils/other";
import { openModal } from "jenesius-vue-modal";
import { handleLogout } from "../../javascript/utils/loginUtils";

export default {
    components: { AlgoButton },

    methods: {
        redirectToRoot() {
            redirectTo(window.location.origin + window.location.pathname);
        },

        openLoadProjectModal() {
            openModal(LoadProjectModal);
        },

        openSaveProjectModal() {
            openModal(SaveProjectModal);
        },

        logout() {
            handleLogout();
        },
    },
};
</script>

<style scoped>
.menu-content {
    position: fixed;
    z-index: 9;
    background: linear-gradient(#427aa1, #05668d);
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
}

.menu-content,
.menu-placeholder {
    width: 100%;
    height: inherit;
}

.hidden {
    display: none;
}

img {
    height: inherit;
    width: auto;
    cursor: pointer;
    margin-left: 10px;
}

button {
    margin-right: 20px;
}
</style>
