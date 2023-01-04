<template>
    <AlgoModal title="Zapisz projekt">
        <v-text-field label="Tytuł projektu" v-model="projectTitle" clearable />

        <template #buttons>
            <v-btn color="primary" @click="save(false)">Zapisz jako</v-btn>
            <v-btn color="primary" @click="save(true)" v-if="project._id">Zapisz</v-btn>
        </template>
    </AlgoModal>
</template>

<script>
    import AlgoModal from "@/components/global/AlgoModal.vue";
    import { mapActions, mapState } from "vuex";
    import { closeModal } from "jenesius-vue-modal";
    import { defineComponent } from "vue";

    export default defineComponent({
        components: { AlgoModal },

        data() {
            return {
                projectTitle: "",
            };
        },

        mounted() {
            this.projectTitle = this.project.title;
        },

        methods: {
            ...mapActions("project", ["saveProject"]),

            save(override) {
                this.saveProject({
                    title: this.projectTitle,
                    override: override,
                });
                closeModal();
            },
        },

        computed: {
            ...mapState(["project"]),
        },
    });
</script>

<style scoped>
    input {
        padding: 5px 10px;
    }
</style>
