<template>
	<div v-if="isCardsMovingAndDeleting">
		<div class="group-wrapper" v-for="(group, index) in groupCards" :key="group.groupName + index">
			<div class="active-group" :class="{ active: group.groupName.length === 0 }">
				{{ group.groupName }}
			</div>
			<draggable-card-items
				:id="index"
				:isCardsMovingAndDeleting="isCardsMovingAndDeleting"
				:groupCards="groupCards"
				@onClickTab="handleClickTab"
				@onOpenDeletePopup="handleOpenDeletePopup"
				:group="group"
				:mappedCurrencies="mappedCurrencies"
				:activeTab="activeTab"
			></draggable-card-items>
			<lk-popup-delete-card
				@onClose="handleCloseDeletePopup"
				@onDeleteCard="handleDeleteCard"
				:deletePopup="deletePopup"
				:formattedCardNumber="formatCardNumber(deletePopup.number)"
				:bankImage="getBankImage(deletePopup.psid, 'big')"
			></lk-popup-delete-card>
		</div>
	</div>
	<div class="wallets-list_item_body" v-else>
		<cards-list-item
			v-for="item in mappedCurrencies"
			:key="item.fullName"
			:item="item"
			@onOpenDeletePopup="handleOpenDeletePopup"
			:isCardsMovingAndDeleting="isCardsMovingAndDeleting"
			:activeTab="activeTab"
			@onClickTab="handleClickTab"
		>
		</cards-list-item>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';
import getCardsByCurrency from '@/functions/getCardsByCurrency';
import getCurrencyInfo from '@/functions/getCurrencyInfo';
import getBankImage from '@/functions/getBankImage';
import formatCardNumber from '@/functions/formatCardNumber';
import CardsListItem from './CardsListItem';
import LkPopupDeleteCard from '@/components/Popups/DeleteCard';
import DraggableCardsItems from './DraggableCardItems';

export default {
	// left-arrow-purple.svg or cloud.svg - type of card

	name: 'CardsList',
	props: ['isCardsMovingAndDeleting'],
	components: {
		CardsListItem,
		LkPopupDeleteCard,
		DraggableCardsItems,
	},
	data() {
		return {
			deletePopup: {
				number: null,
				isOpened: false,
				psid: null,
			},
			activeTab: null,
		};
	},
	created() {
		Promise.all([
			this.$store.dispatch('common/GET_BANKS'),
			this.$store.dispatch('card/GET_CARDS'),
			this.$store.dispatch('currency/GET_USER_CURRENCIES'),
		]).then(([banks, cards, userCurrencies]) => {
			this.$store.commit(
				'currency/SET_WALLETS_AND_ACCOUNTS_PAGE_CURRENCIES',
				userCurrencies.map((currency) => {
					const { fullName, code } = getCurrencyInfo(currency);
					return {
						currency,
						fullName,
						code,
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
			userCurrencies: 'currency/USER_CURRENCIES',
			groupCards: 'group/GROUP_CARDS',
		}),
	},
	methods: {
		formatCardNumber,
		getBankImage,
		getCardsByCurrency,
		handleClickTab(currency) {
			this.activeTab = this.activeTab === currency ? null : currency;
		},
		handleDeleteCard(number) {
			this.handleCloseDeletePopup();
			this.$store
				.dispatch('card/DELETE_CARD', { NumberCard: number })
				.then((data) => {
					const errors = Object.values(data['0']['Errors']);

					this.$store.dispatch('alerts/setNotification', {
						message: errors.length ? errors[0] : 'Card has been successfully deleted',
						status: errors.length ? 'error-status' : 'success-status',
						icon: errors.length ? 'close' : 'done',
					});
				})
				.then(() => {
					this.$store.commit(
						'currency/SET_WALLETS_AND_ACCOUNTS_PAGE_CURRENCIES',
						this.mappedCurrencies.map((item) => ({
							...item,
							cards: item.cards.filter((card) => card.Number !== number),
						})),
						// .filter(({ cards }) => cards.length !== 0), show currency if has cards
					);
					setTimeout(() => {
						this.$emit('afterDeleteCard');
					}, 600);
				});
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
	},
};
</script>
