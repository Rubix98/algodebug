<template>
    <v-btn :color="color" :prepend-icon="icon" :size="size">
        <slot></slot>
    </v-btn>
</template>

<script>
export default {
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
};
</script>
