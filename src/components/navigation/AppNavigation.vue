<template>
    <div>
        <v-navigation-drawer v-model="drawer" absolute temporary>
            <v-list-item v-if="user">
                <v-list-item-avatar>
                    <v-img
                        src="https://randomuser.me/api/portraits/men/78.jpg"
                    ></v-img>
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
                    <v-list-item-title
                        >Зареєструйтесь, щоб почати роботу</v-list-item-title
                    >
                </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <div>
                <v-list v-if="user" dense>
                    <v-list-item v-for="item in items" :key="item.title" link>
                        <v-list-item-icon>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                            <v-list-item-title>{{
                                item.title
                            }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
                <v-list v-else>
                    <v-list-item
                        v-for="item in defaultItems"
                        :key="item.title"
                        link
                        :to="item.link"
                    >
                        <v-list-item-icon>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                            <v-list-item-title>{{
                                item.title
                            }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </div>
        </v-navigation-drawer>
        <v-toolbar class="cyan lighten-1 white--text">
            <v-app-bar-nav-icon
                class="white--text hidden-sm-and-up"
                @click="drawer = !drawer"
            ></v-app-bar-nav-icon>
            <v-toolbar-title>
                <router-link to="/" class="main-title">
                    <span>
                        {{ appTitle }}
                    </span>
                </router-link>
            </v-toolbar-title>

            <div class="flex-grow-1"></div>
            <v-toolbar-items v-if="!user" class="hidden-xs-only">
                <v-btn
                    text
                    class="white--text"
                    v-for="item in defaultItems"
                    :key="item.title"
                    :to="item.link"
                >
                    <span>
                        {{ item.title }}
                    </span>
                    <v-icon>{{ item.icon }}</v-icon>
                </v-btn>
            </v-toolbar-items>
            <v-toolbar-items v-else class="hidden-xs-only">
                <v-btn
                    text
                    class="white--text"
                    v-for="item in items"
                    :key="item.title"
                    :to="item.link"
                >
                    <span>
                        {{ item.title }}
                    </span>
                    <v-icon>{{ item.icon }}</v-icon>
                </v-btn>
            </v-toolbar-items>
        </v-toolbar>
    </div>
</template>

<script>
export default {
    name: 'AppNavigation',
    data() {
        return {
            appTitle: 'Secure Messenger',
            drawer: false,
            user: null,
            items: [],
            defaultItems: [
                {
                    title: 'Увійти',
                    icon: 'mdi-login',
                    link: '/sign-in'
                },
                {
                    title: 'Зареєстурватись',
                    icon: 'mdi-account',
                    link: '/sign-up'
                }
            ]
        };
    }
};
</script>

<style scoped>
    a.main-title {
        color: #fff;
        text-decoration: none;
    }
</style>
