<template>
    <footer>
        <v-divider />
        <div class="footerContent">
            AlgoDebug<sup>&#169;</sup> &#9679; <a href="#" @click="showDevelopersModal()">Autorzy</a>
        </div>
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

    .footerContent {
        padding: 5px;
        text-align: center;
    }
</style>
