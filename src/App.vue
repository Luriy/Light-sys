<template>
  <div id="app">
    <router-view v-if="isReady"></router-view>
    <template v-if="error && error.message">
      <v-snackbar
        :timeout="5000"
        :multi-line="true"
        :color="error.message"
        @input="closeError"
        :value="true"
      >
        {{error.message}}
        <v-btn flat dark @click.native="closeError">Close</v-btn>
      </v-snackbar>
    </template>
  </div>
</template>

<script>
import {AUTH_REQUEST, AUTH_LOGOUT} from '@/store/actions/auth'

export default {
  name: 'App',
  data: () => ({
    isReady: false,
  }),
  methods: {
    closeError () {
      this.$store.dispatch('alerts','clearError')
    }
  },
  computed: {
    error () {
      return this.$store.getters['alerts/error']
    }
  },
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
