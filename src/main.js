import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';

import '@unocss/reset/normalize.css';
import 'uno.css';
import './assets/css/style.css';

const app = createApp(App);

app.use(createPinia());
app.mount('#app');