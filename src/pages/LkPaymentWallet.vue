<template>
	<lk-layout>
		<div class="wallet-send-block">
			<div class="wallet-send-currency">
				<img v-if="isShowLogotype('btc')" src="@/assets/images/btc.png" alt title />
				<img v-if="isShowLogotype('eth')" src="@/assets/images/eth.png" alt title />
				<img v-if="isShowLogotype('ltc')" src="@/assets/images/eth.png" alt title />
			</div>
			<div class="wallet-send-amount">
				<p
					:class="{
						'wallet-send-amount--crypto': true,
						btc: $route.params.currency.toUpperCase() === 'BTC',
					}"
				>
					{{ formatCurrency(wallet.balance, '', 5) }} <span>{{ wallet.currency }}</span>
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
				v-for="item in trans"
				:class="{ active: item.isactive }"
				:key="item.id"
			>
				<div class="trans-card">
					<div class="trans-top">
						<button class="btn">
							<span class="icon"><img src="@/assets/images/path2.svg" alt title/></span>
							<div class="text">
								<p>Sent</p>
								<span>16:09 PM</span>
							</div>
						</button>
						<div class="code">
							<img src="@/assets/images/eth.png" alt title />
							<span class="eth">Ethereum</span>
						</div>
						<div class="address">
							cl4948239fsd0fsdjkfdfsdfjskfsd
						</div>
						<div class="trans-amount" v-on:click="item.isactive = !item.isactive">
							<span class="text">{{ item.crypto }} ETH</span>
							<span class="icon"></span>
						</div>
					</div>
					<div class="trans-info">
						<table>
							<thead>
								<tr>
									<th>
										<p>Date</p>
										<span>{{ item.datetime }}</span>
									</th>
									<th>
										<p>Transaction ID</p>
										<span
											><a href="#">{{ item.id }}</a></span
										>
									</th>
									<th>
										<p>Fee</p>
										<span>{{ item.fee }}</span>
									</th>
									<th>
										<p>To</p>
										<span>{{ item.to }}</span>
									</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>
										<p>Now</p>
										<span>{{ item.now }}</span>
									</td>
									<td colspan="3">
										<p>Feb 6th</p>
										<span>{{ item.prev }}}</span>
									</td>
								</tr>
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
		};
	},
	computed: {
		...mapGetters({
			wallet: 'wallet/PAGE_DETAIL',
		}),
	},
	mounted() {
		this.$store.dispatch('wallet/GET_PAGE_DETAIL', {
			currency: this.$route.params.currency.toUpperCase(),
			address: this.$route.params.address,
		});
	},
	methods: {
		isShowLogotype(code) {
			return (this.wallet.currency || '').toLowerCase() === code.toLowerCase();
		},
	},
};
</script>
