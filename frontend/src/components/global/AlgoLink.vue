<template>
    <a>{{ value ? value : label ? label : "Wybierz..." }}</a>
</template>

<script>
export default {
    props: ["value", "label"],
};
</script>

<style scoped>
a {
    color: blue;
    cursor: pointer;
}

a:hover {
    text-decoration: underline;
}
</style>
