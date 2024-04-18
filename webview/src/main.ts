import { createApp } from 'vue';
import './style.css';
import './index.css';
import { PLUGIN_IMPORTS } from '../pages/plugins';
import App from './App.vue';
import { usePages } from '../composables/usePages';

const { register, show } = usePages();

const app = createApp(App);

for (let key of Object.keys(PLUGIN_IMPORTS)) {
    app.component(key, PLUGIN_IMPORTS[key]);
    register('dynamic', key);
    show('dynamic', key);
}

app.mount('#app');
