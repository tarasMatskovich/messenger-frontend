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
    components: {
        AppNavigation
    },
    created() {
        let user = localStorage.getItem('user');
        if (user) {
            this.$store.commit('setUser', user);
        }
    }
};
</script>

<style></style>
