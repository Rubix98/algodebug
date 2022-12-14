<template>
    <v-card class="dialog">
        <v-card-title class="dialog__title">
            <h2>{{ title }}</h2>
            <v-spacer />
            <i class="dialog__title__close fa fa-close" title="Zamknij okno" @click="popModal()"></i>
        </v-card-title>
        <v-spacer />
        <v-card-text>
            <slot></slot>
        </v-card-text>

        <v-divider />
        <v-card-actions>
            <v-spacer />
            <AlgoButton @click="popModal()">Anuluj</AlgoButton>
            <slot name="buttons"></slot>
        </v-card-actions>
    </v-card>
</template>

<script>
import AlgoButton from "@/components/global/AlgoButton.vue";
import { popModal } from "jenesius-vue-modal";

export default {
    components: { AlgoButton },

    props: ["title"],

    methods: {
        popModal() {
            popModal();
        },
    },
};
</script>

<style lang="scss" scoped>
.dialog {
    min-width: max(40vw, 35rem);
    max-width: 98vw;

    z-index: 100;
    padding: 1rem;

    &__title {
        display: flex;
        align-items: center;
        h2 {
            font-weight: 400;
        }
        &__close {
            cursor: pointer;
        }
    }
}
</style>
