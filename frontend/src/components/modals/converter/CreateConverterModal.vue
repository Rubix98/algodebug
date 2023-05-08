<template>
    <AlgoModal title="Utwórz nowy konwerter">
        <AlgoInput v-model:value="converter.title" label="Nazwa" />

        <AlgoTextarea label="Kod" v-model:value="converter.code" placeholder="Kod" />

        <template #buttons>
            <v-btn color="primary" @click="addConverter()">Ustaw</v-btn>
            <v-btn color="primary" v-if="this.showSaveConverterButton" @click="saveConverter()">Zapisz i ustaw</v-btn>
        </template>
    </AlgoModal>
</template>

<script>
    import AlgoModal from "@/components/global/AlgoModal.vue";
    import AlgoInput from "@/components/global/AlgoInput.vue";
    import AlgoTextarea from "@/components/global/AlgoTextarea.vue";
    import UnsavedChangesModal from "@/components/modals/other/UnsavedChangesModal.vue";
    import { sendRequest } from "@/javascript/utils/axiosUtils";
    import { promptModal, popModal } from "jenesius-vue-modal";
    import { defineComponent } from "vue";
    import { useProjectStore } from "@/stores/project";
    import { mapState } from "pinia";
    import { useUserStore } from "@/stores/user";

    export default defineComponent({
        components: { AlgoModal, AlgoInput, AlgoTextarea },

        props: ["callback"],

        data() {
            return {
                converter: {
                    title: "",
                    code: "std::ostream& operator <<(std::ostream& os, const <typ> <nazwa>) {\n\t// Konwersja obiektu na string \n\treturn os;\n}",
                },
            };
        },

        methods: {
            addConverter() {
                popModal().then(() => {
                    this.$props.callback(this.converter);
                });
            },

            saveConverter() {
                this.converter.language = this.language;
                sendRequest("/converter/save", this.converter, "POST").then(() => {
                    this.addConverter();
                });
            },
        },

        computed: {
            ...mapState(useProjectStore, ["language"]),
            ...mapState(useUserStore, ["loggedIn"]),

            showSaveConverterButton() {
                return this.loggedIn;
            },
        },

        async beforeModalClose(e) {
            if (e.background) {
                const shouldClose = await promptModal(UnsavedChangesModal);
                return shouldClose;
            }
        },
    });
</script>
