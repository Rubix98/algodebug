<template>
    <AlgoModal title="Zespół AlgoDebug" closeButtonLabel="Zamknij">
        <v-list>
            <v-list-item
                v-for="author in authors"
                class="py-3"
                :prepend-avatar="getAvatarUrl(author.githubId)"
                :title="author.name"
                :subtitle="author.role"
                :href="author.githubLink"
                :key="author.name"
            />
        </v-list>
        <v-divider class="my-3" />
        <v-list-item
            class="py-3"
            prepend-icon="mdi-email"
            title="Kontakt"
            subtitle="algodebug.kni@gmail.com"
            href="mailto:algodebug.kni@gmail.com"
        />
    </AlgoModal>
</template>

<script>
    import { defineComponent } from "vue";
    import AlgoModal from "@/components/global/AlgoModal.vue";

    export default defineComponent({
        components: { AlgoModal },

        data: () => ({
            authors: [
                {
                    name: "Marcin Wojdat",
                    role: "Kierownik projektu",
                    githubId: 57133114,
                    githubLink: "https://github.com/Rubix98",
                },
                {
                    name: "Jakub Pawłowski",
                    role: "Pracownik miesiąca styczeń 2023",
                    githubId: 59766830,
                    githubLink: "https://github.com/pawl0wski",
                },
                {
                    name: "Łukasz Skabowski",
                    role: "Pracownik miesiąca grudzień 2022, luty 2023",
                    githubId: 27860636,
                    githubLink: "https://github.com/xenix1337",
                },
                {
                    name: "Mateusz Sobkowiak",
                    role: "Backend",
                    githubId: 60814050,
                    githubLink: "https://github.com/Sobgo",
                },
                {
                    name: "Paweł Aniszewski",
                    role: "Pracownik miesiąca marzec 2023",
                    githubId: 64214642,
                    githubLink: "https://github.com/imaTik0",
                },
                {
                    name: "Kamil Ruszkowski",
                    role: "",
                    githubId: 123332284,
                    githubLink: "https://github.com/NadzorcaWodopoju",
                },
                {
                    name: "Paweł Czarkowski",
                    role: "",
                    githubId: 122998420,
                    githubLink: "https://github.com/pwaczar",
                },
                {
                    name: "Patryk Cierniak",
                    role: "",
                    githubId: 111867777,
                    githubLink: "https://github.com/Igiri3s",
                },
                {
                    name: "Szymon Świtajski",
                    role: "",
                    githubId: 131202643,
                    githubLink: "https://github.com/pro-asek",
                },
            ],
        }),

        methods: {
            getAvatarUrl(githubId) {
                return `https://avatars.githubusercontent.com/u/${githubId}?s=64&v=4`;
            },
        },
    });
</script>
