<template>
    <AlgoBlock header="Wybór testów">
        <div class="test-case-picker-container">
            <v-list density="compact" class="test-case-picker-container__tests">
                <v-list-item
                    v-for="(testCase, index) in project.testData"
                    :key="testCase.id"
                    :title="`Test ${index + 1}`"
                    :active="isTestCaseSelected(testCase.id)"
                    @click="switchTestCase(testCase.id)"
                    active-color="primary"
                >
                    <v-icon class="test-close" v-if="canRemoveTests" @click="this.handleDeleteTestCase(testCase.id)">
                        mdi-close
                    </v-icon>
                </v-list-item>
            </v-list>
            <v-btn
                prepend-icon="mdi-plus-circle"
                @click="this.handleAddTestCase"
                v-if="!project.isRunning"
                variant="tonal"
            >
                Dodaj nowy test
            </v-btn>
        </div>
    </AlgoBlock>
</template>

<script>
    import AlgoBlock from "@/components/global/AlgoBlock.vue";
    import { mapActions, mapState } from "vuex";
    import { defineComponent } from "vue";

    export default defineComponent({
        components: { AlgoBlock },

        methods: {
            ...mapActions("project", ["addTestCase", "deleteTestCase", "switchCurrentTestCase", "switchCurrentFrame"]),

            switchTestCase(index) {
                this.switchCurrentTestCase(index);
                this.switchCurrentFrame(0);
                this.emitter.emit("currentFrameChangedEvent");
            },

            handleAddTestCase() {
                this.addTestCase();
                this.switchCurrentTestCase(this.project.testData.lastId());
            },

            handleDeleteTestCase(id) {
                if (id === this.project.currentTestCaseId) {
                    const nearestId = this.project.testData.nextId(id) ?? this.project.testData.prevId(id);
                    this.switchCurrentTestCase(nearestId);
                }
                this.deleteTestCase(id);
            },
        },

        computed: {
            ...mapState(["project"]),

            isTestCaseSelected() {
                return (id) => id === this.project.currentTestCaseId;
            },

            canRemoveTests() {
                return !this.project.isRunning && this.project.testData.length > 1;
            },
        },
    });
</script>

<style lang="scss" scoped>
    .test-case-picker-container {
        text-align: center;
        min-width: 12rem;

        button {
            margin: 10px;
        }

        .test-close {
            position: absolute;
            top: 0;
            right: 10px;
            transform: translateY(50%);
            cursor: pointer;
        }
    }
</style>
