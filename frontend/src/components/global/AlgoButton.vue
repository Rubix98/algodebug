<template>
    <v-btn :color="color" :prepend-icon="icon" :size="size">
        <slot></slot>
    </v-btn>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
    props: ["type", "icon", "size"],
    computed: {
        color() {
            switch (this.type) {
                case "ok":
                    return "primary";
                default:
                    return "";
            }
        },
    },
});
</script>
