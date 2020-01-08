<template>
	<div class="flex flex-column step-wrapper">
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
<style lang="scss" scoped>
.step {
	&-wrapper {
		position: relative;
	}
}
</style>
