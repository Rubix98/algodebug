<template>
    <textarea
        v-if="dontUseVuetify"
        v-model="model"
        :readonly="readonly"
        @keydown.tab.prevent="insertTabIndent"
        @beforeinput="handleBeforeinput"
        @input="handleInput"
    >
    </textarea>
    <v-textarea
        v-else
        v-model="model"
        :readonly="readonly"
        :label="label"
        @keydown.tab.prevent="insertTabIndent"
        @beforeinput="handleBeforeinput"
        @input="handleInput"
    ></v-textarea>
</template>

<script>
import { compareCode } from "@/javascript/utils/codeUtils";
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        value: {
            type: String,
        },
        readonly: {
            type: Boolean,
        },
        label: {
            type: String,
            required: false,
        },
        dontUseVuetify: {
            type: Boolean,
            defaultValue: false,
        },
    },

    methods: {
        insertTabIndent(event) {
            if (this.readonly) return;

            let startText = this.model.slice(0, event.target.selectionStart);
            let endText = this.model.slice(event.target.selectionStart);
            this.model = `${startText}\t${endText}`;

            let selectionStart = event.target.selectionStart;
            this.$nextTick(() => {
                event.target.selectionStart = event.target.selectionEnd = selectionStart + 1;
            });

            this.$emit("code-change", {
                start: event.target.selectionStart,
                end: event.target.selectionStart + 1,
                size: 1,
                deltaLineCount: 0,
            });
        },

        handleBeforeinput(event) {
            if (["historyUndo", "historyRedo"].includes(event.inputType)) {
                event.preventDefault();
                return;
            }

            this.oldText = event.target.value;
            this.selection = {
                start: event.target.selectionStart,
                end: event.target.selectionEnd,
            };
        },

        handleInput(event) {
            let result = compareCode(this.oldText, event.target.value, event, this.selection);
            this.$emit("code-change", result);
        },
    },

    computed: {
        model: {
            get() {
                return this.$props.value;
            },
            set(value) {
                this.$emit("update:value", value);
            },
        },
    },
});
</script>

<style scoped>
textarea {
    width: 100%;
    resize: none;
    border-radius: 0 0 10px 10px;
    font-size: 16px;
    tab-size: 4;
}

.without-outline {
    outline: none;
    border: none;
}

.small {
    height: 150px;
}
</style>
