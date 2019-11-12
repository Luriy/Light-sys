<template>
  <login-layout>
  	<div class="login-form-wrapper">
  		<div class="login-form">
  			<div class="login-form-togglers">
  				<router-link to="/register">Sign in</router-link>
  				<router-link to="/login">Login in</router-link>
  			</div>
  			<form v-if="step === 1" @submit.prevent="register">
  				<div class="login-form-input">
  					<input type="text" v-on:input="checkLoginType" v-on:focus="checkLoginType" id="login" v-model='user' placeholder="Email / phone">
  				</div>
  				<div class="login-form-button">
  					<button type="submit" class="btn">Register</button>
  				</div>
  			</form>
  			<form v-if="step === 2">
          <div>
            <div class="exchange-popup_title">
              <p class="transaction">Confirmation</p>
              <div class="phone-question" v-if="loginType === 'Phone'">
                <p class="question">We sent an SMS confirmation to the number</p>
                <div class="number-block">
                  <p class="number">{{user}}</p>
                  <router-link class="link" to="/">Wrong number?</router-link>
                </div>
              </div>
              <div class="email-question" v-else-if="loginType === 'Email'">
                <p class="question">We sent an email confirmation to the email</p>
                <div class="number-block">
                  <p class="number">{{user}}</p>
                  <router-link class="link" to="/">Wrong email?</router-link>
                </div>
              </div>
            </div>
            <div slot='smsNumber' class="exchange-popup_sms-number">
              <div class="flex justify-content-between">
                <input
                  class="number-input"
                  v-for="(input, index) in smsCodes"
                  v-model="input[index]"
                  @keyup="index !== (smsCodes.length - 1) ? $event.target.nextElementSibling.focus() : registerApprove()"
                  placeholder="_"
                  type="text"
                  maxLength="1"
                  size="1"
                  min="0"
                  max="9" pattern="[0-9]{1}"
                />
              </div>
              <div class="timer-body">
                <div class="title">Resend code:</div>
                <div class="timer">00:{{countdown}} Sec</div>
              </div>
            </div>
          </div>		
  			</form>
        <form v-if="step === 3" @submit.prevent="setPassword">
          <div class="login-form-input">
  					<input :type="isPasswordHidden ? 'password' : 'text'" v-model='password' placeholder="Password">
  				</div>
          <div class="login-form-input">
  					<input :type="isPasswordHidden ? 'password' : 'text'" v-model='repeatPassword' placeholder="Repeat password">
  				</div>
          <div class="validation-block flex flex-column">
            <div class="flex align-items-center">
              <div class="invalid-icon" v-if="!isPasswordContainNumber"></div>
              <img src="@/assets/images/done.svg" v-else />
              <p class="validation-text" :class="{ valid: isPasswordContainNumber }">
                Your password must contain at least one nubmer
              </p>
            </div>
            <div class="flex align-items-center">
              <div class="invalid-icon" v-if="!isPasswordLongEnough"></div>
              <img src="@/assets/images/done.svg" v-else />
              <p class="validation-text" :class="{ valid: isPasswordLongEnough }">
                Your password must be at least 6 characters long
              </p>
            </div>
            <div class="flex align-items-center">
              <div class="invalid-icon" v-if="!isPasswordsMatch"></div>
              <img src="@/assets/images/done.svg" v-else />
              <p class="validation-text" :class="{ valid: isPasswordsMatch }">
                Passwords match
              </p>
            </div>
          </div>
          <div class="login-form-button">
  					<button type="submit" class="btn">Register</button>
  				</div>
  			</form>
        <transition name="fade">
          <div class="error-block" v-if="commonError">
            <p class="error">{{commonError}}</p>
          </div>
        </transition>
        
      </div>
  	</div>
  </login-layout>
</template>
<style scoped>
  .transaction {
    margin-bottom: 0;
  }
  .error {
    margin-bottom: 0;
  }
  .validation-block {
    margin: 0 0 20px;
  }
  .validation-block .flex {
    margin-bottom: 12px;
  }
  .validation-block .flex:last-of-type {
    margin-bottom: 0;
  }
  .validation-text {
    margin: 0 0 0 12px;
    font-size: 13px;
    color: #db5353;
    opacity: 1;
  }
  .validation-text.valid {
    opacity: 0.8;
    color: #ffffff;
    margin: 0 0 0 9px;
  }
  .invalid-icon {
    width: 9px;
    height: 9px;
    border-radius: 4px;
    background-color: #ff3f3f;
  }
</style>
<script>
import LoginLayout from '@/layout/LoginLayout';
import axios from 'axios';
import Inputmask from 'inputmask';
import { API_URL } from "@/constants"
import { parsePythonArray } from '@/functions/helpers'
import sha512 from 'js-sha512';
import {AUTH_REQUEST} from '@/store/actions/auth'

export default {
  components: {
    LoginLayout
  },
  data() {
  	return {
  		loginType: null,
  		user: null,
  		step: 1,
      smsCodes: [
        {0: ''},
        {1: ''},
        {2: ''},
        {3: ''},
        {4: ''},
        {5: ''},
      ],
      timer: null,
      countdown: 59,
      commonError: null,
      password: '',
      repeatPassword: '',
      isPasswordHidden: false,
  	}
  },
  methods: {
  	registerApprove: function(){
	   const { smsCodes, user, loginType } = this;

        console.log(loginType === 'Email' ? user : '', loginType === 'Phone' ? user : '', smsCodes.map((smsCode, index) =>smsCode[index]).join(''))

		    axios({
          method: 'POST',
          url: API_URL,
          params: {
            Comand: 'AccountActivationPhone',
            Email: loginType === 'Email' ? user : '',
            Phone: loginType === 'Phone' ? user : '',
            Pin: smsCodes.map((smsCode, index) =>smsCode[index]).join('')
          }
        }).then(resp => {
          resp = eval("("+resp['data']+")");
          const errors = Object.values(resp[0]['Errors'])

	        if(errors.length) {
	        	this.commonError = errors[0];       	
	        } else {
            this.step = 3;
            this.commonError = null;
            clearInterval(this.timer);
          }
	      })		
  	},
    setPassword() {
      const { isPasswordLongEnough, isPasswordContainNumber, isPasswordsMatch, loginType, password, user } = this;
      
      if (isPasswordLongEnough && isPasswordContainNumber && isPasswordsMatch) {
        console.log({
          Comand: 'PasswordInstal',
          Email: 'somenewtestemail@3mailapp.net',
          Phone: loginType === 'Phone' ? user : '',
          Password: password,
        })
        axios({
          method: 'POST',
          url: API_URL,
          params: {
            Comand: 'PasswordInstall',
            Email: loginType === 'Email' ? user : '',
            Phone: loginType === 'Phone' ? user : '',
            Password: password,
          }
        }).then(resp => {
          const { loginType, user, password } = this;
          resp = eval("("+resp['data']+")");

          const errors = Object.values(resp[0]['Errors']);

          if (errors.length) {
            this.commonError = errors[0];
          } else {
            const params = new URLSearchParams();
            params.append('Phone', loginType === 'Phone' ? user : '');
            params.append('Email', loginType === 'Email' ? user : '');
            params.append('Password', sha512(password));
        		params.append('Comand', 'CheckLoginPassword');

            this.$store.dispatch(AUTH_REQUEST, params)
              .then(() => {
      		    	this.commonError = null;
      		    	this.$router.push('/')
      		    })
              .catch(err => {
      			    this.commonError = err;
              })
          }
        })
      } else return false;
    },
  	checkLoginType: function() {
  		var pattern = /^[\d\(\)\ \- \+ \_]{0,100}$/;
  		const loginType = pattern.test(this.user);
      this.loginType = loginType ? 'Phone' : 'Email'  
  		var im = new Inputmask("+9 (999) 999 99-99");	
  		if(this.loginType === 'Phone' && this.user && this.user != '+') {
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

    if(loginType === 'Phone') {
    	const phone = user.replace(/[^0-9]/gim,'');
   		params.append('Phone', phone); 
   		params.append('Email', '');
   	} else if (loginType === 'Email') { 
   		params.append('Email', user);
      params.append('Phone', '');
   	} else return null;
   	params.append('Comand', 'Newaccount');
   	params.append('BIO', '');
   	params.append('Passport', '');

    axios.post(API_URL, params)
      .then(resp => {
        resp = eval("("+resp['data']+")");
        const errors = Object.values(resp[0]['Errors']);

        if (errors.length) {
          this.commonError = errors[0];
        } else {
          this.step = 2;
          this.commonError = null;
          this.timer = setInterval(() => {
            this.countdown--
          }, 1000)
        }
      })
		},
  },
  watch: {
    countdown(value) {
      if (value === 0) {
        this.countdown = 59;
        // this.$store.dispatch('wallet/GET_TRANSFER_TOKEN', getAuthParams());
      }
    },
  },
  computed: {
    isPasswordLongEnough() {
      return this.password.length >= 6;
    },
    isPasswordContainNumber() {
      return this.password.split('').some(letter => !isNaN(letter));
    },
    isPasswordsMatch() {
      return this.password === this.repeatPassword;
    }
  }
}
</script>