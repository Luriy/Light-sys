<template>
	<lk-layout>
		<payments-and-transfer>
			<div class="pay-for">
				<div class="wrapper">
					<div class="top-bar">
						<div class="balance">
							<h2 class="balance__title">Total Balance</h2>
							<span class="balance__amount">${{ allUsdBalance }} USD</span>
						</div>
						<div class="select">
							<div class="flex align-items-center">
								<img src="@/assets/images/btc.png" width="34" />
								<div class="flex flex-column select__wallet-info">
									<span class="select__curency-name btc">BTC Bitcoin</span>
									<span class="select__balance">0.97750993 BTC $1.63 USD</span>
								</div>
							</div>
							<div class="select__expand">
								<img src="@/assets/images/triangle.svg" width="6" height="4" />
							</div>
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
import './styles.scss';

export default {
	name: 'LkPayFor',
	components: {
		PaymentsAndTransfer,
		LkLayout,
	},
	created() {
		this.$store.dispatch('common/GET_ALL_BALANCE');
	},
	computed: {
		...mapGetters({
			allBalance: 'common/ALL_BALANCE',
		}),
		allUsdBalance() {
			const { BTCBalanceusd, ETHBalanceusd, LTCBalanceusd } = this.allBalance;
			return (BTCBalanceusd + ETHBalanceusd + LTCBalanceusd).toFixed(2);
		},
	},
	data() {
		return {
			activePaymentDirection: null,
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
