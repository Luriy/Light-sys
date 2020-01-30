<template>
	<div class="flex">
		<div class="blockchains position-relative flex overflow-hidden">
			<button
				class="blockchain-category position-relative flex align-items-center"
				:class="{ active: category.name === activeCategory }"
				v-for="category in blockchainCategories"
				:key="category.name"
				@click="$emit('onChangeCategory', category.name)"
			>
				<img
					v-if="getCryptoInfo(category.name).image.corner"
					class="blockchain-image"
					:src="getCryptoInfo(category.name).image.corner"
					width="16"
					height="18"
				/>
				{{
					getCryptoInfo(category.name).fullName === 'Unknown currency'
						? category.name
						: getCryptoInfo(category.name).fullName
				}}
			</button>
		</div>
		<div class="dapps-buttons position-relative flex justify-content-end flex-grow-1">
			<button
				class="dapps-button"
				:class="{ active: activeDapps === 'All Dapps' }"
				@click="$emit('onChangeDapps', 'All Dapps')"
			>
				All Dapps
			</button>
			<button
				class="dapps-button"
				:class="{ active: activeDapps === 'New Dapps' }"
				@click="$emit('onChangeDapps', 'New Dapps')"
			>
				<span class="dapps-button-text">New Dapps</span>
			</button>
		</div>
	</div>
</template>
<script>
import currencyList from '@/settings/currencyList';
import getCryptoInfo from '@/functions/getCryptoInfo';

export default {
	props: ['activeCategory', 'activeDapps'],

	data() {
		return {};
	},
	methods: {
		getCryptoInfo,
	},
	computed: {
		blockchainCategories() {
			return [
				{ name: 'All blockchains' },
				...Object.keys(currencyList).map((currency) => ({
					name: currency,
				})),
			];
		},
	},
};
</script>
<style scoped lang="scss">
.blockchains,
.dapps-buttons {
	padding-bottom: 10px;
	&:after {
		content: '';
		position: absolute;
		width: 100%;
		height: 1px;
		background-color: #47256d;
		border-radius: 18px;
		left: 0;
		bottom: 0;
	}
}
.blockchains {
	padding-left: 10px;
	padding-right: 10px;
	.blockchain {
		&-category {
			background: transparent;
			color: #ffffff;
			font-size: 14px;
			font-weight: 600;
			line-height: 21px;
			&:not(:last-of-type) {
				margin-right: 35px;
			}
			&.active {
				&:after {
					content: '';
					width: calc(100% + 20px);
					height: 1px;
					border-radius: 18px;
					background-image: linear-gradient(270deg, #8e6ee4 0%, #d268bc 100%);
					position: absolute;
					left: -10px;
					bottom: -10px;
					z-index: 5;
				}
			}
		}
		&-image {
			margin-right: 6px;
		}
	}
}
.dapps {
	&-buttons {
		flex-grow: 1;
	}
	&-button {
		height: 30px;
		line-height: 30px;
		color: #ffffff;
		font-size: 12px;
		font-weight: 600;

		background-color: transparent;
		padding: 0 10px;
		position: relative;
		z-index: 5;
		&:before {
			content: '';
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			transition: 0.3s;
			background-image: linear-gradient(270deg, #8e6ee4 0%, #d268bc 100%);
			opacity: 0;
			border-radius: 20px;
			z-index: -100;
		}
		&:hover {
			&:before {
				opacity: 0.4;
			}
		}
		&.active {
			&:before {
				opacity: 1;
			}
		}
		&:not(:last-of-type) {
			margin-right: 15px;
		}
		&-text {
			opacity: 1 !important;
		}
	}
}
</style>
