<template>
	<div class="accounts-list_wrapper_tab" v-bind:class="{ active: isActive }">
		<div class="accounts-list_wrapper_tab_header" v-on:click="$emit('open')">
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
</template>
<script>
import RangeSlider from 'vue-range-slider';

export default {
	props: ['isActive'],
	components: {
		RangeSlider,
	},
	data() {
		return {
			sliderValue: null,
		};
	},
};
</script>
