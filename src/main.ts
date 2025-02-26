import '@icon-park/vue-next/styles/index.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/main.scss'
import piniaPersist from 'pinia-plugin-persist'
import localforage from 'localforage'
import { WidgetJsPlugin } from '@widget-js/vue3'
import AiComponentPlugin from '@widget-js/ai-component'
import App from './App.vue'
import '@widget-js/vue3/dist/style.css'
import router from './router'
import { clipboardDataRepository } from '@/model/ClipboardDataRepository'

async function init() {
  localforage.config({
    name: 'Clipboard',
    driver: localforage.INDEXEDDB,
  })
  await clipboardDataRepository.initDatabase()

  const app = createApp(App)

  const pinia = createPinia()
  pinia.use(piniaPersist)
  app.use(pinia)
  app.use(router)
  app.use(router)
  app.use(WidgetJsPlugin)
  app.use(AiComponentPlugin)

  app.mount('#app')
}

init()
