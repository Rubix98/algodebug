<template>
    <AlgoModal title="Zespół AlgoDebug" closeButtonLabel="Zamknij">
        <ul>
            <li>Marcin Wojdat - Kierownik projektu</li>
            <li>Jakub Pawłowski - Pracownik miesiąca styczeń 2023</li>
            <li>Łukasz Skabowski - Pracownik miesiąca grudzień 2022</li>
            <li>Mateusz Sobkowiak - Backend</li>
            <li>Kamil Ruszkowski</li>
            <li>Paweł Aniszewski</li>
            <li>Paweł Czarkowski</li>
            <br />
            <v-divider />
            <br />
            <div><b>Kontakt: </b><a href="mailto:algodebug.kni@gmail.com">algodebug.kni@gmail.com</a></div>
            <br />
        </ul>
    </AlgoModal>
</template>

<script>
    import { defineComponent } from "vue";
    import AlgoModal from "@/components/global/AlgoModal.vue";

    export default defineComponent({
        components: { AlgoModal },
    });
</script>
