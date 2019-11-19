<template>
	<draggable
		v-model="draggableMappedCurrencies"
		v-if="isCardsMovingAndDeleting"
		class="wallets-list_item_body"
	>
		<transition-group name="slide-fade">
			<div
				class="wallet fiat-wallet list__item"
				v-for="(item, idx) in mappedCurrencies"
				:class="{ active: item.isactive }"
				@click="handleClick(item)"
				:key="item.fullName"
			>
				<transition name="fade">
					<div class="btn-remove" v-show="isCardsMovingAndDeleting" @click="handleDeleteItem(idx)">
						<img src="@/assets/images/cross.svg" />
					</div>
				</transition>
				<div class="wallet-info">
					<div class="code">
						<div class="image fiat">{{ item.code }}</div>
						<span>{{ item.fullName }}</span>
					</div>
					<div class="right">
						<div class="balance">
							{{ '22,000' + item.code }}
							<!-- {{ item.balance }} -->
						</div>
						<div class="wallet-toggle"></div>
					</div>
				</div>
				<div class="wallet-last-transactions">
					<div class="wallet-last-transactions-item" v-for="card in item.cards" :key="card.Number">
						<div class="from">
							<div class="image">
								<img :src="getBankImage(card.Psid, 'small')" alt title />
							</div>
							<span>NEO bank</span>
						</div>
						<div class="info">
							<div class="amount">12,500 {{ item.code }}</div>
							<div class="type"><img src="@/assets/images/left-arrow-purple.svg" alt title /></div>
						</div>
					</div>
				</div>
			</div>
		</transition-group>
	</draggable>
	<div class="wallets-list_item_body" v-else>
		<transition-group name="slide-fade">
			<div
				class="wallet fiat-wallet list__item"
				v-for="(item, idx) in mappedCurrencies"
				:class="{ active: item.isactive }"
				@click="handleClick(item)"
				:key="item.fullName"
			>
				<transition name="fade">
					<div class="btn-remove" v-show="isCardsMovingAndDeleting" @click="handleDeleteItem(idx)">
						<img src="@/assets/images/cross.svg" />
					</div>
				</transition>
				<div class="wallet-info">
					<div class="code">
						<div class="image fiat">{{ item.code }}</div>
						<span>{{ item.fullName }}</span>
					</div>
					<div class="right">
						<div class="balance">
							{{ '22,000 ' + item.code }}
						</div>
						<div class="wallet-toggle"></div>
					</div>
				</div>
				<div class="wallet-last-transactions">
					<div class="wallet-last-transactions-item" v-for="card in item.cards" :key="card.Number">
						<div class="from">
							<div class="image">
								<img :src="getBankImage(card.Psid, 'small')" alt title />
							</div>
							<span>NEO bank</span>
						</div>
						<div class="info">
							<div class="amount">12,500 {{ item.code }}</div>
							<div class="type"><img src="@/assets/images/cloud.svg" alt title /></div>
						</div>
					</div>
				</div>
			</div>
		</transition-group>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';
import draggable from 'vuedraggable';
import getCardsByCurrency from '@/functions/getCardsByCurrency';
import getBankImage from '@/functions/getBankImage';
import getCurrencyInfo from '@/functions/getCurrencyInfo';

export default {
	// left-arrow-purple.svg or cloud.svg

	name: 'CardsList',
	props: ['isCardsMovingAndDeleting'],
	components: {
		draggable,
	},
	created() {
		Promise.all([
			this.$store.dispatch('common/GET_BANKS'),
			this.$store.dispatch('card/GET_CARDS'),
			this.$store.dispatch('common/GET_ALL_CURRENCIES'),
		]).then(([banks, cards, currencies]) => {
			const localStorageCurrencies = localStorage.getItem('stateWalletsAndAccountsPageCurrencies');

			this.$store.commit(
				'currency/SET_WALLETS_AND_ACCOUNTS_PAGE_CURRENCIES',
				currencies
					.map((currency) => {
						const { fullName, code } = getCurrencyInfo(currency);
						return {
							currency,
							fullName,
							code,
							isactive: false,
							cards: this.cards.filter(({ Currency }) => Currency === currency),
						};
					})
					.filter(({ cards }) => cards.length !== 0),
			);
		});
	},
	data() {
		return {
			trans: [
				{
					code: 'Japanese yen',
					balance: '87.34円',
					ico: '₴',
					isactive: false,
				},
				{
					code: 'Russian ruble',
					balance: '25494.11₽',
					ico: '₽',
					isactive: false,
				},
				{
					code: 'U.S. dollar',
					balance: ' 1234.70$',
					ico: '$',
					isactive: false,
				},
				{
					code: 'European Euro',
					balance: '301.23€',
					ico: '€',
					isactive: false,
				},
				{
					code: 'Russian ruble',
					balance: '25494.11₽',
					ico: '₽',
					isactive: false,
				},
				{
					code: 'Russian ruble',
					balance: '25494.11₽',
					ico: '₽',
					isactive: false,
				},
			],
		};
	},
	computed: {
		...mapGetters({
			mappedCurrencies: 'currency/WALLETS_AND_ACCOUNTS_PAGE_CURRENCIES',
			banks: 'common/BANKS',
			cards: 'card/CARDS',
			currencies: 'currency/ALL_CURRENCIES',
		}),
		draggableMappedCurrencies: {
			get() {
				return this.mappedCurrencies;
			},
			set(value) {
				return this.$store.commit('currency/SET_WALLETS_AND_ACCOUNTS_PAGE_CURRENCIES', value);
			},
		},
	},
	methods: {
		getBankImage,
		getCardsByCurrency,
		handleDeleteItem(id) {
			console.log(this.accounts);
			console.log(id);
			// this.$store.commit('wallet/DELETE_WALLET', this.wallets.find(wallet => wallet.address === address))
			// this.$store.commit('wallet/SET_WALLETS', this.wallets.filter(wallet => wallet.address !== address))
		},
		handleClick({ fullName, cards }) {
			console.log(cards);
			this.$store.commit(
				'currency/SET_WALLETS_AND_ACCOUNTS_PAGE_CURRENCIES',
				this.mappedCurrencies.map((item) =>
					fullName === item.fullName
						? {
								...item,
								isactive: !item.isactive,
						  }
						: item,
				),
			);
		},
	},
};
</script>
