<template>
    <AlgoModal :title="modalTitle">
        <AlgoFieldRow label="Rodzaj obiektu">
            <AlgoLink :value="typeLabel" @click="selectType()" />
        </AlgoFieldRow>

        <AlgoFieldRow label="Przypisana zmienna">
            <AlgoLink :value="variableName" @click="selectVariable()" />
        </AlgoFieldRow>

        <AlgoFieldRow label="Konwerter">
            <AlgoLink :value="converterTitle" label="Brak" @click="selectConverter()" /> </AlgoFieldRow
        ><br />

        <AlgoTable
            v-if="model.type && !['variable', 'circle', 'shape', 'line'].includes(model.type.key)"
            :sceneObject="model"
            label="Właściwości"
            :headers="['Rodzaj', 'Przypisana zmienna', 'Konwerter', 'Kolor']"
            :emptyRow="{ name: '', type: null, variable: null, converter: null }"
        ></AlgoTable>

        <template #buttons>
            <AlgoButton class="ok" @click="save">Zapisz</AlgoButton>
        </template>
    </AlgoModal>
</template>

<script>
import AlgoModal from "@/components/global/AlgoModal.vue";
import AlgoTable from "@/components/global/AlgoTable.vue";
import AlgoLink from "@/components/global/AlgoLink.vue";
import AlgoButton from "@/components/global/AlgoButton.vue";
import AlgoFieldRow from "@/components/global/AlgoFieldRow.vue";
import PickVariableModal from "@/components/modals/code/PickVariableModal.vue";
import SelectSceneObjectTypeModal from "@/components/modals/type/SelectSceneObjectTypeModal.vue";
import SelectConverterModal from "@/components/modals/converter/SelectConverterModal.vue";
import { mapActions, mapState } from "vuex";
import { closeModal, pushModal } from "jenesius-vue-modal";

export default {
    components: { AlgoModal, AlgoTable, AlgoLink, AlgoFieldRow, AlgoButton },
    props: ["sceneObject"],

    data() {
        return {
            model: {
                type: null,
                variable: null,
                converter: null,
                subobjects: [],
            },
        };
    },

    mounted() {
        if (this.$props.sceneObject) {
            this.model = { ...this.$props.sceneObject };
        }
    },

    methods: {
        ...mapActions("project", ["saveSceneObject"]),

        save() {
            this.saveSceneObject(this.model);
            closeModal();
        },

        selectType() {
            pushModal(SelectSceneObjectTypeModal, {
                callback: (selectedType) => {
                    this.model.type = selectedType;
                    this.model.converter = null;
                    this.model.subobjects = [];
                },
            });
        },

        selectVariable() {
            pushModal(PickVariableModal, {
                callback: (selectedVariable) => {
                    this.model.variable = selectedVariable;
                },
            });
        },

        selectConverter() {
            pushModal(SelectConverterModal, {
                callback: (selectedConverter) => {
                    this.model.converter = selectedConverter;
                },
            });
        },
    },

    computed: {
        ...mapState(["project"]),

        isNewSceneObject() {
            return this.model.index == null;
        },

        modalTitle() {
            return this.isNewSceneObject ? "Dodaj nowy obiekt" : "Konfiguruj obiekt";
        },

        typeLabel() {
            return this.model.type ? this.model.type.label : null;
        },

        variableName() {
            return this.model.variable ? this.model.variable.name : null;
        },

        converterTitle() {
            return this.model.converter ? this.model.converter.title : null;
        },
    },
};
</script>

<style scoped>
.dialog {
    width: 80vw;
}
</style>
