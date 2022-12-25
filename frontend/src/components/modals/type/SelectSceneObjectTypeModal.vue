<template>
    <AlgoModal title="Dodaj nowy obiekt">
        <AlgoPickList :options="types" @selectOptionEvent="handleSelectOption" />
    </AlgoModal>
</template>

<script>
import AlgoModal from "@/components/global/AlgoModal.vue";
import AlgoPickList from "@/components/global/AlgoPickList.vue";
import { popModal } from "jenesius-vue-modal";
import { defineComponent } from "vue";

export default defineComponent({
    components: { AlgoModal, AlgoPickList },

    props: ["callback"],

    data() {
        return {
            types: [
                { key: "variable", label: "Zmienna" },
                { key: "graph", label: "Graf" },
                { key: "array", label: "Tablica" },
                { key: "points", label: "Zbiór punktów" },
                { key: "circle", label: "Okrąg" },
                { key: "shape", label: "Wielokąt" },
            ],
        };
    },

    methods: {
        handleSelectOption(selectedType) {
            this.$props.callback(selectedType);
            popModal();
        },
    },
});
</script>
