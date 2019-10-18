<template>
    <div id="information-settings">
                <form>
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
                            label="Зображення"
                            v-model="image"
                            @change="changeImage"
                    ></v-file-input>
                    <div class="mb-4"></div>
                    <p>Ваше зображення</p>
                    <v-img v-if="img" :src="img" class="user-image"></v-img>
                    <v-btn
                            class="mr-4 primary"
                            @click="submit"
                            :disabled="hasError"
                    >Зберегти</v-btn>
                    <v-btn @click="clear">Очистити</v-btn>
                </form>
    </div>
</template>

<script>
    import { validationMixin } from 'vuelidate';
    import { eventBus } from './../../main';
    import {
        required,
        minLength,
        maxLength,
    } from 'vuelidate/lib/validators';
    export default {
        name: "InformationSettings",
        mixins: [validationMixin],
        validations: {
            name: {
                required
            },
            phone: {
                required
            }
        },
        data() {
            return {
                alert: {
                    show:false,
                    type: 'success',
                    text: '',
                    dismissible: true
                },
                name: null,
                phone: null,
                image: null,
                img: null,
                oldImage:null
            };
        },
        computed: {
            changeImage() {
                if (null === this.image) {
                    this.img = this.oldImage;
                } else {
                    this.toBase64(this.image).then((res) => {
                        this.img = res;
                    });
                }
            },
            nameErrors() {
                const errors = [];
                if (!this.$v.name.$dirty) return errors;
                if (!this.$v.name.required) {
                    errors.push('Імя обовязкове для заповнення')
                }
                return errors;
            },
            phoneErrors() {
                const errors = [];
                if (!this.$v.phone.$dirty) return errors;
                !this.$v.phone.required &&
                errors.push('Телефон обовязковий для заповнення');
                return errors;
            },
            hasError() {
                return (
                    this.name === '' || this.phone === '' || this.$v.$anyError
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
            getUser() {
                this.$store.transportService.call('action.user.get', {})
                    .then((response) => {
                        let img = response.user.image;
                        this.img = img;
                        this.oldImage = img;
                        this.name = response.user.name;
                        this.phone = response.user.phone;
                        fetch(response.user.image)
                            .then(res => res.blob())
                            .then(blob => {
                                this.image =  new File([blob], "Your image");
                            })
                    })
                    .catch((error) => {
                        console.log(error);
                        eventBus.$emit('showalert', {
                            type: 'error',
                            text: error.args[0]
                        })
                    });
            },
            submit() {
                this.$v.$touch();
                this.$store.commit('setLoader', true);
                this.toBase64(this.image).then((res) => {
                    this.$store.transportService.call('action.user.edit', {name: this.name, phone: this.phone, image: res})
                        .then((response) => {
                            this.$store.commit('setLoader', false);
                            eventBus.$emit('showalert', {
                                type: 'success',
                                text: 'Ви успішно зберегли інофрмацію'
                            })

                        })
                        .catch((error) => {
                            eventBus.$emit('showalert', {
                                type: 'error',
                                text: error.args[0]
                            })
                        });
                })
            },
            clear() {
                this.$v.$reset();
            }
        },
        created() {
            this.getUser();
        }
    }
</script>

<style scoped>
    .user-image {
        max-width: 300px;
        margin-bottom: 40px;
    }
</style>
