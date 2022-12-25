<template>
    <AlgoModal :title="modalTitle">
        <v-combobox
            label="Rodzaj obiektu"
            :model-value="typeLabel"
            :items="sceneObjectTypesForComboBox"
            @update:modelValue="changeSelectedObject"
        >
        </v-combobox>

        <span @click="selectVariable">
            <v-combobox label="Przypisana zmienna" :model-value="variableName" />
        </span>

        <span @click="selectConverter">
            <v-combobox label="Konwerter" :model-value="converterTitle" />
        </span>

        <AlgoTable
            v-if="model.type && !['variable', 'circle', 'shape', 'line'].includes(model.type.key)"
            :sceneObject="model"
            label="Właściwości"
            :headers="['Rodzaj', 'Przypisana zmienna', 'Konwerter', 'Kolor']"
            :emptyRow="{ name: '', type: null, variable: null, converter: null }"
        ></AlgoTable>

        <template #buttons>
            <AlgoButton type="ok" @click="save">Zapisz</AlgoButton>
        </template>
    </AlgoModal>
</template>

<script>
import AlgoModal from "@/components/global/AlgoModal.vue";
import AlgoTable from "@/components/global/AlgoTable.vue";
import AlgoButton from "@/components/global/AlgoButton.vue";
import PickVariableModal from "@/components/modals/code/PickVariableModal.vue";
import SelectSceneObjectTypeModal from "@/components/modals/type/SelectSceneObjectTypeModal.vue";
import SelectConverterModal from "@/components/modals/converter/SelectConverterModal.vue";
import { mapActions, mapState } from "vuex";
import { closeModal, pushModal } from "jenesius-vue-modal";
import { validateSceneObject } from "@/javascript/utils/validationUtils";
import { defineComponent } from "vue";

export default defineComponent({
    components: { AlgoModal, AlgoTable, AlgoButton },
    props: ["sceneObject"],

    data() {
        return {
            model: {
                type: null,
                variable: null,
                converter: null,
                subobjects: [],
            },
            sceneObjectTypes: [
                { key: "variable", label: "Zmienna" },
                { key: "graph", label: "Graf" },
                { key: "array", label: "Tablica" },
                { key: "points", label: "Zbiór punktów" },
                { key: "circle", label: "Okrąg" },
                { key: "shape", label: "Wielokąt" },
            ],
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
            if (!validateSceneObject(this.model)) return;

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

        changeSelectedObject(selected) {
            this.model.type = this.sceneObjectTypes.find((e) => e.label === selected);
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

        sceneObjectTypesForComboBox() {
            return this.sceneObjectTypes.map((e) => {
                return e.label;
            });
        },
    },
});
</script>
