<template>
    <v-app-bar>
        <v-app-bar-nav-icon @click="this.$emit('toggleDrawer')" v-if="showDrawerButton" />
        <div class="app-bar__logo">
            <img class="app-bar__logo__image" :src="logoUrl" @click="redirectToRoot()" alt="AlgoDebug logo" />
        </div>
        <v-spacer />
        <div class="app-bar__buttons">
            <v-btn color="primary" v-if="!loggedIn" @click="login"> Zaloguj się </v-btn>
            <v-btn color="primary" v-if="loggedIn" @click="logout"> Wyloguj się </v-btn>
        </div>
    </v-app-bar>
</template>

<script>
    import { defineComponent } from "vue";
    import { sendRequest } from "@/javascript/utils/axiosUtils";
    import { redirectTo } from "@/javascript/utils/other";
    import logoDark from "@/img/logo-dark.png";
    import logo from "@/img/logo.png";

    export default defineComponent({
        name: "AppBar",

        emits: ["toggleDrawer"],

        props: {
            showDrawerButton: {
                type: Boolean,
            },
        },

        data() {
            return {
                loggedIn: false,
            };
        },
        mounted() {
            this.verify();
        },

        methods: {
            redirectToRoot() {
                redirectTo(window.location.origin + window.location.pathname);
            },

            login() {
                window.open("http://localhost:8080/auth/google", "_blank", "height=570,width=520");

                window.addEventListener(
                    "message",
                    (event) => {
                        if (event.origin !== "http://localhost:8080" || !event.data) return;

                        // user object in event.data
                        console.log(event.data);
                        // can be saved to store or cookie

                        this.loggedIn = true;
                    },
                    false
                );
            },

            verify() {
                sendRequest("/auth/verify", {}, "GET").then((responseData) => {
                    this.loggedIn = responseData.loggedIn;
                });
            },

            logout() {
                sendRequest("/logout", {}, "GET").then((responseData) => {
                    this.loggedIn = responseData.loggedIn;
                });
            },
        },

        computed: {
            logoUrl() {
                return this.$vuetify.theme.global.name === "dark" ? logoDark : logo;
            },
        },
    });
</script>

<style lang="scss">
    .app-bar {
        &__logo {
            margin-left: 0.7rem;
            height: 65%;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;

            &__image {
                height: 100%;
            }
        }

        &__buttons {
            margin-right: 2rem;
        }
    }
</style>
