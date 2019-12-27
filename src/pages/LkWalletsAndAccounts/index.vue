<template>
	<lk-layout>
		<div class="wallets-and-acccouts-page">
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
import TransactionsHistory from '@/components/TransactionsHistory';
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
				this.$store.dispatch('wallet/GET_WALLETS', { wallets: this.wallets });
				this.$store.dispatch('transactionsHistory/GET_ALL_TRANSACTIONS', {
					wallets: this.wallets,
				});
			} else {
				this.$store.dispatch('wallet/GET_WALLETS').then(() => {
					this.$store.dispatch('transactionsHistory/GET_ALL_TRANSACTIONS', {
						wallets: this.wallets,
					});
				});
			}
		} else {
			this.$store.dispatch('transactions_history/GET_ALL_TRANSACTIONS', { wallets: this.wallets });
		}
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
		copyToClipboard() {
			var elem = document.getElementById('wallet');
			var targetId = '_hiddenCopyText_';
			var isInput = elem.tagName === 'INPUT' || elem.tagName === 'TEXTAREA';
			var origSelectionStart, origSelectionEnd;

			if (isInput) {
				target = elem;
				origSelectionStart = elem.selectionStart;
				origSelectionEnd = elem.selectionEnd;
			} else {
				target = document.getElementById(targetId);

				if (!target) {
					var target = document.createElement('textarea');
					target.style.position = 'absolute';
					target.style.left = '-9999px';
					target.style.top = '0';
					target.id = targetId;
					document.body.appendChild(target);
				}

				target.textContent = elem.textContent;
			}

			var currentFocus = document.activeElement;
			target.focus();
			target.setSelectionRange(0, target.value.length);

			var succeed;
			try {
				succeed = document.execCommand('copy');
				this.wallet = 'Copied to clipboard';
			} catch (e) {
				succeed = false;
			}
			if (currentFocus && typeof currentFocus.focus === 'function') {
				currentFocus.focus();
			}

			if (isInput) {
				elem.setSelectionRange(origSelectionStart, origSelectionEnd);
			} else {
				target.textContent = '';
			}
			return succeed;
		},
	},
};
</script>
