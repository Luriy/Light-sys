<template>
	<lk-popup
		v-if="successPopup.isOpened"
		:popupSize="{ width: '350px', height: '160px' }"
		class="card-list-delete-popup"
		@closeModal="$emit('onClose')"
	>
		<div
			slot="title"
			class="_title flex flex-column align-items-center card-list-delete-popup__wrapper"
		>
			<div class="image-plate">
				<img :src="getCryptoInfo(successPopup.currency).image.corner" height="65" />
			</div>
			<p class="card-list-delete-popup__title">Success</p>
			<div class="flex">
				<p class="card-list-delete-popup__paragraph" :class="successPopup.currency.toLowerCase()">
					{{ successPopup.fullCurrency }}
				</p>
				<p class="card-list-delete-popup__paragraph">
					&nbsp;wallet created
				</p>
			</div>
		</div>
	</lk-popup>
</template>
<script>
import LkPopup from '@/layout/LkPopUp';
import './styles.scss';
import getCryptoInfo from '@/functions/getCryptoInfo';

export default {
	props: ['successPopup'],
	components: {
		LkPopup,
	},
	methods: {
		getCryptoInfo,
	},
};
</script>
