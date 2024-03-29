import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import VueTheMask from 'vue-the-mask';
import transportService from './services/transport-service/transportService';
import cryptService from './services/crypt-service/cryptService';
import '@babel/polyfill';

Vue.config.productionTip = false;
Vue.use(VueTheMask);
Vue.use(require('vue-chat-scroll'));
store.transportService = transportService;
store.cryptService = cryptService;

export const eventBus = new Vue();

new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
}).$mount('#app');
