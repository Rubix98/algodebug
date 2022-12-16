<template>
    <v-navigation-drawer
        :rail="shouldShowRailVersion"
        :expand-on-hover="shouldShowRailVersion"
        :model-value="showDrawer"
        @update:modelValue="this.$emit('hideDrawer')"
    >
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
import {defineComponent} from "vue";
import {openModal} from "jenesius-vue-modal";
import LoadProjectModal from "@/components/modals/menu/LoadProjectModal.vue";
import SaveProjectModal from "@/components/modals/menu/SaveProjectModal.vue";
import ShowDebugCodeModal from "@/components/modals/code/ShowDebugCodeModal.vue";

export default defineComponent({
    name: "NavigationDrawer",
    emits: ["toggledToRailVersion", "toggledToNormalVersion", "hideDrawer"],
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
                    { title: "Zapisz projekt", icon: "mdi-content-save", onClick: this.openSaveProjectModal },
                    { title: "Otwórz projekt", icon: "mdi-folder-open", onClick: this.openLoadProjectModal },
                    { title: "Pokaż program debugujący", icon: "mdi-code-braces", onClick: this.showExtendedCode },
                ],
                settings: [
                    { title: "Przełącz tryb nocny", icon: "mdi-theme-light-dark", onClick: this.toggleDarkMode },
                    { title: "Github", icon: "mdi-github", onClick: this.openGithub },
                ],
            },
        };
    },
    methods: {
        updateDrawerVersion() {
            if (window.innerWidth >= 1280) {
                this.$data.shouldShowRailVersion = true;
                this.$emit("toggledToRailVersion");
            } else {
                this.$data.shouldShowRailVersion = false;
                this.$emit("toggledToNormalVersion");
            }
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
          window.open("https://github.com/Rubix98/algodebug", "_blank").focus()
      },
      toggleDarkMode() {
          // TODO: Save theme in localStorage
          if (this.$vuetify.theme.global.name === "light") {
            this.$vuetify.theme.global.name = "dark"
          }else {
            this.$vuetify.theme.global.name = "light"
          }
        }
    },
    mounted() {
        this.updateDrawerVersion();
        addEventListener("resize", () => {
            this.updateDrawerVersion();
        });
    },
});
</script>
