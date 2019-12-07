<template>
	<lk-layout>
		<payments-and-transfer>
			<div :class="['send-block', currency.toLowerCase()]">
				<div class="block-title">
					<div class="select">
						<span class="select__title" @click="isSelectWalletOpened = !isSelectWalletOpened">
							Send {{ currencyName(currency) }}
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
									<img v-if="wallet.currency === 'BTC'" width="17" src="@/assets/images/btc.png" />
									<img v-if="wallet.currency === 'ETH'" width="17" src="@/assets/images/eth.png" />
									<img v-if="wallet.currency === 'LTC'" width="17" src="@/assets/images/ltc.svg" />
									<h2 class="select__modal-currency">{{ currencyName(wallet.currency) }}</h2>
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
					<img v-if="currency === 'BTC'" src="@/assets/images/btc.png" alt title />
					<img v-if="currency === 'ETH'" src="@/assets/images/eth.png" alt title />
					<img v-if="currency === 'LTC'" src="@/assets/images/ltc.svg" height="65" alt title />
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
							:placeholder="`Send to ${currencyName(currency)} address..`"
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
							<span>{{ currency }}</span>
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
							<div class="text">{{ currencyName(currency) }} Network Fee</div>
							<div class="value">
								<span>0.00021 BTC</span>
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
				@onSend="onSend"
				@onSendSms="onSendSms"
				:user="user"
				:smsCodes="smsCodes"
				:paymentAddress="paymentAddress"
				:currencyAmount="currencyAmount"
				:cryptoCurrencyAmount="cryptoCurrencyAmount"
				:countdown="countdown"
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

export default {
	components: {
		LkLayout,
		PaymentsAndTransfer,
		Error,
		LkTransferConfirmationPopup,
		LkTransferSuccessPopup,
	},
	data() {
		return {
			cryptoCurrencyAmount: null,
			currencyAmount: null,
			remainingCurrency: Number(0).toFixed(2),
			remainingCryptoCurrency: Number(0).toFixed(2),
			paymentAddress: null,
			activeButton: null,
			isSelectWalletOpened: false,
			successPopup: false,
			sendPopup: false,
			smsCodes: [{ 0: '' }, { 1: '' }, { 2: '' }, { 3: '' }, { 4: '' }, { 5: '' }],
			timer: null,
			countdown: 59,
			isTransferSuccess: false,
			error: null,
			windowHandler: null,
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

		this.$store.dispatch('wallet/GET_WALLETS');
		this.$store.dispatch('wallet/GET_TYPES');
	},
	beforeDestroy() {
		window.removeEventListener('click', this.windowHandler);
	},
	computed: {
		currency() {
			return this.$route.params.currency;
		},
		user() {
			return { ...getAuthParams() };
		},
		course() {
			return this.types[getCryptoInfo(this.currency).fullName.toLowerCase()].price;
		},
		...mapGetters({
			wallets: 'wallet/WALLETS',
			types: 'wallet/TYPES',
			operations: 'wallet/OPERATIONS',
			unconfirmedOperations: 'wallet/UNCONFIRMED_OPERATIONS',
		}),
		currentWallet() {
			return this.wallets.find((wallet) => wallet.address == this.$route.params.address);
		},
		minAmount() {
			switch (this.currency) {
				case 'BTC':
					return {
						toShow: 0.00035,
						toPay: 0.0004,
					};
				case 'ETH':
					return {
						toShow: 0.0005,
						toPay: 0.0006,
					};
				case 'LTC':
					return {
						toShow: 0.004,
						toPay: 0.003,
					};
			}
		},
		initialBalance() {
			return {
				currency: this.currentWallet.balanceUSD,
				cryptoCurrency: this.currentWallet.balance,
				course: this.currentWallet.balanceUSD / this.currentWallet.balance,
			};
		},
	},
	methods: {
		getCryptoInfo,
		clearData() {
			this.cryptoCurrencyAmount = null;
			this.currencyAmount = null;
			this.remainingCurrency = '0.00';
			this.remainingCryptoCurrency = '0.00';
			this.paymentAddress = null;
			this.activeButton = null;
			this.isSelectWalletOpened = false;
			this.error = null;
			this.sendPopup = false;
			(this.smsCodes = [
				{ 0: '' },
				{ 1: '' },
				{ 2: '' },
				{ 3: '' }, // <- делай это в цикле
				{ 4: '' },
				{ 5: '' },
			]),
				clearInterval(this.timer);
			this.timer = null;
			this.countdown = 59;
		},
		currencyName(currency) {
			let currencyName;

			switch (currency) {
				case 'BTC':
					return 'Bitcoin';
				case 'ETH':
					return 'Ethereum';
				case 'LTC':
					return 'Litecoin';
				default:
					throw 'Unknown currency';
			}
		},
		cryptoToCurrency(crypto) {
			return (Number(crypto) * this.course).toFixed(2);
		},
		currencyToCrypto(currency) {
			return (Number(currency) / this.course).toFixed(5);
		},
		handleCurrencyAmount() {
			this.cryptoCurrencyAmount = this.currencyToCrypto(this.currencyAmount);

			const remainingCryptoCurrency = (
				this.initialBalance.cryptoCurrency - this.cryptoCurrencyAmount
			).toFixed(5);
			this.remainingCryptoCurrency =
				remainingCryptoCurrency < 0 || isNaN(+remainingCryptoCurrency)
					? 0
					: remainingCryptoCurrency;

			const remainingCurrency = (this.initialBalance.currency - this.currencyAmount).toFixed(2);
			this.remainingCurrency =
				remainingCurrency < 0 || isNaN(+remainingCurrency) ? 0 : remainingCurrency;

			if (this.currencyAmount == this.initialBalance.currency.toFixed(2)) {
				this.activeButton = 'All';
			} else if (this.currencyAmount == (this.initialBalance.currency / 2).toFixed(2)) {
				this.activeButton = 'Half';
			} else if (this.cryptoToCurrency(this.currencyAmount) == this.minAmount.toPay) {
				this.activeButton = 'Min';
			} else {
				this.activeButton = null;
			}
		},
		handleCryptoCurrencyAmount({ target: { value } }) {
			this.currencyAmount = this.cryptoToCurrency(this.cryptoCurrencyAmount);

			const remainingCryptoCurrency = (
				this.initialBalance.cryptoCurrency - this.cryptoCurrencyAmount
			).toFixed(5);
			this.remainingCryptoCurrency =
				remainingCryptoCurrency < 0 || isNaN(+remainingCryptoCurrency)
					? 0
					: remainingCryptoCurrency;

			const remainingCurrency = (this.initialBalance.currency - this.currencyAmount).toFixed(2);
			this.remainingCurrency =
				remainingCurrency < 0 || isNaN(+remainingCurrency) ? 0 : remainingCurrency;

			if (this.cryptoCurrencyAmount == this.initialBalance.cryptoCurrency) {
				this.activeButton = 'All';
			} else if (this.cryptoCurrencyAmount == this.initialBalance.cryptoCurrency / 2) {
				this.activeButton = 'Half';
			} else if (this.cryptoCurrencyAmount == this.minAmount.toPay) {
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
				this.remainingCryptoCurrency = Number(0).toFixed(5);
				this.remainingCurrency = Number(0).toFixed(2);
			} else if (name === 'Half') {
				this.cryptoCurrencyAmount = (this.initialBalance.cryptoCurrency / 2).toFixed(5);
				this.currencyAmount = (this.initialBalance.currency / 2).toFixed(2);
				this.remainingCryptoCurrency = (this.initialBalance.cryptoCurrency / 2).toFixed(5);
				this.remainingCurrency = (this.initialBalance.currency / 2).toFixed(2);
			} else if (name === 'Min') {
				this.cryptoCurrencyAmount = this.minAmount.toPay;
				this.currencyAmount = this.cryptoToCurrency(this.minAmount.toPay);
				const remainingCryptoCurrency = this.initialBalance.cryptoCurrency - this.minAmount.toPay;
				this.remainingCryptoCurrency =
					remainingCryptoCurrency < 0 || isNaN(remainingCryptoCurrency)
						? Number(0).toFixed(5)
						: remainingCryptoCurrency.toFixed(5);

				const remainingCurrency =
					this.initialBalance.currency - this.cryptoToCurrency(this.minAmount.toPay);
				this.remainingCurrency =
					remainingCurrency < 0 || isNaN(remainingCurrency)
						? Number(0).toFixed(2)
						: remainingCurrency.toFixed(2);
			}
		},
		handleSelectWallet(currency, address, isAvailable) {
			if (isAvailable) {
				this.clearData();
				this.$router.push(`/payments-and-transfer/send/${currency}/${address}`);
			} else return false;
		},
		closeModal() {
			this.sendPopup = false;
			this.timeout = 59;
			clearInterval(this.timer);
			this.clearData();
		},
		onSendSms() {
			const validateErrorAmount = VALIDATE_AMOUNT_TRANSFER_EXCHANGE(
				this.cryptoCurrencyAmount,
				this.initialBalance.cryptoCurrency,
				this.minAmount.toShow,
				this.currency,
			);
			const validateErrorAddress = VALIDATE_ADDRESS(
				this.paymentAddress,
				this.currencyName(this.currency),
				this.currentWallet.address,
			);

			if (validateErrorAmount === null && validateErrorAddress === null) {
				this.error = null;
				this.sendPopup = true;

				this.countdown = 59;

				this.$store.dispatch('wallet/GET_TRANSFER_TOKEN', getAuthParams()).then(() => {
					this.timer = setInterval(() => {
						this.countdown--;
					}, 1000);
				});
			} else {
				this.error = validateErrorAmount || validateErrorAddress;
			}
		},
		onSend() {
			const token = this.smsCodes.map((smsCode, index) => smsCode[index]).join('');
			this.$store
				.dispatch('wallet/POST_TRANSFER_CRYPTO', {
					currency: capitalizeFirstLetter(this.$route.params.currency.toLowerCase()),
					from: this.$route.params.address,
					to: this.paymentAddress,
					amount: Number(this.cryptoCurrencyAmount).toFixed(5),
					token,
				})
				.then((data) => {
					if (data.success) {
						const firstTransactionObject = {
							currentWallet: this.currentWallet.address.toLowerCase(),
							url: data.data['Transaction_id: '],
							time: new Date(Date.now()),
							currency: this.currentWallet.currency,
							value: this.cryptoCurrencyAmount,
							valueUSD: this.currencyAmount,
							source: {
								From: this.paymentAddress.toLowerCase(),
								To: this.currentWallet.address.toLowerCase(),
							},
							isLocal: true,
						};
						const secondTransactionObject = {
							currentWallet: this.currentWallet.address.toLowerCase(),
							url: data.data['Transaction_id: '],
							time: new Date(Date.now()),
							currency: this.currentWallet.currency,
							value: this.cryptoCurrencyAmount,
							valueUSD: this.currencyAmount,
							source: {
								To: this.paymentAddress.toLowerCase(),
								From: this.currentWallet.address.toLowerCase(),
							},
							isLocal: true,
						};
						if (this.operations.length) {
							this.$store.commit('wallet/SET_UNCONFIRMED_OPERATIONS', [
								...this.unconfirmedOperations,
								firstTransactionObject,
								secondTransactionObject,
							]);
							this.sendPopup = false;
							this.successPopup = true;
						} else {
							this.$store.dispatch('wallet/GET_OPERATIONS', this.wallets).then((operations) => {
								this.$store.commit('wallet/SET_UNCONFIRMED_OPERATIONS', [
									...this.unconfirmedOperations,
									firstTransactionObject,
									secondTransactionObject,
								]);
							});
						}
					}
					setTimeout(() => {
						this.$store.dispatch('wallet/GET_OPERATIONS', { wallets: this.wallets });
						this.successPopup = false;
						this.clearData();
					}, 5000);
				});
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
