<template>
    <AlgoModal title="Usuń projekt">
        <div v-if="showLoading" class="deleting-progress">
            <v-progress-circular indeterminate color="primary" />
            <p>Usuwanie projektu...</p>
        </div>
        <div v-else class="delete-info">
            <p class="title">Zamierzasz usunąc projekt {{ projectTitle }}.</p>
            <p>Aby potwierdzić usunięcie projektu, prosimy wpisać "{{ projectTitle }}" w poniższym polu.</p>
            <br />
            <v-text-field label="Tytuł projektu do usunięcia" v-model="inputProjectTitle" />
            <p class="warning">
                Usunięcie projektu jest operacją nieodwracalną. Nie ma późniejszej możliwości go odzyskania.
            </p>
        </div>
        <template #buttons>
            <v-btn color="primary" :disabled="isDeleteButtonDisabled" @click="this.onDeleteProject">Usuń projekt</v-btn>
        </template>
    </AlgoModal>
</template>

<script>
    import AlgoModal from "@/components/global/AlgoModal.vue";
    import { defineComponent } from "vue";
    import { mapActions, mapState } from "pinia";
    import { useProjectStore } from "@/stores/project";
    import { closeModal } from "jenesius-vue-modal";

    export default defineComponent({
        name: "DeleteProjectModal",

        components: { AlgoModal },

        data() {
            return {
                inputProjectTitle: "",
                showLoading: false,
            };
        },

        methods: {
            ...mapActions(useProjectStore, ["deleteProject"]),
            onDeleteProject() {
                this.showLoading = true;
                this.deleteProject()
                    .then(() => {
                        window.location.href = "/";
                    })
                    .finally(() => {
                        closeModal();
                    });
            },
        },

        computed: {
            ...mapState(useProjectStore, ["projectTitle"]),

            isDeleteButtonDisabled() {
                return !(this.inputProjectTitle === this.projectTitle) || this.showLoading;
            },
        },
    });
</script>

<style lang="scss" scoped>
    div.deleting-progress {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    p {
        line-height: 2rem;

        &.warning {
            color: red;
        }

        &.title {
            font-weight: bold;
            font-size: large;
        }
    }
</style>
