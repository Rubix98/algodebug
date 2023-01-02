<template>
    <span class="main-page">
        <CompilingIndicator />
        <div class="main-page-container flex-column full-size">
            <div class="flex-row">
                <CodeEditor
                    id="main-editor"
                    class="width-1-of-2 v-card--variant-elevated elevation-3"
                    :code="this.project.code"
                    :editable="!this.project.isRunning"
                    :clickable="false"
                    :showHighlightedVariables="true"
                    :showBreakpoints="true"
                >
                    <CodePanel />
                </CodeEditor>

                <DebugScene class="width-1-of-2" />
            </div>

            <TestData />
        </div>
    </span>
</template>

<script>
    import CodeEditor from "@/components/mainPage/codeEditor/CodeEditor.vue";
    import CodePanel from "@/components/mainPage/codeEditor/subcomponents/CodePanel.vue";
    import DebugScene from "@/components/mainPage/scene/DebugScene.vue";
    import TestData from "@/components/mainPage/testData/TestData.vue";
    import { mapState, mapActions } from "vuex";
    import { defineComponent } from "vue";
    import CompilingIndicator from "@/components/interface/compilingIndicator/CompilingIndicator.vue";

    export default defineComponent({
        components: { CompilingIndicator, CodeEditor, CodePanel, DebugScene, TestData },

        mounted() {
            if (this.projectId) {
                this.loadProject(this.projectId);
            }
        },

        methods: {
            ...mapActions("project", ["loadProject"]),
        },

        computed: {
            ...mapState(["project"]),

            projectId() {
                const urlParams = new URLSearchParams(window.location.search);
                return urlParams.get("projectId");
            },
        },
    });
</script>

<style lang="scss" scoped>
    @import "src/scss/variables";
    .main-page-container {
        max-height: calc(100vh - 65px);
        padding: 10px;
        gap: $main-page-gap;
    }

    .main-page-container > :first-child {
        height: 70%;
        gap: $main-page-gap;
    }

    .main-page-container > :last-child {
        height: calc(30% - 10px);
    }
</style>
