<template>
    <div class="algo-field-row">
        <label class="algo-field-row__label gray">{{ label }}</label>
        <div class="algo-field-row__value-container">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    props: ["label"],
    mounted() {},
};
</script>

<style lang="scss" scoped>
.algo-field-row {
    margin-bottom: 0.5rem;

    &__label {
        color: #313131;
    }
}
</style>
