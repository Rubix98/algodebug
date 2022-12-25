import { createApp } from "vue";
import App from "@/App.vue";
import mitt from "mitt";
import Vue3Sanitize from "vue-3-sanitize";
import VueKonva from "vue-konva";
import store from "@/store";
import { getCurrentThemeFromStorage } from "@/javascript/storage/themeStorage";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import { getDefaultToastSettings } from "@/javascript/utils/toastUtils";

// Vuetify
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@/javascript/prototypes/Map";
import "@/javascript/prototypes/String";

const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: getCurrentThemeFromStorage(),
        themes: {
            light: {
                dark: false,
                colors: {
                    primary: "#1a73e8",
                },
            },
            dark: {
                dark: true,
                colors: {
                    primary: "#1a73e8",
                },
            },
        },
    },
    icons: {
        defaultSet: "mdi",
        aliases,
        sets: {
            mdi,
        },
    },
});

const app = createApp(App);
app.config.globalProperties.emitter = mitt();

app.use(Vue3Sanitize);
app.use(VueKonva);
app.use(store);
app.use(Toast, getDefaultToastSettings());
app.use(vuetify);
app.mount("#app");
