import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import VueTheMask from 'vue-the-mask';
import transportService from './services/transport-service/transportService'
import '@babel/polyfill';

Vue.config.productionTip = false;
Vue.use(VueTheMask);
Vue.use(require('vue-chat-scroll'));
store.transportService = transportService;

export const eventBus = new Vue();

new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
}).$mount('#app');
