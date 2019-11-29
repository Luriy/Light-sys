<template>
	<lk-pop-up
		v-if="sendPopup"
		class="transfer-popup"
		@closeModal="$emit('onClose')"
		:popupSize="{ width: '680px', height: '500px' }"
	>
		<div slot="title" class="exchange-popup_title">
			<img v-if="currency === 'BTC'" src="@/assets/images/btc.png" alt title />
			<img v-if="currency === 'ETH'" src="@/assets/images/eth.png" alt title />
			<img v-if="currency === 'LTC'" src="@/assets/images/ltc.svg" alt title />
			<p class="transaction">
				Confirmation <br />
				send {{ currencyAmount }} USD
			</p>
			<div class="phone-question" v-if="user.Phone">
				<p class="question">We sent an SMS confirmation to the number</p>
				<div class="number-block">
					<p class="number">{{ user.Phone }}</p>
					<router-link class="link" to="/">Wrong number?</router-link>
				</div>
			</div>
			<div class="email-question" v-else>
				<p class="question">We sent an email confirmation to the email</p>
				<div class="number-block">
					<p class="number">{{ user.Email }}</p>
					<router-link class="link" to="/">Wrong email?</router-link>
				</div>
			</div>
		</div>
		<div slot="smsNumber" class="exchange-popup_sms-number">
			<input
				class="number-input"
				v-for="(input, index) in smsCodes"
				:key="input + index"
				v-model="input[index]"
				@keyup="
					index !== smsCodes.length - 1 ? $event.target.nextElementSibling.focus() : $emit('onSend')
				"
				placeholder="_"
				type="text"
				maxLength="1"
				size="1"
				min="0"
				max="9"
				pattern="[0-9]{1}"
			/>

			<div class="timer-body">
				<div class="title">Resend code:</div>
				<div class="timer" v-show="countdown > 0">
					00:{{ `${countdown < 10 ? '0' : ''}${countdown}` }} Sec
				</div>
				<p class="repeat-btn" v-show="countdown === 0" @click="$emit('onSendSms')">Repeat</p>
			</div>
		</div>
		<div slot="body" class="exchange-popup_body">
			<div class="exchange-popup_info">
				<div class="flex">
					<p class="from" :class="currency.toLowerCase()">
						{{ formatCurrency(cryptoCurrencyAmount, '', 5) }} {{ currency }}
					</p>
					<p class="payment-usd">${{ formatCurrency(currencyAmount) }}</p>
				</div>
				<img v-if="currency === 'BTC'" src="@/assets/images/send-arrow-btc.svg" alt title />
				<img v-else src="@/assets/images/send-arrow-eth.svg" alt title class="send-arrow-eth" />
				<p class="payment-address">{{ paymentAddress }}</p>
			</div>
			<div class="exchange-block_fee">
				<div class="network-fee">
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
		</div>
		<div slot="buttons" class="exchange-popup_buttons">
			<button class="back" @click="$emit('onClose')">Back</button>
		</div>
	</lk-pop-up>
</template>
<script>
import LkPopUp from '@/layout/LkPopUp';

export default {
	components: {
		LkPopUp,
	},
	props: [
		'sendPopup',
		'remainingCryptoCurrency',
		'remainingCurrency',
		'currencyAmount',
		'cryptoCurrencyAmount',
		'currency',
		'smsCodes',
		'user',
		'paymentAddress',
		'countdown',
		'fullCurrencyName',
	],
};
</script>
<style scoped>
.send-arrow-eth {
	transform: rotate(-90deg);
}
.exchange-popup_body {
	width: 620px !important;
}
</style>
