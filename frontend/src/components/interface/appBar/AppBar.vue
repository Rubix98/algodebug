<template>
    <v-app-bar>
        <v-app-bar-nav-icon @click="this.$emit('toggleDrawer')" v-if="showDrawerButton" />
        <div class="app-bar__logo">
            <img class="app-bar__logo__image" :src="logoUrl" @click="redirectToRoot()" alt="AlgoDebug logo" />
            <img class="app-bar__logo__image" :src="titleUrl" @click="redirectToRoot()" alt="AlgoDebug logo" />
        </div>
        <v-spacer />
        <div class="app-bar__buttons">
            <v-btn color="primary" v-if="!this.loggedIn" @click="login"> Zaloguj się </v-btn>
            <v-btn color="primary" v-if="this.loggedIn" @click="logout"> Wyloguj się </v-btn>
        </div>
    </v-app-bar>
</template>

<script>
    import { defineComponent } from "vue";
    import { redirectTo } from "@/javascript/utils/other";
    import logo from "@/img/logo.png";
    import logoDark from "@/img/logo-dark.png";
    import title from "@/img/title.png";
    import titleDark from "@/img/title-dark.png";
    import store from "@/store";

    export default defineComponent({
        name: "AppBar",

        emits: ["toggleDrawer"],

        props: {
            showDrawerButton: {
                type: Boolean,
            },
        },

        mounted() {
            this.verify();
        },

        methods: {
            redirectToRoot() {
                redirectTo(window.location.origin + window.location.pathname);
            },

            login() {
                store.dispatch("user/login");
            },

            verify() {
                store.dispatch("user/verify");
            },

            logout() {
                store.dispatch("user/logout");
            },
        },

        computed: {
            loggedIn() {
                return store.getters["user/loggedIn"];
            },

            logoUrl() {
                return this.$vuetify.theme.global.name === "dark" ? logoDark : logo;
            },

            titleUrl() {
                return this.$vuetify.theme.global.name === "dark" ? titleDark : title;
            }
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
