<template>
	<div>
		<div class="tabs-bar">
			<button
				class="tab"
				v-for="link in links"
				:to="link.to"
				:key="link.name"
				:class="{ active: $router.history.current.path.includes(link.activeString) }"
				@click="handleClickTab(link.name, link.to)"
			>
				{{ link.name }}
			</button>
		</div>
		<slot></slot>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	name: 'LkPaymentsAndTransfers',
	computed: {
		...mapGetters({
			wallets: 'wallet/WALLETS',
		}),
		transferWallet() {
			if (this.wallets && this.wallets.length) {
				const walletsBalancesArray = this.wallets.map((wallet) => wallet.balanceUSD);
				const maxBalanceIndex = walletsBalancesArray.indexOf(
					Math.max.apply(null, walletsBalancesArray),
				);
				const walletWithMaxBalance = this.wallets[maxBalanceIndex];
				return walletWithMaxBalance;
			}
		},
		links() {
			return [
				{
					name: 'Transfer',
					to: this.wallets
						? `/payments-and-transfer/${this.transferWallet.currency}/${this.transferWallet.address}`
						: '/wallets',
					activeString: '/payments-and-transfer/send',
				},
				{
					name: 'Pay for',
					to: '/payments-and-transfer/pay-for',
					activeString: '/payments-and-transfer/pay-for',
				},
			];
		},
	},
	mounted() {
		if (!this.wallets.length) {
			this.$store.dispatch('wallet/GET_WALLETS');
		}
	},
	methods: {
		handleClickTab(name, route) {
			this.activeTab = name;
			this.$router.push(route);
		},
	},
};
</script>
<style scoped>
.tabs-bar {
	display: flex;
	margin-bottom: 25px;
}
.tab {
	padding: 10px 15px;
	margin-right: 10px;
	color: #fff;
	font-weight: 600;
	text-decoration: none;
	border-radius: 8px;
	font-size: 16px;
}
.tab:last-of-type {
	margin-right: 0;
}
.tab.active {
	background-color: #513685;
}
</style>
