<template>
    <v-tooltip :text="text">
        <template v-slot:activator="{ props }">
            <v-icon size="25" v-bind="props" @click="handleClick">{{ icon }}</v-icon>
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
            onClick: {
                type: Function,
            },
        },

        methods: {
            handleClick() {
                this.onClick(); // Wywołanie dostarczonej funkcji onClick
            },
        },
    });
</script>
