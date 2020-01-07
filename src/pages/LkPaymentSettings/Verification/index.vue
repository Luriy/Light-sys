<template>
	<settings-item-parent :name="'Verification'">
		<first-step
			v-if="currentStep === 1"
			:currentStep="currentStep"
			:steps="steps"
			@onClickBackButton="handleClickBackButton"
			@onClickNextButton="handleClickNextButton"
		></first-step>
		<second-step
			v-if="currentStep === 2"
			:currentStep="currentStep"
			:steps="steps"
			@onClickBackButton="handleClickBackButton"
			@onClickNextButton="handleClickNextButton"
		></second-step>
		<third-step
			v-if="currentStep === 3"
			:currentStep="currentStep"
			:steps="steps"
			@onClickBackButton="handleClickBackButton"
			@onClickNextButton="handleClickNextButton"
		></third-step>
		<fourth-step
			v-if="currentStep === 4"
			:currentStep="currentStep"
			:steps="steps"
			@onClickBackButton="handleClickBackButton"
			@onClickNextButton="handleClickNextButton"
		></fourth-step>
	</settings-item-parent>
</template>
<script>
import SettingsItemParent from '../SettingsItemParent';
import FirstStep from './FirstStep';
import SecondStep from './SecondStep';
import ThirdStep from './ThirdStep';
import FourthStep from './FourthStep';

export default {
	components: {
		SettingsItemParent,
		FirstStep,
		SecondStep,
		ThirdStep,
		FourthStep,
	},
	data() {
		return {
			currentStep: 2,
			steps: ['Basic info', 'Google form', 'Facial Information', 'Adoption'],
		};
	},
	methods: {
		handleClickBackButton() {
			if (this.currentStep !== 1) {
				this.currentStep--;
			}
		},
		handleClickNextButton() {
			if (this.currentStep !== this.steps.length) {
				this.currentStep++;
			}
		},
	},
};
</script>
<style lang="scss" scoped></style>
