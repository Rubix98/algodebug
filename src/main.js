import { createApp } from 'vue';
import App from './App.vue';
import mitt from 'mitt';
import VueUniversalModal from 'vue-universal-modal';
import 'vue-universal-modal/dist/index.css';

const emitter = mitt();
const app = createApp(App);
app.config.globalProperties.emitter = emitter;
app.mount('#app');
app.use(VueUniversalModal, {
  teleportTarget: '#modals'
})
