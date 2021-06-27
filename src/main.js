import Vue from 'vue';
import vuetify from './plugins/vuetify';
import App from './App';
import api from './api/index'

Vue.prototype.$api = api

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app');
