<template>
    <div id="app">
        <v-app>
            <app-navigation />
            <v-content>
                <router-view :online="onlineUsers"/>
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
            onlineUsers: []
        }
    },
    components: {
        AppNavigation
    },
    methods: {
        async fetchOnlineUsers() {
            try {
                let data =  await this.$store.transportService.call('action.user.online.getlist', {});
                let onlineUsers = data.onlineUsers;
                console.log('FETCH');
                console.log(onlineUsers);
                let arr = [];
                for(let index in onlineUsers) {
                    arr.push(onlineUsers[index])
                }
                console.log(arr);
                return arr;
            } catch(error) {
                console.log(error);
                alert('Трапилась помилка при отриманні списку онлайн користувачів');
            }
        },
        pushUserToOnline(userId) {
            if (this.onlineUsers.indexOf(userId) === -1) {
                this.onlineUsers.push(userId);
            }
        },
        detachUserFromOnline(userId) {
            if (this.onlineUsers.length > 0) {
                if (this.onlineUsers.indexOf(userId) !== -1) {
                    this.onlineUsers.splice(this.onlineUsers.indexOf(userId), 1);
                }
            }
        },
        subscribeOnNetworkStatus() {
            this.$store.transportService.subscribe('application.network.status', (args) => {
                let parameters = JSON.parse(args);
                if (undefined !== parameters.userId && null !== parameters.userId ) {
                    this.pushUserToOnline(parameters.userId);
                }
            });
            this.$store.transportService.subscribe('application.network.detach.status', (args) => {
                let parameters = JSON.parse(args);
                if (undefined !== parameters.userId && null !== parameters.userId) {
                    this.detachUserFromOnline(parameters.userId);
                }
            })
        },
        publishNetworkStatus() {
            this.$store.transportService.publish('application.network.status', {
                userId: this.$store.state.user.id,
                online: true
            })
        },
        pageHandler(e) {
            this.$store.transportService.publish('application.network.detach.status', {userId:this.$store.state.user.id})
        }
    },
    async created() {
        window.onbeforeunload = this.pageHandler;
        let user = localStorage.getItem('user');
        if (user) {
            this.$store.commit('setUser', JSON.parse(user));
        }
        this.onlineUsers = await this.fetchOnlineUsers();
        this.publishNetworkStatus();
        this.subscribeOnNetworkStatus();
    },
};
</script>

<style></style>
