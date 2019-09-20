<template>
    <div>
        <v-navigation-drawer
                v-model="drawer"
                absolute
                temporary
        >
            <v-list-item v-if="user">
                <v-list-item-avatar>
                    <v-img src="https://randomuser.me/api/portraits/men/78.jpg"></v-img>
                </v-list-item-avatar>

                <v-list-item-content>
                    <v-list-item-title>John Leider</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item v-else>
                <v-list-item-avatar>
                    <v-icon>mdi-account-circle-outline</v-icon>
                </v-list-item-avatar>

                <v-list-item-content>
                    <v-list-item-title>Зареєструйтесь, щоб почати роботу</v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <v-list v-if="user" dense>
                <v-list-item
                        v-for="item in items"
                        :key="item.title"
                        link
                >
                    <v-list-item-icon>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
            <v-list v-else>
                <v-list-item
                        v-for="item in items"
                        :key="item.title"
                        link
                >
                    <v-list-item-icon>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar class="cyan lighten-1 white--text">
            <v-app-bar-nav-icon class="white--text" @click="drawer = !drawer"></v-app-bar-nav-icon>
            <v-toolbar-title>{{appTitle}}</v-toolbar-title>

            <div class="flex-grow-1"></div>

            <v-toolbar-items>
                <v-btn text class="white--text">
                    <span>
                        Увійти
                    </span>
                    <v-icon>mdi-login</v-icon>
                </v-btn>
                <v-btn text class="white--text">
                    <span>
                        Зареєструватись
                    </span>
                    <v-icon>mdi-account</v-icon>
                </v-btn>
            </v-toolbar-items>
        </v-toolbar>
    </div>
</template>

<script>
    export default {
        name: "AppNavigation",
        data() {
            return {
                appTitle: 'Secure Messenger',
                drawer: false,
                user:null,
                defaultItems: [
                    {
                        title: "Увійти",
                        icon: "mdi-login"
                    },
                    {
                        title: "Зареєстурватись",
                        icon: "mdi-account"
                    }
                ]
            }
        }
    }
</script>

<style scoped>

</style>
