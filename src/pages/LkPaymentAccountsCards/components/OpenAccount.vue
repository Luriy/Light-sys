<template>
	<div class="accounts-list_wrapper_tab" v-bind:class="{ active: isActive }">
		<div class="accounts-list_wrapper_tab_header" v-on:click="$emit('onOpenTab')">
			<div class="icon">
				<div class="image"><img src="@/assets/images/wallet.svg" alt title /></div>
				<p>Open an account</p>
			</div>
			<div class="flex align-items-center">
				<transition name="fade-medium">
					<div
						class="button-wrapper button-gradient"
						v-show="isActive && isEditing"
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
						v-show="isActive && isEditing"
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
						v-show="isActive && !isEditing"
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
			<div class="accounts-list_wrapper_tab_body_title">
				In what currency do I open an account?
			</div>
			<div class="accounts-list_wrapper_tab_body_table">
				<div
					class="accounts-list_wrapper_tab_body_table_tr"
					v-for="(currency, index) in currencies"
					:key="currency"
				>
					<div class="currency">
						<div class="icon">{{ getCurrencyInfo(currency).code }}</div>
						<div class="text">{{ getCurrencyInfo(currency).fullName }}</div>
					</div>
					<!-- <div class="right">
					<button v-if="item.isActive">Apply</button>
					<div class="checkbox" v-bind:class="{ active: item.isActive }"></div>
				</div> -->
					<checkbox
						v-if="checkboxes.length"
						@onMouseEnter="handleMouseEnterCheckbox(index)"
						@onMouseLeave="handleMouseLeaveCheckbox(index)"
						@onClick="handleMouseClickCheckbox(index)"
						:isDisabled="checkboxes[index].isHovered"
						:isActive="checkboxes[index].isChecked"
					></checkbox>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import Checkbox from '@/elements/Checkbox';
import { mapGetters } from 'vuex';
import getCurrencyInfo from '@/functions/getCurrencyInfo';

export default {
	props: ['isActive'],
	components: {
		Checkbox,
	},
	data() {
		return {
			isEditing: false,
		};
	},
	created() {
		this.$store.dispatch('currency/GET_ALL_CURRENCIES');
		this.$store.dispatch('currency/GET_USER_CURRENCIES');
	},
	computed: {
		...mapGetters({
			currencies: 'currency/CURRENCIES',
			userCurrencies: 'currency/USER_CURRENCIES',
			walletsAndAccountsPageCurrencies: 'currency/WALLETS_AND_ACCOUNTS_PAGE_CURRENCIES',
		}),
		checkboxes: {
			get() {
				return this.currencies.map((currency, index) => ({
					isChecked: false,
					isHovered: this.userCurrencies.some((userCurrency) => userCurrency === currency),
					id: index,
				}));
			},
			set() {
				this.checkboxes = value;
			},
		},
		initialCheckboxes: {
			get() {
				return this.currencies.map((currency, index) => ({
					isChecked: false,
					isHovered: this.userCurrencies.some((userCurrency) => userCurrency === currency),
					id: index,
				}));
			},
			set(value) {
				this.initialCheckboxes = value;
			},
		},
	},
	methods: {
		getCurrencyInfo,
		handleMouseEnterCheckbox(index) {
			if (this.isEditing) {
				this.checkboxes[index].isHovered = true;
			} else return false;
		},
		handleMouseLeaveCheckbox(index) {
			if (this.isEditing) {
				this.checkboxes[index].isHovered = false;
			} else return false;
		},
		handleMouseClickCheckbox(index) {
			if (this.isEditing) {
				this.checkboxes[index].isChecked = !this.checkboxes[index].isChecked;
			} else return false;
		},
		handleCancel() {
			this.$emit('onFreeze');
			this.checkboxes = this.initialCheckboxes;
			this.isEditing = false;
		},
		handleEdit() {
			this.$emit('onFreeze');
			this.isEditing = true;
			this.checkboxes = this.checkboxes.map((checkbox) => ({
				isChecked: checkbox.isHovered,
				isHovered: false,
				id: checkbox.id,
			}));
		},
		handleApply() {
			this.$emit('onFreeze');

			const valutesToAdd = this.checkboxes
				.filter((checkbox) => checkbox.isChecked)
				.map((checkbox) => this.currencies[checkbox.id])
				.filter((checkbox) =>
					this.userCurrencies.every((userCurrency) => userCurrency !== checkbox),
				);

			valutesToAdd.forEach((valute) => {
				this.$store.dispatch('currency/ADD_USER_CURRENCY', { ValuteName: valute }).then((data) => {
					if (data.success) {
						this.$store.commit('currency/SET_USER_CURRENCIES', [valute, ...this.userCurrencies]);
						if (this.walletsAndAccountsPageCurrencies.length) {
							this.$store.commit('currency/SET_WALLETS_AND_ACCOUNTS_PAGE_CURRENCIES', [
								...this.walletsAndAccountsPageCurrencies,
								{
									cards: [],
									currency: valute,
									code: getCurrencyInfo(valute).code,
									fullName: getCurrencyInfo(valute).fullName,
								},
							]);
						}

						this.isEditing = false;
					}
				});
			});

			const valutesToRemove = this.checkboxes
				.filter((checkbox) => !checkbox.isChecked)
				.map((checkbox) => this.currencies[checkbox.id])
				.filter((checkbox) =>
					this.userCurrencies.some((userCurrency) => userCurrency === checkbox),
				);

			valutesToRemove.forEach((valute) => {
				this.$store
					.dispatch('currency/DELETE_USER_CURRENCY', { ValuteName: valute })
					.then((data) => {
						if (data.success) {
							this.$store.commit(
								'currency/SET_USER_CURRENCIES',
								this.userCurrencies.filter((userCurrency) => userCurrency !== valute),
							);
							this.$store.commit(
								'currency/SET_WALLETS_AND_ACCOUNTS_PAGE_CURRENCIES',
								this.walletsAndAccountsPageCurrencies.filter(({ currency }) => currency !== valute),
							);
							this.isEditing = false;
						}
					});
			});

			// console.log('valutesToAdd', valutesToAdd, 'valutesToRemove', valutesToRemove);
		},
	},
};
</script>
<style></style>
