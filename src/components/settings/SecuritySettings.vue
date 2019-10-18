<template>
    <div id="security-settings">
        <v-list
                subheader
                two-line
                flat
        >
            <v-subheader>Налаштування безпеки</v-subheader>

            <v-list-item-group
                    multiple
            >
                <v-list-item>
                    <template>
                        <v-list-item-action>
                            <v-checkbox
                                    v-model="secondFactor"
                                    color="primary"
                            ></v-checkbox>
                        </v-list-item-action>

                        <v-list-item-content>
                            <v-list-item-title>Двохфакторна аутентицікація</v-list-item-title>
                            <v-list-item-subtitle>Двохфакторна аутентицікація за допомогою TOTP коду</v-list-item-subtitle>
                        </v-list-item-content>
                    </template>
                </v-list-item>
                <v-list-item v-if="secondFactor && qrCodeUrl">
                    <v-list-item-content>
                        <v-subheader>Відскануйте даний QR код за допомогою додатку Google Authenticator у своєму телефоні та впишіть отриманий код у поле нижче</v-subheader>
                        <v-img :src="qrCodeUrl" max-width="300px"></v-img>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item v-if="secondFactor">
                    <v-list-item-content>
                        <v-subheader>Код отриманий з додатку</v-subheader>
                        <v-text-field
                                v-model="code"
                                :error-messages="codeErrors"
                                label="Код"
                                required
                                @input="$v.code.$touch()"
                                @blur="$v.code.$touch()"
                        ></v-text-field>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item>
                    <v-btn color="primary" :disabled="emptyCode" @click="submit">Зберегти</v-btn>
                </v-list-item>


            </v-list-item-group>
        </v-list>
    </div>
</template>

<script>

    import { eventBus } from './../../main';
    import { validationMixin } from 'vuelidate';
    import {
        required,
    } from 'vuelidate/lib/validators';

    export default {
        name: "SecuritySettings",
        mixins: [validationMixin],
        validations: {
            code: {
                required,
            },
        },
        data() {
            return {
                user: null,
                secondFactor: false,
                qrCodeUrl: null,
                code: null
            }
        },
        computed: {
            codeErrors() {
                const errors = [];
                if (!this.$v.code.$dirty) return errors;
                !this.$v.code.required &&
                errors.push('Введіть код');
                return errors;
            },
            emptyCode()
            {
                return this.secondFactor === true && (this.code === null || this.code === '');
            }
        },
        methods: {
            getUser() {
                this.$store.transportService.call('action.user.get', {})
                    .then((response) => {
                        console.log(response);
                        let secondFactor = response.user.secondFactor;
                        this.user = response.user;
                        if (null === secondFactor || 0 === secondFactor) {
                            this.secondFactor = false;
                        } else {
                            this.secondFactor = true;
                        }
                        this.$store.transportService.call('action.user.auth.secondfactor.getinfo',{})
                            .then((response) => {
                                this.qrCodeUrl = response.qrCodeUrl;
                            })
                            .catch((error) => {
                                eventBus.$emit('showalert', {
                                    type: 'error',
                                    text: error.args[0]
                                })
                            });
                    })
                    .catch((error) => {
                        eventBus.$emit('showalert', {
                            type: 'error',
                            text: error.args[0]
                        })
                    });
            },
            submit() {
                let data = {};
                if (this.secondFactor) {
                    data = {
                        secondFactor: 'TOTP',
                        code: this.code
                    };
                } else {
                    data = {
                        secondFactor: 'NOTHING'
                    };
                }
                this.$store.transportService.call('action.user.auth.secondfactor.set', data).then((response) => {
                    eventBus.$emit('showalert', {
                        type: 'success',
                        text: 'Зміни були успішно збережені'
                    })
                }).catch((error) => {
                    eventBus.$emit('showalert', {
                        type: 'error',
                        text: error.args[0]
                    })
                });
            }
        },
        created() {
            this.getUser();
        }
    }
</script>

<style scoped>

</style>
