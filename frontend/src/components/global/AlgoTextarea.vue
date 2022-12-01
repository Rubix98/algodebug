<template>
    <textarea
        v-model="model"
        :readonly="readonly"
        @keydown.tab.prevent="insertTabIndent"
        @beforeinput="handleBeforeinput"
        @input="handleInput"
    ></textarea>
</template>

<script>
let oldText = "";

export default {
    props: ["value", "readonly"],

    methods: {
        insertTabIndent(event) {
            if (this.readonly) return;

            let startText = this.model.slice(0, event.target.selectionStart);
            let endText = this.model.slice(event.target.selectionStart);
            this.model = `${startText}\t${endText}`;

            let selectionStart = event.target.selectionStart;
            this.$nextTick(() => {
                event.target.selectionStart = event.target.selectionEnd =
                    selectionStart + 1;
            });

            this.$emit("change-specific", {
                start: event.target.selectionStart,
                end: event.target.selectionStart + 1,
                size: 1,
                deltaLineCount: 0,
            });
        },

        handleBeforeinput(event) {
            oldText = event.target.value;
        },

        handleInput(event) {
            console.log(event);
            let newText = event.target.value;

            let oldLen = oldText.length;
            let newLen = newText.length;

            let lengthDifference = newLen - oldLen;
            let differenceStart = 0;

            for (let i = 0; i < Math.min(newLen, oldLen); i++) {
                if (newText[i] == oldText[i]) differenceStart = i + 1;
                else break;
            }

            let oldLineCount = (oldText.match(/\n/g) || []).length;
            let newLineCount = (newText.match(/\n/g) || []).length;
            this.$emit("change-specific", {
                start: differenceStart,
                end: differenceStart + Math.abs(lengthDifference),
                size: lengthDifference,
                deltaLineCount: newLineCount - oldLineCount,
            });
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
};
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
