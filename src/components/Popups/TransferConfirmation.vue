<template>
	<lk-pop-up
		v-if="sendPopup"
		class="transfer-popup"
		@closeModal="handleCloseModal"
		:popupSize="{ width: '700px', height: '500px' }"
	>
		<div slot="title" class="exchange-popup_title">
			<img :src="getCryptoInfo(currency).image.corner" class="main-image" />
			<p class="transaction">
				Confirmation <br />
				send ${{ currencyAmount }} USD
			</p>
			<div class="phone-question" v-if="user.Phone">
				<p class="question">We sent an SMS confirmation to the number</p>
				<div class="number-block">
					<p class="number">{{ formatPhoneNumber(user.Phone) }}</p>
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
			<enter-code :smsCodes="smsCodes" @onSmsKeyUp="handleSmsKeyUp"></enter-code>
			<div class="timer-body">
				<div class="title">Resend code:</div>
				<div class="timer" v-show="countdown > 0">
					00:{{ `${countdown < 10 ? '0' : ''}${countdown}` }} Sec
				</div>
				<p class="repeat-btn" v-show="countdown === 0" @click="onRepeatSms">Repeat</p>
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
				<img :src="getCryptoInfo(currency).image.arrow" class="send-arrow" />
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
			<button class="back" @click="handleCloseModal">Back</button>
		</div>
	</lk-pop-up>
</template>
<script>
import LkPopUp from '@/layout/LkPopUp';
import formatPhoneNumber from '@/functions/formatPhoneNumber';
import EnterCode from '@/components/EnterCode';
import capitalizeFirstLetter from '@/functions/capitalizeFirstLetter';
import getCryptoInfo from '@/functions/getCryptoInfo';

export default {
	components: {
		LkPopUp,
		EnterCode,
	},
	props: [
		'sendPopup',
		'remainingCryptoCurrency',
		'remainingCurrency',
		'currencyAmount',
		'cryptoCurrencyAmount',
		'currency',
		'user',
		'paymentAddress',
		'countdown',
		'fullCurrencyName',
	],
	data() {
		return {
			smsCodes: [{ 0: '' }, { 1: '' }, { 2: '' }, { 3: '' }, { 4: '' }, { 5: '' }],
		};
	},
	methods: {
		formatPhoneNumber,
		getCryptoInfo,
		onSend() {
			const token = this.smsCodes.map((smsCode, index) => smsCode[index]).join('');
			this.$store
				.dispatch('transfer/TRANSFER_CRYPTO', {
					currency: capitalizeFirstLetter(this.$route.params.currency.toLowerCase()),
					from: this.$route.params.address,
					to: this.paymentAddress,
					amount: Number(this.cryptoCurrencyAmount).toFixed(5),
					token,
				})
				.then((data) => {
					if (data.success) {
						this.$emit('onSuccess');
					}
				});
		},
		handleSmsKeyUp(e, index) {
			const inputs = document.querySelectorAll('input.number-input');
			if (e.key === 'Backspace') {
				if (index !== 0) {
					inputs[index - 1].focus();
				}
				this.smsCodes[index][index] = '';
			} else if (e.key === 'Tab') {
				return false;
			} else {
				index !== this.smsCodes.length - 1 ? inputs[index + 1].focus() : this.onSend();
			}
		},
		onRepeatSms() {
			this.smsCodes = [{ 0: '' }, { 1: '' }, { 2: '' }, { 3: '' }, { 4: '' }, { 5: '' }];
			this.$emit('onRepeatSms');
		},
		handleCloseModal() {
			this.$emit('onClose');
			this.smsCodes = [{ 0: '' }, { 1: '' }, { 2: '' }, { 3: '' }, { 4: '' }, { 5: '' }];
		},
	},
};
</script>
<style lang="scss" scoped>
.transaction {
	margin-top: -15px;
}
.main-image {
	transform: translateY(-50%);
}
.send-arrow {
	&.rotated {
		transform: rotate(-90deg);
	}
}
.exchange-popup_body {
	max-width: 660px !important;
	width: 100%;
}
.network-fee {
	margin-bottom: 4px;
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
.exchange-block_fee {
	padding: 0 15px;
}
.exchange-popup_sms-number {
	width: 65%;
}
.link {
	text-decoration: none;
}
</style>
