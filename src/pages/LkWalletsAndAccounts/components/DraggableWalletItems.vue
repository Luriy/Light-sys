<template>
	<draggable group="wallets" v-model="draggableWalletsList" :animation="350">
		<wallets-list-item
			v-for="wallet in group.wallets"
			:key="wallet.address"
			@onWalletRouter="onWalletRouter"
			@onOpenPopup="onOpenPopup"
			:wallet="wallet"
			:isWalletsMovingAndDeleting="isWalletsMovingAndDeleting"
			:percentage="percentage"
			:id="id"
			:groupWallets="groupWallets"
		></wallets-list-item>
	</draggable>
</template>
<script>
import draggable from 'vuedraggable';
import WalletsListItem from './WalletsListItem';

export default {
	props: ['id', 'percentage', 'isWalletsMovingAndDeleting', 'groupWallets', 'group'],
	components: {
		draggable,
		WalletsListItem,
	},
	mounted() {
		// this.$store.dispatch('group/CREATE_GROUP', {
		// 	GroupName: encodeURI('Some group'),
		// 	wallets: {
		// 		'0': '3HHXsmsVub9xHSFU7zx89da4EkwQdGwHR1',
		// 	},
		// });
	},
	computed: {
		draggableWalletsList: {
			get() {
				return this.groupWallets[this.id].wallets;
			},
			set(value) {
				this.$store.dispatch('group/SET_WALLETS_TO_GROUP', {
					wallets: value,
					groupName: this.group.groupName,
				});
			},
		},
	},
	methods: {
		onWalletRouter(currency, address, isAvailable) {
			this.$emit('onWalletRouter', currency, address, isAvailable);
		},
		onOpenPopup(address, currency) {
			this.$emit('onOpenPopup', address, currency);
		},
	},
};
</script>
<style></style>
