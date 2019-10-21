<template>
    <div id="sign-in-form">
        <v-container>
            <v-row justify="center">
                <v-col cols="12" sm="4">
                    <v-alert v-model="alert.show" :type="alert.type" :dismissible="alert.dismissible">
                        {{alert.text}}
                    </v-alert>
                    <v-card>
                        <v-card-text>
                            <form>
                                <v-text-field
                                    v-model="email"
                                    :error-messages="emailErrors"
                                    label="E-mail"
                                    required
                                    @input="$v.email.$touch()"
                                    @blur="$v.email.$touch()"
                                ></v-text-field>
                                <v-text-field
                                    v-model="password"
                                    :error-messages="passwordErrors"
                                    label="Пароль"
                                    required
                                    counter="255"
                                    @input="$v.password.$touch()"
                                    @blur="$v.password.$touch()"
                                ></v-text-field>
                                <v-text-field
                                        v-if="otpRequired"
                                        v-model="otpCode"
                                        label="Код"
                                        required
                                ></v-text-field>
                                <div class="mb-4"></div>
                                <v-btn
                                    class="mr-4 primary"
                                    @click="submit"
                                    :disabled="hasError"
                                    >Ввійти</v-btn
                                >
                                <v-btn @click="clear">Очистити</v-btn>
                            </form>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import { validationMixin } from 'vuelidate';
import {
    required,
    minLength,
    maxLength,
    email
} from 'vuelidate/lib/validators';

export default {
    name: 'SignInForm',
    mixins: [validationMixin],
    validations: {
        password: {
            required,
            minLength: minLength(5),
            maxLength: maxLength(256)
        },
        email: { required, email }
    },
    data() {
        return {
            email: '',
            password: '',
            alert: {
                show:false,
                type: 'success',
                text: '',
                dismissible: true
            },
            otpRequired: false,
            otpCode: null,
        };
    },
    computed: {
        passwordErrors() {
            const errors = [];
            if (!this.$v.password.$dirty) return errors;
            !this.$v.password.minLength &&
                errors.push('Пароль повинен містити не менше 5 символів');
            !this.$v.password.maxLength &&
                errors.push('Пароль повинен містити не більше 256 символів');
            !this.$v.password.required &&
                errors.push('Пароль обовязковий для заповнення');
            return errors;
        },
        emailErrors() {
            const errors = [];
            if (!this.$v.email.$dirty) return errors;
            !this.$v.email.email && errors.push('Некоректний E-mail');
            !this.$v.email.required &&
                errors.push('E-mail обовязкове для заповнення');
            return errors;
        },
        hasError() {
            return (
                this.email === '' || this.password === '' || this.$v.$anyError
            );
        }
    },
    methods: {
        submit() {
            this.$v.$touch();
            this.$store.commit('setLoader', true);
            this.$store.transportService.call('action.user.signin', {email:this.email, password: this.password, code: this.otpCode})
                .then((response) => {
                    this.$store.commit('setLoader', false);
                    let user = response.user;
                    user.token = response.token;
                    this.$store.commit('setUser', user);
                    localStorage.setItem('user', JSON.stringify(user));
                    this.showSuccessAlert('Ви успішно ввійшли');

                })
                .catch((error) => {
                    let errorMsg = error.args[0];
                    if (errorMsg === 'У вас ввімкнена двохфакторна аутентицікація - введіть код') {
                        this.otpRequired = true;
                    }
                    this.$store.commit('setLoader', false);
                    this.showErrorAlert(error.args[0]);
                    console.log(error);
                });
        },
        showSuccessAlert(text) {
            this.alert.text = text;
            this.alert.type = 'success';
            this.alert.show = true;
        },
        showErrorAlert(text) {
            this.alert.text = text;
            this.alert.type = 'error';
            this.alert.show = true;
        },
        clear() {
            this.$v.$reset();
            this.email = '';
            this.password = '';
        }
    }
};
</script>

<style scoped></style>
