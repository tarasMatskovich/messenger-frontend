<template>
    <div>
        <v-row>
            <v-col cols="1">
                <v-avatar size="70">
                    <img
                            :src="message.user.image"
                            alt="Avatar"
                    >
                </v-avatar>
            </v-col>
            <v-col cols="3">
                <v-card :class="isUserSender(message.user.id) ? 'cyan lighten-4' : ''">
                    <v-card-title class="subtitle-2">{{message.user.name}}</v-card-title>
                    <v-card-text>
                        <span class="message-content">{{message.content}}</span>
                        <span class="message-date">{{message.createdAt}}</span>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script>
    export default {
        name: "Message",
        props: ['message'],
        methods: {
            isUserSender(userId) {
                return userId === this.$store.state.user.id;
            }
        }
    }
</script>

<style scoped>
    .message-date {
        float: right;
        margin-top: 10px;
        font-size: 12px;
    }
</style>
