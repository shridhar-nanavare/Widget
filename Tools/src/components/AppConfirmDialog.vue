<template>
  <v-dialog v-model="confirmDialog.visible" persistent style="display: flex; justify-content: center; ">
    <v-card v-if="confirmDialog.visible" id="confirmDialog">
      <v-card-header>
        <v-card-header-text>
          <v-card-title>
              <v-spacer />
              <h4>{{ $t(confirmDialog.header) }}</h4>
              <v-spacer />
          </v-card-title>            
        </v-card-header-text>
      </v-card-header>
      <v-divider></v-divider>
      <v-card-text>
          <div class="text-caption">{{ $t(confirmDialog.message) }}</div>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
          <v-btn color="#42a2da" class="mr-4" @click="submit">{{ $t(confirmDialog.buttons.yes) }}</v-btn>
          <v-spacer />
          <v-btn color="#e01b3c" class="mr-4" @click="cancel">{{ $t(confirmDialog.buttons.no) }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style>
#confirmDialog {
    max-width: 350px;
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
      }
    },

    computed: {
      ...mapState(["confirmDialog"]),
    },

    methods: {
      ...mapActions(["showHideConfirm"]),
      cancel: function() {
          this.showHideConfirm({isconfirmed: false, visible: false});
      },
      submit: function() {
          this.showHideConfirm({isconfirmed: true, visible: false});
          if(this.confirmDialog.callback) {
              this.confirmDialog.callback();
          }
          this.showHideConfirm({isconfirmed: false, visible: false});
      }
    }
  }
</script>