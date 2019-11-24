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
        props: ['messages', 'sessionId', 'publicKey'],
        data() {
            return {
                session:null,
                messagesArray: this.messages,
                messageContent: '',
                cryptWorker: null
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
            /** Post a message to the web worker and return a promise that will resolve with the response.  */
            getWebWorkerResponse (messageType, messagePayload) {
                return new Promise((resolve, reject) => {
                    // Generate a random message id to identify the corresponding event callback
                    const messageId = Math.floor(Math.random() * 100000);
                    // Post the message to the webworker
                    this.cryptWorker.postMessage([messageType, messageId].concat(messagePayload));

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
                    this.cryptWorker.addEventListener('message', handler)
                })
            },
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
            async sendMessageToSession(session) {
                let receiverId = null;
                if (Number.parseInt(session.user1Id) !== this.$store.state.user.id) {
                    receiverId = session.user1Id;
                } else {
                    receiverId = session.user2Id;
                }
                let messageContent = this.messageContent;
                // const encryptedText = await this.getWebWorkerResponse(
                //     'encrypt', [ messageContent, this.publicKey ]);
                const encryptedText = this.$store.cryptService.encrypt(messageContent, this.publicKey);
                const myEncryptedContent = this.$store.cryptService.encryptForMe(messageContent);
                console.log("ENCRYPTED TEXT");
                console.log(encryptedText);
                const tmp = this.$store.cryptService.decryptWithSenderPublicKey(encryptedText, this.publicKey);
                console.log("ALSO DECRYPTED TEXT");
                console.log(tmp);
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
            //this.cryptWorker = this.$store.state.cryptWorker;
        }
    }
</script>
