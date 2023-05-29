<template>
    <v-tooltip :text="text">
        <template v-slot:activator="{ props }">
            <v-icon size="25" :color="color" v-bind="props">{{ icon }}</v-icon>
        </template>
    </v-tooltip>
</template>

<script>
    import { defineComponent } from "vue";

    export default defineComponent({
        props: {
            text: {
                type: String,
            },
            icon: {
                type: String,
            },
            color: {
                type: String,
            },
        },
    });
</script>
