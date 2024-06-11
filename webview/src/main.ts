import { createApp } from 'vue';
import './style.css';
import './index.css';
import { PLUGIN_IMPORTS } from '../pages/plugins';
import { usePages } from '../composables/usePages';
import App from './App.vue';
import DraggableVue from './components/Draggable.vue';

const { init } = usePages();

const app = createApp(App);

for (let key of Object.keys(PLUGIN_IMPORTS)) {
    app.component(key, PLUGIN_IMPORTS[key]);
}

app.component('Draggable', DraggableVue);
app.mount('#app');
init();
