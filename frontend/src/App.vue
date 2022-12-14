<template>
    <v-app>
        <AppBar />
        <v-main>
            <MainPage />
        </v-main>
        <BottomButtons />
    </v-app>
    <Modal />
</template>

<script>
import { defineComponent } from "vue";
import AppBar from "@/components/appBar/AppBar.vue";
import MainPage from "@/components/mainPage/MainPage.vue";
import { container } from "jenesius-vue-modal";
import BottomButtons from "@/components/bottomButtons/BottomButtons.vue";

export default defineComponent({
    name: "App",

    components: { BottomButtons, AppBar, MainPage, Modal: container },
});
</script>

<style>
/* Global */

body {
    font-family: "Tahoma", sans-serif;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.full-size {
    width: 100%;
    height: 100%;
}

.flex {
    display: flex;
}

.flex-wrap {
    display: flex;
    flex-wrap: wrap;
    align-content: space-between;
}

.flex-row {
    display: flex;
    flex-direction: row;
}

.flex-column {
    display: flex;
    flex-direction: column;
}

.flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
}

.flex-vertical-left {
    display: flex;
    justify-content: flex-start;
}

.flex-vertical-center {
    display: flex;
    justify-content: center;
}

.flex-vertical-right {
    display: flex;
    justify-content: flex-end;
}

.flex-vertical-space-between {
    display: flex;
    justify-content: space-between;
}

.flex-horizontal-center {
    display: flex;

    align-items: center;
}

.width-1-of-2 {
    width: 50%;
}
</style>
