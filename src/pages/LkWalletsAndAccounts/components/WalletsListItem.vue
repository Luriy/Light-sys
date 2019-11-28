<template>
	<transition name="slide-fade">
		<div class="flex flex-column outside-wrapper">
			<div @click="$emit('onWalletRouter', wallet.currency, wallet.address)" class="list__item">
				<transition name="fade">
					<div
						class="btn-remove"
						v-show="isWalletsMovingAndDeleting"
						@click="$emit('onOpenPopup', wallet.address, wallet.currency)"
					>
						<img src="@/assets/images/cross.svg" />
					</div>
				</transition>
				<div class="wallet">
					<div class="code">
						<div :class="['image', wallet.currency.toLowerCase()]">
							<img v-if="wallet.currency === 'BTC'" src="@/assets/images/btc-ico.svg" alt title />
							<img v-if="wallet.currency === 'ETH'" src="@/assets/images/eth-ico.png" alt title />
							<img v-if="wallet.currency === 'LTC'" src="@/assets/images/ltc-ico.svg" width="12" />
						</div>
						<span>{{ wallet.currency }}</span>
					</div>
					<div class="info">
						<div class="balance">
							<p>{{ wallet.currency }} {{ formatCurrency(wallet.balance, '', 5) }}</p>
							<span>USD {{ formatCurrency(wallet.balanceUSD, '$') }}</span>
						</div>
						<div class="progress green">
							<p>{{ percentage[wallet.currency] | percentage }}</p>
							<div class="image">
								<!-- TODO: Используйте computed свойство percentage для построения графиков -->
								<img src="@/assets/images/graph-green.svg" alt title />
							</div>
						</div>
					</div>
				</div>
				<div class="group-toggler"></div>
			</div>
			<div class="under-wallet-block"></div>
		</div>
	</transition>
</template>
<script>
export default {
	props: ['wallet', 'isWalletsMovingAndDeleting', 'percentage'],
	filters: {
		percentage: (value) => (value ? `${value['1h'].toFixed(2)}%` : ''),
	},
};
</script>
<style scoped>
.under-wallet-block {
	width: 100%;
	background-color: #3b2665;
	height: 3px;
	margin-bottom: 6px;
}
.outside-wrapper:last-of-type .under-wallet-block {
	display: none;
}
</style>
