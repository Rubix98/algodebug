<template>
    <v-navigation-drawer
        :rail="shouldShowRailVersion"
        :expand-on-hover="shouldShowRailVersion"
        :model-value="showDrawer"
        @update:modelValue="this.$emit('hideDrawerEvent')"
    >
        <v-list>
            <v-list-item :prepend-avatar="userAvatarImg" title="Użytkownik" subtitle="user@example.com" />
        </v-list>
        <v-divider />
        <div class="buttons-list" v-for="(buttonsKeys, index) in Object.keys(buttons)" :key="buttonsKeys">
            <v-list density="compact">
                <v-list-item
                    v-for="button in buttons[buttonsKeys]"
                    :key="button.title"
                    :prepend-icon="button.icon"
                    :title="button.title"
                    @click="button.onClick"
                />
            </v-list>
            <v-divider v-if="index < Object.keys(buttons).length - 1" />
            <!-- If is not a last key -->
        </div>
    </v-navigation-drawer>
</template>

<script>
    import { defineComponent } from "vue";
    import { openModal } from "jenesius-vue-modal";
    import LoadProjectModal from "@/components/modals/menu/LoadProjectModal.vue";
    import SaveProjectModal from "@/components/modals/menu/SaveProjectModal.vue";
    import ShowDebugCodeModal from "@/components/modals/code/ShowDebugCodeModal.vue";
    import { getCurrentThemeFromStorage, setCurrentThemeInStorage } from "@/javascript/storage/themeStorage";
    import userImage from "@/img/user.png";

    export default defineComponent({
        name: "NavigationDrawer",

        emits: ["toggledToRailVersionEvent", "toggledToNormalVersionEvent", "hideDrawerEvent", "themeChangeEvent"],

        props: {
            showDrawer: {
                type: Boolean,
                default: false,
            },
        },

        data() {
            return {
                shouldShowRailVersion: true,
                buttons: {
                    project: [
                        { title: "Nowy projekt", icon: "mdi-file-document-plus", onClick: this.createNewProject },
                        { title: "Zapisz projekt", icon: "mdi-content-save", onClick: this.openSaveProjectModal },
                        { title: "Otwórz projekt", icon: "mdi-folder-open", onClick: this.openLoadProjectModal },
                        { title: "Kod debugujący", icon: "mdi-code-braces", onClick: this.showExtendedCode },
                    ],
                    settings: [
                        { title: "Tryb ciemny", icon: "mdi-theme-light-dark", onClick: this.toggleDarkMode },
                        { title: "GitHub", icon: "mdi-github", onClick: this.openGithub },
                    ],
                },
            };
        },

        created() {
            this.updateDarkLightModeButton();
        },

        methods: {
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
                const darkLightModeButton = this.buttons.settings[0];
                if (getCurrentThemeFromStorage() === "dark") {
                    darkLightModeButton.title = "Tryb jasny";
                    darkLightModeButton.icon = "mdi-white-balance-sunny";
                } else {
                    darkLightModeButton.title = "Tryb ciemny";
                    darkLightModeButton.icon = "mdi-moon-waning-crescent";
                }
            },
        },

        mounted() {
            this.updateDrawerVersion();
            addEventListener("resize", () => {
                this.updateDrawerVersion();
            });
        },

        computed: {
            userAvatarImg() {
                return userImage;
            },
        },
    });
</script>
