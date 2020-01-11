<template>
	<lk-pop-up
		v-if="successPopup"
		class="transfer-popup transfer-success-popup popup"
		@closeModal="$emit('onClose')"
		:popupSize="{ width: 'auto', height: '350px' }"
	>
		<div slot="title" class="exchange-popup_title">
			<img :src="getCryptoInfo(currency).image.corner" class="main-image" />
			<p class="transaction">
				Success!
			</p>
			<div class="flex">
				<p class="from" :class="currency.toLowerCase()">
					{{ formatCurrency(cryptoCurrencyAmount, '', 5) }}
					{{ currency }}
				</p>
				<p class="payment-usd">${{ formatCurrency(currencyAmount) }}</p>
			</div>
			<img :src="sendArrow" class="send-arrow" :class="{ rotated: currency === 'BTC' || currency === 'LTC' }" />
			<p class="address">{{ paymentAddress }}</p>
			<div class="exchange-block_fee">
				<div class="network-fee flex justify-content-between">
					<p class="title">
						<span>{{ fullCurrencyName }}</span> Network Fee
					</p>
					<div class="flex align-items-center">
						<p class="btc-value">{{ 0.0005 }} {{ currency }}</p>
						<p class="fixed-value">${{ 0.12 }}</p>
					</div>
				</div>
				<div class="balance">
					<p class="title">Remaining balance</p>
					<div class="flex align-items-center">
						<p class="btc-value">{{ remainingCryptoCurrency }} {{ currency }}</p>
						<p class="fixed-value">${{ remainingCurrency }}</p>
					</div>
				</div>
			</div>
			<!-- <img class="popup__success-image" src="@/assets/images/success-popup.png" /> -->
		</div>
		<div slot="body">
			<div class="progress-bar"></div>
		</div>
	</lk-pop-up>
</template>
<script>
import LkPopUp from '@/layout/LkPopUp';
import getCryptoInfo from '@/functions/getCryptoInfo';

export default {
	components: {
		LkPopUp,
	},
	props: [
		'successPopup',
		'remainingCryptoCurrency',
		'remainingCurrency',
		'currencyAmount',
		'cryptoCurrencyAmount',
		'currency',
		'paymentAddress',
		'fullCurrencyName',
	],
	methods: {
		getCryptoInfo,
	},
	computed: {
		sendArrow() {
			return require(`@/assets/images/send-arrow-${this.currency.toLowerCase()}.svg`);
		},
	},
};
</script>
<style lang="scss" scoped>
.main-image {
	transform: translateY(-50%);
}
.balance {
	margin: 7px 0 30px;
}
.transaction {
	padding: 0 0 20px !important;
	font-size: 36px !important;
}
.send-arrow {
	margin: 15px 0 20px;
	&.rotated {
		transform: rotate(90deg);
	}
}

.payment-usd {
	font-size: 16px;
}
.from {
	font-size: 16px;
}
.network-fee,
.balance {
	display: flex;
	justify-content: space-between;
	p {
		opacity: 0.5 !important;
		color: #ffffff;
		font-size: 12px !important;
	}
}
.address {
	margin-bottom: 45px !important;
	color: #ffffff;
	font-weight: 600;
	font-size: 14px;
}
.exchange-block_fee {
	width: 100%;
	min-width: 300px;
}
.network-fee,
.balance {
	padding: 0 !important;
}
.fixed-value {
	margin-left: 10px;
	width: auto;
}
.title {
	width: 140px;
}
.exchange-popup_title {
	position: static;
}
.exchange-popup_title,
.exchange-popup_title > * {
	z-index: 20;
}
.progress-bar {
	width: 80%;
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
	bottom: 0;
	height: 2px;
	box-shadow: 0 -2px 7px rgba(253, 165, 12, 0.93);
	border-radius: 1px;
	background-color: #fda50c;
}
</style>
