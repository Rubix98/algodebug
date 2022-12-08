import { createApp } from "vue";
import App from "@/App.vue";
import mitt from "mitt";
import Vue3Sanitize from "vue-3-sanitize";
import VueKonva from "vue-konva";
import store from "@/store";
import Toast, { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";

import "@/javascript/prototypes/Map";
import "@/javascript/prototypes/String";

const app = createApp(App);
app.config.globalProperties.emitter = mitt();

app.use(Vue3Sanitize);
app.use(VueKonva);
app.use(store);
app.use(Toast, {
    position: POSITION.TOP_RIGHT,
    timeout: 3000,
});
app.mount("#app");
