<template>
    <ul class="code-line-numbers-container">
        <li
            class="flex-row flex-vertical-space-between flex-horizontal-center"
            v-for="(line, index) in code.numberOfLines()"
            :key="index"
        >
            <v-icon size="20" @click="handleBreakpointClick(index)" :class="isBreakpoint(index) ? 'breakpoint' : ''">
                {{ returnIconName(index) }}
            </v-icon>
            {{ line }}
        </li>
        <br />
    </ul>
</template>

<script>
import { mapState } from "vuex";

export default {
    props: ["id", "code", "editable"],

    methods: {
        handleBreakpointClick(lineIndex) {
            if (!this.$props.editable) return;
            this.project.breakpoints.addOrDelete({ id: lineIndex });
        },
    },

    computed: {
        ...mapState(["project"]),

        isBreakpoint() {
            return (lineIndex) => {
                if (this.project.breakpoints.has(lineIndex)) return 1;
                return 0;
            };
        },

        returnIconName() {
            return (lineIndex) => {
                if (this.$props.id === "debug-code-editor") return "";
                if (this.project.breakpoints.has(lineIndex)) return "mdi-circle";
                if (this.$props.editable) return "mdi-crop-square";
            };
        },
    },
};
</script>

<style scoped>
.code-line-numbers-container {
    overflow: hidden;
    min-width: 60px;
    background-color: #aaa;
}

li {
    padding: 0 5px;
}

.breakpoint {
    color: red;
}
</style>
