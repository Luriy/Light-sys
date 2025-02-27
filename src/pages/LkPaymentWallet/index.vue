<template>
	<lk-layout>
		<div>
			<div class="wallet-send-block">
				<div class="wallet-send-currency">
					<img
						v-if="isShowLogotype($route.params.currency.toLowerCase())"
						:src="getCryptoInfo($route.params.currency).image.corner"
					/>
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
				<transition name="fade">
					<div class="social-links__modal" v-show="isSocialLinksOpened">
						<a
							v-for="website in getCryptoInfo($route.params.currency).websites"
							:key="website.link"
							class="social-links__modal-link"
							:href="website.link"
							target="_blank"
						>
							<img :src="getWebsiteImage(website.name)" alt="" class="social-links__modal-img" />
							{{ website.name }}
						</a>
					</div>
				</transition>
				<div
					class="flex justify-content-between align-items-center description-header-block"
					@click="isDescriptionOpened = !isDescriptionOpened"
				>
					<div class="title none-select" :class="{ active: isDescriptionOpened }">
						Description
					</div>
					<button
						class="description-toggler flex align-items-center justify-content-center none-select"
					>
						<img
							src="@/assets/images/icons/arrow-big.svg"
							alt="Description toggler"
							class="description-toggler-image"
							:class="{ active: isDescriptionOpened }"
						/>
					</button>
				</div>

				<div class="wallet-description-outer" :class="{ active: isDescriptionOpened }">
					<div
						class="flex justify-content-between align-items-start wallet-description-text-wrapper"
					>
						<div class="text">
							{{ getCryptoInfo($route.params.currency).description }}
						</div>
						<div class="social-links">
							<button
								class="social-links__button"
								@click="isSocialLinksOpened = !isSocialLinksOpened"
							>
								<img src="@/assets/images/3-dots.svg" alt="Social links" />
							</button>
						</div>
					</div>
				</div>
			</div>
			<transactions-history
				:currentWallet="currentWallet"
				:operationsWithPagination="operationsWithPagination"
			></transactions-history>
		</div>
	</lk-layout>
</template>

<script>
import { mapGetters } from 'vuex';
import LkLayout from '@/layout/LkLayout';
import TransactionsHistory from '@/components/TransactionsHistory/index';
import getCryptoInfo from '@/functions/getCryptoInfo';

export default {
	name: 'LkPaymentWallet',
	components: {
		LkLayout,
		TransactionsHistory,
	},
	data() {
		return {
			isSocialLinksOpened: false,
			isDescriptionOpened: false,
			windowHandler: null,
			operationsWithPagination: [],
			updateTransactionsTimer: null,
		};
	},
	mounted() {
		const dropdown = document.querySelector('.social-links__modal');
		this.windowHandler = ({ target }) => {
			if (!target.classList.contains('social-links__button')) {
				this.isSocialLinksOpened = false;
			}
		};
		window.addEventListener('click', this.windowHandler);
		this.$store.dispatch('transactionsHistory/GET_TRANSACTIONS', {
			wallets: this.wallets,
		});
		this.updateTransactionsTimer = setInterval(() => {
			this.$store.dispatch('transactionsHistory/GET_TRANSACTIONS', {
				wallets: this.wallets,
			});
		}, 15000);
	},
	async created() {
		this.operationsWithPagination = await this.$store.dispatch(
			'transactionsHistory/GET_SINGLE_WALLET_TRANSACTIONS',
			{
				address: this.currentWallet.address,
			},
		);
	},
	beforeDestroy() {
		window.removeEventListener('click', this.windowHandler);
		clearInterval(this.updateTransactionsTimer);
	},
	computed: {
		...mapGetters({
			wallets: 'wallet/WALLETS',
		}),
		currentWallet() {
			return this.wallets.find((wallet) => wallet.address === this.$route.params.address);
		},
	},

	methods: {
		getCryptoInfo,
		isShowLogotype(code) {
			return (this.currentWallet.currency || '').toLowerCase() === code.toLowerCase();
		},
		getWebsiteImage(name) {
			switch (name) {
				case 'Website':
					return require('@/assets/images/wallet-link.svg');
				case 'Reddit':
					return require('@/assets/images/wallet-reddit.svg');
				case 'Twitter':
					return require('@/assets/images/wallet-twitter.svg');
				default:
					return null;
			}
		},
	},
};
</script>
<style scoped>
.wallet-description {
	transition: 0.5s;
	padding-bottom: 40px;
	position: relative;
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
.social-links__button {
	padding: 5px 10px;
	margin-left: 40px;
}
.social-links__modal {
	position: absolute;
	right: 6px;
	top: 98px;
	border-radius: 8px;
	background-color: #654d95;
	z-index: 15;
}
.social-links__modal-link {
	font-size: 14px;
	font-weight: 600;
	color: #fff;
	text-decoration: none;
	display: flex;
	opacity: 0.7;
	padding: 7px 13px 0px 10px;
	transition: 0s;
}
.social-links__modal-link:hover {
	opacity: 1;
}
.social-links__modal-link:last-of-type {
	padding-bottom: 10px;
}
.social-links__modal-link:first-of-type {
	padding-top: 10px;
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
}
.wallet-description-text-wrapper {
	transition: 0.2s;
	border: solid 1px #3b2665;
	padding: 10px 10px 15px 15px;
}
.wallet-description-outer {
	margin-top: 8px;
	max-height: 1px;
	transition: 0.5s;
	overflow: hidden;
}
.wallet-description-outer.active {
	padding-bottom: 40px;
	max-height: 300px;
	margin-top: 20px;
}
.wallet-description-outer.active .wallet-description-text-wrapper {
	border-radius: 8px;
}
.description-toggler {
	width: 29px;
	height: 29px;
	border-radius: 8px;
	background-color: #3b2665;
}
.title {
	transition: 0.4s;
	margin-bottom: 0 !important;
	opacity: 0.6;
}
.description-toggler-image {
	opacity: 0.6;
	transition: 0.4s;
}
.description-toggler-image.active {
	transform: rotate(180deg);
}
.description-header-block {
	cursor: pointer;
}
.description-header-block:hover .title,
.description-header-block .title.active,
.description-header-block:hover .description-toggler-image,
.description-header-block .description-toggler-image.active {
	opacity: 1;
}
</style>
