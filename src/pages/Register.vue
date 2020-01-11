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
      					<input 
                  type="text" 
                  @input="loginType = checkLoginType($event.target, loginType, user)" 
                  @focus="loginType = checkLoginType($event.target, loginType, user)" 
                  id="login" 
                  v-model='user' 
                  placeholder="Email / phone"
                >
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
                  <enter-code :smsCodes="smsCodes" @onSmsKeyUp="handleSmsKeyUp"></enter-code>
                  <div class="timer-body">
                    <div class="title">Resend code:</div>
                    <div class="timer" v-if="countdown > 0">00:{{`${countdown < 10 ? '0' : ''}${countdown}`}} Sec</div>
                    <p class="repeat-btn" v-if="countdown === 0" @click="resendPin">Repeat</p>
                  </div>
                  <error :error="commonError"></error>
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
                  <img src="@/assets/images/icons/done.svg" v-else />
                  <p class="validation-text" :class="{ valid: isPasswordContainNumber }">
                    Your password must contain at least one number
                  </p>
                </div>
                <div class="flex align-items-center">
                  <!-- <div class="invalid-icon" v-if="!isPasswordLongEnough"></div> -->
                  <img v-if="!isPasswordLongEnough" src="@/assets/images/cross.png" />
                  <img src="@/assets/images/icons/done.svg" v-else />
                  <p class="validation-text" :class="{ valid: isPasswordLongEnough }">
                    Your password must be at least 6 characters long
                  </p>
                </div>
                <div class="flex align-items-center">
                  <!-- <div class="invalid-icon" v-if="!isPasswordsMatch"></div> -->
                  <img v-if="!isPasswordsMatch" src="@/assets/images/cross.png" />
                  <img src="@/assets/images/icons/done.svg" v-else />
                  <p class="validation-text" :class="{ valid: isPasswordsMatch }">
                    Passwords match
                  </p>
                </div>
              </div>
              <div class="login-form-button">
      					<button type="submit" class="btn">Register</button>
      				</div>
              <error :error="commonError"></error>
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
import { BASE_URL } from '@/settings/config';
import sha512 from 'js-sha512';
import { AUTH_REQUEST, AUTH_LOGOUT } from '@/store/actions/auth'
import checkLoginType from '@/functions/checkLoginType'
import Error from '@/components/Error';
import EnterCode from '@/components/EnterCode';

export default {
  components: {
    LoginLayout,
    Error,
    EnterCode,
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
    handleSmsKeyUp(e, index) {
      const inputs = document.querySelectorAll('input.number-input');
			if (e.key === 'Backspace') {
				if (index !== 0) {
					inputs[index - 1].focus();
        }
        this.smsCodes[index][index] = '';
			} else if (e.key === 'Tab') {
				return false;
			} else {
				index !== this.smsCodes.length - 1 ? inputs[index + 1].focus() : this.registerApprove();
			}
		},
  	async registerApprove(){
	    const { user, loginType, smsCodes } = this;

      const resp = await this.$store.dispatch('user/REGISTER_APPROVE', { user, loginType, smsCodes });
      const errors = Object.values(resp[0]['Errors']);

      if(errors.length) {
      	this.commonError = errors[0];
      } else {
        this.step = 3;
        this.commonError = null;
        clearInterval(this.timer);
      }
  	},
    async setPassword() {
      const { isPasswordLongEnough, isPasswordContainNumber, isPasswordsMatch, loginType, password, user } = this;

      if (isPasswordLongEnough && isPasswordContainNumber && isPasswordsMatch) {
        const resp = await this.$store.dispatch('user/SET_PASSWORD', { loginType, user, password })

        const errors = Object.values(resp[0]['Errors']);

        if (errors.length) {
          this.commonError = errors[0];
        } else {
          const params = new URLSearchParams();
          params.append('Phone', loginType === 'Phone' ? user : '');
          params.append('Email', loginType === 'Email' ? user.replace(/[^0-9]/gim, '') : '');
          params.append('Password', sha512(password));
      		params.append('Comand', 'CheckLoginPassword');

          this.$store.dispatch(AUTH_REQUEST, params)
            .then(() => {
              const currenciesAddedByDefault = ['RUR', 'USD'];
              currenciesAddedByDefault.forEach(currency => {
                this.$store.dispatch('currency/ADD_USER_CURRENCY', { ValuteName: currency })
              }).then(() => {
                this.$store.dispatch('currency/GET_USER_CURRENCIES');
              })
              
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
      } else return false;
    },
	  async register() {
      const { user, loginType } = this;

      this.commonError = null;
      this.$store.dispatch('user/REGISTER', { loginType, user })
        .then(resp => {
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
      this.smsCodes = [
        {0: ''},
        {1: ''},
        {2: ''},
        {3: ''},
        {4: ''},
        {5: ''},
      ];
      this.commonError = null;
      this.countdown = 59;
      this.timer = setInterval(() => {
        this.countdown--
      }, 1000)
      this.$store.dispatch('user/RESEND_PASSWORD', {
        Email: loginType === 'Email' ? user : '',
        Phone: loginType === 'Phone' ? user : '',
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
