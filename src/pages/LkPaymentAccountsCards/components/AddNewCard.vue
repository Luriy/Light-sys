<template>
	<div class="accounts-list_wrapper_tab add-new-card-header" v-bind:class="{ active: isActive }">
		<div
			class="accounts-list_wrapper_tab_header d-flex justify-content-between"
			v-on:click="handleOpen"
		>
			<div class="icon">
				<div class="image"><img src="@/assets/images/wallet2.svg" alt title /></div>
				<p>Add New Card</p>
			</div>
			<transition name="fade">
				<div class="flex" v-show="isActive">
					<div class="button-wrapper button-gradient">
						<button class="add-cart-action-button cancel" @click="handleCancel">Cancel</button>
					</div>
					<div class="button-wrapper button-gradient no-margin">
						<button class="add-cart-action-button apply button-gradient" @click="addCard">
							Apply
						</button>
					</div>
				</div>
			</transition>
		</div>
		<div class="accounts-list_wrapper_tab_body">
			<div class="flex align-items-center justify-content-between add-card__wrapper">
				<form class="add-card-form">
					<div class="add-card-form__inputs-block">
						<div class="flex flex-column">
							<input
								type="text"
								class="add-card-form__input"
								placeholder="Card number"
								v-model="cardInfo.number"
								maxlength="19"
								inputmode="numeric"
								@input="handleCardNumber"
							/>
							<div class="add-card-form__line"></div>
						</div>
						<div class="flex flex-column">
							<input
								type="text"
								class="add-card-form__input"
								placeholder="Name of card"
								v-model="cardInfo.name"
							/>
							<div class="add-card-form__line"></div>
						</div>
						<div class="select">
							<div
								class="select__header accounts-list_wrapper_tab_header flex justify-content-between align-items-center"
								@click="select.isActive = !select.isActive"
							>
								<div class="flex align-items-center">
									<div class="image-container" v-if="currentBank.psid">
										<img :src="getBankImage(currentBank.psid, 'small')" alt="" />
									</div>
									<div class="select__title">{{ currentBank.name }}</div>
								</div>
								<div class="toggle" :class="{ opened: isActive }"></div>
							</div>
							<transition name="fade">
								<div class="select__body flex flex-column" v-show="select.isActive">
									<div
										class="select__body-item flex align-items-center justify-content-between"
										:class="{ active: currentBank.name === bank.name }"
										v-for="bank in banks"
										:key="bank.psid"
										@click="handleClickBank(bank.name, bank.psid, bank.valute)"
									>
										<div class="flex align-items-center">
											<div class="image-container">
												<img :src="getBankImage(bank.psid, 'small')" alt="" />
											</div>
											<div class="bank-name">{{ bank.name }}</div>
										</div>
										<img src="@/assets/images/tick.svg" v-if="currentBank.name === bank.name" alt />
									</div>
								</div>
							</transition>
						</div>
					</div>
				</form>
				<div class="flex flex-column align-items-center virtual-card__wrapper">
					<div class="virtual-card">
						<div class="flex justify-content-between align-items-center" style="height: 25px;">
							<img :src="currentBank.psid ? getBankImage(currentBank.psid, 'small') : null" alt />
							<p class="virtual-card__currency">{{ this.currentBank.currency }}</p>
						</div>
						<div class="flex flex-column">
							<div class="flex justify-content-between virtual-card__number-and-date">
								<p class="virtual-card__paragraph">
									{{ maskInput(cardInfo.number, cardInfo.numberMask) }}
								</p>
								<p class="virtual-card__paragraph">
									MM/YY
								</p>
							</div>
							<div class="flex justify-content-between">
								<p class="virtual-card__paragraph">
									{{ cardInfo.name ? cardInfo.name : 'Full Name' }}
								</p>
								<img src="@/assets/images/mastercard.png" width="21" alt="mastercard" />
							</div>
						</div>
					</div>
					<p class="virtual-card__title">Your card 🎉</p>
				</div>
			</div>
			<error :error="error"></error>
		</div>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';
import Error from '@/components/Error';
import { VALIDATE_CARD } from '@/validation';
import getBankImage from '@/functions/getBankImage';
import fiatList from '@/settings/fiatList';
import formatCardNumber from '@/functions/formatCardNumber';
import getCurrencyInfo from '@/functions/getCurrencyInfo';

export default {
	components: {
		Error,
	},
	props: ['banks'],
	data() {
		return {
			fiatList,
			freezeActive: false,
			isActive: false,
			cardInfo: {
				numberMask: '**** **** **** ****',
				number: '',
				name: '',
			},
			currentBank: {
				psid: null,
				name: 'Choose your bank',
				currency: '',
			},
			select: {
				isActive: false,
			},
			error: null,
			windowHandler: null,
		};
	},
	computed: {
		...mapGetters({
			userCurrencies: 'currency/USER_CURRENCIES',
			groupCurrencies: 'group/GROUP_CURRENCIES',
			cards: 'card/CARDS',
		}),
	},
	mounted() {
		const select = document.querySelector('.add-new-card-header .select');
		this.windowHandler = ({ target }) => {
			if (
				(target ? !target.classList.contains('.add-new-card-header .select') : false) &&
				!select.contains(target)
			) {
				this.select.isActive = false;
			}
		};
		window.addEventListener('click', this.windowHandler);
	},
	beforeDestroy() {
		window.removeEventListener('click', this.windowHandler);
	},
	methods: {
		getBankImage,
		maskInput(value, mask) {
			return value + mask.slice(value.length);
		},
		handleCardNumber({ inputType }) {
			const { number } = this.cardInfo;
			if (
				(number.length === 4 || number.length === 9 || number.length === 14) &&
				inputType !== 'deleteContentBackward'
			) {
				this.cardInfo.number += ' ';
			}

			if (inputType === 'insertFromPaste') {
				this.cardInfo.number = formatCardNumber(this.cardInfo.number);
			}
		},
		handleClickBank(name, psid, currency) {
			this.currentBank = { name, psid, currency };
			this.select.isActive = false;
		},
		clearData() {
			this.cardInfo = {
				numberMask: '**** **** **** ****',
				number: '',
				name: '',
			};
			this.currentBank = {
				psid: null,
				name: 'Choose your bank',
				currency: '',
			};
			this.error = null;
		},
		handleCancel() {
			this.freezeActive = true;
			setTimeout(() => (this.freezeActive = false), 300);
			this.clearData();
			this.isActive = false;
		},
		handleOpen() {
			if (this.isActive === false && !this.freezeActive) {
				this.isActive = true;
			}
		},
		addCard() {
			const {
				cardInfo: { number, name },
				currentBank: { psid, currency },
			} = this;

			const validateError = VALIDATE_CARD({ number, name, psid, cards: this.cards });

			if (validateError) {
				this.error = validateError;
			} else {
				this.error = null;

				this.$store
					.dispatch('card/CREATE_CARD', {
						Holder: encodeURI(name),
						Number: number.replace(/\s+/g, ''),
						Psid: psid,
						Currency: currency,
					})
					.then((data) => {
						const errors = Object.values(data[0]['Errors']);
						if (errors.length) {
							this.error = errors[0];
						} else if (data['1'].return.Status === 'Complete') {
							if (this.userCurrencies.every((userCurrency) => userCurrency !== currency)) {
								this.$store
									.dispatch('currency/ADD_USER_CURRENCY', { ValuteName: currency })
									.then((data) => {
										if (data.success) {
											this.$store.commit('currency/SET_USER_CURRENCIES', [
												...this.userCurrencies,
												currency,
											]);
											this.$store.commit('group/SET_CURRENCIES_TO_GROUP', {
												groupName: 'Other currencies',
												currencies: [
													...this.groupCurrencies.find(
														({ groupName }) => groupName === 'Other currencies',
													).currencies,
													{
														cards: [],
														currency,
														code: getCurrencyInfo(currency).code,
														fullName: getCurrencyInfo(currency).fullName,
													},
												],
											});
										}
									});
							}
							this.handleCancel();
							this.$store.dispatch('card/GET_CARDS');
							this.$store.dispatch('alerts/setNotification', {
								message: `Card has been successfully added`,
								status: 'success-status',
								icon: 'done',
							});
						} else {
							this.$store.dispatch('alerts/setNotification', {
								message: 'Unknown error',
								status: 'error-status',
								icon: 'close',
							});
						}
					})
					.catch((err) => (this.error = err));
			}
		},
	},
};
</script>
<style scoped>
.select__header {
	height: 46px;
}
</style>
