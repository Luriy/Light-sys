<template>
	<step-parent
		:step="4"
		:currentStep="currentStep"
		:steps="steps"
		@onClickBackButton="$emit('onClickBackButton')"
		@onClickNextButton="$emit('onClickNextButton')"
	>
		4
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
