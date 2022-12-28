<template>
    <div class="code-editor-header flex-horizontal-center">
        <v-select
            :items="languages"
            item-title="label"
            item-value="key"
            v-model="language"
            :disabled="this.project.isRunning"
        />
    </div>
</template>

<script>
    import { mapActions, mapGetters, mapState } from "vuex";

    export default {
        props: [],

        data() {
            return {
                languages: [{ key: "cpp", label: "C++" }],
            };
        },

        methods: {
            ...mapActions("project", ["setLanguage", "setIsRunning", "changeCurrentFrame", "compile"]),
        },

        computed: {
            ...mapState(["project"]),
            ...mapGetters("project", ["debugCode"]),

            language: {
                get() {
                    return this.project.language;
                },
                set(newValue) {
                    this.setLanguage(newValue);
                },
            },
        },
    };
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
