<template>
    <AlgoModal title="Niezapisane zmiany" :cantClose="true">
        Masz niezapisane zmiany. Czy na pewno zamknąć?
        <template #buttons>
            <v-btn @click="close()" color="primary">Tak</v-btn>
            <v-btn @click="dontClose()" color="primary">Nie</v-btn>
        </template>
    </AlgoModal>
</template>

<script>
    import { defineComponent } from "vue";
    import AlgoModal from "@/components/global/AlgoModal.vue";
    import { Modal, onBeforeModalClose } from "jenesius-vue-modal";

    export default defineComponent({
        components: { AlgoModal },

        setup() {
            onBeforeModalClose((e) => {
                if (e.esc || e.background) return false;
            });
        },

        methods: {
            close() {
                this.$emit(Modal.EVENT_PROMPT, true);
            },

            dontClose() {
                this.$emit(Modal.EVENT_PROMPT, false);
            },
        },
    });
</script>
