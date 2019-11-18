<template>
	<draggable
		v-model="draggableWalletsList"
		v-if="isWalletsMovingAndDeleting"
		class="wallets-list_item_body"
	>
		<transition-group name="slide-fade">
			<div
				v-for="wallet in wallets"
				@click="handleWalletRouter(`/wallets/${wallet.currency}/${wallet.address}`)"
				class="list__item"
				:key="wallet.address"
			>
				<transition name="fade">
					<div
						class="btn-remove"
						v-if="isWalletsMovingAndDeleting"
						@click="handleDeleteItem(wallet.address)"
						key="idx"
					>
						<img src="@/assets/images/cross.svg" />
					</div>
				</transition>
				<div class="wallet">
					<div class="code">
						<div :class="['image', wallet.currency.toLowerCase()]">
							<img v-if="wallet.currency === 'BTC'" src="@/assets/images/btc-ico.svg" alt title />
							<img v-if="wallet.currency === 'ETH'" src="@/assets/images/eth-ico.png" alt title />
							<img v-if="wallet.currency === 'LTC'" src="@/assets/images/ltc-ico.svg" alt title />
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
			</div>
		</transition-group>
	</draggable>
	<div v-else class="wallets-list_item_body">
		<transition-group name="slide-fade">
			<div
				v-for="wallet in wallets"
				@click="handleWalletRouter(`/wallets/${wallet.currency}/${wallet.address}`)"
				class="list__item"
				:key="wallet.address"
			>
				<transition name="fade">
					<div
						class="btn-remove"
						v-show="isWalletsMovingAndDeleting"
						@click="handleDeleteItem(wallet.address, wallet.address)"
					>
						<img src="@/assets/images/cross.svg" />
					</div>
				</transition>
				<div class="wallet">
					<div class="code">
						<div :class="['image', wallet.currency.toLowerCase()]">
							<img v-if="wallet.currency === 'BTC'" src="@/assets/images/btc-ico.svg" alt title />
							<img v-if="wallet.currency === 'ETH'" src="@/assets/images/eth-ico.png" alt title />
							<img
								v-if="wallet.currency === 'LTC'"
								src="@/assets/images/ltc-ico.svg"
								width="12"
								alt
								title
							/>
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
		</transition-group>
	</div>
</template>
<style scoped></style>
<script>
import draggable from 'vuedraggable';
import { VueNestable, VueNestableHandle } from 'vue-nestable';
import { mapGetters } from 'vuex';

export default {
	name: 'WalletsList',
	props: ['isWalletsMovingAndDeleting'],
	components: {
		draggable,
	},
	data() {
		return {
			groupTogglerActiveId: null,
		};
	},
	filters: {
		percentage: (value) => (value ? `${value['1h'].toFixed(2)}%` : ''),
	},
	methods: {
		handleWalletRouter(route, e) {
			if (this.isWalletsMovingAndDeleting) {
				return false;
			} else {
				this.$router.push(route);
			}
		},
		handleDeleteItem(address) {
			this.$store
				.dispatch(
					'wallet/DELETE_WALLET',
					this.wallets.find((wallet) => wallet.address === address),
				)
				.then(() => {
					this.$store.commit(
						'wallet/SET_WALLETS',
						this.wallets.filter((wallet) => wallet.address !== address),
					);
				});
		},
	},
	computed: {
		draggableWalletsList: {
			get() {
				return this.wallets;
			},
			set(value) {
				return this.$store.commit('wallet/SET_WALLETS', value);
			},
		},
		...mapGetters({
			wallets: 'wallet/WALLETS',
			percentage: 'wallet/PERCENTAGE',
		}),
	},
};
</script>
