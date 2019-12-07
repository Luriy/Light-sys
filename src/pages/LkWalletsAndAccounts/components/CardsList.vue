<template>
	<div v-if="isCardsMovingAndDeleting" class="wallets-list_item_body">
		<div
			class="group-wrapper"
			v-for="(group, index) in groupCurrencies"
			:key="group.groupName + index"
		>
			<div
				class="add-group-input-wrapper flex align-items-center"
				v-if="editingGroup === group.groupName"
			>
				<input type="text" v-model="newGroupName" @blur="handleSaveRenameGroup" />
			</div>
			<div
				class="active-group"
				:class="{ active: group.groupName.length === 0 }"
				@click="handleRenameGroup(group.groupName)"
				v-else
			>
				{{ group.groupName }}
			</div>
			<draggable-card-items
				:id="index"
				:group="group"
				:isCardsMovingAndDeleting="isCardsMovingAndDeleting"
				:groupCurrencies="groupCurrencies"
				@onClickTab="handleClickTab"
				@onOpenDeletePopup="handleOpenDeletePopup"
				:currencies="group.currencies"
				:activeTab="activeTab"
			></draggable-card-items>
			<lk-popup-delete-card
				@onClose="handleCloseDeletePopup"
				@onSoonDeleteCard="handleDeleteCard"
				:deletePopup="deletePopup"
				:formattedCardNumber="formatCardNumber(deletePopup.number)"
				:bankImage="getBankImage(deletePopup.psid, 'big')"
			></lk-popup-delete-card>
		</div>
	</div>
	<div class="wallets-list_item_body" v-else>
		<div class="group-wrapper" v-for="group in groupCurrencies" :key="group.groupName">
			<div class="active-group" :class="{ active: group.groupName.length === 0 }">
				{{ group.groupName }}
			</div>
			<cards-list-item
				v-for="item in group.currencies"
				:key="item.fullName"
				:item="item"
				:isCardsMovingAndDeleting="isCardsMovingAndDeleting"
				:activeTab="activeTab"
				@onClickTab="handleClickTab"
			>
			</cards-list-item>
		</div>
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
import DraggableCardItems from './DraggableCardItems';

export default {
	// left-arrow-purple.svg or cloud.svg - type of card

	name: 'CardsList',
	props: ['isCardsMovingAndDeleting'],
	components: {
		CardsListItem,
		LkPopupDeleteCard,
		DraggableCardItems,
	},
	data() {
		return {
			deletePopup: {
				number: null,
				isOpened: false,
				psid: null,
			},
			activeTab: null,
			editingGroup: null,
			newGroupName: '',
		};
	},
	created() {
		Promise.all([
			this.$store.dispatch('common/GET_BANKS'),
			this.$store.dispatch('card/GET_CARDS'),
			this.$store.dispatch('currency/GET_USER_CURRENCIES'),
		]).then(() => {
			this.$store.commit(
				'group/SET_GROUP_CURRENCIES',
				this.groupCurrencies.map((group) => {
					return {
						...group,
						currencies: group.currencies.map(({ currency }) => {
							const { fullName, code } = getCurrencyInfo(currency);
							return {
								currency,
								fullName,
								code,
								cards: this.cards.filter(({ Currency }) => Currency === currency),
							};
						}),
					};
				}),
				// .filter(({ cards }) => cards.length !== 0), show currency if has cards
			);
		});
	},
	computed: {
		...mapGetters({
			banks: 'common/BANKS',
			cards: 'card/CARDS',
			userCurrencies: 'currency/USER_CURRENCIES',
			groupCurrencies: 'group/GROUP_CURRENCIES',
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
				// .then((data) => {
				// 	const errors = Object.values(data['0']['Errors']);

				// 	this.$store.dispatch('alerts/setNotification', {
				// 		message: errors.length ? errors[0] : 'Card has been successfully deleted',
				// 		status: errors.length ? 'error-status' : 'success-status',
				// 		icon: errors.length ? 'close' : 'done',
				// 	});
				// })
				.then(() => {
					this.$store.commit(
						'group/SET_GROUP_CURRENCIES',
						this.groupCurrencies.map((group) => ({
							...group,
							currencies: group.currencies.map((currency) => ({
								...currency,
								cards: currency.cards.filter((card) => card.Number !== number),
							})),
						})),
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
		handleRenameGroup(groupName) {
			this.editingGroup = groupName;
			this.newGroupName = groupName;
			setTimeout(
				() =>
					document
						.querySelector('.fiat-block .group-wrapper .add-group-input-wrapper input')
						.focus(),
				50,
			);
		},
		handleSaveRenameGroup() {
			this.$store.dispatch('group/RENAME_CURRENCY_GROUP', {
				oldGroupName: this.editingGroup,
				newGroupName: this.newGroupName,
			});
			this.editingGroup = null;
			this.newGroupName = null;
		},
	},
};
</script>
