import { createApp } from "vue";
import App from "@/App.vue";
import mitt from "mitt";
import Vue3Sanitize from "vue-3-sanitize";
import VueKonva from "vue-konva";
import store from "@/store";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import { getDefaultToastSettings } from "@/javascript/utils/toastUtils";

import "@/javascript/prototypes/Map";
import "@/javascript/prototypes/String";

const app = createApp(App);
app.config.globalProperties.emitter = mitt();

app.use(Vue3Sanitize);
app.use(VueKonva);
app.use(store);
app.use(Toast, getDefaultToastSettings());
app.mount("#app");

store.dispatch("cachedLists/updateProjectsList"); //TODO: Nie wiem gdzie to powinno się znaleźć, na razie jest tu bo działa.
store.dispatch("cachedLists/updateConvertersList"); //TODO: Nie wiem gdzie to powinno się znaleźć, na razie jest tu bo działa.
