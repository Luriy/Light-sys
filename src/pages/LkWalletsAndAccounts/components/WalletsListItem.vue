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
				<div class="wallet" :class="{ active: !isWalletsMovingAndDeleting }">
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
			<div
				class="under-wallet-block flex align-items-center"
				:class="{ 'active-input': isInputEditingActive || isGroupActive }"
				v-show="isWalletsMovingAndDeleting || isGroupActive"
				@click="handleClickLine"
			>
				<div class="under-wallet-line" v-show="!isInputEditingActive && !isGroupActive"></div>
				<div class="add-group-input-wrapper flex align-items-center" v-show="isInputEditingActive">
					<input type="text" v-model="groupName" @blur="handleSaveGroup" />
				</div>
				<div v-if="isGroupActive" class="active-group">{{ groupName }}</div>
			</div>
		</div>
	</transition>
</template>
<script>
export default {
	props: ['wallet', 'isWalletsMovingAndDeleting', 'percentage'],
	data() {
		return {
			groupName: 'Group name',
			isInputEditingActive: false,
			isGroupActive: false,
		};
	},
	filters: {
		percentage: (value) => (value ? `${value['1h'].toFixed(2)}%` : ''),
	},
	methods: {
		handleClickLine() {
			if (!this.isInputEditingActive && !this.isGroupActive) {
				this.isInputEditingActive = true;
				setTimeout(() => document.querySelector('.add-group-input-wrapper input').focus(), 50);
			}
		},
		handleSaveGroup() {
			this.isInputEditingActive = false;
			this.isGroupActive = true;
		},
	},
};
</script>
<style scoped>
.add-group-input-wrapper {
	height: 32px;
	border-radius: 4px;
	border: 1px solid #745e9f;
	font-size: 16px;
	font-weight: 600;
	color: #fff;
	padding: 0 8px;
}

.under-wallet-block {
	width: 100%;
	cursor: pointer;
	height: 10px;
	transition: 0.2s;
}
.under-wallet-line {
	background-color: #3b2665;
	height: 0px;
	width: 100%;
}
.under-wallet-block:hover {
	height: 14px;
}
.under-wallet-block.active-input {
	height: 46px;
}
.under-wallet-block:hover .under-wallet-line {
	height: 4px;
}
.outside-wrapper:last-of-type .under-wallet-block {
	display: none;
}
.active-group {
	color: #fff;
	font-weight: 600;
}
</style>
