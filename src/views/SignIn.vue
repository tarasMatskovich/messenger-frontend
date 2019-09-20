<template>
    <div id="sign-in">
        <v-container>
            <v-row align="center" justify="center" style="height: calc(100vh - 100px);">
                <v-col>
                    <v-row class="text-center">
                        <v-col>
                            <div class="title">
                                Увійдіть, щоб почати користуватись SecureMessenger
                            </div>
                        </v-col>
                    </v-row>
                    <sign-in-form/>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>

    import SignInForm from './../components/sign-in/SignInForm'

    export default {
        name: "SignIn",
        components: {
            SignInForm
        }
    }
</script>

<style scoped>

</style>
