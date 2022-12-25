<template>
    <v-card class="dialog">
        <v-card-title class="dialog__title">
            <h2>{{ title }}</h2>
            <v-spacer />
            <i class="dialog__title__close fa fa-close" title="Zamknij okno" @click="popModal()"></i>
        </v-card-title>
        <v-divider />
        <v-card-text class="dialog__content">
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
import { defineComponent } from "vue";

export default defineComponent({
    components: { AlgoButton },

    props: ["title"],

    methods: {
        popModal() {
            popModal();
        },
    },
});
</script>

<style lang="scss" scoped>
.dialog {
    min-width: max(40vw, 35rem);
    max-width: 98vw;
    max-height: 80vh;

    z-index: 100;

    &__content {
        padding: 1rem 2rem;
        max-height: 65vh;
        overflow-y: scroll;
    }

    &__title {
        padding: 1rem 2rem;
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
