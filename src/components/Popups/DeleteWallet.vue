<template>
	<lk-popup
		v-if="deletePopup.isOpened"
		:popupSize="{ width: 'auto', height: '300px' }"
		class="card-list-delete-popup"
		@closeModal="$emit('onClose')"
	>
		<div
			slot="title"
			class="_title flex flex-column align-items-center card-list-delete-popup__wrapper"
		>
			<div class="image-plate transparent">
				<img :src="getCryptoInfo(deletePopup.currency).image.corner" height="65" />
			</div>
			<p class="card-list-delete-popup__title">Warning</p>
			<p class="card-list-delete-popup__paragraph text-align-center">
				Are you sure you want to delete the wallet?
			</p>
			<p class="card-list-delete-popup__card">{{ deletePopup.address }}</p>
			<div class="flex full-width justify-content-center">
				<div class="button-wrapper button-gradient" @click="$emit('onClose')">
					<button class="add-cart-action-button cancel">
						No
					</button>
				</div>
				<div
					class="button-wrapper button-gradient no-margin"
					@click="$emit('onDeleteWallet', deletePopup.address)"
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
import getCryptoInfo from '@/functions/getCryptoInfo';
import './styles.scss';

export default {
	props: ['deletePopup'],
	components: {
		LkPopup,
	},
	methods: {
		getCryptoInfo,
	},
};
</script>
