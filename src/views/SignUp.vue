<template>
    <div id="sign-up">
        <v-container>
            <v-row
                align="center"
                justify="center"
                style="height: calc(100vh - 100px);"
            >
                <v-col>
                    <v-row class="text-center">
                        <v-col>
                            <div class="title">
                                Реєстрація в SecureMessenger
                            </div>
                        </v-col>
                    </v-row>
                    <sign-up-form />
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import SignUpForm from './../components/sign-up/SignUpForm';

export default {
    name: 'SignUp',
    components: {
        SignUpForm
    }
};
</script>

<style scoped></style>
