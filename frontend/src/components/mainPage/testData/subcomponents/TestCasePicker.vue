<template>
    <AlgoBlock header="Wybór testów">
        <div class="test-case-picker-container">
            <v-list density="compact" class="test-case-picker-container__tests">
                <v-list-item
                    v-for="(testCase, index) in this.testData"
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
                v-if="!this.isRunning"
                variant="tonal"
            >
                Dodaj nowy test
            </v-btn>
        </div>
    </AlgoBlock>
</template>

<script>
    import AlgoBlock from "@/components/global/AlgoBlock.vue";
    import { defineComponent } from "vue";
    import { useProjectStore } from "@/stores/project";
    import { storeToRefs } from "pinia";

    export default defineComponent({
        components: { AlgoBlock },
        setup() {
            const store = useProjectStore();

            const { addTestCase, deleteTestCase, switchCurrentTestCase, switchCurrentFrame } = store;

            const { currentTestCaseId, testData, isRunning } = storeToRefs(store);

            return {
                addTestCase,
                deleteTestCase,
                switchCurrentTestCase,
                switchCurrentFrame,
                currentTestCaseId,
                testData,
                isRunning,
            };
        },

        methods: {
            switchTestCase(index) {
                this.switchCurrentTestCase(index);
                this.switchCurrentFrame(0);
                this.emitter.emit("currentFrameChangedEvent");
            },

            handleAddTestCase() {
                this.addTestCase();
                this.switchCurrentTestCase(this.testData.lastId());
            },

            handleDeleteTestCase(id) {
                if (id === this.currentTestCaseId) {
                    const nearestId = this.testData.nextId(id) ?? this.testData.prevId(id);
                    this.switchCurrentTestCase(nearestId);
                }
                this.deleteTestCase(id);
            },
        },

        computed: {
            isTestCaseSelected() {
                return (id) => id === this.currentTestCaseId;
            },

            canRemoveTests() {
                return !this.isRunning && this.testData.length > 1;
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
