<template>
	<draggable
		v-model="draggableMappedCurrencies"
		v-if="isCardsMovingAndDeleting"
		class="wallets-list_item_body"
	>
		<cards-list-item
			v-for="item in mappedCurrencies"
			:key="item.fullName"
			:item="item"
			@onOpenDeletePopup="onOpenDeletePopup"
			:isCardsMovingAndDeleting="isCardsMovingAndDeleting"
			:activeTab="activeTab"
			@onClickTab="onClickTab"
		></cards-list-item>
	</draggable>
</template>
<script>
import draggable from 'vuedraggable';
import CardsListItem from './CardsListItem';

export default {
	props: ['activeTab', 'isCardsMovingAndDeleting', 'mappedCurrencies'],
	components: {
		draggable,
		CardsListItem,
	},
	computed: {
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
