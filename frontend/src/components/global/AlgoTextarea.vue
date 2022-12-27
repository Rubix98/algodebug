<template>
    <v-textarea
        :auto-grow="autoGrow"
        v-model="model"
        :readonly="readonly"
        :label="label"
        @keydown.tab.prevent="insertTabIndent"
    />
</template>

<script>
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
        autoGrow: {
            type: Boolean,
            default: false,
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

<style scoped lang="scss">
.without-outline {
    outline: none;
    border: none;
}

.small {
    height: 150px;
}
</style>
