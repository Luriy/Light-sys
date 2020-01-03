<template>
	<div class="code flex flex-column code-column align-items-start">
		<div class="flex align-items-center" v-if="transaction.type === 'exchange'">
			<img :src="getCryptoInfo(transaction.secondCurrency).image.corner" />
			<span :class="transaction.secondCurrency.toLowerCase()">{{
				getCryptoInfo(transaction.secondCurrency).fullName
			}}</span>
		</div>
		<div class="flex align-items-center">
			<img
				:src="
					transaction.isCard
						? getBankImage(transaction.psid, 'small')
						: getCryptoInfo(transaction.currency).image.corner
				"
			/>
			<span :class="!transaction.isCard && transaction.currency.toLowerCase()">{{
				transaction.isCard
					? getCurrencyInfo(transaction.currency).fullName
					: getCryptoInfo(transaction.currency).fullName
			}}</span>
		</div>
	</div>
</template>
<script>
import getBankImage from '@/functions/getBankImage';
import getCryptoInfo from '@/functions/getCryptoInfo';
import getCurrencyInfo from '@/functions/getCurrencyInfo';

export default {
	props: ['transaction'],
	methods: {
		getBankImage,
		getCryptoInfo,
		getCurrencyInfo,
	},
};
</script>
<style></style>
