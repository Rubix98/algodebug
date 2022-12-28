<template>
    <div class="algo-block">
        <v-card class="algo-block__card" elevation="3">
            <v-card-title class="algo-block__card__title">
                {{ header }}
                <slot name="checkbox"></slot>
            </v-card-title>
            <v-divider />
            <v-card-text class="algo-block__card__content">
                <slot></slot>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
    import { defineComponent } from "vue";

    export default defineComponent({
        props: ["header"],
    });
</script>

<style lang="scss" scoped>
    .algo-block {
        margin: 5px;
        padding: 0;

        &__card {
            height: 100%;
            &__title {
                max-height: 3rem;
                height: 3rem;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                width: 100%;

                &:last-child {
                    width: min-content;
                }
            }
            &__content {
                height: calc(100% - 3rem);
                overflow-y: auto;
            }
        }
    }
</style>
