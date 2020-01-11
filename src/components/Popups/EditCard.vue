<template>
	<lk-popup
		v-show="editPopup.isOpened"
		:popupSize="{ width: '530px', height: 'auto' }"
		class="card-list-edit-popup"
		@closeModal="$emit('onClose')"
	>
		<div
			slot="title"
			class="_title flex flex-column align-items-center card-list-edit-popup__wrapper"
		>
			<div class="image-plate">
				<img :src="getBankImage(editPopup.psid, 'big')" />
			</div>
			<form class="add-card-form flex flex-column">
				<div class="flex flex-column card-list-edit-popup__input-block">
					<input
						type="text"
						class="add-card-form__input"
						placeholder="Card number"
						v-model="editPopup.newCardNumber"
						maxlength="19"
						@input="$emit('handleCardNumber', $event)"
					/>
					<div class="add-card-form__line"></div>
				</div>
				<div class="flex flex-column card-list-edit-popup__input-block">
					<input
						type="text"
						class="add-card-form__input"
						placeholder="Name of card"
						v-model="editPopup.newCardHolder"
					/>
					<div class="add-card-form__line"></div>
				</div>
				<div class="select">
					<div
						class="select__header accounts-list_wrapper_tab_header flex justify-content-between align-items-center"
						@click="editPopup.select.active = !editPopup.select.active"
					>
						<div class="flex align-items-center">
							<div class="image-container">
								<img :src="getBankImage(editPopup.psid, 'small')" alt="" />
							</div>
							<div class="select__title">{{ editPopup.select.name }}</div>
						</div>
						<div class="toggle"></div>
					</div>
					<transition name="fade">
						<div class="select__body flex flex-column" v-show="editPopup.select.active">
							<div
								class="select__body-item flex align-items-center justify-content-between"
								:class="{ active: editPopup.select.name === bank.name }"
								v-for="bank in banks"
								:key="bank.psid"
								@click="$emit('onClickBank', bank.name, bank.psid)"
							>
								<div class="flex align-items-center">
									<div class="image-container">
										<img :src="getBankImage(bank.psid, 'small')" alt="" />
									</div>
									<div class="bank-name">{{ bank.name }}</div>
								</div>
								<img
									src="@/assets/images/tick.svg"
									v-if="editPopup.select.name === bank.name"
									alt
								/>
							</div>
						</div>
					</transition>
				</div>
			</form>
			<div
				class="button-wrapper button-gradient no-margin"
				@click="
					$emit(
						'onSoonEditCard',
						editPopup.cardNumber,
						editPopup.newCardNumber,
						editPopup.psid,
						editPopup.newCardHolder,
					)
				"
			>
				<button class="add-cart-action-button apply button-gradient">
					Apply
				</button>
			</div>
		</div>
	</lk-popup>
</template>
<script>
import LkPopup from '@/layout/LkPopUp';
import getBankImage from '@/functions/getBankImage';

export default {
	props: ['editPopup', 'banks'],
	components: {
		LkPopup,
	},
	methods: {
		getBankImage,
	},
};
</script>
<style></style>
