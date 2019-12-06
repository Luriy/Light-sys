<template>
	<draggable v-model="draggableCurrenciesList" group="cards" :animation="350">
		<cards-list-item
			v-for="item in currencies"
			:key="item.fullName"
			:item="item"
			@onOpenDeletePopup="onOpenDeletePopup"
			:isCardsMovingAndDeleting="isCardsMovingAndDeleting"
			:activeTab="activeTab"
			@onClickTab="onClickTab"
			:groupCurrencies="groupCurrencies"
		></cards-list-item>
	</draggable>
</template>
<script>
import draggable from 'vuedraggable';
import CardsListItem from './CardsListItem';

export default {
	props: ['activeTab', 'isCardsMovingAndDeleting', 'currencies', 'id', 'groupCurrencies', 'group'],
	components: {
		draggable,
		CardsListItem,
	},
	computed: {
		draggableCurrenciesList: {
			get() {
				return this.groupCurrencies[this.id].currencies;
			},
			set(value) {
				return this.$store.dispatch('group/SET_CURRENCIES_TO_GROUP', {
					currencies: value,
					groupName: this.group.groupName,
				});
			},
		},
	},
	methods: {
		onOpenDeletePopup(number, psid) {
			this.$emit('onOpenDeletePopup', number, psid);
		},
		onClickTab(currency) {
			this.$emit('onClickTab', currency);
		},
	},
};
</script>
<style></style>
