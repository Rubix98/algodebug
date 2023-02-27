<template>
    <v-app-bar>
        <v-app-bar-nav-icon @click="this.$emit('toggleDrawer')" v-if="showDrawerButton" />
        <a :href="rootUrl" class="app-bar__logo">
            <img class="app-bar__logo__image" :src="logoUrl" alt="AlgoDebug logo" />
            <img class="app-bar__logo__image" :src="titleUrl" alt="AlgoDebug logo" />
        </a>
        <v-spacer />
        <div class="app-bar__buttons">
            <v-btn color="primary" v-if="!this.loggedIn" @click="login"> Zaloguj się </v-btn>
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
    import { mapActions, mapState } from "pinia";
    import { useUserStore } from "@/stores/user";

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
                redirectTo(rootUrl);
            },
        },

        computed: {
            ...mapState(useUserStore, ["loggedIn"]),

            logoUrl() {
                return this.$vuetify.theme.global.name === "dark" ? logoDark : logo;
            },

            titleUrl() {
                return this.$vuetify.theme.global.name === "dark" ? titleDark : title;
            },

            rootUrl() {
                return window.location.origin + window.location.pathname;
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

            &__image {
                height: 100%;
            }
        }

        &__buttons {
            margin-right: 2rem;
        }
    }
</style>
