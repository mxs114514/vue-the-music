import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css' // 引入 Element Plus 全局样式
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

// 初始化 request，注入 store 逻辑
// 必须在 app.use(pinia) 之后执行
import { useAuthStore } from '@/stores/auth'
import { initRequest } from '@/utils/request'

const authStore = useAuthStore()
initRequest(
  () => authStore.token,
  () => authStore.logout()
)

app.mount('#app')
