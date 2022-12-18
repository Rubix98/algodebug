<template>
    <AlgoModal title="Zapisz projekt">
        <v-text-field label="Tytuł projektu" v-model="projectTitle" />

        <template #buttons>
            <AlgoButton type="ok" @click="save(false)">Zapisz jako</AlgoButton>
            <AlgoButton type="ok" @click="save(true)" v-if="project.id">Zapisz</AlgoButton>
        </template>
    </AlgoModal>
</template>

<script>
import AlgoModal from "@/components/global/AlgoModal.vue";
import AlgoButton from "@/components/global/AlgoButton.vue";
import { mapActions, mapState } from "vuex";
import { closeModal } from "jenesius-vue-modal";

export default {
    components: { AlgoModal, AlgoButton },

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
};
</script>

<style scoped>
input {
    padding: 5px 10px;
}
</style>
