<template>
    <AlgoModal title="Wybierz konwerter">
        <AlgoPickList :options="this.converters" @selectOptionEvent="handleSelectOption" />

        <template #buttons>
            <v-btn @click="createConverter()">Utwórz nowy kowerter</v-btn>
        </template>
    </AlgoModal>
</template>

<script>
import AlgoModal from "@/components/global/AlgoModal.vue";
import AlgoPickList from "@/components/global/AlgoPickList.vue";
import CreateConverterModal from "@/components/modals/converter/CreateConverterModal.vue";
import { popModal, pushModal } from "jenesius-vue-modal";
import { defineComponent } from "vue";
import { mapActions, mapGetters } from "vuex";

export default defineComponent({
    components: { AlgoModal, AlgoPickList },

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
});
</script>
