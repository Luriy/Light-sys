<template>
	<login-layout>
		<div class="login-form-wrapper">
			<div class="login-form-container">
				<div class="login-form-togglers">
					<router-link to="/register">Sign up</router-link>
					<router-link to="/login">Login in</router-link>
				</div>
				<transition name="fade-long-absolute">
					<div class="login-form" v-if="isLoaded">
						<form @submit.prevent="login">
							<div class="login-form-input">
								<input
									type=""
									id="login"
									name="login"
									v-model="user"
									v-on:input="checkLoginType"
									placeholder="Email/phone number"
									required=""
								/>
							</div>
							<div class="login-form-input">
								<input
									type="password"
									required=""
									v-model="password"
									name="password"
									placeholder="Password"
								/>
							</div>
							<div class="login-form-helpers">
								<div class="login-form-remember">
									<label class="checkbox" @click="isRemember.checked = !isRemember.checked">
										<checkbox
											:isActive="isRemember.checked"
											:isDisabled="isRemember.hovered"
											@onMouseEnter="isRemember.hovered = true"
											@onMouseLeave="isRemember.hovered = false"
										></checkbox>
										<span class="text">Remember me</span>
									</label>
								</div>

								<div class="login-form-forgot">
									<router-link to="password-recovery">Forgot password?</router-link>
								</div>
							</div>
							<div class="login-form-button">
								<button type="submit" class="btn">Login</button>
							</div>
							<error :error="error"></error>
						</form>
					</div>
				</transition>
			</div>
		</div>
	</login-layout>
</template>

<script>
import LoginLayout from '@/layout/LoginLayout';
import Inputmask from 'inputmask';
import { AUTH_REQUEST, AUTH_LOGOUT } from '@/store/actions/auth';
import sha512 from 'js-sha512';
import Error from '@/components/Error';
import Checkbox from '@/elements/Checkbox';

export default {
	name: 'Login',
	components: {
		LoginLayout,
		Error,
		Checkbox,
	},
	data() {
		return {
			loginType: false,
			user: null,
			password: null,
			error: null,
			isLoaded: false,
			isRemember: {
				hovered: false,
				checked: false,
			},
		};
	},
	mounted() {
		this.isLoaded = true;
	},
	methods: {
		checkLoginType() {
			var pattern = /^[\d\(\)\ \- \+ \_]{0,100}$/;
			this.loginType = pattern.test(this.user);
			var im = new Inputmask('+9 (999) 999 99-99');
			if (this.loginType && this.user && this.user != '+') {
				im.mask(document.getElementById('login'));
			} else {
				if (document.getElementById('login').inputmask) {
					document.getElementById('login').inputmask.remove();
				}
			}
		},
		login: function() {
			const { user, password, loginType } = this;
			const params = new URLSearchParams();
			if (loginType) {
				const phone = user.replace(/[^0-9]/gim, '');
				params.append('Phone', phone);
				params.append('Email', '');
			} else {
				params.append('Email', user);
				params.append('Phone', '');
			}
			params.append('Password', sha512(password));
			params.append('Comand', 'CheckLoginPassword');

			this.$store
				.dispatch(AUTH_REQUEST, params)
				.then(() => {
					this.error = null;
					this.$router.push('/wallets');
				})
				.catch((err) => {
					this.error = err;
				});
		},
	},
};
</script>
