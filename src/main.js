import Vue from 'vue';
import App from './App.vue';
import axios from 'axios';

import router from './router';
import store from './store';

axios.defaults.baseURL = 'https://robispo-vue-axios.firebaseio.com';

axios.interceptors.request.use(c => {
  console.log('Request');
  console.log(c);

  return c;
});

axios.interceptors.response.use(r => {
  console.log('Response');
  console.log(r);

  return r;
});

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
