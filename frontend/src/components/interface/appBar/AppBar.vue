<template>
    <v-app-bar>
        <v-app-bar-nav-icon @click="this.$emit('toggleDrawer')" v-if="showDrawerButton" />
        <div class="app-bar__logo">
            <img class="app-bar__logo__image" :src="logoUrl" @click="redirectToRoot()" alt="AlgoDebug logo" />
        </div>
        <v-spacer />
        <div class="app-bar__buttons">
            <v-btn color="primary" v-if="!this.loggedIn" @click="login"> Zaloguj się </v-btn>
            <v-btn variant="text" color="primary" v-if="this.loggedIn" @click="logout"> Wyloguj się </v-btn>
        </div>
    </v-app-bar>
</template>

<script>
    import { defineComponent } from "vue";
    import { redirectTo } from "@/javascript/utils/other";
    import logoDark from "@/img/logo-dark.png";
    import logo from "@/img/logo.png";
    import {mapActions, mapState} from "pinia";
    import {useUserStore} from "@/stores/user";

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
            ...mapActions(useUserStore, ["login", "verify", "logout"]),

            redirectToRoot() {
                redirectTo(window.location.origin + window.location.pathname);
            },

        },

        computed: {
            ...mapState(useUserStore, ["loggedIn"]),

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
