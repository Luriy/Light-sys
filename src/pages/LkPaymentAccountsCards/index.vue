<template>
	<lk-layout>
		<div class="accounts-list">
			<div class="title">
				<p>Accounts and Cards</p>
				<router-link to="/wallets"
					><div class="close"><img src="@/assets/images/path.svg" alt title /></div
				></router-link>
			</div>
			<div class="accounts-list_wrapper">
				<div class="accounts-list_wrapper_title">
					Accounts and Cards
				</div>
				<div class="accounts-list_wrapper_tabs">
					<div class="accounts-list_wrapper_tab" v-bind:class="{ active: tabs[0].isActive }">
						<div class="accounts-list_wrapper_tab_header" v-on:click="handleOpenTab(tabs[0], tabs)">
							<div class="icon">
								<div class="image"><img src="@/assets/images/wallet.svg" alt title /></div>
								<p>Open an account</p>
							</div>
							<div class="toggle"></div>
						</div>

						<div class="accounts-list_wrapper_tab_body">
							<div class="accounts-list_wrapper_tab_body_title">
								In what currency do I open an account?
							</div>
							<div class="accounts-list_wrapper_tab_body_table">
								<div
									class="accounts-list_wrapper_tab_body_table_tr"
									v-for="item in tabs[1].tableData"
									:key="item.full"
								>
									<div class="currency">
										<div class="icon">{{ item.code }}</div>
										<div class="text">{{ item.full }}</div>
									</div>
									<div class="right">
										<button v-if="item.isActive">Apply</button>
										<div class="checkbox" v-bind:class="{ active: item.isActive }"></div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div class="accounts-list_wrapper_tab" v-bind:class="{ active: tabs[1].isActive }">
						<div class="accounts-list_wrapper_tab_header" v-on:click="handleOpenTab(tabs[1], tabs)">
							<div class="icon">
								<div class="image"><img src="@/assets/images/credit-card2.svg" alt title /></div>
								<p>Open a card</p>
							</div>
							<div class="flex align-items-center">
								<transition name="fade-medium">
									<div
										class="button-wrapper button-gradient"
										v-show="tabs[1].isActive && isEditing"
										@click="handleCancel"
									>
										<button class="add-cart-action-button cancel no-margin">
											Cancel
										</button>
									</div>
								</transition>
								<transition name="fade-medium">
									<div
										class="button-wrapper button-gradient"
										v-show="tabs[1].isActive && isEditing"
										@click="handleApply"
									>
										<button class="add-cart-action-button apply button-gradient">
											Apply
										</button>
									</div>
								</transition>
								<transition name="fade-medium">
									<div
										class="button-wrapper button-gradient"
										@click="handleEdit"
										v-show="tabs[1].isActive && !isEditing"
									>
										<button class="add-cart-action-button cancel">
											Edit
										</button>
									</div>
								</transition>

								<div class="toggle"></div>
							</div>
						</div>

						<div class="accounts-list_wrapper_tab_body ">
							<div class=" accounts-list_wrapper_tab_body_title">
								What type of card do you want to open?
							</div>

							<div class="accounts-list_wrapper_tab_body_table cards">
								<div
									class="accounts-list_wrapper_tab_body_table_tr"
									v-for="item in tabs[1].currencies"
									:key="item.full"
								>
									<div
										class="accounts-list_wrapper_tab full-width"
										v-bind:class="{ active: item.isActive }"
									>
										<div
											class="accounts-list_wrapper_tab_header flex align-items-center justify-content-between"
											@click="handleOpenTab(item, tabs[1].currencies)"
										>
											<div class="flex align-items-center">
												<div class="currency">
													<div class="icon">{{ item.code }}</div>
													<div class="text">{{ item.fullName }}</div>
												</div>
												<div class="banks">
													<div class="image-plate" v-for="bank in item.banks" :key="bank.image">
														<!-- <img :src="bank.image" /> -->1
													</div>
												</div>
											</div>
											<div class="toggle"></div>
										</div>
										<div class="accounts-list_wrapper_tab_body">
											<cards-list
												:currency="item.currency"
												@onDeleteCard="writeSoonDeleteCardToStore"
												:isEditing="isEditing"
											></cards-list>
										</div>
									</div>
								</div>
							</div>
							<add-new-card></add-new-card>
						</div>
					</div>
					<deposit :isActive="tabs[2].isActive" @open="handleOpenTab(tabs[2], tabs)"></deposit>
				</div>
			</div>
		</div>
	</lk-layout>
</template>

<script>
import LkLayout from '@/layout/LkLayout';
// import currencies from '@/data/account_and_cards/currencies';
import './styles.scss';
import AddNewCard from './components/AddNewCard';
import Deposit from './components/Deposit';
import CardsList from './components/CardsList';
import { mapGetters } from 'vuex';
import getCurrencyInfo from '@/functions/getCurrencyInfo';

export default {
	name: 'LkPaymentWalletsWalletsList',
	components: {
		LkLayout,
		AddNewCard,
		Deposit,
		CardsList,
	},
	mounted() {
		this.$store.dispatch('common/GET_ALL_CURRENCIES').then(
			(data) =>
				(this.tabs[1].currencies = data.map((currency) => {
					const { fullName, code } = getCurrencyInfo(currency);
					return {
						currency,
						fullName,
						code,
						banks: this.banks.filter(({ valute }) => valute === currency),
						isActive: false,
					};
				})),
		);
		this.$store.dispatch('common/GET_BANKS');
	},
	computed: {
		...mapGetters({
			currencies: 'common/CURRENCIES',
			banks: 'common/BANKS',
		}),
	},
	data() {
		return {
			isEditing: false,
			freezeActive: false,
			deletingCards: [],
			editingsCards: [],
			tabs: [
				{
					isActive: false,
					tableData: [
						{
							code: '₽',
							full: 'Russian Ruble',
							isActive: false,
						},
						{
							code: '円',
							full: 'Japanese yen',
							banks: [],
							isActive: false,
						},
						{
							code: '$',
							full: 'U.S. dollar',
							banks: [],
							isActive: false,
						},
						{
							code: '€',
							full: 'European Euro',
							banks: [],
							isActive: false,
						},
					],
				},
				{
					isActive: true,
					isCardsListActive: false,
					currencies: [],
					isEditing: false,
				},
				{
					isActive: false,
				},
			],
		};
	},
	methods: {
		handleOpenTab(currentTab, tabs) {
			if (!this.freezeActive) {
				if (this.tabs.indexOf(currentTab) === 1 && currentTab.isActive === true) {
					this.isEditing = false;
				}

				const isCurrentTabActive = currentTab.isActive;
				tabs.forEach((tab) => (tab.isActive = false));
				currentTab.isActive = !isCurrentTabActive;
			}
		},
		handleEdit() {
			this.freezeActive = true;
			setTimeout(() => (this.freezeActive = false), 200);

			this.isEditing = true;
		},
		handleCancel() {
			this.freezeActive = true;
			setTimeout(() => (this.freezeActive = false), 200);

			this.deletingCards = [];
			this.editingCards = [];

			this.isEditing = false;
		},
		writeSoonDeleteCardToStore(cardNumber) {
			this.deletingCards.push(cardNumber);
		},
		handleApply() {
			console.log(this.deletingCards);
			this.deletingCards.forEach((card) =>
				this.$store
					.dispatch('card/DELETE_CARD', { NumberCard: card })
					.then(() => this.handleCancel()),
			);
		},
	},
};
</script>
