<template>
    <pre :data-lang="this.$props.language">{{ this.$props.code }}</pre>
</template>

<script>
    import { defineComponent } from "vue";
    import * as monaco from "monaco-editor/esm/vs/editor/editor.main";
    import { getCurrentThemeFromStorage } from "@/javascript/storage/themeStorage";

    export default defineComponent({
        props: ["code", "language"],

        mounted() {
            monaco.editor.colorizeElement(this.$el, { theme: this.getEditorTheme() });
        },

        methods: {
            getEditorTheme() {
                if (getCurrentThemeFromStorage() === "light") return "vs";
                return "vs-dark";
            },
        },
    });
</script>

<style scoped>
    pre {
        border: 1px solid gray;
        padding: 4px;
        overflow: scroll;
        max-height: 220px;
    }
</style>
