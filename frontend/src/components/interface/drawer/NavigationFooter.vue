<template>
    <footer>
        <v-divider />
        <v-list density="compact">
            <v-list-item prepend-icon="mdi-email-fast" title="Kontakt" @click="showDevelopersModal()" />
        </v-list>
    </footer>
</template>

<script>
    import { defineComponent } from "vue";
    import { pushModal } from "jenesius-vue-modal";
    import DevelopersModal from "@/components/modals/other/DevelopersModal.vue";

    export default defineComponent({
        name: "NavigationDrawer",
        methods: {
            showDevelopersModal() {
                pushModal(DevelopersModal);
            },
        },
    });
</script>

<style scoped>
    footer {
        position: absolute;
        width: 100%;
        bottom: 0px;
    }
</style>
