<template>
    <div id="home">
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
                                            v-model="offlineUserSearch"
                                            label="Пошук"
                                            color="cyan lighten-1"
                                    >
                                    </v-text-field>
                                </v-card-text>
                                <v-list>
                                    <v-list-item v-for="session in filteredSessions" @click="openChat(session.sessionId, session.user)" color="cyan lighten-1">
                                        <v-list-item-avatar>
                                            <v-img :src="session.user.image"></v-img>
                                        </v-list-item-avatar>
                                        <v-list-item-content>
                                            <v-list-item-title>
                                                <span>{{session.user.name}}</span>
                                                <span v-if="checkOnline(session.user)" class="online-indicator teal accent-3"></span>
                                            </v-list-item-title>
                                            <v-list-item-subtitle>
                                                <span v-if="session.lastMessage">
                                                    <span class="last-message-user" v-if="session.lastMessage.user">{{session.lastMessage.user.name}}:</span>
                                                    <span>{{showLastMessage(session.lastMessage)}}</span>
                                                    <span class="last-message-date">{{session.lastMessage.createdAt}}</span>
                                                </span>
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
                                    <v-text-field
                                            v-model="onlineUserSearch"
                                            label="Пошук"
                                            color="cyan lighten-1"
                                    >
                                    </v-text-field>
                                </v-card-text>
                                <v-list>
                                    <v-list-item v-for="session in filteredOnlineSessions" @click="openChat(session.sessionId, session.user)" color="cyan lighten-1">
                                        <v-list-item-avatar>
                                            <v-img :src="session.user.image"></v-img>
                                        </v-list-item-avatar>
                                        <v-list-item-content>
                                            <v-list-item-title>
                                                <span>{{session.user.name}}</span>
                                                <span v-if="checkOnline(session.user)" class="online-indicator teal accent-3"></span>
                                            </v-list-item-title>
                                            <v-list-item-subtitle>
                                                <span v-if="session.lastMessage">
                                                    <span class="last-message-user" v-if="session.lastMessage.user">{{session.lastMessage.user.name}}:</span>
                                                    <span>{{showLastMessage(session.lastMessage)}}</span>
                                                    <span class="last-message-date">{{session.lastMessage.createdAt}}</span>
                                                </span>
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
                    <chat ref="chat" v-if="null !== selectedSessionId" :messages="messages[selectedSessionId]" :sessionId="selectedSessionId" :publicKey="getPublicKeyBySessionId(selectedSessionId, selectedUserId)" :userId="selectedUserId"></chat>
                    <chat v-else-if="undefined === selectedSessionId" :messages="[]" :userId="selectedUserId"></chat>
                </v-col>
            </v-row>
            <mini-message v-if="newMessage && null === selectedSessionId" :message="newMessage"></mini-message>
        </v-container>
    </div>
</template>

<style>
    .all-height {
        height: calc(100vh - 64px - 12px - 12px);
    }
    .online-indicator {
        width: 10px;
        height: 10px;
        margin-left: 5px;
        display: inline-block;
        border-radius: 50%;
    }

    .last-message-date {
        float: right;
    }
</style>

<script>
import Chat from '../components/chat/Chat';
import MiniMessage from '../components/message/MiniMessage'
import { eventBus } from '../main';

export default {
    name: 'home',
    data() {
        return {
            selectedSessionId:null,
            selectedUserId:null,
            alert: {
                show:false,
                type: 'success',
                text: '',
                dismissible: true
            },
            sessions: [],
            messages: [],
            users: [],
            tabs: null,
            onlineUsers: [],
            newMessage: null,
            originPublicKey: null,
            originalPrivateKey: null,
            destinationPublicKey: null,
            offlineUserSearch: null,
            onlineUserSearch: null
        }
    },
    components: {
        Chat,
        MiniMessage
    },
    computed: {
        filteredSessions() {
            let offlineUserQuery = this.offlineUserSearch;
            return this.sessions.filter(function (session) {
                if(!offlineUserQuery) return true;
                else return session.user.name.indexOf(offlineUserQuery) > -1;
            });
        },
        filteredOnlineSessions() {
            let onlineUserQuery = this.onlineUserSearch;
            return this.sessions.filter((session) => {
                if (!onlineUserQuery) return this.onlineUsers.indexOf(session.user.id) > -1;
                else return session.user.name.indexOf(onlineUserQuery) > -1 && this.onlineUsers.indexOf(session.user.id) > -1;
            });
        }
    },
    methods: {
        showLastMessage(message) {
            let decryptedMessageContent = this.$store.cryptService.decrypt(message.content);
            if (decryptedMessageContent) {
                return decryptedMessageContent;
            }
            return message.content;
        },
        getPublicKeyBySessionId(sessionId, userId) {
          let publicKey = null;
          if (!userId) {
              this.sessions.forEach((session, i) => {
                  if (undefined !== session.sessionId) {
                      if (null !== session.sessionId) {
                          if (Number.parseInt(sessionId) === Number.parseInt(session.sessionId)) {
                              if (undefined !== session.publicKey && null !== session.publicKey) {
                                  publicKey = session.publicKey;
                                  return;
                              }
                          }
                      }
                  }
              } );
          } else {
              this.sessions.forEach((session, i) => {
                  if (session.user && Number.parseInt(session.user.id) === Number.parseInt(userId) && session.publicKey) {
                      publicKey = session.publicKey;
                      return;
                  }
              });
          }
          return publicKey;
        },
        closeNotify() {
            this.newMessage = null;
        },
        showNewMessage(message) {
            this.newMessage = message;
            setTimeout(() => {
                this.newMessage = null;
            }, 5000);
        },
        closeChat() {
            this.selectedSessionId = null;
            this.selectedUserId = null;
        },
        async fetchOnlineUsers() {
            try {
                let data =  await this.$store.transportService.call('action.user.online.getlist', {});
                let onlineUsers = data.onlineUsers;
                let arr = [];
                for(let index in onlineUsers) {
                    arr.push(onlineUsers[index])
                }
                return arr;
            } catch(error) {
                console.log(error);
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
        checkOnline(user) {
            let isUserOnline = false;
            this.onlineUsers.forEach((onlineUserId) => {
                if (onlineUserId === user.id) {
                    isUserOnline = true;
                }
            });
            return isUserOnline;
        },
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
        openChat(sessionId, user) {
            this.$store.commit('setLoader', true);
            if (sessionId === undefined) {
                this.selectedSessionId = sessionId;
                if (null !== user) {
                    this.selectedUserId = user.id;
                }
                this.$store.commit('setLoader', false);
            } else {
                this.$store.transportService.call('action.message.getlist', {
                    sessionId:sessionId,
                }).then((response) => {
                    let encryptedMessages = response.messages;
                    let decryptedMyMessages = [];
                    encryptedMessages.forEach((message) => {
                            let decryptedMessage = this.$store.cryptService.decrypt(message.message.content);
                            if (decryptedMessage) {
                                message.message.content = decryptedMessage;
                                decryptedMyMessages.push(message);
                            }
                    });
                    if (this.messages[response.sessionId] === undefined) {
                        this.messages[response.sessionId] = decryptedMyMessages;
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
        listenOneSession(sessionId) {
            this.$store.transportService.subscribe(`user.session.${sessionId}`, async (args) => {
                if (undefined !== args[0] && null !== args[0]) {
                    let eventType = args[0];
                    if ('message' === eventType) {
                        if (undefined !== args[1] && null !== args[1]) {
                            let message = JSON.parse(args[1]);
                            let receiverMessage = message.receiver;
                            let senderMessage = message.sender;
                            message = message.sender;
                            let senderPublicKey = message.publicKey;
                            let result = null;
                            if (Number.parseInt(message.userId) === Number.parseInt(this.$store.state.user.id)) {
                                result = this.$store.cryptService.decrypt(senderMessage.content);
                            } else {
                                result = this.$store.cryptService.decrypt(receiverMessage.content);
                            }
                            message.content = result;
                            if (undefined !== this.messages[sessionId]) {
                                this.messages[sessionId].push({message:message});
                            } else {
                                this.messages[sessionId] = [];
                                this.messages[sessionId].push({message:message});
                            }
                            let i = null;
                            this.sessions.forEach((session, index) => {
                                if (Number.parseInt(sessionId) === Number.parseInt(session.sessionId)) {
                                    i = index;
                                }
                            });
                            if (null !== i) {
                                this.sessions[i]['lastMessage'] = message;
                            }
                            if (this.$store.state.user && message.user && Number.parseInt(this.$store.state.user.id) !== Number.parseInt(message.user.id)) {
                                this.showNewMessage(message);
                            }
                            eventBus.$emit('reloadchat', {messages: this.messages[this.selectedSessionId]});
                            this.$forceUpdate();
                        }
                    }
                    if ('publicKey' === eventType) {
                        if (undefined !== args[1] && null !== args[1]) {
                            let receivedPublicKey = args[1];
                            let sessionId = args[2];
                            let userId = args[3];
                            if (Number.parseInt(this.$store.state.user.id) !== Number.parseInt(userId)) {
                                let index = null;
                                this.sessions.forEach((session, i) => {
                                    if (undefined !== session.sessionId) {
                                        if (Number.parseInt(session.sessionId) === Number.parseInt(sessionId)) {
                                            index = i;
                                        }
                                    }
                                });
                                if (null !== index && undefined !== this.sessions[index]) {
                                    this.sessions[index].publicKey = receivedPublicKey;
                                }
                            }
                        }
                    }
                }
            });
        },
        listenSessions() {
            this.sessions.forEach((session, i) => {
                if (null !== session.sessionId && undefined !== session.sessionId) {
                    this.listenOneSession(session.sessionId);
                }
            });
        },
        fetchSessions() {
            this.$store.transportService.call('action.session.getlist', {})
                .then(async (res) => {
                    this.sessions = res.sessions;
                    this.listenSessions();
                    // Initialize crypto webworker thread
                    // this.$store.commit('setCryptWorker', cryptWorker);
                    this.originPublicKey = this.$store.cryptService.getPublicKey();
                    this.originalPrivateKey = this.$store.cryptService.getPrivateKey();
                    this.pushMyPublicKey();
                    this.fetchOtherPublicKeys();
                    this.publishOriginalPublicKey();
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        publishOriginalPublicKey() {
            this.sessions.forEach((session) => {
                if (undefined !== session.sessionId && null !== this.originPublicKey) {
                    this.$store.transportService.publishRaw(`user.session.${session.sessionId}`,['publicKey', this.originPublicKey, session.sessionId, this.$store.state.user.id]);
                }
            });
        },
        fetchOtherPublicKeys() {
            this.sessions.forEach((session) => {
                if (session.user) {
                    this.$store.transportService.call('action.user.publickey.get', {accountId:session.user.id})
                        .then((response) => {
                            if (response.userKey && response.userKey.key) {
                                session.publicKey = response.userKey.key;
                                session.key = response.userKey.key;
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                }
            });
        },
        pushMyPublicKey() {
            this.$store.transportService.call('action.user.publickey.set', {publicKey:this.originPublicKey});
        },
        listenNewMessagesForMe() {
            this.$store.transportService.subscribe(`user.session.created.${this.$store.state.user.id}`, (args) => {
                if (undefined !== args[1] && null !== args[1]) {
                    let message = JSON.parse(args[1]);
                    let senderPublicKey = message.senderPublicKey;
                    let senderId = message.senderId;
                    this.listenOneSession(message.session.id);
                    let index = null;
                    this.sessions.forEach((session, i) => {
                        let user = session.user;
                        if (user) {
                            if (Number.parseInt(user.id) === Number.parseInt(senderId)) {
                                index = i;
                                return;
                            }
                        }
                    });
                    if (null !== index) {
                        this.sessions[index].sessionId = message.session.id;
                        this.sessions[index].publicKey = senderPublicKey;
                    }

                }
            });
        }
    },
    async created() {
        let user = this.$store.state.user;
        if (!user) {
            this.$router.push('/sign-in');
        } else {
            this.$store.transportService.call('action.auth.check', {token: user.token})
                .then((response) => {
                    this.showSuccessAlert('Такий користувач є');
                })
                .catch((error) => {
                    this.$router.push('/sign-in')
                });
            eventBus.$on('sessioncreated', (eventPayload) => {
                this.listenOneSession(eventPayload.sessionId);
                this.selectedSessionId = eventPayload.sessionId;
                let sessionId = eventPayload.sessionId;
                let userId = eventPayload.userId;
                let publicKey = eventPayload.receiverPublicKey;
                let index = null;
                this.sessions.forEach((session, i) => {
                    if (session.user && Number.parseInt(session.user.id) === Number.parseInt(userId)) {
                        index = i;
                        return;
                    }
                });
                if (null !== index) {
                    this.sessions[index].sessionId = sessionId;
                    this.sessions[index].publicKey = publicKey;
                }
            });
            this.fetchSessions();
            this.listenNewMessagesForMe();
            this.onlineUsers = await this.fetchOnlineUsers();
            this.publishNetworkStatus();
            this.subscribeOnNetworkStatus();
        }
    }
};
</script>
