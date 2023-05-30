<template>
    <AlgoModal title="Edycja konta">
        <div class="user-info">
            <v-avatar :image="this.userPicture" size="80" />
            <div class="user-info__text">
                <p class="user-info__text__title">Jesteś zalogowany jako</p>
                <p class="user-info__text__username">{{ this.userName }}</p>
            </div>
        </div>
        <v-divider />
        <div class="user-updating" v-if="userUpdating">
            <v-progress-circular indeterminate color="primary" />
            <p>Aktualizowanie konta</p>
        </div>
        <div class="user-settings" v-else>
            <v-text-field label="Nazwa użytkownika" v-model="settingsUsername" />
        </div>
        <template #buttons>
            <v-btn color="primary" @click="onUpdateUser">Zaktualizuj</v-btn>
        </template>
    </AlgoModal>
</template>

<script>
    import { defineComponent } from "vue";
    import AlgoModal from "@/components/global/AlgoModal.vue";
    import { mapActions, mapState } from "pinia";
    import { useUserStore } from "@/stores/user";

    export default defineComponent({
        name: "UserSettingsModal",
        components: { AlgoModal },

        data() {
            return {
                settingsUsername: "",
                userUpdating: false,
            };
        },

        mounted() {
            this.settingsUsername = this.userName;
        },

        methods: {
            ...mapActions(useUserStore, ["updateUsername"]),

            onUpdateUser() {
                this.userUpdating = true;
                this.updateUsername(this.settingsUsername).then(() => {
                    this.userUpdating = false;
                });
            },
        },

        computed: {
            ...mapState(useUserStore, ["userName", "userPicture"]),
        },
    });
</script>

<style lang="scss" scoped>
    .user-updating {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        margin-top: 1rem;
    }

    .user-info {
        margin: 0.5rem 0 1rem 0;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 1.5rem;

        &__text {
            &__title {
                opacity: 0.5;
                margin-bottom: 0.5rem;
            }
            &__username {
                font-size: x-large;
            }
        }
    }

    .user-settings {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        padding: 1.5rem 0 0 0;
    }
</style>
