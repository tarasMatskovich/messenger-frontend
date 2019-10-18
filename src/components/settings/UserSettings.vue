<template>
    <div id="user-settings" class="d-flex justify-center">
        <v-card class="settings-card">
            <v-toolbar flat color="cyan lighten-1 white--text" dark>
                <v-toolbar-title>Налаштування користувача</v-toolbar-title>
            </v-toolbar>
            <v-tabs vertical class="hidden-md-and-down" color="cyan lighten-1">
                <v-tab>
                    <v-icon left>mdi-account</v-icon>
                    Інформація
                </v-tab>
                <v-tab>
                    <v-icon left>mdi-lock</v-icon>
                    Безпека
                </v-tab>

                <v-tab-item>
                    <v-card flat>
                        <v-card-text>
                            <information-settings></information-settings>
                        </v-card-text>
                    </v-card>
                </v-tab-item>
                <v-tab-item>
                    <v-card flat>
                        <v-card-text>
                           <security-settings></security-settings>
                        </v-card-text>
                    </v-card>
                </v-tab-item>
            </v-tabs>
            <v-tabs horizontal class="hidden-md-and-up" color="cyan lighten-1">
                <v-tab>
                    <v-icon left>mdi-account</v-icon>
                    Інформація
                </v-tab>
                <v-tab>
                    <v-icon left>mdi-lock</v-icon>
                    Безпека
                </v-tab>

                <v-tab-item>
                    <v-card flat>
                        <v-card-text>
                            <information-settings></information-settings>
                        </v-card-text>
                    </v-card>
                </v-tab-item>
                <v-tab-item>
                    <v-card flat>
                        <v-card-text>
                            <security-settings></security-settings>
                        </v-card-text>
                    </v-card>
                </v-tab-item>
            </v-tabs>
        </v-card>
    </div>
</template>

<script>
    import InformationSettings from './InformationSettings';
    import SecuritySettings from './SecuritySettings'

    export default {
        name: "UserSettings",
        components: {
            InformationSettings,
            SecuritySettings
        }
    }
</script>

<style scoped>
    #user-settings {
        margin-top: 50px;
    }

    .settings-card {
        width: 60%;
    }

    @media (max-width: 1000px) {
        .settings-card {
            width: 90%;
        }
    }

</style>
