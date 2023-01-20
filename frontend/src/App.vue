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
        <ModalContainer />
    </v-app>
</template>

<script>
    import { defineComponent } from "vue";
    import AppBar from "@/components/interface/appBar/AppBar.vue";
    import MainPage from "@/components/mainPage/MainPage.vue";
    import { container as ModalContainer } from "jenesius-vue-modal";
    import BottomButtons from "@/components/interface/bottomButtons/BottomButtons.vue";
    import NavigationDrawer from "@/components/interface/drawer/NavigationDrawer.vue";
    import { useCachedListStore } from "@/stores/cachedList";

    export default defineComponent({
        name: "App",

        components: { NavigationDrawer, BottomButtons, AppBar, MainPage, ModalContainer },

        data() {
            return {
                drawerRailMode: false,
                showDrawer: false,
            };
        },

        setup() {
            const store = useCachedListStore();

            const { updateProjects, updateConverters } = store;

            return { updateProjects, updateConverters };
        },

        mounted() {
            this.updateProjects();
            this.updateConverters();
        },

        methods: {
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
