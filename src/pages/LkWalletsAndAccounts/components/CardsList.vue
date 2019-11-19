<template>
	<div>
		<draggable
			v-model="draggableMappedCurrencies"
			v-if="isCardsMovingAndDeleting"
			class="wallets-list_item_body"
		>
			<cards-list-template
				@onOpenDeletePopup="handleOpenDeletePopup"
				:mappedCurrencies="mappedCurrencies"
				:isCardsMovingAndDeleting="isCardsMovingAndDeleting"
				@onClick="handleClick"
			></cards-list-template>
		</draggable>
		<cards-list-template
			v-else
			@onOpenDeletePopup="handleOpenDeletePopup"
			:mappedCurrencies="mappedCurrencies"
			:isCardsMovingAndDeleting="isCardsMovingAndDeleting"
			@onClick="handleClick"
			class="wallets-list_item_body"
		>
		</cards-list-template>
		<lk-popup-delete-card
			@onClose="handleCloseDeletePopup"
			@onDeleteCard="handleDeleteCard"
			:deletePopup="deletePopup"
			:formattedCardNumber="formatCardNumber(deletePopup.number)"
			:bankImage="getBankImage(deletePopup.psid, 'big')"
		></lk-popup-delete-card>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';
import draggable from 'vuedraggable';
import getCardsByCurrency from '@/functions/getCardsByCurrency';
import getCurrencyInfo from '@/functions/getCurrencyInfo';
import getBankImage from '@/functions/getBankImage';
import formatCardNumber from '@/functions/formatCardNumber';
import CardsListTemplate from './CardsListTemplate';
import LkPopupDeleteCard from '@/components/Popups/DeleteCard/index';

export default {
	// left-arrow-purple.svg or cloud.svg - type of card

	name: 'CardsList',
	props: ['isCardsMovingAndDeleting'],
	components: {
		draggable,
		CardsListTemplate,
		LkPopupDeleteCard,
	},
	data() {
		return {
			deletePopup: {
				number: null,
				isOpened: false,
				psid: null,
			},
		};
	},
	created() {
		Promise.all([
			this.$store.dispatch('common/GET_BANKS'),
			this.$store.dispatch('card/GET_CARDS'),
			this.$store.dispatch('common/GET_ALL_CURRENCIES'),
		]).then(([banks, cards, currencies]) => {
			const localStorageCurrencies = localStorage.getItem('stateWalletsAndAccountsPageCurrencies');

			this.$store.commit(
				'currency/SET_WALLETS_AND_ACCOUNTS_PAGE_CURRENCIES',
				currencies.map((currency) => {
					const { fullName, code } = getCurrencyInfo(currency);
					return {
						currency,
						fullName,
						code,
						isactive: false,
						cards: this.cards.filter(({ Currency }) => Currency === currency),
					};
				}),
				// .filter(({ cards }) => cards.length !== 0), show currency if has cards
			);
		});
	},
	computed: {
		...mapGetters({
			mappedCurrencies: 'currency/WALLETS_AND_ACCOUNTS_PAGE_CURRENCIES',
			banks: 'common/BANKS',
			cards: 'card/CARDS',
			currencies: 'currency/ALL_CURRENCIES',
		}),
		draggableMappedCurrencies: {
			get() {
				return this.mappedCurrencies;
			},
			set(value) {
				return this.$store.commit('currency/SET_WALLETS_AND_ACCOUNTS_PAGE_CURRENCIES', value);
			},
		},
	},
	methods: {
		formatCardNumber,
		getBankImage,
		getCardsByCurrency,
		handleDeleteCard(number) {
			this.handleCloseDeletePopup();
			this.$store
				.dispatch('card/DELETE_CARD', { NumberCard: number })
				.then((data) => {
					const errors = Object.values(data[0]['Errors']);

					this.$store.dispatch('alerts/setNotification', {
						message: errors.length ? errors[0] : 'Card has been successfully deleted',
						status: errors.length ? 'error-status' : 'success-status',
						icon: errors.length ? 'close' : 'done',
					});
				})
				.then(() =>
					this.$store.commit(
						'currency/SET_WALLETS_AND_ACCOUNTS_PAGE_CURRENCIES',
						this.mappedCurrencies.map((item) => ({
							...item,
							cards: item.cards.filter((card) => card.Number !== number),
						})),
						// .filter(({ cards }) => cards.length !== 0), show currency if has cards
					),
				);
		},
		handleOpenDeletePopup(number, psid) {
			this.deletePopup = {
				isOpened: true,
				number,
				psid,
			};
		},
		handleCloseDeletePopup() {
			this.deletePopup = {
				number: null,
				isOpened: false,
				psid: null,
			};
		},
		handleClick({ fullName }) {
			this.$store.commit(
				'currency/SET_WALLETS_AND_ACCOUNTS_PAGE_CURRENCIES',
				this.mappedCurrencies.map((item) =>
					fullName === item.fullName
						? {
								...item,
								isactive: !item.isactive,
						  }
						: item,
				),
			);
		},
	},
};
</script>
