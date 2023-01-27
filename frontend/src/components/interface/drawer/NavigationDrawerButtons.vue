<template>
    <v-list density="compact">
        <v-list-item
            v-for="button in buttonsWithShowSetToTrue"
            :key="button.title"
            :prepend-icon="button.icon"
            :title="button.title"
            @click="button.onClick"
        />
    </v-list>
</template>

<script>
    import { defineComponent } from "vue";

    export default defineComponent({
        name: "NavigationDrawerButtons",
        props: {
            buttons: {
                type: Object,
                required: true,
            },
        },
        computed: {
            buttonsWithShowSetToTrue() {
                return this.$props.buttons.filter((button) => button.show === true);
            },
        },
    });
</script>
