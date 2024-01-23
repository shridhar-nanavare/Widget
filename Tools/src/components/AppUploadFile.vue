<template>
  <v-dialog v-model="uploadXslmForm.visible" persistent style="display: flex; justify-content: center; ">
    <v-card v-if="uploadXslmForm.visible" id="uploadXslmForm">
      <v-card-header>
        <v-card-header-text>
          <v-card-title>
          <h3>{{ $t('UploadSpreadSheet') }}</h3>
          <v-spacer />
          <v-btn variant="text" color="blue">
            <v-icon @click="cancel" :title="$t('close')"> mdi-close </v-icon>
          </v-btn>
          </v-card-title>            
        </v-card-header-text>
      </v-card-header>
      <v-divider></v-divider>
      <v-card-text>
        
     <v-row no-gutters justify="center" align="center">
      <v-col offset="3" cols="11">
              <v-icon size="x-medium" color="#3b7391" :title="$t('Download')">mdi-tray-arrow-down</v-icon>
              <a :href="fileInfos.url" target="_blank"  :download="fileInfos.name">{{$t('Download')}}</a>
      </v-col>
    </v-row>
     
     <v-row class="mt-2" no-gutters justify="center" align="center">
      <v-col cols="11">
        <v-file-input
          dense
          show-size
          accept=".xlsm"
          truncate-length="25"
          label="File input"
          @change="selectFile"
        ></v-file-input>
      </v-col>
    </v-row>
    <v-alert v-if="message" 
      outlined
      type="error">
      {{ message }}
    </v-alert>
     </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
          <v-btn color="#42a2da" class="mr-4" @click="submit">{{ $t("SubmitImport") }}</v-btn>
          <v-spacer />
          <v-btn color="#e01b3c" class="mr-4" @click="cancel">{{ $t("Cancel") }}</v-btn>
      </v-card-actions>
    </v-card>
    
  </v-dialog>
</template>

<style>
#uploadXslmForm {
    width: 500px;
    padding: 15px;
    overflow: auto;
    max-height: fit-content;
}
</style>

<script>
import { mapState, mapActions } from "vuex"


  export default {
    data: function() {
      return {
      currentFile: undefined,
      Name:"",
      message:""
    };
    },

    computed: {
      ...mapState(["uploadXslmForm","fileInfos"]),
    },

    methods: {
      ...mapActions(["resetUploadFileForm", "submitUploadFileForm","displayAlert"]),
      cancel: function() {
        this.resetUploadFileForm();
      },
      selectFile(i) {
      console.log(i);
      console.log(i.target.result);
      this.currentFile = i;
      this.Name=i.target.files[0].name;
      this.message ="";
      },
      submit: async function() {
       if (!this.currentFile) {
          this.message = "Please select a file!";
          //this.displayAlert({type:"error", text: "File not selected!", active: true});
          return;
        }
        this.submitUploadFileForm(this.currentFile);
      }
    }
  }
</script>