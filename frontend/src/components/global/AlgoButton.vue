<template>
    <v-btn :color="color">
        <slot></slot>
    </v-btn>
</template>

<script>
export default {
    props: ["type"],
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
