<template>
	<lk-layout>
		<payments-and-transfer>
			<div class="wrapper">
				<div class="top-bar">
					<div class="balance">
						<h2 class="balance__title">Total Balance</h2>
						<span class="balance__amount">$350 454.45 USD</span>
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
						<div class="payment-type" v-for="paymentType in paymentTypes">
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
		</payments-and-transfer>
	</lk-layout>
</template>
<style scoped>
.wrapper {
	border-radius: 32px;
	background-color: #3b2665;
	padding: 25px 0 0;
}
.top-bar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin: 0 35px 25px;
}
.balance__title {
	color: #ffffff;
	font-size: 14px;
	margin-bottom: 8px;
}
.balance__amount {
	font-size: 18px;
	font-weight: 600;
	text-transform: uppercase;
	color: #ffffff;
}
.select {
	width: 100%;
	max-width: 640px;
	border-radius: 14px;
	background-color: #4d3779;
	padding: 0 15px;
	height: 56px;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.select__wallet-info {
	margin-left: 15px;
}
.select__curency-name {
	font-size: 14px;
	font-weight: 600;
}
.select__balance {
	font-size: 12px;
	font-weight: 600;
	color: #fff;
	margin-top: 5px;
}
.payment-block {
	border-radius: 32px;
	background-color: #301c57;
	padding: 30px;
}
.select__expand {
	width: 20px;
	height: 20px;
	border-radius: 9px;
	background-color: #684e9c;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
}
.payment-types {
	display: flex;
	flex-wrap: wrap;
	padding-bottom: 25px;
	border-bottom: 1px solid #4f377f;
}
.payment-type {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-right: 30px;
	cursor: pointer;
}
.payment-type:last-of-type {
	margin-right: 0;
}
.payment-type .icon-block {
	width: 44px;
	height: 44px;
	border-radius: 17px;
	background-color: #543b88;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-bottom: -7px;
	z-index: 5;
}
.payment-type .text-block {
	height: 47px;
	line-height: 47px;
	padding: 0 15px;
	border-radius: 17px;
	background-color: #3b2665;
	color: #fff;
	font-size: 14px;
	font-weight: 600;
}
.payment-directions {
	display: grid;
	grid-template-columns: repeat(6, 127px);
	grid-gap: 15px;
	margin-top: 25px;
}
.payment-direction {
	position: relative;
	width: 127px;
	height: 127px;
	border-radius: 14px;
	background-color: #452c76;
	transition: 0.5s;
	padding: 18px 18px 0 18px;
	display: flex;
	flex-direction: column;
	align-items: center;
	cursor: pointer;
}
.payment-direction.active {
	opacity: 0.7 !important;
}
.payment-direction:hover {
	opacity: 0.8;
}
.payment__image-block {
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 8px;
	background-color: #513685;
	height: 54px;
	margin-bottom: 10px;
}
.payment__text {
	text-align: center;
	font-size: 14px;
	font-weight: 600;
	color: #fff;
	line-height: 16px;
}
.payment-direction__chosen-block {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	display: flex;
	justify-content: center;
	align-items: center;
	width: 43px;
	height: 43px;
	border-radius: 17px;
	background-color: #7156a5;
}
</style>
<script>
import LkLayout from '@/layout/LkLayout';
import PaymentsAndTransfer from '@/layout/LkPaymentsAndTransfer';

export default {
	name: 'LkPayFor',
	components: {
		PaymentsAndTransfer,
		LkLayout,
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
