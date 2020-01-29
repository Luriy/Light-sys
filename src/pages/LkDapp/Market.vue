<template>
	<transition name="fade-medium">
		<div class="flex flex-column">
			<div class="slider-wrapper">
				<slider :slides="slides"></slider>
			</div>
			<div class="blockchain-categories-wrapper">
				<blockchain-categories
					:activeCategory="activeBlockchainCategory"
					:activeDapps="activeDapps"
					@onChangeCategory="handleChangeCategory"
					@onChangeDapps="handleChangeDapps"
				></blockchain-categories>
			</div>
		</div>
	</transition>
</template>
<script>
import Slider from './Slider';
import BlockchainCategories from './BlockchainCategories';

export default {
	data() {
		return {
			slides: [
				[1, 2, 3],
				[4, 5, 6],
				[7, 8, 9],
			],
			activeBlockchainCategory: 'All blockchains',
			activeDapps: 'All Dapps',
		};
	},
	components: {
		Slider,
		BlockchainCategories,
	},
	methods: {
		handleChangeCategory(category) {
			this.activeBlockchainCategory = category;
		},
		handleChangeDapps(dapps) {
			this.activeDapps = dapps;
		},
	},
};
</script>
<style lang="scss" scoped>
.slider-wrapper {
	padding: 40px;
	border-radius: 50px 0 0 50px;
	background-color: #1e0639;
	margin-right: -60px;
}
.blockchain-categories-wrapper {
	margin: 35px 0 20px;
}
</style>
