import { sendRequest } from "@/javascript/utils/axiosUtils.js";

export default {
    namespaced: true,
    state: {
        user: null,
    },

    getters: {
        loggedIn(state) {
            return state.user ? true : false;
        },

        user(state) {
            return state.user ? state.user : null;
        },
    },

    mutations: {
        setUser(state, user) {
            state.user = user;
        },
    },

    actions: {
        login({ commit }) {
            window.open("http://localhost:8080/auth/google", "_blank", "height=570,width=520");

            window.addEventListener(
                "message",
                (event) => {
                    if (event.origin !== "http://localhost:8080" || !event.data) return;
                    commit("setUser", event.data);
                },
                false
            );
        },

        verify({ commit }) {
            sendRequest("/auth/verify", {}, "GET").then((responseData) => {
                commit("setUser", responseData.loggedIn ? responseData.user : null);
            });
        },

        logout({ commit }) {
            sendRequest("/logout", {}, "GET").then(() => {
                commit("setUser", null);
            });
        },
    },
};
