<template>
    <v-app>
        <NavigationDrawer
            ref="drawer"
            :show-drawer="showDrawer"
            @toggledToNormalVersionEvent="changeDrawerRailMode(false)"
            @toggledToRailVersionEvent="changeDrawerRailMode(true)"
            @hideDrawerEvent="changeDrawerValueTo(false)"
        />
        <AppBar @toggleDrawer="toggleDrawer" :show-drawer-button="!drawerRailMode" />
        <v-main>
            <MainPage ref="mainPage" />
        </v-main>
        <BottomButtons ref="bottomButtons" />
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
    import { mapActions, mapState } from "pinia";
    import { useProjectStore } from "@/stores/project";

    export default defineComponent({
        name: "App",

        components: { NavigationDrawer, BottomButtons, AppBar, MainPage, ModalContainer },

        data() {
            return {
                drawerRailMode: false,
                showDrawer: false,
                keymap: {},
            };
        },

        mounted() {
            this.updateProjects();
            this.updateConverters();

            window.addEventListener("keydown", this.keyUpOrDown);
            window.addEventListener("keyup", this.keyUpOrDown);
            
            console.log(`[GIT INFO]\nCommit: ${GIT_COMMIT_INFO}\nBranch: ${GIT_BRANCH_NAME}`);
        },

        methods: {
            ...mapActions(useCachedListStore, ["updateProjects", "updateConverters"]),
            ...mapActions(useProjectStore, ["saveProject"]),
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

            keyUpOrDown(event) {
                let handled = false;
                this.keymap[event.key] = event.type == "keydown";
                if (event.ctrlKey && this.keymap["s"]) {
                    this.saveProject(this.title, true);
                    handled = true;
                } else if (event.shiftKey && event.ctrlKey && this.keymap["S"]) {
                    this.$refs.drawer.$refs.drawerButtons.openSaveProjectModal();
                    handled = true;
                } else if (event.ctrlKey && this.keymap["ArrowLeft"]) {
                    if (this.$refs.mainPage.$refs.debugScene.isRunning) {
                        this.$refs.mainPage.$refs.debugScene.$refs.navigationPanel.icons[0].action();
                        handled = true;
                    }
                } else if (!event.ctrlKey && this.keymap["ArrowLeft"]) {
                    if (this.$refs.mainPage.$refs.debugScene.isRunning) {
                        this.$refs.mainPage.$refs.debugScene.$refs.navigationPanel.icons[1].action();
                        handled = true;
                    }
                } else if (!event.ctrlKey && this.keymap[" "]) {
                    if (this.$refs.mainPage.$refs.debugScene.isRunning) {
                        this.$refs.mainPage.$refs.debugScene.$refs.navigationPanel.icons[2].action();
                        handled = true;
                    }
                } else if (!event.ctrlKey && this.keymap["ArrowRight"]) {
                    if (this.$refs.mainPage.$refs.debugScene.isRunning) {
                        this.$refs.mainPage.$refs.debugScene.$refs.navigationPanel.icons[3].action();
                        handled = true;
                    }
                } else if (event.ctrlKey && this.keymap["ArrowRight"]) {
                    if (this.$refs.mainPage.$refs.debugScene.isRunning) {
                        this.$refs.mainPage.$refs.debugScene.$refs.navigationPanel.icons[4].action();
                        handled = true;
                    }
                } else if (event.ctrlKey && this.keymap["r"]) {
                    this.$refs.bottomButtons.$refs.runButton.runButtonPressed();
                    handled = true;
                } else if (event.ctrlKey && this.keymap["n"]) {
                    //Przeglądarka (przynajmniej moja) przechwytuje Ctrl+n więc trzeba zamienić na coś innego
                    this.$refs.drawer.$refs.drawerButtons.createNewProject();
                    handled = true;
                } else if (event.ctrlKey && this.keymap["o"]) {
                    this.$refs.drawer.$refs.drawerButtons.openLoadProjectModal();
                    handled = true;
                } else if (event.ctrlKey && this.keymap["d"]) {
                    this.$refs.drawer.$refs.drawerButtons.showExtendedCode();
                    handled = true;
                }

                if (handled) {
                    event.preventDefault();
                }
            },
        },

        computed: {
            ...mapState(useProjectStore, ["title"]),
        },
    });
</script>

<style lang="scss">
    @import "@/scss/global.scss";
</style>
