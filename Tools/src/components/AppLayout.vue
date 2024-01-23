<template>
    <v-card>
        <v-layout>
            <v-navigation-drawer
                v-model="drawer"
                hide-overlay
            >
                <v-list-item prepend-icon="mdi-tools" :title="$t('Widget Title')"></v-list-item>
                <v-divider></v-divider>
                <v-list density="compact" nav>
                    <v-list-item prepend-icon="mdi-view-dashboard" :title="$t('Reserved EIN')" value="home" active-color="#3b7391" :active="navlist.dashboard" @click="resetSelection('dashboard')"></v-list-item>
                    <v-list-item prepend-icon="mdi-table-large" :title="$t('User Selected Data')" value="tableData" active-color="#3b7391" :active="navlist.settoproduction" @click="resetSelection('settoproduction')"></v-list-item> 
                    <!-- <v-list-item prepend-icon="mdi-publish" :title="$t('Publish to BPCS')" value="publishbpcs" active-color="#3b7391" :active="navlist.bpcs" @click="resetSelection('bpcs')"></v-list-item> -->
                </v-list>
            </v-navigation-drawer>
 
            <v-main>
                <div style="height: 100vh;">
                    <app-drop-zone/>
                    <v-btn elevation="0" dark @click.stop="drawer = !drawer">
                        <v-icon v-if="drawer">mdi-chevron-triple-left</v-icon>
                        <v-icon v-else>mdi-chevron-triple-right</v-icon>
                    </v-btn>
                    <div  class="alert">
                        <v-alert v-for="(alert, index) in alerts" :key="index"
                            v-model="alert.active"
                            closable
                            close-icon="mdi-close"
                            :type="alert.type"
                            density="comfortable"
                            variant="outlined"
                            elevation=3
                        >
                        <v-virtual-scroll
                            :item-height="50"
                            height="300"
                            >
                            <span v-html="alert.text"></span>
                        </v-virtual-scroll>
                        </v-alert>
                    </div>
                    <div>
                        &nbsp;
                    </div>
                    <div>
                        <AppReserveEIN/>
                        <app-dashboard/>
                        <APPConfirmDialog/>
                        <APPUploadFile/>
                        <app-toolbar/>
                    </div>
                </div>
            </v-main>
        </v-layout>
        <div>
            <v-overlay v-model="inProgress" contained class="align-center justify-center" >
               <div class="loading">
                <div class="bar bar-1"></div>
                <div class="bar bar-2"></div>
                <div class="bar bar-3"></div>
                <div class="bar bar-4"></div>
                <div class="bar bar-5"></div>
                <div class="bar bar-6"></div>
                <div class="bar bar-7"></div>
                <div class="bar bar-8"></div>
                <div class="bar bar-9"></div>
                <div class="bar bar-10"></div>
            </div>
            </v-overlay>
        </div>
    </v-card>
</template>

<style>
.alert {
    z-index:100;
    white-space: normal;
    font-size: 12px;
    text-align: left;
    width: 50%;
    float:right;
    top: 5px;
    right:5px;
    max-width: fit-content;
}
.loading {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 95px;
    height: 95px;
}
.bar {
    position: absolute;
    top: 42px;
    width: 95px;
    height: 10px;
    transform: rotate(90deg);
    animation: rotateBar 1s infinite ease-in-out;
}
.bar:before {
    content: '';
    display: block;
    width: 50px;
    height: 10px;
    border-radius: 10px;
    background-color: #005686;
}
.bar-1 {
    animation-delay: .05s;
}
.bar-2 {
    animation-delay: .10s;
}
.bar-3 {
    animation-delay: .15s;
}
.bar-4 {
    animation-delay: .20s;
}
.bar-5 {
    animation-delay: .25s;
}
.bar-6 {
    animation-delay: .30s;
}
.bar-7 {
    animation-delay: .35s;
}
.bar-8 {
    animation-delay: .40s;
}
.bar-9 {
    animation-delay: .45s;
}
.bar-10 {
    animation-delay: .50s;
}
.bar-1:before {
    opacity: .6;
}
.bar-2:before {
    opacity: .55;
}
.bar-3:before {
    opacity: .5;
}
.bar-4:before {
    opacity: .45;
}
.bar-5:before {
    opacity: .4;
}
.bar-6:before {
    opacity: .35;
}
.bar-7:before {
    opacity: .3;
}
.bar-8:before {
    opacity: .25;
}
.bar-9:before {
    opacity: .2;
}
.bar-10:before {
    opacity: .15;
}
@keyframes rotateBar {
    0% {transform: rotate(90deg);}
    60% {transform: rotate(450deg);}
    100% {transform: rotate(450deg);}
}
</style>

<script>
import { mapState, mapActions, mapGetters } from "vuex"
import AppToolbar from "./AppToolbar.vue"
import AppReserveEIN from "./AppReserverEIN.vue"
import AppDashboard from "./AppDashboard.vue"
import AppDropZone from "./AppDropZone.vue"
import APPConfirmDialog from "./AppConfirmDialog.vue"
import APPUploadFile from "./AppUploadFile.vue"

export default {
    components: { AppToolbar, AppReserveEIN, AppDashboard, AppDropZone, APPConfirmDialog ,APPUploadFile},
    data: function() {
      return {
        drawer: null,
        dialog:true
      }
    },
    computed: {
        ...mapState(["widgetBaseURL", "inProgress", "navlist", "alert", "alerts"])
    },
    methods: {
        ...mapActions(["resetAndGoto"]),
        resetSelection: function(item) {
            this.resetAndGoto(item);
        }
    }
}
</script>