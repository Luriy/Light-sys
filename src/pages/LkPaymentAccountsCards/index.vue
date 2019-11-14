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
							<div class="toggle"></div>
						</div>

						<div class="accounts-list_wrapper_tab_body">
							<div class="accounts-list_wrapper_tab_body_title">
								What type of card do you want to open?
							</div>
							<div class="accounts-list_wrapper_tab_body_table">
								<div
									class="accounts-list_wrapper_tab_body_table_tr"
									v-on:click="setActive(item)"
									v-for="item in tabs[1].tableData"
									:key="item.full"
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
							<div
								class="accounts-list_wrapper_tab add-new-card-header"
								v-bind:class="{ active: tabs[1].isAddCardActive }"
							>
								<div
									class="accounts-list_wrapper_tab_header d-flex justify-content-between"
									v-on:click="tabs[1].isAddCardActive = !tabs[1].isAddCardActive"
								>
									<div class="icon">
										<div class="image"><img src="@/assets/images/wallet2.svg" alt title /></div>
										<p>Add New Card</p>
									</div>
									<transition name="fade">
										<div class="flex" v-show="tabs[1].isAddCardActive">
											<div class="button-wrapper button-gradient">
												<button class="add-cart-action-button cancel">Cancel</button>
											</div>
											<button class="add-cart-action-button apply button-gradient">Apply</button>
										</div>
									</transition>
								</div>
								<div class="accounts-list_wrapper_tab_body">
									<div class="flex align-items-center justify-content-between">
										<div class="left-side-container">
											<form class="add-card-form">
												<div class="add-card-form__inputs-block">
													<div class="flex flex-column">
														<input
															type="text"
															class="add-card-form__input"
															placeholder="Card number"
															v-model="cardInfo.number"
														/>
														<div class="add-card-form__line"></div>
													</div>
													<div class="flex flex-column">
														<input
															type="text"
															class="add-card-form__input"
															placeholder="MM/YY"
															maxlength="5"
															v-model="cardInfo.date"
														/>
														<div class="add-card-form__line"></div>
													</div>
													<div class="flex flex-column">
														<input
															type="text"
															class="add-card-form__input"
															placeholder="Name of card"
															v-model="cardInfo.name"
														/>
														<div class="add-card-form__line"></div>
													</div>
													<div class="flex flex-column">
														<input
															type="text"
															pattern="[0-9]"
															class="add-card-form__input"
															placeholder="CVV"
															maxlength="3"
															v-model="cardInfo.cvv"
														/>
														<div class="add-card-form__line"></div>
													</div>
												</div>
											</form>
											<div class="select">
												<div
													class="select__header accounts-list_wrapper_tab_header flex justify-content-between align-items-center"
												>
													<div class="flex align-items-center">
														<div class="image-container"></div>
														<div class="select__title">Choose your bank</div>
													</div>
													<div class="toggle"></div>
												</div>
											</div>
										</div>
										<div class="virtual-card">
											<div class="flex justify-content-between align-items-center">
												<img src="@/assets/images/tinkoff-bank-bigger.png" alt />
												<p class="virtual-card__currency">EUR</p>
											</div>
											<div class="flex flex-column">
												<div class="flex justify-content-between virtual-card__number-and-date">
													<p class="virtual-card__paragraph">{{ cardInfo.number }}</p>
													<p class="virtual-card__paragraph">{{ cardInfo.date }}</p>
												</div>
												<div class="flex justify-content-between">
													<p class="virtual-card__paragraph">{{ cardInfo.name }}</p>
													<img src="@/assets/images/mastercard.png" alt="mastercard" />
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div class="accounts-list_wrapper_tab" v-bind:class="{ active: tabs[2].isActive }">
						<div class="accounts-list_wrapper_tab_header" v-on:click="handleOpenTab(tabs[2])">
							<div class="icon">
								<div class="image"><img src="@/assets/images/wallet2.svg" alt title /></div>
								<p>Deposits</p>
							</div>
							<div class="toggle"></div>
						</div>

						<div class="accounts-list_wrapper_tab_body">
							<div class="accounts-list_wrapper_tab_body_title">
								Deposit Options
							</div>
							<div class="accounts-list_wrapper_tab_body_deposit">
								<div class="column">
									<div class="title">Choose currency</div>
									<div class="choose-input">
										<div class="text">Choose currency</div>
									</div>
								</div>
								<div class="column">
									<div class="title">For a period</div>
									<div class="range-slider">
										<div class="value">{{ sliderValue }} mounth</div>
										<range-slider class="slider" min="1" max="24" step="1" v-model="sliderValue">
										</range-slider>
									</div>
								</div>
								<div class="row">
									<div class="title">
										Select an account
									</div>
									<div class="choose-input">
										<div class="text">Choose</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</lk-layout>
</template>

<script>
import LkLayout from '@/layout/LkLayout';
import RangeSlider from 'vue-range-slider';
import 'vue-range-slider/dist/vue-range-slider.css';
import currencies from '@/data/account_and_cards/currencies';
import './styles.scss';
import { API_URL } from '@/constants';
import Axios from 'axios';
import { parsePythonDataObject } from '@/functions/helpers';

export default {
	name: 'LkPaymentWalletsWalletsList',
	components: {
		LkLayout,
		RangeSlider,
	},
	mounted() {
		// Axios({
		// 	url: API_URL,
		// 	method: 'POST',
		// 	params: {
		// 		Comand: 'FiatPsid',
		// 	},
		// }).then((data) => console.log(parsePythonDataObject(data)));
	},
	data() {
		return {
			sliderValue: null,
			cardInfo: {
				number: null,
				date: null,
				name: null,
				cvv: null,
			},
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
	},
};
</script>
