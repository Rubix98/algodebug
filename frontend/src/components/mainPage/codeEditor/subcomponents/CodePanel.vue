<template>
    <div class="code-editor-header flex-horizontal-center">
        <v-select
            :items="languages"
            item-title="label"
            item-value="key"
            v-model="projectLanguage"
            :disabled="this.isRunning"
        />
    </div>
</template>

<script>
    import { defineComponent } from "vue";
    import { useProjectStore } from "@/stores/project";
    import { storeToRefs } from "pinia";

    export default defineComponent({
        props: [],

        data() {
            return {
                languages: [{ key: "cpp", label: "C++" }],
            };
        },

        setup() {
            const store = useProjectStore();

            const { setLanguage, setIsRunning, switchCurrentFrame, compile } = store;
            const { language, isRunning, debugCode } = storeToRefs(store);

            return { setLanguage, setIsRunning, switchCurrentFrame, compile, language, isRunning, debugCode };
        },

        computed: {
            projectLanguage: {
                get() {
                    return this.language;
                },
                set(newValue) {
                    this.setLanguage(newValue);
                },
            },
        },
    });
</script>

<style scoped lang="scss">
    .code-editor-header {
        position: absolute;
        justify-content: flex-end;
        z-index: 1;
        padding: 5px 15px;
        right: 0;
    }

    input,
    select,
    button {
        margin-left: 2px;
        margin-right: 10px;
    }

    .code-editor-header select {
        width: 80px;
        padding: 2px;
    }

    .code-editor-header button {
        width: 150px;
        padding: 2px;
    }

    i {
        padding: 0 5px;
        font-size: 30px;
        cursor: pointer;
        color: #ccc;

        &:hover {
            color: white;
        }
    }

    select {
        cursor: pointer;
    }
</style>
