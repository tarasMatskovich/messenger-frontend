<template>
    <div>
        <v-container>
            <div>
                <div class="chat-wrapper" v-chat-scroll>
                    <v-btn class="mx-2 close-chat" fab dark large color="cyan" @click="closeChat">
                        <v-icon dark>mdi-window-close</v-icon>
                    </v-btn>
                    <div v-for="message in messagesArray">
                        <message :message="message.message"></message>
                    </div>
                </div>
                <div>
                    <v-text-field
                            v-model="messageContent"
                            label="Повідомлення"
                            solo
                            clearable
                            @keydown="sendMessage"
                            class="message-content-input"
                    ></v-text-field>
                </div>
            </div>
        </v-container>
    </div>
</template>

<style scoped>
    .chat-wrapper {
        height: calc(100vh - 230px);
        margin-bottom: 40px;
        overflow-y: scroll;
        overflow-x: hidden;
    }

    .message-content-input {
        height: 48px;
    }

    .close-chat {
        position: absolute;
        right: 60px;
    }
</style>

<script>
    import Message from '../message/Message';

    export default {
        name: "Chat",
        props: ['messages', 'sessionId'],
        data() {
            return {
                session:null,
                messagesArray: this.messages,
                messageContent: ''
            }
        },
        components: {
            Message
        },
        watch: {
            messages: function (newValue, oldValue) {
                if (undefined === newValue) {
                    this.messagesArray = [];
                } else {
                    this.messagesArray = newValue;
                }
            }
        },
        methods: {
            closeChat(e) {
                this.$parent.closeChat();
            },
            sendMessage(keyDownEvent) {
                if ('Enter' === keyDownEvent.code) {
                    if (this.sessionId) {
                        this.getSession(this.sessionId);
                    }
                }
            },
            sendMessageToSession(session) {
                let receiverId = null;
                if (Number.parseInt(session.user1Id) !== this.$store.state.user.id) {
                    receiverId = session.user1Id;
                } else {
                    receiverId = session.user2Id;
                }
                this.$store.transportService.call('action.message.create', {
                    sessionId:session.id,
                    userId: this.$store.state.user.id,
                    receivedUserId: receiverId,
                    content: this.messageContent
                }).then((response) => {
                    this.messageContent = '';
                }).catch((error) => {
                    console.log(error);
                    alert('Трапилась помилка при відправленні повідомлення');
                });
            },
            getSession(sessionId) {
                this.$store.transportService.call('action.session.get', {
                    sessionId:sessionId
                }).then((response) => {
                    this.session = response.session;
                    this.sendMessageToSession(this.session);
                }).catch((error) => {
                    console.log(error);
                    alert('Трапилась помилка при отриманні даних сесії');
                });
            }
        }
    }
</script>
