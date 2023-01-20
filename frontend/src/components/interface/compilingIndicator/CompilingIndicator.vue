<template>
    <div class="compiling-indicator" v-if="showIndicator">
        <v-progress-linear indeterminate color="primary" />
    </div>
</template>

<script>
    import { defineComponent } from "vue";
    import { storeToRefs } from "pinia";
    import { useProjectStore } from "@/stores/project";

    export default defineComponent({
        name: "CompilingIndicator",

        setup() {
            const store = useProjectStore();

            const { waitingForCompile } = storeToRefs(store);

            return { waitingForCompile };
        },

        computed: {
            showIndicator() {
                return this.waitingForCompile;
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
