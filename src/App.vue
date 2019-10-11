<template>
    <div id="app">
        <v-app>
            <app-navigation />
            <v-content>
                <router-view />
            </v-content>
            <v-overlay :value="showLoader">
                <v-progress-circular
                    indeterminate
                    size="64"
                ></v-progress-circular>
            </v-overlay>
        </v-app>
    </div>
</template>

<script>
import AppNavigation from './components/navigation/AppNavigation';

export default {
    name: 'App',
    computed: {
        showLoader() {
            return this.$store.state.loader;
        }
    },
    data() {
        return {

        }
    },
    components: {
        AppNavigation
    },
    methods: {
        pageHandler(e) {
            this.$store.transportService.publish('application.network.detach.status', {userId:this.$store.state.user.id})
        }
    },
    created() {
        window.onbeforeunload = this.pageHandler;
        let user = localStorage.getItem('user');
        if (user) {
            this.$store.commit('setUser', JSON.parse(user));
        }
    },
};
</script>

<style></style>
