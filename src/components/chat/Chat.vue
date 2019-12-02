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
    import { eventBus } from '../../main';

    export default {
        name: "Chat",
        props: ['messages', 'sessionId', 'publicKey', 'userId'],
        data() {
            return {
                session:null,
                messagesArray: this.messages,
                messageContent: '',
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
            sendMessageOnNewMessage() {
                if (this.userId) {
                    this.$store.transportService.call('action.session.realtime.create', {
                        user1Id: this.$store.state.user.id,
                        user2Id: this.userId
                    }).then((response) => {
                        let receiverPublicKey = response.receiverPublicKey;
                        eventBus.$emit('sessioncreated', {
                            receiverPublicKey : receiverPublicKey,
                            userId: this.userId,
                            sessionId: response.session.id
                        });
                        this.getSession(response.session.id);
                    });
                }
            },
            sendMessage(keyDownEvent) {
                if ('Enter' === keyDownEvent.code) {
                    if (this.sessionId) {
                        this.getSession(this.sessionId);
                    } else {
                        this.sendMessageOnNewMessage();
                    }
                }
            },
            async sendMessageToSession(session) {
                let receiverId = null;
                if (Number.parseInt(session.user1Id) !== this.$store.state.user.id) {
                    receiverId = session.user1Id;
                } else {
                    receiverId = session.user2Id;
                }
                let messageContent = this.messageContent;
                const encryptedText = this.$store.cryptService.encrypt(messageContent, this.publicKey);
                const myEncryptedContent = this.$store.cryptService.encryptForMe(messageContent);
                console.log("ENCRYPTED TEXT");
                console.log(encryptedText);
                const tmp = this.$store.cryptService.decryptWithSenderPublicKey(encryptedText, this.publicKey);
                console.log("ALSO DECRYPTED TEXT");
                console.log(myEncryptedContent);
                this.$store.transportService.call('action.message.create', {
                    sessionId:session.id,
                    userId: this.$store.state.user.id,
                    receivedUserId: receiverId,
                    content: encryptedText,
                    senderContent: myEncryptedContent,
                    publicKey: this.publicKey
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
        },
        created() {
            eventBus.$on('reloadchat', (eventPayload) => {
                console.log("I HAVE A NEW MESSAGE (FORCE UPDATE)");
                this.messagesArray = eventPayload.messages;
                this.$forceUpdate();
            })
        }
    }
</script>
