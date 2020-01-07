<template>
	<step-parent
		:step="1"
		:currentStep="currentStep"
		:steps="steps"
		@onClickBackButton="$emit('onClickBackButton')"
		@onClickNextButton="$emit('onClickNextButton')"
	>
		1
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
