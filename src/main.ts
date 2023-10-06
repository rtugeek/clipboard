import 'element-plus/dist/index.css'
import '@icon-park/vue-next/styles/index.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './assets/main.scss';
import piniaPersist from 'pinia-plugin-persist'
import App from './App.vue';
import router from './router';
import * as localforage from 'localforage';
import {clipboardDataRepository} from "@/model/ClipboardDataRepository";
async function init() {
  localforage.config({
    name: 'Clipboard',
    driver: localforage.INDEXEDDB,
  });
  await clipboardDataRepository.initDatabase();

  const app = createApp(App);

  const pinia = createPinia();
  pinia.use(piniaPersist)
  app.use(pinia);
  app.use(router);

  app.mount('#app');

}

init();
