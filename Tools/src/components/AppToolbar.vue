<template>
    <div id="ToolbarContainer">
        <div  v-if="showToolbar" id="ToolBar">
            <v-sheet
                max-width="500"
                class="mx-auto"
            >
                 <v-slide-group
                    show-arrows
                    class="slider"
                >
                    <v-slide-group-item >
                        <v-btn icon :disabled="checkLicense('PAU,XEN,UDI,M3K')" variant="text" @click="genEINForm.visible = true">
                            <v-icon size="x-large" color="#3b7391" :title="$t('Generate EIN')">mdi-barcode</v-icon>
                        </v-btn>
                    </v-slide-group-item>
                    <div class="separationBar"></div>
                    <v-slide-group-item>
                        <v-btn icon variant="text" :disabled="selectedRows.length != 1" @click="publishSelectedToBPCS()">
                            <v-icon size="x-large"  color="#3b7391" :title="$t('Publish to BPCS')">mdi-publish</v-icon>
                        </v-btn>
                    </v-slide-group-item>
                    <v-slide-group-item>
                        <v-btn icon :disabled="selectedRows.length == 0" variant="text" @click="setToProductionForSelectedItems()">
                            <img :src="`${widgetBaseURL}/static/images/iconActionGenerateFromPartFamily.png`" :title="$t('Set To Production')"  />
                        </v-btn>
                    </v-slide-group-item>
                    <div class="separationBar"></div>
                    <v-slide-group-item>
                      <v-btn icon variant="text" :disabled="selectedRows.length != 1" @click="displayProperties()">
                        <img :src="`${widgetBaseURL}/static/images/I_CATSSEditorDisplayProperties.png`" :title="$t('Open Properties')"  />
                      </v-btn>
                    </v-slide-group-item>
                    <v-slide-group-item>
                      <v-btn icon :disabled="selectedRows.length == 0" variant="text" @click="removeSelected()">
                        <v-icon size="x-large" color="#3b7391" :title="$t('Remove selected')">mdi-close</v-icon>
                      </v-btn>
                    </v-slide-group-item>
                     <v-slide-group-item >
                        <v-btn icon :disabled="checkLicense('PAU,XEN,UDI,M3K')" variant="text" @click="uploadXslmForm.visible = true">
                            <v-icon size="x-large" color="#3b7391" :title="$t('Import Spreadsheet')">mdi-file-excel</v-icon>
                        </v-btn>
                    </v-slide-group-item>
                   <!-- <div class="separationBar"></div>
                    <v-slide-group-item>
                      <v-btn icon variant="text" @click="openWith()">
                        <v-icon size="x-large" color="#3b7391" :title="$t('Open With')">mdi-open-in-new</v-icon>
                      </v-btn>
                    </v-slide-group-item> -->
                </v-slide-group>
            </v-sheet>
        </div>
        <div style="pointer-events: all">
            <v-icon v-if="showToolbar" large :title="$t('Hide Toolbar')" @click="showToolbar=!showToolbar">mdi-chevron-down</v-icon>
            <v-icon v-if="!showToolbar" large :title="$t('Show Toolbar')" @click="showToolbar=!showToolbar">mdi-chevron-up</v-icon>
        </div>
    </div>
</template>

<style>
#ToolbarContainer {
    position: fixed;
    bottom: 0;
    display: flex;
    justify-content: center;
    width: 100%;
}
#ToolBar {
    background-color: #e2e4e3;
    border-radius: 2px 2px 0 0;
    box-shadow: 0 0 4px rgba(61, 61, 61, 0.5);
    border-top: 1px solid #b4b6ba;
    border-left: 1px solid #b4b6ba;
    border-right: 1px solid #b4b6ba;
}
.slider {
    background-color: #e2e4e3;
}
.separationBar {
    display: inline-block;
    background-color: #bdbdbd;
    width: 2px;
    height: 30px;
    margin-left: 10px;
    margin-right: 10px;
    margin-top: 10px;
    border-right: 1px solid white;
}

.v-btn:disabled {
  opacity: 0.5;
}
</style>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
export default {
    data: function() {
      return {
        showToolbar: true,
      }
    },
    computed: {
      ...mapState(["widgetBaseURL", "genEINForm", "dashTable", "assignedLicenses", "confirmDialog","uploadXslmForm"]),
      selectedRows: function() {
        const selectedItems = [];
          for (const row of this.dashTable.rows) {
              if (row.selected) selectedItems.push(row);
          }
          return selectedItems;
      },
      checkLicense() {
        return (lic) => {
          console.log(">>> lic : "+lic);
          const licenses = lic.split(",");
          let licAssigned = false;
          if(licenses) {
            licenses.forEach(license => {
              if(this.assignedLicenses.indexOf(license) != -1) {
                licAssigned = true;
              }
            });
          }
          return !licAssigned;
          };
      }
    },
    methods: {
      ...mapActions(["displayAlert", "setToProduction", "removeSelectedFromTable", "publishToBPCS", "showHideConfirm"]),
      displayProperties() {
        let selectedData = {};
        const securityContextPref = widget.getPreference("__platformSecurityContext");
            if (this.selectedRows.length === 1) {
                const item = this.selectedRows[0];
                selectedData = {
                    SelectedItem: [
                        {
                            metatype: "businessobject",
                            objectId: item.physicalid,
                            tenant: "OnPremise",
                            source: "3DSpace"
                        }
                    ],
                    x3dPlatformId: "OnPremise",
                    isTransient: "true",
                    loadData: true,
                    asynchronousRequest: true,
                    securityContext: securityContextPref.value
                };
                window.PlatformAPI.publish("ShowWidget", {
                    appId: "ENOLCMT_AP",
                    title: "",
                    data: selectedData,
                    options: { mode: "panel" }
                });
            } else if (this.selectedRows.length > 1) {
              this.displayAlert({type:"error", text: "Cannot load properties for multiple objects, select only one!", active: true});
            } else {
                selectedData = {
                    SelectedItem: [],
                    x3dPlatformId: "OnPremise",
                    isTransient: "true",
                    loadData: true,
                    asynchronousRequest: true,
                    securityContext: securityContextPref.value
                };
                window.PlatformAPI.publish("ShowWidget", {
                    appId: "ENOLCMT_AP",
                    title: "",
                    data: selectedData,
                    options: { mode: "panel" }
                });
            }
      },
      removeSelected() {
        if(this.selectedRows.length > 0) {
          const rowSelected = [];
          this.selectedRows.forEach(row => {
            rowSelected.push(row.physicalid);
          });

          if(rowSelected.length > 0) {
            console.log("rowSelected  "+rowSelected);
            this.removeSelectedFromTable(rowSelected);
          }
        }
      },
      openWith() {
      },
      setToProductionForSelectedItems() {
        if(this.selectedRows.length > 0) {
        const rowSelected = [];
        this.selectedRows.forEach(row => {
            rowSelected.push(row.physicalid);
        });
        let self = this;
        this.showHideConfirm({
          visible: true,
          header: "Confirm",
          message: "You are about to switch the part to the Production Phase.You can not go back to previous phase",
          buttons: {
              yes: "Proceed",
              no: "Cancel"
          },
          callback: function() {
            if(self.confirmDialog.isconfirmed) {
              if(rowSelected.length > 0) {
                self.setToProduction(rowSelected);
              }
            }
          }
        });
        }
      },
      publishSelectedToBPCS() {
        let self = this;
        this.showHideConfirm({
          visible: true,
          header: "Confirm",
          message: "Publish To BPCS Confirmation Message",
          buttons: {
              yes: "Proceed",
              no: "Cancel"
          },
          callback: function() {
            if(self.confirmDialog.isconfirmed) {
              if(self.selectedRows.length == 1) {
                self.publishToBPCS(self.selectedRows[0]);
              }
            }
          }
        });
      }
    }
}
</script>