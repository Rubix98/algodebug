<template>
    <a class="text-primary">{{ value ? value : label ? label : "Wybierz..." }}</a>
</template>

<script>
    import { defineComponent } from "vue";

    export default defineComponent({
        props: ["value", "label"],
    });
</script>

<style scoped lang="scss">
    a {
        cursor: pointer;
        &:hover {
            text-decoration: underline;
        }
    }
</style>
