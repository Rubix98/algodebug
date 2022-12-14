<template>
    <v-btn :icon="runButtonIcon" fab large :color="runButtonColor" size="large" floating @click="runButtonPressed">
    </v-btn>
</template>

<script>
import { defineComponent } from "vue";
import { mapActions, mapState } from "vuex";

export default defineComponent({
    name: "RunButton",
    data() {
        return {
            waitingForCompile: false,
        };
    },
    methods: {
        ...mapActions("project", ["setLanguage", "setIsRunning", "changeCurrentFrame", "compile"]),

        runButtonPressed() {
            if (this.projectRunning) {
                this.stopProgram();
            } else {
                this.waitingForCompile = true;
                this.runProgram();
            }
        },

        runProgram() {
            this.compile().then((success) => {
                if (!success) return;
                this.waitingForCompile = false;
                this.emitter.emit("startDebuggingEvent");
            });
        },

        stopProgram() {
            this.setIsRunning(false);
            this.changeCurrentFrame(0);
            this.emitter.emit("stopDebuggingEvent");
        },
    },
    computed: {
        ...mapState(["project"]),

        projectRunning() {
            return this.project.isRunning;
        },
        runButtonIcon() {
            if (this.waitingForCompile) {
                return "mdi-timer-sand-empty";
            }
            if (this.projectRunning) {
                return "mdi-stop";
            }
            return "mdi-play";
        },
        runButtonColor() {
            if (this.waitingForCompile) {
                return "white";
            }
            if (this.projectRunning) {
                return "error";
            }
            return "primary";
        },
    },
});
</script>
