<template>
    <div id="app">
        <v-app>
            <app-navigation />
            <v-content>
                <router-view />
            </v-content>
        </v-app>
    </div>
</template>

<script>

    import AppNavigation from './components/navigation/AppNavigation'

    export default {
        name: "App",
        components: {
            AppNavigation
        }
    }
</script>

<style>

</style>
