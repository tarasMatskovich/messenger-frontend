<template>
    <div>
        <v-card
                class="mini-message"
                max-width="344"
                raised
        >
            <v-list-item three-line>
                <v-list-item-content>
                    <div class="overline mb-4">Нове повідомлення</div>
                    <v-list-item-title class="headline mb-1">{{message.user.name}}</v-list-item-title>
                    <v-list-item-subtitle>{{message.content}}</v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-avatar
                        tile
                        size="80"
                >
                    <v-img :src="message.user.image" class="message-user-image"></v-img>
                </v-list-item-avatar>
            </v-list-item>

            <v-card-actions>
                <v-btn small color="error" @click="closeMessage">Закрити</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script>
    export default {
        name: "MiniMessage",
        props: ['message'],
        methods: {
            closeMessage() {
                this.$parent.closeNotify();
            }
        }
    }
</script>

<style scoped>
    .message-user-image {
        border-radius: 5px;
    }

    .mini-message {
        position: absolute;
        bottom: 40px;
        right: 40px;
    }
</style>
