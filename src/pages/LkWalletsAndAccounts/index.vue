<template>
	<lk-layout>
		<div class="wallets-and-acccouts-page" v-show="true">
			<div class="wallets-list">
				<div class="wallets-block wallets-list_item left">
					<div class="toggler">
						<p>Wallets</p>
						<div class="flex toggler__panel">
							<div
								class="toggle minus"
								:class="{ active: isWalletsMovingAndDeleting }"
								@click="handleMovingAndDeleting('wallets')"
							></div>
							<router-link to="/wallets/create-wallet"><div class="toggle"></div></router-link>
						</div>
					</div>
					<wallets-list
						:isWalletsMovingAndDeleting="isWalletsMovingAndDeleting"
						@afterDeleteWallet="handleAfterDeleteWallet"
					></wallets-list>
				</div>

				<div class="fiat-block wallets-list_item right">
					<div class="toggler">
						<p>Account and Cards</p>
						<div class="flex toggler_panel">
							<div
								class="toggle minus"
								:class="{ active: isCardsMovingAndDeleting }"
								@click="handleMovingAndDeleting('cards')"
							></div>
							<router-link to="/wallets/accounts-and-cards"><div class="toggle"></div></router-link>
						</div>
					</div>
					<cards-list
						:isCardsMovingAndDeleting="isCardsMovingAndDeleting"
						@afterDeleteCard="handleAfterDeleteCard"
					></cards-list>
				</div>
			</div>
			<div
				class="operations-history"
				v-if="operations.some(({ transactions }) => transactions.length)"
			>
				<div class="title">
					<p>Operations history</p>
				</div>
				<div class="operations-history-list">
					<transactions-history :operationsWithPagination="operations"></transactions-history>
				</div>
			</div>
		</div>
	</lk-layout>
</template>
<script>
import { mapGetters } from 'vuex';
import wallet from '@/store/modules/wallet';
import LkLayout from '@/layout/LkLayout';
import TransactionsHistory from '@/components/TransactionsHistory/index';
import WalletsList from './components/WalletsList';
import CardsList from './components/CardsList';
import './styles.scss';

export default {
	name: 'LkPaymentWallets',
	components: {
		LkLayout,
		TransactionsHistory,
		WalletsList,
		CardsList,
	},
	data() {
		return {
			isWalletsMovingAndDeleting: false,
			isCardsMovingAndDeleting: false,
		};
	},
	computed: {
		...mapGetters({
			operations: 'transactionsHistory/ALL_TRANSACTIONS',
			wallets: 'wallet/WALLETS',
			groupWallets: 'group/GROUP_WALLETS',
			afterCreateWallet: 'wallet/AFTER_CREATE_WALLET',
		}),
	},
	mounted() {
		if (!this.afterCreateWallet) {
			if (this.wallets.length) {
				this.getWallets();
				this.getTransactions();
				this.subscribeUpdateTransactions();
			} else {
				this.getWallets().then(() => {
					this.getTransactions();
					this.subscribeUpdateTransactions();
				});
			}
		} else {
			this.getTransactions();
			this.subscribeUpdateTransactions();
		}
	},
	beforeDestroy() {
		clearInterval(this.updateTransactionsTimer);
	},
	methods: {
		handleMovingAndDeleting(type) {
			switch (type) {
				case 'cards':
					return (this.isCardsMovingAndDeleting = !this.isCardsMovingAndDeleting);
				case 'wallets':
					return (this.isWalletsMovingAndDeleting = !this.isWalletsMovingAndDeleting);
			}
		},
		handleAfterDeleteWallet() {
			this.isWalletsMovingAndDeleting = false;
		},
		handleAfterDeleteCard() {
			this.isCardsMovingAndDeleting = false;
		},
		getWallets() {
			return this.$store.dispatch('wallet/GET_WALLETS', { wallets: this.wallets });
		},
		getTransactions() {
			return this.$store.dispatch('transactionsHistory/GET_TRANSACTIONS', {
				wallets: this.wallets,
			});
		},
		subscribeUpdateTransactions() {
			return (this.updateTransactionsTimer = setInterval(() => {
				this.$store.dispatch('transactionsHistory/GET_TRANSACTIONS', {
					wallets: this.wallets,
				});
			}, 15000));
		},
	},
};
</script>
