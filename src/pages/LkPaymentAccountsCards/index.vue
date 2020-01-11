<template>
	<lk-layout>
		<div class="accounts-list">
			<div class="title">
				<p>Accounts and Cards</p>
				<back-to-previous-page-button :link="'/wallets'"></back-to-previous-page-button>
			</div>
			<div class="accounts-list_wrapper">
				<div class="accounts-list_wrapper_title">
					Accounts and Cards
				</div>
				<div class="accounts-list_wrapper_tabs">
					<open-account
						:isActive="tabs[0].isActive"
						@onOpenTab="handleOpenTab(tabs[0], tabs)"
						@onFreeze="handleFreeze"
						:currencies="currencies"
						:userCurrencies="userCurrencies"
					></open-account>

					<div class="accounts-list_wrapper_tab" v-bind:class="{ active: tabs[1].isActive }">
						<div class="accounts-list_wrapper_tab_header" v-on:click="handleOpenTab(tabs[1], tabs)">
							<div class="icon">
								<div class="image">
									<img src="@/assets/images/icons/credit-card2.svg" width="17" alt title />
								</div>
								<p>Open a card</p>
							</div>
							<div class="flex align-items-center">
								<transition name="fade-medium">
									<div
										class="button-wrapper button-gradient"
										v-show="tabs[1].isActive && isEditing"
										@click="handleCancel"
									>
										<button class="add-cart-action-button cancel no-margin">
											Cancel
										</button>
									</div>
								</transition>
								<transition name="fade-medium">
									<div
										class="button-wrapper button-gradient"
										v-show="tabs[1].isActive && isEditing"
										@click="handleApply"
									>
										<button class="add-cart-action-button apply button-gradient">
											Apply
										</button>
									</div>
								</transition>
								<transition name="fade-medium">
									<div
										class="button-wrapper button-gradient"
										@click="handleEdit"
										v-show="tabs[1].isActive && !isEditing"
									>
										<button class="add-cart-action-button cancel">
											Edit
										</button>
									</div>
								</transition>

								<div class="toggle active" :class="{ opened: tabs[1].isActive }"></div>
							</div>
						</div>

						<div class="accounts-list_wrapper_tab_body ">
							<div class=" accounts-list_wrapper_tab_body_title">
								What type of card do you want to open?
							</div>

							<div class="accounts-list_wrapper_tab_body_table cards">
								<div
									class="accounts-list_wrapper_tab_body_table_tr"
									v-for="(item, index) in openCardCurrencies"
									:key="item.full"
								>
									<div
										class="accounts-list_wrapper_tab mb-10 full-width"
										v-bind:class="{
											active:
												tabs[1].activeCurrencies[index] && tabs[1].activeCurrencies[index].isActive,
										}"
									>
										<div
											class="accounts-list_wrapper_tab_header flex align-items-center justify-content-between"
											@click="
												handleOpenTab(
													tabs[1].activeCurrencies[index],
													tabs[1].activeCurrencies,
													false,
												)
											"
										>
											<div class="flex align-items-center">
												<div class="currency">
													<div class="icon" v-html="item.code"></div>
													<div class="text">{{ item.fullName }}</div>
												</div>
												<div class="banks">
													<div
														class="image-plate"
														v-for="item in uniqueizeArray(
															getCardsByCurrency(item.currency, cards),
															'Psid',
														)"
														:key="item.currency"
													>
														<img :src="getBankImage(item.Psid, 'small')" />
													</div>
												</div>
											</div>
											<div class="flex align-items-center">
												<transition name="fade">
													<add-native-card
														@onClickRadioButton="handleClickRadioButton"
														@onAddNativeCard="handleEdit"
														@onCancel="handleCancel"
														:isEditing="isEditing"
													></add-native-card>
												</transition>
												<div
													class="toggle"
													:class="{
														active: getCardsByCurrency(item.currency, cards).length,
														opened: tabs[1].activeCurrencies.length
															? tabs[1].activeCurrencies[index].isActive
															: false,
													}"
												></div>
											</div>
										</div>
										<div class="accounts-list_wrapper_tab_body">
											<cards-list
												:currency="item.currency"
												@onDeleteCard="writeSoonDeleteCardToStore"
												@onEditCard="writeSoonEditCardToStore"
												@onClickCard="handleClickCard"
												:isEditing="isEditing"
												:banks="banks"
												:cards="cards"
												:filteredCards="getCardsByCurrency(item.currency, cards)"
											></cards-list>
										</div>
									</div>
								</div>
							</div>
							<add-new-card :banks="banks"></add-new-card>
						</div>
					</div>
					<deposit :isActive="tabs[2].isActive" @open="handleOpenTab(tabs[2], tabs)"></deposit>
				</div>
			</div>
		</div>
	</lk-layout>
</template>

<script>
import LkLayout from '@/layout/LkLayout';

import { mapGetters } from 'vuex';

import {
	AddNewCard,
	Deposit,
	CardsList,
	AddNativeCard,
	OpenAccount,
	BackToPreviousPageButton,
} from './components/index.js';
import getCurrencyInfo from '@/functions/getCurrencyInfo';
import getBankImage from '@/functions/getBankImage';
import getCardsByCurrency from '@/functions/getCardsByCurrency';
import uniqueizeArray from '@/functions/uniqueizeArray';
import './styles.scss';

export default {
	name: 'LkPaymentWalletsWalletsList',
	components: {
		LkLayout,
		AddNewCard,
		Deposit,
		CardsList,
		AddNativeCard,
		OpenAccount,
		BackToPreviousPageButton,
	},
	mounted() {
		this.$store.dispatch('card/GET_CARDS');
		this.$store.dispatch('currency/GET_ALL_CURRENCIES');
		this.$store.dispatch('currency/GET_USER_CURRENCIES');
		this.$store.dispatch('common/GET_BANKS');
	},
	computed: {
		...mapGetters({
			userCurrencies: 'currency/USER_CURRENCIES',
			currencies: 'currency/CURRENCIES',
			banks: 'common/BANKS',
			cards: 'card/CARDS',
		}),
		openCardCurrencies() {
			return this.currencies.map((currency) => {
				const { fullName, code } = getCurrencyInfo(currency);
				return {
					currency,
					fullName,
					code,
					banks: this.banks.filter(({ valute }) => valute === currency),
					isActive: false,
				};
			});
		},
	},
	data() {
		return {
			isEditing: false,
			freezeActive: false,
			deletingCards: [],
			editingsCards: [],
			tabs: [
				{
					isActive: false,
				},
				{
					isActive: false,
					isCardsListActive: false,
					isEditing: false,
					activeCurrencies: [],
				},
				{
					isActive: false,
				},
			],
		};
	},
	methods: {
		getBankImage,
		getCardsByCurrency,
		uniqueizeArray,
		handleOpenTab(currentTab, tabs, isBigTab = true) {
			if (!this.freezeActive) {
				if (this.tabs.indexOf(currentTab) === 1 && currentTab.isActive === true && isBigTab) {
					this.isEditing = false;
				}

				const isCurrentTabActive = currentTab.isActive;
				tabs.forEach((tab) => (tab.isActive = false));
				currentTab.isActive = !isCurrentTabActive;
			}
		},
		handleClickRadioButton() {
			this.handleFreeze();
		},
		handleEdit() {
			this.handleFreeze();

			this.isEditing = true;
		},
		handleFreeze() {
			this.freezeActive = true;
			setTimeout(() => (this.freezeActive = false), 200);
		},
		handleClickCard() {
			if (this.isEditing) {
				this.handleCancel();
			} else {
				this.isEditing = true;
			}
		},
		handleCancel() {
			this.$store.dispatch('card/GET_CARDS');
			this.handleFreeze();

			this.deletingCards = [];
			this.editingCards = [];

			this.isEditing = false;
		},
		writeSoonDeleteCardToStore(cardNumber) {
			this.deletingCards.push(cardNumber);
		},
		writeSoonEditCardToStore({ cardNumber, newCardNumber, psid, newCardHolder }) {
			if (this.editingsCards.every((card) => card.NumberCard !== cardNumber)) {
				this.editingsCards.push({
					NumberCard: cardNumber,
					NewNumber: newCardNumber,
					NewHolder: newCardHolder,
					NewPsid: psid,
				});
			}
		},
		handleApply() {
			this.deletingCards.forEach((card) =>
				this.$store.dispatch('card/DELETE_CARD', { NumberCard: card }).then((data) => {
					const errors = Object.values(data[0]['Errors']);

					// this.$store.dispatch('alerts/setNotification', {
					// 	message: errors.length
					// 		? errors[0]
					// 		: this.editingsCards.length > 1
					// 		? 'Cards have been successfully deleted'
					// 		: 'Card has been successfully deleted',
					// 	status: errors.length ? 'error-status' : 'success-status',
					// 	icon: errors.length ? 'close' : 'done',
					// });
				}),
			);
			this.editingsCards.forEach(({ NumberCard, NewNumber, NewHolder, NewPsid }) =>
				this.$store
					.dispatch('card/UPDATE_CARD', {
						NumberCard,
						NewNumber,
						NewHolder,
						NewPsid,
					})
					.then((data) => {
						const errors = Object.values(data[0]['Errors']);

						// this.$store.dispatch('alerts/setNotification', {
						// 	message: errors.length
						// 		? errors[0]
						// 		: this.editingsCards.length > 1
						// 		? 'Cards have been successfully edited'
						// 		: 'Card has been successfully edited',
						// 	status: errors.length ? 'error-status' : 'success-status',
						// 	icon: errors.length ? 'close' : 'done',
						// });
					}),
			);
			this.$store.dispatch('card/GET_CARDS');
		},
	},
	watch: {
		currencies(value) {
			this.tabs[1].activeCurrencies = value.map(() => ({
				isActive: false,
			}));
		},
	},
};
</script>
<style scoped>
.toggle {
	background-color: transparent;
}
.toggle:before {
	display: none;
}
.toggle.active {
	background-color: #65489d;
}
.toggle.active:before {
	display: block;
}
</style>
