import { createApp } from 'vue';
import Element from 'element-plus';
import './style.css';
import 'element-plus/lib/theme-chalk/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import App from './App.vue';

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(Element).mount('#app');
