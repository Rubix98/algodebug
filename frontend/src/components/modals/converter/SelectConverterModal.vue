<template>
    <AlgoModal title="Wybierz konwerter">
        <AlgoPickList :options="converters" @selectOptionEvent="handleSelectOption" />

        <template #buttons>
            <AlgoButton @click="createConverter()">Utwórz nowy kowerter</AlgoButton>
        </template>
    </AlgoModal>
</template>

<script>
import AlgoModal from "@/components/global/AlgoModal.vue";
import AlgoPickList from "@/components/global/AlgoPickList.vue";
import AlgoButton from "@/components/global/AlgoButton.vue";
import CreateConverterModal from "@/components/modals/converter/CreateConverterModal.vue";
import { popModal, pushModal } from "jenesius-vue-modal";
import { mapActions, mapGetters } from "vuex";

export default {
    components: { AlgoModal, AlgoPickList, AlgoButton },

    props: ["callback"],

    created() {
        this.updateConverters();
    },

    methods: {
        ...mapActions("cachedLists", ["updateConverters"]),

        handleSelectOption(selectedConverter) {
            this.$props.callback(selectedConverter);
            popModal();
        },

        createConverter() {
            pushModal(CreateConverterModal, {
                callback: (newConverter) => {
                    this.handleSelectOption(newConverter);
                },
            });
        },
    },

    computed: {
        ...mapGetters("cachedLists", ["converters"]),
    },
};
</script>

<style scoped>
.dialog {
    width: 80vw;
}
</style>
