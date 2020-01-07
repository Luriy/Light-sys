<template>
	<div class="flex flex-column">
		<span class="step-number">Step {{ step }}</span>
		<slot></slot>
		<steps-controller
			:currentStep="currentStep"
			:steps="steps"
			@onClickBackButton="$emit('onClickBackButton')"
			@onClickNextButton="$emit('onClickNextButton')"
		></steps-controller>
	</div>
</template>
<script>
import StepsController from './StepsController';
export default {
	props: ['step', 'currentStep', 'steps'],
	components: {
		StepsController,
	},
};
</script>
<style lang="scss">
.step-number {
	font-size: 24px;
	font-weight: 600;
	color: #fff;
}
</style>
