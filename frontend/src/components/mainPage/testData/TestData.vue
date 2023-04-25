<template>
    <div class="test-data-container flex-row">
        <TestCasePicker class="full-height ma-0" />

        <div class="test-data-container__input_and_output full-size flex-row">
            <AlgoBlock class="full-size ma-0" header="Dane wejściowe">
                <AlgoTextarea
                    :auto-grow="true"
                    v-model:value="input"
                    placeholder="Wprowadź dane wejściowe do programu"
                    :readonly="this.isRunning"
                />
            </AlgoBlock>

            <AlgoBlock class="full-size ma-0" header="Dane wyjściowe">
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
                <AlgoTextarea class="outputTextArea" :value="output" :auto-grow="true" :readonly="true" />
            </AlgoBlock>
        </div>
    </div>
</template>

<script>
    import TestCasePicker from "@/components/mainPage/testData/subcomponents/TestCasePicker.vue";
    import AlgoBlock from "@/components/global/AlgoBlock.vue";
    import AlgoTextarea from "@/components/global/AlgoTextarea.vue";
    import { defineComponent } from "vue";
    import { useProjectStore } from "@/stores/project";
    import { mapActions, mapState } from "pinia";

    export default defineComponent({
        components: { TestCasePicker, AlgoTextarea, AlgoBlock },

        data() {
            return {
                isDynamicOutputOn: false,
            };
        },

        methods: {
            ...mapActions(useProjectStore, ["updateCurrentTestCaseInput"]),
        },

        computed: {
            ...mapState(useProjectStore, ["currentTestCase", "currentFrame", "numberOfFrames", "isRunning"]),
            input: {
                get() {
                    return this.currentTestCase.input;
                },
                set(newValue) {
                    this.updateCurrentTestCaseInput(newValue);
                },
            },

            output() {
                console.log(this.currentTestCase);
                let endIndex = this.isDynamicOutputOn ? this.currentFrame.id + 1 : undefined;
                if (this.currentTestCase.error) {
                    // this.AlgoBlock.AlgoTextarea.color="red";
                    return this.currentTestCase.error;
                }

                return this.currentTestCase.partialOutputs?.slice(0, endIndex).join("");
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

            textarea {
                font-family: $editor-font-family;
            }
        }
    }
</style>
