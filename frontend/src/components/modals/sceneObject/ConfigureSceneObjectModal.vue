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
            <v-combobox label="Przypisane zmienne" :model-value="variableName" @keypress.prevent />
        </span>

        <span @click="selectConverter">
            <v-combobox label="Konwerter" :model-value="converterTitle" @keypress.prevent />
        </span>

        <AlgoTable
            v-if="hasSubtypes(model.type)"
            :sceneObject="model"
            label="Właściwości"
            :headers="['Rodzaj', 'Przypisane zmienne', 'Konwerter', 'Kolor']"
            :emptyRow="emptyRow"
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
    import UnsavedChangesModal from "@/components/modals/other/UnsavedChangesModal.vue";
    import { cloneDeep } from "lodash";
    import { closeModal, pushModal, promptModal } from "jenesius-vue-modal";
    import { validateSceneObject } from "@/javascript/utils/validationUtils";
    import { defineComponent } from "vue";
    import {
        getSceneObjectTypeLabel,
        getSceneObjectTypes,
        hasSubtypes,
    } from "@/javascript/utils/sceneObjectTypesUtils";
    import { useProjectStore } from "@/stores/project";
    import { mapActions } from "pinia";

    export default defineComponent({
        components: { AlgoModal, AlgoTable },
        props: ["sceneObject", "variable"],

        data() {
            return {
                model: {
                    type: null,
                    variables: [],
                    converter: null,
                    subobjects: [],
                },

                modelBeforeChanges: "",

                swatchColors: [['#FF0000', '#00FF00'], ['#0000FF', '#FFFF00'], ['#00FFFF', '#FF00FF']],

                presetColors: ['#FF0000', '#FF8000', '#FFFF00', '#80FF00', '#00FF00', '#008000', '#0080FF', '#0000FF', '#8000FF', '#FF00FF', '#FF0080', '#FF80FF', '#FF8000', '#FF0080', '#FF80FF', '#FF8000', '#8000FF', '#0080FF', '#FF0080', '#80FF00', '#008000', '#0080FF', '#0000FF', '#8000FF', '#FF00FF', '#FF0080', '#FF80FF', '#FF8000', '#8000FF', '#0080FF'],

                currentColorIndex: 0,
            };
        },

        mounted() {
            if (this.$props.sceneObject) {
                this.model = cloneDeep(this.$props.sceneObject);
            }

            if (this.$props.variable) {
                this.model.variables = [this.$props.variable];
            }

            this.modelBeforeChanges = JSON.stringify(this.model);
        },

        methods: {
            ...mapActions(useProjectStore, ["addSceneObject"]),

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
                        let index = this.model.variables.findIndex((variable) => variable.id === selectedVariable.id);
                        if (index == -1) this.model.variables.push(selectedVariable);
                        else this.model.variables.splice(index, 1);
                    },
                    sceneObject: this.model,
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
                return this.model.variables.map((v) => v.name).join(", ");
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

            nextColor() {
                let index = this.model.subobjects.length % this.presetColors.length;
            
                return this.presetColors[index];
            },

            emptyRow() {
                return {
                    type: null,
                    variables: [],
                    converter: null,
                    color: this.nextColor
                };
            },

            hasSubtypes() {
                return (key) => hasSubtypes(key);
            },
        },

        async beforeModalClose(e) {
            if (e.background && JSON.stringify(this.model) != this.modelBeforeChanges) {
                const shouldClose = await promptModal(UnsavedChangesModal);
                return shouldClose;
            }
        },
    });
</script>
