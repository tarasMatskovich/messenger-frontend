<template>
    <div id="settings">
        <div class="d-flex justify-center">
            <v-alert class="settings-alert" v-model="alert.show" :type="alert.type" :dismissible="alert.dismissible">
                {{alert.text}}
            </v-alert>
        </div>
        <user-settings></user-settings>
    </div>
</template>

<script>

    import UserSettings from '../components/settings/UserSettings'
    import { eventBus } from '../main';

    export default {
        name: "Settings",
        components: {
            UserSettings
        },
        data() {
            return {
                alert: {
                    show:false,
                    type: 'success',
                    text: '',
                    dismissible: true
                }
            };
        },
        created() {
            eventBus.$on('showalert', (alert) => {
                this.alert.type = alert.type;
                this.alert.text = alert.text;
                this.alert.show = true;
            })
        }
    }
</script>

<style scoped>
    .settings-alert {
        width: 60%;
        margin-top: 20px;
    }
</style>
