<template>
    <div class="navigation-panel-container flex-vertical-center">
        <i v-for="icon in icons" :key="icon.icon" :class="icon.icon" @click="icon.action"></i>
    </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
    data() {
        return {
            // Cannot read properties of undefined reading id
            icons: [
                {
                    icon: "fa-solid fa-backward-step",
                    action: () => {
                        this.setFrameId(0);
                    },
                },
                {
                    icon: "fa-solid fa-backward",
                    action: () => {
                        this.setFrameId(this.currentFrame.id - 1);
                    },
                },
                { icon: "fa-solid fa-play", action: () => {} },
                {
                    icon: "fa-solid fa-forward",
                    action: () => {
                        this.setFrameId(this.currentFrame.id + 1);
                    },
                },
                {
                    icon: "fa-solid fa-forward-step",
                    action: () => {
                        this.setFrameId(this.numberOfFrames - 1);
                    },
                },
            ],
        };
    },

    methods: {
        ...mapActions("project", ["changeCurrentFrame"]),

        setFrameId(index) {
            if (index < 0 || index >= this.numberOfFrames) return;
            this.changeCurrentFrame(index);
            this.emitter.emit("currentFrameChangedEvent");
        },
    },

    computed: {
        ...mapGetters("project", ["currentFrame", "numberOfFrames"]),
    },
};
</script>

<style scoped>
i {
    font-size: 40px;
    margin: 0 10px;
}
</style>
