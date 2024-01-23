<template>
    <div id="dashboards">
        <div v-if="navlist.dashboard" id="einboard">
            <div class="text-subtitle-2 mt-4 mb-2">Reserved EIN</div>
                <v-expansion-panels variant="inset" class="my-4">
                    <v-expansion-panel>
                        <v-expansion-panel-title expand-icon="mdi-plus" collapse-icon="mdi-minus">
                        Designed
                        <v-badge
                            color="error"
                            :content="reservedEIN.designed.unused.length"
                            offset-x="-282"
                        ></v-badge>
                        </v-expansion-panel-title>
                        <v-expansion-panel-text>
                            <v-chip-group column>
                                <v-chip
                                    v-for="item in reservedEIN.designed.used"
                                    :key="item"
                                    closable
                                    color="red"
                                    close-icon="mdi-delete"
                                    @click="copyToClip(item)"
                                    @click:close="close(item)"
                                    size="small"
                                    filter
                                    variant="outlined"
                                >
                                    {{ item }}
                                </v-chip>
                            </v-chip-group>
                        </v-expansion-panel-text>
                        <v-expansion-panel-text>
                            <v-chip-group column>
                                <v-chip
                                    v-for="item in reservedEIN.designed.unused"
                                    :key="item"
                                    color="teal"
                                    @click="copyToClip(item)"
                                    size="small"
                                    filter
                                    filter-icon="mdi-content-copy"
                                    variant="outlined"
                                >
                                    {{ item }}
                                    <v-icon end icon="mdi-flag" title="Flag as used" @click="flagAsUsed(item, 'designed')" color="red"></v-icon>
                                </v-chip>
                            </v-chip-group>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                    <v-expansion-panel>
                        <v-expansion-panel-title expand-icon="mdi-plus" collapse-icon="mdi-minus">
                        Non-Designed
                        <v-badge
                            color="error"
                            :content="reservedEIN.nondesigned.unused.length"
                            offset-x="-249"
                        ></v-badge>
                        </v-expansion-panel-title>
                        <v-expansion-panel-text>
                            <v-chip-group column>
                                <v-chip
                                    v-for="item in reservedEIN.nondesigned.used"
                                    :key="item"
                                    closable
                                    color="red"
                                    close-icon="mdi-delete"
                                    @click="copyToClip(item)"
                                    @click:close="close(item)"
                                    size="small"
                                    filter
                                    variant="outlined"
                                >
                                    {{ item }}
                                </v-chip>
                            </v-chip-group>
                        </v-expansion-panel-text>
                        <v-expansion-panel-text>
                            <v-chip-group column>
                                <v-chip
                                    v-for="item in reservedEIN.nondesigned.unused"
                                    :key="item"
                                    color="teal"
                                    @click="copyToClip(item)"
                                    size="small"
                                    filter
                                    filter-icon="mdi-content-copy"
                                    variant="outlined"
                                >
                                    {{ item }}
                                    <v-icon end icon="mdi-flag" title="Flag as used" @click="flagAsUsed(item, 'nondesigned')" color="red"></v-icon>
                                </v-chip>
                            </v-chip-group>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                    <v-expansion-panel>
                        <v-expansion-panel-title expand-icon="mdi-plus" collapse-icon="mdi-minus">
                        Normalized
                        <v-badge
                            color="error"
                            :content="reservedEIN.normalized.unused.length"
                            offset-x="-268"
                        ></v-badge>
                        </v-expansion-panel-title>
                        <v-expansion-panel-text>
                            <v-chip-group column>
                                <v-chip
                                    v-for="item in reservedEIN.normalized.used"
                                    :key="item"
                                    closable
                                    color="red"
                                    close-icon="mdi-delete"
                                    @click="copyToClip(item)"
                                    @click:close="close(item)"
                                    size="small"
                                    filter
                                    variant="outlined"
                                >
                                    {{ item }}
                                </v-chip>
                            </v-chip-group>
                        </v-expansion-panel-text>
                        <v-expansion-panel-text>
                            <v-chip-group column>
                                <v-chip
                                    v-for="item in reservedEIN.normalized.unused"
                                    :key="item"
                                    color="teal"
                                    @click="copyToClip(item)"
                                    size="small"
                                    filter
                                    filter-icon="mdi-content-copy"
                                    variant="outlined"
                                >
                                    {{ item }}
                                    <v-icon end icon="mdi-flag" title="Flag as used" @click="flagAsUsed(item, 'normalized')" color="red"></v-icon>
                                </v-chip>
                            </v-chip-group>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                    <v-expansion-panel expand-icon="mdi-plus" collapse-icon="mdi-minus">
                        <v-expansion-panel-title expand-icon="mdi-plus" collapse-icon="mdi-minus">
                        Marketing
                        <v-badge
                            color="error"
                            :content="reservedEIN.marketing.unused.length"
                            offset-x="-278"
                        ></v-badge>
                        </v-expansion-panel-title>
                        <v-expansion-panel-text>
                            <v-chip-group column>
                                <v-chip
                                    v-for="item in reservedEIN.marketing.used"
                                    :key="item"
                                    closable
                                    color="red"
                                    close-icon="mdi-delete"
                                    @click="copyToClip(item)"
                                    @click:close="close(item)"
                                    size="small"
                                    filter
                                    variant="outlined"
                                >
                                    {{ item }}
                                </v-chip>
                            </v-chip-group>
                        </v-expansion-panel-text>
                        <v-expansion-panel-text>
                            <v-chip-group column>
                                <v-chip
                                    v-for="item in reservedEIN.marketing.unused"
                                    :key="item"
                                    color="teal"
                                    @click="copyToClip(item)"
                                    size="small"
                                    filter
                                    filter-icon="mdi-content-copy"
                                    variant="outlined"
                                >
                                    {{ item }}
                                    <v-icon end icon="mdi-flag" title="Flag as used" @click="flagAsUsed(item, 'marketing')" color="red"></v-icon>
                                </v-chip>
                            </v-chip-group>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>
        </div>
      <div v-if="navlist.settoproduction" id="tableboard">
           <app-dashboard-table/>
        </div>
    </div>
</template>

<style>
#dashboards {
    display: flex;
    margin-left: 10px;
    margin-right: 10px;
    flex-wrap: wrap;
    align-items: flex-start;
}

#einboard {
    max-width: 500px;
    left: 50vh;
    padding: 15px;
    overflow: auto;
    max-height: fit-content;
    border-radius: 2px 2px 0 0;
    box-shadow: 0 0 4px rgba(61, 61, 61, 0.5);
    position: static;
}

#tableboard {
    width: calc(100%);
    overflow: auto;
    max-height: fit-content;
    border-radius: 2px 2px 0 0;
    box-shadow: 0 0 4px rgba(61, 61, 61, 0.5);
    margin-left: 20px;
}
</style>

<script>
import { mapState, mapActions } from "vuex"
import AppDashboardTable from "./AppDashboardTable.vue"
export default {
    components: { AppDashboardTable },
    data: function() {
      return {
      }
    },
    computed: {
        ...mapState(["reservedEIN", "navlist"])
    },
    methods: {
        ...mapActions(["displayAlert", "removeReservedEIN", "updateEINStatus"]),
        close:  function(item) {
            console.log("==> from close :: "+item);
            this.removeReservedEIN(item);
        },
        copyToClip: function(item){
            navigator.clipboard.writeText(item);
            this.displayAlert({type:"success", text: "copied to clipboard", active: true});
        },
        flagAsUsed: function(item, series) {
            console.log("==> from markAsused == "+item + " "+series);
            this.updateEINStatus({name: item, nameseries: series});
        }
    }
}
</script>