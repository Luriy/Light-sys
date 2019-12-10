<template>
	<div class="flex flex-column outside-wrapper">
		<div
			@click="$emit('onWalletRouter', wallet.currency, wallet.address, wallet.isAvailable)"
			class="list__item"
		>
			<transition name="fade">
				<div
					class="btn-remove"
					v-show="isWalletsMovingAndDeleting"
					@click="$emit('onOpenPopup', wallet.address, wallet.currency)"
				>
					<img src="@/assets/images/icons/cross.svg" />
				</div>
			</transition>
			<div class="wallet" :class="{ active: !isWalletsMovingAndDeleting }">
				<div
					v-if="!wallet.isAvailable"
					class="unavailable-block flex justify-content-center align-items-center"
				>
					<p class="unavailable-text">Temporarily unavailable</p>
				</div>
				<div class="code">
					<div :class="['image', wallet.currency.toLowerCase()]">
						<img v-if="wallet.currency === 'BTC'" src="@/assets/images/icons/btc-ico.svg" alt title />
						<img v-if="wallet.currency === 'ETH'" src="@/assets/images/eth-ico.png" alt title />
						<img v-if="wallet.currency === 'LTC'" src="@/assets/images/ltc-ico.svg" width="12" />
					</div>
					<div class="flex flex-column">
						<span :class="wallet.currency.toLowerCase()">{{
							getCryptoInfo(wallet.currency).fullName
						}}</span>
					</div>
				</div>
				<div class="info" v-if="wallet.isAvailable">
					<div class="balance">
						<p>{{ wallet.currency }} {{ formatCurrency(wallet.balance, '', 5) }}</p>
						<span>USD {{ formatCurrency(wallet.balanceUSD, '$') }}</span>
					</div>
					<div
						class="progress"
						:class="{
							green: percentage[wallet.currency]['1h'].toFixed(2) >= 0.01,
							red: percentage[wallet.currency]['1h'].toFixed(2) <= -0.01,
						}"
					>
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
			:class="{ 'active-input': isInputEditingActive }"
			v-show="isWalletsMovingAndDeleting"
			@click="handleClickLine"
		>
			<div class="under-wallet-line" v-if="!isInputEditingActive"></div>
			<div class="add-group-input-wrapper flex align-items-center" v-else>
				<input type="text" v-model="groupName" @blur="handleSaveGroup" />
			</div>
		</div>
	</div>
</template>
<script>
import getCryptoInfo from '@/functions/getCryptoInfo';

export default {
	props: ['wallet', 'isWalletsMovingAndDeleting', 'percentage', 'groupWallets'],
	data() {
		return {
			groupName: 'Group name',
			isInputEditingActive: false,
		};
	},
	filters: {
		percentage: (value) =>
			value
				? `${
						value['1h'].toFixed(2) < 0.01 && value['1h'].toFixed(2) > -0.01
							? '0.00'
							: value['1h'].toFixed(2) >= 0.01
							? '+' + value['1h'].toFixed(2)
							: value['1h'].toFixed(2)
				  }%`
				: '',
	},
	methods: {
		getCryptoInfo,
		handleClickLine() {
			if (!this.isInputEditingActive) {
				this.isInputEditingActive = true;
				setTimeout(
					() =>
						document.querySelector('.under-wallet-block .add-group-input-wrapper input').focus(),
					50,
				);
			}
		},
		handleSaveGroup() {
			this.isInputEditingActive = false;
			const clonedGroupWallets = [...this.groupWallets];
			clonedGroupWallets.unshift({
				groupName: this.groupName,
				wallets: [],
			});
			this.$store.commit('group/SET_GROUP_WALLETS', clonedGroupWallets);

			this.$store.dispatch('group/CREATE_WALLET_GROUP', {
				GroupName: this.groupName,
				wallets: [],
			});
		},
	},
};
</script>
<style scoped></style>
