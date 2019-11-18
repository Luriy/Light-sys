<template>
	<div id="app">
		<router-view v-if="isReady"></router-view>
		<template v-if="notification && notification.message">
			<v-snackbar
				v-model="notification"
				:timeout="15000"
				:multi-line="true"
				right="right"
				top="top"
				color="#3b2665"
				@input="closeNotification"
			>
				<i :class="`material-icons status ${notification.status}`">{{ notification.icon }}</i>
				<p class="notification-message">{{ notification.message }}</p>
				<i class="material-icons close-action" @click="closeNotification">close</i>
			</v-snackbar>
		</template>
	</div>
</template>

<script>
import { AUTH_REQUEST, AUTH_LOGOUT } from '@/store/actions/auth';

export default {
	name: 'App',
	data: () => ({
		isReady: false,
	}),
	methods: {
		closeNotification() {
			this.$store.dispatch('alerts/clearNotification');
		},
	},
	computed: {
		notification() {
			return this.$store.getters['alerts/notification'];
		},
	},
	created() {
		this.$store
			.dispatch(AUTH_REQUEST, localStorage.getItem('Data'))
			.then(() => {
				this.isReady = true;
			})
			.catch((err) => {
				this.isReady = true;
				this.error = err;
				this.$store.dispatch(AUTH_LOGOUT);
				this.$router.push('/');
			});
	},
};
</script>

<style scoped lang="scss">
.status {
	width: 57px;
	height: 57px;
	border-radius: 22px;
	background-color: #4d3779;
	text-align: center;
	line-height: 57px;
}

.info-status {
	color: #5686ff;
}
.error-status {
	color: #ff4200;
}
.success-status {
	color: #61db53;
}
.warning-status {
	color: #ff9c37;
}
.close-action {
	cursor: pointer;
}
</style>
