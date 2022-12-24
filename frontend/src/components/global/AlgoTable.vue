<template>
    <div class="algo-table">
        <h2>{{ label }}</h2>
        <v-table>
            <thead>
                <tr>
                    <th style="text-align: center" />
                    <th v-for="header in headers" class="text-left" :key="header">{{ header }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(row, index) in model" :key="index">
                    <td class="algo-table__remove-row text-center">
                        <v-icon class="primary" @click="removeRow(index)"> mdi-close</v-icon>
                    </td>

                    <td>
                        <AlgoLink :value="typeLabel(row)" @click="selectType(row)"></AlgoLink>
                    </td>

                    <td>
                        <AlgoLink :value="variableName(row)" @click="selectVariable(row)"></AlgoLink>
                    </td>

                    <td>
                        <AlgoLink :value="converterTitle(row)" @click="selectConverter(row)"></AlgoLink>
                    </td>

                    <td>
                        <input type="color" v-model="row.color" />
                    </td>
                </tr>
            </tbody>
        </v-table>
        <v-btn block @click="addRow" class="algo-table__add-row" prepend-icon="mdi-plus-circle"> Dodaj</v-btn>
    </div>
</template>

<script>
import AlgoLink from "@/components/global/AlgoLink.vue";
import PickVariableModal from "@/components/modals/code/PickVariableModal.vue";
import SelectPropertyTypeModal from "@/components/modals/type/SelectPropertyTypeModal.vue";
import SelectConverterModal from "@/components/modals/converter/SelectConverterModal.vue";
import { pushModal } from "jenesius-vue-modal";

export default {
    props: ["sceneObject", "label", "headers", "emptyRow"],
    components: { AlgoLink },

    data() {
        return {
            model: "",
        };
    },

    mounted() {
        this.model = this.sceneObject.subobjects;
    },

    methods: {
        addRow() {
            this.model.push({ ...this.emptyRow });
        },

        removeRow(index) {
            this.model.splice(index, 1);
        },

        selectType(row) {
            pushModal(SelectPropertyTypeModal, {
                sceneObjectType: this.$props.sceneObject.type,
                callback: (selectedType) => {
                    row.type = selectedType;
                },
            });
        },

        selectVariable(row) {
            pushModal(PickVariableModal, {
                callback: (selectedVariable) => {
                    row.variable = selectedVariable;
                },
            });
        },

        selectConverter(row) {
            pushModal(SelectConverterModal, {
                callback: (selectedConverter) => {
                    row.converter = selectedConverter;
                },
            });
        },
    },

    computed: {
        typeLabel() {
            return (row) => {
                return row.type ? row.type.label : null;
            };
        },

        variableName() {
            return (row) => {
                return row.variable ? row.variable.name : null;
            };
        },

        converterTitle() {
            return (row) => {
                return row.converter ? row.converter.title : null;
            };
        },
    },
};
</script>

<style lang="scss" scoped>
.algo-table {
    &__add-row {
        margin-top: 1rem;
    }

    &__remove-row {
        cursor: pointer;
    }
}
</style>
