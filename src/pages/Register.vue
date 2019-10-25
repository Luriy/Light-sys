<template>
  <login-layout>
  	<div class="login-form-wrapper">
		<div class="login-form">
			<div class="login-form-togglers">
				<router-link to="/register">Sign in</router-link>
				<router-link to="/login">Login in</router-link>
			</div>
			<form v-if="!secondStep" @submit.prevent="register">
				<div class="login-form-input">
					<input type="text" v-on:input="checkLoginType" v-on:focus="checkLoginType" id="login" v-model='user' placeholder="Email / phone">
				</div>
				<div class="login-form-button">
					<button class="btn">Register</button>
				</div>
				{{info}}
			</form>
			<form v-if="secondStep">
				<p>Sent a confirmation code to the number {{user}}</p>
				<div class="login-form-input">
					<input type="text" v-on:input="registerApprove" id="login" v-model='code' placeholder="Confirmation code">
				</div>	
				{{info}}			
			</form>
		</div>
  	</div>
  </login-layout>
</template>

<script>
import LoginLayout from '@/layout/LoginLayout';
import axios from 'axios';
import Inputmask from 'inputmask';
export default {
  components: {
    LoginLayout
  },
  data() {
  	return {
  		loginType:false,
  		user:null,
  		secondStep:false,
  		code:null,
  		info:null
  	}
  },
    methods: {
    	registerApprove: function(){
		   const { code, user } = this;
    		if(code.length>=6) {
    			const params = new URLSearchParams();
			   	params.append('Comand', 'AccountActivationPhone');
		    	const phone = user.replace(/[^0-9]/gim,'');
		   		params.append('Phone', phone); 
			   	params.append('Pin', code);

			    axios.post('https://apidomenpyth.ru', params).then(resp => {
			      	resp = eval("("+resp['data']+")");
			        if(!resp[0]['Errors']['1005']) {
			        	this.$router.push('/')			        	
			        } else {
			        	this.info = resp[0]['Errors']['1001'];
			        }
		        })		
    		}
    	},
    	checkLoginType: function() {
    		var pattern = /^[\d\(\)\ \- \+ \_]{0,100}$/;
    		this.loginType = pattern.test(this.user);    
    		var im = new Inputmask("+9 (999) 999 99-99");	
    		if(this.loginType && this.user && this.user != '+') {
    			im.mask(document.getElementById('login'));
    		} else {
    			if(document.getElementById('login').inputmask) {
    				document.getElementById('login').inputmask.remove();    				
    			}
    		}
    	},
		register: function () {
		   const { user, loginType } = this;
		   const params = new URLSearchParams();
		    this.secondStep = true;
		    if(loginType) {
		    	const phone = user.replace(/[^0-9]/gim,'');
		   		params.append('Phone', phone); 
		   		params.append('Email', '');
		   	} else { 
		   		params.append('Email', user); params.append('Phone', '');
		   	}
		   	params.append('Comand', 'Newaccount');
		   	params.append('BIO', '');
		   	params.append('Passport', '');
		   	params.append('Pin', '123456');

		    axios.post('https://apidomenpyth.ru', params)
	        .then(resp => {
		      	resp = eval("("+resp['data']+")");
		        if(!resp[0]['Errors']['1001']) {
		        } else {
		        	//this.info = resp[0]['Errors']['1001'];
		        }
	        })
		}
    },
}
</script>