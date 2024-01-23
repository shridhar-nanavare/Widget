<template>
    <v-table style="width:100%">
        <thead style="bgcolor:grey;">
            <tr>
                <th style="width:10px;">
                    <v-checkbox v-model="selectAll" hide-details />
                </th>
                <th v-for="column in dashTable.columnNames" :key="column.order">
                    {{ column.displayName }}
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="row in dashTable.rows" :key="row.name">
                 <td>
                    <v-checkbox hide-details v-model="row.selected" @change="rowSelected($event, row)"/>
                </td>
                <td v-for="column in dashTable.columnNames" :key="column.order">
                    {{ row[column.attributeName] }}
                </td>
            </tr>
        </tbody>
    </v-table>
</template>

<style>
th, thead tr th {
    border-right: 1px solid #b3b3b3;
    font-size: 12px !important;
    color: #4e4e4e !important;
}
.v-table > .v-table__wrapper > table > thead > tr > th {
    font-size: 12px !important;
    color: #77797c !important;
    background-color: #f1f1f1;
}
</style>

<script>
import { mapState, mapActions } from "vuex"

export default {
    data: function() {
      return {
      }
    },
    computed: {
        ...mapState(["dashTable", "selectAll"]),
        selectAll: {
            get () {
                return this.$store.state.selectAll;
            },
            set(isSelected) {
                this.$store.state.selectAll = isSelected;
                for (const row of this.dashTable.rows) {
                   row.selected = isSelected;
                }
            }
        }
    },
    methods: {
        ...mapActions([]),
        rowSelected: function(event, row){
            console.log("===>>> row.physicalid : "+row.physicalid+" :selected?==> "+event.target.checked);
            if(event.target.checked) {
                const selectedItem = {
                    widgetId: widget.id,
                    data: {
                        tenant: "OnPremise",
                        version: "1.1",
                        paths: [[row.physicalid]],
                        attributes: {}
                    }
                };
                window.PlatformAPI.publish("DS/PADUtils/PADCommandProxy/select", selectedItem);
            }
        }
    }
}
</script>