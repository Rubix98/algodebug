<template>
    <div class="navigation-panel-container flex-vertical-center">
        <v-btn v-for="icon in icons" :key="icon.icon" :prepend-icon="icon.icon" icon elevation="0" @click="icon.action">
            <v-icon>
                {{ icon.icon }}
            </v-icon>
        </v-btn>
    </div>
</template>

<script>
    import { defineComponent } from "vue";
    import { useProjectStore } from "@/stores/project";
    import { mapActions, mapState } from "pinia";
    export default defineComponent({
        data() {
            return {
                // Cannot read properties of undefined reading id
                animationInterval: null,
                animationDelay: 500,
                icons: [
                    {
                        icon: "mdi-skip-backward",
                        action: () => {
                            if (this.animationInterval) {
                                this.stopAnimation();
                            }
                            this.setFrameId(0);
                        },
                    },
                    {
                        icon: "mdi-step-backward",
                        action: () => {
                            if (this.animationInterval) {
                                this.stopAnimation();
                            }
                            this.setFrameId(this.currentFrame.id - 1);
                        },
                    },
                    {
                        icon: "mdi-play",
                        action: () => {
                            if (this.animationInterval) {
                                this.stopAnimation();
                            } else {
                                if (this.currentFrame.id == this.numberOfFrames - 1) {
                                    this.setFrameId(0);
                                }
                                this.animationInterval = this.runAnimation(this.animationDelay);
                            }
                        },
                    },
                    {
                        icon: "mdi-step-forward",
                        action: () => {
                            if (this.animationInterval) {
                                this.stopAnimation();
                            }
                            this.setFrameId(this.currentFrame.id + 1);
                        },
                    },
                    {
                        icon: "mdi-skip-forward",
                        action: () => {
                            this.setFrameId(this.numberOfFrames - 1);
                        },
                    },
                ],
            };
        },
        unmounted() {
            clearInterval(this.animationInterval);
        },
        methods: {
            ...mapActions(useProjectStore, ["switchCurrentFrame"]),

            setFrameId(index) {
                if (index < 0 || index >= this.numberOfFrames) return;
                this.switchCurrentFrame(index);
                this.emitter.emit("currentFrameChangedEvent");
            },
            stopAnimation() {
                clearInterval(this.animationInterval);
                this.animationInterval = null;
                this.playPauseIcon = "mdi-play";
            },
            runAnimation(delay) {
                this.playPausIcon = "mdi-pause";
                var intervalID = window.setInterval(
                    (e) => {
                        e.setFrameId(e.currentFrame.id + 1);
                        if (e.currentFrame.id == e.numberOfFrames - 1) {
                            e.playPauseIcon = "mdi-play";
                            e.stopAnimation();
                        }
                    },
                    delay,
                    this
                );
                this.playPauseIcon = "mdi-pause";
                return intervalID;
            },
        },

        computed: {
            ...mapState(useProjectStore, ["currentFrame", "numberOfFrames"]),
            playPauseIcon: {
                get() {
                    return this.icons[2].icon;
                },
                set(icon) {
                    this.icons[2].icon = icon;
                },
            },
        },
    });
</script>

<style scoped>
    i {
        font-size: 40px;
        margin: 0 10px;
    }
</style>
