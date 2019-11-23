<template>
	<lk-popup
		v-if="deletePopup.isOpened"
		:popupSize="{ width: '350px', height: '300px' }"
		class="card-list-delete-popup"
		@closeModal="$emit('onClose')"
	>
		<div
			slot="title"
			class="_title flex flex-column align-items-center card-list-delete-popup__wrapper"
		>
			<div class="image-plate">
				<img :src="bankImage" alt="" />
			</div>
			<p class="card-list-delete-popup__title">Warning</p>
			<p class="card-list-delete-popup__paragraph text-align-center">
				Are you sure you want to delete the card?
			</p>
			<p class="card-list-delete-popup__card">{{ formattedCardNumber }}</p>
			<div class="flex justify-content-between full-width">
				<div class="button-wrapper button-gradient no-margin" @click="$emit('onClose')">
					<button class="add-cart-action-button cancel">
						No
					</button>
				</div>
				<div
					class="button-wrapper button-gradient no-margin"
					@click="$emit('onDeleteCard', deletePopup.number, deletePopup.psid)"
				>
					<button class="add-cart-action-button apply button-gradient">
						Yes
					</button>
				</div>
			</div>
		</div>
	</lk-popup>
</template>
<script>
import LkPopup from '@/layout/LkPopUp';
import './styles.scss';

export default {
	props: ['deletePopup', 'bankImage', 'formattedCardNumber'],
	components: {
		LkPopup,
	},
};
</script>
