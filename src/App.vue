<template>
  <div id="app">
    <router-view v-if="isReady"></router-view>
  </div>
</template>

<script>
import {AUTH_REQUEST, AUTH_LOGOUT} from '@/store/actions/auth'

export default {
  name: 'App',
  data: () => ({
    isReady: false,
  }),
  created() {
    this.$store.dispatch(AUTH_REQUEST, localStorage.getItem('Data'))
      .then(() => {
        this.isReady = true;
      })
      .catch(err => {
        this.isReady = true;
        this.error = err;
        this.$store.dispatch(AUTH_LOGOUT)
        this.$router.push('/')
      });
  }
}
</script>

<style>
</style>
