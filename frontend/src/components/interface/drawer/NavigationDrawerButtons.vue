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
    import { mapActions, mapState, mapWritableState } from "pinia";
    import { useUserStore } from "@/stores/user";
    import { openModal } from "jenesius-vue-modal";
    import LoadProjectModal from "@/components/modals/menu/LoadProjectModal.vue";
    import SaveProjectModal from "@/components/modals/menu/SaveProjectModal.vue";
    import ShowDebugCodeModal from "@/components/modals/code/ShowDebugCodeModal.vue";
    import { getCurrentThemeFromStorage, setCurrentThemeInStorage } from "@/javascript/storage/themeStorage";
    import { useProjectStore } from "@/stores/project";

    export default defineComponent({
        name: "NavigationDrawerButtons",

        emits: ["themeChangeEvent"],

        data() {
            const logoutButton = { title: "Wyloguj", icon: "mdi-logout", onClick: this.logout, hidden: !this.loggedIn };
            const deleteButton = { title: "Usuń projekt", icon: "mdi-delete", onClick: () => null, hidden: true };
            const darkModeButton = {
                title: "Tryb ciemny",
                icon: "mdi-theme-light-dark",
                onClick: this.toggleDarkMode,
            };
            return {
                darkModeButton,
                logoutButton,
                deleteButton,
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
                        deleteButton,
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

        methods: {
            ...mapActions(useUserStore, ["logout"]),

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

            filterVisibleButtons(buttonsToFilter) {
                return buttonsToFilter.filter((button) => !!button.hidden === false);
            },

            shouldShowDeleteButton() {
                return this.authorId === this.userId;
            },
        },

        computed: {
            ...mapWritableState(useUserStore, ["loggedIn", "userId"]),
            ...mapWritableState(useProjectStore, ["authorId"]),
        },

        watch: {
            loggedIn(newValue) {
                this.logoutButton.hidden = !newValue;
            },

            authorId() {
                this.deleteButton.hidden = !this.shouldShowDeleteButton();
                console.log(this.deleteButton.hidden);
            },
        },
    });
</script>
