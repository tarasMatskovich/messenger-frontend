<template>
    <div id="home" v-chat-scroll>
        <v-container fluid>
            <v-row class="all-height">
                <v-col cols="3" class="all-height">
                    <v-card style="height: 100%;">
                        <v-tabs grow v-model="tabs" color="cyan lighten-1">
                            <v-tab>Усі</v-tab>
                            <v-tab>Онлайн</v-tab>
                        </v-tabs>
                        <v-tabs-items v-model="tabs">
                            <v-tab-item>
                                <v-card-text>
                                    <v-text-field
                                            label="Пошук"
                                            color="cyan lighten-1"
                                    >
                                    </v-text-field>
                                </v-card-text>
                                <v-list>
                                    <v-list-item v-for="session in sessions" @click="openChat(session.sessionId)" color="cyan lighten-1">
                                        <v-list-item-avatar>
                                            <v-img :src="session.user.image"></v-img>
                                        </v-list-item-avatar>
                                        <v-list-item-content>
                                            <v-list-item-title v-text="session.user.name">
                                            </v-list-item-title>
                                            <v-list-item-subtitle>
                                                <span v-if="session.lastMessage">{{session.lastMessage.content}}</span>
                                            </v-list-item-subtitle>
                                        </v-list-item-content>
                                        <!--<v-badge overlap>-->
                                        <!--<template v-slot:badge>{{user.unread}}</template>-->
                                        <!--<v-list-item-icon>-->
                                        <!--<v-list-item-subtitle>-->
                                        <!--{{user.date}}-->
                                        <!--</v-list-item-subtitle>-->
                                        <!--</v-list-item-icon>-->
                                        <!--</v-badge>-->
                                    </v-list-item>
                                </v-list>
                            </v-tab-item>
                            <v-tab-item>
                                <v-card-text>
                                    <p>
                                        12345
                                    </p>
                                </v-card-text>
                            </v-tab-item>
                        </v-tabs-items>
                    </v-card>
                </v-col>
                <v-col cols="9" class="all-height">
                    <!--<v-container>-->
                        <!--<v-row justify="center">-->
                            <!--<v-col cols="12" sm="4">-->
                                <!--<v-alert v-model="alert.show" :type="alert.type" :dismissible="alert.dismissible">-->
                                    <!--{{alert.text}}-->
                                <!--</v-alert>-->
                            <!--</v-col>-->
                        <!--</v-row>-->
                    <!--</v-container>-->
                    <chat v-if="null !== selectedSessionId" :messages="messages[selectedSessionId]" :sessionId="selectedSessionId"></chat>
                    <chat v-else-if="undefined === selectedSessionId" :messages="[]"></chat>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<style>
    .all-height {
        height: calc(100vh - 64px - 12px - 12px);
    }
</style>

<script>
import Chat from '../components/chat/Chat';

export default {
    name: 'home',
    data() {
        return {
            selectedSessionId:null,
            alert: {
                show:false,
                type: 'success',
                text: '',
                dismissible: true
            },
            sessions: [],
            messages: [],
            users: [
                {
                    name: 'John',
                    image: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
                    message: 'Hello',
                    date: '19:45',
                    unread: 4
                },
                {
                    name: 'Taras',
                    image: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
                    message: 'Hi',
                    date: '07:09',
                    unread: 0
                },
                {
                    name: 'Bohdan',
                    image: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
                    message: 'Wats up',
                    date: '15:57',
                    unread: 0
                },
                {
                    name: 'Dima',
                    image: 'https://cdn.vuetifyjs.com/images/lists/4.jpg',
                    message: 'I am nice',
                    date: '06:37',
                    unread: 0
                }
            ],
            tabs: null
        }
    },
    components: {
        Chat
    },
    methods: {
        showSuccessAlert(text) {
            this.alert.text = text;
            this.alert.type = 'success';
            this.alert.show = true;
        },
        showErrorAlert(text) {
            this.alert.text = text;
            this.alert.type = 'error';
            this.alert.show = true;
        },
        openChat(sessionId) {
            this.$store.commit('setLoader', true);
            if (sessionId === undefined) {
                this.selectedSessionId = sessionId;
                this.$store.commit('setLoader', false);
            } else {
                // this.$store.transportService.call('action.session.get', {
                //     sessionId:sessionId
                // }).then((response) => [
                //
                // ]).catch((error) => {
                //     this.$store.commit('setLoader', false);
                //     console.log(error);
                //     alert('Трапилась помилка при отриманні даних сесії');
                // });
                this.$store.transportService.call('action.message.getlist', {
                    sessionId:sessionId,
                }).then((response) => {
                    if (this.messages[response.sessionId] === undefined) {
                        this.messages[response.sessionId] = response.messages;
                    }
                    this.selectedSessionId = sessionId;
                    this.$store.commit('setLoader', false);
                }).catch((error) => {
                    this.$store.commit('setLoader', false);
                    console.log(error);
                    alert('Трапилась помилка при отриманні списку повідомлень');
                });
            }
        },
        listenSessions() {
            this.sessions.forEach((session, i) => {
                if (null !== session.sessionId && undefined !== session.sessionId) {
                    this.$store.transportService.subscribe(`user.session.${session.sessionId}`, (args) => {
                        if (undefined !== args[0] && null !== args[0]) {
                            let eventType = args[0];
                            if ('message' === eventType) {
                                if (undefined !== args[1] && null !== args[1]) {
                                    let message = JSON.parse(args[1]);
                                    this.messages[session.sessionId].push({message:message});
                                    this.sessions[i]['lastMessage'] = message;
                                }
                            }
                        }
                    });
                }
            });
            setTimeout(() => {
                this.$store.transportService.call('action.user.getlist', {});
            }, 2000);
        },
        fetchSessions() {
            this.$store.transportService.call('action.session.getlist', {})
                .then((res) => {
                    this.sessions = res.sessions;
                    this.listenSessions();
                })
                .catch((err) => {
                    alert('Помилка');
                    console.log(err);
                });
        }
    },
    created() {
        let user = this.$store.state.user;
        if (!user) {
            this.$router.push('/sign-in');
        }
        this.$store.transportService.call('action.auth.check', {token: user.token})
            .then((response) => {
                this.showSuccessAlert('Такий користувач є');
                console.log(response)
            })
            .catch((error) => {
                this.$router.push('/sign-in')
            });
        this.fetchSessions();
    }
};
</script>
