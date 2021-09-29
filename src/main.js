import Vue from 'vue';
import vuetify from './plugins/vuetify';
import App from './App';
import api from './api/index'
import router from './router'

Vue.prototype.$api = api

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app');
