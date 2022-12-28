<template>
    <div class="test-data-container flex-row">
        <TestCasePicker class="full-height ma-0" />

        <div class="test-data-container__input_and_output full-size flex-row">
            <AlgoBlock class="full-size ma-0" header="Dane wejściowe">
                <AlgoTextarea
                    :auto-grow="true"
                    v-model:value="input"
                    placeholder="Wprowadź dane wejściowe do programu"
                    :readonly="this.project.isRunning"
                />
            </AlgoBlock>

            <AlgoBlock class="full-size ma-0" header="Dane wyjściowe" v-if="this.project.isRunning">
                <template #checkbox>
                    <v-checkbox-btn
                        v-model="isDynamicOutputOn"
                        color="primary"
                        label="Dynamiczny output"
                        hide-details
                        style="height: 2rem"
                        class="shrink ma-0"
                    />
                </template>
                <AlgoTextarea :value="output" :auto-grow="true" :readonly="true" />
            </AlgoBlock>
        </div>
    </div>
</template>

<script>
import TestCasePicker from "@/components/mainPage/testData/subcomponents/TestCasePicker.vue";
import AlgoBlock from "@/components/global/AlgoBlock.vue";
import AlgoTextarea from "@/components/global/AlgoTextarea.vue";
import { defineComponent } from "vue";
import { mapActions, mapGetters, mapState } from "vuex";

export default defineComponent({
    components: { TestCasePicker, AlgoTextarea, AlgoBlock },

    data() {
        return {
            isDynamicOutputOn: false,
        };
    },

    methods: {
        ...mapActions("project", ["updateCurrentTestCaseInput"]),
    },

    computed: {
        ...mapState(["project"]),
        ...mapGetters("project", ["currentTestCase", "currentFrame", "numberOfFrames"]),

        input: {
            get() {
                return this.currentTestCase.input;
            },
            set(newValue) {
                this.updateCurrentTestCaseInput(newValue);
            },
        },

        output() {
            let endIndex = this.isDynamicOutputOn ? this.currentFrame.id + 1 : undefined;
            return this.currentTestCase.partialOutputs.slice(0, endIndex).join("");
        },
    },
});
</script>

<style lang="scss">
@import "src/scss/variables";

div.test-data-container {
    gap: $main-page-gap;

    &__input_and_output {
        gap: $main-page-gap;
    }
}
</style>
