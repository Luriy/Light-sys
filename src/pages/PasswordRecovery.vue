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
						<form @submit.prevent="getPin">
							<p class="recovery-title">
								Enter mail or phone number to restore access
							</p>
							<div class="login-form-input">
								<input
									type="text"
									v-on:input="loginType = checkLoginType($event.target, loginType, user)"
									v-on:focus="loginType = checkLoginType($event.target, loginType, user)"
									id="login"
									v-model="user"
									placeholder="Email / phone"
								/>
							</div>
							<div class="login-form-button">
								<button type="submit" class="btn">Send</button>
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
									<p class="transaction">Recovery</p>
									<div class="phone-question" v-if="loginType === 'Phone'">
										<p class="question">We sent an SMS confirmation to the number</p>
										<div class="number-block">
											<p class="number">{{ user }}</p>
											<router-link class="link" to="/">Wrong number?</router-link>
										</div>
									</div>
									<div class="email-question" v-else-if="loginType === 'Email'">
										<p class="question">We sent an email confirmation to the email</p>
										<div class="number-block">
											<p class="number">{{ user }}</p>
											<router-link class="link" to="/">Wrong email?</router-link>
										</div>
									</div>
								</div>
								<div slot="smsNumber" class="exchange-popup_sms-number">
									<enter-code :smsCodes="smsCodes" @onSmsKeyUp="handleSmsKeyUp"></enter-code>
									<div class="timer-body">
										<div class="title">Resend code:</div>
										<div class="timer" v-if="countdown > 0">
											00:{{ `${countdown < 10 ? '0' : ''}${countdown}` }} Sec
										</div>
										<p class="repeat-btn" v-if="countdown === 0" @click="repeatPin">Repeat</p>
									</div>
									<error :error="commonError"></error>
								</div>
							</div>
						</form>
					</div>
				</transition>
			</div>
		</div>
	</login-layout>
</template>
<script>
import LoginLayout from '@/layout/LoginLayout';
import Axios from 'axios';
import { BASE_URL } from '@/settings/config';
import { parsePythonDataObject, parsePythonArray } from '@/functions/helpers';
import sha512 from 'js-sha512';
import { AUTH_REQUEST } from '@/store/actions/auth';
import checkLoginType from '@/functions/checkLoginType';
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
			smsCodes: [{ 0: '' }, { 1: '' }, { 2: '' }, { 3: '' }, { 4: '' }, { 5: '' }],
			timer: null,
			countdown: 59,
			commonError: null,
			isLoaded: false,
		};
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
				index !== this.smsCodes.length - 1 ? inputs[index + 1].focus() : this.sendPin();
			}
		},
		getPin(params = { withRepeat: false }) {
			const { withRepeat } = params;
			this.commonError = null;
			const { user, loginType } = this;
			Axios({
				url: BASE_URL,
				method: 'POST',
				params: {
					Comand: 'PasswordRecoveryPhone', // если e-mail, запрос тоже идет на эту команду,
					Phone: loginType === 'Phone' ? user.replace(/[^0-9]/gim, '') : '', // но отправляется параметр Email
					Email: loginType === 'Email' ? user : '',
				},
			}).then((resp) => {
				const data = parsePythonDataObject(resp);

				const errors = Object.values(data[0]['Errors']);

				if (errors.length) {
					this.commonError = errors[0];
				} else {
					this.step = 2;
					if (!withRepeat) {
						this.countdown = 59;
						setTimeout(() => {
							document.querySelector('.login-form .number-input').focus();
						}, 50);
						this.timer = setInterval(() => {
							this.countdown--;
						}, 1000);
					}
				}
			});
			this.step = 2;
		},
		repeatPin() {
			this.smsCodes = [{ 0: '' }, { 1: '' }, { 2: '' }, { 3: '' }, { 4: '' }, { 5: '' }];
			this.countdown = 59;
			setTimeout(() => {
				document.querySelector('.login-form .number-input').focus();
			}, 50);
			this.timer = setInterval(() => {
				this.countdown--;
			}, 1000);
			this.getPin({ withRepeat: true });
		},
		sendPin() {
			const { user, loginType, smsCodes } = this;
			this.commonError = null;

			Axios({
				url: BASE_URL,
				method: 'POST',
				params: {
					Comand: 'PasswordRecoveryPin',
					Phone: loginType === 'Phone' ? user.replace(/[^0-9]/gim, '') : '',
					Email: loginType === 'Email' ? user : '',
					Pin: smsCodes.map((smsCode, index) => smsCode[index]).join(''),
				},
			}).then(({ data: resp }) => {
				const data = parsePythonArray(resp);

				const errors = Object.values(data[0]['Errors']);
				if (errors.length) {
					this.commonError = errors[0];
				} else if (data[1].return['New Password'] === 'generated') {
					const params = new URLSearchParams();
					params.append('Phone', loginType === 'Phone' ? user.replace(/[^0-9]/gim, '') : '');
					params.append('Email', loginType === 'Email' ? user : '');
					params.append('Password', sha512(data[1].return.Password));
					params.append('Comand', 'CheckLoginPassword');

					this.$store.dispatch(AUTH_REQUEST, params).then(() => {
						clearInterval(this.timer);
						this.commonError = null;
						this.$router.push('/');
						this.$store.commit('alerts/setNotification', {
							message: `We have sent your new password to your ${loginType.toLowerCase()}`,
							status: 'success-status',
							icon: 'done',
						});
					});
				} else {
					this.commonError = 'Password recovery is unavailable now. Please try again later';
					this.setTimeout(() => this.$router.push('/login'), 2000);
				}
			});
		},
	},
	watch: {
		countdown(value) {
			if (value === 0) {
				clearInterval(this.timer);
			}
		},
	},
};
</script>
<style scoped>
.recovery-title {
	opacity: 0.65;
}
.transaction {
	padding-top: 0;
}
</style>
