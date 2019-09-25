<template>
    <div id="home">
        <v-container>
            <v-row justify="center">
                <v-col cols="12" sm="4">
                    <v-alert v-model="alert.show" :type="alert.type" :dismissible="alert.dismissible">
                        {{alert.text}}
                    </v-alert>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
export default {
    name: 'home',
    data() {
        return {
            alert: {
                show:false,
                type: 'success',
                text: '',
                dismissible: true
            }
        }
    },
    components: {},
    methods: {
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
    },
    created() {
        this.$store.transportService.call('action.test', {userId:6, token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhdXRoLnNlY3VyZW1lc3Nlbmdlci5jb20udWEiLCJhdWQiOiJzZWN1cmVtZXNzZW5nZXIuY29tLnVhIiwidXNlcklkIjo2LCJleHAiOiIyMDE5LTA5LTI4In0.fe6IkAqBNsWlRsOCJETTbEFEVOoXKQHWn-m-mTJ0yxA'})
            .then((response) => {
                this.showSuccessAlert('Такий користувач є');
                console.log(response)
            })
            .catch((error) => {
                this.showErrorAlert(error.args[0]);
                console.log(error);
            });
    }
};
</script>
