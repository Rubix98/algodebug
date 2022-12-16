<template>
    <AlgoBlock header="Wybór testów">
        <div class="test-case-picker-container full-size">
            <v-list density="compact" class="test-case-picker-container__tests">
                <v-list-item
                    v-for="(number, index) in numberOfTestCases"
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
            <AlgoButton v-if="!project.isRunning" @click="this.addTestCase()" icon="mdi-plus-circle">
                Dodaj nowy test
            </AlgoButton>
        </div>
    </AlgoBlock>
</template>

<script>
import AlgoBlock from "@/components/global/AlgoBlock.vue";
import AlgoButton from "@/components/global/AlgoButton.vue";
import { mapActions, mapGetters, mapState } from "vuex";

export default {
    components: { AlgoBlock, AlgoButton },

    data() {
        return {
            lastIndex: 0,
        };
    },

    methods: {
        ...mapActions("project", ["addTestCase", "deleteTestCase", "changeCurrentTestCase", "changeCurrentFrame"]),

        switchTestCase(index) {
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
};
</script>

<style lang="scss" scoped>
.test-case-picker-container {
    border-radius: 0 0 10px 10px;
    overflow: scroll;
    text-align: center;

    &__tests {
        overflow-y: scroll;
    }

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
