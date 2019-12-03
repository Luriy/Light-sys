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
					{{ formatCurrency(currentWallet.balance, '', 5) }}
					<span>{{ currentWallet.currency || '' }}</span>
				</p>
				<p class="wallet-send-amount--fiat">
					{{ formatCurrency(currentWallet.balanceUSD, '$') }} <span>USD</span>
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

		<div class="wallet-description" :class="{ active: isDescriptionOpened }">
			<div class="flex justify-content-between align-items-center description-header-block">
				<div class="title">Description</div>
				<button
					class="description-toggler flex align-items-center justify-content-center"
					@click="isDescriptionOpened = !isDescriptionOpened"
				>
					<img
						src="@/assets/images/arrow-big.svg"
						alt="Description toggler"
						class="description-toggler-image"
						:class="{ active: isDescriptionOpened }"
					/>
				</button>
			</div>
			<div class="wallet-description-outer" :class="{ active: isDescriptionOpened }">
				<div class="flex justify-content-between align-items-start wallet-description-text-wrapper">
					<div class="text">
						Ethereum is a decentralized computing platform that runs smart contracts, which are
						contracts thah execute withou human intervention. ETH popularized the idea programmable
						transactions instead of only for money transfers. The platform is user for crowdfuundin
						(ICOs) , the cretion of new digital assets, and more.
					</div>
					<div class="social-links">
						<button
							class="social-links__button"
							@click="isSocialLinksOpened = !isSocialLinksOpened"
						>
							<img src="@/assets/images/3-dots.svg" alt="Social links" />
						</button>
						<transition name="fade">
							<div class="social-links__modal" v-show="isSocialLinksOpened">
								<a class="social-links__modal-link" href="#">
									<img
										src="@/assets/images/wallet-link.svg"
										alt=""
										class="social-links__modal-img"
									/>
									Website
								</a>
								<a class="social-links__modal-link" href="#">
									<img
										src="@/assets/images/wallet-reddit.svg"
										alt=""
										class="social-links__modal-img"
									/>
									Reddit
								</a>
								<a class="social-links__modal-link" href="#">
									<img
										src="@/assets/images/wallet-twitter.svg"
										alt=""
										class="social-links__modal-img"
									/>
									Twitter
								</a>
							</div>
						</transition>
					</div>
				</div>
			</div>
		</div>
		<transactions-history :currentWallet="currentWallet"></transactions-history>
	</lk-layout>
</template>

<script>
import { mapGetters } from 'vuex';
import LkLayout from '@/layout/LkLayout';
import TransactionsHistory from './TransactionsHistory';

export default {
	name: 'LkPaymentWallet',
	components: {
		LkLayout,
		TransactionsHistory,
	},
	data() {
		return {
			currentWallet: {
				balance: '0.00000',
				balanceUSD: '0.00',
			},
			isSocialLinksOpened: false,
			isDescriptionOpened: false,
			windowHandler: null,
		};
	},
	mounted() {
		const dropdown = document.querySelector('.social-links__modal');

		this.windowHandler = ({ target }) => {
			if (
				!target.classList.contains('social-links__modal') &&
				!dropdown.contains(target) &&
				!target.classList.contains('social-links__button')
			) {
				this.isSocialLinksOpened = false;
			}
		};
		window.addEventListener('click', this.windowHandler);
	},
	beforeMount() {
		this.currentWallet = this.wallets.find(
			(wallet) => wallet.address === this.$route.params.address,
		);
	},
	computed: {
		...mapGetters({
			wallets: 'wallet/WALLETS',
		}),
	},
	methods: {
		isShowLogotype(code) {
			return (this.currentWallet.currency || '').toLowerCase() === code.toLowerCase();
		},
	},
};
</script>
<style scoped>
.wallet-description {
	transition: 0.5s;
	padding-bottom: 40px;
}
.wallet-description.active {
	padding-bottom: 0;
}
.title {
	line-height: 21px;
	color: #fff;
	margin-bottom: 20px;
	font-size: 16px;
}
.social-links {
	position: relative;
}
.social-links__button {
	padding: 5px 10px;
}
.social-links__modal {
	position: absolute;
	right: -5px;
	top: 39px;
	padding: 10px 13px 10px 10px;
	border-radius: 8px;
	background-color: #654d95;
}
.social-links__modal-link {
	font-size: 14px;
	font-weight: 600;
	color: #fff;
	text-decoration: none;
	display: flex;
	margin-bottom: 7px;
}
.social-links__modal-link:last-of-type {
	margin-bottom: 0;
}
.social-links__modal-img {
	margin-right: 7px;
}

.social-links__modal:after {
	content: '';
	border-bottom: 11px solid #654d95;
	border-left: 8px solid transparent;
	border-right: 8px solid transparent;
	display: block;
	position: absolute;
	top: -8px;
	right: 8px;
	transform: translateX(-2%);
}
.text {
	padding-top: 5px;
	font-size: 12px;
	line-height: 21px;
	color: rgba(255, 255, 255, 0.5);
	max-width: 775px;
}
.wallet-description-text-wrapper {
	border-radius: 8px;
	padding: 0px 10px 0px 15px;
	border: solid 1px #3b2665;
	padding: 10px 10px 15px 15px;
}
.wallet-description-outer {
	max-height: 0;
	transition: 0.5s;
	overflow: hidden;
}
.wallet-description-outer.active {
	padding-bottom: 55px;
	max-height: 300px;
	margin-top: 20px;
}
.description-toggler {
	width: 29px;
	height: 29px;
	border-radius: 8px;
	background-color: #3b2665;
}
.title {
	margin-bottom: 0 !important;
}
.description-toggler-image {
	transition: 0.3s;
}
.description-toggler-image.active {
	transform: rotate(180deg);
}
</style>
