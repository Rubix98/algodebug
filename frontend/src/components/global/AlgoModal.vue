<template>
    <v-card class="dialog">
        <v-card-title class="dialog__title">
            <h2>{{ title }}</h2>
            <v-spacer />
            <v-btn v-if="!cantClose" class="dialog__title__close" elevation="0" icon @click="popModal">
                <v-icon size="24"> mdi-close </v-icon>
            </v-btn>
        </v-card-title>
        <v-divider />
        <v-card-text class="dialog__content">
            <slot></slot>
        </v-card-text>

        <v-divider />
        <v-card-actions>
            <v-spacer />
            <v-btn v-if="!cantClose" @click="popModal">{{ closeButtonLabel ?? "Anuluj" }}</v-btn>
            <slot name="buttons"></slot>
        </v-card-actions>
    </v-card>
</template>

<script>
    import { popModal } from "jenesius-vue-modal";
    import { defineComponent } from "vue";

    export default defineComponent({
        props: ["title", "closeButtonLabel", "cantClose"],

        methods: {
            popModal() {
                popModal();
            },
        },
    });
</script>

<style lang="scss" scoped>
    @import "node_modules/vuetify/lib/styles/settings/_variables.scss";

    .dialog {
        min-width: max(40vw, 35rem);
        max-width: 90vw;
        max-height: 90vh;

        overflow-y: auto;

        z-index: 100;

        border-style: solid;
        border-width: 1px;
        border-color: $border-color-root;

        &__content {
            padding: 1rem 2rem;
            max-height: 65vh;
            overflow-y: auto;
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
