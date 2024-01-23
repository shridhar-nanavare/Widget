<template>
  <v-dialog v-model="genEINForm.visible" persistent style="display: flex; justify-content: center; ">
    <v-card v-if="genEINForm.visible" id="genEINForm">
      <v-card-header>
        <v-card-header-text>
          <v-card-title>
          <h3>{{ $t('Reserve EIN') }}</h3>
          <v-spacer />
          <v-btn variant="text" color="blue">
            <v-icon @click="cancel" :title="$t('close')"> mdi-close </v-icon>
          </v-btn>
          </v-card-title>            
        </v-card-header-text>
      </v-card-header>
      <v-divider></v-divider>
      <v-card-text>
        <v-form
          ref="formGenEIN"
          lazy-validation
        >
          <v-select
            v-model="autoNameSeries"
            :items="items"
            :label="$t('Autoname Series')"
            required
            :rules="[v => !!v || 'Autoname Series is required']"
          ></v-select>
          <div class="text-caption">{{ $t('EIN Count') }}</div>
          <v-slider
            v-model="noOfEIN"
            :max="15"
            :min="1"
            :step="1"
            hide-details
            thumb-color="blue"
            track-color="gray"
            thumb-size="15"
            thumb-label
          >
          </v-slider>
        </v-form>
        
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
          <v-btn color="#42a2da" class="mr-4" @click="submit">{{ $t("Generate EIN") }}</v-btn>
          <v-spacer />
          <v-btn color="#e01b3c" class="mr-4" @click="cancel">{{ $t("Cancel") }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style>
#genEINForm {
    width: 350px;
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
        autoNameSeries: "",
        items: [
          '',
          'Designed',
          'NON-Designed',
          'Normalized',
          'Marketing',
        ],
        noOfEIN: "1"
      }
    },

    computed: {
      ...mapState(["genEINForm"]),
    },

    methods: {
      ...mapActions(["resetGenEINForm", "submitGenEINForm"]),
      cancel: function() {
        this.$refs.formGenEIN.reset();
        this.$refs.formGenEIN.resetValidation();
        this.resetGenEINForm();
      },
      submit: async function() {
       const validation = await this.$refs.formGenEIN.validate();
       if(validation.valid){
         this.submitGenEINForm({
           autonameseries: this.autoNameSeries,
           eincount: this.noOfEIN
         });
        }
      }
    }
  }
</script>