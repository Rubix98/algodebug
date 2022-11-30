<template>
    <div>
        <h2>{{ label }}</h2>

        <table>
            <thead>
                <th style="text-align: center"><AlgoIcon type="+" @click="addRow" /></th>
                <th v-for="header in headers" :key="header">{{ header }}</th>
            </thead>
            <tbody>
                <tr v-for="(row, index) in model" :key="index">
                    <td style="text-align: center">
                        <AlgoIcon type="x" @click="removeRow(index)" />
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

                <tr v-if="!model || model.length === 0">
                    <td colspan="999" class="no-data-row">Brak danych</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import AlgoLink from "@/components/global/AlgoLink.vue";
import AlgoIcon from "@/components/global/AlgoIcon.vue";
import PickVariableModal from "@/components/modals/code/PickVariableModal.vue";
import SelectPropertyTypeModal from "@/components/modals/type/SelectPropertyTypeModal.vue";
import SelectConverterModal from "@/components/modals/converter/SelectConverterModal.vue";
import { pushModal } from "jenesius-vue-modal";

export default {
    props: ["sceneObject", "label", "headers", "emptyRow"],
    components: { AlgoLink, AlgoIcon },

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

<style>
table {
    width: 100%;
    text-align: left;
    border-collapse: collapse;
}

table,
td,
th {
    border: 1px solid black;
}

tr:nth-child(even) {
    background-color: white;
}

tr:nth-child(odd) {
    background-color: aliceblue;
}

.no-data-row {
    color: silver;
    text-align: center;
}
</style>
