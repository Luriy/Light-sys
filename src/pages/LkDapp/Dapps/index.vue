x<template>
	<transition name="fade-medium">
		<div class="flex flex-column">
			<div class="search-input-wrapper">
				<input type="text" v-model="search" placeholder="Search" />
				<img src="@/assets/images/search.svg" />
			</div>
			<div class="game-categories-wrapper">
				<game-categories
					:activeCategory="activeGameCategory"
					@onChangeCategory="handleChangeGameCategory"
				></game-categories>
			</div>

			<filter-selects></filter-selects>
			<div class="games">
				<div class="games-items">
					<div class="game flex" v-for="(game, index) in games" :key="game.name + index">
						<img class="game__image" :src="game.image" />
						<div class="flex flex-column align-items-start justify-content-between">
							<div class="game__name">{{ game.name }}</div>
							<div class="game__description">{{ game.description }}</div>
							<div class="flex align-items-center">
								<div class="flex align-items-center game__category-wrapper">
									<img :src="require(`@/assets/images/dapp/${game.category.toLowerCase()}.png`)" />
									<span class="game__category">{{ game.category }}</span>
								</div>
								<div class="flex align-items-center">
									<img :src="getCryptoInfo(game.currency).image.corner" width="14" height="16" />
									<span class="game__currency">{{ getCryptoInfo(game.currency).fullName }}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="games-more-button">
					<view-more-button @onClick="handleClickMoreButton"></view-more-button>
				</div>
			</div>
		</div>
	</transition>
</template>
<script>
import games from '@/data/dapp/games';
import getCryptoInfo from '@/functions/getCryptoInfo';
import GameCategories from '../GameCategories';
import ViewMoreButton from '@/elements/ViewMoreButton';
import FilterSelects from './FilterSelects';

export default {
	data() {
		return {
			search: '',
			activeGameCategory: 'All categories',
			games,
		};
	},
	components: {
		GameCategories,
		ViewMoreButton,
		FilterSelects,
	},
	methods: {
		getCryptoInfo,
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
.search-input-wrapper {
	height: 50px;
	border-radius: 8px;
	background-color: #3b2665;
	padding: 0 18px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	input {
		font-size: 14px;
		color: #fff;
		font-weight: 600;
		width: 95%;
		&::placeholder {
			font-size: 14px;
			color: #fff;
			opacity: 0.7 !important;
			font-weight: 600;
		}
	}
}
.game-categories-wrapper {
	margin: 20px 0;
}
.selects-block {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-column-gap: 20px;
	.select {
		height: 56px;
		border-radius: 14px;
		background-color: #4d3779;
		padding: 0 17px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		&__text {
			color: #ffffff;
			font-weight: 600;
			line-height: 1;
		}
		&__informer {
			height: 25px;
			margin-left: 9px;
			line-height: 25px;
			border-radius: 8px;
			background-color: #341a51;
			color: #ffffff;
			font-size: 14px;
			font-weight: 600;
			padding: 0 8px;
		}
	}
}
.games {
	border-radius: 47px 47px 0 48px;
	background-color: #1e0639;
	padding: 44px 60px 54px;
	margin: 40px -60px -40px;
	&-items {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, auto));
		grid-template-rows: repeat(auto-fill, 90px);
		grid-gap: 40px 50px;
		.game {
			cursor: pointer;
			&__image {
				width: 90px;
				height: 90px;
				border-radius: 20px;
				margin-right: 16px;
			}
			&__name {
				font-size: 16px;
				font-weight: 600;
				line-height: 17px;
				color: #ffffff;
			}
			&__description {
				font-size: 12px;
				line-height: 17px;
				opacity: 0.5;
				color: #ffffff;
			}
			&__category-wrapper {
				margin-right: 10px;
			}
			&__category,
			&__currency {
				color: #fff;
				opacity: 0.4;
				font-size: 12px;
				font-weight: 600;
				line-height: 21px;
				margin-left: 4px;
			}
		}
	}

	&-more-button {
		margin-top: 40px;
	}
}
</style>
