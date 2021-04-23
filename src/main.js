import { createApp } from 'vue'
import App from './App.vue'
import './plugins/element.js'
import installElementPlus from './plugins/element'

const app = createApp(App)
installElementPlus(app)
app.mount('#app')