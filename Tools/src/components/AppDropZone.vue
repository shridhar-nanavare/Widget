<template>
    <div>
        <div
            :class="['dropZoneOuter']"
            @dragenter.stop="dragEnterEvent()"
        >
            <div
                id="dropZoneContainer"
                :class="['dropZoneOuter', dragOver ? '' : 'dropZoneInactive']"
                @dragover.prevent.stop="dragOverEvent()"
                @drop.prevent.stop="dropEvent($event)"
                @dragleave.stop="dragLeaveEvent()"
            >
                <div id="dropZone">
                    <v-icon size="100px">mdi-dropbox</v-icon>
                    {{ $t("Drop Here") }}
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.dropZoneOuter {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
#dropZoneContainer {
    background-color: #8a8a8a26;
    border: 1px solid #368ec4;
}
#dropZone {
    position: fixed;
    top: calc(50% - 80px);
    left: calc(50% - 75px);
    width: 130px;
    height: 130px;
    border: 1px dashed red;
    border-radius: 12px;
    text-align: center;
    background-color: white;
    pointer-events: none;
}
.dropZoneInactive {
    display: none;
}
</style>

<script>
import { mapState, mapActions } from "vuex";

export default {
    data: function() {
        return {
            dragOver: false
        };
    },
    computed: {
        ...mapState([])
    },
    methods: {
        ...mapActions(["addOrReplaceItem", "displayAlert"]),
        dragEnterEvent: function() {
            console.log('drag entering........');
            this.dragOver = true;
        },
        dragOverEvent: function() {
            console.log('drag over drop area........');
            this.dragOver = true;
        },
        dragLeaveEvent: function() {
            console.log('leaving drop area........');
            this.dragOver = false;
        },
        dropEvent: function(event) {
            console.log('dropped........');
            try{
                if (event && event.dataTransfer) {
                    const dropData = JSON.parse(event.dataTransfer.getData("text"));
                    if (dropData.protocol && dropData.protocol === "3DXContent") {
                        if (dropData.data && dropData.data.items) {
                            for (const item of dropData.data.items) {
                                if (item.objectId && ["VPMReference"].includes(item.objectType)){
                                    this.addOrReplaceItem(item);
                                } else {
                                    this.displayAlert({type: "error", text: this.$i18n.t("Type Not Supported"), active: true});
                                }
                            }
                        }
                    } else {
                        this.displayAlert({type: "warning", text: this.$i18n.t("Ext content not allowed"), active: true});
                    }
                }
            } catch(error) {
                console.error(error);
                this.displayAlert({type: "error", text: this.$i18n.t("Invalid Drop Data"), active: true});
            }
            this.dragOver = false;
        }
    }
};
</script>
