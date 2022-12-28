<template>
    <v-app-bar>
        <v-app-bar-nav-icon @click="this.$emit('toggleDrawer')" v-if="showDrawerButton" />
        <div class="app-bar__logo">
            <img class="app-bar__logo__image" :src="logoUrl" @click="redirectToRoot()" alt="AlgoDebug logo" />
        </div>
        <v-spacer />
        <div class="app-bar__buttons">
            <v-btn color="primary"> Zaloguj się </v-btn>
        </div>
    </v-app-bar>
</template>

<script>
import { defineComponent } from "vue";
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
    methods: {
        redirectToRoot() {
            redirectTo(window.location.origin + window.location.pathname);
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
