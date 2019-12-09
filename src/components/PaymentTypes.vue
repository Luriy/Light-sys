<template>
	<div class="select-body" v-if="isOpened">
		<div class="select-wrapper">
			<div class="search-input">
				<input type="text" v-model="search" name="" placeholder="Search" />
				<span></span>
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
					v-if="fiatData.length"
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
					@click="!wallet.statusNode ? $emit('onSelectWallet', wallet) : ''"
				>
					<div class="select-item-disabled" v-if="wallet.statusNode">Temporarily unavailable</div>
					<div class="icon">
						<img v-if="wallet.currency === 'BTC'" src="@/assets/images/btc.png" alt title />
						<img v-if="wallet.currency === 'ETH'" src="@/assets/images/eth.png" alt title />
						<img v-if="wallet.currency === 'LTC'" src="@/assets/images/ltc.svg" alt title />
					</div>
					<div class="amount">
						<div class="code btc">{{ getCryptoInfo(wallet.currency).fullName }}</div>
						<div class="value">
							<span>
								{{
									wallet.isWallet
										? wallet.balance
										: `****${wallet.number.substr(wallet.number.length - 4)}`
								}}
								{{ wallet.currency }}
							</span>
							<span class="currency-divider">&#124;</span>
							<span class="balance-reserve">{{
								wallet.isWallet ? `$${wallet.balanceUSD}` : `Reserve: ${wallet.reserve}`
							}}</span>
						</div>
					</div>
				</div>
			</div>

			<div class="select-item-fiat" v-if="currentList === 'cards' || currentList === 'all'">
				<div class="title-wrapper">
					<span class="select-header">my cards</span>
					<span class="select-line"></span>
				</div>
				<div
					class="select-item"
					:class="{ unavailable: !wallet.isAvailable }"
					v-for="(wallet, index) of cards"
					:key="`fiat-${index}`"
					@click="!wallet.statusNode ? $emit('onSelectWallet', wallet) : ''"
				>
					<div
						v-if="!wallet.isAvailable"
						class="unavailable-block flex justify-content-center align-items-center"
					>
						<p class="unavailable-text">Temporarily unavailable</p>
					</div>
					<div class="icon"></div>
					<div class="amount">
						<div class="code btc">{{ getCryptoInfo('') }}</div>
						<div class="value">
							<span>
								{{
									wallet.isWallet
										? wallet.balance
										: `****${wallet.number.substr(wallet.number.length - 4)}`
								}}
								{{ wallet.currency }}
							</span>
							<span class="currency-divider">&#124;</span>
							<span class="balance-reserve">{{
								wallet.isWallet ? `$${wallet.balanceUSD}` : `Reserve: ${wallet.reserve}`
							}}</span>
						</div>
					</div>
				</div>
			</div>

			<div
				class="select-item-fiat"
				v-if="(currentList === 'banks' || currentList === 'all') && fiatData.length"
			>
				<div class="title-wrapper">
					<span class="select-header">banks</span>
					<span class="select-line"></span>
				</div>
				<div class="select-item" v-for="(wallet, index) of fiatData" :key="`fiat-${index}`">
					<div class="icon"><img :src="wallet.icon" alt /></div>
					<div class="amount">
						<div class="code btc">{{ wallet.name }}</div>
						<div class="value">
							<span>
								{{ wallet.currency }}
							</span>
							<span class="currency-divider">&#124;</span>
							<span class="balance-reserve">{{
								wallet.isWallet ? `$${wallet.balanceUSD}` : `Reserve: ${wallet.reserve}`
							}}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
	props: ['filteredWallets', 'isOpened', 'search', 'fiatData', 'wallets', 'cards'],
	data() {
		return {
			currentList: 'all',
		};
	},
};
</script>
<style scoped lang="scss">
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
</style>
