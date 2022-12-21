<template>
    <div
        :id="id"
        :value="code"
        :editable="editable"
        :clickable="clickable"
        @pickVariableEvent="handlePickVariable"
        class="full-size"
    ></div>
</template>

<script>
import * as monaco from "monaco-editor/esm/vs/editor/editor.main";

export default {
    props: ["id", "code", "editable", "clickable"],

    mounted() {
        let editor = monaco.editor.create(document.getElementById(this.$props.id), {
            language: "cpp",
            theme: "vs-dark",
            automaticLayout: true,
            minimap: {
                enabled: false,
            },
            readOnly: !this.$props.editable,
        });

        let model = editor.getModel();
        model.onDidChangeContent((e) => {
            console.log(e);
        });
    },

    methods: {
        handleScroll(target) {
            const rootDOM = document.getElementById(this.id);
            const codeareaDOM = rootDOM.getElementsByClassName("codearea")[0];
            const highlightsDOM = rootDOM.getElementsByClassName("highlights")[0];
            const linesDOM = rootDOM.getElementsByClassName("code-line-numbers-container")[0];

            target = target.localName === "textarea" ? codeareaDOM : highlightsDOM;
            linesDOM.scrollTop = highlightsDOM.scrollTop = target.scrollTop;
            highlightsDOM.scrollLeft = target.scrollLeft;
        },

        handlePickVariable(variable) {
            this.$emit("pickVariableEvent", variable);
        },
    },
};
</script>

<style scoped></style>
