import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        loader: false,
        user: null,
        sessions: []
    },
    mutations: {
        setLoader(state, payload) {
            state.loader = payload;
        },
        setUser(state, payload) {
            state.user = payload;
        },
        setSessions(state, payload) {
            state.sessions = payload;
        }
    },
    actions: {
        getLoader({ state }) {
            return state.loader;
        },
        getUser({ state }) {
            return state.user;
        },
        getSessions({ state }) {
            return state.sessions;
        }
    }
});
