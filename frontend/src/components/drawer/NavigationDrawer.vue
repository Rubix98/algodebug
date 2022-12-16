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
                />
            </v-list>
            <v-divider v-if="index < Object.keys(buttons).length - 1" />
            <!-- If is not a last key -->
        </div>
    </v-navigation-drawer>
</template>

<script>
import { defineComponent } from "vue";

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
                    { title: "Zapisz projekt", icon: "mdi-content-save" },
                    { title: "Otwórz projekt", icon: "mdi-folder-open" },
                    { title: "Pokaż program debugujący", icon: "mdi-code-braces" },
                ],
                settings: [
                    { title: "Tryb nocny", icon: "mdi-theme-light-dark" },
                    { title: "Github", icon: "mdi-github" },
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
    },
    mounted() {
        this.updateDrawerVersion();
        addEventListener("resize", () => {
            this.updateDrawerVersion();
        });
    },
});
</script>
