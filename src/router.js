import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import SignIn from './views/SignIn';
import SignUp from './views/SignUp';
import Settings from './views/Settings';
import Logout from './views/Logout';

Vue.use(Router);

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/sign-in',
            name: 'sign-in',
            component: SignIn
        },
        {
            path: '/sign-up',
            name: 'sign-up',
            component: SignUp
        },
        {
            path: '/settings',
            name: 'settings',
            component: Settings
        },
        {
            path: '/logout',
            name: 'logout',
            component: Logout
        }
    ]
});
