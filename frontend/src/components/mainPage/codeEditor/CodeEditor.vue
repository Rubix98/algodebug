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
import {
    getVariablesArray,
    monacoChangeToLegacyFormat,
    moveBreakpoints,
    moveTrackedVariables,
} from "@/javascript/utils/codeUtils";
import lineColumn from "line-column";
import { defineComponent } from "vue";
import { getCurrentThemeFromStorage } from "@/javascript/storage/themeStorage";

export default defineComponent({
    components: { MonacoEditor },
    props: ["id", "code", "editable", "clickable", "showHighlightedVariables", "showBreakpoints"],

    data() {
        return {
            options: {
                language: "cpp",
                theme: this.getEditorTheme(),
                automaticLayout: "true",
                readOnly: !this.$props.editable,
                minimap: { enabled: false },
                colorDecorators: true,
                glyphMargin: true,
            },

            currentVariablesDecorations: [],
            currentBreakpointsDecorations: [],
            currentLineDecorations: [],
            currentTargetDecorations: [],
        };
    },

    mounted() {
        this.updateAllDecorations();
        this.emitter.on("themeChangeEvent", () => {
            this.options.theme = this.getEditorTheme();
        });
    },

    methods: {
        ...mapActions("project", ["setCode"]),

        editorDidMount(editor) {
            this.editor = editor;

            editor.getModel().onDidChangeContent((event) => {
                this.handleChangeContent(event);
            });

            editor.onMouseDown((event) => {
                this.handleClick(event);
            });
        },

        getEditorTheme() {
            if (getCurrentThemeFromStorage() === "light") return "vs-light";
            return "vs-dark";
        },

        handlePickVariable(event) {
            const word = this.editor.getModel().getWordAtPosition(event.target.position);
            const variable = {
                name: event.target.element.innerText,
                start: lineColumn(this.$props.code).toIndex(event.target.position.lineNumber, word.startColumn),
                end: lineColumn(this.$props.code).toIndex(event.target.position.lineNumber, word.endColumn),
            };
            this.$emit("pickVariableEvent", variable);
        },

        handleChangeContent(event) {
            for (let change of event.changes) {
                // change.forceMoveMarkers is undefined when text is changed by code.
                // We must update decorations manually, because otherwise it doesn't show up on startup
                if (change.forceMoveMarkers == undefined) {
                    this.updateAllDecorations();
                    continue;
                }

                let legacyChange = monacoChangeToLegacyFormat(this.$props.code, change);
                moveTrackedVariables(legacyChange);
                moveBreakpoints(this.project, legacyChange);
            }
        },

        handleClick(event) {
            if (event.target.element.classList.contains("breakpoint")) {
                if (!this.$props.editable) return;
                this.project.breakpoints.addOrDelete({ id: event.target.position.lineNumber - 1 });
                return;
            }

            if (event.target.element.classList.contains("target")) {
                this.handlePickVariable(event);
                return;
            }
        },

        updateAllDecorations() {
            this.updateVariablesDecorations(this.variablesDecorations);
            this.updateBreakpointsDecorations(this.breakpointsDecorations);
            this.updateLineDecorations(this.lineDecorations);
            this.updateTargetDecorations(this.targetDecorations);
        },

        updateVariablesDecorations(dec) {
            this.currentVariablesDecorations = this.editor.deltaDecorations(this.currentVariablesDecorations, dec);
        },

        updateBreakpointsDecorations(dec) {
            this.currentBreakpointsDecorations = this.editor.deltaDecorations(this.currentBreakpointsDecorations, dec);
        },

        updateLineDecorations(dec) {
            this.currentLineDecorations = this.editor.deltaDecorations(this.currentLineDecorations, dec);
        },

        updateTargetDecorations(dec) {
            this.currentTargetDecorations = this.editor.deltaDecorations(this.currentTargetDecorations, dec);
        },
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

        variablesDecorations() {
            if (!this.$props.showHighlightedVariables) return [];

            return this.variables.toArray().map((variable) => {
                let startLineColumn = lineColumn(this.$props.code, variable.start);
                let endLineColumn = lineColumn(this.$props.code, variable.end);
                return {
                    range: new monaco.Range(
                        startLineColumn.line,
                        startLineColumn.col,
                        endLineColumn.line,
                        endLineColumn.col
                    ),
                    options: { inlineClassName: "highlight-variable" },
                };
            });
        },

        breakpointsDecorations() {
            if (!this.$props.showBreakpoints) return [];

            return this.$props.code.split("\n").map((_, i) => {
                return {
                    range: new monaco.Range(i + 1, 1, i + 1, 1),
                    options: {
                        glyphMarginClassName: this.getBreakpointClass(i),
                    },
                };
            });
        },

        lineDecorations() {
            if (!this.$props.showHighlightedVariables) return [];
            if (!this.project.isRunning) return [];

            return [
                {
                    range: new monaco.Range(this.currentFrame?.line + 1, 1, this.currentFrame?.line + 1, 1),
                    options: { isWholeLine: true, className: "highlight-line" },
                },
            ];
        },

        targetDecorations() {
            if (!this.$props.clickable) return [];

            return getVariablesArray(this.project.language, this.$props.code).map((word) => {
                return {
                    range: new monaco.Range(word.startLineNumber, word.startColumn, word.endLineNumber, word.endColumn),
                    options: { inlineClassName: "target" },
                };
            });
        },

        getBreakpointClass() {
            return (i) => {
                if (this.project.breakpoints.has(i)) return "breakpoint breakpoint-active";
                if (!this.project.isRunning && this.$props.editable) return "breakpoint";
                return "";
            };
        },
    },

    watch: {
        editable: function (newVal) {
            this.options.readOnly = !newVal;
            this.editor.updateOptions({ readOnly: !newVal });
        },

        variablesDecorations: function (dec) {
            this.updateVariablesDecorations(dec);
        },
        breakpointsDecorations: function (dec) {
            this.updateBreakpointsDecorations(dec);
        },
        lineDecorations: function (dec) {
            this.updateLineDecorations(dec);
        },
    },
});
</script>

<style scoped lang="scss">
.code-editor-container {
    transform: translateZ(0);
    position: relative;
    z-index: 40;
}
</style>

<style lang="scss">
.highlight-variable {
    color: white !important;
    border-radius: 5px;
    background: purple;
}

.highlight-line {
    background: transparentize(#1a73e8, 0.7);
}

.breakpoint-active {
    background: red;
    border: none !important;
    border-radius: 50% !important;
}

.breakpoint {
    transform: scale(0.8);
    border: 1px solid gray;
    border-radius: 15%;
    margin-left: 5px;
    cursor: pointer;
}

.target {
    cursor: pointer;
    transition: 0.2s background-color;
    border-radius: 5px;
}

.target:hover {
    background: orange;
}
</style>
