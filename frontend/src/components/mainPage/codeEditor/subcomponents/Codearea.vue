<template>
    <div class="codearea-container full-size">
        <pre
            class="highlights"
            :class="{ visible: !editable }"
            v-html="extendedCode"
            @scroll="emitScrollEvent"
            @click="handleVariableClick"
        ></pre>

        <AlgoTextarea
            class="codearea full-size"
            v-show="editable"
            v-model:value="modelCode"
            @scroll="emitScrollEvent"
            @code-change="handleCodeChange"
            spellcheck="false"
        />
    </div>
</template>

<script>
import AlgoTextarea from "@/components/global/AlgoTextarea.vue";
import { highlightVariables, highlightLine, highlightTargets } from "@/javascript/utils/highlightUtils";
import { mapState, mapActions, mapGetters } from "vuex";
import { moveBreakpoints, moveTrackedVariables } from "@/javascript/utils/codeUtils";

export default {
    components: { AlgoTextarea },

    props: ["id", "code", "editable", "clickable"],

    methods: {
        ...mapActions("project", ["setCode"]),

        handleVariableClick(event) {
            if (!this.$props.clickable || event.target.localName !== "algodebug-highlight-target") return;

            const variable = {
                name: event.target.innerText,
                start: Number(event.target.attributes.start.value),
                end: Number(event.target.attributes.end.value),
            };
            this.$emit("pickVariableEvent", variable);
        },

        handleCodeChange(change) {
            moveTrackedVariables(change);
            moveBreakpoints(this.project, {
                ...change,
                firstChangedLine: this.$props.code.substr(0, change.start - 1).numberOfLines(),
            });
        },
        emitScrollEvent(event) {
            this.$emit("scrollEvent", event.target);
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

        extendedCode() {
            switch (this.$props.id) {
                case "main-editor":
                    return this.extendedCodeForMainEditor;
                case "debug-code-editor":
                    return this.extendedCodeForDebugCodeEditor;
                case "pick-variable-editor":
                    return this.extendedCodeForPickVariableEditor;
                default:
                    return this.modelCode.escapeHTML();
            }
        },

        extendedCodeForMainEditor() {
            let code = this.modelCode;
            code = highlightVariables(code, this.variables);
            if (this.project.isRunning) {
                code = highlightLine(code, this.currentFrame?.line);
            }
            return code.escapeHTML();
        },

        extendedCodeForDebugCodeEditor() {
            let code = this.modelCode;
            return code.escapeHTML();
        },

        extendedCodeForPickVariableEditor() {
            let code = this.modelCode;
            code = highlightTargets(code);
            return code.escapeHTML();
        },
    },
};
</script>

<style scoped>
.codearea,
.highlights {
    overflow: auto;
    border: none;
    outline: none;
    white-space: pre;
    color: white;
    font: inherit;
    tab-size: 4;
}

.codearea {
    background-color: transparent;
}

.highlights {
    position: absolute;
    width: calc(100% - 60px);
    height: 100%;
    z-index: -1;
}

.visible {
    z-index: 0;
}
</style>

<style>
algodebug-highlight-variable,
algodebug-highlight-line,
algodebug-highlight-target {
    border-radius: 5px;
}

algodebug-highlight-variable {
    background-color: purple;
}

algodebug-highlight-line {
    background-color: #006600;
    width: 100%;
    display: inline-block;
}

algodebug-highlight-target {
    transition: background-color 0.2s;
}

algodebug-highlight-target:hover {
    background-color: orange;
    cursor: pointer;
}
</style>
