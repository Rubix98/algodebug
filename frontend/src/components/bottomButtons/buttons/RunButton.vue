<template>
    <v-btn
        :icon="runButtonIcon"
        :disabled="waitingForCompile"
        fab
        large
        :color="runButtonColor"
        size="large"
        floating
        @click="runButtonPressed"
    >
    </v-btn>
</template>

<script>
import { defineComponent } from "vue";
import { mapActions, mapState } from "vuex";

export default defineComponent({
    name: "RunButton",
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
        waitingForCompile() {
            return this.project.waitingForCompile;
        },
        runButtonIcon() {
            if (this.projectRunning) {
                return "mdi-stop";
            }
            return "mdi-play";
        },
        runButtonColor() {
            if (this.projectRunning) {
                return "error";
            }
            return "primary";
        },
    },
});
</script>
