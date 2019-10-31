import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        loader: false,
        user: null,
        sessions: [],
        cryptWorker: null
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
        },
        setCryptWorker(state, payload) {
            state.cryptWorker = payload;
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
        },
        getCryptWorker({ state }) {
            return state.cryptWorker;
        }
    }
});
