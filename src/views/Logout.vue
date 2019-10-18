<template>
    <div>
    </div>
</template>

<script>
    export default {
        name: "Logout",
        methods: {
            logout() {
                this.$store.commit('setUser', null);
                localStorage.removeItem('user');
                this.$router.push('/sign-in');
            }
        },
        created() {
            this.logout();
        }
    }
</script>

<style scoped>

</style>
