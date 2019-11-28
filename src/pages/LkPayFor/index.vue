<template>
	<lk-layout>
		<payments-and-transfer>
			<div class="pay-for">
				<div class="wrapper">
					<div class="top-bar">
						<div class="balance">
							<h2 class="balance__title">Total Balance</h2>
							<span class="balance__amount"
								>${{
									Number(wallets.reduce((acc, item) => acc + item.balanceUSD, 0)).toFixed(2) || 0
								}}
								USD</span
							>
						</div>
						<div class="select">
							<div class="select__header" @click="walletSelect.isActive = true">
								<div class="flex align-items-center">
									<img
										v-if="currentWallet.currency === 'LTC'"
										src="@/assets/images/ltc.svg"
										width="34"
									/>
									<img
										v-else-if="currentWallet.currency === 'ETH'"
										src="@/assets/images/eth.png"
										width="34"
									/>
									<img v-else src="@/assets/images/btc.png" width="34" />
									<div class="flex flex-column select__wallet-info">
										<span
											class="select__curency-name"
											:class="currentWallet.currency.toLowerCase()"
											>{{
												`${currentWallet.currency} ${getCryptoInfo(currentWallet.currency)
													.fullName || 'Bitcoin'}`
											}}</span
										>
										<span class="select__balance">
											{{ `${Number(currentWallet.balance).toFixed(5)} ${currentWallet.currency}` }}
											{{ `${Number(currentWallet.balanceUSD).toFixed(2)} USD` }}
										</span>
									</div>
								</div>
								<div class="select__expand">
									<img src="@/assets/images/triangle.svg" width="6" height="4" />
								</div>
							</div>
							<transition name="fade">
								<div class="select__body" v-show="walletSelect.isActive">
									<div
										class="select__body-item flex justify-content-between align-items-center"
										:class="{ active: currentWallet.address === wallet.address }"
										v-for="wallet in wallets"
										:key="wallet.address"
										@click="handleChangeCurrentWallet(wallet)"
									>
										<div class="flex align-items-center">
											<img
												v-if="wallet.currency === 'BTC'"
												width="22"
												src="@/assets/images/btc.png"
											/>
											<img
												v-if="wallet.currency === 'ETH'"
												width="22"
												src="@/assets/images/eth.png"
											/>
											<img
												v-if="wallet.currency === 'LTC'"
												width="22"
												src="@/assets/images/ltc.svg"
											/>
											<h2 class="select__body-currency">
												{{ getCryptoInfo(wallet.currency).fullName }}
											</h2>
										</div>
										<span class="select__body-balance">{{
											`${wallet.currency} ${formatCurrency(wallet.balance, '', 5)}`
										}}</span>
										<span class="select__body-balance-usd">{{
											`$${formatCurrency(wallet.balanceUSD)} USD`
										}}</span>
									</div>
								</div>
							</transition>
						</div>
					</div>
					<div class="payment-block">
						<div class="payment-types">
							<div class="payment-type" v-for="paymentType in paymentTypes" :key="paymentType.text">
								<div class="icon-block">
									<img :src="paymentType.icon" alt title />
								</div>
								<div class="text-block">
									{{ paymentType.text }}
								</div>
							</div>
						</div>
						<div class="payment-directions">
							<div
								class="payment-direction"
								v-for="paymentDirection in paymentDirections"
								:key="paymentDirection.text"
								@click="handleChangePaymentsDirection(paymentDirection.text)"
								:class="{ active: activePaymentDirection === paymentDirection.text }"
							>
								<div
									class="payment-direction__chosen-block"
									v-show="activePaymentDirection === paymentDirection.text"
								>
									<img src="@/assets/images/tick.svg" />
								</div>
								<div class="payment__image-block">
									<img :src="paymentDirection.icon" />
								</div>
								<span class="payment__text">{{ paymentDirection.text }}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</payments-and-transfer>
	</lk-layout>
</template>
<script>
import LkLayout from '@/layout/LkLayout';
import PaymentsAndTransfer from '@/layout/LkPaymentsAndTransfer';
import { mapGetters } from 'vuex';
import getCryptoInfo from '@/functions/getCryptoInfo';
import './styles.scss';

export default {
	name: 'LkPayFor',
	components: {
		PaymentsAndTransfer,
		LkLayout,
	},
	mounted() {
		this.$store.dispatch('common/GET_ALL_BALANCE');
		this.$store.dispatch('wallet/GET_WALLETS');
		this.setInitialCurrentWallet();

		const select = document.querySelector('.pay-for .select');
		this.windowHandler = ({ target }) => {
			if (
				(target ? !target.classList.contains('.pay-for .select') : false) &&
				!select.contains(target)
			) {
				this.walletSelect.isActive = false;
			}
		};
		window.addEventListener('click', this.windowHandler);
	},
	beforeDestroy() {
		window.removeEventListener('click', this.windowHandler);
	},
	computed: {
		...mapGetters({
			allBalance: 'common/ALL_BALANCE',
			wallets: 'wallet/WALLETS',
		}),
		allUsdBalance() {
			const { BTCBalanceusd, ETHBalanceusd, LTCBalanceusd } = this.allBalance;
			return ((BTCBalanceusd || 0) + (ETHBalanceusd || 0) + (LTCBalanceusd || 0)).toFixed(2);
		},
	},
	data() {
		return {
			walletSelect: {
				isActive: false,
			},
			activePaymentDirection: null,
			currentWallet: {
				currency: 'BTC',
				balance: '0.00000',
				balanceUSD: '0.00',
				address: null,
			},
			windowHandler: null,
			paymentTypes: [
				{
					icon: require('@/assets/images/credit-card.svg'),
					text: 'From card to card',
				},
				{
					icon: require('@/assets/images/avatar.svg'),
					text: 'To people',
				},
				{
					icon: require('@/assets/images/contract.svg'),
					text: 'Payment by details',
				},
				{
					icon: require('@/assets/images/swift.svg'),
					text: 'SWIFT',
				},
				{
					icon: require('@/assets/images/avatar.svg'),
					text: 'To myself',
				},
				{
					icon: require('@/assets/images/credit-card2.svg'),
					text: 'Money request',
				},
			],
			paymentDirections: [
				{
					icon: require('@/assets/images/smartphone-call.svg'),
					text: 'Mobile connection',
				},
				{
					icon: require('@/assets/images/home.svg'),
					text: 'Communal services',
				},
				{
					icon: require('@/assets/images/internet.svg'),
					text: 'Internet',
				},
				{
					icon: require('@/assets/images/network.svg'),
					text: 'Network marketing',
				},
				{
					icon: require('@/assets/images/phone.svg'),
					text: 'Phone',
				},
				{
					icon: require('@/assets/images/tv.svg'),
					text: 'TV',
				},
				{
					icon: require('@/assets/images/gos.svg'),
					text: 'Gos services',
				},
				{
					icon: require('@/assets/images/bus.svg'),
					text: 'Transport',
				},
				{
					icon: require('@/assets/images/wallet2.svg'),
					text: 'Repayment of loans',
				},
				{
					icon: require('@/assets/images/wallet.svg'),
					text: 'E-wallets',
				},
				{
					icon: require('@/assets/images/gamepad.svg'),
					text: 'Games',
				},
				{
					icon: require('@/assets/images/book.svg'),
					text: 'Education',
				},
				{
					icon: require('@/assets/images/plane.svg'),
					text: 'Travel',
				},
				{
					icon: require('@/assets/images/ok.svg'),
					text: 'Social network',
				},
				{
					icon: require('@/assets/images/shop.svg'),
					text: 'Internet shops',
				},
				{
					icon: require('@/assets/images/heart.svg'),
					text: 'Charity',
				},
			],
		};
	},
	methods: {
		getCryptoInfo,
		setInitialCurrentWallet() {
			const walletsBalancesArray = this.wallets.map((wallet) => wallet.balanceUSD);
			const maxBalanceIndex = walletsBalancesArray.indexOf(
				Math.max.apply(null, walletsBalancesArray),
			);
			const walletWithMaxBalance = this.wallets.slice()[maxBalanceIndex];

			this.currentWallet = walletWithMaxBalance;
		},
		handleChangeCurrentWallet({ currency, balance, balanceUSD, address }) {
			this.walletSelect.isActive = false;
			this.currentWallet = { currency, balance, balanceUSD, address };
		},
		handleChangePaymentsDirection(name) {
			if (name === this.activePaymentDirection) {
				this.activePaymentDirection = null;
			} else {
				this.activePaymentDirection = name;
			}
		},
	},
};
</script>
