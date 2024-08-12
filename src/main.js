import { createApp } from 'vue'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import router from './router'; 
import App from './App.vue'
import '@mdi/font/css/materialdesignicons.css';


const vuetify = createVuetify({
    components,
    directives
  })

createApp(App).use(router).use(vuetify).mount('#app')
