import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import Mock from './mock' // 引入mock数据
import router from './router'
import App from './App.vue'

const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.mount('#app')
