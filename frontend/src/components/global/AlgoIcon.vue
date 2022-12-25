<template>
    <span>
        <i class="close-icon fa-solid fa-xmark" v-if="type === 'x'"></i>
        <i class="plus-icon fa-solid fa-square-plus" v-if="type === '+'"></i>
    </span>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
    props: ["type"],
});
</script>

<style scoped>
.close-icon {
    color: red;
}

.plus-icon {
    color: green;
}
</style>
