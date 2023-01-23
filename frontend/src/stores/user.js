import { sendRequest } from "@/javascript/utils/axiosUtils.js";
import { defineStore } from "pinia";

export const useUserStore =  defineStore("user",{
    state: () => ({
        user: null
    }),

    getters: {
        loggedIn() {
            return !!this.user;
        },

        username() {
            if (!this.loggedIn) return null;
            return this.user.username;
        },

        userId() {
            if (!this.loggedIn) return null;
            return this.user._id;
        },

        userAuthProvider() {
            if (!this.loggedIn) return null;
            return this.user.provider;
        }
    },

    actions: {
        login() {
            window.open("http://localhost:8080/auth/google", "_blank", "height=570,width=520");

            window.addEventListener(
                "message",
                (event) => {
                    if (event.origin !== "http://localhost:8080" || !event.data) return;
                    this.user= event.data;
                },
                false
            );
        },

        verify() {
            sendRequest("/auth/verify", {}, "GET").then((responseData) => {
                this.user =  responseData.loggedIn ? responseData.user : null;
            });
        },

        logout() {
            sendRequest("/logout", {}, "GET").then(() => {
                this.user = null;
            });
        },
    },
});
