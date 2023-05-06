<template>
    <AlgoModal title="Zapisz projekt">
        <v-text-field label="Tytuł projektu" v-model="newTitle" clearable />
        <template #buttons>
            <v-btn color="primary" @click="save(false)">Zapisz jako</v-btn>
            <v-btn color="primary" @click="save(true)" v-if="this.showOverrideButton">Zapisz</v-btn>
        </template>
    </AlgoModal>
</template>

<script>
    import AlgoModal from "@/components/global/AlgoModal.vue";
    import { closeModal } from "jenesius-vue-modal";
    import { defineComponent } from "vue";
    import { useProjectStore } from "@/stores/project";
    import { mapActions, mapState } from "pinia";
    import { useUserStore } from "@/stores/user";
    import { canUserEditProject } from "@/javascript/utils/authorizationUtils";

    export default defineComponent({
        components: { AlgoModal },

        data() {
            return {
                newTitle: "",
            };
        },

        mounted() {
            this.newTitle = this.title;
        },

        methods: {
            ...mapActions(useProjectStore, ["saveProject"]),

            save(override) {
                this.saveProject(this.newTitle, override);
                closeModal();
            },
        },

        computed: {
            ...mapState(useProjectStore, ["title", "project"]),
            ...mapState(useUserStore, ["user"]),

            showOverrideButton() {
                return canUserEditProject(this.user, this.project);
            },
        },
    });
</script>

<style scoped>
    input {
        padding: 5px 10px;
    }
</style>
