// DO NOT MODIFY, AUTOMATICALLY USED
import { createApp } from 'vue';
import './style.css';
import './index.css';
import { PLUGIN_IMPORTS } from '../pages/plugins';
import { usePages } from '../composables/usePages';
import App from './App.vue';

const { init } = usePages();

const app = createApp(App);

for (let key of Object.keys(PLUGIN_IMPORTS)) {
    app.component(key, PLUGIN_IMPORTS[key]);
}

app.mount('#app');
 init();
