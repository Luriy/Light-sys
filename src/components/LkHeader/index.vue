<template>
	<div class="header">
		<div class="right">
			<div class="search">
				<input type="text" name="search" placeholder="Search" />
				<button><img src="@/assets/images/search.svg" alt title /></button>
			</div>
			<div class="account-info">
				<div class="rating">
					<p><img src="@/assets/images/star-2.svg" alt title /> 4,56 <span> of 10</span></p>
				</div>
				<div class="balance">{{ allUsdBalance }} <span>USD</span></div>
				<div class="notification">
					<img src="@/assets/images/icons/bell.svg" alt title />
					<span></span>
				</div>
				<div class="avatar" @click="isDropDownOpened = !isDropDownOpened">
					<img src="@/assets/images/avatar.png" alt title />
					<div class="dropdown"></div>
					<dropdown :isOpened="isDropDownOpened" @onClose="isDropDownOpened = false"></dropdown>
				</div>
				<div class="lang">
					En
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import Dropdown from './Dropdown';
import { mapGetters } from 'vuex';

export default {
	name: 'LkHeader',
	components: {
		Dropdown,
	},
	data() {
		return {
			isDropDownOpened: false,
			updateWalletsTimer: null,
		};
	},
	created() {
		this.updateWalletsTimer = setInterval(() => {
			this.$store.dispatch('wallet/UPDATE_WALLETS_AND_TYPES');
		}, 7000);
	},
	beforeDestroy() {
		clearInterval(this.updateWalletsTimer);
	},
	computed: {
		...mapGetters({
			allUsdBalance: 'user/ALL_USD_BALANCE',
		}),
	},
};
</script>

<style scoped lang="scss">
.avatar {
	position: relative;
}
</style>
