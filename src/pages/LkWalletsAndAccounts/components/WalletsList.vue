<template>
	<draggable
		v-model="draggableWalletsList"
		v-if="isWalletsMovingAndDeleting"
		class="wallets-list_item_body"
	>
		<wallets-list-item
			v-for="wallet in wallets"
			:key="wallet.address"
			@onWalletRouter="handleWalletRouter"
			@onOpenPopup="handleOpenPopup"
			:wallet="wallet"
			:isWalletsMovingAndDeleting="isWalletsMovingAndDeleting"
			:percentage="percentage"
		></wallets-list-item>

		<lk-delete-wallet-popup
			@onDeleteWallet="handleDeleteItem"
			@onClose="handleClosePopup"
			:deletePopup="deletePopup"
		></lk-delete-wallet-popup>
	</draggable>
	<div v-else class="wallets-list_item_body">
		<wallets-list-item
			v-for="wallet in wallets"
			:key="wallet.address"
			@onWalletRouter="handleWalletRouter"
			@onOpenPopup="handleOpenPopup"
			:wallet="wallet"
			:isWalletsMovingAndDeleting="isWalletsMovingAndDeleting"
			:percentage="percentage"
		></wallets-list-item>
	</div>
</template>
<style scoped></style>
<script>
import draggable from 'vuedraggable';
import { mapGetters } from 'vuex';
import LkDeleteWalletPopup from '@/components/Popups/DeleteWallet';
import WalletsListItem from './WalletsListItem';

export default {
	name: 'WalletsList',
	props: ['isWalletsMovingAndDeleting', 'wallets'],
	components: {
		draggable,
		LkDeleteWalletPopup,
		WalletsListItem,
	},
	computed: {
		draggableWalletsList: {
			get() {
				return this.wallets;
			},
			set(value) {
				return this.$store.commit('wallet/SET_WALLETS', value);
			},
		},
		...mapGetters({
			percentage: 'wallet/PERCENTAGE',
		}),
	},
	mounted() {
		this.$store.dispatch('wallet/GET_TYPES');
	},
	data() {
		return {
			groupTogglerActiveId: null,
			deletePopup: {
				isOpened: false,
				address: null,
				currency: null,
			},
		};
	},

	methods: {
		handleWalletRouter(currency, address, isAvailable) {
			if (this.isWalletsMovingAndDeleting || !isAvailable) {
				return false;
			} else {
				this.$router.push(`/payments-and-transfer/${currency}/${address}`);
			}
		},
		handleOpenPopup(address, currency) {
			this.deletePopup = {
				isOpened: true,
				address,
				currency,
			};
		},
		handleClosePopup() {
			this.deletePopup = {
				isOpened: false,
				address: null,
				currency: null,
			};
		},
		handleDeleteItem(address) {
			this.handleClosePopup();
			this.$store
				.dispatch(
					'wallet/DELETE_WALLET',
					this.wallets.find((wallet) => wallet.address === address),
				)
				.then(() => {
					this.$store.commit(
						'wallet/SET_WALLETS',
						this.wallets.filter((wallet) => wallet.address !== address),
					);
					setTimeout(() => {
						this.$emit('afterDeleteWallet'); // 600 - animation deleting time
					}, 600);
				});
		},
	},
};
</script>
