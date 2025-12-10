import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import './assets/base.css' // 引入全局样式重置

import 'dayjs/locale/zh-cn'
import dayjs from 'dayjs'
dayjs.locale('zh-cn') // 激活中文

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(ElementPlus, {
  locale: zhCn,
})
app.use(pinia)
app.use(router)
app.mount('#app')
