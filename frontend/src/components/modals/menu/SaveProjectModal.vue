<template>
    <AlgoModal title="Zapisz projekt">
        <v-text-field label="Tytuł projektu" v-model="title" clearable />

        <template #buttons>
            <v-btn color="primary" @click="save(false)">Zapisz jako</v-btn>
            <v-btn color="primary" @click="save(true)" v-if="this._id">Zapisz</v-btn>
        </template>
    </AlgoModal>
</template>

<script>
    import AlgoModal from "@/components/global/AlgoModal.vue";
    import { closeModal } from "jenesius-vue-modal";
    import { defineComponent } from "vue";
    import { useProjectStore } from "@/stores/project";
    import { mapActions, mapState } from "pinia";

    export default defineComponent({
        components: { AlgoModal },

        methods: {
            ...mapActions(useProjectStore, ["saveProject"]),

            save(override) {
                this.saveProject({
                    title: this.title,
                    override: override,
                });
                closeModal();
            },
        },

        computed: {
            ...mapState(useProjectStore, ["title", "_id"]),
        },
    });
</script>

<style scoped>
    input {
        padding: 5px 10px;
    }
</style>
