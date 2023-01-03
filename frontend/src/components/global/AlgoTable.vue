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
                <tr v-for="row in model" :key="row.id">
                    <td class="algo-table__remove-row text-center">
                        <v-icon class="primary" @click="removeRow(row.id)"> mdi-close</v-icon>
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
    import { getSceneObjectTypeLabel } from "@/javascript/utils/sceneObjectTypesUtils";
    import { pushModal } from "jenesius-vue-modal";
    import { defineComponent } from "vue";

    export default defineComponent({
        components: { AlgoLink },
        props: ["sceneObject", "label", "headers", "emptyRow"],

        data() {
            return {
                model: [],
            };
        },

        mounted() {
            this.model = this.sceneObject.subobjects;
        },

        methods: {
            addRow() {
                this.model.addElement({ ...this.emptyRow });
            },

            removeRow(id) {
                this.model.deleteById(id);
            },

            selectType(row) {
                pushModal(SelectPropertyTypeModal, {
                    sceneObjectType: this.$props.sceneObject.type,
                    callback: (selectedType) => {
                        row.type = selectedType.key;
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
                    return getSceneObjectTypeLabel(row.type);
                };
            },

            variableName() {
                return (row) => {
                    return row.variable?.name;
                };
            },

            converterTitle() {
                return (row) => {
                    return row.converter?.title;
                };
            },
        },
    });
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
