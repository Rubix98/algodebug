<template>
    <textarea v-if="dontUseVuetify" v-model="model" :readonly="readonly" @keydown.tab.prevent="insertTabIndent">
    </textarea>
    <v-textarea
        v-else
        v-model="model"
        :readonly="readonly"
        :label="label"
        @keydown.tab.prevent="insertTabIndent"
    ></v-textarea>
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
