<template>
	<div v-if="isWalletsMovingAndDeleting" class="wallets-list_item_body">
		<div
			class="group-wrapper"
			v-for="(group, index) in groupWallets"
			:key="group.groupName + index"
		>
			<div
				class="add-group-input-wrapper flex align-items-center"
				v-if="editingGroup === group.groupName"
			>
				<input type="text" v-model="newGroupName" @blur="handleSaveRenameGroup" />
			</div>
			<div
				class="active-group"
				@click="handleRenameGroup(group.groupName)"
				v-else-if="
					groupWallets.length !== 1 && editingGroup !== group.groupName && group.groupName !== ''
				"
			>
				{{ group.groupName }}
			</div>
			<draggable-wallet-items
				:id="index"
				:percentage="percentage"
				:isWalletsMovingAndDeleting="isWalletsMovingAndDeleting"
				:groupWallets="groupWallets"
				@onWalletRouter="handleWalletRouter"
				@onOpenPopup="handleOpenPopup"
				:group="group"
			></draggable-wallet-items>
			<lk-delete-wallet-popup
				@onDeleteWallet="handleDeleteItem"
				@onClose="handleClosePopup"
				:deletePopup="deletePopup"
			></lk-delete-wallet-popup>
		</div>
	</div>
	<div v-else class="wallets-list_item_body">
		<div class="group-wrapper" v-for="group in groupWallets" :key="group.groupName">
			<div class="active-group" v-if="groupWallets.length !== 1 && group.groupName !== ''">
				{{ group.groupName }}
			</div>
			<wallets-list-item
				v-for="wallet in group.wallets"
				:key="wallet.address"
				@onWalletRouter="handleWalletRouter"
				@onOpenPopup="handleOpenPopup"
				:wallet="wallet"
				:isWalletsMovingAndDeleting="isWalletsMovingAndDeleting"
				:percentage="percentage"
			></wallets-list-item>
		</div>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';
import LkDeleteWalletPopup from '@/components/Popups/DeleteWallet';
import WalletsListItem from './WalletsListItem';
import DraggableWalletItems from './DraggableWalletItems';

export default {
	name: 'WalletsList',
	props: ['isWalletsMovingAndDeleting'],
	components: {
		LkDeleteWalletPopup,
		WalletsListItem,
		DraggableWalletItems,
	},
	data() {
		return {
			deletePopup: {
				isOpened: false,
				address: null,
				currency: null,
			},
			editingGroup: null,
			newGroupName: '',
		};
	},
	computed: {
		...mapGetters({
			percentage: 'wallet/PERCENTAGE',
			wallets: 'wallet/WALLETS',
			groupWallets: 'group/GROUP_WALLETS',
		}),
	},
	created() {
		this.$store.dispatch('wallet/GET_TYPES');
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
					this.$store.commit(
						'group/SET_GROUP_WALLETS',
						this.groupWallets.map((group) => ({
							...group,
							wallets: group.wallets.filter((wallet) => wallet.address !== address),
						})),
					);
					setTimeout(() => {
						this.$emit('afterDeleteWallet'); // 600 - animation deleting time
					}, 600);
				});
		},
		handleRenameGroup(groupName) {
			this.editingGroup = groupName;
			this.newGroupName = groupName;
			setTimeout(
				() =>
					document
						.querySelector('.wallets-block .group-wrapper .add-group-input-wrapper input')
						.focus(),
				50,
			);
		},
		handleSaveRenameGroup() {
			const isNewGroupNameAlreadyExist = this.groupWallets.some(
				({ groupName }) => groupName === this.newGroupName,
			);

			if (!isNewGroupNameAlreadyExist) {
				this.$store.dispatch('group/RENAME_WALLET_GROUP', {
					oldGroupName: this.editingGroup,
					newGroupName: this.newGroupName,
				});
			}

			this.editingGroup = null;
			this.newGroupName = null;
		},
	},
};
</script>
