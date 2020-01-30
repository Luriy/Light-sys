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
					@onChangeCategory="handleChangeBlockchainCategory"
					@onChangeDapps="handleChangeDapps"
				></blockchain-categories>
			</div>
			<div class="game-categories-wrapper">
				<game-categories
					:activeCategory="activeGameCategory"
					@onChangeCategory="handleChangeGameCategory"
				></game-categories>
			</div>

			<div class="main-wrapper">
				<games-table></games-table>
				<statistics-table></statistics-table>
			</div>
		</div>
	</transition>
</template>
<script>
import Slider from '../Slider';
import BlockchainCategories from '../BlockchainCategories';
import GameCategories from '../GameCategories';

import StatisticsTable from './StatisticsTable';
import GamesTable from './GamesTable.vue';

export default {
	components: {
		Slider,
		BlockchainCategories,
		GameCategories,
		StatisticsTable,
		GamesTable,
	},
	data() {
		return {
			slides: [
				[1, 2, 3],
				[4, 5, 6],
				[7, 8, 9],
			],
			activeBlockchainCategory: 'All blockchains',
			activeDapps: 'All Dapps',
			activeGameCategory: 'All categories',
		};
	},
	methods: {
		handleChangeBlockchainCategory(category) {
			this.activeBlockchainCategory = category;
		},
		handleChangeDapps(dapps) {
			this.activeDapps = dapps;
		},
		handleChangeGameCategory(category) {
			this.activeGameCategory = category;
		},
		handleClickMoreButton() {
			console.log('more button clicked');
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
.game-categories-wrapper {
	margin: 0 0 20px;
}
.main-wrapper {
	border-radius: 47px 47px 0 48px;
	background-color: #1e0639;
	margin: 0 -60px -40px;
	padding: 35px 60px 47px;
}
</style>
