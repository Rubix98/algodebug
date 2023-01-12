<template>
    <v-text-field v-model="model" :label="label" />
</template>

<script>
    import { defineComponent } from "vue";

    export default defineComponent({
        props: {
            value: {
                type: String,
            },

            label: {
                type: String,
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
