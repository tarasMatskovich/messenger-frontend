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
                    <chat v-if="null !== selectedSessionId" :messages="messages[selectedSessionId]" :sessionId="selectedSessionId" :publicKey="getPublicKeyBySessionId(selectedSessionId)"></chat>
                    <chat v-else-if="undefined === selectedSessionId" :messages="[]"></chat>
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
            users: [],
            tabs: null,
            onlineUsers: [],
            newMessage: null,
            originPublicKey: null,
            originalPrivateKey: null,
            destinationPublicKey: null
        }
    },
    components: {
        Chat,
        MiniMessage
    },
    methods: {
        showLastMessage(message) {
            let decryptedMessageContent = this.$store.cryptService.decrypt(message.content);
            if (decryptedMessageContent) {
                return decryptedMessageContent;
            }
            return message.content;
        },
        getPublicKeyBySessionId(sessionId) {
          let publicKey = null;
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
          return publicKey;
        },
        /** Post a message to the web worker and return a promise that will resolve with the response.  */
        getWebWorkerResponse (messageType, messagePayload) {
            return new Promise((resolve, reject) => {
                // Generate a random message id to identify the corresponding event callback
                const messageId = Math.floor(Math.random() * 100000);
                let cryptWorker = this.$store.state.cryptWorker;
                // Post the message to the webworker
                cryptWorker.postMessage([messageType, messageId].concat(messagePayload));

                // Create a handler for the webworker message event
                const handler = function (e) {
                    // Only handle messages with the matching message id
                    if (e.data[0] === messageId) {
                        // Remove the event listener once the listener has been called.
                        e.currentTarget.removeEventListener(e.type, handler);

                        // Resolve the promise with the message payload.
                        resolve(e.data[1])
                    }
                };
                // Assign the handler to the webworker 'message' event.
                cryptWorker.addEventListener('message', handler)
            })
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
        openChat(sessionId) {
            this.$store.commit('setLoader', true);
            if (sessionId === undefined) {
                this.selectedSessionId = sessionId;
                this.$store.commit('setLoader', false);
            } else {
                this.$store.transportService.call('action.message.getlist', {
                    sessionId:sessionId,
                }).then((response) => {
                    // console.log("RECEIVED ENCRYPTED MESSAGES");
                    // let publicKey = null;
                    // this.sessions.forEach((session) => {
                    //    if (Number.parseInt(session.sessionId) === Number.parseInt(sessionId)) {
                    //        publicKey = session.publicKey;
                    //    }
                    // });
                    // if (null !== publicKey) {
                    //     console.log("PUBLIC KEY EXIST");
                    //     response.messages.forEach((message) => {
                    //         this.getWebWorkerResponse('set-public', ['', publicKey]);
                    //         this.getWebWorkerResponse('decrypt', message.content).then((result) => {
                    //             console.log("AFTER DECRYPT INNER MESSAGE");
                    //             console.log(result);
                    //         });
                    //     });
                    // }
                    let encryptedMessages = response.messages;
                    console.log("ENCRYPTED MESSAGES");
                    console.log(encryptedMessages);
                    let decryptedMyMessages = [];
                    encryptedMessages.forEach((message) => {
                            //console.log("YES");
                            let decryptedMessage = this.$store.cryptService.decrypt(message.message.content);
                            if (decryptedMessage) {
                                message.message.content = decryptedMessage;
                                decryptedMyMessages.push(message);
                            }
                    });
                    console.log("DECRYPTED MESSAGES");
                    console.log(decryptedMyMessages);
                    console.log("RESPONSE MESSAGES");
                    console.log(response.messages);
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
        listenSessions() {
            this.sessions.forEach((session, i) => {
                if (null !== session.sessionId && undefined !== session.sessionId) {
                    this.$store.transportService.subscribe(`user.session.${session.sessionId}`, async (args) => {
                        console.log('RECEIVED EVENT');
                        console.log(args);
                        if (undefined !== args[0] && null !== args[0]) {
                            let eventType = args[0];
                            if ('message' === eventType) {
                                if (undefined !== args[1] && null !== args[1]) {
                                    console.log('NEW MESSAGE');
                                    let message = JSON.parse(args[1]);
                                    console.log(message);
                                    let receiverMessage = message.receiver;
                                    let senderMessage = message.sender;
                                    message = message.sender;
                                    let senderPublicKey = message.publicKey;
                                    let result = null;
                                    if (Number.parseInt(message.userId) === Number.parseInt(this.$store.state.user.id)) {
                                        //alert("DECRYPTED WITH SENDER PUBLIC KEY");
                                        //result = this.$store.cryptService.decryptWithSenderPublicKey(message.content, senderPublicKey);
                                        console.log('THIS IS MESSAGE FROM ME');
                                        result = this.$store.cryptService.decrypt(senderMessage.content);
                                    } else {
                                        console.log('THIS IS MESSAGE TO ME');
                                        result = this.$store.cryptService.decrypt(receiverMessage.content);
                                    }
                                    console.log("AFTER DECRYPT MESSAGE");
                                    console.log(result);
                                    message.content = result;
                                    if (undefined !== this.messages[session.sessionId]) {
                                        this.messages[session.sessionId].push({message:message});
                                    }
                                    this.sessions[i]['lastMessage'] = message;
                                    if (this.$store.state.user && message.user && Number.parseInt(this.$store.state.user.id) !== Number.parseInt(message.user.id)) {
                                        this.showNewMessage(message);
                                    }
                                }
                            }
                            if ('publicKey' === eventType) {
                                if (undefined !== args[1] && null !== args[1]) {
                                    console.log('RECEIVED PUBLIC KEY');
                                    console.log(args);
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
                }
            });
        },
        fetchSessions() {
            this.$store.transportService.call('action.session.getlist', {})
                .then(async (res) => {
                    this.sessions = res.sessions;
                    this.listenSessions();
                    // Initialize crypto webworker thread
                    // let cryptWorker = new Worker('crypto-worker.js');
                    // this.$store.commit('setCryptWorker', cryptWorker);
                    this.originPublicKey = this.$store.cryptService.getPublicKey();
                    this.originalPrivateKey = this.$store.cryptService.getPrivateKey();
                    this.pushMyPublicKey();
                    this.fetchOtherPublicKeys();
                    this.publishOriginalPublicKey();
                })
                .catch((err) => {
                    alert('Помилка');
                    console.log(err);
                });
        },
        publishOriginalPublicKey() {
            this.sessions.forEach((session) => {
                if (undefined !== session.sessionId && null !== this.originPublicKey) {
                    //this.$store.transportService.publishRaw(`user.session.${session.sessionId}`,['publicKey', this.originPublicKey, session.sessionId, this.$store.state.user.id]);
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
                            alert('Трапилась помилка при отриманні публічного коричтувача');
                        });
                }
            });
        },
        pushMyPublicKey() {
            this.$store.transportService.call('action.user.publickey.set', {publicKey:this.originPublicKey});
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
                    console.log(response)
                })
                .catch((error) => {
                    this.$router.push('/sign-in')
                });
            this.fetchSessions();
            this.onlineUsers = await this.fetchOnlineUsers();
            this.publishNetworkStatus();
            this.subscribeOnNetworkStatus();
        }
    }
};
</script>
