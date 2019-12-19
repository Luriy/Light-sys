<template>
	<div class="accounts-list_wrapper_tab deposit-page" v-bind:class="{ active: isActive }">
		<div class="accounts-list_wrapper_tab_header" v-on:click="$emit('open')">
			<div class="icon">
				<div class="image"><img src="@/assets/images/wallet2.svg" alt title /></div>
				<p>Deposits</p>
			</div>
			<div class="toggle" :class="{ opened: isActive }"></div>
		</div>

		<div class="accounts-list_wrapper_tab_body deposit">
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
					<div class="title">For a period of</div>
					<div class="range-slider">
						<div class="value">
							{{ sliderValue }} month{{ Number(sliderValue > 1) ? 's' : '&nbsp;' }}
						</div>
						<range-slider class="slider" min="1" max="24" step="1" v-model="sliderValue">
						</range-slider>
					</div>
				</div>
				<div class="row">
					<div class="title">
						Select an account to deposit
					</div>
				</div>
				<div class="table full-width">
					<div class="table-item">
						<div class="table-item__text">Add to deposit amount</div>
					</div>
					<div class="table-item">
						<div class="table-item__text">Add to deposit amount</div>
					</div>
					<div class="table-item">
						<div class="table-item__text">Monthly transfer to the card</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import RangeSlider from 'vue-range-slider';
import 'vue-range-slider/dist/vue-range-slider.css';

export default {
	props: ['isActive'],
	components: {
		RangeSlider,
	},
	data() {
		return {
			sliderValue: 12,
		};
	},
};
</script>
