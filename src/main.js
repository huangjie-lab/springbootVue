import Vue from 'vue';
import App from './App.vue';
import router from './router';
import './plugins/element.js';
// 添加全局样式
import './assets/css/global.css';
import './assets/css/iconfont.css';
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:9000'
Vue.prototype.$http = axios;


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
