import Vue from 'vue';
import vuetify from './plugins/vuetify';
import App from './App';
import api from './api/index'
import router from './router'
import VueGoogleHeatmap from 'vue-google-heatmap';

Vue.use(VueGoogleHeatmap, {
  apiKey: 'AIzaSyDcjVfd-QY09V7TDv27TaM6Hrt1L_CAmns'
});

Vue.prototype.$api = api

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app');
