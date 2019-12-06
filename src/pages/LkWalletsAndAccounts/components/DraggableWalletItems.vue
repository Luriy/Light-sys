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
	computed: {
		draggableWalletsList: {
			get() {
				return this.groupWallets[this.id].wallets;
			},
			set(value) {
				return this.$store.dispatch('group/SET_WALLETS_TO_GROUP', {
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
