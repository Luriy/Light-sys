<template>
  <login-layout>
  	<div class="login-form-wrapper">
      <div class="login-form-container">
        <div class="login-form-togglers">
  				<router-link to="/register">Sign in</router-link>
  				<router-link to="/login">Login in</router-link>
  			</div>
        <transition name="fade-long">
      		<div class="login-form" v-if="step === 1 && isLoaded">   
            <form @submit.prevent="getPin">
              <p class="recovery-title">
                Enter mail or phone number to restore access
              </p>
      				<div class="login-form-input">
      					<input type="text" v-on:input="loginType = checkLoginType($event.target, loginType, user)" v-on:focus="loginType = checkLoginType($event.target, loginType, user)" id="login" v-model='user' placeholder="Email / phone">
      				</div>
      				<div class="login-form-button">
      					<button type="submit" class="btn">Send</button>
      				</div>
              <transition name="fade-long">
                <div class="error-block" v-if="commonError">
                  <p class="error">{{commonError}}</p>
                </div>
              </transition>
      			</form>
            
          </div>
        </transition>
        <transition name="fade-long">
          <div class="login-form" v-if="step === 2"> 
            <form>
              <div>
                <div class="exchange-popup_title">
                  <p class="transaction">Recovery</p>
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
                      v-bind:key="index"
                      class="number-input"
                      v-for="(input, index) in smsCodes"
                      v-model="input[index]"
                      @keyup="index !== (smsCodes.length - 1) ? $event.target.nextElementSibling.focus() : sendPin()"
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
                  <transition name="fade-long">
                    <div class="error-block" v-if="commonError">
                      <p class="error">{{commonError}}</p>
                    </div>
                  </transition>
                </div>
              </div>		
      			</form>
          </div>
        </transition>
      </div>
  	</div>
  </login-layout>
</template>
<style scoped>
  .recovery-title {
    opacity: .65;
  }
  .transaction {
    padding-top: 0;
  }
</style>
<script>
import LoginLayout from '@/layout/LoginLayout';
import Axios from 'axios';
import { API_URL } from "@/constants"
import { parsePythonDataObject } from '@/functions/helpers'
import sha512 from 'js-sha512';
import {AUTH_REQUEST} from '@/store/actions/auth'
import checkLoginType from '@/functions/checkLoginType'

export default {
  components: {
    LoginLayout
  },
  data() {
  	return {
  		loginType: 'Email',
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
      isLoaded: false,
  	}
  },
  mounted() {
    this.isLoaded = true;
  },
  methods: {
    checkLoginType,
    getPin() {
      const { user, loginType } = this;
        Axios({ url: API_URL, method: 'POST', params: {
          Comand: 'PasswordRecoveryPhone',
          Phone: loginType === 'Phone' ? user : '',
          Email: loginType === 'Email' ? user : '',
        }}).then((resp) => {
          const data = parsePythonDataObject(resp);

          const errors = Object.values(data[0]['Errors']);

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
      this.step = 2;
    },
	  sendPin() {
      const { user, loginType, smsCodes } = this;

      Axios({ url: API_URL, method: 'POST', params: {
        Comand: 'PasswordRecoveryPin',
        Phone: loginType === 'Phone' ? user : '',
        Email: loginType === 'Email' ? user : '',
        Pin: smsCodes.map((smsCode, index) =>smsCode[index]).join(''),
      }}).then((resp) => {
        const data = parsePythonDataObject(resp);

        const errors = Object.values(data[0]['Errors']);

        if (errors.length) {
          this.commonError = errors[0];
        } else if (data[1].return['New Password'] === 'generated') {
          const params = new URLSearchParams();
          params.append('Phone', loginType === 'Phone' ? user : '');
          params.append('Email', loginType === 'Email' ? user : '');
          params.append('Password', sha512(data[1].return.Password));
      		params.append('Comand', 'CheckLoginPassword');

          this.$store.dispatch(AUTH_REQUEST, params)
          .then(() => {
            clearInterval(this.timer);
  		    	this.commonError = null;
            this.$router.push('/');
            this.$store.commit('wallet/setNotification', {
              message: `Password recovery has done! We have sent your new password to your ${loginType.toLowerCase()}`,
              status: 'success-status',
              icon: 'done'
            })
  		    })
          .catch(err => {
  			    this.commonError = err;
          })
        } else {
          this.commonError = 'Unknown error';
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
  }
}
</script>