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
						@click="handleCancel"
						v-show="isAccountsChanged && isActive"
					>
						<button class="add-cart-action-button cancel no-margin">
							Cancel
						</button>
					</div>
				</transition>
				<transition name="fade-medium">
					<div
						class="button-wrapper button-gradient"
						@click="handleApply"
						v-show="isAccountsChanged && isActive"
					>
						<button class="add-cart-action-button apply button-gradient">
							Apply
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
						<div class="icon" v-html="getCurrencyInfo(currency).code"></div>
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
			checkboxes: [],
			initialCheckboxes: [],
		};
	},
	mounted() {
		this.checkboxes = this.currencies.map((currency, index) => ({
			isChecked: false,
			isHovered: this.userCurrencies.some((userCurrency) => userCurrency === currency),
			isDisabled: this.userCurrencies.some((userCurrency) => userCurrency === currency),
			id: index,
		}));
		this.initialCheckboxes = this.currencies.map((currency, index) => ({
			isChecked: false,
			isHovered: this.userCurrencies.some((userCurrency) => userCurrency === currency),
			isDisabled: this.userCurrencies.some((userCurrency) => userCurrency === currency),
			id: index,
		}));
	},
	computed: {
		...mapGetters({
			currencies: 'currency/CURRENCIES',
			userCurrencies: 'currency/USER_CURRENCIES',
			groupCurrencies: 'group/GROUP_CURRENCIES',
		}),
		isAccountsChanged() {
			if (this.initialCheckboxes.length && this.checkboxes.length) {
				return !this.initialCheckboxes.every(
					(initialCheckbox, index) =>
						initialCheckbox.isChecked === this.checkboxes[index].isChecked,
				);
			} else return false;
		},
	},
	methods: {
		getCurrencyInfo,
		handleMouseEnterCheckbox(index) {
			if (!this.checkboxes[index].isDisabled) {
				this.checkboxes[index].isHovered = true;
			} else return false;
		},
		handleMouseLeaveCheckbox(index) {
			if (!this.checkboxes[index].isDisabled) {
				this.checkboxes[index].isHovered = false;
			} else return false;
		},
		handleMouseClickCheckbox(index) {
			if (!this.checkboxes[index].isDisabled) {
				this.checkboxes[index].isChecked = !this.checkboxes[index].isChecked;
			} else return false;
		},
		handleCancel() {
			this.$emit('onFreeze');
			this.checkboxes = this.checkboxes.map((item, index) => ({
				...item,
				isChecked: this.initialCheckboxes[index].isChecked,
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
						const otherAccountsGroup = this.groupCurrencies.find(
							({ groupName }) => groupName === 'Other accounts',
						);
						if (otherAccountsGroup) {
							this.$store.dispatch('group/SET_CURRENCIES_TO_GROUP', {
								groupName: 'Other accounts',
								currencies: [
									...otherAccountsGroup.currencies,
									{
										cards: [],
										currency: valute,
										code: getCurrencyInfo(valute).code,
										fullName: getCurrencyInfo(valute).fullName,
									},
								],
							});
						} else {
							this.$store.commit('group/SET_GROUP_CURRENCIES', [
								...this.groupCurrencies,
								{
									groupName: 'Other accounts',
									currencies: [
										{
											cards: [],
											currency: valute,
											code: getCurrencyInfo(valute).code,
											fullName: getCurrencyInfo(valute).fullName,
										},
									],
								},
							]);
						}
					}
				});
			});

			// removing valutes

			// const valutesToRemove = this.checkboxes
			// 	.filter((checkbox) => !checkbox.isChecked)
			// 	.map((checkbox) => this.currencies[checkbox.id])
			// 	.filter((checkbox) =>
			// 		this.userCurrencies.some((userCurrency) => userCurrency === checkbox),
			// 	);

			// valutesToRemove.forEach((valute) => {
			// 	this.$store
			// 		.dispatch('currency/DELETE_USER_CURRENCY', { ValuteName: valute })
			// 		.then((data) => {
			// 			if (data.success) {
			// 				this.$store.commit(
			// 					'currency/SET_USER_CURRENCIES',
			// 					this.userCurrencies.filter((userCurrency) => userCurrency !== valute),
			// 				);
			// 				this.$store.commit(
			// 					'group/SET_GROUP_CURRENCIES',
			// 					this.groupCurrencies
			// 						.map((group) => ({
			// 							...group,
			// 							currencies: group.currencies.filter(({ currency }) => currency !== valute),
			// 						}))
			// 						.filter((group) => group.currencies.length !== 0),
			// 				);
			// 				this.isEditing = false;
			// 			}
			// 		});
			// });
		},
	},
	watch: {
		userCurrencies() {
			this.checkboxes = this.currencies.map((currency, index) => ({
				isChecked: false,
				isHovered: this.userCurrencies.some((userCurrency) => userCurrency === currency),
				isDisabled: this.userCurrencies.some((userCurrency) => userCurrency === currency),
				id: index,
			}));
			this.initialCheckboxes = this.currencies.map((currency, index) => ({
				isChecked: false,
				isHovered: this.userCurrencies.some((userCurrency) => userCurrency === currency),
				isDisabled: this.userCurrencies.some((userCurrency) => userCurrency === currency),
				id: index,
			}));
		},
	},
};
</script>
<style></style>
