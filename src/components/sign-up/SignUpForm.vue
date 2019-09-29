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
                                    v-model="name"
                                    :error-messages="nameErrors"
                                    label="Ім'я"
                                    required
                                    @input="$v.name.$touch()"
                                    @blur="$v.name.$touch()"
                                ></v-text-field>
                                <v-text-field
                                    v-model="phone"
                                    :error-messages="phoneErrors"
                                    label="Телефон"
                                    required
                                    @input="$v.phone.$touch()"
                                    @blur="$v.phone.$touch()"
                                ></v-text-field>
                                <v-file-input
                                    label="File input"
                                    v-model="img"
                                ></v-file-input>
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
    email,
    numeric
} from 'vuelidate/lib/validators';

export default {
    name: 'SignUpForm',
    mixins: [validationMixin],
    validations: {
        email: { required, email },
        name: { required, minLength: minLength(3), maxLength: maxLength(256) },
        phone: { required, numeric },
        password: {
            required,
            minLength: minLength(5),
            maxLength: maxLength(256)
        }
    },
    data() {
        return {
            email: '',
            name: '',
            phone: '',
            img: null,
            password: '',
            alert: {
                show: false,
                type: 'success',
                text: '',
                dismissible: true
            }
        };
    },
    computed: {
        emailErrors() {
            const errors = [];
            if (!this.$v.email.$dirty) return errors;
            !this.$v.email.email && errors.push('Некоректний E-mail');
            !this.$v.email.required &&
                errors.push("E-mail обов'язковий для заповнення");
            return errors;
        },
        nameErrors() {
            const errors = [];
            if (!this.$v.name.$dirty) return errors;
            !this.$v.name.required &&
                errors.push("Ім'я обов'язкове для заповнення");
            !this.$v.name.minLength &&
                errors.push("Ім'я повинно містити не менше 3 символів");
            !this.$v.name.maxLength &&
                errors.push("Ім'я повинно містити не більше ніж 256 символів");
            return errors;
        },
        phoneErrors() {
            const errors = [];
            if (!this.$v.phone.$dirty) return errors;
            !this.$v.phone.required &&
                errors.push("Телефон обов'язковий для заповнення");
            !this.$v.phone.numeric && errors.push('Некоректний телефон');
            return errors;
        },
        passwordErrors() {
            const errors = [];
            if (!this.$v.password.$dirty) return errors;
            !this.$v.password.minLength &&
                errors.push('Пароль повинен містити не менше 5 символів');
            !this.$v.password.maxLength &&
                errors.push('Пароль повинен містити не більше 256 символів');
            !this.$v.password.required &&
                errors.push("Пароль обов'язковий для заповнення");
            return errors;
        },
        hasError() {
            return (
                this.email === '' ||
                this.password === '' ||
                this.name === '' ||
                this.phone === '' ||
                this.$v.$anyError
            );
        }
    },
    methods: {
        toBase64(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });
        },
        submit() {
            this.$v.$touch();
            this.$store.commit('setLoader', false);
            let userPayload = this.getUserPayload();
            this.toBase64(this.img).then((res) => {
                userPayload.image = res;
                this.$store.transportService.call('action.user.signup', userPayload)
                    .then((response) => {
                        this.$store.commit('setLoader', false);
                        this.showSuccessAlert('Користувач був успішно створений');
                        console.log(response);
                    })
                    .catch((error) => {
                        this.$store.commit('setLoader', false);
                        this.showErrorAlert(error.args[0]);
                        console.log(error);
                    });
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
        getUserPayload() {
            return {
                name: this.name,
                email: this.email,
                phone: this.phone,
                image: null,
                password: this.password
            };
        },
        clear() {
            this.$v.$reset();
            this.email = '';
            this.name = '';
            this.phone = '';
            this.img = null;
            this.password = '';
        }
    }
};
</script>

<style scoped></style>
