<template>
    <div :id="id" class="code-editor-container">
        <slot></slot>
        <MonacoEditor
            :id="id"
            v-model:value="modelCode"
            :options="options"
            @editorDidMount="editorDidMount"
        ></MonacoEditor>
    </div>
</template>

<script>
import MonacoEditor from "monaco-editor-vue3";
import * as monaco from "monaco-editor/esm/vs/editor/editor.main";
import { mapState, mapActions, mapGetters } from "vuex";

export default {
    components: { MonacoEditor },
    props: ["id", "code", "editable", "clickable", "language"],

    methods: {
        ...mapActions("project", ["setCode"]),

        handlePickVariable(variable) {
            console.log(variable);
            this.$emit("pickVariableEvent", variable);
        },

        editorDidMount(editor) {
            editor.onMouseDown((e) => {
                console.log(e); // TODO: handlePickVariable
            });

            this.decorations = editor.deltaDecorations(
                [],
                [
                    {
                        range: new monaco.Range(1, 1, 1, 5),
                        options: { inlineClassName: "highlightVariable" },
                    },
                ]
            );
        },

        // TODO: move variables & breakpoints
        // TODO: highlight lines
    },

    computed: {
        ...mapState(["project"]),
        ...mapGetters("project", ["variables", "currentFrame"]),

        modelCode: {
            get() {
                return this.$props.code;
            },
            set(newValue) {
                this.setCode(newValue);
            },
        },
    },

    data() {
        return {
            options: {
                language: this.$props.language ?? "cpp",
                theme: "vs-dark",
                automaticLayout: "true",
                readOnly: !this.$props.editable,
                minimap: { enabled: false },
                colorDecorators: true,
                glyphMargins: true,
            },
        };
    },
};
</script>

<style scoped>
.code-editor-container {
    transform: translateZ(0);
}
</style>

<style>
.myGlyphMarginClass {
    background: red;
}

.highlightVariable {
    color: white !important;
    border-radius: 2px;
    background: purple;
}
</style>
