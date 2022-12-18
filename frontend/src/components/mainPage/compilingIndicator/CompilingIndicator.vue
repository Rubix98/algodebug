<template>
    <div class="compiling-indicator" v-if="showIndicator">
        <v-progress-linear indeterminate color="primary" />
    </div>
</template>

<script>
import { defineComponent } from "vue";
import { mapState } from "vuex";

export default defineComponent({
    name: "CompilingIndicator",
    computed: {
        ...mapState(["project"]),
        showIndicator() {
            return this.project.waitingForCompile;
        },
    },
});
</script>

<style lang="scss" scoped>
div.compiling-indicator {
    width: 100%;
    position: absolute;
}
</style>
