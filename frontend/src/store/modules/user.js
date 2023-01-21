import { sendRequest } from "@/javascript/utils/axiosUtils.js";

export default {
    namespaced: true,
    state: {
        loggedIn: false,
        user: null,
    },

    getters: {
        loggedIn(state) {
            return state.loggedIn;
        },

        user(state) {
            if (state.loggedIn) {
                return state.user;
            } else {
                return null;
            }
        },
    },

    mutations: {
        setLoggedIn(state, loggedIn) {
            state.loggedIn = loggedIn;
        },

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
                    commit("setLoggedIn", true);
                    commit("setUser", event.data);
                },
                false
            );
        },

        verify({ commit }) {
            sendRequest("/auth/verify", {}, "GET").then((responseData) => {
                commit("setLoggedIn", responseData.loggedIn);
                commit("setUser", responseData.loggedIn ? responseData.user : null);
            });
        },

        logout({ commit }) {
            sendRequest("/logout", {}, "GET").then((responseData) => {
                commit("setLoggedIn", responseData.loggedIn);
                commit("setUser", null);
            });
        },
    },
};
