<template>
	<div class="virtual-cards-list">
		<div
			class="virtual-card flex flex-column justify-content-between"
			v-for="item in filteredCards"
			:key="item.psid"
		>
			<div class="flex justify-content-between align-items-center">
				<div class="flex align-items-center">
					<div class="image-container"></div>
					<div class="virtual-card__currency">{{ item.Currency }}</div>
				</div>
				<div class="virtual-card__number">* {{ item.Number.slice(-4) }}</div>
			</div>
			<div class="flex justify-content-between align-items-flex-end">
				<div class="flex flex-column">
					<div class="virtual-card__exp-date-title">Exp Date</div>
					<div class="virtual-card__exp-date">07/20</div>
				</div>
				<img src="@/assets/images/mastercard.png" />
			</div>
			<transition name="fade">
				<div class="image-plate virtual-card__edit" v-show="isEditing">
					<img src="@/assets/images/pencil.svg" />
				</div>
			</transition>
			<transition name="fade">
				<div
					class="image-plate virtual-card__delete"
					v-show="isEditing"
					@click="handleOpenDeletePopup(item.Number)"
				>
					<img src="@/assets/images/cross.svg" />
				</div>
			</transition>
		</div>
		<lk-popup
			v-if="deletePopup.isOpened"
			:popupSize="{ width: '350px', height: '300px' }"
			class="card-list-delete-popup"
			@closeModal="handleCloseDeletePopup"
		>
			<div
				slot="title"
				class="_title flex flex-column align-items-center card-list-delete-popup__wrapper"
			>
				<div class="image-plate"></div>
				<p class="card-list-delete-popup__title">Warning</p>
				<p class="card-list-delete-popup__paragraph text-align-center">
					Are you sure you want to delete the card?
				</p>
				<p class="card-list-delete-popup__card">{{ deletePopup.number }}</p>
				<div class="flex justify-content-between full-width">
					<div class="button-wrapper button-gradient no-margin" @click="handleCloseDeletePopup">
						<button class="add-cart-action-button cancel">
							No
						</button>
					</div>
					<div
						class="button-wrapper button-gradient no-margin"
						@click="handleSoonDeleteCard(deletePopup.number)"
					>
						<button class="add-cart-action-button apply button-gradient">
							Yes
						</button>
					</div>
				</div>
			</div>
		</lk-popup>
	</div>
</template>
<style scoped></style>
<script>
import { mapGetters } from 'vuex';
import LkPopup from '@/layout/LkPopUp';

export default {
	props: ['currency', 'isEditing'],
	mounted() {
		this.$store.dispatch('card/GET_CARDS');
	},
	components: {
		LkPopup,
	},
	data() {
		return {
			deletePopup: {
				number: null,
				isOpened: false,
				futureDeletedCard: null,
			},
		};
	},
	computed: {
		...mapGetters({
			cards: 'card/CARDS',
		}),
		filteredCards() {
			return this.cards.filter(({ Currency }) => Currency === this.currency);
		},
	},
	methods: {
		handleOpenDeletePopup(number) {
			this.deletePopup.number = number;
			this.deletePopup.isOpened = true;
		},
		handleCloseDeletePopup() {
			this.deletePopup.number = null;
			this.deletePopup.isOpened = false;
		},
		handleSoonDeleteCard(number) {
			this.$emit('onDeleteCard', number);
			this.handleCloseDeletePopup();
		},
	},
};
</script>
