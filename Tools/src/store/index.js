import { createStore } from 'vuex'
import { initPlatformConnectors, get3DSpaceServiceUrl } from "platform-connectors";
import { x3DDashboardUtils } from "../lib/widget";
import { call3DSpaceWithTraces } from "../lib/atlasUtils"

const widgetURL = x3DDashboardUtils.isWidget() ? widget.getUrl() : document.location.href;

const dashTableColumn = require("./config/dashboard-table.json");

const getSortOrder = function(key) {    
    return function(a, b) {    
        if (a[key] > b[key]) {    
            return 1;    
        } else if (a[key] < b[key]) {    
            return -1;    
        }    
        return 0;    
    }
} 

const store = createStore({
    state: {
        widgetBaseURL: widgetURL.substring(0, widgetURL.lastIndexOf("/")),
        url3DSpace: undefined,
        inProgress: false,
        dashTable: {
            columnNames: dashTableColumn.columns.sort(getSortOrder("order")),
            rows: []
        },
        assignedLicenses:[],
        selectAll: false,
        navlist: {
            dashboard: true,
            autoname: false,
            bpcs:false,
            settoproduction:false
        },
        alert: {
            active: false,
            type: "info",
            text: ""
        },
        alerts: [],
        genEINForm: {
            visible: false,
            valid: false
        },
        uploadXslmForm: {
            visible: false,
            valid: false
        },
        fileInfos: [],
        confirmDialog: {
            visible: false,
            header: "Confirm",
            message: "Do Proceed?",
            buttons: {
                yes: "Proceed",
                no: "Cancel"
            },
            isconfirmed: false,
            callback: null
        },
        reservedEIN: {
            designed: {
                used: [],
                unused: []
            },
            nondesigned: {
                used: [],
                unused: []
            },
            normalized: {
                used: [],
                unused: []
            },
            marketing: {
                used: [],
                unused: []
            }
        }
    },
    getters: {
        getTableDataById: state => physicalid => state.dashTable.rows.find(row => physicalid === row.physicalid),
        getTableDataIndexByID: state => physicalid => state.dashTable.rows.findIndex(row => physicalid === row.physicalid),
    },
    mutations: {
        resetGenEINForm: function(state, genForm) { state.genEINForm = genForm; },
        resetUploadFileForm: function(state, fileForm) { state.uploadXslmForm = fileForm; },
        setInProgress: function(state, progress) { state.inProgress = progress; },
        setUrl3DSpace: function(state, url) { state.url3DSpace = url; },
        addUpdateEIN: function(state, ein) { state.reservedEIN = ein; },
        addUpdateDashTable: function(state, rows) { state.dashTable.rows = rows; },
        showHideAlert: function(state, notif) { 
            /*state.alert = notif;
            setTimeout(()=>{
                state.alert = { active: false, type: "info", text: "" };
            },5000);*/

            const idx = state.alerts.push(notif);
            /*setTimeout(()=>{
                state.alerts.pop(idx);
            },10000);*/
        },
        removeEIN: function(state, ein){
            for (var key in state.reservedEIN) {
                const aEIN = state.reservedEIN[key].used;
                if(aEIN) {
                    const atemp = aEIN.filter(function(value){ 
                        return ein != value; 
                    });
                    state.reservedEIN[key].used = atemp;
                }
            }
            const localStorage = window.getAppPreferenceData();
            if(localStorage) {
                localStorage["ein"] = state.reservedEIN;
                window.updateAppPreferenceData(localStorage);
            }
        },
        updateReservedEIN: function(state, autonames) {
            // autonames = {addFor: "designed", values: [name1, name2...]}
            const aUnusedEIN = state.reservedEIN[autonames.addFor].unused;
            if(aUnusedEIN){
                let arr = [...aUnusedEIN, ...autonames.values];
                state.reservedEIN[autonames.addFor].unused = arr;
            } else {
                state.reservedEIN[autonames.addFor].unused = autonames.values;
            }
            const localStorage = window.getAppPreferenceData();
            if(localStorage) {
                localStorage["ein"] = state.reservedEIN;
                window.updateAppPreferenceData(localStorage);
            }
        },
        updateEINStatus: function(state, einToUpdate){
            const aUnusedEIN = state.reservedEIN[einToUpdate.nameseries].unused;
            if(aUnusedEIN) {
                const atemp = aUnusedEIN.filter(function(value){ 
                    return einToUpdate.name != value; 
                });
                state.reservedEIN[einToUpdate.nameseries].unused = atemp;
                state.reservedEIN[einToUpdate.nameseries].used.push(einToUpdate.name);
            }
            const localStorage = window.getAppPreferenceData();
            if(localStorage) {
                localStorage["ein"] = state.reservedEIN;
                window.updateAppPreferenceData(localStorage);
            }
        },
        updateTablewithNewItem: function(state, item) {
            if(item) {
                item.forEach(itemData => {
                    console.log(itemData);
                    const existingRow = store.getters.getTableDataById(itemData.physicalid);
                    if(existingRow) {
                        console.log(">>> Already available in dashboard hence updating....");
                        state.dashTable.rows.splice(store.getters.getTableDataIndexByID(itemData.physicalid), 1, itemData);
                    } else {
                        console.log("New Item.. Pushing into dashboard.....");
                        state.dashTable.rows.push(itemData);
                    }
                });
                const localStorage = window.getAppPreferenceData();
                if(localStorage) {
                    localStorage["dashTableItems"] = state.dashTable.rows;
                    window.updateAppPreferenceData(localStorage);
                }
            }
            
        },
        updateLicenseList: function(state, licenses){   
                state.assignedLicenses = licenses;
        },
        updateFileList: function(state, files){   
            state.fileInfos = files;
            console.log(state.fileInfos);
        },
        gotoNavigator: function(state, goto) { 
            for (var key in state.navlist) {
                state.navlist[key] = false;
            }
            state.navlist[goto] = true;
        },
        removeRowFromTable : function(state, rowsSelected) {
            if(rowsSelected) {
                rowsSelected.forEach(selectId => {
                        const currentRows = state.dashTable.rows;
                        if(currentRows) {
                            currentRows.filter(row => row.physicalid === selectId).forEach(row => currentRows.splice(currentRows.indexOf(row), 1));
                        }
                        state.dashTable.rows = currentRows;
                    });
                    const localStorage = window.getAppPreferenceData();
                    if(localStorage) {
                        localStorage["dashTableItems"] = state.dashTable.rows;
                        window.updateAppPreferenceData(localStorage);
                    }
            }
        },
        showHideConfirm: function(state, confirmationDialog) {
            if(confirmationDialog) {
                if(confirmationDialog.visible) {
                    state.confirmDialog.visible = confirmationDialog.visible;
                    if(confirmationDialog.header) {
                        state.confirmDialog.header = confirmationDialog.header;
                    }
                    if(confirmationDialog.message) {
                        state.confirmDialog.message = confirmationDialog.message;
                    }
                    if(confirmationDialog.buttons) {
                        if(confirmationDialog.buttons.yes) {
                            state.confirmDialog.buttons.yes = confirmationDialog.buttons.yes;
                        } else {
                            state.confirmDialog.buttons.yes = "Proceed";
                        }
                        if(confirmationDialog.buttons.no) {
                            state.confirmDialog.buttons.no = confirmationDialog.buttons.no;
                        } else {
                            state.confirmDialog.buttons.no = "Cancel";
                        }
                    } else {
                        state.confirmDialog.buttons.yes = "Proceed";
                        state.confirmDialog.buttons.no = "Cancel";
                    }
                } else {
                    state.confirmDialog.visible = false;
                    state.confirmDialog.header = confirmationDialog.header;
                    state.confirmDialog.header =  "Confirm";
                    state.confirmDialog.message = "Do Proceed?";
                    state.confirmDialog.buttons.yes = "Proceed";
                    state.confirmDialog.buttons.no = "Cancel";
                }
                
                if(confirmationDialog.isconfirmed) {
                    state.confirmDialog.isconfirmed = confirmationDialog.isconfirmed;
                    return;
                } else {
                    state.confirmDialog.isconfirmed = false;
                }

                if(confirmationDialog.callback) {
                    state.confirmDialog.callback = confirmationDialog.callback;
                } else {
                    state.confirmDialog.callback = null;
                }
            }
        }
    },
    actions: {
        init: function(context) {
            context.commit("setInProgress", true);
            // initialize platform specific data
            try {
                initPlatformConnectors({
                    allowTenantsSelection: true,
                    allowSecurityContextSelection: true, 
                    allowedServicesInUntrustedMode: ["3DSpace"],
                    allowManualTenantConfigInUntrustedMode: true
                });

                get3DSpaceServiceUrl().then(baseUrl => {
                    context.commit("setUrl3DSpace", baseUrl);
                });
            } catch (error) {
                console.log("EPI Caught exception when initializing platform connectors : platform connectors are probably already initialized");
            }
            context.dispatch("prepareDashboard");
            context.dispatch("loadUserLicenses");
            context.dispatch("getFile");
            context.commit("setInProgress", false);
        },
        prepareDashboard: async function(context) {
            context.commit("setInProgress", true);
            const localStorage = window.getAppPreferenceData();
            if(localStorage) {
                // For Reserved Ein Board
                const localEIN = localStorage.ein;
                if(!localEIN) {
                    localStorage["ein"] = context.state.reservedEIN;
                    window.updateAppPreferenceData(localStorage);
                } else {
                    context.commit("addUpdateEIN", localEIN);
                }

                // For Dashboard Table
                const dashItems = localStorage.dashTableItems;
                if(!dashItems || dashItems.length == 0) {
                    localStorage["dashTableItems"] = context.state.dashTable.rows;
                    window.updateAppPreferenceData(localStorage);
                } else {
                    context.commit("addUpdateDashTable", dashItems);
                }
            }
            //context.dispatch("resetAndGoto", "dashboard");
            context.commit("setInProgress", false);
        },
        loadUserLicenses : async function(context){
            context.commit("setInProgress", true);
            // restcall to get license
            const response = await call3DSpaceWithTraces(`/resources/atlas/licenses/getuserlicenses`);
            if(response) {
                if(response.status === "OK") {
                    const arrLicenses = response.result;
                    context.commit("updateLicenseList", arrLicenses);
                } else {
                    context.dispatch("displayAlert", {type:"error", text: response.errormsg, active: true});
                }
            }
            context.commit("setInProgress", false);
        },
        resetAndGoto: function(context, goto){
            context.commit("gotoNavigator", goto);
            if(goto === "bpcs") context.dispatch("displayAlert", {type:"info", text: "BPCS Under Development", active: true});
        },
        displayAlert: function(context, notification) {
            context.commit("showHideAlert", notification);
        },
        removeReservedEIN: function(context, einToRemove){
            context.commit("removeEIN", einToRemove);
        },
        updateEINStatus: function(context, einToUpdate) {
            context.commit("updateEINStatus", einToUpdate);
        },
        resetGenEINForm: function(context) {
            context.commit("resetGenEINForm", {
                visible: false,
                valid: false
            });
        },
        submitGenEINForm: async function(context, payload) {
            console.log("in submit form..");
            console.log(payload);
            context.dispatch("resetGenEINForm");
            context.commit("setInProgress", true);
            // restcall to get the 10 number
            const response = await call3DSpaceWithTraces(`/resources/atlas/autoname/getautonumber?series=${payload.autonameseries}&count=${payload.eincount}`);
            // mock - OK case
           // const response = {"status":"OK", "result": ["mock001","mock002","mock003"], "errormsg": ""};
             // mock - KO case
             //const response = {"status":"KO", "result": "[]", "errormsg": "Failed due to xxxx reason..."};
            if(response) {
                if(response.status === "OK") {
                    const names = response.result;
                    const key = payload.autonameseries === "Designed" ? "designed" 
                            : payload.autonameseries === "NON-Designed" ? "nondesigned"
                            : payload.autonameseries === "Normalized" ? "normalized" : "marketing";
                    // update widget pref with 10 number
                    context.commit("updateReservedEIN", {addFor: key, values: names});
                } else {
                    context.dispatch("displayAlert", {type:"error", text: response.errormsg, active: true});
                }
            }
            // switch to dasboard ==> display numbers
            context.commit("gotoNavigator", "dashboard");
            context.commit("setInProgress", false);
        },
        resetUploadFileForm: function(context) {
            context.commit("resetUploadFileForm", {
                visible: false,
                valid: false
            });
        },
        submitUploadFileForm: async function(context, i) {
            console.log("in submit form..");
            context.dispatch("resetUploadFileForm");
            context.commit("setInProgress", true);
            let formData = new FormData;
            formData.append("file", i.target.files[0]);
            // restcall to upload file
            var option={method: "POST",data:formData,type:"file"};
            const responsejson = await call3DSpaceWithTraces(`/resources/atlas/import/importfromspreadsheet`,option);
           //const data = '{"status": "failure","errormessages": [{"errormessage": "Col1 Not valid" },{"errormessage": "Col2 Not valid"}]}';
            var successMessage="";
            var errorMessage="";
            const response=JSON.parse(responsejson)
            console.log(response.status);
           if(response) {
                if(response.status !== "success") {
                    const errorMsgs =response.errormessages;
                    console.log(errorMsgs);
                    if(errorMsgs.length > 0)
                    {
                        errorMsgs.forEach(msg => {
                            errorMessage=errorMessage+`</br><hr style="height:1px;border-width:0;color:gray;background-color:gray">${msg.errormessage}`;
                        });
                        context.dispatch("displayAlert", {type:"error", text: errorMessage, active: true});
                    } 
                } else {
                    context.dispatch("displayAlert", {type:"success", text: "File uploaded successfully.</br>Import process has been started and you will be notified by email about its status", active: true});
                    }
            } 
            
            //context.dispatch("displayAlert", {type:"success", text: "File uploaded successfully", active: true});
           
            // switch to dasboard ==> display numbers
            context.commit("gotoNavigator", "dashboard");
            context.commit("setInProgress", false);
            
        },
        getFile: async function(context) {
            console.log("Log url :: "+ this.state.widgetBaseURL);
            const url = this.state.widgetBaseURL +"/Create from Spreadsheet Template.xlsm";
            context.commit("updateFileList",{name:"Create from Spreadsheet Template.xlsm",url:url});
            
        },
        addOrReplaceItem: async function(context, item) {
            console.log(item);
            context.commit("setInProgress", true);
            // restcall to get item details
            const response = await call3DSpaceWithTraces(`/resources/atlas/physicalproduct/getinfo?oid=${item.objectId}`);
            if(response) {
                if(response.status === "OK") {
                    const itemInfo = response.result;
                    // update widget pref with new item
                    context.commit("updateTablewithNewItem", itemInfo);
                } else {
                    context.dispatch("displayAlert", {type:"error", text: response.errormsg, active: true});
                }
            }
            // switch to settoproduction view
            context.commit("gotoNavigator", "settoproduction");
            context.commit("setInProgress", false);
        },
        removeSelectedFromTable: function(context, rowsSelected) {
            context.commit("removeRowFromTable", rowsSelected);
        },
        setToProduction: async function(context, rowsSelected) {
            context.commit("setInProgress", true);
            var option={method: "POST"};
           // const selectoids = "4130.20021.35264.13451,4130.20021.35359.18461";
            const selectoids = rowsSelected.toString();
            const response = await call3DSpaceWithTraces(`/resources/atlas/physicalproduct/setproduction/updatereleasephase?selectoids=${selectoids}`, option);  
            if(response) {
                var successMessage="";
                var errorMessage="";
                response.forEach(resultArray => {
                        const rowData = store.state.dashTable.rows.find(row => row.physicalid === resultArray.result);
                        const strJson = JSON.stringify(rowData);
                        let objectDataArray=JSON.parse(strJson);
                        let ObjTitle=objectDataArray["PLMEntity.V_Name"];
                        if(resultArray.status==="OK"){
                            var item={objectId: resultArray.result};
                            context.dispatch("addOrReplaceItem", item);
                            if(successMessage === "") {
                                successMessage=`${ObjTitle} Object successfully update!`;
                            } else {
                                successMessage=successMessage+`</br>${ObjTitle} Object successfully update!`;
                            }
                         } else {
                            if(errorMessage === "") {
                                errorMessage=`${ObjTitle} :: ${resultArray.errormsg}`;
                            } else {
                                errorMessage=errorMessage+`</br>${ObjTitle} :: ${resultArray.errormsg}`;
                            }
                        }
                        //Show message
                });
                if(errorMessage){
                    context.dispatch("displayAlert", {type:"error", text: errorMessage, active: true});
                }
                if(successMessage){
                   context.dispatch("displayAlert", {type:"success", text: successMessage, active: true});
                }
            }
            context.commit("setInProgress", false);
        },
        publishToBPCS: async function(context, itemSelected) {
            console.log(itemSelected);
            context.commit("setInProgress", true);
            var option={method: "POST"};
            const response = await call3DSpaceWithTraces(`/resources/atlas/physicalproduct/publishotbpcs?oid=${itemSelected.physicalid}`, option);
            if (response) {
                let msgType = "error";
                let mesage = "";
                if(response.status === "OK") {
                    msgType = "success";
                }

                if(response.result) {
                    mesage = response.result;
                } else {
                    mesage = response.errormsg;
                }
                    
                context.dispatch("displayAlert", {type: msgType, text: mesage, active: true});
            }
            context.commit("setInProgress", false);
        },
        showHideConfirm: function(context, confirmationDialog) {
            context.commit("showHideConfirm", confirmationDialog);
        },
    }
});

export default store;