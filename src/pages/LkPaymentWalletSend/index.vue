<template>
	<lk-layout>
		<payments-and-transfer>
			<div :class="['send-block', currency.toLowerCase()]">
				<div class="block-title">
					<div class="select">
						<span class="select__title" @click="isSelectWalletOpened = !isSelectWalletOpened">
							Send {{ getCryptoInfo(currency).fullName }}
						</span>
						<transition name="fade">
							<div class="select__modal" v-show="isSelectWalletOpened">
								<div
									class="select__modal-item"
									v-for="wallet in wallets"
									:key="wallet.address"
									:class="{
										active: wallet.address == $route.params.address,
										unavailable: !wallet.isAvailable,
									}"
									@click="handleSelectWallet(wallet.currency, wallet.address, wallet.isAvailable)"
								>
									<div
										v-if="!wallet.isAvailable"
										class="unavailable-block flex justify-content-center align-items-center"
									>
										<p class="unavailable-text">Temporarily unavailable</p>
									</div>
									<img width="17" :src="getCryptoInfo(wallet.currency).image.corner" />
									<h2 class="select__modal-currency">
										{{ getCryptoInfo(wallet.currency).fullName }}
									</h2>
									<span class="select__modal-balance" v-if="wallet.isAvailable">{{
										`${wallet.currency} ${formatCurrency(wallet.balance, '', 5)}`
									}}</span>
									<span class="select__modal-balance-usd" v-if="wallet.isAvailable">{{
										`$${formatCurrency(wallet.balanceUSD)} USD`
									}}</span>
								</div>
							</div>
						</transition>
					</div>
					<img :src="getCryptoInfo(currency).image.corner" height="65" alt title />
					<router-link :to="{ name: 'LkPaymentWallet' }" class="close"
						><img src="@/assets/images/path.svg" alt title
					/></router-link>
				</div>
				<div class="send-form">
					<div class="send-form-input">
						<input
							type="text"
							v-model="paymentAddress"
							spellcheck="false"
							:placeholder="`Send to ${getCryptoInfo(currency).fullName} address..`"
						/>
						<div class="qr"><img src="@/assets/images/bitmap-i.png" alt title /></div>
					</div>
					<div class="send-form-input--amount">
						<input
							type="text"
							v-model="cryptoCurrencyAmount"
							@input="handleCryptoCurrencyAmount"
							placeholder="0.00"
						/>
						<div class="btns">
							<button
								class="btn"
								:class="{ active: activeButton === 'Min' }"
								@click="handleButton('Min')"
							>
								Min
							</button>
							<button
								class="btn"
								:class="{ active: activeButton === 'Half' }"
								@click="handleButton('Half')"
							>
								Half
							</button>
							<button
								class="btn"
								:class="{ active: activeButton === 'All' }"
								@click="handleButton('All')"
							>
								All
							</button>
							<span :class="[currency.toLowerCase()]">{{ currency }}</span>
						</div>
					</div>
					<div class="send-form-balance">
						<div class="current-balance">
							<span>$</span>
							<input
								type="text"
								v-model="currencyAmount"
								name="balance"
								placeholder="0.00"
								@input="handleCurrencyAmount"
							/>
						</div>
						<div class="currency-balance">USD</div>
					</div>
					<div class="send-form-button">
						<button @click="onSendSms">Send</button>
						<error :error="error"></error>
					</div>

					<div class="send-form-totals">
						<div class="send-form-totals-total">
							<div class="text">{{ getCryptoInfo(currency).fullName }} Network Fee</div>
							<div class="value">
								<span>0.00021 {{ currency }}</span>
								<span>$0.04</span>
							</div>
						</div>
						<div class="send-form-totals-total">
							<div class="text">Remaining Balance</div>
							<div class="value">
								<span>{{ `${remainingCryptoCurrency} ${currency}` }} </span>
								<span>${{ remainingCurrency }}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<lk-transfer-confirmation-popup
				@onClose="closeModal"
				:sendPopup="sendPopup"
				:remainingCryptoCurrency="remainingCryptoCurrency"
				:remainingCurrency="remainingCurrency"
				:currency="currency"
				:fullCurrencyName="getCryptoInfo(currency).fullName"
				:user="user"
				:paymentAddress="paymentAddress"
				:currencyAmount="currencyAmount"
				:cryptoCurrencyAmount="cryptoCurrencyAmount"
				:countdown="countdown"
				@onRepeatSms="onRepeatSms"
				@onSuccess="handleSuccessTransfer"
			></lk-transfer-confirmation-popup>
			<lk-transfer-success-popup
				:successPopup="successPopup"
				:remainingCryptoCurrency="remainingCryptoCurrency"
				:remainingCurrency="remainingCurrency"
				:currencyAmount="currencyAmount"
				:cryptoCurrencyAmount="cryptoCurrencyAmount"
				:currency="currency"
				:fullCurrencyName="getCryptoInfo(currency).fullName"
				@onClose="successPopup = false"
				:paymentAddress="paymentAddress"
			></lk-transfer-success-popup>
		</payments-and-transfer>
	</lk-layout>
</template>
<script>
import LkLayout from '@/layout/LkLayout';
import PaymentsAndTransfer from '@/layout/LkPaymentsAndTransfer';
import { mapGetters } from 'vuex';
import { VALIDATE_AMOUNT_TRANSFER_EXCHANGE, VALIDATE_ADDRESS } from '@/validation';
import { getAuthParams } from '@/functions/auth';
import capitalizeFirstLetter from '@/functions/capitalizeFirstLetter';
import getCryptoInfo from '@/functions/getCryptoInfo';
import Error from '@/components/Error';
import LkTransferConfirmationPopup from '@/components/Popups/TransferConfirmation';
import LkTransferSuccessPopup from '@/components/Popups/TransferSuccess';
import { AUTH_LOGOUT } from '@/store/actions/auth';
import EnterCode from '@/components/EnterCode';
import formatMoney from '@/functions/formatMoney';

export default {
	components: {
		LkLayout,
		PaymentsAndTransfer,
		Error,
		LkTransferConfirmationPopup,
		LkTransferSuccessPopup,
		EnterCode,
	},
	data() {
		return {
			cryptoCurrencyAmount: null,
			currencyAmount: null,
			paymentAddress: null,
			activeButton: null,
			isSelectWalletOpened: false,
			successPopup: false,
			sendPopup: false,
			timer: null,
			countdown: 59,
			isTransferSuccess: false,
			error: null,
			windowHandler: null,
			updateTypesTimer: null,
		};
	},
	mounted() {
		const select = document.querySelector('.send-block .select');
		this.windowHandler = ({ target }) => {
			if (
				(target ? !target.classList.contains('.send-block .select') : false) &&
				!select.contains(target)
			) {
				this.isSelectWalletOpened = false;
			}
		};
		window.addEventListener('click', this.windowHandler);
		this.$store.dispatch('wallet/GET_TYPES');
		this.updateTypesTimer = setInterval(() => {
			this.$store.dispatch('wallet/GET_TYPES');
		}, 5000);
	},
	beforeDestroy() {
		window.removeEventListener('click', this.windowHandler);
		clearInterval(this.updateTypesTimer);
	},
	computed: {
		...mapGetters({
			wallets: 'wallet/WALLETS',
			types: 'wallet/TYPES',
		}),
		currency() {
			return this.$route.params.currency;
		},
		user() {
			return { ...getAuthParams() };
		},
		course() {
			return this.types[getCryptoInfo(this.currency).fullName.toLowerCase()].price;
		},
		currentWallet() {
			return this.wallets.find((wallet) => wallet.address == this.$route.params.address);
		},
		minAmount() {
			return getCryptoInfo(this.currency).minAmountToTransfer;
		},
		initialBalance() {
			return {
				currency: this.currentWallet.balanceUSD,
				cryptoCurrency: this.currentWallet.balance,
			};
		},
		remainingCurrency() {
			const currency = Number(this.initialBalance.currency);
			const currencyAmount = Number(this.currencyAmount);
			if (currency - currencyAmount < 0) {
				return 0;
			} else {
				return formatMoney(currency - currencyAmount, 'currency');
			}
		},
		remainingCryptoCurrency() {
			const cryptoCurrency = Number(this.initialBalance.cryptoCurrency);
			const cryptoCurrencyAmount = Number(this.cryptoCurrencyAmount);
			if (cryptoCurrency - cryptoCurrencyAmount < 0) {
				return 0;
			} else {
				return formatMoney(cryptoCurrency - cryptoCurrencyAmount, 'crypto');
			}
		},
	},
	methods: {
		getCryptoInfo,
		clearData() {
			this.cryptoCurrencyAmount = null;
			this.currencyAmount = null;
			this.paymentAddress = null;
			this.activeButton = null;
			this.isSelectWalletOpened = false;
			this.error = null;
			this.sendPopup = false;
			clearInterval(this.timer);
			this.timer = null;
			this.countdown = 59;
		},
		cryptoToCurrency(crypto) {
			return (Number(crypto) * this.course).toFixed(2);
		},
		currencyToCrypto(currency) {
			return (Number(currency) / this.course).toFixed(5);
		},
		handleCurrencyAmount() {
			this.cryptoCurrencyAmount = this.currencyToCrypto(this.currencyAmount);
			if (this.currencyAmount == this.initialBalance.currency.toFixed(2)) {
				this.activeButton = 'All';
			} else if (this.currencyAmount == (this.initialBalance.currency / 2).toFixed(2)) {
				this.activeButton = 'Half';
			} else if (this.cryptoToCurrency(this.currencyAmount) == this.minAmount) {
				this.activeButton = 'Min';
			} else {
				this.activeButton = null;
			}
		},
		handleCryptoCurrencyAmount({ target: { value } }) {
			this.currencyAmount = this.cryptoToCurrency(this.cryptoCurrencyAmount);

			if (this.cryptoCurrencyAmount == this.initialBalance.cryptoCurrency) {
				this.activeButton = 'All';
			} else if (this.cryptoCurrencyAmount == this.initialBalance.cryptoCurrency / 2) {
				this.activeButton = 'Half';
			} else if (this.cryptoCurrencyAmount == this.minAmount) {
				this.activeButton = 'Min';
			} else {
				this.activeButton = null;
			}
		},
		handleButton(name) {
			if (name !== this.activeButton) {
				this.activeButton = name;
			} else {
				this.activeButton = null;
			}

			if (name === 'All') {
				this.cryptoCurrencyAmount = this.initialBalance.cryptoCurrency.toFixed(5);
				this.currencyAmount = this.initialBalance.currency.toFixed(2);
			} else if (name === 'Half') {
				this.cryptoCurrencyAmount = (this.initialBalance.cryptoCurrency / 2).toFixed(5);
				this.currencyAmount = (this.initialBalance.currency / 2).toFixed(2);
			} else if (name === 'Min') {
				this.cryptoCurrencyAmount = this.minAmount.toFixed(5);
				this.currencyAmount = this.cryptoToCurrency(this.minAmount);
			}
		},
		handleSelectWallet(currency, address, isAvailable) {
			if (isAvailable) {
				this.clearData();
				this.$router.push(`/payments-and-transfer/send/${currency}/${address}`);
			} else return false;
		},
		handleSuccessTransfer() {
			this.sendPopup = false;
			this.successPopup = true;

			setTimeout(() => {
				this.$store.dispatch('transactionsHistory/GET_TRANSACTIONS', {
					wallets: this.wallets,
				});
			}, 5000);

			setTimeout(() => {
				this.successPopup = false;
				this.clearData();
			}, 7000);
		},
		closeModal() {
			this.sendPopup = false;
			this.timeout = 59;
			clearInterval(this.timer);
			this.clearData();
		},
		onRepeatSms() {
			this.$store.dispatch('transfer/GET_TRANSFER_TOKEN', getAuthParams());
			this.countdown = 59;
			this.timer = setInterval(() => {
				this.countdown--;
			}, 1000);

			setTimeout(() => {
				document.querySelector('.transfer-popup .number-input').focus();
			}, 50);
		},
		onSendSms() {
			this.error = null;
			const validateErrorAmount = VALIDATE_AMOUNT_TRANSFER_EXCHANGE(
				this.cryptoCurrencyAmount,
				this.initialBalance.cryptoCurrency,
				this.minAmount,
				this.currency,
			);
			const validateErrorAddress = VALIDATE_ADDRESS(
				this.paymentAddress,
				this.getCryptoInfo(this.currency).fullName,
				this.currentWallet.address,
			);

			if (validateErrorAmount === null && validateErrorAddress === null) {
				this.sendPopup = true;

				this.countdown = 59;

				setTimeout(() => {
					document.querySelector('.transfer-popup .number-input').focus();
				}, 50);

				this.$store.dispatch('transfer/GET_TRANSFER_TOKEN', getAuthParams()).then(() => {
					this.timer = setInterval(() => {
						this.countdown--;
					}, 1000);
				});
			} else {
				this.error = validateErrorAmount || validateErrorAddress;
			}
		},
	},
	watch: {
		countdown(value) {
			if (value === 0) {
				clearInterval(this.timer);
			}
		},
	},
};
</script>
<style scoped>
.unavailable-block {
	border-radius: 0;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
	-webkit-appearance: none;
}
input[type='number'] {
	-moz-appearance: textfield;
}
.current-balance {
	width: 100%;
}
.current-balance input[name='balance'] {
	width: 90%;
}
.transfer-popup .payment-address {
	margin-right: 15px;
	color: #fff;
	font-size: 14px;
	font-weight: 600;
}
.transfer-popup .from {
	font-size: 14px;
	font-weight: 600;
}
.transfer-popup .payment-usd {
	font-size: 14px;
	font-weight: 600;
	color: #fff;
	margin-left: 9px;
}
.transfer-popup .fixed-value {
	width: 90px;
	text-align: right;
}
.transfer-popup .btc-value {
	margin-right: 0 !important;
}
.exchange-popup_info img {
	left: 35% !important;
}
.exchange-popup_body {
	width: 620px !important;
}
</style>
