import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        loader: false
    },
    mutations: {
        setLoader(state, payload) {
            state.loader = payload;
        }
    },
    actions: {
        getLoader({state}) {
            return state.loader;
        }
    }
});
