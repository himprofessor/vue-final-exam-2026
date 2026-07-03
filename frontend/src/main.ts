import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { setRouter } from './services/api'
import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Give the api interceptor access to the router for 401 redirects
setRouter(router)

app.mount('#app')
