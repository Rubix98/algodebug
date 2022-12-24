<template>
    <a class="text-primary">{{ value ? value : label ? label : "Wybierz..." }}</a>
</template>

<script>
export default {
    props: ["value", "label"],
};
</script>

<style scoped>
a {
    cursor: pointer;
}

a:hover {
    text-decoration: underline;
}
</style>
