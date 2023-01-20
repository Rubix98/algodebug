<template>
    <AlgoModal :title="modalTitle">
        <v-combobox
            label="Rodzaj obiektu"
            :model-value="typeLabel"
            :items="sceneObjectTypesForComboBox"
            @update:modelValue="selectType"
            @keypress.prevent
        >
        </v-combobox>

        <span @click="selectVariable">
            <v-combobox label="Przypisana zmienna" :model-value="variableName" @keypress.prevent />
        </span>

        <span @click="selectConverter">
            <v-combobox label="Konwerter" :model-value="converterTitle" @keypress.prevent />
        </span>

        <AlgoTable
            v-if="hasSubtypes(model.type)"
            :sceneObject="model"
            label="Właściwości"
            :headers="['Rodzaj', 'Przypisana zmienna', 'Konwerter', 'Kolor']"
            :emptyRow="{ type: null, variable: null, converter: null, color: '#000000' }"
        ></AlgoTable>

        <template #buttons>
            <v-btn color="primary" @click="save">Zapisz</v-btn>
        </template>
    </AlgoModal>
</template>

<script>
    import AlgoModal from "@/components/global/AlgoModal.vue";
    import AlgoTable from "@/components/global/AlgoTable.vue";
    import PickVariableModal from "@/components/modals/code/PickVariableModal.vue";
    import SelectConverterModal from "@/components/modals/converter/SelectConverterModal.vue";
    import { cloneDeep } from "lodash";
    import { closeModal, pushModal } from "jenesius-vue-modal";
    import { validateSceneObject } from "@/javascript/utils/validationUtils";
    import { defineComponent } from "vue";
    import {
        getSceneObjectTypeLabel,
        getSceneObjectTypes,
        hasSubtypes,
    } from "@/javascript/utils/sceneObjectTypesUtils";
    import { useProjectStore } from "@/stores/project";

    export default defineComponent({
        components: { AlgoModal, AlgoTable },
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

        setup() {
            const store = useProjectStore();

            const { addSceneObject } = store;

            return { addSceneObject };
        },

        mounted() {
            if (this.$props.sceneObject) {
                this.model = cloneDeep(this.$props.sceneObject);
            }
        },

        methods: {
            save() {
                if (!validateSceneObject(this.model)) return;

                this.addSceneObject(this.model);
                closeModal();
            },

            selectType(selectedType) {
                this.model.type = this.sceneObjectTypes.find((e) => e.label === selectedType).key;
                this.model.converter = null;
                this.model.subobjects = [];
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
            isNewSceneObject() {
                return this.model.index == null;
            },

            modalTitle() {
                return this.isNewSceneObject ? "Dodaj nowy obiekt" : "Konfiguruj obiekt";
            },

            typeLabel() {
                return getSceneObjectTypeLabel(this.model.type);
            },

            variableName() {
                return this.model.variable?.name;
            },

            converterTitle() {
                return this.model.converter?.title;
            },

            sceneObjectTypes() {
                return getSceneObjectTypes(this.$props.sceneObjectType);
            },

            sceneObjectTypesForComboBox() {
                return this.sceneObjectTypes.map((e) => {
                    return e.label;
                });
            },

            hasSubtypes() {
                return (key) => hasSubtypes(key);
            },
        },
    });
</script>
