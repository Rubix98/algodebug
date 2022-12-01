<template>
    <ul class="code-line-numbers-container">
        <li
            class="flex-row flex-vertical-space-between flex-horizontal-center"
            v-for="(line, index) in code.numberOfLines()"
            :key="index"
        >
            <i :class="bindIconClass(index)" @click="handleBreakpointClick(index)"></i> {{ line }}
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

        bindIconClass() {
            return (lineIndex) => {
                if (this.$props.id === "debug-code-editor") return "";
                if (this.project.breakpoints.has(lineIndex)) return "fa fa-circle breakpoint";
                if (this.$props.editable) return "fa-regular fa-square";
            };
        },
    },
};
</script>

<style scoped>
.code-line-numbers-container {
    overflow: hidden;
    border-radius: 10px 0 0 10px;
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
