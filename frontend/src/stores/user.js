import { sendRequest } from "@/javascript/utils/axiosUtils.js";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
    state: () => ({
        user: null,
    }),

    getters: {
        loggedIn() {
            return !!this.user;
        },

        userName() {
            if (!this.loggedIn) return null;
            return this.user.username;
        },

        userId() {
            if (!this.loggedIn) return null;
            return this.user._id;
        },

        userPicture() {
            if (!this.loggedIn) return null;
            return this.user.picture;
        },

        userAuthProvider() {
            if (!this.loggedIn) return null;
            return this.user.provider;
        },
    },

    actions: {
        login() {
            window.open(process.env.VUE_APP_BACKEND_URL + "/auth/google", "_blank", "height=570,width=520");

            window.addEventListener(
                "message",
                (event) => {
                    if (event.origin !== process.env.VUE_APP_BACKEND_URL || !event.data) return;
                    this.user = event.data;
                },
                false
            );
        },

        verify() {
            sendRequest("/auth/verify", {}, "GET").then((responseData) => {
                this.user = responseData.loggedIn ? responseData.user : null;
            });
        },

        logout() {
            sendRequest("/logout", {}, "GET").then(() => {
                this.user = null;
            });
        },
    },
});
