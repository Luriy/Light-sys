<template>
	<div class="selects-block">
		<button class="select position-relative" v-for="select in selects" :key="select.label">
			<div
				class="select__header d-flex align-items-center justify-content-between"
				@click="handleOpenSelect(select)"
			>
				<div class="flex align-items-center">
					<span class="select__text">{{ select.label }}</span>
					<span
						class="select__informer"
						v-if="select.informer && select.label === 'All categories'"
						>{{ select.informer }}</span
					>
				</div>
				<select-toggler :active="select.isOpened"></select-toggler>
			</div>

			<transition name="slide-fade-top">
				<div
					class="select-dropdown__wrapper position-absolute"
					v-show="openedSelect === select.label"
				>
					<div class="select-dropdown">
						<div
							class="select-dropdown__item flex align-items-center justify-content-between"
							v-for="option in select.options"
							:key="option.name"
							@click="handleClickSelect(select, option.name)"
						>
							<span class="select-dropdown__item-text">{{ option.name }}</span>
							<img
								v-if="option.icon"
								:src="option.icon"
								:width="option.iconWidth || 16"
								:height="option.iconHeight || 16"
							/>
						</div>
					</div>
				</div>
			</transition>
		</button>
	</div>
</template>
<script>
import SelectToggler from '@/elements/SelectToggler';
import gameCategories from '@/data/dapp/game_categories';
import currencyList from '@/settings/currencyList';
import getCryptoInfo from '@/functions/getCryptoInfo';

export default {
	components: { SelectToggler },
	data() {
		return {
			openedSelect: null,
			selects: [
				{
					label: 'All categories',
					informer: gameCategories.length,
					options: gameCategories,
				},
				{
					label: 'Blockchains',
					options: Object.keys(currencyList).map((currency) => ({
						name: getCryptoInfo(currency).fullName,
						icon: getCryptoInfo(currency).image.corner,
						iconWidth: 16,
						iconHeight: 18,
					})),
				},
				{
					label: 'Sort by Relevance',
					options: [
						{
							name: 'Sort by Relevance',
						},
						{
							name: 'Sort by name',
						},
						{
							name: 'Newest',
						},
						{
							name: 'Oldest',
						},
					],
				},
			],
			gameCategories,
		};
	},
	methods: {
		handleOpenSelect(select) {
			if (this.openedSelect === select.label) {
				this.openedSelect = null;
			} else {
				this.openedSelect = select.label;
			}
		},
		handleClickSelect(select, optionName) {
			this.openedSelect = null;
			select.label = optionName;
		},
	},
};
</script>
<style lang="scss" scoped>
.selects-block {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-column-gap: 20px;
	.select {
		height: 56px;
		border-radius: 14px;
		background-color: #4d3779;
		&__header {
			padding: 0 17px;
			height: 100%;
		}
		&-dropdown {
			&__wrapper {
				border-radius: 15px;
				overflow: hidden;
				left: 0;
				z-index: 20;
				top: 66px;
				width: 100%;
			}

			background-color: #4d3779;
			max-height: 323px;
			/* padding: 15px 0; */

			overflow-y: auto;
			scrollbar-width: thin;
			scrollbar-color: #715b9d transparent;
			&::-webkit-scrollbar {
				width: 4px;
			}
			&::-webkit-scrollbar-track {
				background: transparent;
				margin: 14px 0;
			}
			&::-webkit-scrollbar-thumb,
			&::-webkit-scrollbar-thumb:hover {
				border-radius: 1px;
				background-color: #715b9d;
			}
			&__item {
				padding: 0 15px;
				height: 49px;
				transition: 0.3s;
				&-text {
					color: #ffffff;
					font-weight: 600;
				}
				&.active,
				&:hover {
					background: #44306d;
				}
			}
		}
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
</style>
