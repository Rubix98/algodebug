<template>
    <v-text-field :model="model" :label="label" />
</template>

<script>
export default {
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
};
</script>

<style scoped></style>
