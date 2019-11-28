<template>
	<lk-layout>
		<div class="wallet-send-block">
			<div class="wallet-send-currency">
				<img v-if="isShowLogotype('btc')" src="@/assets/images/btc.png" alt title />
				<img v-if="isShowLogotype('eth')" src="@/assets/images/eth.png" alt title />
				<img v-if="isShowLogotype('ltc')" src="@/assets/images/ltc.svg" alt title />
			</div>
			<div class="wallet-send-amount">
				<p
					:class="{
						'wallet-send-amount--crypto': true,
						[currentWallet.currency.toLowerCase()]: true,
					}"
				>
					{{ formatCurrency(currentWallet.balance, '', 5) }}
					<span>{{ currentWallet.currency || '' }}</span>
				</p>
				<p class="wallet-send-amount--fiat">
					{{ formatCurrency(currentWallet.balanceUSD, '$') }} <span>USD</span>
				</p>
			</div>
			<div class="buttons">
				<div class="btn-border-wrapper">
					<router-link :to="{ name: 'LkPaymentWalletSend' }"
						><button class="btn">Send</button></router-link
					>
				</div>
				<div class="btn-border-wrapper">
					<router-link :to="{ name: 'LkPaymentWalletReceive' }"
						><button class="btn">Receive</button></router-link
					>
				</div>
				<div class="btn-border-wrapper btn-exchange">
					<router-link to="/exchange"
						><button class="btn"><img src="@/assets/images/exchange.svg" alt title /></button
					></router-link>
				</div>
			</div>
		</div>

		<div class="wallet-description">
			<div class="title">Description</div>
			<div class="text">
				Ethereum is a decentralized computing platform that runs smart contracts, which are
				contracts thah execute withou human intervention. ETH popularized the idea programmable
				transactions instead of only for money transfers. The platform is user for crowdfuundin
				(ICOs) , the cretion of new digital assets, and more.
			</div>
		</div>
		<transactions-history :currentWallet="currentWallet"></transactions-history>
	</lk-layout>
</template>

<script>
import { mapGetters } from 'vuex';
import LkLayout from '@/layout/LkLayout';
import TransactionsHistory from './TransactionsHistory';

export default {
	name: 'LkPaymentWallet',
	components: {
		LkLayout,
		TransactionsHistory,
	},
	data() {
		return {
			currentWallet: {
				balance: '0.00000',
				balanceUSD: '0.00',
			},
		};
	},
	beforeMount() {
		this.currentWallet = this.wallets.find(
			(wallet) => wallet.address === this.$route.params.address,
		);
	},
	computed: {
		...mapGetters({
			wallets: 'wallet/WALLETS',
		}),
	},
	methods: {
		isShowLogotype(code) {
			return (this.currentWallet.currency || '').toLowerCase() === code.toLowerCase();
		},
	},
};
</script>
