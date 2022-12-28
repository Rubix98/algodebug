<template>
    <v-text-field :model="model" :label="label" />
</template>

<script>
    import { defineComponent } from "vue";

    export default defineComponent({
        props: ["value", "label"],

        data() {
            return {
                model: "",
            };
        },

        mounted() {
            this.model = this.value;
        },

        watch: {
            model() {
                this.$emit("update:value", this.model);
            },
        },
    });
</script>
