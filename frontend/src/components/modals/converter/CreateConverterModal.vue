<template>
    <AlgoModal title="Utwórz nowy konwerter">
        <AlgoInput v-model:value="converter.title" label="Nazwa" />

        <AlgoTextarea label="Kod" v-model:value="converter.code" placeholder="Kod" />

        <template #buttons>
            <v-btn color="primary" @click="addConverter()">Ustaw</v-btn>
            <v-btn color="primary" @click="saveConverter()">Zapisz i ustaw</v-btn>
        </template>
    </AlgoModal>
</template>

<script>
    import AlgoModal from "@/components/global/AlgoModal.vue";
    import AlgoInput from "@/components/global/AlgoInput.vue";
    import AlgoTextarea from "@/components/global/AlgoTextarea.vue";
    import { sendRequest } from "@/javascript/utils/axiosUtils";
    import { popModal } from "jenesius-vue-modal";
    import { defineComponent } from "vue";
    import { useProjectStore } from "@/stores/project";
    import { mapState } from "pinia";

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
        },
    });
</script>
