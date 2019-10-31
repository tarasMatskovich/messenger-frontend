import Vue from 'vue'
import VueWamp from "vue-wamp/dist/vue-wamp.esm";

Vue.use(VueWamp, {
    debug: true, // Logs will be written to the console
    url: 'ws://192.168.0.95:8080/ws',
    realm: 'realm1',
    onopen: function(session, details) {
        console.log('WAMP connected', session, details);
    },
    onclose: function(reason, details) {
        localStorage.setItem('key', 'value');
        console.log('WAMP closed: ' + reason, details);
    }
});


class TransportService {

    constructor() {
        this.connection = Vue.Wamp;
    }

    getUser() {
        let user = localStorage.getItem('user');
        if (!user) {
            return null;
        }
        user = JSON.parse(user);
        return user;
    }

    getToken() {
        let user = this.getUser();
        if (!user) {
            return null;
        }
        return user.token;
    }

    call(rpcName, payload) {
        payload.token = this.getToken();
        let user = this.getUser();
        let userId = null;
        if (user) {
            userId = user.id;
        }
        payload.userId = userId;
        return this.connection.call(rpcName, [JSON.stringify(payload)]);
    }

    subscribe(topic, handler) {
        this.connection.subscribe(topic, handler);
    }

    publish(topic, args) {
        this.connection.publish(topic, [JSON.stringify(args)]);
    }

    publishRaw(topic, args) {
        this.connection.publish(topic, args);
    }

}

export default new TransportService();
