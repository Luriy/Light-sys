<template>
	<div class="virtual-cards-list" v-if="filteredCards.length">
		<div class="virtual-card__wrapper" v-for="item in filteredCards" :key="item.Number">
			<div
				class="virtual-card flex flex-column justify-content-between"
				@click="$emit('onClickCard')"
			>
				<div class="flex justify-content-between align-items-center">
					<div class="flex align-items-center">
						<img :src="getBankImage(item.Psid, 'small')" />
						<div class="virtual-card__currency">{{ item.Currency }}</div>
					</div>
					<div class="virtual-card__number">* {{ item.Number.slice(-4) }}</div>
				</div>
				<div class="flex justify-content-between align-items-flex-end">
					<div class="flex flex-column">
						<div class="virtual-card__exp-date-title">Exp Date</div>
						<div class="virtual-card__exp-date">MM/YY</div>
					</div>
					<img src="@/assets/images/mastercard.png" />
				</div>
			</div>
			<transition name="fade">
				<div
					class="image-plate virtual-card__edit"
					v-show="isEditing"
					@click="handleOpenEditPopup(item.Number, item.Psid, item.Holder)"
				>
					<img src="@/assets/images/pencil.svg" />
				</div>
			</transition>
			<transition name="fade">
				<div
					class="image-plate virtual-card__delete"
					v-show="isEditing"
					@click="handleOpenDeletePopup(item.Number, item.Psid)"
				>
					<img src="@/assets/images/icons/cross.svg" />
				</div>
			</transition>
		</div>
		<lk-popup-delete-card
			@onClose="handleCloseDeletePopup"
			@onSoonDeleteCard="handleSoonDeleteCard"
			:deletePopup="deletePopup"
			:formattedCardNumber="formatCardNumber(deletePopup.number)"
			:bankImage="getBankImage(deletePopup.psid, 'big')"
		></lk-popup-delete-card>
		<lk-popup-edit-card
			@onClose="handleCloseEditPopup"
			@onSoonEditCard="handleSoonEditCard"
			@onClickBank="handleClickBank"
			@onInputCardNumber="handleCardNumber"
			:editPopup="editPopup"
			:banks="banks"
		></lk-popup-edit-card>
	</div>
</template>
<style scoped></style>
<script>
import { mapGetters } from 'vuex';
import getBankImage from '@/functions/getBankImage';
import formatCardNumber from '@/functions/formatCardNumber';
import LkPopupDeleteCard from '@/components/Popups/DeleteCard';
import LkPopupEditCard from '@/components/Popups/EditCard';

export default {
	props: ['currency', 'isEditing', 'banks', 'cards', 'filteredCards'],
	components: {
		LkPopupDeleteCard,
		LkPopupEditCard,
	},
	data() {
		return {
			deletePopup: {
				number: null,
				isOpened: false,
				psid: null,
			},
			editPopup: {
				cardNumber: null,
				newCardNumber: null,
				cardHolder: null,
				newCardHolder: null,
				psid: null,
				select: {
					active: false,
					name: null,
				},
				isOpened: false,
			},
			windowHandler: null,
		};
	},
	mounted() {
		const select = document.querySelector('.card-list-edit-popup .select');
		this.windowHandler = ({ target }) => {
			if (
				(target ? false : !target.classList.contains('.card-list-edit-popup .select')) &&
				!select.contains(target)
			) {
				this.editPopup.select.active = false;
			}
		};
		window.addEventListener('click', this.windowHandler);
	},
	beforeDestroy() {
		window.removeEventListener('click', this.windowHandler);
	},
	methods: {
		formatCardNumber,
		getBankImage,
		handleOpenEditPopup(cardNumber, psid, cardHolder) {
			this.editPopup = {
				cardNumber,
				newCardNumber: this.formatCardNumber(cardNumber),
				psid,
				cardHolder,
				newCardHolder: cardHolder,
				select: {
					active: false,
					name: this.banks.find((bank) => bank.psid == psid).name,
				},
				isOpened: true,
			};
		},
		handleCloseEditPopup() {
			this.editPopup = {
				cardNumber: null,
				newCardNumber: null,
				cardHolder: null,
				newCardHolder: null,
				psid: null,
				select: {
					active: false,
					name: null,
				},
				isOpened: false,
			};
		},
		handleSoonEditCard(cardNumber, newCardNumber, psid, newCardHolder) {
			this.$emit('onEditCard', {
				cardNumber,
				newCardNumber: newCardNumber.replace(/\s+/g, ''),
				psid,
				newCardHolder: encodeURI(newCardHolder),
			});

			this.handleCloseEditPopup();
			this.$store.commit(
				'card/SET_CARDS',
				this.cards.map((card) => {
					return card.Number == cardNumber
						? {
								...card,
								Number: newCardNumber.replace(/\s+/g, ''),
								Psid: psid,
						  }
						: card;
				}),
			);
		},
		handleClickBank(name, psid) {
			this.editPopup.select = { active: false, name };
			this.editPopup.psid = psid;
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
		handleSoonDeleteCard(number, psid) {
			this.$emit('onDeleteCard', number);
			this.$store.commit(
				'card/SET_CARDS',
				this.cards.filter((card) => card.Number != number),
			);
			this.handleCloseDeletePopup();
		},
		handleCardNumber({ inputType }) {
			const { newCardNumber } = this.editPopup;
			if (
				(newCardNumber.length === 4 || newCardNumber.length === 9 || newCardNumber.length === 14) &&
				inputType !== 'deleteContentBackward'
			) {
				this.editPopup.newCardNumber += ' ';
			}
		},
	},
};
</script>
