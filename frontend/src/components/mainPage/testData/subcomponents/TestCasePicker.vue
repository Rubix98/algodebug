<template>
    <AlgoBlock header="Wybór testów">
        <div class="test-case-picker-container full-size">
            <div
                class="test-case flex-vertical-space-between"
                v-for="(number, index) in numberOfTestCases"
                :key="index"
                :class="{ selected: isTestCaseSelected(index) }"
                @click="switchTestCase(index, $event)"
            >
                Test {{ number }}
                <AlgoIcon type="x" @click="deleteTestCase(index)" v-if="canRemoveTests" />
            </div>

            <AlgoButton class="add-button" v-if="!project.isRunning" @click="addTestCase()">
                <i class="fa-solid fa-square-plus"></i> Dodaj nowy test
            </AlgoButton>
        </div>
    </AlgoBlock>
</template>

<script>
import AlgoBlock from "@/components/global/AlgoBlock.vue";
import AlgoButton from "@/components/global/AlgoButton.vue";
import AlgoIcon from "@/components/global/AlgoIcon.vue";
import { mapState, mapGetters, mapActions } from "vuex";

export default {
    components: { AlgoBlock, AlgoButton, AlgoIcon },

    methods: {
        ...mapActions("project", ["addTestCase", "deleteTestCase", "changeCurrentTestCase", "changeCurrentFrame"]),

        switchTestCase(index, event) {
            if (event.target.localName === "i") return;
            this.changeCurrentTestCase(index);
            this.changeCurrentFrame(0);
            this.emitter.emit("currentFrameChangedEvent");
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

<style scoped>
.test-case-picker-container {
    background-color: white;
    border-radius: 0 0 10px 10px;
    overflow: auto;
    text-align: center;
}

.test-case {
    padding: 5px;
    border-top: 1px solid silver;
    cursor: pointer;
}

.test-case:first-child {
    border: none;
}

.test-case:hover {
    background-color: #eee;
}

.selected {
    background-color: #ddd;
}

button {
    margin: 10px;
}
</style>
