<template>
    <div class="buttons">
        <div class="buttons__list" v-for="(buttonKey, index) in Object.keys(buttons)" :key="buttonKey">
            <v-list density="compact">
                <v-list-item
                    v-for="button in filterVisibleButtons(buttons[buttonKey])"
                    :key="button.title"
                    :prepend-icon="button.icon"
                    :title="button.title"
                    @click="button.onClick"
                />
            </v-list>
            <v-divider v-if="index < Object.keys(buttons).length - 1" />
            <!-- If is not a last key -->
        </div>
    </div>
</template>

<script>
    import { defineComponent } from "vue";
    import { mapActions, mapState } from "pinia";
    import { useUserStore } from "@/stores/user";
    import { openModal } from "jenesius-vue-modal";
    import LoadProjectModal from "@/components/modals/menu/LoadProjectModal.vue";
    import SaveProjectModal from "@/components/modals/menu/SaveProjectModal.vue";
    import ShowDebugCodeModal from "@/components/modals/code/ShowDebugCodeModal.vue";
    import { getCurrentThemeFromStorage, setCurrentThemeInStorage } from "@/javascript/storage/themeStorage";
    import UserSettingsModal from "@/components/modals/settings/UserSettingsModal.vue";

    export default defineComponent({
        name: "NavigationDrawerButtons",

        emits: ["themeChangeEvent"],

        data() {
            const logoutButton = { title: "Wyloguj", icon: "mdi-logout", onClick: this.logout, hidden: !this.loggedIn };
            const userEditButton = {
                title: "Edycja konta",
                icon: "mdi-account-edit",
                onClick: this.openUserSettingsModal,
                hidden: !this.loggedIn,
            };
            const darkModeButton = {
                title: "Tryb ciemny",
                icon: "mdi-theme-light-dark",
                onClick: this.toggleDarkMode,
            };
            return {
                darkModeButton,
                logoutButton,
                userEditButton,
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
                        userEditButton,
                        logoutButton,
                    ],
                },
            };
        },

        created() {
            this.updateDarkLightModeButton();
        },

        methods: {
            ...mapActions(useUserStore, ["logout"]),

            createNewProject() {
                window.location = "/";
            },

            openUserSettingsModal() {
                openModal(UserSettingsModal);
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

            filterVisibleButtons(buttonsToFilter) {
                return buttonsToFilter.filter((button) => !!button.hidden === false);
            },
        },

        computed: {
            ...mapState(useUserStore, ["loggedIn"]),
        },

        watch: {
            loggedIn(newValue) {
                this.logoutButton.hidden = !newValue;
                this.userEditButton.hidden = !newValue;
            },
        },
    });
</script>
