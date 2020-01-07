<template>
	<step-parent
		:step="3"
		:currentStep="currentStep"
		:steps="steps"
		@onClickBackButton="$emit('onClickBackButton')"
		@onClickNextButton="$emit('onClickNextButton')"
	>
		3
	</step-parent>
</template>
<script>
import StepParent from './StepParent';

export default {
	props: ['currentStep', 'steps'],
	components: {
		StepParent,
	},
};
</script>
<style lang="scss" scoped></style>
