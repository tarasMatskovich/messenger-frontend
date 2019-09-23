import Vue from 'vue'
import VueWamp from "vue-wamp/dist/vue-wamp.esm";

Vue.use(VueWamp, {
    debug: true, // Logs will be written to the console
    url: 'ws://localhost:8080/ws',
    realm: 'realm1',
    onopen: function(session, details) {
        console.log('WAMP connected', session, details);
    },
    onclose: function(reason, details) {
        console.log('WAMP closed: ' + reason, details);
    }
});


class TransportService {

    constructor() {
        this.connection = Vue.Wamp;
    }

    call(rpcName, payload) {
        return this.connection.call(rpcName, [JSON.stringify(payload)]);
    }

}

export default new TransportService();
