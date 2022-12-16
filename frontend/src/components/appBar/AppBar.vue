<template>
    <v-app-bar>
        <v-app-bar-nav-icon @click="this.$emit('toggleDrawer')" v-if="showDrawerButton" />
        <div class="app-bar__logo">
            <img class="app-bar__logo__image" src="@/img/logo.png" @click="redirectToRoot()" alt="AlgoDebug logo" />
        </div>

        <div class="app-bar__buttons"></div>
    </v-app-bar>
</template>

<script>
import {defineComponent} from "vue";
import {redirectTo} from "@/javascript/utils/other";

export default defineComponent({
    name: "AppBar",
    emits: ["toggleDrawer"],
    props: {
      showDrawerButton: {
        type: Boolean,
      }
    },
    methods: {
        redirectToRoot() {
            redirectTo(window.location.origin + window.location.pathname);
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
    }
}
</style>
