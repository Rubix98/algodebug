import { createApp } from 'vue';
import App from '@/App.vue';
import mitt from 'mitt';
import Vue3Sanitize from "vue-3-sanitize";
import VueKonva from 'vue-konva';
import store from '@/store'

import '@/javascript/prototypes/Map.js';
import '@/javascript/prototypes/String.js';

const app = createApp(App);
app.config.globalProperties.emitter = mitt();

app.use(Vue3Sanitize);
app.use(VueKonva);
app.use(store)
app.mount('#app');
