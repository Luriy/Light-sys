<template>
	<lk-layout>
		<div class="wallet-send-block">
			<div class="wallet-send-currency">
				<img v-if="isShowLogotype('btc')" src="@/assets/images/btc.png" alt title />
				<img v-if="isShowLogotype('eth')" src="@/assets/images/eth.png" alt title />
				<img v-if="isShowLogotype('ltc')" src="@/assets/images/ltc.svg" alt title />
			</div>
			<div class="wallet-send-amount">
				<p
					:class="{
						'wallet-send-amount--crypto': true,
						[currentWallet.currency.toLowerCase()]: true,
					}"
				>
					{{ formatCurrency(wallet.balance, '', 5) }}
					<span>{{ currentWallet.currency || '' }}</span>
				</p>
				<p class="wallet-send-amount--fiat">
					{{ formatCurrency(wallet.balanceUSD, '$') }} <span>USD</span>
				</p>
			</div>
			<div class="buttons">
				<div class="btn-border-wrapper">
					<router-link :to="{ name: 'LkPaymentWalletSend' }"
						><button class="btn">Send</button></router-link
					>
				</div>
				<div class="btn-border-wrapper">
					<router-link :to="{ name: 'LkPaymentWalletReceive' }"
						><button class="btn">Receive</button></router-link
					>
				</div>
				<div class="btn-border-wrapper btn-exchange">
					<router-link to="/exchange"
						><button class="btn"><img src="@/assets/images/exchange.svg" alt title /></button
					></router-link>
				</div>
			</div>
		</div>

		<div class="wallet-description">
			<div class="title">Description</div>
			<div class="text">
				Ethereum is a decentralized computing platform that runs smart contracts, which are
				contracts thah execute withou human intervention. ETH popularized the idea programmable
				transactions instead of only for money transfers. The platform is user for crowdfuundin
				(ICOs) , the cretion of new digital assets, and more.
			</div>
		</div>

		<div class="trans-list">
			<div class="trans-date">Oct 17, 2018</div>
			<div
				class="trans-item"
				v-for="operation in operations"
				:class="{ active: openedOperation === operation.url }"
				:key="operation.url"
			>
				<div class="trans-card">
					<div class="trans-top">
						<button class="btn">
							<span class="icon">
								<img
									v-if="operation.source.From === currentWallet.address.toLowerCase()"
									src="@/assets/images/transaction-sent.svg"
								/>
								<img
									v-if="operation.source.To === currentWallet.address.toLowerCase()"
									src="@/assets/images/transaction-received.svg"
								/>
							</span>
							<div class="text">
								<p v-if="operation.source.From === currentWallet.address.toLowerCase()">Sent</p>
								<p v-if="operation.source.To === currentWallet.address.toLowerCase()">Received</p>
								<span>{{ operation.source.Time.slice(-5) }} PM</span>
							</div>
						</button>
						<div class="code">
							<img
								v-if="currentWallet.currency === 'BTC'"
								src="@/assets/images/btc.png"
								alt
								title
							/>
							<img
								v-if="currentWallet.currency === 'ETH'"
								src="@/assets/images/eth.png"
								alt
								title
							/>
							<img
								v-if="currentWallet.currency === 'LTC'"
								src="@/assets/images/ltc.svg"
								alt
								title
							/>
							<span :class="currentWallet.currency.toLowerCase()">{{ operation.currency }}</span>
						</div>
						<div class="address">
							cl4948239fsd0fsdjkfdfsdfjskfsd
						</div>
						<div class="trans-amount">
							<span class="text"
								>{{ Number(operation.value).toFixed(5) }} {{ operation.currency }}</span
							>
							<span class="icon" @click="handleOpenOperation(operation.url)"></span>
						</div>
					</div>
					<div class="trans-info">
						<table>
							<thead>
								<tr>
									<th>
										<p>Date</p>
										<span>{{ operation.source.Time }}</span>
									</th>
									<th>
										<p>Transaction ID</p>
										<span
											><a :href="operation.url" target="_blank" class="trans-id">{{
												operation.url.slice(24)
											}}</a></span
										>
									</th>
									<th>
										<p>Fee</p>
										<span>{{ 'fee' }}</span>
									</th>
									<th>
										<p v-if="operation.source.From === currentWallet.address.toLowerCase()">To</p>
										<p v-if="operation.source.To === currentWallet.address.toLowerCase()">From</p>
										<span v-if="operation.source.From === currentWallet.address.toLowerCase()">{{
											operation.source.To
										}}</span>
										<span v-if="operation.source.To === currentWallet.address.toLowerCase()">{{
											operation.source.From
										}}</span>
									</th>
								</tr>
							</thead>
							<tbody>
								<!-- <tr>
									<td>
										<p>Now</p>
										<span>{{ 'now balance' }}</span>
									</td>
									<td colspan="3">
										<p>Feb 6th</p>
										<span>{{ 'prev balance' }}</span>
									</td>
								</tr> -->
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</lk-layout>
</template>

<script>
import { mapGetters } from 'vuex';
import LkLayout from '@/layout/LkLayout';

export default {
	name: 'LkPaymentWallet',
	components: {
		LkLayout,
	},
	data() {
		return {
			trans: [
				{
					date: 'Feb 06, 2019',
					datetime: '02/06/2019 12:00 AM',
					crypto: '0.037002550726035',
					id: '0x29ecfj54fdjskjfddcc4354',
					fee: '0.00024516 ETH',
					to: 'ox24378efdjsfks54892fdkcf…',
					now: '$6.96 USD',
					prev: '$2.96 USD',
					isactive: false,
				},
				{
					date: 'Feb 06, 2019',
					datetime: '02/06/2019 12:00 AM',
					crypto: '0.037002550726035',
					id: '0x29ecfj54fdjskjfddcc4354',
					fee: '0.00024516 ETH',
					to: 'ox24378efdjsfks54892fdkcf…',
					now: '$6.96 USD',
					prev: '$2.96 USD',
					isactive: false,
				},
				{
					date: 'Feb 06, 2019',
					datetime: '02/06/2019 12:00 AM',
					crypto: '0.037002550726035',
					id: '0x29ecfj54fdjskjfddcc4354',
					fee: '0.00024516 ETH',
					to: 'ox24378efdjsfks54892fdkcf…',
					now: '$6.96 USD',
					prev: '$2.96 USD',
					isactive: false,
				},
				{
					date: 'Feb 06, 2019',
					datetime: '02/06/2019 12:00 AM',
					crypto: '0.037002550726035',
					id: '0x29ecfj54fdjskjfddcc4354',
					fee: '0.00024516 ETH',
					to: 'ox24378efdjsfks54892fdkcf…',
					now: '$6.96 USD',
					prev: '$2.96 USD',
					isactive: false,
				},
			],
			openedOperation: null,
			operations: [],
		};
	},
	computed: {
		...mapGetters({
			wallet: 'wallet/PAGE_DETAIL',
		}),
		currentWallet() {
			return {
				currency: this.$route.params.currency,
				address: this.$route.params.address,
			};
		},
	},
	mounted() {
		this.$store.dispatch('wallet/GET_PAGE_DETAIL', {
			currency: this.$route.params.currency.toUpperCase(),
			address: this.$route.params.address,
		});
		this.$store
			.dispatch('wallet/GET_WALLET_OPERATIONS', {
				currency: this.currentWallet.currency,
				address: this.currentWallet.address,
			})
			.then((data) => (this.operations = data));
	},
	methods: {
		isShowLogotype(code) {
			return (this.currentWallet.currency || '').toLowerCase() === code.toLowerCase();
		},
		handleOpenOperation(url) {
			if (this.openedOperation === url) {
				this.openedOperation = null;
			} else {
				this.openedOperation = url;
			}
		},
	},
};
</script>
