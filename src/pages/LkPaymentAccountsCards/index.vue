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
						<div class="accounts-list_wrapper_tab_header" v-on:click="handleOpenTab(tabs[0])">
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
									v-on:click="setActive(item)"
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
						<div class="accounts-list_wrapper_tab_header" v-on:click="handleOpenTab(tabs[1])">
							<div class="icon">
								<div class="image"><img src="@/assets/images/credit-card2.svg" alt title /></div>
								<p>Open a card</p>
							</div>
							<div class="flex align-items-center">
								<transition name="fade">
									<div
										class="button-wrapper button-gradient"
										@click="handleEdit"
										v-show="tabs[1].isActive"
									>
										<button class="add-cart-action-button cancel">
											Edit
										</button>
									</div>
								</transition>

								<div class="toggle"></div>
							</div>
						</div>

						<div class="accounts-list_wrapper_tab_body">
							<div class=" accounts-list_wrapper_tab_body_title">
								What type of card do you want to open?
							</div>

							<div class="accounts-list_wrapper_tab_body_table">
								<div
									class="accounts-list_wrapper_tab_body_table_tr"
									v-on:click="setActive(item)"
									v-for="item in tabs[1].tableData"
									:key="item.full"
								>
									<div
										class="accounts-list_wrapper_tab full-width"
										v-bind:class="{ active: tabs[1].isActive }"
									>
										<div
											class="accounts-list_wrapper_tab_header flex align-items-center justify-content-between"
										>
											<div class="flex align-items-center">
												<div class="currency">
													<div class="icon">{{ item.code }}</div>
													<div class="text">{{ item.full }}</div>
												</div>
												<div class="banks">
													<div class="image-plate" v-for="bank in item.banks" :key="bank.image">
														<img :src="bank.image" />
													</div>
												</div>
											</div>
											<div class="toggle"></div>
										</div>
									</div>
									<!-- <div class="right">
 									<div class="type" v-if="item.isActive">
 										<div class="checkbox-type" v-on:click="item.type = 1" v-bind:class="{active: item.type == 1}">
 											<div></div>
 											<span>Physical</span>
 										</div>
 										<div class="checkbox-type" v-on:click="item.type = 2" v-bind:class="{active: item.type == 2}">
 											<div></div>
 											<span>Virtual</span>
 										</div>
 									</div>
 									<div class="checkbox" v-bind:class="{active: item.isActive}"></div>	 									
 								</div> -->
								</div>
							</div>
							<add-new-card></add-new-card>
						</div>
					</div>
					<deposit :isActive="tabs[2].isActive" @open="handleOpenTab(tabs[2])"></deposit>
				</div>
			</div>
		</div>
		<cards-list></cards-list>
	</lk-layout>
</template>

<script>
import LkLayout from '@/layout/LkLayout';
import 'vue-range-slider/dist/vue-range-slider.css';
import currencies from '@/data/account_and_cards/currencies';
import './styles.scss';
import AddNewCard from './components/AddNewCard';
import Deposit from './components/Deposit';
import CardsList from './components/CardsList';

export default {
	name: 'LkPaymentWalletsWalletsList',
	components: {
		LkLayout,
		AddNewCard,
		Deposit,
		CardsList,
	},
	mounted() {
		this.$store.dispatch('common/GET_ALL_CURRENCIES');
	},
	data() {
		return {
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
					tableData: currencies,
					isAddCardActive: true,
				},
				{
					isActive: false,
				},
			],
		};
	},
	methods: {
		setActive: function(tab) {
			a.forEach(function(c) {
				if (c != e) {
					c.isActive = false;
				} else {
					c.isActive = true;
				}
			});
		},

		handleOpenTab(currentTab) {
			const isCurrentTabActive = currentTab.isActive;
			this.tabs.forEach((tab) => (tab.isActive = false));
			currentTab.isActive = !isCurrentTabActive;
		},
		handleEdit() {},
	},
};
</script>
