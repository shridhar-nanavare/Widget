<template>
    <v-app>
        <app-layout/>
    </v-app>
</template>

<script>
import AppLayout from "./AppLayout.vue"

export default {
    name: "App",
    components: { AppLayout },
    data: function() {
        return {}
    }
}
</script>