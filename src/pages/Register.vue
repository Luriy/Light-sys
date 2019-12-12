<template>
  <login-layout>
  	<div class="login-form-wrapper">
      <div class="login-form-container">
        <div class="login-form-togglers">
  				<router-link to="/register">Sign up</router-link>
  				<router-link to="/login">Login in</router-link>
  			</div>
        <transition name="fade-long-absolute">
      		<div class="login-form" v-if="step === 1 && isLoaded">
      			<form @submit.prevent="register">
      				<div class="login-form-input">
      					<input type="text" v-on:input="loginType = checkLoginType($event.target, loginType, user)" v-on:focus="loginType = checkLoginType($event.target, loginType, user)" id="login" v-model='user' placeholder="Email / phone">
      				</div>
      				<div class="login-form-button">
      					<button type="submit" class="btn">Register</button>
      				</div>
              <error :error="commonError"></error>
      			</form>
          </div>
        </transition>
        <transition name="fade-long-absolute">
          <div class="login-form" v-if="step === 2">
      			<form>
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
                      v-bind:key="index"
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
                    <div class="timer" v-if="countdown > 0">00:{{`${countdown < 10 ? '0' : ''}${countdown}`}} Sec</div>
                    <p class="repeat-btn" v-if="countdown === 0" @click="resendPin">Repeat</p>
                  </div>
                  <transition name="fade">
                    <div class="error-block" v-if="commonError">
                      <p class="error">{{commonError}}</p>
                    </div>
                  </transition>
                </div>
              </div>
      			</form>
          </div>
        </transition>
        <transition name="fade-long-absolute">
          <div class="login-form" v-if="step === 3">
            <form @submit.prevent="setPassword">
              <div class="login-form-input">
      					<input :type="isPasswordHidden ? 'password' : 'text'" v-model='password' placeholder="Password">
                <div class="is-password-hidden-icon-block is-password-hidden-icon" @click="isPasswordHidden = !isPasswordHidden" v-if="!isPasswordHidden">
                  <img
                    class=""
                    src="@/assets/images/eye.svg"
                  />
                </div>
                <div class="is-password-hidden-icon-block is-password-hidden-icon" @click="isPasswordHidden = !isPasswordHidden" v-if="isPasswordHidden">
                  <img
                    class=""
                    src="@/assets/images/eye-with-bar.svg"
                  />
                </div>
      				</div>
              <div class="login-form-input">
      					<input :type="isPasswordHidden ? 'password' : 'text'" v-model='repeatPassword' placeholder="Repeat password">
      				</div>
              <div class="validation-block flex flex-column">
                <div class="flex align-items-center">
                  <img v-if="!isPasswordContainNumber" src="@/assets/images/cross.png" />
                  <!-- <div class="invalid-icon"></div> -->
                  <img src="@/assets/images/done.svg" v-else />
                  <p class="validation-text" :class="{ valid: isPasswordContainNumber }">
                    Your password must contain at least one number
                  </p>
                </div>
                <div class="flex align-items-center">
                  <!-- <div class="invalid-icon" v-if="!isPasswordLongEnough"></div> -->
                  <img v-if="!isPasswordLongEnough" src="@/assets/images/cross.png" />
                  <img src="@/assets/images/done.svg" v-else />
                  <p class="validation-text" :class="{ valid: isPasswordLongEnough }">
                    Your password must be at least 6 characters long
                  </p>
                </div>
                <div class="flex align-items-center">
                  <!-- <div class="invalid-icon" v-if="!isPasswordsMatch"></div> -->
                  <img v-if="!isPasswordsMatch" src="@/assets/images/cross.png" />
                  <img src="@/assets/images/done.svg" v-else />
                  <p class="validation-text" :class="{ valid: isPasswordsMatch }">
                    Passwords match
                  </p>
                </div>
              </div>
              <div class="login-form-button">
      					<button type="submit" class="btn">Register</button>
      				</div>
              <transition name="fade">
                <div class="error-block" v-if="commonError">
                  <p class="error">{{commonError}}</p>
                </div>
              </transition>
      			</form>
          </div>
        </transition>
      </div>
  	</div>
  </login-layout>
</template>
<style scoped>

</style>
<script>
import LoginLayout from '@/layout/LoginLayout';
import Axios from 'axios';
import { API_URL } from "@/constants"
import { parsePythonDataObject } from '@/functions/helpers'
import sha512 from 'js-sha512';
import { AUTH_REQUEST, AUTH_LOGOUT } from '@/store/actions/auth'
import checkLoginType from '@/functions/checkLoginType'
import Error from '@/components/Error';

export default {
  components: {
    LoginLayout,
    Error
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
      password: '',
      repeatPassword: '',
      isPasswordHidden: true,
      isLoaded: false,
  	}
  },
  mounted() {
    this.isLoaded = true;
  },
  methods: {
    checkLoginType,
  	registerApprove: function(){
	    const { smsCodes, user, loginType } = this;

	    Axios({
        method: 'POST',
        url: API_URL,
        params: {
          Comand: 'AccountActivationPhone',
          Email: loginType === 'Email' ? user : '',
          Phone: loginType === 'Phone' ? user : '',
          Pin: smsCodes.map((smsCode, index) =>smsCode[index]).join('')
        }
      }).then(resp => {
        resp = parsePythonDataObject(resp);
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
        Axios({
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
          resp = parsePythonDataObject(resp);

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
                this.$router.push('/wallets');
                setTimeout(() => {
                    this.$store.commit('alerts/setNotification', {
                    message: 'You have successfully registered!',
                    status: 'success-status',
                    icon: 'done'
                  })
                }, 1500)

      		    })
              .catch(err => {
      			    this.commonError = err;
              })
          }
        })
      } else return false;
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
   	params.append('Comand', 'Newaccount2');
   	params.append('BIO', '');
   	params.append('Passport', '');

    this.commonError = null;

    Axios.post(API_URL, params)
      .then(resp => {
        resp =parsePythonDataObject(resp);
        const errors = Object.values(resp[0]['Errors']);

        if (errors.length) {
          this.commonError = errors[0];
        } else {
          this.step = 2;
          this.commonError = null;
          setTimeout(() => {
						document.querySelector('.login-form .number-input').focus();
					}, 50);
          this.countdown = 59;
          this.timer = setInterval(() => {
            this.countdown--
          }, 1000)
        }
      })
    },
    resendPin() {
      const { loginType, user } = this;
      this.$store.dispatch('user/USER_RESEND_PASSWORD', {
        Email: loginType === 'Email' ? user : '',
        Phone: loginType === 'Phone' ? user : '',
      }).then((data) => {
        if (data.success) {
          this.commonError = null;
          this.countdown = 59;
          this.timer = setInterval(() => {
            this.countdown--
          }, 1000)
        } else {
          this.commonError = data.errors[0];
        }

      })
    }
  },
  watch: {
    countdown(value) {
      if (value === 0) {
        clearInterval(this.timer);
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
<style scoped lang="scss">
  .login-form-input {
    position: relative;
  }
  .is-password-hidden-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 25px;
    cursor: pointer;
    /* opacity: .5; */

    /* &.active {
      opacity: 1;
    } */
  }
  .is-password-hidden-icon-block {
    width: 20px;
    height: 19px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
