<template>
    <div class="test-data-container flex-row">
        <TestCasePicker class="full-height" />

        <div class="full-size flex-row">
            <AlgoBlock class="full-size" header="Dane wejściowe">
                <AlgoTextarea
                    v-model:value="input"
                    placeholder="Wprowadź dane wejściowe do programu"
                    :readonly="this.project.isRunning"
                >
                </AlgoTextarea>
            </AlgoBlock>

            <AlgoBlock class="full-size" header="Dane wyjściowe" v-if="project.isRunning">
                <template #checkbox>
                    Dynamiczny output: <input type="checkbox" v-model="isDynamicOutputOn" />
                </template>
                <AlgoTextarea :value="output" :readonly="true"> </AlgoTextarea>
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
