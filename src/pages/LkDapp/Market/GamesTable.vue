<template>
	<div class="flex flex-column">
		<div class="games-wrapper">
			<div class="games">
				<div class="games-row__header">
					<div
						class="flex align-items-center"
						v-for="heading in gamesTableHeadings"
						:key="heading.name"
					>
						<span class="games-row__heading">{{ heading.name }}</span>
						<triangles v-if="heading.isTriangles" class="games-row__header-triangles"></triangles>
					</div>
				</div>
				<div class="games-row" v-for="(game, index) in slicedGames" :key="game.name + index">
					<span class="games-row__text small">{{ index + 1 }}</span>
					<div class="flex align-items-center">
						<img :src="game.image" class="games-row__image" />
						<span class="games-row__text">{{ game.name }}</span>
					</div>

					<span class="games-row__text small">{{ game.category }}</span>
					<div class="flex align-items-center">
						<img
							:src="getCryptoInfo(game.currency).image.corner"
							alt="Currency icon"
							width="16"
							height="18"
						/>
						<span class="games-row__text small crypto" :class="[game.currency.toLowerCase()]">{{
							getCryptoInfo(game.currency).fullName
						}}</span>
					</div>
					<div class="flex flex-column align-items-start">
						<span class="games-row__text small">{{ game.users_24hr.total }}</span>
						<div class="flex align-items-center">
							<span
								class="games-row__text smallest percents"
								:class="{
									red: game.users_24hr.percents <= -0.01,
									green: game.users_24hr.percents >= 0.01,
								}"
								>{{ game.users_24hr.percents | percents }}</span
							>
							<img
								v-if="game.users_24hr.percents <= -0.01"
								src="@/assets/images/percents-arrow-down.svg"
								alt="Arrow down"
							/>
							<img
								v-if="game.users_24hr.percents >= 0.01"
								src="@/assets/images/percents-arrow-up.svg"
								alt="Arrow up"
							/>
						</div>
					</div>
					<div class="flex flex-column align-items-start">
						<span class="games-row__text small">{{ game.transactions_24hr.total }}</span>
						<div class="flex align-items-center">
							<span
								class="games-row__text smallest percents"
								:class="{
									red: game.transactions_24hr.percents <= -0.01,
									green: game.transactions_24hr.percents >= 0.01,
								}"
								>{{ game.transactions_24hr.percents | percents }}</span
							>
							<img
								v-if="game.transactions_24hr.percents <= -0.01"
								src="@/assets/images/percents-arrow-down.svg"
								alt="Arrow down"
							/>
							<img
								v-if="game.transactions_24hr.percents >= 0.01"
								src="@/assets/images/percents-arrow-up.svg"
								alt="Arrow up"
							/>
						</div>
					</div>
					<div class="flex flex-column align-items-start">
						<span class="games-row__text small"
							>${{ game.volume_24hr.total_dollars.toFixed(2) }} USD</span
						>
						<div class="flex align-items-center">
							<span class="games-row__text smallest">{{ game.volume_24hr.total_crypto }}</span>
							<span
								class="games-row__text smallest crypto-price"
								:class="[game.currency.toLowerCase()]"
								>{{ game.currency }}</span
							>
							<span
								class="games-row__text smallest percents"
								:class="{
									red: game.volume_24hr.percents <= -0.01,
									green: game.volume_24hr.percents >= 0.01,
								}"
								>{{ game.volume_24hr.percents | percents }}</span
							>
							<img
								v-if="game.volume_24hr.percents <= -0.01"
								src="@/assets/images/percents-arrow-down.svg"
								alt="Arrow down"
							/>
							<img
								v-if="game.volume_24hr.percents >= 0.01"
								src="@/assets/images/percents-arrow-up.svg"
								alt="Arrow up"
							/>
						</div>
					</div>
					<div class="flex flex-column align-items-start">
						<span class="games-row__text small">{{ game.score.total }}</span>
						<div class="flex align-items-center">
							<span
								class="games-row__text smallest percents"
								:class="{
									red: game.score.percents <= -0.01,
									green: game.score.percents >= 0.01,
								}"
								>{{ game.score.percents | percents }}</span
							>
							<img
								v-if="game.score.percents <= -0.01"
								src="@/assets/images/percents-arrow-down.svg"
								alt="Arrow down"
							/>
							<img
								v-if="game.score.percents >= 0.01"
								src="@/assets/images/percents-arrow-up.svg"
								alt="Arrow up"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="games-more-button">
			<view-more-button @onClick="handleClickMoreButton"></view-more-button>
		</div>
	</div>
</template>
<script>
import ViewMoreButton from '@/elements/ViewMoreButton';
import games from '@/data/dapp/games';
import Triangles from '@/elements/Triangles';
import getCryptoInfo from '@/functions/getCryptoInfo';

export default {
	components: { ViewMoreButton, Triangles },
	data() {
		return {
			games,
			gamesTableHeadings: [
				{
					name: '#',
					isTriangles: false,
				},
				{
					name: 'Dapp',
					isTriangles: false,
				},
				{
					name: 'Categories',
					isTriangles: false,
				},
				{
					name: 'Blockchain',
					isTriangles: false,
				},
				{
					name: '24HR Users',
					isTriangles: true,
				},
				{
					name: '24HR Transactions',
					isTriangles: true,
				},
				{
					name: '24HR Volume',
					isTriangles: true,
				},
				{
					name: 'Dapp.com Score',
					isTriangles: true,
				},
			],
			showedGames: 4,
		};
	},
	computed: {
		slicedGames() {
			return this.games.slice(0, this.showedGames);
		},
	},
	methods: {
		getCryptoInfo,
		handleClickMoreButton() {
			if (this.showedGames + 4 > games.length) {
				this.showedGames = games.length;
			} else {
				this.showedGames += 4;
			}
		},
	},
	filters: {
		percents: (value) => `${value >= 0.01 ? '+' : ''}${value.toFixed(2)}%`,
	},
};
</script>
<style lang="scss" scoped>
.games-more-button {
	margin-top: 30px;
}
.games {
	&-wrapper {
		overflow-x: auto;
		overflow-y: hidden;
	}
	&-row,
	&-row__header {
		width: min-content;
		display: grid;
		grid-template-columns: 40px minmax(130px, 1fr) minmax(100px, 1fr) repeat(5, minmax(160px, 1fr));
		align-items: center;
		padding: 0 13px;
	}
	&-row {
		height: 63px;
		background-color: transparent;
		border-radius: 8px;
		&:nth-of-type(2n) {
			background-color: #391c61;
		}
		&__image {
			width: 33px;
			height: 33px;
			border-radius: 50%;
			margin-right: 8px;
		}
		&__text {
			color: #ffffff;
			font-size: 16px;
			font-weight: 600;
			line-height: 21px;
			&.small {
				font-size: 14px;
			}
			&.smallest {
				font-size: 12px;
			}
			&.percents {
				background: none !important;
				margin-right: 4px;
			}
			&.red {
				color: #db5353;
			}
			&.green {
				color: #53d344;
			}
			&.crypto {
				margin-left: 4px;
			}
			&.crypto-price {
				margin: 0 5px;
			}
		}
		&__header {
			margin-bottom: 20px;
			&-triangles {
				margin-left: 8px;
			}
		}
		&__heading {
			color: #ffffff;
			font-size: 14px;
			line-height: 21px;
		}
	}
}
</style>
