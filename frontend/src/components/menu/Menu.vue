<template>
    <div class="menu-container">
        <div class="menu-content flex-vertical-space-between flex-horizontal-center">
            <img src="images/logo.png" @click="redirectToRoot()" />

            <button @click="login" v-if="!loggedIn">Login with Google</button>
            <button @click="logout" v-if="loggedIn">Logout</button>

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
import { sendRequest } from "@/javascript/utils/axiosUtils";

export default {
    components: { AlgoButton },

    data() {
        return {
            loggedIn: false
        }
    },

    mounted() {
        this.verify();
    },

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

        login() {
            window.open("http://localhost:8080/auth/google", '_blank', 'height=570,width=520');
            
            window.addEventListener("message", (event) => {
                if (event.origin !== 'http://localhost:8080' || event.data !== "auth success") return;
                this.loggedIn = true;
            }, false);
        },

        verify() {
            sendRequest("/auth/verify", {}, "GET")
            .then((responseData) => {
                this.loggedIn = responseData.loggedIn;
            });
        },

        logout() {
            sendRequest("/logout", {}, "GET")
            .then((responseData) => {
                this.loggedIn = responseData.loggedIn;
            });
        }
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
