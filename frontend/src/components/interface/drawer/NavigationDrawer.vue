<template>
    <v-navigation-drawer
        :rail="shouldShowRailVersion"
        :expand-on-hover="shouldShowRailVersion"
        :model-value="showDrawer"
        @update:modelValue="this.$emit('hideDrawerEvent')"
    >
        <v-list>
            <v-list-item :prepend-avatar="userAvatarImg" :title="userNameToShow" subtitle="" />
        </v-list>
        <v-divider />
        <NavigationDrawerButtons :buttons="buttons.project" />
        <v-divider />
        <NavigationDrawerButtons :buttons="buttons.settings" />
    </v-navigation-drawer>
</template>

<script>
import {defineComponent} from "vue";
import {openModal} from "jenesius-vue-modal";
import LoadProjectModal from "@/components/modals/menu/LoadProjectModal.vue";
import SaveProjectModal from "@/components/modals/menu/SaveProjectModal.vue";
import ShowDebugCodeModal from "@/components/modals/code/ShowDebugCodeModal.vue";
import {getCurrentThemeFromStorage, setCurrentThemeInStorage} from "@/javascript/storage/themeStorage";
import defaultUserImage from "@/img/user.png";
import {mapActions, mapState} from "pinia";
import {useUserStore} from "@/stores/user";
import NavigationDrawerButtons from "@/components/interface/drawer/NavigationDrawerButtons.vue";

export default defineComponent({
        name: "NavigationDrawer",
        components: { NavigationDrawerButtons },

        emits: ["toggledToRailVersionEvent", "toggledToNormalVersionEvent", "hideDrawerEvent", "themeChangeEvent"],

        props: {
            showDrawer: {
                type: Boolean,
                default: false,
            },
        },

        data() {
            const logoutButton = { title: "Wyloguj", icon: "mdi-logout", onClick: this.logout, hidden: !this.loggedIn };
            const darkModeButton = {
                title: "Tryb ciemny",
                icon: "mdi-theme-light-dark",
                onClick: this.toggleDarkMode,
            };
            return {
                shouldShowRailVersion: true,
                darkModeButton,
                logoutButton,
                buttons: {
                    project: [
                        {
                            title: "Nowy projekt",
                            icon: "mdi-file-document-plus",
                            onClick: this.createNewProject,
                        },
                        {
                            title: "Zapisz projekt",
                            icon: "mdi-content-save",
                            onClick: this.openSaveProjectModal,
                        },
                        {
                            title: "Otwórz projekt",
                            icon: "mdi-folder-open",
                            onClick: this.openLoadProjectModal,
                        },
                        {
                            title: "Kod debugujący",
                            icon: "mdi-code-braces",
                            onClick: this.showExtendedCode,
                        },
                    ],
                    settings: [
                        darkModeButton,
                        { title: "GitHub", icon: "mdi-github", onClick: this.openGithub },
                        logoutButton,
                    ],
                },
            };
        },

        created() {
            this.updateDarkLightModeButton();
        },

        mounted() {
            this.updateDrawerVersion();
            addEventListener("resize", () => {
                this.updateDrawerVersion();
            });
        },

        methods: {
            ...mapActions(useUserStore, ["logout"]),

            updateDrawerVersion() {
                if (window.innerWidth >= 1280) {
                    this.$data.shouldShowRailVersion = true;
                    this.$emit("toggledToRailVersionEvent");
                } else {
                    this.$data.shouldShowRailVersion = false;
                    this.$emit("toggledToNormalVersionEvent");
                }
            },

            createNewProject() {
                window.location = "/";
            },

            openLoadProjectModal() {
                openModal(LoadProjectModal);
            },

            openSaveProjectModal() {
                openModal(SaveProjectModal);
            },

            showExtendedCode() {
                openModal(ShowDebugCodeModal);
            },

            openGithub() {
                window.open("https://github.com/Rubix98/algodebug", "_blank").focus();
            },

            toggleDarkMode() {
                if (this.$vuetify.theme.global.name === "light") {
                    this.$vuetify.theme.global.name = "dark";
                } else {
                    this.$vuetify.theme.global.name = "light";
                }
                setCurrentThemeInStorage(this.$vuetify.theme.global.name);
                this.emitter.emit("themeChangeEvent");
                this.updateDarkLightModeButton();
            },

            updateDarkLightModeButton() {
                if (getCurrentThemeFromStorage() === "dark") {
                    this.darkModeButton.title = "Tryb jasny";
                    this.darkModeButton.icon = "mdi-white-balance-sunny";
                } else {
                    this.darkModeButton.title = "Tryb ciemny";
                    this.darkModeButton.icon = "mdi-moon-waning-crescent";
                }
            },
        },

        computed: {
            ...mapState(useUserStore, ["userName", "loggedIn", "userPicture"]),

            userAvatarImg() {
                return this.userPicture === null ? defaultUserImage : this.userPicture;
            },

            userNameToShow() {
                return this.userName == null ? "Niezalogowany" : this.userName;
            },
        },

        watch: {
            loggedIn(newValue) {
                this.logoutButton.hidden = !newValue;
            },
        },
    });
</script>
