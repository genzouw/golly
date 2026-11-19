import { createApp } from 'vue'
import { configure } from 'vee-validate'
import App from './App'
import router from './router'

// vee-validate 2 と同じく入力のたびに検証する（4 の既定は change / blur 時のみ）
configure({ validateOnInput: true })

createApp(App).use(router).mount('#app')
