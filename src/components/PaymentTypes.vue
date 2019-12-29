<template>
	<transition name="fade">
		<div class="select-body" v-show="isOpened">
			<div class="select-wrapper">
				<div class="search-input">
					<input type="text" v-model="search" name="" placeholder="Search" />
				</div>
				<div class="filter-buttons">
					<v-btn
						class="filter-btn"
						:class="{ 'active-list': currentList === 'all' }"
						text
						small
						@click="currentList = 'all'"
						>All</v-btn
					>
					<v-btn
						class="filter-btn"
						:class="{ 'active-list': currentList === 'wallets' }"
						text
						small
						@click="currentList = 'wallets'"
						>My wallets
					</v-btn>
					<v-btn
						class="filter-btn"
						:class="{ 'active-list': currentList === 'cards' }"
						text
						small
						@click="currentList = 'cards'"
						>My cards</v-btn
					>
					<v-btn
						class="filter-btn"
						:class="{ 'active-list': currentList === 'banks' }"
						text
						small
						@click="currentList = 'banks'"
						>Banks</v-btn
					>
				</div>

				<div class="select-item-wallet" v-if="currentList === 'wallets' || currentList === 'all'">
					<div class="title-wrapper">
						<span class="select-header">my wallets</span>
						<span class="select-line"></span>
					</div>
					<div
						class="select-item"
						v-for="(wallet, index) of wallets"
						:key="`wallet-${index}`"
						@click="wallet.isAvailable ? $emit('onSelectItem', wallet) : ''"
					>
						<div
							v-if="!wallet.isAvailable"
							class="unavailable-block flex justify-content-center align-items-center"
							:class="{ unavailable: !wallet.isAvailable }"
						>
							<p class="unavailable-text">Temporarily unavailable</p>
						</div>
						<img
							:src="getCryptoInfo(wallet.currency).image.corner"
							width="34"
							alt
							title
							class="icon"
						/>
						<div class="amount">
							<div class="code" :class="wallet.currency.toLowerCase()">
								{{ wallet.currency }}
								{{ getCryptoInfo(wallet.currency).fullName }}
							</div>
							<div class="value">
								<span>
									{{ wallet.balance.toFixed(5) }}
									{{ wallet.currency }}
								</span>
								<span class="currency-divider">&#124;</span>
								<span class="balance-reserve">${{ wallet.balanceUSD.toFixed(2) }} USD</span>
							</div>
						</div>
					</div>
				</div>

				<div
					class="select-item-fiat"
					v-if="(currentList === 'cards' || currentList === 'all') && cards.length"
				>
					<div class="title-wrapper">
						<span class="select-header">my cards</span>
						<span class="select-line"></span>
					</div>
					<div
						class="select-item"
						v-for="(card, index) of cards"
						:key="`fiat-${index}`"
						@click="
							$emit('onSelectItem', card, banks.find(({ psid }) => psid == card.Psid).reserve)
						"
					>
						<div class="image-plate">
							<img :src="getBankImage(card.Psid, 'small')" />
						</div>
						<div class="amount flex flex-column">
							<span class="code">{{ card.Name }}</span>
							<div class="value">
								<span>
									{{ `****${card.Number.slice(card.Number.length - 4)}` }}
									{{ card.Currency }}
								</span>
								<span class="currency-divider">&#124;</span>
								<span class="balance-reserve">{{
									`Reserve: ${banks.find(({ psid }) => psid == card.Psid).reserve}`
								}}</span>
							</div>
						</div>
					</div>
				</div>

				<div class="select-item-fiat" v-if="currentList === 'banks' || currentList === 'all'">
					<div class="title-wrapper">
						<span class="select-header">banks</span>
						<span class="select-line"></span>
					</div>
					<div
						class="select-item"
						v-for="(bank, index) of banks"
						:key="`fiat-${index}`"
						@click="$emit('onSelectItem', bank)"
					>
						<div class="image-plate">
							<img :src="getBankImage(bank.psid, 'small')" alt />
						</div>

						<div class="amount">
							<div class="code">{{ bank.name }}</div>
							<div class="value">
								<span>
									{{ bank.valute }}
								</span>
								<span class="currency-divider">&#124;</span>
								<span class="balance-reserve">{{ `Reserve: ${bank.reserve}` }}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>
<script>
import { mapGetters } from 'vuex';
import getCryptoInfo from '@/functions/getCryptoInfo';
import getBankImage from '@/functions/getBankImage';

export default {
	props: ['filteredWallets', 'isOpened', 'search', 'fiatData', 'wallets', 'cards', 'banks'],
	data() {
		return {
			currentList: 'all',
		};
	},
	methods: {
		getCryptoInfo,
		getBankImage,
	},
};
</script>
<style scoped lang="scss">
.select {
	cursor: pointer;
}
.select-body {
	width: 100%;
	top: 66px;
	position: absolute;
	border-radius: 14px;
	background-color: #4d3779;
	padding: 20px;
	z-index: 15;
	left: 0;

	.select-item {
		display: flex;
		position: relative;
		align-items: center;
		padding: 8px 9px;
		height: 56px;
		border-radius: 8px;
		background-color: #684e9c;
		&:not(:last-child) {
			margin-bottom: 10px;
		}
	}

	.search-input {
		margin-bottom: 10px;
		input {
			width: 100%;
			border: none;
			height: 29px;
			border-radius: 8px;
			background-color: #684e9c;
			padding-left: 11px;
		}
		input,
		input::placeholder {
			color: rgba(255, 255, 255, 0.7);
			font-size: 12px;
			font-weight: 600;
		}
	}
}
.select-header {
	color: #ffffff;
	font-size: 8px;
	font-weight: 600;
	letter-spacing: 0.2px;
	line-height: 21px;
	text-transform: uppercase;
}

.select-line {
	flex-grow: 1;
	border-bottom: 1px solid #ffffff;
	opacity: 0.5;
	margin: 0 0 9px 5px;
}

.filter-btn {
	color: #ffffff;
	font-size: 12px;
	font-weight: 600;
	line-height: 21px;
	text-transform: capitalize;

	&.active-list {
		border-radius: 5px;
		background-image: linear-gradient(270deg, #8e6ee4 0%, #d268bc 100%);
	}
}
.title-wrapper {
	display: flex;
	margin: 10px 0;
}
.currency-divider {
	vertical-align: text-top;
	font-size: 10px !important;
	line-height: 23px !important;
}
.amount span {
	font-size: 12px;
	font-weight: 600;
	color: #fff;
}
.amount .code {
	font-size: 14px;
	color: #fff;
	font-weight: 600;
}
.icon {
	margin-right: 12px;
}
.select .select-wrapper {
	overflow-y: auto;
	max-height: 340px;
	@media screen and (max-width: 1250px) {
		max-height: 300px;
	}
	scrollbar-width: thin;
	scrollbar-color: #2e0e52 transparent;
	padding-right: 20px;
}

.select .select-wrapper::-webkit-scrollbar-thumb,
.select .select-wrapper::-webkit-scrollbar-thumb:hover {
	width: 5px;
	margin: 15px 0;
	border-radius: 2.5px;
	background-color: #2e0e52;
}
.select .select-wrapper::-webkit-scrollbar {
	width: 5px;
}
.image-plate {
	width: 37px;
	height: 37px;
	border-radius: 14px;
	background-color: #7d62b3;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-right: 12px;
}
.amount .code {
	margin-bottom: -3px;
}
.select-item {
	cursor: pointer;
}
</style>
