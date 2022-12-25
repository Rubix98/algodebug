<template>
    <AlgoModal title="Utwórz nowy konwerter">
        <AlgoInput v-model:value="converter.title" label="Nazwa" />

        <AlgoTextarea label="Kod" v-model:value="converter.code" placeholder="Kod" />

        <template #buttons>
            <AlgoButton type="ok" @click="addConverter()">Ustaw</AlgoButton>
            <AlgoButton type="ok" @click="saveConverter()">Zapisz i ustaw</AlgoButton>
        </template>
    </AlgoModal>
</template>

<script>
import AlgoModal from "@/components/global/AlgoModal.vue";
import AlgoInput from "@/components/global/AlgoInput.vue";
import AlgoTextarea from "@/components/global/AlgoTextarea.vue";
import AlgoButton from "@/components/global/AlgoButton.vue";
import { sendRequest } from "@/javascript/utils/axiosUtils";
import { popModal } from "jenesius-vue-modal";
import { defineComponent } from "vue";

export default defineComponent({
    components: { AlgoModal, AlgoInput, AlgoButton, AlgoTextarea },

    props: ["callback"],

    data() {
        return {
            converter: {
                title: "",
                code: "ostream& operator <<(ostream& os, const <typ> <nazwa>) {\n\t// Konwersja obiektu na string \n\treturn os;\n}",
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
            sendRequest("/converter/save", this.converter, "PUT").then(() => {
                this.addConverter();
            });
        },
    },
});
</script>
