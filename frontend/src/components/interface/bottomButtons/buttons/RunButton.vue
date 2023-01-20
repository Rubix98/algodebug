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
    import { useProjectStore } from "@/stores/project";
    import { storeToRefs } from "pinia";

    export default defineComponent({
        name: "RunButton",
        setup() {
            const store = useProjectStore();

            const { isRunning, waitingForCompile } = storeToRefs(store);
            const { setIsRunning, setWaitingForCompile, switchCurrentFrame, compile } = store;

            return {
                isRunning,
                waitingForCompile,
                setIsRunning,
                setWaitingForCompile,
                switchCurrentFrame,
                compile,
            };
        },

        methods: {
            runButtonPressed() {
                if (this.projectRunning) {
                    this.stopProgram();
                } else {
                    this.setWaitingForCompile(true);

                    this.runProgram();
                }
            },

            runProgram() {
                this.compile().then((success) => {
                    if (!success) return;
                    this.setWaitingForCompile(false);

                    this.emitter.emit("startDebuggingEvent");
                });
            },

            stopProgram() {
                this.setIsRunning(false);
                this.switchCurrentFrame(0);
                this.emitter.emit("stopDebuggingEvent");
            },
        },
        computed: {
            projectRunning() {
                return this.isRunning;
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
