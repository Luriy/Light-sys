<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import {AUTH_REQUEST, AUTH_LOGOUT} from '@/store/actions/auth'
export default {
  name: 'App',
  created: function() {  	
  	this.$store.dispatch(AUTH_REQUEST, localStorage.getItem('Data')).then(() => {

    }).catch(err => {
	    this.error = err;
		this.$store.dispatch(AUTH_LOGOUT)
		this.$router.push('/')
	})
  }
}
</script>

<style>
</style>
