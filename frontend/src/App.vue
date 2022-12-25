<template>
    <v-app>
        <NavigationDrawer
            :show-drawer="showDrawer"
            @toggledToNormalVersionEvent="changeDrawerRailMode(false)"
            @toggledToRailVersionEvent="changeDrawerRailMode(true)"
            @hideDrawerEvent="changeDrawerValueTo(false)"
        />
        <AppBar @toggleDrawer="toggleDrawer" :show-drawer-button="!drawerRailMode" />
        <v-main>
            <MainPage />
        </v-main>
        <BottomButtons />
    </v-app>
    <Modal />
</template>

<script>
import { defineComponent } from "vue";
import AppBar from "@/components/appBar/AppBar.vue";
import MainPage from "@/components/mainPage/MainPage.vue";
import { container } from "jenesius-vue-modal";
import BottomButtons from "@/components/bottomButtons/BottomButtons.vue";
import NavigationDrawer from "@/components/drawer/NavigationDrawer.vue";
import { mapActions } from "vuex";

export default defineComponent({
    name: "App",
    components: { NavigationDrawer, BottomButtons, AppBar, MainPage, Modal: container },

    mounted() {
        this.updateProjects();
        this.updateConverters();
    },
    data() {
        return {
            drawerRailMode: false,
            showDrawer: false,
        };
    },

    methods: {
        ...mapActions("cachedLists", ["updateProjects", "updateConverters"]),

        toggleDrawer() {
            this.showDrawer = !this.showDrawer;
        },
        changeDrawerRailMode(mode) {
            this.drawerRailMode = mode;
            this.showDrawer = mode;
        },
        changeDrawerValueTo(value) {
            this.showDrawer = value;
        },
    },
});
</script>

<style lang="scss">
@import "@/scss/global.scss";
</style>
