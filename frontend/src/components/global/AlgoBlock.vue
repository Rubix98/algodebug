<template>
    <div class="algo-block">
        <v-card class="algo-block__card">
            <v-card-title class="algo-block__card__title">
                {{ header }}
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
        &__content {
            height: 85%;
            overflow-y: auto;
        }
    }
}
</style>
