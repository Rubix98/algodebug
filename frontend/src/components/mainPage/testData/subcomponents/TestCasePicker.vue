<template>
    <AlgoBlock header="Wybór testów">
        <div class="test-case-picker-container">
            <v-list density="compact" class="test-case-picker-container__tests">
                <v-list-item
                    v-for="(number, index) in this.numberOfTestCases"
                    :key="index"
                    :value="index"
                    :title="`Test ${number}`"
                    :active="isTestCaseSelected(index)"
                    @click="switchTestCase(index)"
                    active-color="primary"
                >
                    <v-icon class="test-close" v-if="canRemoveTests" @click="this.deleteTestCasePressed(index)">
                        mdi-close
                    </v-icon>
                </v-list-item>
            </v-list>
            <v-btn prepend-icon="mdi-plus-circle" @click="this.addTestCase" v-if="!project.isRunning" variant="tonal">
                Dodaj nowy test
            </v-btn>
        </div>
    </AlgoBlock>
</template>

<script>
    import AlgoBlock from "@/components/global/AlgoBlock.vue";
    import { mapActions, mapGetters, mapState } from "vuex";
    import { defineComponent } from "vue";

    export default defineComponent({
        components: { AlgoBlock },

        data() {
            return {
                lastIndex: 0,
            };
        },

        methods: {
            ...mapActions("project", ["addTestCase", "deleteTestCase", "changeCurrentTestCase", "changeCurrentFrame"]),

            switchTestCase(index) {
                if (index >= this.numberOfTestCases) return;

                this.changeCurrentTestCase(index);
                this.changeCurrentFrame(0);
                this.emitter.emit("currentFrameChangedEvent");
                this.lastIndex = index;
            },

            deleteTestCasePressed(index) {
                this.deleteTestCase(index);
                if (index !== this.lastIndex) this.switchTestCase(this.lastIndex);
            },
        },

        computed: {
            ...mapState(["project"]),
            ...mapGetters("project", ["numberOfTestCases"]),

            isTestCaseSelected() {
                return (index) => index === this.project.selectedTestCaseId;
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
