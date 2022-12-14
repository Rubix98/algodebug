<template>
    <v-app-bar>
        <div class="app-bar__logo">
            <img class="app-bar__logo__image" src="@/img/logo.png" @click="redirectToRoot()" alt="AlgoDebug logo" />
        </div>

        <div class="app-bar__buttons"></div>
    </v-app-bar>
</template>

<script>
import { defineComponent } from "vue";
import LoadProjectModal from "@/components/modals/menu/LoadProjectModal.vue";
import SaveProjectModal from "@/components/modals/menu/SaveProjectModal.vue";
import { redirectTo } from "@/javascript/utils/other";
import { openModal } from "jenesius-vue-modal";

export default defineComponent({
    name: "AppBar",

    methods: {
        redirectToRoot() {
            redirectTo(window.location.origin + window.location.pathname);
        },

        openLoadProjectModal() {
            openModal(LoadProjectModal);
        },

        openSaveProjectModal() {
            openModal(SaveProjectModal);
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
