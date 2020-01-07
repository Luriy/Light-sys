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
							<div class="select__header" @click="walletSelect.isActive = !walletSelect.isActive">
								<div class="flex align-items-center" v-if="currentType === 'wallet'">
									<img :src="getCryptoInfo(currentWallet.currency).image.corner" width="34" />
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
											{{ `$${Number(currentWallet.balanceUSD).toFixed(2)} USD` }}
										</span>
									</div>
								</div>
								<div class="flex align-items-center" v-else-if="currentType === 'card'">
									<div class="image-plate">
										<img :src="getBankImage(currentCard.psid, 'small')" alt />
									</div>
									<div class="flex flex-column">
										<span class="select__curency-name">{{ currentCard.name }}</span>
										<div class="select__balance">
											<span>
												{{ `****${currentCard.number.slice(currentCard.number.length - 4)}` }}
												{{ currentCard.currency }}
											</span>
											<span class="currency-divider">&#124;</span>
											<span class="balance-reserve">{{
												`Reserve: ${currentCard.reserve.toFixed(0)} ${currentCard.currency}`
											}}</span>
										</div>
									</div>
								</div>
								<div class="flex align-items-center" v-else-if="currentType === 'bank'">
									<div class="image-plate">
										<img :src="getBankImage(currentBank.psid, 'small')" />
									</div>
									<div class="flex flex-column">
										<span class="select__curency-name">{{ currentBank.name }}</span>
										<div class="select__balance">
											<span>
												{{ currentBank.currency }}
											</span>
											<span class="currency-divider">&#124;</span>
											<span class="balance-reserve">{{
												`Reserve: ${currentBank.reserve.toFixed(0)} ${currentCard.currency}`
											}}</span>
										</div>
									</div>
								</div>
								<div class="select__expand">
									<img src="@/assets/images/triangle.svg" width="6" height="4" />
								</div>
							</div>
							<payment-types
								:search="search"
								:isOpened="walletSelect.isActive"
								:wallets="wallets"
								:cards="cards"
								:banks="banks"
								@onSelectItem="handleSelectItem"
							></payment-types>
						</div>
					</div>
					<div class="payment-block">
						<div class="payment-types__wrapper">
							<div class="payment-types">
								<div
									class="payment-type"
									v-for="paymentType in paymentTypes"
									:key="paymentType.text"
								>
									<div class="icon-block">
										<img :src="paymentType.icon" alt title />
									</div>
									<div class="text-block">
										{{ paymentType.text }}
									</div>
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
import { mapGetters } from 'vuex';
import LkLayout from '@/layout/LkLayout';
import PaymentsAndTransfer from '@/layout/LkPaymentsAndTransfer';
import PaymentTypes from '@/components/PaymentTypes';
import getCryptoInfo from '@/functions/getCryptoInfo';
import getBankImage from '@/functions/getBankImage';
import payment_types from '../../data/pay_for/payment_types';
import payment_directions from '../../data/pay_for/payment_directions';
import './styles.scss';

export default {
	name: 'LkPayFor',
	components: {
		PaymentsAndTransfer,
		LkLayout,
		PaymentTypes,
	},
	data() {
		return {
			search: '',
			walletSelect: {
				isActive: false,
			},
			activePaymentDirection: null,
			currentType: 'wallet',
			currentWallet: {
				currency: 'BTC',
				balanceUSD: '0.00000',
				balance: '0.00',
				address: null,
			},
			currentCard: {
				name: null,
				number: null,
				currency: null,
				reserve: null,
				psid: null,
			},
			currentBank: {
				name: null,
				currency: null,
				reserve: null,
				psid: null,
			},
			windowHandler: null,
			paymentTypes: payment_types,
			paymentDirections: payment_directions,
			updateWalletsTimer: null,
		};
	},
	mounted() {
		this.$store.dispatch('common/GET_BANKS');
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
		this.updateWalletsTimer = setInterval(() => {
			this.$store.dispatch('wallet/UPDATE_WALLETS');
		}, 5000);
	},
	beforeDestroy() {
    window.removeEventListener('click', this.windowHandler);
    clearInterval(this.updateWalletsTimer)
	},
	computed: {
		...mapGetters({
			wallets: 'wallet/WALLETS',
			cards: 'card/CARDS',
			banks: 'common/BANKS',
		}),
		allUsdBalance() {
			return Number(this.wallets.reduce((acc, item) => acc + item.balanceUSD, 0)).toFixed(2) || 0;
		},
		filteredWallets() {
			return this.wallets.filter(({ fullName }) => {
				if (fullName) {
					return fullName.toLowerCase().includes(this.search);
				}
			});
		},
	},
	methods: {
		getCryptoInfo,
		getBankImage,
		setInitialCurrentWallet() {
			const walletsBalancesArray = this.wallets.map((wallet) => wallet.balanceUSD);
			const maxBalanceIndex = walletsBalancesArray.indexOf(
				Math.max.apply(null, walletsBalancesArray),
			);
			const walletWithMaxBalance = this.wallets.slice()[maxBalanceIndex];

			this.currentWallet = walletWithMaxBalance;
		},
		handleSelectItem(item, cardReserve) {
			if (item.address) {
				const { currency, balance, balanceUSD, address, isAvailable } = item;
				if (isAvailable) {
					this.currentType = 'wallet';
					this.walletSelect.isActive = false;
					this.currentWallet = { currency, balance, balanceUSD, address };
				} else return false;
			} else if (item.Number) {
				this.currentType = 'card';
				const { Name, Currency, Psid } = item;
				this.walletSelect.isActive = false;
				this.currentCard = {
					name: Name,
					currency: Currency,
					reserve: cardReserve,
					number: item.Number,
					psid: Psid,
				};
			} else if (item.reserve) {
				const { name, psid, valute, reserve } = item;
				this.walletSelect.isActive = false;
				this.currentType = 'bank';
				this.currentBank = {
					name,
					currency: valute,
					reserve,
					psid,
				};
			}
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
