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
import { sendRequest } from "@/javascript/utils/axiosUtils";
import { getDialogDataForConverter } from "@/javascript/utils/dialogUtils";
import { popModal, pushModal } from "jenesius-vue-modal";

export default {
    components: { AlgoModal, AlgoPickList, AlgoButton },

    props: ["callback"],

    data() {
        return {
            converters: [],
        };
    },

    created() {
        sendRequest("/converter/findAll", null, "GET").then((responseData) => {
            this.converters = responseData;
            this.converters.forEach((converter) => {
                converter.dialogData = getDialogDataForConverter(converter);
            });
        });
    },

    methods: {
        handleSelectOption(selectedConverter) {
            this.$props.callback(selectedConverter);
            popModal();
        },

        createConverter() {
            pushModal(CreateConverterModal, {
                callback: (newConverter) => {
                    this.converters.push(newConverter);
                    this.handleSelectOption(newConverter);
                },
            });
        },
    },
};
</script>
