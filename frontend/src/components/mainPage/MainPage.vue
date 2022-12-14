<template>
    <CompilingIndicator />

    <div class="main-page-container flex-column full-size">
        <div class="flex-row">
            <CodeEditor
                id="main-editor"
                class="width-1-of-2"
                :code="project.code"
                :editable="!project.isRunning"
                :clickable="false"
            >
                <CodePanel />
            </CodeEditor>

            <Scene class="width-1-of-2" />
        </div>

        <TestData />
    </div>
</template>

<script>
import CodeEditor from "@/components/mainPage/codeEditor/CodeEditor.vue";
import CodePanel from "@/components/mainPage/codeEditor/subcomponents/CodePanel.vue";
import Scene from "@/components/mainPage/scene/Scene.vue";
import TestData from "@/components/mainPage/testData/TestData.vue";
import { mapState, mapActions } from "vuex";
import CompilingIndicator from "@/components/mainPage/compilingIndicator/CompilingIndicator.vue";

export default {
    components: { CompilingIndicator, CodeEditor, CodePanel, Scene, TestData },

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
};
</script>

<style scoped>
.main-page-container {
    max-height: calc(100vh - 65px);
    padding: 10px;
    gap: 10px;
}

.main-page-container > :first-child {
    height: 70%;
    gap: 10px;
}

.main-page-container > :last-child {
    height: calc(30% - 10px);
}
</style>
