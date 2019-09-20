<template>
    <div id="sign-in-form">
        <v-container>
            <v-row justify="center">
                <v-col cols="12" sm="4">
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
            password: ''
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
            setTimeout(() => {
                this.$store.commit('setLoader', false);
            }, 2000);
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
