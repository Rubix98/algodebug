<template>
  <div>
    <h2>{{label}}</h2> 

    <table>
      <thead>
        <th style="text-align: center"><AlgoIcon type="+" @click="addRow" /></th>
        <th v-for="header in headers" :key="header">{{header}}</th>
      </thead>
      <tbody>

        <tr v-for="(row, index) in data" :key="index">
          <td style="text-align: center">
            <AlgoIcon type="x" @click="removeRow(index)" />
          </td>

          <td>
            <AlgoLink :value="typeLabel(row)" @click="selectType(row)"></AlgoLink>
          </td>

          <td>
            <AlgoLink :value="variableName(row)" @click="selectVariable(row)"></AlgoLink>
          </td>

          <td >
            <AlgoLink :value="converterTitle(row)" @click="selectConverter(row)"></AlgoLink>
          </td>

          <td>
            <input type="color" v-model="row.color" />
          </td>
        </tr>

        <tr v-if="!data || data.length === 0">
          <td colspan="999" class="no-data-row">Brak danych</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import AlgoLink from './AlgoLink.vue';
import AlgoIcon from './AlgoIcon.vue';
export default {
    props: ["value", "type", "label", "headers", "emptyRow", "codeData"],
    components: {AlgoLink, AlgoIcon },

    data() {
      return {
        data: ''
      }
    },

    mounted() {
      this.data = this.$props.value;
    },

    methods: {
      addRow() {
        this.data.push({...this.$props.emptyRow});
      },

      removeRow(index) {
        this.data.splice(index, 1);
      },

      selectType(row) {
        this.$root.pushDialog("SelectSubobjectTypeModal", {type: this.$props.type}, (selectedType) => {
          row.type = selectedType;
        });
      },

      selectVariable(row) {
        this.$root.pushDialog("PickVariableModal", this.$props.codeData, (selectedVariable) => {
          row.variable = selectedVariable;
        });
      },

      selectConverter(row) {
        this.$root.pushDialog("SelectConverterModal", {...this.$props.codeData, type: row.type}, (selectedConverter) => {
          row.converter = selectedConverter;
        });
      }
    },

    computed: {
      typeLabel() {
        return (row) => {
          return row.type ? row.type.label : null;
        }
      },

      variableName() {
        return (row) => {
          return row.variable ? row.variable.name : null;
        }
      },

      converterTitle() {
        return (row) => {
          return row.converter ? row.converter.title : null;
        }
      }
    },

    watch: {
      data() {
        this.$emit('update:value', this.data);
      }
    }
}
</script>

<style>
  table {
    width: 100%;
    text-align: left;
    border-collapse: collapse;
  }

  table, td, th {
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
    text-align: center
  }
  
</style>
