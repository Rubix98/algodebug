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
            @change-specific="handleCodeChange"
            spellcheck="false"
        />
    </div>
</template>

<script>
import AlgoTextarea from "@/components/global/AlgoTextarea.vue";
import { highlightVariables, highlightLine, highlightTargets } from "@/javascript/utils/highlightUtils";
import { mapState, mapActions, mapGetters } from "vuex";

export default {
    components: { AlgoTextarea },

    props: ["id", "code", "editable", "clickable"],

    methods: {
        ...mapActions("project", ["setCode"]),

        handleVariableClick(event) {
            if (!this.$props.clickable || event.target.localName !== "algodebug-highlight-target") return;

            const variable = {
                name: event.target.innerText,
                start: event.target.attributes.start.value,
                end: event.target.attributes.end.value,
            };
            this.$emit("pickVariableEvent", variable);
        },

        moveTrackedVariables(changes) {
            const handleVarTrackerMove = (ch, varObj) => {
                if (ch.size > 0) {
                    if (ch.start > varObj.start && ch.start < varObj.end) return "Delete";
                    if (ch.start <= varObj.start) {
                        varObj.start += ch.size;
                        varObj.end += ch.size;
                    }
                } else {
                    if (ch.start >= varObj.start && ch.start < varObj.end) return "Delete";
                    if (ch.end > varObj.start && ch.end < varObj.end) return "Delete";
                    if (ch.start <= varObj.start) {
                        varObj.start += ch.size;
                        varObj.end += ch.size;
                    }
                }
            };

            this.project.sceneObjects = this.project.sceneObjects.filter((sceneObj) => {
                let mainVar = sceneObj.variable;
                if (handleVarTrackerMove(changes, mainVar) == "Delete") {
                    return false;
                }

                for (let subobjId in sceneObj.subobjects) {
                    let subobj = sceneObj.subobjects[subobjId];
                    let subVar = subobj.variable;
                    if (handleVarTrackerMove(changes, subVar) == "Delete") {
                        return false;
                    }
                }

                return true;
            });
        },

        moveBreakpoints(changes) {
            if (changes.deltaLineCount == 0) return;

            let firstChangedLine = (this.$props.code.substr(0, changes.start - 1).match(/\n/g) || []).length;

            let affectedBreakpoints = [];
            for (let bp of this.project.breakpoints) {
                if (bp[0] < firstChangedLine) continue;
                if (bp[0] > firstChangedLine && bp[0] < firstChangedLine - changes.deltaLineCount) {
                    this.project.breakpoints.addOrDelete({
                        id: bp[0],
                    });
                } else if (bp[0] > firstChangedLine) {
                    affectedBreakpoints.push(bp[0]);
                }
            }
            for (let affectedBreakpoint of affectedBreakpoints) {
                this.project.breakpoints.addOrDelete({
                    id: affectedBreakpoint,
                });
                this.project.breakpoints.addOrDelete({
                    id: affectedBreakpoint + changes.deltaLineCount,
                });
            }
        },

        handleCodeChange(changes) {
            this.moveTrackedVariables(changes);
            this.moveBreakpoints(changes);
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
