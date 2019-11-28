<template>
	<transition name="slide-fade-top">
		<div class="dropdown__body" v-show="isOpened">
			<div class="dropdown__body-item">
				<p class="dropdown__body-item-text">ID 13413242</p>
			</div>
			<div class="dropdown__body-item">
				<p class="dropdown__body-item-text">Profile</p>
			</div>
			<button class="sign-out-button flex align-items-center justify-content-center">
				<div class="flex align-items-center" @click="handleSignOut">
					<img class="sign-out-icon" src="@/assets/images/sign-out.svg" />
					<p class="dropdown__body-item-text">Sign out</p>
				</div>
			</button>
		</div>
	</transition>
</template>
<script>
import { AUTH_LOGOUT } from '@/store/actions/auth';
import { SITE_URL } from '@/constants';

export default {
	props: ['isOpened'],
	data() {
		return {
			windowHandler: null,
		};
	},
	mounted() {
		const dropdown = document.querySelector('.header .dropdown__body');
		const avatar = document.querySelector('.header .avatar');

		this.windowHandler = ({ target }) => {
			if (
				(target ? !target.classList.contains('.dropdown__body') : false) &&
				!dropdown.contains(target) &&
				!dropdown.contains(avatar) &&
				!avatar.contains(target)
			) {
				this.$emit('onClose');
			}
		};
		window.addEventListener('click', this.windowHandler);
	},
	beforeDestroy() {
		window.removeEventListener('click', this.windowHandler);
	},
	methods: {
		handleSignOut() {
			this.$store.dispatch(AUTH_LOGOUT).then(() => {
				location.href = `${SITE_URL}/login`;
			});
		},
	},
};
</script>
<style scoped lang="scss">
.dropdown__body {
	position: absolute;
	z-index: 10;
	top: 54px;
	left: -54px;
	width: 157px;
	box-shadow: 0 11px 12px rgba(0, 0, 0, 0.26);
	border-radius: 17px;
	background-color: #3b2665;
	padding: 14px 0 20px;
	&-item {
		height: 33px;
		display: flex;
		align-items: center;
		padding: 0 17px;
		transition: 0.5s;
		&:hover {
			background-color: #4c3677;
		}

		&-text {
			font-size: 14px;
			font-weight: 600;
			color: #fff;
		}
	}
	.sign-out-button {
		margin: 15px 20px 0;
		width: calc(100% - 40px);
		height: 40px;
		border-radius: 8px;
		background-color: #4c3677;
	}
	.sign-out-icon {
		margin-right: 10px;
	}
}
</style>
